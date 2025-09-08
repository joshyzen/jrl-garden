import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PlantDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  const plant = await prisma.plant.findUnique({ where: { id: resolved.id } });
  if (!plant) return notFound();

  return (
    <article className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-[rgba(45,80,22,0.15)]">
        <div className="aspect-[4/3] bg-[rgba(45,80,22,0.08)]">
          {plant.imageUrl?.startsWith("http") ? (
            <img src={plant.imageUrl} alt={plant.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs opacity-60">Photo coming soon</div>
          )}
        </div>
      </div>
      <header>
        <h1 className="text-2xl font-semibold">{plant.name}</h1>
        <p className="text-sm opacity-75">
          {plant.isNative ? "Native" : ""}
          {" "}• {plant.lightNeeds} • {plant.matureSize}
        </p>
      </header>
      <p className="text-sm leading-6 opacity-90">{plant.description}</p>
      <div className="text-xs opacity-60">Category: {plant.category}</div>
    </article>
  );
}


