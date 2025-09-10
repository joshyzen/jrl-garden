import { prisma } from "@/lib/prisma";
import { createPlant, deletePlant, updatePlant } from "../actions";
import { PlantPhotoUploader } from "@/components/PlantPhotoUploader";
import { PlantsCsvImport } from "@/components/PlantsCsvImport";

export default async function AdminPlants() {
  const plants = await prisma.plant.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Plants</h1>
      <form action={createPlant} className="brand-card p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input name="name" placeholder="Name" className="border rounded px-2 py-1" />
        <input name="scientificName" placeholder="Scientific name (optional)" className="border rounded px-2 py-1" />
        <input name="category" placeholder="Category" className="border rounded px-2 py-1" />
        <input name="lightNeeds" placeholder="Light needs" className="border rounded px-2 py-1" />
        <input name="matureSize" placeholder="Mature size" className="border rounded px-2 py-1" />
        <input name="imageUrl" placeholder="Image URL (https://) optional" className="border rounded px-2 py-1 col-span-full" />
        <textarea name="description" placeholder="Description" className="border rounded px-2 py-1 col-span-full" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isNative" /> Native</label>
        <button className="brand-btn px-3 py-1.5 rounded-md font-semibold">Add Plant</button>
      </form>
      <div className="brand-card p-3">
        <h2 className="font-semibold mb-2">Bulk Import Plants</h2>
        <PlantsCsvImport />
      </div>
      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {plants.map((p) => (
          <div key={p.id} className="brand-card p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm opacity-70">{p.category || "Uncategorized"}</div>
              <div className="flex items-center gap-2">
                <PlantPhotoUploader plantId={p.id} />
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
              <td className="text-right flex items-center gap-2 justify-end">
                <PlantPhotoUploader plantId={p.id} />
                <form action={deletePlant}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="text-red-700 underline">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


