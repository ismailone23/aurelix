"use client";

import ProductCard from "@/components/product-card";
import { trpc } from "@/lib/trpc";

export default function ProductsPage() {
  const { data: products, isLoading } = trpc.products.list.useQuery({
    limit: 50,
    offset: 0,
  });

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              All Products
            </h1>
            <p className="text-base md:text-lg opacity-70">
              Browse our complete collection of premium fragrances
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-neutral-200 dark:bg-neutral-800 aspect-square rounded-lg mb-3"></div>
                  <div className="bg-neutral-200 dark:bg-neutral-800 h-4 rounded mb-2"></div>
                  <div className="bg-neutral-200 dark:bg-neutral-800 h-4 w-2/3 rounded"></div>
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
            <div className="text-center py-12">
              <p className="text-lg opacity-70">No products available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
