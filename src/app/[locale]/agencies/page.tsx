import type { Metadata } from "next";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import AgencyCoverflow, { type CoverflowAgency } from "@/components/AgencyCoverflow";
import AgencyFlipCard from "@/components/AgencyFlipCard";
import { withGradientWord } from "@/components/headingHighlight";
import { pages, agencies, products } from "@/data";
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
  /** Gradient highlight words (Phase 6): one word per main heading. */
  const HL = {
    agencies: { ar: "والعلامات", en: "Brands", zh: "品牌" },
  };
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
  /** Published-product count per agency, computed from the data (same
   * filter as the detail page — status === "published"). */
  const publishedCount = (agencyId: string) => {
    const agency = agencies.find((x) => x.id === agencyId);
    if (!agency) return 0;
    return products.filter((p) => agency.productIds.includes(p.id) && p.status === "published").length;
  };
  const labels = {
    carousel: { ar: "وكالاتنا", en: "Our agencies", zh: "我们的代理品牌" } as Record<string, string>,
    prev: { ar: "السابق", en: "Previous", zh: "上一个" } as Record<string, string>,
    next: { ar: "التالي", en: "Next", zh: "下一个" } as Record<string, string>,
    goTo: { ar: "عرض", en: "Show", zh: "查看" } as Record<string, string>,
    flip: { ar: "اقلب البطاقة لعرض التفاصيل", en: "Flip the card to see details", zh: "翻转卡片查看详情" } as Record<string, string>,
    flipBack: { ar: "أعد البطاقة", en: "Flip the card back", zh: "翻回卡片" } as Record<string, string>,
  };
  const pick = (rec: Record<string, string>) => rec[l] ?? rec.ar;
  const coverflowItems: CoverflowAgency[] = agencies.map((ag) => ({
    id: ag.id,
    name: ag.name,
    wordmarkClass: wordmarkStyle[ag.id] ?? "font-extrabold tracking-tight",
    status: t(ag.status, l),
    text: t(ag.text, l),
    href: localizedHref(l, `/agencies/${ag.id}`),
    officialAgent: ag.officialAgent,
    pending: ag.confirmationStatus === "pending",
    pendingLabel: ui("agency.pendingConfirmation", l),
    productCount: publishedCount(ag.id),
    productLabel: ui("catalog.product", l),
    comingSoonLabel: ui("catalog.comingSoon", l),
  }));

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

      {/* Coverflow carousel (plan §5) — the 6 agencies in perspective,
          centre card full, sides angled/faded. No autoplay. */}
      <section data-reveal="up" className="section bg-mesh-light">
        <div className="wrap">
          <div data-reveal="fade" className="mb-8 text-center">
            <h2 className="text-h2 font-semibold text-navy">{withGradientWord(t(a.k1, l), t(HL.agencies, l))}</h2>
          </div>
          <AgencyCoverflow
            agencies={coverflowItems}
            locale={l}
            labels={{
              carouselLabel: pick(labels.carousel),
              prevLabel: pick(labels.prev),
              nextLabel: pick(labels.next),
              goToLabel: pick(labels.goTo),
              detailsLabel: ui("cta.details", l),
            }}
          />
        </div>
      </section>

      {/* Flip-card grid (plan §4) — every agency as a two-sided card:
          front (wordmark + status + count), back (description + link).
          Flip on hover (desktop) and on tap/keyboard via the card button. */}
      <section data-reveal="up" className="section bg-white">
        <div className="wrap">
          <div data-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coverflowItems.map((ag) => (
              <AgencyFlipCard
                key={ag.id}
                name={ag.name}
                wordmarkClass={ag.wordmarkClass}
                status={ag.status}
                text={ag.text}
                href={ag.href}
                officialAgent={ag.officialAgent}
                pending={ag.pending}
                pendingLabel={ag.pendingLabel}
                productCount={ag.productCount}
                productLabel={ag.productLabel}
                comingSoonLabel={ag.comingSoonLabel}
                detailsLabel={ui("cta.details", l)}
                flipLabel={pick(labels.flip)}
                flipBackLabel={pick(labels.flipBack)}
              />
            ))}
          </div>
          <p data-reveal="fade" className="mt-8 max-w-3xl text-body-sm text-text-muted">{t(a.k9, l)}</p>
        </div>
      </section>
      <CTABand locale={l} variant="split" title={a.k10} text={a.k11} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
