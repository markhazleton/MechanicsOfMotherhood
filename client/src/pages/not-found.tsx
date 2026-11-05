import { Link } from "wouter";
import { ArrowRight, Compass } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import SeoHead from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { generateBreadcrumbs, generateCanonicalUrl } from "@/utils/seo-helpers";

export default function NotFound() {
  const breadcrumbs = generateBreadcrumbs('/404');
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SeoHead
        title="404 Page Not Found"
        description="The page you were looking for does not exist."
        url={generateCanonicalUrl("/404")}
        robots="noindex, nofollow"
      />
      <Navigation />
      <div className="breadcrumb-nav border-b border-border-subtle">
        <div className="site-container py-3">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>
      <div className="site-container flex flex-1 items-center py-16 md:py-24">
        <div className="max-w-xl">
          <span className="mb-6 grid size-14 place-items-center rounded-md bg-primary-soft text-primary-ink">
            <Compass size={26} aria-hidden="true" />
          </span>
          <p className="eyebrow mb-4">Error 404</p>
          <h1 className="font-display text-[clamp(2.25rem,3.5vw+1rem,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground">
            Page not found
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            The page you were looking for doesn't exist or was moved.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/recipes/">
                Browse recipes
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
