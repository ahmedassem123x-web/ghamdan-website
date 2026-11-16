import type { Metadata } from "next";
import { webp } from "@/lib/images";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowIcon, categoryIcon } from "@/components/icons";
import { SolarSystemIllustration, PumpIllustration, GridIllustration } from "@/components/illustrations";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import { SizingStrip } from "@/components/SizingHelper";
import { withGradientWord } from "@/components/headingHighlight";
import WhatsAppButton from "@/components/WhatsAppButton";
import EnergySystemScene from "@/components/three/EnergySystemScene";
import { Breadcrumbs, EditorialBlock } from "@/components/ui";
import { pages, solutionAreas, pumping, workProcess, products } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { detailMetadata } from "@/lib/metadata";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import type { Locale, LocalizedString } from "@/data";

/** Gradient highlight words (Phase 6) — one meaningful word per main
 * section heading, current locale. ZH titles have no spaces, so they
 * render plain (whole-word match only, Arabic-safe). */
const HL: Record<string, LocalizedString> = {
  challenges: { ar: "التحديات", en: "Challenges", zh: "挑战" },
  steps: { ar: "متكامل", en: "Solution", zh: "方案" },
  diagram: { ar: "متكامل", en: "System", zh: "系统" },
  applications: { ar: "التطبيق", en: "Application", zh: "应用" },
  process: { ar: "كيف", en: "Work", zh: "工作" },
};

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
              <h2 className="text-h2 font-semibold text-navy">{withGradientWord(t(pumping.challengesTitle, l), t(HL.challenges, l))}</h2>
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

        {/* Steps — sticky scroll story (Phase 4, plan §3 Sticky Sections):
            the title column stays pinned (CSS position: sticky, lg+ only)
            while the four step cards scroll past it; mobile is a normal
            stacked scroll. No GSAP pin here: MotionProvider's pin is the
            carousel-specific [data-pinned-scrub] pattern (one pin per page)
            and motion.tsx is owned by another worker — CSS sticky gives
            the same story with zero pin-spacer risk, and reduced-motion /
            no-JS users get the identical stacked content. The vertical
            step line ([data-step-line], axis y) and the per-card step
            numbers ([data-step-dot]) use the same hooks, new layout. The sticky element itself carries no [data-reveal]
            (GSAP inline transforms on a sticky element are a known
            hazard); the section-level reveal owns the entrance.
            Scroll fix (Worker C): the step cards used to share ONE
            [data-stagger] group + ONE [data-step-group] on the grid, so
            all four cards revealed and all four numbers filled within
            ~0.4s of the grid top entering — cards 3–4 animated while
            still below the fold. Each card now carries its own
            [data-reveal] + [data-step-group], so a card reveals and its
            number fills when THAT card scrolls into view. The vertical
            step line carries an inline top transform-origin (GSAP's
            scaleY default origin is the centre, so the line used to grow
            from the middle outward); the scrub-linked draw itself is a
            motion.tsx patch (see coordinator report) — the line still
            draws once on entry until that patch lands. */}
        <section data-reveal="right" className="section bg-white">
          <div className="wrap lg:grid lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <div data-reveal="fade">
                  <h2 className="text-h2 font-semibold text-navy">{withGradientWord(t(pumping.stepsTitle, l), t(HL.steps, l))}</h2>
                </div>
              </div>
            </div>
            <div className="relative mt-10 lg:col-span-8 lg:mt-0">
              <div data-step-line data-step-axis="y" style={{ transformOrigin: "top center" }} className="step-line--v absolute inset-y-0 start-0 h-full" aria-hidden="true" />
              <div className="grid gap-6 ps-6 sm:grid-cols-2 lg:grid-cols-1">
                {pumping.steps.map((step, i) => (
                  <div key={step.n} data-reveal="up" data-step-group className="relative overflow-hidden rounded-card bg-surface shadow-card">
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
              <h2 className="text-h2 font-semibold text-navy">{withGradientWord(t(pumping.diagramTitle, l), t(HL.diagram, l))}</h2>
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
              <h2 className="text-h2 font-semibold text-navy">{withGradientWord(t(pumping.applicationsTitle, l), t(HL.applications, l))}</h2>
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

        <SizingStrip locale={l} />
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
      {/* How we work — same sticky scroll story as the pumping steps:
          the heading column stays pinned (CSS sticky, lg+ only) while the
          four process steps scroll past it; mobile is a normal stack.
          Scroll fix (Worker C): the grid used to be one [data-stagger]
          group, so all four steps revealed together on group entry while
          steps 3–4 were still below the fold, and the step numbers had no
          scroll-linked fill at all (unlike the pumping steps). Each card
          now reveals on its own entry ([data-reveal]) and its number
          fills via its own [data-step-group]/[data-step-dot], mirroring
          the pumping story. No vertical line here (dark band, no gutter
          in the card layout) — the per-card reveal is the progression. */}
      <section data-reveal="scale" className="section bg-mesh-navy">
        <div className="wrap lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div data-reveal="fade" className="text-center lg:text-start">
                <h2 className="text-h2 font-semibold text-white">{withGradientWord(t(pages.solutions.k27, l), t(HL.process, l))}</h2>
              </div>
            </div>
          </div>
          <div className="mt-10 grid gap-6 lg:col-span-8 lg:mt-0">
            {workProcess.map((step, i) => (
              <div key={step.title.ar} data-reveal="up" data-step-group className="relative flex gap-5 rounded-card border border-white/15 bg-[#16324F] p-6">
                <span data-step-dot className="shrink-0 font-latin text-4xl font-extrabold text-white" dir="ltr">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">{categoryIcon(step.icon)}</div>
                <div className="min-w-0">
                  <h3 className="text-h4 font-semibold text-white">{t(step.title, l)}</h3>
                  <p className="mt-2 text-body-sm text-sky-100">{t(step.text, l)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SizingStrip locale={l} />
      <CTABand locale={l} variant="split" title={copy ? copy.k1 : pages.solutions.k28} text={copy ? copy.k2 : pages.solutions.k29} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
