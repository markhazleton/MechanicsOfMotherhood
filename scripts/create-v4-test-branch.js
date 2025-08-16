#!/usr/bin/env node

/**
 * Creates a test branch for Tailwind CSS v4 migration
 * Run with: npm run create-v4-test-branch
 */

import { execSync } from 'child_process';

console.log('🔧 Creating Tailwind CSS v4 test branch...\n');

try {
  // Create and switch to test branch
  console.log('📦 Creating branch: tailwind-v4-test');
  execSync('git checkout -b tailwind-v4-test', { stdio: 'inherit' });

  console.log('\n✅ Test branch created successfully!');
  console.log('\nNext steps for v4 testing:');
  console.log('1. npm install tailwindcss@next @tailwindcss/vite@next');
  console.log('2. Update vite.config.ts to use @tailwindcss/vite');
  console.log('3. Convert tailwind.config.ts to CSS @theme directive');
  console.log('4. Update import in index.css');
  console.log('5. Test thoroughly');
  console.log('\nTo return to main: git checkout main');

} catch (error) {
  console.error('❌ Error creating test branch:', error.message);
  console.log('\n💡 Make sure you have committed your current changes first');
}
