// Quick test to verify image URL generation logic
const recipe1 = { images: null, name: "Test Recipe" };
const recipe2 = { images: [], name: "Empty Images Recipe" };
const recipe3 = { images: ["custom-image.jpg"], name: "Custom Image Recipe" };
const recipe4 = { images: ["https://example.com/external.jpg"], name: "External Image Recipe" };

// Simulate the base URL logic
const baseUrl = process.env.NODE_ENV === "production" ? "/MechanicsOfMotherhood/" : "/";

function testGetRecipeImageUrl(recipe) {
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
    return `${baseUrl}images/recipes/${recipe.images[0]}`;
  }

  // Fall back to our custom placeholder
  return `${baseUrl}images/recipes/mom-recipe-placeholder.svg`;
}

console.log("Testing image URL generation:");
console.log(`Base URL: ${baseUrl}`);
console.log(`Recipe 1 (null images): ${testGetRecipeImageUrl(recipe1)}`);
console.log(`Recipe 2 (empty images): ${testGetRecipeImageUrl(recipe2)}`);
console.log(`Recipe 3 (custom image): ${testGetRecipeImageUrl(recipe3)}`);
console.log(`Recipe 4 (external image): ${testGetRecipeImageUrl(recipe4)}`);
