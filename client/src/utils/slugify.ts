// Utility functions for SEO-friendly URL slugs
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Convert recipe name to SEO-friendly slug
export function recipeNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, "") // Remove special characters except spaces
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// Convert slug back to search for recipe name
export function recipeSlugToSearchTerm(slug: string): string {
  return slug.replace(/-/g, " ");
}

// Common category slug mappings for better SEO and user experience
// Only map where absolutely necessary for SEO or user clarity
export const categorySlugMap: Record<string, string> = {
  // Keep these simple and intuitive - most categories will use basic slugification
};

export function getCategorySlug(name: string): string {
  const basicSlug = nameToSlug(name);
  return categorySlugMap[basicSlug] || basicSlug;
}
