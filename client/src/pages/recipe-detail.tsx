import { useParams, useLocation, Link } from "wouter";
import { Users, Star, ChefHat, ArrowLeft, ListChecks, Printer, Share2, Lightbulb, Snowflake } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import MarkdownContent from "@/components/markdown-content";
import { RecipeChat } from "@/components/recipe-chat";
import SeoHead from "@/components/seo/SeoHead";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRecipeBySlug } from "@/data/api-loader";
import { getRecipeImageUrl, getRecipeImageAlt } from "@/utils/image-helpers";
import { formatIngredientsAsHtml, formatInstructionsAsHtml } from "@/utils/markdown-helpers";
import { getCategorySlug } from "@/utils/slugify";
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

const cookingTips = [
  "Read through all instructions before starting",
  "Prep all ingredients before cooking",
  "Adjust seasonings to taste",
  "Let rest for best results",
];

const storageTips = [
  "Store leftovers in the refrigerator",
  "Best consumed within 2–3 days",
  "Can be frozen for up to 3 months",
  "Reheat gently before serving",
];

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
    navigate("/recipes/");
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
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="site-container py-20 md:py-28">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">Recipe not found</p>
            <h1 className="font-display text-[clamp(2.25rem,3.5vw+1rem,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground">
              We couldn't find that recipe
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              {error || "The recipe you're looking for doesn't exist or has been removed."}
            </p>
            <Button className="mt-8" onClick={() => navigate("/recipes/")}>
              <ArrowLeft aria-hidden="true" />
              Back to recipes
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

  const categoryName = recipe?.recipeCategory?.name;
  const rating = recipe?.averageRating || 5;
  const tags = recipe?.seO_Keywords
    ? recipe.seO_Keywords
        .split(/[\n\r]+/)
        .map(line => line.trim().replace(/^[-\d.]*\s*/, '').trim())
        .filter(Boolean)
    : [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.name || "Recipe",
        text: recipe?.description || "",
        url: window.location.href,
      }).catch(() => {
        // User dismissed the share sheet
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="recipe-detail-page min-h-screen bg-background">
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
      <div className="breadcrumb-nav border-b border-border-subtle">
        <div className="site-container py-3">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>

      {/* Recipe header: title + meta beside the photo */}
      <header className="recipe-hero-section no-print border-b border-border-subtle">
        <div className="site-container grid items-center gap-10 py-10 md:py-14 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div className="order-2 lg:order-1">
            <Button
              onClick={handleBackClick}
              variant="ghost"
              size="sm"
              className="-ml-3 mb-6 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" />
              Back to recipes
            </Button>

            {categoryName ? (
              <Link href={`/recipes/category/${getCategorySlug(categoryName)}/`} className="eyebrow inline-block hover:text-link-hover">
                {categoryName}
              </Link>
            ) : (
              <p className="eyebrow">Recipe</p>
            )}

            <h1 className="mt-4 font-display text-[clamp(2.25rem,3.5vw+1rem,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground">
              {recipe?.name}
            </h1>

            <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-y border-border-subtle py-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Serves</dt>
                <dd className="mt-1 flex items-center gap-2 font-display text-xl font-bold text-foreground">
                  <Users className="size-5 text-primary-ink" aria-hidden="true" />
                  {recipe?.servings || 4}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Rating</dt>
                <dd className="mt-1 flex items-center gap-2 font-display text-xl font-bold text-foreground">
                  <Star className="size-5 fill-star text-star" aria-hidden="true" />
                  {rating}/5
                  <span className="font-sans text-sm font-normal text-muted-foreground">
                    ({recipe?.ratingCount || 0} reviews)
                  </span>
                </dd>
              </div>
            </dl>

            <div className="action-buttons mt-7 flex flex-wrap gap-3">
              <Button onClick={() => window.print()}>
                <Printer aria-hidden="true" />
                Print recipe
              </Button>
              <Button variant="outlineBrand" onClick={handleShare}>
                <Share2 aria-hidden="true" />
                Share
              </Button>
            </div>
          </div>

          <div className="order-1 overflow-hidden rounded-xl bg-muted shadow-lg lg:order-2">
            <img
              src={getRecipeImageUrl(recipe)}
              alt={getRecipeImageAlt(recipe)}
              loading="eager"
              fetchPriority="high"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Recipe Content */}
      <section className="py-10 md:py-14">
        <div className="site-container">
          {/* Print Header (only visible in print) */}
          <div className="print-only recipe-print-header mb-6">
            <h1 className="text-3xl font-bold">{recipe.name}</h1>
            <div className="recipe-print-meta">
              <span>Category: {categoryName || 'Recipe'}</span>
              {recipe.servings && <span>Serves: {recipe.servings}</span>}
              {recipe.averageRating && <span>Rating: {recipe.averageRating}/5</span>}
            </div>
            <img src={getRecipeImageUrl(recipe)} alt={getRecipeImageAlt(recipe)} className="recipe-print-image" />
          </div>

          {/* Description */}
          <div className="mb-10 max-w-[68ch] text-lg leading-relaxed text-body">
            <MarkdownContent
              content={recipe?.description || "No description available for this recipe."}
              className="[&_p:last-child]:mb-0"
            />
          </div>

          <div className="recipe-content-grid grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Ingredients */}
            <aside
              className="rounded-lg border border-border bg-card shadow-sm lg:sticky lg:top-24 lg:col-span-1"
              aria-labelledby="ingredients-heading"
              onMouseEnter={handleIngredientsView}
            >
              <div className="flex items-center gap-3 border-b border-border-subtle px-6 py-5">
                <span className="grid size-9 place-items-center rounded-md bg-accent-soft text-accent-ink">
                  <ListChecks size={18} aria-hidden="true" />
                </span>
                <h2 id="ingredients-heading" className="font-display text-xl font-bold text-foreground">
                  Ingredients
                </h2>
              </div>
              <div className="px-6 py-6">
                {ingredientsHtml ? (
                  <div
                    className="ingredients-list text-body"
                    dangerouslySetInnerHTML={{ __html: ingredientsHtml }}
                  />
                ) : ingredientsList.length > 0 ? (
                  <div className="ingredients-list text-body">
                    <ul>
                      {ingredientsList.map((ingredient: string, index: number) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="italic text-muted-foreground">No ingredients listed</p>
                )}

                {/* SEO Keywords as Tags */}
                {tags.length > 0 && (
                  <div className="recipe-tags mt-6 border-t border-border-subtle pt-6">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Recipe tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((keyword: string, index: number) => (
                        <Badge key={index} variant="secondary" title={keyword}>
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Instructions */}
            <article
              className="rounded-lg border border-border bg-card shadow-sm lg:col-span-2"
              aria-labelledby="instructions-heading"
              onMouseEnter={handleInstructionsView}
            >
              <div className="flex items-center gap-3 border-b border-border-subtle px-6 py-5 md:px-8">
                <span className="grid size-9 place-items-center rounded-md bg-primary-soft text-primary-ink">
                  <ChefHat size={18} aria-hidden="true" />
                </span>
                <h2 id="instructions-heading" className="font-display text-xl font-bold text-foreground">
                  Instructions
                </h2>
              </div>
              <div className="px-6 py-6 md:px-8 md:py-8">
                {instructionsHtml ? (
                  <div
                    className="instructions-list text-body"
                    dangerouslySetInnerHTML={{ __html: instructionsHtml }}
                  />
                ) : instructionsList.length > 0 ? (
                  <div className="instructions-list text-body">
                    <ol>
                      {instructionsList.map((instruction: string, index: number) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <p className="italic text-muted-foreground">No instructions provided</p>
                )}

                {/* Additional Recipe Info */}
                <div className="additional-recipe-info mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    { title: "Cooking tips", icon: Lightbulb, items: cookingTips },
                    { title: "Storage", icon: Snowflake, items: storageTips },
                  ].map(({ title, icon: Icon, items }) => (
                    <div key={title} className="rounded-md bg-muted p-5">
                      <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-foreground">
                        <Icon size={16} className="text-primary-ink" aria-hidden="true" />
                        {title}
                      </h3>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span aria-hidden="true" className="mt-[0.55em] size-1 shrink-0 bg-accent-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Recipe Chat Feature */}
          <div className="no-print mt-12">
            <RecipeChat
              recipeId={recipe.id}
              recipeName={recipe.name}
              recipeIngredients={recipe.ingredients}
              recipeInstructions={recipe.instructions}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
