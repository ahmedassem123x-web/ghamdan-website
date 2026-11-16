import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { webp } from "@/lib/images";
import Link from "next/link";
import { AlertIcon, InfoIcon, SearchIcon } from "@/components/icons";
/* Custom icon library (built by the icons worker under the same contract:
   every icon accepts `className`). No lucide imports remain in this file. */
import type { Locale, LocalizedString } from "@/data";
import { t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import ScrambleValue from "@/components/ScrambleValue";
/* Phase 6: shared ripple helpers (src/components/Ripple.tsx) — re-exported
   here so other workers' components can use them without editing their
   files' imports: `onPointerDown={attachRipple}` + `.ripple-host`. */
export { attachRipple, spawnRipple } from "@/components/Ripple";

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

/** Gradient word (Phase 6, plan §6): wraps ONE accent word in the
 * animated brand gradient (red -> blue, `.text-gradient-brand`).
 * Word-level only — the word is never split, so Arabic shaping is
 * untouched. Use for a single highlighted word per heading, never for
 * whole headings or running text. */
export function GradientWord({ children }: { children: ReactNode }) {
  return <span className="text-gradient-brand">{children}</span>;
}

/**
 * Highlights the FIRST whole-word occurrence of `highlight` in `title`
 * with <GradientWord>; every other word renders unchanged, and a title
 * with no match renders unchanged. Word-boundary match only (the title
 * is split on whitespace, never inside a word) — Arabic letters stay
 * connected. At most one word per heading is ever highlighted.
 */
function renderTitleWithHighlight(title: string, highlight?: string): ReactNode {
  if (!highlight) return title;
  const parts = title.split(/(\s+)/);
  let done = false;
  return parts.map((part, i) => {
    if (!done && part === highlight) {
      done = true;
      return (
        <GradientWord key={i}>{part}</GradientWord>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/** Section heading (§2.11): H2 + optional lead.
 * Impeccable ban: NO eyebrow/kicker label above a heading — the heading
 * speaks. The `eyebrow` prop is kept in the type for call-site
 * compatibility but is never rendered. No marker bar above the title
 * (removed 2026-11-16 at the user's request). */
export function SectionHeading({
  locale,
  title,
  lead,
  align = "start",
  highlight,
}: {
  locale: Locale;
  eyebrow?: LocalizedString;
  title: LocalizedString;
  lead?: LocalizedString;
  align?: "start" | "center";
  /** Optional single accent word to render with the brand gradient
   * (Phase 6, plan §6) — the word in the CURRENT locale, e.g. "شمسية".
   * First whole-word occurrence only; omit for a plain heading. */
  highlight?: LocalizedString;
}) {
  return (
    <div data-reveal className={align === "center" ? "text-center" : ""}>
      <h2 className="text-h2 font-bold text-navy">{renderTitleWithHighlight(t(title, locale), highlight ? t(highlight, locale) : undefined)}</h2>
      {lead && <p className={`mt-3 max-w-2xl text-body text-text-secondary ${align === "center" ? "mx-auto" : ""}`}>{t(lead, locale)}</p>}
    </div>
  );
}

/** Section heading with explicit locale (use when the caller already localised).
 * Same eyebrow rule as SectionHeading: the prop exists for compatibility
 * only and is never rendered. */
export function SectionHeadingL({
  locale,
  title,
  lead,
  align = "start",
  highlight,
}: {
  locale: Locale;
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "start" | "center";
  /** Optional single accent word (current locale) for the brand gradient
   * — first whole-word occurrence only; omit for a plain heading. */
  highlight?: string;
}) {
  return (
    <div data-reveal className={align === "center" ? "text-center" : ""}>
      <h2 className="text-h2 font-bold text-navy">{renderTitleWithHighlight(title, highlight)}</h2>
      {lead && <p className={`mt-3 max-w-2xl text-body text-text-secondary ${align === "center" ? "mx-auto" : ""}`}>{lead}</p>}
    </div>
  );
}

/** Breadcrumbs (§2.11). Mobile: single scrollable row with an end fade
 * and middle crumbs hidden (see .breadcrumbs in globals.css). The label
 * may be a ReactNode so callers can swap in a short mobile label. */
export function Breadcrumbs({ locale, items }: { locale: Locale; items: { label: ReactNode; href?: string }[] }) {
  return (
    <nav data-reveal aria-label="Breadcrumb" className="breadcrumbs wrap pt-5">
      <ol className="flex flex-wrap items-center gap-2 text-caption text-text-muted">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.href ? (
              <Link href={c.href} className="transition-colors hover:text-primary-hover hover:underline hover:underline-offset-4">{c.label}</Link>
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
        <InfoIcon className="size-8" aria-hidden="true" />
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
    <div data-reveal className="border-b border-sky bg-sky">
      <div className="wrap flex items-center gap-2 py-2.5 text-caption font-semibold text-navy">
        <InfoIcon className="size-4 shrink-0" aria-hidden="true" />
        <span>{ui("notice.zh", locale)}</span>
      </div>
    </div>
  );
}

/** Spec table (§2.11): renders only rows that exist — never "—" placeholders.
 * Phase 2: every row carries a stable id (`spec-row-<index>`) so Gallery
 * hotspots can scroll to and highlight it (`.rowHighlight` in
 * SpecTable.module.css, added/removed from the DOM for ~2s). Values go
 * through <ScrambleValue>: Latin digits scramble once on viewport entry
 * and settle on the true value; digit-free values render as-is. */
export function SpecTable({ rows }: { rows: { label: string; value: string }[] }) {
  if (rows.length === 0) return null;
  return (
    <div data-reveal className="overflow-hidden rounded-card border border-border-strong bg-surface shadow-card">
      <table className="w-full text-body-sm">
        {/* Spec rows stagger in: opacity 0 + y 8 -> 1/0, 250ms ease-out,
            stagger 30ms, capped at 10 animated rows (the rest appear
            instantly) — see MotionProvider data-stagger overrides. */}
        <tbody data-stagger data-stagger-step="30" data-stagger-duration="250" data-stagger-max="10" className="divide-y divide-border">
          {rows.map((r, i) => (
            <tr key={i} id={`spec-row-${i}`} className={i % 2 === 1 ? "bg-surface-muted" : "bg-surface"}>
              <th scope="row" className="w-2/5 px-5 py-3 text-start font-semibold text-navy">
                {r.label}
              </th>
              <td className="px-5 py-3 text-text-secondary">
                <ScrambleValue value={r.value} />
              </td>
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
    <nav data-stagger aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
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
          <AlertIcon className="size-4 shrink-0 text-error" aria-hidden="true" />
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
      <SearchIcon className="pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 text-text-muted start-4" aria-hidden="true" />
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
    <p data-reveal className="text-body-sm text-text-secondary" aria-live="polite">
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
  const img = <img src={webp(image)} alt={imageAlt} className="h-full min-h-72 w-full rounded-[1.25rem] object-cover shadow-card" loading="lazy" />;
  const copy = (
    <div>
      {eyebrow && <div className="mb-4">{eyebrow}</div>}
      <h3 className="text-h2 font-bold text-navy">{title}</h3>
      {text && <p className="mt-4 text-body text-text-secondary">{text}</p>}
      {children}
    </div>
  );
  return (
    <div data-reveal className="grid items-center gap-10 md:grid-cols-2">
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
