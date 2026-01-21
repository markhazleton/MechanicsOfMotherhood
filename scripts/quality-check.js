#!/usr/bin/env node
/**
 * Comprehensive Quality Check Script
 * Runs multiple quality checks to ensure site stability and quality
 */

import { execSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const checks = [];
let hasErrors = false;

function runCheck(name, command, options = {}) {
  const check = { name, status: 'running', output: '', error: null };
  checks.push(check);
  
  console.log(`\n🔍 ${name}...`);
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
    
    check.status = 'passed';
    check.output = output;
    console.log(`✅ ${name} - PASSED`);
    return true;
  } catch (error) {
    check.status = 'failed';
    check.error = error.message;
    
    if (options.allowFailure) {
      console.warn(`⚠️  ${name} - WARNING: ${error.message}`);
      return true;
    }
    
    console.error(`❌ ${name} - FAILED`);
    hasErrors = true;
    return false;
  }
}

function checkFileSize(name, filePath, maxSizeKB) {
  console.log(`\n📊 ${name}...`);
  
  if (!existsSync(filePath)) {
    console.warn(`⚠️  ${name} - File not found: ${filePath}`);
    return true;
  }
  
  const stats = statSync(filePath);
  const sizeKB = stats.size / 1024;
  
  if (sizeKB > maxSizeKB) {
    console.error(`❌ ${name} - Size ${sizeKB.toFixed(2)}KB exceeds ${maxSizeKB}KB`);
    hasErrors = true;
    return false;
  }
  
  console.log(`✅ ${name} - ${sizeKB.toFixed(2)}KB (limit: ${maxSizeKB}KB)`);
  return true;
}

function checkBundleSize() {
  console.log(`\n📦 Checking bundle sizes...`);
  
  const distPath = 'dist/public/assets';
  if (!existsSync(distPath)) {
    console.warn(`⚠️  Build output not found. Run 'npm run build' first.`);
    return true;
  }
  
  // Check main vendor bundle
  const vendorPattern = /vendor-.*\.js$/;
  const pagePattern = /page-.*\.js$/;
  
  try {
    const fs = await import('fs');
    const files = fs.readdirSync(distPath);
    
    let totalSize = 0;
    let largeChunks = [];
    
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = join(distPath, file);
        const stats = statSync(filePath);
        const sizeKB = stats.size / 1024;
        totalSize += sizeKB;
        
        // Warn about chunks larger than 300KB
        if (sizeKB > 300) {
          largeChunks.push({ file, sizeKB: sizeKB.toFixed(2) });
        }
      }
    });
    
    console.log(`📊 Total JS bundle size: ${totalSize.toFixed(2)}KB`);
    
    if (largeChunks.length > 0) {
      console.warn(`⚠️  Large chunks detected:`);
      largeChunks.forEach(chunk => {
        console.warn(`   - ${chunk.file}: ${chunk.sizeKB}KB`);
      });
    }
    
    // Check against performance budget
    if (totalSize > 1024) {
      console.error(`❌ Total bundle size ${totalSize.toFixed(2)}KB exceeds 1MB budget`);
      hasErrors = true;
      return false;
    }
    
    console.log(`✅ Bundle sizes within acceptable limits`);
    return true;
  } catch (error) {
    console.warn(`⚠️  Could not analyze bundle sizes: ${error.message}`);
    return true;
  }
}

async function runQualityChecks() {
  console.log('🚀 Running Mechanics of Motherhood Quality Checks\n');
  console.log('=' .repeat(60));
  
  // 1. TypeScript Type Checking
  runCheck('TypeScript Compilation', 'npm run check');
  
  // 2. ESLint
  runCheck('ESLint (Code Quality)', 'npm run lint');
  
  // 3. Unit Tests
  runCheck('Unit Tests', 'npm run test');
  
  // 4. Test Coverage
  runCheck('Test Coverage Report', 'npm run test:coverage', { 
    allowFailure: true,
    silent: true 
  });
  
  // 5. Security Audit
  console.log(`\n🔒 Security Audit...`);
  try {
    execSync('npm audit --audit-level=high', { encoding: 'utf8', stdio: 'inherit' });
    console.log(`✅ Security Audit - No high/critical vulnerabilities`);
  } catch (error) {
    console.warn(`⚠️  Security Audit - Found vulnerabilities. Run 'npm audit fix' to resolve.`);
  }
  
  // 6. Data Validation
  runCheck('API Data Validation', 'npm run validate-data', { allowFailure: true });
  
  // 7. SEO Assets Validation
  runCheck('SEO Assets Validation', 'npm run validate:seo', { allowFailure: true });
  
  // 8. Build Test
  console.log(`\n🏗️  Production Build Test...`);
  try {
    execSync('npm run build:static', { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ Production Build - SUCCESS`);
  } catch (error) {
    console.error(`❌ Production Build - FAILED`);
    hasErrors = true;
  }
  
  // 9. Bundle Size Analysis
  await checkBundleSize();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📋 Quality Check Summary\n');
  
  const passed = checks.filter(c => c.status === 'passed').length;
  const failed = checks.filter(c => c.status === 'failed').length;
  const total = checks.length;
  
  console.log(`Total Checks: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (hasErrors) {
    console.log('\n❌ Quality checks failed. Please fix the issues above.');
    process.exit(1);
  } else {
    console.log('\n✅ All quality checks passed! Site is ready for deployment.');
    process.exit(0);
  }
}

// Run the checks
runQualityChecks().catch(error => {
  console.error('Fatal error running quality checks:', error);
  process.exit(1);
});
