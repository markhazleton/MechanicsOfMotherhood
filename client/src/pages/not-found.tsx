import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import { generateBreadcrumbs } from "@/utils/seo-helpers";

export default function NotFound() {
  const breadcrumbs = generateBreadcrumbs('/404');
  return (
  <div className="min-h-screen bg-warm-cream flex flex-col">
      <Navigation />
  <div className="bg-warm-cream border-b border-warm-peach/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>
      <div className="flex-1 w-full flex items-center justify-center px-4">
        <Card className="w-full max-w-md mx-4 bg-white rounded-xl shadow-md border border-warm-peach/30">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2 items-center">
              <AlertCircle className="h-8 w-8 text-accent-600" />
              <h1 className="font-display text-2xl font-bold text-brand-800">404 Page Not Found</h1>
            </div>
            <p className="mt-4 text-sm text-neutral-700">
              The page you were looking for doesn't exist or was moved.
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
