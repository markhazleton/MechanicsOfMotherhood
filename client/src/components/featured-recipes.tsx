import { useQuery } from "@tanstack/react-query";
import { Clock, Users, TrendingUp, Star, ArrowRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "./loading-spinner";
import type { Recipe, Category } from "@shared/schema";

export default function FeaturedRecipes() {
  const { data: featuredContent, isLoading } = useQuery({
    queryKey: ["/api/featured-content"],
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["/api/categories"],
  });

  const categories = categoriesData?.categories || [];
  const recipes = featuredContent?.recipes || [];

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return <TrendingUp size={14} />;
      case "medium": return <TrendingUp size={14} />;
      case "hard": return <TrendingUp size={14} />;
      default: return <TrendingUp size={14} />;
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c: Category) => c.name === categoryName);
    return category?.color || "#38B2AC";
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  return (
    <section id="recipes" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Settings className="text-tool-gray text-2xl mr-3" />
            <h2 className="font-industrial text-3xl md:text-4xl font-bold text-industrial-blue">
              MoM's Kitchen Workshop
            </h2>
            <Settings className="text-tool-gray text-2xl ml-3" />
          </div>
          <p className="text-tool-gray text-lg max-w-2xl mx-auto">
            Precision-engineered recipes for the modern working mother. Every dish tested, timed, and perfected.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category: Category) => (
            <Button
              key={category.id}
              variant="outline"
              className="bg-kitchen-warm hover:bg-energetic-orange hover:text-white text-tool-gray px-6 py-3 rounded-full font-medium transition-all duration-300 border border-medium-gray"
              style={{ '--hover-bg': category.color } as React.CSSProperties}
              data-testid={`category-button-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Clock size={16} className="mr-2" />
              {category.name} ({category.recipeCount})
            </Button>
          ))}
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe: Recipe) => (
            <Card key={recipe.id} className="gear-border bg-white rounded-xl overflow-hidden mechanical-shadow hover:transform hover:scale-105 transition-all duration-300" data-testid={`recipe-card-${recipe.id}`}>
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    className="text-white px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: getCategoryColor(recipe.category) }}
                  >
                    <Clock size={14} className="mr-1" />
                    {recipe.prepTime + recipe.cookTime} MIN
                  </Badge>
                  <div className="flex items-center text-energetic-orange">
                    <Star size={14} fill="currentColor" />
                    <span className="ml-1 text-sm font-semibold">{recipe.rating}</span>
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2 text-industrial-blue" data-testid={`recipe-title-${recipe.id}`}>
                  {recipe.title}
                </h3>
                <p className="text-tool-gray mb-4">
                  {recipe.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-tool-gray">
                    <span className="flex items-center">
                      <Users size={14} className="mr-1" />
                      {recipe.servings} servings
                    </span>
                    <span className="flex items-center">
                      {getDifficultyIcon(recipe.difficulty)}
                      <span className="ml-1 capitalize">{recipe.difficulty}</span>
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-energetic-orange hover:text-red-600 font-semibold"
                    data-testid={`button-build-recipe-${recipe.id}`}
                  >
                    <ArrowRight size={16} className="mr-1" />
                    Build It
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="gear-border bg-white hover:bg-gray-50 text-tool-gray px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            data-testid="button-browse-workshop-manual"
          >
            <Settings className="mr-2" size={20} />
            Browse Full Workshop Manual
          </Button>
        </div>
      </div>
    </section>
  );
}
