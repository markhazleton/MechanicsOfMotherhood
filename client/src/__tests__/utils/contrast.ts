// Shared contrast & luminance helpers for test files.
// NOTE: Keep pure + dependency-free so it can be copied or inlined if needed.

export function srgbToLinear(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255] as [
    number,
    number,
    number
  ];
}

export function relativeLuminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string) {
  const L1 = relativeLuminance(a);
  const L2 = relativeLuminance(b);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function expectAA(fg: string, bg: string, label: string, min = 4.5) {
  const ratio = contrastRatio(fg, bg);
  if (ratio < min) {
    throw new Error(
      `${label} contrast ${ratio.toFixed(2)} is below AA (${min})`
    );
  }
}
