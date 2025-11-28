import AdminBookings from "@/components/booking/admin-bookings";

export default function AdminBookingsPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Admin • Bookings</h1>
      <AdminBookings />
    </main>
  );
}
