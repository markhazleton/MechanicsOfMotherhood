import { Clock } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import SeoHead from "@/components/seo/SeoHead";
import { generateBreadcrumbs, generateBlogStructuredData } from "@/utils/seo-helpers";

export default function Blog() {
  const breadcrumbs = generateBreadcrumbs('/blog');
  const blogStructuredData = generateBlogStructuredData();
  return (
  <div className="min-h-screen bg-surface-base text-text-base">
      <SeoHead
        title="Mechanics of Motherhood Blog"
        description="Tips, tricks, and stories from the Mechanics of Motherhood workshop. Meal planning, cooking efficiency, and family-friendly kitchen engineering."
        url="https://mechanicsofmotherhood.com/blog"
        keywords={["mom blog", "family cooking tips", "meal planning", "kitchen organization", "busy mom recipes"]}
        structuredData={blogStructuredData}
      />
      <Navigation />
      {/* Breadcrumb Navigation */}
  <div className="bg-surface-subtle border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>
      
  {/* Header */}
  <section className="bg-gradient-to-r from-brand-900 to-accent-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
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
              <div className="bg-surface-card rounded-xl p-8 shadow border border-border-subtle">
                <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  Coming Soon!
                </h2>
                <p className="text-text-muted mb-6">
                  We're working hard to bring you insightful articles, cooking tips, and family stories. 
                  Check back soon for our latest blog posts!
                </p>
                <p className="text-sm text-text-subtle">
                  In the meantime, explore our{" "}
                  <Link href="/recipes" className="text-brand-600 hover:text-accent-600 font-semibold">
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
