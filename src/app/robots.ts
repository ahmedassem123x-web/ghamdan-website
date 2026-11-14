import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/** Robots: admin demo is not indexed and not linked from the public site. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/ar/admin", "/en/admin", "/zh/admin"],
      },
    ],
    sitemap: "https://ghamdan-website.vercel.app/sitemap.xml",
  };
}
