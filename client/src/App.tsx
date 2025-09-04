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

// Configure base path for GitHub Pages
const basePath = import.meta.env.PROD ? "/MechanicsOfMotherhood" : "";

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
