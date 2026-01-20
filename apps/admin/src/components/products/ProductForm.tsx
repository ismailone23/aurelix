"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { AlertCircle, XCircle } from "lucide-react";
import { VariantEditor } from "./VariantEditor";
import { ImageUploader } from "./ImageUploader";
import type { Product, Variant } from "./types";

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    costPrice?: number;
    discount?: number;
    stock: number;
    isActive?: boolean;
    images?: string[];
    variants?: Variant[];
  }) => void;
  isPending: boolean;
  errors?: Record<string, string>;
}

const MAX_IMAGES = 5;

export function ProductForm({
  mode,
  product,
  onSubmit,
  isPending,
  errors = {},
}: ProductFormProps) {
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

    const discount = formData.get("discount") as string;
    if (
      discount &&
      (isNaN(parseInt(discount)) ||
        parseInt(discount) < 0 ||
        parseInt(discount) > 100)
    ) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    if (images.length === 0 && mode === "create") {
      newErrors.images = "At least one image is required";
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
      discount: (formData.get("discount") as string)
        ? parseInt(formData.get("discount") as string)
        : undefined,
      stock: totalStock,
      isActive: mode === "edit" ? formData.get("isActive") === "on" : undefined,
      images: images.length > 0 ? images : undefined,
      variants: variants.length > 0 ? variants : undefined,
    });
  };

  const submitText = mode === "create" ? "Create Product" : "Update Product";
  const pendingText = mode === "create" ? "Creating..." : "Updating...";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Summary */}
      {(Object.keys(localErrors).length > 0 ||
        Object.keys(errors).length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <h3 className="font-semibold text-red-900">
              Please fix the following errors:
            </h3>
          </div>
          <ul className="space-y-1 ml-7 text-sm text-red-800">
            {Object.entries({ ...localErrors, ...errors }).map(
              ([key, message]) => (
                <li key={key} className="flex gap-2">
                  <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {message}
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Product Name *
        </label>
        <input
          name="name"
          defaultValue={product?.name}
          className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
            localErrors.name ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter product name"
        />
        {localErrors.name && (
          <p className="text-red-600 text-sm mt-1">{localErrors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
            localErrors.description ? "border-red-300" : "border-gray-300"
          }`}
          rows={4}
          placeholder="Enter product description"
        />
        {localErrors.description && (
          <p className="text-red-600 text-sm mt-1">{localErrors.description}</p>
        )}
      </div>

      {/* Variants */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Product Variants (Optional)
        </label>
        <VariantEditor variants={variants} setVariants={setVariants} />
        {variants.length > 0 && (
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            {variants.map((v, i) => (
              <div key={i}>
                {localErrors[`variant_${i}_size`] && (
                  <p className="text-red-600">
                    {localErrors[`variant_${i}_size`]}
                  </p>
                )}
                {localErrors[`variant_${i}_price`] && (
                  <p className="text-red-600">
                    {localErrors[`variant_${i}_price`]}
                  </p>
                )}
                {localErrors[`variant_${i}_stock`] && (
                  <p className="text-red-600">
                    {localErrors[`variant_${i}_stock`]}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price & Stock (only if no variants) */}
      {variants.length === 0 && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Selling Price (৳) *
              </label>
              <input
                name="price"
                type="number"
                defaultValue={product?.price}
                className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  localErrors.price ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0"
              />
              {localErrors.price && (
                <p className="text-red-600 text-sm mt-1">{localErrors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Cost Price (৳) (Optional)
              </label>
              <input
                name="costPrice"
                type="number"
                defaultValue={product?.costPrice || ""}
                className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  localErrors.costPrice ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0"
              />
              {localErrors.costPrice && (
                <p className="text-red-600 text-sm mt-1">
                  {localErrors.costPrice}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Discount (%) (Optional)
              </label>
              <input
                name="discount"
                type="number"
                defaultValue={product?.discount || ""}
                min="0"
                max="100"
                className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  localErrors.discount ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0-100"
              />
              {localErrors.discount && (
                <p className="text-red-600 text-sm mt-1">
                  {localErrors.discount}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Stock Quantity *
              </label>
              <input
                name="stock"
                type="number"
                defaultValue={product?.stock}
                className={`w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  localErrors.stock ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0"
              />
              {localErrors.stock && (
                <p className="text-red-600 text-sm mt-1">{localErrors.stock}</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Product Images {mode === "create" && "*"}
          <span className="text-gray-500 text-xs ml-2">
            Max {MAX_IMAGES} images, 5MB each
          </span>
        </label>
        <ImageUploader images={images} setImages={setImages} />
        {localErrors.images && (
          <p className="text-red-600 text-sm mt-1">{localErrors.images}</p>
        )}
        {images.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <Image
                  src={img}
                  alt={`Product ${idx + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Status (Edit mode only) */}
      {mode === "edit" && product && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={product.isActive}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-900">
              Product is active and visible to customers
            </label>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isPending ? pendingText : submitText}
        </Button>
      </div>
    </form>
  );
}
