import { Wrench } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function BlogSection() {
  const [, navigate] = useLocation();
  
  return (
    <section id="blog" className="py-16 bg-kitchen-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Wrench className="text-tool-gray text-2xl mr-3" />
            <h2 className="font-industrial text-3xl md:text-4xl font-bold text-industrial-blue">
              MoM's Maintenance Manual
            </h2>
            <Wrench className="text-tool-gray text-2xl ml-3" />
          </div>
          <p className="text-tool-gray text-lg max-w-2xl mx-auto">
            Real stories, practical tips, and maintenance logs from the trenches of working motherhood.
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-xl p-8 mechanical-shadow text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-workshop-teal rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-mechanical text-xl font-bold text-industrial-blue mb-3">
            Manual Coming Soon!
          </h3>
          <p className="text-tool-gray mb-6">
            We're crafting insightful articles and practical tips for working mothers. 
            Check back soon for our maintenance manual!
          </p>
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="gear-border bg-white hover:bg-gray-50 text-tool-gray px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            data-testid="button-view-complete-manual"
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
