"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Loader2 } from "lucide-react";
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
      stock: data.stock,
      images: data.images,
      variants: data.variants,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/products">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Product
            </h1>
            <p className="text-gray-600 mt-1">
              Add a new product to your inventory. Fill in all required fields
              marked with an asterisk (*)
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* General Error */}
          {submitErrors.form && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-700 text-sm mt-1">{submitErrors.form}</p>
            </div>
          )}

          <ProductForm
            mode="create"
            onSubmit={handleCreate}
            isPending={createMutation.isPending}
            errors={submitErrors}
          />
        </div>

        {/* Loading State */}
        {createMutation.isPending && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-700 font-medium">Creating product...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
