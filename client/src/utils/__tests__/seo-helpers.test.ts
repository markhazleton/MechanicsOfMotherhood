import { describe, it, expect } from "vitest";
import {
  generateRecipeKeywords,
  generateRecipeDescription,
  generateCanonicalUrl,
  generatePageTitle,
} from "../seo-helpers";
import { nameToSlug, recipeNameToSlug, getCategorySlug } from "../slugify";

// Minimal recipe type stub
const baseRecipe: any = {
  name: "Test Pancakes",
  recipeCategory: { name: "Breakfast" },
  seO_Keywords: "fluffy\nquick\n-easy",
  description:
    "A lovely breakfast starter. Packed with flavor and energy for the day.",
};

describe("generateRecipeKeywords", () => {
  it("aggregates and deduplicates keywords", () => {
    const result = generateRecipeKeywords(baseRecipe);
    expect(result).toContain("test pancakes");
    expect(result).toContain("breakfast");
    expect(result).toContain("breakfast recipe");
    expect(result).toContain("fluffy");
    expect(result).toContain("easy");
    // No duplicates
    const set = new Set(result);
    expect(set.size).toBe(result.length);
  });

  it("handles empty seO_Keywords gracefully", () => {
    const r = { ...baseRecipe, seO_Keywords: "" };
    const result = generateRecipeKeywords(r);
    expect(result).toContain("test pancakes");
  });
});

describe("generateRecipeDescription", () => {
  it("returns first sentence when short", () => {
    const desc = generateRecipeDescription(baseRecipe);
    expect(desc.endsWith(".")).toBe(true);
    expect(desc.length).toBeLessThanOrEqual(155);
  });

  it("truncates very long sentence", () => {
    const long = { ...baseRecipe, description: "A".repeat(300) + "." };
    const desc = generateRecipeDescription(long);
    expect(desc.endsWith("...")).toBe(true);
  });

  it("creates fallback when missing description", () => {
    const noDesc = { ...baseRecipe, description: "" };
    const desc = generateRecipeDescription(noDesc);
    expect(desc.toLowerCase()).toContain("delicious");
    expect(desc).toContain("Test Pancakes");
  });
});

describe("generateCanonicalUrl", () => {
  it("prefixes site url", () => {
    const url = generateCanonicalUrl("/recipe/test-pancakes");
    expect(url).toMatch(/https?:\/\/.*\/recipe\/test-pancakes$/);
  });
});

describe("generatePageTitle", () => {
  it("adds site name when absent", () => {
    expect(generatePageTitle("About")).toMatch(
      /About \| Mechanics of Motherhood/
    );
  });

  it("returns unchanged when already contains site name", () => {
    const t = generatePageTitle("Welcome to Mechanics of Motherhood Portal");
    expect(t).toBe("Welcome to Mechanics of Motherhood Portal");
  });
});

describe("slug utilities", () => {
  it("nameToSlug converts spaces to hyphens", () => {
    expect(nameToSlug("Hello World!")).toBe("hello-world");
  });

  it("recipeNameToSlug strips punctuation", () => {
    expect(recipeNameToSlug("Creamy, Spicy Soup!!")).toBe("creamy-spicy-soup");
  });

  it("getCategorySlug generates basic slug when not mapped", () => {
    expect(getCategorySlug("Side Dishes")).toBe("side-dishes");
  });
});
