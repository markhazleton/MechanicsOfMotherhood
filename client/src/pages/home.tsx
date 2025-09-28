import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturedRecipes from "@/components/featured-recipes";
import BlogSection from "@/components/blog-section";
import CommunitySection from "@/components/community-section";
import Footer from "@/components/footer";
import SeoHead from "@/components/seo/SeoHead";
import { generateWebsiteStructuredData, generateOrganizationStructuredData } from "@/components/seo/StructuredData";

export default function Home() {
  // Generate structured data for homepage
  const websiteStructuredData = generateWebsiteStructuredData();
  const organizationStructuredData = generateOrganizationStructuredData();
  
  // Combine structured data
  const combinedStructuredData = [websiteStructuredData, organizationStructuredData];

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Head for homepage */}
      <SeoHead
        title="Mechanics of Motherhood - Engineering Better Meals"
        description="Engineering better meals for working mothers worldwide. Tested recipes, kitchen tools, and meal planning solutions for busy families."
        keywords={[
          'working mother recipes',
          'quick family meals',
          'easy dinner recipes',
          'meal planning for busy moms',
          'kitchen organization',
          'family cooking',
          'time-saving recipes',
          'healthy meal prep'
        ]}
        url="https://sharesmallbiz-support.github.io/MechanicsOfMotherhood/"
        type="website"
        structuredData={combinedStructuredData}
      />
      
      <Navigation />
      <HeroSection />
      <FeaturedRecipes />
      <BlogSection />
      <CommunitySection />
      <Footer />
    </div>
  );
}
