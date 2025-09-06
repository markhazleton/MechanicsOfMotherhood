import React from 'react';
import { Switch, Route, Router } from 'wouter';
import * as HelmetAsync from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import Home from '@/pages/home';
import Recipes from '@/pages/recipes';
import RecipeDetail from '@/pages/recipe-detail';
import Categories from '@/pages/categories';
import CategoryRecipes from '@/pages/category-recipes';
import Blog from '@/pages/blog';
import NotFound from '@/pages/not-found';

// Debug validation to ensure imports are defined during SSR build
if (typeof Home !== 'function') console.warn('[SSR] Home component undefined');
if (typeof Recipes !== 'function') console.warn('[SSR] Recipes component undefined');
if (typeof RecipeDetail !== 'function') console.warn('[SSR] RecipeDetail component undefined');
if (typeof Categories !== 'function') console.warn('[SSR] Categories component undefined');
if (typeof CategoryRecipes !== 'function') console.warn('[SSR] CategoryRecipes component undefined');
if (typeof Blog !== 'function') console.warn('[SSR] Blog component undefined');
if (typeof NotFound !== 'function') console.warn('[SSR] NotFound component undefined');
const HelmetProvider = (HelmetAsync as any).HelmetProvider || (({ children }: any) => children);
if ((HelmetAsync as any).HelmetProvider === undefined) console.warn('[SSR] HelmetProvider undefined (using pass-through)');
if (typeof QueryClientProvider !== 'function') console.warn('[SSR] QueryClientProvider undefined');

interface AppSSRProps { ssrPath: string; helmetContext?: any }
const AppSSR: React.FC<AppSSRProps> = ({ ssrPath, helmetContext }) => {
  return (
  <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <Router base="" ssrPath={ssrPath}>
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
      </QueryClientProvider>
    </HelmetProvider>
  );
};
export default AppSSR;
