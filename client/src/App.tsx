import React, { useEffect, useRef } from "react";
import { Switch, Route, Router, useLocation } from "wouter";
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
import Categories from "@/pages/categories"; 
import NotFound from "@/pages/not-found"; 
// Lazy loaded heavy/less critical routes 
const RecipeDetail = React.lazy(() => import('./pages/recipe-detail')); 
const CategoryRecipes = React.lazy(() => import('./pages/category-recipes')); 
const Blog = React.lazy(() => import('./pages/blog')); 

// Configure base path for GitHub Pages.
// If a custom domain is configured, deploy at root.
// Otherwise use the repository name sub-path.
let basePath = "";
const isProd = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD) || process.env.NODE_ENV === 'production';
if (isProd) {
  // For production, we know this site has a custom domain configured
  // The CNAME file indicates mechanicsofmotherhood.com is the custom domain
  // So we can safely use root path for all production builds
  basePath = ""; // custom domain root
}

interface AppRouterProps { ssrPath?: string }

function AppRouter({ ssrPath }: AppRouterProps) {
  // Track location changes for focus management
  const [location] = useLocation();
  const mainRef = useRef<HTMLElement | null>(null);
  const h1Ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    const id = window.requestAnimationFrame(() => {
      // Find first visible h1 inside main if not already stored
      if (mainRef.current) {
        const firstH1 = mainRef.current.querySelector('h1');
        if (firstH1 instanceof HTMLHeadingElement) {
          h1Ref.current = firstH1;
        }
      }

      if (h1Ref.current) {
        h1Ref.current.setAttribute('tabIndex', '-1');
        h1Ref.current.focus({ preventScroll: true });
      } else if (mainRef.current) {
        mainRef.current.setAttribute('tabIndex', '-1');
        mainRef.current.focus({ preventScroll: true });
      }

      // Announce page load for SR users
      const live = document.getElementById('app-live-region');
      if (live) {
        const pageTitle = h1Ref.current?.textContent?.trim() || document.title || 'Page loaded';
        live.textContent = '';
        window.requestAnimationFrame(() => {
          live.textContent = `${pageTitle} loaded`;
        });
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [location]);

  return (
    <Router base={basePath} ssrPath={ssrPath}>
      {/* Skip Link */}
      <a
        href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] bg-brand-900 text-white px-4 py-2 rounded shadow-md"
      >
        Skip to content
      </a>
      {/* Live region for announcements (search / notifications) */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="app-live-region" />

      <Suspense fallback={<PageSkeleton />}>
        <main id="main-content" ref={mainRef} className="focus:outline-none">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/recipes" component={Recipes} />
            <Route path="/recipe/:slug" component={RecipeDetail} /> 
            <Route path="/categories" component={Categories} />
            <Route path="/recipes/category/:categorySlug" component={CategoryRecipes} />
            <Route path="/blog" component={Blog} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </Suspense>
    </Router>
  );
}

interface AppProps { ssrPath?: string; helmetContext?: Record<string, unknown> }

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
      {React.createElement((HelmetAsync as Record<string, unknown>).HelmetProvider as React.ComponentType<{context?: unknown}> || React.Fragment, { context: helmetContext },
        <TooltipProvider>
          <Toaster />
          {/* Reduced motion helper class */}
          <style>{`
            @media (prefers-reduced-motion: reduce) {
              .motion-safe:hover:scale-105:hover { transform: none; }
              .motion-safe:transition-none { transition: none !important; }
            }
          `}</style>
          <AppRouter ssrPath={ssrPath} />
        </TooltipProvider>
      )}
    </ErrorBoundary>
  );
}

export default App;
