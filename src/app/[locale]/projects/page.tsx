import type { Metadata } from "next";
import { InfoIcon, WhatsAppIcon, SettingsIcon, WrenchIcon } from "@/components/icons";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import ProjectsClient from "@/components/ProjectsClient";
import ProjectDetailTemplate from "@/components/ProjectDetailTemplate";
import WhatsAppButton from "@/components/WhatsAppButton";
import { pages, approvedProjects } from "@/data";
import { t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.projects.k1, locale as Locale) };
}

/**
 * Projects (§3.5, ref 05 / ADR-02): FULL-WIDTH hero (text top physical-left,
 * ground-level solar farm + mountains in the ref) → intro → honest empty
 * state + filter pills + carousel shell (4 illustrative photos) → template
 * preview → features CTA. No approved projects yet (CI-07) — nothing is
 * fabricated. KNOWN GAP: the implemented hero-solar-farm.jpg is AERIAL
 * while ref 05 is GROUND-LEVEL — no ground-level hero asset exists; recorded
 * in docs/visual-gap-analysis.md, needs a new asset, not a code fix.
 */
export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const p = pages.projects;

  return (
    <>
      <Hero
        locale={l}
        variant="full-left"
        image="/images/heroes/hero-solar-farm.jpg"
        imageAlt={ui("projects.heroTitle", l)}
        title={{
          ar: ui("projects.heroTitle", "ar"),
          en: ui("projects.heroTitle", "en"),
          zh: ui("projects.heroTitle", "zh"),
        }}
        text={p.k2}
        whatsapp={false}
        primaryHref="#projects"
        primaryLabelKey="cta.viewProjects"
      />

      {/* 5.2 Intro — sky mesh (quiet) with a section marker */}
      <section data-reveal="fade" className="section-sm bg-mesh-sky">
        <div className="wrap text-center">
          <div data-reveal="fade" className="mb-4 flex justify-center">
            <span className="section-marker" aria-hidden="true" />
          </div>
          <h2 data-reveal="up" className="text-h2 font-semibold text-navy">{ui("projects.areasTitle", l)}</h2>
        </div>
      </section>

      <section data-reveal="left" className="section bg-mesh-light" id="projects">
        <div className="wrap">
          {approvedProjects.length === 0 && (
            // Honest empty state — inlined (visible by default) instead of
            // the shared EmptyState (Phase 6 removed the .reveal hiding from
            // the shared primitives; this page keeps its inline state).
            <div data-reveal="scale" className="rounded-card border border-dashed border-border-strong bg-white p-10 text-center shadow-card">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-sky text-primary-hover">
                <InfoIcon className="size-8" aria-hidden="true" />
              </div>
              <h3 data-reveal="up" className="mt-5 text-h3 font-semibold text-navy">{t(p.k4, l)}</h3>
              <p data-reveal="fade" className="mx-auto mt-3 max-w-xl text-body text-text-muted">{t(p.k5, l)}</p>
              <div data-reveal="fade" className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <WhatsAppButton locale={l} message={WA_MESSAGES.general[l]} label={ui("cta.whatsappStart", l)} source="projects" variant="green-pill" />
              </div>
            </div>
          )}
          <h2 data-reveal="fade" className="mt-14 text-h2 font-semibold text-navy">{t(p.k7, l)}</h2>
          <p data-reveal="fade" className="mt-2 text-body text-text-muted">{t(p.k8, l)}</p>
          <div data-reveal="right" className="mt-8">
            <ProjectsClient
              locale={l}
              items={[
                { src: "/images/photos/solar-farm.jpg", alt: t(p.k1, l), category: "solar" },
                { src: "/images/photos/pump-flow.jpg", alt: t(p.k1, l), category: "water" },
                { src: "/images/photos/pivot.jpg", alt: t(p.k1, l), category: "agriculture" },
                { src: "/images/photos/panels-rows.jpg", alt: t(p.k1, l), category: "solar" },
              ]}
            />
          </div>

          {/* Template preview (k6) — clearly labelled, not a real project */}
          <div data-reveal="fade" className="mt-14">
            <div className="mb-4">
              <span className="section-marker" aria-hidden="true" />
            </div>
            <h2 className="text-h2 font-semibold text-navy">{t(p.k6, l)}</h2>
          </div>
          <div data-reveal="up" className="mt-8">
            <ProjectDetailTemplate locale={l} />
          </div>
        </div>
      </section>

      <CTABand
        locale={l}
        variant="whatsapp"
        title={{
          ar: ui("projects.ctaTitle", "ar"),
          en: ui("projects.ctaTitle", "en"),
          zh: ui("projects.ctaTitle", "zh"),
        }}
        text={p.k10}
        features={[
          { icon: <SettingsIcon className="size-4" aria-hidden="true" />, title: { ar: "خبرة متكاملة", en: "Integrated expertise", zh: "综合经验" } },
          { icon: <WrenchIcon className="size-4" aria-hidden="true" />, title: { ar: "حلول مخصصة", en: "Tailored solutions", zh: "定制解决方案" } },
          { icon: <WhatsAppIcon className="size-4" aria-hidden="true" />, title: { ar: "استشارة مجانية", en: "Free consultation", zh: "免费咨询" } },
        ]}
      />
    </>
  );
}
