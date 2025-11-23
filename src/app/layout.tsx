import "./globals.css";
import SiteHeader from "@/components/site-header";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Reservations MVP",
  description: "Generic reservation MVP scaffold."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
