import { prisma } from "@/lib/prisma";

function toCsvRow(values: (string | number | boolean | null | undefined)[]) {
  return values
    .map((v) => {
      const s = v === null || v === undefined ? "" : String(v);
      if (/[",\n]/.test(s)) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    })
    .join(",");
}

export async function GET() {
  const plants = await prisma.plant.findMany({ orderBy: { createdAt: "desc" } });
  const headers = [
    "Category",
    "Name",
    "Scientific Name",
    "Native",
    "Light Needs",
    "Mature Size",
    "Description",
    "Price",
    "Unit",
    "Image URL",
  ];
  const lines = [headers.join(",")];
  for (const p of plants) {
    lines.push(
      toCsvRow([
        p.category,
        p.name,
        (p as any).scientificName || "",
        p.isNative ? "true" : "false",
        p.lightNeeds,
        p.matureSize,
        p.description,
        (p as any).price || "",
        (p as any).unit || "",
        p.imageUrl || "",
      ])
    );
  }

  const csv = lines.join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="plants_export.csv"`,
      "Cache-Control": "no-store",
    },
  });
}


