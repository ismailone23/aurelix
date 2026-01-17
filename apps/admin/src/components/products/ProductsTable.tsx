"use client";

import React from "react";
import Image from "next/image";
import { Trash2, ImageIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { Product, Variant } from "./types";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  isDeleting,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No products yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Price / Variants
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => {
            const variants = product.variants as Variant[] | null;
            const hasVariants = variants && variants.length > 0;

            return (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-600">
                  #{product.id}
                </td>
                <td className="px-4 py-3">
                  {product.images &&
                  Array.isArray(product.images) &&
                  product.images.length > 0 ? (
                    <div className="relative w-12 h-12">
                      <Image
                        src={product.images[0] as string}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg border border-gray-100"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900">
                    {product.name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {hasVariants ? (
                    <div className="space-y-1">
                      {variants.map((v, i) => (
                        <div key={i} className="text-sm">
                          <span className="text-gray-500">{v.size}:</span>{" "}
                          <span className="font-medium text-gray-900">
                            ৳{v.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="font-medium text-gray-900">
                      ৳{product.price}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {hasVariants ? (
                    <div className="space-y-1">
                      {variants.map((v, i) => (
                        <div key={i} className="text-sm">
                          <span className="text-gray-500">{v.size}:</span>{" "}
                          <span
                            className={`font-medium ${v.stock < 5 ? "text-red-600" : "text-gray-900"}`}
                          >
                            {v.stock}
                          </span>
                        </div>
                      ))}
                      <div className="text-xs text-gray-400 mt-1 pt-1 border-t border-gray-100">
                        Total: {variants.reduce((sum, v) => sum + v.stock, 0)}
                      </div>
                    </div>
                  ) : (
                    <span
                      className={`font-medium ${product.stock < 5 ? "text-red-600" : "text-gray-900"}`}
                    >
                      {product.stock}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {product.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this product?",
                          )
                        ) {
                          onDelete(product.id);
                        }
                      }}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
