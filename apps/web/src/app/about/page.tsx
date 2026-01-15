export default function About() {
  return (
    <div className="px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>

        <div className="space-y-6 opacity-80">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Story</h2>
            <p>
              Aurelex was founded with a passion for creating exquisite
              fragrances that capture moments and memories. Our journey began
              with a simple belief: that everyone deserves to smell their best
              and feel confident in their own scent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p>
              We are committed to creating premium quality fragrances that blend
              tradition with innovation. Our mission is to provide customers
              with accessible luxury - fragrances that are crafted with care and
              attention to detail.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Values</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Quality:</strong> We source the finest ingredients from
                around the world
              </li>
              <li>
                <strong>Sustainability:</strong> We are committed to
                eco-friendly practices
              </li>
              <li>
                <strong>Innovation:</strong> We continuously develop new
                fragrances and formulations
              </li>
              <li>
                <strong>Customer Focus:</strong> Your satisfaction is our top
                priority
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Collections</h2>
            <p>
              We offer a diverse range of fragrances for both men and women,
              from fresh and light scents to deep and musky aromas. Each
              fragrance is carefully curated to offer a unique olfactory
              experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Join Our Community</h2>
            <p>
              Discover your signature scent with Aurelex. Follow us on social
              media to stay updated with our latest releases and exclusive
              offers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
