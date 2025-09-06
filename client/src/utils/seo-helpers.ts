import type { Recipe } from "@/data/api-types";

/**
 * SEO utility functions for the Mechanics of Motherhood website
 */

export const SITE_CONFIG = {
  name: "Mechanics of Motherhood",
  shortName: "MoM",
  url: "https://sharesmallbiz-support.github.io/MechanicsOfMotherhood",
  description:
    "Engineering better meals for working mothers worldwide. Tested recipes, kitchen tools, and meal planning solutions.",
  author: "Mechanics of Motherhood",
  twitterHandle: "@MechanicsOfMom",
  defaultImage: "/images/hero/mom-og-image.png",
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
  return Array.from(new Set(uniqueKeywords));
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
  const breadcrumbs: Array<{ name: string; url: string }> = [];

  if (path.includes("/recipes/category/")) {
    breadcrumbs.push({ name: "Recipe Manual", url: "/recipes" });
    if (categoryName) {
      breadcrumbs.push({ name: categoryName, url: path });
    }
  } else if (path.includes("/recipe/")) {
    breadcrumbs.push({ name: "Recipe Manual", url: "/recipes" });
    if (recipe?.recipeCategory?.name) {
      breadcrumbs.push({
        name: recipe.recipeCategory.name,
        url: `/recipes/category/${recipe.recipeCategory.name
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      });
    }
    if (recipe?.name) {
      breadcrumbs.push({ name: recipe.name, url: path });
    }
  } else if (path === "/recipes") {
    breadcrumbs.push({ name: "Recipe Manual", url: "/recipes" });
  } else if (path === "/blog") {
    breadcrumbs.push({ name: "Maintenance Log", url: "/blog" });
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
