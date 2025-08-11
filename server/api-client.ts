// External RecipeSpark API client
const RECIPESPARK_BASE_URL = "https://webspark.markhazleton.com/api/recipespark";

export interface ExternalRecipe {
  id: number;
  name: string;
  description?: string;
  ingredients: string;
  instructions: string;
  authorNM: string;
  servings: number;
  recipeCategoryID: number;
  recipeCategory: {
    id: number;
    name: string;
    description: string;
    order: number;
    isActive: boolean;
    url: string;
    domainID: number;
  };
  averageRating: number;
  viewCount: number;
  recipeURL: string;
  modifiedDT: string;
  isApproved: boolean;
  domainID: number;
}

export interface ExternalCategory {
  id: number;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  url: string;
  domainID: number;
  recipes: any[];
}

export interface ApiResponse<T> {
  data: T[];
  success: boolean;
  message: string;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

class RecipeSparkApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = RECIPESPARK_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRecipes(params: {
    pageNumber?: number;
    pageSize?: number;
    categoryId?: number;
    searchTerm?: string;
    featured?: boolean;
  } = {}): Promise<ApiResponse<ExternalRecipe>> {
    const searchParams = new URLSearchParams();
    
    if (params.pageNumber) searchParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params.categoryId) searchParams.append('categoryId', params.categoryId.toString());
    if (params.searchTerm) searchParams.append('searchTerm', params.searchTerm);
    if (params.featured) searchParams.append('featured', params.featured.toString());

    const endpoint = `/recipes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.makeRequest<ExternalRecipe>(endpoint);
  }

  async getRecipe(id: number): Promise<ExternalRecipe> {
    const response = await this.makeRequest<ExternalRecipe>(`/recipes/${id}`);
    return response.data[0]; // Assuming single recipe response
  }

  async getCategories(): Promise<ApiResponse<ExternalCategory>> {
    return this.makeRequest<ExternalCategory>('/categories');
  }

  async getCategory(id: number): Promise<ExternalCategory> {
    const response = await this.makeRequest<ExternalCategory>(`/categories/${id}`);
    return response.data[0];
  }
}

export const recipeSparkClient = new RecipeSparkApiClient();