import { Link } from "wouter";
import { ArrowRight, ChefHat } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import PageHeader from "@/components/page-header";
import SeoHead from "@/components/seo/SeoHead";
import { generateBreadcrumbs, generateCanonicalUrl, generateItemListStructuredData } from "@/utils/seo-helpers";
import { Badge } from "@/components/ui/badge";
import { getCategorySlug } from "@/utils/slugify";
import { getCategories, getRecipes } from "@/data/api-loader";
import type { Category } from "@/data/api-types";

export default function Categories() {
  const categories = getCategories();
  const recipes = getRecipes();

  // Calculate recipe counts for each category
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    recipeCount: recipes.filter(recipe => recipe.recipeCategoryID === category.id).length
  }));

  const breadcrumbs = generateBreadcrumbs('/categories');
  const currentUrl = generateCanonicalUrl('/categories');
  const structuredData = generateItemListStructuredData(
    categoriesWithCounts.map((category) => ({
      name: category.name,
      url: generateCanonicalUrl(`/recipes/category/${getCategorySlug(category.name)}/`),
    })),
    "Recipe Categories"
  );

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Recipe Categories"
        description={`Browse ${categoriesWithCounts.length} recipe categories and discover family-tested meals by topic.`}
        url={currentUrl}
        keywords={["recipe categories", "meal categories", "family recipe index", "browse recipes"]}
        structuredData={structuredData}
      />
      <Navigation />

      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Browse by category"
        title="Recipe categories"
        description="Our tested recipes, organized the way you plan meals — from quick weeknight dinners to slow-cooker Sundays."
      />

      {/* Categories Grid */}
      <section className="py-10 md:py-14">
        <div className="site-container">
          {categoriesWithCounts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoriesWithCounts.map((category: Category & { recipeCount: number }) => {
                const slug = getCategorySlug(category.name);
                return (
                  <Link
                    key={category.id}
                    href={`/recipes/category/${slug}/`}
                    className="group flex h-full flex-col rounded-lg border border-border border-t-[3px] border-t-primary bg-card p-6 shadow-sm transition-[box-shadow,transform] duration-200 ease-standard hover:-translate-y-0.5 hover:shadow-md"
                    data-testid={`category-card-${category.id}`}
                  >
                    <span className="mb-5 grid size-11 place-items-center rounded-md bg-primary-soft text-primary-ink">
                      <ChefHat size={22} aria-hidden="true" />
                    </span>
                    <h2 className="font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary-ink">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <Badge variant="accent">
                        {category.recipeCount} recipe{category.recipeCount !== 1 ? 's' : ''}
                      </Badge>
                      <ArrowRight
                        size={18}
                        className="text-link transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card px-6 py-14 text-center shadow-sm">
              <span className="mx-auto mb-5 grid size-14 place-items-center rounded-md bg-primary-soft text-primary-ink">
                <ChefHat size={26} aria-hidden="true" />
              </span>
              <h2 className="font-display text-xl font-bold text-foreground">
                No categories available
              </h2>
              <p className="mt-2 text-muted-foreground">
                Categories are being loaded from our recipe collection.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
