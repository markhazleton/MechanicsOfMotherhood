# Tailwind CSS v4 Migration - Execution Plan

## Current State Analysis

**Current Version**: Tailwind CSS v3.4.17  
**Target Version**: Tailwind CSS v4.1.12  
**Project Status**: TypeScript errors resolved, build working, ready for major upgrade

## Migration Strategy

### Phase 1: Preparation & Backup

1. Create migration branch
2. Document current working state
3. Backup critical configuration files

### Phase 2: Core Migration

1. Update dependencies to v4
2. Migrate from PostCSS to Vite plugin
3. Convert configuration from JS/TS to CSS `@theme`
4. Update import statements

### Phase 3: Breaking Changes Resolution

1. Fix renamed utilities
2. Update custom component classes
3. Resolve any compilation issues

### Phase 4: Testing & Validation

1. Visual regression testing
2. Build validation
3. Performance comparison

## Detailed Implementation Steps

### Step 1: Dependency Updates

```bash
# Remove v3 dependencies
npm uninstall tailwindcss autoprefixer postcss @tailwindcss/typography

# Install v4 dependencies
npm install tailwindcss@next @tailwindcss/vite@next @tailwindcss/typography@next
```

### Step 2: Configuration Migration

#### Remove PostCSS Configuration

- Delete `postcss.config.js`
- Update `vite.config.ts` to use Vite plugin

#### Convert `tailwind.config.ts` to CSS `@theme`

- Move theme configuration to `index.css`
- Preserve MoM brand colors and custom fonts
- Maintain Shadcn/ui compatibility

### Step 3: CSS File Updates

#### Update `client/src/index.css`

- Replace `@tailwind` directives with `@import "tailwindcss"`
- Add `@theme` directive with converted configuration
- Preserve custom CSS variables and components

### Step 4: Breaking Changes

- Update `outline-none` to `outline-0` (if any)
- Verify `ring` utilities (default width changes from 3px to 1px)
- Check for any deprecated utility usage

### Step 5: Build Configuration

- Update Vite configuration
- Test development and production builds
- Verify GitHub Actions compatibility

## Risk Assessment

### Low Risk

- ✅ Modern utility usage (already v4-compatible)
- ✅ CSS variables extensively used
- ✅ Custom components properly structured
- ✅ No deprecated utilities found

### Medium Risk

- 🟡 Plugin compatibility (@tailwindcss/typography)
- 🟡 Shadcn/ui components compatibility
- 🟡 Custom animations and keyframes

### High Risk

- 🔴 Build process changes (PostCSS → Vite plugin)
- 🔴 Configuration format change (TS → CSS)

## Rollback Plan

If migration fails:

1. Restore from backup branch
2. Revert dependency changes
3. Restore original configuration files
4. Document issues for future attempt

## Success Criteria

- ✅ Build completes without errors
- ✅ All pages render correctly
- ✅ Brand colors maintained
- ✅ Custom animations work
- ✅ Responsive design intact
- ✅ Performance maintained or improved
- ✅ GitHub Actions deployment succeeds

## Post-Migration Benefits

### Performance Improvements

- Faster build times
- Smaller CSS bundle
- Better tree-shaking

### Developer Experience

- Simplified configuration
- Better tooling integration
- Modern CSS features

### Future-Proofing

- Latest Tailwind features
- Continued updates and support
- Better ecosystem compatibility
