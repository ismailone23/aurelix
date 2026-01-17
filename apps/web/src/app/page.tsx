"use client";

import Image from "next/image";
import ProductCard from "@/components/product-card";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

export default function Page() {
  const { data: products, isLoading } = trpc.products.list.useQuery({
    limit: 8,
    offset: 0,
  });

  return (
    <div className="flex flex-col w-full">
      {/* Banner */}
      <div className="w-full">
        <Image
          src="/banner.jpg"
          alt="banner"
          width={1920}
          height={600}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Popular Collection Section */}
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Our Collection
              </h2>
              <p className="text-base md:text-lg opacity-70">
                Discover our premium fragrances
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-neutral-200 dark:bg-neutral-800 aspect-square rounded-lg mb-3"></div>
                    <div className="bg-neutral-200 dark:bg-neutral-800 h-4 rounded mb-2"></div>
                    <div className="bg-neutral-200 dark:bg-neutral-800 h-4 w-2/3 rounded"></div>
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
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

            {/* Browse All */}
            <div className="text-center">
              <Link
                href="/products"
                className="inline-block px-6 md:px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg font-medium transition-all"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
