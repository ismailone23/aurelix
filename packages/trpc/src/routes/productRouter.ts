import { adminProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { db, products } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Variant schema
const variantSchema = z.object({
  size: z.string(),
  price: z.number().int().positive(),
  costPrice: z.number().int().min(0).optional(),
  discount: z.number().int().min(0).max(100).optional().default(0),
  stock: z.number().int().min(0),
});

export const productsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ input }) => {
      const items = await db
        .select()
        .from(products)
        .where(eq(products.isActive, true))
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(products.createdAt));
      return items;
    }),

  // Admin list - includes inactive products
  adminList: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(100),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ input }) => {
      const items = await db
        .select()
        .from(products)
        .limit(input.limit)
        .offset(input.offset)
        .orderBy(desc(products.createdAt));
      return items;
    }),

  getById: publicProcedure.input(z.number()).query(async ({ input }) => {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, input));
    if (!product) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return product;
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number().int().positive(),
        costPrice: z.number().int().min(0).optional(),
        discount: z.number().int().min(0).max(100).optional().default(0),
        stock: z.number().int().min(0),
        images: z.array(z.string()).optional(),
        variants: z.array(variantSchema).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const [product] = await db.insert(products).values(input).returning();
      return product;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().int().positive().optional(),
        costPrice: z.number().int().min(0).optional(),
        discount: z.number().int().min(0).max(100).optional(),
        stock: z.number().int().min(0).optional(),
        images: z.array(z.string()).optional(),
        variants: z.array(variantSchema).optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [product] = await db
        .update(products)
        .set(data)
        .where(eq(products.id, id))
        .returning();
      return product;
    }),

  delete: adminProcedure.input(z.number()).mutation(async ({ input }) => {
    await db.delete(products).where(eq(products.id, input));
    return { success: true };
  }),
});
