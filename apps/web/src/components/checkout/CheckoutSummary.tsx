"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import type { CartItem } from "./types";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  isPending: boolean;
  error?: string | null;
}

export function CheckoutSummary({
  items,
  subtotal,
  shipping,
  total,
  isPending,
  error,
}: CheckoutSummaryProps) {
  return (
    <div className="lg:col-span-1">
      <div className="border border-neutral-300 dark:border-neutral-800 rounded-xl p-4 md:p-6 sticky top-24">
        <h2 className="text-lg md:text-xl font-bold mb-4">Order Summary</h2>

        {/* Order Items */}
        <div className="space-y-3 mb-4 pb-4 border-b border-neutral-300 dark:border-neutral-800">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variant || "default"}`}
              className="flex gap-3"
            >
              <div className="relative w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-neutral-400">
                    {item.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium">{item.name}</p>
                {item.variant && (
                  <p className="text-xs text-neutral-500">
                    Size: {item.variant}
                  </p>
                )}
                <p className="text-xs opacity-60">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">
                ৳{(item.price * item.quantity).toFixed(0)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-3 mb-4 pb-4 border-b border-neutral-300 dark:border-neutral-800">
          <div className="flex justify-between">
            <span className="opacity-70">Subtotal</span>
            <span>৳{subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Shipping</span>
            <span>
              {shipping === 0 ? (
                <span className="text-green-600 dark:text-green-400">FREE</span>
              ) : (
                `৳${shipping}`
              )}
            </span>
          </div>
        </div>

        <div className="flex justify-between mb-6 text-lg font-bold">
          <span>Total</span>
          <span>৳{total.toFixed(0)}</span>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Processing..." : "Place Order"}
        </Button>

        {error && (
          <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
        )}

        <p className="text-xs opacity-60 mt-4 text-center">
          By placing your order, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
}
