"use client";

import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

interface ProductGalleryProps {
  images: string[] | null;
  name: string;
  stock: number;
  wishlist: boolean;
  onWishlistToggle: () => void;
}

export function ProductGallery({
  images,
  name,
  stock,
  wishlist,
  onWishlistToggle,
}: ProductGalleryProps) {
  const isLowStock = stock <= 5 && stock > 0;
  const isOutOfStock = stock === 0;

  return (
    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center relative group overflow-hidden border border-neutral-100 dark:border-neutral-800">
      {images && Array.isArray(images) && images.length > 0 ? (
        <Image
          src={images[0] as string}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
      ) : (
        <div className="text-6xl font-bold text-neutral-200 dark:text-neutral-700 select-none">
          {name.charAt(0)}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={onWishlistToggle}
        className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 z-10"
        aria-label="Add to wishlist"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${wishlist
              ? "fill-red-500 text-red-500"
              : "text-neutral-600 dark:text-neutral-300 hover:text-red-500"
            }`}
        />
      </button>

      {isLowStock && (
        <div className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm z-10">
          Low Stock
        </div>
      )}
      {isOutOfStock && (
        <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm z-10">
          Out of Stock
        </div>
      )}
    </div>
  );
}
