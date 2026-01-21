import { useParams, useLocation } from "wouter";
import { Users, Star, ChefHat, ArrowLeft, BookOpen } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import MarkdownContent from "@/components/markdown-content";
import { RecipeChat } from "@/components/recipe-chat";
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

  // Use direct static data access instead of React Query
  let recipe: Recipe | null = null;
  let error: string | null = null;

  try {
    if (slug) {
      const foundRecipe = getRecipeBySlug(slug);
      if (!foundRecipe) {
        error = "Recipe not found";
      } else {
        recipe = foundRecipe;
      }
    } else {
      error = "No recipe slug provided";
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  // Initialize analytics for this recipe
  const analytics = useRecipeAnalytics(recipe || undefined);

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

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Recipe Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              {error || "The recipe you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => navigate("/recipes")} variant="default">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Removed synthetic time & difficulty (no API fields). Could be reintroduced when backend supports them.

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
    <div className="recipe-detail-page min-h-screen bg-background text-foreground transition-colors">
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

      <div className="no-print">
        <Navigation />
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-muted/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative recipe-hero-section no-print">
        <div className="h-80 md:h-96 relative overflow-hidden">
          <img
            src={getRecipeImageUrl(recipe)}
            alt={getRecipeImageAlt(recipe)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
            <Button
              onClick={handleBackClick}
              variant="secondary"
              className="mb-6 bg-white/90 hover:bg-white text-neutral-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Button>

            <div className="text-white">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-accent-600 text-white border-0">
                  {recipe?.recipeCategory?.name || "Recipe"}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {recipe?.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>Serves {recipe?.servings || 4}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2 fill-yellow-400 text-yellow-400" />
                  <span>{recipe?.averageRating || 5}/5</span>
                  <span className="ml-1 text-sm text-white/70">({recipe?.ratingCount || 0} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Content */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Print Header (only visible in print) */}
          <div className="print-only recipe-print-header mb-6">
            <h1 className="text-3xl font-bold">{recipe.name}</h1>
            <div className="recipe-print-meta">
              <span>Category: {recipe?.recipeCategory?.name || 'Recipe'}</span>
              {recipe.servings && <span>Serves: {recipe.servings}</span>}
              {recipe.averageRating && <span>Rating: {recipe.averageRating}/5</span>}
            </div>
            <img src={getRecipeImageUrl(recipe)} alt={getRecipeImageAlt(recipe)} className="recipe-print-image" />
          </div>

          {/* Description Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-links:text-accent-600 dark:prose-links:text-accent-400">
                <MarkdownContent
                  content={recipe?.description || "No description available for this recipe."}
                  className="text-muted-foreground"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 recipe-content-grid">

            {/* Ingredients */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="bg-muted/50 dark:bg-muted/30">
                  <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-accent-600 dark:text-accent-400" />
                    Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent onMouseEnter={handleIngredientsView} className="pt-6">
                  <div className="space-y-3">
                    {ingredientsHtml ? (
                      <div
                        className="ingredients-list text-foreground"
                        dangerouslySetInnerHTML={{ __html: ingredientsHtml }}
                      />
                    ) : ingredientsList && ingredientsList.length > 0 ? (
                      ingredientsList.map((ingredient: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-foreground leading-relaxed">{ingredient}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">No ingredients listed</p>
                    )}
                  </div>

                  {/* SEO Keywords as Tags */}
                  {recipe?.seO_Keywords && (
                    <div className="mt-6 pt-6 border-t border-border recipe-tags">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center">
                        <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                        Recipe Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {recipe.seO_Keywords
                          .split(/[\n\r]+/)
                          .map(line => line.trim())
                          .filter(line => line)
                          .map(line => line.replace(/^[-\d.]*\s*/, ''))
                          .filter(keyword => keyword.trim())
                          .map((keyword: string, index: number) => {
                            const cleanKeyword = keyword.trim();
                            if (!cleanKeyword) return null;

                            return (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-default"
                                title={cleanKeyword}
                              >
                                {cleanKeyword}
                              </Badge>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="bg-muted/50 dark:bg-muted/30">
                  <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                    <ChefHat className="w-5 h-5 mr-2 text-accent-600 dark:text-accent-400" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent onMouseEnter={handleInstructionsView} className="pt-6">
                  <div className="space-y-5">
                    {instructionsHtml ? (
                      <div
                        className="instructions-list text-foreground"
                        dangerouslySetInnerHTML={{ __html: instructionsHtml }}
                      />
                    ) : instructionsList && instructionsList.length > 0 ? (
                      instructionsList.map((instruction: string, index: number) => (
                        <div key={index} className="flex">
                          <div className="flex-shrink-0 w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center font-semibold text-sm mr-4">
                            {index + 1}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-foreground leading-relaxed">{instruction}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">No instructions provided</p>
                    )}
                  </div>

                  {/* Additional Recipe Info */}
                  <Separator className="my-8" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 additional-recipe-info">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center">
                        <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                        Cooking Tips
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Read through all instructions before starting</li>
                        <li>• Prep all ingredients before cooking</li>
                        <li>• Adjust seasonings to taste</li>
                        <li>• Let rest for best results</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center">
                        <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                        Storage
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
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

          {/* Recipe Chat Feature */}
          <div className="mt-10 no-print">
            <RecipeChat
              recipeId={recipe.id}
              recipeName={recipe.name}
              recipeIngredients={recipe.ingredients}
              recipeInstructions={recipe.instructions}
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-10 text-center action-buttons no-print">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 bg-accent-600 hover:bg-accent-700 text-white"
                onClick={() => window.print()}
              >
                Print Recipe
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8"
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
