#!/usr/bin/env node

/**
 * Standalone Data Quality Validation Script
 * 
 * This script validates existing data files for quality and integrity issues.
 * It can be run independently to check data without fetching from APIs.
 * 
 * Usage:
 *   npm run validate-data
 *   node scripts/validate-data.js
 *   node scripts/validate-data.js --fix-issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DataQualityValidator } from './data-quality-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory
const DATA_DIR = path.join(__dirname, '..', 'client', 'src', 'data');
const COPILOT_DIR = path.join(__dirname, '..', 'copilot');

/**
 * Load data from JSON file
 */
function loadDataFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      return null;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`✅ Loaded ${filename}`);
    return data;
  } catch (error) {
    console.error(`❌ Failed to load ${filename}:`, error.message);
    return null;
  }
}

/**
 * Save data to JSON file
 */
function saveDataFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Saved ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to save ${filename}:`, error.message);
  }
}

/**
 * Fix common data quality issues automatically
 */
function fixDataIssues(data, validationResult) {
  console.log('🔧 Attempting to fix common data quality issues...');
  
  let fixedCount = 0;
  const { recipes, categories } = data;
  
  if (!recipes || !categories) {
    console.log('❌ Cannot fix issues: missing recipes or categories data');
    return { fixedCount: 0, data };
  }

  // Create category map for lookups
  const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
  const activeCategoryIds = new Set(categories.map(cat => cat.id));

  // Fix orphaned recipes by reassigning to appropriate categories
  const orphanedErrors = validationResult.errors.filter(
    error => error.category === 'categories' && error.item === 'orphaned-recipe'
  );

  orphanedErrors.forEach(error => {
    const { recipeId, recipeName, categoryId } = error.details;
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (recipe) {
      // Try to find an appropriate category based on recipe name/type
      let newCategoryId = null;
      
      const recipeLower = recipeName.toLowerCase();
      
      // Simple heuristics for category assignment
      if (recipeLower.includes('dip') || recipeLower.includes('appetizer')) {
        newCategoryId = categories.find(cat => cat.name.toLowerCase().includes('appetizer'))?.id;
      } else if (recipeLower.includes('dessert') || recipeLower.includes('cake') || recipeLower.includes('cookie')) {
        newCategoryId = categories.find(cat => cat.name.toLowerCase().includes('dessert'))?.id;
      } else if (recipeLower.includes('soup') || recipeLower.includes('stew')) {
        newCategoryId = categories.find(cat => cat.name.toLowerCase().includes('soup'))?.id;
      } else if (recipeLower.includes('salad')) {
        newCategoryId = categories.find(cat => cat.name.toLowerCase().includes('salad'))?.id;
      } else if (recipeLower.includes('main') || recipeLower.includes('dinner') || recipeLower.includes('chicken') || recipeLower.includes('beef')) {
        newCategoryId = categories.find(cat => cat.name.toLowerCase().includes('main') || cat.name.toLowerCase().includes('entree'))?.id;
      }
      
      // If no specific match, assign to first available category
      if (!newCategoryId && categories.length > 0) {
        newCategoryId = categories[0].id;
      }
      
      if (newCategoryId && activeCategoryIds.has(newCategoryId)) {
        console.log(`   🔧 Fixed orphaned recipe: "${recipeName}" (${recipeId}) moved from category ${categoryId} to ${newCategoryId}`);
        recipe.recipeCategoryID = newCategoryId;
        
        // Update the category object reference if it exists
        const newCategory = categoryMap.get(newCategoryId);
        if (newCategory) {
          recipe.recipeCategory = {
            id: newCategory.id,
            name: newCategory.name,
            description: newCategory.description || ''
          };
        }
        
        fixedCount++;
      }
    }
  });

  // Remove recipes with missing essential data
  const originalRecipeCount = recipes.length;
  const validRecipes = recipes.filter(recipe => {
    const hasBasicData = recipe.name && recipe.name.trim() !== '';
    if (!hasBasicData) {
      console.log(`   🗑️  Removed recipe with missing name: ${recipe.id || 'unknown'}`);
      fixedCount++;
    }
    return hasBasicData;
  });

  if (validRecipes.length !== originalRecipeCount) {
    data.recipes = validRecipes;
    console.log(`   🔧 Removed ${originalRecipeCount - validRecipes.length} recipes with missing essential data`);
  }

  // Fix category URLs to use consistent format
  categories.forEach(category => {
    if (category.url && !category.url.includes('/recipes/category/')) {
      const oldUrl = category.url;
      // Generate consistent URL format
      const slug = category.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      
      category.url = `/recipes/category/${slug}`;
      console.log(`   🔧 Fixed category URL: "${category.name}" from "${oldUrl}" to "${category.url}"`);
      fixedCount++;
    }
  });

  console.log(`✅ Fixed ${fixedCount} data quality issues`);
  
  return { fixedCount, data };
}

/**
 * Main validation function
 */
async function main() {
  const args = process.argv.slice(2);
  const fixIssues = args.includes('--fix-issues') || args.includes('--fix');
  
  console.log('🔍 Starting data quality validation...');
  console.log(`📁 Data directory: ${DATA_DIR}`);
  console.log(`🔧 Fix issues: ${fixIssues ? 'YES' : 'NO'}`);
  console.log('');

  // Load all data files
  const recipes = loadDataFile('recipes.json') || [];
  const categories = loadDataFile('categories.json') || [];
  const websites = loadDataFile('websites.json') || [];
  const menuItems = loadDataFile('menu-items.json') || {};
  const apiData = loadDataFile('api-data.json');

  // Prefer combined data if available, otherwise use individual files
  let dataToValidate;
  if (apiData && apiData.recipes && apiData.categories) {
    console.log('📊 Using combined API data for validation');
    dataToValidate = apiData;
  } else {
    console.log('📊 Using individual data files for validation');
    dataToValidate = { recipes, categories, websites, menuItems };
  }

  console.log('');

  // Run validation
  const validator = new DataQualityValidator();
  const validationResult = validator.validate(dataToValidate);

  // Save validation report to copilot directory
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(COPILOT_DIR, `data-quality-report-${timestamp}.md`);
  
  // Generate markdown report
  const markdownReport = generateMarkdownReport(validationResult, dataToValidate);
  
  try {
    // Ensure copilot directory exists
    if (!fs.existsSync(COPILOT_DIR)) {
      fs.mkdirSync(COPILOT_DIR, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, markdownReport, 'utf8');
    console.log(`📄 Detailed report saved to: ${reportPath}`);
  } catch (error) {
    console.error('Failed to save markdown report:', error.message);
  }

  // Save JSON report to data directory
  const jsonReportPath = path.join(DATA_DIR, 'validation-report.json');
  await validator.saveReport(jsonReportPath, {
    validationMode: 'standalone',
    dataSource: apiData ? 'api-data.json' : 'individual-files',
    fixIssuesMode: fixIssues
  });

  // Fix issues if requested
  if (fixIssues && (validationResult.errors.length > 0 || validationResult.warnings.length > 0)) {
    console.log('');
    const { fixedCount, data: fixedData } = fixDataIssues(dataToValidate, validationResult);
    
    if (fixedCount > 0) {
      // Save fixed data
      if (apiData) {
        saveDataFile('api-data.json', fixedData);
      }
      saveDataFile('recipes.json', fixedData.recipes);
      saveDataFile('categories.json', fixedData.categories);
      
      console.log('');
      console.log('🔄 Re-running validation after fixes...');
      const postFixValidator = new DataQualityValidator();
      const postFixResult = postFixValidator.validate(fixedData);
      
      console.log('');
      console.log('📊 Post-fix validation results:');
      console.log(`   Errors: ${validationResult.errors.length} → ${postFixResult.errors.length}`);
      console.log(`   Warnings: ${validationResult.warnings.length} → ${postFixResult.warnings.length}`);
      console.log(`   Quality Score: ${validationResult.qualityScore.toFixed(1)}% → ${postFixResult.qualityScore.toFixed(1)}%`);
    }
  }

  // Exit with appropriate code
  const exitCode = validationResult.errors.length > 0 ? 1 : 0;
  console.log('');
  console.log(`✨ Validation complete! Exit code: ${exitCode}`);
  
  if (exitCode !== 0) {
    console.log('💡 Run with --fix-issues to attempt automatic fixes');
  }
  
  process.exit(exitCode);
}

/**
 * Generate a markdown report
 */
function generateMarkdownReport(validationResult, data) {
  const { errors, warnings, metrics, qualityScore } = validationResult;
  const timestamp = new Date().toISOString();

  let report = `# Data Quality Validation Report

**Generated:** ${timestamp}
**Quality Score:** ${qualityScore.toFixed(1)}%

## Summary

`;

  // Overall status
  if (errors.length === 0) {
    report += `✅ **PASSED** - No critical errors found\n\n`;
  } else {
    report += `❌ **FAILED** - ${errors.length} critical error(s) found\n\n`;
  }

  // Metrics
  report += `## Data Metrics

| Metric | Value |
|--------|-------|
`;

  Object.entries(metrics).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      report += `| ${key} | (see details below) |\n`;
    } else {
      report += `| ${key} | ${value} |\n`;
    }
  });

  // Detailed metrics for complex objects
  Object.entries(metrics).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      report += `\n### ${key}\n\n`;
      Object.entries(value).forEach(([subKey, subValue]) => {
        report += `- **${subKey}:** ${subValue}\n`;
      });
    }
  });

  // Errors
  if (errors.length > 0) {
    report += `\n## ❌ Errors (${errors.length})\n\n`;
    
    const errorsByCategory = {};
    errors.forEach(error => {
      if (!errorsByCategory[error.category]) {
        errorsByCategory[error.category] = [];
      }
      errorsByCategory[error.category].push(error);
    });

    Object.entries(errorsByCategory).forEach(([category, categoryErrors]) => {
      report += `### ${category} (${categoryErrors.length})\n\n`;
      categoryErrors.forEach(error => {
        report += `- **${error.item}:** ${error.message}\n`;
        if (Object.keys(error.details).length > 0) {
          report += `  - Details: \`${JSON.stringify(error.details)}\`\n`;
        }
      });
      report += '\n';
    });
  }

  // Warnings
  if (warnings.length > 0) {
    report += `\n## ⚠️ Warnings (${warnings.length})\n\n`;
    
    const warningsByCategory = {};
    warnings.forEach(warning => {
      if (!warningsByCategory[warning.category]) {
        warningsByCategory[warning.category] = [];
      }
      warningsByCategory[warning.category].push(warning);
    });

    Object.entries(warningsByCategory).forEach(([category, categoryWarnings]) => {
      report += `### ${category} (${categoryWarnings.length})\n\n`;
      categoryWarnings.forEach(warning => {
        report += `- **${warning.item}:** ${warning.message}\n`;
        if (Object.keys(warning.details).length > 0) {
          report += `  - Details: \`${JSON.stringify(warning.details)}\`\n`;
        }
      });
      report += '\n';
    });
  }

  // Recommendations
  report += `\n## 🎯 Recommendations\n\n`;
  
  if (errors.length === 0 && warnings.length === 0) {
    report += `🌟 Excellent! Your data quality is perfect.\n\n`;
  } else {
    if (errors.length > 0) {
      report += `### Critical Issues\n`;
      report += `- Fix ${errors.length} critical error(s) before deploying\n`;
      report += `- Run validation script with \`--fix-issues\` flag to attempt automatic fixes\n\n`;
    }
    
    if (warnings.length > 0) {
      report += `### Improvements\n`;
      report += `- Address ${warnings.length} warning(s) to improve data quality\n`;
      report += `- Consider data enrichment for missing optional fields\n\n`;
    }
  }

  report += `## 🔧 How to Fix Issues

### Automatic Fixes
\`\`\`bash
npm run validate-data -- --fix-issues
\`\`\`

### Manual Review
1. Review the errors and warnings above
2. Update the source data files in \`client/src/data/\`
3. Re-run validation: \`npm run validate-data\`
4. Re-fetch data from API: \`npm run fetch-data\`

---

*Report generated by MoM Data Quality Validator*
`;

  return report;
}

// Run the script
main().catch(console.error);
