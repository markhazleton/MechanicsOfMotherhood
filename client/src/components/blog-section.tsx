import { Wrench } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function BlogSection() {
  const [, navigate] = useLocation();
  
  return (
  <section id="blog" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Wrench className="text-teal-600 text-2xl mr-3" />
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-blue-900">
              MoM's Maintenance Manual
            </h2>
            <Wrench className="text-teal-600 text-2xl ml-3" />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real stories, practical tips, and maintenance logs from the trenches of working motherhood.
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-xl p-8 shadow text-center max-w-md mx-auto border border-slate-100">
          <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-blue-900 mb-3">
            Manual Coming Soon!
          </h3>
          <p className="text-gray-600 mb-6">
            We're crafting insightful articles and practical tips for working mothers. 
            Check back soon for our maintenance manual!
          </p>
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="bg-white/95 text-blue-900 border border-slate-200 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 motion-safe:transform motion-safe:hover:scale-[1.03]"
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
