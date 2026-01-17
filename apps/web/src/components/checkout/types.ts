export interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  notes: string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image?: string;
}

export type FormErrors = Record<string, string>;
