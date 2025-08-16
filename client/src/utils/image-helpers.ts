/**
 * Utility functions for handling recipe images and fallbacks
 */

/**
 * Gets the appropriate image URL for a recipe
 * Falls back to placeholder if no image is available
 * Works with the immutable API structure
 */
export function getRecipeImageUrl(recipe: {
  images?: string[] | null;
  name?: string;
}): string {
  // Check if recipe has images and the first image exists
  if (
    recipe.images &&
    Array.isArray(recipe.images) &&
    recipe.images.length > 0 &&
    recipe.images[0] &&
    recipe.images[0].trim() !== ""
  ) {
    // If it's a full URL, use it directly
    if (recipe.images[0].startsWith("http")) {
      return recipe.images[0];
    }
    // Otherwise, treat it as a relative path from the images/recipes directory
    return `/images/recipes/${recipe.images[0]}`;
  }

  // Fall back to our custom placeholder
  return "/images/recipes/mom-recipe-placeholder.svg";
}

/**
 * Gets alt text for recipe images
 */
export function getRecipeImageAlt(recipe: { name?: string }): string {
  return recipe.name ? `${recipe.name} recipe image` : "Recipe image";
}

/**
 * Checks if a recipe has a valid image
 */
export function hasRecipeImage(recipe: { images?: string[] | null }): boolean {
  return !!(
    recipe.images &&
    Array.isArray(recipe.images) &&
    recipe.images.length > 0 &&
    recipe.images[0] &&
    recipe.images[0].trim() !== ""
  );
}
