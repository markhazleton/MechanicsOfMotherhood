#!/usr/bin/env node
/**
 * Basic Accessibility Check Script
 * Performs basic accessibility checks on built HTML files
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const issues = [];

function checkAccessibility(htmlPath, fileName) {
  if (!existsSync(htmlPath)) {
    console.warn(`⚠️  File not found: ${htmlPath}`);
    return;
  }
  
  const html = readFileSync(htmlPath, 'utf8');
  const fileIssues = [];
  
  // Check for missing lang attribute
  if (!html.match(/<html[^>]*\slang=/i)) {
    fileIssues.push('Missing lang attribute on <html> tag');
  }
  
  // Check for images without alt attributes
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  imgMatches.forEach(img => {
    if (!img.match(/alt=/i)) {
      fileIssues.push(`Image without alt attribute: ${img.substring(0, 50)}...`);
    }
  });
  
  // Check for empty alt on decorative images
  const emptyAltImages = html.match(/<img[^>]*alt=["']["'][^>]*>/gi) || [];
  if (emptyAltImages.length > 0) {
    console.log(`ℹ️  Found ${emptyAltImages.length} images with empty alt (decorative)`);
  }
  
  // Check for proper heading structure
  const headings = html.match(/<h[1-6][^>]*>/gi) || [];
  if (headings.length === 0) {
    fileIssues.push('No heading tags found');
  }
  
  // Check for missing main landmark
  if (!html.match(/<main[^>]*>/i) && !html.match(/role=["']main["']/i)) {
    fileIssues.push('Missing <main> landmark');
  }
  
  // Check for buttons/links without text
  const buttons = html.match(/<button[^>]*>[\s]*<\/button>/gi) || [];
  if (buttons.length > 0) {
    fileIssues.push(`Found ${buttons.length} button(s) without text content`);
  }
  
  // Check for form inputs without labels
  const inputs = html.match(/<input[^>]*type=["'](text|email|password|search|tel)["'][^>]*>/gi) || [];
  inputs.forEach(input => {
    const hasId = input.match(/id=["']([^"']+)["']/);
    if (hasId) {
      const id = hasId[1];
      const hasLabel = html.includes(`for="${id}"`);
      if (!hasLabel) {
        fileIssues.push(`Input with id="${id}" has no associated label`);
      }
    }
  });
  
  if (fileIssues.length > 0) {
    issues.push({ file: fileName, issues: fileIssues });
  }
  
  return fileIssues.length;
}

function runA11yChecks() {
  console.log('♿ Running Basic Accessibility Checks\n');
  console.log('=' .repeat(60));
  
  const distPath = 'dist/public';
  
  if (!existsSync(distPath)) {
    console.error('❌ Build output not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  // Check index.html
  console.log('\n📄 Checking index.html...');
  checkAccessibility(join(distPath, 'index.html'), 'index.html');
  
  // Check other HTML files
  const checkDir = (dir, basePath = '') => {
    const files = readdirSync(join(distPath, dir));
    files.forEach(file => {
      const fullPath = join(dir, file);
      const filePath = join(distPath, fullPath);
      
      if (file.endsWith('.html') && file !== 'index.html') {
        console.log(`📄 Checking ${fullPath}...`);
        checkAccessibility(filePath, fullPath);
      }
    });
  };
  
  // Check common routes
  ['recipes', 'categories', 'blog'].forEach(route => {
    const routePath = join(distPath, route);
    if (existsSync(routePath)) {
      checkDir(route);
    }
  });
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📋 Accessibility Check Summary\n');
  
  if (issues.length === 0) {
    console.log('✅ No accessibility issues found!');
    console.log('\nNote: This is a basic check. For comprehensive accessibility testing:');
    console.log('  - Use axe DevTools browser extension');
    console.log('  - Run Lighthouse accessibility audit');
    console.log('  - Test with screen readers');
    process.exit(0);
  } else {
    console.log(`⚠️  Found accessibility issues in ${issues.length} file(s):\n`);
    issues.forEach(({ file, issues: fileIssues }) => {
      console.log(`\n📄 ${file}:`);
      fileIssues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    });
    
    console.log('\n💡 Recommendations:');
    console.log('  - Ensure all images have descriptive alt text');
    console.log('  - Use semantic HTML elements');
    console.log('  - Add ARIA labels where needed');
    console.log('  - Test with keyboard navigation');
    console.log('  - Verify color contrast ratios');
    
    process.exit(1);
  }
}

runA11yChecks();
