import { useEffect, useState } from 'react';
import { Link } from "wouter";
import SITE_CONFIG from "@/lib/site-config";
const logoIcon = "/images/logos/MOM-Logo-Icon.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [buildInfo, setBuildInfo] = useState<{hash:string; date:string} | null>(null);

  useEffect(() => {
    const meta = document.querySelector('meta[name="app-build"]') as HTMLMetaElement | null;
    if (meta?.content) {
      const parts = meta.content.split('-');
      if (parts.length > 1) {
        const iso = parts.slice(0, parts.length - 1).join('-');
        const last = parts[parts.length - 1] || '';
        const shortHash = last.slice(0,10);
        const parsedDate = new Date(iso);
        setBuildInfo({ hash: shortHash, date: isNaN(parsedDate.getTime()) ? iso : parsedDate.toLocaleString() });
      }
      return;
    }
    fetch('/build-version.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.hash || data?.buildTime) {
          setBuildInfo({
            hash: (data.hash || '').slice(0,10),
            date: data.buildTime ? new Date(data.buildTime).toLocaleString() : ''
          });
        }
      })
      .catch(() => {});
  }, []);

  const linkClasses = "text-neutral-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 rounded";

  return (
    <footer className="bg-neutral-900 text-white py-12 md:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={logoIcon}
                alt={`${SITE_CONFIG.name.short} Recipes`}
                className="h-10 w-10 object-contain filter brightness-0 invert"
              />
              <div>
                <h3 className="text-xl font-bold tracking-tight">{SITE_CONFIG.name.short} Recipes</h3>
                <p className="text-xs text-neutral-400">{SITE_CONFIG.name.tagline}</p>
              </div>
            </div>
            <p className="text-neutral-400 text-sm mb-5 leading-relaxed">
              Simple, tested recipes for busy families. Good food, made easy.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li><Link href="/" className={linkClasses}>Home</Link></li>
              <li><Link href="/recipes" className={linkClasses}>All Recipes</Link></li>
              <li><Link href="/categories" className={linkClasses}>Categories</Link></li>
              <li><Link href="/blog" className={linkClasses}>Blog</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">Categories</h4>
            <ul className="space-y-3">
              <li><Link href="/recipes/category/main-course" className={linkClasses}>Main Course</Link></li>
              <li><Link href="/recipes/category/quick-meals" className={linkClasses}>Quick Meals</Link></li>
              <li><Link href="/recipes/category/dessert" className={linkClasses}>Dessert</Link></li>
              <li><Link href="/recipes/category/appetizer" className={linkClasses}>Appetizer</Link></li>
              <li><Link href="/recipes/category/soup" className={linkClasses}>Soup</Link></li>
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">More</h4>
            <ul className="space-y-3">
              <li><Link href="/recipes/category/slow-cooker" className={linkClasses}>Slow Cooker</Link></li>
              <li><Link href="/recipes/category/breakfast" className={linkClasses}>Breakfast</Link></li>
              <li><Link href="/recipes/category/side-dishes" className={linkClasses}>Side Dishes</Link></li>
              <li><Link href="/recipes/category/drink" className={linkClasses}>Drinks</Link></li>
              <li><Link href="/recipes/category/salad" className={linkClasses}>Salad</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm" data-testid="copyright-text">
            © {currentYear} {SITE_CONFIG.name.full} ({SITE_CONFIG.name.short}). All rights reserved.
          </p>
          {buildInfo && (
            <div className="text-xs text-neutral-600 font-mono" data-testid="build-info">
              build {buildInfo.hash} • {buildInfo.date}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
