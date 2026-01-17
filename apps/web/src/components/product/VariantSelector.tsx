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
    <div className="mb-6">
      <label className="text-sm font-medium mb-3 block">Select Size</label>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant, index) => (
          <button
            key={index}
            onClick={() => onSelect(variant)}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${
              selectedVariant?.size === variant.size
                ? "border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-500"
            } ${variant.stock === 0 ? "opacity-50 line-through" : ""}`}
            disabled={variant.stock === 0}
          >
            <span className="font-medium">{variant.size}</span>
            <span className="ml-2 text-sm">৳{variant.price}</span>
            {variant.stock === 0 && (
              <span className="ml-2 text-xs text-red-500">(Out of Stock)</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
