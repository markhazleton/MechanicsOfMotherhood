import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'wouter';

interface BreadcrumbItem {
  name: string;
  href?: string; // preferred
  url?: string;  // legacy support
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function BreadcrumbNav({ items, className = '' }: BreadcrumbProps) {
  // Always include home as the first item
  const allItems = [
    { name: 'Workshop', href: '/' },
    ...items
  ];

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-brand-tool ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isHome = index === 0;
          // Support legacy "url" property to avoid undefined href
          const target = item.href ?? item.url ?? '#';

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className="w-4 h-4 text-brand-tool/60 mr-2" 
                  aria-hidden="true" 
                />
              )}
              
              {isLast ? (
                <span 
                  className="font-medium text-brand-blue truncate max-w-[200px]"
                  aria-current="page"
                  title={item.name}
                >
                  {item.name}
                </span>
              ) : (
                <Link 
                  href={target}
                  className="flex items-center hover:text-brand-teal transition-colors truncate max-w-[150px]"
                  title={item.name}
                >
                  {isHome && <Home className="w-4 h-4 mr-1" aria-hidden="true" />}
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
