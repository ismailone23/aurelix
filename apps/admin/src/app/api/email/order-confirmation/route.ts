import { NextRequest, NextResponse } from "next/server";
import {
  sendOrderConfirmation,
  sendAdminNewOrderNotification,
} from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
