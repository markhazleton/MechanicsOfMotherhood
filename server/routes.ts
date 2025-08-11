import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get recipes with pagination and filtering
  app.get("/api/recipes", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const difficulty = req.query.difficulty as string;
      const featured = req.query.featured === 'true';

      const result = await storage.getRecipes({ page, limit, category, difficulty, featured });
      
      res.json({
        recipes: result.recipes,
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

  // Get single recipe
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const recipe = await storage.getRecipe(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipe" });
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

  // Get categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
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

      res.json({
        recipes,
        posts,
        categories
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

  const httpServer = createServer(app);
  return httpServer;
}
