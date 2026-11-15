import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import CTABand from "@/components/CTABand";
import ProductCard from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/ui";
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
          <div>
            {/* D-9 fix 2026-11-15: agency name was a <span> — agency pages
                had no <h1>. Same classes, now the page's single <h1>. */}
            <h1 className="font-latin text-5xl font-extrabold tracking-tight text-navy md:text-6xl" dir="ltr">
              {agency.name}
            </h1>
            <div className="mt-4">
              {agency.officialAgent ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky px-4 py-1.5 text-sm font-bold text-primary-hover">
                  <BadgeCheck className="size-4" aria-hidden="true" />
                  {t(agency.status, l)}
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-sky px-4 py-1.5 text-sm font-bold text-navy">
                  {t(agency.status, l)}
                </span>
              )}
            </div>
            <p className="mt-5 max-w-2xl text-body-lg text-text-muted">{t(agency.text, l)}</p>
            {copy && copy.k2 && <p className="mt-3 max-w-2xl text-body text-text-muted">{t(copy.k2, l)}</p>}
          </div>
        </div>
      </div>
      <section className="section">
        <div className="wrap">
          <h2 className="text-h2 font-semibold text-navy"
            >{ui("nav.products", l)} — <span dir="ltr">{agency.name}</span>
          </h2>
          {list.length === 0 ? (
            <p className="mt-4 text-body text-text-muted">{ui("catalog.noProducts", l)}</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
