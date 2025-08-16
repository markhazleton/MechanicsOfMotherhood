#!/usr/bin/env node

import { rmSync, existsSync } from 'fs';
import { glob } from 'glob';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Directories to remove
const dirsToRemove = [
  'dist',
  'build',
  '.cache',
  '.parcel-cache',
  '.next',
  '.nuxt',
  'out',
  'tmp',
  'temp',
  'coverage',
  '.nyc_output',
  'storybook-static',
  '.turbo',
  '.vercel'
];

// File patterns to remove
const filePatterns = [
  '*.log',
  '*.pid',
  '*.seed',
  '*.tsbuildinfo',
  '.eslintcache',
  '*.tmp',
  '*.temp',
  '.DS_Store',
  'Thumbs.db'
];

console.log('🧹 Cleaning build products and temporary files...\n');

let removedCount = 0;

// Remove directories
console.log('📁 Checking directories:');
dirsToRemove.forEach(dir => {
  const fullPath = join(rootDir, dir);
  if (existsSync(fullPath)) {
    try {
      rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ Removed directory: ${dir}`);
      removedCount++;
    } catch (error) {
      console.log(`❌ Failed to remove directory ${dir}:`, error.message);
    }
  } else {
    console.log(`⏭️  Directory not found: ${dir}`);
  }
});

// Remove files matching patterns
console.log('\n📄 Checking file patterns:');
for (const pattern of filePatterns) {
  try {
    const files = glob.sync(pattern, { 
      cwd: rootDir,
      dot: true,
      ignore: ['node_modules/**']
    });
    
    if (files.length > 0) {
      files.forEach(file => {
        const fullPath = join(rootDir, file);
        try {
          rmSync(fullPath, { force: true });
          console.log(`✅ Removed file: ${file}`);
          removedCount++;
        } catch (error) {
          console.log(`❌ Failed to remove file ${file}:`, error.message);
        }
      });
    } else {
      console.log(`⏭️  No files found matching: ${pattern}`);
    }
  } catch (error) {
    console.log(`❌ Failed to glob pattern ${pattern}:`, error.message);
  }
}

console.log(`\n🎉 Clean completed! Removed ${removedCount} items.`);
console.log('\n💡 Use "npm run clean:all" to also remove node_modules and package-lock.json');
