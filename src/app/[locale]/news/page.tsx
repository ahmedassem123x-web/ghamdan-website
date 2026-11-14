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
  return { title: t(pages.news.k1, locale as Locale) };
}

/** News: honest empty state — 0 articles until CI-07 approves content. */
export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const n = pages.news;
  return (
    <>
      <Hero locale={l} variant="plain" title={n.k1} text={n.k2} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
      <section className="section">
        <div className="wrap">
          <EmptyState title={t(n.k3, l)} copy={t(n.k4, l)}>
            <WhatsAppButton locale={l} message={WA_MESSAGES.general[l]} label={ui("cta.whatsappStart", l)} source="news" variant="green-pill" />
          </EmptyState>
        </div>
      </section>
    </>
  );
}
