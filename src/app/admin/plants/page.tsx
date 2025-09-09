import { prisma } from "@/lib/prisma";
import { createPlant, deletePlant } from "../actions";

export default async function AdminPlants() {
  const plants = await prisma.plant.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Plants</h1>
      <form action={createPlant} className="brand-card p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input name="name" placeholder="Name" className="border rounded px-2 py-1" />
        <input name="category" placeholder="Category" className="border rounded px-2 py-1" />
        <input name="lightNeeds" placeholder="Light needs" className="border rounded px-2 py-1" />
        <input name="matureSize" placeholder="Mature size" className="border rounded px-2 py-1" />
        <input name="imageUrl" placeholder="Image URL (https://)" className="border rounded px-2 py-1 col-span-full" />
        <textarea name="description" placeholder="Description" className="border rounded px-2 py-1 col-span-full" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isNative" /> Native</label>
        <button className="brand-btn px-3 py-1.5 rounded-md font-semibold">Add Plant</button>
      </form>
      <table className="w-full text-sm">
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
              <td className="py-2">{p.name}</td>
              <td>{p.isNative ? "Yes" : "No"}</td>
              <td>{p.lightNeeds}</td>
              <td>{p.category}</td>
              <td className="text-right">
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


