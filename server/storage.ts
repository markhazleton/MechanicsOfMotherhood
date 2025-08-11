import { type Recipe, type InsertRecipe, type BlogPost, type InsertBlogPost, type Category, type InsertCategory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Recipes - RecipeSpark API compatible
  getRecipes(params: { pageNumber?: number; pageSize?: number; categoryId?: number; searchTerm?: string; featured?: boolean }): Promise<{ recipes: Recipe[]; total: number }>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: InsertRecipe): Promise<Recipe | undefined>;
  deleteRecipe(id: number): Promise<boolean>;
  searchRecipes(query: string): Promise<Recipe[]>;
  getFeaturedRecipes(): Promise<Recipe[]>;

  // Categories - RecipeSpark API compatible
  getCategories(includeInactive?: boolean): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: InsertCategory): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Blog Posts (MoM specific)
  getBlogPosts(params: { page?: number; limit?: number; category?: string; featured?: boolean }): Promise<{ posts: BlogPost[]; total: number }>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;

  // Stats
  getStats(): Promise<{ recipes: number; families: number; timeSaved: number; communityMembers: number }>;
}

export class MemStorage implements IStorage {
  private recipes: Map<number, Recipe> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();
  private categories: Map<number, Category> = new Map();
  private nextRecipeId: number = 1;
  private nextCategoryId: number = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed Categories - RecipeSpark API compatible
    const categories = [
      { name: "Quick Fixes", description: "15-minute meals for busy schedules", displayOrder: 1, isActive: true, url: "quick-fixes", color: "#38B2AC", recipeCount: 45 },
      { name: "Kid-Friendly", description: "Child-approved recipes", displayOrder: 2, isActive: true, url: "kid-friendly", color: "#F59E0B", recipeCount: 32 },
      { name: "Healthy Build", description: "Nutritious family meals", displayOrder: 3, isActive: true, url: "healthy-build", color: "#10B981", recipeCount: 28 },
      { name: "Budget Tools", description: "Cost-effective cooking solutions", displayOrder: 4, isActive: true, url: "budget-tools", color: "#6366F1", recipeCount: 22 },
      { name: "Meal Prep", description: "Batch cooking systems", displayOrder: 5, isActive: true, url: "meal-prep", color: "#F56565", recipeCount: 18 },
    ];

    categories.forEach(cat => {
      const id = this.nextCategoryId++;
      this.categories.set(id, { id, ...cat });
    });

    // Seed Recipes - RecipeSpark API compatible
    const recipes = [
      {
        name: "One-Pan Chicken & Veggie Assembly",
        description: "Perfectly engineered for busy weeknights. Minimal cleanup, maximum flavor.",
        ingredients: "- 2 lbs chicken thighs\n- 2 cups mixed vegetables\n- 2 tbsp olive oil\n- 1 tsp garlic powder\n- Salt and pepper",
        instructions: "1. Preheat oven to 425°F\n2. Season chicken with spices\n3. Arrange chicken and vegetables on sheet pan\n4. Drizzle with oil\n5. Bake 25-30 minutes",
        servings: 4,
        authorNM: "MoM Engineering Team",
        recipeCategoryID: 1, // Quick Fixes
        isApproved: true,
        averageRating: 5,
        // MoM specific fields
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        prepTime: 10,
        cookTime: 25,
        difficulty: "easy" as const,
        tags: ["one-pan", "weeknight", "protein"],
        featured: true,
      },
      {
        name: "Sunday Prep Station Blueprint",
        description: "Strategic meal prep system that powers your entire week. Professional efficiency.",
        ingredients: "- 3 lbs chicken breast\n- 4 cups brown rice\n- 6 cups mixed vegetables\n- 2 cups quinoa",
        instructions: "1. Cook proteins in batches\n2. Prepare grains\n3. Steam vegetables\n4. Portion into containers",
        servings: 12,
        authorNM: "MoM Prep Specialists",
        recipeCategoryID: 5, // Meal Prep
        isApproved: true,
        averageRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        prepTime: 120,
        cookTime: 60,
        difficulty: "medium" as const,
        tags: ["meal-prep", "batch-cooking", "weekly"],
        featured: true,
      },
      {
        name: "Mini Builder's Lunch Kit",
        description: "Fun, interactive meals that keep little hands busy and bellies full. Zero complaints guaranteed.",
        ingredients: "- Whole grain crackers\n- Cheese cubes\n- Cherry tomatoes\n- Hummus\n- Carrot sticks",
        instructions: "1. Arrange items in compartmented container\n2. Include fun picks\n3. Add favorite dip",
        servings: 2,
        authorNM: "MoM Junior Division",
        recipeCategoryID: 2, // Kid-Friendly
        isApproved: true,
        averageRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        prepTime: 15,
        cookTime: 0,
        difficulty: "easy" as const,
        tags: ["no-cook", "lunch", "interactive"],
        featured: true,
      },
    ];

    recipes.forEach(recipe => {
      const id = this.nextRecipeId++;
      const now = new Date();
      this.recipes.set(id, { 
        id, 
        ...recipe,
        domainID: 2,
        createdDT: now,
        modifiedDT: now,
      });
    });

    // Seed Blog Posts
    const blogPosts = [
      {
        title: "The 5-Tool Kitchen Setup Every Working Mom Needs",
        excerpt: "Stop struggling with cluttered counters. Here's my engineer-approved system for maximum efficiency in minimum space...",
        content: "Long-form content about kitchen organization...",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        authorName: "Sarah M.",
        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        authorBio: "Working mom of two, former engineer",
        category: "MoM Tips",
        tags: ["kitchen", "organization", "efficiency"],
        readTime: 5,
        featured: true,
        published: true,
      },
      {
        title: "Project Planning: Sunday Prep Blueprint",
        excerpt: "Transform your Sunday into a meal prep powerhouse with this step-by-step engineering approach. Includes free downloadable templates...",
        content: "Detailed meal prep strategy...",
        imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        authorName: "Lisa K.",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        authorBio: "Meal prep expert and busy mom",
        category: "Strategy",
        tags: ["meal-prep", "planning", "templates"],
        readTime: 7,
        featured: true,
        published: true,
      },
    ];

    blogPosts.forEach(post => {
      const id = randomUUID();
      const now = new Date();
      this.blogPosts.set(id, { 
        id, 
        ...post, 
        publishedAt: now,
        createdAt: now 
      });
    });
  }

  // RecipeSpark API compatible methods
  async getRecipes(params: { pageNumber?: number; pageSize?: number; categoryId?: number; searchTerm?: string; featured?: boolean }): Promise<{ recipes: Recipe[]; total: number }> {
    let filtered = Array.from(this.recipes.values());

    if (params.categoryId) {
      filtered = filtered.filter(r => r.recipeCategoryID === params.categoryId);
    }
    if (params.searchTerm) {
      const searchTerm = params.searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchTerm) ||
        r.description?.toLowerCase().includes(searchTerm) ||
        r.ingredients?.toLowerCase().includes(searchTerm)
      );
    }
    if (params.featured) {
      filtered = filtered.filter(r => r.featured);
    }

    const total = filtered.length;
    const pageNumber = params.pageNumber || 1;
    const pageSize = params.pageSize || 20;
    const start = (pageNumber - 1) * pageSize;
    const recipes = filtered.slice(start, start + pageSize);

    return { recipes, total };
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const id = this.nextRecipeId++;
    const now = new Date();
    const newRecipe: Recipe = { 
      ...recipe, 
      id,
      domainID: 2,
      createdDT: now,
      modifiedDT: now,
    };
    this.recipes.set(id, newRecipe);
    return newRecipe;
  }

  async updateRecipe(id: number, recipe: InsertRecipe): Promise<Recipe | undefined> {
    const existing = this.recipes.get(id);
    if (!existing) return undefined;

    const updated: Recipe = {
      ...existing,
      ...recipe,
      id,
      modifiedDT: new Date(),
    };
    this.recipes.set(id, updated);
    return updated;
  }

  async deleteRecipe(id: number): Promise<boolean> {
    return this.recipes.delete(id);
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm) ||
      recipe.description?.toLowerCase().includes(searchTerm) ||
      recipe.ingredients?.toLowerCase().includes(searchTerm)
    );
  }

  async getFeaturedRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).filter(r => r.featured);
  }

  async getBlogPosts(params: { page?: number; limit?: number; category?: string; featured?: boolean }): Promise<{ posts: BlogPost[]; total: number }> {
    let filtered = Array.from(this.blogPosts.values()).filter(p => p.published);

    if (params.category) {
      filtered = filtered.filter(p => p.category === params.category);
    }
    if (params.featured) {
      filtered = filtered.filter(p => p.featured);
    }

    const total = filtered.length;
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const posts = filtered.slice(start, start + limit);

    return { posts, total };
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date();
    const newPost: BlogPost = { 
      ...post, 
      id, 
      publishedAt: now,
      createdAt: now 
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(p => p.featured && p.published);
  }

  // Categories - RecipeSpark API compatible
  async getCategories(includeInactive?: boolean): Promise<Category[]> {
    let categories = Array.from(this.categories.values());
    if (!includeInactive) {
      categories = categories.filter(c => c.isActive);
    }
    return categories.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.nextCategoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: InsertCategory): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;

    const updated: Category = {
      ...existing,
      ...category,
      id,
    };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  async getStats(): Promise<{ recipes: number; families: number; timeSaved: number; communityMembers: number }> {
    return {
      recipes: this.recipes.size,
      families: 10000,
      timeSaved: 2000000,
      communityMembers: 15000,
    };
  }
}

export const storage = new MemStorage();
