import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          {process.env.NEXT_PUBLIC_APP_NAME || "Booking System MVP"}
        </Link>
        <nav className="flex gap-4 text-sm text-slate-600">
          <Link href="/bookings" className="hover:text-slate-900">Bookings</Link>
          <Link href="/admin/event-templates" className="hover:text-slate-900">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
