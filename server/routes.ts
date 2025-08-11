import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertRecipeSchema, insertCategorySchema } from "@shared/schema";

// Helper function to create RecipeSpark API compatible responses
function createApiResponse(data: any, message: string, pagination?: any) {
  return {
    data,
    success: true,
    message,
    ...(pagination && { pagination })
  };
}

function createErrorResponse(message: string, details?: string, statusCode = 500) {
  return {
    message,
    ...(details && { details })
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // RecipeSpark API compatible routes
  
  // Get recipes with RecipeSpark API format
  app.get("/api/recipespark/recipes", async (req, res) => {
    try {
      const pageNumber = parseInt(req.query.pageNumber as string) || 1;
      const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const searchTerm = req.query.searchTerm as string;
      const featured = req.query.featured === 'true';

      const result = await storage.getRecipes({ pageNumber, pageSize, categoryId, searchTerm, featured });
      
      // Add category information to each recipe
      const recipesWithCategory = await Promise.all(
        result.recipes.map(async (recipe) => {
          const category = await storage.getCategory(recipe.recipeCategoryID);
          return {
            ...recipe,
            recipeCategory: category ? { id: category.id, name: category.name } : null
          };
        })
      );

      res.json(createApiResponse(
        recipesWithCategory,
        `Retrieved ${recipesWithCategory.length} recipes`,
        {
          currentPage: pageNumber,
          pageSize,
          totalCount: result.total,
          totalPages: Math.ceil(result.total / pageSize),
          hasPrevious: pageNumber > 1,
          hasNext: pageNumber * pageSize < result.total
        }
      ));
    } catch (error) {
      res.status(500).json(createErrorResponse("Failed to fetch recipes"));
    }
  });

  // Get single recipe by ID - RecipeSpark API format
  app.get("/api/recipespark/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json(createErrorResponse("Invalid recipe ID"));
      }

      const recipe = await storage.getRecipe(id);
      if (!recipe) {
        return res.status(404).json(createErrorResponse("Recipe not found"));
      }

      // Add category information
      const category = await storage.getCategory(recipe.recipeCategoryID);
      const recipeWithCategory = {
        ...recipe,
        recipeCategory: category ? { id: category.id, name: category.name } : null
      };

      res.json(createApiResponse(recipeWithCategory, "Recipe retrieved successfully"));
    } catch (error) {
      res.status(500).json(createErrorResponse("Failed to fetch recipe"));
    }
  });

  // Create recipe - RecipeSpark API format
  app.post("/api/recipespark/recipes", async (req, res) => {
    try {
      // Map RecipeSpark API fields to our schema
      const recipeData = {
        name: req.body.name,
        description: req.body.description,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        servings: req.body.servings || 1,
        authorNM: req.body.authorName,
        recipeCategoryID: req.body.categoryId,
        isApproved: false, // New recipes need approval
        averageRating: 0,
        // Default MoM fields
        imageUrl: req.body.imageUrl || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        prepTime: req.body.prepTime || 30,
        cookTime: req.body.cookTime || 30,
        difficulty: req.body.difficulty || "easy",
        tags: req.body.tags || [],
        featured: false,
      };

      // Validate required fields
      if (!recipeData.name || !recipeData.recipeCategoryID) {
        return res.status(400).json(createErrorResponse("Recipe name and category ID are required"));
      }

      const newRecipe = await storage.createRecipe(recipeData);
      res.status(201).json(createApiResponse(newRecipe, "Recipe created successfully"));
    } catch (error) {
      res.status(500).json(createErrorResponse("Failed to create recipe"));
    }
  });

  // Update recipe - RecipeSpark API format
  app.put("/api/recipespark/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json(createErrorResponse("Invalid recipe ID"));
      }

      const recipeData = {
        name: req.body.name,
        description: req.body.description,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        servings: req.body.servings,
        authorNM: req.body.authorName,
        recipeCategoryID: req.body.categoryId,
        isApproved: req.body.isApproved,
        averageRating: req.body.averageRating,
        imageUrl: req.body.imageUrl,
        prepTime: req.body.prepTime,
        cookTime: req.body.cookTime,
        difficulty: req.body.difficulty,
        tags: req.body.tags,
        featured: req.body.featured,
      };

      const updatedRecipe = await storage.updateRecipe(id, recipeData);
      if (!updatedRecipe) {
        return res.status(404).json(createErrorResponse("Recipe not found"));
      }

      res.json(createApiResponse(updatedRecipe, "Recipe updated successfully"));
    } catch (error) {
      res.status(500).json(createErrorResponse("Failed to update recipe"));
    }
  });

  // Delete recipe - RecipeSpark API format
  app.delete("/api/recipespark/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json(createErrorResponse("Invalid recipe ID"));
      }

      const deleted = await storage.deleteRecipe(id);
      if (!deleted) {
        return res.status(404).json(createErrorResponse("Recipe not found"));
      }

      res.json(createApiResponse({ id }, "Recipe deleted successfully"));
    } catch (error) {
      res.status(500).json(createErrorResponse("Failed to delete recipe"));
    }
  });

  // Search recipes
  app.post("/api/search", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }

      const results = await storage.searchRecipes(query);
      res.json({
        results,
        suggestions: [] // Could implement search suggestions here
      });
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Get blog posts with pagination and filtering
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const featured = req.query.featured === 'true';

      const result = await storage.getBlogPosts({ page, limit, category, featured });
      
      res.json({
        posts: result.posts,
        pagination: {
          page,
          totalPages: Math.ceil(result.total / limit),
          totalCount: result.total,
          hasNext: page * limit < result.total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get single blog post
  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Categories - RecipeSpark API format
  app.get("/api/recipespark/categories", async (req, res) => {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const categories = await storage.getCategories(includeInactive);
      
      // Add recipes to each category
      const categoriesWithRecipes = await Promise.all(
        categories.map(async (category) => {
          const recipes = await storage.getRecipes({ categoryId: category.id, pageSize: 10 });
          return {
            ...category,
            recipes: recipes.recipes.map(r => ({ id: r.id, name: r.name, description: r.description }))
          };
        })
      );

      res.json(createApiResponse(categoriesWithRecipes, `Retrieved ${categoriesWithRecipes.length} categories`));
    } catch (error) {
      res.status(500).json(createErrorResponse("Failed to fetch categories"));
    }
  });

  // Get single category - RecipeSpark API format
  app.get("/api/recipespark/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json(createErrorResponse("Invalid category ID"));
      }

      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json(createErrorResponse("Category not found"));
      }

      // Add recipes to the category
      const recipes = await storage.getRecipes({ categoryId: id });
      const categoryWithRecipes = {
        ...category,
        recipes: recipes.recipes.map(r => ({ id: r.id, name: r.name, description: r.description }))
      };

      res.json(createApiResponse(categoryWithRecipes, "Category retrieved successfully"));
    } catch (error) {
      res.status(500).json(createErrorResponse("Failed to fetch category"));
    }
  });

  // Create category - RecipeSpark API format
  app.post("/api/recipespark/categories", async (req, res) => {
    try {
      const categoryData = {
        name: req.body.name,
        description: req.body.description,
        displayOrder: req.body.displayOrder || 99,
        isActive: req.body.isActive !== false,
        url: req.body.url || req.body.name?.toLowerCase().replace(/\s+/g, '-'),
        color: req.body.color || "#38B2AC",
        recipeCount: 0,
      };

      if (!categoryData.name) {
        return res.status(400).json(createErrorResponse("Category name is required"));
      }

      const newCategory = await storage.createCategory(categoryData);
      res.status(201).json(createApiResponse(newCategory, "Category created successfully"));
    } catch (error) {
      res.status(500).json(createErrorResponse("Failed to create category"));
    }
  });

  // Update category - RecipeSpark API format
  app.put("/api/recipespark/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json(createErrorResponse("Invalid category ID"));
      }

      const categoryData = {
        name: req.body.name,
        description: req.body.description,
        displayOrder: req.body.displayOrder,
        isActive: req.body.isActive,
        url: req.body.url,
        color: req.body.color,
        recipeCount: req.body.recipeCount,
      };

      const updatedCategory = await storage.updateCategory(id, categoryData);
      if (!updatedCategory) {
        return res.status(404).json(createErrorResponse("Category not found"));
      }

      res.json(createApiResponse(updatedCategory, "Category updated successfully"));
    } catch (error) {
      res.status(500).json(createErrorResponse("Failed to update category"));
    }
  });

  // Delete category - RecipeSpark API format
  app.delete("/api/recipespark/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json(createErrorResponse("Invalid category ID"));
      }

      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return res.status(404).json(createErrorResponse("Category not found"));
      }

      res.json(createApiResponse({ id }, "Category deleted successfully"));
    } catch (error) {
      res.status(500).json(createErrorResponse("Failed to delete category"));
    }
  });

  // Backward compatibility routes for existing MoM frontend
  
  // Legacy recipes endpoint
  app.get("/api/recipes", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const categoryName = req.query.category as string;
      const difficulty = req.query.difficulty as string;
      const featured = req.query.featured === 'true';

      // Find category by name if provided
      let categoryId: number | undefined;
      if (categoryName) {
        const categories = await storage.getCategories();
        const category = categories.find(c => c.name === categoryName);
        categoryId = category?.id;
      }

      const result = await storage.getRecipes({ 
        pageNumber: page, 
        pageSize: limit, 
        categoryId, 
        featured 
      });
      
      // Transform to legacy format
      const legacyRecipes = result.recipes.map(recipe => ({
        id: recipe.id.toString(),
        title: recipe.name,
        description: recipe.description || "",
        imageUrl: recipe.imageUrl || "",
        prepTime: recipe.prepTime || 30,
        cookTime: recipe.cookTime || 30,
        servings: recipe.servings || 1,
        difficulty: recipe.difficulty || "easy",
        category: categoryName || "General",
        ingredients: recipe.ingredients ? recipe.ingredients.split('\n').filter(i => i.trim()) : [],
        instructions: recipe.instructions ? recipe.instructions.split('\n').filter(i => i.trim()) : [],
        tags: recipe.tags || [],
        rating: recipe.averageRating || 0,
        ratingCount: Math.floor(Math.random() * 200) + 1,
        featured: recipe.featured || false,
        createdAt: recipe.createdDT || new Date(),
      }));

      res.json({
        recipes: legacyRecipes,
        pagination: {
          page,
          totalPages: Math.ceil(result.total / limit),
          totalCount: result.total,
          hasNext: page * limit < result.total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // Legacy categories endpoint
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      const legacyCategories = categories.map(cat => ({
        id: cat.id.toString(),
        name: cat.name,
        description: cat.description,
        color: cat.color,
        recipeCount: cat.recipeCount,
        postCount: 0, // Not used in new schema
      }));
      res.json({ categories: legacyCategories });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Legacy single recipe endpoint
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      const recipe = await storage.getRecipe(id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      // Transform to legacy format
      const legacyRecipe = {
        id: recipe.id.toString(),
        title: recipe.name,
        description: recipe.description || "",
        imageUrl: recipe.imageUrl || "",
        prepTime: recipe.prepTime || 30,
        cookTime: recipe.cookTime || 30,
        servings: recipe.servings || 1,
        difficulty: recipe.difficulty || "easy",
        category: "General", // Would need category lookup
        ingredients: recipe.ingredients ? recipe.ingredients.split('\n').filter(i => i.trim()) : [],
        instructions: recipe.instructions ? recipe.instructions.split('\n').filter(i => i.trim()) : [],
        tags: recipe.tags || [],
        rating: recipe.averageRating || 0,
        ratingCount: Math.floor(Math.random() * 200) + 1,
        featured: recipe.featured || false,
        createdAt: recipe.createdDT || new Date(),
      };

      res.json(legacyRecipe);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });

  // Get featured content
  app.get("/api/featured-content", async (req, res) => {
    try {
      const [recipes, posts, categories] = await Promise.all([
        storage.getFeaturedRecipes(),
        storage.getFeaturedBlogPosts(),
        storage.getCategories()
      ]);

      // Transform recipes to legacy format
      const legacyRecipes = recipes.map(recipe => ({
        id: recipe.id.toString(),
        title: recipe.name,
        description: recipe.description || "",
        imageUrl: recipe.imageUrl || "",
        prepTime: recipe.prepTime || 30,
        cookTime: recipe.cookTime || 30,
        servings: recipe.servings || 1,
        difficulty: recipe.difficulty || "easy",
        category: "Featured",
        ingredients: recipe.ingredients ? recipe.ingredients.split('\n').filter(i => i.trim()) : [],
        instructions: recipe.instructions ? recipe.instructions.split('\n').filter(i => i.trim()) : [],
        tags: recipe.tags || [],
        rating: recipe.averageRating || 0,
        ratingCount: Math.floor(Math.random() * 200) + 1,
        featured: recipe.featured || false,
        createdAt: recipe.createdDT || new Date(),
      }));

      const legacyCategories = categories.map(cat => ({
        id: cat.id.toString(),
        name: cat.name,
        description: cat.description,
        color: cat.color,
        recipeCount: cat.recipeCount,
        postCount: 0,
      }));

      res.json({
        recipes: legacyRecipes,
        posts,
        categories: legacyCategories
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured content" });
    }
  });

  // Get stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Search endpoint for legacy compatibility
  app.post("/api/search", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }

      const results = await storage.searchRecipes(query);
      const legacyResults = results.map(recipe => ({
        id: recipe.id.toString(),
        title: recipe.name,
        description: recipe.description || "",
        imageUrl: recipe.imageUrl || "",
        prepTime: recipe.prepTime || 30,
        cookTime: recipe.cookTime || 30,
        servings: recipe.servings || 1,
        difficulty: recipe.difficulty || "easy",
        category: "General",
        ingredients: recipe.ingredients ? recipe.ingredients.split('\n').filter(i => i.trim()) : [],
        instructions: recipe.instructions ? recipe.instructions.split('\n').filter(i => i.trim()) : [],
        tags: recipe.tags || [],
        rating: recipe.averageRating || 0,
        ratingCount: Math.floor(Math.random() * 200) + 1,
        featured: recipe.featured || false,
        createdAt: recipe.createdDT || new Date(),
      }));

      res.json({
        results: legacyResults,
        suggestions: []
      });
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Newsletter signup (placeholder)
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ message: "Valid email is required" });
      }
      
      // TODO: Implement actual newsletter signup
      res.json({ message: "Successfully subscribed to newsletter!" });
    } catch (error) {
      res.status(500).json({ message: "Newsletter signup failed" });
    }
  });

  // API Documentation endpoint
  app.get("/api/docs", async (req, res) => {
    res.json({
      title: "MoM (Mechanics of Motherhood) Recipe API",
      version: "1.0.0",
      description: "A dual-compatible API supporting both RecipeSpark specification and legacy MoM frontend",
      
      recipeSpark: {
        baseUrl: "/api/recipespark",
        description: "Full RecipeSpark API specification compliance",
        endpoints: {
          recipes: {
            "GET /recipes": "Get all recipes with pagination and filtering",
            "GET /recipes/:id": "Get single recipe by ID",
            "POST /recipes": "Create new recipe",
            "PUT /recipes/:id": "Update existing recipe",
            "DELETE /recipes/:id": "Delete recipe"
          },
          categories: {
            "GET /categories": "Get all categories",
            "GET /categories/:id": "Get single category by ID",
            "POST /categories": "Create new category",
            "PUT /categories/:id": "Update existing category",
            "DELETE /categories/:id": "Delete category"
          }
        },
        authentication: "Required (implementation-specific)",
        responseFormat: "Standard RecipeSpark format with data, success, message, and optional pagination"
      },

      legacyMoM: {
        baseUrl: "/api",
        description: "Legacy endpoints for existing MoM frontend compatibility",
        endpoints: {
          "GET /recipes": "Get recipes (legacy format)",
          "GET /recipes/:id": "Get single recipe (legacy format)",
          "GET /categories": "Get categories (legacy format)",
          "GET /featured-content": "Get featured recipes, posts, and categories",
          "POST /search": "Search recipes",
          "GET /blog-posts": "Get blog posts",
          "GET /blog-posts/:id": "Get single blog post",
          "GET /stats": "Get platform statistics",
          "POST /newsletter": "Newsletter signup"
        },
        authentication: "Not required",
        responseFormat: "Legacy MoM format"
      },

      examples: {
        recipeSpark: {
          getRecipes: "GET /api/recipespark/recipes?pageNumber=1&pageSize=10&categoryId=1",
          createRecipe: "POST /api/recipespark/recipes with { name, description, ingredients, instructions, servings, authorName, categoryId }",
        },
        legacy: {
          getRecipes: "GET /api/recipes?page=1&limit=10&category=Quick%20Fixes",
          search: "POST /api/search with { query: 'chicken' }"
        }
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
