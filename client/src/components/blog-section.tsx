import { Wrench } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function BlogSection() {
  const [, navigate] = useLocation();
  
  return (
  <section id="blog" className="py-16 bg-warm-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Wrench className="text-accent-600 text-2xl mr-3" />
            <h2 className="font-display heading-xl text-brand-800">
              MoM's Maintenance Manual
            </h2>
            <Wrench className="text-accent-600 text-2xl ml-3" />
          </div>
          <p className="text-neutral-700 text-lg max-w-2xl mx-auto">
            Real stories, practical tips, and maintenance logs from the trenches of working motherhood.
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-xl p-8 shadow-md text-center max-w-md mx-auto border border-warm-peach/30">
          <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-display heading-md text-brand-800 mb-3">
            Manual Coming Soon!
          </h3>
          <p className="text-neutral-700 mb-6">
            We're crafting insightful articles and practical tips for working mothers.
            Check back soon for our maintenance manual!
          </p>
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="btn btn-outline-brand px-8 py-4 shadow-sm hover:shadow-md motion-safe:transform motion-safe:hover:scale-[1.03]"
            data-testid="button-view-complete-manual"
            aria-label="View full blog page"
            onClick={() => navigate('/blog')}
          >
            <Wrench className="mr-2" size={20} />
            View Blog Page
          </Button>
        </div>
      </div>
    </section>
  );
}
