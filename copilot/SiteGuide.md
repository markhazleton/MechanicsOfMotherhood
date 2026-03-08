# Mechanics of Motherhood Site Guide

This guide replaces historical `copilot/*.md` implementation logs and status reports.

## Purpose

Mechanics of Motherhood is a Vite + React static site with SSR build artifacts and prerendered recipe/category pages.

## Stack

- Frontend: React 19, TypeScript, Wouter
- Styling: Tailwind CSS v4, Radix UI primitives
- Tooling: Vite, Vitest, ESLint
- Data pipeline: Node scripts that fetch, validate, and generate static JSON in `client/src/data/`

## Core Commands

- `npm run dev`: local development
- `npm run lint`: lint checks (must be warning/error free)
- `npm run test`: unit tests
- `npm run build`: full production pipeline
- `npm run quality:check`: composite quality gate

## Build Pipeline (high level)

`npm run build` runs:

1. `clean`
2. `build:github`:
   - `fetch-data`
   - `generate:sitemap`
   - `validate-data`
   - `validate:seo`
   - `vite build`
   - `inject-build-version`
3. `build:ssr`
4. `prerender`
5. `ssg`

## Data and Reports

- Canonical content JSON lives in `client/src/data/`.
- Validation markdown reports are written to:
  - `copilot/data-quality/data-quality-report-<timestamp>.md`
- Keep `copilot/data-quality/` for generated reports only.
- API contract references are code-first:
  - runtime loaders in `client/src/data/api-loader.ts`
  - shared types in `client/src/data/api-types.ts`

## Current Architecture Notes

- Client routes should use lightweight loaders (`getRecipes`, `getCategories`) where possible.
- Avoid reintroducing eager imports of large JSON blobs (`api-data.json`, `websites.json`, `menu-items.json`) in client-critical modules.
- `getFeaturedRecipes` must not mutate source arrays (clone before sorting).
- Avoid `dangerouslySetInnerHTML` unless strict sanitization is in place.

## Documentation Policy

- Keep documentation concise and operational.
- Prefer one authoritative doc over many status/history files.
- Remove stale migration reports, one-off audit logs, and implementation diaries.
- Remove standalone API-spec prose docs when they diverge from code/types.
- If adding docs, update this guide instead of creating fragmented report files.
