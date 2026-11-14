// Full-page screenshots for the 10 reference pages (fix-round re-verification).
// Usage: node tools/qa_fullpage.mjs
// Uses its own debugging port/profile so it can run beside qa_probe.mjs.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const CHROME = "/opt/meta-chromium/chrome";
const BASE = "file:///home/hatch/workspace/ghamdan-website/";
const OUT = "docs/qa/fullpage";
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
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getTarget(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  };
  const send = (method, params = {}) => new Promise((res) => {
    const mid = ++id; pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  return { ws, send };
}

async function main() {
  const chrome = spawn(CHROME, [
    "--headless=new", "--no-sandbox", "--disable-gpu",
    "--hatch-webgl-allowed-domains-file=/tmp/webgl-policy.txt",
    "--hatch-webgl-allowed-domains-sha256=" + (await import("node:fs")).readFileSync("/tmp/webgl-policy.sha", "utf8").trim(),
    "--remote-debugging-port=9231", "--user-data-dir=/tmp/gts-chrome-fp",
    "about:blank",
  ], { stdio: "ignore" });
  await sleep(3000);
  const list = await (await fetch("http://localhost:9231/json/list")).json();
  const page = list.find((t) => t.type === "page");
  const { ws, send } = await getTarget(page.webSocketDebuggerUrl);
  await send("Runtime.enable");
  await send("Page.enable");

  for (const [rel, name] of PAGES) {
    for (const viewport of [{ w: 1920, h: 1080, tag: "desktop" }, { w: 390, h: 844, tag: "mobile" }]) {
      await send("Emulation.setDeviceMetricsOverride", { width: viewport.w, height: viewport.h, deviceScaleFactor: 1, mobile: viewport.tag === "mobile" });
      await send("Page.navigate", { url: BASE + rel });
      await sleep(1800);
      await send("Runtime.evaluate", { expression: `(async () => { document.documentElement.style.scrollBehavior = 'auto'; for (let y = 0; y <= document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 400)); })()`, awaitPromise: true });
      await sleep(600);
      const metrics = await send("Page.getLayoutMetrics", {});
      const height = Math.min(Math.ceil(metrics.result?.cssContentSize?.height || 1000), 20000);
      const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: viewport.w, height, scale: 1 } });
      const file = `${OUT}/${name}-${viewport.tag}.png`;
      if (shot.result?.data) writeFileSync(file, Buffer.from(shot.result.data, "base64"));
      console.log(`${name} [${viewport.tag}] full-page height=${height}px -> ${file}`);
    }
  }
  ws.close();
  chrome.kill();
  console.log("DONE — full-page screenshots in", OUT);
}
main().catch((e) => { console.error(e); process.exit(1); });
