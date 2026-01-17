import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendOrderStatusUpdate } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // Verify admin auth
    const authorization = req.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const token = authorization.substring(7);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
      ) as { role: string };
      if (decoded.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { customerEmail, customerName, orderId, status } = await req.json();

    await sendOrderStatusUpdate(customerEmail, customerName, orderId, status);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
