import * as HelmetAsync from 'react-helmet-async';

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'recipe';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: object;
}

export default function SeoHead({
  title = 'Mechanics of Motherhood - Engineering Better Meals',
  description = 'Engineering better meals for working mothers worldwide. Tested recipes, kitchen tools, and meal planning solutions.',
  keywords = [],
  image = 'https://mechanicsofmotherhood.com/images/logos/MOM-Logo-Full.png',
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  structuredData
}: SeoHeadProps) {
  // Ensure title includes site name if not already present
  const fullTitle = title.includes('Mechanics of Motherhood') 
    ? title 
    : `${title} | Mechanics of Motherhood`;

  // Combine default keywords with page-specific ones
  const allKeywords = [
    'working mother recipes',
    'quick family meals',
    'easy dinner recipes',
    'meal planning',
    'kitchen organization',
    'busy mom cooking',
    ...keywords
  ].join(', ');

  // Runtime canonical URL detection (custom domain or GitHub Pages)
  let runtimeOrigin: string | undefined;
  let runtimePath: string | undefined;
  if (typeof window !== 'undefined') {
    try {
      const { protocol, host, pathname } = window.location;
      runtimeOrigin = `${protocol}//${host}`;
      runtimePath = pathname;
    } catch {/* ignore */}
  }
  const canonical = url
    || (runtimeOrigin && runtimePath ? `${runtimeOrigin}${runtimePath}` : 'https://mechanicsofmotherhood.com/');

  return (
  <HelmetAsync.Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author || 'Mechanics of Motherhood'} />
  <link rel="canonical" href={canonical} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
  <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Mechanics of Motherhood" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@MechanicsOfMom" />

      {/* Article/Recipe specific tags */}
      {type === 'article' && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:author" content={author || 'Mechanics of Motherhood'} />
        </>
      )}

      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#3e5461" />
      
      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
  </HelmetAsync.Helmet>
  );
}
