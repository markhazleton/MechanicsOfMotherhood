# SEO Asset Validation

This document describes the automated validation added for critical crawlability and SEO support files: `sitemap.xml`, `robots.txt`, and `404.html`.

## Overview

The build pipeline now runs `npm run validate:seo` (hooked into `build:github`) which executes `scripts/validate-seo-assets.js` before producing the production bundle. The validator ensures:

- Required files exist in `client/public/`
- `sitemap.xml` is well-formed XML, has at least one `<url>`, and includes the homepage
- Duplicate `<loc>` entries are flagged as warnings
- Presence of `/recipe/` URLs (ensures recipe coverage) is checked
- `robots.txt` includes a global `User-agent: *` and an absolute Sitemap URL
- `robots.txt` does not accidentally block the root path
- `404.html` includes the SPA redirect logic and a `noindex` meta tag

If structural errors are detected, the build fails early to avoid deploying a broken discoverability surface.

## Script Location

`scripts/validate-seo-assets.js`

## Adding New URL Types

If new route families are introduced (e.g. `/guides/` or `/collections/`):

1. Update `generate-sitemap.js` to emit entries.
2. Optionally extend the validator with additional heuristics (e.g., ensure presence of `/guides/` URLs).

## Running Manually

```bash
npm run validate:seo
```

## Failure Modes

| Condition | Severity | Resolution |
|-----------|----------|------------|
| Missing required file | Error | Add the file back to `client/public/` |
| `sitemap.xml` unparsable | Error | Regenerate with `npm run generate:sitemap` |
| Zero `<url>` entries | Error | Check data sources feeding the generator |
| Missing homepage URL | Warning | Ensure static page list still includes root |
| No `/recipe/` URLs | Warning | Inspect recipe data ingestion or generator filtering |
| Duplicate `<loc>` entries | Warning | De-dupe generation logic |
| robots.txt lacks `User-agent: *` | Error | Add standard directive |
| 404 missing SPA logic | Warning | Restore redirect JS block |

## Dependency

The validator relies on `fast-xml-parser` (added to `devDependencies`). It will attempt an on-demand install if missing, but lockfile installation is preferred.

## 404 SPA Redirect Behavior

The custom `404.html` detects known SPA routes (recipes, categories, etc.) and rewrites to `/#<original-path>` so that the client router can hydrate correctly. This supports deep-linking on GitHub Pages and improves crawler access when JavaScript executes.

## Extending Checks

Consider future enhancements:

- Validate `<lastmod>` recency thresholds
- Ensure every recipe in source data appears exactly once
- Cross-check category pages vs active categories list
- Lint for trailing slashes consistency
- Structured data (JSON-LD) presence validation post-prerender

## Related Scripts

- `scripts/generate-sitemap.js` – builds the sitemap from recipe & category data
- `scripts/prerender.js` / `scripts/ssg.ts` – static generation & hydration support for SEO

---

Maintained automatically as part of the build guardrails to prevent silent SEO regressions.
