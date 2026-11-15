import type { Locale, LocalizedString } from "@/data";

export const LOCALES: Locale[] = ["ar", "en", "zh"];
export const DEFAULT_LOCALE: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Resolve a LocalizedString for a locale. Missing zh/en falls back to ar (CI-09: never machine-translate). */
export function t(value: LocalizedString | undefined, locale: Locale): string {
  if (!value) return "";
  if (locale === "ar") return value.ar;
  if (locale === "en") return value.en ?? value.ar;
  return value.zh ?? value.ar;
}

/** True when the locale has no native string and falls back to Arabic (ZH review-pending notice). */
export function isFallback(value: LocalizedString | undefined, locale: Locale): boolean {
  if (!value) return false;
  if (locale === "en") return value.en === undefined;
  if (locale === "zh") return value.zh === undefined;
  return false;
}

/** Build a locale-prefixed path, e.g. localizedHref("en", "/products", "deye-sun") -> "/en/products/deye-sun". */
export function localizedHref(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}

/** Swap the locale segment of the current pathname, preserving the rest.
 * Works with clean paths ("/en/products/x") AND static ".html" paths
 * ("/en.html", "/ar/products/x.html") — the ".html" suffix is stripped
 * because Vercel serves clean URLs (cleanUrls) and links use clean paths. */
export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  const clean = pathname.replace(/\.html$/, "").replace(/\/$/, "");
  const parts = clean.split("/").filter(Boolean);
  if (parts.length > 0 && isLocale(parts[0])) parts[0] = nextLocale;
  else parts.unshift(nextLocale);
  return `/${parts.join("/")}`;
}
