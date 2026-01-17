"use client";

import React from "react";
import type { FormData, FormErrors } from "./types";

interface ContactFormSectionProps {
  formData: FormData;
  errors: FormErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export function ContactFormSection({
  formData,
  errors,
  onChange,
}: ContactFormSectionProps) {
  return (
    <div className="border border-neutral-300 dark:border-neutral-800 rounded-xl p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold mb-4">Contact Information</h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="customerName"
            className="block text-sm font-medium mb-1"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-md bg-transparent ${
              errors.customerName
                ? "border-red-500"
                : "border-neutral-300 dark:border-neutral-700"
            } focus:outline-none focus:ring-2 focus:ring-neutral-500`}
            placeholder="Enter your full name"
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="customerEmail"
            className="block text-sm font-medium mb-1"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-md bg-transparent ${
              errors.customerEmail
                ? "border-red-500"
                : "border-neutral-300 dark:border-neutral-700"
            } focus:outline-none focus:ring-2 focus:ring-neutral-500`}
            placeholder="your@email.com"
          />
          {errors.customerEmail && (
            <p className="mt-1 text-sm text-red-500">{errors.customerEmail}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="customerPhone"
            className="block text-sm font-medium mb-1"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="customerPhone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-md bg-transparent ${
              errors.customerPhone
                ? "border-red-500"
                : "border-neutral-300 dark:border-neutral-700"
            } focus:outline-none focus:ring-2 focus:ring-neutral-500`}
            placeholder="01XXXXXXXXX"
          />
          {errors.customerPhone && (
            <p className="mt-1 text-sm text-red-500">{errors.customerPhone}</p>
          )}
        </div>
      </div>
    </div>
  );
}
