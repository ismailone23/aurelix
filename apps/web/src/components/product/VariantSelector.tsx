"use client";

import React from "react";
import type { Variant } from "./types";

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onSelect: (variant: Variant) => void;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Select Size</label>
        {selectedVariant && (
          <span className="text-xs font-medium text-neutral-500">
            {selectedVariant.stock} available
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant, index) => {
          const isSelected = selectedVariant?.size === variant.size;
          const isOutOfStock = variant.stock === 0;

          return (
            <button
              key={index}
              onClick={() => onSelect(variant)}
              disabled={isOutOfStock}
              className={`
                    group relative px-5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200
                    ${isSelected
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-md transform scale-[1.02]"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm"
                }
                    ${isOutOfStock ? "opacity-40 cursor-not-allowed bg-neutral-50 dark:bg-neutral-800/50" : ""}
                `}
            >
              <div className="flex items-center gap-2">
                <span>{variant.size}</span>
                <span className={`text-xs ${isSelected ? "text-neutral-200 dark:text-neutral-600" : "text-neutral-400"}`}>
                  | ৳{variant.price}
                </span>
              </div>
              {isOutOfStock && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-neutral-300 dark:bg-neutral-600 -rotate-12" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
