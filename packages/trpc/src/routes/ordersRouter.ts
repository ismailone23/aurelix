import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../trpc";
import { z } from "zod";
import { db, products, orders, orderItems } from "@workspace/db";
import { eq, desc, inArray, sql, gte, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Email functions will be called from the server, not directly from trpc
// We export order details for the server to use

export const ordersRouter = router({
  list: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ input }) => {
      const ordersList = await db
        .select()
        .from(orders)
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(orders.createdAt));

      // Get order items for each order
      const ordersWithItems = await Promise.all(
        ordersList.map(async (order) => {
          const items = await db
            .select({
              id: orderItems.id,
              productId: orderItems.productId,
              quantity: orderItems.quantity,
              price: orderItems.price,
              variant: orderItems.variant,
              productName: products.name,
            })
            .from(orderItems)
            .leftJoin(products, eq(orderItems.productId, products.id))
            .where(eq(orderItems.orderId, order.id));

          return { ...order, items };
        }),
      );

      return ordersWithItems;
    }),

  getById: adminProcedure.input(z.number()).query(async ({ input }) => {
    const [order] = await db.select().from(orders).where(eq(orders.id, input));

    if (!order) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
    }

    const items = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        variant: orderItems.variant,
        productName: products.name,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));

    return { ...order, items };
  }),

  updateStatus: adminProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum([
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ]),
      }),
    )
    .mutation(async ({ input }) => {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.orderId));

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }

      // If changing to cancelled and not already cancelled, restore stock
      if (input.status === "cancelled" && order.status !== "cancelled") {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        for (const item of items) {
          if (item.productId) {
            const [product] = await db
              .select()
              .from(products)
              .where(eq(products.id, item.productId));

            if (product) {
              if (item.variant && product.variants) {
                // Restore variant stock
                const variants = product.variants as {
                  size: string;
                  price: number;
                  costPrice?: number;
                  stock: number;
                }[];
                const updatedVariants = variants.map((v) =>
                  v.size === item.variant
                    ? { ...v, stock: v.stock + item.quantity }
                    : v,
                );
                await db
                  .update(products)
                  .set({ variants: updatedVariants })
                  .where(eq(products.id, item.productId));
              } else {
                // Restore general stock
                await db
                  .update(products)
                  .set({ stock: sql`${products.stock} + ${item.quantity}` })
                  .where(eq(products.id, item.productId));
              }
            }
          }
        }
      }

      const [updatedOrder] = await db
        .update(orders)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, input.orderId))
        .returning();

      // Return order details for email sending (server will handle email)
      return {
        ...updatedOrder,
        previousStatus: order.status,
        shouldSendEmail: order.customerEmail ? true : false,
      };
    }),

  // Delete order (should be cancelled first - no email sent)
  delete: adminProcedure
    .input(z.number())
    .mutation(async ({ input: orderId }) => {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId));

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }

      // Delete order items first (foreign key constraint)
      await db.delete(orderItems).where(eq(orderItems.orderId, orderId));

      // Delete the order
      await db.delete(orders).where(eq(orders.id, orderId));

      return { success: true, deletedOrderId: orderId };
    }),

  myOrders: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.userId!))
      .orderBy(desc(orders.createdAt));
  }),

  // Guest checkout - no login required
  create: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number().int().positive(),
            variant: z.string().optional(), // e.g., "10ml", "13ml"
          }),
        ),
        customerName: z.string().min(1, "Name is required"),
        customerEmail: z.string().email("Valid email is required"),
        customerPhone: z.string().min(10, "Valid phone is required"),
        shippingAddress: z.string().min(1, "Address is required"),
        shippingCity: z.string().min(1, "City is required"),
        shippingPostalCode: z.string().min(1, "Postal code is required"),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      let total = 0;
      const productIds = input.items.map((item) => item.productId);

      // Fetch all products at once using inArray
      const productsList = await db
        .select()
        .from(products)
        .where(inArray(products.id, productIds));

      const orderItemsData: {
        productId: number;
        quantity: number;
        price: number;
        variant: string | null;
        productName: string;
      }[] = [];

      // Validate stock and calculate total
      for (const item of input.items) {
        const product = productsList.find((p) => p.id === item.productId);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Product ${item.productId} not found`,
          });
        }

        let itemPrice = product.price;

        // Check if variant is specified and product has variants
        if (item.variant && product.variants) {
          const variants = product.variants as {
            size: string;
            price: number;
            stock: number;
          }[];
          const selectedVariant = variants.find((v) => v.size === item.variant);
          if (selectedVariant) {
            itemPrice = selectedVariant.price;
            // Check variant stock
            if (selectedVariant.stock < item.quantity) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Not enough stock for ${product.name} (${item.variant}). Available: ${selectedVariant.stock}`,
              });
            }
          }
        } else {
          // Check general stock
          if (product.stock < item.quantity) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
            });
          }
        }

        total += itemPrice * item.quantity;
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: itemPrice,
          variant: item.variant || null,
          productName: product.name,
        });
      }

      // Create order with customer details
      const [order] = await db
        .insert(orders)
        .values({
          userId: null, // Guest order - no user
          total,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          shippingAddress: input.shippingAddress,
          shippingCity: input.shippingCity,
          shippingPostalCode: input.shippingPostalCode,
          notes: input.notes || null,
        })
        .returning();

      if (!order) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create order",
        });
      }

      // Create order items and update stock
      for (const itemData of orderItemsData) {
        const item = input.items.find(
          (i) =>
            i.productId === itemData.productId &&
            i.variant === itemData.variant,
        );
        if (!item) continue;

        // Insert order item
        await db.insert(orderItems).values({
          orderId: order.id,
          productId: itemData.productId,
          quantity: itemData.quantity,
          price: itemData.price,
          variant: itemData.variant,
        });

        // Update stock
        const product = productsList.find((p) => p.id === itemData.productId);
        if (product) {
          if (item.variant && product.variants) {
            // Update variant stock
            const variants = product.variants as {
              size: string;
              price: number;
              stock: number;
            }[];
            const updatedVariants = variants.map((v) =>
              v.size === item.variant
                ? { ...v, stock: v.stock - item.quantity }
                : v,
            );
            await db
              .update(products)
              .set({ variants: updatedVariants })
              .where(eq(products.id, itemData.productId));
          } else {
            // Update general stock
            await db
              .update(products)
              .set({ stock: sql`${products.stock} - ${item.quantity}` })
              .where(eq(products.id, itemData.productId));
          }
        }
      }

      // Return order with items for email sending
      return {
        ...order,
        items: orderItemsData.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant,
        })),
      };
    }),

  // Admin create order (for Facebook/manual orders)
  adminCreate: adminProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number().int().positive(),
            variant: z.string().optional(),
          }),
        ),
        customerName: z.string().min(1, "Name is required"),
        customerEmail: z.string().email().optional(),
        customerPhone: z.string().min(10, "Valid phone is required"),
        shippingAddress: z.string().min(1, "Address is required"),
        shippingCity: z.string().min(1, "City is required"),
        shippingPostalCode: z.string().optional(),
        notes: z.string().optional(),
        source: z.enum(["website", "facebook", "manual"]).default("manual"),
      }),
    )
    .mutation(async ({ input }) => {
      let total = 0;
      const productIds = input.items.map((item) => item.productId);

      const productsList = await db
        .select()
        .from(products)
        .where(inArray(products.id, productIds));

      const orderItemsData: {
        productId: number;
        quantity: number;
        price: number;
        variant: string | null;
        productName: string;
      }[] = [];

      for (const item of input.items) {
        const product = productsList.find((p) => p.id === item.productId);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Product ${item.productId} not found`,
          });
        }

        let itemPrice = product.price;

        if (item.variant && product.variants) {
          const variants = product.variants as {
            size: string;
            price: number;
            costPrice?: number;
            stock: number;
          }[];
          const selectedVariant = variants.find((v) => v.size === item.variant);
          if (selectedVariant) {
            itemPrice = selectedVariant.price;
            if (selectedVariant.stock < item.quantity) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Not enough stock for ${product.name} (${item.variant}). Available: ${selectedVariant.stock}`,
              });
            }
          }
        } else {
          if (product.stock < item.quantity) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
            });
          }
        }

        total += itemPrice * item.quantity;
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: itemPrice,
          variant: item.variant || null,
          productName: product.name,
        });
      }

      const [order] = await db
        .insert(orders)
        .values({
          userId: null,
          total,
          source: input.source,
          customerName: input.customerName,
          customerEmail: input.customerEmail || null,
          customerPhone: input.customerPhone,
          shippingAddress: input.shippingAddress,
          shippingCity: input.shippingCity,
          shippingPostalCode: input.shippingPostalCode || null,
          notes: input.notes || null,
        })
        .returning();

      if (!order) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create order",
        });
      }

      // Create order items and update stock
      for (const itemData of orderItemsData) {
        const item = input.items.find(
          (i) =>
            i.productId === itemData.productId &&
            i.variant === itemData.variant,
        );
        if (!item) continue;

        await db.insert(orderItems).values({
          orderId: order.id,
          productId: itemData.productId,
          quantity: itemData.quantity,
          price: itemData.price,
          variant: itemData.variant,
        });

        const product = productsList.find((p) => p.id === itemData.productId);
        if (product) {
          if (item.variant && product.variants) {
            const variants = product.variants as {
              size: string;
              price: number;
              costPrice?: number;
              stock: number;
            }[];
            const updatedVariants = variants.map((v) =>
              v.size === item.variant
                ? { ...v, stock: v.stock - item.quantity }
                : v,
            );
            await db
              .update(products)
              .set({ variants: updatedVariants })
              .where(eq(products.id, itemData.productId));
          } else {
            await db
              .update(products)
              .set({ stock: sql`${products.stock} - ${item.quantity}` })
              .where(eq(products.id, itemData.productId));
          }
        }
      }

      return { ...order, items: orderItemsData };
    }),

  // Dashboard statistics
  dashboardStats: adminProcedure.query(async () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Get all orders
    const allOrders = await db.select().from(orders);

    // Calculate stats
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    const weeklyOrders = allOrders.filter(
      (o) => new Date(o.createdAt) >= startOfWeek,
    );
    const weeklyRevenue = weeklyOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    const monthlyOrders = allOrders.filter(
      (o) => new Date(o.createdAt) >= startOfMonth,
    );
    const monthlyRevenue = monthlyOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    const yearlyOrders = allOrders.filter(
      (o) => new Date(o.createdAt) >= startOfYear,
    );
    const yearlyRevenue = yearlyOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    // Orders by source
    const websiteOrders = allOrders.filter(
      (o) => o.source === "website" || !o.source,
    ).length;
    const facebookOrders = allOrders.filter(
      (o) => o.source === "facebook",
    ).length;
    const manualOrders = allOrders.filter((o) => o.source === "manual").length;

    // Revenue by source
    const websiteRevenue = allOrders
      .filter(
        (o) =>
          (o.source === "website" || !o.source) && o.status !== "cancelled",
      )
      .reduce((sum, o) => sum + o.total, 0);
    const facebookRevenue = allOrders
      .filter((o) => o.source === "facebook" && o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    const manualRevenue = allOrders
      .filter((o) => o.source === "manual" && o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    // Orders by status
    const pendingOrders = allOrders.filter(
      (o) => o.status === "pending",
    ).length;
    const deliveredOrders = allOrders.filter(
      (o) => o.status === "delivered",
    ).length;
    const cancelledOrders = allOrders.filter(
      (o) => o.status === "cancelled",
    ).length;

    // Monthly data for charts (last 12 months)
    const monthlyData: {
      month: string;
      revenue: number;
      orders: number;
      websiteRevenue: number;
      facebookRevenue: number;
    }[] = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthOrders = allOrders.filter((o) => {
        const date = new Date(o.createdAt);
        return date >= monthStart && date <= monthEnd;
      });
      const monthName = monthStart.toLocaleString("default", {
        month: "short",
      });
      monthlyData.push({
        month: monthName,
        revenue: monthOrders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + o.total, 0),
        orders: monthOrders.length,
        websiteRevenue: monthOrders
          .filter(
            (o) =>
              (o.source === "website" || !o.source) && o.status !== "cancelled",
          )
          .reduce((sum, o) => sum + o.total, 0),
        facebookRevenue: monthOrders
          .filter((o) => o.source === "facebook" && o.status !== "cancelled")
          .reduce((sum, o) => sum + o.total, 0),
      });
    }

    // Weekly data (last 7 days)
    const weeklyData: { day: string; revenue: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      const dayOrders = allOrders.filter((o) => {
        const date = new Date(o.createdAt);
        return date >= dayStart && date <= dayEnd;
      });
      const dayName = dayStart.toLocaleString("default", { weekday: "short" });
      weeklyData.push({
        day: dayName,
        revenue: dayOrders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length,
      });
    }

    return {
      totalOrders,
      totalRevenue,
      weeklyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      ordersBySource: {
        website: websiteOrders,
        facebook: facebookOrders,
        manual: manualOrders,
      },
      revenueBySource: {
        website: websiteRevenue,
        facebook: facebookRevenue,
        manual: manualRevenue,
      },
      ordersByStatus: {
        pending: pendingOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      monthlyData,
      weeklyData,
    };
  }),
});
