#!/usr/bin/env node

/**
 * Category Link Validation Script
 * 
 * This script validates all category links in the MoM application to ensure:
 * 1. All categories in the static data have corresponding recipes
 * 2. All category URLs are properly formed and accessible
 * 3. No broken links exist in navigation components
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the data files
const categoriesPath = path.join(__dirname, '..', 'client', 'src', 'data', 'categories.json');
const apiDataPath = path.join(__dirname, '..', 'client', 'src', 'data', 'api-data.json');

let categories = [];
let apiData = {};

try {
  categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
  apiData = JSON.parse(fs.readFileSync(apiDataPath, 'utf8'));
} catch (error) {
  console.error('Error loading data files:', error.message);
  process.exit(1);
}

// Utility function to create slugs (matching the app's logic)
function nameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getCategorySlug(name) {
  // No special mapping since we simplified it
  return nameToSlug(name);
}

// Analyze the data
console.log('🔧 MoM Category Link Validation Report');
console.log('=====================================\n');

// Count recipes per category
const recipeCounts = {};
const recipes = apiData.recipes || [];

recipes.forEach(recipe => {
  const categoryId = recipe.recipeCategoryID;
  const categoryName = recipe.recipeCategory?.name;
  
  if (categoryName) {
    recipeCounts[categoryId] = (recipeCounts[categoryId] || 0) + 1;
  }
});

console.log('📊 Recipe Distribution by Category:');
console.log('-----------------------------------');

let totalRecipes = 0;
let categoriesWithRecipes = 0;
let categoriesWithoutRecipes = [];

categories.forEach(category => {
  const count = recipeCounts[category.id] || 0;
  const slug = getCategorySlug(category.name);
  const url = `/recipes/category/${slug}`;
  
  totalRecipes += count;
  
  if (count > 0) {
    categoriesWithRecipes++;
    console.log(`✅ ${category.name.padEnd(15)} | ${count.toString().padStart(2)} recipes | ${url}`);
  } else {
    categoriesWithoutRecipes.push({
      name: category.name,
      id: category.id,
      url: url
    });
    console.log(`❌ ${category.name.padEnd(15)} | ${count.toString().padStart(2)} recipes | ${url}`);
  }
});

console.log(`\n📈 Summary:`);
console.log(`   Total categories: ${categories.length}`);
console.log(`   Categories with recipes: ${categoriesWithRecipes}`);
console.log(`   Categories without recipes: ${categoriesWithoutRecipes.length}`);
console.log(`   Total recipes: ${totalRecipes}`);

// Check for inconsistencies
console.log('\n🔍 Potential Issues:');
console.log('--------------------');

if (categoriesWithoutRecipes.length > 0) {
  console.log(`⚠️  ${categoriesWithoutRecipes.length} categories have no recipes:`);
  categoriesWithoutRecipes.forEach(cat => {
    console.log(`   - ${cat.name} (ID: ${cat.id}) → ${cat.url}`);
  });
  console.log('   Users navigating to these URLs will see empty states.');
}

// Check for URL consistency
console.log('\n🔗 URL Validation:');
console.log('------------------');

const expectedUrls = categories.map(cat => ({
  category: cat.name,
  expectedUrl: `/recipes/category/${getCategorySlug(cat.name)}`,
  staticUrl: cat.url
}));

let urlMismatches = 0;
expectedUrls.forEach(({ category, expectedUrl, staticUrl }) => {
  if (expectedUrl !== staticUrl) {
    console.log(`⚠️  URL mismatch for "${category}":`);
    console.log(`   Static data: ${staticUrl}`);
    console.log(`   Generated:   ${expectedUrl}`);
    urlMismatches++;
  }
});

if (urlMismatches === 0) {
  console.log('✅ All category URLs are consistent');
}

// Test recipe category mappings
console.log('\n🧪 Recipe Category Mapping:');
console.log('---------------------------');

const orphanedRecipes = recipes.filter(recipe => {
  if (!recipe.recipeCategory) return true;
  return !categories.find(cat => cat.id === recipe.recipeCategoryID);
});

if (orphanedRecipes.length > 0) {
  console.log(`⚠️  ${orphanedRecipes.length} recipes have invalid category mappings:`);
  orphanedRecipes.forEach(recipe => {
    console.log(`   - "${recipe.name}" (Category ID: ${recipe.recipeCategoryID})`);
  });
} else {
  console.log('✅ All recipes have valid category mappings');
}

// Recommendations
console.log('\n💡 Recommendations:');
console.log('-------------------');

if (categoriesWithoutRecipes.length > 0) {
  console.log('1. Remove empty categories from categories.json:');
  categoriesWithoutRecipes.forEach(cat => {
    console.log(`   - Remove category "${cat.name}" (ID: ${cat.id})`);
  });
}

if (urlMismatches > 0) {
  console.log('2. Update static URLs to match generated slugs');
}

console.log('3. Test all category navigation paths manually');
console.log('4. Add automated tests for category link validation');

console.log('\n✨ Validation Complete!');

// Exit with error code if issues found
const hasIssues = categoriesWithoutRecipes.length > 0 || urlMismatches > 0 || orphanedRecipes.length > 0;
process.exit(hasIssues ? 1 : 0);
