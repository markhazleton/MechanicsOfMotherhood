/**
 * SEO Sitemap Generator for Mechanics of Motherhood
 * Generates XML sitemap with all pages, recipes, and categories
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration: allow override via environment for custom domain support
// If VITE_CUSTOM_DOMAIN (no protocol) provided, default to https scheme
// e.g. VITE_CUSTOM_DOMAIN=mechanicsofmotherhood.com
let customDomain = process.env.VITE_CUSTOM_DOMAIN;
if (!customDomain) {
  try {
    const cnamePath = path.join(__dirname, '../client/public/CNAME');
    if (fs.existsSync(cnamePath)) {
      const cnameContent = fs.readFileSync(cnamePath, 'utf8').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      // Prefer first non-empty line (apex) ignoring 'www.' duplicate if present
      if (cnameContent.length) {
        // Choose the shortest domain (often apex) as canonical
        cnameContent.sort((a,b)=>a.length-b.length);
        customDomain = cnameContent[0];
      }
    }
  } catch {/* ignore */}
}
const SITE_URL = customDomain
  ? `https://${customDomain.replace(/\/$/, '')}`
  : 'https://mechanicsofmotherhood.com';
const OUTPUT_PATH = path.join(__dirname, '../client/public/sitemap.xml');

// Load recipe and category data
let recipes = [];
let categories = [];

try {
  const recipesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../client/src/data/recipes.json'), 'utf8'));
  const apiData = JSON.parse(fs.readFileSync(path.join(__dirname, '../client/src/data/api-data.json'), 'utf8'));
  
  recipes = recipesData || [];
  categories = apiData.categories || [];
  
  console.log(`Loaded ${recipes.length} recipes and ${categories.length} categories`);
} catch (error) {
  console.error('Error loading data:', error);
  process.exit(1);
}

// Helper function to format date for sitemap
function formatDate(dateString) {
  if (!dateString) return new Date().toISOString().split('T')[0];
  
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

// Helper function to generate slug from name
function nameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Generate sitemap entries
function generateSitemap() {
  const urls = [];
  
  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/recipes', priority: '0.9', changefreq: 'daily' },
    { url: '/categories', priority: '0.8', changefreq: 'weekly' },
    { url: '/blog', priority: '0.7', changefreq: 'weekly' }
  ];
  
  staticPages.forEach(page => {
    urls.push({
      loc: `${SITE_URL}${page.url}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority
    });
  });
  
  // Recipe pages (fallback to derived slug if recipeURL missing)
  recipes.forEach(recipe => {
    if (!recipe || !recipe.name) return;
    let slug = '';
    if (recipe.recipeURL && recipe.recipeURL.startsWith('/recipe/')) {
      slug = recipe.recipeURL.replace('/recipe/', '').replace(/\/$/, '');
    } else {
      slug = nameToSlug(recipe.name);
    }
    if (!slug) return;
    urls.push({
      loc: `${SITE_URL}/recipe/${slug}`,
      lastmod: formatDate(recipe.modifiedDT || recipe.lastViewDT),
      changefreq: 'monthly',
      priority: '0.8'
    });
  });
  
  // Category pages (normalize provided url if present)
  categories.forEach(category => {
    if (!category || !category.name || !category.isActive) return;
    let raw = category.url || `/recipes/category/${nameToSlug(category.name)}`;
    raw = raw.replace(/https?:\/\/[^/]+/, '');
    const normalized = raw.startsWith('/') ? raw : '/' + raw;
    // TODO: when category objects include updated timestamp, replace with that value
    urls.push({
      loc: `${SITE_URL}${normalized}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.75'
    });
  });

  // De-duplicate URLs
  const seen = new Set();
  return urls.filter(u => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });
}

// Generate XML sitemap
function generateXML(urls) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  return xml;
}

// Main execution
function main() {
  try {
    console.log('Generating sitemap...');
    
    const urls = generateSitemap();
    const xml = generateXML(urls);
    
    // Ensure directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write sitemap
    fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
    
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`📊 Stats:`);
    console.log(`   - Total URLs: ${urls.length}`);
    console.log(`   - Recipes: ${recipes.length}`);
    console.log(`   - Categories: ${categories.filter(c => c.isActive).length}`);
    console.log(`   - Static pages: 4`);
    console.log(`📍 Output: ${OUTPUT_PATH}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the main function
main();

export { generateSitemap, generateXML };
