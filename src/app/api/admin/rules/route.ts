import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const CreateRule = z.object({
  eventTemplateId: z.string(),
  weekday: z.number().int().min(0).max(6),
  startTime: z.string(), // "09:00"
  endTime: z.string(),   // "17:00"
  isBlackout: z.boolean().default(false),
  date: z.string().optional().nullable() // "YYYY-MM-DD"
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateRule.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { eventTemplateId, weekday, startTime, endTime, isBlackout, date } = parsed.data;

  const rule = await prisma.availabilityRule.create({
    data: {
      eventTemplateId,
      weekday,
      startTime,
      endTime,
      isBlackout,
      date: date ? new Date(date + "T00:00:00") : null
    }
  });
  return NextResponse.json(rule, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.availabilityRule.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
