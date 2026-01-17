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
import { useCart } from "@/contexts/cart-context";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price / 100, // Convert cents to currency
      quantity,
      image: product.images ? product.images[0] : "",
    });
    setDialogOpen(false);
    setQuantity(1);
  };

  return (
    <>
      <div className="group relative bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all">
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

          {/* Floating Add to Cart Button */}
          <button
            onClick={() => setDialogOpen(true)}
            className="absolute top-2 right-2 md:top-3 md:right-3 p-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
          </button>

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
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs md:text-sm opacity-70 mb-2 md:mb-3 line-clamp-3 hidden sm:block">
            {product.description || "Premium quality product"}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2 md:mb-3">
            <span className="text-base md:text-xl font-bold">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* View Details Button */}
          <Link
            href={`/product/${product.id}`}
            className="block w-full text-center px-3 md:px-4 py-1.5 md:py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs md:text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Add to Cart Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add {product.name} to Cart</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  −
                </button>
                <span className="w-12 text-center text-lg font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg">
              <p className="text-sm opacity-70 mb-1">Total Price:</p>
              <p className="text-2xl font-bold">
                {formatPrice(product.price * quantity)}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={handleAddToCart} disabled={product.stock === 0}>
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
