import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "غمدان للتجارة والتوكيلات | GHAMDAN",
  description: "Ghamdan for Trade and Agencies — official Deye agent in Yemen. Solar energy, storage and pumping systems, from design to installation and follow-up.",
};

/**
 * Root layout. NOTE (D-1, 2026-11-15): this layout sits ABOVE the [locale]
 * segment, so `params.locale` is always undefined here and the emitted
 * `<html>` tag defaults to lang="ar" dir="rtl" for EVERY page. The correct
 * per-locale attrs are applied post-build by tools/fix-html-lang.mjs
 * (wired into `npm run build`): out/en/** → lang="en" dir="ltr",
 * out/zh/** → lang="zh" dir="ltr". Do NOT "fix" this by reading the locale
 * from the URL at runtime — the static export has no request-time locale.
 * Pages live under /[locale]/; the root page (/) redirects to /ar on the client.
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
      <body className="flex min-h-full flex-col bg-background font-sans text-text">{children}</body>
    </html>
  );
}
