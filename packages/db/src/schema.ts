import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  role: text("role").notNull().default("user"), // 'user', 'admin'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // selling price in taka
  costPrice: integer("cost_price"), // wholesale/cost price for profit calculation
  discount: integer("discount").default(0), // discount percentage (0-100)
  stock: integer("stock").notNull().default(0),
  images: json("images").$type<string[]>(),
  // Variants stored as JSON array: [{size: "10ml", price: 40, costPrice: 30}, {size: "13ml", price: 100, costPrice: 70}]
  variants:
    json("variants").$type<
      { size: string; price: number; costPrice?: number; stock: number }[]
    >(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  status: text("status").notNull().default("pending"), // 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  total: integer("total").notNull(),
  source: text("source").notNull().default("website"), // 'website', 'facebook', 'manual'
  // Customer details for guest checkout
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  shippingAddress: text("shipping_address"),
  shippingCity: text("shipping_city"),
  shippingPostalCode: text("shipping_postal_code"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  variant: text("variant"), // Size variant like "10ml", "13ml"
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
