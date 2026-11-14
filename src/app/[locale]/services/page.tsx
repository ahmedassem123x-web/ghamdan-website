import type { Metadata } from "next";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import { categoryIcon } from "@/components/Cards";
import { SectionHeadingL } from "@/components/ui";
import { pages, services } from "@/data";
import { t } from "@/lib/i18n";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.services.k1, locale as Locale) };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const s = pages.services;
  return (
    <>
      <Hero
        locale={l}
        variant="plain"
        title={s.k1}
        text={s.k2}
        primaryHref="/contact"
        primaryLabelKey="cta.contactUs"
      />
      <section className="section">
        <div className="wrap">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
            {services.map((svc) => (
              <div key={svc.title.ar} className="rounded-card bg-surface p-6 shadow-card">
                <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">{categoryIcon(svc.icon)}</div>
                <h3 className="mt-4 text-h4 font-extrabold text-primary">{t(svc.title, l)}</h3>
                <p className="mt-2 text-body-sm text-text-muted">{t(svc.text, l)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTABand locale={l} variant="split" title={s.k15} text={s.k16} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
