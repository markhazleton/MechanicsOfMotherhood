/**
 * Data Quality Validator for MoM API Data
 * 
 * This module validates the integrity and quality of data fetched from APIs
 * to ensure the application has reliable, consistent data to work with.
 */

export class DataQualityValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.metrics = {};
  }

  /**
   * Add an error to the validation results
   */
  addError(category, item, message, details = {}) {
    this.errors.push({
      category,
      item: item || 'general',
      message,
      details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Add a warning to the validation results
   */
  addWarning(category, item, message, details = {}) {
    this.warnings.push({
      category,
      item: item || 'general',
      message,
      details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Update metrics
   */
  updateMetric(key, value) {
    this.metrics[key] = value;
  }

  /**
   * Validate recipes data
   */
  validateRecipes(recipes) {
    console.log('🔍 Validating recipes data...');
    
    if (!Array.isArray(recipes)) {
      this.addError('recipes', 'structure', 'Recipes data is not an array');
      return;
    }

    this.updateMetric('totalRecipes', recipes.length);

    let validRecipes = 0;
    let recipesWithImages = 0;
    let recipesWithRatings = 0;
    let approvedRecipes = 0;
    const categoryDistribution = {};
    const duplicateNames = new Map();
    const missingFields = {
      name: 0,
      description: 0,
      ingredients: 0,
      instructions: 0,
      category: 0
    };

    recipes.forEach((recipe, index) => {
      const recipeId = recipe.id || `index-${index}`;
      
      // Required fields validation
      if (!recipe.name || recipe.name.trim() === '') {
        this.addError('recipes', recipeId, 'Recipe missing name', { index });
        missingFields.name++;
      } else {
        // Check for duplicate names
        const normalizedName = recipe.name.toLowerCase().trim();
        if (duplicateNames.has(normalizedName)) {
          this.addWarning('recipes', recipeId, 'Duplicate recipe name detected', {
            name: recipe.name,
            otherRecipe: duplicateNames.get(normalizedName)
          });
        } else {
          duplicateNames.set(normalizedName, recipeId);
        }
      }

      if (!recipe.description || recipe.description.trim() === '') {
        missingFields.description++;
      }

      if (!recipe.ingredients || recipe.ingredients.trim() === '') {
        this.addWarning('recipes', recipeId, 'Recipe missing ingredients', { name: recipe.name });
        missingFields.ingredients++;
      }

      if (!recipe.instructions || recipe.instructions.trim() === '') {
        this.addWarning('recipes', recipeId, 'Recipe missing instructions', { name: recipe.name });
        missingFields.instructions++;
      }

      // Category validation
      if (!recipe.recipeCategoryID || !recipe.recipeCategory) {
        this.addError('recipes', recipeId, 'Recipe missing category information', { 
          name: recipe.name,
          categoryId: recipe.recipeCategoryID
        });
        missingFields.category++;
      } else {
        const categoryName = recipe.recipeCategory.name || 'Unknown';
        categoryDistribution[categoryName] = (categoryDistribution[categoryName] || 0) + 1;
      }

      // Data quality checks
      if (recipe.servings && (recipe.servings < 1 || recipe.servings > 50)) {
        this.addWarning('recipes', recipeId, 'Unusual serving count', {
          name: recipe.name,
          servings: recipe.servings
        });
      }

      if (recipe.averageRating && (recipe.averageRating < 0 || recipe.averageRating > 5)) {
        this.addError('recipes', recipeId, 'Invalid rating value', {
          name: recipe.name,
          rating: recipe.averageRating
        });
      }

      // Count statistics
      if (recipe.images && recipe.images.length > 0) {
        recipesWithImages++;
      }

      if (recipe.averageRating && recipe.averageRating > 0) {
        recipesWithRatings++;
      }

      if (recipe.isApproved) {
        approvedRecipes++;
      }

      // Count as valid if it has basic required fields
      if (recipe.name && recipe.ingredients && recipe.instructions) {
        validRecipes++;
      }
    });

    // Update metrics
    this.updateMetric('validRecipes', validRecipes);
    this.updateMetric('recipesWithImages', recipesWithImages);
    this.updateMetric('recipesWithRatings', recipesWithRatings);
    this.updateMetric('approvedRecipes', approvedRecipes);
    this.updateMetric('categoryDistribution', categoryDistribution);
    this.updateMetric('missingFields', missingFields);

    // Quality thresholds
    const completenessRatio = validRecipes / recipes.length;
    if (completenessRatio < 0.9) {
      this.addWarning('recipes', 'completeness', `Low recipe completeness: ${(completenessRatio * 100).toFixed(1)}%`);
    }

    console.log(`   ✅ Processed ${recipes.length} recipes (${validRecipes} complete)`);
  }

  /**
   * Validate categories data
   */
  validateCategories(categories, recipes = []) {
    console.log('🔍 Validating categories data...');
    
    if (!Array.isArray(categories)) {
      this.addError('categories', 'structure', 'Categories data is not an array');
      return;
    }

    this.updateMetric('totalCategories', categories.length);

    const categoryIds = new Set();
    const categoryNames = new Set();
    const usedCategoryIds = new Set(recipes.map(r => r.recipeCategoryID).filter(Boolean));

    categories.forEach((category, index) => {
      const categoryId = category.id || `index-${index}`;

      // Required fields
      if (!category.name || category.name.trim() === '') {
        this.addError('categories', categoryId, 'Category missing name', { index });
      } else {
        // Check for duplicates
        const normalizedName = category.name.toLowerCase().trim();
        if (categoryNames.has(normalizedName)) {
          this.addError('categories', categoryId, 'Duplicate category name', { name: category.name });
        } else {
          categoryNames.add(normalizedName);
        }
      }

      if (!category.id) {
        this.addError('categories', categoryId, 'Category missing ID', { name: category.name });
      } else {
        if (categoryIds.has(category.id)) {
          this.addError('categories', categoryId, 'Duplicate category ID', { id: category.id });
        } else {
          categoryIds.add(category.id);
        }
      }

      // URL validation
      if (category.url) {
        if (!category.url.startsWith('/')) {
          this.addWarning('categories', categoryId, 'Category URL should start with /', {
            name: category.name,
            url: category.url
          });
        }
        if (!category.url.includes('/recipes/category/')) {
          this.addWarning('categories', categoryId, 'Category URL format unexpected', {
            name: category.name,
            url: category.url
          });
        }
      }

      // Check if category is actually used by recipes
      if (!usedCategoryIds.has(category.id)) {
        this.addWarning('categories', categoryId, 'Category has no recipes', {
          name: category.name,
          id: category.id
        });
      }
    });

    // Check for orphaned recipes (recipes with category IDs not in categories)
    recipes.forEach(recipe => {
      if (recipe.recipeCategoryID && !categoryIds.has(recipe.recipeCategoryID)) {
        this.addError('categories', 'orphaned-recipe', 'Recipe references non-existent category', {
          recipeName: recipe.name,
          recipeId: recipe.id,
          categoryId: recipe.recipeCategoryID
        });
      }
    });

    console.log(`   ✅ Processed ${categories.length} categories`);
  }

  /**
   * Validate websites data
   */
  validateWebsites(websites) {
    console.log('🔍 Validating websites data...');
    
    if (!Array.isArray(websites)) {
      this.addError('websites', 'structure', 'Websites data is not an array');
      return;
    }

    this.updateMetric('totalWebsites', websites.length);

    websites.forEach((website, index) => {
      const websiteId = website.id || `index-${index}`;

      if (!website.name || website.name.trim() === '') {
        this.addError('websites', websiteId, 'Website missing name', { index });
      }

      if (!website.id) {
        this.addError('websites', websiteId, 'Website missing ID', { name: website.name });
      }

      if (website.websiteUrl) {
        try {
          new URL(website.websiteUrl);
        } catch (e) {
          this.addWarning('websites', websiteId, 'Invalid website URL format', {
            name: website.name,
            url: website.websiteUrl
          });
        }
      }
    });

    console.log(`   ✅ Processed ${websites.length} websites`);
  }

  /**
   * Validate menu items data
   */
  validateMenuItems(menuItems) {
    console.log('🔍 Validating menu items data...');
    
    if (typeof menuItems !== 'object' || menuItems === null) {
      this.addError('menuItems', 'structure', 'Menu items data is not an object');
      return;
    }

    let totalMenuItems = 0;
    
    Object.entries(menuItems).forEach(([websiteId, items]) => {
      if (!Array.isArray(items)) {
        this.addError('menuItems', websiteId, 'Menu items for website is not an array');
        return;
      }

      totalMenuItems += items.length;

      items.forEach((item, index) => {
        const itemId = item.id || `${websiteId}-${index}`;

        if (!item.title || item.title.trim() === '') {
          this.addWarning('menuItems', itemId, 'Menu item missing title', {
            websiteId,
            index
          });
        }

        if (item.url && !item.url.startsWith('/') && !item.url.startsWith('http')) {
          this.addWarning('menuItems', itemId, 'Menu item URL format unexpected', {
            title: item.title,
            url: item.url
          });
        }
      });
    });

    this.updateMetric('totalMenuItems', totalMenuItems);
    console.log(`   ✅ Processed ${totalMenuItems} menu items across ${Object.keys(menuItems).length} websites`);
  }

  /**
   * Validate data relationships and cross-references
   */
  validateDataRelationships(recipes, categories, websites, menuItems) {
    console.log('🔍 Validating data relationships...');

    // Check recipe-category relationships
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
    
    recipes.forEach(recipe => {
      if (recipe.recipeCategoryID && !categoryMap.has(recipe.recipeCategoryID)) {
        this.addError('relationships', 'recipe-category', 'Recipe references non-existent category', {
          recipeName: recipe.name,
          categoryId: recipe.recipeCategoryID
        });
      }
    });

    // Check website-menu relationships
    const websiteMap = new Map(websites.map(site => [site.id, site]));
    
    Object.keys(menuItems).forEach(websiteId => {
      const numericId = parseInt(websiteId);
      if (!websiteMap.has(numericId)) {
        this.addWarning('relationships', 'website-menu', 'Menu items exist for unknown website', {
          websiteId: numericId
        });
      }
    });

    console.log('   ✅ Data relationships validated');
  }

  /**
   * Run complete validation
   */
  validate(data) {
    console.log('🔧 Starting data quality validation...\n');

    const { recipes = [], categories = [], websites = [], menuItems = {} } = data;

    // Individual data validation
    this.validateRecipes(recipes);
    this.validateCategories(categories, recipes);
    this.validateWebsites(websites);
    this.validateMenuItems(menuItems);

    // Cross-data validation
    this.validateDataRelationships(recipes, categories, websites, menuItems);

    console.log('\n📊 Validation Summary:');
    console.log('======================');
    
    // Print metrics
    console.log('\n📈 Data Metrics:');
    Object.entries(this.metrics).forEach(([key, value]) => {
      if (typeof value === 'object') {
        console.log(`   ${key}:`);
        Object.entries(value).forEach(([subKey, subValue]) => {
          console.log(`     ${subKey}: ${subValue}`);
        });
      } else {
        console.log(`   ${key}: ${value}`);
      }
    });

    // Print errors
    if (this.errors.length > 0) {
      console.log(`\n❌ ${this.errors.length} Errors Found:`);
      this.errors.forEach(error => {
        console.log(`   [${error.category}] ${error.item}: ${error.message}`);
        if (Object.keys(error.details).length > 0) {
          console.log(`     Details: ${JSON.stringify(error.details)}`);
        }
      });
    } else {
      console.log('\n✅ No critical errors found!');
    }

    // Print warnings
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  ${this.warnings.length} Warnings:`);
      this.warnings.forEach(warning => {
        console.log(`   [${warning.category}] ${warning.item}: ${warning.message}`);
      });
    } else {
      console.log('\n✅ No warnings!');
    }

    // Overall quality score
    const totalIssues = this.errors.length + this.warnings.length;
    const totalItems = (this.metrics.totalRecipes || 0) + 
                      (this.metrics.totalCategories || 0) + 
                      (this.metrics.totalWebsites || 0);
    
    const qualityScore = totalItems > 0 ? Math.max(0, 100 - (totalIssues / totalItems * 100)) : 0;
    
    console.log(`\n🎯 Overall Data Quality Score: ${qualityScore.toFixed(1)}%`);
    
    if (qualityScore >= 95) {
      console.log('   🌟 Excellent data quality!');
    } else if (qualityScore >= 85) {
      console.log('   ✅ Good data quality');
    } else if (qualityScore >= 70) {
      console.log('   ⚠️  Fair data quality - some issues need attention');
    } else {
      console.log('   ❌ Poor data quality - immediate attention required');
    }

    console.log('\n✨ Data quality validation complete!\n');

    return {
      errors: this.errors,
      warnings: this.warnings,
      metrics: this.metrics,
      qualityScore,
      passed: this.errors.length === 0
    };
  }

  /**
   * Save validation report to file
   */
  async saveReport(outputPath, additionalData = {}) {
    const report = {
      timestamp: new Date().toISOString(),
      validation: {
        errors: this.errors,
        warnings: this.warnings,
        metrics: this.metrics,
        qualityScore: this.metrics.qualityScore || 0
      },
      ...additionalData
    };

    try {
      const fs = await import('fs');
      fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
      console.log(`📄 Validation report saved to: ${outputPath}`);
    } catch (error) {
      console.error('Failed to save validation report:', error.message);
    }
  }
}
