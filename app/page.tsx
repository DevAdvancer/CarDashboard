import { MOCK_CARS } from "@/lib/mockdata";
import { GalleryGrid } from "@/components/dashboard/GalleryGrid";

export default function Home() {
  const cars = MOCK_CARS;

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=3456&auto=format&fit=crop')] bg-cover bg-center opacity-5 filter blur-sm pointer-events-none" />
      <div className="relative">
        <GalleryGrid initialCars={cars} />
      </div>
    </main>
  );
}
