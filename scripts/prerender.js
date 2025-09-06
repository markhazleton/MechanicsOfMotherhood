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
function writeRoute(route, { title, description, structuredData }) {
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

  // IMPORTANT: Do not inject placeholder markup into #root.
  // React 19 aggressively reconciles the container; injecting transient children created
  // a race leading to NotFoundError (removeChild on detached node) in some browsers.
  // Leaving #root empty avoids hydration/diff mismatches while still benefiting from
  // head tag SEO improvements.
  const root = document.getElementById('root');
  if (root) root.innerHTML = '';

  // Structured Data JSON-LD (object or array of objects)
  if (structuredData) {
    const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData];
    for (const sd of dataArray.filter(Boolean)) {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(sd);
      document.head.appendChild(script);
    }
  }

  const outPath = path.join(fileDir, 'index.html');
  writeFileSync(outPath, dom.serialize(), 'utf-8');
  console.log('[prerender] Wrote', outPath);
}

// Derive recipe slugs
function extractRecipeSlug(r) {
  let base;
  if (r.recipeURL && r.recipeURL.startsWith('/recipe/')) {
    base = r.recipeURL.replace('/recipe/','').replace(/\/$/,'');
  } else {
    base = r.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }
  return sanitizePathSegment(base);
}

function sanitizePathSegment(segment) {
  // Remove characters unsafe for Windows/macOS file systems and URLs (colon, quotes, etc.)
  return segment
    .replace(/[^a-z0-9-]/g, '-')      // keep alnum + hyphen
    .replace(/--+/g, '-')             // collapse repeats
    .replace(/^-|-$/g, '');           // trim hyphens
}

// Recipes
for (const r of recipes.slice(0, 250)) { // safety cap
  try {
    const slug = extractRecipeSlug(r);
    const firstParagraph = r.description?.split(/\r?\n\r?\n|\r?\n\*/)[0] || r.description || '';
    const description = firstParagraph.replace(/[*#`>_]/g,'').slice(0,155) || 'Recipe from Mechanics of Motherhood';
    // Build minimal structured data inline (mirror runtime logic without importing TS modules here)
    const ingredients = r.ingredients ? r.ingredients.split(/\r?\n/).filter(l=>l.trim()) : [];
    const instructions = r.instructions ? r.instructions.split(/\r?\n/).filter(l=>l.trim()).map((t,i)=>({"@type":"HowToStep","name":`Step ${i+1}`,"text":t.trim()})) : [];
    const keywordsRaw = r.seO_Keywords ? r.seO_Keywords.split(/\r?\n/).map(l=>l.trim()).filter(Boolean).map(l=>l.replace(/^[\-\d.]*\s*/, '')) : [];
    const keywords = keywordsRaw.length ? keywordsRaw.join(', ') : undefined;
    const site = 'https://mechanicsofmotherhood.com';
    const canonical = `${site}/recipe/${slug}`;
    // Prefer first provided image if available; fallback to generic OG image
    const imageUrl = (r.images && r.images.length && r.images[0].url) ? r.images[0].url.replace(/^https?:\/\/[^/]+/, 'https://mechanicsofmotherhood.com') : `${site}/images/logos/mom-og-image.png`;
    const recipeSchema = {
      "@context":"https://schema.org",
      "@type":"Recipe",
      "@id": canonical + '#recipe',
      name: r.name,
      description,
      image: imageUrl,
      author: { "@type":"Person", name: r.authorNM || 'Mechanics of Motherhood' },
      publisher: { "@type":"Organization", name: 'Mechanics of Motherhood', url: site+'/', logo:{"@type":"ImageObject","url":`${site}/images/logos/mom-logo.png`} },
      url: canonical,
      mainEntityOfPage: { "@type":"WebPage", "@id": canonical },
      recipeCategory: r.recipeCategory?.name || undefined,
      recipeYield: r.servings ? String(r.servings) : undefined,
      keywords,
      recipeIngredient: ingredients,
      recipeInstructions: instructions,
      aggregateRating: (r.averageRating && r.ratingCount) ? {"@type":"AggregateRating","ratingValue":String(r.averageRating),"ratingCount":String(r.ratingCount),"bestRating":"5","worstRating":"1"}: undefined,
      datePublished: r.lastViewDT || r.modifiedDT,
      dateModified: r.modifiedDT
    };
    const breadcrumbSchema = {
      "@context":"https://schema.org",
      "@type":"BreadcrumbList",
      itemListElement: [
        { "@type":"ListItem", position: 1, name: "Home", item: site + '/' },
        { "@type":"ListItem", position: 2, name: "Recipes", item: site + '/recipes' },
        { "@type":"ListItem", position: 3, name: r.name, item: canonical }
      ]
    };
    writeRoute(`recipe/${slug}`, { title: r.name, description, structuredData: [recipeSchema, breadcrumbSchema] });
  } catch (e) {
    console.warn('[prerender] Failed recipe', r?.name, e.message);
  }
}

// Categories
for (const c of categories) {
  try {
    // category urls in data already absolute like /recipes/category/appetizer
    let route = c.url.replace(/^\//,'');
    const site = 'https://mechanicsofmotherhood.com';
    const categoryUrl = `${site}/${route}`;
    // Build ItemList for category (limited to first 50 to keep size reasonable)
    const categoryRecipes = recipes.filter(r=> r.recipeCategory && r.recipeCategory.name && r.recipeCategory.name.toLowerCase() === c.name.toLowerCase()).slice(0,50);
    const itemListElements = categoryRecipes.map((r,i)=> {
      const slug = extractRecipeSlug(r);
      return { "@type":"ListItem", position: i+1, url: `${site}/recipe/${slug}`, name: r.name };
    });
    const listSchema = itemListElements.length ? {
      "@context":"https://schema.org",
      "@type":"ItemList",
      name: `${c.name} Recipes`,
      itemListElement: itemListElements
    } : undefined;
    const breadcrumbSchema = {
      "@context":"https://schema.org",
      "@type":"BreadcrumbList",
      itemListElement: [
        { "@type":"ListItem", position: 1, name: "Home", item: site + '/' },
        { "@type":"ListItem", position: 2, name: "Recipes", item: site + '/recipes' },
        { "@type":"ListItem", position: 3, name: `${c.name} Recipes`, item: categoryUrl }
      ]
    };
    writeRoute(route, {
      title: `${c.name} Recipes`,
      description: `Browse ${c.name.toLowerCase()} recipes on Mechanics of Motherhood.`,
      structuredData: [listSchema, breadcrumbSchema].filter(Boolean)
    });
  } catch (e) {
    console.warn('[prerender] Failed category', c?.name, e.message);
  }
}

// Core landing pages
writeRoute('', { title: 'Mechanics of Motherhood - Engineering Better Meals', description: 'Engineering better meals for working mothers worldwide.', structuredData: [
  {
    "@context":"https://schema.org",
    "@type":"Organization",
    "@id":"https://mechanicsofmotherhood.com/#org",
    name: "Mechanics of Motherhood",
    url: "https://mechanicsofmotherhood.com/",
    logo: { "@type":"ImageObject", url: "https://mechanicsofmotherhood.com/images/logos/mom-logo.png" }
  },
  {
    "@context":"https://schema.org",
    "@type":"WebSite",
    "@id":"https://mechanicsofmotherhood.com/#website",
    url: "https://mechanicsofmotherhood.com/",
    name: "Mechanics of Motherhood",
    publisher: { "@id":"https://mechanicsofmotherhood.com/#org" },
    potentialAction: {
      "@type":"SearchAction",
      target: "https://mechanicsofmotherhood.com/recipes?search={search_term_string}",
      "query-input":"required name=search_term_string"
    }
  }
] });
writeRoute('recipes', { title: 'All Recipes', description: 'Browse all Mechanics of Motherhood recipes.' });
writeRoute('categories', { title: 'Recipe Categories', description: 'Explore recipe categories.' });

console.log('[prerender] Complete');
