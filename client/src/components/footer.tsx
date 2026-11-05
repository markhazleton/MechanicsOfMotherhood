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

  const linkClasses = "text-inverse-muted transition-colors duration-[120ms] hover:text-inverse-foreground focus-visible:outline-inverse-eyebrow rounded-xs";
  const headingClasses = "mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-inverse-eyebrow";

  const columns = [
    {
      title: "Explore",
      links: [
        { href: "/", label: "Home" },
        { href: "/recipes/", label: "All Recipes" },
        { href: "/categories/", label: "Categories" },
        { href: "/blog/", label: "Blog" },
      ],
    },
    {
      title: "Categories",
      links: [
        { href: "/recipes/category/main-course/", label: "Main Course" },
        { href: "/recipes/category/quick-meals/", label: "Quick Meals" },
        { href: "/recipes/category/dessert/", label: "Dessert" },
        { href: "/recipes/category/appetizer/", label: "Appetizer" },
        { href: "/recipes/category/soup/", label: "Soup" },
      ],
    },
    {
      title: "More",
      links: [
        { href: "/recipes/category/slow-cooker/", label: "Slow Cooker" },
        { href: "/recipes/category/breakfast/", label: "Breakfast" },
        { href: "/recipes/category/side-dishes/", label: "Side Dishes" },
        { href: "/recipes/category/drink/", label: "Drinks" },
        { href: "/recipes/category/salad/", label: "Salad" },
      ],
    },
  ];

  return (
    <footer className="bg-inverse text-inverse-foreground">
      <div className="site-container py-14 md:py-20">
        <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-md bg-cream">
                <img
                  src={logoIcon}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                />
              </span>
              <span className="font-display text-xl font-extrabold tracking-[-0.02em] text-inverse-foreground">
                {SITE_CONFIG.name.short}<span className="text-inverse-eyebrow"> Recipes</span>
              </span>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-inverse-muted">
              Simple, tested recipes for busy families. Good food, made easy — so you can spend
              less time planning and more time at the table.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="md:col-span-2 last:col-span-2 md:last:col-span-3">
              <h2 className={headingClasses}>{column.title}</h2>
              <ul className="space-y-2.5 text-[15px]">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClasses}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-3 border-t border-inverse-border pt-8 text-sm text-inverse-muted md:flex-row md:items-center md:justify-between">
          <p data-testid="copyright-text">
            © {currentYear} {SITE_CONFIG.name.full} ({SITE_CONFIG.name.short}). All rights reserved.
          </p>
          <p>
            <a href="https://mechanicsofmotherhood.com" className={linkClasses}>Mechanics Of Motherhood</a>
            {' — built by '}
            <a href="https://markhazleton.com" className={linkClasses}>Mark Hazleton</a>
            {' · '}
            <a href="https://makeboldsolutions.com" className={linkClasses}>Make Bold Solutions</a>
          </p>
          {buildInfo && (
            <div className="font-mono text-xs text-neutral-400" data-testid="build-info">
              build {buildInfo.hash} • {buildInfo.date}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
