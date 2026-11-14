// Single-page CDP smoke test: navigate, report title/lang/wa count.
const url = process.argv[2] || "http://localhost:8123/index.html";
const port = process.argv[3] || "9231";
const list = await (await fetch(`http://localhost:${port}/json/list`)).json();
const page = list.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0; const pending = new Map();
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Runtime.enable"); await send("Page.enable");
await send("Page.navigate", { url });
await new Promise((r) => setTimeout(r, 2500));
const r = await send("Runtime.evaluate", { expression: `JSON.stringify({url: location.href, title: document.title, lang: document.documentElement.lang, dir: document.documentElement.dir, wa: document.querySelectorAll('a[href^="https://wa.me/"]').length, imgs: document.images.length, h1: document.querySelector('h1')?.textContent?.slice(0,60)})`, returnByValue: true });
console.log(r.result?.result?.value);
ws.close(); process.exit(0);
