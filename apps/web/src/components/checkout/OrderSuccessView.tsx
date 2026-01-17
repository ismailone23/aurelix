"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { CheckCircle } from "lucide-react";

interface OrderSuccessViewProps {
  orderId: number;
  customerEmail: string;
}

export function OrderSuccessView({
  orderId,
  customerEmail,
}: OrderSuccessViewProps) {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-lg opacity-70 mb-2">Thank you for your order.</p>
          <p className="text-lg mb-6">
            Your order number is: <strong>#{orderId}</strong>
          </p>
          <p className="opacity-60 mb-8">
            We have sent a confirmation email to{" "}
            <strong>{customerEmail}</strong>
          </p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
