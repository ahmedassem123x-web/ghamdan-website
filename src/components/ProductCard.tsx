import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import { webp } from "@/lib/images";
import type { Locale, Product } from "@/data";

/** Identity spec labels — excluded from the card's "up to 3 confirmed specs" (§3.4.4). */
const IDENTITY_LABELS = new Set(["العلامة التجارية", "الموديل", "الفئة", "القسم الفرعي"]);

/**
 * Canonical ProductCard (§3.4.4): image → name → brand (never translated) →
 * model → ONE benefit line → up to 3 confirmed specs → TWO actions
 * («التفاصيل» + WhatsApp «استفسر الآن», outlined blue on grids).
 * No price field, no price metadata. No availability line unless confirmed
 * per CI-13 (currently omitted for all products).
 */
export default function ProductCard({ locale, product }: { locale: Locale; product: Product }) {
  const name = t(product.name, locale);
  const model = product.model ?? "";
  const img = product.image ?? "";
  const illustrative = !product.image;
  const benefit = product.benefits?.[0] ? t(product.benefits[0], locale) : "";
  const cardSpecs = product.specs
    .filter((s) => !IDENTITY_LABELS.has(s.label.ar))
    .slice(0, 3);
  const siteUrl = `https://ghamdan-website.vercel.app/${locale}/products/${product.slug}`;
  const waMsg = WA_MESSAGES.product(name, model, siteUrl)[locale];

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={localizedHref(locale, `/products/${product.slug}`)} className="block" aria-label={name}>
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
          {img ? (
            <img
              src={webp(img)}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-blue">
              <span className="font-latin text-4xl font-extrabold text-sky" dir="ltr">
                {product.brand?.slice(0, 2).toUpperCase() ?? "G"}
              </span>
            </div>
          )}
          {illustrative && (
            <span className="absolute bottom-3 start-3 rounded-full bg-primary-deep/70 px-3 py-1 text-[0.6875rem] font-bold text-white">
              {ui("catalog.illustrative", locale)}
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-h4 font-extrabold leading-snug text-primary">
          <Link href={localizedHref(locale, `/products/${product.slug}`)} className="transition-colors hover:text-accent">
            {name}
          </Link>
        </h3>
        <p className="mt-1 text-body-sm font-bold text-text-muted">
          <span dir="ltr">{product.brand}</span>
          {model && (
            <>
              {" — "}
              <span dir="ltr">{model}</span>
            </>
          )}
        </p>
        {benefit && <p className="mt-2 text-body-sm text-text-muted">{benefit}</p>}
        {cardSpecs.length > 0 && (
          <ul className="mt-3 space-y-1 border-t border-border pt-3">
            {cardSpecs.map((s, i) => (
              <li key={i} className="flex items-baseline justify-between gap-3 text-caption">
                <span className="font-bold text-primary">{t(s.label, locale)}</span>
                <span className="text-text-muted">{s.value}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Link
            href={localizedHref(locale, `/products/${product.slug}`)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-accent transition-colors hover:text-accent-strong"
          >
            {ui("cta.details", locale)}
            <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
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
