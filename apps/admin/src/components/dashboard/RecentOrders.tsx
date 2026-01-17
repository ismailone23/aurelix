"use client";

import React from "react";
import Link from "next/link";

interface Order {
  id: number;
  customerName: string | null;
  source: string | null;
  total: number;
  status: string;
}

interface RecentOrdersProps {
  orders: Order[] | undefined;
  isLoading: boolean;
}

export function RecentOrders({ orders, isLoading }: RecentOrdersProps) {
  const getSourceStyle = (source: string | null) => {
    if (source === "facebook") return "bg-purple-100 text-purple-700";
    if (source === "manual") return "bg-green-100 text-green-700";
    return "bg-blue-100 text-blue-700";
  };

  const getSourceLabel = (source: string | null) => {
    if (source === "facebook") return "Facebook";
    if (source === "manual") return "Manual";
    return "Website";
  };

  const getStatusStyle = (status: string) => {
    if (status === "delivered") return "bg-green-100 text-green-700";
    if (status === "shipped") return "bg-blue-100 text-blue-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    if (status === "processing") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        <div className="flex gap-3">
          <Link
            href="/orders/create"
            className="text-sm text-purple-600 hover:underline"
          >
            + Create Order
          </Link>
          <Link
            href="/orders"
            className="text-sm text-blue-600 hover:underline"
          >
            View all →
          </Link>
        </div>
      </div>
      {isLoading && !orders ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : orders?.length ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3 font-medium">Order</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Source</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 font-mono text-sm">#{order.id}</td>
                  <td className="py-3 text-gray-700">
                    {order.customerName || "N/A"}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSourceStyle(order.source)}`}
                    >
                      {getSourceLabel(order.source)}
                    </span>
                  </td>
                  <td className="py-3 font-semibold">৳{order.total}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">No orders yet</p>
      )}
    </div>
  );
}
