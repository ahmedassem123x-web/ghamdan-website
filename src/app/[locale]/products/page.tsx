import type { Metadata } from "next";
import CatalogueClient from "@/components/CatalogueClient";
import { pages } from "@/data";
import { t } from "@/lib/i18n";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.catalog.k15, locale as Locale) };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div data-reveal="fade">
      <CatalogueClient locale={locale as Locale} />
    </div>
  );
}
