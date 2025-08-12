// Utility functions for SEO-friendly URL slugs
export function nameToSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function slugToName(slug: string): string {
  return slug.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Common category slug mappings for better SEO
export const categorySlugMap: Record<string, string> = {
  'appetizer': 'appetizers',
  'main-course': 'main-courses',
  'side-dishes': 'sides',
  'slow-cooker': 'slow-cooker-meals',
  'quick-meals': 'quick-easy',
  'dessert': 'desserts'
};

export function getCategorySlug(name: string): string {
  const basicSlug = nameToSlug(name);
  return categorySlugMap[basicSlug] || basicSlug;
}