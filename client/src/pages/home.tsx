import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturedRecipes from "@/components/featured-recipes";
import BlogSection from "@/components/blog-section";
import CommunitySection from "@/components/community-section";
import Footer from "@/components/footer";
import SeoHead from "@/components/seo/SeoHead";
import { generateWebsiteStructuredData, generateOrganizationStructuredData } from "@/components/seo/StructuredData";
import SITE_CONFIG from "@/lib/site-config";

export default function Home() {
  // Generate structured data for homepage
  const websiteStructuredData = generateWebsiteStructuredData();
  const organizationStructuredData = generateOrganizationStructuredData();
  
  // Combine structured data
  const combinedStructuredData = [websiteStructuredData, organizationStructuredData];

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      {/* SEO Head for homepage */}
      <SeoHead
        title={SITE_CONFIG.seo.title}
        description={SITE_CONFIG.seo.description}
        keywords={SITE_CONFIG.seo.keywords}
        url={`${SITE_CONFIG.baseUrl}/`}
        type="website"
        structuredData={combinedStructuredData}
      />
      
      <Navigation />
      <HeroSection />
      <FeaturedRecipes />
      <BlogSection />
      <CommunitySection />
      <Footer />
    </main>
  );
}
