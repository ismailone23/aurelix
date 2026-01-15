import PerfumeCard from "@/components/perfume-card";
import { getPerfumesByCategory } from "@/lib/perfumes";

export default function WomensPage() {
  const womensPerfumes = getPerfumesByCategory("womens");

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Women's Fragrances</h1>
        <p className="text-lg opacity-70 mb-8">
          Discover our exclusive collection of premium women's perfumes
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {womensPerfumes.map((perfume) => (
            <PerfumeCard key={perfume.id} perfume={perfume} />
          ))}
        </div>
      </div>
    </div>
  );
}
