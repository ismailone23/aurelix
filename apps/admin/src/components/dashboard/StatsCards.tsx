"use client";

import React from "react";
import {
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Clock,
  TrendingDown,
} from "lucide-react";
import type { DashboardStats, TimeRange } from "./types";

interface StatsCardsProps {
  stats: DashboardStats | undefined;
  timeRange: TimeRange;
}

export function StatsCards({ stats, timeRange }: StatsCardsProps) {
  const getDisplayRevenue = () => {
    if (!stats) return 0;
    switch (timeRange) {
      case "weekly":
        return stats.weeklyRevenue;
      case "monthly":
        return stats.monthlyRevenue;
      case "yearly":
        return stats.yearlyRevenue;
      default:
        return stats.totalRevenue;
    }
  };

  const displayProfit = stats?.monthlyProfit ?? stats?.totalProfit ?? 0;
  const displayCost = stats?.monthlyCost ?? stats?.totalCost ?? 0;
  const profitMargin = stats?.profitMargin ?? 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats?.totalOrders || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {timeRange === "weekly"
                ? "Weekly"
                : timeRange === "monthly"
                  ? "Monthly"
                  : "Yearly"}{" "}
              Revenue
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              ৳{getDisplayRevenue().toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Cost</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              ৳{(displayCost || 0).toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div
        className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Profit</p>
            <p
              className={`text-3xl font-bold mt-1 ${displayProfit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              ৳{displayProfit.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {profitMargin.toFixed(1)}% margin
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${displayProfit >= 0 ? "bg-green-100" : "bg-red-100"}`}
          >
            <DollarSign
              className={`w-6 h-6 ${displayProfit >= 0 ? "text-green-600" : "text-red-600"}`}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Orders</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats?.ordersByStatus.pending || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
