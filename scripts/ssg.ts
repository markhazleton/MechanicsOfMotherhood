#!/usr/bin/env tsx
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { JSDOM } from "jsdom";
import {
  getRecipes,
  getCategories,
  getRecipeBySlug,
} from "../client/src/data/api-loader";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distRoot = path.join(projectRoot, "dist", "public");

if (!existsSync(path.join(distRoot, "index.html"))) {
  console.error(
    "[ssg] Build required before running SSG. Run npm run build:static first."
  );
  process.exit(1);
}
// Expect server bundle at dist/server/ssr-entry.js (default Vite SSR output path when using --ssr)
const serverBundlePath = path.join(
  projectRoot,
  "dist",
  "server",
  "ssr-entry.js"
);
if (!existsSync(serverBundlePath)) {
  console.error("[ssg] Missing server bundle. Run: npm run build:ssr first.");
  process.exit(1);
}
const template = readFileSync(path.join(distRoot, "index.html"), "utf-8");
let renderer: { render: (url: string) => Promise<{ html: string; helmet: { title: string; meta: string; link: string } }> } | null = null;
async function getRenderer() {
  if (!renderer) {
    const mod = await import(pathToFileURL(serverBundlePath).href);
    if (!mod.render) {
      console.error(
        "[ssg] Server bundle missing exported render(url) function"
      );
      process.exit(1);
    }
    renderer = mod;
  }
  return renderer;
}

function normalizeRoute(input: string): string {
  if (!input) return "/";
  const trimmed = input.trim();
  if (!trimmed) return "/";

  let route = trimmed;
  try {
    const parsed = new URL(trimmed);
    route = parsed.pathname || "/";
  } catch {
    // Keep non-URL paths as-is.
  }

  route = route.replace(/\\/g, "/");
  route = route.split(/[?#]/)[0] || "/";
  if (!route.startsWith("/")) route = `/${route}`;

  if (route !== "/") {
    route = route.replace(/\/+$/, "");
    if (!route) route = "/";
  }

  return route;
}

function loadRoutesFromSitemap(sitemapPath: string): string[] {
  if (!existsSync(sitemapPath)) return [];

  const xml = readFileSync(sitemapPath, "utf-8");
  const matches = xml.match(/<loc>(.*?)<\/loc>/g) || [];
  return matches
    .map((match) => match.replace(/<\/?loc>/g, "").trim())
    .filter(Boolean)
    .map((loc) => normalizeRoute(loc));
}

function upsertHeadNode(document: Document, node: Element): void {
  const head = document.head;
  const tagName = node.tagName.toLowerCase();

  if (tagName === "title") {
    head.querySelectorAll("title").forEach((existing) => existing.remove());
    head.appendChild(node);
    return;
  }

  if (tagName === "meta") {
    const name = node.getAttribute("name");
    const property = node.getAttribute("property");
    if (name) {
      head.querySelectorAll(`meta[name="${name}"]`).forEach((existing) => existing.remove());
    }
    if (property) {
      head.querySelectorAll(`meta[property="${property}"]`).forEach((existing) => existing.remove());
    }
    head.appendChild(node);
    return;
  }

  if (tagName === "link") {
    const rel = node.getAttribute("rel");
    const href = node.getAttribute("href");
    if (rel === "canonical") {
      head.querySelectorAll('link[rel="canonical"]').forEach((existing) => existing.remove());
    }
    if (rel === "dns-prefetch" && href) {
      const existing = head.querySelector(`link[rel="dns-prefetch"][href="${href}"]`);
      if (existing) {
        return;
      }
    }
    head.appendChild(node);
    return;
  }

  if (tagName === "script" && node.getAttribute("type") === "application/ld+json") {
    head.appendChild(node);
  }
}

function writeHtml(routePath: string, html: string) {
  // Sanitize the route path for filesystem compatibility (remove invalid characters)
  const sanitizedRoutePath = routePath.replace(/[<>:"|?*]/g, "-");
  const outDir = path.join(distRoot, sanitizedRoutePath);
  mkdirSync(outDir, { recursive: true });
  const replaced = template.replace(
    '<div id="root" role="main"></div>',
    `<div id="root" role="main">${html}</div>`
  );
  const dom = new JSDOM(replaced);
  const { document } = dom.window;
  const root = document.getElementById("root");
  if (root) {
    const seoNodes = Array.from(
      root.querySelectorAll(
        'title,meta[name],meta[property],link[rel="canonical"],link[rel="dns-prefetch"],script[type="application/ld+json"]'
      )
    );
    seoNodes.forEach((node) => {
      node.remove();
      upsertHeadNode(document, node);
    });
  }

  const filePath = path.join(outDir, "index.html");
  writeFileSync(filePath, dom.serialize(), "utf-8");
  console.warn("[ssg] wrote", routePath || "/");
}

async function run() {
  const categories = getCategories();
  const recipes = getRecipes();
  const routes = new Set<string>(["/", "/recipes", "/categories", "/blog"]);

  const sitemapRoutes = loadRoutesFromSitemap(
    path.join(projectRoot, "client", "public", "sitemap.xml")
  );
  sitemapRoutes.forEach((route) => routes.add(route));

  categories.forEach((c) => {
    if (c.url) routes.add(normalizeRoute(c.url));
  });

  recipes.forEach((r) => {
    let slug = r.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (r.recipeURL && r.recipeURL.startsWith("/recipe/")) {
      slug = r.recipeURL.replace("/recipe/", "").replace(/\/$/, "");
      // Sanitize slug to remove invalid filesystem characters
      slug = slug.replace(/[<>:"|?*]/g, "-");
    }

    routes.add(normalizeRoute("/recipe/" + slug));
    if (r.recipeURL) {
      routes.add(normalizeRoute(r.recipeURL));
    }
  });

  const { render } = await getRenderer();
  const sortedRoutes = Array.from(routes).sort();
  for (const route of sortedRoutes) {
    if (route.startsWith("/recipe/")) {
      const slug = route.replace("/recipe/", "");
      try {
        getRecipeBySlug(slug);
      } catch {
        // Recipe not found, skip prerendering
      }
    }
    const { html } = await render(route);
    const outRoute = route === "/" ? "" : route.replace(/^\//, "");
    writeHtml(outRoute, html);
  }

  console.warn(`[ssg] rendered ${sortedRoutes.length} routes`);
}
run().catch((e) => {
  console.error("[ssg] failed", e);
  process.exit(1);
});
