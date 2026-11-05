import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/recipe-card";
import { getFeaturedRecipes, getCategories } from "@/data/api-loader";
import { getCategorySlug } from "@/utils/slugify";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { Recipe, Category } from "@/data/api-types";

export default function FeaturedRecipes() {
  const analytics = useAnalytics();

  // Static data (bundled at build time)
  const recipes = getFeaturedRecipes(6) || [];
  const categories = getCategories() || [];

  return (
    <section id="recipes" className="section-y bg-background">
      <div className="site-container">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">Featured</p>
            <h2 className="font-display text-[clamp(1.75rem,2vw+1rem,2.5rem)] font-bold leading-tight text-foreground">
              Family favorites, tested and ready
            </h2>
            <p className="mt-4 max-w-[56ch] text-lg text-muted-foreground">
              Our most popular family-tested recipes. Quick to make, delicious to eat.
            </p>
          </div>
          <Button
            asChild
            variant="outlineBrand"
            className="self-start md:self-auto"
            data-testid="button-browse-all-recipes"
            onClick={() =>
              analytics.trackButtonClick('browse_all_recipes', 'featured_recipes', {
                source: 'homepage'
              })
            }
          >
            <Link href="/recipes/">
              View all recipes
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {/* Category shortcuts */}
        <nav aria-label="Popular categories" className="mb-10 flex flex-wrap gap-2">
          {categories.slice(0, 6).map((category: Category) => (
            <Link
              key={category.id}
              href={`/recipes/category/${getCategorySlug(category.name)}/`}
              className="rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium text-body transition-colors duration-[120ms] hover:border-primary hover:text-primary-ink"
              data-testid={`category-button-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe: Recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
}
