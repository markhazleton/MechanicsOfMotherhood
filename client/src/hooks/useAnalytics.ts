/**
 * Analytics React Hook for Mechanics of Motherhood
 * Provides easy-to-use analytics functions for React components
 */

import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  trackPageView,
  trackRecipeView,
  trackRecipeInteraction,
  trackSearch,
  trackCategoryView,
  trackButtonClick,
  trackNavigationClick,
  trackRecipeCompletion,
  trackFormSubmission,
  trackConversion,
} from "@/lib/analytics";
import type { Recipe } from "@/data/api-types";

export function useAnalytics() {
  const [location] = useLocation();
  const pageLoadTime = useRef<number>(Date.now());
  const recipeViewData = useRef<{
    recipeId: string;
    startTime: number;
    sectionsViewed: Set<string>;
  } | null>(null);

  // Track page views automatically
  useEffect(() => {
    pageLoadTime.current = Date.now();
    trackPageView(location);
  }, [location]);

  // Recipe tracking functions
  const analytics = {
    // Page Tracking
    trackPage: (path: string, title?: string, additionalData?: any) => {
      trackPageView(path, title, additionalData);
    },

    // Recipe Interactions
    trackRecipeView: (recipe: Recipe) => {
      // Start tracking recipe engagement
      recipeViewData.current = {
        recipeId: recipe.id.toString(),
        startTime: Date.now(),
        sectionsViewed: new Set(),
      };

      trackRecipeView({
        id: recipe.id,
        name: recipe.name,
        category: recipe.recipeCategory?.name,
        difficulty: "easy", // Default since not in API
        prepTime: 30, // Default prep time since not in API
        servings: recipe.servings || 0,
        rating: recipe.averageRating || 0,
        description: recipe.description,
      });
    },

    // Track recipe section views (ingredients, instructions, etc.)
    trackRecipeSection: (
      sectionName: "ingredients" | "instructions" | "nutrition" | "notes"
    ) => {
      if (recipeViewData.current) {
        recipeViewData.current.sectionsViewed.add(sectionName);
      }
    },

    // Complete recipe view tracking
    completeRecipeView: (recipe: Recipe) => {
      if (!recipeViewData.current) return;

      const timeSpent = Math.round(
        (Date.now() - recipeViewData.current.startTime) / 1000
      );
      const sectionsViewed = Array.from(recipeViewData.current.sectionsViewed);

      trackRecipeCompletion({
        id: recipe.id,
        name: recipe.name,
        timeSpent,
        sectionsViewed,
      });

      // Reset tracking data
      recipeViewData.current = null;
    },

    // Search tracking
    trackSearch: (
      searchTerm: string,
      resultsCount: number,
      searchType?: "global" | "category" | "ingredient"
    ) => {
      trackSearch(searchTerm, resultsCount, searchType);
    },

    // Category browsing
    trackCategoryView: (
      categoryName: string,
      categorySlug: string,
      recipeCount: number
    ) => {
      trackCategoryView(categoryName, categorySlug, recipeCount);
    },

    // Button interactions
    trackButtonClick: (
      buttonName: string,
      context: string,
      additionalData?: Record<string, any>
    ) => {
      trackButtonClick(buttonName, context, additionalData);
    },

    // Navigation clicks
    trackNavClick: (linkText: string, linkUrl: string, section: string) => {
      trackNavigationClick(linkText, linkUrl, section);
    },

    // Recipe interactions (favorites, sharing, etc.)
    trackRecipeAction: (
      action: "favorite" | "share" | "print" | "save",
      recipe: Recipe
    ) => {
      trackRecipeInteraction(
        `recipe_${action}`,
        {
          id: recipe.id,
          name: recipe.name,
          category: recipe.recipeCategory?.name,
          difficulty: "easy",
          prepTime: 30, // Default since not in API
          servings: recipe.servings || 0,
          rating: recipe.averageRating || 0,
        },
        {
          action_type: action,
          engagement_level: "high",
        }
      );
    },

    // Form submissions
    trackFormSubmit: (formName: string, formData?: Record<string, any>) => {
      trackFormSubmission(formName, formData);
    },

    // Conversion events
    trackConversion: (
      type: "recipe_engagement" | "category_exploration" | "site_retention",
      value?: number
    ) => {
      trackConversion(type, value);
    },

    // Custom event tracking
    trackCustomEvent: (eventName: string, eventData: Record<string, any>) => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventName, eventData);
      }
    },
  };

  // Cleanup function for recipe completion tracking
  useEffect(() => {
    return () => {
      // Track recipe completion on component unmount if recipe was being viewed
      if (recipeViewData.current) {
        const timeSpent = Math.round(
          (Date.now() - recipeViewData.current.startTime) / 1000
        );
        const sectionsViewed = Array.from(
          recipeViewData.current.sectionsViewed
        );

        // Only track if user spent meaningful time (>10 seconds)
        if (timeSpent > 10) {
          analytics.trackCustomEvent("recipe_partial_completion", {
            recipe_id: recipeViewData.current.recipeId,
            time_spent: timeSpent,
            sections_viewed: sectionsViewed.join(","),
            completion_type: "exit",
          });
        }
      }
    };
  }, []);

  return analytics;
}

/**
 * Hook for tracking recipe engagement in detail
 */
export function useRecipeAnalytics(recipe?: Recipe) {
  const analytics = useAnalytics();
  const engagementStartTime = useRef<number>(Date.now());
  const sectionsViewed = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (recipe) {
      engagementStartTime.current = Date.now();
      sectionsViewed.current = new Set();
      analytics.trackRecipeView(recipe);
    }
  }, [recipe, analytics]);

  const recipeAnalytics = {
    ...analytics,

    // Track specific recipe sections
    trackIngredientView: () => {
      sectionsViewed.current.add("ingredients");
      analytics.trackRecipeSection("ingredients");
    },

    trackInstructionView: () => {
      sectionsViewed.current.add("instructions");
      analytics.trackRecipeSection("instructions");
    },

    trackNutritionView: () => {
      sectionsViewed.current.add("nutrition");
      analytics.trackRecipeSection("nutrition");
    },

    trackNotesView: () => {
      sectionsViewed.current.add("notes");
      analytics.trackRecipeSection("notes");
    },

    // Complete the recipe view
    completeView: () => {
      if (recipe) {
        analytics.completeRecipeView(recipe);
      }
    },
  };

  return recipeAnalytics;
}
