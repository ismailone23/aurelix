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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Product Info
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Price / Variants
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Cost & Profit
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {product.images &&
                        Array.isArray(product.images) &&
                        product.images.length > 0 ? (
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={product.images[0] as string}
                            alt={product.name}
                            fill
                            className="object-cover rounded-lg border border-gray-100 shadow-sm"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">ID: #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {hasVariants ? (
                      <div className="space-y-1">
                        {variants.map((v, i) => (
                          <div key={i} className="text-sm flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {v.size}
                            </span>
                            <span className="font-medium text-gray-900">
                              ৳{v.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900 text-base">
                        ৳{product.price}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {hasVariants ? (
                      <div className="space-y-1 text-xs text-gray-500">
                        {variants.map((v, i) => (
                          <div key={i} className="flex gap-2">
                            <span>Cost: ৳{v.costPrice || 0}</span>
                            <span className="text-green-600 font-medium whitespace-nowrap">
                              (+৳{v.price - (v.costPrice || 0)})
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm">
                        <div className="text-gray-500 text-xs">Cost: ৳{product.costPrice || 0}</div>
                        <div className="text-green-600 font-medium text-xs">
                          Profit: ৳{product.price - (product.costPrice || 0)}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {hasVariants ? (
                      <div className="space-y-1">
                        {variants.map((v, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-8">{v.size}</span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${v.stock < 5
                                ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10"
                                : "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                                }`}
                            >
                              {v.stock} in stock
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock < 5
                          ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10"
                          : "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                          }`}
                      >
                        {product.stock} in stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                      <input type="checkbox" className="sr-only peer" checked={product.isActive} readOnly />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(product)}
                        className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50"
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
    </div>
  );
}
