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
  <div className="min-h-screen bg-warm-cream">
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
  <div className="bg-white/50 border-b border-warm-peach/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>

      {/* Header */}
  <section className="bg-gradient-to-b from-warm-peach/20 to-transparent py-16 border-b border-warm-peach/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-display heading-xl text-brand-800 mb-4">
              Recipe Manual
            </h1>
            <p className="text-neutral-700 text-lg max-w-2xl mx-auto">
              Your complete collection of tested, perfected recipes for working mothers
            </p>
            {activeSearch && (
              <div className="mt-4 text-center">
                <span className="text-brand-600 font-semibold">
                  Showing results for "{activeSearch}"
                </span>
                <button 
                  onClick={() => {
                    setActiveSearch("");
                    setSearchQuery("");
                  }}
                  className="ml-2 text-accent-600 hover:underline text-sm"
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
                className="px-4 py-2 border-2 border-warm-peach/50 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 bg-white text-neutral-800 font-semibold shadow-sm hover:border-accent-300 transition-colors"
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
                  variant="outlineBrand"
                  className="px-4 py-2"
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
      <section className="py-16 bg-warm-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe: Recipe) => (
              <Card key={recipe.id} className="overflow-hidden group cursor-pointer motion-safe:hover:scale-[1.02] motion-safe:transform transition-all duration-300" data-testid={`recipe-card-${recipe.id}`}>
                <img
                  src={getRecipeImageUrl(recipe)}
                  alt={getRecipeImageAlt(recipe)}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-5">
                  <div className="flex items-center justify-end mb-2">
                    <div className="flex items-center text-accent-500" aria-label="Recipe rating">
                      <Star size={14} fill="currentColor" />
                      <span className="ml-1 text-xs font-semibold">{recipe.averageRating || 5}/5</span>
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-brand-800 line-clamp-2 group-hover:text-accent-600 transition-colors">
                    {recipe.name}
                  </h3>
                  <div className="text-neutral-700 text-sm mb-4 line-clamp-2">
                    <MarkdownContent
                      content={recipe.description || ''}
                      summary={true}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-warm-peach/30 pt-3">
                    <span className="flex items-center text-neutral-600 font-semibold">
                      <Users size={14} className="mr-1 text-accent-500" />
                      Serves {recipe.servings}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-accent-600 hover:text-accent-700 hover:bg-warm-peach/50 p-0 h-auto px-2 py-1 font-semibold"
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
                      View Recipe
                      <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Show results count */}
          <div className="text-center mt-8 text-muted-foreground">
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
