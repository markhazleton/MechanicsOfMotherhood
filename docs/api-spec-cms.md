# CMS (Content Management System) API Specification

## Overview
RESTful API for managing recipes, categories, websites, menu items, and blog content for Mechanics of Motherhood platform.

**Base URL:** `https://api.mechanicsofmotherhood.com/v1`

**Authentication:** Bearer token via `Authorization` header with role-based permissions

---

## Table of Contents
1. [Recipes API](#recipes-api)
2. [Categories API](#categories-api)
3. [Websites API](#websites-api)
4. [Menu Items API](#menu-items-api)
5. [Blog Content API](#blog-content-api)
6. [Media/Assets API](#media-assets-api)
7. [Search API](#search-api)

---

# Recipes API

## 1. List All Recipes

**GET** `/recipes`

Retrieves a paginated list of recipes with optional filtering.

### Request

**Query Parameters:**
- `page` (integer, optional, default: 1) - Page number
- `pageSize` (integer, optional, default: 20, max: 100) - Items per page
- `categoryId` (integer, optional) - Filter by category ID
- `status` (string, optional) - Filter by status: "draft", "published", "archived"
- `search` (string, optional) - Search in name, description, ingredients
- `sortBy` (string, optional, default: "createdAt") - Sort field: "name", "createdAt", "updatedAt", "averageRating"
- `sortOrder` (string, optional, default: "desc") - Sort order: "asc" or "desc"
- `tags` (string, optional) - Comma-separated tags
- `difficulty` (string, optional) - Filter by difficulty: "easy", "medium", "hard"
- `prepTimeMax` (integer, optional) - Maximum prep time in minutes
- `cookTimeMax` (integer, optional) - Maximum cook time in minutes

**Headers:**
```
Authorization: Bearer {token}
```

### Response

**Success (200 OK)**
```json
{
  "data": [
    {
      "id": 42,
      "name": "Classic Chocolate Chip Cookies",
      "slug": "classic-chocolate-chip-cookies",
      "description": "Perfect chewy chocolate chip cookies with a crispy edge.",
      "recipeCategoryID": 8,
      "recipeCategory": {
        "id": 8,
        "name": "Dessert",
        "description": "Sweet treats and desserts"
      },
      "ingredients": "2 cups flour\n1 cup sugar\n1 cup brown sugar\n...",
      "instructions": "1. Preheat oven to 375°F\n2. Mix dry ingredients...",
      "servings": 24,
      "prepTime": 15,
      "cookTime": 12,
      "totalTime": 27,
      "difficulty": "easy",
      "imageUrl": "https://cdn.mechanicsofmotherhood.com/recipes/chocolate-chip-cookies.jpg",
      "videoUrl": null,
      "averageRating": 4.8,
      "ratingCount": 156,
      "viewCount": 3421,
      "tags": ["cookies", "dessert", "chocolate", "baking"],
      "nutrition": {
        "calories": 180,
        "protein": 2,
        "carbohydrates": 24,
        "fat": 9,
        "fiber": 1,
        "sugar": 16
      },
      "allergens": ["gluten", "dairy", "eggs"],
      "dietaryFlags": ["vegetarian"],
      "status": "published",
      "featured": true,
      "authorId": "user_123",
      "createdAt": "2025-01-10T10:30:00Z",
      "updatedAt": "2025-01-14T15:20:00Z",
      "publishedAt": "2025-01-11T09:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 20,
    "totalPages": 6,
    "totalItems": 109,
    "hasNext": true,
    "hasPrevious": false
  },
  "filters": {
    "categoryId": null,
    "status": "published",
    "search": null
  }
}
```

---

## 2. Get Single Recipe

**GET** `/recipes/{id}`

Retrieves detailed information about a specific recipe.

### Request

**Path Parameters:**
- `id` (integer, required) - Recipe ID

**Query Parameters:**
- `include` (string, optional) - Comma-separated related data: "category", "ratings", "comments", "relatedRecipes"

**Headers:**
```
Authorization: Bearer {token}
```

### Response

**Success (200 OK)**
```json
{
  "id": 42,
  "name": "Classic Chocolate Chip Cookies",
  "slug": "classic-chocolate-chip-cookies",
  "description": "Perfect chewy chocolate chip cookies with a crispy edge.",
  "recipeCategoryID": 8,
  "recipeCategory": {
    "id": 8,
    "name": "Dessert",
    "slug": "dessert",
    "description": "Sweet treats and desserts",
    "imageUrl": "https://cdn.mechanicsofmotherhood.com/categories/dessert.jpg"
  },
  "ingredients": "2 cups all-purpose flour\n1 tsp baking soda\n1/2 tsp salt\n1 cup (2 sticks) butter, softened\n3/4 cup granulated sugar\n3/4 cup packed brown sugar\n2 large eggs\n2 tsp vanilla extract\n2 cups chocolate chips",
  "instructions": "1. Preheat oven to 375°F (190°C).\n2. In a medium bowl, whisk together flour, baking soda, and salt.\n3. In a large bowl, beat butter and both sugars until creamy.\n4. Add eggs and vanilla; beat well.\n5. Gradually blend in flour mixture.\n6. Stir in chocolate chips.\n7. Drop rounded tablespoons onto ungreased cookie sheets.\n8. Bake for 9-11 minutes or until golden brown.\n9. Cool on baking sheets for 2 minutes; remove to wire racks.",
  "servings": 24,
  "prepTime": 15,
  "cookTime": 12,
  "totalTime": 27,
  "difficulty": "easy",
  "imageUrl": "https://cdn.mechanicsofmotherhood.com/recipes/chocolate-chip-cookies.jpg",
  "imageAlt": "Golden brown chocolate chip cookies on a cooling rack",
  "videoUrl": "https://cdn.mechanicsofmotherhood.com/videos/cookie-tutorial.mp4",
  "thumbnailUrl": "https://cdn.mechanicsofmotherhood.com/recipes/chocolate-chip-cookies-thumb.jpg",
  "averageRating": 4.8,
  "ratingCount": 156,
  "viewCount": 3421,
  "favoriteCount": 89,
  "tags": ["cookies", "dessert", "chocolate", "baking", "family-favorite"],
  "nutrition": {
    "servingSize": "1 cookie",
    "calories": 180,
    "protein": 2,
    "carbohydrates": 24,
    "fat": 9,
    "saturatedFat": 5,
    "fiber": 1,
    "sugar": 16,
    "sodium": 120
  },
  "allergens": ["gluten", "dairy", "eggs"],
  "dietaryFlags": ["vegetarian"],
  "equipment": ["mixing bowls", "electric mixer", "cookie sheet", "cooling rack"],
  "tips": [
    "For chewier cookies, slightly underbake and let cool on the pan.",
    "Use room temperature butter for best results.",
    "Don't overbake - cookies continue to cook on the hot pan."
  ],
  "variations": [
    {
      "name": "Double Chocolate",
      "changes": "Replace 1/4 cup flour with cocoa powder"
    },
    {
      "name": "Nutty Delight",
      "changes": "Add 1 cup chopped walnuts or pecans"
    }
  ],
  "storage": {
    "method": "Store in an airtight container at room temperature",
    "duration": "Up to 1 week",
    "freezable": true,
    "freezeDuration": "Up to 3 months"
  },
  "status": "published",
  "featured": true,
  "seasonality": ["fall", "winter", "holiday"],
  "authorId": "user_123",
  "author": {
    "id": "user_123",
    "name": "Sarah Johnson",
    "bio": "Mom of three, passionate home baker",
    "avatarUrl": "https://cdn.mechanicsofmotherhood.com/avatars/sarah.jpg"
  },
  "seo": {
    "metaTitle": "Classic Chocolate Chip Cookies Recipe | MoM",
    "metaDescription": "Learn how to make the perfect chewy chocolate chip cookies with crispy edges. Easy recipe with simple ingredients!",
    "keywords": ["chocolate chip cookies", "cookie recipe", "baking", "dessert"],
    "canonicalUrl": "https://mechanicsofmotherhood.com/recipe/classic-chocolate-chip-cookies"
  },
  "relatedRecipes": [
    {
      "id": 43,
      "name": "Oatmeal Raisin Cookies",
      "slug": "oatmeal-raisin-cookies",
      "imageUrl": "...",
      "averageRating": 4.6
    }
  ],
  "createdAt": "2025-01-10T10:30:00Z",
  "updatedAt": "2025-01-14T15:20:00Z",
  "publishedAt": "2025-01-11T09:00:00Z",
  "version": 3
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "RECIPE_NOT_FOUND",
    "message": "Recipe with ID 42 not found",
    "timestamp": "2025-01-14T20:30:00Z"
  }
}
```

---

## 3. Create Recipe

**POST** `/recipes`

Creates a new recipe.

### Request

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
X-Idempotency-Key: {unique-key}
```

**Permissions Required:** `recipes.create`

**Request Body:**
```json
{
  "name": "Classic Chocolate Chip Cookies",
  "description": "Perfect chewy chocolate chip cookies with a crispy edge.",
  "recipeCategoryID": 8,
  "ingredients": "2 cups flour\n1 cup sugar\n...",
  "instructions": "1. Preheat oven to 375°F\n2. Mix dry ingredients...",
  "servings": 24,
  "prepTime": 15,
  "cookTime": 12,
  "difficulty": "easy",
  "imageUrl": "https://cdn.mechanicsofmotherhood.com/recipes/chocolate-chip-cookies.jpg",
  "tags": ["cookies", "dessert", "chocolate"],
  "nutrition": {
    "calories": 180,
    "protein": 2,
    "carbohydrates": 24,
    "fat": 9
  },
  "allergens": ["gluten", "dairy", "eggs"],
  "dietaryFlags": ["vegetarian"],
  "status": "draft"
}
```

**Required Fields:**
- `name` (string, max 200 chars)
- `description` (string, max 1000 chars)
- `recipeCategoryID` (integer)
- `ingredients` (string, max 5000 chars)
- `instructions` (string, max 10000 chars)

### Response

**Success (201 Created)**
```json
{
  "id": 110,
  "name": "Classic Chocolate Chip Cookies",
  "slug": "classic-chocolate-chip-cookies",
  "status": "draft",
  "createdAt": "2025-01-14T20:45:00Z",
  "updatedAt": "2025-01-14T20:45:00Z",
  "version": 1,
  "message": "Recipe created successfully"
}
```

**Error Responses:**
```json
// 400 Bad Request - Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Recipe validation failed",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      },
      {
        "field": "ingredients",
        "message": "Ingredients cannot be empty"
      }
    ],
    "timestamp": "2025-01-14T20:45:00Z"
  }
}

// 409 Conflict - Duplicate
{
  "error": {
    "code": "DUPLICATE_RECIPE",
    "message": "A recipe with this name already exists",
    "existingId": 42,
    "timestamp": "2025-01-14T20:45:00Z"
  }
}
```

---

## 4. Update Recipe

**PUT** `/recipes/{id}` or **PATCH** `/recipes/{id}`

Updates an existing recipe. PUT replaces entire resource, PATCH updates specific fields.

### Request

**Path Parameters:**
- `id` (integer, required) - Recipe ID

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
If-Match: {etag}
```

**Permissions Required:** `recipes.update` or `recipes.update.own` (if user is author)

**Request Body (PATCH):**
```json
{
  "name": "Best Ever Chocolate Chip Cookies",
  "averageRating": 4.9,
  "tags": ["cookies", "dessert", "chocolate", "family-favorite"]
}
```

### Response

**Success (200 OK)**
```json
{
  "id": 42,
  "name": "Best Ever Chocolate Chip Cookies",
  "slug": "best-ever-chocolate-chip-cookies",
  "updatedAt": "2025-01-14T20:50:00Z",
  "version": 4,
  "message": "Recipe updated successfully"
}
```

**Error Responses:**
```json
// 409 Conflict - Concurrent Modification
{
  "error": {
    "code": "CONCURRENT_MODIFICATION",
    "message": "Recipe was modified by another user. Please refresh and try again.",
    "currentVersion": 4,
    "timestamp": "2025-01-14T20:50:00Z"
  }
}

// 403 Forbidden
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You don't have permission to update this recipe",
    "requiredPermission": "recipes.update",
    "timestamp": "2025-01-14T20:50:00Z"
  }
}
```

---

## 5. Delete Recipe

**DELETE** `/recipes/{id}`

Soft deletes a recipe (moves to archived status).

### Request

**Path Parameters:**
- `id` (integer, required) - Recipe ID

**Query Parameters:**
- `hard` (boolean, optional, default: false) - Permanently delete (requires admin)

**Headers:**
```
Authorization: Bearer {token}
```

**Permissions Required:** `recipes.delete` or `recipes.delete.own`

### Response

**Success (204 No Content)**

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "RECIPE_NOT_FOUND",
    "message": "Recipe with ID 42 not found",
    "timestamp": "2025-01-14T20:55:00Z"
  }
}

// 409 Conflict - Has Dependencies
{
  "error": {
    "code": "RECIPE_HAS_DEPENDENCIES",
    "message": "Cannot delete recipe with active menu references",
    "dependencies": {
      "menuItems": 3,
      "favorites": 89
    },
    "timestamp": "2025-01-14T20:55:00Z"
  }
}
```

---

## 6. Bulk Operations

**POST** `/recipes/bulk`

Performs bulk operations on multiple recipes.

### Request

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Permissions Required:** `recipes.bulk.update`

**Request Body:**
```json
{
  "operation": "update" | "delete" | "publish" | "archive",
  "recipeIds": [42, 43, 44, 45],
  "data": {
    "status": "published",
    "featured": true
  }
}
```

### Response

**Success (200 OK)**
```json
{
  "operation": "update",
  "successful": 3,
  "failed": 1,
  "results": [
    {
      "recipeId": 42,
      "success": true
    },
    {
      "recipeId": 43,
      "success": true
    },
    {
      "recipeId": 44,
      "success": true
    },
    {
      "recipeId": 45,
      "success": false,
      "error": "Recipe not found"
    }
  ],
  "timestamp": "2025-01-14T21:00:00Z"
}
```

---

# Categories API

## 1. List All Categories

**GET** `/categories`

Retrieves all recipe categories.

### Request

**Query Parameters:**
- `include` (string, optional) - Include "recipeCount" to get recipe counts

**Headers:**
```
Authorization: Bearer {token}
```

### Response

**Success (200 OK)**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Appetizer",
      "slug": "appetizer",
      "description": "Starters and small bites",
      "imageUrl": "https://cdn.mechanicsofmotherhood.com/categories/appetizer.jpg",
      "iconName": "utensils",
      "color": "#FF6B6B",
      "displayOrder": 1,
      "recipeCount": 9,
      "status": "active",
      "seo": {
        "metaTitle": "Appetizer Recipes | MoM",
        "metaDescription": "Delicious appetizer recipes perfect for any occasion"
      },
      "createdAt": "2024-12-01T10:00:00Z",
      "updatedAt": "2025-01-10T14:30:00Z"
    },
    {
      "id": 2,
      "name": "Main Course",
      "slug": "main-course",
      "description": "Hearty main dishes",
      "imageUrl": "https://cdn.mechanicsofmotherhood.com/categories/main-course.jpg",
      "iconName": "chef-hat",
      "color": "#4ECDC4",
      "displayOrder": 2,
      "recipeCount": 29,
      "status": "active",
      "createdAt": "2024-12-01T10:00:00Z",
      "updatedAt": "2025-01-12T09:15:00Z"
    }
  ],
  "total": 14
}
```

---

## 2. Get Single Category

**GET** `/categories/{id}`

Retrieves a specific category with optional recipe list.

### Request

**Path Parameters:**
- `id` (integer, required) - Category ID

**Query Parameters:**
- `includeRecipes` (boolean, optional, default: false) - Include recipes in this category

**Headers:**
```
Authorization: Bearer {token}
```

### Response

**Success (200 OK)**
```json
{
  "id": 8,
  "name": "Dessert",
  "slug": "dessert",
  "description": "Sweet treats and desserts for every occasion",
  "imageUrl": "https://cdn.mechanicsofmotherhood.com/categories/dessert.jpg",
  "iconName": "cake",
  "color": "#FFB6C1",
  "displayOrder": 8,
  "recipeCount": 8,
  "status": "active",
  "seo": {
    "metaTitle": "Dessert Recipes | Mechanics of Motherhood",
    "metaDescription": "Discover amazing dessert recipes from cookies to cakes",
    "keywords": ["dessert", "sweets", "baking", "cookies", "cakes"]
  },
  "recipes": [
    {
      "id": 42,
      "name": "Classic Chocolate Chip Cookies",
      "slug": "classic-chocolate-chip-cookies",
      "imageUrl": "...",
      "averageRating": 4.8
    }
  ],
  "createdAt": "2024-12-01T10:00:00Z",
  "updatedAt": "2025-01-10T14:30:00Z"
}
```

---

## 3. Create Category

**POST** `/categories`

Creates a new recipe category.

### Request

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Permissions Required:** `categories.create`

**Request Body:**
```json
{
  "name": "Smoothies",
  "slug": "smoothies",
  "description": "Healthy and delicious smoothie recipes",
  "imageUrl": "https://cdn.mechanicsofmotherhood.com/categories/smoothies.jpg",
  "iconName": "glass",
  "color": "#98D8C8",
  "displayOrder": 15,
  "seo": {
    "metaTitle": "Smoothie Recipes | MoM",
    "metaDescription": "Quick and healthy smoothie recipes"
  }
}
```

### Response

**Success (201 Created)**
```json
{
  "id": 15,
  "name": "Smoothies",
  "slug": "smoothies",
  "status": "active",
  "createdAt": "2025-01-14T21:10:00Z",
  "message": "Category created successfully"
}
```

---

## 4. Update Category

**PUT** `/categories/{id}` or **PATCH** `/categories/{id}`

Updates an existing category.

### Request

**Path Parameters:**
- `id` (integer, required) - Category ID

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Permissions Required:** `categories.update`

**Request Body (PATCH):**
```json
{
  "name": "Smoothies & Drinks",
  "description": "Refreshing smoothies and healthy drinks",
  "displayOrder": 14
}
```

### Response

**Success (200 OK)**
```json
{
  "id": 15,
  "name": "Smoothies & Drinks",
  "slug": "smoothies-drinks",
  "updatedAt": "2025-01-14T21:15:00Z",
  "message": "Category updated successfully"
}
```

---

## 5. Delete Category

**DELETE** `/categories/{id}`

Deletes a category (only if no recipes are assigned).

### Request

**Path Parameters:**
- `id` (integer, required) - Category ID

**Headers:**
```
Authorization: Bearer {token}
```

**Permissions Required:** `categories.delete`

### Response

**Success (204 No Content)**

**Error Responses:**
```json
// 409 Conflict - Has Recipes
{
  "error": {
    "code": "CATEGORY_HAS_RECIPES",
    "message": "Cannot delete category with 29 associated recipes",
    "recipeCount": 29,
    "timestamp": "2025-01-14T21:20:00Z"
  }
}
```

---

# Websites API

## 1. List All Websites

**GET** `/websites`

Retrieves all configured websites.

### Request

**Headers:**
```
Authorization: Bearer {token}
```

### Response

**Success (200 OK)**
```json
{
  "data": [
    {
      "id": 2,
      "name": "MechanicsOfMotherhood.com",
      "domain": "mechanicsofmotherhood.com",
      "baseUrl": "https://mechanicsofmotherhood.com",
      "description": "Engineering better meals for working mothers worldwide",
      "logoUrl": "https://cdn.mechanicsofmotherhood.com/logos/mom-logo.png",
      "faviconUrl": "https://cdn.mechanicsofmotherhood.com/logos/favicon.ico",
      "primaryColor": "#C65D47",
      "secondaryColor": "#8B4513",
      "status": "active",
      "analytics": {
        "googleAnalyticsId": "UA-XXXXXXXXX-X",
        "googleTagManagerId": "GTM-XXXXXXX",
        "facebookPixelId": null
      },
      "social": {
        "facebook": "https://facebook.com/mechanicsofmotherhood",
        "instagram": "https://instagram.com/mechanicsofmotherhood",
        "youtube": "https://youtube.com/@mechanicsofmotherhood",
        "pinterest": null,
        "twitter": null
      },
      "seo": {
        "metaTitle": "Mechanics of Motherhood | Engineering Better Meals",
        "metaDescription": "Tested recipes and meal solutions for busy working mothers",
        "keywords": ["recipes", "cooking", "mom", "family meals"]
      },
      "settings": {
        "enableComments": true,
        "enableRatings": true,
        "enableNewsletter": true,
        "maintenanceMode": false,
        "defaultLanguage": "en-US",
        "timezone": "America/New_York"
      },
      "createdAt": "2024-11-01T10:00:00Z",
      "updatedAt": "2025-01-14T16:00:00Z"
    }
  ],
  "total": 1
}
```

---

## 2. Get Website

**GET** `/websites/{id}`

Retrieves detailed information about a website.

### Request

**Path Parameters:**
- `id` (integer, required) - Website ID

**Query Parameters:**
- `include` (string, optional) - Comma-separated: "menuItems", "statistics"

**Headers:**
```
Authorization: Bearer {token}
```

### Response

**Success (200 OK)**
```json
{
  "id": 2,
  "name": "MechanicsOfMotherhood.com",
  "domain": "mechanicsofmotherhood.com",
  "baseUrl": "https://mechanicsofmotherhood.com",
  "description": "Engineering better meals for working mothers worldwide",
  "logoUrl": "https://cdn.mechanicsofmotherhood.com/logos/mom-logo.png",
  "faviconUrl": "https://cdn.mechanicsofmotherhood.com/logos/favicon.ico",
  "primaryColor": "#C65D47",
  "secondaryColor": "#8B4513",
  "status": "active",
  "menuItems": [
    {
      "id": 1,
      "label": "Home",
      "url": "/",
      "type": "internal",
      "displayOrder": 1
    },
    {
      "id": 2,
      "label": "Recipes",
      "url": "/recipes",
      "type": "internal",
      "displayOrder": 2
    }
  ],
  "statistics": {
    "totalRecipes": 109,
    "totalCategories": 14,
    "totalMenuItems": 129,
    "monthlyVisitors": 45320,
    "averageRating": 4.7
  },
  "createdAt": "2024-11-01T10:00:00Z",
  "updatedAt": "2025-01-14T16:00:00Z"
}
```

---

## 3. Update Website

**PATCH** `/websites/{id}`

Updates website configuration.

### Request

**Path Parameters:**
- `id` (integer, required) - Website ID

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Permissions Required:** `websites.update`

**Request Body:**
```json
{
  "description": "Engineering better meals • The mother of all solutions",
  "primaryColor": "#C65D47",
  "settings": {
    "enableComments": true,
    "maintenanceMode": false
  }
}
```

### Response

**Success (200 OK)**
```json
{
  "id": 2,
  "name": "MechanicsOfMotherhood.com",
  "updatedAt": "2025-01-14T21:30:00Z",
  "message": "Website updated successfully"
}
```

---

# Menu Items API

## 1. List Menu Items

**GET** `/websites/{websiteId}/menu-items`

Retrieves all menu items for a website.

### Request

**Path Parameters:**
- `websiteId` (integer, required) - Website ID

**Query Parameters:**
- `type` (string, optional) - Filter by type: "recipe", "content", "external"
- `parentId` (integer, optional) - Filter by parent menu item (for hierarchical menus)

**Headers:**
```
Authorization: Bearer {token}
```

### Response

**Success (200 OK)**
```json
{
  "data": [
    {
      "id": 1,
      "websiteId": 2,
      "label": "Home",
      "url": "/",
      "type": "content",
      "targetEntityId": null,
      "parentId": null,
      "displayOrder": 1,
      "iconName": "home",
      "description": "Homepage",
      "status": "active",
      "openInNewTab": false,
      "cssClass": null,
      "createdAt": "2024-11-01T10:00:00Z",
      "updatedAt": "2025-01-10T12:00:00Z"
    },
    {
      "id": 2,
      "websiteId": 2,
      "label": "Chocolate Chip Cookies",
      "url": "/recipe/classic-chocolate-chip-cookies",
      "type": "recipe",
      "targetEntityId": 42,
      "parentId": 10,
      "displayOrder": 1,
      "iconName": null,
      "description": "Classic chocolate chip cookie recipe",
      "status": "active",
      "openInNewTab": false,
      "recipe": {
        "id": 42,
        "name": "Classic Chocolate Chip Cookies",
        "imageUrl": "...",
        "averageRating": 4.8
      },
      "createdAt": "2024-11-15T09:30:00Z",
      "updatedAt": "2025-01-14T11:20:00Z"
    }
  ],
  "total": 129
}
```

---

## 2. Create Menu Item

**POST** `/websites/{websiteId}/menu-items`

Creates a new menu item.

### Request

**Path Parameters:**
- `websiteId` (integer, required) - Website ID

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Permissions Required:** `menu-items.create`

**Request Body:**
```json
{
  "label": "New Recipe",
  "url": "/recipe/new-recipe",
  "type": "recipe",
  "targetEntityId": 110,
  "parentId": 10,
  "displayOrder": 5,
  "description": "A brand new recipe",
  "status": "active"
}
```

### Response

**Success (201 Created)**
```json
{
  "id": 130,
  "websiteId": 2,
  "label": "New Recipe",
  "url": "/recipe/new-recipe",
  "createdAt": "2025-01-14T21:40:00Z",
  "message": "Menu item created successfully"
}
```

---

## 3. Update Menu Item

**PATCH** `/websites/{websiteId}/menu-items/{id}`

Updates an existing menu item.

### Request

**Path Parameters:**
- `websiteId` (integer, required) - Website ID
- `id` (integer, required) - Menu item ID

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Permissions Required:** `menu-items.update`

**Request Body:**
```json
{
  "label": "Updated Recipe Name",
  "displayOrder": 3,
  "status": "active"
}
```

### Response

**Success (200 OK)**
```json
{
  "id": 130,
  "label": "Updated Recipe Name",
  "updatedAt": "2025-01-14T21:45:00Z",
  "message": "Menu item updated successfully"
}
```

---

## 4. Delete Menu Item

**DELETE** `/websites/{websiteId}/menu-items/{id}`

Deletes a menu item.

### Request

**Path Parameters:**
- `websiteId` (integer, required) - Website ID
- `id` (integer, required) - Menu item ID

**Headers:**
```
Authorization: Bearer {token}
```

**Permissions Required:** `menu-items.delete`

### Response

**Success (204 No Content)**

---

## 5. Reorder Menu Items

**POST** `/websites/{websiteId}/menu-items/reorder`

Updates the display order of multiple menu items.

### Request

**Path Parameters:**
- `websiteId` (integer, required) - Website ID

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Permissions Required:** `menu-items.reorder`

**Request Body:**
```json
{
  "items": [
    {
      "id": 1,
      "displayOrder": 1
    },
    {
      "id": 2,
      "displayOrder": 2
    },
    {
      "id": 3,
      "displayOrder": 3
    }
  ]
}
```

### Response

**Success (200 OK)**
```json
{
  "updated": 3,
  "message": "Menu items reordered successfully",
  "timestamp": "2025-01-14T21:50:00Z"
}
```

---

# Blog Content API

## 1. List Blog Posts

**GET** `/blog/posts`

Retrieves paginated list of blog posts.

### Request

**Query Parameters:**
- `page` (integer, optional, default: 1)
- `pageSize` (integer, optional, default: 10)
- `status` (string, optional) - "draft", "published", "scheduled"
- `category` (string, optional) - Blog category slug
- `tag` (string, optional) - Filter by tag
- `authorId` (string, optional) - Filter by author
- `search` (string, optional) - Search in title and content

**Headers:**
```
Authorization: Bearer {token}
```

### Response

**Success (200 OK)**
```json
{
  "data": [
    {
      "id": "post_abc123",
      "title": "10 Time-Saving Meal Prep Tips for Busy Moms",
      "slug": "10-time-saving-meal-prep-tips",
      "excerpt": "Discover practical strategies to streamline your weekly meal preparation...",
      "content": "# Introduction\n\nMeal prep can feel overwhelming...",
      "featuredImage": "https://cdn.mechanicsofmotherhood.com/blog/meal-prep-tips.jpg",
      "category": {
        "id": "cat_meal_planning",
        "name": "Meal Planning",
        "slug": "meal-planning"
      },
      "tags": ["meal prep", "time management", "organization"],
      "authorId": "user_123",
      "author": {
        "id": "user_123",
        "name": "Sarah Johnson",
        "avatarUrl": "..."
      },
      "status": "published",
      "publishedAt": "2025-01-10T09:00:00Z",
      "viewCount": 2450,
      "likeCount": 187,
      "commentCount": 34,
      "readingTime": 8,
      "seo": {
        "metaTitle": "10 Time-Saving Meal Prep Tips | MoM Blog",
        "metaDescription": "Master meal prep with these practical tips...",
        "keywords": ["meal prep", "cooking tips", "time management"]
      },
      "createdAt": "2025-01-08T14:30:00Z",
      "updatedAt": "2025-01-10T09:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 5,
    "totalItems": 47,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## 2. Get Blog Post

**GET** `/blog/posts/{id}`

Retrieves a single blog post.

### Request

**Path Parameters:**
- `id` (string, required) - Post ID or slug

**Query Parameters:**
- `include` (string, optional) - "comments", "relatedPosts"

**Headers:**
```
Authorization: Bearer {token}
```

### Response

**Success (200 OK)**
```json
{
  "id": "post_abc123",
  "title": "10 Time-Saving Meal Prep Tips for Busy Moms",
  "slug": "10-time-saving-meal-prep-tips",
  "excerpt": "Discover practical strategies...",
  "content": "# Introduction\n\nMeal prep can feel overwhelming...\n\n## Tip 1: Plan Your Week\n\nStart by...",
  "featuredImage": "https://cdn.mechanicsofmotherhood.com/blog/meal-prep-tips.jpg",
  "category": {
    "id": "cat_meal_planning",
    "name": "Meal Planning",
    "slug": "meal-planning",
    "description": "Tips and strategies for meal planning"
  },
  "tags": ["meal prep", "time management", "organization", "weekly planning"],
  "authorId": "user_123",
  "author": {
    "id": "user_123",
    "name": "Sarah Johnson",
    "bio": "Mom of three, passionate about making cooking easier",
    "avatarUrl": "https://cdn.mechanicsofmotherhood.com/avatars/sarah.jpg",
    "social": {
      "instagram": "@sarahcooks"
    }
  },
  "status": "published",
  "publishedAt": "2025-01-10T09:00:00Z",
  "viewCount": 2450,
  "likeCount": 187,
  "commentCount": 34,
  "readingTime": 8,
  "tableOfContents": [
    {
      "id": "introduction",
      "title": "Introduction",
      "level": 1
    },
    {
      "id": "tip-1-plan-your-week",
      "title": "Tip 1: Plan Your Week",
      "level": 2
    }
  ],
  "relatedPosts": [
    {
      "id": "post_def456",
      "title": "Batch Cooking 101",
      "slug": "batch-cooking-101",
      "featuredImage": "...",
      "excerpt": "..."
    }
  ],
  "seo": {
    "metaTitle": "10 Time-Saving Meal Prep Tips | MoM Blog",
    "metaDescription": "Master meal prep with these practical tips for busy working mothers",
    "keywords": ["meal prep", "cooking tips", "time management"],
    "canonicalUrl": "https://mechanicsofmotherhood.com/blog/10-time-saving-meal-prep-tips"
  },
  "createdAt": "2025-01-08T14:30:00Z",
  "updatedAt": "2025-01-10T09:00:00Z",
  "version": 2
}
```

---

## 3. Create Blog Post

**POST** `/blog/posts`

Creates a new blog post.

### Request

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Permissions Required:** `blog.create`

**Request Body:**
```json
{
  "title": "10 Time-Saving Meal Prep Tips for Busy Moms",
  "slug": "10-time-saving-meal-prep-tips",
  "excerpt": "Discover practical strategies to streamline your weekly meal preparation",
  "content": "# Introduction\n\nMeal prep can feel overwhelming...",
  "featuredImage": "https://cdn.mechanicsofmotherhood.com/blog/meal-prep-tips.jpg",
  "categoryId": "cat_meal_planning",
  "tags": ["meal prep", "time management", "organization"],
  "status": "draft",
  "seo": {
    "metaTitle": "10 Time-Saving Meal Prep Tips | MoM Blog",
    "metaDescription": "Master meal prep with these practical tips...",
    "keywords": ["meal prep", "cooking tips", "time management"]
  }
}
```

### Response

**Success (201 Created)**
```json
{
  "id": "post_ghi789",
  "title": "10 Time-Saving Meal Prep Tips for Busy Moms",
  "slug": "10-time-saving-meal-prep-tips",
  "status": "draft",
  "createdAt": "2025-01-14T22:00:00Z",
  "message": "Blog post created successfully"
}
```

---

## 4. Update Blog Post

**PATCH** `/blog/posts/{id}`

Updates an existing blog post.

### Request

**Path Parameters:**
- `id` (string, required) - Post ID

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
If-Match: {etag}
```

**Permissions Required:** `blog.update` or `blog.update.own`

**Request Body:**
```json
{
  "title": "11 Time-Saving Meal Prep Tips for Busy Moms",
  "status": "published",
  "publishedAt": "2025-01-15T09:00:00Z"
}
```

### Response

**Success (200 OK)**
```json
{
  "id": "post_ghi789",
  "title": "11 Time-Saving Meal Prep Tips for Busy Moms",
  "status": "published",
  "updatedAt": "2025-01-14T22:05:00Z",
  "version": 2,
  "message": "Blog post updated successfully"
}
```

---

## 5. Delete Blog Post

**DELETE** `/blog/posts/{id}`

Deletes a blog post.

### Request

**Path Parameters:**
- `id` (string, required) - Post ID

**Headers:**
```
Authorization: Bearer {token}
```

**Permissions Required:** `blog.delete`

### Response

**Success (204 No Content)**

---

# Media/Assets API

## 1. Upload Media

**POST** `/media/upload`

Uploads media files (images, videos, documents).

### Request

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Permissions Required:** `media.upload`

**Form Data:**
- `file` (file, required) - The media file
- `folder` (string, optional) - Target folder: "recipes", "blog", "categories", "profiles"
- `alt` (string, optional) - Alt text for images
- `title` (string, optional) - Media title

**File Restrictions:**
- Max size: 10MB for images, 50MB for videos
- Allowed types: jpg, png, gif, webp, mp4, pdf

### Response

**Success (201 Created)**
```json
{
  "id": "media_xyz123",
  "filename": "chocolate-chip-cookies.jpg",
  "originalFilename": "IMG_1234.jpg",
  "url": "https://cdn.mechanicsofmotherhood.com/recipes/chocolate-chip-cookies.jpg",
  "thumbnailUrl": "https://cdn.mechanicsofmotherhood.com/recipes/chocolate-chip-cookies-thumb.jpg",
  "mimeType": "image/jpeg",
  "size": 245678,
  "width": 1920,
  "height": 1080,
  "alt": "Golden brown chocolate chip cookies",
  "folder": "recipes",
  "uploadedBy": "user_123",
  "uploadedAt": "2025-01-14T22:10:00Z"
}
```

---

## 2. List Media

**GET** `/media`

Retrieves uploaded media files.

### Request

**Query Parameters:**
- `page` (integer, optional, default: 1)
- `pageSize` (integer, optional, default: 20)
- `folder` (string, optional) - Filter by folder
- `mimeType` (string, optional) - Filter by MIME type
- `search` (string, optional) - Search in filename and alt text

**Headers:**
```
Authorization: Bearer {token}
```

### Response

**Success (200 OK)**
```json
{
  "data": [
    {
      "id": "media_xyz123",
      "filename": "chocolate-chip-cookies.jpg",
      "url": "https://cdn.mechanicsofmotherhood.com/recipes/chocolate-chip-cookies.jpg",
      "thumbnailUrl": "https://cdn.mechanicsofmotherhood.com/recipes/chocolate-chip-cookies-thumb.jpg",
      "mimeType": "image/jpeg",
      "size": 245678,
      "alt": "Golden brown chocolate chip cookies",
      "uploadedAt": "2025-01-14T22:10:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 20,
    "totalPages": 12,
    "totalItems": 234
  }
}
```

---

## 3. Delete Media

**DELETE** `/media/{id}`

Deletes a media file.

### Request

**Path Parameters:**
- `id` (string, required) - Media ID

**Headers:**
```
Authorization: Bearer {token}
```

**Permissions Required:** `media.delete`

### Response

**Success (204 No Content)**

---

# Search API

## 1. Global Search

**GET** `/search`

Searches across all content types.

### Request

**Query Parameters:**
- `q` (string, required) - Search query
- `type` (string, optional) - Filter by type: "recipe", "blog", "category"
- `page` (integer, optional, default: 1)
- `pageSize` (integer, optional, default: 10)

**Headers:**
```
Authorization: Bearer {token}
```

### Response

**Success (200 OK)**
```json
{
  "query": "chocolate chip",
  "results": [
    {
      "type": "recipe",
      "id": 42,
      "title": "Classic Chocolate Chip Cookies",
      "excerpt": "Perfect chewy chocolate chip cookies...",
      "url": "/recipe/classic-chocolate-chip-cookies",
      "imageUrl": "...",
      "relevance": 0.95,
      "highlights": {
        "title": "<mark>Chocolate Chip</mark> Cookies",
        "description": "Perfect chewy <mark>chocolate chip</mark> cookies..."
      }
    },
    {
      "type": "blog",
      "id": "post_abc123",
      "title": "The Science of Perfect Chocolate Chip Cookies",
      "excerpt": "Learn the chemistry behind...",
      "url": "/blog/science-of-chocolate-chip-cookies",
      "imageUrl": "...",
      "relevance": 0.87
    }
  ],
  "facets": {
    "type": {
      "recipe": 15,
      "blog": 4,
      "category": 1
    }
  },
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 2,
    "totalItems": 20
  },
  "took": 45
}
```

---

## Authentication & Authorization

### Roles & Permissions

| Role | Permissions |
|------|------------|
| Admin | Full access to all endpoints |
| Editor | Create/update/delete recipes, blog posts, categories |
| Author | Create/update own recipes and blog posts |
| User | Read-only access, can rate and comment |

### Token Format

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzEyMyIsInJvbGUiOiJlZGl0b3IiLCJleHAiOjE3MDU0MjQwMDB9.signature
```

---

## Rate Limits

| Endpoint Group | Rate Limit | Window |
|---------------|-----------|---------|
| Read operations (GET) | 1000 requests | per hour |
| Write operations (POST/PUT/PATCH) | 100 requests | per hour |
| Delete operations | 50 requests | per hour |
| Media uploads | 20 requests | per hour |

---

## Common Error Responses

```json
// 400 Bad Request
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [...],
    "timestamp": "2025-01-14T22:30:00Z"
  }
}

// 401 Unauthorized
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired authentication token",
    "timestamp": "2025-01-14T22:30:00Z"
  }
}

// 403 Forbidden
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You don't have permission to perform this action",
    "requiredPermission": "recipes.delete",
    "timestamp": "2025-01-14T22:30:00Z"
  }
}

// 404 Not Found
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "timestamp": "2025-01-14T22:30:00Z"
  }
}

// 429 Too Many Requests
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "retryAfter": 3600,
    "timestamp": "2025-01-14T22:30:00Z"
  }
}

// 500 Internal Server Error
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "req_abc123xyz",
    "timestamp": "2025-01-14T22:30:00Z"
  }
}
```

---

## Versioning

API version is specified in the URL: `/v1/recipes`

Major version changes (v1 → v2) indicate breaking changes.

---

## Support

For API support and questions:
- Email: api-support@mechanicsofmotherhood.com
- Documentation: https://docs.mechanicsofmotherhood.com/api
- Status page: https://status.mechanicsofmotherhood.com

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-14 | Initial CMS API specification |
