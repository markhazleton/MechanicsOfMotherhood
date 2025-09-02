# Tailwind v4 Migration Quick Reference

## 🚀 Quick Commands

```bash
# Check current readiness
npm run tailwind:v4-readiness

# Create test branch (when ready)
git checkout -b feature/tailwind-v4-test

# Install v4 (when available)
npm install tailwindcss@next @tailwindcss/vite@next
npm uninstall autoprefixer postcss

# Run official migration tool
npx @tailwindcss/upgrade

# Test the migration
npm run dev
npm run build
```

## 📝 Key Changes Summary

### Configuration Changes

- `tailwind.config.ts` → CSS `@theme` directive
- PostCSS plugin → `@tailwindcss/vite` plugin
- `@tailwind` directives → `@import "tailwindcss"`

### Utility Renames

| v3 | v4 |
|----|----|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `blur-sm` | `blur-xs` |
| `blur` | `blur-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `outline-none` | `outline-hidden` |
| `ring` | `ring-3` |

### Manual Updates Needed

- Add explicit border colors: `border` → `border border-gray-200`
- Update ring usage: `ring` → `ring-3`
- Variable syntax: `bg-[--custom-color]` → `bg-(--custom-color)`

## ✅ Your Project Status

### Already v4-Ready ✅

- Modern utility patterns
- CSS custom properties for brand colors
- Clean component architecture
- No deprecated utilities

### Dependencies to Monitor ⏳

- shadcn/ui v4 support
- @tailwindcss/typography v4
- tailwindcss-animate v4

## 🎯 Migration Timeline

| Phase | Timeline | Status |
|-------|----------|--------|
| **Preparation** | Now - Q1 2025 | ✅ Complete |
| **Ecosystem Watch** | Q1 - Q2 2025 | ⏳ Waiting |
| **Testing** | Q2 2025 | 📋 Planned |
| **Migration** | Q3 2025 | 📋 Planned |

## 📚 Resources

- [Full Migration Plan](./TAILWIND_V4_UPGRADE_PLAN_2025.md)
- [Official v4 Docs](https://tailwindcss.com/docs/v4-beta)
- [Upgrade Tool](https://tailwindcss.com/docs/upgrade-guide)

**Last Updated**: August 29, 2025
