import { useQuery } from "@tanstack/react-query";
import { Settings, Utensils, Play, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "./loading-spinner";
import logoIcon from "@/assets/MOM-Logo-Icon.png";
import apiData from "@/data/api-data.json";

export default function HeroSection() {
  const { metadata: stats } = apiData;
  const isLoading = !stats;

  return (
  <section className="bg-gradient-to-br from-[hsl(var(--color-industrial-blue))] via-[hsl(var(--color-tool-gray))] to-[hsl(var(--color-workshop-teal))] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center mb-8">
          <div className="relative">
            <div className="bg-white rounded-full p-6 mechanical-shadow">
              <img 
                src={logoIcon}
                alt="MoM Logo"
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>
        </div>
        
        <h1 className="font-mechanical text-5xl md:text-7xl font-black text-white mb-4" data-testid="hero-title">
          MoM
        </h1>
        <p className="font-industrial text-xl md:text-2xl text-gray-200 mb-2 tracking-wide">
          MECHANICS OF MOTHERHOOD
        </p>
        <p className="text-lg md:text-xl text-gray-300 mb-8 font-medium">
          Engineering Better Meals • The Mother of All Solutions
        </p>
        
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg"
      className="btn-brand-primary px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
            data-testid="button-start-cooking"
          >
            <Wrench className="mr-2" size={20} />
            Start Cooking
          </Button>
          <Button
            variant="outline"
            size="lg"
      className="btn-brand-outline px-8 py-4 text-lg"
            data-testid="button-watch-tutorial"
          >
            <Play className="mr-2" size={20} />
            Watch Tutorial
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          {isLoading ? (
            <div className="md:col-span-3">
              <LoadingSpinner />
            </div>
          ) : stats ? (
            <>
              <div className="text-center" data-testid="stat-recipes">
                <div className="text-3xl font-bold text-white">{stats.totalRecipes}+</div>
                <div className="text-gray-300 font-industrial">Tested Recipes</div>
              </div>
              <div className="text-center" data-testid="stat-categories">
                <div className="text-3xl font-bold text-white">{stats.totalCategories}+</div>
                <div className="text-gray-300 font-industrial">Recipe Categories</div>
              </div>
              <div className="text-center" data-testid="stat-rating">
                <div className="text-3xl font-bold text-white">4.8★</div>
                <div className="text-gray-300 font-industrial">Average Rating</div>
              </div>
            </>
          ) : (
            <div className="md:col-span-3 text-white">Unable to load statistics</div>
          )}
        </div>
      </div>
    </section>
  );
}
