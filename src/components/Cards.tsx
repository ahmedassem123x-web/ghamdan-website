import Link from "next/link";
import { webp } from "@/lib/images";
import { ArrowLeft, Zap, Battery, Sun, Droplet, Sliders, Package, Database, Camera, Leaf, Home, Users, Settings, Wrench, Headset, AlertTriangle, Gauge } from "lucide-react";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import type { Category, Locale, SolutionArea } from "@/data";

const ICONS: Record<string, React.ReactNode> = {
  zap: <Zap className="size-7" aria-hidden="true" />,
  battery: <Battery className="size-7" aria-hidden="true" />,
  sun: <Sun className="size-7" aria-hidden="true" />,
  droplet: <Droplet className="size-7" aria-hidden="true" />,
  sliders: <Sliders className="size-7" aria-hidden="true" />,
  package: <Package className="size-7" aria-hidden="true" />,
  database: <Database className="size-7" aria-hidden="true" />,
  camera: <Camera className="size-7" aria-hidden="true" />,
  leaf: <Leaf className="size-7" aria-hidden="true" />,
  home: <Home className="size-7" aria-hidden="true" />,
  users: <Users className="size-7" aria-hidden="true" />,
  settings: <Settings className="size-7" aria-hidden="true" />,
  wrench: <Wrench className="size-7" aria-hidden="true" />,
  headset: <Headset className="size-7" aria-hidden="true" />,
  alert: <AlertTriangle className="size-7" aria-hidden="true" />,
  gauge: <Gauge className="size-7" aria-hidden="true" />,
};

export function categoryIcon(name: string): React.ReactNode {
  return ICONS[name] ?? ICONS.package;
}

/** Solution card (§2.11): icon + pill + title + text + link. Only "pumping" has a full detail page; the others render their approved summary. */
export function SolutionCard({ locale, solution }: { locale: Locale; solution: SolutionArea }) {
  return (
    <article className="group flex flex-col rounded-card bg-surface p-6 shadow-card transition-[transform,box-shadow,background-color,color] duration-200 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <div className="flex size-14 items-center justify-center rounded-full bg-sky text-primary-hover transition-colors group-hover:bg-primary-hover group-hover:text-white">
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
        <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
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
    <article className="group grid grid-cols-[40%_1fr] overflow-hidden rounded-card bg-surface-muted transition-shadow duration-200 hover:shadow-card-hover">
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
          <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
