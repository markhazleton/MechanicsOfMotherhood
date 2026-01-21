/**
 * Advanced Google Analytics Implementation for Mechanics of Motherhood (MoM)
 * Comprehensive tracking for recipe interactions, user engagement, and conversion events
 */

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string | Date, config?: any) => void;
    dataLayer: any[];
  }
}

// Analytics Events Configuration
export const ANALYTICS_EVENTS = {
  // Recipe Interactions
  RECIPE_VIEW: "recipe_view",
  RECIPE_SEARCH: "recipe_search",
  RECIPE_CATEGORY_VIEW: "recipe_category_view",
  RECIPE_INGREDIENT_VIEW: "recipe_ingredient_view",
  RECIPE_INSTRUCTION_VIEW: "recipe_instruction_view",

  // Navigation & Engagement
  PAGE_VIEW: "page_view",
  SEARCH_PERFORMED: "search",
  CATEGORY_BROWSE: "category_browse",
  NAVIGATION_CLICK: "navigation_click",

  // User Actions
  BUTTON_CLICK: "button_click",
  LINK_CLICK: "link_click",
  FORM_SUBMIT: "form_submit",

  // Content Engagement
  CONTENT_ENGAGEMENT: "content_engagement",
  TIME_ON_PAGE: "time_on_page",
  SCROLL_DEPTH: "scroll_depth",

  // Conversion Events
  RECIPE_COMPLETE_VIEW: "recipe_complete_view",
  CATEGORY_EXPLORATION: "category_exploration",
  SITE_ENGAGEMENT: "site_engagement",
} as const;

// Recipe Categories for Enhanced Tracking
export const RECIPE_CATEGORIES = {
  QUICK_MEALS: "quick-meals",
  BREAKFAST: "breakfast",
  MAIN_COURSE: "main-course",
  DESSERTS: "desserts",
  SNACKS: "snacks",
  BEVERAGES: "beverages",
} as const;

// Analytics Configuration
const ANALYTICS_CONFIG = {
  TRACKING_ID: "G-M7TYR1V6KP",
  ENHANCED_ECOMMERCE: true,
  CUSTOM_DIMENSIONS: {
    RECIPE_CATEGORY: "custom_dimension_1",
    RECIPE_DIFFICULTY: "custom_dimension_2",
    RECIPE_PREP_TIME: "custom_dimension_3",
    USER_ENGAGEMENT_LEVEL: "custom_dimension_4",
  },
};

// Build version helper (meta tag produced at build time)
function getBuildMeta() {
  if (typeof document === "undefined")
    return {} as { build_version?: string; build_time?: string };
  const meta = document.querySelector(
    'meta[name="app-build"]'
  ) as HTMLMetaElement | null;
  if (!meta?.content) return {};
  const content = meta.content;
  // Content format: ISO-TIMESTAMP-HASH (our injector concatenates with final dash+hash)
  const lastDash = content.lastIndexOf("-");
  let buildTime = content;
  let hash = "";
  if (lastDash > 0) {
    buildTime = content.substring(0, lastDash);
    hash = content.substring(lastDash + 1);
  }
  return {
    build_version: hash || content,
    build_time: buildTime,
  };
}

// Merge build meta into event payload
function withBuildMeta<T extends Record<string, any>>(data: T): T {
  return { ...data, ...getBuildMeta() };
}

/**
 * Initialize Google Analytics Enhanced Features
 */
export function initializeAnalytics(): void {
  if (typeof window === "undefined" || !window.gtag) {
    console.warn("Google Analytics not available");
    return;
  }

  // Enhanced ecommerce configuration
  window.gtag("config", ANALYTICS_CONFIG.TRACKING_ID, {
    enhanced_ecommerce: ANALYTICS_CONFIG.ENHANCED_ECOMMERCE,
    custom_map: ANALYTICS_CONFIG.CUSTOM_DIMENSIONS,
    // Enable additional features
    allow_google_signals: true,
    allow_ad_personalization_signals: true,
    send_page_view: true,
  });

  console.log("Advanced Analytics initialized for MoM");
}

/**
 * Track Enhanced Page Views with Recipe Context
 */
export function trackPageView(
  pagePath: string,
  pageTitle?: string,
  additionalData?: {
    recipe_id?: string;
    recipe_name?: string;
    category?: string;
    search_term?: string;
  }
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  const pageViewData: any = {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  };

  // Add recipe-specific data
  if (additionalData) {
    if (additionalData.recipe_id) {
      pageViewData.recipe_id = additionalData.recipe_id;
    }
    if (additionalData.recipe_name) {
      pageViewData.recipe_name = additionalData.recipe_name;
    }
    if (additionalData.category) {
      pageViewData.recipe_category = additionalData.category;
    }
    if (additionalData.search_term) {
      pageViewData.search_term = additionalData.search_term;
    }
  }

  window.gtag("event", ANALYTICS_EVENTS.PAGE_VIEW, withBuildMeta(pageViewData));
}

/**
 * Track Recipe Interactions with Enhanced Data
 */
export function trackRecipeInteraction(
  action: string,
  recipeData: {
    id: string | number;
    name: string;
    category?: string;
    difficulty?: string;
    prepTime?: number;
    servings?: number;
    rating?: number;
  },
  additionalData?: Record<string, any>
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  const eventData = {
    recipe_id: recipeData.id.toString(),
    recipe_name: recipeData.name,
    recipe_category: recipeData.category || "unknown",
    ...(recipeData.difficulty
      ? { recipe_difficulty: recipeData.difficulty }
      : {}),
    ...(typeof recipeData.prepTime === "number"
      ? { recipe_prep_time: recipeData.prepTime }
      : {}),
    recipe_servings: recipeData.servings || 0,
    recipe_rating: recipeData.rating || 0,
    ...additionalData,
  };

  window.gtag("event", action, withBuildMeta(eventData));
}

/**
 * Track Recipe Views with Enhanced Ecommerce
 */
export function trackRecipeView(recipeData: {
  id: string | number;
  name: string;
  category?: string;
  difficulty?: string;
  prepTime?: number;
  servings?: number;
  rating?: number;
  description?: string;
}): void {
  if (typeof window === "undefined" || !window.gtag) return;

  // Enhanced ecommerce item view
  window.gtag(
    "event",
    "view_item",
    withBuildMeta({
      currency: "USD",
      value: 1.0, // Assign value for engagement tracking
      items: [
        {
          item_id: recipeData.id.toString(),
          item_name: recipeData.name,
          item_category: recipeData.category || "Recipe",
          ...(recipeData.difficulty
            ? { item_category2: recipeData.difficulty }
            : {}),
          price: 1.0,
          quantity: 1,
        },
      ],
    })
  );

  // Custom recipe view event
  trackRecipeInteraction(ANALYTICS_EVENTS.RECIPE_VIEW, recipeData, {
    engagement_value: "high",
  });
}

/**
 * Track Search Events with Enhanced Data
 */
export function trackSearch(
  searchTerm: string,
  resultsCount: number,
  searchType: "global" | "category" | "ingredient" = "global"
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag(
    "event",
    ANALYTICS_EVENTS.SEARCH_PERFORMED,
    withBuildMeta({
      search_term: searchTerm,
      search_type: searchType,
      results_count: resultsCount,
      engagement_value: resultsCount > 0 ? "high" : "low",
    })
  );
}

/**
 * Track Category Browsing
 */
export function trackCategoryView(
  categoryName: string,
  categorySlug: string,
  recipeCount: number
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag(
    "event",
    ANALYTICS_EVENTS.RECIPE_CATEGORY_VIEW,
    withBuildMeta({
      category_name: categoryName,
      category_slug: categorySlug,
      category_recipe_count: recipeCount,
      engagement_type: "category_exploration",
    })
  );

  // Enhanced ecommerce category view
  window.gtag(
    "event",
    "view_item_list",
    withBuildMeta({
      item_list_id: categorySlug,
      item_list_name: categoryName,
      items: [], // Would be populated with actual recipe items
    })
  );
}

/**
 * Track Button Clicks with Context
 */
export function trackButtonClick(
  buttonName: string,
  buttonContext: string,
  additionalData?: Record<string, any>
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag(
    "event",
    ANALYTICS_EVENTS.BUTTON_CLICK,
    withBuildMeta({
      button_name: buttonName,
      button_context: buttonContext,
      click_location: window.location.pathname,
      ...additionalData,
    })
  );
}

/**
 * Track Navigation Clicks
 */
export function trackNavigationClick(
  linkText: string,
  linkUrl: string,
  navigationSection: string
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag(
    "event",
    ANALYTICS_EVENTS.NAVIGATION_CLICK,
    withBuildMeta({
      link_text: linkText,
      link_url: linkUrl,
      navigation_section: navigationSection,
      outbound:
        linkUrl.startsWith("http") &&
        !linkUrl.includes(window.location.hostname),
    })
  );
}

/**
 * Track User Engagement Milestones
 */
export function trackEngagementMilestone(
  milestoneType: "time_threshold" | "scroll_depth" | "content_completion",
  milestoneValue: number | string
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag(
    "event",
    ANALYTICS_EVENTS.CONTENT_ENGAGEMENT,
    withBuildMeta({
      engagement_type: milestoneType,
      engagement_value: milestoneValue,
      page_path: window.location.pathname,
      timestamp: new Date().toISOString(),
    })
  );
}

/**
 * Track Recipe Completion (user viewed all sections)
 */
export function trackRecipeCompletion(recipeData: {
  id: string | number;
  name: string;
  timeSpent: number;
  sectionsViewed: string[];
}): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag(
    "event",
    ANALYTICS_EVENTS.RECIPE_COMPLETE_VIEW,
    withBuildMeta({
      recipe_id: recipeData.id.toString(),
      recipe_name: recipeData.name,
      time_spent: recipeData.timeSpent,
      sections_viewed: recipeData.sectionsViewed.join(","),
      completion_rate: (recipeData.sectionsViewed.length / 4) * 100, // Assuming 4 main sections
      value: 5.0, // Higher value for completed views
    })
  );
}

/**
 * Track Form Submissions
 */
export function trackFormSubmission(
  formName: string,
  formData?: Record<string, any>
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag(
    "event",
    ANALYTICS_EVENTS.FORM_SUBMIT,
    withBuildMeta({
      form_name: formName,
      form_location: window.location.pathname,
      ...formData,
    })
  );
}

/**
 * Track Conversion Events
 */
export function trackConversion(
  conversionType:
    | "recipe_engagement"
    | "category_exploration"
    | "site_retention",
  conversionValue: number = 1.0
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag(
    "event",
    "conversion",
    withBuildMeta({
      conversion_type: conversionType,
      conversion_value: conversionValue,
      currency: "USD",
      value: conversionValue,
    })
  );
}

/**
 * Setup Scroll Depth Tracking
 */
export function setupScrollTracking(): void {
  if (typeof window === "undefined") return;

  let maxScroll = 0;
  const scrollThresholds = [25, 50, 75, 100];
  const trackedThresholds = new Set<number>();

  const handleScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
        100
    );

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
    }

    scrollThresholds.forEach((threshold) => {
      if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
        trackedThresholds.add(threshold);
        trackEngagementMilestone("scroll_depth", threshold);
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Track time on page
  const startTime = Date.now();
  window.addEventListener("beforeunload", () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    trackEngagementMilestone("time_threshold", timeSpent);
  });
}

/**
 * Debug Analytics (Development Only)
 */
export function debugAnalytics(): void {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development")
    return;

  console.log("Analytics Debug Mode Active");

  // Override gtag to log events
  const originalGtag = window.gtag;
  window.gtag = (
    command: string,
    eventName: string | Date,
    eventParams?: any
  ) => {
    console.log("📊 Analytics Event:", { command, eventName, eventParams });
    if (originalGtag) {
      originalGtag(command, eventName, eventParams);
    }
  };
}

// Initialize analytics when module loads
if (typeof window !== "undefined") {
  // Wait for gtag to be available
  const initWhenReady = () => {
    if (typeof window.gtag === "function") {
      initializeAnalytics();
      setupScrollTracking();

      if (process.env.NODE_ENV === "development") {
        debugAnalytics();
      }
    } else {
      setTimeout(initWhenReady, 100);
    }
  };

  initWhenReady();
}
