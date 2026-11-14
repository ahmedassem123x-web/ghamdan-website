import type { ReactNode } from "react";
import { webp } from "@/lib/images";
import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import type { Locale, LocalizedString } from "@/data";

export type HeroVariant = "center" | "side-left" | "side-right" | "split" | "photo-bg" | "plain";

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
  /** Eyebrow pill style: "soft" (accent-soft) or "white" (white pill + green dot, home hero §3.1.1). */
  badgeStyle?: "soft" | "white";
  children?: ReactNode;
  /** Breadcrumb trail (detail pages). */
  crumbs?: { label: string; href?: string }[];
}

/**
 * Hero (BUILD_SPEC §2.12 + §3). Variants per reference page:
 * center (01 home) · side-left (02 about) · side-right (03 solutions) ·
 * split (04 catalogue) · photo-bg (detail pages 06/09/10) · plain.
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
  children,
  crumbs,
}: HeroProps) {
  const titleText = t(title, locale);
  const textText = text ? t(text, locale) : "";
  const eyebrowText = eyebrow ? t(eyebrow, locale) : "";
  const badgeCls =
    badgeStyle === "white"
      ? "bg-white text-primary shadow-card"
      : "bg-accent-soft text-accent";
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
          {badgeStyle === "white" && <span className="size-2 rounded-full bg-success-dot" aria-hidden="true" />}
          {eyebrowText}
        </p>
      )}
      <h1 className="hero__anim text-hero font-extrabold leading-[1.15] text-primary">{titleText}</h1>
      {textText && <p className="hero__anim mt-5 max-w-2xl text-body-lg text-text-muted">{textText}</p>}
      <div className="hero__anim mt-8 flex flex-wrap items-center gap-3">
        {whatsapp && waButton}
        {primaryHref && (
          <Link
            href={localizedHref(locale, primaryHref)}
            className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-primary px-5 py-2.5 font-bold text-button text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-deep"
          >
            {ui(primaryLabelKey, locale)}
          </Link>
        )}
      </div>
      {pills && pills.length > 0 && (
        <div className="hero__anim mt-10 flex flex-wrap gap-3">
          {pills.map((p, i) => (
            <span key={i} className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-bold text-primary shadow-card">
              <span className="text-accent">{p.icon}</span>
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
              <Link href={c.href} className="transition-colors hover:text-accent">{c.label}</Link>
            ) : (
              <span aria-current="page" className="font-bold text-primary">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  ) : null;

  if (variant === "center" && image) {
    return (
      <section data-photo-hero className="relative flex min-h-[72vh] items-center overflow-hidden md:min-h-[90vh]">
        <img src={webp(image)} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        {/* M-2 fix 2026-11-14: overlay was bg-primary-deep/55 (55% navy) — the
            home hero rendered dark/moody vs bright ref 01 (pale-blue sky,
            dark text). Lightened to /25 so the daylight photo reads bright
            while the white hero copy keeps enough contrast. */}
        <div className="absolute inset-0 bg-primary-deep/25" />
        <div className="wrap relative w-full py-20 text-center text-white">
          {eyebrowText && (
            <p className={`hero__anim mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${
              badgeStyle === "white" ? "bg-white text-primary shadow-card" : "bg-white/15 text-white backdrop-blur-sm"
            }`}>
              {badgeStyle === "white" && <span className="size-2 rounded-full bg-success-dot" aria-hidden="true" />}
              {eyebrowText}
            </p>
          )}
          <h1 className="hero__anim mx-auto max-w-4xl text-hero font-extrabold leading-[1.15]">{titleText}</h1>
          {textText && <p className="hero__anim mx-auto mt-5 max-w-2xl text-body-lg text-white/90">{textText}</p>}
          <div className="hero__anim mt-8 flex flex-wrap items-center justify-center gap-3">
            {whatsapp && waButton}
            {primaryHref && (
              <Link href={localizedHref(locale, primaryHref)} className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-white px-5 py-2.5 font-bold text-button text-primary transition-all duration-200 hover:-translate-y-0.5">
                {ui(primaryLabelKey, locale)}
              </Link>
            )}
          </div>
          {pills && pills.length > 0 && (
            <div className="hero__anim mt-10 flex flex-wrap justify-center gap-3">
              {pills.map((p, i) => (
                <span key={i} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
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

  if (variant === "photo-bg" && image) {
    return (
      <section data-photo-hero className="relative overflow-hidden">
        <img src={webp(image)} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-primary-deep/60" />
        {breadcrumbBar}
        <div className="wrap relative py-16 text-white md:py-24">
          {eyebrowText && (
            <p className="hero__anim mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white">
              {eyebrowText}
            </p>
          )}
          <h1 className="hero__anim max-w-3xl text-h1 font-extrabold leading-[1.2]">{titleText}</h1>
          {textText && <p className="hero__anim mt-4 max-w-2xl text-body-lg text-white/90">{textText}</p>}
          <div className="hero__anim mt-8 flex flex-wrap items-center gap-3">
            {whatsapp && waButton}
            {primaryHref && (
              <Link href={localizedHref(locale, primaryHref)} className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-white px-5 py-2.5 font-bold text-button text-primary transition-all duration-200 hover:-translate-y-0.5">
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
