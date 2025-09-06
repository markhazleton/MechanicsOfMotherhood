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
  getApiData,
} from "@/data/api-loader";

// Static data query handler for client-side only operations

// Simple pagination helper for static data
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

// Static data response wrapper
function createStaticResponse(data: any, message: string, pagination?: any) {
  return {
    data,
    message,
    success: true,
    ...(pagination && { pagination }),
  };
}

async function staticDataFetch(url: string): Promise<any> {
  // Simple delay for better UX
  await new Promise((resolve) => setTimeout(resolve, 50));

  const urlPath = new URL(url, "http://localhost").pathname;
  const urlParams = new URL(url, "http://localhost").searchParams;

  // Only use real static data - throw error if not available
  if (!hasApiData()) {
    throw new Error(
      "Static data is not available. Please run the data fetch script."
    );
  }

  return await staticDataHandler(urlPath, urlParams);
}

async function staticDataHandler(
  urlPath: string,
  urlParams: URLSearchParams
): Promise<any> {
  // Handle different static data queries using pre-fetched data
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
      recipes: paginatedRecipes.map((r: any) => ({
        id: r.id.toString(),
        title: r.name,
        description: r.description || "",
        imageUrl: "/api/placeholder/600/400",
        cookTime: r.cookTime ? `${r.cookTime} mins` : "30 mins",
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
    const pathParts = urlPath.split("/");
    const idString = pathParts[3];
    if (!idString) {
      throw new Error("Invalid recipe ID in URL");
    }
    const id = parseInt(idString);
    if (isNaN(id)) {
      throw new Error("Recipe ID must be a number");
    }
    const recipe = getRecipeById(id);
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    return {
      id: recipe.id.toString(),
      title: recipe.name,
      description: recipe.description || "",
      imageUrl: "/api/placeholder/600/400",
      cookTime: "30 mins", // Default value since API doesn't provide cookTime
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

    return createStaticResponse(
      paginatedRecipes,
      `Retrieved ${paginatedRecipes.length} recipes`,
      createPagination(pageNumber, pageSize, recipes.length)
    );
  }

  if (urlPath === "/api/categories") {
    const categories = getCategories();
    return {
      categories: categories.map((c: any) => ({
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
      recipes: featuredRecipes.map((r: any) => ({
        id: r.id.toString(),
        title: r.name,
        description: r.description || "",
        imageUrl: "/api/placeholder/600/400",
        cookTime: r.cookTime ? `${r.cookTime} mins` : "30 mins",
        servings: r.servings || 4,
        difficulty: "Medium",
        category: r.recipeCategory?.name || "General",
        rating: r.averageRating || 4.0,
        tags: r.seO_Keywords
          ? r.seO_Keywords.split(",").map((k: string) => k.trim())
          : [],
        featured: true,
      })),
      posts: [], // No blog posts in static data
      categories: getCategories().map((c: any) => ({
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
      totalRecipes: recipeStats.totalRecipes,
      totalCategories: recipeStats.totalCategories,
      averageRating: recipeStats.averageRating,
      recipesByCategory: recipeStats.recipesByCategory,
      recentRecipes: recipeStats.recentRecipes,
    };
  }

  if (urlPath === "/api/blog-posts") {
    // No blog posts in static data, return empty array
    const page = parseInt(urlParams.get("page") || "1");
    const limit = parseInt(urlParams.get("limit") || "10");

    return {
      posts: [],
      pagination: createPagination(page, limit, 0),
    };
  }

  if (urlPath === "/api-data") {
    // Return the complete API data structure for components that need it
    const apiDataObj = getApiData();
    return apiDataObj;
  }

  throw new Error(`Static data endpoint not implemented: ${urlPath}`);
}

// Static data query function for React Query
export const getQueryFn: QueryFunction = async ({ queryKey }) => {
  const url = queryKey.join("/") as string;

  // Always use real static data - no fallback to mock data
  if (!hasApiData()) {
    throw new Error(
      "Static data is not available. Please run the data fetch script first using 'npm run fetch-data'."
    );
  }

  return await staticDataFetch(url);
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn,
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
