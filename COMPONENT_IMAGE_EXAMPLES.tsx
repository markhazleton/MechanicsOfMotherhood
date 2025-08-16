// Example: How to enhance your existing components with images

// 1. Enhanced Navigation with Logo
import { Settings, Utensils } from "lucide-react";
import { Link } from "wouter";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-lg mechanical-shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo with Image Option */}
          <Link href="/" className="flex items-center space-x-3" data-testid="logo-link">
            {/* Option 1: Keep current animated icons */}
            <div className="relative">
              <Settings className="text-tool-gray text-3xl animate-spin-slow" />
              <Utensils className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-energetic-orange text-sm" />
            </div>
            
            {/* Option 2: Replace with brand logo (uncomment when you have logo)
            <img 
              src="/images/logos/mom-icon.svg"
              alt="MoM Logo" 
              className="h-10 w-10 animate-spin-slow"
            />
            */}
            
            <div className="flex flex-col">
              <h1 className="font-mechanical text-xl font-bold text-tool-gray">MoM</h1>
              <p className="text-xs text-gray-500 font-industrial">MECHANICS OF MOTHERHOOD</p>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// 2. Enhanced Hero Section with Background
export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-industrial-blue via-tool-gray to-workshop-teal py-20 relative overflow-hidden">
      {/* Optional: Add background image overlay */}
      {/* 
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay"
        style={{ backgroundImage: 'url(/images/hero/kitchen-tools-bg.jpg)' }}
      />
      */}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center mb-8">
          {/* Enhanced logo section */}
          <div className="relative">
            <Settings className="text-white text-6xl animate-spin-slow opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-4 mechanical-shadow">
                {/* Option: Replace with brand icon */}
                <Utensils className="text-energetic-orange text-2xl" />
                {/* 
                <img 
                  src="/images/logos/mom-icon.svg" 
                  alt="MoM Icon" 
                  className="h-8 w-8"
                />
                */}
              </div>
            </div>
          </div>
        </div>
        
        <h1 className="font-mechanical text-5xl md:text-7xl font-black text-white mb-4">
          MoM
        </h1>
        {/* Rest of hero content */}
      </div>
    </section>
  );
}

// 3. Enhanced Recipe Cards with Images
export default function RecipeCard({ recipe }) {
  return (
    <Card className="gear-border bg-white rounded-xl overflow-hidden mechanical-shadow hover:transform hover:scale-105 transition-all duration-300">
      {/* Recipe Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {recipe.image ? (
          <img 
            src={`/images/recipes/${recipe.image}`}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
        ) : (
          // Fallback when no image available
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-light-gray to-medium-gray">
            <Utensils className="text-tool-gray text-4xl opacity-50" />
          </div>
        )}
        
        {/* Optional: Category badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="bg-energetic-orange text-white px-2 py-1 rounded-full text-xs font-semibold">
            {recipe.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-mechanical text-lg font-semibold mb-2">{recipe.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-workshop-teal font-semibold">{recipe.time}</span>
          <span className="text-sm text-gray-500">{recipe.difficulty}</span>
        </div>
      </div>
    </Card>
  );
}
