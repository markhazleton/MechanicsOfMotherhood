import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, ChefHat } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import LoadingSpinner from "@/components/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategorySlug } from "@/utils/slugify";
import type { CategoriesResponse } from "@/data/api-types";

export default function Categories() {
  const { data: categoriesData, isLoading } = useQuery<CategoriesResponse>({
    queryKey: ["/api/categories"],
  });

  const categories = categoriesData?.categories || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gray">
        <Navigation />
        <div className="py-16">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <Navigation />
      
      {/* Header */}
      <section className="bg-white py-12 border-b border-medium-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-mechanical text-4xl font-bold text-industrial-blue mb-4">
              Recipe Categories
            </h1>
            <p className="text-tool-gray text-lg max-w-2xl mx-auto">
              Browse our organized collection of tested recipes by category
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category: any) => {
              const slug = getCategorySlug(category.name);
              return (
                <Link
                  key={category.id}
                  href={`/recipes/category/${slug}`}
                  data-testid={`category-card-${category.id}`}
                >
                  <Card className="gear-border bg-white rounded-xl overflow-hidden mechanical-shadow hover:transform hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="bg-gradient-to-br from-workshop-teal to-industrial-blue p-8 text-white">
                      <ChefHat size={32} className="mb-4" />
                      <h3 className="font-bold text-xl mb-2">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-white/80 text-sm line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-energetic-orange text-white">
                          Recipes Available
                        </Badge>
                        <ArrowRight size={16} className="text-tool-gray" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Empty State */}
          {categories.length === 0 && (
            <div className="text-center py-12">
              <ChefHat size={64} className="mx-auto text-tool-gray mb-4" />
              <h3 className="text-xl font-bold text-industrial-blue mb-2">
                No Categories Available
              </h3>
              <p className="text-tool-gray">
                Categories are being loaded from our recipe collection.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}