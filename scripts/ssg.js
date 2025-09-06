#!/usr/bin/env node
/**
 * Incremental Static Site Generation script
 * Renders React routes to static HTML with dehydrated query data.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { renderToString } from 'react-dom/server';
// Enable TS/TSX on the fly
import 'esbuild-register/dist/node';
import App from '../client/src/App.tsx';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from '../client/src/lib/queryClient.ts';
import { dehydrate } from '@tanstack/react-query';
import { getRecipes, getCategories, getRecipeBySlug } from '../client/src/data/api-loader.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distRoot = path.join(projectRoot, 'dist', 'public');

if (!existsSync(path.join(distRoot, 'index.html'))) {
  console.error('[ssg] Build required before running SSG. Run npm run build:static first.');
  process.exit(1);
}
const template = readFileSync(path.join(distRoot, 'index.html'), 'utf-8');

function writeHtml(routePath, html, helmet, dehydratedState) {
  const outDir = path.join(distRoot, routePath);
  mkdirSync(outDir, { recursive: true });
  const doc = template.replace('<div id="root" role="main"></div>',
    `<div id="root" role="main">${html}</div>\n<script type="application/json" id="__INITIAL_QUERY_STATE__">${JSON.stringify(dehydratedState)}</script>`
  )
  .replace('</head>', `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}</head>`);
  writeFileSync(path.join(outDir, 'index.html'), doc, 'utf-8');
  console.log('[ssg] wrote', routePath || '/');
}

async function prefetchHome() {
  // prefetch featured content & stats endpoints if used; placeholders here
  return;
}

async function run() {
  const categories = getCategories();
  const recipes = getRecipes();

  const routes = new Set(['/','/recipes','/categories']);
  // category pages
  categories.forEach(c => { if (c.url) routes.add(c.url); });
  // recipe detail pages (limit to 300 for safety)
  recipes.slice(0,300).forEach(r => {
    let slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    if (r.recipeURL && r.recipeURL.startsWith('/recipe/')) {
      slug = r.recipeURL.replace('/recipe/','').replace(/\/$/,'');
    }
    routes.add('/recipe/' + slug);
  });

  for (const route of routes) {
    const helmetContext = {};
    // naive path inference for recipe prefetch
    if (route.startsWith('/recipe/')) {
      const slug = route.replace('/recipe/','');
      try { getRecipeBySlug(slug); } catch {}
    }
    await prefetchHome();
    const app = React.createElement(HelmetProvider, { context: helmetContext }, React.createElement(App, { ssrPath: route }));
    const html = renderToString(app);
    const dehydratedState = dehydrate(queryClient);
    const helmet = helmetContext.helmet || { title:'', meta:'', link:'' };
    const outRoute = route === '/' ? '' : route.replace(/^\//,'');
    writeHtml(outRoute, html, helmet, dehydratedState);
  }
}

run().catch(e => { console.error('[ssg] failed', e); process.exit(1); });
