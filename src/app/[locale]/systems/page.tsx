import type { Metadata } from "next";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import BundleStack, { BundleCard } from "@/components/BundleStack";
import SizingHelper from "@/components/SizingHelper";
import { pages, bundles } from "@/data";
import { t } from "@/lib/i18n";
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
          {/* Card Stack / Fan (Phase 4, plan §4): the 3 confirmed bundles
              as a fanned deck — hover/focus fans them out, the toggle
              spreads them into a grid. Bundle-4 is archived, never shown. */}
          <BundleStack locale={l}>
            {confirmed.map((b) => (
              <BundleCard key={b.id} locale={l} bundle={b} />
            ))}
          </BundleStack>

          <p data-reveal="fade" className="mt-8 text-body-sm text-text-muted">{t(s.k11, l)}</p>
        </div>
      </section>
      {/* Sizing helper — "احسب احتياجك" (Phase 4). Anchor target for the
          links from solutions + system detail pages. */}
      <section id="sizing-helper" data-reveal="up" className="section scroll-mt-24 bg-white">
        <div className="wrap max-w-3xl">
          <SizingHelper locale={l} />
        </div>
      </section>
      <CTABand locale={l} variant="split" title={s.k12} text={s.k13} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
