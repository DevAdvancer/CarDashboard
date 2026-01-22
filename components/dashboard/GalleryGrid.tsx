"use client";

import { CarData } from "@/lib/types";
import { CarCard } from "./CarCard";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCars } from "@/app/actions/get-cars";
import { useEffect } from "react";
// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface GalleryGridProps {
  initialCars: {
    cars: any[]; // Using any to avoid strict shape mismatch if using mapped types, or use CarData[]
    totalCount: number;
  };
}

export function GalleryGrid({ initialCars }: GalleryGridProps) {
  const [cars, setCars] = useState<CarData[]>(initialCars.cars);
  const [totalCount, setTotalCount] = useState(initialCars.totalCount);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [isPending, startTransition] = useTransition();

  // Reset when search changes
  useEffect(() => {
    const fetchCars = async () => {
      const result = await getCars({ page: 1, limit: 20, query: debouncedSearch });
      setCars(result.cars as any);
      setTotalCount(result.totalCount);
      setPage(1);
    };

    startTransition(() => {
        fetchCars();
    });
  }, [debouncedSearch]);


  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const result = await getCars({ page: nextPage, limit: 20, query: debouncedSearch });

    setCars((prev) => [...prev, ...(result.cars as any)]);
    setPage(nextPage);
  };

  return (
    <div className="space-y-6">
      {/* Header / Filter Bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md pb-4 pt-2 border-b">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Showroom
            </h1>
            <Badge variant="secondary" className="mt-1">
              {totalCount} Cars
            </Badge>
          </div>

          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Brand, Model, or Style..."
              className="pl-9 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {cars.length === 0 && !isPending ? (
          <div className="text-center py-20 text-muted-foreground">
            No cars found matching "{searchTerm}"
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-100 transition-opacity duration-300" style={{ opacity: isPending ? 0.5 : 1 }}>
            {cars.map((car, idx) => (
              <CarCard key={`${car.brand}-${car.model}-${idx}`} car={car} />
            ))}
          </div>
        )}

        {/* Load More */}
        {cars.length < totalCount && (
          <div className="flex justify-center py-10">
            <Button
                onClick={handleLoadMore}
                variant="secondary"
                size="lg"
                className="px-8 shadow-lg hover:shadow-xl transition-all"
                disabled={isPending}
            >
              {isPending ? 'Loading...' : `Load More Cars (${totalCount - cars.length} remaining)`}
            </Button>
          </div>
        )}

        <div className="text-center py-4 text-xs text-muted-foreground">
            Showing {cars.length} of {totalCount} models
        </div>
      </div>
    </div>
  );
}
