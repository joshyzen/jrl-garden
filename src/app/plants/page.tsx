import { prisma } from "@/lib/prisma";
import { PlantsFilterBar } from "@/components/PlantsFilterBar";
import { PlantCard } from "@/components/PlantCard";

const categories = [
  "All",
  "Native",
  "Shade",
  "Sun",
  "Drought Tolerant",
];

export const revalidate = 30;

async function getPlants(params: { category?: string; q?: string; lightNeeds?: string; matureSize?: string; native?: string }) {
  const where: any = {};
  if (params.category) where.category = params.category;
  if (params.lightNeeds) where.lightNeeds = params.lightNeeds;
  if (params.matureSize) where.matureSize = params.matureSize;
  if (params.native === "true") where.isNative = true;
  if (params.native === "false") where.isNative = false;
  if (params.q) where.name = { contains: params.q, mode: "insensitive" };
  return prisma.plant.findMany({ where, orderBy: { createdAt: "desc" } });
}

export default async function PlantsPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string; lightNeeds?: string; matureSize?: string; native?: string }> }) {
  const resolved = await searchParams;
  const plants = await getPlants(resolved || {} as any);

  return (
    <div className="space-y-4">
      <PlantsFilterBar />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {plants.map((p) => (
          <PlantCard key={p.id} plant={p} showPrice={true} />
        ))}
      </div>
    </div>
  );
}


