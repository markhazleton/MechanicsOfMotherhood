import { describe, it, expect } from "vitest";
import { contrastRatio } from "./utils/contrast";

// Palette snapshot approximations (update if semantic tokens shift significantly)
// Hero subtitle:
//  Light: brand-600 (#0b4d63) on white (#ffffff)
//  Dark:  brand-100 (#d5f4ff) on dark gradient mid-tone (#162128)
// Hero stat label:
//  Light: neutral-600 (#475569 approx -> using #475569) on translucent white panel (#ffffff ~ underlying)
//  Dark:  brand-100 (#d5f4ff) on translucent neutral-800 layer (~#1f2427 mid composite)

const subtitlePairs: [string, string, string, number][] = [
  ["#0b4d63", "#ffffff", "Hero subtitle (brand-600) on light bg", 4.5],
  ["#d5f4ff", "#162128", "Hero subtitle (brand-100) on dark bg", 4.5],
];

const statLabelPairs: [string, string, string, number][] = [
  ["#475569", "#ffffff", "Hero stat label (neutral-600) on light panel", 4.5],
  ["#d5f4ff", "#1f2427", "Hero stat label (brand-100) on dark panel", 4.5],
];

// Display title (brand-700 light, white on dark gradient mid) — large text but we still assert normal AA 4.5 for extra safety
const displayTitlePairs: [string, string, string, number][] = [
  ["#153645", "#ffffff", "Hero display title (brand-700) on light bg", 4.5],
  ["#ffffff", "#162128", "Hero display title (white) on dark bg", 4.5],
];

function runPairs(title: string, pairs: [string, string, string, number][]) {
  describe(title, () => {
    for (const [fg, bg, label, min] of pairs) {
      it(`${label} >= ${min}`, () => {
        expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
      });
    }
  });
}

runPairs("Hero subtitle contrast", subtitlePairs);
runPairs("Hero stat label contrast", statLabelPairs);
runPairs("Hero display title contrast", displayTitlePairs);
