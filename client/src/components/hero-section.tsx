import { Settings, Utensils, Play, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import apiData from "@/data/api-data.json";

const logoIcon = "/images/logos/MOM-Logo-Icon.png";

export default function HeroSection() {
  const { metadata: stats } = apiData;

  return (
  <section className="bg-hero-brand-accent hero-overlay py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center mb-8">
          <div className="relative">
            <div className="bg-white rounded-full p-6 shadow-lg">
              <img 
                src={logoIcon}
                alt="MoM Logo"
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>
        </div>
        
        <h1 className="heading-display hero-title text-brand-700 dark:text-white mb-4" data-testid="hero-title">
          MoM
        </h1>
        <p className="text-xl md:text-2xl text-brand-600 dark:text-brand-100 mb-2 tracking-wide font-semibold">
          MECHANICS OF MOTHERHOOD
        </p>
        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-100/80 mb-8 font-medium">
          Engineering Better Meals • The Mother of All Solutions
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg"
            variant="accent"
            className="px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 motion-safe:transform motion-safe:hover:scale-105 shadow-md"
            data-testid="button-start-cooking"
          >
            <Wrench className="mr-2" size={20} />
            Start Cooking
          </Button>
          <Button
            variant="outlineBrand"
            size="lg"
            className="px-8 py-4 text-lg font-semibold rounded-full shadow-md transition-all duration-300 motion-safe:transform motion-safe:hover:scale-105 focus-visible:outline-none"
            data-testid="button-watch-tutorial"
            aria-label="Watch tutorial video"
          >
            <Play className="mr-2" size={20} />
            Watch Tutorial
          </Button>
        </div>

        {/* Static Stats */}
  <div className="max-w-3xl mx-auto mt-8 bg-white/95 dark:bg-neutral-800/90 backdrop-blur-md border-2 border-accent-500/30 dark:border-accent-500/40 rounded-2xl p-8 shadow-2xl transition-colors">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats ? (
            <>
              <div className="text-center" data-testid="stat-recipes">
                <div className="text-4xl font-extrabold text-accent-600 dark:text-accent-400 mb-2">{stats.totalRecipes}+</div>
                <div className="uppercase tracking-wide text-xs font-bold text-brand-800 dark:text-brand-100">Tested Recipes</div>
              </div>
              <div className="text-center" data-testid="stat-categories">
                <div className="text-4xl font-extrabold text-accent-600 dark:text-accent-400 mb-2">{stats.totalCategories}+</div>
                <div className="uppercase tracking-wide text-xs font-bold text-brand-800 dark:text-brand-100">Recipe Categories</div>
              </div>
              <div className="text-center" data-testid="stat-rating">
                <div className="text-4xl font-extrabold text-accent-600 dark:text-accent-400 mb-2">4.8★</div>
                <div className="uppercase tracking-wide text-xs font-bold text-brand-800 dark:text-brand-100">Average Rating</div>
              </div>
            </>
          ) : (
            <div className="md:col-span-3 text-brand-800 dark:text-white">Statistics not available</div>
          )}
  </div>
  </div>
      </div>
    </section>
  );
}
