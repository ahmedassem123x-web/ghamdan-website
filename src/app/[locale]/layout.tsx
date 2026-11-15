import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { ZhNotice } from "@/components/ui";
import LocaleHtmlAttrs from "@/components/LocaleHtmlAttrs";
import MotionProvider from "@/lib/motion";
import { LOCALES } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { detailMetadata } from "@/lib/metadata";
import { siteSettings } from "@/data";
import type { Locale } from "@/data";

const SITE_DESCRIPTION = {
  ar: "غمدان للتجارة والتوكيلات — وكيل Deye الرسمي في اليمن. أنظمة الطاقة الشمسية والتخزين والضخ، من التصميم إلى التركيب والمتابعة.",
  en: "Ghamdan for Trade and Agencies — official Deye agent in Yemen. Solar energy, storage and pumping systems, from design to installation and follow-up.",
} as const;

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
  return detailMetadata({
    locale: l,
    path: "/",
    title: `${t(siteSettings.brand.name, l)} — ${t(siteSettings.brand.tagline, l)}`,
    description: t(SITE_DESCRIPTION, l),
  });
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
  const skipLabel = l === "ar" ? "تخطَّ إلى المحتوى" : l === "en" ? "Skip to main content" : "跳到主要内容";
  return (
    <>
      <a href="#main" className="skip-link">
        {skipLabel}
      </a>
      <LocaleHtmlAttrs locale={l} />
      <MotionProvider />
      <TopBar locale={l} />
      <Header locale={l} />
      <ZhNotice locale={l} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer locale={l} />
      <WhatsAppFloat locale={l} />
    </>
  );
}
