import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const CreateBooking = z.object({
  eventTemplateId: z.string(),
  startAt: z.string().datetime(),
  customerName: z.string().min(1),
  customerEmail: z.string().email().optional(),
  notes: z.string().optional()
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateBooking.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { eventTemplateId, startAt, customerName, customerEmail, notes } = parsed.data;

  const eventTemplate = await prisma.eventTemplate.findUnique({ where: { id: eventTemplateId } });
  if (!eventTemplate) {
    return NextResponse.json({ error: "Event template not found" }, { status: 404 });
  }

  const slotMinutes = eventTemplate.slotMinutes;
  const start = new Date(startAt);
  const end = new Date(start.getTime() + slotMinutes * 60_000);

  try {
    const booking = await prisma.booking.create({
      data: {
        eventTemplateId,
        startAt: start,
        endAt: end,
        customerName,
        customerEmail,
        notes
      }
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (e: any) {
    // relies on @@unique([eventTemplateId, startAt])
    return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
  }
}

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: { eventTemplate: true },
    orderBy: { startAt: "asc" }
  });
  return NextResponse.json(bookings);
}
