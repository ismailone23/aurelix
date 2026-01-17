"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { ORDER_STATUSES, getStatusStyle, type Order } from "./types";

interface OrdersTableProps {
  orders: Order[];
  onStatusChange: (orderId: number, status: string, order: Order) => void;
  onViewOrder: (order: Order) => void;
  onDeleteOrder: (orderId: number) => void;
  updatingStatus: number | null;
  deletingOrder: number | null;
}

export function OrdersTable({
  orders,
  onStatusChange,
  onViewOrder,
  onDeleteOrder,
  updatingStatus,
  deletingOrder,
}: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No orders found. Create your first order!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Order ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Source
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Customer
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Items
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Total
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-mono text-sm font-medium">
                #{order.id}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    order.source === "facebook"
                      ? "bg-purple-100 text-purple-700"
                      : order.source === "manual"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.source === "facebook"
                    ? "Facebook"
                    : order.source === "manual"
                      ? "Manual"
                      : "Website"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {order.customerName || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">{order.customerPhone}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-600">
                  {order.items?.length || 0} item(s)
                </span>
              </td>
              <td className="px-4 py-3 font-semibold text-gray-900">
                ৳{order.total}
              </td>
              <td className="px-4 py-3">
                <Select
                  value={order.status}
                  onValueChange={(value) =>
                    onStatusChange(order.id, value, order)
                  }
                  disabled={updatingStatus === order.id}
                >
                  <SelectTrigger
                    className={`w-[130px] h-8 text-xs font-medium ${getStatusStyle(order.status)}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => onViewOrder(order)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => onDeleteOrder(order.id)}
                    disabled={deletingOrder === order.id}
                  >
                    {deletingOrder === order.id ? "..." : "Delete"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
