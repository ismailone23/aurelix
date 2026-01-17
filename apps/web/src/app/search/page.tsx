import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SearchContent from "./search-content";

function SearchFallback() {
  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Search Products
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Find your perfect fragrance
            </p>
          </div>
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  );
}
