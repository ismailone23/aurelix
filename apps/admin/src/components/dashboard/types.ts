export type TimeRange = "weekly" | "monthly" | "yearly";

export const SOURCE_COLORS = {
  website: "#3B82F6",
  facebook: "#8B5CF6",
  manual: "#10B981",
};

export const STATUS_COLORS = {
  pending: "#F59E0B",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  monthlyCost?: number;
  monthlyProfit?: number;
  ordersBySource: {
    website: number;
    facebook: number;
    manual: number;
  };
  revenueBySource: {
    website: number;
    facebook: number;
    manual: number;
  };
  ordersByStatus: {
    pending: number;
    delivered: number;
    cancelled: number;
  };
  weeklyData: Array<{ day: string; revenue: number; orders: number }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    orders: number;
    websiteRevenue: number;
    facebookRevenue: number;
  }>;
}

export interface ChartDataItem {
  name: string;
  revenue: number;
  orders: number;
  website?: number;
  facebook?: number;
}

export interface PieDataItem {
  name: string;
  value: number;
  color: string;
}
