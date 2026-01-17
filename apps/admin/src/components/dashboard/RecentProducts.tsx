"use client";

import React from "react";
import Link from "next/link";
import { Package } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface RecentProductsProps {
  products: Product[] | undefined;
  isLoading: boolean;
}

export function RecentProducts({ products, isLoading }: RecentProductsProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
        <Link
          href="/products"
          className="text-sm text-blue-600 hover:underline"
        >
          View all →
        </Link>
      </div>
      {isLoading && !products ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : products?.length ? (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">
                  {product.name}
                </span>
              </div>
              <span className="font-semibold text-gray-900">
                ৳{product.price}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">No products yet</p>
      )}
    </div>
  );
}
