"use client";

import React from "react";
import type { FormData, FormErrors } from "./types";

interface ShippingFormSectionProps {
  formData: FormData;
  errors: FormErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export function ShippingFormSection({
  formData,
  errors,
  onChange,
}: ShippingFormSectionProps) {
  return (
    <div className="border border-neutral-300 dark:border-neutral-800 rounded-xl p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold mb-4">Shipping Address</h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="shippingAddress"
            className="block text-sm font-medium mb-1"
          >
            Street Address *
          </label>
          <input
            type="text"
            id="shippingAddress"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-md bg-transparent ${
              errors.shippingAddress
                ? "border-red-500"
                : "border-neutral-300 dark:border-neutral-700"
            } focus:outline-none focus:ring-2 focus:ring-neutral-500`}
            placeholder="House/Building, Street Name"
          />
          {errors.shippingAddress && (
            <p className="mt-1 text-sm text-red-500">
              {errors.shippingAddress}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="shippingCity"
              className="block text-sm font-medium mb-1"
            >
              City *
            </label>
            <input
              type="text"
              id="shippingCity"
              name="shippingCity"
              value={formData.shippingCity}
              onChange={onChange}
              className={`w-full px-4 py-2 border rounded-md bg-transparent ${
                errors.shippingCity
                  ? "border-red-500"
                  : "border-neutral-300 dark:border-neutral-700"
              } focus:outline-none focus:ring-2 focus:ring-neutral-500`}
              placeholder="Dhaka"
            />
            {errors.shippingCity && (
              <p className="mt-1 text-sm text-red-500">{errors.shippingCity}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="shippingPostalCode"
              className="block text-sm font-medium mb-1"
            >
              Postal Code *
            </label>
            <input
              type="text"
              id="shippingPostalCode"
              name="shippingPostalCode"
              value={formData.shippingPostalCode}
              onChange={onChange}
              className={`w-full px-4 py-2 border rounded-md bg-transparent ${
                errors.shippingPostalCode
                  ? "border-red-500"
                  : "border-neutral-300 dark:border-neutral-700"
              } focus:outline-none focus:ring-2 focus:ring-neutral-500`}
              placeholder="1000"
            />
            {errors.shippingPostalCode && (
              <p className="mt-1 text-sm text-red-500">
                {errors.shippingPostalCode}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Order Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-neutral-500"
            placeholder="Special delivery instructions, gift message, etc."
          />
        </div>
      </div>
    </div>
  );
}
