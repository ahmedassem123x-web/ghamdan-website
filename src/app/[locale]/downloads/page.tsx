import type { Metadata } from "next";
import Hero from "@/components/Hero";
import { EmptyState } from "@/components/ui";
import WhatsAppButton from "@/components/WhatsAppButton";
import { pages } from "@/data";
import { t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.downloads.k1, locale as Locale) };
}

/** Downloads: honest empty state — no files until CI-06 approves them. */
export default async function DownloadsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const d = pages.downloads;
  return (
    <>
      <Hero locale={l} variant="plain" title={d.k1} text={d.k2} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
      <section className="section">
        <div className="wrap">
          <EmptyState title={t(d.k3, l)} copy={t(d.k4, l)}>
            <WhatsAppButton locale={l} message={WA_MESSAGES.general[l]} label={ui("cta.whatsappStart", l)} source="downloads" variant="green-pill" />
          </EmptyState>
        </div>
      </section>
    </>
  );
}
