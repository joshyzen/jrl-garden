import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PlantDetailClient from "./PlantDetailClient";

export default async function PlantDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  const plant = await prisma.plant.findUnique({ 
    where: { id: resolved.id }, 
    include: { images: { orderBy: { createdAt: "asc" } } } 
  });
  
  if (!plant) return notFound();

  // Get all plants sorted by name for navigation
  const allPlants = await prisma.plant.findMany({
    select: { id: true },
    orderBy: { name: "asc" }
  });

  const currentIndex = allPlants.findIndex(p => p.id === plant.id);
  const prevPlantId = currentIndex > 0 ? allPlants[currentIndex - 1].id : null;
  const nextPlantId = currentIndex < allPlants.length - 1 ? allPlants[currentIndex + 1].id : null;

  return (
    <PlantDetailClient 
      plant={plant}
      prevPlantId={prevPlantId}
      nextPlantId={nextPlantId}
    />
  );
}


