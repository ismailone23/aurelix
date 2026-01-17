"use client";

import React from "react";
import { Globe, Facebook, Edit3 } from "lucide-react";
import type { DashboardStats } from "./types";

interface RevenueBySourceCardsProps {
  stats: DashboardStats | undefined;
}

export function RevenueBySourceCards({ stats }: RevenueBySourceCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-5 h-5 opacity-80" />
          <span className="font-medium opacity-90">Website</span>
        </div>
        <p className="text-2xl font-bold">
          ৳{(stats?.revenueBySource.website || 0).toLocaleString()}
        </p>
        <p className="text-sm opacity-75 mt-1">
          {stats?.ordersBySource.website || 0} orders
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Facebook className="w-5 h-5 opacity-80" />
          <span className="font-medium opacity-90">Facebook</span>
        </div>
        <p className="text-2xl font-bold">
          ৳{(stats?.revenueBySource.facebook || 0).toLocaleString()}
        </p>
        <p className="text-sm opacity-75 mt-1">
          {stats?.ordersBySource.facebook || 0} orders
        </p>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Edit3 className="w-5 h-5 opacity-80" />
          <span className="font-medium opacity-90">Manual</span>
        </div>
        <p className="text-2xl font-bold">
          ৳{(stats?.revenueBySource.manual || 0).toLocaleString()}
        </p>
        <p className="text-sm opacity-75 mt-1">
          {stats?.ordersBySource.manual || 0} orders
        </p>
      </div>
    </div>
  );
}
