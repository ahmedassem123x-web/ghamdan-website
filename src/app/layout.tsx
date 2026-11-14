import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "غمدان للتجارة والتوكيلات | GHAMDAN",
  description: "Ghamdan for Trade and Agencies — official Deye agent in Yemen. Solar energy, storage and pumping systems, from design to installation and follow-up.",
};

/**
 * Root layout: html lang/dir come from the [locale] segment. Pages live under
 * /[locale]/; the root page (/) redirects to /ar on the client.
 */
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const lang = locale === "en" || locale === "zh" ? locale : "ar";
  const dir = lang === "ar" ? "rtl" : "ltr";
  return (
    <html lang={lang} dir={dir} className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-bg font-sans text-text">{children}</body>
    </html>
  );
}
