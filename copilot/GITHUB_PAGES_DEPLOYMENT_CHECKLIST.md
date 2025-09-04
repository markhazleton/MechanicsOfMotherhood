# GitHub Pages Deployment Checklist

## ✅ Pre-Deployment Setup

### Repository Configuration

- [ ] Repository is public or has GitHub Pro/Team for private Pages
- [ ] GitHub Pages is enabled in repository settings
- [ ] Source is set to "GitHub Actions"
- [ ] Enforce HTTPS is enabled

### Branch & Security Setup

- [ ] Main branch is protected (optional but recommended)
- [ ] Workflow permissions are set to "Read and write"
- [ ] Required status checks are configured (optional)

### Environment Variables (Optional)

- [ ] RECIPE_API_BASE configured in repository variables
- [ ] WEBCMS_API_BASE configured in repository variables  
- [ ] WEBCMS_AUTH_TOKEN configured in repository secrets (if available)

## ✅ Code & Configuration Checklist

### Essential Files

- [x] `.github/workflows/deploy.yml` - GitHub Actions workflow
- [x] `client/public/404.html` - SPA routing support
- [x] `client/public/.nojekyll` - Disable Jekyll processing
- [x] `client/public/robots.txt` - SEO configuration
- [x] `client/public/sitemap.xml` - Generated sitemap
- [x] `client/public/site.webmanifest` - PWA manifest

### Configuration Files

- [x] `vite.config.ts` - Proper base path configuration
- [x] `package.json` - GitHub Pages specific scripts
- [x] `tsconfig.json` - TypeScript configuration
- [x] `tailwind.config.ts` - Styling configuration

### SPA Routing Support

- [x] 404.html redirect script with pathSegmentsToKeep = 1
- [x] index.html SPA redirect handling script
- [x] Wouter router with correct base path
- [x] All assets use correct base path

### Security & Performance

- [x] Content Security Policy headers configured
- [x] Security headers in _headers file
- [x] Asset optimization in Vite config
- [x] Bundle splitting for better caching

## ✅ Build & Deployment Process

### Automated Checks

- [x] TypeScript compilation passes
- [x] Data validation runs successfully
- [x] Sitemap generation works
- [x] Build produces optimized output
- [x] All assets are properly referenced

### Manual Testing

- [ ] Local preview works: `npm run preview:github`
- [ ] All routes work with refresh
- [ ] Images and assets load correctly
- [ ] PWA manifest is accessible
- [ ] Robots.txt is accessible at /robots.txt

### Post-Deployment Verification

- [ ] Site loads successfully at GitHub Pages URL
- [ ] All navigation routes work
- [ ] No 404 errors for assets
- [ ] Meta tags render correctly
- [ ] Social sharing works
- [ ] PWA features function (installability, offline support)

## 🚀 Deployment Commands

### Development

```bash
npm run dev                    # Start development server
npm run preview:github         # Preview production build with GitHub base path
```

### Testing & Validation

```bash
npm run check                  # TypeScript type checking
npm run validate-data          # Validate data quality
npm run deploy:check           # Full deployment validation
```

### Building

```bash
npm run build:github           # Full build with data fetch, sitemap, and validation
npm run build:static           # Production build only
```

## 🔧 Troubleshooting

### Common Issues

1. **Blank page after deployment**: Check browser console for base path issues
2. **404 on refresh**: Ensure 404.html has correct pathSegmentsToKeep value
3. **Assets not loading**: Verify base path in vite.config.ts
4. **Build failures**: Check GitHub Actions logs for specific errors

### Debug Commands

```bash
# Check build locally
npm run build:github && npm run preview:github

# Validate all systems
npm run deploy:check

# Check for TypeScript issues
npm run check
```

### GitHub Actions Debugging

- Check Actions tab in GitHub repository
- Review build logs for specific error messages
- Ensure all environment variables are configured
- Verify repository permissions and settings

## 📊 Performance Optimization

### Lighthouse Scores Target

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### Key Metrics

- First Contentful Paint: < 2s
- Time to Interactive: < 4s
- Bundle Size: < 300KB (main chunk)

## 🔒 Security Considerations

### GitHub Pages Security Features

- Automatic HTTPS enforcement
- DDoS protection via GitHub CDN
- No server-side code execution
- Content Security Policy headers

### Additional Security

- Regular dependency updates
- Security headers configuration
- Input sanitization for user content
- CORS policy configuration

---

## 📞 Support

If you encounter issues during deployment:

1. Check this checklist thoroughly
2. Review GitHub Actions logs
3. Test locally with `npm run deploy:check`
4. Open an issue with deployment logs attached
