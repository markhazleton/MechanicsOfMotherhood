import { Clock } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Blog() {
  return (
    <div className="min-h-screen bg-light-gray">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-industrial-blue to-workshop-teal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-mechanical text-4xl md:text-5xl font-bold mb-4">
            MoM's Workshop Blog
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Tips, tricks, and stories from the mechanics of motherhood
          </p>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl p-8 mechanical-shadow">
                <div className="w-16 h-16 bg-workshop-teal rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-mechanical text-2xl font-bold text-industrial-blue mb-4">
                  Coming Soon!
                </h2>
                <p className="text-tool-gray mb-6">
                  We're working hard to bring you insightful articles, cooking tips, and family stories. 
                  Check back soon for our latest blog posts!
                </p>
                <p className="text-sm text-tool-gray">
                  In the meantime, explore our{" "}
                  <Link href="/recipes" className="text-workshop-teal hover:text-energetic-orange font-semibold">
                    recipe collection
                  </Link>
                  {" "}for some culinary inspiration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
