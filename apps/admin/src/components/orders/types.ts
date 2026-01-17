export interface OrderItem {
  id: number;
  productId: number | null;
  quantity: number;
  price: number;
  variant: string | null;
  productName: string | null;
}

export interface Order {
  id: number;
  userId: number | null;
  status: string;
  total: number;
  source?: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingPostalCode: string | null;
  notes: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: OrderItem[];
}

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-gray-100 text-gray-800" },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]["value"];

export const getStatusStyle = (status: string) => {
  return (
    ORDER_STATUSES.find((s) => s.value === status)?.color ||
    "bg-gray-100 text-gray-800"
  );
};
