import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Clock, Users, Star, ChefHat, ArrowLeft, BookOpen } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import LoadingSpinner from "@/components/loading-spinner";
import MarkdownContent from "@/components/markdown-content";
import SeoHead from "@/components/seo/SeoHead";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getRecipeBySlug } from "@/data/api-loader";
import { getRecipeImageUrl, getRecipeImageAlt } from "@/utils/image-helpers";
import { formatIngredientsAsHtml, formatInstructionsAsHtml } from "@/utils/markdown-helpers";
import { useRecipeAnalytics } from "@/hooks/useAnalytics";
import { 
  generateRecipeDescription, 
  generateRecipeKeywords, 
  generateRecipeImageUrl,
  generateCanonicalUrl,
  generateBreadcrumbs
} from "@/utils/seo-helpers";
import { generateRecipeStructuredData } from "@/components/seo/StructuredData";
import type { Recipe } from "@/data/api-types";

export default function RecipeDetail() {
  const { slug } = useParams();
  const [, navigate] = useLocation();

  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: [`recipe-${slug}`],
    queryFn: () => {
      if (!slug) throw new Error("No recipe slug provided");
      const foundRecipe = getRecipeBySlug(slug);
      if (!foundRecipe) throw new Error("Recipe not found");
      return foundRecipe;
    },
    enabled: !!slug,
  });

  // Initialize analytics for this recipe
  const analytics = useRecipeAnalytics(recipe);

  // Track recipe completion when user scrolls or navigates away
  const handleBackClick = () => {
    analytics.completeView();
    analytics.trackButtonClick('back_to_recipes', 'recipe_detail', {
      recipe_id: recipe?.id,
      recipe_name: recipe?.name
    });
    navigate("/recipes");
  };

  // Analytics event handlers for recipe sections
  const handleIngredientsView = () => {
    analytics.trackIngredientView();
  };

  const handleInstructionsView = () => {
    analytics.trackInstructionView();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gray">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-light-gray">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-mechanical text-3xl font-bold text-industrial-blue mb-4">
              Recipe Not Found
            </h1>
            <p className="text-tool-gray mb-8">
              The recipe you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/recipes")} className="bg-workshop-teal hover:bg-workshop-teal/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalTime = 60; // Default total time since API doesn't have prepTime/cookTime
  const difficultyColors: Record<string, string> = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800"
  };

  // Parse ingredients and instructions from API strings and format as HTML
  const ingredientsHtml = recipe?.ingredients ? formatIngredientsAsHtml(recipe.ingredients) : '';
  const instructionsHtml = recipe?.instructions ? formatInstructionsAsHtml(recipe.instructions) : '';
  const ingredientsList = recipe?.ingredients ? recipe.ingredients.split(/\r?\n/).filter(line => line.trim()) : [];
  const instructionsList = recipe?.instructions ? recipe.instructions.split(/\r?\n/).filter(line => line.trim()) : [];

  // SEO data generation
  const currentUrl = generateCanonicalUrl(`/recipe/${slug}`);
  const recipeDescription = generateRecipeDescription(recipe);
  const recipeKeywords = generateRecipeKeywords(recipe);
  const recipeImageUrl = generateRecipeImageUrl(recipe);
  const breadcrumbs = generateBreadcrumbs(`/recipe/${slug}`, recipe);
  const structuredData = generateRecipeStructuredData({
    recipe,
    url: currentUrl,
    imageUrl: recipeImageUrl
  });

  return (
    <div className="min-h-screen bg-light-gray">
      {/* SEO Head */}
      <SeoHead
        title={recipe.name}
        description={recipeDescription}
        keywords={recipeKeywords}
        image={recipeImageUrl}
        url={currentUrl}
        type="recipe"
        author={recipe.authorNM}
        publishedTime={recipe.lastViewDT}
        modifiedTime={recipe.modifiedDT}
        structuredData={structuredData}
      />
      
      <Navigation />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-medium-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative">
        <div className="h-96 bg-gradient-to-r from-industrial-blue/20 to-workshop-teal/20 relative overflow-hidden">
          <img
            src={getRecipeImageUrl(recipe)}
            alt={getRecipeImageAlt(recipe)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
            <Button
              onClick={handleBackClick}
              variant="secondary"
              className="mb-6 bg-white/90 hover:bg-white text-industrial-blue"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Button>
            
            <div className="text-white">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-workshop-teal text-white">
                  {recipe?.recipeCategory?.name || "Recipe"}
                </Badge>
                <Badge className={`${difficultyColors["easy"]}`}>
                  <ChefHat className="w-3 h-3 mr-1" />
                  Easy
                </Badge>
              </div>
              
              <h1 className="font-mechanical text-4xl md:text-5xl font-bold mb-6">
                {recipe?.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Total Time:</span>
                  <span className="ml-1">{totalTime}min</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Serves:</span>
                  <span className="ml-1">{recipe?.servings || 4}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2 fill-current text-energetic-orange" />
                  <span className="font-semibold">{recipe?.averageRating || 5}/5</span>
                  <span className="ml-1 text-sm">({recipe?.ratingCount || 0} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Description Card */}
          <Card className="mechanical-shadow mb-8">
            <CardContent className="p-6">
              <div className="prose prose-lg max-w-none prose-gray prose-headings:text-industrial-blue prose-links:text-workshop-teal prose-strong:text-industrial-blue prose-em:text-tool-gray prose-p:text-tool-gray prose-p:leading-relaxed">
                <MarkdownContent 
                  content={recipe?.description || "No description available for this recipe."}
                  className="text-tool-gray"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Ingredients */}
            <div className="lg:col-span-1">
              <Card className="mechanical-shadow">
                <CardHeader>
                  <CardTitle className="font-mechanical text-2xl text-industrial-blue flex items-center">
                    <BookOpen className="w-6 h-6 mr-2" />
                    Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent onMouseEnter={handleIngredientsView}>
                  <div className="space-y-3">
                    {ingredientsHtml ? (
                      <div 
                        className="ingredients-list"
                        dangerouslySetInnerHTML={{ __html: ingredientsHtml }}
                      />
                    ) : ingredientsList && ingredientsList.length > 0 ? (
                      ingredientsList.map((ingredient: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-workshop-teal rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-tool-gray leading-relaxed">{ingredient}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-tool-gray italic">No ingredients listed</p>
                    )}
                  </div>

                  {/* SEO Keywords as Tags */}
                  {recipe?.seO_Keywords && (
                    <div className="mt-6 pt-6 border-t border-medium-gray">
                      <h4 className="font-semibold text-industrial-blue mb-3 flex items-center">
                        <span className="w-2 h-2 bg-workshop-teal rounded-full mr-2"></span>
                        Recipe Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {recipe.seO_Keywords
                          .split(/[\n\r]+/)  // Split by new lines
                          .map(line => line.trim())  // Trim whitespace
                          .filter(line => line)  // Remove empty lines
                          .map(line => line.replace(/^[-\d.]*\s*/, ''))  // Remove bullet points and numbers
                          .filter(keyword => keyword.trim())  // Filter out empty results
                          .map((keyword: string, index: number) => {
                            const cleanKeyword = keyword.trim();
                            if (!cleanKeyword) return null;
                            
                            // Cycle through different badge styles for visual variety
                            const badgeStyles = [
                              "bg-workshop-teal/10 text-workshop-teal border-workshop-teal/20 hover:bg-workshop-teal/20 hover:border-workshop-teal/30",
                              "bg-energetic-orange/10 text-energetic-orange border-energetic-orange/20 hover:bg-energetic-orange/20 hover:border-energetic-orange/30",
                              "bg-industrial-blue/10 text-industrial-blue border-industrial-blue/20 hover:bg-industrial-blue/20 hover:border-industrial-blue/30",
                              "bg-cream/80 text-tool-gray border-medium-gray/50 hover:bg-kitchen-warm hover:border-medium-gray"
                            ];
                            
                            const styleIndex = index % badgeStyles.length;
                            
                            return (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className={`
                                  text-xs font-medium border transition-all duration-200 cursor-default
                                  ${badgeStyles[styleIndex]}
                                  hover:shadow-sm hover:scale-105 transform
                                  px-3 py-1.5 rounded-full
                                `}
                                title={cleanKeyword}
                              >
                                {cleanKeyword}
                              </Badge>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Quick Stats Card */}
                  <div className="mt-6 pt-6 border-t border-medium-gray">
                    <h4 className="font-semibold text-industrial-blue mb-3">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-3 bg-light-gray rounded-lg">
                        <div className="font-bold text-workshop-teal">{totalTime}min</div>
                        <div className="text-tool-gray">Total Time</div>
                      </div>
                      <div className="text-center p-3 bg-light-gray rounded-lg">
                        <div className="font-bold text-energetic-orange">Easy</div>
                        <div className="text-tool-gray">Difficulty</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <div className="lg:col-span-2">
              <Card className="mechanical-shadow">
                <CardHeader>
                  <CardTitle className="font-mechanical text-2xl text-industrial-blue flex items-center">
                    <ChefHat className="w-6 h-6 mr-2" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent onMouseEnter={handleInstructionsView}>
                  <div className="space-y-6">
                    {instructionsHtml ? (
                      <div 
                        className="instructions-list"
                        dangerouslySetInnerHTML={{ __html: instructionsHtml }}
                      />
                    ) : instructionsList && instructionsList.length > 0 ? (
                      instructionsList.map((instruction: string, index: number) => (
                        <div key={index} className="flex">
                          <div className="flex-shrink-0 w-8 h-8 bg-workshop-teal text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-tool-gray leading-relaxed">{instruction}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-tool-gray italic">No instructions provided</p>
                    )}
                  </div>

                  {/* Additional Recipe Info */}
                  <Separator className="my-8" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-industrial-blue mb-2">Cooking Tips</h4>
                      <ul className="text-sm text-tool-gray space-y-1">
                        <li>• Read through all instructions before starting</li>
                        <li>• Prep all ingredients before cooking</li>
                        <li>• Adjust seasonings to taste</li>
                        <li>• Let rest for best results</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-industrial-blue mb-2">Storage</h4>
                      <ul className="text-sm text-tool-gray space-y-1">
                        <li>• Store leftovers in refrigerator</li>
                        <li>• Best consumed within 2-3 days</li>
                        <li>• Can be frozen for up to 3 months</li>
                        <li>• Reheat gently before serving</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-workshop-teal hover:bg-workshop-teal/90 text-white px-8"
                onClick={() => window.print()}
              >
                Print Recipe
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-energetic-orange text-energetic-orange hover:bg-energetic-orange hover:text-white px-8"
                onClick={() => {
                  navigator.share?.({
                    title: recipe?.name || "Recipe",
                    text: recipe?.description || "",
                    url: window.location.href,
                  }) || navigator.clipboard?.writeText(window.location.href);
                }}
              >
                Share Recipe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
