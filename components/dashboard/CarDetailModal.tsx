"use client";

import { CarData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
// Separator removed

interface CarDetailModalProps {
  car: CarData;
  isOpen: boolean;
  onClose: () => void;
}

export function CarDetailModal({ car, isOpen, onClose }: CarDetailModalProps) {
  // Parse images
  const images = car.image_urls
    ? car.image_urls.split(", ").map((url) => url.trim())
    : [];
  const [activeImage, setActiveImage] = useState(images[0] || "/placeholder-car.jpg");

  if (!car) return null;

  // Helper to render key-value row
  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between py-2 border-b last:border-0 border-border/50">
      <span className="text-muted-foreground font-medium text-sm">{label}</span>
      <span className="text-foreground text-sm font-semibold text-right">{value || "-"}</span>
    </div>
  );

  // Helper to format production years
  const formatYears = (years: string) => {
    if (!years) return "";
    // Handle "2021Present" -> "2021 - Present"
    if (years.includes("Present")) {
        return years.replace(/(\d{4})([A-Za-z]+)/, '$1 - $2');
    }
    // Handle concatenated years without spaces if any
    return years;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-7xl w-full h-[90vh] md:h-auto overflow-hidden flex flex-col p-0 gap-0 bg-background/95 backdrop-blur-xl border-border/50">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side: Visuals */}
          <div className="w-full md:w-5/12 bg-black/5 flex flex-col h-[40vh] md:h-[80vh]">
            <div className="relative flex-grow w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
               <Image
                src={activeImage}
                alt={car.title}
                fill
                className="object-contain p-4 transition-transform duration-500 hover:scale-105"
                unoptimized
              />
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
                <ScrollArea className="h-24 w-full border-t bg-background">
                    <div className="flex gap-2 p-2">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`relative w-20 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <Image src={img} alt="" fill className="object-cover" unoptimized />
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            )}
          </div>

          {/* Right Side: Data */}
          <div className="w-full md:w-7/12 flex flex-col h-[60vh] md:h-[80vh]">
             <DialogHeader className="p-6 pb-2 border-b shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-primary/90 hover:bg-primary">{formatYears(car.production_years)}</Badge>
                <Badge variant="outline">{car.segment}</Badge>
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight">{car.title}</DialogTitle>
              <p className="text-muted-foreground text-sm">{car.body_style}</p>
            </DialogHeader>

            <Tabs defaultValue="overview" className="flex-grow flex flex-col overflow-hidden">
                <div className="px-6 pt-2 shrink-0">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="engine">Engine</TabsTrigger>
                        <TabsTrigger value="dims">Size</TabsTrigger>
                        <TabsTrigger value="specs">Full Specs</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-grow overflow-y-auto p-6 pt-4">
                    <TabsContent value="overview" className="mt-0 space-y-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg flex items-center gap-2">
                                <span className="text-primary">⚡</span> Performance
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-secondary/50">
                                    <div className="text-xs text-muted-foreground uppercase">Top Speed</div>
                                    <div className="text-xl font-bold text-primary">{car.top_speed || "-"}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-secondary/50">
                                    <div className="text-xs text-muted-foreground uppercase">Acceleration</div>
                                    <div className="text-xl font-bold text-primary">{car.acceleration || "-"}</div>
                                </div>
                                 <div className="p-3 rounded-lg bg-secondary/50">
                                    <div className="text-xs text-muted-foreground uppercase">Power</div>
                                    <div className="font-bold text-primary text-sm line-clamp-2 leading-snug" title={car.power}>{car.power ? car.power.split("(")[0] : "-"}</div>
                                </div>
                                 <div className="p-3 rounded-lg bg-secondary/50">
                                    <div className="text-xs text-muted-foreground uppercase">Drive</div>
                                    <div className="text-xl font-bold text-primary">{car.drive_type || "-"}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-semibold text-lg">Description</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {car.description || "No description available."}
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="engine" className="mt-0 space-y-1">
                        <InfoRow label="Engine Name" value={car.engine_specs_title} />
                        <InfoRow label="Cylinders" value={car.cylinders} />
                        <InfoRow label="Displacement" value={car.displacement} />
                        <InfoRow label="Power" value={car.power} />
                        <InfoRow label="Torque" value={car.torque} />
                        <InfoRow label="Fuel System" value={car.fuel_system} />
                        <InfoRow label="Fuel Type" value={car.fuel} />
                        <InfoRow label="Fuel Capacity" value={car.fuel_capacity} />
                        <InfoRow label="Gearbox" value={car.gearbox} />
                        <InfoRow label="Highway Economy" value={car.highway} />
                        <InfoRow label="City Economy" value={car.city} />
                        <InfoRow label="Combined" value={car.combined} />
                    </TabsContent>

                    <TabsContent value="dims" className="mt-0 space-y-1">
                         <InfoRow label="Length" value={car.length} />
                         <InfoRow label="Width" value={car.width} />
                         <InfoRow label="Height" value={car.height} />
                         <InfoRow label="Wheelbase" value={car.wheelbase} />
                         <InfoRow label="Weight (Unladen)" value={car.unladen_weight} />
                         <InfoRow label="Gross Weight Limit" value={car.gross_weight_limit} />
                         <InfoRow label="Cargo Volume" value={car.cargo_volume} />
                         <InfoRow label="Tire Size" value={car.tire_size} />
                         <InfoRow label="Ground Clearance" value={car.ground_clearance} />
                    </TabsContent>

                    <TabsContent value="specs" className="mt-0">
                         <div className="grid grid-cols-1 gap-1">
                             {Object.entries(car).map(([key, value]) => {
                                 if (key.includes('url') || key === 'description' || typeof value === 'object') return null;
                                 return <InfoRow key={key} label={key.replace(/_/g, " ")} value={value} />
                             })}
                         </div>
                    </TabsContent>
       </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
