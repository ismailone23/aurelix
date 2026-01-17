"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { PieDataItem } from "./types";

interface OrderSourceChartProps {
  data: PieDataItem[];
}

export function OrderSourceChart({ data }: OrderSourceChartProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Orders by Source
      </h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#6B7280" fontSize={12} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#6B7280"
              fontSize={12}
              width={70}
            />
            <Tooltip
              formatter={(value: number) => [value, "Orders"]}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-gray-400">
          No orders yet
        </div>
      )}
    </div>
  );
}
