import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default function Home() {
  const plantsPromise = prisma.plant.findMany({ orderBy: { createdAt: "desc" }, take: 6 });
  // Next.js App Router supports async server component by returning a Promise
  // eslint-disable-next-line @typescript-eslint/return-await
  return (async () => {
    const plants = await plantsPromise;
    return (
      <div className="space-y-4">
        <section className="rounded-xl brand-card p-4">
          <h1 className="text-2xl font-semibold">Plants, Shrubs & Trees Gallery</h1>
          <p className="text-sm opacity-80">Curated, Florida-friendly selections for sun, shade, and drought tolerance.</p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
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
          <div className="mt-4 text-right">
            <Link href="/plants" className="text-sm underline font-medium">View full gallery</Link>
          </div>
        </section>

        <section className="rounded-xl brand-card p-4">
          <h2 className="text-xl font-semibold">Request an Estimate</h2>
          <p className="text-sm opacity-80">Tell us about your project and we’ll text you a tailored estimate.</p>
          <div className="mt-3">
            <Link href="/estimate" className="brand-btn inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold">Start estimate</Link>
          </div>
        </section>
      </div>
    );
  })();
}
