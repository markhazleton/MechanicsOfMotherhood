import { describe, it, expect } from "vitest";
import { contrastRatio } from "./utils/contrast";

// Subset of tokens to guard (success/destructive/warning on soft background + foreground on base background)
const lightModePairs: [string, string, string][] = [
  ["#0d2533", "#ffffff", "foreground vs background"],
  ["#1c4a3f", "#e6f9f4", "success-700 on success-50"],
  ["#6a1a17", "#feeceb", "destructive-700 on destructive-50"],
  ["#8a5a00", "#fff8ec", "warning-700 on warning-50"],
];

// NOTE: We approximate by hard-coding expected hex values; maintain if token hues shift.

function expectAA(pair: [string, string, string]) {
  const ratio = contrastRatio(pair[0], pair[1]);
  expect(ratio, pair[2]).toBeGreaterThanOrEqual(4.5);
}

describe("Contrast Tokens (Light Mode)", () => {
  for (const p of lightModePairs) {
    it(`meets AA: ${p[2]}`, () => expectAA(p));
  }
});
