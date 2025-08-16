import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Configuration
const RECIPE_API_BASE = process.env.RECIPE_API_BASE || 'https://webspark.markhazleton.com/api/recipespark';
const WEBCMS_API_BASE = process.env.WEBCMS_API_BASE || 'https://webspark.markhazleton.com/api/WebCMS/WebCMSApi';
const AUTH_TOKEN = process.env.WEBCMS_AUTH_TOKEN || '';

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
 * Fetch websites from WebCMS API
 */
async function fetchWebsites() {
  if (!AUTH_TOKEN) {
    console.warn('No WebCMS auth token provided, skipping websites fetch');
    return [];
  }
  
  console.log('Fetching websites...');
  
  const headers = {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  };
  
  const url = `${WEBCMS_API_BASE}/websites?pageSize=100`;
  const response = await fetchData(url, headers);
  
  if (!response) {
    console.warn('Failed to fetch websites');
    return [];
  }
  
  const websites = response.items || response || [];
  console.log(`Total websites fetched: ${websites.length}`);
  return websites;
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
    'Content-Type': 'application/json'
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
    
    // Fetch menu items for each website
    const menuItemsPromises = websites.map(website => 
      fetchMenuItems(website.id).then(items => ({ websiteId: website.id, items }))
    );
    
    const menuItemsResults = await Promise.all(menuItemsPromises);
    const menuItems = menuItemsResults.reduce((acc, result) => {
      acc[result.websiteId] = result.items;
      return acc;
    }, {});
    
    // Save individual data files
    saveDataFile('recipes.json', recipes);
    saveDataFile('categories.json', categories);
    saveDataFile('websites.json', websites);
    saveDataFile('menu-items.json', menuItems);
    
    // Save combined data file
    const combinedData = {
      recipes,
      categories,
      websites,
      menuItems,
      metadata: {
        fetchedAt: new Date().toISOString(),
        totalRecipes: recipes.length,
        totalCategories: categories.length,
        totalWebsites: websites.length
      }
    };
    
    saveDataFile('api-data.json', combinedData);
    
    // Generate TypeScript types
    generateTypes(recipes, categories, websites);
    
    console.log('');
    console.log('📊 Data fetch summary:');
    console.log(`  Recipes: ${recipes.length}`);
    console.log(`  Categories: ${categories.length}`);
    console.log(`  Websites: ${websites.length}`);
    console.log(`  Menu Items: ${Object.keys(menuItems).length} websites`);
    console.log('');
    console.log('✅ Data fetch completed successfully!');
    
  } catch (error) {
    console.error('❌ Data fetch failed:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
