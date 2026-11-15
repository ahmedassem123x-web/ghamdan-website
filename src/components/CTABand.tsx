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
 * CTA band (BUILD_SPEC §2.8, Variant A "Navy Editorial" redesign).
 * Dark variants: layered `.bg-mesh-navy` + grain + soft glows, white
 * headline, `.section-marker` dual-color bar, WhatsApp as `.btn-white`
 * (or `.btn-whatsapp` per variant). Light variants: white luxe card on
 * a light mesh, navy headline + marker. Six variants:
 *
 * - split: navy mesh panel, title + text + WhatsApp + optional primary;
 *   optional contactRows column (home §3.1.8).
 * - photo-left: image left, text right.
 * - photo-bg: full-bleed photo + lightened navy scrim (was 70%).
 * - features: optional image left + title + text + mini-features row +
 *   WhatsApp button (spec CTA[features]).
 * - whatsapp: navy mesh band + WhatsApp button; optional image on the side.
 * - flat: light mesh band with a white luxe card inside.
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
  const primaryDark = primaryHref ? (
    <Link href={localizedHref(locale, primaryHref)} className="btn btn-white">
      {ui(primaryLabelKey, locale)}
    </Link>
  ) : null;
  const primaryLight = primaryHref ? (
    <Link href={localizedHref(locale, primaryHref)} className="btn btn-navy">
      {ui(primaryLabelKey, locale)}
    </Link>
  ) : null;
  const miniFeatures = features && features.length > 0 ? (
    <div data-stagger className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
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
      <section data-reveal data-clip className="relative overflow-hidden">
        <img src={webp(image)} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-navy/55" aria-hidden="true" />
        <div className="wrap relative py-20 text-center text-white md:py-24">
          <span className="section-marker mx-auto" aria-hidden="true" />
          <h2 className="text-h2 mx-auto mt-5 max-w-3xl font-semibold">{titleText}</h2>
          {textText && <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-inverse-muted">{textText}</p>}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {wa}
            {primaryDark}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "whatsapp") {
    return (
      <section data-reveal data-clip className="bg-mesh-navy relative overflow-hidden text-white">
        <span className="grain" aria-hidden="true" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 end-[10%] size-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="wrap relative flex flex-col items-center gap-8 py-14 md:flex-row md:justify-between">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            {image && (
              <img src={webp(image)} alt={imageAlt} className="h-32 w-48 rounded-image object-cover shadow-card" loading="lazy" />
            )}
            <div>
              <span className="section-marker" aria-hidden="true" />
              <h2 className="text-h2 mt-5 font-semibold">{titleText}</h2>
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
      <section data-reveal className="section-sm bg-mesh-light">
        <div className="wrap">
          <div className="card-luxe shine group relative grid items-center gap-8 overflow-hidden bg-surface md:grid-cols-2">
            <div className="overflow-hidden">
              <img src={webp(image)} alt={imageAlt} className="h-full min-h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            </div>
            <div className="p-8 md:p-10">
              <span className="section-marker" aria-hidden="true" />
              <h2 className="text-h2 mt-5 font-semibold text-navy">{titleText}</h2>
              {textText && <p className="mt-4 text-body text-text-muted">{textText}</p>}
              {miniFeatures}
              <div className="mt-6 flex flex-wrap gap-3">
                {wa}
                {primaryLight}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "features") {
    return (
      <section data-reveal className="section-sm bg-mesh-light">
        <div className="wrap">
          <div className="card-luxe shine group relative grid items-center gap-8 overflow-hidden bg-surface md:grid-cols-2">
            {image && (
              <div className="overflow-hidden">
                <img src={webp(image)} alt={imageAlt} className="h-full min-h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              </div>
            )}
            <div className={`p-8 md:p-10 ${image ? "" : "md:col-span-2"}`}>
              <span className="section-marker" aria-hidden="true" />
              <h2 className="text-h2 mt-5 font-semibold text-navy">{titleText}</h2>
              {textText && <p className="mt-4 text-body text-text-muted">{textText}</p>}
              {miniFeatures}
              <div className="mt-6 flex flex-wrap gap-3">
                {wa}
                {primaryLight}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // "split" (default) and "flat"
  if (variant === "flat") {
    return (
      <section data-reveal className="section-sm bg-mesh-light">
        <div className="wrap">
          <div className="card-luxe shine relative flex flex-col items-start justify-between gap-6 bg-surface p-8 md:flex-row md:items-center md:p-10">
            <div>
              <span className="section-marker" aria-hidden="true" />
              <h2 className="text-h2 mt-5 font-semibold text-navy">{titleText}</h2>
              {textText && <p className="mt-3 max-w-2xl text-body-lg text-text-muted">{textText}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                <WhatsAppButton locale={locale} message={WA_MESSAGES.general[locale]} label={ui(whatsappLabelKey, locale)} source="cta" variant="green-pill" />
                {primaryLight}
              </div>
            </div>
            {contactRows && contactRows.length > 0 && (
              <div className="w-full shrink-0 border-t border-border pt-6 md:w-auto md:border-s md:border-t-0 md:ps-8 md:pt-0">
                <h3 className="text-h4 font-semibold text-navy">{ui("footer.otherWays", locale)}</h3>
                <ul data-stagger className="mt-4 space-y-3">
                  {contactRows.map((r, i) => (
                    <li key={i} className="flex items-center gap-3 text-body-sm text-text-secondary">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky text-primary-hover">{r.icon}</span>
                      {r.href ? (
                        <a href={r.href} className="transition-colors hover:text-primary-hover" dir="ltr">
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

  // "split" (default): navy mesh panel.
  return (
    <section data-reveal data-clip className="section-sm">
      <div className="wrap">
        <div className="bg-mesh-navy relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-card p-8 text-white shadow-card-hover md:flex-row md:items-center md:p-10">
          <span className="grain" aria-hidden="true" />
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 end-[15%] size-64 rounded-full bg-primary/25 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 start-[30%] size-56 rounded-full bg-brand-red/20 blur-3xl" />
          <div className="relative">
            <span className="section-marker" aria-hidden="true" />
            <h2 className="text-h2 mt-5 font-semibold text-white">{titleText}</h2>
            {textText && <p className="mt-3 max-w-2xl text-body-lg text-text-inverse-muted">{textText}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppButton locale={locale} message={WA_MESSAGES.general[locale]} label={ui(whatsappLabelKey, locale)} source="cta" variant={whatsappVariant} />
              {primaryDark}
            </div>
          </div>
          {contactRows && contactRows.length > 0 && (
            <div className="relative w-full shrink-0 border-t border-white/20 pt-6 md:w-auto md:border-s md:border-t-0 md:ps-8 md:pt-0">
              <h3 className="text-h4 font-semibold text-white">{ui("footer.otherWays", locale)}</h3>
              <ul data-stagger className="mt-4 space-y-3">
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
