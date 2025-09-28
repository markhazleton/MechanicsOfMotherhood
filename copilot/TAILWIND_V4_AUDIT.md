---
title: Tailwind CSS v4 Audit
date: 2025-09-28
summary: Repository-wide review confirming migration to Tailwind CSS v4 and removal of legacy v3 patterns.
---

## Tailwind CSS v4 Audit (2025-09-28)

This document records a repository-wide review to confirm full migration to Tailwind CSS v4 and eliminate lingering Tailwind v3 era patterns.

## Summary

* Uses single `@import "tailwindcss";` directive instead of `@tailwind base/components/utilities` trio.
* Design tokens defined via the `@theme { ... }` block in `client/src/index.css` (modern v4 pattern).
* Minimal `tailwind.config.ts` (only content globs + plugins) – appropriate for v4.
* No legacy `theme.extend`, `purge`, `safelist`, or deprecated variants detected.
* No `@apply` abuse or large custom utility bundles.

## Issues Found & Resolutions

| Issue | Location | Type | Resolution |
|-------|----------|------|------------|
| Undefined utility `border-medium-gray` (legacy/typo) | `recipe-detail.tsx` | Bug | Replaced with `border-neutral-300` |
| Class `prose-brand` referenced but not defined | `markdown-content.tsx` | Missing implementation | Added `.prose.prose-brand` variant overriding Typography plugin tokens |
| `tailwind.config.ts` mixing ESM + `require` | `tailwind.config.ts` | Modernization | Switched to native `import` syntax |

## Optional Improvements (Not yet applied – low risk & can be phased in)

1. Semantic Utility Adoption
   * Replace repeated raw palette classes (`text-blue-900`, `bg-teal-600`, etc.) with semantic tokens: `text-brand-900`, `bg-primary`, `bg-accent`, `text-muted-foreground`.
   * Existing tokens (`--color-brand-*`, `--color-primary`, `--color-accent-*`) support this.
2. Introduce Light/Dark Theme Tokens
   * Provide `:root.dark { ... }` overrides for semantic tokens to enable dark mode without markup changes.
3. Reduce Repetition in Button & Badge Styles
   * Extract repeated color/spacing patterns into small CSS component classes (or variant helpers).
4. Typography System Unification
   * Migrate repeated heading utility bundles into semantic classes (`.heading-xl`, `.heading-lg`).
5. Prose Theming
   * Add inverted prose variant (`.prose-invert-brand`) for dark surfaces.

## Validation Checklist

| Check | Status |
|-------|--------|
| Build aware of new config syntax | PASS |
| Tokens resolved after `.prose-brand` addition | PASS |
| No remaining undefined utilities in modified files | PASS |
| Tailwind v3 directives absent | PASS |

## Migration Guidance for Future Work

When adding new design tokens, prefer adding them to `@theme` instead of editing the config file.

```css
@theme {
  --color-warning-50: hsl(40 100% 96%);
  --color-warning-500: hsl(38 92% 50%);
  --color-warning-600: hsl(35 90% 45%);
}
```

Usage example: `bg-warning-500 hover:bg-warning-600 text-white`.

## Dark Mode Pattern (Suggested)

```css
@layer base {
  :root.dark {
    --color-background: 220 39% 7%;
    --color-foreground: 220 14% 96%;
    --color-card: 220 27% 12%;
    --color-card-foreground: 220 14% 96%;
    --color-border: 220 13% 33%;
    --color-primary-foreground: 0 0% 100%;
  }
}
```

## Recommendations Priority

1. (Done) Fix undefined utilities / missing variant.
2. (Next) Consolidate color usage to brand tokens.
3. Add semantic button variants.
4. Add dark mode token overrides (if dark mode desired).
5. Extract heading scale utilities.

## Closing

Project is effectively on Tailwind v4; remaining steps are refinement and consistency improvements, not mandatory migration blockers. Let me know if you'd like me to proceed with semantic color refactors or dark mode tokenization.

— Tailwind v4 Audit Complete
