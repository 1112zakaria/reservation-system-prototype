"use client";

import { useEffect, useState } from "react";

type Reservation = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  customerName: string;
  resource: { name: string; id: string };
};

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/reservations");
      setReservations(await res.json());
    }
    load();
  }, []);

  return (
    <div className="space-y-2">
      {reservations.map(r => (
        <div key={r.id} className="rounded-2xl border p-4">
          <div className="font-semibold">{r.customerName}</div>
          <div className="text-sm text-slate-600">
            {new Date(r.startAt).toLocaleString()} → {new Date(r.endAt).toLocaleTimeString()}
          </div>
          <div className="text-sm text-slate-600">
            Resource: {r.resource?.name} ({r.resource?.id})
          </div>
          <div className="text-sm">Status: {r.status}</div>
        </div>
      ))}
      {reservations.length === 0 && (
        <div className="text-slate-500">No reservations yet.</div>
      )}
    </div>
  );
}
