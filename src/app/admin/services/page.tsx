import { prisma } from "@/lib/prisma";

export default async function AdminServices() {
  const items = await prisma.serviceItem.findMany({ orderBy: { category: "asc" } });
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Services</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left opacity-60">
            <th>Category</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Price/Unit</th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="py-2">{s.category}</td>
              <td>{s.name}</td>
              <td>{s.unit}</td>
              <td>${s.pricePerUnit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


