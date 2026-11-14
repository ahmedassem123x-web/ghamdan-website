import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import MotionProvider from "@/lib/motion";
import { LOCALES } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { siteSettings } from "@/data";
import type { Locale } from "@/data";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (LOCALES as string[]).includes(locale) ? (locale as Locale) : "ar";
  return {
    title: `${t(siteSettings.brand.name, l)} — ${t(siteSettings.brand.tagline, l)}`,
    description: "Ghamdan for Trade and Agencies — official Deye agent in Yemen. Solar energy, storage and pumping systems, from design to installation and follow-up.",
    alternates: {
      languages: {
        ar: "/ar",
        en: "/en",
        zh: "/zh",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = (LOCALES as string[]).includes(locale) ? (locale as Locale) : "ar";
  return (
    <>
      <MotionProvider />
      <TopBar locale={l} />
      <Header locale={l} />
      <main className="flex-1">{children}</main>
      <Footer locale={l} />
      <WhatsAppFloat locale={l} />
    </>
  );
}
