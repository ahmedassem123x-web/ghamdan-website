import type { Metadata } from "next";
import SearchClient from "@/components/SearchClient";
import { pages } from "@/data";
import { t } from "@/lib/i18n";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.search.k1, locale as Locale) };
}

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <SearchClient locale={locale as Locale} />;
}
