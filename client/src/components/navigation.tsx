import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Settings, Utensils, Search, Home, BookOpen, Wrench, UserCheck, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAnalytics } from "@/hooks/useAnalytics";
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
      console.log("Search query:", searchQuery);
    }
  };

  const navLinks = [
    { href: "/", label: "Workshop", icon: Home },
    { href: "/recipes", label: "Recipe Manual", icon: BookOpen },
    { href: "/blog", label: "Maintenance Log", icon: Wrench },
  ];

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => (
    <Link
      href={href}
      className={`flex items-center space-x-2 text-[hsl(var(--color-tool-gray))] hover:text-[hsl(var(--color-energetic-orange))] font-medium transition-colors ${
        location === href ? "text-[hsl(var(--color-energetic-orange))]" : ""
      }`}
      data-testid={`nav-link-${label.toLowerCase().replace(" ", "-")}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg mechanical-shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" data-testid="logo-link">
            <div className="relative">
              <img 
                src={logoIcon}
                alt="MoM Logo Icon"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  console.error('Logo failed to load from:', e.currentTarget.src);
                  // Fallback to Lucide icons if image fails
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback to original icons if image fails to load */}
              <div className="hidden">
                <Settings className="text-tool-gray text-3xl animate-spin-slow" />
                <Utensils className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[hsl(var(--color-energetic-orange))] text-sm" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="font-mechanical text-2xl font-bold text-[hsl(var(--color-industrial-blue))]">MoM</h1>
              <span className="text-xs text-[hsl(var(--color-tool-gray))] font-industrial -mt-1">MECHANICS OF MOTHERHOOD</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tool-gray" size={16} />
              <Input
                type="text"
                placeholder="MoM's Tool Finder..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-medium-gray rounded-lg focus:ring-2 focus:ring-workshop-teal focus:border-transparent"
                data-testid="search-input"
              />
            </form>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden" data-testid="mobile-menu-button">
                  <Menu className="text-tool-gray" size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} />
                  ))}
                  
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative mt-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tool-gray" size={16} />
                    <Input
                      type="text"
                      placeholder="MoM's Tool Finder..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
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
