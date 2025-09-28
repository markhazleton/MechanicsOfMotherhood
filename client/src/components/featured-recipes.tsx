import { Users, TrendingUp, Star, ArrowRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  // Difficulty removed – not supplied by API. Retained helper placeholder if reinstated later.
  const getDifficultyIcon = () => <TrendingUp size={14} className="opacity-0" />; // visually nothing

  const getCategoryColor = (categoryName: string) => {
    return "#38B2AC"; // Default teal color since API doesn't have color field
  };

  return (
  <section id="recipes" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Settings className="text-teal-600 text-2xl mr-3" />
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-blue-900">
              MoM's Kitchen Workshop
            </h2>
            <Settings className="text-teal-600 text-2xl ml-3" />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Precision-engineered recipes for the modern working mother. Every dish tested, timed, and perfected.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category: Category) => (
            <Button
              key={category.id}
              variant="outline"
              className="bg-orange-50 hover:bg-orange-500 hover:text-white text-gray-700 px-6 py-3 rounded-full font-medium transition-all duration-300 border border-orange-200"
              data-testid={`category-button-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => navigate(`/recipes/category/${getCategorySlug(category.name)}`)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe: Recipe) => (
            <Card key={recipe.id} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg motion-safe:hover:scale-[1.02] motion-safe:transform transition-all duration-300 border border-slate-100" data-testid={`recipe-card-${recipe.id}`}>
              <img
                src={getRecipeImageUrl(recipe)}
                alt={getRecipeImageAlt(recipe)}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-end mb-3">
                  <div className="flex items-center text-orange-500" aria-label="Recipe rating">
                    <Star size={14} fill="currentColor" />
                    <span className="ml-1 text-sm font-semibold">{recipe.averageRating ?? '–'}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-xl mb-2 text-blue-900" data-testid={`recipe-title-${recipe.id}`}>
                  {recipe.name}
                </h3>
                <div className="text-gray-600 mb-4">
                  <MarkdownContent 
                    content={recipe.description || "Delicious recipe from MoM's kitchen workshop"}
                    summary={true}
                    className="text-sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="flex items-center">
                      <Users size={14} className="mr-1" />
                      {recipe.servings ?? '–'}{recipe.servings ? ' servings' : ''}
                    </span>
                  </div>
                  <Link href={getRecipeUrl(recipe)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-500 hover:text-orange-600 font-semibold"
                      onClick={() => {
                        analytics.trackButtonClick('build_recipe', 'featured_recipes', {
                          recipe_id: recipe.id,
                          recipe_name: recipe.name,
                          recipe_category: recipe.recipeCategory?.name
                        });
                      }}
                      data-testid={`button-build-recipe-${recipe.id}`}
                    >
                      <ArrowRight size={16} className="mr-1" />
                      Build It
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="bg-white hover:bg-slate-50 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all border border-slate-200 shadow-sm"
            data-testid="button-browse-workshop-manual"
            onClick={() => {
              analytics.trackButtonClick('browse_full_manual', 'featured_recipes', {
                source: 'homepage'
              });
              navigate("/recipes");
            }}
          >
            <Settings className="mr-2" size={20} />
            Browse Full Workshop Manual
          </Button>
        </div>
      </div>
    </section>
  );
}
