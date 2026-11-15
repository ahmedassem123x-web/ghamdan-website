import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import { webp } from "@/lib/images";
import type { Locale, LocalizedString } from "@/data";

export type CtaVariant = "split" | "photo-left" | "photo-bg" | "features" | "whatsapp" | "flat";

export interface CtaBandProps {
  locale: Locale;
  variant?: CtaVariant;
  title: LocalizedString;
  text?: LocalizedString;
  image?: string;
  imageAlt?: string;
  /** Mini-features shown in a row under the copy (CTA[features] §3.5/§3.6/§3.7). */
  features?: { icon: React.ReactNode; title: LocalizedString; text?: LocalizedString }[];
  /** Contact rows for the home CTA (§3.1.8 "طرق التواصل الأخرى"). */
  contactRows?: { icon: React.ReactNode; label: string; value: string; href?: string }[];
  primaryHref?: string;
  primaryLabelKey?: string;
  whatsappLabelKey?: string;
  /** WhatsApp button style in the band (home CTA §3.1.8 uses white-on-dark). */
  whatsappVariant?: "navy-pill" | "green-pill" | "white-on-dark";
}

/**
 * CTA band (BUILD_SPEC §2.8). Six variants, all flat — no decorative
 * gradients, no glassmorphism, no glow (reference system wins over no-slop-ui).
 *
 * - split: navy panel, title + text + WhatsApp + optional primary; optional
 *   contactRows column (home §3.1.8).
 * - photo-left: image left, text right.
 * - photo-bg: full-bleed photo + navy overlay.
 * - features: optional image left + title + text + mini-features row +
 *   WhatsApp button (spec CTA[features]).
 * - whatsapp: navy band + WhatsApp button; optional image on the side.
 * - flat: sky band with a white card inside.
 */
export default function CTABand({
  locale,
  variant = "split",
  title,
  text,
  image,
  imageAlt = "",
  features,
  contactRows,
  primaryHref,
  primaryLabelKey = "cta.discoverMore",
  whatsappLabelKey = "cta.whatsappStart",
  whatsappVariant = "green-pill",
}: CtaBandProps) {
  const titleText = t(title, locale);
  const textText = text ? t(text, locale) : "";
  const wa = (
    <WhatsAppButton
      locale={locale}
      message={WA_MESSAGES.general[locale]}
      label={ui(whatsappLabelKey, locale)}
      source="cta"
      variant={variant === "whatsapp" ? "white-on-dark" : whatsappVariant}
    />
  );
  const primary = primaryHref ? (
    <Link
      href={localizedHref(locale, primaryHref)}
      className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-navy px-5 py-2.5 font-bold text-button text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy"
    >
      {ui(primaryLabelKey, locale)}
    </Link>
  ) : null;
  const miniFeatures = features && features.length > 0 ? (
    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
      {features.map((f, i) => (
        <span key={i} className="inline-flex items-center gap-2 text-sm font-bold">
          <span className="flex size-8 items-center justify-center rounded-full bg-sky text-primary-hover">{f.icon}</span>
          {t(f.title, locale)}
        </span>
      ))}
    </div>
  ) : null;

  if (variant === "photo-bg" && image) {
    return (
      <section className="relative overflow-hidden">
        <img src={webp(image)} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="wrap relative py-20 text-center text-white md:py-24">
          <h2 className="text-h2 mx-auto max-w-3xl font-semibold">{titleText}</h2>
          {textText && <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-inverse-muted">{textText}</p>}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {wa}
            {primary}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "whatsapp") {
    return (
      <section className="bg-navy text-white">
        <div className="wrap flex flex-col items-center gap-8 py-14 md:flex-row md:justify-between">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            {image && (
              <img src={webp(image)} alt={imageAlt} className="h-32 w-48 rounded-image object-cover" loading="lazy" />
            )}
            <div>
              <h2 className="text-h2 font-semibold">{titleText}</h2>
              {textText && <p className="mt-3 max-w-2xl text-body-lg text-text-inverse-muted">{textText}</p>}
              {miniFeatures}
            </div>
          </div>
          <div className="shrink-0">{wa}</div>
        </div>
      </section>
    );
  }

  if (variant === "photo-left" && image) {
    return (
      <section className="section-sm">
        <div className="wrap">
          <div className="grid items-center gap-8 overflow-hidden rounded-card bg-surface shadow-card md:grid-cols-2">
            <img src={webp(image)} alt={imageAlt} className="h-full min-h-64 w-full object-cover" loading="lazy" />
            <div className="p-8 md:p-10">
              <h2 className="text-h2 font-semibold text-navy">{titleText}</h2>
              {textText && <p className="mt-4 text-body text-text-muted">{textText}</p>}
              {miniFeatures}
              <div className="mt-6 flex flex-wrap gap-3">
                {wa}
                {primary}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "features") {
    return (
      <section className="section-sm">
        <div className="wrap">
          <div className="grid items-center gap-8 overflow-hidden rounded-card bg-surface shadow-card md:grid-cols-2">
            {image && (
              <img src={webp(image)} alt={imageAlt} className="h-full min-h-64 w-full object-cover" loading="lazy" />
            )}
            <div className={`p-8 md:p-10 ${image ? "" : "md:col-span-2"}`}>
              <h2 className="text-h2 font-semibold text-navy">{titleText}</h2>
              {textText && <p className="mt-4 text-body text-text-muted">{textText}</p>}
              {miniFeatures}
              <div className="mt-6 flex flex-wrap gap-3">
                {wa}
                {primary}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // "split" (default) and "flat"
  return (
    <section className={`section-sm ${variant === "flat" ? "bg-sky" : ""}`}>
      <div className="wrap">
        <div className={`flex flex-col items-start justify-between gap-6 rounded-card p-8 md:flex-row md:items-center md:p-10 ${variant === "flat" ? "bg-surface shadow-card" : "bg-navy text-white"}`}>
          <div>
            <h2 className={`text-h2 font-semibold ${variant === "flat" ? "text-navy" : "text-white"}`}>{titleText}</h2>
            {textText && <p className={`mt-3 max-w-2xl text-body-lg ${variant === "flat" ? "text-text-muted" : "text-text-inverse-muted"}`}>{textText}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              {variant === "flat" ? (
                <>
                  <WhatsAppButton locale={locale} message={WA_MESSAGES.general[locale]} label={ui(whatsappLabelKey, locale)} source="cta" variant="green-pill" />
                  {primary}
                </>
              ) : (
                <>
                  <WhatsAppButton locale={locale} message={WA_MESSAGES.general[locale]} label={ui(whatsappLabelKey, locale)} source="cta" variant={whatsappVariant} />
                  {primary}
                </>
              )}
            </div>
          </div>
          {contactRows && contactRows.length > 0 && (
            <div className="w-full shrink-0 border-t border-white/20 pt-6 md:w-auto md:border-s md:border-t-0 md:ps-8 md:pt-0">
              <h3 className="text-h4 font-semibold text-white">{ui("footer.otherWays", locale)}</h3>
              <ul className="mt-4 space-y-3">
                {contactRows.map((r, i) => (
                  <li key={i} className="flex items-center gap-3 text-body-sm text-text-inverse-muted">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">{r.icon}</span>
                    {r.href ? (
                      <a href={r.href} className="transition-colors hover:text-white" dir="ltr">
                        {r.value}
                      </a>
                    ) : (
                      <span>{r.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
