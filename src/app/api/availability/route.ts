import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSlotsForDate } from "@/modules/reservations/slotting";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resourceId = searchParams.get("resourceId");
  const dateStr = searchParams.get("date"); // YYYY-MM-DD

  if (!resourceId || !dateStr) {
    return NextResponse.json({ error: "resourceId and date are required" }, { status: 400 });
  }

  const date = new Date(dateStr + "T00:00:00");
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    include: { rules: true }
  });
  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  const slots = generateSlotsForDate(
    date,
    resource.rules.map(r => ({
      weekday: r.weekday,
      startTime: r.startTime,
      endTime: r.endTime,
      isBlackout: r.isBlackout,
      date: r.date ?? undefined
    })),
    resource.slotMinutes
  );

  if (!slots.length) return NextResponse.json({ resourceId, date: dateStr, slots: [] });

  const reservations = await prisma.reservation.findMany({
    where: {
      resourceId,
      startAt: { gte: slots[0].startAt, lt: slots[slots.length - 1].endAt }
    }
  });

  const bookedStarts = new Set(reservations.map(r => r.startAt.toISOString()));
  const available = slots.filter(s => !bookedStarts.has(s.startAt.toISOString()));

  return NextResponse.json({ resourceId, date: dateStr, slots: available });
}
