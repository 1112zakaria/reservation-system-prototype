"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  customerName: string;
  eventTemplate: { name: string; id: string };
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/bookings");
      if (!res.ok) return;
      const data = await res.json();
      setBookings(data);
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">All Bookings</h2>
      {bookings.map(b => (
        <div
          key={b.id}
          className="rounded-xl border px-4 py-3 flex flex-col gap-1 bg-white shadow-sm"
        >
          <div className="font-medium">{b.customerName}</div>
          <div className="text-sm">
            {new Date(b.startAt).toLocaleString()} →{" "}
            {new Date(b.endAt).toLocaleTimeString()}
          </div>
          <div className="text-sm text-slate-600">
            Event: {b.eventTemplate?.name} ({b.eventTemplate?.id})
          </div>
          <div className="text-sm">Status: {b.status}</div>
        </div>
      ))}
      {bookings.length === 0 && (
        <div className="text-slate-500">No bookings yet.</div>
      )}
    </div>
  );
}
