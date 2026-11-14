import type { Metadata } from "next";
import AdminClient from "@/components/AdminClient";
import type { Locale } from "@/data";

export const metadata: Metadata = {
  title: "Admin — Demo",
  robots: { index: false, follow: false },
};

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AdminClient locale={locale as Locale} />;
}
