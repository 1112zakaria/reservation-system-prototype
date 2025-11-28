import BookingForm from "@/components/booking/booking-form";

export default function BookingsPage() {
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Book a Slot</h1>
      <BookingForm />
      <p className="text-sm text-slate-500">
        Create event templates and rules in /admin/event-templates, then paste the Event Template ID here.
      </p>
    </main>
  );
}
