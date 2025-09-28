# Semantic Tokens & Variant Mapping Guide

This document explains the design system semantic layer introduced across the Mechanics of Motherhood application.

## Goals

## Extended Semantic Tokens

We define semantic aliases to decouple component styles from raw color scales.

| Accent | Orange action / highlight | `--color-accent-*` |
| Warning | Amber (future) | `--color-warning-*` |
| Danger | Red destructive (future) | `--color-danger-*` |

### Added (Forms & Feedback)

| Group | Purpose | Prefix |
|-------|---------|--------|
| Success | Positive / confirmation states | `--color-success-*` |
| Destructive | Errors / irreversible actions | `--color-destructive-*` |

Base tokens (example mapping – adjust in `index.css` if palette shifts):

```css
--color-success-50 .. 900   // green spectrum (soft -> strong)
--color-destructive-50 .. 900 // red spectrum (soft -> strong)
```

Utility shorthands you can layer now (create where needed):

```css
bg-success-soft text-success-700 border-success-300
bg-destructive-soft text-destructive-700 border-destructive-300
text-success-600 hover:text-success-700
text-destructive-600 hover:text-destructive-700
```

These pave the way for form validation states, toast variants, and confirmation dialogs without hard‑coding raw greens/reds.

## Theme Preview (Compact)

Embed this snippet in Storybook / a style guide page to visualize current tokens (uses existing utility classes):

```html
<div class="grid gap-4 md:grid-cols-3 text-sm">
   <div class="p-4 rounded-lg border border-border-subtle bg-surface-card">
      <h4 class="font-semibold mb-2 text-text-strong">Brand</h4>
      <div class="flex flex-wrap gap-1">
         <span class="w-8 h-8 rounded bg-brand-50 border" />
         <span class="w-8 h-8 rounded bg-brand-100 border" />
         <span class="w-8 h-8 rounded bg-brand-300 border" />
         <span class="w-8 h-8 rounded bg-brand-600 border" />
         <span class="w-8 h-8 rounded bg-brand-800 border" />
         <span class="w-8 h-8 rounded bg-brand-900 border" />
      </div>
   </div>
   <div class="p-4 rounded-lg border border-border-subtle bg-surface-card">
      <h4 class="font-semibold mb-2 text-text-strong">Accent</h4>
      <div class="flex flex-wrap gap-1">
         <span class="w-8 h-8 rounded bg-accent-50 border" />
         <span class="w-8 h-8 rounded bg-accent-100 border" />
         <span class="w-8 h-8 rounded bg-accent-300 border" />
         <span class="w-8 h-8 rounded bg-accent-600 border" />
         <span class="w-8 h-8 rounded bg-accent-700 border" />
         <span class="w-8 h-8 rounded bg-accent-900 border" />
      </div>
   </div>
   <div class="p-4 rounded-lg border border-border-subtle bg-surface-card">
      <h4 class="font-semibold mb-2 text-text-strong">Success / Destructive</h4>
      <div class="flex flex-wrap gap-1">
         <span class="w-8 h-8 rounded bg-success-100 border" />
         <span class="w-8 h-8 rounded bg-success-600 border" />
         <span class="w-8 h-8 rounded bg-success-800 border" />
         <span class="w-8 h-8 rounded bg-destructive-100 border" />
         <span class="w-8 h-8 rounded bg-destructive-600 border" />
         <span class="w-8 h-8 rounded bg-destructive-800 border" />
      </div>
   </div>
</div>
```

Dark mode ensures contrast automatically; preview in both themes to confirm ratios.

## Token Sources

Base tokens are declared in `client/src/index.css` inside the `@theme` block (Tailwind v4 design tokens). Example categories:

- Neutral scale: `--color-neutral-*`
- Brand scale: `--color-brand-*` (core brand blues)
- Accent scale: `--color-accent-*` (orange highlight)
- Success (teal legacy mapped where applicable)
- Semantic surfaces & roles: `--color-background`, `--color-card`, `--color-border`, etc.

Dark mode overrides are defined using the `:root.dark` selector. The app uses the `class` strategy (`document.documentElement.classList.toggle('dark')`).

## Semantic Utility Aliases

Added helper classes (component layer) for migration convenience:

```css
.text-brand-900;
.text-brand-600;
.bg-brand-600;
.bg-accent-500;
.bg-accent-600;
```

Prefer native Tailwind palette utilities where possible (e.g. `text-brand-600`)—these aliases exist for gradual refactor and non-JIT edge cases.

## Heading Scale

Utility classes for consistent typographic hierarchy:

- `.heading-display` – Hero / marketing
- `.heading-xl`
- `.heading-lg`
- `.heading-md`
- `.heading-sm`

Replace ad‑hoc `text-4xl font-extrabold tracking-tight` clusters with a heading class + minimal embellishments.

## Button Variants (CVA)

Defined in `components/ui/button.tsx` via `buttonVariants`:

- `default` (primary – maps to `bg-primary` / brand)
- `brand` – `bg-brand-600 text-white hover:bg-brand-700`
- `accent` – Accent orange emphasis
- `subtle` – Low-emphasis surface button
- `outlineBrand` – Brand-outline utility variant
- Existing core: `secondary`, `destructive`, `ghost`, `link`, `outline`

Usage:

```tsx
<Button variant="brand">Save</Button>
<Button variant="outlineBrand">Learn More</Button>
<Button variant="accent">Deploy</Button>
```

## Badge Variants

In `components/ui/badge.tsx`:

- `brand` – Solid brand
- `accent` – Solid accent
- `subtle` – Elevated neutral surface

Maintain existing: `default`, `secondary`, `destructive`, `outline`.

## Dark Mode Toggle

Component: `components/dark-mode-toggle.tsx`

- Persists preference under `mom-theme`
- Toggles root `dark` class
- Uses `variant="outlineBrand"` for consistent styling

## Print Styles

Located at bottom of `index.css`:

- `.print-only` & `.no-print` control output
- Recipe detail page uses semantic wrapper classes: `recipe-detail-page`, `recipe-content-grid`, etc.

## Migration Patterns

| Legacy Pattern | Replacement |
| -------------- | ---------- |
| `text-blue-900` | `text-brand-900` or heading scale class |
| `text-teal-600` | `text-brand-600` (if primary) or `text-accent-600` (if emphasis) |
| `bg-teal-600` | `bg-brand-600` (primary action) |
| `text-orange-500` | `text-accent-600` (semantic accent) |
| `hover:text-orange-500` | `hover:text-accent-600` |
| `bg-orange-500` | `bg-accent-500` |
| Blue + teal gradients | `from-brand-800 to-brand-600` |

## Component Refactors Completed

- Navigation (semantic tokens + dark mode toggle)
- Hero Section (semantic gradient + variants)
- Featured Recipes (surface + variants + semantic text)
- Community Section (cards + CTA refactor)
- Footer (brand tokens + contrast cleanup)
- Recipe Lists (categories, recipes, category-recipes) previously updated

Pending (if any remain): scan for stray `text-blue-800`, `text-blue-100/70`, custom pastel backgrounds.

## Authoring Guidelines

1. Use variant props over stacking multiple utility classes for core components.
2. Choose semantic emphasis:
   - Brand = structural / navigation / primary actions
   - Accent = calls to action, highlights, ratings
   - Neutral = supporting text / backgrounds
3. When in doubt, start with neutral foreground + brand accent for interactive states.
4. Avoid hard-coded hex; rely on tokens for all new UI.

## Adding a New Variant

1. Extend CVA in `button.tsx` or `badge.tsx`.
2. Add any necessary surface tokens (light + dark) to `@theme`.
3. Document usage here if broadly applicable.

## Future Enhancements

- Introduce success/warning/destructive semantic clusters aligned to tokens
- Add motion tokens for consistent animation timings
- Build a Storybook or MDX catalog for design primitives

---

Maintained automatically as part of semantic refactor. Update when introducing new global variants or tokens.
