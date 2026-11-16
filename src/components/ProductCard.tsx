import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import WhatsAppButton from "./WhatsAppButton";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import { webp } from "@/lib/images";
import type { Locale, Product } from "@/data";

/** Identity spec labels — excluded from the card's "up to 3 confirmed specs" (§3.4.4). */
const IDENTITY_LABELS = new Set(["العلامة التجارية", "الموديل", "الفئة", "القسم الفرعي"]);

/**
 * HighlightWords — word-level match highlighting for search results.
 * Only WHOLE words containing the query are wrapped in <mark>: splitting
 * inside a word would break Arabic letter joining, so intra-word matches
 * are highlighted at word granularity instead. Safe by construction
 * (no HTML parsing, no regex on user text).
 */
export function HighlightWords({ text, query }: { text: string; query?: string }) {
  if (!query || query.trim().length < 2) return <>{text}</>;
  const q = query.trim().toLowerCase();
  return (
    <>
      {text.split(/(\s+)/).map((w, i) =>
        w.trim() !== "" && w.toLowerCase().includes(q) ? (
          <mark key={i} className="search-mark">
            {w}
          </mark>
        ) : (
          <span key={i}>{w}</span>
        ),
      )}
    </>
  );
}

/**
 * CardTitle — renders the product name with the last two tokens kept
 * together (no orphaned unit: "— 5kW" never splits across lines) and
 * balanced wrapping. Highlight mode keeps the search highlighter.
 */
function CardTitle({ name, highlight }: { name: string; highlight?: string }) {
  if (highlight) return <HighlightWords text={name} query={highlight} />;
  const parts = name.split(" ");
  if (parts.length < 2) return <>{name}</>;
  const head = parts.slice(0, -2).join(" ");
  const tail = parts.slice(-2).join(" ");
  return (
    <>
      {head ? `${head} ` : ""}
      <span className="whitespace-nowrap">{tail}</span>
    </>
  );
}

/** Per-product image variation (polish item 5): only 4 stand-in photos
 * serve 37 products, so each card varies the crop (object-position) and
 * a light brand tint from the same photo — no invented images. */
const IMG_POSITIONS = ["50% 50%", "50% 0%", "50% 100%", "50% 30%"];
const IMG_TINTS = ["", "bg-primary/10", "bg-brand-red/10", "bg-navy/10"];
function imgVariant(id: string) {
  return [...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 4;
}
/** Top confirmed specs for a card / quick view (identity labels excluded, §3.4.4). */
export function topSpecs(product: Product) {
  return product.specs.filter((s) => !IDENTITY_LABELS.has(s.label.ar)).slice(0, 3);
}

export default function ProductCard({
  locale,
  product,
  highlight,
  onQuickView,
  layout = "grid",
}: {
  locale: Locale;
  product: Product;
  highlight?: string;
  /** Phase 3: opens the QuickView modal; when absent no button renders. */
  onQuickView?: (product: Product) => void;
  /** Phase 3 catalogue toggle: "list" renders a horizontal row card. */
  layout?: "grid" | "list";
}) {
  const name = t(product.name, locale);
  const model = typeof product.model === "string" ? (product.model ?? "") : t(product.model, locale);
  const img = product.image ?? "";
  const illustrative = !product.image;
  const benefit = product.benefits?.[0] ? t(product.benefits[0], locale) : "";
  const cardSpecs = topSpecs(product);
  const extraSpecs = cardSpecs.slice(1);
  const siteUrl = `https://ghamdan-website.vercel.app/${locale}/products/${product.slug}`;
  const waMsg = WA_MESSAGES.product(name, model, siteUrl)[locale];
  const variant = imgVariant(product.id);

  return (
    <article
      className={`card-luxe shine group relative flex h-full flex-col overflow-hidden bg-surface transition-[transform,box-shadow] duration-300 hover:-translate-y-1 ${
        layout === "list" ? "sm:flex-row" : ""
      }`}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-primary via-primary-hover to-brand-red opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div
        className={`relative overflow-hidden bg-surface-muted ${
          layout === "list" ? "aspect-[4/3] sm:aspect-auto sm:w-60 sm:shrink-0" : "aspect-[4/3]"
        }`}
      >
        <Link href={localizedHref(locale, `/products/${product.slug}`)} className="block h-full" aria-label={name}>
          <div className="relative h-full w-full">
          {img ? (
            <img
              src={webp(img)}
              alt={name}
              loading="lazy"
              style={{ viewTransitionName: `product-${product.id}`, objectPosition: IMG_POSITIONS[variant] }}
              className="vt-product-img h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-muted">
              <span className="font-latin text-4xl font-extrabold text-primary" dir="ltr">
                {product.brand?.slice(0, 2).toUpperCase() ?? "G"}
              </span>
            </div>
          )}
          {/* Per-product tint: same photo, different grade per card. */}
          {img && IMG_TINTS[variant] && (
            <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${IMG_TINTS[variant]}`} />
          )}
          {/* Brand badge: navy text on sky, top-start of the image. */}
          {product.brand && (
            <span className="absolute top-3 start-3 rounded-full bg-sky px-3 py-1 text-xs font-bold text-navy shadow-card" dir="ltr">
              {product.brand}
            </span>
          )}
          {illustrative && (
            <span className="absolute bottom-3 start-3 rounded-full bg-navy/70 px-3 py-1 text-[0.6875rem] font-bold text-white">
              {ui("catalog.illustrative", locale)}
            </span>
          )}
          </div>
        </Link>
        {/* Card Reveal on Hover (Phase 3 §4): specs 2–3 slide up over the
            image on hover/focus-within (transform + opacity only, 300ms).
            The first spec stays visible in the list below, so essential
            info is never hover-only; touch/keyboard users reach the full
            specs on the product page. pointer-events-none keeps the image
            link clickable under the overlay. */}
        {extraSpecs.length > 0 && (
          <div className="pointer-events-none invisible absolute inset-x-0 bottom-0 translate-y-full bg-navy/90 px-4 py-3 opacity-0 backdrop-blur-sm transition-[transform,opacity,visibility] duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <ul className="space-y-1">
              {extraSpecs.map((s, i) => (
                <li key={i} className="flex items-baseline justify-between gap-3 text-caption">
                  <span className="font-bold text-white">{t(s.label, locale)}</span>
                  <span className="text-white/80">{typeof s.value === "string" ? s.value : t(s.value, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-balance text-h4 font-semibold leading-snug text-navy">
          <Link href={localizedHref(locale, `/products/${product.slug}`)} className="transition-colors hover:text-primary-hover">
            <CardTitle name={name} highlight={highlight} />
          </Link>
        </h3>
        {benefit && <p className="mt-2 text-body-sm text-text-muted">{benefit}</p>}
        {cardSpecs.length > 0 && (
          <ul className="mt-3 min-h-[1.25rem] space-y-1 border-t border-border pt-3">
            {cardSpecs.slice(0, 1).map((s, i) => (
              <li key={i} className="flex items-baseline justify-between gap-3 text-caption">
                <span className="font-bold text-navy">{t(s.label, locale)}</span>
                <span className="text-text-muted">{typeof s.value === "string" ? s.value : t(s.value, locale)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Link
            href={localizedHref(locale, `/products/${product.slug}`)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover"
          >
            {ui("cta.details", locale)}
            <ArrowIcon className="size-4 transition-transform duration-200 group-hover:-translate-x-1 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
          </Link>
          <span className="flex-1" />
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm font-bold text-navy transition-colors duration-200 hover:border-primary-hover hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-primary-hover"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {locale === "ar" ? "عرض سريع" : locale === "en" ? "Quick view" : "快速查看"}
            </button>
          )}
          <WhatsAppButton
            locale={locale}
            message={waMsg}
            label={ui("cta.enquire", locale)}
            source="product-card"
            sourceId={product.id}
            variant="outlined-blue"
            className="!px-3 !py-2 !text-sm"
          />
        </div>
      </div>
    </article>
  );
}
