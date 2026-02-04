import { Heart, Leaf, Lightbulb, Users } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Quality",
      description: "We source the finest ingredients from around the world",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We are committed to eco-friendly practices",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously develop new fragrances and formulations",
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Your satisfaction is our top priority",
    },
  ];

  return (
    <div className="py-12 md:py-16 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-4 text-neutral-900 dark:text-white">
              About Us
            </h1>
            <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              Crafting premium fragrances that capture moments and memories
            </p>
          </div>

          {/* Story Section */}
          <section className="mb-12 md:mb-16">
            <div className="bg-neutral-900 dark:bg-white rounded-2xl p-6 md:p-8 text-white dark:text-neutral-900">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Our Story</h2>
              <p className="opacity-90 leading-relaxed">
                Aurelix was founded with a passion for creating exquisite
                fragrances that capture moments and memories. Our journey began
                with a simple belief: that everyone deserves to smell their best
                and feel confident in their own scent.
              </p>
            </div>
          </section>

          {/* Mission */}
          <section className="mb-12 md:mb-16 bg-white dark:bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">Our Mission</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We are committed to creating premium quality fragrances that blend
              tradition with innovation. Our mission is to provide customers
              with accessible luxury - fragrances that are crafted with care and
              attention to detail.
            </p>
          </section>

          {/* Values Grid */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-neutral-900 dark:text-white">Our Values</h2>
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-neutral-900 rounded-xl p-5 md:p-6 border border-neutral-200 dark:border-neutral-800"
                  >
                    <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                    </div>
                    <h3 className="font-semibold mb-1 text-neutral-900 dark:text-white">{value.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Collections */}
          <section className="mb-12 md:mb-16 bg-white dark:bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">
              Our Collections
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We offer a diverse range of fragrances for both men and women,
              from fresh and light scents to deep and musky aromas. Each
              fragrance is carefully curated to offer a unique olfactory
              experience.
            </p>
          </section>

          {/* Community */}
          <section className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-800 text-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 text-neutral-900 dark:text-white">
              Join Our Community
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Discover your signature scent with Aurelix. Follow us on social
              media to stay updated with our latest releases and exclusive
              offers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
