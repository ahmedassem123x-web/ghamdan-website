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

/** Category card (§2.11): icon circle + name + note + product count. */
export function CategoryCard({ locale, category }: { locale: Locale; category: Category }) {
  return (
    <Link
      href={localizedHref(locale, `/products/category/${category.id}`)}
      className="group flex flex-col rounded-card bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
        {categoryIcon(category.icon)}
      </div>
      <h3 className="mt-4 text-h4 font-extrabold text-primary">{t(category.name, locale)}</h3>
      {category.note && <p className="mt-2 flex-1 text-body-sm text-text-muted">{t(category.note, locale)}</p>}
      <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-accent">
        {ui("cta.viewCategory", locale)}
        <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
      </p>
    </Link>
  );
}

/** Solution card (§2.11): icon + pill + title + text + link. Only "pumping" has a full detail page; the others render their approved summary. */
export function SolutionCard({ locale, solution }: { locale: Locale; solution: SolutionArea }) {
  return (
    <article className="group flex flex-col rounded-card bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
          {categoryIcon(solution.icon)}
        </div>
        <span className="rounded-full bg-surface-blue px-3 py-1 text-xs font-bold text-primary">{t(solution.pill, locale)}</span>
      </div>
      <h3 className="mt-4 text-h4 font-extrabold leading-snug text-primary">
        <Link href={localizedHref(locale, `/solutions/${solution.id}`)} className="transition-colors hover:text-accent">
          {t(solution.title, locale)}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-body-sm text-text-muted">{t(solution.text, locale)}</p>
      <Link href={localizedHref(locale, `/solutions/${solution.id}`)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-accent transition-colors hover:text-accent-strong">
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
        <h3 className="text-h4 font-extrabold leading-snug text-primary">
          <Link href={href} className="transition-colors hover:text-accent">
            {title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-body-sm text-text-muted">{text}</p>
        <Link href={href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-accent transition-colors hover:text-accent-strong">
          {ui("cta.discoverMore", locale)}
          <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

/** Image-tile category card (§3.4.3): square product visual + label. */
export function CategoryTile({ locale, category, image }: { locale: Locale; category: Category; image: string }) {
  return (
    <Link
      href={localizedHref(locale, `/products/category/${category.id}`)}
      className="group block shrink-0 snap-start overflow-hidden rounded-card border border-border bg-surface transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="aspect-square overflow-hidden bg-surface-muted">
        <img
          src={webp(image)}
          alt={t(category.name, locale)}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className="p-3 text-center text-sm font-bold leading-snug text-primary">{t(category.name, locale)}</p>
    </Link>
  );
}
export function ProjectCard({
  locale,
  project,
}: {
  locale: Locale;
  project: { slug: string; title: { ar: string; en?: string; zh?: string }; location?: string; image?: string };
}) {
  return (
    <article className="group overflow-hidden rounded-card bg-surface shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={localizedHref(locale, `/projects/${project.slug}`)} className="block" aria-label={t(project.title, locale)}>
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
          {project.image ? (
            <img src={webp(project.image)} alt={t(project.title, locale)} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-blue">
              <span className="font-latin text-4xl font-extrabold text-sky" dir="ltr">G</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-h4 font-extrabold text-primary">{t(project.title, locale)}</h3>
          {project.location && <p className="mt-1 text-body-sm text-text-muted">{project.location}</p>}
        </div>
      </Link>
    </article>
  );
}
