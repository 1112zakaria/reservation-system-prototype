import AdminReservations from "@/components/booking/admin-reservations";

export default function AdminReservationsPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Admin • Reservations</h1>
      <AdminReservations />
    </main>
  );
}
