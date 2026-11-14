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
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
