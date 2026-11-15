import Link from "next/link";
import type { Locale } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { siteSettings } from "@/data";

/**
 * Brand lockup (v15, docs/brand-identity-lock.md §5–§7).
 * Official emblem `gts-emblem-transparent.png` — PREFERRED on every
 * surface — + HTML wordmark text beside it. The emblem at header size
 * (40–48px) is a symbol only: its embedded Arabic/English/partner lines
 * become texture, so the HTML text carries the company name — never rely
 * on the emblem alone for the name.
 *
 * Rules kept: explicit width/height (no layout shift; intrinsic ratio
 * 1597:1621), no CSS filters, no drop shadow, no crop/recolour, clear
 * space ≈ 1/4 emblem diameter (the flex gap). NEVER the navy square tile
 * (`gts-official-logo.jpg`) on a white header — the tile is navy by
 * design. Dark navy footer: the same transparent emblem (it reproduces
 * the tile look on navy) — preferred for consistency.
 * Alt text per brand lock §7. The old typographic wordmark
 * (GHAMDAN. + red dot #E10600, Montserrat) is RETIRED with the swap:
 * logo red #E31E24 lives inside the emblem only, never as UI text.
 */
const EMBLEM_SRC = "/images/brand/gts-emblem-transparent.png";

/** Display size (px) per slot — brand lock §6: header 40–48, footer 120. */
const SIZES = {
  sm: 36,
  md: 44,
  lg: 120,
} as const;

export default function Wordmark({
  locale,
  variant = "light",
  size = "md",
}: {
  locale: Locale;
  variant?: "light" | "dark" | "overlay";
  size?: "sm" | "md" | "lg";
}) {
  const brand = siteSettings.brand;
  const px = SIZES[size];
  // Intrinsic emblem ratio 1597:1621 — width follows from the height.
  const w = Math.round((px * 1597) / 1621);
  const name = t(brand.name, locale);
  const alt =
    locale === "ar"
      ? "غمدان للتجارة والتوكيلات"
      : "Ghamdan Trading & Agencies — GTS";
  const onDark = variant !== "light";
  const nameColor = onDark ? "text-white" : "text-navy";
  const subColor = onDark ? "text-white/70" : "text-text-secondary";
  const nameSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  const nameFont = locale === "ar" ? "font-arabic" : "font-latin";
  const subLine =
    locale === "ar" ? "GHAMDAN — GTS" : "TRADING & AGENCIES — GTS";
  return (
    <Link
      href={localizedHref(locale, "/")}
      className="flex shrink-0 items-center gap-3"
      aria-label={alt}
    >
      <img
        src={EMBLEM_SRC}
        alt=""
        width={w}
        height={px}
        className="shrink-0"
        style={{ width: w, height: px }}
      />
      <span className="flex flex-col leading-none">
        <span className={`${nameFont} font-bold ${nameSize} ${nameColor}`}>
          {name}
        </span>
        <span
          className={`mt-1 font-latin text-[0.625rem] font-semibold tracking-[0.18em] ${subColor}`}
          dir="ltr"
        >
          {subLine}
        </span>
      </span>
    </Link>
  );
}
