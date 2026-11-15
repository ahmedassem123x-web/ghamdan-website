import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BadgeCheck } from "lucide-react";
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
  return (
    <>
      <Hero locale={l} variant="plain" title={a.k1} text={a.k2} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
      <section data-reveal className="section">
        <div className="wrap">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agencies.map((ag) => (
              <Link
                key={ag.id}
                href={localizedHref(l, `/agencies/${ag.id}`)}
                className="group flex flex-col rounded-card bg-surface p-6 shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="font-latin text-3xl font-extrabold tracking-tight text-navy" dir="ltr">
                    {ag.name}
                  </span>
                  {ag.officialAgent && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky px-3 py-1 text-xs font-bold text-primary-hover">
                      <BadgeCheck className="size-3.5" aria-hidden="true" />
                      {t(ag.status, l)}
                    </span>
                  )}
                </div>
                {!ag.officialAgent && (
                  <span className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex w-fit rounded-full bg-sky px-3 py-1 text-xs font-bold text-navy">
                      {t(ag.status, l)}
                    </span>
                    {ag.confirmationStatus === "pending" && (
                      <span className="inline-flex w-fit rounded-full border border-warning/40 bg-warning/15 px-3 py-1 text-xs font-bold text-navy">
                        {ui("agency.pendingConfirmation", l)}
                      </span>
                    )}
                  </span>
                )}
                <p className="mt-3 flex-1 text-body-sm text-text-muted">{t(ag.text, l)}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover">
                  {ui("cta.details", l)}
                  <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-body-sm text-text-muted">{t(a.k9, l)}</p>
        </div>
      </section>
      <CTABand locale={l} variant="split" title={a.k10} text={a.k11} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
