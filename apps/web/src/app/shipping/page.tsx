export default function Shipping() {
  return (
    <div className="px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shipping Information</h1>

        <div className="space-y-6 opacity-80">
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
  );
}
