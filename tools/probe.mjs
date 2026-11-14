/**
 * Ghamdan v2 — technical probe (BUILD_SPEC §7.3).
 * Serves out/ over HTTP, visits every exported route at desktop (1440x900)
 * and mobile (390x844), and records: HTTP status, console errors, failed
 * requests, horizontal overflow, broken images, and wa.me link correctness.
 * Also screenshots the 10 reference pages (ar) at both viewports.
 *
 * Usage: node tools/probe.mjs [baseUrl]  (default http://127.0.0.1:8321)
 * Run from the project root. Playwright is resolved from the dev-stack
 * starter-kit via createRequire.
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire("/home/hatch/workspace/tools/dev-stack/starter-kit/package.json");
const { chromium } = require("playwright");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "out");
const QA = path.join(ROOT, "docs", "qa");
fs.mkdirSync(QA, { recursive: true });

const BASE = process.argv[2] ?? "http://127.0.0.1:8321";

// All exported HTML routes, as URL paths
function collectRoutes() {
  const routes = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith(".html")) {
        let rel = path.relative(OUT, p).replace(/\\/g, "/");
        // /ar/index.html -> /ar ; /index.html -> /
        if (rel.endsWith("/index.html")) rel = rel.slice(0, -"/index.html".length) || "/";
        else if (rel === "index.html") rel = "/";
        else rel = "/" + rel.slice(0, -".html".length);
        // skip build artefacts, not real routes
        if (rel.includes("_not-found") || rel === "/404") continue;
        routes.push(rel);
      }
    }
  };
  walk(OUT);
  return [...new Set(routes)].sort();
}

const REFERENCE_PAGES = [
  ["home", "/ar"],
  ["about", "/ar/about"],
  ["solutions", "/ar/solutions"],
  ["products", "/ar/products"],
  ["projects", "/ar/projects"],
  ["product-detail", "/ar/products/deye-sun-sg04lp1-6kw"],
  ["contact", "/ar/contact"],
  ["category", "/ar/products/category/inverters"],
  ["pumping", "/ar/solutions/pumping"],
  ["systems", "/ar/systems/bundle-1"],
];

async function main() {
  const routes = collectRoutes();
  console.log(`Routes to probe: ${routes.length}`);
  const browser = await chromium.launch();
  const results = [];
  const shotContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  for (const route of routes) {
    const page = await shotContext.newPage();
    const errors = [];
    const failedReqs = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text().slice(0, 200));
    });
    page.on("pageerror", (err) => errors.push(String(err).slice(0, 200)));
    page.on("requestfailed", (req) => failedReqs.push(`${req.url()} :: ${req.failure()?.errorText ?? "failed"}`));
    page.on("response", (res) => {
      if (res.status() >= 400) failedReqs.push(`${res.url()} :: HTTP ${res.status()}`);
    });
    const url = `${BASE}${route === "/" ? "" : route}`;
    let status = 0;
    try {
      const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      status = resp?.status() ?? 0;
      await page.waitForTimeout(600);
    } catch (e) {
      errors.push(`NAV: ${String(e).slice(0, 200)}`);
    }
    // Scroll through the page so lazy images actually load before measuring.
    // Synchronous jump-scroll (one evaluate, no per-step awaits) — the
    // per-step async version crashed the headless-shell renderer (OOM).
    try {
      await page.evaluate(() => {
        const h = document.documentElement.scrollHeight;
        for (let y = 0; y <= h; y += 900) window.scrollTo(0, y);
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1500);
    } catch (e) {
      errors.push(`SCROLL: ${String(e).slice(0, 200)}`);
    }

    const metrics = await page.evaluate(() => {
      const imgs = [...document.images];
      const broken = imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute("src"));
      const wa = [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.getAttribute("href"));
      const badWa = wa.filter((h) => !h.startsWith("https://wa.me/967775800000"));
      return {
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        imgCount: imgs.length,
        broken,
        waCount: wa.length,
        badWa,
        title: document.title,
        h1: document.querySelector("h1")?.textContent?.slice(0, 80) ?? "",
      };
    }).catch((e) => ({ evalError: String(e), overflowX: -1, imgCount: -1, broken: [], waCount: -1, badWa: [] }));
    results.push({ route, status, errors, failedReqs, ...metrics });
    await page.close();
  }

  // Mobile pass (390x844) on the 10 reference pages + home EN/ZH
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobileResults = [];
  for (const [name, route] of [...REFERENCE_PAGES, ["home-en", "/en"], ["home-zh", "/zh"]]) {
    const page = await mobile.newPage();
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
    try {
      await page.goto(`${BASE}${route === "/" ? "" : route}`, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(500);
      // Scroll through so lazy images load before measuring (sync jump-scroll;
      // the per-step async version crashed the headless-shell renderer).
      try {
        await page.evaluate(() => {
          const h = document.documentElement.scrollHeight;
          for (let y = 0; y <= h; y += 900) window.scrollTo(0, y);
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(1500);
      } catch (e) {
        errors.push(`SCROLL: ${String(e).slice(0, 200)}`);
      }
      const m = await page.evaluate(() => ({
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        broken: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute("src")),
      })).catch((e) => ({ evalError: String(e), overflowX: -1, broken: [] }));
      mobileResults.push({ name, route, errors, ...m });
      await page.screenshot({ path: path.join(QA, `mobile-${name}.png`), fullPage: false });
    } catch (e) {
      errors.push(`MOBILE: ${String(e).slice(0, 200)}`);
      mobileResults.push({ name, route, errors, overflowX: -1, broken: [] });
    }
    await page.close().catch(() => {});
  }

  // Desktop screenshots of the 10 reference pages
  for (const [name, route] of REFERENCE_PAGES) {
    const page = await shotContext.newPage();
    await page.goto(`${BASE}${route === "/" ? "" : route}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(QA, `desktop-${name}.png`), fullPage: false });
    await page.close();
  }
  await browser.close();

  const badStatus = results.filter((r) => r.status !== 200);
  const withErrors = results.filter((r) => r.errors.length > 0);
  const withFailed = results.filter((r) => r.failedReqs.length > 0);
  const withOverflow = results.filter((r) => (r.overflowX ?? 0) > 0);
  const withBrokenImg = results.filter((r) => (r.broken ?? []).length > 0);
  const withBadWa = results.filter((r) => (r.badWa ?? []).length > 0);
  const mobileOverflow = mobileResults.filter((r) => (r.overflowX ?? 0) > 0);
  const mobileBroken = mobileResults.filter((r) => (r.broken ?? []).length > 0);
  const mobileErrors = mobileResults.filter((r) => r.errors.length > 0);

  const summary = {
    probedAt: new Date().toISOString(),
    base: BASE,
    totalRoutes: results.length,
    non200: badStatus.map((r) => [r.route, r.status]),
    consoleErrors: withErrors.map((r) => [r.route, r.errors]),
    failedRequests: withFailed.map((r) => [r.route, r.failedReqs]),
    desktopOverflow: withOverflow.map((r) => [r.route, r.overflowX]),
    brokenImages: withBrokenImg.map((r) => [r.route, r.broken]),
    badWaLinks: withBadWa.map((r) => [r.route, r.badWa]),
    mobileOverflow: mobileOverflow.map((r) => [r.name, r.overflowX]),
    mobileBrokenImages: mobileBroken.map((r) => [r.name, r.broken]),
    mobileConsoleErrors: mobileErrors.map((r) => [r.name, r.errors]),
    totalWaLinks: results.reduce((n, r) => n + (r.waCount ?? 0), 0),
    totalImages: results.reduce((n, r) => n + (r.imgCount ?? 0), 0),
  };
  fs.writeFileSync(path.join(QA, "probe-results.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({
    totalRoutes: summary.totalRoutes,
    non200: summary.non200.length,
    consoleErrors: summary.consoleErrors.length,
    failedRequests: summary.failedRequests.length,
    desktopOverflow: summary.desktopOverflow.length,
    brokenImages: summary.brokenImages.length,
    badWaLinks: summary.badWaLinks.length,
    mobileOverflow: summary.mobileOverflow.length,
    mobileBrokenImages: summary.mobileBrokenImages.length,
    mobileConsoleErrors: summary.mobileConsoleErrors.length,
    totalWaLinks: summary.totalWaLinks,
    totalImages: summary.totalImages,
  }, null, 2));
  console.log(`Full report: ${path.join(QA, "probe-results.json")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
