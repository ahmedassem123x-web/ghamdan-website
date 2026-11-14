import type { ReactNode } from "react";
import { webp } from "@/lib/images";
import Link from "next/link";
import { Info, Search } from "lucide-react";
import type { Locale, LocalizedString } from "@/data";
import { t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";

/** Reveal wrapper: visible without JS, animated when MotionProvider runs. */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

/** Section heading (§2.11): eyebrow pill + H2 + optional lead. */
export function SectionHeading({
  locale,
  eyebrow,
  title,
  lead,
  align = "start",
}: {
  locale: Locale;
  eyebrow?: LocalizedString;
  title: LocalizedString;
  lead?: LocalizedString;
  align?: "start" | "center";
}) {
  return (
    <div className={`reveal ${align === "center" ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-1.5 text-sm font-bold text-accent">
          {t(eyebrow, locale)}
        </p>
      )}
      <h2 className="text-h2 font-extrabold text-primary">{t(title, locale)}</h2>
      {lead && <p className={`mt-3 max-w-2xl text-body text-text-muted ${align === "center" ? "mx-auto" : ""}`}>{t(lead, locale)}</p>}
    </div>
  );
}

/** Section heading with explicit locale (use when the caller already localised). */
export function SectionHeadingL({
  locale,
  eyebrow,
  title,
  lead,
  align = "start",
}: {
  locale: Locale;
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "start" | "center";
}) {
  return (
    <div className={`reveal ${align === "center" ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-1.5 text-sm font-bold text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-h2 font-extrabold text-primary">{title}</h2>
      {lead && <p className={`mt-3 max-w-2xl text-body text-text-muted ${align === "center" ? "mx-auto" : ""}`}>{lead}</p>}
    </div>
  );
}

/** Breadcrumbs (§2.11). */
export function Breadcrumbs({ locale, items }: { locale: Locale; items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="wrap pt-5">
      <ol className="flex flex-wrap items-center gap-2 text-caption text-text-muted">
        {items.map((c, i) => (
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
  );
}

/** Honest empty state (§2.11): icon + title + copy + WhatsApp CTA slot. */
export function EmptyState({
  title,
  copy,
  children,
}: {
  title: string;
  copy: string;
  children?: ReactNode;
}) {
  return (
    <div className="reveal rounded-card border border-dashed border-border-strong bg-surface p-10 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Info className="size-8" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-h3 font-extrabold text-primary">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-body text-text-muted">{copy}</p>
      {children && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{children}</div>}
    </div>
  );
}

/** ZH review-pending notice (CI-09): shown when the page falls back to Arabic. */
export function ZhNotice({ locale }: { locale: Locale }) {
  if (locale !== "zh") return null;
  return (
    <div className="border-b border-sky bg-sky-light">
      <div className="wrap flex items-center gap-2 py-2.5 text-caption font-bold text-primary">
        <Info className="size-4 shrink-0" aria-hidden="true" />
        <span>{ui("notice.zh", locale)}</span>
      </div>
    </div>
  );
}

/** Icon + title + text feature block (§2.11). */
export function IconFeature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text?: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">{icon}</div>
      <div>
        <h3 className="text-h4 font-extrabold text-primary">{title}</h3>
        {text && <p className="mt-1.5 text-body-sm text-text-muted">{text}</p>}
      </div>
    </div>
  );
}

/** Feature card (§2.11). */
export function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text?: string;
}) {
  return (
    <div className="rounded-card bg-surface p-6 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">{icon}</div>
      <h3 className="mt-4 text-h4 font-extrabold text-primary">{title}</h3>
      {text && <p className="mt-2 text-body-sm text-text-muted">{text}</p>}
    </div>
  );
}

/** Spec table (§2.11): renders only rows that exist — never "—" placeholders. */
export function SpecTable({ rows }: { rows: { label: string; value: string }[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <table className="w-full text-body-sm">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-surface-muted" : "bg-surface"}>
              <th scope="row" className="w-2/5 px-5 py-3 text-start font-bold text-primary">
                {r.label}
              </th>
              <td className="px-5 py-3 text-text-muted">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Pagination (§2.11): prev/next + numbered pages. */
export function Pagination({
  page,
  totalPages,
  hrefFor,
  locale,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  locale: Locale;
}) {
  if (totalPages <= 1) return null;
  const nums = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} className="rounded-[0.625rem] border border-border bg-surface px-4 py-2 text-sm font-bold text-primary transition-colors hover:border-accent hover:text-accent">
          {locale === "ar" ? "→" : "←"}
        </Link>
      )}
      {nums.map((n) => (
        <Link
          key={n}
          href={hrefFor(n)}
          aria-current={n === page ? "page" : undefined}
          className={`inline-flex size-10 items-center justify-center rounded-[0.625rem] text-sm font-bold transition-colors ${
            n === page ? "bg-primary text-white" : "border border-border bg-surface text-primary hover:border-accent hover:text-accent"
          }`}
        >
          {n}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={hrefFor(page + 1)} className="rounded-[0.625rem] border border-border bg-surface px-4 py-2 text-sm font-bold text-primary transition-colors hover:border-accent hover:text-accent">
          {locale === "ar" ? "←" : "→"}
        </Link>
      )}
    </nav>
  );
}

/** Search input (§2.11). */
export function SearchInput({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <label className="relative block w-full">
      <span className="sr-only">{label}</span>
      <Search className="pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 text-text-faint start-4" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[0.625rem] border border-border bg-surface py-3 pe-4 ps-12 text-body text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
      />
    </label>
  );
}

/** Sort select (§2.11). */
export function SortSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-bold text-text-muted">
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[0.625rem] border border-border bg-surface px-3 py-2.5 text-body-sm font-bold text-primary focus:border-accent focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Result meta line: "Showing X of Y products". */
export function ResultMeta({ shown, total, label }: { shown: number; total: number; label: string }) {
  return (
    <p className="text-body-sm text-text-muted" aria-live="polite">
      {label}: {shown} / {total}
    </p>
  );
}

/** Editorial block (§2.11): image + text, alternating. */
export function EditorialBlock({
  image,
  imageAlt,
  title,
  text,
  flip = false,
  eyebrow,
  children,
}: {
  image: string;
  imageAlt: string;
  title: string;
  text?: string;
  flip?: boolean;
  eyebrow?: ReactNode;
  children?: ReactNode;
}) {
  const img = <img src={webp(image)} alt={imageAlt} className="h-full min-h-72 w-full rounded-image object-cover shadow-card" loading="lazy" />;
  const copy = (
    <div>
      {eyebrow && <div className="mb-4">{eyebrow}</div>}
      <h3 className="text-h2 font-extrabold text-primary">{title}</h3>
      {text && <p className="mt-4 text-body text-text-muted">{text}</p>}
      {children}
    </div>
  );
  return (
    <div className="grid items-center gap-10 md:grid-cols-2">
      {flip ? (
        <>
          {copy}
          {img}
        </>
      ) : (
        <>
          {img}
          {copy}
        </>
      )}
    </div>
  );
}
