import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// RecipeSpark API compatible schema
export const recipes = pgTable("recipes", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(), // API uses 'name' instead of 'title'
  description: text("description"),
  ingredients: text("ingredients"), // API uses text instead of array
  instructions: text("instructions"), // API uses text instead of array
  servings: integer("servings").default(1),
  authorNM: text("author_nm"), // API field name
  recipeCategoryID: integer("recipe_category_id").notNull(),
  domainID: integer("domain_id").default(2),
  createdDT: timestamp("created_dt").defaultNow(),
  modifiedDT: timestamp("modified_dt").defaultNow(),
  isApproved: boolean("is_approved").default(true),
  averageRating: integer("average_rating").default(0),
  // Additional fields for MoM functionality
  imageUrl: text("image_url"),
  prepTime: integer("prep_time").default(30),
  cookTime: integer("cook_time").default(30),
  difficulty: varchar("difficulty", { enum: ["easy", "medium", "hard"] }).default("easy"),
  tags: jsonb("tags").$type<string[]>().default([]),
  featured: boolean("featured").default(false),
});

export const categories = pgTable("recipe_categories", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  displayOrder: integer("display_order").default(99),
  isActive: boolean("is_active").default(true),
  url: text("url"),
  // Additional fields for MoM functionality
  color: text("color").default("#38B2AC"),
  recipeCount: integer("recipe_count").default(0),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  authorName: text("author_name").notNull(),
  authorAvatar: text("author_avatar").notNull(),
  authorBio: text("author_bio").notNull(),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  readTime: integer("read_time").notNull(),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// API Response types for RecipeSpark compatibility
export const apiResponseSchema = z.object({
  data: z.any(),
  success: z.boolean(),
  message: z.string(),
  pagination: z.object({
    currentPage: z.number(),
    pageSize: z.number(),
    totalCount: z.number(),
    totalPages: z.number(),
    hasPrevious: z.boolean(),
    hasNext: z.boolean(),
  }).optional(),
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdDT: true,
  modifiedDT: true,
  domainID: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  publishedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type ApiResponse<T = any> = z.infer<typeof apiResponseSchema> & {
  data: T;
};

// WebCMS API Schema (from WebSpark)
export const websites = pgTable("websites", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  siteTemplate: varchar("site_template", { length: 100 }),
  siteStyle: varchar("site_style", { length: 100 }),
  message: text("message"), // Welcome message in Markdown
  siteName: varchar("site_name", { length: 255 }),
  websiteUrl: varchar("website_url", { length: 500 }),
  websiteTitle: varchar("website_title", { length: 255 }),
  useBreadCrumbURL: boolean("use_breadcrumb_url").default(true),
  isRecipeSite: boolean("is_recipe_site").default(false),
  modifiedDT: timestamp("modified_dt").defaultNow(),
  modifiedID: integer("modified_id"),
});

export const menuItems = pgTable("menu_items", {
  id: integer("id").primaryKey(),
  domainID: integer("domain_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  pageContent: text("page_content"), // Content in Markdown
  action: varchar("action", { length: 100 }),
  controller: varchar("controller", { length: 100 }),
  argument: varchar("argument", { length: 255 }),
  url: varchar("url", { length: 255 }),
  description: text("description"),
  displayInNavigation: boolean("display_in_navigation").default(true),
  displayOrder: integer("display_order").default(0),
  parentId: integer("parent_id"),
  lastModified: timestamp("last_modified").defaultNow(),
});

export const insertWebsiteSchema = createInsertSchema(websites, {
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  websiteUrl: z.string().url().optional(),
}).omit({
  id: true,
  modifiedDT: true,
  modifiedID: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems, {
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  displayOrder: z.number().min(0).default(0),
}).omit({
  id: true,
  lastModified: true,
});

export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;
export type Website = typeof websites.$inferSelect;

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
