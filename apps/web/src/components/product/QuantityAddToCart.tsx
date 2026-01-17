"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface QuantityAddToCartProps {
  quantity: number;
  stock: number;
  isOutOfStock: boolean;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
}

export function QuantityAddToCart({
  quantity,
  stock,
  isOutOfStock,
  onQuantityChange,
  onAddToCart,
}: QuantityAddToCartProps) {
  return (
    <div className="space-y-4 mb-4 md:mb-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Quantity</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            disabled={isOutOfStock}
          >
            −
          </button>
          <span className="w-12 text-center text-lg font-semibold">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(Math.min(stock, quantity + 1))}
            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            disabled={quantity >= stock || isOutOfStock}
          >
            +
          </button>
        </div>
      </div>

      <Button
        className="w-full py-3 text-base md:text-lg"
        size="lg"
        onClick={onAddToCart}
        disabled={isOutOfStock}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  );
}
