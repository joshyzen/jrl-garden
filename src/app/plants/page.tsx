import { prisma } from "@/lib/prisma";

const categories = [
  "All",
  "Native",
  "Shade",
  "Sun",
  "Drought Tolerant",
];

export const revalidate = 30;

async function getPlants(category?: string) {
  if (!category || category === "All") {
    return prisma.plant.findMany({ orderBy: { createdAt: "desc" } });
  }
  return prisma.plant.findMany({
    where: { category },
    orderBy: { createdAt: "desc" },
  });
}

export default async function PlantsPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const resolved = await searchParams;
  const currentCategory = resolved?.c ?? "All";
  const plants = await getPlants(currentCategory);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((c) => {
          const active = c === currentCategory;
          const href = c === "All" ? "/plants" : `/plants?c=${encodeURIComponent(c)}`;
          return (
            <a
              key={c}
              href={href}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border ${active ? "brand-btn border-transparent" : "bg-white/60 border-[rgba(45,80,22,0.2)]"}`}
            >
              {c}
            </a>
          );
        })}
      </div>

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


