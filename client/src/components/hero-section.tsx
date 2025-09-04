import { useQuery } from "@tanstack/react-query";
import { Settings, Utensils, Play, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "./loading-spinner";
import logoIcon from "@/assets/MOM-Logo-Icon.png";
import type { StatsResponse } from "@/data/api-types";

export default function HeroSection() {
  const { data: stats, isLoading } = useQuery<StatsResponse>({
    queryKey: ["/api/stats"],
  });

  return (
    <section className="bg-gradient-to-br from-industrial-blue via-tool-gray to-workshop-teal py-20">
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
            className="gear-border bg-energetic-orange hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            data-testid="button-start-cooking"
          >
            <Wrench className="mr-2" size={20} />
            Start Cooking
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
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
                <div className="text-3xl font-bold text-white">{stats.recipes}+</div>
                <div className="text-gray-300 font-industrial">Tested Recipes</div>
              </div>
              <div className="text-center" data-testid="stat-families">
                <div className="text-3xl font-bold text-white">{(stats.families || 25000).toLocaleString()}+</div>
                <div className="text-gray-300 font-industrial">Families Served</div>
              </div>
              <div className="text-center" data-testid="stat-time-saved">
                <div className="text-3xl font-bold text-white">{((stats.timeSaved || 5000000) / 1000000).toFixed(1)}M+</div>
                <div className="text-gray-300 font-industrial">Hours Saved</div>
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
