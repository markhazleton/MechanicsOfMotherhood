# Mechanics of Motherhood (MoM) - Copilot Instructions

## Project Overview

Mechanics of Motherhood is a modern, responsive recipe management web application designed for working mothers. It's built as a **static React application** hosted on **GitHub Pages** with an industrial design theme. The application features recipe discovery, organization, and sharing capabilities with real API integration for dynamic content.

## High-Level Repository Information

- **Project Type**: React Static Web Application (SPA)
- **Size**: Medium-sized project (~50+ files)
- **Languages**: TypeScript, JavaScript, CSS
- **Frameworks**: React 19, Vite, Tailwind CSS
- **Target Runtime**: Browser (static deployment)
- **Hosting**: GitHub Pages
- **Architecture**: Single Page Application with client-side routing
- **API Integration**: Hybrid (real API + mock data fallback)

## Build Instructions

### Prerequisites

- Node.js (version 18+ recommended)
- npm (comes with Node.js)

### Development Workflow

1. **Install Dependencies**: Always run `npm install` first
2. **Start Development**: `npm run dev` (runs on http://localhost:5000)
3. **Fetch Data**: `npm run fetch-data` (fetches real recipe data from API)
4. **Build for Production**: `npm run build` (includes data fetching)
5. **Preview Build**: `npm run preview` (serves production build locally)

### Important Build Commands

- `npm run build:static` - Build without API data fetching (uses mock data)
- `npm run build:with-data` - Build with fresh API data
- `npm run test-api` - Test API connectivity
- `npm run clean` - Clean build artifacts

### Common Issues & Solutions

- **Build failures**: Always run `npm install` first if dependencies are missing
- **API timeouts**: Use `npm run build:static` for static fallback
- **Port conflicts**: Development server uses port 5000 by default
- **Missing data**: Run `npm run fetch-data` before building

## Project Layout

### Root Directory Structure

```
MechanicsOfMotherhood/
├── .github/                 # GitHub Actions & Copilot instructions
├── client/                  # Frontend React application
├── scripts/                 # Build and utility scripts
├── attached_assets/         # API specifications and documentation
├── copilot/                 # Generated documentation (put all .md files here)
└── dist/                    # Build output (auto-generated)
```

### Key Configuration Files

- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - Shadcn/ui component configuration

### Client Directory Structure

```
client/
├── public/                  # Static assets (images, icons, manifests)
├── src/
│   ├── components/          # Reusable UI components
│   │   └── ui/             # Shadcn/ui components
│   ├── pages/              # Route components
│   ├── data/               # Mock data & API types
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities & configurations
│   └── utils/              # Helper functions
└── index.html              # Main HTML template
```

### Key Source Files

- `client/src/App.tsx` - Main app component with routing
- `client/src/main.tsx` - App entry point
- `client/src/index.css` - Global styles and Tailwind imports
- `client/src/data/api-loader.ts` - API data loading logic
- `client/src/lib/queryClient.ts` - React Query configuration

## Architecture & Dependencies

### Frontend Stack

- **React 19** with TypeScript for type safety
- **Vite** for build tooling and development server
- **Wouter** for lightweight client-side routing
- **TanStack React Query** for data fetching and caching
- **Shadcn/ui** component library (built on Radix UI)
- **Tailwind CSS** for styling with custom industrial theme
- **Lucide React** for icons

### Design System

- **Primary Color**: Industrial Blue (#2C3E50)
- **Secondary Color**: Workshop Teal (#38B2AC)
- **Accent Color**: Energetic Orange (#ED8936)
- **Typography**: Clean sans-serif with custom headings
- **Theme**: Industrial/mechanical aesthetic

### API Integration

- **Primary API**: RecipeSpark at webspark.markhazleton.com
- **Fallback**: Mock data in `client/src/data/`
- **Build Process**: Data fetched during build and cached locally
- **Runtime**: Client-side only, no backend dependency

## Validation & CI/CD

### GitHub Actions Workflow

- **File**: `.github/workflows/deploy.yml`
- **Triggers**: Push to main branch
- **Process**: Install → Build → Deploy to GitHub Pages
- **Base Path**: `/MechanicsOfMotherhood` (configured for GitHub Pages)

### Manual Validation Steps

1. Run `npm run build` to ensure clean build
2. Run `npm run preview` to test production build locally
3. Check for TypeScript errors: `npm run check`
4. Verify responsive design on mobile/desktop
5. Test all routes and navigation

## Development Guidelines

### File Organization Rules

- **Components**: Use kebab-case for file names (`hero-section.tsx`)
- **Pages**: Use kebab-case for route components (`recipe-detail.tsx`)
- **Utilities**: Group by function in appropriate directories
- **Assets**: Store in `client/public/images/` with descriptive names

### Code Style Conventions

- Use TypeScript for all new files
- Prefer function components over class components
- Use arrow functions for inline callbacks
- Follow existing Tailwind CSS patterns for styling
- Use Shadcn/ui components when available

### Image Management

- **Recipe Images**: Use `client/public/images/recipes/`
- **Icons**: Use Lucide React or store in `client/public/images/icons/`
- **Logos**: Store in `client/public/images/logos/`
- **Optimization**: Images should be web-optimized (WebP preferred)

## Special Instructions for AI Agents

### Critical Operational Guidelines

**ALWAYS ASK FOR CLARIFICATION**: If you are unsure about any instruction, requirement, or implementation detail, ALWAYS ask the user for clarification before proceeding. Do not make assumptions about unclear requirements.

**ALWAYS CONDUCT QA REVIEW**: Before completing any task, ALWAYS perform a comprehensive review as a senior QA analyst. This includes:

- Reviewing all changes for potential issues, bugs, or conflicts
- Checking for breaking changes or regressions
- Validating that changes follow project conventions and best practices
- Testing functionality where applicable
- Identifying any security, performance, or accessibility concerns
- Ensuring changes are compatible with the React/TypeScript/Tailwind stack
- Verifying GitHub Pages deployment compatibility

### Documentation Management

**IMPORTANT**: When generating any .md files (documentation, guides, reports, etc.), ALWAYS place them in the `/copilot` folder at the project root, NOT in the main directory. This keeps documentation organized and separate from source code.

### API Data Handling

- The app works in both online (with API) and offline (mock data) modes
- Mock data is located in `client/src/data/` and should mirror API structure
- When adding new features, update both API types and mock data

### GitHub Pages Considerations

- Base path is configured as `/MechanicsOfMotherhood` for GitHub Pages
- All routing uses `wouter` with proper base path configuration
- Static assets must be referenced correctly for subdirectory deployment

### Common Tasks

1. **Adding new recipes**: Update `client/src/data/recipes.json` for mock data
2. **New components**: Follow Shadcn/ui patterns and place in appropriate directories
3. **Styling changes**: Use existing Tailwind classes and custom CSS variables
4. **Route changes**: Update routing in `client/src/App.tsx`

## Trust These Instructions

These instructions have been validated and tested. Only search for additional information if:

- The instructions appear incomplete for your specific task
- You encounter errors not covered in the troubleshooting sections
- You need to understand implementation details not documented here

The project structure and build process are stable - follow the documented workflows for best results.

## Quality Assurance Requirements

### Before Completing Any Task

1. **Review Changes**: Examine all modifications for potential issues
2. **Test Compatibility**: Ensure changes work with existing React/TypeScript/Tailwind setup
3. **Check Dependencies**: Verify no breaking changes to package dependencies
4. **Validate Build**: Confirm changes don't break the build process
5. **Review Performance**: Assess impact on application performance
6. **Security Check**: Look for potential security vulnerabilities
7. **Accessibility Review**: Ensure changes maintain accessibility standards
8. **Mobile Compatibility**: Verify responsive design isn't broken

### When in Doubt

- **ASK QUESTIONS**: Always seek clarification rather than making assumptions
- **EXPLAIN CONCERNS**: Share any potential issues you identify
- **SUGGEST ALTERNATIVES**: Propose different approaches if you see risks
- **REQUEST TESTING**: Ask for specific testing if changes are significant
