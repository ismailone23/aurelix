"use client";

import ProductCard from "@/components/product-card";
import { trpc } from "@/lib/trpc";

export default function ProductsPage() {
  const { data: products, isLoading } = trpc.products.list.useQuery({
    limit: 50,
    offset: 0,
  });

  return (
    <div className="py-12 md:py-16 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-serif font-light mb-3 text-neutral-900 dark:text-white">
              All Products
            </h1>
            <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400">
              Browse our complete collection of premium fragrances
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-neutral-200 dark:bg-neutral-800 aspect-square rounded-2xl mb-3" />
                  <div className="bg-neutral-200 dark:bg-neutral-800 h-4 rounded mb-2" />
                  <div className="bg-neutral-200 dark:bg-neutral-800 h-4 w-2/3 rounded" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product as import("@/lib/products").Product}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-neutral-900/50 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
              <p className="text-lg text-neutral-500">No products available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
