import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Recipes from "@/pages/recipes";
import RecipeDetail from "@/pages/recipe-detail";
import Categories from "@/pages/categories";
import CategoryRecipes from "@/pages/category-recipes";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";

// Configure base path for GitHub Pages
const basePath = import.meta.env.PROD ? "/MechanicsOfMotherhood" : "";

function AppRouter() {
  return (
    <Router base={basePath}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/recipes" component={Recipes} />
        <Route path="/recipe/:slug" component={RecipeDetail} />
        <Route path="/categories" component={Categories} />
        <Route path="/recipes/category/:categorySlug" component={CategoryRecipes} />
        <Route path="/blog" component={Blog} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
