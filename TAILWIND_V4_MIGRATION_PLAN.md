# Tailwind CSS v4 Migration Plan

## Current Status: v3.4.17 → Future v4.x Migration

### Pre-Migration Checklist (Complete Now)

#### ✅ Modern Utility Usage

- [x] Using modern opacity modifiers (no `bg-opacity-*` found)
- [x] Using modern flex utilities (`flex-shrink-0` instead of `flex-shrink-*`)
- [x] No deprecated utilities found

#### 🎯 CSS Variable Preparation

Your current theme values that will become CSS variables:

```css
/* Current Tailwind Config → Future CSS Variables */

/* Brand Colors (MoM) */
--color-tool-gray: hsl(210 14% 40%);
--color-industrial-blue: hsl(217 19% 27%);
--color-kitchen-warm: hsl(0 100% 98%);
--color-cream: hsl(37 100% 97%);
--color-energetic-orange: hsl(0 71% 67%);
--color-workshop-teal: hsl(177 59% 47%);
--color-light-gray: hsl(210 20% 98%);
--color-medium-gray: hsl(215 16% 90%);

/* Font Families */
--font-family-mechanical: 'Orbitron', monospace;
--font-family-industrial: 'Roboto Condensed', sans-serif;
--font-family-friendly: 'Inter', sans-serif;

/* Animations */
--animate-spin-slow: spin 3s linear infinite;
--animate-pulse-soft: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

### Migration Steps (When Ready for v4)

#### Step 1: Update Dependencies

```bash
npm install tailwindcss@next @tailwindcss/vite@next
npm uninstall autoprefixer  # No longer needed
```

#### Step 2: Update Build Config

Replace PostCSS with Vite plugin in `vite.config.ts`

#### Step 3: Convert Configuration

Move from `tailwind.config.ts` to CSS `@theme` directive

#### Step 4: Update Import Statement

Change from `@tailwind` directives to `@import "tailwindcss"`

#### Step 5: Update Renamed Utilities

- Check for any `outline-none` → `outline-hidden`
- Verify `ring` behavior (becomes 1px instead of 3px)

### Current Code Patterns (Already v4-Ready)

#### ✅ Good Patterns You're Using

- `flex-shrink-0` ✓
- `rounded-xl`, `rounded-lg` ✓
- Modern responsive prefixes ✓
- Hover states properly structured ✓
- CSS custom properties in index.css ✓

#### 🔍 Monitor These Patterns

- `mechanical-shadow` custom class - will continue to work
- Brand color usage - ready for CSS variable conversion
- Custom animations - already defined properly

### Testing Strategy

1. Create a v4 test branch
2. Run the official `@tailwindcss/upgrade` tool
3. Test all UI components thoroughly
4. Verify brand colors render correctly
5. Check responsive behavior
6. Test custom animations

### Timeline Recommendation

- **Now**: Complete preparation steps below
- **Q1 2025**: Test v4 in a separate branch
- **Q2 2025**: Consider migration if ecosystem is stable
