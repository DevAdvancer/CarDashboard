"use client";

import { CarData } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";
import { CarDetailModal } from "@/components/dashboard/CarDetailModal";
import { useState } from "react";

interface CarCardProps {
  car: CarData;
}

export function CarCard({ car }: CarCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parse image URLs safely
  const images = car.image_urls
    ? car.image_urls.split(", ").map((url) => url.trim())
    : [];
  const mainImage = images[0] || "/placeholder-car.jpg"; // You might want a better placeholder logic

  return (
    <>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="cursor-pointer h-full"
        onClick={() => setIsModalOpen(true)}
      >
        <Card className="overflow-hidden h-full flex flex-col border-none shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={mainImage}
              alt={car.title}
              fill
              loader={({ src }) => src} // External URLs
              className="object-cover transition-transform duration-500 hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="backdrop-blur-md bg-black/50 text-white border-0">
                {car.from_year}
              </Badge>
            </div>
          </div>
          <CardContent className="p-4 flex-grow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg leading-tight line-clamp-1">{car.brand}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{car.model}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {car.body_style && (
                <Badge variant="outline" className="text-xs">
                  {car.body_style.split(" (")[0]}
                </Badge>
              )}
              {car.drive_type && (
                <Badge variant="outline" className="text-xs">
                  {car.drive_type}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center">
            <span>{car.engine_specs_title?.split(" ")[0] || "Engine N/A"}</span>
            <span>{car.top_speed || "N/A"}</span>
          </CardFooter>
        </Card>
      </motion.div>

      <CarDetailModal
        car={car}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
