import type { Metadata } from "next";
import GuidanceClient from "@/components/GuidanceClient";
import { pages } from "@/data";
import { t } from "@/lib/i18n";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.guidance.k1, locale as Locale) };
}

export default async function GuidancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div data-reveal="fade">
      <GuidanceClient locale={locale as Locale} />
    </div>
  );
}
