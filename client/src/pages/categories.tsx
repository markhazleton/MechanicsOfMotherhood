import { Link } from "wouter";
import { ArrowRight, ChefHat } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import { generateBreadcrumbs } from "@/utils/seo-helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategorySlug } from "@/utils/slugify";
import { getApiData } from "@/data/api-loader";

export default function Categories() {
  const apiData = getApiData();
  const categories = apiData?.categories || [];
  const recipes = apiData?.recipes || [];

  // Calculate recipe counts for each category
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    recipeCount: recipes.filter(recipe => recipe.recipeCategoryID === category.id).length
  }));

  const breadcrumbs = generateBreadcrumbs('/categories');

  return (
  <div className="min-h-screen bg-warm-cream">
      <Navigation />
      {/* Breadcrumb Navigation */}
  <div className="bg-warm-cream border-b border-warm-peach/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>

      {/* Header */}
  <section className="bg-gradient-to-b from-warm-peach/20 to-transparent py-16 border-b border-warm-peach/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display heading-xl text-brand-800 mb-4">
              Recipe Categories
            </h1>
            <p className="text-neutral-700 text-lg max-w-2xl mx-auto">
              Browse our organized collection of tested recipes by category
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoriesWithCounts.map((category: any) => {
              const slug = getCategorySlug(category.name);
              return (
                <Link
                  key={category.id}
                  href={`/recipes/category/${slug}`}
                  data-testid={`category-card-${category.id}`}
                >
                  <Card className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg motion-safe:hover:scale-[1.02] motion-safe:transform transition-all duration-300 cursor-pointer border border-warm-peach/30">
                    <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white">
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
                    <CardContent className="p-4 bg-warm-cream/50">
                      <div className="flex items-center justify-between">
                        <Badge variant="accent">
                          {category.recipeCount} Recipe{category.recipeCount !== 1 ? 's' : ''}
                        </Badge>
                        <ArrowRight size={16} className="text-accent-600" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Empty State */}
          {categoriesWithCounts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-md border border-warm-peach/30">
              <ChefHat size={64} className="mx-auto text-accent-500 mb-4" />
              <h3 className="text-xl font-semibold text-brand-800 mb-2">
                No Categories Available
              </h3>
              <p className="text-neutral-700">
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