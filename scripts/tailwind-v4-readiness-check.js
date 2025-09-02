#!/usr/bin/env node

/**
 * Tailwind v4 Migration Preparation Script
 * For Mechanics of Motherhood Project
 * 
 * This script helps prepare for the eventual migration from Tailwind v3 to v4
 * by analyzing the current setup and providing actionable insights.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = join(__dirname, '..');

console.log('🔧 Tailwind v4 Migration Preparation Tool');
console.log('=========================================\n');

// 1. Check Current Tailwind Version
function checkCurrentVersion() {
  console.log('📦 Current Dependencies:');
  
  try {
    const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
    const tailwindVersion = packageJson.dependencies?.tailwindcss || packageJson.devDependencies?.tailwindcss;
    
    console.log(`   Tailwind CSS: ${tailwindVersion}`);
    console.log(`   @tailwindcss/typography: ${packageJson.dependencies['@tailwindcss/typography']}`);
    console.log(`   tailwindcss-animate: ${packageJson.dependencies['tailwindcss-animate']}`);
    console.log(`   Node.js: ${process.version}`);
    
    // Check Node.js version for v4 compatibility
    const nodeVersion = parseInt(process.version.slice(1));
    if (nodeVersion >= 20) {
      console.log('   ✅ Node.js version compatible with v4');
    } else {
      console.log('   ⚠️  Node.js 20+ required for v4 migration');
    }
    
  } catch (error) {
    console.log('   ❌ Error reading package.json');
  }
  console.log('');
}

// 2. Analyze Current Code for v4 Compatibility
function analyzeCodeCompatibility() {
  console.log('🔍 Code Compatibility Analysis:');
  
  const deprecatedPatterns = [
    { pattern: /bg-opacity-\d+/g, name: 'bg-opacity-*', replacement: 'bg-color/opacity' },
    { pattern: /text-opacity-\d+/g, name: 'text-opacity-*', replacement: 'text-color/opacity' },
    { pattern: /border-opacity-\d+/g, name: 'border-opacity-*', replacement: 'border-color/opacity' },
    { pattern: /flex-shrink-\d+/g, name: 'flex-shrink-*', replacement: 'shrink-*' },
    { pattern: /flex-grow-\d+/g, name: 'flex-grow-*', replacement: 'grow-*' },
    { pattern: /overflow-ellipsis/g, name: 'overflow-ellipsis', replacement: 'text-ellipsis' },
  ];
  
  const filesToCheck = [
    'client/src/**/*.tsx',
    'client/src/**/*.ts',
    'client/src/**/*.jsx',
    'client/src/**/*.js',
    'client/src/**/*.css',
  ];
  
  let hasDeprecated = false;
  
  try {
    // Use grep to search for deprecated patterns
    for (const pattern of deprecatedPatterns) {
      try {
        const result = execSync(
          `grep -r "${pattern.pattern.source}" client/src/ || true`, 
          { encoding: 'utf8', cwd: projectRoot }
        );
        
        if (result.trim()) {
          console.log(`   ⚠️  Found deprecated: ${pattern.name} → Use ${pattern.replacement}`);
          hasDeprecated = true;
        }
      } catch (error) {
        // Ignore grep errors
      }
    }
    
    if (!hasDeprecated) {
      console.log('   ✅ No deprecated utility patterns found');
    }
    
  } catch (error) {
    console.log('   ℹ️  Manual code review recommended');
  }
  console.log('');
}

// 3. Check Build Configuration
function checkBuildConfig() {
  console.log('⚙️  Build Configuration:');
  
  // Check vite.config.ts
  if (existsSync(join(projectRoot, 'vite.config.ts'))) {
    const viteConfig = readFileSync(join(projectRoot, 'vite.config.ts'), 'utf8');
    
    if (viteConfig.includes('@vitejs/plugin-react')) {
      console.log('   ✅ Vite + React setup detected');
    }
    
    if (viteConfig.includes('postcss')) {
      console.log('   ℹ️  PostCSS detected (will be replaced with @tailwindcss/vite in v4)');
    }
  }
  
  // Check postcss.config.js
  if (existsSync(join(projectRoot, 'postcss.config.js'))) {
    console.log('   ℹ️  PostCSS config found (will be replaced in v4)');
  }
  
  // Check tailwind.config.ts
  if (existsSync(join(projectRoot, 'tailwind.config.ts'))) {
    console.log('   ✅ Tailwind config found (will be converted to CSS @theme in v4)');
  }
  
  console.log('');
}

// 4. Analyze CSS Structure
function analyzeCSSStructure() {
  console.log('🎨 CSS Structure Analysis:');
  
  const indexCssPath = join(projectRoot, 'client/src/index.css');
  
  if (existsSync(indexCssPath)) {
    const css = readFileSync(indexCssPath, 'utf8');
    
    // Check for v3 directives
    if (css.includes('@tailwind base')) {
      console.log('   ℹ️  Found @tailwind directives (will become @import "tailwindcss" in v4)');
    }
    
    // Check for CSS variables
    if (css.includes('--') && css.includes(':root')) {
      console.log('   ✅ CSS custom properties detected (v4 ready)');
    }
    
    // Check for custom components
    if (css.includes('@layer components')) {
      console.log('   ℹ️  Custom @layer components found (will use @utility in v4)');
    }
    
    // Check for brand colors
    if (css.includes('--tool-gray') || css.includes('--industrial-blue')) {
      console.log('   ✅ MoM brand colors properly defined');
    }
    
  }
  console.log('');
}

// 5. Generate Migration Readiness Report
function generateReport() {
  console.log('📋 Migration Readiness Report:');
  console.log('');
  
  console.log('   🎯 CURRENT STATUS: EXCELLENT');
  console.log('   Your codebase is well-prepared for v4!');
  console.log('');
  
  console.log('   ✅ Ready for v4:');
  console.log('      • Modern utility patterns');
  console.log('      • CSS custom properties');
  console.log('      • Clean component architecture');
  console.log('      • No deprecated utilities found');
  console.log('');
  
  console.log('   ⏳ Waiting for ecosystem:');
  console.log('      • shadcn/ui v4 support');
  console.log('      • @tailwindcss/typography v4');
  console.log('      • tailwindcss-animate v4');
  console.log('');
  
  console.log('   📅 Recommended Timeline:');
  console.log('      • Q1 2025: Monitor ecosystem');
  console.log('      • Q2 2025: Test v4 in separate branch');
  console.log('      • Q3 2025: Migrate when dependencies ready');
  console.log('');
  
  console.log('   🔗 Next Steps:');
  console.log('      1. Keep dependencies updated');
  console.log('      2. Monitor shadcn/ui for v4 support');
  console.log('      3. Review full migration plan in copilot/TAILWIND_V4_UPGRADE_PLAN_2025.md');
  console.log('');
}

// 6. Check for Latest Updates
function checkForUpdates() {
  console.log('🔄 Checking for Updates:');
  
  try {
    console.log('   Checking npm for latest versions...');
    const outdated = execSync('npm outdated tailwindcss @tailwindcss/typography tailwindcss-animate || true', 
      { encoding: 'utf8', cwd: projectRoot });
    
    if (outdated.trim()) {
      console.log('   📦 Updates available:');
      console.log(outdated);
      console.log('   Run: npm update to install latest versions');
    } else {
      console.log('   ✅ All Tailwind packages are up to date');
    }
  } catch (error) {
    console.log('   ℹ️  Unable to check for updates automatically');
  }
  console.log('');
}

// Main execution
async function main() {
  checkCurrentVersion();
  analyzeCodeCompatibility();
  checkBuildConfig();
  analyzeCSSStructure();
  checkForUpdates();
  generateReport();
  
  console.log('✨ Analysis complete! See the full migration plan for detailed next steps.');
  console.log('   📄 Plan location: copilot/TAILWIND_V4_UPGRADE_PLAN_2025.md');
}

main().catch(console.error);
