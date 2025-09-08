import { prisma } from "@/lib/prisma";

export default async function AdminPlants() {
  const plants = await prisma.plant.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Plants</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left opacity-60">
            <th>Name</th>
            <th>Native</th>
            <th>Light</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {plants.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-2">{p.name}</td>
              <td>{p.isNative ? "Yes" : "No"}</td>
              <td>{p.lightNeeds}</td>
              <td>{p.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


