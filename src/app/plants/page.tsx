import { prisma } from "@/lib/prisma";
import { PlantsFilterBar } from "@/components/PlantsFilterBar";

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
          <a key={p.id} href={`/plants/${p.id}`} className="overflow-hidden brand-card">
            <div className="aspect-[4/3] bg-[rgba(45,80,22,0.08)]">
              {p.imageUrl?.startsWith("http") ? (
                <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs opacity-60">Photo coming soon</div>
              )}
            </div>
            <div className="p-2">
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-xs opacity-70">{p.isNative ? "Native" : ""} • {p.lightNeeds}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}


