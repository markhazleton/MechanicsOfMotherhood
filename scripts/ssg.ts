#!/usr/bin/env tsx
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
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
let renderer: any;
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

function writeHtml(routePath: string, html: string, helmet: any) {
  // Sanitize the route path for filesystem compatibility (remove invalid characters)
  const sanitizedRoutePath = routePath.replace(/[<>:"|?*]/g, "-");
  const outDir = path.join(distRoot, sanitizedRoutePath);
  mkdirSync(outDir, { recursive: true });
  const replaced = template.replace(
    '<div id="root" role="main"></div>',
    `<div id="root" role="main">${html}</div>`
  );
  const withHead = replaced.replace(
    "</head>",
    `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}</head>`
  );
  const filePath = path.join(outDir, "index.html");
  writeFileSync(filePath, withHead, "utf-8");
  console.warn("[ssg] wrote", routePath || "/");
}

async function run() {
  const categories = getCategories();
  const recipes = getRecipes();
  const routes = new Set<string>(["/", "/recipes", "/categories"]);
  categories.forEach((c) => {
    if (c.url) routes.add(c.url);
  });
  recipes.slice(0, 300).forEach((r) => {
    let slug = r.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (r.recipeURL && r.recipeURL.startsWith("/recipe/")) {
      slug = r.recipeURL.replace("/recipe/", "").replace(/\/$/, "");
      // Sanitize slug to remove invalid filesystem characters
      slug = slug.replace(/[<>:"|?*]/g, "-");
    }
    routes.add("/recipe/" + slug);
  });

  const { render } = await getRenderer();
  for (const route of routes) {
    if (route.startsWith("/recipe/")) {
      const slug = route.replace("/recipe/", "");
      try {
        getRecipeBySlug(slug);
      } catch {
        // Recipe not found, skip prerendering
      }
    }
    const { html, helmet } = await render(route);
    const outRoute = route === "/" ? "" : route.replace(/^\//, "");
    writeHtml(outRoute, html, helmet);
  }
}
run().catch((e) => {
  console.error("[ssg] failed", e);
  process.exit(1);
});
