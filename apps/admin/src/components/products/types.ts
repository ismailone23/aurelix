export interface Variant {
  size: string;
  price: number;
  costPrice?: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  images: string[] | null;
  variants: Variant[] | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
