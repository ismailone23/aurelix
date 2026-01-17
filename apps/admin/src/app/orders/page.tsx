"use client";

import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import {
  OrdersTable,
  OrderDetailModal,
  type Order,
  type OrderStatus,
  API_URL,
} from "@/components/orders";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<number | null>(null);

  const {
    data: orders,
    isLoading,
    refetch,
  } = trpc.orders.list.useQuery({
    limit: 100,
    offset: 0,
  });

  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      setUpdatingStatus(null);
    },
  });

  const deleteMutation = trpc.orders.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeletingOrder(null);
      setSelectedOrder(null);
    },
  });

  const handleDeleteOrder = async (orderId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this order? This action cannot be undone.",
      )
    ) {
      return;
    }
    setDeletingOrder(orderId);
    await deleteMutation.mutateAsync(orderId);
  };

  const handleStatusChange = async (
    orderId: number,
    newStatus: string,
    order: Order,
  ) => {
    setUpdatingStatus(orderId);

    await updateStatusMutation.mutateAsync({
      orderId,
      status: newStatus as OrderStatus,
    });

    // Update selected order if viewing
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    // Send status update email if customer has email
    if (order.customerEmail) {
      const token = localStorage.getItem("token");
      fetch(`${API_URL}/email/status-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerEmail: order.customerEmail,
          customerName: order.customerName || "Customer",
          orderId,
          status: newStatus,
        }),
      }).catch((err) => console.error("Failed to send status email:", err));
    }
  };

  if (isLoading && !orders)
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Orders
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/orders/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Create Order
            </Button>
          </Link>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <OrdersTable
          orders={(orders || []) as Order[]}
          onStatusChange={handleStatusChange}
          onViewOrder={setSelectedOrder}
          onDeleteOrder={handleDeleteOrder}
          updatingStatus={updatingStatus}
          deletingOrder={deletingOrder}
        />
      </div>

      {/* Order Details Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteOrder}
        updatingStatus={updatingStatus}
        deletingOrder={deletingOrder}
      />
    </div>
  );
}
