"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { trpc } from "@/lib/trpc";
import {
  OrderSuccessView,
  EmptyCartView,
  ContactFormSection,
  ShippingFormSection,
  CheckoutSummary,
  type FormData,
  type FormErrors,
} from "@/components/checkout";

export default function CheckoutPage() {
  const { items, clearCart, totalPrice } = useCart();
  const createOrder = trpc.orders.create.useMutation();

  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingPostalCode: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [orderSuccess, setOrderSuccess] = useState<number | null>(null);

  const subtotal = totalPrice;
  const shipping = subtotal > 2500 ? 0 : 99;
  const total = subtotal + shipping;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Invalid email format";
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (formData.customerPhone.length < 10) {
      newErrors.customerPhone = "Phone number must be at least 10 digits";
    }
    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = "Address is required";
    }
    if (!formData.shippingCity.trim()) {
      newErrors.shippingCity = "City is required";
    }
    if (!formData.shippingPostalCode.trim()) {
      newErrors.shippingPostalCode = "Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      return;
    }

    try {
      const order = await createOrder.mutateAsync({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          variant: item.variant,
        })),
        ...formData,
      });

      // Send confirmation emails (fire and forget - don't block checkout)
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/email/order-confirmation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            shippingAddress: formData.shippingAddress,
            shippingCity: formData.shippingCity,
            shippingPostalCode: formData.shippingPostalCode,
            total: order.total,
            items: order.items,
            notes: formData.notes,
          }),
        },
      ).catch((err) => console.error("Email send failed:", err));

      clearCart();
      setOrderSuccess(order.id);
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };

  // Order success view
  if (orderSuccess) {
    return (
      <OrderSuccessView
        orderId={orderSuccess}
        customerEmail={formData.customerEmail}
      />
    );
  }

  // Empty cart view
  if (items.length === 0) {
    return <EmptyCartView />;
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 opacity-70 hover:opacity-100 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
            Checkout
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Customer Details Form */}
              <div className="lg:col-span-2 space-y-6">
                <ContactFormSection
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                />
                <ShippingFormSection
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                />
              </div>

              {/* Order Summary */}
              <CheckoutSummary
                items={items}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                isPending={createOrder.isPending}
                error={
                  createOrder.isError
                    ? createOrder.error?.message ||
                      "Failed to place order. Please try again."
                    : null
                }
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
