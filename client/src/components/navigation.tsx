import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Home, BookOpen, LayoutGrid, Newspaper, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAnalytics } from "@/hooks/useAnalytics";
import { searchRecipes } from "@/data/api-loader";
import DarkModeToggle from "@/components/dark-mode-toggle";
import SITE_CONFIG from "@/lib/site-config";
const logoIcon = "/images/logos/MOM-Logo-Icon.png";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/recipes/", label: "Recipes", icon: BookOpen },
  { href: "/categories/", label: "Categories", icon: LayoutGrid },
  { href: "/blog/", label: "Blog", icon: Newspaper },
];

function normalizePath(path: string): string {
  const clean = (path || "/").split(/[?#]/)[0] || "/";
  if (clean === "/") return "/";
  return clean.replace(/\/+$/, "");
}

export default function Navigation() {
  const [location, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const analytics = useAnalytics();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();

    if (query) {
      const resultCount = searchRecipes(query).length;
      analytics.trackSearch(query, resultCount, 'global');
      analytics.trackFormSubmit('navigation_search', {
        search_term: query,
        current_page: location
      });
      navigate(`/recipes/?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const isActive = (href: string) => {
    const current = normalizePath(location);
    const target = normalizePath(href);
    if (target === "/") return current === "/";
    // Recipe detail and category pages live under the Recipes / Categories sections
    if (target === "/recipes") return current === "/recipes" || current.startsWith("/recipe/");
    return current === target || current.startsWith(`${target}/`);
  };

  const testId = (label: string) => `nav-link-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <nav
      aria-label="Main"
      className="navigation sticky top-0 z-50 border-b border-border-subtle bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80"
    >
      <div className="site-container flex h-[72px] items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-3 rounded-md" data-testid="logo-link">
          <img
            src={logoIcon}
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-md object-contain dark:bg-cream dark:p-0.5"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-extrabold tracking-[-0.02em] text-foreground">
              {SITE_CONFIG.name.short}<span className="text-primary dark:text-brand-200"> Recipes</span>
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {SITE_CONFIG.name.full}
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-sm px-3.5 py-2 text-[15px] font-medium transition-colors duration-[120ms] ${
                  active
                    ? "text-primary-ink after:absolute after:inset-x-3.5 after:-bottom-[17px] after:h-0.5 after:bg-primary dark:after:bg-brand-300"
                    : "text-body hover:text-link-hover"
                }`}
                data-testid={testId(label)}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Search, theme, mobile menu */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative hidden md:block" role="search">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} aria-hidden="true" />
            <Input
              type="search"
              aria-label="Search recipes"
              placeholder="Search recipes…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-56 pl-9 xl:w-64"
              data-testid="search-input"
            />
          </form>
          <div className="hidden md:block">
            <DarkModeToggle className="dark-mode-toggle" />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden [&_svg]:size-[22px]"
                aria-label="Open menu"
                data-testid="mobile-menu-button"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[380px]">
              <SheetTitle className="eyebrow mt-1">Menu</SheetTitle>
              <form onSubmit={handleSearch} className="relative mt-6" role="search">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} aria-hidden="true" />
                <Input
                  type="search"
                  aria-label="Search recipes"
                  placeholder="Search recipes…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="mobile-search-input"
                />
              </form>
              <div className="mt-6 flex flex-col gap-1">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium transition-colors ${
                        active
                          ? "bg-primary-soft text-primary-ink"
                          : "text-body hover:bg-secondary"
                      }`}
                      data-testid={`mobile-${testId(label)}`}
                    >
                      <Icon size={18} aria-hidden="true" />
                      {label}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
                <span className="text-sm font-medium text-muted-foreground">Theme</span>
                <DarkModeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
