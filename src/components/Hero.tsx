import type { ReactNode } from "react";
import { webp } from "@/lib/images";
import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import type { Locale, LocalizedString } from "@/data";

export type HeroVariant = "center" | "side-left" | "side-right" | "split" | "photo-bg" | "full-left" | "plain";

export interface HeroProps {
  locale: Locale;
  variant?: HeroVariant;
  eyebrow?: LocalizedString;
  title: LocalizedString;
  text?: LocalizedString;
  image?: string;
  imageAlt?: string;
  /** Pill labels under the copy (home: 3 pillars). */
  pills?: { icon: ReactNode; label: LocalizedString }[];
  primaryHref?: string;
  primaryLabelKey?: string;
  whatsapp?: boolean;
  /** WhatsApp button style in the hero (spec: navy on most heroes, green only where the reference shows it). */
  whatsappVariant?: "navy-pill" | "green-pill" | "white-on-dark";
  /** Override the WhatsApp message for this hero (e.g. category/product context). */
  waMessage?: string;
  /** Eyebrow pill style: "soft" (sky tint) or "white" (white pill + green dot, home hero §3.1.1). */
  badgeStyle?: "soft" | "white";
  /**
   * darkText (center variant only, ADR-03 / Phase 4): ref-01 treatment —
   * navy headline on the bright sky, NO navy overlay. The white gradient
   * scrim behind the text is the measured fallback: black/navy on the sky
   * zone (y6–30%) passes WCAG AA (navy 8.80:1 median, 5.26:1 p10), but the
   * supporting copy extends below the pure-sky zone where navy falls to
   * 4.24:1 median — the scrim lifts the whole text block back above AA.
   * Never a navy overlay here.
   */
  darkText?: boolean;
  children?: ReactNode;
  /** Breadcrumb trail (detail pages). */
  crumbs?: { label: string; href?: string }[];
}

/**
 * Hero (BUILD_SPEC §2.12 + §3). Variants per reference page (ADR-02, M-3):
 * center (01 home, darkText = ref-01 black-on-bright-sky) · side-left
 * (02 about: text left, photo right) · side-right (03 solutions, 07 contact,
 * 09 pumping: text right, photo left) · split (04 catalogue: text left,
 * photo right — implemented as side-left; 08 category: text right, photo
 * left) · photo-bg (detail pages) · full-left (05 projects: full-width,
 * text top physical-left, white on 60% navy overlay — measured: white on
 * the solar-farm top-left zone is 2.78:1 without overlay, 7.32:1 with it)
 * · plain. Split heroes: in RTL the first grid column renders on the
 * right, so "side-left" (image first) puts the text on the physical left
 * and "side-right"/"split" (copy first) puts the text on the physical right.
 * Photo heroes carry data-photo-hero (hook for future use; the header is
 * solid white from first paint since C-1 fix 2026-11-14 — it no longer goes
 * transparent over photos).
 */
export default function Hero({
  locale,
  variant = "plain",
  eyebrow,
  title,
  text,
  image,
  imageAlt = "",
  pills,
  primaryHref,
  primaryLabelKey = "cta.discoverMore",
  whatsapp = true,
  whatsappVariant = "green-pill",
  /** Override the WhatsApp message for this hero (e.g. category/product context). */
  waMessage,
  badgeStyle = "soft",
  darkText = false,
  children,
  crumbs,
}: HeroProps) {
  const titleText = t(title, locale);
  const textText = text ? t(text, locale) : "";
  const eyebrowText = eyebrow ? t(eyebrow, locale) : "";
  const badgeCls =
    badgeStyle === "white"
      ? "bg-white text-navy shadow-card"
      : "bg-sky text-primary-hover";
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
      {eyebrowText && (
        <p className={`hero__anim mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${badgeCls}`}>
          {badgeStyle === "white" && <span className="size-2 rounded-full bg-success" aria-hidden="true" />}
          {eyebrowText}
        </p>
      )}
      <h1 className="hero__anim text-hero font-bold leading-[1.15] text-navy">{titleText}</h1>
      {textText && <p className="hero__anim mt-5 max-w-2xl text-body-lg text-text-muted">{textText}</p>}
      <div className="hero__anim mt-8 flex flex-wrap items-center gap-3">
        {whatsapp && waButton}
        {primaryHref && (
          <Link
            href={localizedHref(locale, primaryHref)}
            className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-navy px-5 py-2.5 font-bold text-button text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-navy"
          >
            {ui(primaryLabelKey, locale)}
          </Link>
        )}
      </div>
      {pills && pills.length > 0 && (
        <div className="hero__anim mt-10 flex flex-wrap gap-3">
          {pills.map((p, i) => (
            <span key={i} className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-bold text-navy shadow-card">
              <span className="text-primary-hover">{p.icon}</span>
              {t(p.label, locale)}
            </span>
          ))}
        </div>
      )}
      {children}
    </>
  );

  const breadcrumbBar = crumbs && crumbs.length > 0 ? (
    <nav aria-label="Breadcrumb" className="wrap relative z-10 pt-5">
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

  if (variant === "center" && image) {
    // darkText (ref 01): no navy overlay — headline sits over the sky
    // portion of the image (top-anchored text) with a white gradient scrim
    // behind the text block as the measured contrast fallback (see prop doc).
    // Default (darkText=false): the legacy white-on-25%-overlay treatment.
    return (
      <section data-photo-hero className={`relative flex overflow-hidden ${darkText ? "min-h-[72vh] items-start md:min-h-[90vh]" : "min-h-[72vh] items-center md:min-h-[90vh]"}`}>
        <img src={webp(image)} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        {darkText ? (
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-white/0" aria-hidden="true" />
        ) : (
          /* M-2 fix 2026-11-14: overlay was bg-navy/55 (55% navy) — the
             home hero rendered dark/moody vs bright ref 01 (pale-blue sky,
             dark text). Lightened to /25 so the daylight photo reads bright
             while the white hero copy keeps enough contrast. */
          <div className="absolute inset-0 bg-navy/25" />
        )}
        <div className={`wrap relative w-full py-20 text-center md:pt-24 ${darkText ? "text-navy" : "text-white"}`}>
          {eyebrowText && (
            <p className={`hero__anim mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${
              badgeStyle === "white" ? "bg-white text-navy shadow-card" : darkText ? "bg-white text-navy shadow-card" : "bg-white/15 text-white backdrop-blur-sm"
            }`}>
              {(badgeStyle === "white" || darkText) && <span className="size-2 rounded-full bg-success" aria-hidden="true" />}
              {eyebrowText}
            </p>
          )}
          <h1 className={`hero__anim mx-auto max-w-4xl text-hero font-bold leading-[1.15] ${darkText ? "text-navy" : ""}`}>{titleText}</h1>
          {textText && <p className={`hero__anim mx-auto mt-5 max-w-2xl text-body-lg ${darkText ? "text-text" : "text-white/90"}`}>{textText}</p>}
          <div className="hero__anim mt-8 flex flex-wrap items-center justify-center gap-3">
            {whatsapp && waButton}
            {primaryHref && (
              <Link href={localizedHref(locale, primaryHref)} className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-white px-5 py-2.5 font-bold text-button text-navy transition-transform duration-200 hover:-translate-y-0.5">
                {ui(primaryLabelKey, locale)}
              </Link>
            )}
          </div>
          {pills && pills.length > 0 && (
            <div className="hero__anim mt-10 flex flex-wrap justify-center gap-3">
              {pills.map((p, i) => (
                <span key={i} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${darkText ? "bg-white text-navy shadow-card" : "bg-white/15 text-white backdrop-blur-sm"}`}>
                  <span>{p.icon}</span>
                  {t(p.label, locale)}
                </span>
              ))}
            </div>
          )}
          {children}
        </div>
      </section>
    );
  }

  // full-left (ref 05 projects): full-width photo, text top physical-left,
  // white copy on a 60% navy overlay (measured: required for AA on the
  // solar-farm image — white is 2.78:1 bare, 7.32:1 with the overlay).
  if (variant === "full-left" && image) {
    return (
      <section data-photo-hero className="relative overflow-hidden">
        <img src={webp(image)} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-navy/60" />
        {breadcrumbBar}
        <div className="wrap relative py-16 md:py-20">
          <div className="max-w-3xl text-left mr-auto">
            {eyebrowText && (
              <p className="hero__anim mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white">
                {eyebrowText}
              </p>
            )}
            <h1 className="hero__anim text-h1 font-bold leading-[1.2] text-white">{titleText}</h1>
            {textText && <p className="hero__anim mt-4 max-w-2xl text-body-lg text-white/90">{textText}</p>}
            <div className="hero__anim mt-8 flex flex-wrap items-center gap-3">
              {whatsapp && waButton}
              {primaryHref && (
                <Link href={localizedHref(locale, primaryHref)} className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-white px-5 py-2.5 font-bold text-button text-navy transition-transform duration-200 hover:-translate-y-0.5">
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

  if (variant === "photo-bg" && image) {
    return (
      <section data-photo-hero className="relative overflow-hidden">
        <img src={webp(image)} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-navy/60" />
        {breadcrumbBar}
        <div className="wrap relative py-16 text-white md:py-24">
          {eyebrowText && (
            <p className="hero__anim mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white">
              {eyebrowText}
            </p>
          )}
          <h1 className="hero__anim max-w-3xl text-h1 font-bold leading-[1.2]">{titleText}</h1>
          {textText && <p className="hero__anim mt-4 max-w-2xl text-body-lg text-white/90">{textText}</p>}
          <div className="hero__anim mt-8 flex flex-wrap items-center gap-3">
            {whatsapp && waButton}
            {primaryHref && (
              <Link href={localizedHref(locale, primaryHref)} className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-white px-5 py-2.5 font-bold text-button text-navy transition-transform duration-200 hover:-translate-y-0.5">
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
    return (
      <section className="bg-surface">
        {breadcrumbBar}
        <div className="wrap grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          {imageFirst ? (
            <>
              <img src={webp(image)} alt={imageAlt} className="h-full min-h-72 w-full rounded-image object-cover shadow-card" fetchPriority="high" />
              <div>{copy}</div>
            </>
          ) : (
            <>
              <div>{copy}</div>
              <img src={webp(image)} alt={imageAlt} className="h-full min-h-72 w-full rounded-image object-cover shadow-card" fetchPriority="high" />
            </>
          )}
        </div>
      </section>
    );
  }

  // plain (default): navy text on light bg
  return (
    <section className="bg-surface">
      {breadcrumbBar}
      <div className="wrap py-14 md:py-20">{copy}</div>
    </section>
  );
}
