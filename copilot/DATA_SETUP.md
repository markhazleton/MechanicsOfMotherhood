# Data Fetching Setup Guide

This guide explains how to set up the data fetching system to pull real data from the APIs instead of using mock data.

## Overview

The application has been configured to:

1. Fetch data from RecipeSpark API and WebCMS API during build time
2. Store the data as static JSON files
3. Use the real data when available, falling back to mock data if not

## Local Development Setup

### 1. Create Environment File

Copy the example environment file and fill in your API details:

```bash
cp .env.example .env
```

Edit `.env` with your actual API endpoints and credentials:

```env
# RecipeSpark API Base URL
RECIPE_API_BASE=https://your-domain.com/api/recipespark

# WebCMS API Configuration
WEBCMS_API_BASE=https://webspark.markhazleton.com/api/WebCMS/WebCMSApi
WEBCMS_AUTH_TOKEN=your-bearer-token-here
```

### 2. Test Data Fetching

Run the data fetch script to test your API configuration:

```bash
npm run fetch-data
```

This will:

- Fetch all recipes from the RecipeSpark API
- Fetch all categories from the RecipeSpark API
- Fetch websites and menu items from the WebCMS API (if auth token provided)
- Save the data to `client/src/data/` directory
- Generate TypeScript types for the data

### 3. Build with Real Data

Once you have fetched the data, build the application:

```bash
npm run build:with-data
```

Or run the steps separately:

```bash
npm run fetch-data
npm run build:static
```

## GitHub Actions Setup

To automatically fetch data during deployment, you need to configure repository variables and secrets.

### 1. Repository Variables

Go to your GitHub repository → Settings → Secrets and variables → Actions → Variables tab

Add these repository variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `RECIPE_API_BASE` | `https://your-domain.com/api/recipespark` | RecipeSpark API base URL |
| `WEBCMS_API_BASE` | `https://webspark.markhazleton.com/api/WebCMS/WebCMSApi` | WebCMS API base URL |

### 2. Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → Secrets tab

Add this repository secret:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `WEBCMS_AUTH_TOKEN` | `your-bearer-token-here` | WebCMS API authentication token |

### 3. Deploy

Once configured, push to the main branch to trigger the deployment with real data.

## Data Files

After running `npm run fetch-data`, these files will be created in `client/src/data/`:

- `recipes.json` - All recipes from the API
- `categories.json` - All categories from the API
- `websites.json` - All websites from WebCMS API
- `menu-items.json` - Menu items for each website
- `api-data.json` - Combined data with metadata
- `api-types.ts` - Generated TypeScript types

## Fallback Behavior

The application uses a smart fallback system:

1. **Build Time**: If APIs are unavailable, the build continues with empty data files
2. **Runtime**: The app tries to use fetched data first, then falls back to mock data
3. **Development**: Always uses mock data for fast iteration

## API Endpoints Used

### RecipeSpark API

- `GET /recipes` - All recipes with pagination
- `GET /categories` - All categories

### WebCMS API

- `GET /websites` - All websites
- `GET /websites/{id}/menu-hierarchy` - Menu items for each website

## Troubleshooting

### Data Fetch Fails

If `npm run fetch-data` fails:

1. Check your `.env` file has correct API URLs
2. Verify your WebCMS auth token is valid
3. Test API endpoints manually with curl or Postman
4. Check the console output for specific error messages

### Build Fails

If build fails after fetching data:

1. Check if the JSON files were created in `client/src/data/`
2. Verify the JSON files contain valid data
3. Look for TypeScript compilation errors
4. Try building without fetched data: `npm run build:static`

### GitHub Actions Fails

If deployment fails:

1. Check repository variables and secrets are set correctly
2. Look at the GitHub Actions logs for specific errors
3. Verify the API endpoints are accessible from GitHub's servers
4. Test the fetch script locally first

## Manual Data Update

To manually update the data without rebuilding:

```bash
# Fetch fresh data
npm run fetch-data

# The app will automatically use the new data on next load
```

## Data Structure

The fetched data follows the API specifications:

- **Recipes**: Include name, description, ingredients, instructions, ratings, etc.
- **Categories**: Include name, description, display order, etc.
- **Websites**: Include name, description, template info, etc.
- **Menu Items**: Include title, content, navigation structure, etc.

See `client/src/data/api-types.ts` for complete type definitions.
