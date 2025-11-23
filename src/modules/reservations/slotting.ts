import { addMinutes, isBefore, parse, set } from "date-fns";

export type Rule = {
  weekday: number;
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  isBlackout: boolean;
  date?: Date | null;
};

export function generateSlotsForDate(
  date: Date,
  rules: Rule[],
  slotMinutes: number
) {
  const weekday = date.getDay();
  const todaysRules = rules
    .filter(r => (r.date ? sameDay(r.date, date) : r.weekday === weekday))
    .filter(r => !r.isBlackout);

  const slots: { startAt: Date; endAt: Date }[] = [];

  for (const rule of todaysRules) {
    const start = setTime(date, rule.startTime);
    const end = setTime(date, rule.endTime);

    let cursor = start;
    while (
      isBefore(addMinutes(cursor, slotMinutes), end) ||
      +addMinutes(cursor, slotMinutes) === +end
    ) {
      const slotEnd = addMinutes(cursor, slotMinutes);
      slots.push({ startAt: cursor, endAt: slotEnd });
      cursor = slotEnd;
    }
  }

  return slots;
}

function setTime(day: Date, hhmm: string) {
  const parsed = parse(hhmm, "HH:mm", day);
  return set(day, {
    hours: parsed.getHours(),
    minutes: parsed.getMinutes(),
    seconds: 0,
    milliseconds: 0
  });
}

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}
