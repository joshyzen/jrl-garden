import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const plantId = searchParams.get("plantId");
  if (!plantId) return NextResponse.json({ error: "plantId required" }, { status: 400 });
  const images = await prisma.plantImage.findMany({ where: { plantId }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ images });
}

export async function DELETE(req: Request) {
  const { imageId, plantId } = await req.json();
  if (!imageId) return NextResponse.json({ error: "imageId required" }, { status: 400 });
  const img = await prisma.plantImage.findUnique({ where: { id: imageId } });
  if (!img) return NextResponse.json({ ok: true });
  await prisma.plantImage.delete({ where: { id: imageId } });
  // If the deleted image was primary, set a new primary/thumbnail
  if (img.primary && plantId) {
    const next = await prisma.plantImage.findFirst({ where: { plantId }, orderBy: { createdAt: "asc" } });
    await prisma.plant.update({ where: { id: plantId }, data: { imageUrl: next?.url || null } });
    if (next) await prisma.plantImage.update({ where: { id: next.id }, data: { primary: true } });
  }
  return NextResponse.json({ ok: true });
}


