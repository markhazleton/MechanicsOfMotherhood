import { Clock } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import SeoHead from "@/components/seo/SeoHead";
import { generateBreadcrumbs, generateBlogStructuredData } from "@/utils/seo-helpers";
import SITE_CONFIG from "@/lib/site-config";

export default function Blog() {
  const breadcrumbs = generateBreadcrumbs('/blog');
  const blogStructuredData = generateBlogStructuredData();
  return (
  <div className="min-h-screen bg-warm-cream">
      <SeoHead
        title={`${SITE_CONFIG.name.full} (${SITE_CONFIG.name.short}) Blog`}
        description={`Tips, tricks, and stories from ${SITE_CONFIG.name.full}. Meal planning, cooking tips, and family-friendly recipes.`}
        url={`${SITE_CONFIG.baseUrl}/blog`}
        keywords={["mom blog", "family cooking tips", "meal planning", "busy mom recipes"]}
        structuredData={blogStructuredData}
      />
      <Navigation />
      {/* Breadcrumb Navigation */}
  <div className="bg-warm-cream border-b border-warm-peach/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>

  {/* Header */}
  <section className="bg-gradient-to-r from-brand-800 to-accent-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {SITE_CONFIG.name.short}'s Blog
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Tips, tricks, and stories from real moms
          </p>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-md border border-warm-peach/30">
                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-brand-800 mb-4">
                  Coming Soon!
                </h2>
                <p className="text-neutral-700 mb-6">
                  We're working hard to bring you insightful articles, cooking tips, and family stories.
                  Check back soon for our latest blog posts!
                </p>
                <p className="text-sm text-neutral-600">
                  In the meantime, explore our{" "}
                  <Link href="/recipes" className="text-accent-600 hover:text-accent-700 font-semibold">
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
