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
    { name: 'Home', href: '/' },
    ...items
  ];

  return (
    <nav
      className={`text-sm text-muted-foreground ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isHome = index === 0;
          // Support legacy "url" property to avoid undefined href
          const target = item.href ?? item.url ?? '#';

          return (
            <li key={index} className="flex min-w-0 items-center">
              {index > 0 && (
                <ChevronRight
                  className="mr-2 size-3.5 shrink-0 text-neutral-400"
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                <span
                  className="max-w-[220px] truncate font-medium text-foreground"
                  aria-current="page"
                  title={item.name}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={target}
                  className="flex max-w-[160px] items-center truncate rounded-xs transition-colors hover:text-link-hover"
                  title={item.name}
                >
                  {isHome && <Home className="mr-1.5 size-3.5" aria-hidden="true" />}
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
