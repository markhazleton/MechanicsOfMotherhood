import { type Recipe, type InsertRecipe, type BlogPost, type InsertBlogPost, type Category, type InsertCategory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Recipes
  getRecipes(params: { page?: number; limit?: number; category?: string; difficulty?: string; featured?: boolean }): Promise<{ recipes: Recipe[]; total: number }>;
  getRecipe(id: string): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  searchRecipes(query: string): Promise<Recipe[]>;
  getFeaturedRecipes(): Promise<Recipe[]>;

  // Blog Posts
  getBlogPosts(params: { page?: number; limit?: number; category?: string; featured?: boolean }): Promise<{ posts: BlogPost[]; total: number }>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Stats
  getStats(): Promise<{ recipes: number; families: number; timeSaved: number; communityMembers: number }>;
}

export class MemStorage implements IStorage {
  private recipes: Map<string, Recipe> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();
  private categories: Map<string, Category> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed Categories
    const categories = [
      { name: "Quick Fixes", description: "15-minute meals", color: "#38B2AC", recipeCount: 45, postCount: 12 },
      { name: "Kid-Friendly", description: "Child-approved recipes", color: "#F59E0B", recipeCount: 32, postCount: 8 },
      { name: "Healthy Build", description: "Nutritious family meals", color: "#10B981", recipeCount: 28, postCount: 15 },
      { name: "Budget Tools", description: "Cost-effective cooking", color: "#6366F1", recipeCount: 22, postCount: 6 },
      { name: "Meal Prep", description: "Batch cooking systems", color: "#F56565", recipeCount: 18, postCount: 10 },
    ];

    categories.forEach(cat => {
      const id = randomUUID();
      this.categories.set(id, { id, ...cat });
    });

    // Seed Recipes
    const recipes = [
      {
        title: "One-Pan Chicken & Veggie Assembly",
        description: "Perfectly engineered for busy weeknights. Minimal cleanup, maximum flavor.",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        prepTime: 10,
        cookTime: 25,
        servings: 4,
        difficulty: "easy" as const,
        category: "Quick Fixes",
        ingredients: ["2 lbs chicken thighs", "2 cups mixed vegetables", "2 tbsp olive oil", "1 tsp garlic powder", "Salt and pepper"],
        instructions: ["Preheat oven to 425°F", "Season chicken with spices", "Arrange chicken and vegetables on sheet pan", "Drizzle with oil", "Bake 25-30 minutes"],
        tags: ["one-pan", "weeknight", "protein"],
        rating: 5,
        ratingCount: 124,
        featured: true,
      },
      {
        title: "Sunday Prep Station Blueprint",
        description: "Strategic meal prep system that powers your entire week. Professional efficiency.",
        imageUrl: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        prepTime: 120,
        cookTime: 60,
        servings: 12,
        difficulty: "medium" as const,
        category: "Meal Prep",
        ingredients: ["3 lbs chicken breast", "4 cups brown rice", "6 cups mixed vegetables", "2 cups quinoa"],
        instructions: ["Cook proteins in batches", "Prepare grains", "Steam vegetables", "Portion into containers"],
        tags: ["meal-prep", "batch-cooking", "weekly"],
        rating: 5,
        ratingCount: 89,
        featured: true,
      },
      {
        title: "Mini Builder's Lunch Kit",
        description: "Fun, interactive meals that keep little hands busy and bellies full. Zero complaints guaranteed.",
        imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        prepTime: 15,
        cookTime: 0,
        servings: 2,
        difficulty: "easy" as const,
        category: "Kid-Friendly",
        ingredients: ["Whole grain crackers", "Cheese cubes", "Cherry tomatoes", "Hummus", "Carrot sticks"],
        instructions: ["Arrange items in compartmented container", "Include fun picks", "Add favorite dip"],
        tags: ["no-cook", "lunch", "interactive"],
        rating: 5,
        ratingCount: 156,
        featured: true,
      },
    ];

    recipes.forEach(recipe => {
      const id = randomUUID();
      const now = new Date();
      this.recipes.set(id, { 
        id, 
        ...recipe, 
        createdAt: now 
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

  async getRecipes(params: { page?: number; limit?: number; category?: string; difficulty?: string; featured?: boolean }): Promise<{ recipes: Recipe[]; total: number }> {
    let filtered = Array.from(this.recipes.values());

    if (params.category) {
      filtered = filtered.filter(r => r.category === params.category);
    }
    if (params.difficulty) {
      filtered = filtered.filter(r => r.difficulty === params.difficulty);
    }
    if (params.featured) {
      filtered = filtered.filter(r => r.featured);
    }

    const total = filtered.length;
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const recipes = filtered.slice(start, start + limit);

    return { recipes, total };
  }

  async getRecipe(id: string): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const id = randomUUID();
    const newRecipe: Recipe = { 
      ...recipe, 
      id, 
      createdAt: new Date() 
    };
    this.recipes.set(id, newRecipe);
    return newRecipe;
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm))
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

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
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
