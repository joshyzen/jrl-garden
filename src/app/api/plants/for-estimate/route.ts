import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const plants = await prisma.plant.findMany({
      where: {
        AND: [
          { price: { not: null, gt: 0 } },
          { unit: { not: null } },
          { unit: { not: "" } }
        ]
      },
      select: {
        id: true,
        name: true,
        category: true,
        isNative: true,
        lightNeeds: true,
        imageUrl: true,
        price: true,
        unit: true,
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json({ plants });
  } catch (error) {
    console.error("Error fetching plants for estimate:", error);
    return NextResponse.json({ error: "Failed to fetch plants" }, { status: 500 });
  }
}
