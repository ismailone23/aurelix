"use client";

import React from "react";
import type { Variant } from "./types";

interface PriceSectionProps {
  price: number;
  quantity: number;
  selectedVariant: Variant | null;
}

export function PriceSection({
  price,
  quantity,
  selectedVariant,
}: PriceSectionProps) {
  const totalPrice = price * quantity;

  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
      <div className="flex items-end gap-4 mb-4">
        <div>
          <p className="text-sm opacity-70 mb-1">Price</p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold">
            ৳{price}
            {selectedVariant && (
              <span className="text-base md:text-lg ml-2 font-normal opacity-70">
                ({selectedVariant.size})
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="border-t border-neutral-300 dark:border-neutral-700 pt-4">
        <p className="text-sm opacity-70 mb-1">Total (qty: {quantity})</p>
        <p className="text-xl md:text-2xl lg:text-3xl font-bold">
          ৳{totalPrice.toFixed(0)}
        </p>
      </div>
    </div>
  );
}
