"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useCart } from "@/contexts/cart-context";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  const subtotal = totalPrice;
  const shipping = subtotal > 2500 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="py-12 md:py-20 min-h-[60vh] bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-serif font-light mb-10 text-neutral-900 dark:text-white">
            Your Bag
          </h1>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900/50 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800">
              <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-neutral-500 dark:text-neutral-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-neutral-900 dark:text-white">Your cart is empty</h2>
              <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8 max-w-md text-center">
                Looks like you haven&apos;t added anything to your bag yet.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl"
              >
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-8 space-y-6">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variant || "default"}`}
                    className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 flex gap-4 sm:gap-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-sm"
                  >
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex-shrink-0 overflow-hidden">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>

                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h3 className="font-semibold text-lg sm:text-xl truncate pr-4 text-neutral-900 dark:text-white">
                            {item.name}
                          </h3>
                          <button
                            onClick={() =>
                              removeItem(item.productId, item.variant)
                            }
                            className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        {item.variant && (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2 bg-neutral-100 dark:bg-neutral-800 inline-block px-2 py-1 rounded-md font-medium">
                            {item.variant}
                          </p>
                        )}
                        <p className="text-neutral-600 dark:text-neutral-400 font-medium">
                          ৳{item.price.toFixed(0)}
                        </p>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-full p-1 border border-neutral-200 dark:border-neutral-700">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.variant,
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-semibold text-sm">
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
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-lg font-bold text-neutral-900 dark:text-white">
                          ৳{(item.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 sticky top-28 shadow-lg">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-neutral-900 dark:text-white">
                    Order Summary
                    <span className="text-xs font-normal bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded-full">
                      {items.length} items
                    </span>
                  </h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Subtotal</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        ৳{subtotal.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Shipping</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {shipping === 0 ? (
                          <span className="text-green-600 dark:text-green-400">
                            Free
                          </span>
                        ) : (
                          `৳${shipping}`
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-8 items-end">
                    <span className="text-lg font-semibold text-neutral-900 dark:text-white">Total</span>
                    <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                      ৳{total.toFixed(0)}
                    </span>
                  </div>

                  <Link href="/checkout" className="block mb-4">
                    <Button className="w-full h-14 text-lg rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link
                    href="/products"
                    className="block w-full text-center py-3 text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-medium transition-colors"
                  >
                    Continue Shopping
                  </Link>

                  {subtotal < 2500 && (
                    <div className="mt-6 p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 text-center font-medium">
                        Add <span className="font-bold">৳{(2500 - subtotal).toFixed(0)}</span> more for free shipping!
                      </p>
                      <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-700 mt-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neutral-900 dark:bg-white rounded-full"
                          style={{ width: `${(subtotal / 2500) * 100}%` }}
                        />
                      </div>
                    </div>
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
