#!/usr/bin/env node

/**
 * Tailwind CSS v4 Migration Preparation Script
 * 
 * This script helps prepare your MoM project for eventual Tailwind v4 upgrade
 * Run with: node scripts/prepare-v4-migration.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🔧 Preparing Mechanics of Motherhood for Tailwind CSS v4...\n');

// 1. Check for deprecated utility patterns
function checkDeprecatedUtilities() {
  console.log('📋 Checking for deprecated utility patterns...');
  
  const deprecatedPatterns = [
    { pattern: /\bbg-opacity-\d+/, replacement: 'bg-{color}/{opacity}', severity: 'error' },
    { pattern: /\btext-opacity-\d+/, replacement: 'text-{color}/{opacity}', severity: 'error' },
    { pattern: /\bflex-grow-(?!0)\d+/, replacement: 'grow-{number}', severity: 'warning' },
    { pattern: /\bflex-shrink-(?!0)\d+/, replacement: 'shrink-{number}', severity: 'warning' },
    { pattern: /\boverflow-ellipsis/, replacement: 'text-ellipsis', severity: 'warning' },
    { pattern: /\bdecoration-slice/, replacement: 'box-decoration-slice', severity: 'warning' },
    { pattern: /\bdecoration-clone/, replacement: 'box-decoration-clone', severity: 'warning' }
  ];

  const srcDir = path.join(projectRoot, 'client', 'src');
  const files = getAllJSXFiles(srcDir);
  
  let issuesFound = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    deprecatedPatterns.forEach(({ pattern, replacement, severity }) => {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`  ${severity === 'error' ? '❌' : '⚠️'} ${path.relative(projectRoot, file)}`);
        console.log(`     Found: ${matches[0]} → Use: ${replacement}`);
        issuesFound++;
      }
    });
  });
  
  if (issuesFound === 0) {
    console.log('  ✅ No deprecated utilities found!\n');
  } else {
    console.log(`  Found ${issuesFound} deprecated patterns to update\n`);
  }
}

// 2. Generate v4-ready CSS variables preview
function generateV4ThemePreview() {
  console.log('🎨 Generating v4 CSS theme preview...');
  
  const v4ThemeCSS = `
/* Tailwind CSS v4 Theme Configuration (Preview) */
/* This will replace your tailwind.config.ts */

@theme {
  /* MoM Brand Colors */
  --color-tool-gray: hsl(210 14% 40%);
  --color-industrial-blue: hsl(217 19% 27%);
  --color-kitchen-warm: hsl(0 100% 98%);
  --color-cream: hsl(37 100% 97%);
  --color-energetic-orange: hsl(0 71% 67%);
  --color-workshop-teal: hsl(177 59% 47%);
  --color-light-gray: hsl(210 20% 98%);
  --color-medium-gray: hsl(215 16% 90%);

  /* Font Families */
  --font-family-mechanical: 'Orbitron', monospace;
  --font-family-industrial: 'Roboto Condensed', sans-serif;
  --font-family-friendly: 'Inter', sans-serif;

  /* Custom Radius */
  --radius: 1.3rem;

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Future v4 CSS Structure */
@import "tailwindcss";

/* Your custom components and utilities will remain the same */
`;

  const previewPath = path.join(projectRoot, 'tailwind-v4-theme-preview.css');
  fs.writeFileSync(previewPath, v4ThemeCSS);
  console.log(`  ✅ Created: ${path.relative(projectRoot, previewPath)}\n`);
}

// 3. Create migration checklist
function createMigrationChecklist() {
  console.log('📋 Creating migration checklist...');
  
  const checklist = `# Tailwind CSS v4 Migration Checklist

## Pre-Migration (Complete these now)
- [x] Remove deprecated utilities
- [x] Use modern opacity modifiers  
- [ ] Test with latest Tailwind v3.x
- [ ] Document current custom CSS
- [ ] Backup current configuration

## During Migration
- [ ] Install Tailwind v4 packages
- [ ] Update Vite configuration
- [ ] Convert tailwind.config.ts to CSS @theme
- [ ] Update import statements
- [ ] Run migration tool
- [ ] Fix breaking changes

## Post-Migration Testing
- [ ] Test all UI components
- [ ] Verify brand colors
- [ ] Check responsive behavior
- [ ] Test dark mode (if used)
- [ ] Validate custom animations
- [ ] Test build process
- [ ] Check bundle size

## Browser Testing
- [ ] Chrome 111+
- [ ] Safari 16.4+
- [ ] Firefox 128+
- [ ] Mobile browsers

Generated on: ${new Date().toISOString()}
`;

  const checklistPath = path.join(projectRoot, 'TAILWIND_V4_CHECKLIST.md');
  fs.writeFileSync(checklistPath, checklist);
  console.log(`  ✅ Created: ${path.relative(projectRoot, checklistPath)}\n`);
}

// Utility functions
function getAllJSXFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllJSXFiles(fullPath));
    } else if (/\.(tsx?|jsx?)$/.test(item)) {
      files.push(fullPath);
    }
  });
  
  return files;
}

// Run all checks
checkDeprecatedUtilities();
generateV4ThemePreview();
createMigrationChecklist();

console.log('🎉 Preparation complete!');
console.log('\nNext steps:');
console.log('1. Review any deprecated utilities found above');
console.log('2. Check the generated preview files');
console.log('3. Test your app thoroughly with current Tailwind');
console.log('4. Monitor Tailwind v4 ecosystem maturity');
console.log('\n💡 Consider upgrading to v4 when:');
console.log('   - Your browser support requirements allow it');
console.log('   - shadcn/ui and other dependencies support v4');
console.log('   - You have bandwidth for thorough testing');
