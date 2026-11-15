#!/usr/bin/env node
/**
 * fix-html-lang.mjs — D-1 fix (2026-11-15, v15 fix round).
 *
 * Problem: the root layout (src/app/layout.tsx) sits ABOVE the [locale]
 * segment, so `params.locale` is always undefined there and every page of
 * the static export is emitted with `<html lang="ar" dir="rtl">` — the
 * entire EN/ZH site renders mirrored RTL.
 *
 * Fix: post-build HTML rewrite (no runtime cost, no flash, statically
 * correct attrs for SEO / no-JS / view-source). After `next build`, walk
 * out/ and rewrite ONLY the `<html …>` tag per path:
 *   out/ar/**  + out/ar.html  → lang="ar" dir="rtl"
 *   out/en/**  + out/en.html  → lang="en" dir="ltr"
 *   out/zh/**  + out/zh.html  → lang="zh" dir="ltr"
 *   everything else (out/index.html, out/404.html, out/_not-found/**)
 *   keeps the ar/rtl default — the root page and 404 are Arabic.
 *
 * Wired into package.json: `npm run build` = `next build && node
 * tools/fix-html-lang.mjs`. Idempotent: re-running on already-correct
 * files changes nothing. Nothing else in the HTML is touched.
 *
 * VERCEL NOTE (2026-11-15): on Vercel the @vercel/next builder copies
 * out/ into .vercel/output/static/ DURING `next build` — i.e. BEFORE
 * this script runs. Rewriting out/ alone therefore never reaches the
 * served files (verified live: build log showed 76 EN + 76 ZH
 * rewritten, yet production /en still served lang="ar"). So the script
 * also rewrites .vercel/output/static/ when it exists (Vercel only);
 * locally that directory does not exist and out/ alone is rewritten.
 *
 * Usage: node tools/fix-html-lang.mjs [outDir]   (default: out)
 */
import { readdir, readFile, writeFile, access } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const OUT_DIR = process.argv[2] ?? "out";
const VERCEL_STATIC_DIR = ".vercel/output/static";

const LOCALES = {
  ar: { lang: "ar", dir: "rtl" },
  en: { lang: "en", dir: "ltr" },
  zh: { lang: "zh", dir: "ltr" },
};

/** Locale for a path relative to out/ (posix separators). */
function localeFor(relPosix) {
  const first = relPosix.split("/")[0];
  if (first === "ar" || first === "en" || first === "zh") return first;
  if (relPosix === "ar.html" || relPosix === "en.html" || relPosix === "zh.html") {
    return relPosix.slice(0, 2);
  }
  return "ar"; // index.html, 404.html, _not-found/** → Arabic default
}

async function* walkHtml(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_next") continue; // no HTML there
      yield* walkHtml(full);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      yield full;
    }
  }
}

/** Rewrite lang/dir attrs inside a single `<html …>` tag string. */
function rewriteHtmlTag(tag, lang, dir) {
  let out = tag;
  const langRe = /lang=(["'])[^"']*\1/;
  const dirRe = /dir=(["'])[^"']*\1/;
  if (langRe.test(out)) out = out.replace(langRe, `lang="${lang}"`);
  else out = out.replace(/<html\b/, `<html lang="${lang}"`);
  if (dirRe.test(out)) out = out.replace(dirRe, `dir="${dir}"`);
  else out = out.replace(/<html\b/, `<html dir="${dir}"`);
  return out;
}

const counts = { ar: 0, en: 0, zh: 0 };
const changed = { ar: 0, en: 0, zh: 0 };
let total = 0;
let missingTag = [];

// Targets: out/ always; .vercel/output/static/ too when it exists
// (Vercel copies out/ there during `next build`, before this script runs).
const targets = [OUT_DIR];
try {
  await access(VERCEL_STATIC_DIR);
  targets.push(VERCEL_STATIC_DIR);
} catch {
  // local build — no Vercel output directory
}

for (const targetDir of targets) {
  for await (const file of walkHtml(targetDir)) {
    const rel = relative(targetDir, file).split(sep).join("/");
    const locale = localeFor(rel);
    const { lang, dir } = LOCALES[locale];
    const html = await readFile(file, "utf8");
    const m = html.match(/<html\b[^>]*>/);
    if (!m) {
      missingTag.push(`${targetDir}/${rel}`);
      continue;
    }
    const fixed = rewriteHtmlTag(m[0], lang, dir);
    counts[locale]++;
    total++;
    if (fixed !== m[0]) {
      await writeFile(file, html.replace(m[0], fixed), "utf8");
      changed[locale]++;
    }
  }
}

console.log(`fix-html-lang: ${total} HTML files in ${targets.join(" + ")}/`);
for (const l of ["ar", "en", "zh"]) {
  console.log(`  ${l}: ${counts[l]} files, ${changed[l]} rewritten → lang="${LOCALES[l].lang}" dir="${LOCALES[l].dir}"`);
}
if (missingTag.length > 0) {
  console.error(`fix-html-lang: WARNING — ${missingTag.length} HTML file(s) with no <html> tag: ${missingTag.join(", ")}`);
  process.exitCode = 1;
}
