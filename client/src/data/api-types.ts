// Auto-generated types from API data
// Generated on 2025-08-16T18:13:17.479Z

export interface Recipe {
  id: number;
  name: string;
  description?: string;
  ingredients?: string;
  instructions?: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  authorNM?: string;
  recipeCategoryID?: number;
  recipeCategory?: {
    id: number;
    name: string;
    description?: string;
    order?: number;
    isActive?: boolean;
    recipes?: any[];
    url?: string;
    domainID?: number;
  };
  domainID?: number;
  createdDT?: string;
  modifiedDT?: string;
  isApproved?: boolean;
  averageRating?: number;
  ratingCount?: number;
  commentCount?: number;
  viewCount?: number;
  recipeURL?: string;
  images?: string[];
  seO_Keywords?: string;
  recipeCategories?: any;
  recipeCategoryNM?: any;
  fileDescription?: any;
  fileName?: any;
  lastViewDT?: string;
  modifiedID?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  order?: number;
  isActive?: boolean;
  url?: string;
  recipes?: any[];
  domainID?: number;
}

export interface Website {
  id: number;
  name: string;
  description?: string;
  siteTemplate?: string;
  siteStyle?: string;
  message?: string;
  siteName?: string;
  websiteUrl?: string;
  websiteTitle?: string;
  useBreadCrumbURL?: boolean;
  isRecipeSite?: boolean;
  modifiedDT?: string;
  modifiedID?: number;
}

export interface MenuItem {
  id: number;
  domainID: number;
  domainName?: string;
  title: string;
  icon?: string;
  pageContent?: string;
  action?: string;
  controller?: string;
  argument?: string;
  url?: string;
  description?: string;
  displayInNavigation?: boolean;
  displayOrder?: number;
  parentId?: number;
  parentTitle?: string;
  lastModified?: string;
  children?: MenuItem[];
}

// Data export interfaces
export interface ApiData {
  recipes: Recipe[];
  categories: Category[];
  websites: Website[];
  menuItems: Record<number, MenuItem[]>;
  metadata: {
    fetchedAt: string;
    totalRecipes: number;
    totalCategories: number;
    totalWebsites: number;
  };
}

// API Response interfaces for component usage
export interface StatsResponse {
  recipes: number;
  families: number;
  timeSaved: number;
  satisfaction: number;
  communityMembers: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface RecipesResponse {
  data: Recipe[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    total: number;
  };
  message?: string;
  success?: boolean;
}
