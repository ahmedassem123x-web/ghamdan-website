import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/** Robots: no admin area exists (the demo panel was deleted 2026-11-15). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://ghamdan-website.vercel.app/sitemap.xml",
  };
}
