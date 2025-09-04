import { describe, it, expect } from "vitest";
import { generateRecipeKeywords } from "@/utils/seo-helpers";

// Minimal recipe type stub
const recipe: any = {
  name: "Test Pancakes",
  recipeCategory: { name: "Breakfast" },
  seO_Keywords: "fluffy\nquick\n-easy",
};

describe("generateRecipeKeywords", () => {
  it("aggregates and deduplicates keywords", () => {
    const result = generateRecipeKeywords(recipe);
    expect(result).toContain("test pancakes");
    expect(result).toContain("breakfast");
    expect(result).toContain("breakfast recipe");
    expect(result).toContain("fluffy");
    expect(result).toContain("easy");
    // No duplicates
    const set = new Set(result);
    expect(set.size).toBe(result.length);
  });
});
