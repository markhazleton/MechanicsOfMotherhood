import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Clock, Users, Star, ArrowRight } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import LoadingSpinner from "@/components/loading-spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Recipe } from "@shared/schema";

export default function Recipes() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // Use RecipeSpark API for search and filtering
  const searchParams = new URLSearchParams({
    pageNumber: page.toString(),
    pageSize: "12",
    ...(activeSearch && { searchTerm: activeSearch }),
    ...(selectedCategory && { categoryId: selectedCategory })
  });
  
  const { data: recipesData, isLoading } = useQuery({
    queryKey: [`/api/recipespark/recipes?${searchParams.toString()}`],
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["/api/categories"],
  });

  const recipes = recipesData?.data || [];
  const categories = categoriesData?.categories || [];
  const pagination = recipesData?.pagination;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Navigation />
      
      {/* Header */}
      <section className="bg-white py-12 border-b border-medium-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-mechanical text-4xl font-bold text-industrial-blue mb-4">
              Recipe Manual
            </h1>
            <p className="text-tool-gray text-lg max-w-2xl mx-auto">
              Your complete collection of tested, perfected recipes for working mothers
            </p>
            {activeSearch && (
              <div className="mt-4 text-center">
                <span className="text-workshop-teal font-semibold">
                  Showing results for "{activeSearch}"
                </span>
                <button 
                  onClick={() => {
                    setActiveSearch("");
                    setSearchQuery("");
                  }}
                  className="ml-2 text-energetic-orange hover:underline text-sm"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tool-gray" size={16} />
                <Input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="recipe-search-input"
                />
              </div>
            </form>

            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1); // Reset to first page when filtering
                }}
                className="px-4 py-2 border border-medium-gray rounded-lg focus:ring-2 focus:ring-workshop-teal"
                data-testid="category-filter"
              >
                <option value="">All Categories</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Browse Categories Link */}
              <a href="/categories">
                <Button
                  variant="outline"
                  className="px-4 py-2 border-workshop-teal text-workshop-teal hover:bg-workshop-teal hover:text-white"
                  data-testid="browse-categories-button"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Browse Categories
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe: Recipe) => (
                  <Card key={recipe.id} className="gear-border bg-white rounded-xl overflow-hidden mechanical-shadow hover:transform hover:scale-105 transition-all duration-300" data-testid={`recipe-card-${recipe.id}`}>
                    <img
                      src={recipe.imageUrl || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
                      alt={recipe.name}
                      className="w-full h-40 object-cover"
                    />
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-workshop-teal text-white text-xs">
                          <Clock size={12} className="mr-1" />
                          {(recipe.prepTime || 30) + (recipe.cookTime || 30)}min
                        </Badge>
                        <div className="flex items-center text-energetic-orange">
                          <Star size={12} fill="currentColor" />
                          <span className="ml-1 text-xs">{recipe.averageRating || 5}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-industrial-blue line-clamp-2">
                        {recipe.name}
                      </h3>
                      <p className="text-tool-gray text-sm mb-3 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-tool-gray">
                        <span className="flex items-center">
                          <Users size={12} className="mr-1" />
                          {recipe.servings}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-energetic-orange hover:text-red-600 p-0 h-auto"
                          data-testid={`view-recipe-${recipe.id}`}
                        >
                          <ArrowRight size={14} className="mr-1" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-12">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrevious}
                    onClick={() => setPage(page - 1)}
                    data-testid="pagination-prev"
                  >
                    Previous
                  </Button>
                  <span className="text-tool-gray">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!pagination.hasNext}
                    onClick={() => setPage(page + 1)}
                    data-testid="pagination-next"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
