"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export function EmptyCartView() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Add some items to your cart before checking out.
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
