import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import { generateBreadcrumbs } from "@/utils/seo-helpers";

export default function NotFound() {
  const breadcrumbs = generateBreadcrumbs('/404');
  return (
  <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
  <div className="bg-white border-b border-[hsl(var(--color-border))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>
      <div className="flex-1 w-full flex items-center justify-center px-4">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              The page you were looking for doesn’t exist or was moved.
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
