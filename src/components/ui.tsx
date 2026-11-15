import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { webp } from "@/lib/images";
import Link from "next/link";
import { AlertCircle, Info, Search } from "lucide-react";
import type { Locale, LocalizedString } from "@/data";
import { t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";

/**
 * Shared primitives (v15 design-system §2, §7). Re-tokenised to the final
 * v15 tokens: headings navy #102B46 semibold (board H2/H3/H4), muted body
 * text #5A6470 (text-secondary), captions/meta #6B7280 (text-muted),
 * interactive blue #0B70C9 for small text (AA 5.03:1) and #0081FB for
 * large text / focus rings / non-text accents. Sky tint is #DDF5FC.
 * Headings are semibold per the boards — not extrabold.
 */

/** Reveal wrapper: visible by default. `data-reveal` is a JS-only hook —
 * MotionProvider applies the GSAP reveal after successful init. No CSS
 * ever hides this element (v15 §10.10). */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div data-reveal className={className}>
      {children}
    </div>
  );
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
    <div data-reveal className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky px-4 py-1.5 text-sm font-semibold text-primary-hover">
          {t(eyebrow, locale)}
        </p>
      )}
      <h2 className="text-h2 font-semibold text-navy">{t(title, locale)}</h2>
      {lead && <p className={`mt-3 max-w-2xl text-body text-text-secondary ${align === "center" ? "mx-auto" : ""}`}>{t(lead, locale)}</p>}
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
    <div data-reveal className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky px-4 py-1.5 text-sm font-semibold text-primary-hover">
          {eyebrow}
        </p>
      )}
      <h2 className="text-h2 font-semibold text-navy">{title}</h2>
      {lead && <p className={`mt-3 max-w-2xl text-body text-text-secondary ${align === "center" ? "mx-auto" : ""}`}>{lead}</p>}
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
              <Link href={c.href} className="transition-colors hover:text-primary-hover">{c.label}</Link>
            ) : (
              <span aria-current="page" className="font-semibold text-navy">{c.label}</span>
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
    <div data-reveal className="rounded-card border border-dashed border-border-strong bg-surface p-10 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-sky text-primary-hover">
        <Info className="size-8" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-h3 font-semibold text-navy">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-body text-text-secondary">{copy}</p>
      {children && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{children}</div>}
    </div>
  );
}

/** ZH review-pending notice (CI-09): shown when the page falls back to Arabic. */
export function ZhNotice({ locale }: { locale: Locale }) {
  if (locale !== "zh") return null;
  return (
    <div className="border-b border-sky bg-sky">
      <div className="wrap flex items-center gap-2 py-2.5 text-caption font-semibold text-navy">
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
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-sky text-primary-hover">{icon}</div>
      <div>
        <h3 className="text-h4 font-semibold text-navy">{title}</h3>
        {text && <p className="mt-1.5 text-body-sm text-text-secondary">{text}</p>}
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
      <div className="flex size-14 items-center justify-center rounded-full bg-sky text-primary-hover">{icon}</div>
      <h3 className="mt-4 text-h4 font-semibold text-navy">{title}</h3>
      {text && <p className="mt-2 text-body-sm text-text-secondary">{text}</p>}
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
              <th scope="row" className="w-2/5 px-5 py-3 text-start font-semibold text-navy">
                {r.label}
              </th>
              <td className="px-5 py-3 text-text-secondary">{r.value}</td>
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
        <Link href={hrefFor(page - 1)} className="rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-primary-hover hover:text-primary-hover">
          {locale === "ar" ? "→" : "←"}
        </Link>
      )}
      {nums.map((n) => (
        <Link
          key={n}
          href={hrefFor(n)}
          aria-current={n === page ? "page" : undefined}
          className={`inline-flex size-10 items-center justify-center rounded-button text-sm font-semibold transition-colors ${
            n === page ? "bg-primary-hover text-white" : "border border-border bg-surface text-navy hover:border-primary-hover hover:text-primary-hover"
          }`}
        >
          {n}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={hrefFor(page + 1)} className="rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-primary-hover hover:text-primary-hover">
          {locale === "ar" ? "←" : "→"}
        </Link>
      )}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Forms (design-system §2) — the only form primitives in the shell.  */
/* White fill, 1.5px #E5E7EB border, 12px radius, 16px text, 48px      */
/* height; label ABOVE the field (the Arabic board shows icon +        */
/* placeholder only — labels are required for accessibility and are    */
/* added, not a board deviation). Focus: #0081FB border + 2px ring.    */
/* Error: #EF4444 border + icon; the message itself stays in           */
/* --color-text (error red fails AA at small sizes). Success: #108981  */
/* border/icon. Submit: full-width navy button (see Button).           */
/* ------------------------------------------------------------------ */

const INPUT_BASE =
  "w-full rounded-button border-[1.5px] border-border bg-surface text-body text-text placeholder:text-text-muted transition-[border-color,box-shadow] duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-text";

/** Field wrapper: label above, hint below, error below with icon. */
export function Field({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-body-sm font-semibold text-navy">
        {label}
        {required && (
          <span className="text-error" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && <p className="mt-2 text-caption text-text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="mt-2 flex items-center gap-1.5 text-caption font-semibold text-text">
          <AlertCircle className="size-4 shrink-0 text-error" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: boolean;
  success?: boolean;
}

/** Text / email / phone input, 48px, optional leading icon. */
export function TextInput({ icon, error, success, className = "", ...rest }: TextInputProps) {
  const stateCls = error
    ? "border-error focus:border-error focus:ring-error/30"
    : success
      ? "border-success focus:border-success focus:ring-success/30"
      : "";
  return (
    <span className="relative block w-full">
      {icon && (
        <span className="pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 text-text-muted start-4 [&_svg]:size-5" aria-hidden="true">
          {icon}
        </span>
      )}
      <input
        aria-invalid={error || undefined}
        className={`${INPUT_BASE} h-12 ${icon ? "ps-12 pe-4" : "px-4"} ${stateCls} ${className}`}
        {...rest}
      />
    </span>
  );
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  success?: boolean;
}

/** Textarea — same tokens as TextInput, min-height 120px. */
export function TextArea({ error, success, className = "", ...rest }: TextAreaProps) {
  const stateCls = error
    ? "border-error focus:border-error focus:ring-error/30"
    : success
      ? "border-success focus:border-success focus:ring-success/30"
      : "";
  return (
    <textarea
      aria-invalid={error || undefined}
      className={`${INPUT_BASE} min-h-[7.5rem] px-4 py-3 ${stateCls} ${className}`}
      {...rest}
    />
  );
}

export interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  success?: boolean;
}

/** Native select — same tokens, 48px. */
export function SelectInput({ error, success, className = "", children, ...rest }: SelectInputProps) {
  const stateCls = error
    ? "border-error focus:border-error focus:ring-error/30"
    : success
      ? "border-success focus:border-success focus:ring-success/30"
      : "";
  return (
    <select
      aria-invalid={error || undefined}
      className={`${INPUT_BASE} h-12 px-4 ${stateCls} ${className}`}
      {...rest}
    >
      {children}
    </select>
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
      <Search className="pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 text-text-muted start-4" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${INPUT_BASE} h-12 pe-4 ps-12`}
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
    <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-button border-[1.5px] border-border bg-surface px-3 text-body-sm font-semibold text-navy transition-[border-color,box-shadow] duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
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
    <p className="text-body-sm text-text-secondary" aria-live="polite">
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
      <h3 className="text-h2 font-semibold text-navy">{title}</h3>
      {text && <p className="mt-4 text-body text-text-secondary">{text}</p>}
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
