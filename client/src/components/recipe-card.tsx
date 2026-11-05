import { ArrowRight, Star, Users } from "lucide-react";
import { Link } from "wouter";
import MarkdownContent from "@/components/markdown-content";
import { Badge } from "@/components/ui/badge";
import { getRecipeUrl } from "@/data/api-loader";
import { getRecipeImageAlt, getRecipeImageUrl } from "@/utils/image-helpers";
import type { Recipe } from "@/data/api-types";

interface RecipeCardProps {
  recipe: Recipe;
  /** Show the category badge (hide it on single-category listings) */
  showCategory?: boolean;
  /** Use eager loading for above-the-fold cards */
  priority?: boolean;
}

/**
 * Recipe summary card: white surface on cream, hairline border, quiet lift on hover.
 * The whole card is one link so keyboard users get a single tab stop per recipe.
 */
export default function RecipeCard({ recipe, showCategory = true, priority = false }: RecipeCardProps) {
  const rating = recipe.averageRating || 5;
  const categoryName = recipe.recipeCategory?.name;

  return (
    <Link
      href={getRecipeUrl(recipe)}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-[box-shadow,transform,border-color] duration-200 ease-standard hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md dark:hover:border-neutral-600"
      data-testid={`recipe-card-${recipe.id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={getRecipeImageUrl(recipe)}
          alt={getRecipeImageAlt(recipe)}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="size-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          {showCategory && categoryName ? (
            <Badge variant="brand">{categoryName}</Badge>
          ) : (
            <span />
          )}
          <span
            className="flex items-center gap-1 text-sm font-semibold text-foreground"
            aria-label={`Rated ${rating} out of 5`}
          >
            <Star size={14} className="fill-star text-star" aria-hidden="true" />
            {rating}
          </span>
        </div>

        <h3
          className="mb-2 line-clamp-2 font-display text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary-ink"
          data-testid={`recipe-title-${recipe.id}`}
        >
          {recipe.name}
        </h3>

        {recipe.description && (
          <div className="mb-4 line-clamp-2 text-sm text-muted-foreground [&_p]:mb-0">
            <MarkdownContent content={recipe.description} summary={true} />
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-4 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Users size={14} aria-hidden="true" />
            Serves {recipe.servings || 4}
          </span>
          <span className="flex items-center gap-1 font-semibold text-link transition-[gap] duration-200 group-hover:gap-2">
            View recipe
            <ArrowRight size={14} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
