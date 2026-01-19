"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string; // e.g., "10ml", "13ml"
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: number, variant?: string) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
    variant?: string,
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "aurelix-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setItems(parsed);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (i) => i.productId === item.productId && i.variant === item.variant,
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          const existing = updated[existingIndex];
          if (existing) {
            updated[existingIndex] = {
              ...existing,
              quantity: existing.quantity + (item.quantity || 1),
            };
          }
          return updated;
        }

        return [...prev, { ...item, quantity: item.quantity || 1 }];
      });
    },
    [],
  );

  const removeItem = useCallback((productId: number, variant?: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.variant === variant)),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: number, quantity: number, variant?: string) => {
      if (quantity <= 0) {
        removeItem(productId, variant);
        return;
      }

      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.variant === variant
            ? { ...i, quantity }
            : i,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
