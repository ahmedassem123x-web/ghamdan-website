import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Package, Archive } from "lucide-react";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import { SectionHeadingL } from "@/components/ui";
import { pages, bundles } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.systems.list.k1, locale as Locale) };
}

export default async function SystemsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const s = pages.systems.list;
  const confirmed = bundles.filter((b) => b.status === "confirmed");
  const archived = bundles.filter((b) => b.status === "archived");

  return (
    <>
      <Hero
        locale={l}
        variant="split"
        image="/images/heroes/hero-villa-panels.jpg"
        imageAlt={t(s.k1, l)}
        eyebrow={s.k1}
        title={s.k1}
        text={s.k2}
        primaryHref="/contact"
        primaryLabelKey="cta.contactUs"
      />
      <section className="section">
        <div className="wrap">
          <div className="grid gap-6 md:grid-cols-3" data-stagger>
            {confirmed.map((b) => (
              <article key={b.id} className="flex flex-col rounded-card bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="flex items-center gap-2">
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Package className="size-6" aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">{t(s.k3, l)}</span>
                </div>
                <h3 className="mt-4 text-h3 font-extrabold text-primary">{t(b.name, l)}</h3>
                <p className="mt-2 text-body-sm font-bold text-text-muted">{t(b.use, l)}</p>
                <p className="mt-3 flex-1 text-body-sm text-text-muted">{t(b.components, l)}</p>
                <Link href={localizedHref(l, `/systems/${b.slug}`)} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-accent transition-colors hover:text-accent-strong">
                  {ui("cta.details", l)}
                  <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>

          {/* Archived bundle — muted, no CTA */}
          {archived.map((b) => (
            <article key={b.id} className="mt-6 flex flex-col rounded-card border border-border bg-surface-muted p-6 opacity-75 md:flex-row md:items-center md:gap-6">
              <div className="flex items-center gap-2">
                <div className="flex size-12 items-center justify-center rounded-full bg-surface text-text-faint">
                  <Archive className="size-6" aria-hidden="true" />
                </div>
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-text-muted">{t(s.k9, l)}</span>
              </div>
              <div className="mt-4 md:mt-0">
                <h3 className="text-h3 font-extrabold text-text-muted">{t(b.name, l)}</h3>
                <p className="mt-1 text-body-sm text-text-muted">{t(b.use, l)}</p>
              </div>
            </article>
          ))}

          <p className="mt-8 text-body-sm text-text-muted">{t(s.k11, l)}</p>
        </div>
      </section>
      <CTABand locale={l} variant="split" title={s.k12} text={s.k13} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
