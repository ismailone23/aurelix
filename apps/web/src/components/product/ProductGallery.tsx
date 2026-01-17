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
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center relative group overflow-hidden">
      {images && Array.isArray(images) && images.length > 0 ? (
        <Image
          src={images[0] as string}
          alt={name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="text-6xl font-bold text-neutral-300 dark:text-neutral-600">
          {name.charAt(0)}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={onWishlistToggle}
        className="absolute top-4 right-4 p-2 bg-white dark:bg-neutral-900 rounded-full shadow-lg hover:scale-110 transition-transform"
        aria-label="Add to wishlist"
      >
        <Heart
          className={`w-5 h-5 ${wishlist ? "fill-red-500 text-red-500" : ""}`}
        />
      </button>

      {isLowStock && (
        <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Low Stock
        </div>
      )}
      {isOutOfStock && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Out of Stock
        </div>
      )}
    </div>
  );
}
