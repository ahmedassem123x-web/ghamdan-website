import Link from "next/link";
import { webp } from "@/lib/images";
import { ArrowIcon, categoryIcon } from "@/components/icons";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import type { Category, Locale, SolutionArea } from "@/data";

/**
 * Re-exported from the shared icon library so every existing call site
 * (`@/components/Cards`, `./Cards`, MegaMenu, CatalogueClient, pages)
 * keeps working unchanged. Same signature: `categoryIcon(name: string)`.
 */
export { categoryIcon };

/** Dual-color hover strip (blue → red, echoing the logo ring). */
function HoverStrip() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary-hover to-brand-red opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    />
  );
}

/** Solution card (§2.11): icon + pill + title + text + link. Only "pumping" has a full detail page; the others render their approved summary. */
export function SolutionCard({ locale, solution }: { locale: Locale; solution: SolutionArea }) {
  return (
    <article className="card-luxe shine group relative flex flex-col overflow-hidden bg-surface p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1">
      <HoverStrip />
      <div className="flex items-center justify-between">
        <div data-draw-group className="flex size-14 items-center justify-center rounded-2xl bg-sky text-primary-hover transition-colors duration-300 group-hover:bg-primary-hover group-hover:text-white [&_svg]:size-7">
          {categoryIcon(solution.icon)}
        </div>
        <span className="rounded-full bg-sky px-3 py-1 text-xs font-bold text-navy">{t(solution.pill, locale)}</span>
      </div>
      <h3 className="mt-4 text-h4 font-semibold leading-snug text-navy"
        ><Link href={localizedHref(locale, `/solutions/${solution.id}`)} className="transition-colors hover:text-primary-hover">
          {t(solution.title, locale)}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-body-sm text-text-muted">{t(solution.text, locale)}</p>
      <Link href={localizedHref(locale, `/solutions/${solution.id}`)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover">
        {ui("cta.discoverMore", locale)}
        <ArrowIcon className="size-4 transition-transform duration-200 group-hover:-translate-x-1 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
      </Link>
    </article>
  );
}

/** Horizontal solution card (§3.1.5): image ~40% + text on a surface-muted panel, blue text-link. */
export function SolutionCardHorizontal({
  locale,
  title,
  text,
  image,
  imageAlt,
  href,
}: {
  locale: Locale;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  href: string;
}) {
  return (
    <article className="card-luxe shine group relative grid grid-cols-[40%_1fr] overflow-hidden bg-surface transition-[transform,box-shadow] duration-300 hover:-translate-y-1">
      <HoverStrip />
      <Link href={href} className="block overflow-hidden" aria-label={title}>
        <img
          src={webp(image)}
          alt={imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-col p-5 md:p-6">
        <h3 className="text-h4 font-semibold leading-snug text-navy"
          ><Link href={href} className="transition-colors hover:text-primary-hover">
            {title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-body-sm text-text-muted">{text}</p>
        <Link href={href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover">
          {ui("cta.discoverMore", locale)}
          <ArrowIcon className="size-4 transition-transform duration-200 group-hover:-translate-x-1 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
