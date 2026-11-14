import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";
import { products, categories, solutionAreas, bundles, agencies } from "@/data";

export const dynamic = "force-static";

const BASE = "https://ghamdan-website.vercel.app";

/** Sitemap: every public route × locale. Admin is excluded (noindex). */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const staticPaths = [
    "",
    "/about",
    "/solutions",
    "/products",
    "/systems",
    "/projects",
    "/services",
    "/support",
    "/news",
    "/agencies",
    "/downloads",
    "/guidance",
    "/search",
    "/contact",
    "/privacy",
    "/terms",
  ];
  for (const locale of LOCALES) {
    for (const p of staticPaths) {
      entries.push({ url: `${BASE}/${locale}${p}`, lastModified: new Date("2026-11-14") });
    }
    for (const a of solutionAreas) entries.push({ url: `${BASE}/${locale}/solutions/${a.id}`, lastModified: new Date("2026-11-14") });
    for (const c of categories) entries.push({ url: `${BASE}/${locale}/products/category/${c.id}`, lastModified: new Date("2026-11-14") });
    for (const p of products.filter((x) => x.status === "published")) {
      entries.push({ url: `${BASE}/${locale}/products/${p.slug}`, lastModified: new Date("2026-11-14") });
    }
    for (const b of bundles.filter((x) => x.status === "confirmed")) {
      entries.push({ url: `${BASE}/${locale}/systems/${b.slug}`, lastModified: new Date("2026-11-14") });
    }
    for (const a of agencies) entries.push({ url: `${BASE}/${locale}/agencies/${a.id}`, lastModified: new Date("2026-11-14") });
  }
  return entries;
}
