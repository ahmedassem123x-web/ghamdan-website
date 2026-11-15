import type { Metadata } from "next";
import { webp } from "@/lib/images";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowIcon, categoryIcon } from "@/components/icons";
import { SolarSystemIllustration, PumpIllustration, GridIllustration } from "@/components/illustrations";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import WhatsAppButton from "@/components/WhatsAppButton";
import EnergySystemScene from "@/components/three/EnergySystemScene";
import { Breadcrumbs, EditorialBlock } from "@/components/ui";
import { pages, solutionAreas, pumping, workProcess, products } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { detailMetadata } from "@/lib/metadata";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import type { Locale } from "@/data";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ["ar", "en", "zh"]) {
    for (const a of solutionAreas) params.push({ locale, slug: a.id });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const a = solutionAreas.find((x) => x.id === slug);
  if (!a) return {};
  const title = t(a.title, l);
  const description = a.text ? t(a.text, l) : title;
  return detailMetadata({ locale: l, path: `/solutions/${a.id}`, title, description });
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const area = solutionAreas.find((x) => x.id === slug);
  if (!area) notFound();
  const copy = pages.solutionDetail[slug];

  // --- Pumping: full detail (ref 09) ---
  if (slug === "pumping") {
    const pumpCopy = pages.solutionDetail.pumping;
    const pumpProducts = products.filter((p) => p.categoryId === "pumps" && p.status === "published").slice(0, 3);
    return (
      <>
        <Hero
          locale={l}
          variant="side-right"
          image="/images/heroes/hero-pump-mountains.jpg"
          imageAlt={t(pumping.heroTitle, l)}
          title={pumping.heroTitle}
          text={pumping.heroCopy}
          primaryHref="/contact"
          primaryLabelKey="cta.discussProject"
          crumbs={[
            { label: ui("nav.home", l), href: localizedHref(l, "/") },
            { label: ui("nav.solutions", l), href: localizedHref(l, "/solutions") },
            { label: t(pumping.heroTitle, l) },
          ]}
        />

        {/* Overview — EditorialBlock, image left (§3.9) */}
        <section data-reveal="up" className="section bg-white">
          <div className="wrap">
            <div data-reveal="fade">
            <EditorialBlock
              image="/images/photos/pump-flow.jpg"
              imageAlt={t(pumping.overviewHead, l)}
              title={t(pumping.overviewHead, l)}
              text={t(pumping.overviewCopy, l)}
              flip
              eyebrow={
                <span className="section-marker" aria-hidden="true" />
              }
            >
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                {pumping.overviewFeatures.map((f) => (
                  <span key={f.title.ar} className="inline-flex items-center gap-2 text-sm font-bold text-navy">
                    <span className="flex size-8 items-center justify-center rounded-full bg-sky text-primary-hover">{categoryIcon(f.icon)}</span>
                    {t(f.title, l)}
                  </span>
                ))}
              </div>
              <div aria-hidden="true" className="mt-8">
                <PumpIllustration className="w-full max-w-md" />
              </div>
            </EditorialBlock>
            </div>
          </div>
        </section>

        {/* Challenges — sky mesh band with white icon cards */}
        <section data-reveal="left" className="section bg-mesh-sky">
          <div className="wrap">
            <div data-reveal="fade" className="text-center">
              <div className="mb-4 flex justify-center">
                <span className="section-marker" aria-hidden="true" />
              </div>
              <h2 className="text-h2 font-semibold text-navy">{t(pumping.challengesTitle, l)}</h2>
            </div>
            <div data-stagger className="mt-10 grid gap-6 sm:grid-cols-2">
              {pumping.challenges.map((ch) => (
                <div key={ch.title.ar} className="card-luxe flex gap-4 p-6">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-primary-hover shadow-card">{categoryIcon(ch.icon)}</div>
                  <div>
                    <h3 className="text-h4 font-semibold text-navy">{t(ch.title, l)}</h3>
                    <p className="mt-1.5 text-body-sm text-text-muted">{t(ch.text, l)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps — product images + left-pointing arrows.
            Step progress (decorative; steps are numbered in text): the
            horizontal line draws 0->100% in 800ms on desktop, the
            vertical line does the same from the reading-start side on
            mobile; step numbers fill with 120ms stagger; cards fade-up
            250ms. NOTE: the plan named systems/[slug] for this pattern,
            but that page has no step list — the only real steps list in
            the repo is the pumping steps here. */}
        <section data-reveal="right" className="section bg-white">
          <div className="wrap">
            <div data-reveal="fade">
              <div className="mb-4">
                <span className="section-marker" aria-hidden="true" />
              </div>
              <h2 className="text-h2 font-semibold text-navy">{t(pumping.stepsTitle, l)}</h2>
            </div>
            <div data-step-line data-step-axis="x" className="step-line--h mt-8 hidden md:block" aria-hidden="true" />
            <div className="relative mt-10">
              <div data-step-line data-step-axis="y" className="step-line--v absolute inset-y-0 start-0 h-full md:hidden" aria-hidden="true" />
              <div data-stagger data-stagger-duration="250" data-stagger-step="60" data-step-group className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {pumping.steps.map((step, i) => (
                  <div key={step.n} className="relative overflow-hidden rounded-card bg-surface shadow-card">
                    {i < pumping.steps.length - 1 && (
                      <span className="absolute top-8 -end-3 z-10 hidden size-6 items-center justify-center rounded-full bg-primary-hover text-white lg:flex" aria-hidden="true">
                        ←
                      </span>
                    )}
                    <img
                      src={webp(["/images/photos/panels-rows.jpg", "/images/photos/controller-unit.jpg", "/images/photos/pump-flow.jpg", "/images/photos/pivot.jpg"][i])}
                      alt={t(step.title, l)}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <div className="p-6">
                      <span data-step-dot className="inline-block font-latin text-4xl font-extrabold text-primary" dir="ltr">{step.n}</span>
                      <h3 className="mt-3 text-h4 font-semibold text-navy">{t(step.title, l)}</h3>
                      <p className="mt-2 text-body-sm text-text-muted">{t(step.text, l)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Diagram (code-built SVG, not a reference screenshot) — sky mesh */}
        <section data-reveal="scale" className="section bg-mesh-sky">
          <div className="wrap">
            <div data-reveal="fade">
              <div className="mb-4">
                <span className="section-marker" aria-hidden="true" />
              </div>
              <h2 className="text-h2 font-semibold text-navy">{t(pumping.diagramTitle, l)}</h2>
              <p className="mt-3 max-w-2xl text-body text-text-muted">{t(pumping.diagramPill, l)}</p>
            </div>
            <div data-reveal="fade" className="mt-8">
              <EnergySystemScene
                locale={l}
                nodes={[
                  { label: pumpCopy ? t(pumpCopy.k14, l) : "", icon: "☀" },
                  { label: pumpCopy ? t(pumpCopy.k16, l) : "", icon: "⚙" },
                  { label: pumpCopy ? t(pumpCopy.k18, l) : "", icon: "↧" },
                  { label: l === "ar" ? "خزان المياه" : l === "en" ? "Water Tank" : "水箱", icon: "▮" },
                  { label: pumpCopy ? t(pumpCopy.k20, l) : "", icon: "⌂" },
                ]}
                caption={pumpCopy ? t(pumpCopy.k32, l) : undefined}
              />
            </div>
          </div>
        </section>

        {/* Applications — dark overlay captions */}
        <section data-reveal="up" className="section bg-white">
          <div className="wrap">
            <div data-reveal="fade">
              <div className="mb-4">
                <span className="section-marker" aria-hidden="true" />
              </div>
              <h2 className="text-h2 font-semibold text-navy">{t(pumping.applicationsTitle, l)}</h2>
            </div>
            <div data-stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pumping.applications.map((app) => (
                <article key={app.title.ar} className="group relative overflow-hidden rounded-card shadow-card">
                  <img src={webp(app.image)} alt={t(app.title, l)} loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
                  <h3 className="absolute bottom-0 start-0 p-5 text-h4 font-semibold text-white">{t(app.title, l)}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Related — two panels: complementary products + inspiring stories (no fabricated story) */}
        <section data-reveal="left" className="section bg-sand">
          <div data-stagger className="wrap grid gap-10 lg:grid-cols-2">
            <div>
              <h2 data-reveal="left" className="text-h2 font-semibold text-navy">{ui("pumping.complementary", l)}</h2>
              <div data-stagger className="mt-6 space-y-4">
                {pumpProducts.map((p) => (
                  <Link key={p.id} href={localizedHref(l, `/products/${p.slug}`)} className="group flex items-center gap-4 rounded-card border border-border bg-background p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
                    {p.image ? (
                      <img src={webp(p.image)} alt={t(p.name, l)} loading="lazy" className="size-20 shrink-0 rounded-[0.625rem] object-cover" />
                    ) : (
                      <span className="flex size-20 shrink-0 items-center justify-center rounded-[0.625rem] bg-sky font-latin text-xl font-extrabold text-primary" dir="ltr">
                        {p.brand.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-bold text-navy group-hover:text-primary-hover">{t(p.name, l)}</p>
                      <p className="text-body-sm text-text-muted">{p.brand}</p>
                    </div>
                    <ArrowIcon className="ms-auto size-5 shrink-0 text-primary-hover transition-transform duration-200 group-hover:-translate-x-1 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-card bg-navy text-white shadow-card">
              <img data-parallax src={webp("/images/photos/solar-farm.jpg")} alt={ui("pumping.stories", l)} loading="lazy" className="aspect-[16/9] w-full object-cover" />
              <div className="p-8">
                <h2 data-reveal="fade" className="text-h2 font-semibold">{ui("pumping.stories", l)}</h2>
                <p data-reveal="fade" className="mt-3 text-body text-text-inverse-muted">{t(pages.projects.k2, l)}</p>
                <Link
                  data-reveal
                  href={localizedHref(l, "/projects")}
                  className="mt-6 inline-flex items-center gap-1.5 rounded-[0.625rem] bg-white px-5 py-2.5 font-bold text-button text-navy transition-all duration-200 hover:-translate-y-0.5"
                >
                  {ui("cta.viewProjects", l)}
                  <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <CTABand
          locale={l}
          variant="whatsapp"
          image="/images/photos/pump-flow.jpg"
          imageAlt={t(pumping.ctaTitle, l)}
          title={pumping.ctaTitle}
          text={pumpCopy ? pumpCopy.k36 : undefined}
        />
      </>
    );
  }

  // --- Other areas: approved summary + process + CTA (full detail pending) ---
  return (
    <>
      <div data-reveal="up" className="bg-mesh-light">
        <Breadcrumbs
          locale={l}
          items={[
            { label: ui("nav.home", l), href: localizedHref(l, "/") },
            { label: ui("nav.solutions", l), href: localizedHref(l, "/solutions") },
            { label: t(area.title, l) },
          ]}
        />
        <div className="wrap py-12 md:py-16">
          <div data-reveal="fade">
            <div className="mb-4">
              <span className="section-marker" aria-hidden="true" />
            </div>
            <h1 className="mt-4 max-w-3xl text-h1 font-bold leading-[1.2] text-navy">{t(area.title, l)}</h1>
            <p data-reveal="fade" className="mt-4 max-w-2xl text-body-lg text-text-muted">{t(area.text, l)}</p>
            <p data-reveal="fade" className="mt-4 flex items-center gap-2 text-sm font-bold text-primary-hover">
              <span className="text-primary-hover">{categoryIcon(area.icon)}</span>
              {t(area.pill, l)}
            </p>
            <div data-reveal="fade" className="mt-8 flex flex-wrap gap-3">
              <WhatsAppButton locale={l} message={WA_MESSAGES.general[l]} label={ui("cta.whatsappStart", l)} source="solution-detail" variant="green-pill" />
              <Link href={localizedHref(l, "/contact")} className="btn btn-navy">
                {ui("cta.requestConsultation", l)}
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Solution illustration — geometric, per solution */}
      <section aria-hidden="true" className="bg-mesh-sky py-10">
        <div className="wrap">
          {slug === "commercial" ? (
            <GridIllustration className="mx-auto w-full max-w-2xl" />
          ) : slug === "irrigation" ? (
            <PumpIllustration className="mx-auto w-full max-w-2xl" />
          ) : (
            <SolarSystemIllustration className="mx-auto w-full max-w-2xl" />
          )}
        </div>
      </section>
      <section data-reveal="scale" className="section bg-mesh-navy">
        <div className="wrap">
          <div data-reveal="fade">
            <div className="mb-4">
              <span className="section-marker" aria-hidden="true" />
            </div>
            <h2 className="text-h2 font-semibold text-white">{t(pages.solutions.k27, l)}</h2>
          </div>
          <div data-stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workProcess.map((step, i) => (
              <div key={step.title.ar} className="relative rounded-card border border-white/15 bg-[#16324F] p-6">
                <span className="font-latin text-4xl font-extrabold text-white" dir="ltr">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-h4 font-semibold text-white">{t(step.title, l)}</h3>
                <p className="mt-2 text-body-sm text-sky-100">{t(step.text, l)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTABand locale={l} variant="split" title={copy ? copy.k1 : pages.solutions.k28} text={copy ? copy.k2 : pages.solutions.k29} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
