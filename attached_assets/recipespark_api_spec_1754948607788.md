# RecipeSpark API Specification

## Overview

The RecipeSpark API provides RESTful endpoints for managing recipes and recipe categories. This API follows standard HTTP conventions and returns JSON responses.

**Base URL**: `https://your-domain.com/api/recipespark`

**Content-Type**: `application/json`

**Authentication**: Required (implementation-specific)

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "data": <response_data>,
  "success": true,
  "message": "Operation completed successfully",
  "pagination": {  // Only present for paginated endpoints
    "currentPage": 1,
    "pageSize": 20,
    "totalCount": 150,
    "totalPages": 8,
    "hasPrevious": false,
    "hasNext": true
  }
}
```

### Error Response
```json
{
  "message": "Error description",
  "details": "Detailed error information (optional)",
  "validationErrors": {  // Only present for validation errors
    "fieldName": ["Error message 1", "Error message 2"]
  }
}
```

## HTTP Status Codes

- `200 OK` - Successful GET, PUT, DELETE operations
- `201 Created` - Successful POST operations
- `400 Bad Request` - Invalid request data or validation errors
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

# Recipe Endpoints

## Get All Recipes

Retrieve a list of recipes with optional filtering and pagination.

**Endpoint**: `GET /recipes`

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `categoryId` | integer | No | null | Filter by category ID |
| `searchTerm` | string | No | null | Search in recipe name, description, or ingredients |
| `pageNumber` | integer | No | 1 | Page number (minimum: 1) |
| `pageSize` | integer | No | 20 | Items per page (minimum: 1, maximum: 100) |

### Example Request
```http
GET /api/recipespark/recipes?categoryId=5&searchTerm=chicken&pageNumber=1&pageSize=10
```

### Example Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "Chicken Alfredo",
      "description": "Creamy pasta dish with chicken",
      "ingredients": "- 2 chicken breasts\n- 1 lb fettuccine\n- 1 cup heavy cream",
      "instructions": "1. Cook chicken\n2. Boil pasta\n3. Make sauce",
      "servings": 4,
      "authorNM": "Chef John",
      "recipeCategoryID": 5,
      "recipeCategory": {
        "id": 5,
        "name": "Main Course"
      },
      "domainID": 2,
      "createdDT": "2024-01-15T10:30:00Z",
      "modifiedDT": "2024-01-15T10:30:00Z",
      "isApproved": true,
      "averageRating": 4.5
    }
  ],
  "success": true,
  "message": "Retrieved 1 recipes",
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 1,
    "totalPages": 1,
    "hasPrevious": false,
    "hasNext": false
  }
}
```

## Get Recipe by ID

Retrieve a specific recipe by its ID.

**Endpoint**: `GET /recipes/{id}`

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Recipe ID |

### Example Request
```http
GET /api/recipespark/recipes/1
```

### Example Response
```json
{
  "data": {
    "id": 1,
    "name": "Chicken Alfredo",
    "description": "Creamy pasta dish with chicken",
    "ingredients": "- 2 chicken breasts\n- 1 lb fettuccine\n- 1 cup heavy cream",
    "instructions": "1. Cook chicken\n2. Boil pasta\n3. Make sauce",
    "servings": 4,
    "authorNM": "Chef John",
    "recipeCategoryID": 5,
    "recipeCategory": {
      "id": 5,
      "name": "Main Course"
    },
    "domainID": 2,
    "createdDT": "2024-01-15T10:30:00Z",
    "modifiedDT": "2024-01-15T10:30:00Z",
    "isApproved": true,
    "averageRating": 4.5
  },
  "success": true,
  "message": "Recipe retrieved successfully"
}
```

## Create Recipe

Create a new recipe.

**Endpoint**: `POST /recipes`

### Request Body

```json
{
  "name": "Recipe Name",
  "description": "Recipe description (optional)",
  "ingredients": "Ingredient list (optional)",
  "instructions": "Cooking instructions (optional)",
  "servings": 4,
  "authorName": "Author name (optional)",
  "categoryId": 5
}
```

### Field Validation

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | Max 255 characters |
| `description` | string | No | - |
| `ingredients` | string | No | - |
| `instructions` | string | No | - |
| `servings` | integer | No | 1-999, default: 1 |
| `authorName` | string | No | - |
| `categoryId` | integer | Yes | Must be valid category ID |

### Example Request
```http
POST /api/recipespark/recipes
Content-Type: application/json

{
  "name": "Chocolate Cake",
  "description": "Delicious chocolate cake recipe",
  "ingredients": "- 2 cups flour\n- 1 cup sugar\n- 1/2 cup cocoa powder",
  "instructions": "1. Mix dry ingredients\n2. Add wet ingredients\n3. Bake at 350°F",
  "servings": 8,
  "authorName": "Baker Jane",
  "categoryId": 3
}
```

### Example Response
```json
{
  "data": {
    "id": 15,
    "name": "Chocolate Cake",
    "description": "Delicious chocolate cake recipe",
    "ingredients": "- 2 cups flour\n- 1 cup sugar\n- 1/2 cup cocoa powder",
    "instructions": "1. Mix dry ingredients\n2. Add wet ingredients\n3. Bake at 350°F",
    "servings": 8,
    "authorNM": "Baker Jane",
    "recipeCategoryID": 3,
    "domainID": 2,
    "createdDT": "2024-01-15T14:30:00Z",
    "modifiedDT": "2024-01-15T14:30:00Z"
  },
  "success": true,
  "message": "Recipe created successfully"
}
```

## Update Recipe

Update an existing recipe.

**Endpoint**: `PUT /recipes/{id}`

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Recipe ID to update |

### Request Body

Same as Create Recipe request body.

### Example Request
```http
PUT /api/recipespark/recipes/15
Content-Type: application/json

{
  "name": "Double Chocolate Cake",
  "description": "Extra chocolaty cake recipe",
  "ingredients": "- 2 cups flour\n- 1 cup sugar\n- 3/4 cup cocoa powder",
  "instructions": "1. Mix dry ingredients\n2. Add wet ingredients\n3. Bake at 350°F for 35 minutes",
  "servings": 8,
  "authorName": "Baker Jane",
  "categoryId": 3
}
```

## Delete Recipe

Delete a recipe.

**Endpoint**: `DELETE /recipes/{id}`

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Recipe ID to delete |

### Example Request
```http
DELETE /api/recipespark/recipes/15
```

### Example Response
```json
{
  "data": {
    "id": 15
  },
  "success": true,
  "message": "Recipe deleted successfully"
}
```

---

# Category Endpoints

## Get All Categories

Retrieve a list of recipe categories.

**Endpoint**: `GET /categories`

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `includeInactive` | boolean | No | false | Include inactive categories |

### Example Request
```http
GET /api/recipespark/categories?includeInactive=true
```

### Example Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "Appetizers",
      "description": "Small dishes served before main course",
      "displayOrder": 1,
      "isActive": true,
      "url": "appetizers",
      "recipes": []
    },
    {
      "id": 2,
      "name": "Main Course",
      "description": "Primary dishes",
      "displayOrder": 2,
      "isActive": true,
      "url": "main-course",
      "recipes": []
    }
  ],
  "success": true,
  "message": "Retrieved 2 categories"
}
```

## Get Category by ID

Retrieve a specific category by its ID.

**Endpoint**: `GET /categories/{id}`

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Category ID |

### Example Request
```http
GET /api/recipespark/categories/1
```

### Example Response
```json
{
  "data": {
    "id": 1,
    "name": "Appetizers",
    "description": "Small dishes served before main course",
    "displayOrder": 1,
    "isActive": true,
    "url": "appetizers",
    "recipes": [
      {
        "id": 5,
        "name": "Buffalo Wings",
        "description": "Spicy chicken wings"
      }
    ]
  },
  "success": true,
  "message": "Category retrieved successfully"
}
```

## Create Category

Create a new recipe category.

**Endpoint**: `POST /categories`

### Request Body

```json
{
  "name": "Category Name",
  "description": "Category description (optional)",
  "displayOrder": 99,
  "isActive": true,
  "url": "category-url-slug (optional)"
}
```

### Field Validation

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | Max 100 characters |
| `description` | string | No | - |
| `displayOrder` | integer | No | 1-999, default: 99 |
| `isActive` | boolean | No | Default: true |
| `url` | string | No | Max 100 characters, auto-generated if empty |

### Example Request
```http
POST /api/recipespark/categories
Content-Type: application/json

{
  "name": "Desserts",
  "description": "Sweet treats and desserts",
  "displayOrder": 5,
  "isActive": true,
  "url": "desserts"
}
```

### Example Response
```json
{
  "data": {
    "id": 8,
    "name": "Desserts",
    "description": "Sweet treats and desserts",
    "displayOrder": 5,
    "isActive": true,
    "url": "desserts"
  },
  "success": true,
  "message": "Category created successfully"
}
```

## Update Category

Update an existing category.

**Endpoint**: `PUT /categories/{id}`

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Category ID to update |

### Request Body

Same as Create Category request body.

### Example Request
```http
PUT /api/recipespark/categories/8
Content-Type: application/json

{
  "name": "Desserts & Sweets",
  "description": "Sweet treats, desserts, and confections",
  "displayOrder": 5,
  "isActive": true,
  "url": "desserts-sweets"
}
```

## Delete Category

Delete a category.

**Endpoint**: `DELETE /categories/{id}`

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Category ID to delete |

### Example Request
```http
DELETE /api/recipespark/categories/8
```

### Example Response
```json
{
  "data": {
    "id": 8
  },
  "success": true,
  "message": "Category deleted successfully"
}
```

---

# Agent Usage Guidelines

## Authentication
Include appropriate authentication headers with all requests (implementation-specific).

## Error Handling
Always check the `success` field in responses and handle errors appropriately:

```python
# Example error handling
response = requests.get("/api/recipespark/recipes/999")
data = response.json()

if response.status_code == 404:
    print("Recipe not found")
elif not data.get("success", False):
    print(f"Error: {data.get('message', 'Unknown error')}")
else:
    recipe = data["data"]
    # Process recipe data
```

## Pagination
When retrieving recipes, handle pagination properly:

```python
# Example pagination handling
page = 1
all_recipes = []

while True:
    response = requests.get(f"/api/recipespark/recipes?pageNumber={page}")
    data = response.json()
    
    if not data["success"]:
        break
        
    all_recipes.extend(data["data"])
    
    if not data["pagination"]["hasNext"]:
        break
        
    page += 1
```

## Rate Limiting
Implement appropriate delays between requests to avoid overwhelming the server.

## Data Validation
Always validate data before sending POST/PUT requests to avoid validation errors.

## Best Practices
1. Use appropriate HTTP methods for each operation
2. Include Content-Type header for POST/PU