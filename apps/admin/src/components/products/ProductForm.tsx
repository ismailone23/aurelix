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

      const stockStr = formData.get("stock") as string;
      if (stockStr && stockStr.trim() !== "") {
        const stock = parseInt(stockStr);
        if (isNaN(stock) || stock < 0) {
          newErrors.stock = "Stock must be 0 or greater";
        }
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
        // Variant stock is already handled by type safety usually, but good to be safe
        if (variant?.stock !== undefined && (isNaN(variant.stock) || variant.stock < 0)) {
          newErrors[`variant_${i}_stock`] = "Variant stock must be 0 or greater";
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

  const submitText = mode === "create" ? "Create Product" : "Save Changes";
  const pendingText = mode === "create" ? "Creating..." : "Saving...";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {mode === "create" ? "Add New Product" : "Edit Product"}
        </h2>
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
          >
            {isPending ? pendingText : submitText}
          </Button>
        </div>
      </div>

      {/* Error Summary */}
      {(Object.keys(localErrors).length > 0 ||
        Object.keys(errors).length > 0) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Basic Information */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Name *
                </label>
                <input
                  name="name"
                  defaultValue={product?.name}
                  className={`w-full border rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${localErrors.name ? "border-red-300" : "border-gray-200 hover:border-gray-300"
                    }`}
                  placeholder="e.g. Midnight Jasmine Perfume"
                />
                {localErrors.name && (
                  <p className="text-red-500 text-sm mt-1.5">{localErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  defaultValue={product?.description ?? ""}
                  className={`w-full border rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none ${localErrors.description ? "border-red-300" : "border-gray-200 hover:border-gray-300"
                    }`}
                  rows={5}
                  placeholder="Enter detailed product description..."
                />
                {localErrors.description && (
                  <p className="text-red-500 text-sm mt-1.5">
                    {localErrors.description}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section: Variants & Pricing */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">
              Pricing & Variants
            </h3>

            <div>
              <VariantEditor variants={variants} setVariants={setVariants} />

              {variants.length > 0 && (
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  {variants.map((v, i) => (
                    <div key={i}>
                      {localErrors[`variant_${i}_size`] && (
                        <p className="text-red-500">{localErrors[`variant_${i}_size`]}</p>
                      )}
                      {localErrors[`variant_${i}_price`] && (
                        <p className="text-red-500">{localErrors[`variant_${i}_price`]}</p>
                      )}
                      {localErrors[`variant_${i}_stock`] && (
                        <p className="text-red-500">{localErrors[`variant_${i}_stock`]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Stock (Fallback if no variants) */}
            {variants.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="bg-gray-50/50 p-4 rounded-lg space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Pricing Strategy</h4>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                      Selling Price (৳) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400">৳</span>
                      <input
                        name="price"
                        type="number"
                        defaultValue={product?.price}
                        className={`w-full border pl-8 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${localErrors.price ? "border-red-300" : "border-gray-200"
                          }`}
                        placeholder="0.00"
                      />
                    </div>
                    {localErrors.price && (
                      <p className="text-red-500 text-sm mt-1.5">{localErrors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                      Cost Price (৳)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400">৳</span>
                      <input
                        name="costPrice"
                        type="number"
                        defaultValue={product?.costPrice || ""}
                        className="w-full border border-gray-200 pl-8 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="0.00"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">For profit calculation only</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                      Discount (%)
                    </label>
                    <input
                      name="discount"
                      type="number"
                      defaultValue={product?.discount || ""}
                      min="0"
                      max="100"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="0%"
                    />
                  </div>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-lg space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Inventory</h4>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                      Stock Quantity
                    </label>
                    <input
                      name="stock"
                      type="number"
                      defaultValue={product?.stock}
                      className={`w-full border rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${localErrors.stock ? "border-red-300" : "border-gray-200"
                        }`}
                      placeholder="0"
                    />
                    {localErrors.stock && (
                      <p className="text-red-500 text-sm mt-1.5">{localErrors.stock}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Media & Settings */}
        <div className="space-y-8">
          {/* Section: Media */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">
              Product Media
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gallery {mode === "create" && "*"}
                  <span className="text-gray-400 text-xs font-normal ml-2">
                    Max 5 images
                  </span>
                </label>
                <ImageUploader images={images} setImages={setImages} />
                {localErrors.images && (
                  <p className="text-red-500 text-sm mt-1.5">{localErrors.images}</p>
                )}
              </div>
            </div>
          </section>

          {/* Section: Status */}
          {mode === "edit" && product && (
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                Availability
              </h3>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-900">
                  Active Status
                </label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={product.isActive}
                    id="toggle"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 right-6"
                  />
                  <label
                    htmlFor="toggle"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:bg-blue-600"
                  ></label>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </form>
  );
}
