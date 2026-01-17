"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/product-card";
import type { Product } from "@/lib/products";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: products, isLoading } = trpc.products.list.useQuery({
    limit: 50,
    offset: 0,
  });

  // Filter products based on search query
  const filteredProducts = products?.filter((product) => {
    if (!debouncedQuery.trim()) return true;
    const query = debouncedQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });

  const hasResults = filteredProducts && filteredProducts.length > 0;
  const showNoResults = debouncedQuery.trim() && !isLoading && !hasResults;

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search Header */}
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Search Products
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Find your perfect fragrance
            </p>

            {/* Search Input */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Search for perfumes, brands, scents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-12 text-base rounded-xl border-neutral-300 dark:border-neutral-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-400" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          {debouncedQuery.trim() && !isLoading && (
            <div className="mb-6">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {hasResults ? (
                  <>
                    Found{" "}
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {filteredProducts.length}
                    </span>{" "}
                    result{filteredProducts.length !== 1 ? "s" : ""} for "
                    {debouncedQuery}"
                  </>
                ) : (
                  <>No results found for "{debouncedQuery}"</>
                )}
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          )}

          {/* No Results */}
          {showNoResults && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-neutral-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Try adjusting your search terms or browse our collection
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg font-medium transition-all"
              >
                Browse All Products
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && hasResults && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product as Product} />
              ))}
            </div>
          )}

          {/* Browse All (when no search query) */}
          {!debouncedQuery.trim() && !isLoading && hasResults && (
            <div className="mb-6">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Showing all{" "}
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
