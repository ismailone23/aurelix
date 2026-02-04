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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-900">Variants</label>
          <p className="text-xs text-gray-500">Manage different sizes and prices</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={addVariant} className="border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600">
          <Plus className="w-4 h-4 mr-1" /> Add Variant
        </Button>
      </div>

      {variants.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-500">
            No variants added. The product will use base pricing.
          </p>
          <Button type="button" variant="link" onClick={addVariant} className="text-blue-600 h-auto p-0 mt-2">
            Add your first variant
          </Button>
        </div>
      ) : (
        <div className="bg-gray-50/50 rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Cost Price (৳)</th>
                  <th className="px-4 py-3 font-medium">Sell Price (৳)</th>
                  <th className="px-4 py-3 font-medium">Discount %</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Profit</th>
                  <th className="px-2 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {variants.map((variant, index) => (
                  <tr key={index} className="group hover:bg-gray-50/50">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={variant.size}
                        onChange={(e) => updateVariant(index, "size", e.target.value)}
                        placeholder="e.g. 10ml"
                        className="w-full border-gray-200 rounded-md text-sm focus:ring-blue-500/20 focus:border-blue-500"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-gray-400 text-xs">৳</span>
                        <input
                          type="number"
                          value={variant.costPrice || ""}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "costPrice",
                              e.target.value ? parseFloat(e.target.value) : 0,
                            )
                          }
                          placeholder="0"
                          className="w-24 pl-6 border-gray-200 rounded-md text-sm focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-gray-400 text-xs">৳</span>
                        <input
                          type="number"
                          value={variant.price || ""}
                          onChange={(e) =>
                            updateVariant(index, "price", e.target.value ? parseFloat(e.target.value) : 0)
                          }
                          placeholder="0"
                          className="w-24 pl-6 border-gray-200 rounded-md text-sm focus:ring-blue-500/20 focus:border-blue-500 bg-blue-50/30"
                          required
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={variant.discount || ""}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "discount",
                            e.target.value ? parseFloat(e.target.value) : 0,
                          )
                        }
                        placeholder="0"
                        min="0"
                        max="100"
                        className="w-20 border-gray-200 rounded-md text-sm focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={variant.stock || ""}
                        onChange={(e) =>
                          updateVariant(index, "stock", e.target.value ? parseInt(e.target.value) : 0)
                        }
                        placeholder="0"
                        className="w-20 border-gray-200 rounded-md text-sm focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`font-medium ${(variant.price - (variant.costPrice || 0)) > 0
                        ? 'text-green-600'
                        : 'text-gray-400'
                        }`}>
                        ৳{variant.price - (variant.costPrice || 0)}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeVariant(index)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
