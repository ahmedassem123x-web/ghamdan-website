import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, HomeIcon, BuildingIcon, PanelIcon } from "@/components/icons";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import { pages, bundles } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { webp } from "@/lib/images";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.systems.list.k1, locale as Locale) };
}

/** Capacity badges parsed from the bundle's own components string
 * (e.g. "6kW", "5kWh") — derived from the data, never invented. */
function capacityBadges(components: string): string[] {
  const m = components.match(/\d+(?:\.\d+)?\s*kWh?/g);
  return m ? [...new Set(m.map((x) => x.replace(/\s+/g, "")))] : [];
}

/** Application photo per bundle, from the existing photo set. */
const BUNDLE_IMAGES: Record<string, string> = {
  "bundle-1": "/images/photos/villa-roof.jpg",
  "bundle-2": "/images/photos/house-bright.jpg",
  "bundle-3": "/images/photos/solar-farm.jpg",
};

export default async function SystemsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const s = pages.systems.list;
  const confirmed = bundles.filter((b) => b.status === "confirmed");

  return (
    <>
      <Hero
        locale={l}
        variant="split"
        image="/images/heroes/hero-villa-panels.jpg"
        imageAlt={t(s.k1, l)}
        title={s.k1}
        text={s.k2}
        primaryHref="/contact"
        primaryLabelKey="cta.contactUs"
      />
      <section data-reveal="up" className="section bg-mesh-light">
        <div className="wrap">
          <div data-reveal="fade" className="mb-8">
            <span className="section-marker" aria-hidden="true" />
          </div>
          <div data-stagger className="grid gap-6 md:grid-cols-3">
            {confirmed.map((b) => (
              <article key={b.id} className="card-luxe group flex flex-col overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="overflow-hidden">
                  <img
                    src={webp(BUNDLE_IMAGES[b.id] ?? "/images/photos/solar-farm.jpg")}
                    alt={t(b.name, l)}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex size-12 items-center justify-center rounded-full bg-sky text-primary-hover">
                      {b.id === "bundle-1" ? (
                        <HomeIcon className="size-6" aria-hidden="true" />
                      ) : b.id === "bundle-2" ? (
                        <BuildingIcon className="size-6" aria-hidden="true" />
                      ) : (
                        <PanelIcon className="size-6" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {capacityBadges(t(b.components, l)).map((c) => (
                        <span key={c} dir="ltr" className="rounded-full bg-sky px-2.5 py-1 text-xs font-bold text-navy">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="mt-4 text-h3 font-semibold text-navy">{t(b.name, l)}</h3>
                  <p className="mt-2 text-body-sm font-bold text-text-muted">{t(b.use, l)}</p>
                  <ul className="mt-3 flex-1 list-disc space-y-1 ps-5 text-body-sm text-text-muted">
                    {t(b.components, l)
                      .split("+")
                      .map((part, i) => (
                        <li key={i}>{part.trim()}</li>
                      ))}
                  </ul>
                  <Link href={localizedHref(l, `/systems/${b.slug}`)} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover">
                    {ui("cta.details", l)}
                    <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p data-reveal="fade" className="mt-8 text-body-sm text-text-muted">{t(s.k11, l)}</p>
        </div>
      </section>
      <CTABand locale={l} variant="split" title={s.k12} text={s.k13} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
