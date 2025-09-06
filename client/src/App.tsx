import React from "react";
import { Switch, Route, Router } from "wouter";
import * as HelmetAsync from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import PageSkeleton from "@/components/page-skeleton";
import { ErrorBoundary } from "@/components/error-boundary";
import { logError } from '@/utils/error-logger';

// Direct imports (SSR-friendly; trade-off: larger initial bundle, acceptable for full SSG)
import Home from "@/pages/home";
import Recipes from "@/pages/recipes";
import RecipeDetail from "@/pages/recipe-detail";
import Categories from "@/pages/categories";
import CategoryRecipes from "@/pages/category-recipes";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";

// Configure base path for GitHub Pages.
// If a custom domain is configured, deploy at root.
// Otherwise use the repository name sub-path.
let basePath = "";
const isProd = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.PROD) || process.env.NODE_ENV === 'production';
if (isProd) {
  // For production, we know this site has a custom domain configured
  // The CNAME file indicates mechanicsofmotherhood.com is the custom domain
  // So we can safely use root path for all production builds
  basePath = ""; // custom domain root
}

interface AppRouterProps { ssrPath?: string }

function AppRouter({ ssrPath }: AppRouterProps) {
  return (
    <Router base={basePath} ssrPath={ssrPath}>
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

interface AppProps { ssrPath?: string; helmetContext?: any }

function App({ ssrPath, helmetContext }: AppProps) {
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
      {React.createElement((HelmetAsync as any).HelmetProvider || React.Fragment, { context: helmetContext },
        <TooltipProvider>
          <Toaster />
          <AppRouter ssrPath={ssrPath} />
        </TooltipProvider>
      )}
    </ErrorBoundary>
  );
}

export default App;
