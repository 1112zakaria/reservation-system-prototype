import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl p-8 space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Booking System MVP
        </h1>
        <p className="text-slate-600 text-lg">
          A clean scaffold for a brandable booking / reservation website.
        </p>
        <div className="flex gap-3">
          <Link href="/bookings">
            <Button>Book Now</Button>
          </Link>
          <Link href="/admin/resources">
            <Button variant="outline">Admin</Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border p-5 shadow-sm">
          <h3 className="font-semibold mb-1">Template-ready</h3>
          <p className="text-sm text-slate-600">
            Placeholder layout and styling ready for branding.
          </p>
        </div>
        <div className="rounded-2xl border p-5 shadow-sm">
          <h3 className="font-semibold mb-1">Slot booking core</h3>
          <p className="text-sm text-slate-600">
            Availability rules, slot generation, and atomic booking.
          </p>
        </div>
        <div className="rounded-2xl border p-5 shadow-sm">
          <h3 className="font-semibold mb-1">Extensible</h3>
          <p className="text-sm text-slate-600">
            Add auth, payments, event templates, policies, and more.
          </p>
        </div>
      </section>
    </main>
  );
}
