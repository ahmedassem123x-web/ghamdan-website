import type { Metadata } from "next";
import Link from "next/link";
import { Sun, Droplet, Leaf, Users, Layers, Settings, ArrowLeft, Mail, Phone, MapPin, BadgeCheck } from "lucide-react";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import SolarLineArt from "@/components/SolarLineArt";
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
  const pumping = solutionAreas.find((a) => a.id === "pumping")!;
  const irrigation = solutionAreas.find((a) => a.id === "irrigation")!;
  const { contact } = siteSettings;
  // Featured products: real approved data only (data's round-robin featured
  // selection, 12) — one per category, so the three tiles do not repeat the
  // same stand-in photo (M-4: only 4 stand-in images serve 37 products;
  // first-3-by-order would be three identical inverter photos).
  const featuredProducts = ["inverters", "batteries", "pumps"]
    .map((catId) => products.find((p) => p.featured && p.status === "published" && p.categoryId === catId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const deye = agencies.find((a) => a.id === "deye")!;
  const carriedBrands = agencies.filter((a) => !a.officialAgent);

  return (
    <>
      {/* 1.1 Hero center (§3.1.1, ref 01 / ADR-03): navy headline on the bright
          sky, NO navy overlay, white gradient scrim behind the text (measured
          contrast fallback). ONE navy WhatsApp CTA, white badge pill, no
          pillar pills. Image stays hero-villa-mountains.jpg: the ref subject
          is villa + SEA, but hero-villa-sea.jpg belongs on About (ref 02 is
          villa + sea) — subject gap recorded, not fixed by swapping. */}
      <Hero
        locale={l}
        variant="center"
        darkText
        image="/images/heroes/hero-villa-mountains.jpg"
        imageAlt={t(h.k2, l)}
        eyebrow={h.k1}
        badgeStyle="white"
        title={h.k2}
        text={h.k3}
        whatsapp
        whatsappVariant="green-pill"
      />

      {/* 1.9 Guidance bar (Home + /products only) */}
      <div className="border-b border-border bg-surface">
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
              className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-navy px-5 py-2.5 font-bold text-button text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-navy"
            >
              {l === "ar" ? "دليل الضخ" : l === "en" ? "Pumping guide" : "抽水指南"}
            </Link>
            <WhatsAppButton locale={l} message={WA_MESSAGES.general[l]} label={ui("cta.whatsappStart", l)} source="home-guidance" variant="outlined-blue" />
          </div>
        </div>
      </div>

      {/* 1.2 Intro + 1.3 Pillars — visible by default (no .reveal /
          data-stagger hooks: Phase 4 blank-before-reveal fix). */}
      <section data-reveal className="section">
        <div className="wrap">
          <div className="text-center">
            <h2 className="text-h2 font-semibold text-navy">{t(h.k37, l)}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-body text-text-muted">{t(h.k36, l)}</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3 md:divide-x md:divide-border md:divide-x-reverse">
            {pillars.map((p) => (
              <div key={p.title.ar} className="flex flex-col items-center px-4 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-sky text-primary-hover">
                  {p.icon === "sun" ? <Sun className="size-8" aria-hidden="true" /> : p.icon === "droplet" ? <Droplet className="size-8" aria-hidden="true" /> : <Leaf className="size-8" aria-hidden="true" />}
                </div>
                <h3 className="mt-4 text-h3 font-semibold text-navy">{t(p.title, l)}</h3>
                <p className="mt-2 text-body-sm text-text-muted">{t(p.text, l)}</p>
              </div>
            ))}
          </div>
          <SolarLineArt />
        </div>
      </section>

      {/* 1.4 Marquee strip — navy bg / white text is the IMPLEMENTED treatment;
          ref 01 shows white bg / black text (open decision D-5, Phase 3).
          Kept as-is here; do not change unilaterally. */}
      <div className="overflow-hidden bg-navy py-4 text-white" aria-hidden="true">
        <div className="marquee__track">
          {/* Each half renders the words twice: one half must be wider than
              the viewport, otherwise the -50% shift exposes empty navy at
              1920px. Duration doubled in globals.css to keep the same speed. */}
          {[0, 1].map((dup) => (
            <span key={dup} className="flex shrink-0 items-center">
              {[...marqueeWords, ...marqueeWords].map((w, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-6 text-lg font-extrabold">{t(w, l)}</span>
                  <span className="text-primary-hover">—</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 1.5 Solutions grid — 2×2 horizontal cards (§3.1.5). Heading inlined
          (visible by default) instead of SectionHeadingL, whose shared
          wrapper no longer hides content (Phase 6 removed .reveal). */}
      <section data-reveal className="section">
        <div className="wrap">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky px-4 py-1.5 text-sm font-bold text-primary-hover">
              {t(h.k39, l)}
            </p>
            <h2 className="text-h2 font-semibold text-navy">{t(h.k40, l)}</h2>
            <p className="mt-3 max-w-2xl text-body text-text-muted">{t(h.k38, l)}</p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <SolutionCardHorizontal locale={l} title={t(residential.title, l)} text={t(residential.text, l)} image="/images/photos/panels-rows.jpg" imageAlt={t(residential.title, l)} href={localizedHref(l, "/solutions/residential")} />
            <SolutionCardHorizontal locale={l} title={t(pumping.title, l)} text={t(pumping.text, l)} image="/images/photos/pump-flow.jpg" imageAlt={t(pumping.title, l)} href={localizedHref(l, "/solutions/pumping")} />
            <SolutionCardHorizontal locale={l} title={t(irrigation.title, l)} text={t(irrigation.text, l)} image="/images/photos/greenhouse.jpg" imageAlt={t(irrigation.title, l)} href={localizedHref(l, "/solutions/irrigation")} />
            <SolutionCardHorizontal locale={l} title={t(pages.solutions.k1, l)} text={t(pages.solutions.k2, l)} image="/images/photos/solar-farm.jpg" imageAlt={t(pages.solutions.k1, l)} href={localizedHref(l, "/solutions")} />
          </div>
        </div>
      </section>

      {/* 1.6 Why us — sky band with faint sky photo */}
      <section data-reveal className="section relative overflow-hidden bg-sky">
        <img src={webp("/images/photos/villa-sky.jpg")} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-[0.12]" />
        <div className="wrap relative">
          <div className="text-center">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-primary-hover shadow-card">
              {t(h.k40, l)}
            </p>
            <h2 className="text-h2 font-semibold text-navy">{t(h.k41, l)}</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: <Settings className="size-7" aria-hidden="true" />, title: t(h.k34, l), text: t(h.k35, l) },
              { icon: <Layers className="size-7" aria-hidden="true" />, title: t(h.k32, l), text: t(h.k33, l) },
              { icon: <Users className="size-7" aria-hidden="true" />, title: t(h.k30, l), text: t(h.k31, l) },
            ].map((f, i) => (
              <div key={i} className="rounded-card bg-surface p-6 text-center shadow-card">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-sky text-primary-hover">{f.icon}</div>
                <h3 className="mt-4 text-h4 font-semibold text-navy">{f.title}</h3>
                <p className="mt-2 text-body-sm text-text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* §6.1 item 12 — Panoramic solar/engineering visual (full-width photo
          band, decorative — no text overlay, no caption). */}
      <section aria-hidden="true">
        <img src={webp("/images/photos/solar-farm.jpg")} alt="" loading="lazy" className="aspect-[21/9] w-full object-cover md:aspect-[21/7]" />
      </section>

      {/* §6.1 item 14 — Featured products, real approved data only.
          §6.1 item 15 (featured projects) is OMITTED: no genuine approved
          projects exist, and the two generic "project" cards that used to
          sit here were not real projects — removed, not replaced. */}
      <section data-reveal className="section">
        <div className="wrap">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-h2 font-semibold text-navy">{t(h.k45, l)}</h2>
            <Link href={localizedHref(l, "/products")} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover">
              {ui("cta.viewAllProducts", l)}
              <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {featuredProducts.map((p) => (
              <Link key={p.id} href={localizedHref(l, `/products/${p.slug}`)} className="group block overflow-hidden rounded-card bg-surface shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="aspect-square overflow-hidden bg-surface-muted">
                  {p.image ? (
                    <img src={webp(p.image)} alt={t(p.name, l)} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-sky font-latin text-4xl font-extrabold text-primary" dir="ltr">
                      {p.brand.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="block p-3 text-center text-sm font-bold leading-snug text-navy">{t(p.name, l)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* §6.1 item 16 — Brand/partner preview, verified representation only:
          Deye is the confirmed official agent in Yemen; the other five are
          brands GTS carries (their agency status is NOT established — the
          wording says so, per §3.5). Text wordmarks only — no partner logos
          are verified. */}
      <section data-reveal className="section-sm bg-surface">
        <div className="wrap">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-h2 font-semibold text-navy">{t(pages.agencies.list.k1, l)}</h2>
              <p className="mt-3 max-w-2xl text-body text-text-muted">{t(pages.agencies.list.k2, l)}</p>
            </div>
            <Link href={localizedHref(l, "/agencies")} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover">
              {ui("cta.details", l)}
              <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Link href={localizedHref(l, "/agencies/deye")} className="group flex flex-col rounded-card bg-sky p-6 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card-hover">
              <div className="flex items-center justify-between gap-3">
                <span className="font-latin text-3xl font-extrabold tracking-tight text-navy" dir="ltr">
                  {deye.name}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-sky px-3 py-1 text-xs font-bold text-primary-hover">
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  {t(deye.status, l)}
                </span>
              </div>
              <p className="mt-3 flex-1 text-body-sm text-text-muted">{t(deye.text, l)}</p>
            </Link>
            <div className="flex flex-col justify-center rounded-card border border-border bg-surface p-6">
              <p className="text-sm font-bold text-text-muted">{t(pages.agencies.list.k9, l)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {carriedBrands.map((a) => (
                  <Link key={a.id} href={localizedHref(l, `/agencies/${a.id}`)} className="rounded-full bg-surface-muted px-4 py-2 text-sm font-bold text-navy transition-colors hover:bg-sky hover:text-primary-hover">
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
      <CTABand
        locale={l}
        variant="split"
        title={h.k52}
        text={h.k53}
        whatsappLabelKey="cta.whatsapp"
        whatsappVariant="white-on-dark"
        contactRows={[
          { icon: <Mail className="size-4" aria-hidden="true" />, label: t(h.k46, l), value: contact.email, href: `mailto:${contact.email}` },
          { icon: <Phone className="size-4" aria-hidden="true" />, label: t(h.k48, l), value: contact.phoneDisplay, href: `tel:${contact.whatsapp}` },
          { icon: <MapPin className="size-4" aria-hidden="true" />, label: t(h.k50, l), value: t(contact.address, l) },
        ]}
      />
    </>
  );
}
