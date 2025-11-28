"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EventTemplate = {
  id: string;
  name: string;
  description?: string | null;
  slotMinutes: number;
  maxClientsPerSlot: number;
  rules: any[];
};

export default function AdminEventTemplates() {
  const [eventTemplates, setEventTemplates] = useState<EventTemplate[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/event-templates");
      if (!res.ok) return;
      const data = await res.json();
      setEventTemplates(data);
    }
    load();
  }, []);

  async function createTemplate(formData: FormData) {
    const name = String(formData.get("name") ?? "");
    const description = String(formData.get("description") ?? "");
    const slotMinutes = Number(formData.get("slotMinutes") ?? "30");
    const maxClientsPerSlot = Number(formData.get("maxClientsPerSlot") ?? "1");

    const res = await fetch("/api/admin/event-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, slotMinutes, maxClientsPerSlot })
    });

    if (res.ok) {
      const created = await res.json();
      setEventTemplates(prev => [created, ...prev]);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Failed to create event template");
    }
  }

  async function addRule(eventTemplateId: string) {
    const weekdayStr = prompt("Weekday (0=Sun, 1=Mon, ... 6=Sat)?");
    const start = prompt("Start time (HH:MM)?");
    const end = prompt("End time (HH:MM)?");
    if (!weekdayStr || start == null || end == null) return;

    const weekday = Number(weekdayStr);
    const res = await fetch("/api/admin/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventTemplateId, weekday, startTime: start, endTime: end })
    });

    if (res.ok) {
      const rule = await res.json();
      setEventTemplates(prev =>
        prev.map(t =>
          t.id === eventTemplateId ? { ...t, rules: [...t.rules, rule] } : t
        )
      );
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Failed to add rule");
    }
  }

  return (
    <div className="space-y-6">
      <form
        className="flex flex-wrap gap-3 items-end"
        action={createTemplate}
      >
        <div className="space-y-1">
          <label className="block text-sm font-medium">Name</label>
          <Input name="name" placeholder="Event name" required />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Description</label>
          <Input name="description" placeholder="Optional description" />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Slot minutes</label>
          <Input name="slotMinutes" type="number" defaultValue={30} min={1} />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Max clients/slot</label>
          <Input name="maxClientsPerSlot" type="number" defaultValue={1} min={1} />
        </div>
        <Button type="submit">Create</Button>
      </form>

      <div className="space-y-4">
        {eventTemplates.map(t => (
          <div
            key={t.id}
            className="rounded-xl border p-4 shadow-sm bg-white space-y-2"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-slate-500 break-all">
                  ID: {t.id}
                </div>
              </div>
              <div className="text-sm text-slate-600">
                Slot: {t.slotMinutes} min, max {t.maxClientsPerSlot} clients
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => addRule(t.id)}
            >
              Add rule
            </Button>

            <div className="text-sm text-slate-700">
              <div className="font-medium mt-2">Rules</div>
              <ul className="list-disc pl-5">
                {t.rules.map((rule: any) => (
                  <li key={rule.id}>
                    weekday {rule.weekday}: {rule.startTime}–{rule.endTime}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        {eventTemplates.length === 0 && (
          <div className="text-sm text-slate-500">
            No event templates yet. Create one above.
          </div>
        )}
      </div>
    </div>
  );
}
