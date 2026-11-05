import { describe, it, expect } from "vitest";
import { contrastRatio } from "./utils/contrast";

// Make Bold Solutions palette (see client/src/index.css). Update if tokens shift.
//  Light: cream page #f8f6f2, white cards #ffffff, ink #1e1e1e, rust #982407, ember-600 #a8520a
//  Dark:  ink page #1e1e1e, ink-800 cards #2c2c2b, cream text, ember-300 #e88f3d, rust-200 #e6a392

type Pair = [fg: string, bg: string, label: string, min: number];

const heroPairs: Pair[] = [
  ["#1e1e1e", "#f8f6f2", "Hero title (ink) on cream", 4.5],
  ["#982407", "#f8f6f2", "Hero title accent (rust-500) on cream", 4.5],
  ["#56544f", "#f8f6f2", "Hero lede (muted ink-600) on cream", 4.5],
  ["#a8520a", "#f8f6f2", "Eyebrow (ember-600) on cream", 4.5],
  ["#f8f6f2", "#1e1e1e", "Hero title (cream) on dark page", 4.5],
  ["#e6a392", "#1e1e1e", "Hero title accent (rust-200) on dark page", 4.5],
  ["#c2bfb6", "#1e1e1e", "Hero lede (ink-300) on dark page", 4.5],
  ["#e88f3d", "#1e1e1e", "Eyebrow (ember-300) on dark page", 4.5],
];

const statPairs: Pair[] = [
  ["#982407", "#ffffff", "Stat number (rust-500) on white strip", 4.5],
  ["#56544f", "#ffffff", "Stat label (ink-600) on white strip", 4.5],
  ["#e6a392", "#2c2c2b", "Stat number (rust-200) on dark strip", 4.5],
  ["#c2bfb6", "#2c2c2b", "Stat label (ink-300) on dark strip", 4.5],
];

const actionPairs: Pair[] = [
  ["#f8f6f2", "#982407", "Primary button text (cream) on rust-500", 4.5],
  ["#f8f6f2", "#841e05", "Primary button hover text on rust-600", 4.5],
  ["#ffffff", "#a8520a", "Accent button text (white) on ember-600", 4.5],
  ["#841e05", "#f8f6f2", "Outline button text (rust-600) on cream", 4.5],
  ["#e6a392", "#1e1e1e", "Outline button text (rust-200) on dark page", 4.5],
];

function runPairs(title: string, pairs: Pair[]) {
  describe(title, () => {
    for (const [fg, bg, label, min] of pairs) {
      it(`${label} >= ${min}`, () => {
        expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
      });
    }
  });
}

runPairs("Hero text contrast", heroPairs);
runPairs("Hero stat strip contrast", statPairs);
runPairs("Button contrast", actionPairs);
