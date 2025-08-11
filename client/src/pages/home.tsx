import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturedRecipes from "@/components/featured-recipes";
import BlogSection from "@/components/blog-section";
import CommunitySection from "@/components/community-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-light-gray">
      <Navigation />
      <HeroSection />
      <FeaturedRecipes />
      <BlogSection />
      <CommunitySection />
      <Footer />
    </div>
  );
}
