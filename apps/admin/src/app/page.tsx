"use client";

import { trpc } from "../utils/trpc";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { RefreshCw } from "lucide-react";
import {
  StatsCards,
  RevenueBySourceCards,
  RevenueChart,
  OrderStatusChart,
  OrderSourceChart,
  RecentProducts,
  RecentOrders,
  SOURCE_COLORS,
  STATUS_COLORS,
  type TimeRange,
  type DashboardStats,
  type ChartDataItem,
  type PieDataItem,
} from "@/components/dashboard";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly");

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = trpc.orders.dashboardStats.useQuery();

  const {
    data: products,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = trpc.products.list.useQuery({
    limit: 5,
    offset: 0,
  });

  const {
    data: orders,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = trpc.orders.list.useQuery({
    limit: 5,
    offset: 0,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchStats(), refetchProducts(), refetchOrders()]);
    setIsRefreshing(false);
  };

  if (statsLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const sourceData: PieDataItem[] = stats
    ? [
      {
        name: "Website",
        value: stats.ordersBySource.website,
        color: SOURCE_COLORS.website,
      },
      {
        name: "Facebook",
        value: stats.ordersBySource.facebook,
        color: SOURCE_COLORS.facebook,
      },
      {
        name: "Manual",
        value: stats.ordersBySource.manual,
        color: SOURCE_COLORS.manual,
      },
    ].filter((item) => item.value > 0)
    : [];

  const statusData: PieDataItem[] = stats
    ? [
      {
        name: "Pending",
        value: stats.ordersByStatus.pending,
        color: STATUS_COLORS.pending,
      },
      {
        name: "Delivered",
        value: stats.ordersByStatus.delivered,
        color: STATUS_COLORS.delivered,
      },
      {
        name: "Cancelled",
        value: stats.ordersByStatus.cancelled,
        color: STATUS_COLORS.cancelled,
      },
    ].filter((item) => item.value > 0)
    : [];

  const getChartData = (): ChartDataItem[] => {
    if (!stats) return [];
    if (timeRange === "weekly") {
      return stats.weeklyData.map((d) => ({
        name: d.day,
        revenue: d.revenue,
        orders: d.orders,
      }));
    }
    return stats.monthlyData.map((d) => ({
      name: d.month,
      revenue: d.revenue,
      orders: d.orders,
      website: d.websiteRevenue,
      facebook: d.facebookRevenue,
    }));
  };

  const totalStatusOrders =
    (stats?.ordersByStatus.pending || 0) +
    (stats?.ordersByStatus.delivered || 0) +
    (stats?.ordersByStatus.cancelled || 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Dashboard
          </h1>
          <p className="text-zinc-500 mt-1">
            Overview of your store's performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-white p-1 rounded-xl border border-zinc-200 shadow-sm">
            {(["weekly", "monthly", "yearly"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${timeRange === range
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 bg-white shadow-sm"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="sr-only sm:not-sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Stats Cards */}
        <StatsCards stats={stats as DashboardStats} timeRange={timeRange} />

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart data={getChartData()} timeRange={timeRange} />
          </div>
          <OrderStatusChart data={statusData} totalOrders={totalStatusOrders} />
        </div>

        {/* Revenue by Source */}
        <RevenueBySourceCards stats={stats as DashboardStats} />

        {/* Orders by Source & Recent Products */}
        <div className="grid gap-6 lg:grid-cols-2">
          <OrderSourceChart data={sourceData} />
          <RecentProducts products={products} isLoading={productsLoading} />
        </div>

        {/* Recent Orders */}
        <RecentOrders orders={orders} isLoading={ordersLoading} />
      </div>
    </div>
  );
}
