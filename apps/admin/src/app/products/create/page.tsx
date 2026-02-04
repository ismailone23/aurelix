"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Loader2, Save, X } from "lucide-react";
import Link from "next/link";
import { ProductForm } from "@/components/products";
import type { Variant } from "@/components/products";

export default function CreateProductPage() {
  const router = useRouter();
  const [submitErrors, setSubmitErrors] = useState<Record<string, string>>({});

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      router.push("/products");
    },
    onError: (error) => {
      // Handle different error types
      if (error.data?.code === "BAD_REQUEST") {
        const message = error.message;
        if (message.includes("image")) {
          setSubmitErrors({
            images: "File size too large or invalid image format",
          });
        } else if (message.includes("name")) {
          setSubmitErrors({ name: "Product name is required" });
        } else {
          setSubmitErrors({ form: message });
        }
      } else {
        setSubmitErrors({ form: error.message || "Failed to create product" });
      }
    },
  });

  const handleCreate = (data: {
    name: string;
    description: string;
    price: number;
    costPrice?: number;
    discount?: number;
    stock: number;
    images?: string[];
    variants?: Variant[];
  }) => {
    setSubmitErrors({});
    createMutation.mutate({
      name: data.name,
      description: data.description,
      price: data.price,
      costPrice: data.costPrice,
      discount: data.discount,
      stock: data.stock,
      images: data.images,
      variants: data.variants,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 mb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/products"
                className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Back to Products"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  Add Product
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Create a new product with details and variants
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/products">
                <Button variant="ghost" className="text-gray-600">
                  Discard
                </Button>
              </Link>
              <Button
                form="product-form"
                type="submit"
                disabled={createMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 min-w-[120px]"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {createMutation.isPending ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* General Error */}
        {submitErrors.form && (
          <div className="mb-8 animate-in slide-in-from-top-2 fade-in">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-red-100 p-1 rounded-full">
                <X className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900">
                  Submission Error
                </h3>
                <p className="text-sm text-red-700 mt-1">{submitErrors.form}</p>
              </div>
            </div>
          </div>
        )}

        <ProductForm
          mode="create"
          onSubmit={handleCreate}
          isPending={createMutation.isPending}
          errors={submitErrors}
        />
      </div>

      {/* Loading Overlay (Optional or remove if inline loading is enough) */}
      {createMutation.isPending && (
        <div className="fixed inset-0 bg-white/50 z-40 cursor-wait hidden" />
      )}
    </div>
  );
}
