"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, CreditCard, Truck } from "lucide-react";
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
      window.scrollTo({ top: 0, behavior: "smooth" });
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

      fetch(
        `${process.env.NEXT_PUBLIC_ADMIN_URL}/api/email/order-confirmation`,
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };

  if (orderSuccess) {
    return (
      <div className="py-20 min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <OrderSuccessView
          orderId={orderSuccess}
          customerEmail={formData.customerEmail}
        />
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyCartView />;
  }

  return (
    <div className="py-12 md:py-16 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12 flex items-center justify-center">
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link
                href="/cart"
                className="flex items-center gap-2 text-green-600 dark:text-green-500"
              >
                <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </span>
                Cart
              </Link>
              <div className="w-12 h-px bg-neutral-300 dark:bg-neutral-800" />
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                <span className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-lg">
                  <Truck className="w-4 h-4" />
                </span>
                Shipping
              </div>
              <div className="w-12 h-px bg-neutral-300 dark:bg-neutral-800" />
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </span>
                Payment
              </div>
            </div>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Customer Details Form */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-neutral-900 dark:text-white">
                    <span className="w-1.5 h-6 bg-neutral-900 dark:bg-white rounded-full" />
                    Contact Information
                  </h2>
                  <ContactFormSection
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                  />
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-neutral-900 dark:text-white">
                    <span className="w-1.5 h-6 bg-neutral-400 rounded-full" />
                    Shipping Details
                  </h2>
                  <ShippingFormSection
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-5">
                <div className="sticky top-28">
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

                  <div className="mt-6 flex items-start gap-3 p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl text-sm text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                    <Truck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>
                      Cash on Delivery is enabled. You will pay when you receive your items.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
