import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DataQualityValidator } from './data-quality-validator.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Configuration
const RECIPE_API_BASE = process.env.RECIPE_API_BASE || 'https://webspark.markhazleton.com/api/recipespark';
const WEBCMS_API_BASE = process.env.WEBCMS_API_BASE || 'https://webspark.markhazleton.com/api/WebCMS';
const AUTH_TOKEN = process.env.WEBCMS_AUTH_TOKEN || 'MARKHAZLETON-WEB';

// Output directory for static data
const DATA_DIR = path.join(__dirname, '..', 'client', 'src', 'data');

/**
 * Fetch data from an API endpoint with error handling
 */
async function fetchData(url, headers = {}) {
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different API response formats
    if (data.success !== undefined) {
      // WebCMS API format
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }
      return data.data;
    } else if (data.data !== undefined) {
      // RecipeSpark API format
      return data.data;
    } else {
      // Direct data
      return data;
    }
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error.message);
    return null;
  }
}

/**
 * Fetch all recipes with pagination
 */
async function fetchAllRecipes() {
  const allRecipes = [];
  let page = 1;
  const pageSize = 100; // Max page size
  
  console.log('Fetching recipes...');
  
  while (true) {
    const url = `${RECIPE_API_BASE}/recipes?pageNumber=${page}&pageSize=${pageSize}`;
    const response = await fetchData(url);
    
    if (!response) {
      console.warn(`Failed to fetch recipes page ${page}, stopping pagination`);
      break;
    }
    
    // Handle paginated response
    if (Array.isArray(response)) {
      allRecipes.push(...response);
      if (response.length < pageSize) break;
    } else if (response.items) {
      allRecipes.push(...response.items);
      if (response.items.length < pageSize || page >= response.totalPages) break;
    } else {
      console.warn('Unexpected response format for recipes');
      break;
    }
    
    page++;
    console.log(`Fetched ${allRecipes.length} recipes so far...`);
  }
  
  console.log(`Total recipes fetched: ${allRecipes.length}`);
  return allRecipes;
}

/**
 * Fetch all categories
 */
async function fetchAllCategories() {
  console.log('Fetching categories...');
  
  const url = `${RECIPE_API_BASE}/categories`;
  const categories = await fetchData(url);
  
  if (!categories) {
    console.warn('Failed to fetch categories');
    return [];
  }
  
  console.log(`Total categories fetched: ${Array.isArray(categories) ? categories.length : 'unknown'}`);
  return Array.isArray(categories) ? categories : [];
}

/**
 * Fetch specific website (ID 2) from WebCMS API
 */
async function fetchWebsites() {
  if (!AUTH_TOKEN) {
    console.warn('No WebCMS auth token provided, skipping websites fetch');
    return [];
  }
  
  console.log('Fetching website (ID: 2)...');
  
  const headers = {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Accept': 'application/json'
  };
  
  const url = `${WEBCMS_API_BASE}/websites/2`;
  const website = await fetchData(url, headers);
  
  if (!website) {
    console.warn('Failed to fetch website (ID: 2)');
    return [];
  }
  
  console.log(`Website fetched: ${website.name || website.siteName || 'Unknown'}`);
  return [website]; // Return as array to maintain compatibility
}

/**
 * Fetch menu items for a specific website
 */
async function fetchMenuItems(websiteId) {
  if (!AUTH_TOKEN) {
    return [];
  }
  
  console.log(`Fetching menu items for website ${websiteId}...`);
  
  const headers = {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Accept': 'application/json'
  };
  
  const url = `${WEBCMS_API_BASE}/websites/${websiteId}/menu-hierarchy`;
  const menuItems = await fetchData(url, headers);
  
  if (!menuItems) {
    console.warn(`Failed to fetch menu items for website ${websiteId}`);
    return [];
  }
  
  return Array.isArray(menuItems) ? menuItems : [];
}

/**
 * Save data to JSON file
 */
function saveDataFile(filename, data) {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    const filePath = path.join(DATA_DIR, filename);
    const jsonData = JSON.stringify(data, null, 2);
    
    fs.writeFileSync(filePath, jsonData, 'utf8');
    console.log(`✅ Saved ${filename} (${Array.isArray(data) ? data.length : 'N/A'} items)`);
  } catch (error) {
    console.error(`❌ Failed to save ${filename}:`, error.message);
  }
}

/**
 * Generate TypeScript types for the fetched data
 * 
 * Note: Using fixed type definitions that match the immutable API structure.
 * This ensures predictable builds and stable TypeScript compilation.
 * All API properties are marked as optional to handle API variations gracefully.
 */
function generateTypes(recipes, categories, websites) {
  const typesContent = `// Auto-generated types from API data
// Generated on ${new Date().toISOString()}

export interface Recipe {
  id: number;
  name: string;
  description?: string;
  ingredients?: string;
  instructions?: string;
  servings?: number;
  authorNM?: string;
  recipeCategoryID?: number;
  recipeCategory?: {
    id: number;
    name: string;
    description?: string;
    order?: number;
    isActive?: boolean;
    recipes?: any[];
    url?: string;
    domainID?: number;
  };
  domainID?: number;
  createdDT?: string;
  modifiedDT?: string;
  isApproved?: boolean;
  averageRating?: number;
  ratingCount?: number;
  commentCount?: number;
  viewCount?: number;
  recipeURL?: string;
  images?: string[];
  seO_Keywords?: string;
  recipeCategories?: any;
  recipeCategoryNM?: any;
  fileDescription?: any;
  fileName?: any;
  lastViewDT?: string;
  modifiedID?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  order?: number;
  isActive?: boolean;
  url?: string;
  recipes?: any[];
  domainID?: number;
}

export interface Website {
  id: number;
  name: string;
  description?: string;
  siteTemplate?: string;
  siteStyle?: string;
  message?: string;
  siteName?: string;
  websiteUrl?: string;
  websiteTitle?: string;
  useBreadCrumbURL?: boolean;
  isRecipeSite?: boolean;
  modifiedDT?: string;
  modifiedID?: number;
}

export interface MenuItem {
  id: number;
  domainID: number;
  domainName?: string;
  title: string;
  icon?: string;
  pageContent?: string;
  action?: string;
  controller?: string;
  argument?: string;
  url?: string;
  description?: string;
  displayInNavigation?: boolean;
  displayOrder?: number;
  parentId?: number;
  parentTitle?: string;
  lastModified?: string;
  children?: MenuItem[];
}

// Data export interfaces
export interface ApiData {
  recipes: Recipe[];
  categories: Category[];
  websites: Website[];
  menuItems: Record<number, MenuItem[]>;
  metadata: {
    fetchedAt: string;
    totalRecipes: number;
    totalCategories: number;
    totalWebsites: number;
  };
}
`;

  const typesPath = path.join(DATA_DIR, 'api-types.ts');
  fs.writeFileSync(typesPath, typesContent, 'utf8');
  console.log('✅ Generated TypeScript types');
}

/**
 * Apply automatic data quality fixes
 */
function applyDataQualityFixes(data, validationResult) {
  console.log('🔧 Applying automatic data quality fixes...');
  
  let fixedCount = 0;
  const { recipes, categories } = data;
  
  if (!recipes || !categories) {
    console.log('❌ Cannot apply fixes: missing recipes or categories data');
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

  console.log(`✅ Applied ${fixedCount} automatic fixes`);
  
  return { fixedCount, data };
}

/**
 * Main function to fetch all data
 */
async function main() {
  console.log('🚀 Starting data fetch process...');
  console.log('API Endpoints:');
  console.log(`  Recipe API: ${RECIPE_API_BASE}`);
  console.log(`  WebCMS API: ${WEBCMS_API_BASE}`);
  console.log(`  Auth Token: ${AUTH_TOKEN ? '✅ Provided' : '❌ Missing'}`);
  console.log('');
  
  try {
    // Fetch all data in parallel where possible
    const [recipes, categories, websites] = await Promise.all([
      fetchAllRecipes(),
      fetchAllCategories(),
      fetchWebsites()
    ]);
    
    // Extract menu items from website data instead of separate API calls
    const menuItems = {};
    let totalMenuItems = 0;
    let recipeMenuItems = 0;
    let contentMenuItems = 0;
    
    websites.forEach(website => {
      if (website && website.id) {
        // Extract menu items from the website's menu array
        const siteMenuItems = website.menu || [];
        menuItems[website.id] = siteMenuItems;
        
        // Categorize menu items
        const recipeItems = siteMenuItems.filter(item => 
          item.controller && item.controller.toLowerCase() === 'recipe'
        );
        const contentItems = siteMenuItems.filter(item => 
          !item.controller || item.controller.toLowerCase() !== 'recipe'
        );
        
        totalMenuItems += siteMenuItems.length;
        recipeMenuItems += recipeItems.length;
        contentMenuItems += contentItems.length;
        
        console.log(`Extracted ${siteMenuItems.length} menu items from website ${website.id}`);
        console.log(`  → ${recipeItems.length} recipe menu items`);
        console.log(`  → ${contentItems.length} content menu items`);
      }
    });
    
    // Prepare combined data
    const combinedData = {
      recipes,
      categories,
      websites,
      menuItems,
      metadata: {
        fetchedAt: new Date().toISOString(),
        totalRecipes: recipes.length,
        totalCategories: categories.length,
        totalWebsites: websites.length,
        totalMenuItems: totalMenuItems,
        recipeMenuItems: recipeMenuItems,
        contentMenuItems: contentMenuItems
      }
    };

    // Run data quality validation
    console.log('');
    console.log('🔍 Running comprehensive data quality validation...');
    const validator = new DataQualityValidator();
    const initialValidationResult = validator.validate(combinedData);

    // Save initial validation report
    const reportPath = path.join(DATA_DIR, 'validation-report.json');
    await validator.saveReport(reportPath, {
      apiEndpoints: {
        recipeApi: RECIPE_API_BASE,
        webCmsApi: WEBCMS_API_BASE
      },
      fetchMetadata: combinedData.metadata,
      phase: 'initial-validation'
    });

    // Display initial validation results
    console.log('');
    console.log('📊 Initial Data Quality Assessment:');
    console.log(`   Quality Score: ${initialValidationResult.qualityScore.toFixed(1)}%`);
    console.log(`   Critical Errors: ${initialValidationResult.errors.length}`);
    console.log(`   Warnings: ${initialValidationResult.warnings.length}`);

    // Always attempt to fix issues if any are found
    let finalData = combinedData;
    let fixedIssuesCount = 0;
    
    if (initialValidationResult.errors.length > 0 || initialValidationResult.warnings.length > 0) {
      console.log('');
      console.log('🔧 Auto-fixing data quality issues...');
      
      // Apply fixes using the same logic as validate-data.js
      const fixResult = applyDataQualityFixes(combinedData, initialValidationResult);
      finalData = fixResult.data;
      fixedIssuesCount = fixResult.fixedCount;
      
      if (fixedIssuesCount > 0) {
        console.log(`✅ Automatically fixed ${fixedIssuesCount} issues`);
        
        // Re-run validation on fixed data
        console.log('');
        console.log('🔄 Re-validating after auto-fixes...');
        const postFixValidator = new DataQualityValidator();
        const postFixValidationResult = postFixValidator.validate(finalData);
        
        // Save post-fix validation report
        await postFixValidator.saveReport(reportPath, {
          apiEndpoints: {
            recipeApi: RECIPE_API_BASE,
            webCmsApi: WEBCMS_API_BASE
          },
          fetchMetadata: finalData.metadata,
          phase: 'post-fix-validation',
          fixesApplied: fixedIssuesCount,
          initialResults: {
            errors: initialValidationResult.errors.length,
            warnings: initialValidationResult.warnings.length,
            qualityScore: initialValidationResult.qualityScore
          }
        });
        
        // Display improvement results
        console.log('');
        console.log('📈 Data Quality Improvement Results:');
        console.log(`   Quality Score: ${initialValidationResult.qualityScore.toFixed(1)}% → ${postFixValidationResult.qualityScore.toFixed(1)}%`);
        console.log(`   Critical Errors: ${initialValidationResult.errors.length} → ${postFixValidationResult.errors.length}`);
        console.log(`   Warnings: ${initialValidationResult.warnings.length} → ${postFixValidationResult.warnings.length}`);
        console.log(`   Issues Fixed: ${fixedIssuesCount}`);
        
        // Check if critical errors remain after fixes
        if (postFixValidationResult.errors.length > 0) {
          console.log('');
          console.log('❌ Critical errors remain after auto-fix attempts');
          postFixValidationResult.errors.forEach(error => {
            console.log(`   • [${error.category}] ${error.item}: ${error.message}`);
          });
          
          const continueWithErrors = process.env.FORCE_SAVE === 'true';
          if (!continueWithErrors) {
            console.log('');
            console.log('💡 To force save despite remaining errors, set FORCE_SAVE=true environment variable');
            console.log(`📄 Detailed report saved to: ${reportPath}`);
            process.exit(1);
          } else {
            console.log('');
            console.log('⚠️  Forcing save despite remaining errors (FORCE_SAVE=true)');
          }
        } else {
          console.log('');
          console.log('🎉 All critical issues resolved successfully!');
          if (postFixValidationResult.warnings.length > 0) {
            console.log(`⚠️  ${postFixValidationResult.warnings.length} minor warning(s) remain - see report for details`);
          }
        }
      } else {
        console.log('⚠️  No automatic fixes available for detected issues');
        
        if (initialValidationResult.errors.length > 0) {
          console.log('');
          console.log('❌ Manual intervention required for critical errors:');
          initialValidationResult.errors.forEach(error => {
            console.log(`   • [${error.category}] ${error.item}: ${error.message}`);
          });
          
          const continueWithErrors = process.env.FORCE_SAVE === 'true';
          if (!continueWithErrors) {
            console.log('');
            console.log('💡 To force save despite errors, set FORCE_SAVE=true environment variable');
            console.log(`📄 Detailed report saved to: ${reportPath}`);
            process.exit(1);
          } else {
            console.log('');
            console.log('⚠️  Forcing save despite errors (FORCE_SAVE=true)');
          }
        }
      }
    } else {
      console.log('');
      console.log('✅ Perfect data quality - no issues detected!');
      console.log(`🌟 Quality Score: ${initialValidationResult.qualityScore.toFixed(1)}%`);
    }

    // Save individual data files using the quality-validated and fixed data
    console.log('');
    console.log('💾 Saving validated data files...');
    saveDataFile('recipes.json', finalData.recipes);
    saveDataFile('categories.json', finalData.categories);
    saveDataFile('websites.json', finalData.websites);
    saveDataFile('menu-items.json', finalData.menuItems);
    
    // Save combined data file
    saveDataFile('api-data.json', finalData);
    
    // Generate TypeScript types
    generateTypes(finalData.recipes, finalData.categories, finalData.websites);
    
    console.log('');
    console.log('📊 Final Data Summary:');
    console.log(`  Recipes: ${finalData.recipes.length}`);
    console.log(`  Categories: ${finalData.categories.length}`);
    console.log(`  Websites: ${finalData.websites.length}`);
    console.log(`  Menu Items: ${finalData.metadata.totalMenuItems} total`);
    console.log(`    ├─ Recipe Menu Items: ${finalData.metadata.recipeMenuItems}`);
    console.log(`    └─ Content Menu Items: ${finalData.metadata.contentMenuItems}`);
    if (fixedIssuesCount > 0) {
      console.log(`  Quality Fixes Applied: ${fixedIssuesCount}`);
    }
    console.log(`📄 Validation Report: ${reportPath}`);
    console.log('');
    console.log('✅ Data fetch and validation completed successfully!');
    
  } catch (error) {
    console.error('❌ Data fetch failed:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
