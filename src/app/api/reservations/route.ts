import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const CreateReservation = z.object({
  resourceId: z.string(),
  startAt: z.string().datetime(),
  customerName: z.string().min(1),
  customerEmail: z.string().email().optional(),
  notes: z.string().optional()
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateReservation.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { resourceId, startAt, customerName, customerEmail, notes } = parsed.data;

  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) return NextResponse.json({ error: "Resource not found" }, { status: 404 });

  const start = new Date(startAt);
  const end = new Date(start.getTime() + resource.slotMinutes * 60_000);

  try {
    const reservation = await prisma.reservation.create({
      data: {
        resourceId,
        startAt: start,
        endAt: end,
        customerName,
        customerEmail,
        notes
      }
    });
    return NextResponse.json(reservation, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
  }
}

export async function GET() {
  const reservations = await prisma.reservation.findMany({
    include: { resource: true },
    orderBy: { startAt: "asc" }
  });
  return NextResponse.json(reservations);
}
