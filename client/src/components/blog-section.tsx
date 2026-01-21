import { Newspaper, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function BlogSection() {
  const [, navigate] = useLocation();

  return (
    <section id="blog" className="py-16 md:py-20 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From the Blog
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cooking tips, meal planning ideas, and stories from our kitchen to yours.
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-card rounded-2xl p-8 md:p-10 text-center max-w-lg mx-auto border border-border shadow-sm">
          <div className="w-14 h-14 bg-accent-100 dark:bg-accent-900/40 rounded-full flex items-center justify-center mx-auto mb-5">
            <Newspaper className="w-7 h-7 text-accent-600 dark:text-accent-400" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Coming Soon
          </h3>
          <p className="text-muted-foreground mb-6">
            We're working on helpful articles and cooking tips. Check back soon for new content.
          </p>
          <Button
            variant="outline"
            className="px-6"
            data-testid="button-view-blog"
            aria-label="View blog page"
            onClick={() => navigate('/blog')}
          >
            Visit Blog
            <ArrowRight className="ml-2" size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
