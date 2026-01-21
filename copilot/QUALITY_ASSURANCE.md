# Quality Assurance & Testing Guide

This document describes all quality checks and testing procedures for the Mechanics of Motherhood project.

## Quick Start

Run all quality checks:
```bash
npm run quality:all
```

## Available Quality Checks

### 1. TypeScript Type Checking ✅
Ensures type safety across the codebase.

```bash
npm run check
```

**What it checks:**
- Type errors and incompatibilities
- Missing type definitions
- Proper use of TypeScript features

**Status:** ✅ 0 errors

---

### 2. ESLint Code Quality ✅
Enforces code quality standards and best practices.

```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
```

**What it checks:**
- Code style consistency
- React best practices
- TypeScript usage patterns
- Unused variables and imports
- Potential bugs

**Status:** ✅ 0 errors, 0 warnings

---

### 3. Unit Tests ✅
Comprehensive unit test suite.

```bash
npm run test              # Run tests once
npm run test:watch        # Run tests in watch mode
npm run test:ui           # Open Vitest UI
npm run test:coverage     # Generate coverage report
```

**Current Coverage:**
- Test Files: 5
- Tests: 24 passed
- Components tested: Error boundary, SEO components
- Utilities tested: SEO helpers, contrast checking

**Status:** ✅ 24/24 tests passing

---

### 4. Security Audit 🔒
Checks for known security vulnerabilities in dependencies.

```bash
npm audit                     # View all vulnerabilities
npm audit --audit-level=high  # Only high/critical
npm audit fix                 # Auto-fix vulnerabilities
```

**Status:** ✅ 0 vulnerabilities

---

### 5. Data Validation ✅
Validates API data integrity and quality.

```bash
npm run validate-data         # Check data quality
npm run validate-data:fix     # Fix issues automatically
```

**What it checks:**
- Recipe data completeness
- Image availability
- Category relationships
- URL format validity
- Metadata integrity

---

### 6. SEO Validation 🔍
Ensures SEO assets are properly configured.

```bash
npm run validate:seo
```

**What it checks:**
- Sitemap.xml presence and validity
- robots.txt configuration
- CNAME file for custom domain
- Meta tags in HTML
- Structured data

---

### 7. Build Validation 🏗️
Verifies production build completes successfully.

```bash
npm run build:static      # Standard build
npm run build:github      # Full build with data fetch
```

**What it checks:**
- Successful compilation
- No build errors
- Asset generation
- Build output structure

**Current Status:**
- Bundle Size: ~1.4MB (within 1MB target after gzip)
- Chunks: 13 generated
- Build Time: ~10-15 seconds

---

### 8. Accessibility Checks ♿
Basic accessibility validation.

```bash
npm run quality:a11y
```

**What it checks:**
- Missing `lang` attribute
- Images without alt text
- Heading structure
- Main landmark presence
- Button/link accessibility
- Form label associations

**Recommendations:**
- Use axe DevTools browser extension
- Run Lighthouse accessibility audit
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify keyboard navigation
- Check color contrast ratios

---

### 9. Link Checking 🔗
Detects broken internal links.

```bash
npm run quality:links
```

**What it checks:**
- Internal link validity
- Missing pages
- Broken anchor links
- 404 errors

**Note:** Client-side routed links (wouter) may not have corresponding HTML files - this is expected behavior for dynamic routes.

---

### 10. Bundle Size Analysis 📦
Analyzes production bundle sizes.

```bash
npm run analyze
```

**Performance Budget:**
- JavaScript: 300KB per chunk (warning threshold)
- CSS: 50KB total
- Images: 200KB total
- Total: 1MB

**Current Sizes:**
- Main vendor bundle: ~401KB (127KB gzipped)
- Page bundles: 21-828KB (varies by page)
- CSS: ~66KB (12KB gzipped)

**Large chunks:**
- ⚠️ `page-category-recipes`: 828KB (data-heavy page)
- Consider code splitting or lazy loading

---

### 11. Comprehensive Quality Check 🚀
Runs all quality checks in sequence.

```bash
npm run quality:check
```

**Includes:**
1. TypeScript compilation
2. ESLint
3. Unit tests
4. Test coverage
5. Security audit
6. Data validation
7. SEO validation
8. Production build
9. Bundle size analysis

---

## GitHub Actions

### Deployment Workflow
**File:** `.github/workflows/deploy.yml`

Runs on every push to main:
1. TypeScript check
2. Unit tests with coverage
3. Production build
4. Deploy to GitHub Pages

### Quality Workflow
**File:** `.github/workflows/quality.yml`

Runs on pull requests and pushes:
1. All code quality checks
2. Security audit
3. Build validation
4. Accessibility checks
5. Link checking
6. Performance budget validation

---

## Manual Testing Checklist

### Visual Testing
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test mobile responsive design (375px, 768px, 1024px, 1920px)
- [ ] Verify dark mode styling
- [ ] Check all images load correctly
- [ ] Verify animations and transitions

### Functional Testing
- [ ] Navigation works on all pages
- [ ] Search functionality
- [ ] Category filtering
- [ ] Recipe detail pages load
- [ ] Print recipe feature
- [ ] Share functionality
- [ ] Form submissions

### SEO Testing
- [ ] Meta tags present on all pages
- [ ] Structured data validates (Google Rich Results Test)
- [ ] Sitemap.xml accessible
- [ ] robots.txt configured correctly
- [ ] Canonical URLs correct
- [ ] Open Graph tags for social sharing

### Performance Testing
- [ ] Lighthouse score > 90 (Performance)
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.8s
- [ ] Cumulative Layout Shift < 0.1

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast passes WCAG AA
- [ ] Focus indicators visible
- [ ] ARIA labels present where needed
- [ ] Images have descriptive alt text

---

## Recommended Tools

### Browser Extensions
- **Lighthouse** - Performance, accessibility, SEO audit
- **axe DevTools** - Accessibility testing
- **React Developer Tools** - Component inspection
- **WAVE** - Web accessibility evaluation

### Online Tools
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## Quality Standards

### Code Quality
- ✅ TypeScript strict mode enabled
- ✅ ESLint configured with React best practices
- ✅ No `any` types (use proper typing)
- ✅ Consistent code formatting
- ✅ Meaningful variable/function names

### Test Coverage Goals
- Components: > 80%
- Utilities: > 90%
- Critical paths: 100%

### Performance Goals
- Lighthouse Performance: > 90
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.8s
- Bundle size: < 1MB total

### Accessibility Goals
- WCAG 2.1 Level AA compliance
- Lighthouse Accessibility: > 95
- Keyboard navigable
- Screen reader compatible

---

## Continuous Improvement

### Weekly Tasks
- [ ] Review and fix any new ESLint warnings
- [ ] Update dependencies (`npm outdated`)
- [ ] Check Lighthouse scores
- [ ] Review bundle size trends

### Monthly Tasks
- [ ] Security audit (`npm audit`)
- [ ] Accessibility audit with screen reader
- [ ] Performance profiling
- [ ] User feedback review

### Quarterly Tasks
- [ ] Comprehensive accessibility audit
- [ ] Load testing
- [ ] SEO audit and optimization
- [ ] Dependency major version updates

---

## Troubleshooting

### Build Fails
1. Clear cache: `npm run clean`
2. Reinstall dependencies: `npm install`
3. Check Node version (requires 18+)
4. Review build logs for specific errors

### Tests Fail
1. Update snapshots if needed: `npm run test -- -u`
2. Check for breaking changes in dependencies
3. Review test output for specific failures

### Large Bundle Size
1. Run `npm run analyze` to visualize bundle
2. Consider code splitting large pages
3. Lazy load heavy components
4. Check for duplicate dependencies

---

## Support

For questions or issues with quality checks:
1. Check this documentation
2. Review GitHub Actions logs
3. Check project issues on GitHub
4. Contact maintainers

---

**Last Updated:** January 21, 2026  
**Project:** Mechanics of Motherhood v1.0.0
