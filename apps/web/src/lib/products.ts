// Product type matching the database schema
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number; // price in taka
  costPrice?: number | null; // cost price for profit calculation
  discount?: number | null; // discount percentage
  stock: number;
  images?: string[] | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Helper to format price (no cents conversion - display as-is)
export function formatPrice(price: number): string {
  return `৳${price}`;
}

// Helper to format price as number (no conversion needed)
export function priceFromCents(price: number): number {
  return price;
}
