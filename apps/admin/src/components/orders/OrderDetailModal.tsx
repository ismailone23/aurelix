"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Package, Phone, Mail, MapPin, FileText, Clock } from "lucide-react";
import { ORDER_STATUSES, getStatusStyle, type Order } from "./types";

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onStatusChange: (orderId: number, status: string, order: Order) => void;
  onDelete: (orderId: number) => void;
  updatingStatus: number | null;
  deletingOrder: number | null;
}

export function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
  onDelete,
  updatingStatus,
  deletingOrder,
}: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order #{order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(order.status)}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{order.customerEmail || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{order.customerPhone || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Shipping Address
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingCity}, {order.shippingPostalCode}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Order Items</h3>
            <div className="border rounded-lg divide-y">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {item.productName || `Product #${item.productId}`}
                    </p>
                    {item.variant && (
                      <span className="text-sm text-gray-500">
                        Size: {item.variant}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p>
                      ৳{item.price} × {item.quantity}
                    </p>
                    <p className="font-semibold">
                      ৳{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Order Notes
              </h3>
              <p className="p-4 bg-yellow-50 rounded-lg text-sm">
                {order.notes}
              </p>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">৳{order.total}</span>
          </div>

          {/* Status Update */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Update Status</h3>
            <div className="flex gap-2 flex-wrap">
              {ORDER_STATUSES.map((status) => (
                <Button
                  key={status.value}
                  size="sm"
                  variant={
                    order.status === status.value ? "default" : "outline"
                  }
                  className={order.status === status.value ? "" : status.color}
                  onClick={() => onStatusChange(order.id, status.value, order)}
                  disabled={updatingStatus === order.id}
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Delete Order */}
          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => onDelete(order.id)}
              disabled={deletingOrder === order.id}
            >
              {deletingOrder === order.id ? "Deleting..." : "Delete Order"}
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              This will permanently delete the order. No email will be sent.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
