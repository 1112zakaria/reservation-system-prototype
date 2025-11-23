"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Resource = {
  id: string;
  name: string;
  description?: string | null;
  slotMinutes: number;
  capacity: number;
  rules: any[];
};

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [name, setName] = useState("");
  const [slotMinutes, setSlotMinutes] = useState(30);

  async function load() {
    const res = await fetch("/api/admin/resources");
    setResources(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function createResource() {
    const res = await fetch("/api/admin/resources", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, slotMinutes, capacity: 1 })
    });
    if (res.ok) {
      setName("");
      load();
    } else {
      alert("Failed to create resource");
    }
  }

  async function addRule(resourceId: string) {
    const weekday = Number(prompt("Weekday 0=Sun ... 6=Sat", "1"));
    const startTime = prompt("Start time HH:mm", "09:00") || "09:00";
    const endTime = prompt("End time HH:mm", "17:00") || "17:00";

    const res = await fetch("/api/admin/rules", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ resourceId, weekday, startTime, endTime })
    });
    if (res.ok) load();
    else alert("Failed to add rule");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-4 space-y-2">
        <h2 className="font-semibold">Create Resource</h2>
        <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <Input
          type="number"
          placeholder="Slot minutes"
          value={slotMinutes}
          onChange={e => setSlotMinutes(Number(e.target.value))}
        />
        <Button onClick={createResource} disabled={!name}>Create</Button>
      </div>

      <div className="space-y-4">
        {resources.map(r => (
          <div key={r.id} className="rounded-2xl border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{r.name}</h3>
                <p className="text-sm text-slate-600">ID: {r.id}</p>
                <p className="text-sm text-slate-600">Slot: {r.slotMinutes} min</p>
              </div>
              <Button variant="outline" onClick={() => addRule(r.id)}>Add Rule</Button>
            </div>

            <div className="text-sm text-slate-700">
              <div className="font-medium mb-1">Rules</div>
              {r.rules.length === 0 && <div className="text-slate-500">No rules yet.</div>}
              <ul className="list-disc pl-5">
                {r.rules.map((rule: any) => (
                  <li key={rule.id}>
                    weekday {rule.weekday}: {rule.startTime}–{rule.endTime}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
