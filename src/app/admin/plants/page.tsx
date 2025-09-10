import { prisma } from "@/lib/prisma";
import { createPlant, deletePlant, updatePlant } from "../actions";
import { PlantImagesButton } from "@/components/PlantImagesButton";
import { PlantsCsvImport } from "@/components/PlantsCsvImport";
import { AdminPlantAddForm } from "@/components/AdminPlantAddForm";

export default async function AdminPlants() {
  const [plants, categories, lightNeeds] = await Promise.all([
    prisma.plant.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.plant
      .findMany({ distinct: ["category"], select: { category: true } })
      .then((rows) => rows.map((r) => r.category).filter(Boolean).sort()),
    prisma.plant
      .findMany({ distinct: ["lightNeeds"], select: { lightNeeds: true } })
      .then((rows) => rows.map((r) => r.lightNeeds).filter(Boolean).sort()),
  ]);
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Plants</h1>
      <AdminPlantAddForm categories={categories} lightNeeds={lightNeeds} />
      <div className="brand-card p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Bulk Import Plants</h2>
          <a href="/api/plants/export" className="brand-btn px-3 py-1.5 rounded-md text-sm">Export CSV</a>
        </div>
        <PlantsCsvImport />
      </div>
      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {plants.map((p) => (
          <div key={p.id} className="brand-card p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm opacity-70">{p.category || "Uncategorized"}</div>
              <div className="flex items-center gap-2">
                { /* @ts-expect-error Client Component */ }
                <PlantImagesButton plantId={p.id} className="brand-btn px-3 py-1.5 rounded-md text-sm" />
                <form action={deletePlant}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="text-red-700 underline text-sm">Delete</button>
                </form>
              </div>
            </div>
            <form action={updatePlant} className="grid grid-cols-1 gap-2">
              <input type="hidden" name="id" value={p.id} />
              <input name="name" defaultValue={p.name} className="border rounded px-2 py-1 text-sm" placeholder="Name" />
              <input name="scientificName" defaultValue={(p as any).scientificName || ''} className="border rounded px-2 py-1 text-sm" placeholder="Scientific name" />
              <input name="category" defaultValue={p.category} className="border rounded px-2 py-1 text-sm" placeholder="Category" />
              <input name="lightNeeds" defaultValue={p.lightNeeds} className="border rounded px-2 py-1 text-sm" placeholder="Light needs" />
              <input name="matureSize" defaultValue={p.matureSize} className="border rounded px-2 py-1 text-sm" placeholder="Mature size" />
              <select name="isNative" defaultValue={p.isNative ? "true" : "false"} className="border rounded px-2 py-1 text-sm">
                <option value="true">Native</option>
                <option value="false">Non-native</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input name="price" type="number" step="0.01" defaultValue={(p as any).price || ''} className="border rounded px-2 py-1 text-sm" placeholder="Price" />
                <input name="unit" defaultValue={(p as any).unit || ''} className="border rounded px-2 py-1 text-sm" placeholder="Unit (each, flat, etc.)" />
              </div>
              <textarea name="description" defaultValue={p.description} className="border rounded px-2 py-1 text-sm" placeholder="Description" />
              <button className="brand-btn px-3 py-1.5 rounded-md text-sm justify-self-start">Save</button>
            </form>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <table className="w-full text-sm hidden sm:table">
        <thead>
          <tr className="text-left opacity-60">
            <th>Name</th>
            <th>Native</th>
            <th>Light</th>
            <th>Category</th>
            <th>Price</th>
            <th>Unit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {plants.map((p) => (
            <tr key={p.id} className="border-t align-middle">
              <td className="py-2">
                <form action={updatePlant} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={p.id} />
                  <input name="name" defaultValue={p.name} className="border rounded px-2 py-0.5 text-sm" />
                </form>
              </td>
              <td>
                <form action={updatePlant}>
                  <input type="hidden" name="id" value={p.id} />
                  <select name="isNative" defaultValue={p.isNative ? "true" : "false"} className="border rounded px-2 py-0.5 text-sm">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </form>
              </td>
              <td>
                <form action={updatePlant}>
                  <input type="hidden" name="id" value={p.id} />
                  <input name="lightNeeds" defaultValue={p.lightNeeds} className="border rounded px-2 py-0.5 text-sm" />
                </form>
              </td>
              <td>
                <form action={updatePlant}>
                  <input type="hidden" name="id" value={p.id} />
                  <input name="category" defaultValue={p.category} className="border rounded px-2 py-0.5 text-sm" />
                </form>
              </td>
              <td>
                <form action={updatePlant}>
                  <input type="hidden" name="id" value={p.id} />
                  <input name="price" type="number" step="0.01" defaultValue={(p as any).price || ''} className="border rounded px-2 py-0.5 text-sm w-20" placeholder="Price" />
                </form>
              </td>
              <td>
                <form action={updatePlant}>
                  <input type="hidden" name="id" value={p.id} />
                  <input name="unit" defaultValue={(p as any).unit || ''} className="border rounded px-2 py-0.5 text-sm w-20" placeholder="Unit" />
                </form>
              </td>
              <td className="text-right flex items-center gap-2 justify-end">
                {/* Open images modal */}
                {/* Use anchor with query param to keep server component simple */}
                { /* @ts-expect-error Client Component */ }
                <PlantImagesButton plantId={p.id} className="brand-btn px-3 py-1.5 rounded-md text-sm" />
                <form action={deletePlant}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="text-red-700 underline">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* client buttons manage their own modals */}
    </div>
  );
}


