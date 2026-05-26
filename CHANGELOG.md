# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.1] - 2026-05-26

### Fixed

- **Trailing slash enforcement**: All internal URLs, breadcrumb hrefs,
  and structured data now use trailing slashes (`/recipes/`, `/blog/`,
  `/categories/`, `/recipe/<slug>/`) to prevent 301 redirect chains.
- **Breadcrumb hrefs**: `seo-helpers.ts` breadcrumb generation updated
  for `/recipes/`, `/categories/`, `/blog/`.
- **Structured data**: `prerender.js` BreadcrumbList and ItemList URLs
  corrected to include trailing slashes.
- **Blog structured data**: `generateBlogStructuredData()` URL fixed
  to `${SITE_CONFIG.url}/blog/`.
- **Category breadcrumb paths**: Extended path matching to handle
  both `/recipes` and `/recipes/` variants.

### Changed

- **DevSpark migration**: Tooling moved from `.specify/` to `.devspark/`
  with expanded scripts, templates, and skills.
- **Project documentation**: Added `CLAUDE.md` project guide and
  `agents-registry.json`.
- **Constitution**: Moved from `.specify/memory/` to
  `.documentation/memory/`.
- **Dependencies**: Updated `fast-xml-parser` and other packages.

### Release v1.0.1 Contributors

- Mark Hazleton

---

## [v1.0.0] - 2026-01-30

### Added

- **Recipe catalog**: Full recipe browsing with category filtering
  and search.
- **SSG/prerender**: Static site generation with pre-rendered HTML
  shells for all recipe and category routes.
- **SEO infrastructure**: Canonical URLs, Open Graph tags, structured
  data (Recipe, BreadcrumbList, ItemList, Organization schemas).
- **Trailing-slash canonicalization**: `normalizeCanonicalPath()` and
  `toCanonicalUrl()` utilities enforce trailing slashes across sitemap
  and metadata.
- **Dark mode**: Full dark mode support via Tailwind CSS v4 `.dark`
  class toggle.
- **Accessibility**: WCAG AA contrast compliance, keyboard navigation,
  semantic HTML, `data-testid` attributes.
- **LLM recipe chat**: "Talk to MoM" AI-powered recipe assistant.
- **Analytics**: `useAnalytics` hook for user behaviour tracking.
- **Data quality validation**: Automated validation reports for API
  data integrity.
- **Link checker**: `check-links.js` with regression test suite.
- **Sitemap generation**: XML sitemap with normalized canonical URLs
  for all recipe, category, and static pages.
- **TypeScript strict mode**: Full `strict`,
  `noUncheckedIndexedAccess`, `noImplicitReturns` enforcement.
- **Tailwind CSS v4**: Design system with `@theme` tokens, warning,
  success, and destructive colour palettes.
- **Shadcn/ui + CVA**: Component library with Radix UI primitives.

### Release v1.0.0 Contributors

- Mark Hazleton
