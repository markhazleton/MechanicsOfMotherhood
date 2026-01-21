import { Users, Heart, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import apiData from "@/data/api-data.json";

export default function CommunitySection() {
  const { metadata: stats } = apiData;

  return (
    <section className="py-16 md:py-20 bg-muted/30 dark:bg-muted/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose MoM Recipes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real recipes tested by real families. Simple, delicious, and designed for busy lives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 bg-card border-border">
            <CardContent className="pt-4">
              <div className="bg-accent-100 dark:bg-accent-900/40 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-accent-600 dark:text-accent-400" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Growing Collection</h3>
              <p className="text-muted-foreground text-sm">
                Browse <span className="font-semibold text-foreground" data-testid="community-members-count">
                  {stats?.totalRecipes || "100"}+
                </span> recipes across {stats?.totalCategories || "14"} categories.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 bg-card border-border">
            <CardContent className="pt-4">
              <div className="bg-accent-100 dark:bg-accent-900/40 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-accent-600 dark:text-accent-400" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Family Tested</h3>
              <p className="text-muted-foreground text-sm">
                Every recipe is tested by real families for taste and ease.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 bg-card border-border">
            <CardContent className="pt-4">
              <div className="bg-accent-100 dark:bg-accent-900/40 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-accent-600 dark:text-accent-400" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Easy to Follow</h3>
              <p className="text-muted-foreground text-sm">
                Clear instructions and ingredient lists make cooking stress-free.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
