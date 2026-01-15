import Link from "next/link";

export default function FAQ() {
  const faqs = [
    {
      question: "How long does Aurelex fragrance last?",
      answer:
        "Most of our fragrances have a longevity of 6-8 hours on the skin, depending on skin type and application method. For longer-lasting scent, apply to pulse points like wrists, neck, and behind the ears.",
    },
    {
      question: "Are your products cruelty-free?",
      answer:
        "Yes, all Aurelex fragrances are cruelty-free and not tested on animals. We are committed to ethical sourcing and production practices.",
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
    <div className="px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-neutral-300 dark:border-neutral-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="opacity-70">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-800">
          <h2 className="text-2xl font-bold mb-4">Didn't find your answer?</h2>
          <p className="opacity-70 mb-4">
            If you couldn't find the information you were looking for, please
            don't hesitate to contact our support team.
          </p>
          <Link
            href="/contactus"
            className="inline-block px-6 py-2 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
