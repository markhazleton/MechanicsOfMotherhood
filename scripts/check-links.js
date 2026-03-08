#!/usr/bin/env node
/**
 * Dead Link Checker
 * Checks for broken internal links in built HTML files
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, relative } from 'path';
import { pathToFileURL } from 'url';

const links = new Set();
const existingPaths = new Set();
const brokenLinks = [];
export const CLIENT_SIDE_ROUTES = ['/recipe/', '/recipes/category/', '/recipes', '/categories', '/blog'];

export function toRoutePath(distPath, fullPath, isHtmlFile = false) {
  let relativePath = `/${relative(distPath, fullPath).replace(/\\/g, '/')}`;
  if (isHtmlFile) {
    relativePath = relativePath.replace('/index.html', '');
  }
  return relativePath || '/';
}

export function filterActualBrokenLinks(linksToCheck) {
  return linksToCheck.filter(link =>
    !CLIENT_SIDE_ROUTES.some(route => link.startsWith(route))
  );
}

function extractLinks(html) {
  const linkRegex = /href=["']([^"']+)["']/gi;
  const matches = html.matchAll(linkRegex);
  
  for (const match of matches) {
    const url = match[1];
    
    // Only check internal links
    if (!url.startsWith('http') && !url.startsWith('//') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
      // Clean up the URL
      let cleanUrl = url.split('#')[0].split('?')[0];
      if (cleanUrl) {
        links.add(cleanUrl);
      }
    }
  }
}

function scanDirectory(dir, distPath) {
  const items = readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = join(dir, item);
    const stats = statSync(fullPath);
    
    if (stats.isDirectory()) {
      const relativePath = toRoutePath(distPath, fullPath);
      existingPaths.add(relativePath);
      existingPaths.add(relativePath + '/');
      scanDirectory(fullPath, distPath);
    } else if (item.endsWith('.html')) {
      const html = readFileSync(fullPath, 'utf8');
      extractLinks(html);
      
      // Add this file's path as existing
      const relativePath = toRoutePath(distPath, fullPath, true);
      existingPaths.add(relativePath);
      existingPaths.add(relativePath + '/');
    }
  });
}

function checkLinks(distPath) {
  console.log('🔗 Checking for broken internal links...\n');
  console.log('=' .repeat(60));
  
  if (!existsSync(distPath)) {
    console.error('❌ Build output not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  // Scan all HTML files
  console.log('📊 Scanning HTML files...');
  scanDirectory(distPath, distPath);
  
  console.log(`\nℹ️  Found ${links.size} internal links`);
  console.log(`ℹ️  Found ${existingPaths.size} existing paths`);
  
  // Check each link
  console.log('\n🔍 Verifying links...\n');
  
  links.forEach(link => {
    let found = false;
    
    // Try exact match
    if (existingPaths.has(link)) {
      found = true;
    }
    
    // Try with trailing slash
    if (!found && existingPaths.has(link + '/')) {
      found = true;
    }
    
    // Try without trailing slash
    if (!found && link.endsWith('/') && existingPaths.has(link.slice(0, -1))) {
      found = true;
    }
    
    // Try as index.html
    if (!found) {
      const indexPath = link.endsWith('/') ? link + 'index.html' : link + '/index.html';
      if (existsSync(join(distPath, indexPath.replace(/^\//, '')))) {
        found = true;
      }
    }
    
    // Check if file exists directly
    if (!found) {
      const filePath = join(distPath, link.replace(/^\//, ''));
      if (existsSync(filePath)) {
        found = true;
      }
    }
    
    if (!found) {
      brokenLinks.push(link);
    }
  });
  
  // Summary
  console.log('=' .repeat(60));
  console.log('\n📋 Link Check Summary\n');
  
  if (brokenLinks.length === 0) {
    console.log(`✅ All ${links.size} internal links are valid!`);
    process.exit(0);
  } else {
    console.log(`⚠️  Found ${brokenLinks.length} potentially broken link(s):\n`);
    brokenLinks.forEach(link => {
      console.log(`   ❌ ${link}`);
    });
    
    console.log('\n💡 Note: Some links may be handled by client-side routing (wouter)');
    console.log('   and may not have corresponding HTML files. This is expected for:');
    console.log('   - Dynamic recipe pages (/recipe/:slug)');
    console.log('   - Dynamic category pages (/recipes/category/:slug)');
    console.log('   - Other client-side routed pages');
    
    // Don't fail the build for client-side routed links
    const actualBroken = filterActualBrokenLinks(brokenLinks);
    
    if (actualBroken.length > 0) {
      console.log(`\n⚠️  ${actualBroken.length} link(s) may need attention`);
      process.exit(1);
    } else {
      console.log('\n✅ All broken links are client-side routed (expected behavior)');
      process.exit(0);
    }
  }
}

const distPath = 'dist/public';
const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  checkLinks(distPath);
}
