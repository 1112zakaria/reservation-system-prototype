import BookingForm from "@/components/booking/booking-form";

export default function ReservationsPage() {
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Book a Reservation</h1>
      <BookingForm />
      <p className="text-sm text-slate-500">
        You can create resources and rules in /admin/resources, then paste the Resource ID here.
      </p>
    </main>
  );
}
