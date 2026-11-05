import { useState } from "react";
import { ArrowRight, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import apiData from "@/data/api-data.json";
import { getFeaturedRecipes, getRecipeUrl } from "@/data/api-loader";
import { getRecipeImageAlt, getRecipeImageUrl } from "@/utils/image-helpers";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  const { metadata: stats } = apiData;
  // Prefer a featured recipe that has a real photo; otherwise show the brand mark
  const featured = getFeaturedRecipes(6);
  const spotlight = featured.find((r) => r.images?.[0]?.trim()) ?? featured[0];
  const hasPhoto = Boolean(spotlight?.images?.[0]?.trim());

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/recipes/?search=${encodeURIComponent(query)}`);
  };

  return (
    <section className="overflow-hidden bg-background">
      <div className="site-container grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
        <div>
          <p className="eyebrow">Family-tested recipes</p>

          <h1
            className="mt-5 font-display text-[clamp(2.6rem,4.6vw+0.5rem,4.25rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-foreground"
            data-testid="hero-title"
          >
            Delicious recipes for{" "}
            <span className="text-primary dark:text-brand-200">busy families.</span>
          </h1>

          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
            Simple, tested recipes that work for real life — quick weeknight dinners,
            meal-prep ideas, and family favorites, all in one place.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-xl"
            role="search"
            data-testid="home-recipe-search-form"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
                <Input
                  type="search"
                  aria-label="Search all recipes"
                  placeholder="Search all recipes…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-10 text-base"
                  data-testid="home-recipe-search-input"
                />
              </div>
              <Button type="submit" size="lg" data-testid="home-recipe-search-button">
                Search
              </Button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="default" data-testid="button-browse-recipes">
              <Link href="/recipes/">
                Browse recipes
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outlineBrand" data-testid="button-view-categories">
              <Link href="/categories/">View categories</Link>
            </Button>
          </div>
        </div>

        {spotlight && (
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div aria-hidden="true" className="absolute -bottom-5 -left-5 hidden h-2/5 w-2/5 rounded-lg bg-brand-100 sm:block dark:bg-brand-900" />
            <Link
              href={getRecipeUrl(spotlight)}
              className="group relative block overflow-hidden rounded-xl bg-muted shadow-xl"
              data-testid="hero-spotlight"
            >
              {hasPhoto ? (
                <img
                  src={getRecipeImageUrl(spotlight)}
                  alt={getRecipeImageAlt(spotlight)}
                  loading="eager"
                  fetchPriority="high"
                  className="aspect-[4/5] w-full object-cover lg:aspect-[5/6]"
                />
              ) : (
                <div className="grid aspect-[4/5] w-full place-items-center bg-cream-deep lg:aspect-[5/6] dark:bg-neutral-800">
                  <span className="grid size-48 place-items-center rounded-xl bg-card shadow-md md:size-56">
                    <img
                      src="/images/logos/MOM-Logo-Icon.png"
                      alt=""
                      width={160}
                      height={160}
                      className="size-36 object-contain md:size-44"
                    />
                  </span>
                </div>
              )}
              <div className="absolute inset-x-4 bottom-4 rounded-lg border border-border bg-card/95 p-4 shadow-md backdrop-blur-sm">
                <p className="eyebrow text-xs">Featured recipe</p>
                <p className="mt-1.5 line-clamp-1 font-display text-lg font-bold text-foreground group-hover:text-primary-ink">
                  {spotlight.name}
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Stat strip */}
      {stats ? (
        <div className="border-y border-border-subtle bg-card">
          <dl className="site-container grid grid-cols-3 gap-6 py-7">
            <div className="flex flex-col-reverse text-center" data-testid="stat-recipes">
              <dt className="mt-2 text-xs font-medium tracking-[0.04em] text-muted-foreground md:text-sm">Recipes</dt>
              <dd className="font-display text-3xl font-extrabold leading-none text-primary md:text-4xl dark:text-brand-200">
                {stats.totalRecipes}+
              </dd>
            </div>
            <div className="flex flex-col-reverse text-center" data-testid="stat-categories">
              <dt className="mt-2 text-xs font-medium tracking-[0.04em] text-muted-foreground md:text-sm">Categories</dt>
              <dd className="font-display text-3xl font-extrabold leading-none text-primary md:text-4xl dark:text-brand-200">
                {stats.totalCategories}
              </dd>
            </div>
            <div className="flex flex-col-reverse text-center" data-testid="stat-rating">
              <dt className="mt-2 text-xs font-medium tracking-[0.04em] text-muted-foreground md:text-sm">Avg rating</dt>
              <dd className="flex items-center justify-center gap-1.5 font-display text-3xl font-extrabold leading-none text-primary md:text-4xl dark:text-brand-200">
                4.8 <Star className="size-6 fill-star text-star" aria-hidden="true" />
              </dd>
            </div>
          </dl>
        </div>
      ) : null}
    </section>
  );
}
