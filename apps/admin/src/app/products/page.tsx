"use client";

import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import {
  ProductFormModal,
  ProductsTable,
  type Product,
  type Variant,
} from "@/components/products";

export default function ProductsPage() {
  const router = useRouter();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const {
    data: products,
    isLoading,
    refetch,
  } = trpc.products.list.useQuery({ limit: 100, offset: 0 });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingProduct(null);
    },
  });

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleUpdate = (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    isActive?: boolean;
    images?: string[];
    variants?: Variant[];
  }) => {
    if (!editingProduct) return;
    updateMutation.mutate({
      id: editingProduct.id,
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      isActive: data.isActive ?? editingProduct.isActive,
      images: data.images,
      variants: data.variants,
    });
  };

  if (isLoading && !products)
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Products
          </h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-gray-300"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </Button>
          <Button
            onClick={() => router.push("/products/create")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {/* Edit Form Modal */}
      {editingProduct && (
        <ProductFormModal
          mode="edit"
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleUpdate}
          isPending={updateMutation.isPending}
        />
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ProductsTable
          products={(products || []) as Product[]}
          onEdit={(product) => setEditingProduct(product)}
          onDelete={(id) => deleteMutation.mutate(id)}
          isDeleting={deleteMutation.isPending}
        />

        {products?.length === 0 && (
          <div className="text-center py-12">
            <Button
              onClick={() => router.push("/products/create")}
              variant="outline"
              className="mt-4"
            >
              Add your first product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
