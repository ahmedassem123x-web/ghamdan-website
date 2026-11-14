/**
 * Minimal static server for Next.js `output: 'export'` output.
 * Maps extensionless routes to .html files (/ar/about -> out/ar/about.html,
 * /ar -> out/ar.html, / -> out/index.html). Python's http.server cannot do
 * this, which made the first probe run measure directory listings.
 *
 * Usage: node tools/serve.mjs [port] [dir]  (defaults 8321, ./out)
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = Number(process.argv[2] ?? 8321);
const ROOT = path.resolve(process.argv[3] ?? path.join(process.cwd(), "out"));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) pathname += "index.html";
  let file = path.join(ROOT, pathname);
  // Extensionless route -> .html sibling
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const html = `${file}.html`;
    if (fs.existsSync(html)) file = html;
  }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    const notFound = path.join(ROOT, "404.html");
    res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : "404 Not Found");
    return;
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME[ext] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Serving ${ROOT} at http://127.0.0.1:${PORT}`);
});
