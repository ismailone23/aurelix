"use client";

import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { Trash2, Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface CartItem {
  productId: number;
  productName: string;
  variant?: string;
  quantity: number;
  price: number;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const [source, setSource] = useState<"facebook" | "manual">("facebook");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const { data: products } = trpc.products.list.useQuery({
    limit: 100,
    offset: 0,
  });

  const createOrderMutation = trpc.orders.adminCreate.useMutation({
    onSuccess: () => {
      alert("Order created successfully!");
      router.push("/orders");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const selectedProduct = products?.find((p) => p.id === selectedProductId);
  const variants = selectedProduct?.variants as
    | { size: string; price: number; stock: number }[]
    | undefined;

  const addToCart = () => {
    if (!selectedProduct) return;

    let price = selectedProduct.price;
    let variant: string | undefined;

    if (variants && selectedVariant) {
      const v = variants.find((v) => v.size === selectedVariant);
      if (v) {
        price = v.price;
        variant = v.size;
      }
    }

    const existingIndex = cartItems.findIndex(
      (item) =>
        item.productId === selectedProduct.id && item.variant === variant,
    );

    if (existingIndex >= 0) {
      setCartItems((prev) =>
        prev.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          variant,
          quantity,
          price,
        },
      ]);
    }

    setSelectedProductId(null);
    setSelectedVariant("");
    setQuantity(1);
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Please add at least one product to the order");
      return;
    }

    createOrderMutation.mutate({
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        variant: item.variant,
      })),
      customerName,
      customerEmail: customerEmail || undefined,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingPostalCode: shippingPostalCode || undefined,
      notes: notes || undefined,
      source,
    });
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Create Order
          </h1>
          <p className="text-gray-500 mt-1">
            Add a new order from Facebook or other sources
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Source */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Source
            </h2>
            <div className="flex flex-wrap gap-4">
              <label
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                  source === "facebook"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="source"
                  value="facebook"
                  checked={source === "facebook"}
                  onChange={() => setSource("facebook")}
                  className="sr-only"
                />
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📘</span>
                </div>
                <span className="font-medium text-gray-900">Facebook</span>
              </label>
              <label
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                  source === "manual"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="source"
                  value="manual"
                  checked={source === "manual"}
                  onChange={() => setSource("manual")}
                  className="sr-only"
                />
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">✏️</span>
                </div>
                <span className="font-medium text-gray-900">
                  Other / Manual
                </span>
              </label>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Information
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="customer@example.com"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping Address
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="House/Road/Area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Dhaka"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={shippingPostalCode}
                  onChange={(e) => setShippingPostalCode(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="1234"
                />
              </div>
            </div>
          </div>

          {/* Add Products */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Products
            </h2>
            <div className="flex flex-wrap gap-4 items-end mb-4 pb-4 border-b border-gray-100">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  value={selectedProductId || ""}
                  onChange={(e) => {
                    setSelectedProductId(Number(e.target.value) || null);
                    setSelectedVariant("");
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select a product</option>
                  {products?.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ৳{product.price}
                    </option>
                  ))}
                </select>
              </div>

              {variants && variants.length > 0 && (
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select</option>
                    {variants.map((v) => (
                      <option key={v.size} value={v.size}>
                        {v.size} - ৳{v.price}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qty
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <Button
                type="button"
                onClick={addToCart}
                disabled={!selectedProductId}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>

            {/* Cart Items */}
            {cartItems.length > 0 ? (
              <div className="space-y-2">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {item.productName}
                      </span>
                      {item.variant && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({item.variant})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">৳{item.price}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(index, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(index, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold w-24 text-right text-gray-900">
                        ৳{item.price * item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => removeFromCart(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
                  <div className="text-xl font-bold text-gray-900">
                    Total: ৳{total.toLocaleString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No products added yet</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Notes (Optional)
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Any special instructions or notes about the order..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Link href="/orders">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={createOrderMutation.isPending || cartItems.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createOrderMutation.isPending ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
