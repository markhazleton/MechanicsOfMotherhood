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
      <div className="min-h-screen bg-surface-base text-text-base">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-mechanical heading-xl text-text-strong mb-4">
              Recipe Not Found
            </h1>
            <p className="text-text-muted mb-8">
              {error || "The recipe you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => navigate("/recipes")} variant="brand">
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
  <div className="recipe-detail-page min-h-screen bg-surface-base text-text-base">
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
  <div className="bg-surface-subtle border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>
      
      {/* Hero Section */}
    <section className="relative recipe-hero-section no-print">
  <div className="h-96 bg-gradient-to-r from-brand-900/25 to-accent-600/25 relative overflow-hidden">
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
              variant="subtle"
              className="mb-6 bg-white/90 hover:bg-white text-brand-800 dark:text-brand-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Button>
            
            <div className="text-white">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="brand" className="bg-accent-solid text-white">
                  {recipe?.recipeCategory?.name || "Recipe"}
                </Badge>
                {/* Difficulty removed: no source field in API */}
              </div>
              
              <h1 className="font-mechanical text-4xl md:text-5xl font-bold mb-6">
                {recipe?.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Serves:</span>
                  <span className="ml-1">{recipe?.servings || 4}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2 fill-current text-accent-600" />
                  <span className="font-semibold">{recipe?.averageRating || 5}/5</span>
                  <span className="ml-1 text-sm">({recipe?.ratingCount || 0} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Content */}
      <section className="py-16 bg-warm-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Print Header (only visible in print) */}
          <div className="print-only recipe-print-header mb-6">
            <h1 className="font-mechanical text-3xl font-bold">{recipe.name}</h1>
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
        <div className="prose prose-lg max-w-none prose-headings:text-brand-800 prose-links:text-accent-600 hover:prose-links:text-accent-700 prose-strong:text-brand-900 prose-p:text-neutral-800 prose-p:leading-relaxed">
                <MarkdownContent
                  content={recipe?.description || "No description available for this recipe."}
                  className="text-neutral-800"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 recipe-content-grid">
            
            {/* Ingredients */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="bg-warm-peach/30">
                  <CardTitle className="font-display heading-lg text-brand-800 flex items-center">
                    <BookOpen className="w-6 h-6 mr-2 text-accent-600" />
                    Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent onMouseEnter={handleIngredientsView} className="pt-6">
                  <div className="space-y-3">
                    {ingredientsHtml ? (
                      <div
                        className="ingredients-list text-neutral-800"
                        dangerouslySetInnerHTML={{ __html: ingredientsHtml }}
                      />
                    ) : ingredientsList && ingredientsList.length > 0 ? (
                      ingredientsList.map((ingredient: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-neutral-800 leading-relaxed">{ingredient}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-neutral-600 italic">No ingredients listed</p>
                    )}
                  </div>

                  {/* SEO Keywords as Tags */}
                  {recipe?.seO_Keywords && (
                    <div className="mt-6 pt-6 border-t border-warm-peach/50 recipe-tags">
                      <h4 className="font-semibold text-brand-800 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
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
                            
                            // Cycle through different badge variants for visual variety
                            const badgeVariants = ["subtle", "outline", "subtle", "outline"] as const;
                            const variantIndex = index % badgeVariants.length;

                            return (
                              <Badge
                                key={index}
                                variant={badgeVariants[variantIndex]}
                                className="cursor-default hover:shadow-sm motion-safe:hover:scale-105 motion-safe:transform"
                                title={cleanKeyword}
                              >
                                {cleanKeyword}
                              </Badge>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Quick Stats removed: time & difficulty not provided by API */}
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="bg-warm-peach/30">
                  <CardTitle className="font-display heading-lg text-brand-800 flex items-center">
                    <ChefHat className="w-6 h-6 mr-2 text-accent-600" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent onMouseEnter={handleInstructionsView} className="pt-6">
                  <div className="space-y-6">
                    {instructionsHtml ? (
                      <div
                        className="instructions-list text-neutral-800"
                        dangerouslySetInnerHTML={{ __html: instructionsHtml }}
                      />
                    ) : instructionsList && instructionsList.length > 0 ? (
                      instructionsList.map((instruction: string, index: number) => (
                        <div key={index} className="flex">
                          <div className="flex-shrink-0 w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 shadow-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-neutral-800 leading-relaxed">{instruction}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-neutral-600 italic">No instructions provided</p>
                    )}
                  </div>

                  {/* Additional Recipe Info */}
                  <Separator className="my-8 bg-warm-peach/50" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 additional-recipe-info">
                    <div>
                      <h4 className="font-semibold text-brand-800 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                        Cooking Tips
                      </h4>
                      <ul className="text-sm text-neutral-700 space-y-1">
                        <li>• Read through all instructions before starting</li>
                        <li>• Prep all ingredients before cooking</li>
                        <li>• Adjust seasonings to taste</li>
                        <li>• Let rest for best results</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-800 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                        Storage
                      </h4>
                      <ul className="text-sm text-neutral-700 space-y-1">
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

          {/* Talk to MoM Chat Feature */}
          <div className="mt-12 no-print">
            <RecipeChat
              recipeId={recipe.id}
              recipeName={recipe.name}
              recipeIngredients={recipe.ingredients}
              recipeInstructions={recipe.instructions}
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-12 text-center action-buttons no-print">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="brand"
                className="px-8"
                onClick={() => window.print()}
              >
                Print Recipe
              </Button>
              <Button 
                size="lg" 
                variant="outlineBrand" 
                className="px-8 share-actions hover:bg-accent-600 hover:text-white hover:border-accent-600"
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
