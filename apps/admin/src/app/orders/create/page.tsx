"use client";

import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Plus,
  ArrowLeft,
  ShoppingBag,
  Search,
  User,
  MapPin,
  CreditCard,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CartItem {
  productId: number;
  productName: string;
  variant?: string;
  quantity: number;
  price: number;
  image?: string;
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
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products } = trpc.products.list.useQuery({
    limit: 100,
    offset: 0,
  });

  const createOrderMutation = trpc.orders.adminCreate.useMutation({
    onSuccess: () => {
      router.push("/orders");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  // Filter products based on search
  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
          image: selectedProduct.images?.[0],
        },
      ]);
    }

    setSelectedProductId(null);
    setSelectedVariant("");
    setQuantity(1);
    setSearchQuery(""); // Clear search after adding
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
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <form onSubmit={handleSubmit}>
        {/* Header - Sticky */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link
                  href="/orders"
                  className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                    Create Order
                  </h1>
                  <p className="text-sm text-gray-500 hidden sm:block">
                    Manually create a new order
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/orders">
                  <Button variant="ghost" className="text-gray-600">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={
                    createOrderMutation.isPending || cartItems.length === 0
                  }
                  className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                >
                  {createOrderMutation.isPending ? "Creating..." : "Create Order"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Product Selection & Cart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Search & Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-gray-400" />
                  Add Products
                </h2>

                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredProducts?.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProductId(product.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex gap-3 ${selectedProductId === product.id
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                          }`}
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden relative">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ShoppingBag className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {product.name}
                          </h3>
                          <div className="text-sm text-gray-500 mt-1">
                            Stock: {product.stock}
                          </div>
                          <div className="font-semibold text-gray-900 mt-1">
                            ৳{product.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Variant & Quantity Selection (Only when product selected) */}
                  {selectedProduct && (
                    <div className="pt-4 mt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                      <div className="flex flex-wrap items-end gap-4">
                        {variants && variants.length > 0 && (
                          <div className="flex-1 min-w-[120px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              WaitSelect Variant
                            </label>
                            <select
                              value={selectedVariant}
                              onChange={(e) =>
                                setSelectedVariant(e.target.value)
                              }
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select Size</option>
                              {variants.map((v) => (
                                <option key={v.size} value={v.size}>
                                  {v.size} - ৳{v.price} ({v.stock} in stock)
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="w-24">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(parseInt(e.target.value) || 1)
                            }
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <Button
                          type="button"
                          onClick={addToCart}
                          className="bg-gray-900 hover:bg-black text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                    Order Items
                  </h2>
                  <span className="text-sm bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                    {cartItems.length}
                  </span>
                </div>

                {cartItems.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 hover:bg-gray-50 flex items-center gap-4 group transition-colors"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative border border-gray-200">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ShoppingBag className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {item.productName}
                          </h3>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            {item.variant && (
                              <span className="bg-gray-100 px-1.5 rounded text-xs border border-gray-200">
                                {item.variant}
                              </span>
                            )}
                            <span>৳{item.price} x {item.quantity}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-gray-900">
                            ৳{item.price * item.quantity}
                          </span>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 rounded text-gray-500"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 rounded text-gray-500"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(index)}
                              className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-md transition-colors ml-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="p-4 bg-gray-50 flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Total Amount</span>
                      <span className="text-xl font-bold text-gray-900">৳{total.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p>No items in cart</p>
                    <p className="text-sm mt-1 text-gray-400">Add products from above</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Customer & Shipping */}
            <div className="space-y-6">
              {/* Order Source */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Order Source
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${source === "facebook"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-100 hover:border-gray-200 text-gray-600"
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
                    <span className="text-2xl mb-1">📘</span>
                    <span className="text-sm font-medium">Facebook</span>
                  </label>
                  <label
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${source === "manual"
                        ? "border-gray-500 bg-gray-50 text-gray-900"
                        : "border-gray-100 hover:border-gray-200 text-gray-600"
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
                    <span className="text-2xl mb-1">✏️</span>
                    <span className="text-sm font-medium">Manual</span>
                  </label>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  Customer Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Customer Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  Shipping
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="House/Road/Area"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Dhaka"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip <span className="text-gray-400 font-normal">(Opt)</span></label>
                      <input
                        type="text"
                        value={shippingPostalCode}
                        onChange={(e) => setShippingPostalCode(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1234"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Notes
                </h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Special instructions..."
                />
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  Payment
                </h2>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600">
                  Payment will be collected as Cash on Delivery (COD).
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
