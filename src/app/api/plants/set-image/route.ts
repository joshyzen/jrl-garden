import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id, imageUrl } = await req.json();
  if (!id || !imageUrl) return NextResponse.json({ error: "Missing id or imageUrl" }, { status: 400 });
  await prisma.plant.update({ where: { id }, data: { imageUrl } });
  return NextResponse.json({ ok: true });
}


