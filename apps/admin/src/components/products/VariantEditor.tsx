"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { Variant } from "./types";

interface VariantEditorProps {
  variants: Variant[];
  setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
}

export function VariantEditor({ variants, setVariants }: VariantEditorProps) {
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: "", price: 0, costPrice: 0, discount: 0, stock: 0 },
    ]);
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string | number,
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Variants (Sizes)</label>
        <Button type="button" size="sm" variant="outline" onClick={addVariant}>
          <Plus className="w-4 h-4 mr-1" /> Add Variant
        </Button>
      </div>

      {variants.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          No variants. Add variants for different sizes/prices, or use base
          price below.
        </p>
      ) : (
        <div className="space-y-2">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="flex gap-2 w-full items-end p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <label className="text-xs text-gray-500">
                  Size (e.g., 10ml, 13ml)
                </label>
                <input
                  type="text"
                  value={variant.size}
                  onChange={(e) => updateVariant(index, "size", e.target.value)}
                  placeholder="e.g., 10ml"
                  className="w-full border rounded px-2 py-1 text-sm"
                  required
                />
              </div>
              <div className="w-24">
                <label className="text-xs text-gray-500">Cost (৳)</label>
                <input
                  type="number"
                  value={variant.costPrice || 0}
                  onChange={(e) =>
                    updateVariant(
                      index,
                      "costPrice",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  placeholder="Cost"
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="w-24">
                <label className="text-xs text-gray-500">Sell (৳)</label>
                <input
                  type="number"
                  value={variant.price}
                  onChange={(e) =>
                    updateVariant(index, "price", parseInt(e.target.value) || 0)
                  }
                  placeholder="Sell Price"
                  className="w-full border rounded px-2 py-1 text-sm"
                  required
                />
              </div>
              <div className="w-20">
                <label className="text-xs text-gray-500">Discount %</label>
                <input
                  type="number"
                  value={variant.discount || 0}
                  onChange={(e) =>
                    updateVariant(
                      index,
                      "discount",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  placeholder="0-100"
                  min="0"
                  max="100"
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="w-20">
                <label className="text-xs text-gray-500">Stock</label>
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) =>
                    updateVariant(index, "stock", parseInt(e.target.value) || 0)
                  }
                  placeholder="Stock"
                  className="w-full border rounded px-2 py-1 text-sm"
                  required
                />
              </div>
              <div className="w-16 text-center">
                <label className="text-xs text-gray-500">Profit</label>
                <div className="text-sm font-semibold text-green-600">
                  ৳{variant.price - (variant.costPrice || 0)}
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => removeVariant(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
