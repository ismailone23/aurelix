"use client";

import React, { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { VariantEditor } from "./VariantEditor";
import { ImageUploader } from "./ImageUploader";
import type { Product, Variant } from "./types";

interface ProductFormModalProps {
  mode: "create" | "edit";
  product?: Product;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    isActive?: boolean;
    images?: string[];
    variants?: Variant[];
  }) => void;
  isPending: boolean;
}

export function ProductFormModal({
  mode,
  product,
  onClose,
  onSubmit,
  isPending,
}: ProductFormModalProps) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [variants, setVariants] = useState<Variant[]>(product?.variants || []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Calculate total stock from variants if variants exist
    const totalStock =
      variants.length > 0
        ? variants.reduce((sum, v) => sum + v.stock, 0)
        : parseInt(formData.get("stock") as string) || 0;

    // Use base price or first variant price
    const basePrice =
      variants.length > 0
        ? Math.min(...variants.map((v) => v.price))
        : parseInt(formData.get("price") as string) || 0;

    onSubmit({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: basePrice,
      stock: totalStock,
      isActive: mode === "edit" ? formData.get("isActive") === "on" : undefined,
      images: images.length > 0 ? images : undefined,
      variants: variants.length > 0 ? variants : undefined,
    });
  };

  const title = mode === "create" ? "Create Product" : "Edit Product";
  const subtitle =
    mode === "create"
      ? "Add a new product to your inventory"
      : "Update product details";
  const submitText = mode === "create" ? "Create Product" : "Update Product";
  const pendingText = mode === "create" ? "Creating..." : "Updating...";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              name="name"
              defaultValue={product?.name}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={product?.description ?? ""}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              rows={3}
              placeholder="Product description"
            />
          </div>

          {/* Variants */}
          <VariantEditor variants={variants} setVariants={setVariants} />

          {/* Show price/stock fields only if no variants */}
          {variants.length === 0 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (৳)
                </label>
                <input
                  name="price"
                  type="number"
                  defaultValue={product?.price}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  name="stock"
                  type="number"
                  defaultValue={product?.stock}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0"
                />
              </div>
            </>
          )}

          {/* Active Status (Edit mode only) */}
          {mode === "edit" && product && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={product.isActive}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label className="text-sm font-medium text-gray-700">
                Product is active and visible
              </label>
            </div>
          )}

          {/* Image Upload */}
          <ImageUploader images={images} setImages={setImages} />

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? pendingText : submitText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
