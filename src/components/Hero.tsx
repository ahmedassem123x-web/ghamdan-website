import type { ReactNode } from "react";
import { webp } from "@/lib/images";
import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";
import HeroAmbient from "./HeroAmbient";
import WordSwap from "./WordSwap";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import type { Locale, LocalizedString } from "@/data";

export type HeroVariant = "center" | "side-left" | "side-right" | "split" | "photo-bg" | "full-left" | "plain";

/**
 * MaskedHeading — word-level masked-line reveal for hero titles.
 * Each WORD (never a single letter — Arabic shaping must survive) sits
 * in an overflow-hidden mask; MotionProvider animates .mask-line__inner
 * y 110% -> 0, 900ms expo.out, stagger 140ms, first load only. The text
 * stays real DOM text; without JS / reduced motion it is simply visible.
 */
function MaskedHeading({ text, className }: { text: string; className: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <h1 data-masked-title className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="mask-line">
            <span className="mask-line__inner">{w}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </h1>
  );
}

/**
 * PillLabel — renders a stat-pill label with its leading number wrapped
 * in a `[data-countup]` span, so MotionProvider animates the number
 * once on entry (Phase 1 count-up stats). The final value is already in
 * the HTML, so without JS / under reduced motion the correct number is
 * simply shown. Labels without a leading number render unchanged.
 */
function PillLabel({ label }: { label: string }) {
  const m = label.match(/^(\d+)\s*(.*)$/);
  if (!m) return <>{label}</>;
  return (
    <>
      <span data-countup={m[1]}>{m[1]}</span>
      {m[2] ? ` ${m[2]}` : ""}
    </>
  );
}

export interface HeroProps {
  locale: Locale;
  variant?: HeroVariant;
  /**
   * Kept for call-site compatibility only — no longer rendered. Craft-floor
   * ban: no eyebrow/kicker label and no marker bar above a heading.
   */
  eyebrow?: LocalizedString;
  title: LocalizedString;
  text?: LocalizedString;
  image?: string;
  imageAlt?: string;
  /** Pill labels under the copy (home: 3 pillars). Rendered as glass chips on the navy center hero. */
  pills?: { icon: ReactNode; label: LocalizedString }[];
  /**
   * Rotating words under the hero title (Phase 1 WordSwap, center
   * variant only). Existing data only — the home page passes the
   * solution-area pills, localised. Word-level swap; the data-driven
   * title itself is never altered.
   */
  rotatingWords?: LocalizedString[];
  primaryHref?: string;
  primaryLabelKey?: string;
  whatsapp?: boolean;
  /** WhatsApp button style in the hero (spec: navy on most heroes, green only where the reference shows it). */
  whatsappVariant?: "navy-pill" | "green-pill" | "white-on-dark";
  /** Override the WhatsApp message for this hero (e.g. category/product context). */
  waMessage?: string;
  /**
   * Kept for call-site compatibility only — the eyebrow pill it styled is
   * no longer rendered (see `eyebrow` above).
   */
  badgeStyle?: "soft" | "white";
  /**
   * darkText (center variant only, ADR-03 / Phase 4): kept for call-site
   * compatibility and no longer changes the rendering — the LIGHT
   * treatment is unconditional for every photo hero (center / photo-bg /
   * full-left): navy #102B46 is reserved for footer/dark bands only.
   * The center hero itself is now mesh-navy by design (see below).
   */
  darkText?: boolean;
  children?: ReactNode;
  /** Breadcrumb trail (detail pages). */
  crumbs?: { label: string; href?: string }[];
  /**
   * Optional illustration (e.g. SolarSystemIllustration) for the center
   * hero: shown in a glowing side panel on desktop, below the copy on
   * mobile. When absent, `image` (if given) is shown in the panel instead.
   */
  visual?: ReactNode;
}

/**
 * Hero (BUILD_SPEC §2.12 + §3, Variant A "Navy Editorial" redesign).
 *
 * - center (01 home): layered mesh-navy — `.bg-mesh-navy` + grain + soft
 *   blue/red glows — white display headline, sky-tint supporting copy,
 *   dual CTA (WhatsApp green + white button), glass stat chips, and an
 *   optional illustration panel. NO circular badge, NO eyebrow, NO
 *   "طاقة ومياه من أجل مستقبل أفضل" line (the home page passes no
 *   eyebrow, and none is rendered here).
 * - photo-bg / full-left: photo + WHITE gradient scrim only (no heavy
 *   navy overlay) + navy H1.
 * - side-left / side-right / split: light mesh background
 *   (`.bg-mesh-light`) + framed image + navy H1.
 * - plain: light mesh background + navy H1.
 * Split heroes: in RTL the first grid column renders on the right, so
 * "side-left" (image first) puts the text on the physical left and
 * "side-right"/"split" (copy first) puts the text on the physical right.
 * Photo heroes carry data-photo-hero; the header is solid white from
 * first paint (C-1 fix 2026-11-14) — it never goes transparent over photos.
 */
export default function Hero({
  locale,
  variant = "plain",
  eyebrow: _eyebrow,
  title,
  text,
  image,
  imageAlt = "",
  pills,
  rotatingWords,
  primaryHref,
  primaryLabelKey = "cta.discoverMore",
  whatsapp = true,
  whatsappVariant = "green-pill",
  /** Override the WhatsApp message for this hero (e.g. category/product context). */
  waMessage,
  badgeStyle: _badgeStyle = "soft",
  darkText: _darkText = false,
  children,
  crumbs,
  visual,
}: HeroProps) {
  const titleText = t(title, locale);
  const textText = text ? t(text, locale) : "";
  const waButton = (
    <WhatsAppButton
      locale={locale}
      message={waMessage ?? WA_MESSAGES.general[locale]}
      label={ui("cta.whatsappStart", locale)}
      source="hero"
      variant={whatsappVariant}
    />
  );

  const copy = (
    <>
      <MaskedHeading text={titleText} className="mt-5 text-h1 font-bold leading-[1.2] text-navy" />
      {textText && <p className="hero__anim mt-4 max-w-2xl text-body-lg text-text-secondary">{textText}</p>}
      <div className="hero__anim mt-8 flex flex-wrap items-center gap-3">
        {whatsapp && waButton}
        {primaryHref && (
          <Link
            href={localizedHref(locale, primaryHref)}
            data-magnetic
            className="btn btn-navy"
          >
            {ui(primaryLabelKey, locale)}
          </Link>
        )}
      </div>
      {pills && pills.length > 0 && (
        <div className="hero__anim mt-10 flex flex-wrap gap-3">
          {pills.map((p, i) => (
            <span key={i} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold text-navy shadow-card">
              <span className="text-primary-hover">{p.icon}</span>
              <PillLabel label={t(p.label, locale)} />
            </span>
          ))}
        </div>
      )}
      {children}
    </>
  );

  const breadcrumbBar = crumbs && crumbs.length > 0 ? (
    <nav aria-label="Breadcrumb" className="breadcrumbs wrap relative z-10 pt-5">
      <ol className="flex flex-wrap items-center gap-2 text-caption text-text-muted">
        {crumbs.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.href ? (
              <Link href={c.href} className="transition-colors hover:text-primary-hover">{c.label}</Link>
            ) : (
              <span aria-current="page" className="font-bold text-navy">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  ) : null;

  if (variant === "center") {
    // Layered mesh-navy hero: gradient mesh + grain + soft blue/red glows,
    // white display headline, sky-tint copy, dual CTA, glass stat chips,
    // and an optional illustration panel (side on desktop, below copy on
    // mobile). When no visual is passed, `image` fills the panel; with
    // neither, the copy centers full-width.
    const hasVisual = Boolean(visual);
    const hasImage = Boolean(image);
    const hasPanel = hasVisual || hasImage;
    return (
      <section className="bg-mesh-navy relative overflow-hidden text-white">
        {/* Grain is a CHILD overlay span (globals.css .grain is absolute +
            0.05 opacity) — never a class on the section itself. */}
        <span className="grain" aria-hidden="true" />
        {/* Phase 1 ambient layer: 2D particles + gated procedural 3D
            scene, pointer-events-none, behind the glows and the copy.
            The villa photo panel, copy, CTAs and stat pills are
            untouched. */}
        <HeroAmbient />
        {/* Soft glows: blue upper corner, red lower corner (restrained). */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 end-[-8%] size-[26rem] rounded-full bg-primary/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 start-[-6%] size-[22rem] rounded-full bg-brand-red/20 blur-3xl" />
        <div className="wrap relative py-16 md:py-24">
          <div className={hasPanel ? "grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14" : "mx-auto max-w-4xl text-center"}>
            <div className={hasPanel ? "" : "flex flex-col items-center"}>
              <MaskedHeading text={titleText} className="mt-5 text-display font-bold leading-[1.1] text-white" />
              {rotatingWords && rotatingWords.length > 0 && (
                <WordSwap words={rotatingWords.map((w) => t(w, locale))} />
              )}
              {textText && <p className="hero__anim mt-5 max-w-2xl text-body-lg text-text-inverse-muted">{textText}</p>}
              <div className={`hero__anim mt-8 flex flex-wrap items-center gap-3 ${hasPanel ? "" : "justify-center"}`}>
                {whatsapp && waButton}
                {primaryHref && (
                  <Link href={localizedHref(locale, primaryHref)} data-magnetic className="btn btn-white">
                    {ui(primaryLabelKey, locale)}
                  </Link>
                )}
              </div>
              {pills && pills.length > 0 && (
                <div className={`hero__anim mt-10 flex flex-wrap gap-3 ${hasPanel ? "" : "justify-center"}`}>
                  {pills.map((p, i) => (
                    <span key={i} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#16324F] px-4 py-2 text-sm font-bold text-white shadow-card">
                      <span className="text-accent">{p.icon}</span>
                      <PillLabel label={t(p.label, locale)} />
                    </span>
                  ))}
                </div>
              )}
              {children}
            </div>
            {hasPanel && (
              <div className="hero__anim relative">
                <div aria-hidden="true" className="pointer-events-none absolute -inset-6 rounded-full bg-primary/20 blur-3xl" />
                <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#16324F] shadow-glow-blue">
                  {hasVisual ? (
                    <div className="p-6 md:p-8 [&_svg]:h-auto [&_svg]:w-full">{visual}</div>
                  ) : (
                    <div className="relative aspect-[4/3] w-full">
                      <img src={webp(image!)} alt={imageAlt} data-parallax className="h-full w-full object-cover" fetchPriority="high" />
                      {/* Light navy duotone scrim so the photo reads as one system with the mesh hero. */}
                      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // full-left (ref 05 projects): full-width photo, text top physical-left.
  // LIGHT treatment: white gradient scrim + navy copy, NO navy overlay.
  if (variant === "full-left" && image) {
    return (
      <section data-photo-hero className="relative overflow-hidden">
        <img src={webp(image)} alt={imageAlt} data-parallax className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-white/0" aria-hidden="true" />
        {breadcrumbBar}
        <div className="wrap relative py-16 md:py-20">
          <div className="max-w-3xl text-left mr-auto">
            <MaskedHeading text={titleText} className="mt-5 text-h1 font-bold leading-[1.2] text-navy" />
            {textText && <p className="hero__anim mt-4 max-w-2xl text-body-lg text-text">{textText}</p>}
            <div className="hero__anim mt-8 flex flex-wrap items-center gap-3">
              {whatsapp && waButton}
              {primaryHref && (
                <Link href={localizedHref(locale, primaryHref)} data-magnetic className="btn btn-navy">
                  {ui(primaryLabelKey, locale)}
                </Link>
              )}
            </div>
            {children}
          </div>
        </div>
      </section>
    );
  }

  // photo-bg (detail pages): LIGHT treatment — white gradient scrim +
  // navy copy, no navy overlay.
  if (variant === "photo-bg" && image) {
    return (
      <section data-photo-hero className="relative overflow-hidden">
        <img src={webp(image)} alt={imageAlt} data-parallax className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-white/0" aria-hidden="true" />
        {breadcrumbBar}
        <div className="wrap relative py-16 text-navy md:py-24">
          <MaskedHeading text={titleText} className="mt-5 max-w-3xl text-h1 font-bold leading-[1.2]" />
          {textText && <p className="hero__anim mt-4 max-w-2xl text-body-lg text-text">{textText}</p>}
          <div className="hero__anim mt-8 flex flex-wrap items-center gap-3">
            {whatsapp && waButton}
            {primaryHref && (
              <Link href={localizedHref(locale, primaryHref)} data-magnetic className="btn btn-navy">
                {ui(primaryLabelKey, locale)}
              </Link>
            )}
          </div>
          {children}
        </div>
      </section>
    );
  }

  if ((variant === "side-left" || variant === "side-right" || variant === "split") && image) {
    const imageFirst = variant === "side-left";
    // The image sits in an overflow-hidden wrapper so the data-parallax
    // scale (1.08, hides drift edges) never escapes the rounded frame.
    const heroImage = (
      <div className="group h-full min-h-72 w-full overflow-hidden rounded-image shadow-card">
        <img src={webp(image)} alt={imageAlt} data-parallax className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" fetchPriority="high" />
      </div>
    );
    return (
      <section className="bg-mesh-light">
        {breadcrumbBar}
        <div className="wrap grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          {imageFirst ? (
            <>
              {heroImage}
              <div>{copy}</div>
            </>
          ) : (
            <>
              <div>{copy}</div>
              {heroImage}
            </>
          )}
        </div>
      </section>
    );
  }

  // plain (default): navy text on light mesh
  return (
    <section className="bg-mesh-light">
      {breadcrumbBar}
      <div className="wrap py-14 md:py-20">{copy}</div>
    </section>
  );
}
