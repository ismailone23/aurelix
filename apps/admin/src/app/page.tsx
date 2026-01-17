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
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here&apos;s your business overview.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-1 bg-white p-1 rounded-xl shadow-sm w-fit">
        {(["weekly", "monthly", "yearly"] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              timeRange === range
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats as DashboardStats} timeRange={timeRange} />

      {/* Revenue by Source Cards */}
      <RevenueBySourceCards stats={stats as DashboardStats} />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <RevenueChart data={getChartData()} timeRange={timeRange} />
        <OrderStatusChart data={statusData} totalOrders={totalStatusOrders} />
      </div>

      {/* Orders by Source & Recent Products */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <OrderSourceChart data={sourceData} />
        <RecentProducts products={products} isLoading={productsLoading} />
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={orders} isLoading={ordersLoading} />
    </div>
  );
}
