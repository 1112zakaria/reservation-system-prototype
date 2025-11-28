import AdminEventTemplates from "@/components/booking/admin-event-templates";

export default function AdminEventTemplatesPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Admin • Event Templates</h1>
      <AdminEventTemplates />
    </main>
  );
}
