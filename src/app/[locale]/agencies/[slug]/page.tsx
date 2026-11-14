import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import CTABand from "@/components/CTABand";
import ProductCard from "@/components/ProductCard";
import { Breadcrumbs, Reveal } from "@/components/ui";
import { pages, agencies, products } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import type { Locale } from "@/data";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ["ar", "en", "zh"]) {
    for (const a of agencies) params.push({ locale, slug: a.id });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = agencies.find((x) => x.id === slug);
  return { title: a ? a.name : "" };
}

export default async function AgencyDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const agency = agencies.find((x) => x.id === slug);
  if (!agency) notFound();
  const copy = pages.agencies.detail[slug];
  const list = products.filter((p) => agency.productIds.includes(p.id) && p.status === "published");

  return (
    <>
      <div className="bg-surface">
        <Breadcrumbs
          locale={l}
          items={[
            { label: ui("nav.home", l), href: localizedHref(l, "/") },
            { label: ui("nav.agencies", l), href: localizedHref(l, "/agencies") },
            { label: agency.name },
          ]}
        />
        <div className="wrap py-12 md:py-16">
          <Reveal>
            <span className="font-latin text-5xl font-extrabold tracking-tight text-primary md:text-6xl" dir="ltr">
              {agency.name}
            </span>
            <div className="mt-4">
              {agency.officialAgent ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-4 py-1.5 text-sm font-bold text-accent">
                  <BadgeCheck className="size-4" aria-hidden="true" />
                  {t(agency.status, l)}
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-surface-blue px-4 py-1.5 text-sm font-bold text-primary">
                  {t(agency.status, l)}
                </span>
              )}
            </div>
            <p className="mt-5 max-w-2xl text-body-lg text-text-muted">{t(agency.text, l)}</p>
            {copy && copy.k2 && <p className="mt-3 max-w-2xl text-body text-text-muted">{t(copy.k2, l)}</p>}
          </Reveal>
        </div>
      </div>
      <section className="section">
        <div className="wrap">
          <h2 className="text-h2 font-extrabold text-primary">
            {ui("nav.products", l)} — <span dir="ltr">{agency.name}</span>
          </h2>
          {list.length === 0 ? (
            <p className="mt-4 text-body text-text-muted">{ui("catalog.noProducts", l)}</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
              {list.map((p) => (
                <ProductCard key={p.id} locale={l} product={p} />
              ))}
            </div>
          )}
          {!agency.officialAgent && (
            <p className="mt-8 max-w-3xl text-body-sm text-text-muted">{t(pages.agencies.list.k9, l)}</p>
          )}
        </div>
      </section>
      <CTABand locale={l} variant="split" title={pages.agencies.list.k10} text={pages.agencies.list.k11} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
