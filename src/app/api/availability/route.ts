import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSlotsForDate } from "@/modules/reservations/slotting";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventTemplateId = searchParams.get("eventTemplateId");
  const dateStr = searchParams.get("date"); // YYYY-MM-DD

  if (!eventTemplateId || !dateStr) {
    return NextResponse.json({ error: "eventTemplateId and date are required" }, { status: 400 });
  }

  const date = new Date(dateStr + "T00:00:00");
  const eventTemplate = await prisma.eventTemplate.findUnique({
    where: { id: eventTemplateId },
    include: { rules: true }
  });

  if (!eventTemplate) {
    return NextResponse.json({ error: "Event template not found" }, { status: 404 });
  }

  const slots = generateSlotsForDate(
    date,
    eventTemplate.rules,
    eventTemplate.slotMinutes
  );

  if (!slots.length) {
    return NextResponse.json({ eventTemplateId, date: dateStr, slots: [] });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      eventTemplateId,
      startAt: { gte: slots[0].startAt, lt: slots[slots.length - 1].endAt }
    }
  });

  const bookedStarts = new Set(bookings.map(b => b.startAt.toISOString()));
  const available = slots.filter(s => !bookedStarts.has(s.startAt.toISOString()));

  return NextResponse.json({ eventTemplateId, date: dateStr, slots: available });
}
