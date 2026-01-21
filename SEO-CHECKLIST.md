# SEO Checklist for Mechanics of Motherhood

This document outlines the SEO improvements made and actionable steps to get the site indexed and ranking.

## Completed Code Fixes

### 1. Canonical URL Consistency
- [x] Fixed home page canonical URL (was GitHub Pages, now mechanicsofmotherhood.com)
- [x] Fixed StructuredData.tsx fallback URL
- [x] Fixed sitemap generator fallback URL
- [x] All canonical URLs now point to `https://mechanicsofmotherhood.com`

### 2. Open Graph & Social Media
- [x] Fixed OG image path (was referencing non-existent file)
- [x] Added OG tags to static index.html for better crawling
- [x] Twitter Card meta tags properly configured

### 3. Robots.txt Enhancements
- [x] Added Google and Bing specific crawl directives
- [x] Added crawl-delay for polite crawling
- [x] Blocked resource-wasting bots (AhrefsBot, SemrushBot, etc.)
- [x] Added Host directive for canonicalization

### 4. Static HTML SEO Tags
- [x] Added canonical link tag to index.html
- [x] Added robots meta tag
- [x] Added author meta tag
- [x] Added keywords meta tag

---

## Immediate Action Items (Do These First!)

### Step 1: Verify Google Search Console Ownership
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://mechanicsofmotherhood.com`
3. Verify ownership using one of these methods:
   - **HTML file upload** (recommended): Download the verification file and add to `client/public/`
   - **DNS TXT record**: Add TXT record to DNS
   - **Google Analytics**: Already have GA4 configured (G-M7TYR1V6KP)

### Step 2: Submit Sitemap to Google
1. In Google Search Console, go to "Sitemaps"
2. Enter: `https://mechanicsofmotherhood.com/sitemap.xml`
3. Click "Submit"

### Step 3: Request Indexing
1. In Google Search Console, use "URL Inspection" tool
2. Enter: `https://mechanicsofmotherhood.com/`
3. Click "Request Indexing"
4. Repeat for key pages:
   - `https://mechanicsofmotherhood.com/recipes`
   - `https://mechanicsofmotherhood.com/categories`

### Step 4: Set Up Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site: `https://mechanicsofmotherhood.com`
3. Import settings from Google Search Console (easiest option)
4. Submit sitemap

---

## Content Optimization Recommendations

### Recipe Pages (High Priority)
Each recipe page already has excellent structured data. To improve further:

1. **Add prep/cook times to recipe data** - Currently estimated, actual times would improve rich snippets
2. **Add recipe images** - Many recipes may lack images; add high-quality photos
3. **Add nutrition info** - Schema supports detailed nutrition data

### Internal Linking
1. **Related recipes** - Link to similar recipes at bottom of each recipe page
2. **Category cross-links** - Link between related categories
3. **Blog to recipes** - When blog content is added, link to relevant recipes

### Content Gaps to Fill
1. **Blog posts** - Currently "Coming Soon"; add cooking tips, meal planning guides
2. **About page** - Add an about page explaining the site's mission
3. **Contact page** - Add contact information for E-A-T signals

---

## Technical SEO Monitoring

### Performance Metrics to Track
- Core Web Vitals (LCP, FID, CLS) via Google Search Console
- Mobile usability issues
- Index coverage errors

### Common Issues to Watch For
- Soft 404 errors (pages that return 200 but look like errors)
- Redirect chains
- Crawl errors in Search Console

---

## Schema.org Structured Data (Already Implemented)

The site has excellent structured data:
- **Recipe Schema** - Full recipe markup with ingredients, instructions, ratings
- **Organization Schema** - Site identity and branding
- **Website Schema** - SearchAction for site search
- **BreadcrumbList Schema** - Navigation hierarchy

Test your structured data at: https://search.google.com/test/rich-results

---

## Quick Wins for Traffic

### 1. Google Business Profile (if applicable)
If there's a physical location or local presence, create a Google Business Profile.

### 2. Pinterest
Recipe sites do well on Pinterest:
- Create a Pinterest business account
- Enable Rich Pins (uses existing Recipe schema)
- Pin recipe images with links back to site

### 3. Recipe Aggregators
Submit to recipe directories:
- Yummly
- BigOven
- Foodgawker (if images are high quality)

### 4. Social Sharing
- Add social share buttons to recipe pages
- Create shareable images for Pinterest/Facebook

---

## Monitoring Tools

### Free Tools
- [Google Search Console](https://search.google.com/search-console) - Indexing, clicks, impressions
- [Bing Webmaster Tools](https://www.bing.com/webmasters) - Bing indexing
- [Google PageSpeed Insights](https://pagespeed.web.dev) - Performance testing
- [Rich Results Test](https://search.google.com/test/rich-results) - Structured data validation

### Recommended Checks
- Weekly: Check Search Console for crawl errors
- Monthly: Review search analytics for trending queries
- Quarterly: Audit structured data with Rich Results Test

---

## Expected Timeline

After implementing these changes and submitting to Search Console:
- **Indexing**: 1-4 weeks for Google to crawl and index
- **Search Console data**: 2-3 days for impressions data to appear
- **Rich snippets**: 2-8 weeks for recipe rich results to appear
- **Ranking improvements**: 2-3 months to see significant changes

---

## Files Modified in This Update

1. `client/src/pages/home.tsx` - Fixed canonical URL
2. `client/src/components/seo/StructuredData.tsx` - Fixed fallback URL
3. `client/src/components/seo/SeoHead.tsx` - Fixed OG image path
4. `client/src/utils/seo-helpers.ts` - Fixed default image path
5. `client/index.html` - Added static SEO meta tags
6. `client/public/robots.txt` - Enhanced with crawl directives
7. `scripts/generate-sitemap.js` - Fixed fallback URL
