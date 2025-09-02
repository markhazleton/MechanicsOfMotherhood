# WebCMS API Setup Guide

## Overview

The Mechanics of Motherhood project has been updated to fetch website configuration and menu data from a specific WebCMS endpoint. This guide explains how to set up the API access and what changes were made.

## Changes Made

### API Endpoint Updates

1. **WebCMS Base URL Updated**:
   - **Before**: `https://webspark.markhazleton.com/api/WebCMS/WebCMSApi`
   - **After**: `https://webspark.markhazleton.com/api/WebCMS`

2. **Website Data Source**:
   - **Before**: Fetched all websites via `GET /websites?pageSize=100`
   - **After**: Fetches specific website via `GET /websites/2`

3. **Header Format Updated**:
   - **Before**: `Content-Type: application/json`
   - **After**: `Accept: application/json`

### Files Modified

1. **`scripts/fetch-data.js`**:
   - Updated `WEBCMS_API_BASE` default value
   - Modified `fetchWebsites()` to fetch website ID 2 specifically
   - Updated headers to use `Accept: application/json`

2. **`scripts/test-api.js`**:
   - Updated `WEBCMS_API_BASE` default value
   - Updated test endpoint to use `/websites/2`
   - Updated headers to use `Accept: application/json`

3. **`.env.example`**:
   - Updated `WEBCMS_API_BASE` examples
   - Added comments for website ID 2 context

## Setup Instructions

### Step 1: Get Your Bearer Token

You need to obtain a bearer token for the WebCMS API. Based on the curl command provided:

```bash
curl --location 'https://webspark.markhazleton.com/api/WebCMS/websites/2' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Replace `YOUR_TOKEN_HERE` with your actual bearer token.**

### Step 2: Create Environment File

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your token:

   ```bash
   # WebCMS API Configuration (for website ID 2 and menu items)
   WEBCMS_API_BASE=https://webspark.markhazleton.com/api/WebCMS
   WEBCMS_AUTH_TOKEN=your-actual-bearer-token-here
   ```

### Step 3: Test the API

Test your configuration:

```bash
npm run test-api
```

Expected output with token:

```
🌐 Testing WebCMS API:
Testing: https://webspark.markhazleton.com/api/WebCMS/websites/2
  Status: 200 OK
  Response preview: {"id":2,"name":"Website Name",...
```

### Step 4: Fetch Data

Fetch fresh data including website configuration:

```bash
npm run fetch-data
```

This will now:

1. Fetch all recipes from RecipeSpark API
2. Fetch all categories from RecipeSpark API
3. Fetch website ID 2 from WebCMS API
4. Fetch menu items for website ID 2
5. Save all data to JSON files in `client/src/data/`

## Data Files Generated

With the WebCMS token configured, these files will be populated:

- **`websites.json`**: Contains website ID 2 configuration
- **`menu-items.json`**: Contains menu hierarchy for website ID 2

Format:

```json
// websites.json
[
  {
    "id": 2,
    "name": "Website Name",
    "siteName": "Site Display Name",
    "websiteUrl": "https://example.com",
    // ... other website properties
  }
]

// menu-items.json
{
  "2": [
    {
      "id": 1,
      "title": "Menu Item",
      "url": "/path",
      "displayOrder": 1,
      // ... other menu properties
    }
  ]
}
```

## Troubleshooting

### Token Issues

If you get authentication errors:

1. Verify your token is correct and not expired
2. Check that you're using the exact format: `Bearer your-token-here`
3. Ensure the token has access to website ID 2

### API Connection Issues

If the API is unreachable:

1. Check your internet connection
2. Verify the base URL is correct
3. Check if the API server is running

### Missing Data

If website/menu data is empty:

1. Verify the token is set in your `.env` file
2. Check that website ID 2 exists and is accessible
3. Run `npm run test-api` to diagnose the issue

## Fallback Behavior

The application is designed to work with or without WebCMS data:

- **With Token**: Full website configuration and menu data
- **Without Token**: Uses mock/empty data for websites and menus
- **Recipes**: Always fetched from RecipeSpark API (no token required)

## API Endpoints Reference

### RecipeSpark API (No Auth Required)

- **Recipes**: `GET https://webspark.markhazleton.com/api/recipespark/recipes`
- **Categories**: `GET https://webspark.markhazleton.com/api/recipespark/categories`

### WebCMS API (Bearer Token Required)

- **Website**: `GET https://webspark.markhazleton.com/api/WebCMS/websites/2`
- **Menu Items**: `GET https://webspark.markhazleton.com/api/WebCMS/websites/2/menu-hierarchy`

## Next Steps

1. Obtain your WebCMS bearer token
2. Configure your `.env` file
3. Test the API connection
4. Run a fresh data fetch
5. Build and deploy your application

The application will now have proper website configuration and menu structure from the WebCMS system.
