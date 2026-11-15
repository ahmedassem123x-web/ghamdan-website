import type { Metadata } from "next";
import { LOCALES } from "./i18n";
import type { Locale } from "@/data";

export const SITE_URL = "https://ghamdan-website.vercel.app";
export const OG_IMAGE = "/images/photos/solar-farm.webp";

/**
 * Shared detail-page metadata: localized title/description, absolute
 * canonical + hreflang alternates, Open Graph + Twitter cards.
 * `path` is the locale-less path, e.g. "/products/deye-sun-sg04lp1-5kw".
 */
export function detailMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
}): Metadata {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const url = `/${locale}${clean}`;
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, `/${l}${clean}`]),
  ) as Record<Locale, string>;
  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title,
      description,
      url,
      siteName: "Ghamdan",
      locale,
      type: "website",
      images: [{ url: OG_IMAGE, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
