import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Row = {
  Category: string;
  Name: string;
  "Scientific Name"?: string;
  Native?: string;
  "Light Needs"?: string;
  "Mature Size"?: string;
  Description?: string;
  Price?: string;
  Unit?: string;
};

export async function POST(req: Request) {
  const body = await req.json();
  const rows: Row[] = Array.isArray(body?.rows) ? body.rows : [];
  if (!rows.length) return NextResponse.json({ error: "No rows" }, { status: 400 });

  let imported = 0;
  let updated = 0;
  const errors: Array<{ name: string; error: string }> = [];

  for (const r of rows) {
    try {
      const isNative = String(r.Native || "").toLowerCase().trim();
      const nativeBool = ["true", "yes", "y", "1", "native"].includes(isNative);

      const priceStr = String(r.Price || "").trim();
      let price = null;
      if (priceStr) {
        const parsed = parseFloat(priceStr);
        if (!isNaN(parsed) && parsed >= 0) {
          price = parsed;
        }
      }
      
      const data = {
        name: String(r.Name || "").trim(),
        scientificName: (r["Scientific Name"] || "").trim() || null,
        category: String(r.Category || "Uncategorized").trim(),
        isNative: nativeBool,
        lightNeeds: String(r["Light Needs"] || "").trim(),
        matureSize: String(r["Mature Size"] || "").trim(),
        description: String(r.Description || "").trim(),
        price: price,
        unit: String(r.Unit || "").trim() || null,
      };
      if (!data.name) {
        errors.push({ name: "(missing)", error: "Name is required" });
        continue;
      }

      const existing = await prisma.plant.findFirst({ where: { name: data.name } });
      if (existing) {
        await prisma.plant.update({ where: { id: existing.id }, data });
        updated += 1;
      } else {
        await prisma.plant.create({ data: { ...data, imageUrl: null } });
        imported += 1;
      }
    } catch (e: any) {
      errors.push({ name: r.Name || "(unknown)", error: e.message || "error" });
    }
  }

  return NextResponse.json({ 
    imported, 
    updated, 
    errors,
    message: `Processed ${rows.length} rows: ${imported} imported, ${updated} updated, ${errors.length} errors`
  });
}


