import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const CreateEventTemplate = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  slotMinutes: z.number().int().positive().default(30),
  maxClientsPerSlot: z.number().int().positive().default(1)
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateEventTemplate.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const eventTemplate = await prisma.eventTemplate.create({ data: parsed.data });
  return NextResponse.json(eventTemplate, { status: 201 });
}

export async function GET() {
  const eventTemplates = await prisma.eventTemplate.findMany({
    include: { rules: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(eventTemplates);
}
