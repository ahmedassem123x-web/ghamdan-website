import Link from "next/link";
import type { Locale } from "@/data";
import { localizedHref } from "@/lib/i18n";

/**
 * Brand lockup — logo image ONLY (user request 2026-11-16, from a phone
 * screenshot of the mobile hero): the "غمدان" name text and the small
 * "GHAMDAN — GTS" line beside the logo were removed from the header,
 * the mobile drawer and the footer. The official transparent logo
 * `gts-logo-transparent.png` (2048×2048, square) is the whole lockup.
 *
 * Rules kept: explicit width/height (no layout shift; intrinsic ratio
 * 1:1 — width = height), no CSS filters, no drop shadow, no crop/
 * recolour. NEVER the navy square tile (`gts-official-logo.jpg`) on a
 * white header — the tile is navy by design. Dark navy footer: the same
 * transparent logo (it reproduces the tile look on navy).
 * Alt text per brand lock §7 (as the link's aria-label).
 */
const LOGO_SRC = "/images/brand/gts-logo-transparent.png";

/** Display size (px) per slot — brand lock §6: header 40–48, footer 120. */
const SIZES = {
  sm: 36,
  md: 44,
  lg: 120,
} as const;

export default function Wordmark({
  locale,
  size = "md",
}: {
  locale: Locale;
  /** Kept for call-site compatibility only — the variant no longer
   * changes the rendering (logo image only, on light and dark). */
  variant?: "light" | "dark" | "overlay";
  size?: "sm" | "md" | "lg";
}) {
  const px = SIZES[size];
  // Intrinsic logo ratio 1:1 (2048×2048 square) — width = height.
  const w = px;
  const alt =
    locale === "ar"
      ? "غمدان للتجارة والتوكيلات"
      : "Ghamdan Trading & Agencies — GTS";
  return (
    <Link
      href={localizedHref(locale, "/")}
      className="flex shrink-0 items-center gap-3"
      aria-label={alt}
    >
      <img
        src={LOGO_SRC}
        alt=""
        width={w}
        height={px}
        className="shrink-0"
        style={{ width: w, height: px }}
      />
    </Link>
  );
}
