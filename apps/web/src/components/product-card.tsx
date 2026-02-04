"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice } from "@/lib/products";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <div className="group relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
        {/* Image Container with Floating Add to Cart */}
        <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex items-center justify-center">
          {product.images && product.images.length > 0 && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-4xl font-bold text-neutral-300 dark:text-neutral-600">
              {product.name.charAt(0)}
            </div>
          )}
          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-amber-500 text-white px-2 py-0.5 md:py-1 rounded text-xs font-semibold">
              Low Stock
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white px-2 py-0.5 md:py-1 rounded text-xs font-semibold">
              Out of Stock
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 md:p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mb-2 md:mb-3 line-clamp-3 hidden sm:block">
            {product.description || "Premium quality product"}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2 md:mb-3">
            <span className="text-base md:text-xl font-bold text-neutral-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* View Details Button */}
          <Link
            href={`/products/${product.id}`}
            className="block w-full text-center px-3 md:px-4 py-1.5 md:py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs md:text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </>
  );
}
