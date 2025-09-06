#!/usr/bin/env node
/**
 * Simple prerender script to emit static HTML for key dynamic routes
 * - Recipes: /recipe/<slug>
 * - Categories: /recipes/category/<slug>
 *
 * Uses JSDOM to execute minimal rendering of the React app for each route.
 * We avoid full hydration; goal is a crawlable shell with critical meta + primary content skeleton.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

// Resolve project root from ESM module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function safeLoadJson(p, fallback = []) {
  try { return JSON.parse(readFileSync(p, 'utf-8')); } catch { return fallback; }
}

const recipes = safeLoadJson(path.join(__dirname, '../client/src/data/recipes.json'));
const categories = safeLoadJson(path.join(__dirname, '../client/src/data/categories.json'));

const projectRoot = path.resolve(__dirname, '..');
const distRoot = path.join(projectRoot, 'dist', 'public');

// Base index template (post-build)
const indexPath = path.join(distRoot, 'index.html');
if (!existsSync(indexPath)) {
  console.error('[prerender] Build output not found. Run npm run build first.');
  process.exit(1);
}
const indexHtml = readFileSync(indexPath, 'utf-8');

// Utility to write an index.html for a given route
function writeRoute(route, { title, description }) {
  const fileDir = path.join(distRoot, route);
  mkdirSync(fileDir, { recursive: true });
  const dom = new JSDOM(indexHtml);
  const { document } = dom.window;
  if (title) {
    let titleEl = document.querySelector('title');
    if (!titleEl) {
      titleEl = document.createElement('title');
      document.head.appendChild(titleEl);
    }
    titleEl.textContent = title.includes('Mechanics of Motherhood') ? title : `${title} | Mechanics of Motherhood`;
  }
  if (description) {
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.setAttribute('name', 'description');
      document.head.appendChild(desc);
    }
    desc.setAttribute('content', description);
  }
  // Canonical URL consistency
  const canonicalHref = `https://mechanicsofmotherhood.com${route === '' ? '/' : '/' + route + '/'}`.replace(/\/+$/,'/');
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalHref);

  // OG URL alignment
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', canonicalHref);

  // Insert a light no-JS content placeholder for SEO (actual hydration will replace it)
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style=
      "font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:2rem;max-width:60ch;margin:0 auto;">
      <h1 style="font-size:2rem;line-height:1.2;margin:0 0 1rem;">${title || 'Mechanics of Motherhood'}</h1>
      <p style="color:#555;margin:0 0 1.5rem;">${description || 'Engineering better meals for working mothers worldwide.'}</p>
      <p style="font-size:.875rem;color:#888;">This page is prerendered for faster loads & better crawlability. Interactive features load shortly.</p>
    </div>`;
  }

  const outPath = path.join(fileDir, 'index.html');
  writeFileSync(outPath, dom.serialize(), 'utf-8');
  console.log('[prerender] Wrote', outPath);
}

// Derive recipe slugs
function extractRecipeSlug(r) {
  if (r.recipeURL && r.recipeURL.startsWith('/recipe/')) {
    return r.recipeURL.replace('/recipe/','').replace(/\/$/,'');
  }
  return r.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

// Recipes
for (const r of recipes.slice(0, 250)) { // safety cap
  try {
    const slug = extractRecipeSlug(r);
    writeRoute(path.join('recipe', slug), {
      title: r.name,
      description: r.description?.split(/\r?\n/)[0]?.slice(0, 155) || 'Recipe from Mechanics of Motherhood'
    });
  } catch (e) {
    console.warn('[prerender] Failed recipe', r?.name, e.message);
  }
}

// Categories
for (const c of categories) {
  try {
    // category urls in data already absolute like /recipes/category/appetizer
    let route = c.url.replace(/^\//,'');
    writeRoute(route, {
      title: `${c.name} Recipes`,
      description: `Browse ${c.name.toLowerCase()} recipes on Mechanics of Motherhood.`
    });
  } catch (e) {
    console.warn('[prerender] Failed category', c?.name, e.message);
  }
}

// Core landing pages
writeRoute('', { title: 'Mechanics of Motherhood - Engineering Better Meals', description: 'Engineering better meals for working mothers worldwide.' });
writeRoute('recipes', { title: 'All Recipes', description: 'Browse all Mechanics of Motherhood recipes.' });
writeRoute('categories', { title: 'Recipe Categories', description: 'Explore recipe categories.' });

console.log('[prerender] Complete');
