import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy } from "react";
import PageSkeleton from "@/components/page-skeleton";
import { ErrorBoundary } from "@/components/error-boundary";
import { logError } from '@/utils/error-logger';

// Lazy load page components for code splitting
const Home = lazy(() => import("@/pages/home"));
const Recipes = lazy(() => import("@/pages/recipes"));
const RecipeDetail = lazy(() => import("@/pages/recipe-detail"));
const Categories = lazy(() => import("@/pages/categories"));
const CategoryRecipes = lazy(() => import("@/pages/category-recipes"));
const Blog = lazy(() => import("@/pages/blog"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Configure base path for GitHub Pages.
// If a custom domain is configured, deploy at root.
// Otherwise use the repository name sub-path.
let basePath = "";
if (import.meta.env.PROD) {
  // Check if we're running on the custom domain
  try {
    const host = typeof window !== 'undefined' ? window.location.host : '';
    
    // If running on the custom domain mechanicsofmotherhood.com, use root path
    if (host === 'mechanicsofmotherhood.com' || host === 'www.mechanicsofmotherhood.com') {
      basePath = ""; // custom domain root
    } else {
      basePath = "/MechanicsOfMotherhood"; // GitHub Pages sub-path fallback
    }
  } catch {
    basePath = "/MechanicsOfMotherhood"; // safe fallback
  }
}

function AppRouter() {
  return (
    <Router base={basePath}>
      <Suspense fallback={<PageSkeleton />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/recipes" component={Recipes} />
          <Route path="/recipe/:slug" component={RecipeDetail} />
          <Route path="/categories" component={Categories} />
          <Route path="/recipes/category/:categorySlug" component={CategoryRecipes} />
          <Route path="/blog" component={Blog} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary onErrorCapture={(error, info, errorId) => {
      logError({
        message: error.message,
        stack: error.stack,
        name: error.name,
  componentStack: info.componentStack || undefined,
        errorId,
        time: new Date().toISOString()
      });
    }}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
