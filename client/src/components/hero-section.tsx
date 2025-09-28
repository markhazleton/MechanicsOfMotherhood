import { Settings, Utensils, Play, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import apiData from "@/data/api-data.json";

const logoIcon = "/images/logos/MOM-Logo-Icon.png";

export default function HeroSection() {
  const { metadata: stats } = apiData;

  return (
  <section className="bg-gradient-to-br from-blue-900 via-slate-700 to-teal-700 py-20">
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
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4" data-testid="hero-title">
          MoM
        </h1>
        <p className="text-xl md:text-2xl text-teal-100 mb-2 tracking-wide font-semibold">
          MECHANICS OF MOTHERHOOD
        </p>
        <p className="text-lg md:text-xl text-blue-100/80 mb-8 font-medium">
          Engineering Better Meals • The Mother of All Solutions
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 motion-safe:transform motion-safe:hover:scale-105 shadow-md"
            data-testid="button-start-cooking"
          >
            <Wrench className="mr-2" size={20} />
            Start Cooking
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/95 text-blue-900 hover:bg-orange-500 hover:text-white border border-white/70 px-8 py-4 text-lg font-semibold rounded-full shadow-md transition-all duration-300 motion-safe:transform motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
            data-testid="button-watch-tutorial"
            aria-label="Watch tutorial video"
          >
            <Play className="mr-2" size={20} />
            Watch Tutorial
          </Button>
        </div>

        {/* Static Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          {stats ? (
            <>
              <div className="text-center" data-testid="stat-recipes">
                <div className="text-3xl font-extrabold text-white drop-shadow">{stats.totalRecipes}+</div>
                <div className="text-blue-100 uppercase tracking-wide text-sm">Tested Recipes</div>
              </div>
              <div className="text-center" data-testid="stat-categories">
                <div className="text-3xl font-extrabold text-white drop-shadow">{stats.totalCategories}+</div>
                <div className="text-blue-100 uppercase tracking-wide text-sm">Recipe Categories</div>
              </div>
              <div className="text-center" data-testid="stat-rating">
                <div className="text-3xl font-extrabold text-white drop-shadow">4.8★</div>
                <div className="text-blue-100 uppercase tracking-wide text-sm">Average Rating</div>
              </div>
            </>
          ) : (
            <div className="md:col-span-3 text-white">Statistics not available</div>
          )}
        </div>
      </div>
    </section>
  );
}
