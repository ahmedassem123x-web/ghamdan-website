import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import { pages, agencies } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.agencies.list.k1, locale as Locale) };
}

/** Agencies: text wordmarks only — no brand logos (unverified). Only Deye is a confirmed official agent. */
export default async function AgenciesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const a = pages.agencies.list;
  /** Distinct wordmark treatment per brand (weight / tracking / case) —
   * a unified typographic system, not a plain Inter string and not an
   * invented logo. */
  const wordmarkStyle: Record<string, string> = {
    deye: "font-black tracking-tight",
    efore: "font-extrabold uppercase tracking-[0.18em]",
    must: "font-black italic tracking-tight",
    jntech: "font-bold tracking-wide",
    qcells: "font-semibold tracking-tight",
    wisenet: "font-extrabold tracking-[0.12em]",
  };
  return (
    <>
      <Hero
        locale={l}
        variant="split"
        image="/images/photos/inverter-unit.jpg"
        imageAlt={t(a.k1, l)}
        title={a.k1}
        text={a.k2}
        primaryHref="/contact"
        primaryLabelKey="cta.contactUs"
      />
      <section data-reveal="up" className="section bg-mesh-light">
        <div className="wrap">
          <div data-reveal="fade" className="mb-8">
            <span className="section-marker" aria-hidden="true" />
          </div>
          <div data-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agencies.map((ag) => (
              <Link
                key={ag.id}
                href={localizedHref(l, `/agencies/${ag.id}`)}
                className={`group flex h-full flex-col rounded-card p-6 shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card-hover ${
                  ag.officialAgent
                    ? "bg-mesh-navy"
                    : "border border-border bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-latin text-3xl ${wordmarkStyle[ag.id] ?? "font-extrabold tracking-tight"} ${ag.officialAgent ? "text-white" : "text-navy"}`} dir="ltr">
                    {ag.name}
                  </span>
                  {ag.officialAgent && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-red-deep px-3 py-1 text-xs font-bold text-white">
                      <CheckIcon className="size-3.5" aria-hidden="true" />
                      {t(ag.status, l)}
                    </span>
                  )}
                </div>
                {!ag.officialAgent && (
                  <span className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="section-marker" aria-hidden="true" />
                    <span className="text-xs font-bold text-navy">
                      {t(ag.status, l)}
                    </span>
                    {ag.confirmationStatus === "pending" && (
                      <span className="inline-flex w-fit rounded-full border border-warning/60 bg-warning/25 px-3 py-1 text-xs font-bold text-navy">
                        {ui("agency.pendingConfirmation", l)}
                      </span>
                    )}
                  </span>
                )}
                <p className={`mt-3 flex-1 text-body-sm ${ag.officialAgent ? "text-sky-100" : "text-text-muted"}`}>{t(ag.text, l)}</p>
                <span className={`mt-4 inline-flex items-center gap-1.5 text-sm font-bold ${ag.officialAgent ? "text-white" : "text-primary-hover"}`}>
                  {ui("cta.details", l)}
                  <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
          <p data-reveal="fade" className="mt-8 max-w-3xl text-body-sm text-text-muted">{t(a.k9, l)}</p>
        </div>
      </section>
      <CTABand locale={l} variant="split" title={a.k10} text={a.k11} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
