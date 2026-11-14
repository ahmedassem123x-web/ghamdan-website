// Headless-Chromium QA probe via CDP (pure Node 24, no deps).
// Usage: node tools/qa_probe.mjs
// Requires: chrome at /opt/meta-chromium/chrome, site served on http://localhost:8123
import { execFile, spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const CHROME = "/opt/meta-chromium/chrome";
// NOTE: this Hatch Chromium build blocks localhost/loopback navigation
// ("localhost is blocked"), so probes run over file:// (as in earlier QA).
const BASE = "file:///home/hatch/workspace/ghamdan-website/";
const OUT = "docs/qa/screenshots";
mkdirSync(OUT, { recursive: true });

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
  ["services.html", "services"],
  ["systems.html", "systems"],
  ["agencies.html", "agencies"],
  ["support.html", "support"],
  ["news.html", "news"],
  ["guidance.html", "guidance"],
  ["search.html", "search"],
  ["admin/index.html", "admin"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getTarget(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    else if (msg.method) events.push(msg);
  };
  const send = (method, params = {}) => new Promise((res) => {
    const mid = ++id; pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  return { ws, send, events };
}

async function main() {
  const chrome = spawn(CHROME, [
    "--headless=new", "--no-sandbox", "--disable-gpu",
    "--hatch-webgl-allowed-domains-file=/tmp/webgl-policy.txt",
    "--hatch-webgl-allowed-domains-sha256=" + (await import("node:fs")).readFileSync("/tmp/webgl-policy.sha", "utf8").trim(),
    "--remote-debugging-port=9230", "--user-data-dir=/tmp/gts-chrome-profile",
    "about:blank",
  ], { stdio: "ignore" });
  await sleep(3000);
  const list = await (await fetch("http://localhost:9230/json/list")).json();
  const page = list.find((t) => t.type === "page");
  const { ws, send, events } = await getTarget(page.webSocketDebuggerUrl);
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Log.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });

  const results = [];
  for (const [rel, name] of PAGES) {
    for (const viewport of [{ w: 1920, h: 1080, tag: "desktop" }, { w: 390, h: 844, tag: "mobile" }]) {
      await send("Emulation.setDeviceMetricsOverride", { width: viewport.w, height: viewport.h, deviceScaleFactor: 1, mobile: viewport.tag === "mobile" });
      events.length = 0;
      await send("Page.navigate", { url: BASE + rel });
      await sleep(1800);
      // Scroll through the page so lazy-loaded images actually load, then back to top.
      // Instant scrolling: the site uses smooth scroll-behavior, which would
      // leave the screenshot mid-scroll (and shift the absolute header).
      await send("Runtime.evaluate", { expression: `(async () => { document.documentElement.style.scrollBehavior = 'auto'; for (let y = 0; y <= document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 300)); })()`, awaitPromise: true });
      await sleep(800);
      const evalRes = await send("Runtime.evaluate", {
        expression: `(() => {
          const imgs = [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src'));
          return JSON.stringify({
            title: document.title,
            scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth,
            overflowX: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
            hOverflowEls: [...document.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > window.innerWidth + 1).slice(0,5).map(e => e.tagName + '.' + (e.className && e.className.baseVal === undefined ? String(e.className).split(' ')[0] : '')),
            brokenImgs: imgs,
            lang: document.documentElement.lang, dir: document.documentElement.dir,
            waLinks: [...document.querySelectorAll('a[href^="https://wa.me/"]')].length,
            waBad: [...document.querySelectorAll('a[href^="https://wa.me/"]')].filter(a => !/^https:\\/\\/wa\\.me\\/967775800000\\?text=/.test(a.href)).length,
          });
        })()`,
        returnByValue: true,
      });
      const data = JSON.parse(evalRes.result?.result?.value || "{}");
      const consoleErrors = events.filter((e) =>
        (e.method === "Runtime.exceptionThrown") ||
        (e.method === "Log.entryAdded" && e.params?.entry?.level === "error") ||
        (e.method === "Runtime.consoleAPICalled" && e.params?.type === "error"));
      const shot = await send("Page.captureScreenshot", { format: "png" });
      const file = `${OUT}/${name}-${viewport.tag}.png`;
      if (shot.result?.data) writeFileSync(file, Buffer.from(shot.result.data, "base64"));
      results.push({ page: rel, viewport: viewport.tag, ...data, consoleErrors: consoleErrors.length,
        consoleMsgs: consoleErrors.slice(0, 3).map((e) => JSON.stringify(e.params).slice(0, 200)) });
      console.log(`${rel} [${viewport.tag}] overflow=${data.overflowX}px brokenImgs=${(data.brokenImgs || []).length} wa=${data.waLinks}/${data.waBad} bad consoleErrors=${consoleErrors.length}`);
    }
  }
  writeFileSync("docs/qa/probe-results.json", JSON.stringify(results, null, 2));
  ws.close();
  chrome.kill();
  console.log("DONE — results in docs/qa/probe-results.json, screenshots in", OUT);
}
main().catch((e) => { console.error(e); process.exit(1); });
