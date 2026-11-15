import type { Metadata } from "next";
import { Info } from "lucide-react";
import Hero from "@/components/Hero";
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
      <section data-reveal className="section">
        <div className="wrap">
          {/* Honest empty state — inlined (visible by default) instead of the
              shared EmptyState (Phase 6 removed the .reveal hiding from the
              shared primitives; this page keeps its inline state). */}
          <div className="rounded-card border border-dashed border-border-strong bg-surface p-10 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-sky text-primary-hover">
              <Info className="size-8" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-h3 font-semibold text-navy">{t(d.k3, l)}</h3>
            <p className="mx-auto mt-3 max-w-xl text-body text-text-muted">{t(d.k4, l)}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <WhatsAppButton locale={l} message={WA_MESSAGES.general[l]} label={ui("cta.whatsappStart", l)} source="downloads" variant="green-pill" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
