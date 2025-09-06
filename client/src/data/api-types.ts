// Auto-generated types from API data
// Generated on 2025-09-06T03:24:25.121Z

export interface Recipe {
  id: number;
  name: string;
  description?: string;
  ingredients?: string;
  instructions?: string;
  servings?: number;
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
