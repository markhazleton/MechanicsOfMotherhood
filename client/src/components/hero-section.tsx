import { ChefHat, BookOpen, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import apiData from "@/data/api-data.json";

export default function HeroSection() {
  const { metadata: stats } = apiData;

  return (
    <section className="relative bg-gradient-to-br from-accent-50 via-background to-brand-50 dark:from-neutral-900 dark:via-background dark:to-neutral-800 py-16 md:py-24 overflow-hidden transition-colors">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent-100 dark:bg-accent-900/40 text-accent-700 dark:text-accent-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ChefHat size={16} />
            <span>Family-Tested Recipes</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight" data-testid="hero-title">
            Delicious Recipes for
            <span className="block text-accent-600 dark:text-accent-400">Busy Families</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Simple, tested recipes that work for real life. Quick weeknight dinners,
            meal prep ideas, and family favorites all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/recipes">
              <Button
                size="lg"
                variant="accent"
                className="px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-accent-500/25 hover:shadow-xl hover:shadow-accent-500/30"
                data-testid="button-browse-recipes"
              >
                <BookOpen className="mr-2" size={20} />
                Browse Recipes
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Link href="/categories">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-xl border-2 hover:bg-muted transition-all duration-200"
                data-testid="button-view-categories"
              >
                View Categories
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            {stats ? (
              <>
                <div className="text-center p-4 rounded-xl bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border" data-testid="stat-recipes">
                  <div className="text-2xl md:text-3xl font-bold text-accent-600 dark:text-accent-400 mb-1">{stats.totalRecipes}+</div>
                  <div className="text-xs md:text-sm text-muted-foreground font-medium">Recipes</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border" data-testid="stat-categories">
                  <div className="text-2xl md:text-3xl font-bold text-accent-600 dark:text-accent-400 mb-1">{stats.totalCategories}</div>
                  <div className="text-xs md:text-sm text-muted-foreground font-medium">Categories</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border" data-testid="stat-rating">
                  <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold text-accent-600 dark:text-accent-400 mb-1">
                    4.8 <Star size={20} fill="currentColor" />
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground font-medium">Avg Rating</div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
