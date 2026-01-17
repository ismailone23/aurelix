"use client";

import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

interface ProductTabsProps {
  productName: string;
  description: string | null;
}

export function ProductTabs({ productName, description }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="mt-6 md:mt-8">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-4 space-y-3">
        <div>
          <h3 className="font-semibold mb-2">About {productName}</h3>
          <p className="opacity-70 text-sm md:text-base">
            {description || "Premium quality fragrance"}. Each bottle is
            carefully crafted with premium ingredients to ensure the highest
            quality fragrance experience.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="shipping" className="mt-4">
        <div className="space-y-3 text-sm md:text-base">
          <p className="opacity-70">
            Free shipping on orders over ৳2500. Standard shipping takes 5-7
            business days.
          </p>
          <p className="opacity-70">
            Express shipping available for ৳299 (2-3 business days).
          </p>
          <p className="opacity-70">
            30-day money-back guarantee if you&apos;re not satisfied.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
