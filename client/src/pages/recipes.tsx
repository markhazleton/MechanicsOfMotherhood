import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, LayoutGrid, X, SearchX } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SeoHead from "@/components/seo/SeoHead";
import PageHeader from "@/components/page-header";
import RecipeCard from "@/components/recipe-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getRecipes, getCategories, searchRecipes } from "@/data/api-loader";
import { generateCanonicalUrl, generateBreadcrumbs } from "@/utils/seo-helpers";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { Recipe, Category } from "@/data/api-types";

export default function Recipes() {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState(() =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("search") || ""
      : ""
  );
  const [activeSearch, setActiveSearch] = useState(() =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("search") || ""
      : ""
  );
  
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchFromUrl = new URLSearchParams(window.location.search).get("search") || "";

    if (searchFromUrl !== activeSearch) {
      setActiveSearch(searchFromUrl);
      setSearchQuery(searchFromUrl);
    }
  }, [location, activeSearch]);

  const updateSearchInUrl = (query: string) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set("search", query);
    } else {
      url.searchParams.delete("search");
    }
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const nextSearch = searchQuery.trim();
    setActiveSearch(nextSearch);
    updateSearchInUrl(nextSearch);
    
    // Track search event
    if (nextSearch) {
      analytics.trackSearch(nextSearch, searchRecipes(nextSearch).length, 'global');
    }
  };

  // SEO data
  const currentUrl = generateCanonicalUrl('/recipes');
  const breadcrumbs = generateBreadcrumbs('/recipes');
  const recipeCount = filteredRecipes?.length || 0;
  
  const pageDescription = activeSearch 
    ? `Search results for "${activeSearch}" - ${recipeCount} recipes found. Tested recipes and meal planning solutions for busy families.`
    : `Browse our collection of ${recipeCount}+ tested recipes for working mothers. Quick meals, family favorites, and easy meal planning.`;

  const clearSearch = () => {
    setActiveSearch("");
    setSearchQuery("");
    updateSearchInUrl("");
  };

  const selectedCategoryName = categories?.find(c => c.id.toString() === selectedCategory)?.name;

  return (
    <div className="min-h-screen bg-background">
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

      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Recipe collection"
        title="All recipes"
        description="Browse our collection of family-tested recipes — search by name or ingredient, or narrow it down by category."
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <form onSubmit={handleSearch} className="w-full lg:max-w-md" role="search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
              <Input
                type="search"
                aria-label="Search recipes"
                placeholder="Search recipes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="recipe-search-input"
              />
            </div>
          </form>

          <div className="flex flex-wrap gap-3">
            <label className="sr-only" htmlFor="category-filter">Filter by category</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-11 rounded-md border border-input bg-card px-3.5 pr-9 text-[15px] font-medium text-foreground shadow-xs transition-[border-color,box-shadow] duration-[120ms] focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              data-testid="category-filter"
              title="Filter recipes by category"
            >
              <option value="">All categories</option>
              {(categories || []).map((category: Category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>

            <Button asChild variant="outline" className="h-11" data-testid="browse-categories-button">
              <Link href="/categories/">
                <LayoutGrid aria-hidden="true" />
                Browse categories
              </Link>
            </Button>
          </div>
        </div>
      </PageHeader>

      {/* Recipes Grid */}
      <section className="py-10 md:py-14" aria-labelledby="recipe-results-heading">
        <div className="site-container">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 id="recipe-results-heading" className="text-[15px] font-sans font-medium tracking-normal text-muted-foreground" aria-live="polite">
              Showing <span className="font-semibold text-foreground">{filteredRecipes.length}</span> recipe{filteredRecipes.length !== 1 ? 's' : ''}
              {activeSearch && <> for “<span className="font-semibold text-foreground">{activeSearch}</span>”</>}
              {selectedCategoryName && <> in <span className="font-semibold text-foreground">{selectedCategoryName}</span></>}
            </h2>
            {activeSearch && (
              <Button variant="ghost" size="sm" onClick={clearSearch}>
                <X aria-hidden="true" />
                Clear search
              </Button>
            )}
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRecipes.map((recipe: Recipe, index: number) => (
                <RecipeCard key={recipe.id} recipe={recipe} priority={index < 4} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card px-6 py-14 text-center shadow-sm">
              <span className="mx-auto mb-5 grid size-14 place-items-center rounded-md bg-primary-soft text-primary-ink">
                <SearchX size={26} aria-hidden="true" />
              </span>
              <h3 className="font-display text-xl font-bold text-foreground">No recipes found</h3>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Try a different search term or category, or browse the full collection.
              </p>
              <Button className="mt-6" onClick={() => { clearSearch(); setSelectedCategory(""); }}>
                Show all recipes
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
