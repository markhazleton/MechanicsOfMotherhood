import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Search, ArrowLeft, Users, Star, ArrowRight } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import LoadingSpinner from "@/components/loading-spinner";
import MarkdownContent from "@/components/markdown-content";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRecipesByCategory, getCategoryBySlug, getRecipeUrl } from "@/data/api-loader";
import { getRecipeImageUrl, getRecipeImageAlt } from "@/utils/image-helpers";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { Recipe, ApiData } from "@/data/api-types";
import { nameToSlug, getCategorySlug } from "@/utils/slugify";

interface RecipeResponse {
  data: Recipe[];
  message: string;
  success: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    total: number;
  };
}

export default function CategoryRecipes() {
  const [, params] = useRoute("/recipes/category/:categorySlug");
  const categorySlug = params?.categorySlug;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Initialize analytics
  const analytics = useAnalytics();

  // Get category details
  const { data: apiData } = useQuery<ApiData>({
    queryKey: ["api-data"],
  });

  const categories = apiData?.categories || [];
  // Find category by matching both basic slug and enhanced slug
  const currentCategory = categories.find((cat: any) => 
    getCategorySlug(cat.name) === categorySlug || nameToSlug(cat.name) === categorySlug
  );
  const categoryId = currentCategory?.id;

  // Get recipes for this category using RecipeSpark API
  const { data: recipesResponse, isLoading } = useQuery<RecipeResponse>({
    queryKey: [`/api/recipespark/recipes?categoryId=${categoryId}&pageNumber=${page}&pageSize=12`],
    enabled: !!categoryId,
  });

  const recipes = recipesResponse?.data || [];
  const totalRecipes = recipes.length;
  const pagination = recipesResponse?.pagination || {
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
    total: totalRecipes,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Track category search
    if (searchQuery.trim()) {
      analytics.trackSearch(searchQuery, recipes.length, 'category');
    }
    // TODO: Implement search functionality
    console.log("Search:", searchQuery);
  };

  // Track category view when data loads
  useEffect(() => {
    if (currentCategory && !isLoading) {
      analytics.trackCategoryView(
        currentCategory.name,
        categorySlug || '',
        totalRecipes
      );
    }
  }, [currentCategory, isLoading, analytics, categorySlug, totalRecipes]);

  if (isLoading && !recipes.length) {
    return (
      <div className="min-h-screen bg-light-gray">
        <Navigation />
        <div className="py-16">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  // Handle case where category doesn't exist
  if (!isLoading && categorySlug && !currentCategory) {
    return (
      <div className="min-h-screen bg-light-gray">
        <Navigation />
        <section className="bg-white py-12 border-b border-medium-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔧</div>
              <h1 className="text-3xl font-bold text-industrial-blue mb-4">
                Category Not Found
              </h1>
              <p className="text-tool-gray mb-6">
                The category "{categorySlug}" doesn't exist in our workshop.
              </p>
              <div className="space-x-4">
                <Link href="/categories">
                  <Button className="bg-workshop-teal text-white hover:bg-workshop-teal/90">
                    Browse All Categories
                  </Button>
                </Link>
                <Link href="/recipes">
                  <Button variant="outline">
                    View All Recipes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <Navigation />
      
      {/* Header */}
      <section className="bg-white py-12 border-b border-medium-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/categories">
              <Button variant="ghost" className="mb-4 text-tool-gray hover:text-industrial-blue">
                <ArrowLeft size={16} className="mr-2" />
                Back to Categories
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="font-mechanical text-4xl font-bold text-industrial-blue mb-4">
              {currentCategory?.name || 'Category'} Recipes
            </h1>
            {currentCategory?.description && (
              <p className="text-tool-gray text-lg max-w-2xl mx-auto">
                {currentCategory.description}
              </p>
            )}
          </div>

          {/* Search */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tool-gray" size={16} />
                <Input
                  type="text"
                  placeholder="Search recipes in this category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="category-recipe-search-input"
                />
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <LoadingSpinner />
          ) : recipes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe: Recipe) => (
                  <Card key={recipe.id} className="gear-border bg-white rounded-xl overflow-hidden mechanical-shadow hover:transform hover:scale-105 transition-all duration-300" data-testid={`recipe-card-${recipe.id}`}>
                    <img
                      src={getRecipeImageUrl(recipe)}
                      alt={getRecipeImageAlt(recipe)}
                      className="w-full h-40 object-cover"
                    />
                    <CardContent className="p-4">
                      <div className="flex items-center justify-end mb-2">
                        <div className="flex items-center text-energetic-orange" aria-label="Recipe rating">
                          <Star size={12} fill="currentColor" />
                          <span className="ml-1 text-xs">{recipe.averageRating ?? '–'}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-industrial-blue line-clamp-2">
                        {recipe.name}
                      </h3>
                      <div className="text-tool-gray text-sm mb-3 line-clamp-2">
                        <MarkdownContent 
                          content={recipe.description || ''}
                          summary={true}
                          className="text-sm"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-tool-gray">
                        <span className="flex items-center">
                          <Users size={12} className="mr-1" />
                          {recipe.servings}
                        </span>
                        <Link href={getRecipeUrl(recipe)}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-energetic-orange hover:text-red-600 p-0 h-auto"
                            data-testid={`view-recipe-${recipe.id}`}
                          >
                            <ArrowRight size={14} className="mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && (pagination.totalPages > 1) && (
                <div className="flex items-center justify-center space-x-4 mt-12">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrevious}
                    onClick={() => setPage(page - 1)}
                    data-testid="pagination-prev"
                  >
                    Previous
                  </Button>
                  <span className="text-tool-gray">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!pagination.hasNext}
                    onClick={() => setPage(page + 1)}
                    data-testid="pagination-next"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-industrial-blue mb-2">
                No Recipes Found
              </h3>
              <p className="text-tool-gray mb-6">
                We don't have any recipes in this category yet.
              </p>
              <Link href="/recipes">
                <Button className="bg-workshop-teal text-white hover:bg-workshop-teal/90">
                  Browse All Recipes
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}