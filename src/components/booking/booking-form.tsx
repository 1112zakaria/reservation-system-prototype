"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Slot = { startAt: string; endAt: string };

export default function BookingForm() {
  const [eventTemplateId, setEventTemplateId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    async function loadAvailability() {
      setSelectedStart(null);
      if (!eventTemplateId || !date) {
        setSlots([]);
        return;
      }

      const res = await fetch(
        `/api/availability?eventTemplateId=${encodeURIComponent(eventTemplateId)}&date=${encodeURIComponent(
          date
        )}`
      );
      if (!res.ok) {
        setSlots([]);
        return;
      }
      const data = await res.json();
      setSlots(data.slots ?? []);
    }

    loadAvailability();
  }, [eventTemplateId, date]);

  async function book() {
    if (!selectedStart || !name || !eventTemplateId) return;

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventTemplateId,
        startAt: selectedStart,
        customerName: name
      })
    });

    if (res.ok) {
      alert("Booked!");
      // refresh availability
      const data = await res.json();
      console.log("Booking created", data);
      setSelectedStart(null);
      const availability = await fetch(
        `/api/availability?eventTemplateId=${encodeURIComponent(eventTemplateId)}&date=${encodeURIComponent(
          date
        )}`
      );
      const availabilityData = await availability.json();
      setSlots(availabilityData.slots ?? []);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Failed to book");
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Event Template ID</label>
        <Input
          value={eventTemplateId}
          onChange={e => setEventTemplateId(e.target.value)}
          placeholder="Paste an Event Template ID"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Date</label>
        <Input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Your Name</label>
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Jane Doe"
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Available Slots</div>
        <div className="flex flex-wrap gap-2">
          {slots.map(s => (
            <Button
              key={s.startAt}
              type="button"
              variant={selectedStart === s.startAt ? "default" : "outline"}
              onClick={() => setSelectedStart(s.startAt)}
              className="justify-start"
            >
              {new Date(s.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Button>
          ))}
          {slots.length === 0 && (
            <div className="text-sm text-slate-500">No available slots for this date.</div>
          )}
        </div>
      </div>

      <Button disabled={!selectedStart || !name} onClick={book}>
        Confirm Booking
      </Button>
    </div>
  );
}
