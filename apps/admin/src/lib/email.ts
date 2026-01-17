import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.FROM_EMAIL;

// Create transporter with SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface OrderDetails {
  orderId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  total: number;
  items: { name: string; quantity: number; price: number; variant?: string }[];
  notes?: string;
}

// Send order confirmation to customer
export async function sendOrderConfirmation(order: OrderDetails) {
  const itemsList = order.items
    .map(
      (item) =>
        `• ${item.name}${item.variant ? ` (${item.variant})` : ""} x${item.quantity} - ৳${item.price * item.quantity}`,
    )
    .join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Aurelix Perfume</h1>
      </div>

      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333;">Thank you for your order! 🎉</h2>

        <p>Dear ${order.customerName},</p>
        <p>We've received your order and will process it shortly.</p>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #8B5CF6;">Order #${order.orderId}</h3>

          <h4 style="margin-bottom: 10px;">Items:</h4>
          <pre style="font-family: Arial; white-space: pre-wrap;">${itemsList}</pre>

          <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">

          <p style="font-size: 18px; font-weight: bold; color: #333;">
            Total: ৳${order.total}
          </p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px;">
          <h4 style="margin-top: 0;">Shipping Address:</h4>
          <p style="margin: 5px 0;">${order.customerName}</p>
          <p style="margin: 5px 0;">${order.shippingAddress}</p>
          <p style="margin: 5px 0;">${order.shippingCity}, ${order.shippingPostalCode}</p>
          <p style="margin: 5px 0;">Phone: ${order.customerPhone}</p>
        </div>

        ${order.notes ? `<p style="margin-top: 20px;"><strong>Order Notes:</strong> ${order.notes}</p>` : ""}

        <p style="margin-top: 30px;">If you have any questions, please reply to this email.</p>

        <p>Best regards,<br>Aurelix Perfume Team</p>
      </div>

      <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Aurelix Perfume. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Aurelix Perfume" <${ADMIN_EMAIL}>`,
      to: order.customerEmail,
      subject: `Order Confirmation #${order.orderId} - Aurelix Perfume`,
      html,
    });
    console.log(`Order confirmation sent to ${order.customerEmail}`);
  } catch (error) {
    console.error("Failed to send order confirmation:", error);
  }
}

// Send new order notification to admin
export async function sendAdminNewOrderNotification(order: OrderDetails) {
  const itemsList = order.items
    .map(
      (item) =>
        `• ${item.name}${item.variant ? ` (${item.variant})` : ""} x${item.quantity} - ৳${item.price * item.quantity}`,
    )
    .join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #10B981; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">🛒 New Order Received!</h1>
      </div>

      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333;">Order #${order.orderId}</h2>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Customer Details:</h3>
          <p><strong>Name:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Shipping Address:</h3>
          <p>${order.shippingAddress}</p>
          <p>${order.shippingCity}, ${order.shippingPostalCode}</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Items:</h3>
          <pre style="font-family: Arial; white-space: pre-wrap;">${itemsList}</pre>

          <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">

          <p style="font-size: 20px; font-weight: bold; color: #10B981;">
            Total: ৳${order.total}
          </p>
        </div>

        ${order.notes ? `<div style="background: #FEF3C7; padding: 15px; border-radius: 8px;"><strong>Customer Notes:</strong> ${order.notes}</div>` : ""}
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Aurelix Store" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `🛒 New Order #${order.orderId} - ৳${order.total}`,
      html,
    });
    console.log("Admin notification sent");
  } catch (error) {
    console.error("Failed to send admin notification:", error);
  }
}

// Send order status update to customer
export async function sendOrderStatusUpdate(
  customerEmail: string,
  customerName: string,
  orderId: number,
  newStatus: string,
) {
  const statusMessages: Record<
    string,
    { emoji: string; message: string; color: string }
  > = {
    confirmed: {
      emoji: "✅",
      message: "Your order has been confirmed and will be processed soon.",
      color: "#10B981",
    },
    processing: {
      emoji: "⚙️",
      message: "Your order is being prepared for shipment.",
      color: "#F59E0B",
    },
    shipped: {
      emoji: "🚚",
      message:
        "Great news! Your order has been shipped and is on its way to you.",
      color: "#3B82F6",
    },
    delivered: {
      emoji: "📦",
      message: "Your order has been delivered. Thank you for shopping with us!",
      color: "#10B981",
    },
    cancelled: {
      emoji: "❌",
      message:
        "Your order has been cancelled. If you have any questions, please contact us.",
      color: "#EF4444",
    },
  };

  const statusInfo = statusMessages[newStatus] || {
    emoji: "📋",
    message: `Your order status has been updated to: ${newStatus}`,
    color: "#6B7280",
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Aurelix Perfume</h1>
      </div>

      <div style="padding: 30px; background: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 48px;">${statusInfo.emoji}</span>
        </div>

        <h2 style="color: #333; text-align: center;">Order Status Update</h2>

        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
          <p style="font-size: 14px; color: #666; margin: 0;">Order #${orderId}</p>
          <p style="font-size: 24px; font-weight: bold; color: ${statusInfo.color}; margin: 10px 0; text-transform: uppercase;">
            ${newStatus}
          </p>
        </div>

        <p style="margin-top: 20px;">Dear ${customerName},</p>
        <p>${statusInfo.message}</p>

        <p style="margin-top: 30px;">If you have any questions, please reply to this email.</p>

        <p>Best regards,<br>Aurelix Perfume Team</p>
      </div>

      <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Aurelix Perfume. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Aurelix Perfume" <${ADMIN_EMAIL}>`,
      to: customerEmail,
      subject: `${statusInfo.emoji} Order #${orderId} - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      html,
    });
    console.log(`Status update sent to ${customerEmail}`);
  } catch (error) {
    console.error("Failed to send status update:", error);
  }
}

// Send contact form message to admin
export async function sendContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { name, email, subject, message } = data;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">New Contact Message</h1>
      </div>

      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333; margin-bottom: 20px;">Contact Form Submission</h2>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 100px;">From:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Subject:</td>
              <td style="padding: 10px 0;">${subject}</td>
            </tr>
          </table>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap; color: #555;">${message}</p>
        </div>

        <p style="margin-top: 20px; font-size: 12px; color: #888;">
          Reply directly to this email to respond to the customer.
        </p>
      </div>

      <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Aurelix Perfume. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Aurelix Contact" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `📬 Contact Form: ${subject}`,
      html,
    });
    console.log(`Contact message sent from ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send contact message:", error);
    throw error;
  }
}
