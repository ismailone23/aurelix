"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Perfume } from "@/lib/perfumes";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { ShoppingCart } from "lucide-react";

interface PerfumeCardProps {
  perfume: Perfume;
}

export default function PerfumeCard({ perfume }: PerfumeCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(
    perfume.sizes[0]?.ml.toString() || "0"
  );

  const selectedPriceData = perfume.sizes.find(
    (s) => s.ml.toString() === selectedSize
  );
  const selectedPrice =
    selectedPriceData?.price || perfume.sizes[0]?.price || 0;

  const handleAddToCart = () => {
    console.log(
      `Added ${perfume.name} (${selectedSize}mL) to cart at ৳${selectedPrice}`
    );
    setDialogOpen(false);
  };

  return (
    <>
      <div className="group relative bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image Container with Floating Add to Cart */}
        <div className="relative h-64 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
          <Image
            src={`/${perfume.image}`}
            alt={perfume.name}
            width={300}
            height={256}
            className="w-full h-full object-cover"
          />

          {/* Floating Add to Cart Button */}
          <button
            onClick={() => setDialogOpen(true)}
            className="absolute top-3 right-3 p-2 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-full shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>

          {/* Popular Badge */}
          {perfume.popular && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Popular
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <Link href={`/perfume/${perfume.id}`}>
            <h3 className="text-lg font-semibold mb-2 hover:text-orange-600 transition-colors">
              {perfume.name}
            </h3>
          </Link>

          <p className="text-sm opacity-70 mb-3 line-clamp-2">
            {perfume.description}
          </p>

          {/* Price Range */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold">
              ৳{perfume.sizes[0]?.price}
            </span>
            <span className="text-sm opacity-60">
              - ৳{perfume.sizes[perfume.sizes.length - 1]?.price}
            </span>
          </div>

          {/* View Details Button */}
          <Link
            href={`/perfume/${perfume.id}`}
            className="block w-full text-center px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Add to Cart Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add {perfume.name} to Cart</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Size
              </label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {perfume.sizes.map((size) => (
                    <SelectItem key={size.ml} value={size.ml.toString()}>
                      {size.ml} mL - ৳{size.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg">
              <p className="text-sm opacity-70 mb-1">Total Price:</p>
              <p className="text-2xl font-bold">৳{selectedPrice}</p>
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
            <Button onClick={handleAddToCart}>Add to Cart</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
