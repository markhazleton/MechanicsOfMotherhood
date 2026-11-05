import { describe, it, expect } from "vitest";
import { contrastRatio } from "./utils/contrast";

// Semantic token pairs from client/src/index.css (Make Bold Solutions palette).
// NOTE: Hard-coded hex values; keep in sync when token values change.

type Pair = [fg: string, bg: string, label: string];

const lightModePairs: Pair[] = [
  ["#1e1e1e", "#f8f6f2", "foreground vs background"],
  ["#2c2c2b", "#ffffff", "body text vs card"],
  ["#56544f", "#f8f6f2", "muted-foreground vs background"],
  ["#56544f", "#efece4", "muted-foreground vs muted surface"],
  ["#982407", "#ffffff", "link vs card"],
  ["#841e05", "#fbeeea", "primary-ink on primary-soft (brand badge)"],
  ["#864108", "#fdf1e6", "accent-ink on accent-soft (accent badge)"],
  ["#3d3d3b", "#ece9e2", "secondary-foreground on secondary"],
  ["#2f6f4c", "#e4efe7", "success on success-soft"],
  ["#a8321a", "#f6e2dc", "destructive on destructive-soft"],
  ["#8a5f12", "#f6edd6", "warning on warning-soft"],
  ["#2f5a8f", "#e2e9f2", "info on info-soft"],
  ["#c2bfb6", "#1e1e1e", "inverse-muted on inverse (footer)"],
  ["#e88f3d", "#1e1e1e", "inverse-eyebrow on inverse (footer)"],
];

const darkModePairs: Pair[] = [
  ["#f8f6f2", "#1e1e1e", "foreground vs background"],
  ["#ece9e2", "#2c2c2b", "body text vs card"],
  ["#c2bfb6", "#2c2c2b", "muted-foreground vs card"],
  ["#c2bfb6", "#262625", "muted-foreground vs muted surface"],
  ["#e88f3d", "#2c2c2b", "link vs card"],
  ["#e6a392", "#3a0c02", "primary-ink on primary-soft"],
  ["#f2b277", "#452104", "accent-ink on accent-soft"],
  ["#ece9e2", "#3d3d3b", "secondary-foreground on secondary"],
  ["#c2bfb6", "#141413", "inverse-muted on inverse (footer)"],
];

function expectAA(pair: Pair) {
  const ratio = contrastRatio(pair[0], pair[1]);
  expect(ratio, pair[2]).toBeGreaterThanOrEqual(4.5);
}

describe("Contrast Tokens (Light Mode)", () => {
  for (const p of lightModePairs) {
    it(`meets AA: ${p[2]}`, () => expectAA(p));
  }
});

describe("Contrast Tokens (Dark Mode)", () => {
  for (const p of darkModePairs) {
    it(`meets AA: ${p[2]}`, () => expectAA(p));
  }
});
