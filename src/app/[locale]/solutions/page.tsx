import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import { categoryIcon } from "@/components/Cards";
import { EditorialBlock } from "@/components/ui";
import { pages, solutionAreas, workProcess } from "@/data";
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

  return (
    <>
      <Hero
        locale={l}
        variant="side-right"
        image="/images/heroes/hero-villa-mountains.jpg"
        imageAlt={t(s.k1, l)}
        title={s.k1}
        text={s.k2}
        whatsapp={false}
        primaryHref="/products"
        primaryLabelKey="cta.discoverSolutions"
      />

      {/* 3.2 Intro with blue underline accent */}
      <section className="section">
        <div className="wrap text-center">
          <h2 className="text-h2 font-semibold text-navy">{t(s.k26, l)}</h2>
          <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-primary-hover" aria-hidden="true" />
          <p className="mx-auto mt-5 max-w-2xl text-body text-text-muted">{t(s.k2, l)}</p>
        </div>
      </section>

      {/* 3.3 Editorial rows ×5 */}
      <section className="section-sm bg-surface">
        <div className="wrap space-y-16">
          {solutionAreas.map((area, i) => (
            <EditorialBlock
              key={area.id}
              image={rowImages[area.id] ?? "/images/photos/solar-farm.jpg"}
              imageAlt={t(area.title, l)}
              title={t(area.title, l)}
              text={t(area.text, l)}
              flip={i % 2 === 0}
              eyebrow={
                <span className="inline-flex items-center gap-2 rounded-full bg-sky px-3 py-1 text-xs font-bold text-primary-hover">
                  {categoryIcon(area.icon)}
                  {t(area.pill, l)}
                </span>
              }
            >
              <Link
                href={localizedHref(l, `/solutions/${area.id}`)}
                className="mt-6 inline-flex items-center gap-1.5 rounded-[0.625rem] bg-navy px-5 py-2.5 font-bold text-button text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy"
              >
                {ui("cta.discoverMore", l)}
                <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
              </Link>
            </EditorialBlock>
          ))}
        </div>
      </section>

      {/* 3.4 How we work — 4 steps, numbered RTL with arrows */}
      <section className="section">
        <div className="wrap">
          {/* Heading inlined (visible by default) — SectionHeadingL's shared
              wrapper no longer hides content (Phase 6 removed .reveal). */}
          <div className="text-center">
            <h2 className="text-h2 font-semibold text-navy">{t(s.k27, l)}</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workProcess.map((step, i) => (
              <div key={step.title.ar} className="relative rounded-card bg-surface p-6 shadow-card">
                {i < workProcess.length - 1 && (
                  <span className="absolute top-8 -end-3 z-10 hidden size-6 items-center justify-center rounded-full bg-primary-hover text-white lg:flex" aria-hidden="true">
                    ←
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <span className="font-latin text-4xl font-extrabold text-primary" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex size-11 items-center justify-center rounded-full bg-sky text-primary-hover">{categoryIcon(step.icon)}</div>
                </div>
                <h3 className="mt-4 text-h4 font-semibold text-navy">{t(step.title, l)}</h3>
                <p className="mt-2 text-body-sm text-text-muted">{t(step.text, l)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand locale={l} variant="photo-bg" image="/images/photos/pivot.jpg" imageAlt={t(s.k28, l)} title={s.k28} text={s.k29} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
