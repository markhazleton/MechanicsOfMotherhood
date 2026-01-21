import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Search, ArrowLeft, Users, Star, ArrowRight } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import { generateBreadcrumbs } from "@/utils/seo-helpers";
import MarkdownContent from "@/components/markdown-content";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRecipesByCategory, getRecipeUrl, getApiData } from "@/data/api-loader";
import { getRecipeImageUrl, getRecipeImageAlt } from "@/utils/image-helpers";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { Recipe } from "@/data/api-types";
import { nameToSlug, getCategorySlug } from "@/utils/slugify";

export default function CategoryRecipes() {
  const [, params] = useRoute("/recipes/category/:categorySlug");
  const categorySlug = params?.categorySlug;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Initialize analytics
  const analytics = useAnalytics();

  // Get category details using static data
  const apiData = getApiData();
  const categories = apiData?.categories || [];
  
  // Find category by matching both basic slug and enhanced slug
  const currentCategory = categories.find((cat: any) => 
    getCategorySlug(cat.name) === categorySlug || nameToSlug(cat.name) === categorySlug
  );
  const categoryId = currentCategory?.id;

  // Get recipes for this category using static data
  const allCategoryRecipes = categoryId ? getRecipesByCategory(categoryId) : [];
  
  // Apply pagination and search filters
  const pageSize = 12;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const filteredRecipes = searchQuery 
    ? allCategoryRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.description && recipe.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allCategoryRecipes;
  
  const recipes = filteredRecipes.slice(startIndex, endIndex);
  const totalRecipes = filteredRecipes.length;
  const totalPages = Math.ceil(totalRecipes / pageSize);
  
  const pagination = {
    currentPage: page,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
    total: totalRecipes,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on search
    // Track category search
    if (searchQuery.trim()) {
      analytics.trackSearch(searchQuery, filteredRecipes.length, 'category');
    }
  };

  // Track category view when data loads
  useEffect(() => {
    if (currentCategory) {
      analytics.trackCategoryView(
        currentCategory.name,
        categorySlug || '',
        totalRecipes
      );
    }
  }, [currentCategory, analytics, categorySlug, totalRecipes]);

  // Handle case where category doesn't exist
  if (!categorySlug || !currentCategory) {
    return (
  <div className="min-h-screen bg-warm-cream">
        <Navigation />
  <div className="bg-warm-cream border-b border-warm-peach/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <BreadcrumbNav items={generateBreadcrumbs('/categories')} />
          </div>
        </div>
  <section className="bg-gradient-to-b from-warm-peach/20 to-transparent py-16 border-b border-warm-peach/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔧</div>
              <h1 className="font-display heading-lg text-brand-800 mb-4">
                Category Not Found
              </h1>
              <p className="text-neutral-700 mb-6">
                The category "{categorySlug}" doesn't exist in our home kitchen.
              </p>
              <div className="space-x-4">
                <Link href="/categories">
                  <Button variant="brand">
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
  <div className="min-h-screen bg-warm-cream">
      <Navigation />
      {/* Breadcrumb Navigation */}
  <div className="bg-warm-cream border-b border-warm-peach/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <BreadcrumbNav items={generateBreadcrumbs(`/recipes/category/${categorySlug}`, undefined, currentCategory?.name)} />
        </div>
      </div>

      {/* Header */}
  <section className="bg-gradient-to-b from-warm-peach/20 to-transparent py-16 border-b border-warm-peach/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/categories">
              <Button variant="ghost" className="mb-4 text-neutral-700 hover:text-brand-800">
                <ArrowLeft size={16} className="mr-2" />
                Back to Categories
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display heading-xl text-brand-800 mb-4">
              {currentCategory?.name || 'Category'} Recipes
            </h1>
            {currentCategory?.description && (
              <p className="text-neutral-700 text-lg max-w-2xl mx-auto">
                {currentCategory.description}
              </p>
            )}
          </div>

          {/* Search */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={16} />
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
          {recipes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe: Recipe) => (
                  <Card key={recipe.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg motion-safe:hover:scale-[1.02] motion-safe:transform transition-all duration-300 border border-warm-peach/30" data-testid={`recipe-card-${recipe.id}`}>
                    <img
                      src={getRecipeImageUrl(recipe)}
                      alt={getRecipeImageAlt(recipe)}
                      className="w-full h-40 object-cover"
                    />
                    <CardContent className="p-5">
                      <div className="flex items-center justify-end mb-2">
                        <div className="flex items-center text-accent-600" aria-label="Recipe rating">
                          <Star size={12} fill="currentColor" />
                          <span className="ml-1 text-xs">{recipe.averageRating ?? '–'}</span>
                        </div>
                      </div>
                      <h3 className="font-display font-semibold text-lg mb-2 text-brand-800 line-clamp-2">
                        {recipe.name}
                      </h3>
                      <div className="text-neutral-700 text-sm mb-3 line-clamp-2">
                        <MarkdownContent
                          content={recipe.description || ''}
                          summary={true}
                          className="text-sm"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-neutral-700">
                        <span className="flex items-center">
                          <Users size={12} className="mr-1" />
                          {recipe.servings}
                        </span>
                        <Link href={getRecipeUrl(recipe)}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-accent-600 hover:text-accent-700 p-0 h-auto"
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
                  <span className="text-gray-600">
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
            <div className="text-center py-12 bg-white rounded-xl shadow-md border border-warm-peach/30">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-brand-800 mb-2">
                No Recipes Found
              </h3>
              <p className="text-neutral-700 mb-6">
                We don't have any recipes in this category yet.
              </p>
              <Link href="/recipes">
                <Button variant="brand">
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