"use client";

import { CarData } from "@/lib/types";
import { CarCard } from "./CarCard";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GalleryGridProps {
  initialCars: CarData[];
}

export function GalleryGrid({ initialCars }: GalleryGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  const filteredCars = useMemo(() => {
    if (!searchTerm) return initialCars;
    const lower = searchTerm.toLowerCase();
    return initialCars.filter(
      (car) =>
        car.brand?.toLowerCase().includes(lower) ||
        car.model?.toLowerCase().includes(lower) ||
        car.body_style?.toLowerCase().includes(lower)
    );
  }, [initialCars, searchTerm]);

  const visibleCars = filteredCars.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
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
              {filteredCars.length} Cars
            </Badge>
          </div>

          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Brand, Model, or Style..."
              className="pl-9 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(20); // Reset pagination on search
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {visibleCars.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No cars found matching "{searchTerm}"
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleCars.map((car, idx) => (
              <CarCard key={`${car.brand}-${car.model}-${idx}`} car={car} />
            ))}
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredCars.length && (
          <div className="flex justify-center py-10">
            <Button
                onClick={handleLoadMore}
                variant="secondary"
                size="lg"
                className="px-8 shadow-lg hover:shadow-xl transition-all"
            >
              Load More Cars ({filteredCars.length - visibleCount} remaining)
            </Button>
          </div>
        )}

        <div className="text-center py-4 text-xs text-muted-foreground">
            Showing {Math.min(visibleCount, filteredCars.length)} of {filteredCars.length} models
        </div>
      </div>
    </div>
  );
}
