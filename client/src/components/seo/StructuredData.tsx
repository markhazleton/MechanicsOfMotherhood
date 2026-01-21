import type { Recipe } from '@/data/api-types';
import SITE_CONFIG from '@/lib/site-config';

const SITE_BASE = SITE_CONFIG.baseUrl;

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
    "description": recipe.description || `Delicious ${recipe.name} recipe from ${SITE_CONFIG.name.full} (${SITE_CONFIG.name.short})`,
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
  "recipeCategory": recipe.recipeCategory?.name || undefined,
  // Removed recipeCuisine, cookTime, totalTime: no API support – avoid synthetic values
  "recipeYield": recipe.servings?.toString() || undefined,
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
    "name": `${SITE_CONFIG.name.full} (${SITE_CONFIG.name.short})`,
    "alternateName": SITE_CONFIG.name.short,
    "description": SITE_CONFIG.seo.description,
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
    "name": `${SITE_CONFIG.name.full} (${SITE_CONFIG.name.short})`,
    "alternateName": SITE_CONFIG.name.short,
  "url": SITE_BASE + '/',
    "description": SITE_CONFIG.seo.description,
    "publisher": {
      "@type": "Organization",
      "name": `${SITE_CONFIG.name.full} (${SITE_CONFIG.name.short})`
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
