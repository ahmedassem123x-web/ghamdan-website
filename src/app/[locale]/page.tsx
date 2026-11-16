import type { Metadata } from "next";
import Link from "next/link";
import { SunIcon, DropletIcon, LeafIcon, UsersIcon, LayersIcon, SettingsIcon, MailIcon, PhoneIcon, MapPinIcon, CheckIcon, ArrowIcon } from "@/components/icons";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import CurveDivider from "@/components/CurveDivider";
import SolarLineArt from "@/components/SolarLineArt";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import EnergyFlowStory from "@/components/EnergyFlowStory";
import Marquee from "@/components/Marquee";
import { SolutionCardHorizontal } from "@/components/Cards";
import WhatsAppButton from "@/components/WhatsAppButton";
import { pages, pillars, solutionAreas, siteSettings, products, agencies } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import { webp } from "@/lib/images";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const h = pages.home;
  return { title: `${t(h.k2, l)} | ${t(pages.home.k1, l)}` };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const h = pages.home;
  const marqueeWords = [h.k10, h.k11, h.k12, h.k13, h.k14, h.k15, h.k16, h.k17, h.k18, h.k19, h.k20, h.k21];
  const residential = solutionAreas.find((a) => a.id === "residential")!;
  const commercial = solutionAreas.find((a) => a.id === "commercial")!;
  const pumping = solutionAreas.find((a) => a.id === "pumping")!;
  const irrigation = solutionAreas.find((a) => a.id === "irrigation")!;
  const agriculture = solutionAreas.find((a) => a.id === "agriculture")!;
  const { contact } = siteSettings;
  // Featured products: real approved data only — ALL 12 products the data
  // marks featured (inverters ×4, batteries ×4, pumps ×3, controllers ×1),
  // interleaved round-robin by category so consecutive tiles never repeat
  // the same stand-in photo (M-4: only 4 stand-in images serve 37 products).
  // 12 slides / 3 visible on desktop = a real scrollable carousel: autoplay,
  // arrows and dots change the VISIBLE cards (before this fix only 3 slides
  // were passed, all fitting the track, so the counter moved but nothing did).
  const featuredProducts = (() => {
    const byCategory = new Map<string, (typeof products)[number][]>();
    for (const p of products) {
      if (!p.featured || p.status !== "published") continue;
      const list = byCategory.get(p.categoryId) ?? [];
      list.push(p);
      byCategory.set(p.categoryId, list);
    }
    const categories = [...byCategory.keys()];
    const out: (typeof products)[number][] = [];
    let round = 0;
    let added = true;
    while (added) {
      added = false;
      for (const cat of categories) {
        const item = byCategory.get(cat)?.[round];
        if (item) {
          out.push(item);
          added = true;
        }
      }
      round += 1;
    }
    return out;
  })();
  const deye = agencies.find((a) => a.id === "deye")!;
  const carriedBrands = agencies.filter((a) => !a.officialAgent);

  return (
    <>
      {/* 1.1 Hero center (§3.1.1, ref 01 / ADR-03): navy mesh hero with the
          REAL photo (hero-villa-mountains.jpg) in the panel — the
          illustration no longer replaces the photo. No eyebrow, no badge
          pill, no stat chips (removed 2026-11-16 at the user's request). */}
      <Hero
        locale={l}
        variant="center"
        darkText
        image="/images/heroes/hero-villa-mountains.jpg"
        imageAlt={t(h.k2, l)}
        badgeStyle="white"
        title={h.k2}
        text={h.k3}
        whatsapp
        whatsappVariant="green-pill"
        rotatingWords={[residential.pill, commercial.pill, pumping.pill, irrigation.pill, agriculture.pill]}
      />

      <CurveDivider />

      {/* 1.9 Guidance bar (Home + /products only) */}
      <div data-reveal="fade" className="border-b border-border bg-white">
        <div className="wrap flex flex-col items-center justify-between gap-4 py-5 text-center sm:flex-row sm:text-start">
          <p className="font-bold text-navy">
            {l === "ar"
              ? "لا تعرف النظام المناسب؟ جرّب دليل الضخ أو تحدث معنا عبر واتساب"
              : l === "en"
                ? "Not sure which system fits? Try the pumping guide or chat with us on WhatsApp"
                : "不知道哪种系统合适？试试抽水指南或通过 WhatsApp 与我们联系"}
          </p>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
            <Link
              href={localizedHref(l, "/guidance")}
              className="btn btn-navy"
            >
              {l === "ar" ? "دليل الضخ" : l === "en" ? "Pumping guide" : "抽水指南"}
            </Link>
            <WhatsAppButton locale={l} message={WA_MESSAGES.general[l]} label={ui("cta.whatsappStart", l)} source="home-guidance" variant="outlined-blue" />
          </div>
        </div>
      </div>

      {/* 1.2 Intro + 1.3 Pillars — sky mesh (quiet) with white pillar tiles. */}
      <section data-reveal="up" className="section bg-mesh-sky">
        <div className="wrap">
          <div data-reveal="fade" className="text-center">
            <h2 className="text-h2 font-semibold text-navy">{t(h.k37, l)}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-body text-text-muted">{t(h.k36, l)}</p>
          </div>
          <div data-stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title.ar} className="card-luxe flex flex-col items-center p-6 text-center">
                <div data-draw-group className="flex size-16 items-center justify-center rounded-full bg-sky text-primary-hover">
                  {p.icon === "sun" ? <SunIcon className="size-8" aria-hidden="true" /> : p.icon === "droplet" ? <DropletIcon className="size-8" aria-hidden="true" /> : <LeafIcon className="size-8" aria-hidden="true" />}
                </div>
                <h3 className="mt-4 text-h3 font-semibold text-navy">{t(p.title, l)}</h3>
                <p className="mt-2 text-body-sm text-text-muted">{t(p.text, l)}</p>
              </div>
            ))}
          </div>
          <SolarLineArt />
        </div>
      </section>

      {/* Phase 1 — Energy-flow scroll story (sun → panel → inverter →
          battery → home): GSAP scrub + SVG path drawing via the existing
          MotionProvider data attributes, plus the CSS sun orbit. Labels
          from existing data only (see EnergyFlowStory). */}
      <EnergyFlowStory locale={l} />

      {/* 1.5 Solutions grid — 5 real solutions, 3+2 grid (§3.1.5). Commercial
          and agriculture were missing from the home page; the generic
          fourth card (repeating the solutions intro copy) is gone. */}
      <section data-reveal="left" className="section bg-white">
        <div className="wrap">
          <div data-reveal="fade">
            <h2 className="text-h2 font-semibold text-navy">{t(h.k40, l)}</h2>
            <p className="mt-3 max-w-2xl text-body text-text-muted">{t(h.k38, l)}</p>
          </div>
          <div data-stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SolutionCardHorizontal locale={l} title={t(residential.title, l)} text={t(residential.text, l)} image="/images/photos/panels-rows.jpg" imageAlt={t(residential.title, l)} href={localizedHref(l, "/solutions/residential")} />
            <SolutionCardHorizontal locale={l} title={t(commercial.title, l)} text={t(commercial.text, l)} image="/images/photos/solar-farm.jpg" imageAlt={t(commercial.title, l)} href={localizedHref(l, "/solutions/commercial")} />
            <SolutionCardHorizontal locale={l} title={t(pumping.title, l)} text={t(pumping.text, l)} image="/images/photos/pump-flow.jpg" imageAlt={t(pumping.title, l)} href={localizedHref(l, "/solutions/pumping")} />
            <SolutionCardHorizontal locale={l} title={t(irrigation.title, l)} text={t(irrigation.text, l)} image="/images/photos/greenhouse.jpg" imageAlt={t(irrigation.title, l)} href={localizedHref(l, "/solutions/irrigation")} />
            <SolutionCardHorizontal locale={l} title={t(agriculture.title, l)} text={t(agriculture.text, l)} image="/images/photos/crops.jpg" imageAlt={t(agriculture.title, l)} href={localizedHref(l, "/solutions/agriculture")} />
          </div>
        </div>
      </section>

      {/* 1.6 Why us — LOUD navy mesh band with solid navy cards
          (#16324F, no glass). */}
      <section data-reveal="scale" className="section relative overflow-hidden bg-mesh-navy">
        <div className="wrap relative">
          <div data-reveal="fade" className="text-center">
            <h2 className="text-h2 font-semibold text-white">{t(h.k41, l)}</h2>
          </div>
          <div data-stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: <SettingsIcon className="size-7" aria-hidden="true" />, title: t(h.k34, l), text: t(h.k35, l) },
              { icon: <LayersIcon className="size-7" aria-hidden="true" />, title: t(h.k32, l), text: t(h.k33, l) },
              { icon: <UsersIcon className="size-7" aria-hidden="true" />, title: t(h.k30, l), text: t(h.k31, l) },
            ].map((f, i) => (
              <div key={i} className="rounded-card border border-white/15 bg-[#16324F] p-6 text-center">
                <div data-draw-group className="mx-auto flex size-14 items-center justify-center rounded-full bg-white/10 text-white">{f.icon}</div>
                <h3 className="mt-4 text-h4 font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-body-sm text-sky-100">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* §6.1 item 12 — Panoramic solar/engineering visual (full-width photo
          band, decorative — no text overlay, no caption). overflow-hidden
          clips the data-parallax scale (1.08) so the band can never push
          the page past the viewport width (polish item 2). */}
      <section aria-hidden="true" className="overflow-hidden">
        <img data-parallax src={webp("/images/photos/solar-farm.jpg")} alt="" loading="lazy" className="aspect-[21/9] w-full object-cover md:aspect-[21/7]" />
      </section>

      {/* §6.1 item 14 — Featured products on sand, real approved data only.
          §6.1 item 15 (featured projects) is OMITTED: no genuine approved
          projects exist, and the two generic "project" cards that used to
          sit here were not real projects — removed, not replaced. */}
      <section data-reveal="right" className="section bg-sand">
        <div className="wrap">
          <div data-reveal="fade" className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-h2 font-semibold text-navy">{t(h.k45, l)}</h2>
            </div>
            <Link href={localizedHref(l, "/products")} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover">
              {ui("cta.viewAllProducts", l)}
              <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6">
            <FeaturedCarousel locale={l} products={featuredProducts} />
          </div>
        </div>
      </section>

      {/* §6.1 item 16 — Brand/partner preview, verified representation only:
          Deye is the confirmed official agent in Yemen; the other five are
          brands GTS carries (their agency status is NOT established — the
          wording says so, per §3.5). Text wordmarks only — no partner logos
          are verified. */}
      <section data-reveal="up" className="section-sm bg-white">
        <div className="wrap">
          <div data-reveal="left" className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-h2 font-semibold text-navy">{t(pages.agencies.list.k1, l)}</h2>
              <p className="mt-3 max-w-2xl text-body text-text-muted">{t(pages.agencies.list.k2, l)}</p>
            </div>
            <Link href={localizedHref(l, "/agencies")} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover">
              {ui("cta.details", l)}
              <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
            </Link>
          </div>
          <div data-stagger className="mt-8 grid gap-6 md:grid-cols-2">
            <Link href={localizedHref(l, "/agencies/deye")} className="group flex h-full flex-col rounded-card bg-mesh-navy p-6 shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card-hover">
              <div className="flex items-center justify-between gap-3">
                <span className="font-latin text-3xl font-extrabold tracking-tight text-white" dir="ltr">
                  {deye.name}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-red-deep px-3 py-1 text-xs font-bold text-white">
                  <CheckIcon className="size-3.5" aria-hidden="true" />
                  {t(deye.status, l)}
                </span>
              </div>
              <p className="mt-3 flex-1 text-body-sm text-sky-100">{t(deye.text, l)}</p>
            </Link>
            <div className="flex h-full flex-col justify-center rounded-card border border-border bg-white p-6 shadow-card">
              <p className="text-sm font-bold text-text-muted">{t(pages.agencies.list.k9, l)}</p>
              <div data-stagger className="mt-4 flex flex-wrap gap-2">
                {carriedBrands.map((a) => (
                  <Link key={a.id} href={localizedHref(l, `/agencies/${a.id}`)} className="rounded-full border border-border bg-white px-4 py-2 text-sm font-bold text-navy transition-colors hover:bg-sky hover:text-primary-hover">
                    <span dir="ltr">{a.name}</span>
                    {" · "}
                    {t(a.status, l)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* §6.1 item 17 — Dark navy closing CTA with "other ways to reach us" */}
      {/* Marquee strip (item 25): one strip only, moved from below the
          hero to above the footer — the guidance bar under the hero is
          the strip that stays. Pauses on hover / focus-within and via
          its stop button (Marquee). */}
      <Marquee locale={l} words={marqueeWords.map((w) => t(w, l))} />

      <CurveDivider />

      <CTABand
        locale={l}
        variant="split"
        title={h.k52}
        text={h.k53}
        whatsappLabelKey="cta.whatsapp"
        whatsappVariant="white-on-dark"
        contactRows={[
          { icon: <MailIcon className="size-4" aria-hidden="true" />, label: t(h.k46, l), value: contact.email, href: `mailto:${contact.email}` },
          { icon: <PhoneIcon className="size-4" aria-hidden="true" />, label: t(h.k48, l), value: contact.phoneDisplay, href: `tel:${contact.whatsapp}` },
          { icon: <MapPinIcon className="size-4" aria-hidden="true" />, label: t(h.k50, l), value: t(contact.address, l) },
        ]}
      />
    </>
  );
}
