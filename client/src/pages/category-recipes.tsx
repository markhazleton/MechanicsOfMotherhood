import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Search, ArrowLeft, ArrowRight, SearchX, CircleHelp } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import PageHeader from "@/components/page-header";
import RecipeCard from "@/components/recipe-card";
import SeoHead from "@/components/seo/SeoHead";
import { generateBreadcrumbs, generateCanonicalUrl, generateItemListStructuredData } from "@/utils/seo-helpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCategories, getRecipeUrl, getRecipesByCategory } from "@/data/api-loader";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { Recipe, Category } from "@/data/api-types";
import { nameToSlug, getCategorySlug } from "@/utils/slugify";

export default function CategoryRecipes() {
  const [, paramsNoSlash] = useRoute("/recipes/category/:categorySlug");
  const [, paramsWithSlash] = useRoute("/recipes/category/:categorySlug/");
  const categorySlug = paramsNoSlash?.categorySlug || paramsWithSlash?.categorySlug;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize analytics
  const analytics = useAnalytics();

  // Get category details using static data
  const categories = getCategories();

  // Find category by matching both basic slug and enhanced slug
  const currentCategory = categories.find((cat: Category) =>
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
  const currentPath = categorySlug ? `/recipes/category/${categorySlug}/` : "/recipes/";
  const currentUrl = generateCanonicalUrl(currentPath);
  const categoryStructuredData = currentCategory
    ? generateItemListStructuredData(
        filteredRecipes.slice(0, 50).map((recipe) => ({
          name: recipe.name,
          url: generateCanonicalUrl(getRecipeUrl(recipe)),
        })),
        `${currentCategory.name} Recipes`
      )
    : undefined;

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

  const backLink = (
    <Button asChild variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
      <Link href="/categories/">
        <ArrowLeft aria-hidden="true" />
        All categories
      </Link>
    </Button>
  );

  // Handle case where category doesn't exist
  if (!categorySlug || !currentCategory) {
    return (
      <div className="min-h-screen bg-background">
        <SeoHead
          title="Category Not Found"
          description="The requested recipe category could not be found."
          url={generateCanonicalUrl("/404")}
          robots="noindex, nofollow"
        />
        <Navigation />
        <PageHeader
          breadcrumbs={generateBreadcrumbs('/categories')}
          before={
            <span className="grid size-14 place-items-center rounded-md bg-primary-soft text-primary-ink">
              <CircleHelp size={26} aria-hidden="true" />
            </span>
          }
          eyebrow="Category not found"
          title="We couldn't find that category"
          description={`The category "${categorySlug}" doesn't exist in our home kitchen.`}
        >
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/categories/">Browse all categories</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/recipes/">View all recipes</Link>
            </Button>
          </div>
        </PageHeader>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={`${currentCategory.name} Recipes`}
        description={
          searchQuery.trim()
            ? `${totalRecipes} ${currentCategory.name.toLowerCase()} recipes match "${searchQuery.trim()}".`
            : `Browse ${totalRecipes} ${currentCategory.name.toLowerCase()} recipes for family-friendly meals.`
        }
        url={currentUrl}
        keywords={[
          `${currentCategory.name.toLowerCase()} recipes`,
          "family recipes",
          "easy meal ideas",
          "recipe collection",
        ]}
        structuredData={categoryStructuredData}
      />
      <Navigation />

      <PageHeader
        breadcrumbs={generateBreadcrumbs(`/recipes/category/${categorySlug}/`, undefined, currentCategory?.name)}
        before={backLink}
        eyebrow={`${allCategoryRecipes.length} recipe${allCategoryRecipes.length !== 1 ? 's' : ''}`}
        title={`${currentCategory?.name || 'Category'} recipes`}
        description={currentCategory?.description || undefined}
      >
        <form onSubmit={handleSearch} className="max-w-md" role="search">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
            <Input
              type="search"
              aria-label={`Search ${currentCategory.name} recipes`}
              placeholder="Search recipes in this category…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="pl-10"
              data-testid="category-recipe-search-input"
            />
          </div>
        </form>
      </PageHeader>

      {/* Recipes Grid */}
      <section className="py-10 md:py-14">
        <div className="site-container">
          {recipes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recipes.map((recipe: Recipe, index: number) => (
                  <RecipeCard key={recipe.id} recipe={recipe} showCategory={false} priority={index < 4} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrevious}
                    onClick={() => setPage(page - 1)}
                    data-testid="pagination-prev"
                  >
                    <ArrowLeft aria-hidden="true" />
                    Previous
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    Page <span className="text-foreground">{pagination.currentPage}</span> of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!pagination.hasNext}
                    onClick={() => setPage(page + 1)}
                    data-testid="pagination-next"
                  >
                    Next
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </nav>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-border bg-card px-6 py-14 text-center shadow-sm">
              <span className="mx-auto mb-5 grid size-14 place-items-center rounded-md bg-primary-soft text-primary-ink">
                <SearchX size={26} aria-hidden="true" />
              </span>
              <h2 className="font-display text-xl font-bold text-foreground">
                No recipes found
              </h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                {searchQuery
                  ? "Nothing in this category matches that search. Try another term."
                  : "We don't have any recipes in this category yet."}
              </p>
              <Button asChild className="mt-6">
                <Link href="/recipes/">Browse all recipes</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
