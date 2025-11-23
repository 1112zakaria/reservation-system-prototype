"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Slot = { startAt: string; endAt: string };

export default function BookingForm() {
  const [resourceId, setResourceId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    async function load() {
      if (!resourceId || !date) return;
      const res = await fetch(`/api/availability?resourceId=${resourceId}&date=${date}`);
      const data = await res.json();
      setSlots(data.slots || []);
    }
    load();
  }, [resourceId, date]);

  async function book() {
    if (!selectedStart || !name) return;
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        resourceId,
        startAt: selectedStart,
        customerName: name
      })
    });

    if (res.ok) {
      alert("Booked!");
      setSelectedStart(null);
      // refresh
      const data = await (await fetch(`/api/availability?resourceId=${resourceId}&date=${date}`)).json();
      setSlots(data.slots || []);
    } else {
      const e = await res.json();
      alert(e.error || "Failed to book");
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Resource ID (create in admin)"
        value={resourceId}
        onChange={e => setResourceId(e.target.value)}
      />
      <Input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      <Input
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-2">
        {slots.map(s => {
          const isSelected = selectedStart === s.startAt;
          return (
            <Button
              key={s.startAt}
              variant={isSelected ? "default" : "outline"}
              onClick={() => setSelectedStart(s.startAt)}
              className="justify-start"
            >
              {new Date(s.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Button>
          );
        })}
      </div>

      <Button disabled={!selectedStart || !name} onClick={book}>
        Confirm Booking
      </Button>
    </div>
  );
}
