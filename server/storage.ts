import { type Recipe, type InsertRecipe, type BlogPost, type InsertBlogPost, type Category, type InsertCategory, type Website, type InsertWebsite, type MenuItem, type InsertMenuItem } from "@shared/schema";
import { randomUUID } from "crypto";
import { recipeSparkClient, type ExternalRecipe, type ExternalCategory } from "./api-client.js";

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

  // WebCMS API Methods
  getWebsites(params: { page?: number; pageSize?: number; search?: string; template?: string; isRecipeSite?: boolean }): Promise<{ websites: Website[]; total: number }>;
  getWebsite(id: number): Promise<Website | undefined>;
  createWebsite(website: InsertWebsite): Promise<Website>;
  updateWebsite(id: number, website: Partial<InsertWebsite>): Promise<Website | undefined>;
  deleteWebsite(id: number): Promise<boolean>;

  getMenuItems(params: { page?: number; pageSize?: number; search?: string; domainId?: number; parentId?: number; displayInNavigation?: boolean }): Promise<{ menuItems: MenuItem[]; total: number }>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  getMenuHierarchy(websiteId: number): Promise<MenuItem[]>;
  bulkUpdateMenuOrder(menuOrders: { menuId: number; displayOrder: number }[]): Promise<{ updatedCount: number; errors: any[] }>;

  // Dashboard and search
  getDashboardStats(): Promise<any>;
  globalSearch(query: string, page?: number, pageSize?: number): Promise<any>;
}

export class MemStorage implements IStorage {
  private recipes: Map<number, Recipe> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();
  private categories: Map<number, Category> = new Map();
  private websites: Map<number, Website> = new Map();
  private menuItems: Map<number, MenuItem> = new Map();
  private nextRecipeId: number = 1;
  private nextCategoryId: number = 1;
  private nextWebsiteId: number = 1;
  private nextMenuItemId: number = 1;

  constructor() {
    this.seedData();
  }

  // Transformation methods for external API data
  private transformExternalRecipe = (external: ExternalRecipe): Recipe => {
    return {
      id: external.id,
      name: external.name,
      description: external.description || null,
      ingredients: external.ingredients || null,
      instructions: external.instructions || null,
      servings: external.servings || null,
      authorNM: external.authorNM || null,
      recipeCategoryID: external.recipeCategoryID,
      domainID: external.domainID,
      createdDT: new Date(external.modifiedDT),
      modifiedDT: new Date(external.modifiedDT),
      prepTime: null,
      cookTime: null,
      difficulty: null,
      imageUrl: null,
      tags: null,
      averageRating: external.averageRating || null,
      featured: null,
      viewCount: external.viewCount || null,
      recipeURL: external.recipeURL || null,
      seO_Keywords: null,
      isApproved: external.isApproved || null,
    };
  };

  private transformExternalCategory = (external: ExternalCategory): Category => {
    return {
      id: external.id,
      name: external.name,
      description: external.description || null,
      displayOrder: external.order || null,
      isActive: external.isActive || null,
      url: external.url || null,
      color: null,
      recipeCount: null,
    };
  };

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
    try {
      const response = await recipeSparkClient.getRecipes(params);
      
      // Transform external API format to our schema
      const recipes: Recipe[] = response.data.map(this.transformExternalRecipe);
      
      return {
        recipes,
        total: response.pagination?.totalCount || recipes.length
      };
    } catch (error) {
      console.error('Failed to fetch recipes from external API:', error);
      // Fallback to empty results on API failure
      return { recipes: [], total: 0 };
    }
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    try {
      const external = await recipeSparkClient.getRecipe(id);
      return this.transformExternalRecipe(external);
    } catch (error) {
      console.error(`Failed to fetch recipe ${id} from external API:`, error);
      return undefined;
    }
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
    try {
      const response = await recipeSparkClient.getRecipes({ searchTerm: query, pageSize: 50 });
      return response.data.map(this.transformExternalRecipe);
    } catch (error) {
      console.error('Failed to search recipes from external API:', error);
      return [];
    }
  }

  async getFeaturedRecipes(): Promise<Recipe[]> {
    try {
      const response = await recipeSparkClient.getRecipes({ featured: true, pageSize: 10 });
      return response.data.map(this.transformExternalRecipe);
    } catch (error) {
      console.error('Failed to fetch featured recipes from external API:', error);
      return [];
    }
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
    try {
      const response = await recipeSparkClient.getCategories();
      let categories = response.data.map(this.transformExternalCategory);
      if (!includeInactive) {
        categories = categories.filter(c => c.isActive);
      }
      return categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    } catch (error) {
      console.error('Failed to fetch categories from external API:', error);
      return [];
    }
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

  // WebCMS API Methods (stub implementations for now)
  async getWebsites(params: any): Promise<{ websites: Website[]; total: number }> {
    if (this.websites.size === 0) {
      const id = this.nextWebsiteId++;
      this.websites.set(id, {
        id,
        name: "Mechanics of Motherhood",
        description: "The ultimate recipe and parenting resource for working mothers",
        siteTemplate: "Modern",
        siteStyle: "Industrial",
        websiteUrl: "https://mechanicsofmotherhood.com",
        isRecipeSite: true,
        modifiedDT: new Date(),
        modifiedID: 1,
      } as Website);
    }
    return { websites: Array.from(this.websites.values()), total: this.websites.size };
  }

  async getWebsite(id: number): Promise<Website | undefined> {
    return this.websites.get(id);
  }

  async createWebsite(website: InsertWebsite): Promise<Website> {
    const id = this.nextWebsiteId++;
    const newWebsite: Website = { ...website, id, modifiedDT: new Date(), modifiedID: 1 } as Website;
    this.websites.set(id, newWebsite);
    return newWebsite;
  }

  async updateWebsite(id: number, website: Partial<InsertWebsite>): Promise<Website | undefined> {
    const existing = this.websites.get(id);
    if (!existing) return undefined;
    const updated: Website = { ...existing, ...website, id, modifiedDT: new Date() };
    this.websites.set(id, updated);
    return updated;
  }

  async deleteWebsite(id: number): Promise<boolean> {
    return this.websites.delete(id);
  }

  // Stub menu implementations
  async getMenuItems(params: any): Promise<{ menuItems: MenuItem[]; total: number }> {
    return { menuItems: Array.from(this.menuItems.values()), total: this.menuItems.size };
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.nextMenuItemId++;
    const newMenuItem: MenuItem = { ...menuItem, id, lastModified: new Date() } as MenuItem;
    this.menuItems.set(id, newMenuItem);
    return newMenuItem;
  }

  async updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const existing = this.menuItems.get(id);
    if (!existing) return undefined;
    const updated: MenuItem = { ...existing, ...menuItem, id, lastModified: new Date() };
    this.menuItems.set(id, updated);
    return updated;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  async getMenuHierarchy(websiteId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(m => m.domainID === websiteId);
  }

  async bulkUpdateMenuOrder(menuOrders: { menuId: number; displayOrder: number }[]): Promise<{ updatedCount: number; errors: any[] }> {
    let updatedCount = 0;
    const errors: any[] = [];
    
    for (const order of menuOrders) {
      const menuItem = this.menuItems.get(order.menuId);
      if (menuItem) {
        menuItem.displayOrder = order.displayOrder;
        menuItem.lastModified = new Date();
        updatedCount++;
      } else {
        errors.push(`Menu item ${order.menuId} not found`);
      }
    }
    
    return { updatedCount, errors };
  }

  async getDashboardStats(): Promise<any> {
    return {
      totalWebsites: this.websites.size,
      totalMenuItems: this.menuItems.size,
      recentWebsites: Array.from(this.websites.values()).slice(0, 5),
      recentMenuItems: Array.from(this.menuItems.values()).slice(0, 5),
    };
  }

  async globalSearch(query: string, page?: number, pageSize?: number): Promise<any> {
    const results: any[] = [];
    return {
      query,
      items: results,
      totalCount: 0,
      page: page || 1,
      pageSize: pageSize || 20,
      totalPages: 0,
      websiteCount: 0,
      menuItemCount: 0,
    };
  }
}

export const storage = new MemStorage();
