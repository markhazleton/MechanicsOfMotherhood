# GitHub Pages Best Practices for Custom Domain Hosting

## Current Repository Status: ✅ FULLY CONFIGURED

The MechanicsOfMotherhood repository is already properly configured for GitHub Pages hosting with the custom domain `mechanicsofmotherhood.com`. This document outlines the best practices implemented and provides guidance for maintenance.

## 🔐 Security Best Practices

### 1. Repository Visibility

- **Current**: Public repository (required for free GitHub Pages)
- **Security Note**: Ensure no sensitive data (API keys, credentials, private info) is committed
- **Implementation**: Use repository secrets and variables for sensitive configuration

### 2. Secrets Management ✅ IMPLEMENTED

```yaml
# In .github/workflows/deploy.yml
env:
  WEBCMS_AUTH_TOKEN: ${{ secrets.WEBCMS_AUTH_TOKEN }}  # Secret token
  RECIPE_API_BASE: ${{ vars.RECIPE_API_BASE }}         # Public variable
```

**Repository Secrets (Settings → Secrets and variables → Actions)**:

- `WEBCMS_AUTH_TOKEN`: API authentication token (encrypted)

**Repository Variables (Settings → Secrets and variables → Actions)**:

- `RECIPE_API_BASE`: Public API endpoint URL
- `WEBCMS_API_BASE`: Public API endpoint URL
- `VITE_CUSTOM_DOMAIN`: Custom domain override (optional)

## 🌐 Domain Configuration

### 1. CNAME File ✅ IMPLEMENTED

**Location**: `client/public/CNAME`

```
mechanicsofmotherhood.com
www.mechanicsofmotherhood.com
```

**Best Practices**:

- Include both apex domain and www subdomain
- No trailing slashes or protocols
- Newline at end of file
- Single domain per line

### 2. DNS Configuration (External)

**Required DNS Records**:

```dns
# A Records for apex domain (mechanicsofmotherhood.com)
A    mechanicsofmotherhood.com    185.199.108.153
A    mechanicsofmotherhood.com    185.199.109.153
A    mechanicsofmotherhood.com    185.199.110.153
A    mechanicsofmotherhood.com    185.199.111.153

# CNAME Record for www subdomain
CNAME www.mechanicsofmotherhood.com markhazleton.github.io
```

**DNS Provider Instructions**:

- **Cloudflare**: Use "DNS Only" (gray cloud) for GitHub Pages
- **Other Providers**: Standard A/CNAME records as above
- **TTL**: Set to Auto or 3600 seconds for faster propagation

### 3. GitHub Pages Settings

**Repository Settings → Pages**:

- Source: "GitHub Actions" ✅
- Custom domain: "mechanicsofmotherhood.com" ✅
- Enforce HTTPS: Enabled ✅ (after SSL certificate provisioning)

## 🏗️ Build Configuration

### 1. Dynamic Base Path ✅ IMPLEMENTED

**File**: `vite.config.ts`

```typescript
const hasCustomDomain = process.env.VITE_CUSTOM_DOMAIN || 
                       fs.existsSync(path.join(__dirname, 'client/public/CNAME'));

export default defineConfig({
  base: hasCustomDomain ? '/' : '/MechanicsOfMotherhood/',
  // ... other config
});
```

**Benefits**:

- Serves from root (`/`) when using custom domain
- Falls back to subpath (`/MechanicsOfMotherhood/`) for GitHub Pages URL
- Automatic detection via CNAME file or environment variable

### 2. SEO Configuration ✅ IMPLEMENTED

**Sitemap Generation**: `scripts/generate-sitemap.js`

- Automatically uses custom domain when available
- Updates URLs based on CNAME file or environment variable
- Includes all routes, recipes, and categories

**File**: `client/public/sitemap.xml` (auto-generated)

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mechanicsofmotherhood.com/</loc>
    <lastmod>2025-09-06</lastmod>
    <priority>1.0</priority>
  </url>
  <!-- ... other URLs -->
</urlset>
```

### 3. GitHub Actions Workflow ✅ IMPLEMENTED

**File**: `.github/workflows/deploy.yml`

**Key Features**:

- Separate build and deploy jobs
- Proper permissions for Pages deployment
- Environment variable support
- TypeScript checking with continue-on-error
- Artifact upload includes CNAME file
- Only deploys on main branch pushes

## 📊 Performance Optimizations

### 1. Asset Optimization ✅ IMPLEMENTED

- **Vite Bundle Splitting**: Manual chunks for vendor libraries
- **Image Optimization**: WebP format preferred, lazy loading
- **CSS Purging**: Tailwind CSS purges unused styles
- **JavaScript Minification**: Vite handles minification in production

### 2. Caching Strategy ✅ IMPLEMENTED

- **Build-time Data Fetching**: Recipe data cached during build
- **Static Assets**: Versioned filenames for cache busting
- **Service Worker**: Not implemented (optional for future)

### 3. CDN Benefits

- **GitHub Pages CDN**: Automatic global content delivery
- **Custom Domain**: Maintains CDN benefits with custom domain

## 🔍 Monitoring & Analytics

### 1. Core Web Vitals ✅ IMPLEMENTED

**File**: `client/src/lib/web-vitals.ts`

- Lighthouse performance monitoring
- Real user metrics collection
- Performance budget enforcement

### 2. Error Tracking

**Recommendation**: Add error boundary and crash reporting

- Sentry (free tier available)
- LogRocket for session replay
- Custom error logging to external service

### 3. Uptime Monitoring

**Recommendation**: External monitoring services

- UptimeRobot (free tier)
- Pingdom
- StatusCake

## 🚀 Deployment Best Practices

### 1. Branch Protection ✅ RECOMMENDED

**Settings → Branches → Add rule for `main`**:

- Require pull request reviews
- Require status checks (build must pass)
- Require up-to-date branches
- Include administrators

### 2. Automated Testing

**Current**: Basic TypeScript checking
**Recommended Additions**:

```yaml
- name: Run tests
  run: npm test

- name: E2E testing
  run: npm run test:e2e

- name: Lighthouse CI
  run: npm run lighthouse
```

### 3. Rollback Strategy

- **Git-based**: Revert commits and redeploy
- **Branch-based**: Maintain staging branches
- **Tag-based**: Use semantic versioning with release tags

## 🛡️ Security Considerations

### 1. Content Security Policy

**Recommendation**: Add CSP headers via meta tags

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

### 2. Dependency Scanning ✅ BASIC

**Current**: Dependabot enabled
**Enhanced**: Add security scanning workflow

```yaml
- name: Run security audit
  run: npm audit --audit-level high
```

### 3. HTTPS Enforcement ✅ IMPLEMENTED

- GitHub Pages automatically redirects HTTP to HTTPS
- Custom domain SSL certificate auto-provisioned
- HSTS headers recommended for enhanced security

## 📋 Maintenance Checklist

### Weekly

- [ ] Check deployment status in Actions tab
- [ ] Monitor site uptime and performance
- [ ] Review any Dependabot alerts

### Monthly

- [ ] Update dependencies (`npm update`)
- [ ] Review and rotate API tokens if needed
- [ ] Check SSL certificate status
- [ ] Verify DNS records are still correct

### Quarterly

- [ ] Performance audit with Lighthouse
- [ ] Security audit with npm audit
- [ ] Review and update documentation
- [ ] Test disaster recovery procedures

## 🆘 Troubleshooting

### Common Issues

1. **Custom Domain Not Working**
   - Check DNS propagation: `nslookup mechanicsofmotherhood.com`
   - Verify CNAME file is in build output
   - Confirm GitHub Pages settings show custom domain

2. **Build Failures**
   - Check Actions logs for specific errors
   - Verify environment variables are set
   - Test build locally: `npm run build:github`

3. **SSL Certificate Issues**
   - Wait 24-48 hours for initial provisioning
   - Check domain ownership in GitHub Pages settings
   - Verify DNS records point to GitHub Pages

4. **Asset Loading Issues**
   - Confirm base path configuration in `vite.config.ts`
   - Check if custom domain detection is working
   - Verify artifact upload includes all necessary files

### Debugging Commands

```bash
# Test local build
npm run build:github
npm run preview

# Check DNS
nslookup mechanicsofmotherhood.com
dig mechanicsofmotherhood.com

# Validate configuration
node -e "console.log(process.env.VITE_CUSTOM_DOMAIN)"
ls -la client/public/CNAME
```

## ✅ Implementation Status

| Feature | Status | Notes |
|---------|---------|-------|
| Custom Domain | ✅ Complete | mechanicsofmotherhood.com |
| CNAME File | ✅ Complete | Apex + www domains |
| GitHub Actions | ✅ Complete | Build & deploy workflow |
| Dynamic Base Path | ✅ Complete | Auto-detects custom domain |
| Sitemap Generation | ✅ Complete | SEO optimized |
| SSL/HTTPS | ✅ Complete | Auto-provisioned |
| Environment Variables | ✅ Complete | Secrets & variables configured |
| Performance Optimization | ✅ Complete | Vite bundling + caching |
| Error Handling | ⚠️ Partial | Basic error boundaries |
| Monitoring | ⚠️ Partial | Core Web Vitals only |
| Security Headers | 🔲 Pending | CSP and security headers |
| Advanced Testing | 🔲 Pending | E2E and Lighthouse CI |

## 🎯 Next Steps (Optional Enhancements)

1. **Enhanced Security**
   - Implement Content Security Policy
   - Add security headers via _headers file
   - Set up vulnerability scanning

2. **Advanced Monitoring**
   - Integrate error tracking (Sentry)
   - Set up uptime monitoring
   - Add performance monitoring

3. **CI/CD Improvements**
   - Add comprehensive test suite
   - Implement Lighthouse CI
   - Add deployment notifications

4. **Performance**
   - Service worker for offline functionality
   - Advanced caching strategies
   - Image optimization service

---

**Summary**: The repository is already following GitHub Pages best practices for custom domain hosting. The setup is production-ready with proper security, performance, and SEO configurations in place.
