# Tailwind CSS v4 Best Practices (Mechanics of Motherhood)

Date: 2025-09-04

## Core Principles Adopted

1. CSS-First Tokens: Centralize design tokens in a single `@theme` block.
2. Minimal Config: Keep `tailwind.config.ts` only for `content` globs and plugin registration.
3. Remove `@apply` Where Possible: Prefer semantic custom classes or raw CSS for multi-utility patterns in component layers.
4. Use Native CSS Nesting & Modern Features: Leverage container queries, logical properties when needed.
5. Avoid Runtime Class Composition Strings: Keep all potential utility classes statically analyzable.

## Recommended Structure

```text
client/src/index.css           # Tailwind entry + theme tokens + layers
tailwind.config.ts             # content + plugins only
copilot/TAILWIND_V4_*          # migration + strategy docs
```

## @theme Guidelines

Place only tokens (no component styling) in `@theme`:

```css
@theme {
  --color-primary: hsl(...);
  --font-sans: Inter, sans-serif;
  --radius: 1rem;
  --animate-fade-in: fade-in .3s ease-in;
}
```

Avoid redefining the same token via CSS variable indirection unless bridging legacy usage.

## Utility Strategy

Keep using standard utility classes in JSX for layout/responsiveness. Promote repeated multi-class bundles into named component classes only when they appear >3 times or encapsulate domain semantics (e.g. `recipe-step-badge`).

## Color & Theming

- Use semantic tokens (`--color-background`) over raw brand names inside components.
- Provide dark mode overrides in `.dark { }` keeping only values, not structural changes.
- For future theming (seasonal / accessibility modes) add additional scope classes (e.g. `.high-contrast { --color-primary: ... }`).

## Animations

Define animation keyframes and map them via `--animate-*` tokens or keep Tailwind `animate-*` utilities for common motions. Use reduced motion media queries for accessibility if adding complex sequences.

## Performance

- Rely on Tailwind v4's on-demand engine; avoid generating giant one-off variant expansions.
- Prefer `sm:`, `md:` etc. only where necessary—audit unused responsive utilities periodically.
- Consider a bundle analyzer to confirm CSS stays lean after feature additions.

## Dark Mode

- Continue `darkMode: "class"` approach; set dark palette directly inside `.dark` scope.
- Avoid toggling many classes in components—only manage the root `classList`.

## Migration Cleanups (Future Steps)

1. Remove `postcss.config.js` if no other PostCSS plugins are reintroduced.
2. Audit for any leftover v3-only patterns (none currently detected).
3. Gradually replace raw HSL literals in dark mode block with references to base tokens if simplification desired.

## Testing Checklist (Repeat Quarterly)

- Visual regression (light/dark) on top traffic pages.
- Accessibility contrast check for semantic colors.
- Responsive layout snapshot at sm / md / lg / xl.
- Ensure no dynamic class names break extraction.

## Anti-Patterns to Avoid

- Re-adding large `theme.extend` blocks duplicating tokens already declared in `@theme`.
- Overusing `@apply` for single-purpose utility clusters.
- Introducing JS-driven conditional class name assembly that hides possible utilities from the compiler.

## Suggested Enhancements

- Introduce container queries for complex recipe layout adjustments.
- Provide a print stylesheet layer for recipe printing (add `@layer utilities` rules with `@media print`).
- Add a `--spacing-*` scale if spacing consistency drift appears in audit.

---

Maintained by automated migration assistant. Update as Tailwind minor releases introduce new primitives.
