import { QueryClient, QueryFunction } from "@tanstack/react-query";
import {
  hasApiData,
  getRecipes,
  getRecipeById,
  getRecipesByCategory,
  getCategories,
  getCategoryBySlug,
  searchRecipes,
  getFeaturedRecipes,
  getRecipeStats,
  getWebsites,
  getMenuItemsByWebsite,
} from "@/data/api-loader";

// Simple pagination helper
function createPagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.min(page, totalPages);
  const hasNext = currentPage < totalPages;
  const hasPrevious = currentPage > 1;

  return {
    currentPage,
    totalPages,
    hasNext,
    hasPrevious,
    total,
  };
}

// API response wrapper
function createApiResponse(data: any, message: string, pagination?: any) {
  return {
    data,
    message,
    success: true,
    ...(pagination && { pagination }),
  };
}

async function apiDataFetch(url: string): Promise<any> {
  // Simulate network delay for better UX
  await new Promise((resolve) => setTimeout(resolve, 50));

  const urlPath = new URL(url, "http://localhost").pathname;
  const urlParams = new URL(url, "http://localhost").searchParams;

  // Only use real API data - throw error if not available
  if (!hasApiData()) {
    throw new Error(
      "API data is not available. Please run the data fetch script."
    );
  }

  return await apiDataHandler(urlPath, urlParams);
}

async function apiDataHandler(
  urlPath: string,
  urlParams: URLSearchParams
): Promise<any> {
  // Handle different API endpoints using fetched data
  if (urlPath === "/api/recipes") {
    const page = parseInt(urlParams.get("page") || "1");
    const limit = parseInt(urlParams.get("limit") || "10");
    const category = urlParams.get("category");
    const featured = urlParams.get("featured") === "true";

    let recipes = getRecipes();

    if (category) {
      const categoryObj = getCategoryBySlug(category);
      if (categoryObj) {
        recipes = getRecipesByCategory(categoryObj.id);
      }
    }

    if (featured) {
      recipes = getFeaturedRecipes();
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRecipes = recipes.slice(startIndex, endIndex);

    return {
      recipes: paginatedRecipes.map((r) => ({
        id: r.id.toString(),
        title: r.name,
        description: r.description || "",
        imageUrl: "/api/placeholder/600/400",
        prepTime: "15 mins",
        cookTime: "30 mins",
        servings: r.servings || 4,
        difficulty: "Medium",
        category: r.recipeCategory?.name || "General",
        rating: r.averageRating || 4.0,
        tags: r.seO_Keywords
          ? r.seO_Keywords.split(",").map((k: string) => k.trim())
          : [],
        featured: r.averageRating && r.averageRating > 4.0,
      })),
      pagination: createPagination(page, limit, recipes.length),
    };
  }

  if (urlPath.startsWith("/api/recipes/")) {
    const id = parseInt(urlPath.split("/")[3]);
    const recipe = getRecipeById(id);
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    return {
      id: recipe.id.toString(),
      title: recipe.name,
      description: recipe.description || "",
      imageUrl: "/api/placeholder/600/400",
      prepTime: "15 mins",
      cookTime: "30 mins",
      servings: recipe.servings || 4,
      difficulty: "Medium",
      category: recipe.recipeCategory?.name || "General",
      rating: recipe.averageRating || 4.0,
      tags: recipe.seO_Keywords
        ? recipe.seO_Keywords.split(",").map((k: string) => k.trim())
        : [],
      featured: recipe.averageRating && recipe.averageRating > 4.0,
      ingredients:
        recipe.ingredients?.split("\n").filter((i: string) => i.trim()) || [],
      instructions:
        recipe.instructions?.split("\n").filter((i: string) => i.trim()) || [],
      nutrition: {
        calories: 350,
        protein: "25g",
        carbs: "40g",
        fat: "12g",
      },
    };
  }

  if (urlPath === "/api/recipespark/recipes") {
    const pageNumber = parseInt(urlParams.get("pageNumber") || "1");
    const pageSize = parseInt(urlParams.get("pageSize") || "12");
    const categoryId = urlParams.get("categoryId");
    const searchTerm = urlParams.get("searchTerm");

    let recipes = getRecipes();

    if (categoryId) {
      recipes = getRecipesByCategory(parseInt(categoryId));
    }

    if (searchTerm) {
      recipes = searchRecipes(searchTerm);
    }

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecipes = recipes.slice(startIndex, endIndex);

    return createApiResponse(
      paginatedRecipes,
      `Retrieved ${paginatedRecipes.length} recipes`,
      createPagination(pageNumber, pageSize, recipes.length)
    );
  }

  if (urlPath === "/api/categories") {
    const categories = getCategories();
    return {
      categories: categories.map((c) => ({
        id: c.id.toString(),
        name: c.name,
        description: c.description || "",
        recipeCount: getRecipesByCategory(c.id).length,
      })),
    };
  }

  if (urlPath === "/api/featured-content") {
    const featuredRecipes = getFeaturedRecipes(6);
    return {
      recipes: featuredRecipes.map((r) => ({
        id: r.id.toString(),
        title: r.name,
        description: r.description || "",
        imageUrl: "/api/placeholder/600/400",
        prepTime: "15 mins",
        cookTime: "30 mins",
        servings: r.servings || 4,
        difficulty: "Medium",
        category: r.recipeCategory?.name || "General",
        rating: r.averageRating || 4.0,
        tags: r.seO_Keywords
          ? r.seO_Keywords.split(",").map((k: string) => k.trim())
          : [],
        featured: true,
      })),
      posts: [], // No blog posts in API data
      categories: getCategories().map((c) => ({
        id: c.id.toString(),
        name: c.name,
        description: c.description || "",
        recipeCount: getRecipesByCategory(c.id).length,
      })),
    };
  }

  if (urlPath === "/api/stats") {
    const recipeStats = getRecipeStats();
    // Convert to format expected by components
    return {
      recipes: recipeStats.totalRecipes,
      families: Math.floor(recipeStats.totalRecipes * 100), // Estimate based on recipes
      timeSaved: recipeStats.totalRecipes * 15000, // Estimate 15 minutes saved per recipe
      satisfaction: 98,
      communityMembers: Math.floor(recipeStats.totalRecipes * 150), // Estimate community size
    };
  }

  if (urlPath === "/api/blog-posts") {
    // No blog posts in API data, return empty array
    const page = parseInt(urlParams.get("page") || "1");
    const limit = parseInt(urlParams.get("limit") || "10");

    return {
      posts: [],
      pagination: createPagination(page, limit, 0),
    };
  }

  throw new Error(`API endpoint not implemented: ${urlPath}`);
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;

    // Always use real API data - no fallback to mock data
    if (!hasApiData()) {
      throw new Error(
        "API data is not available. Please run the data fetch script first using 'npm run fetch-data'."
      );
    }

    return await apiDataFetch(url);
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
