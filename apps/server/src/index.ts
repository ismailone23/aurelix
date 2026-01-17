import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, type Context } from "@workspace/trpc";
import jwt from "jsonwebtoken";
import { supabase, STORAGE_BUCKET, getPublicUrl } from "./supabase";
import {
  sendOrderConfirmation,
  sendAdminNewOrderNotification,
  sendOrderStatusUpdate,
  sendContactMessage,
} from "./email";

const app = new Hono();

// CORS middleware
app.use("/*", cors());

// Body limit middleware - allow up to 50MB for base64 images
app.use(
  "/*",
  bodyLimit({
    maxSize: 50 * 1024 * 1024, // 50MB
    onError: (c) => {
      return c.json({ error: "Request body too large" }, 413);
    },
  }),
);

// tRPC middleware
app.use("/trpc/*", async (c) => {
  const authorization = c.req.header("authorization");
  let userId: number | undefined;
  let userRole: string | undefined;

  if (authorization?.startsWith("Bearer ")) {
    try {
      const token = authorization.substring(7);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
      ) as {
        userId: number;
        role: string;
      };
      userId = decoded.userId;
      userRole = decoded.role;
    } catch (error) {
      // Invalid token
    }
  }

  return fetchRequestHandler({
    endpoint: "/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: (): Context => ({
      userId,
      userRole,
    }),
  });
});

// Image upload endpoint
app.post("/upload", async (c) => {
  try {
    // Verify admin auth
    const authorization = c.req.header("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const token = authorization.substring(7);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
      ) as { role: string };
      if (decoded.role !== "admin") {
        return c.json({ error: "Forbidden" }, 403);
      }
    } catch {
      return c.json({ error: "Invalid token" }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return c.json({ error: "Failed to upload image" }, 500);
    }

    // Return the public URL
    const publicUrl = getPublicUrl(data.path);
    return c.json({ url: publicUrl, path: data.path });
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ error: "Upload failed" }, 500);
  }
});

// Delete image endpoint
app.delete("/upload/:path", async (c) => {
  try {
    // Verify admin auth
    const authorization = c.req.header("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const token = authorization.substring(7);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
      ) as { role: string };
      if (decoded.role !== "admin") {
        return c.json({ error: "Forbidden" }, 403);
      }
    } catch {
      return c.json({ error: "Invalid token" }, 401);
    }

    const path = c.req.param("path");

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (error) {
      console.error("Supabase delete error:", error);
      return c.json({ error: "Failed to delete image" }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return c.json({ error: "Delete failed" }, 500);
  }
});

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Email endpoint for order confirmation (called after order creation)
app.post("/email/order-confirmation", async (c) => {
  try {
    const body = await c.req.json();
    const {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      total,
      items,
      notes,
    } = body;

    // Send confirmation to customer
    await sendOrderConfirmation({
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      total,
      items,
      notes,
    });

    // Send notification to admin
    await sendAdminNewOrderNotification({
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      total,
      items,
      notes,
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return c.json({ error: "Failed to send email" }, 500);
  }
});

// Email endpoint for status update
app.post("/email/status-update", async (c) => {
  try {
    // Verify admin auth
    const authorization = c.req.header("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const token = authorization.substring(7);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
      ) as { role: string };
      if (decoded.role !== "admin") {
        return c.json({ error: "Forbidden" }, 403);
      }
    } catch {
      return c.json({ error: "Invalid token" }, 401);
    }

    const { customerEmail, customerName, orderId, status } = await c.req.json();

    await sendOrderStatusUpdate(customerEmail, customerName, orderId, status);

    return c.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return c.json({ error: "Failed to send email" }, 500);
  }
});

// Contact form endpoint
app.post("/contact", async (c) => {
  try {
    const { name, email, subject, message } = await c.req.json();

    if (!name || !email || !subject || !message) {
      return c.json({ error: "All fields are required" }, 400);
    }

    await sendContactMessage({ name, email, subject, message });

    return c.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return c.json({ error: "Failed to send message" }, 500);
  }
});

const port = Number(process.env.PORT) || 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
