// Category-page filter verification (fix round): all 8 category pages must have
// search + brand filter, result count, and an empty state. Also checks the
// admin shell is hidden BEFORE login (the [hidden] leak).
// Usage: node tools/qa_categories.mjs
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

const CHROME = "/opt/meta-chromium/chrome";
const BASE = "file:///home/hatch/workspace/ghamdan-website/";
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

const CATS = ["inverters", "batteries", "panels", "pumps", "controllers", "systems", "storage-ci", "cameras"];

async function main() {
  const chrome = spawn(CHROME, [
    "--headless=new", "--no-sandbox", "--disable-gpu",
    "--hatch-webgl-allowed-domains-file=/tmp/webgl-policy.txt",
    "--hatch-webgl-allowed-domains-sha256=" + readFileSync("/tmp/webgl-policy.sha", "utf8").trim(),
    "--remote-debugging-port=9232", "--user-data-dir=/tmp/gts-chrome-cat",
    "about:blank",
  ], { stdio: "ignore" });
  await sleep(3000);
  const list = await (await fetch("http://localhost:9232/json/list")).json();
  const page = list.find((t) => t.type === "page");
  const { ws, send } = await getTarget(page.webSocketDebuggerUrl);
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  const ev = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true })).result?.result?.value;
  const nav = async (url) => { await send("Page.navigate", { url }); await sleep(1500); };

  // 0. Admin shell hidden before login?
  await nav(BASE + "admin/index.html");
  console.log("admin pre-login shell hidden =", await ev(`document.querySelector('[data-admin-shell]')?.hidden`));
  console.log("admin pre-login shell visible on screen =", await ev(`(() => { const el = document.querySelector('[data-admin-shell]'); if (!el) return 'no-shell'; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).display !== 'none'; })()`));

  for (const cat of CATS) {
    await nav(BASE + `categories/${cat}.html`);
    const total = await ev(`document.querySelectorAll('[data-product-card]').length`);
    const hasQ = await ev(`!!document.querySelector('[data-filter-q]')`);
    const hasBrand = await ev(`!!document.querySelector('[data-filter-brand]')`);
    const meta = await ev(`document.querySelector('[data-result-meta]')?.textContent?.trim()`);
    // type a nonsense query -> empty state must appear
    await ev(`(() => { const q = document.querySelector('[data-filter-q]'); if (!q) return; q.value = 'zzzz-no-match'; q.dispatchEvent(new Event('input', {bubbles:true})); })()`);
    await sleep(400);
    const visNone = await ev(`[...document.querySelectorAll('[data-product-card]')].filter(c => c.style.display !== 'none').length`);
    const metaNone = await ev(`document.querySelector('[data-result-meta]')?.textContent?.trim()`);
    const emptyShown = await ev(`(() => { const e = document.querySelector('[data-empty-state]'); return e ? !e.hidden && getComputedStyle(e).display !== 'none' : 'no-empty-el'; })()`);
    // brand filter: pick first brand option if present
    const brandVal = await ev(`(() => { const s = document.querySelector('[data-filter-brand]'); return s ? s.options[1]?.value || null : null; })()`);
    let brandVis = "n/a";
    if (brandVal) {
      await ev(`(() => { const q = document.querySelector('[data-filter-q]'); q.value=''; q.dispatchEvent(new Event('input',{bubbles:true})); const s=document.querySelector('[data-filter-brand]'); s.value=${JSON.stringify(brandVal)}; s.dispatchEvent(new Event('change',{bubbles:true})); })()`);
      await sleep(400);
      brandVis = await ev(`[...document.querySelectorAll('[data-product-card]')].filter(c => c.style.display !== 'none').length`);
    }
    console.log(`${cat}: cards=${total} q=${hasQ} brand=${hasBrand} meta="${meta}" | nonsense-> visible=${visNone} meta="${metaNone}" empty=${emptyShown} | brand "${brandVal}" -> visible=${brandVis}`);
  }
  ws.close();
  chrome.kill();
  console.log("DONE");
}
main().catch((e) => { console.error(e); process.exit(1); });
