import Link from "next/link";
import { HelpCircle, MessageCircle } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "How long does Aurelix fragrance last?",
      answer:
        "Most of our fragrances have a longevity of 6-8 hours on the skin, depending on skin type and application method. For longer-lasting scent, apply to pulse points like wrists, neck, and behind the ears.",
    },
    {
      question: "Are your products cruelty-free?",
      answer:
        "Yes, all Aurelix fragrances are cruelty-free and not tested on animals. We are committed to ethical sourcing and production practices.",
    },
    {
      question: "Can I return a fragrance I don't like?",
      answer:
        "We offer a 30-day return policy on all unopened products. If you're unsatisfied with your purchase, please contact our customer support team.",
    },
    {
      question: "How should I store my fragrance?",
      answer:
        "Store fragrances in a cool, dark place away from direct sunlight. Avoid storing in the bathroom as heat and humidity can affect the fragrance.",
    },
    {
      question: "Do you offer samples?",
      answer:
        "Yes! We offer sample packs so you can try multiple fragrances before committing to a full-size bottle.",
    },
    {
      question: "What are your shipping times?",
      answer:
        "We typically ship within 2-3 business days. Standard shipping takes 5-7 business days, while express shipping is available for faster delivery.",
    },
  ];

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-12">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Frequently Asked Questions
            </h1>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400">
              Find answers to common questions about our products
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 md:p-6"
              >
                <h3 className="text-base md:text-lg font-semibold mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm md:text-base opacity-70 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 md:mt-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-6 md:p-8 text-white text-center">
            <MessageCircle className="w-10 h-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Didn't find your answer?
            </h2>
            <p className="opacity-90 mb-6 max-w-md mx-auto">
              If you couldn't find the information you were looking for, please
              don't hesitate to contact our support team.
            </p>
            <Link
              href="/contactus"
              className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
