import type { Recipe } from '@/data/api-types';
// Helper to derive the canonical site base at build/runtime.
function getSiteBase() {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  // Build-time fallback: prefer custom domain env, else GitHub Pages.
  const envDomain = (process.env.VITE_CUSTOM_DOMAIN as string | undefined);
  return envDomain ? `https://${envDomain}` : 'https://sharesmallbiz-support.github.io/MechanicsOfMotherhood';
}
const SITE_BASE = getSiteBase();

interface RecipeStructuredDataProps {
  recipe: Recipe;
  url: string;
  imageUrl?: string;
}

export function generateRecipeStructuredData({ recipe, url, imageUrl }: RecipeStructuredDataProps) {
  // Parse ingredients from the recipe string format
  const ingredients = recipe.ingredients 
    ? recipe.ingredients.split(/\r?\n/).filter(line => line.trim()).map(line => line.trim())
    : [];

  // Parse instructions from the recipe string format
  const instructions = recipe.instructions
    ? recipe.instructions.split(/\r?\n/).filter(line => line.trim()).map((instruction, index) => ({
        "@type": "HowToStep",
        "name": `Step ${index + 1}`,
        "text": instruction.trim()
      }))
    : [];

  // Parse keywords from SEO_Keywords field
  const keywords = recipe.seO_Keywords
    ? recipe.seO_Keywords
        .split(/[\n\r]+/)
        .map(line => line.trim())
        .filter(line => line)
        .map(line => line.replace(/^[-\d.]*\s*/, ''))
        .filter(keyword => keyword.trim())
        .join(', ')
    : '';

  // Generate recipe schema
  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": recipe.name,
    "description": recipe.description || `Delicious ${recipe.name} recipe from Mechanics of Motherhood`,
  "image": imageUrl || `${SITE_BASE}/images/hero/default-recipe.jpg`,
    "author": {
      "@type": "Person",
      "name": recipe.authorNM || "Mechanics of Motherhood"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mechanics of Motherhood",
  "url": SITE_BASE + '/',
      "logo": {
        "@type": "ImageObject",
  "url": `${SITE_BASE}/images/logos/mom-logo.png`
      }
    },
    "url": url,
    "recipeCategory": recipe.recipeCategory?.name || "Main Course",
    "recipeCuisine": "American", // Default cuisine, could be made dynamic
    "recipeYield": recipe.servings?.toString() || "4",
    "prepTime": "PT30M", // Default 30 minutes, could be made dynamic
    "cookTime": "PT30M", // Default 30 minutes, could be made dynamic
    "totalTime": "PT1H", // Default 1 hour, could be made dynamic
    "keywords": keywords,
    "recipeIngredient": ingredients,
    "recipeInstructions": instructions,
    "aggregateRating": recipe.averageRating && recipe.ratingCount ? {
      "@type": "AggregateRating",
      "ratingValue": recipe.averageRating.toString(),
      "ratingCount": recipe.ratingCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "nutrition": {
      "@type": "NutritionInformation",
      "servingSize": "1 serving"
      // Additional nutrition info could be added here
    },
    "video": undefined, // Could be added for recipe videos
    "datePublished": recipe.lastViewDT || recipe.modifiedDT,
    "dateModified": recipe.modifiedDT
  };

  // Remove undefined properties
  return JSON.parse(JSON.stringify(recipeSchema));
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mechanics of Motherhood",
    "alternateName": "MoM",
    "description": "Engineering better meals for working mothers worldwide",
  "url": SITE_BASE + '/',
    "logo": {
      "@type": "ImageObject",
  "url": `${SITE_BASE}/images/logos/mom-logo.png`
    },
    "sameAs": [
      // Add social media URLs when available
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };
}

export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mechanics of Motherhood",
    "alternateName": "MoM",
  "url": SITE_BASE + '/',
    "description": "Engineering better meals for working mothers worldwide",
    "publisher": {
      "@type": "Organization",
      "name": "Mechanics of Motherhood"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
  "urlTemplate": `${SITE_BASE}/recipes?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}
