import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Home, BookOpen, Newspaper, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAnalytics } from "@/hooks/useAnalytics";
import DarkModeToggle from "@/components/dark-mode-toggle";
import SITE_CONFIG from "@/lib/site-config";
const logoIcon = "/images/logos/MOM-Logo-Icon.png";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const analytics = useAnalytics();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      analytics.trackSearch(searchQuery, 0, 'global');
      analytics.trackFormSubmit('navigation_search', {
        search_term: searchQuery,
        current_page: location
      });
      // TODO: Implement search functionality
      console.warn("Search functionality not yet implemented:", searchQuery);
    }
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/recipes", label: "Recipes", icon: BookOpen },
    { href: "/blog", label: "Blog", icon: Newspaper },
  ];

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ size?: number }> }) => {
    const active = location === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 ${active ? "text-accent-600 bg-accent-50 dark:bg-accent-900/30 dark:text-accent-400" : "text-neutral-700 dark:text-neutral-300 hover:text-accent-600 dark:hover:text-accent-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
        data-testid={`nav-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" data-testid="logo-link">
            <div className="relative">
              <img
                src={logoIcon}
                alt="MoM Logo"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  console.error('Logo failed to load from:', e.currentTarget.src);
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback icon */}
              <div className="hidden h-10 w-10 bg-accent-500 rounded-full flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-foreground">{SITE_CONFIG.name.short} Recipes</h1>
              <span className="text-xs text-muted-foreground font-medium -mt-0.5">{SITE_CONFIG.name.tagline}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-background border-border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                data-testid="search-input"
              />
            </form>
            <div className="hidden md:block">
              <DarkModeToggle className="dark-mode-toggle" />
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2" data-testid="mobile-menu-button">
                  <Menu className="text-foreground" size={22} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
                <div className="flex flex-col space-y-2 mt-6">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} />
                  ))}
                  <div className="pt-4 mt-4 border-t border-border">
                    <DarkModeToggle className="w-full justify-center" />
                  </div>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      type="text"
                      placeholder="Search recipes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background border-border"
                      data-testid="mobile-search-input"
                    />
                  </form>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
