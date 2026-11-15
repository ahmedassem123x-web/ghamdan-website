import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, categoryIcon } from "@/components/icons";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import { EditorialBlock } from "@/components/ui";
import { pages, solutionAreas, workProcess, categories } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.solutions.k1, locale as Locale) };
}

/** Solutions index (§3.3): side-right hero → intro → 5 alternating editorial rows → process → CTA photo-bg. */
export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const s = pages.solutions;
  const rowImages: Record<string, string> = {
    residential: "/images/photos/villa-roof.jpg",
    commercial: "/images/photos/solar-farm.jpg",
    pumping: "/images/photos/pump-flow.jpg",
    irrigation: "/images/photos/pivot.jpg",
    agriculture: "/images/photos/crops.jpg",
  };
  /** Components per solution (item 30): the 3 component categories each
   * solution is built from, grounded in the solution's own copy
   * (residential names inverter + battery + panels; pumping names
   * panels + pump inverter + pump; agriculture names pumping, irrigation
   * and storage). Chips link to the real category pages. */
  const areaComponents: Record<string, string[]> = {
    residential: ["inverters", "batteries", "panels"],
    commercial: ["inverters", "batteries", "panels"],
    pumping: ["panels", "controllers", "pumps"],
    irrigation: ["panels", "controllers", "pumps"],
    agriculture: ["panels", "pumps", "batteries"],
  };

  return (
    <>
      <Hero
        locale={l}
        variant="side-right"
        image="/images/heroes/hero-villa-mountains.jpg"
        imageAlt={t(s.k1, l)}
        title={s.k1}
        text={s.k2}
        primaryHref="/products"
        primaryLabelKey="cta.discoverSolutions"
      />

      {/* 3.2 Intro — sky mesh (quiet) with a section marker */}
      <section data-reveal="fade" className="section bg-mesh-sky">
        <div className="wrap text-center">
          <div className="mb-4 flex justify-center">
            <span className="section-marker" aria-hidden="true" />
          </div>
          <h2 data-reveal="up" className="text-h2 font-semibold text-navy">{t(s.k26, l)}</h2>
          <p data-reveal="fade" className="mx-auto mt-5 max-w-2xl text-body text-text-muted">
            {l === "ar"
              ? "من المنزل إلى المزرعة إلى المصنع — نظام واحد متكامل."
              : l === "en"
                ? "From home to farm to factory — one integrated system."
                : "从家庭到农场再到工厂 — 一个一体化系统。"}
          </p>
        </div>
      </section>

      {/* 3.2b Pinned scrub carousel — the five solutions, horizontal.
          Desktop: ONE GSAP pin + scrub (MotionProvider, data-pinned-scrub);
          mobile: native horizontal snap scroll, no pin. Progress bar +
          counter follow scroll position; prev/next buttons + Arrow keys
          move one slide via Lenis scrollTo. Content is fully present in
          the HTML (native scroll fallback without JS). */}
      <section
        data-pinned-scrub
        tabIndex={0}
        role="region"
        aria-label={t(s.k1, l)}
        className="section overflow-hidden bg-white"
      >
        <div className="wrap">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-4">
                <span className="section-marker" aria-hidden="true" />
              </div>
              <h2 className="text-h2 font-semibold text-navy">{t(s.k1, l)}</h2>
              <p className="mt-3 max-w-2xl text-body text-text-muted">{t(s.k2, l)}</p>
            </div>
            <div className="hidden shrink-0 gap-2 md:flex">
              <button
                type="button"
                data-scrub-prev
                aria-label={l === "ar" ? "السابق" : l === "en" ? "Previous" : "上一张"}
                className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-navy shadow-card transition-colors hover:border-primary-hover hover:text-primary-hover"
              >
                <ArrowIcon className="size-5 rtl:rotate-180 ltr:rotate-0" aria-hidden="true" />
              </button>
              <button
                type="button"
                data-scrub-next
                aria-label={l === "ar" ? "التالي" : l === "en" ? "Next" : "下一张"}
                className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-navy shadow-card transition-colors hover:border-primary-hover hover:text-primary-hover"
              >
                <ArrowIcon className="size-5 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <div className="pinned-scrub__viewport mt-8">
          <div data-pinned-track className="pinned-scrub__track px-4 md:px-8">
            {solutionAreas.map((area) => (
              <article key={area.id} data-pinned-slide className="pinned-scrub__slide card-luxe group relative flex flex-col overflow-hidden bg-surface">
                <Link href={localizedHref(l, `/solutions/${area.id}`)} className="block overflow-hidden" aria-label={t(area.title, l)}>
                  <img
                    src={rowImages[area.id] ?? "/images/photos/solar-farm.jpg"}
                    alt={t(area.title, l)}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-center gap-2 text-sm font-bold text-primary-hover">
                    <span className="text-primary-hover">{categoryIcon(area.icon)}</span>
                    {t(area.pill, l)}
                  </p>
                  <h3 className="mt-3 text-h3 font-semibold text-navy">
                    <Link href={localizedHref(l, `/solutions/${area.id}`)} className="transition-colors hover:text-primary-hover">
                      {t(area.title, l)}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-body-sm text-text-muted">{t(area.text, l)}</p>
                  <Link href={localizedHref(l, `/solutions/${area.id}`)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover">
                    {ui("cta.discoverMore", l)}
                    <ArrowIcon className="size-4 transition-transform duration-200 group-hover:-translate-x-1 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="wrap mt-6 flex items-center gap-4">
          <div className="pinned-scrub__bar flex-1" aria-hidden="true">
            <div data-scrub-progress className="pinned-scrub__fill" />
          </div>
          <span data-scrub-counter className="font-latin text-sm font-bold text-navy" dir="ltr">
            1 / {solutionAreas.length}
          </span>
        </div>
      </section>

      {/* 3.3 Editorial rows ×5 — alternating white / sky mesh. The area pill
          label is kept as a small caption under the copy (never an eyebrow
          pill above the heading). */}
      {solutionAreas.map((area, i) => (
        <section key={area.id} data-reveal={i % 2 === 0 ? "left" : "right"} className={`section-sm ${i % 2 === 0 ? "bg-white" : "bg-mesh-sky"}`}>
          <div className="wrap">
            <div data-reveal="fade">
            <EditorialBlock
              image={rowImages[area.id] ?? "/images/photos/solar-farm.jpg"}
              imageAlt={t(area.title, l)}
              title={t(area.title, l)}
              text={t(area.text, l)}
              flip={i % 2 === 0}
              eyebrow={
                <span className="section-marker" aria-hidden="true" />
              }
            >
              <p className="mt-5 flex items-center gap-2 text-sm font-bold text-primary-hover">
                <span className="text-primary-hover">{categoryIcon(area.icon)}</span>
                {t(area.pill, l)}
              </p>
              {/* Components chips (item 30): the 3 component categories,
                  from the solution's own copy — no invented parts. */}
              <div className="mt-4 flex flex-wrap gap-2">
                {areaComponents[area.id]?.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  if (!cat) return null;
                  return (
                    <Link
                      key={catId}
                      href={localizedHref(l, `/products/category/${catId}`)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold text-navy transition-colors hover:border-primary-hover hover:text-primary-hover"
                    >
                      {categoryIcon(cat.icon)}
                      {t(cat.name, l)}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href={localizedHref(l, `/solutions/${area.id}`)}
                  className="btn btn-navy"
                >
                  {ui("cta.discoverMore", l)}
                  <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                </Link>
                {(() => {
                  const relCat = areaComponents[area.id]?.find(
                    (catId) => (categories.find((c) => c.id === catId)?.publishedCount ?? 0) > 0,
                  );
                  return relCat ? (
                    <Link
                      href={localizedHref(l, `/products?cat=${relCat}`)}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover"
                    >
                      {ui("product.related", l)}
                      <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                    </Link>
                  ) : null;
                })()}
              </div>
            </EditorialBlock>
            </div>
          </div>
        </section>
      ))}

      {/* 3.4 How we work — LOUD navy mesh band, glass step cards */}
      <section data-reveal="scale" className="section bg-mesh-navy">
        <div className="wrap">
          {/* Heading inlined (visible by default) — SectionHeadingL's shared
              wrapper no longer hides content (Phase 6 removed .reveal). */}
          <div data-reveal="fade" className="text-center">
            <div className="mb-4 flex justify-center">
              <span className="section-marker" aria-hidden="true" />
            </div>
            <h2 className="text-h2 font-semibold text-white">{t(s.k27, l)}</h2>
          </div>
          <div data-stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workProcess.map((step, i) => (
              <div key={step.title.ar} className="relative rounded-card border border-white/15 bg-[#16324F] p-6">
                {i < workProcess.length - 1 && (
                  <span className="absolute top-8 -end-3 z-10 hidden size-6 items-center justify-center rounded-full bg-primary-hover text-white lg:flex" aria-hidden="true">
                    ←
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <span className="font-latin text-4xl font-extrabold text-white" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white">{categoryIcon(step.icon)}</div>
                </div>
                <h3 className="mt-4 text-h4 font-semibold text-white">{t(step.title, l)}</h3>
                <p className="mt-2 text-body-sm text-sky-100">{t(step.text, l)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand locale={l} variant="photo-bg" image="/images/photos/pivot.jpg" imageAlt={t(s.k28, l)} title={s.k28} text={s.k29} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
