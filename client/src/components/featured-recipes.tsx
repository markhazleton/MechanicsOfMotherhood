import { Users, Clock, Star, ArrowRight, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MarkdownContent from "./markdown-content";
import { Link, useLocation } from "wouter";
import { getFeaturedRecipes, getCategories, getRecipeUrl } from "@/data/api-loader";
import { getRecipeImageUrl, getRecipeImageAlt } from "@/utils/image-helpers";
import { getCategorySlug } from "@/utils/slugify";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { Recipe, Category } from "@/data/api-types";

export default function FeaturedRecipes() {
  const [, navigate] = useLocation();
  const analytics = useAnalytics();

  // Use static data directly without React Query
  const featuredContent = getFeaturedRecipes(6);
  const categoriesData = getCategories();

  const categories = categoriesData || [];
  const recipes = featuredContent || [];

  return (
    <section id="recipes" className="py-16 md:py-20 bg-muted/30 dark:bg-muted/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Recipes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our most popular family-tested recipes. Quick to make, delicious to eat.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
          {categories.slice(0, 6).map((category: Category) => (
            <Button
              key={category.id}
              variant="outline"
              className="px-4 py-2 rounded-full text-sm font-medium border-border hover:bg-accent-50 hover:text-accent-700 hover:border-accent-300 dark:hover:bg-accent-900/30 dark:hover:text-accent-300 transition-all"
              data-testid={`category-button-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => navigate(`/recipes/category/${getCategorySlug(category.name)}`)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe: Recipe) => (
            <Link key={recipe.id} href={getRecipeUrl(recipe)}>
              <Card className="group h-full bg-card rounded-xl overflow-hidden border border-border hover:border-accent-300 dark:hover:border-accent-700 hover:shadow-lg transition-all duration-200 cursor-pointer" data-testid={`recipe-card-${recipe.id}`}>
                <div className="relative">
                  <img
                    src={getRecipeImageUrl(recipe)}
                    alt={getRecipeImageAlt(recipe)}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm font-medium">
                    <Star size={14} fill="currentColor" className="text-yellow-400" />
                    <span>{recipe.averageRating ?? '5.0'}</span>
                  </div>
                  {/* Category badge */}
                  {recipe.recipeCategory?.name && (
                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-xs font-medium">
                      {recipe.recipeCategory.name}
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors line-clamp-2" data-testid={`recipe-title-${recipe.id}`}>
                    {recipe.name}
                  </h3>
                  <div className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    <MarkdownContent
                      content={recipe.description || "A delicious family recipe"}
                      summary={true}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {recipe.servings ?? '4'}
                      </span>
                    </div>
                    <span className="text-accent-600 dark:text-accent-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Recipe
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="px-8 py-6 rounded-xl font-semibold text-lg bg-accent-600 hover:bg-accent-700 text-white shadow-lg shadow-accent-500/25 transition-all"
            data-testid="button-browse-all-recipes"
            onClick={() => {
              analytics.trackButtonClick('browse_all_recipes', 'featured_recipes', {
                source: 'homepage'
              });
              navigate("/recipes");
            }}
          >
            <ChefHat className="mr-2" size={20} />
            View All Recipes
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
