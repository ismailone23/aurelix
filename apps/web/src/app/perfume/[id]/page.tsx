"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import { getPerfumeById } from "@/lib/perfumes";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PerfumeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  const perfume = getPerfumeById(id);

  const [selectedSize, setSelectedSize] = useState<string>(
    perfume?.sizes[0]?.ml.toString() || "3"
  );
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  const selectedPriceData = perfume?.sizes.find(
    (s) => s.ml.toString() === selectedSize
  );
  const selectedPrice =
    selectedPriceData?.price ?? perfume?.sizes[0]?.price ?? 0;
  const totalPrice = selectedPrice * quantity;

  if (!perfume) {
    return (
      <div className="px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Perfume Not Found</h1>
          <p className="text-lg opacity-70 mb-6">
            Sorry, we couldn't find the perfume you're looking for.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8 flex gap-2 text-sm opacity-70">
          <Link href="/" className="hover:opacity-100">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/${perfume.category}`}
            className="hover:opacity-100 capitalize"
          >
            {perfume.category}
          </Link>
          <span>/</span>
          <span>{perfume.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg h-96 flex items-center justify-center mb-4 relative group overflow-hidden">
              <Image
                src={`/${perfume.image}`}
                alt={perfume.name}
                width={400}
                height={400}
                className="w-full h-full object-contain"
              />

              {/* Wishlist Button */}
              <button
                onClick={() => setWishlist(!wishlist)}
                className="absolute top-4 right-4 p-2 bg-white dark:bg-neutral-900 rounded-full shadow-lg hover:scale-110 transition-transform"
                aria-label="Add to wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${
                    wishlist ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </button>

              {perfume.popular && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Popular
                </div>
              )}
            </div>

            {/* Size Guide */}
            <div className="border border-neutral-300 dark:border-neutral-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Available Sizes</h3>
              <div className="grid grid-cols-3 gap-2">
                {perfume.sizes.map((size) => (
                  <button
                    key={size.ml}
                    onClick={() => setSelectedSize(size.ml.toString())}
                    className={`p-2 rounded border text-sm font-medium transition-colors ${
                      selectedSize === size.ml.toString()
                        ? "bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100"
                        : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {size.ml}ml
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">{perfume.name}</h1>
              <p className="text-lg opacity-70">{perfume.description}</p>
            </div>

            {/* Price Section */}
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 mb-6">
              <div className="flex items-end gap-4 mb-4">
                <div>
                  <p className="text-sm opacity-70 mb-1">Price</p>
                  <p className="text-4xl font-bold">৳{selectedPrice}</p>
                </div>
                <p className="text-sm opacity-60">for {selectedSize} mL</p>
              </div>

              <div className="border-t border-neutral-300 dark:border-neutral-700 pt-4">
                <p className="text-sm opacity-70 mb-1">
                  Total (qty: {quantity})
                </p>
                <p className="text-3xl font-bold">৳{totalPrice}</p>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Quantity
                </label>
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
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button className="w-full py-3 text-lg" size="lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Details Tabs */}
            <Tabs defaultValue="description" className="mt-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4 space-y-3">
                <div>
                  <h3 className="font-semibold mb-2">About {perfume.name}</h3>
                  <p className="opacity-70">
                    {perfume.description}. Each bottle is carefully crafted with
                    premium ingredients to ensure the highest quality fragrance
                    experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Longevity</h3>
                  <p className="opacity-70">
                    This fragrance has a longevity of 6-8 hours on the skin,
                    depending on skin type and application method.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="mt-4">
                <div className="space-y-3">
                  <p className="opacity-70">
                    Free shipping on orders over ৳2500. Standard shipping takes
                    5-7 business days.
                  </p>
                  <p className="opacity-70">
                    Express shipping available for ৳299 (2-3 business days).
                  </p>
                  <p className="opacity-70">
                    30-day money-back guarantee if you're not satisfied.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <p className="opacity-70">
                  No reviews yet. Be the first to review this product!
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
