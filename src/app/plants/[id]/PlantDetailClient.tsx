"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlantCarousel } from "@/components/PlantCarousel";
import { HeartIcon } from "@/components/HeartIcon";
import { getFavorites, toggleFavorite } from "@/lib/favorites";

type Plant = {
  id: string;
  name: string;
  scientificName: string | null;
  isNative: boolean;
  lightNeeds: string;
  matureSize: string;
  description: string;
  category: string;
  images: { id: string; url: string }[];
  imageUrl: string | null;
};

export default function PlantDetailClient({ 
  plant, 
  prevPlantId, 
  nextPlantId 
}: { 
  plant: Plant; 
  prevPlantId: string | null; 
  nextPlantId: string | null;
}) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);

  useEffect(() => {
    setIsFavorite(getFavorites().includes(plant.id));
  }, [plant.id]);

  const handleFavorite = () => {
    toggleFavorite(plant.id);
    setIsFavorite(!isFavorite);
  };

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    // Swipe threshold
    if (Math.abs(diff) > 100) {
      if (diff > 0 && nextPlantId) {
        // Swipe left - go to next
        router.push(`/plants/${nextPlantId}`);
      } else if (diff < 0 && prevPlantId) {
        // Swipe right - go to previous
        router.push(`/plants/${prevPlantId}`);
      }
    }
    
    setStartX(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prevPlantId) {
        router.push(`/plants/${prevPlantId}`);
      } else if (e.key === "ArrowRight" && nextPlantId) {
        router.push(`/plants/${nextPlantId}`);
      } else if (e.key === "Escape") {
        router.push("/plants");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevPlantId, nextPlantId, router]);

  return (
    <article 
      className="space-y-3 pb-16"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-[rgba(245,240,232,0.95)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(245,240,232,0.6)] flex items-center justify-between border-b border-[rgba(45,80,22,0.12)]">
        <div className="flex items-center gap-3">
          <a href="/plants" className="brand-btn px-3 py-1.5 rounded-md text-sm">Back</a>
          <div className="text-sm truncate">
            <span className="opacity-60">Plants</span>
            <span className="opacity-60"> / </span>
            <span className="opacity-80">{plant.category}</span>
          </div>
        </div>
        <HeartIcon 
          filled={isFavorite}
          onClick={handleFavorite}
          className="scale-125"
        />
      </div>

      {/* Navigation arrows */}
      <div className="relative">
        {prevPlantId && (
          <button
            onClick={() => router.push(`/plants/${prevPlantId}`)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur rounded-full p-3 shadow-lg hover:bg-white transition-colors"
            aria-label="Previous plant"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {nextPlantId && (
          <button
            onClick={() => router.push(`/plants/${nextPlantId}`)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur rounded-full p-3 shadow-lg hover:bg-white transition-colors"
            aria-label="Next plant"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        
        <PlantCarousel
          images={plant.images.length ? plant.images.map((i) => ({ id: i.id, url: i.url })) : (plant.imageUrl ? [{ id: "legacy", url: plant.imageUrl }] : [])}
          name={plant.name}
        />
      </div>

      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{plant.name}</h1>
          {plant.scientificName && (
            <p className="text-sm italic opacity-70">{plant.scientificName}</p>
          )}
          <p className="text-sm opacity-75 mt-1">
            {plant.isNative ? "Native" : ""}
            {" "}• {plant.lightNeeds} • {plant.matureSize}
          </p>
        </div>
      </header>

      <p className="text-sm leading-6 opacity-90">{plant.description}</p>
      
      <div className="flex items-center gap-3 text-xs opacity-60">
        <span>Category: {plant.category}</span>
        {(prevPlantId || nextPlantId) && (
          <span className="hidden sm:inline">• Use arrow keys to navigate</span>
        )}
      </div>
    </article>
  );
}

