import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { clientName, phone, address, details, items, total } = body;
  const estimate = await prisma.estimate.create({
    data: {
      clientName,
      phone,
      address,
      items: items ?? [],
      total: Number(total) || 0,
      status: "pending",
    },
  });
  return NextResponse.json({ id: estimate.id });
}


