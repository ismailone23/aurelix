"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product-card";

export default function Page() {
  const { data: products, isLoading } = trpc.products.list.useQuery({
    limit: 8,
    offset: 0,
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden">
        {/* Background accent shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-neutral-100 dark:bg-neutral-900 rounded-bl-[100px] z-0" />

        <div className="container mx-auto px-4 lg:px-8 z-10 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-[0.95] tracking-tight text-neutral-900 dark:text-white mb-8">
                <span className="italic">Sensual</span>
                <br />
                <span className="font-normal">Exuberant</span>
                <br />
                <span className="italic">Addictive</span>
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10 max-w-md leading-relaxed">
                Discover our curated collection of premium fragrances. Each scent is crafted to leave a lasting, unforgettable impression.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all transform hover:scale-105 shadow-lg group"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right - Hero Image Composition */}
            <div className="relative h-[500px] lg:h-[600px] hidden lg:block">
              {/* Main perfume bottle placeholder - using gradient */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-lg shadow-2xl z-20 flex items-center justify-center">
                <span className="text-white/30 text-sm tracking-widest uppercase">Featured</span>
              </div>

              {/* Accent image - lifestyle */}
              <div className="absolute top-20 left-0 w-32 h-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg rotate-12 shadow-lg overflow-hidden z-10" />

              {/* Decorative circle */}
              <div className="absolute bottom-20 right-10 w-6 h-6 bg-neutral-900 dark:bg-white rounded-full z-30" />
              <div className="absolute top-32 right-20 w-4 h-4 bg-neutral-400 rounded-full z-30" />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Arrivals Section */}
      <section className="py-20 md:py-28 bg-neutral-50 dark:bg-neutral-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center gap-6 mb-16">
              <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 dark:text-white">
                Latest Arrival
              </h2>
              <div className="flex-1 flex items-center gap-4">
                <div className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                <ArrowRight className="w-5 h-5 text-neutral-400" />
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-neutral-200 dark:bg-neutral-800 aspect-[3/4] rounded-2xl mb-4" />
                    <div className="bg-neutral-200 dark:bg-neutral-800 h-5 rounded mb-2 w-3/4" />
                    <div className="bg-neutral-200 dark:bg-neutral-800 h-4 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product as import("@/lib/products").Product}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-neutral-900/50 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
                <p className="text-xl text-neutral-500">No products available yet.</p>
              </div>
            )}

            {/* View All Link */}
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium transition-colors group"
              >
                View all products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-16 bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">Free Shipping</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">On orders over ৳2500</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">100% Authentic</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">Genuine products only</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">Easy Returns</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">7-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
