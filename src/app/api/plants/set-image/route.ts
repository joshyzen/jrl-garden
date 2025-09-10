import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Backward compatible: if imageUrl provided, set as main imageUrl
// New behavior: if url provided, add PlantImage row; if primary, set main imageUrl too
export async function POST(req: Request) {
  const { id, imageUrl, url, primary, alt } = await req.json();
  if (!id || !(imageUrl || url)) return NextResponse.json({ error: "Missing id or url" }, { status: 400 });

  const useUrl = url || imageUrl;
  // Create plant image row
  await prisma.plantImage.create({ data: { plantId: id, url: useUrl, alt: alt || null, primary: Boolean(primary) } });

  // If marked primary or if plant has no imageUrl yet, set it
  const plant = await prisma.plant.findUnique({ where: { id } });
  if (primary || !plant?.imageUrl) {
    await prisma.plant.update({ where: { id }, data: { imageUrl: useUrl } });
  }

  return NextResponse.json({ ok: true });
}


