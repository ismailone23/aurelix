"use client";

import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { Package, AlertCircle, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const {
    data: orders,
    isLoading,
    error,
  } = trpc.orders.myOrders.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  if (!isLoggedIn) {
    return (
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Orders</h1>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-3 text-yellow-600 dark:text-yellow-400" />
              <p className="text-yellow-800 dark:text-yellow-200">
                Please log in to view your orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Orders</h1>
            </div>
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Orders</h1>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-200">
                Error loading orders: {error.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Orders</h1>
            <p className="text-base md:text-lg opacity-70">
              Track and manage your orders
            </p>
          </div>

          {orders && orders.length === 0 ? (
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 md:p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg opacity-70 mb-6">
                You haven&apos;t placed any orders yet.
              </p>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders?.map((order) => (
                <div
                  key={order.id}
                  className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 md:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm opacity-60">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : order.status === "shipped"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : order.status === "processing"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                              : order.status === "cancelled"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-lg">
                        ৳{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
