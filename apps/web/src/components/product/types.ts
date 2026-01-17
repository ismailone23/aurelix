export interface Variant {
  size: string;
  price: number;
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
}
