import { prisma } from "@/lib/prisma";
import { PlantCarousel } from "@/components/PlantCarousel";
import { notFound } from "next/navigation";

export default async function PlantDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  const plant = await prisma.plant.findUnique({ where: { id: resolved.id }, include: { images: { orderBy: { createdAt: "asc" } } } });
  if (!plant) return notFound();

  return (
    <article className="space-y-3">
      <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-[rgba(245,240,232,0.95)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(245,240,232,0.6)] flex items-center gap-3 border-b border-[rgba(45,80,22,0.12)]">
        <a href="/plants" className="brand-btn px-3 py-1.5 rounded-md text-sm">Back</a>
        <div className="text-sm truncate">
          <span className="opacity-60">Plants</span>
          <span className="opacity-60"> / </span>
          <span className="opacity-80">{plant.category}</span>
        </div>
      </div>
      {/* Client carousel for interactivity */}
      { /* @ts-expect-error Client Component inline */ }
      <PlantCarousel
        images={plant.images.length ? plant.images.map((i) => ({ id: i.id, url: i.url })) : (plant.imageUrl ? [{ id: "legacy", url: plant.imageUrl }] : [])}
        name={plant.name}
      />
      <header>
        <h1 className="text-2xl font-semibold">{plant.name}</h1>
        <p className="text-sm opacity-75">
          {plant.isNative ? "Native" : ""}
          {" "}• {plant.lightNeeds} • {plant.matureSize}
        </p>
      </header>
      <p className="text-sm leading-6 opacity-90">{plant.description}</p>
      <div className="text-xs opacity-60">Category: {plant.category}</div>
      <a href="/plants" className="fixed right-3 bottom-3 brand-btn px-3 py-2 rounded-md text-sm shadow-md sm:hidden">Back to Plants</a>
    </article>
  );
}


