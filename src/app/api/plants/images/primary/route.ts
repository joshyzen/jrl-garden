import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { plantId, imageId } = await req.json();
  if (!plantId || !imageId) return NextResponse.json({ error: "plantId and imageId required" }, { status: 400 });

  const img = await prisma.plantImage.findUnique({ where: { id: imageId } });
  if (!img || img.plantId !== plantId) return NextResponse.json({ error: "Image not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.plantImage.updateMany({ where: { plantId }, data: { primary: false } }),
    prisma.plantImage.update({ where: { id: imageId }, data: { primary: true } }),
    prisma.plant.update({ where: { id: plantId }, data: { imageUrl: img.url } }),
  ]);

  return NextResponse.json({ ok: true });
}


