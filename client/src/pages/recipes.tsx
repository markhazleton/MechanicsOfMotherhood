import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Search, Filter, Users, Star, ArrowRight } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import MarkdownContent from "@/components/markdown-content";
import SeoHead from "@/components/seo/SeoHead";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRecipes, getCategories, searchRecipes, getRecipeUrl } from "@/data/api-loader";
import { getRecipeImageUrl, getRecipeImageAlt } from "@/utils/image-helpers";
import { generateCanonicalUrl, generateBreadcrumbs } from "@/utils/seo-helpers";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { Recipe } from "@/data/api-types";

export default function Recipes() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [, navigate] = useLocation();
  
  // Initialize analytics
  const analytics = useAnalytics();

  // Use direct static data access instead of React Query
  const allRecipes = getRecipes();
  const categories = getCategories();

  // Filter recipes based on search and category
  let filteredRecipes = allRecipes || [];
  
  if (activeSearch) {
    filteredRecipes = searchRecipes(activeSearch);
  }
  
  if (selectedCategory) {
    const categoryId = parseInt(selectedCategory);
    filteredRecipes = filteredRecipes.filter(recipe => recipe.recipeCategoryID === categoryId);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
    
    // Track search event
    if (searchQuery.trim()) {
      analytics.trackSearch(searchQuery, filteredRecipes.length, 'global');
    }
  };

  // SEO data
  const currentUrl = generateCanonicalUrl('/recipes');
  const breadcrumbs = generateBreadcrumbs('/recipes');
  const recipeCount = filteredRecipes?.length || 0;
  
  const pageDescription = activeSearch 
    ? `Search results for "${activeSearch}" - ${recipeCount} recipes found. Find tested recipes, kitchen tools, and meal planning solutions.`
    : `Browse our collection of ${recipeCount}+ tested recipes for working mothers. Quick meals, family favorites, and kitchen organization tips.`;

  return (
  <div className="min-h-screen bg-white">
      {/* SEO Head */}
      <SeoHead
        title={activeSearch ? `Search: ${activeSearch} - Recipe Manual` : 'Recipe Manual - Tested Recipes for Working Mothers'}
        description={pageDescription}
        keywords={[
          'recipe collection',
          'family recipes',
          'tested recipes',
          'working mother meals',
          'quick dinner ideas',
          'meal planning recipes',
          'kitchen tested',
          'easy family cooking'
        ]}
        url={currentUrl}
        type="website"
      />
      
      <Navigation />
      
      {/* Breadcrumb Navigation */}
  <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>
      
      {/* Header */}
  <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-blue-900 mb-4">
              Recipe Manual
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Your complete collection of tested, perfected recipes for working mothers
            </p>
            {activeSearch && (
              <div className="mt-4 text-center">
                <span className="text-teal-600 font-semibold">
                  Showing results for "{activeSearch}"
                </span>
                <button 
                  onClick={() => {
                    setActiveSearch("");
                    setSearchQuery("");
                  }}
                  className="ml-2 text-orange-500 hover:underline text-sm"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="recipe-search-input"
                />
              </div>
            </form>

            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                data-testid="category-filter"
                title="Filter recipes by category"
              >
                <option value="">All Categories</option>
                {(categories || []).map((category: any) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Browse Categories Link */}
              <Link href="/categories">
                <Button
                  variant="outline"
                  className="px-4 py-2 border border-teal-500 text-teal-600 hover:bg-teal-500 hover:text-white"
                  data-testid="browse-categories-button"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe: Recipe) => (
              <Card key={recipe.id} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg motion-safe:hover:scale-[1.02] motion-safe:transform transition-all duration-300 border border-slate-100" data-testid={`recipe-card-${recipe.id}`}>
                <img
                  src={getRecipeImageUrl(recipe)}
                  alt={getRecipeImageAlt(recipe)}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-4">
                  <div className="flex items-center justify-end mb-2">
                    <div className="flex items-center text-orange-500" aria-label="Recipe rating">
                      <Star size={12} fill="currentColor" />
                      <span className="ml-1 text-xs">{recipe.averageRating || 5}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-blue-900 line-clamp-2">
                    {recipe.name}
                  </h3>
                  <div className="text-gray-600 text-sm mb-3 line-clamp-2">
                    <MarkdownContent 
                      content={recipe.description || ''}
                      summary={true}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Users size={12} className="mr-1" />
                      {recipe.servings}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-500 hover:text-orange-600 p-0 h-auto"
                      onClick={() => {
                        analytics.trackButtonClick('view_recipe', 'recipes_grid', {
                          recipe_id: recipe.id,
                          recipe_name: recipe.name,
                          recipe_category: recipe.recipeCategory?.name
                        });
                        navigate(getRecipeUrl(recipe));
                      }}
                      data-testid={`view-recipe-${recipe.id}`}
                    >
                      <ArrowRight size={14} className="mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Show results count */}
          <div className="text-center mt-8 text-gray-500">
            Showing {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
            {activeSearch && ` for "${activeSearch}"`}
            {selectedCategory && ` in ${categories?.find(c => c.id.toString() === selectedCategory)?.name}`}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
