"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/cart-context";
import {
  ProductGallery,
  VariantSelector,
  PriceSection,
  QuantityAddToCart,
  ProductTabs,
  type Variant,
} from "@/components/product";

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const productId = parseInt(id, 10);

  const {
    data: product,
    isLoading,
    error,
  } = trpc.products.getById.useQuery(productId, {
    enabled: !isNaN(productId),
  });

  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const { addItem } = useCart();

  // Get variants from product
  const variants = (product?.variants as Variant[] | null) || [];
  const hasVariants = variants.length > 0;

  // Set default variant when product loads
  React.useEffect(() => {
    if (hasVariants && !selectedVariant && variants[0]) {
      setSelectedVariant(variants[0]);
    }
  }, [product, hasVariants, variants, selectedVariant]);

  // Calculate current price and stock based on variant or base product
  const currentPrice = selectedVariant
    ? selectedVariant.price
    : (product?.price ?? 0);
  const currentStock = selectedVariant
    ? selectedVariant.stock
    : (product?.stock ?? 0);
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      quantity,
      variant: selectedVariant?.size,
      image: product.images ? product.images[0] : "",
    });
    setQuantity(1);
  };

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  if (isLoading) {
    return (
      <div className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="animate-pulse">
              <div className="bg-neutral-200 dark:bg-neutral-800 h-96 rounded-lg"></div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="bg-neutral-200 dark:bg-neutral-800 h-8 w-2/3 rounded"></div>
              <div className="bg-neutral-200 dark:bg-neutral-800 h-4 rounded"></div>
              <div className="bg-neutral-200 dark:bg-neutral-800 h-4 w-1/2 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-lg opacity-70 mb-6">
            Sorry, we couldn&apos;t find the product you&apos;re looking for.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 md:mb-8 flex flex-wrap gap-2 text-sm opacity-70">
            <Link href="/" className="hover:opacity-100">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:opacity-100">
              Products
            </Link>
            <span>/</span>
            <span className="truncate">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div>
              <ProductGallery
                images={product.images as string[] | null}
                name={product.name}
                stock={currentStock}
                wishlist={wishlist}
                onWishlistToggle={() => setWishlist(!wishlist)}
              />
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-4 md:mb-6">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  {product.name}
                </h1>
              </div>

              {/* Variant Selection */}
              <VariantSelector
                variants={variants}
                selectedVariant={selectedVariant}
                onSelect={handleVariantSelect}
              />

              {/* Price Section */}
              <PriceSection
                price={currentPrice}
                quantity={quantity}
                selectedVariant={selectedVariant}
              />

              {/* Quantity & Add to Cart */}
              <QuantityAddToCart
                quantity={quantity}
                stock={currentStock}
                isOutOfStock={isOutOfStock}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
              />

              {/* Stock Info */}
              <p className="text-sm opacity-60 mb-4 md:mb-6">
                {currentStock > 0
                  ? `${currentStock} items in stock${selectedVariant ? ` (${selectedVariant.size})` : ""}`
                  : "Currently out of stock"}
              </p>

              {/* Details Tabs */}
              <ProductTabs
                productName={product.name}
                description={product.description}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
