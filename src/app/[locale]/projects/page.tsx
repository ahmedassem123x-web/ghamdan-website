import type { Metadata } from "next";
import { MessageCircle, Settings, Wrench } from "lucide-react";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import ProjectsClient from "@/components/ProjectsClient";
import ProjectDetailTemplate from "@/components/ProjectDetailTemplate";
import { EmptyState } from "@/components/ui";
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
 * Projects (§3.5): side-left hero → intro → honest empty state + filter pills
 * + carousel shell (4 illustrative photos) → template preview → features CTA.
 * No approved projects yet (CI-07) — nothing is fabricated.
 */
export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const p = pages.projects;

  return (
    <>
      <Hero
        locale={l}
        variant="side-left"
        image="/images/heroes/hero-villa-mountains.jpg"
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

      {/* 5.2 Intro */}
      <section className="section-sm">
        <div className="wrap text-center">
          <p className="text-sm font-bold text-accent">{ui("projects.areasLabel", l)}</p>
          <h2 className="mt-3 text-h2 font-extrabold text-primary">{ui("projects.areasTitle", l)}</h2>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="wrap">
          {approvedProjects.length === 0 && (
            <EmptyState title={t(p.k4, l)} copy={t(p.k5, l)}>
              <WhatsAppButton locale={l} message={WA_MESSAGES.general[l]} label={ui("cta.whatsappStart", l)} source="projects" variant="green-pill" />
            </EmptyState>
          )}
          <h2 className="mt-14 text-h2 font-extrabold text-primary">{t(p.k7, l)}</h2>
          <p className="mt-2 text-body text-text-muted">{t(p.k8, l)}</p>
          <div className="mt-8">
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
          <h2 className="mt-14 text-h2 font-extrabold text-primary">{t(p.k6, l)}</h2>
          <div className="mt-8">
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
          { icon: <Settings className="size-4" aria-hidden="true" />, title: { ar: "خبرة متكاملة", en: "Integrated expertise", zh: "综合经验" } },
          { icon: <Wrench className="size-4" aria-hidden="true" />, title: { ar: "حلول مخصصة", en: "Tailored solutions", zh: "定制解决方案" } },
          { icon: <MessageCircle className="size-4" aria-hidden="true" />, title: { ar: "استشارة مجانية", en: "Free consultation", zh: "免费咨询" } },
        ]}
      />
    </>
  );
}
