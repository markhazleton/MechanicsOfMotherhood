#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distRoot = path.resolve(__dirname, "../dist/public");

function toRoute(filePath) {
  const rel = path.relative(distRoot, filePath).replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  return `/${rel.replace(/\/index\.html$/, "")}`;
}

function normalizeCanonical(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.replace(/\/+$/, "") || "/";
    return `${parsed.origin}${pathname}`.toLowerCase();
  } catch {
    return url.trim().replace(/\/+$/, "").toLowerCase();
  }
}

function collectIndexFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectIndexFiles(full, out);
      continue;
    }
    if (entry.isFile() && entry.name === "index.html") {
      out.push(full);
    }
  }
  return out;
}

if (!fs.existsSync(distRoot)) {
  console.error(`[validate-ssg-head] Missing build output: ${distRoot}`);
  process.exit(1);
}

const rootIndex = path.join(distRoot, "index.html");
if (!fs.existsSync(rootIndex)) {
  console.error("[validate-ssg-head] Missing root index.html in dist/public");
  process.exit(1);
}

const rootDoc = new JSDOM(fs.readFileSync(rootIndex, "utf8")).window.document;
const rootTitle = rootDoc.querySelector("title")?.textContent?.trim() || "";
const rootCanonical = normalizeCanonical(
  rootDoc.querySelector('link[rel="canonical"]')?.getAttribute("href") || ""
);

if (!rootTitle) {
  console.error("[validate-ssg-head] Root page is missing a <title>.");
  process.exit(1);
}
if (!rootCanonical) {
  console.error("[validate-ssg-head] Root page is missing a canonical URL.");
  process.exit(1);
}

const indexFiles = collectIndexFiles(distRoot);
const failures = [];

for (const filePath of indexFiles) {
  const route = toRoute(filePath);
  if (route === "/") continue;

  const doc = new JSDOM(fs.readFileSync(filePath, "utf8")).window.document;
  const title = doc.querySelector("title")?.textContent?.trim() || "";
  const canonicalRaw = doc.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
  const canonical = normalizeCanonical(canonicalRaw);

  if (!title) {
    failures.push(`${route}: missing <title>`);
  } else if (title === rootTitle) {
    failures.push(`${route}: title matches home title ("${rootTitle}")`);
  }

  if (!canonical) {
    failures.push(`${route}: missing canonical`);
  } else if (canonical === rootCanonical) {
    failures.push(`${route}: canonical points to home (${rootCanonical})`);
  }
}

if (failures.length > 0) {
  console.error(
    `\n[validate-ssg-head] FAILED: ${failures.length} route(s) have home SEO signals.\n`
  );
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

console.log(
  `[validate-ssg-head] OK: checked ${indexFiles.length - 1} non-home route page(s).`
);
