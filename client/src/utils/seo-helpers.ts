import type { Recipe } from "@/data/api-types";
import { getCategorySlug } from "@/utils/slugify";

/**
 * SEO utility functions for the Mechanics of Motherhood website
 */

export const SITE_CONFIG = {
  name: "Mechanics of Motherhood",
  shortName: "MoM",
  // Canonical base domain (custom domain)
  url: "https://mechanicsofmotherhood.com",
  description:
    "Engineering better meals for working mothers worldwide. Tested recipes, kitchen tools, and meal planning solutions.",
  author: "Mechanics of Motherhood",
  twitterHandle: "@MechanicsOfMom",
  defaultImage: "/images/logos/MOM-Logo-Full.png",
  logo: "/images/logos/mom-logo.png",
};

/**
 * Generate page title with site name
 */
export function generatePageTitle(pageTitle?: string): string {
  if (!pageTitle) return SITE_CONFIG.name + " - Engineering Better Meals";

  if (pageTitle.toLowerCase().includes("mechanics of motherhood")) {
    return pageTitle;
  }

  return `${pageTitle} | ${SITE_CONFIG.name}`;
}

/**
 * Generate meta description for recipe pages
 */
export function generateRecipeDescription(recipe: Recipe): string {
  if (recipe.description) {
    // Use first sentence or first 155 characters
    const firstSentence = recipe.description.split(".")[0] + ".";
    return firstSentence.length <= 155
      ? firstSentence
      : recipe.description.substring(0, 152) + "...";
  }

  const category = recipe.recipeCategory?.name || "recipe";
  const author = recipe.authorNM || "our chefs";
  return `Delicious ${
    recipe.name
  } ${category.toLowerCase()} by ${author}. Easy to follow recipe with ingredients and step-by-step instructions.`;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

/**
 * Generate recipe keywords from various sources
 */
export function generateRecipeKeywords(recipe: Recipe): string[] {
  const keywords: string[] = [];

  // Add recipe name variations
  keywords.push(recipe.name.toLowerCase());

  // Add category
  if (recipe.recipeCategory?.name) {
    keywords.push(recipe.recipeCategory.name.toLowerCase());
    keywords.push(`${recipe.recipeCategory.name.toLowerCase()} recipe`);
  }

  // Add SEO keywords from recipe data
  if (recipe.seO_Keywords) {
    const seoKeywords = recipe.seO_Keywords
      .split(/[\n\r]+/)
      .map((line) => line.trim())
      .filter((line) => line)
      .map((line) => line.replace(/^[-\d.]*\s*/, ""))
      .filter((keyword) => keyword.trim());

    keywords.push(...seoKeywords);
  }

  // Add common recipe-related keywords
  keywords.push("easy recipe", "family friendly", "working mom recipes");

  // Remove duplicates and empty strings
  const uniqueKeywords = keywords.filter((k) => k.trim());
  const deduped = Array.from(
    new Set(uniqueKeywords.map((k) => k.toLowerCase()))
  );
  // Reserved brand keywords ensure presence
  ["mom", "mechanics of motherhood", "recipes"].forEach((r) => {
    if (!deduped.includes(r)) deduped.push(r);
  });
  return deduped.slice(0, 20);
}

/**
 * Generate Open Graph image URL for recipes
 */
export function generateRecipeImageUrl(recipe: Recipe): string {
  // Check if recipe has images
  if (recipe.images && recipe.images.length > 0) {
    const imageUrl = recipe.images[0];
    if (imageUrl && imageUrl.startsWith("http")) {
      return imageUrl;
    }
    if (imageUrl) {
      return `${SITE_CONFIG.url}/images/recipes/${imageUrl}`;
    }
  }

  // Default recipe image
  return `${SITE_CONFIG.url}/images/hero/default-recipe.jpg`;
}

/**
 * Generate page-specific breadcrumbs
 */
export function generateBreadcrumbs(
  path: string,
  recipe?: Recipe,
  categoryName?: string
) {
  // Standard breadcrumb contract used by BreadcrumbNav: { name, href }
  const breadcrumbs: Array<{ name: string; href: string }> = [];

  if (path.includes("/recipes/category/")) {
    breadcrumbs.push({ name: "Recipes", href: "/recipes" });
    if (categoryName) {
      breadcrumbs.push({ name: categoryName, href: path });
    }
  } else if (path.includes("/recipe/")) {
    breadcrumbs.push({ name: "Recipes", href: "/recipes" });
    if (recipe?.recipeCategory?.name) {
      const categorySlug = getCategorySlug(recipe.recipeCategory.name);
      breadcrumbs.push({
        name: recipe.recipeCategory.name,
        href: `/recipes/category/${categorySlug}`,
      });
    }
    if (recipe?.name) {
      breadcrumbs.push({ name: recipe.name, href: path });
    }
  } else if (path === "/recipes") {
    breadcrumbs.push({ name: "Recipes", href: "/recipes" });
  } else if (path === "/categories") {
    breadcrumbs.push({ name: "Categories", href: "/categories" });
  } else if (path === "/blog") {
    breadcrumbs.push({ name: "Blog", href: "/blog" });
  } else if (path === "/") {
    // Home gets no additional crumb beyond Workshop (added in component)
  } else if (path === "/404" || path === "*") {
    breadcrumbs.push({ name: "Not Found", href: path });
  }

  return breadcrumbs;
}

/**
 * Optimize text for SEO (remove markdown, limit length)
 */
export function optimizeTextForSEO(
  text: string,
  maxLength: number = 155
): string {
  if (!text) return "";

  // Remove markdown syntax
  const cleanText = text
    .replace(/[*_`#]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();

  if (cleanText.length <= maxLength) return cleanText;

  // Cut at word boundary
  const truncated = cleanText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + "..."
    : truncated + "...";
}

/**
 * Generate schema.org recipe difficulty level
 */
export function getRecipeDifficulty(
  recipe: Recipe
): "Easy" | "Medium" | "Hard" {
  // This could be enhanced with actual difficulty calculation
  // For now, use default based on recipe complexity

  if (!recipe.ingredients || !recipe.instructions) return "Easy";

  const ingredientCount = recipe.ingredients
    .split("\n")
    .filter((i) => i.trim()).length;
  const instructionCount = recipe.instructions
    .split("\n")
    .filter((i) => i.trim()).length;

  if (ingredientCount <= 5 && instructionCount <= 5) return "Easy";
  if (ingredientCount <= 10 && instructionCount <= 8) return "Medium";
  return "Hard";
}

/**
 * Estimate cooking times (could be enhanced with actual data)
 */
export function estimateCookingTimes(recipe: Recipe) {
  // Default times - could be enhanced with ML or manual data
  const difficulty = getRecipeDifficulty(recipe);

  switch (difficulty) {
    case "Easy":
      return { cookTime: "PT35M", totalTime: "PT35M" };
    case "Medium":
      return { cookTime: "PT1H15M", totalTime: "PT1H15M" };
    case "Hard":
      return { cookTime: "PT2H15M", totalTime: "PT2H15M" };
    default:
      return { cookTime: "PT1H", totalTime: "PT1H" };
  }
}

/** Normalize arbitrary keyword array (dedupe + add brand + cap length) */
export function normalizeKeywords(list: string[]): string[] {
  const base = (list || [])
    .map((k) => k.trim())
    .filter(Boolean)
    .map((k) => k.toLowerCase());
  const set = new Set(base);
  ["mom", "mechanics of motherhood", "recipes"].forEach((r) => set.add(r));
  return Array.from(set).slice(0, 20);
}

/** Convert relative image or path to absolute canonical URL */
export function toAbsoluteUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${SITE_CONFIG.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Structured data: generic ItemList */
export function generateItemListStructuredData(
  items: Array<{ name: string; url: string }>,
  name: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/** Structured data: Blog (blog index page) */
export function generateBlogStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Mechanics of Motherhood Blog",
    url: `${SITE_CONFIG.url}/blog`,
    description:
      "Tips, tricks, and stories from the Mechanics of Motherhood home kitchen",
  };
}
