"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Elegance Noir",
      price: 89.99,
      quantity: 1,
      image: "/perfume1.jpg",
    },
    {
      id: 2,
      name: "Blossom Dreams",
      price: 79.99,
      quantity: 2,
      image: "/perfume2.jpg",
    },
  ]);

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setCartItems(
        cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg opacity-70 mb-6">Your cart is empty</p>
            <Link
              href="/mens"
              className="inline-block px-6 py-2 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-neutral-300 dark:border-neutral-800 rounded-lg p-4 flex gap-4"
                >
                  <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-700 rounded-md flex-shrink-0 flex items-center justify-center">
                    <span className="text-sm opacity-50">Image</span>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-3">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <p className="text-lg font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="border border-neutral-300 dark:border-neutral-800 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-neutral-300 dark:border-neutral-800">
                  <div className="flex justify-between">
                    <span className="opacity-70">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 dark:text-green-400">
                          FREE
                        </span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6 text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Button className="w-full mb-3">Proceed to Checkout</Button>
                <Link
                  href="/mens"
                  className="block w-full text-center px-6 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Continue Shopping
                </Link>

                {subtotal <= 50 && (
                  <p className="text-sm opacity-60 mt-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded">
                    Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
