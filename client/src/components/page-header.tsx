import type { ReactNode } from "react";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";

interface BreadcrumbItem {
  name: string;
  href?: string;
  url?: string;
}

interface PageHeaderProps {
  /** Letter-spaced label above the title */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  /** Controls rendered under the description (search, filters, actions) */
  children?: ReactNode;
  /** Content placed above the eyebrow (e.g. a back link) */
  before?: ReactNode;
  className?: string;
}

/**
 * Shared page heading: breadcrumb bar plus a left-aligned eyebrow / title / lede
 * block on the cream page surface (Make Bold design system).
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  before,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`border-b border-border-subtle ${className}`} data-testid="page-header">
      {breadcrumbs && (
        <div className="breadcrumb-nav border-b border-border-subtle">
          <div className="site-container py-3">
            <BreadcrumbNav items={breadcrumbs} />
          </div>
        </div>
      )}
      <div className="site-container py-12 md:py-16">
        {before && <div className="mb-6">{before}</div>}
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="max-w-4xl font-display text-[clamp(2.25rem,3.5vw+1rem,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}
