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
export default function ProductCard({ locale, product, highlight }: { locale: Locale; product: Product; highlight?: string }) {
  const name = t(product.name, locale);
  const model = typeof product.model === "string" ? (product.model ?? "") : t(product.model, locale);
  const img = product.image ?? "";
  const illustrative = !product.image;
  const benefit = product.benefits?.[0] ? t(product.benefits[0], locale) : "";
  const cardSpecs = product.specs
    .filter((s) => !IDENTITY_LABELS.has(s.label.ar))
    .slice(0, 3);
  const siteUrl = `https://ghamdan-website.vercel.app/${locale}/products/${product.slug}`;
  const waMsg = WA_MESSAGES.product(name, model, siteUrl)[locale];
  const variant = imgVariant(product.id);

  return (
    <article className="card-luxe shine group relative flex flex-col overflow-hidden bg-surface transition-[transform,box-shadow] duration-300 hover:-translate-y-1">
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-primary via-primary-hover to-brand-red opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <Link href={localizedHref(locale, `/products/${product.slug}`)} className="block" aria-label={name}>
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
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
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-balance text-h4 font-semibold leading-snug text-navy">
          <Link href={localizedHref(locale, `/products/${product.slug}`)} className="transition-colors hover:text-primary-hover">
            <CardTitle name={name} highlight={highlight} />
          </Link>
        </h3>
        {benefit && <p className="mt-2 text-body-sm text-text-muted">{benefit}</p>}
        {cardSpecs.length > 0 && (
          <ul className="mt-3 min-h-[3.75rem] space-y-1 border-t border-border pt-3">
            {cardSpecs.map((s, i) => (
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
