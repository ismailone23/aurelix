export interface Variant {
  size: string;
  price: number;
  costPrice?: number;
  discount?: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  costPrice?: number | null;
  discount?: number | null;
  stock: number;
  isActive: boolean;
  images: string[] | null;
  variants: Variant[] | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}
