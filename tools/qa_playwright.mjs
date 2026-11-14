// Fallback full-page screenshots via Playwright (pipe transport, no TCP
// remote-debugging port). Used when /opt/meta-chromium/chrome refuses to
// start with --remote-debugging-port (SIGTRAP).
// Usage: node tools/qa_playwright.mjs [page-slug ...]  (default: all 10)
import { createRequire } from "node:module";
const require = createRequire("/home/hatch/workspace/tools/dev-stack/starter-kit/node_modules/playwright-core/package.json");
const { chromium } = require("playwright-core");

const BASE = "file:///home/hatch/workspace/ghamdan-website/";
const PAGES = [
  ["index.html", "01-home"],
  ["about.html", "02-about"],
  ["solutions.html", "03-solutions"],
  ["catalog.html", "04-catalog"],
  ["projects.html", "05-projects"],
  ["products/p01.html", "06-product-detail"],
  ["contact.html", "07-contact"],
  ["categories/inverters.html", "08-product-category"],
  ["solutions/pumping.html", "09-solution-detail"],
  ["projects/template.html", "10-project-detail"],
];

const only = process.argv.slice(2);
const list = only.length ? PAGES.filter(([, n]) => only.includes(n)) : PAGES;

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] });
for (const [rel, name] of list) {
  for (const vp of [{ width: 1920, height: 1080, tag: "desktop" }, { width: 390, height: 844, tag: "mobile" }]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
    await page.goto(BASE + rel, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(1500);
    // scroll through to trigger lazy loads + reveal animations
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto";
      for (let y = 0; y <= document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 400));
    });
    const m = await page.evaluate(() => ({
      overflowX: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src")),
      height: document.body.scrollHeight,
    }));
    await page.screenshot({ path: `docs/qa/fullpage/${name}-${vp.tag}.png`, fullPage: true });
    console.log(`${name} [${vp.tag}] height=${m.height} overflow=${m.overflowX} broken=${m.broken.length} consoleErrors=${errors.length} ${errors[0] || ""}`);
    await page.close();
  }
}
await browser.close();
console.log("DONE");
