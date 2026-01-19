"use client";

import React, { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { AlertCircle, XCircle } from "lucide-react";
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
    costPrice?: number;
    stock: number;
    isActive?: boolean;
    images?: string[];
    variants?: Variant[];
  }) => void;
  isPending: boolean;
  errors?: Record<string, string>;
}

const MAX_IMAGES = 5;

export function ProductFormModal({
  mode,
  product,
  onClose,
  onSubmit,
  isPending,
  errors = {},
}: ProductFormModalProps) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [variants, setVariants] = useState<Variant[]>(product?.variants || []);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};

    const name = formData.get("name") as string;
    if (!name || name.trim().length === 0) {
      newErrors.name = "Product name is required";
    }

    const description = formData.get("description") as string;
    if (!description || description.trim().length === 0) {
      newErrors.description = "Product description is required";
    }

    if (variants.length === 0) {
      const price = parseInt(formData.get("price") as string);
      if (isNaN(price) || price <= 0) {
        newErrors.price = "Price must be greater than 0";
      }

      const stock = parseInt(formData.get("stock") as string);
      if (isNaN(stock) || stock < 0) {
        newErrors.stock = "Stock must be 0 or greater";
      }
    } else {
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        if (!variant?.size || variant.size.trim().length === 0) {
          newErrors[`variant_${i}_size`] = "Variant size is required";
        }
        if (isNaN(variant?.price || 0) || (variant?.price || 0) <= 0) {
          newErrors[`variant_${i}_price`] =
            "Variant price must be greater than 0";
        }
        if (isNaN(variant?.stock || 0) || (variant?.stock || 0) < 0) {
          newErrors[`variant_${i}_stock`] =
            "Variant stock must be 0 or greater";
        }
      }
    }

    const costPrice = formData.get("costPrice") as string;
    if (costPrice && (isNaN(parseInt(costPrice)) || parseInt(costPrice) < 0)) {
      newErrors.costPrice = "Cost price must be 0 or greater";
    }

    if (images.length > MAX_IMAGES) {
      newErrors.images = `Maximum ${MAX_IMAGES} images allowed`;
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) {
      return;
    }

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

    const costPriceValue = formData.get("costPrice") as string;

    onSubmit({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: basePrice,
      costPrice: costPriceValue ? parseInt(costPriceValue) : undefined,
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

  const allErrors = { ...localErrors, ...errors };
  const hasErrors = Object.keys(allErrors).length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>

        {/* Error Summary */}
        {hasErrors && (
          <div className="bg-red-50 border-b border-red-200 p-4">
            <div className="flex gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <h3 className="font-semibold text-red-900">
                Please fix the following errors:
              </h3>
            </div>
            <ul className="space-y-1 ml-7 text-sm text-red-800">
              {Object.entries(allErrors).map(([key, message]) => (
                <li key={key} className="flex gap-2">
                  <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              name="name"
              defaultValue={product?.name}
              required
              className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                localErrors.name ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="Product name"
            />
            {localErrors.name && (
              <p className="text-red-600 text-xs mt-1">{localErrors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={product?.description ?? ""}
              className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
                localErrors.description ? "border-red-300" : "border-gray-200"
              }`}
              rows={3}
              placeholder="Product description"
            />
            {localErrors.description && (
              <p className="text-red-600 text-xs mt-1">
                {localErrors.description}
              </p>
            )}
          </div>

          {/* Variants */}
          <VariantEditor variants={variants} setVariants={setVariants} />

          {/* Show price/stock fields only if no variants */}
          {variants.length === 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (৳)
                  </label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={product?.price}
                    required
                    className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      localErrors.price ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="0"
                  />
                  {localErrors.price && (
                    <p className="text-red-600 text-xs mt-1">
                      {localErrors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Price (৳)
                  </label>
                  <input
                    name="costPrice"
                    type="number"
                    defaultValue={product?.costPrice || ""}
                    className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      localErrors.costPrice
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                    placeholder="0"
                  />
                  {localErrors.costPrice && (
                    <p className="text-red-600 text-xs mt-1">
                      {localErrors.costPrice}
                    </p>
                  )}
                </div>
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
                  className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    localErrors.stock ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="0"
                />
                {localErrors.stock && (
                  <p className="text-red-600 text-xs mt-1">
                    {localErrors.stock}
                  </p>
                )}
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
