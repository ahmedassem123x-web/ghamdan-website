import Link from "next/link";
import type { Locale } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { siteSettings } from "@/data";

/**
 * Typographic wordmark (BUILD_SPEC §2.1, CI-17). The old GTS logo is
 * forgotten — this wordmark stands in until Ahmed sends a new logo.
 * Arabic name + red dot #E10600 + "GHAMDAN" in Montserrat + GTS tag.
 */
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
  const name = variant === "overlay" ? brand.name.en : t(brand.name, locale);
  const textColor =
    variant === "light" ? "text-primary" : variant === "dark" ? "text-white" : "text-white";
  const subColor =
    variant === "light" ? "text-text-muted" : "text-text-inverse-muted";
  const sizeCls =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-xl" : "text-2xl";
  return (
    <Link
      href={localizedHref(locale, "/")}
      className="flex items-center gap-2.5"
      aria-label={t(brand.name, locale)}
    >
      <span
        className={`font-latin font-extrabold leading-none tracking-tight ${sizeCls} ${textColor}`}
        dir="ltr"
      >
        GHAMDAN<span className="text-brand-red">.</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-arabic font-bold text-base ${textColor}`}>{name}</span>
        <span
          className={`font-latin text-[0.625rem] font-semibold tracking-[0.18em] ${subColor}`}
          dir="ltr"
        >
          GTS
        </span>
      </span>
    </Link>
  );
}
