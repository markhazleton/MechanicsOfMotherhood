import { useState } from "react";
import { Link } from "wouter";
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
import type { Recipe, Category } from "@/data/api-types";

export default function Recipes() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  
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
    ? `Search results for "${activeSearch}" - ${recipeCount} recipes found. Tested recipes and meal planning solutions for busy families.`
    : `Browse our collection of ${recipeCount}+ tested recipes for working mothers. Quick meals, family favorites, and easy meal planning.`;

  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* SEO Head */}
      <SeoHead
        title={activeSearch ? `Search: ${activeSearch} - Recipes` : 'Recipes - Family Favorites'}
        description={pageDescription}
        keywords={[
          'recipe collection',
          'family recipes',
          'tested recipes',
          'quick dinner ideas',
          'meal planning recipes',
          'easy family cooking'
        ]}
        url={currentUrl}
        type="website"
      />

      <Navigation />

      {/* Breadcrumb Navigation */}
      <div className="bg-muted/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-b from-accent-50/50 dark:from-accent-950/20 to-transparent py-12 md:py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              All Recipes
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse our collection of family-tested recipes
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
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearch} className="flex-1 max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                  data-testid="recipe-search-input"
                />
              </div>
            </form>

            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 bg-background text-foreground font-medium shadow-sm transition-colors"
                data-testid="category-filter"
                title="Filter recipes by category"
              >
                <option value="">All Categories</option>
                {(categories || []).map((category: Category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Browse Categories Link */}
              <Link href="/categories">
                <Button
                  variant="outline"
                  className="px-4 py-2"
                  data-testid="browse-categories-button"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe: Recipe) => (
              <Link key={recipe.id} href={getRecipeUrl(recipe)}>
                <Card className="h-full overflow-hidden group cursor-pointer hover:border-accent-300 dark:hover:border-accent-700 transition-all duration-200" data-testid={`recipe-card-${recipe.id}`}>
                  <div className="relative">
                    <img
                      src={getRecipeImageUrl(recipe)}
                      alt={getRecipeImageAlt(recipe)}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                      <Star size={12} fill="currentColor" className="text-yellow-400" />
                      <span>{recipe.averageRating || 5}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base mb-2 text-foreground line-clamp-2 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                      {recipe.name}
                    </h3>
                    <div className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      <MarkdownContent
                        content={recipe.description || ''}
                        summary={true}
                        className="text-sm"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-border pt-3">
                      <span className="flex items-center text-muted-foreground font-medium">
                        <Users size={14} className="mr-1" />
                        Serves {recipe.servings}
                      </span>
                      <span className="text-accent-600 dark:text-accent-400 font-medium flex items-center gap-1">
                        View
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Show results count */}
          <div className="text-center mt-10 text-muted-foreground">
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
