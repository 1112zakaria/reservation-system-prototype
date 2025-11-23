import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const CreateResource = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  slotMinutes: z.number().int().positive().default(30),
  capacity: z.number().int().positive().default(1)
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateResource.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const resource = await prisma.resource.create({ data: parsed.data });
  return NextResponse.json(resource, { status: 201 });
}

export async function GET() {
  const resources = await prisma.resource.findMany({
    include: { rules: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(resources);
}
