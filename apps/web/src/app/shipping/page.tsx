import { Truck, Clock, Globe, Package, AlertCircle } from "lucide-react";

export default function Shipping() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Shipping Information</h1>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400">Fast and reliable delivery across Bangladesh</p>
          </div>

          <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Shipping Methods</h2>
            <div className="space-y-4">
              <div className="border border-neutral-300 dark:border-neutral-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Standard Shipping</h3>
                <p>5-7 business days | Free on orders over $50</p>
              </div>
              <div className="border border-neutral-300 dark:border-neutral-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Express Shipping</h3>
                <p>2-3 business days | $9.99</p>
              </div>
              <div className="border border-neutral-300 dark:border-neutral-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Overnight Shipping</h3>
                <p>Next business day | $24.99</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Processing Time</h2>
            <p>
              All orders are processed within 2-3 business days. Orders are
              processed Monday through Friday, excluding holidays. You will
              receive an order confirmation email when your order ships.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              International Shipping
            </h2>
            <p>
              We currently ship to select countries. International shipping
              times and rates vary by location. Please contact our support team
              for more information about international orders.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Tracking Your Order</h2>
            <p>
              Once your order ships, you'll receive an email with a tracking
              number. You can use this number to track your package through our
              carrier's website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Delivery Issues</h2>
            <p>
              If your package arrives damaged or is lost in transit, please
              contact our customer support team within 7 days of delivery. We
              will work with the carrier to resolve the issue.
            </p>
          </section>
          </div>
        </div>
      </div>
    </div>
  );
}
