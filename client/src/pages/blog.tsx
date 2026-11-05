import { ArrowRight, Clock } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import PageHeader from "@/components/page-header";
import SeoHead from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { generateBreadcrumbs, generateBlogStructuredData } from "@/utils/seo-helpers";
import SITE_CONFIG from "@/lib/site-config";

export default function Blog() {
  const breadcrumbs = generateBreadcrumbs('/blog');
  const blogStructuredData = generateBlogStructuredData();
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={`${SITE_CONFIG.name.full} (${SITE_CONFIG.name.short}) Blog`}
        description={`Tips, tricks, and stories from ${SITE_CONFIG.name.full}. Meal planning, cooking tips, and family-friendly recipes.`}
        url={`${SITE_CONFIG.baseUrl}/blog`}
        keywords={["mom blog", "family cooking tips", "meal planning", "busy mom recipes"]}
        structuredData={blogStructuredData}
      />
      <Navigation />

      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="The MoM blog"
        title={`${SITE_CONFIG.name.short}'s blog`}
        description="Tips, tricks, and stories from real moms — meal planning, cooking know-how, and life around the family table."
      />

      <section className="py-12 md:py-16">
        <div className="site-container">
          <div className="max-w-2xl rounded-lg border border-border border-t-[3px] border-t-primary bg-card p-8 shadow-sm md:p-10">
            <span className="mb-6 grid size-14 place-items-center rounded-md bg-primary-soft text-primary-ink">
              <Clock size={26} aria-hidden="true" />
            </span>
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Coming soon
            </h2>
            <p className="mt-4 text-body">
              We're working on helpful articles, cooking tips, and family stories. Check back
              soon for our first posts.
            </p>
            <p className="mt-3 text-muted-foreground">
              In the meantime, the recipe collection has plenty of inspiration.
            </p>
            <Button asChild className="mt-8">
              <Link href="/recipes/">
                Explore recipes
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
