#!/usr/bin/env node
/**
 * Build-time pre-render for SEO-critical routes.
 *
 * After `yarn build`, this script:
 *   1. Serves the build folder locally on 127.0.0.1:5099 (minimal static server)
 *   2. Uses Puppeteer to load each SEO-critical route, waits for React +
 *      react-helmet-async to render, and captures the fully-rendered HTML
 *   3. Writes the snapshot to build/<route>/index.html so the initial HTML
 *      response contains real meta tags + content, not just the empty shell
 *
 * Non-SEO-critical routes (FAQ, Checklist, Contact, Booking, Policies, 404)
 * stay client-rendered via SPA fallback to the shell index.html.
 */
const http = require("http");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

const BUILD_DIR = path.resolve(__dirname, "..", "build");
const PORT = 5099;
const HOST = `http://127.0.0.1:${PORT}`;

// Snapshot `/` LAST. Writing it earlier would overwrite build/index.html — the
// SPA fallback served to every other route — with Home's title/meta baked in,
// causing later snapshots to inherit Home's tags before helmet layers on their
// own. This ordering guarantees the fallback stays as the original shell for
// every non-root snapshot.
const ROUTES = [
  "/residential",
  "/deep-cleaning",
  "/airbnb",
  "/commercial",
  "/pricing",
  "/",
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript",
  ".css":  "text/css",
  ".json": "application/json",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".xml":  "application/xml",
  ".txt":  "text/plain",
  ".map":  "application/json",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
};

function safePath(reqPath) {
  const decoded = decodeURIComponent(reqPath.split("?")[0]);
  const resolved = path.normalize(path.join(BUILD_DIR, decoded));
  if (!resolved.startsWith(BUILD_DIR)) return null; // path traversal guard
  return resolved;
}

async function serveBuild() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let file = safePath(req.url);
      if (!file) return res.writeHead(400).end("Bad request");
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
        file = path.join(file, "index.html");
      }
      if (!fs.existsSync(file)) file = path.join(BUILD_DIR, "index.html"); // SPA fallback
      const ext = path.extname(file).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    });
    server.on("error", reject);
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

function ensureDir(routePath) {
  const target = path.join(BUILD_DIR, routePath);
  fs.mkdirSync(target, { recursive: true });
  return path.join(target, "index.html");
}

async function snapshotRoute(browser, route) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(HOST + route, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 600));
  // Deduplicate meta/link tags managed by react-helmet-async. Multiple parents
  // (Layout + page) or provider replays can leave stale duplicates in the head.
  // Keep only the LAST occurrence of each unique meta/link identity — that's
  // the current route's authoritative value.
  await page.evaluate(() => {
    const head = document.head;
    const dedupeBy = (selector, keyFn) => {
      const nodes = Array.from(head.querySelectorAll(selector));
      const lastByKey = new Map();
      nodes.forEach((n) => lastByKey.set(keyFn(n), n));
      const keepers = new Set(lastByKey.values());
      nodes.forEach((n) => { if (!keepers.has(n)) n.remove(); });
    };
    dedupeBy('meta[name]',     (n) => 'name:' + n.getAttribute('name'));
    dedupeBy('meta[property]', (n) => 'prop:' + n.getAttribute('property'));
    dedupeBy('link[rel="canonical"]', (n) => 'canonical');
    // If multiple <title> somehow remain, keep only the last.
    const titles = Array.from(head.querySelectorAll('title'));
    titles.slice(0, -1).forEach((t) => t.remove());
  });
  const html = await page.content();
  await page.close();
  return html;
}

(async () => {
  if (!fs.existsSync(BUILD_DIR)) {
    console.error(`prerender: build folder not found at ${BUILD_DIR}. Run yarn build first.`);
    process.exit(1);
  }

  console.log("prerender: booting static server for build/ …");
  const server = await serveBuild();
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
  });

  const results = [];
  try {
    for (const route of ROUTES) {
      try {
        const html = await snapshotRoute(browser, route);
        const outPath =
          route === "/"
            ? path.join(BUILD_DIR, "index.html")
            : ensureDir(route);
        fs.writeFileSync(outPath, html, "utf8");
        results.push({ route, ok: true, bytes: html.length, outPath });
        console.log(`  ✓ ${route.padEnd(20)} → ${path.relative(BUILD_DIR, outPath)} (${html.length} bytes)`);
      } catch (e) {
        results.push({ route, ok: false, err: e.message });
        console.error(`  ✗ ${route}: ${e.message}`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    console.error(`prerender: ${failed.length} route(s) failed`);
    process.exit(1);
  }
  console.log(`prerender: ${results.length} route(s) snapshotted successfully.`);
})();
