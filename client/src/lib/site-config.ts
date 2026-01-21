/**
 * Centralized Site Configuration
 * Single source of truth for all site-wide settings, branding, and URLs
 */

// Derive the canonical site base at build/runtime
function getSiteBase(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  // Build-time fallback: prefer custom domain env, else canonical domain
  const envDomain = import.meta.env.VITE_CUSTOM_DOMAIN as string | undefined;
  return envDomain ? `https://${envDomain}` : 'https://mechanicsofmotherhood.com';
}

export const SITE_CONFIG = {
  // Branding
  name: {
    full: 'Mechanics of Motherhood',
    short: 'MoM',
    tagline: 'Family Favorites',
  },
  
  // Domain & URLs
  domain: 'mechanicsofmotherhood.com',
  baseUrl: getSiteBase(),
  
  // SEO Defaults
  seo: {
    title: 'Mechanics of Motherhood (MoM) - Real Recipes for Real Moms',
    description: 'Delicious, tested recipes for working mothers worldwide. Easy family meals and meal planning solutions for busy families.',
    keywords: [
      'working mother recipes',
      'quick family meals',
      'easy dinner recipes',
      'meal planning for busy moms',
      'family cooking',
      'time-saving recipes',
      'healthy meal prep'
    ] as string[],
  },
  
  // Theme
  theme: {
    primaryColor: '#ED8936', // Accent orange
    secondaryColor: '#38B2AC', // Teal
    brandColor: '#2C3E50', // Brand blue
  },
  
  // Social & Contact
  social: {
    // Add social links as needed
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined,
  },
} as const;

export default SITE_CONFIG;
