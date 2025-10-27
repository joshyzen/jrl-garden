import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEstimateNotification } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json();
  const { clientName, phone, address, details, items, total } = body;
  
  // Validate required fields
  if (!clientName || !clientName.trim()) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }
  
  // Validate phone number
  const phoneRegex = /^[\d\s\-\(\)\+\.]+$/;
  const digitsOnly = (phone || '').replace(/\D/g, '');
  
  if (!phone || !phone.trim()) {
    return NextResponse.json(
      { error: "Phone number is required" },
      { status: 400 }
    );
  }
  
  if (!phoneRegex.test(phone) || digitsOnly.length < 10) {
    return NextResponse.json(
      { error: "Please enter a valid phone number (at least 10 digits)" },
      { status: 400 }
    );
  }
  
  // Validate address
  if (!address || !address.trim()) {
    return NextResponse.json(
      { error: "Address is required" },
      { status: 400 }
    );
  }
  
  // Validate details
  if (!details || !details.trim()) {
    return NextResponse.json(
      { error: "Please describe what you need done" },
      { status: 400 }
    );
  }
  
  // Save to database
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

  // Send email notification (don't block the response if it fails)
  if (process.env.RESEND_API_KEY) {
    sendEstimateNotification({
      clientName,
      phone,
      address,
      details,
      items,
      total: Number(total) || 0,
    }).catch((error) => {
      console.error('Failed to send email notification:', error);
    });
  } else {
    console.warn('RESEND_API_KEY not configured - skipping email notification');
  }

  return NextResponse.json({ id: estimate.id });
}


