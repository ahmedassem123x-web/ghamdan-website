import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckIcon } from "@/components/icons";
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
  const list = products.filter((p) => agency.productIds.includes(p.id) && p.status === "published");

  return (
    <>
      {/* Deye: LOUD navy mesh header with a red official-agent badge.
          Other agencies: quiet light mesh header. Breadcrumbs stay on the
          light page background — the ui.tsx Breadcrumbs use navy/muted text
          and would be unreadable on navy. */}
      <div className="bg-white">
        <Breadcrumbs
          locale={l}
          items={[
            { label: ui("nav.home", l), href: localizedHref(l, "/") },
            { label: ui("nav.agencies", l), href: localizedHref(l, "/agencies") },
            { label: agency.name },
          ]}
        />
      </div>
      <div data-reveal="up" className={agency.officialAgent ? "bg-mesh-navy" : "bg-mesh-light"}>
        <div className="wrap py-12 md:py-16">
          <div data-reveal="fade">
            <div className="mb-4">
              <span className="section-marker" aria-hidden="true" />
            </div>
            {/* D-9 fix 2026-11-15: agency name was a <span> — agency pages
                had no <h1>. Same classes, now the page's single <h1>. */}
            <h1 data-reveal="left" className={`font-latin text-5xl font-extrabold tracking-tight md:text-6xl ${agency.officialAgent ? "text-white" : "text-navy"}`} dir="ltr">
              {agency.name}
            </h1>
            <div data-reveal="fade" className="mt-4 flex flex-wrap items-center gap-2">
              {agency.officialAgent ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red-deep px-4 py-1.5 text-sm font-bold text-white">
                  <CheckIcon className="size-4" aria-hidden="true" />
                  {t(agency.status, l)}
                </span>
              ) : (
                <>
                  <span className="section-marker" aria-hidden="true" />
                  <span className="text-sm font-bold text-navy">
                    {t(agency.status, l)}
                  </span>
                  {agency.confirmationStatus === "pending" && (
                    <span className="inline-flex rounded-full border border-warning/40 bg-warning/15 px-4 py-1.5 text-sm font-bold text-navy">
                      {ui("agency.pendingConfirmation", l)}
                    </span>
                  )}
                </>
              )}
            </div>
            <p data-reveal="fade" className={`mt-5 max-w-2xl text-body-lg ${agency.officialAgent ? "text-sky-100" : "text-text-muted"}`}>{t(agency.text, l)}</p>
            {/* v2 fix: pages.agencies.detail[slug].k2 is byte-identical to
                agency.text for all 6 agencies — rendering both duplicated
                the description paragraph. Keep agency.text only. */}
            {/* Agency product count — real number from the data (1s
                count-up); 0 products shows "coming soon" instead. */}
            {list.length > 0 ? (
              <p data-reveal="fade" className={`mt-5 flex items-baseline gap-2 text-body ${agency.officialAgent ? "text-white" : "text-navy"}`}>
                <span className={`font-latin text-3xl font-extrabold ${agency.officialAgent ? "text-white" : "text-brand-red-text"}`} dir="ltr">
                  <span data-countup={String(list.length)}>{list.length}</span>
                </span>
                <span className="font-bold">{ui("catalog.product", l)}</span>
              </p>
            ) : (
              <p data-reveal="fade" className="mt-5">
                <span className="inline-flex rounded-full bg-sky px-4 py-1.5 text-sm font-bold text-primary-hover">
                  {ui("catalog.comingSoon", l)}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
      <section data-reveal="right" className="section bg-sand">
        <div className="wrap">
          <h2 data-reveal="left" className="text-h2 font-semibold text-navy"
            >{ui("nav.products", l)} — <span dir="ltr">{agency.name}</span>
          </h2>
          {list.length === 0 ? (
            <p data-reveal="fade" className="mt-4 text-body text-text-muted">{ui("catalog.noProducts", l)}</p>
          ) : (
            <div data-stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <ProductCard key={p.id} locale={l} product={p} />
              ))}
            </div>
          )}
          {!agency.officialAgent && (
            <p data-reveal="fade" className="mt-8 max-w-3xl text-body-sm text-text-muted">{t(pages.agencies.list.k9, l)}</p>
          )}
        </div>
      </section>
      <CTABand locale={l} variant="split" title={pages.agencies.list.k10} text={pages.agencies.list.k11} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
