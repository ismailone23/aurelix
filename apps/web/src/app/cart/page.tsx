"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useCart } from "@/contexts/cart-context";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  const subtotal = totalPrice;
  const shipping = subtotal > 2500 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-12 md:py-16 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
                Your cart is empty
              </p>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg font-medium transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variant || "default"}`}
                    className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex gap-4"
                  >
                    <div className="relative w-20 h-20 md:w-24 md:h-24 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold mb-1 truncate">
                        {item.name}
                      </h3>
                      {item.variant && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                          Size: {item.variant}
                        </p>
                      )}
                      <p className="text-neutral-600 dark:text-neutral-400 mb-3">
                        ৳{item.price.toFixed(0)}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.variant,
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.variant,
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.productId, item.variant)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <p className="text-lg font-semibold">
                        ৳{(item.price * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex justify-between">
                      <span className="opacity-70">Subtotal</span>
                      <span>৳{subtotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600 dark:text-green-400">
                            FREE
                          </span>
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

                  <Link href="/checkout">
                    <Button className="w-full mb-3 h-11">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link
                    href="/products"
                    className="block w-full text-center px-6 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Continue Shopping
                  </Link>

                  {subtotal < 2500 && (
                    <p className="text-sm opacity-60 mt-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                      Add ৳{(2500 - subtotal).toFixed(0)} more for FREE
                      shipping!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
