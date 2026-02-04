import { RotateCcw } from "lucide-react";

export default function Returns() {
  return (
    <div className="py-12 md:py-16 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-8 h-8 text-neutral-700 dark:text-neutral-300" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-light mb-2 text-neutral-900 dark:text-white">
              Returns & Exchanges
            </h1>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400">
              We make returns easy and hassle-free
            </p>
          </div>

          <div className="space-y-6 bg-white dark:bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-800">
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-neutral-900 dark:text-white">Return Policy</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                We want you to be completely satisfied with your Aurelix
                purchase. If you&apos;re not happy with your order, we offer a
                hassle-free 7-days return policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-neutral-900 dark:text-white">Return Conditions</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                For a return to be eligible, the following conditions must be
                met:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-600 dark:text-neutral-400">
                <li>Product must be unused and unopened</li>
                <li>Original packaging and all contents must be intact</li>
                <li>Return must be initiated within 7 days of purchase</li>
                <li>Proof of purchase (receipt or order number) required</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-neutral-900 dark:text-white">How to Return</h2>
              <ol className="list-decimal list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                <li>
                  Contact our customer support team at returns@aurelix.com
                </li>
                <li>Provide your order number and reason for return</li>
                <li>Receive return shipping label</li>
                <li>Pack the product securely and ship it back</li>
                <li>Once received and inspected, we&apos;ll process your refund</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-neutral-900 dark:text-white">Refunds</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Refunds are processed within 5-7 business days after we receive
                and inspect your returned item. Refunds are issued to your
                original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-neutral-900 dark:text-white">Exchanges</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                If you&apos;d like to exchange your product for a different scent or
                size, we offer free exchanges within 7 days. Simply contact our
                support team with your order number and desired product.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-neutral-900 dark:text-white">
                Damaged or Defective Items
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                If you receive a damaged or defective item, please notify us
                immediately with photos. We will replace the item at no cost to
                you, including return shipping.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
