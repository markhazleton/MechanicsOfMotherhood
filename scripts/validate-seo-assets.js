/**
 * validate-seo-assets.js
 * Ensures required SEO surface files (sitemap.xml, robots.txt, 404.html SPA fallback) exist
 * and pass a set of structural sanity checks during the build pipeline.
 *
 * Exits with non‑zero status if critical issues are detected.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../client/public');
const REQUIRED_FILES = ['sitemap.xml', 'robots.txt', '404.html'];

let hadError = false;
const warnings = [];
const errors = [];

function exists(file) {
  return fs.existsSync(path.join(PUBLIC_DIR, file));
}

function read(file) {
  return fs.readFileSync(path.join(PUBLIC_DIR, file), 'utf8');
}

function validateRobots(content) {
  if (!/User-agent:\s*\*/i.test(content)) {
    errors.push('robots.txt is missing a global User-agent: * block');
  }
  if (!/Sitemap:\s*https?:\/\//i.test(content)) {
    warnings.push('robots.txt missing absolute Sitemap URL');
  }
  // Check if the global User-agent: * block disallows root (/)
  // This should NOT flag Disallow: / for specific bad bots
  const globalBlock = content.match(/User-agent:\s*\*[\s\S]*?(?=User-agent:|$)/i);
  if (globalBlock && /Disallow:\s*\/\s*$/m.test(globalBlock[0])) {
    errors.push('robots.txt disallows root path (/) for all crawlers which would block crawling');
  }
}

function validateSitemap(content) {
  // Basic well-formedness & root element
  if (!/<urlset[\s>]/.test(content)) {
    errors.push('sitemap.xml missing <urlset> root element');
    return;
  }
  // Parse XML safe-ish
  try {
    const parser = new XMLParser({ ignoreAttributes: false, allowBooleanAttributes: true });
    const data = parser.parse(content);
    const urlset = data.urlset;
    if (!urlset) {
      errors.push('sitemap.xml parse produced no urlset object');
      return;
    }
    const urls = Array.isArray(urlset.url) ? urlset.url : (urlset.url ? [urlset.url] : []);
    if (urls.length === 0) {
      errors.push('sitemap.xml contains zero <url> entries');
    }
    // Check duplicates
    const locs = urls.map(u => u.loc).filter(Boolean);
    const dupes = locs.filter((l, i) => locs.indexOf(l) !== i);
    if (dupes.length) {
      warnings.push(`sitemap.xml has duplicate <loc> values (first 3 shown): ${[...new Set(dupes)].slice(0,3).join(', ')}`);
    }
    // Ensure homepage present
    if (!locs.some(l => /https?:\/\/[^/]+\/?$/.test(l))) {
      warnings.push('sitemap.xml does not appear to include a homepage URL');
    }
    // Spot-check recipe path style consistency
    const recipePaths = locs.filter(l => /\/recipe\//.test(l));
    const legacyPlural = locs.filter(l => /\/recipes\/.+\.html$/.test(l));
    if (legacyPlural.length) {
      warnings.push('Found legacy .html recipe URLs – consider canonical cleanup');
    }
    if (recipePaths.length === 0) {
      warnings.push('No /recipe/ URLs found in sitemap – check generation logic');
    }
  } catch (e) {
    errors.push('Failed to parse sitemap.xml: ' + e.message);
  }
}

function validate404(content) {
  // Ensure the SPA redirect logic exists
  if (!/window\.location\.replace\(/.test(content) || !/knownPattern/.test(content)) {
    warnings.push('404.html missing SPA redirect logic pattern check');
  }
  if (!/meta name="robots" content="noindex"/i.test(content)) {
    warnings.push('404.html missing <meta name="robots" content="noindex">');
  }
}

function main() {
  console.log('🔍 Validating SEO surface assets...');

  // Presence check
  for (const f of REQUIRED_FILES) {
    if (!exists(f)) {
      errors.push(`Missing required file: ${f}`);
    }
  }

  if (exists('robots.txt')) {
    try { validateRobots(read('robots.txt')); } catch (e) { errors.push('robots.txt read failed: ' + e.message); }
  }
  if (exists('sitemap.xml')) {
    try { validateSitemap(read('sitemap.xml')); } catch (e) { errors.push('sitemap.xml read failed: ' + e.message); }
  }
  if (exists('404.html')) {
    try { validate404(read('404.html')); } catch (e) { errors.push('404.html read failed: ' + e.message); }
  }

  if (warnings.length) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(w => console.log('  - ' + w));
  }
  if (errors.length) {
    console.error('\n❌ Errors:');
    errors.forEach(er => console.error('  - ' + er));
    hadError = true;
  }

  if (hadError) {
    console.error('\nSEO asset validation failed.');
    process.exit(1);
  } else {
    console.log('\n✅ SEO asset validation passed.');
  }
}

// Attempt to lazy install fast-xml-parser if not found
(async () => {
  try {
    // already imported earlier – if this file runs, dependency exists
    main();
  } catch (e) {
    if (/Cannot find module 'fast-xml-parser'/.test(e.message)) {
      console.log('Installing fast-xml-parser dependency...');
      const { execSync } = await import('child_process');
      try {
        execSync('npm install fast-xml-parser --no-audit --no-fund', { stdio: 'inherit' });
        console.log('Dependency installed, rerunning validation...');
        // Re-import after install
        main();
      } catch (installErr) {
        console.error('Failed to install fast-xml-parser:', installErr.message);
        process.exit(1);
      }
    } else {
      throw e;
    }
  }
})();
