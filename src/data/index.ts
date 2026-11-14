/**
 * Ghamdan (GTS) — data barrel. Re-exports every data module.
 * (BUILD_SPEC §0.2 names a single `catalog.ts`; this split-module layout is
 * the data-extraction deliverable — index.ts is the single import point, so
 * `import { products } from "@/data"` works either way.)
 */
export * from "./types";
export * from "./products";
export * from "./categories";
export { bundles } from "./bundles";
export * from "./agencies";
export * from "./solutions";
export * from "./settings";
export * from "./pages";
