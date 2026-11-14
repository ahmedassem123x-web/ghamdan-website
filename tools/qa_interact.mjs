// Interaction tests via CDP: lang switch, catalog + category filters,
// admin login + WhatsApp stats key + status override + inquiries.
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn("/opt/meta-chromium/chrome", ["--headless=new", "--no-sandbox", "--disable-gpu", "--no-proxy-server",
  "--hatch-webgl-allowed-domains-file=/tmp/webgl-policy.txt",
  "--hatch-webgl-allowed-domains-sha256=" + readFileSync("/tmp/webgl-policy.sha", "utf8").trim(),
  "--remote-debugging-port=9233", "--user-data-dir=/tmp/gts-chrome-ix", "about:blank"], { stdio: "ignore" });
await sleep(3000);
const list = await (await fetch("http://localhost:9233/json/list")).json();
const page = list.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0; const pending = new Map();
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Runtime.enable"); await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
const ev = async (expr) => {
  const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  return r.result?.result?.value;
};
const nav = async (url) => { await send("Page.navigate", { url }); await sleep(1800); };
const BASE = "file:///home/hatch/workspace/ghamdan-website/";
const out = {};

// 1. Language switch preserves page + translates (EN)
await nav(BASE + "index.html?lang=en");
out.lang_en_h1 = await ev(`document.querySelector('h1')?.textContent?.trim().slice(0,60)`);
out.lang_en_dir = await ev(`document.documentElement.dir`);
await nav(BASE + "index.html?lang=zh");
out.lang_zh_notice_visible = await ev(`!document.getElementById('zh-notice')?.hidden`);

// 2. Catalog filter: type "Deye"
await nav(BASE + "catalog.html");
await ev(`(() => { const q = document.querySelector('[data-filter-q]'); q.value = 'Deye'; q.dispatchEvent(new Event('input', {bubbles:true})); })()`);
await sleep(600);
out.catalog_filter_deye_visible = await ev(`[...document.querySelectorAll('[data-product-card]')].filter(c => c.style.display !== 'none').length`);
out.catalog_filter_meta = await ev(`document.querySelector('[data-result-meta]')?.textContent`);

// 3. Category filter (inverters page)
await nav(BASE + "categories/inverters.html");
await ev(`(() => { const q = document.querySelector('[data-filter-q]'); q.value = 'SUN-'; q.dispatchEvent(new Event('input', {bubbles:true})); })()`);
await sleep(600);
out.category_filter_visible = await ev(`[...document.querySelectorAll('[data-product-card]')].filter(c => c.style.display !== 'none').length`);

// 4. Admin: seed one wa click + one inquiry, login, check stats + override
await nav(BASE + "admin/index.html");
await ev(`localStorage.setItem('gts-wa-clicks', JSON.stringify([{ts: new Date().toISOString(), source:'product', entity:'p01', page:'products/p01.html', lang:'ar', cta:'product-inquire'}]));
  localStorage.setItem('gts-inquiries', JSON.stringify([{ts: new Date().toISOString(), name:'اختبار', phone:'+967700000000', type:'استفسار عن منتج', message:'رسالة اختبار'}]));`);
await ev(`(() => { const f = document.querySelector('[data-admin-login]'); f.email.value='admin@ghamdan-trd.com'; f.password.value='admin123'; f.dispatchEvent(new Event('submit', {bubbles:true, cancelable:true})); })()`);
await sleep(800);
out.admin_shell_visible = await ev(`!document.querySelector('[data-admin-shell]')?.hidden`);
out.admin_wa_stat = await ev(`document.querySelector('[data-admin-stats]')?.textContent?.match(/\\d+/)?.[0]`);
out.admin_stats_rows = await ev(`document.querySelector('[data-admin-table="stats"] tbody')?.rows.length`);
out.admin_inquiry_rows = await ev(`document.querySelector('[data-admin-table="inquiries"] tbody')?.rows.length`);
out.admin_product_rows = await ev(`document.querySelector('[data-admin-table="products"] tbody')?.rows.length`);
out.admin_status_selects = await ev(`document.querySelectorAll('[data-status-change]').length`);
// change first product status to archived, verify override + badge
await ev(`(() => { const s = document.querySelector('[data-status-change]'); s.value='archived'; s.dispatchEvent(new Event('change', {bubbles:true})); })()`);
await sleep(600);
out.admin_override_saved = await ev(`JSON.parse(localStorage.getItem('gts-overrides')||'{}')`);
out.admin_first_badge = await ev(`document.querySelector('[data-admin-table="products"] tbody tr td .status')?.textContent`);
console.log(JSON.stringify(out, null, 2));
ws.close(); chrome.kill(); process.exit(0);
