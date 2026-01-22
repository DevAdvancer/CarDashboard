import { getCars } from "@/app/actions/get-cars";
import { GalleryGrid } from "@/components/dashboard/GalleryGrid";

export default async function Home() {
  const initialCars = await getCars({ page: 1, limit: 20 });

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=3456&auto=format&fit=crop')] bg-cover bg-center opacity-5 filter blur-sm pointer-events-none" />
      <div className="relative">
        <GalleryGrid initialCars={initialCars} />
      </div>
    </main>
  );
}
