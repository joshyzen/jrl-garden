"use client";

import { useState, useEffect } from "react";
import { HeartIcon } from "./HeartIcon";
import { toggleFavorite, isFavorite } from "@/lib/favorites";

type Plant = {
  id: string;
  name: string;
  isNative: boolean;
  lightNeeds: string;
  imageUrl: string | null;
  price?: number | null;
  unit?: string | null;
};

type Props = {
  plant: Plant;
  showPrice?: boolean;
  className?: string;
};

export function PlantCard({ plant, showPrice = false, className = "" }: Props) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(plant.id));
  }, [plant.id]);

  const handleToggleFavorite = () => {
    const { isFavorite: newFavorite } = toggleFavorite(plant.id);
    setFavorite(newFavorite);
  };

  return (
    <a href={`/plants/${plant.id}`} className={`overflow-hidden brand-card relative ${className}`}>
      <div className="absolute top-2 right-2 z-10">
        <HeartIcon
          filled={favorite}
          onClick={handleToggleFavorite}
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
        />
      </div>
      
      <div className="aspect-[4/3] bg-[rgba(45,80,22,0.08)]">
        {plant.imageUrl?.startsWith("http") ? (
          <img src={plant.imageUrl} alt={plant.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs opacity-60">Photo coming soon</div>
        )}
      </div>
      
      <div className="p-2">
        <div className="text-sm font-medium">{plant.name}</div>
        <div className="text-xs opacity-70">{plant.isNative ? "Native" : ""} • {plant.lightNeeds}</div>
        {showPrice && plant.price && plant.price > 0 && plant.unit && (
          <div className="text-xs font-medium text-green-700 mt-1">
            ${plant.price.toFixed(2)} / {plant.unit}
          </div>
        )}
      </div>
    </a>
  );
}
