import Image from "next/image";
import PerfumeCard from "@/components/perfume-card";
import { getPopularPerfumes } from "@/lib/perfumes";
import Link from "next/link";

export default function Page() {
  const popularPerfumes = getPopularPerfumes();

  return (
    <div className="flex flex-col w-full">
      {/* Banner */}
      <div className="w-full">
        <Image
          src="/banner.jpg"
          alt="banner"
          width={1920}
          height={600}
          className="w-full h-auto"
        />
      </div>

      {/* Popular Collection Section */}
      <div className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Popular Collection</h2>
            <p className="text-lg opacity-70 mb-6">
              Discover our most loved fragrances that customers adore
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {popularPerfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
          </div>

          {/* Browse All */}
          <div className="text-center space-y-4">
            <div className="flex gap-4 justify-center">
              <Link
                href="/mens"
                className="inline-block px-8 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Shop Men's
              </Link>
              <Link
                href="/womens"
                className="inline-block px-8 py-3 border border-neutral-300 dark:border-neutral-700 rounded-md font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Shop Women's
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
