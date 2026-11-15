<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 (template) → 1.0.0 (initial formalization)

Modified principles:
- Template placeholders → 10 concrete principles defined

Added sections:
- I. TypeScript Strictness
- II. Testing Standards
- III. Code Quality & Linting
- IV. File Naming Conventions
- V. Styling & Design System
- VI. React Component Standards
- VII. Accessibility
- VIII. Observability & Logging
- IX. CI/CD & Quality Gates
- X. Build & Deployment
- Technology Stack
- Compliance Levels

Removed sections:
- All template placeholders removed

Templates requiring updates:
- ✅ plan-template.md - Constitution Check section is generic, works with these principles
- ✅ spec-template.md - Requirements section compatible
- ✅ tasks-template.md - Phase structure compatible

Follow-up TODOs: None
-->

# Mechanics of Motherhood Constitution

## Core Principles

### I. TypeScript Strictness

All TypeScript code MUST compile under the strictest safety settings to catch errors at compile time.

- Full strict mode enabled (MUST)
- No unchecked indexed access via `noUncheckedIndexedAccess: true` (MUST)
- No implicit returns via `noImplicitReturns: true` (MUST)
- No `any` types without documented justification (SHOULD)
- Type check runs in CI and blocks deployment (MUST)

### II. Testing Standards

All new components and utilities MUST have automated tests to ensure reliability.

- All new components/utilities require tests in `__tests__/` folders (MUST)
- Use Vitest + React Testing Library for all tests (MUST)
- Tests MUST pass in CI before merge (MUST)
- Use `data-testid` attributes for test selectors (SHOULD)
- Test files named `*.test.ts` or `*.test.tsx` (MUST)

### III. Code Quality & Linting

Code quality is enforced through automated linting to maintain consistency.

- ESLint MUST pass in CI (MUST)
- React Hooks rules enforced: `react-hooks/rules-of-hooks: error` (MUST)
- React Hooks exhaustive deps warned: `react-hooks/exhaustive-deps: warn` (SHOULD)
- Prefer const over let: `prefer-const: warn` (SHOULD)
- No console.log in production: `no-console: warn` (MUST)

### IV. File Naming Conventions

Consistent file naming improves discoverability and reduces cognitive load.

- All component files use kebab-case: `hero-section.tsx` (MUST)
- All utility files use kebab-case: `use-toast.ts` (MUST)
- Test files: `{name}.test.ts` or `{name}.test.tsx` (MUST)
- Page components in `pages/` directory (MUST)
- Reusable components in `components/` directory (MUST)
- UI primitives in `components/ui/` directory (MUST)

### V. Styling & Design System

All styling uses Tailwind CSS v4 with design tokens for visual consistency.

- Use Tailwind CSS utility classes for all styling (MUST)
- Use design tokens from `client/src/index.css` via `@theme` directive (MUST)
- No inline styles or external CSS files (MUST)
- UI components follow Shadcn/ui + CVA pattern (SHOULD)
- Support dark mode via `.dark` class (SHOULD)

### VI. React Component Standards

React components follow consistent patterns for maintainability.

- Use function components exclusively, no class components (MUST)
- Use React 19 features where appropriate (SHOULD)
- Export component as default for page components (SHOULD)
- Use `forwardRef` for components needing ref forwarding (SHOULD)
- Import types with `type` keyword: `import type { X }` (SHOULD)

### VII. Accessibility

All user interface elements MUST be accessible to ensure universal usability.

- All new UI MUST pass accessibility checks (MUST)
- Use semantic HTML elements (SHOULD)
- Provide `data-testid` attributes for interactive elements (SHOULD)
- Color contrast MUST meet WCAG AA standards (MUST)
- Keyboard navigation MUST work for all interactive elements (SHOULD)

### VIII. Observability & Logging

Production code MUST be free of debug logging.

- No `console.log` in production code (MUST)
- Use `useAnalytics` hook for user behavior tracking (SHOULD)
- Console `warn` and `error` are acceptable for genuine errors (MAY)

### IX. CI/CD & Quality Gates

All code changes MUST pass automated quality gates before deployment.

**Blocking Checks (MUST pass)**:
- TypeScript type checking (`npm run check`)
- ESLint linting (`npm run lint`)
- Unit tests (`npm run test:coverage`)
- Production build (`npm run build:github`)

**Advisory Checks (SHOULD pass)**:
- Accessibility checks (`npm run quality:a11y`)
- Link validation (`npm run quality:links`)
- Bundle size analysis (`npm run analyze`)
- Security audit (`npm audit`)

### X. Build & Deployment

Deployment follows established patterns for GitHub Pages static hosting.

- Build MUST complete without errors (MUST)
- SEO validation runs before deployment (SHOULD)
- Data validation runs before deployment (SHOULD)
- GitHub Pages deployment from `main` branch only (MUST)
- Performance budget: 300KB JS, 50KB CSS (SHOULD)

## Technology Stack

**Required Technologies**:
- TypeScript 5.9+
- React 19+
- Vite 7+
- Tailwind CSS 4+
- Vitest for testing
- GitHub Actions for CI/CD
- GitHub Pages for hosting

**Component Library**:
- Shadcn/ui components with CVA
- Radix UI primitives
- Lucide React icons

## Compliance Levels

| Level | Meaning | Enforcement |
|-------|---------|-------------|
| MUST | Non-negotiable requirement | Blocks PR merge |
| SHOULD | Strongly recommended | Review comment required for violations |
| MAY | Optional best practice | No enforcement |

## Governance

### Amendment Process

- Any contributor MAY propose constitution amendments via PR
- Amendments are reviewed as part of normal PR process
- No special approval required beyond standard code review
- Breaking changes to principles SHOULD be documented in PR description

### Compliance

- All PRs MUST comply with MUST-level principles
- SHOULD-level principles are strongly recommended but not blocking
- MAY-level principles are optional best practices
- Exceptions require documented justification in code comments

### Versioning

- Constitution uses semantic versioning (MAJOR.MINOR.PATCH)
- MAJOR: Backward-incompatible principle changes
- MINOR: New principles or materially expanded guidance
- PATCH: Clarifications, wording, typo fixes

**Version**: 1.0.0 | **Ratified**: 2026-01-30 | **Last Amended**: 2026-01-30
