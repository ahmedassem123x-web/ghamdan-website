import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the same output deploys to Vercel (Next.js build) and
  // GitHub Pages (exported files). No server, no middleware, no ISR.
  output: "export",
  images: {
    // Static export has no image optimizer server.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      // Tailwind is imported ONLY by src/app/globals.css
      // (@import "tailwindcss"), so the Tailwind loader is scoped to
      // that one file. A blanket "*.css" rule here would also catch
      // *.module.css and flatten CSS Modules to global CSS (unhashed
      // names, `import styles` resolving to {} — found 2026-11-15:
      // Phase 1/2 hotspot dots measured 0x0, all module styles dead).
      // Scoping the rule leaves *.module.css on Turbopack's default
      // CSS-Modules handling.
      // NOTE (fix-and-verify 2026-11-16): the key "src/app/globals.css"
      // did NOT match — the build emitted 0 Tailwind utilities
      // (26KB CSS, no display:grid anywhere), leaving the whole site
      // unstyled (block layout, 53k-px home page). Turbopack matches
      // rule keys against the "./"-prefixed project-relative path.
      "./src/app/globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
