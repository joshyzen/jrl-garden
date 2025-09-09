import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.serviceItem.findMany({ orderBy: [{ section: "asc" }, { category: "asc" }, { name: "asc" }] });
  const sections = Array.from(new Set(items.map((i) => i.section).filter(Boolean) as string[]));
  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]));
  return NextResponse.json({ sections, categories, items });
}


