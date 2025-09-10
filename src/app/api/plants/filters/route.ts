import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.plant.findMany({ distinct: ["category"], select: { category: true } });
  const lightNeeds = await prisma.plant.findMany({ distinct: ["lightNeeds"], select: { lightNeeds: true } });
  const matureSize = await prisma.plant.findMany({ distinct: ["matureSize"], select: { matureSize: true } });

  return NextResponse.json({
    categories: categories.map((x) => x.category).filter(Boolean).sort(),
    lightNeeds: lightNeeds.map((x) => x.lightNeeds).filter(Boolean).sort(),
    matureSizes: matureSize.map((x) => x.matureSize).filter(Boolean).sort(),
  });
}


