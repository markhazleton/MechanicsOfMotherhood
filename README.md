# Mechanics of Motherhood (MoM) - Recipe Management Platform

[![Deploy to GitHub Pages](https://github.com/sharesmallbiz-support/MechanicsOfMotherhood/actions/workflows/deploy.yml/badge.svg)](https://github.com/sharesmallbiz-support/MechanicsOfMotherhood/actions/workflows/deploy.yml)

## 🚀 Live Site

**Primary Domain**: <https://mechanicsofmotherhood.com>

**GitHub Pages Fallback** (legacy path – used only if custom domain DNS not active): <https://sharesmallbiz-support.github.io/MechanicsOfMotherhood/>

The site auto-detects the custom domain at build/runtime (via `CNAME`) and serves assets from the root path when on `mechanicsofmotherhood.com`.

## 📖 Overview

Mechanics of Motherhood (MoM) is a modern, responsive recipe management web application designed specifically for working mothers. Built with a sleek industrial design theme, it provides an intuitive platform for discovering, organizing, and sharing family-friendly recipes.

### ✨ Recent Achievements (August–September 2025)

- **🎯 Single Recipe Detail View**: Added comprehensive recipe detail pages with ingredients, instructions, nutrition info, and sharing capabilities
-- **🔗 Real API Integration**: Successfully connected to live RecipeSpark API at webspark.markhazleton.com with 100+ real recipes
- **📊 Dynamic Data Fetching**: Built automated system to fetch and cache real recipe data during build process
-- **�️ Custom Domain & Pages**: Now hosted at `mechanicsofmotherhood.com` with GitHub Pages fallback
- **🔄 Hybrid Architecture**: Seamlessly switches between real API data and mock data based on availability
- **🎨 Enhanced UI/UX**: Improved navigation, better responsive design, and industrial theme consistency
- **⚡ Performance Optimized**: Fast loading times with efficient caching and pre-fetched data

## 🏗️ Architecture Overview

### Frontend Stack

- **Framework**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for lightning-fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom industrial/mechanical design system

### Backend Stack (Optional)

- **Runtime**: Node.js with TypeScript and ESM modules
- **Framework**: Express.js providing RESTful API endpoints
- **Development**: Custom Vite integration for unified development experience
- **API Design**: Triple-compatible API supporting RecipeSpark, WebCMS, and legacy formats

### Deployment Modes

#### 🌐 Static Site (GitHub Pages)

- **No backend required** - runs entirely in the browser
- **Mock data integration** - realistic recipe and blog data
- **Progressive enhancement** - falls back to static mode if API unavailable
- **CDN optimized** - fast global content delivery

#### 🖥️ Full-Stack (Self-hosted)

- **Complete API backend** - full CRUD operations
- **Database integration** - PostgreSQL with Drizzle ORM
- **Real-time features** - live data updates and user management
- **External API compatibility** - integrates with RecipeSpark and WebCMS APIs

## 🚀 Quick Start

### Static Deployment (Recommended for Demo)

1. **Clone the repository**

   ```bash
   git clone https://github.com/sharesmallbiz-support/MechanicsOfMotherhood.git
   cd MechanicsOfMotherhood
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build for static deployment**

   ```bash
   npm run build:static
   ```

4. **Preview locally**

   ```bash
   npm run preview
   ```

5. **Deploy to GitHub Pages** (automatic via GitHub Actions on push to main)

### Development Setup

1. **Start development server**

   ```bash
   npm run dev
   ```

2. **Access the application**
   - Frontend: <http://localhost:5000>
   - API Documentation: <http://localhost:5000/api/docs>

## 📱 Features

### 🍳 Recipe Management

- **Comprehensive Recipe Details**: Full ingredients, instructions, prep/cook times, servings
- **Advanced Search & Filtering**: Search by name, ingredients, category, difficulty level
- **Category Organization**: Organized recipe collections (Quick Fixes, Breakfast, Main Course, etc.)
- **Recipe Rating System**: Community-driven ratings and reviews
- **Print & Share**: Easy recipe printing and social sharing capabilities

### 🎨 User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Industrial Design Theme**: Unique mechanical/industrial aesthetic with custom color palette
- **Fast Loading**: Optimized performance with lazy loading and efficient caching
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### 📊 Content Management

- **Blog Integration**: Recipe-related articles and cooking tips
- **Featured Content**: Highlighted recipes and seasonal collections
- **Statistics Dashboard**: Platform metrics and user engagement data
- **SEO Optimized**: Meta tags, structured data, and social media integration

## 🎨 Design System

### Color Palette

- **Industrial Blue** (#2C3E50): Primary brand color for headings and navigation
- **Workshop Teal** (#38B2AC): Secondary color for buttons and highlights
- **Energetic Orange** (#ED8936): Accent color for call-to-action elements
- **Tool Gray** (#4A5568): Body text and secondary elements
- **Light Gray** (#F7FAFC): Background and subtle elements

### Typography

- **Headings**: "Mechanical" font family for industrial feel
- **Body**: Clean, readable sans-serif for optimal reading experience

## 🔧 Technical Details

### Project Structure

```
MechanicsOfMotherhood/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── data/           # Mock data for static mode
│   │   └── lib/            # Utilities and configurations
├── server/                 # Backend Express application (optional)
├── shared/                 # Shared TypeScript schemas
├── .github/workflows/      # GitHub Actions for deployment
└── dist/                   # Build output directory
```

### API Endpoints (Full-Stack Mode)

#### Legacy MoM API (`/api`)

- `GET /api/recipes` - Get paginated recipes
- `GET /api/recipes/:id` - Get single recipe
- `GET /api/categories` - Get all categories
- `GET /api/featured-content` - Get featured recipes and posts
- `POST /api/search` - Search recipes

#### RecipeSpark API (`/api/recipespark`)

- `GET /api/recipespark/recipes` - RecipeSpark compatible recipe listing
- `GET /api/recipespark/recipes/:id` - Single recipe in RecipeSpark format
- `GET /api/recipespark/categories` - Category management

#### WebCMS API (`/api/webcms`)

- `GET /api/webcms/websites` - Website management
- `GET /api/webcms/menu-items` - Navigation management
- `GET /api/webcms/dashboard/stats` - Analytics dashboard

### Environment Configuration

#### Development

```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://... (optional)
```

#### Static/Production

```bash
NODE_ENV=production
VITE_API_URL= (leave empty for static mode)
```

## 🚀 Deployment Options

### GitHub Pages + Custom Domain (Automatic)

#### Prerequisites

- GitHub repository with Pages enabled
- Actions workflow permissions configured

#### Setup Instructions

1. **Fork this repository** to your GitHub account
2. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"
   - Ensure "Enforce HTTPS" is checked
3. **Configure Environment Variables** (optional):
   - RECIPE_API_BASE: `https://webspark.markhazleton.com/api/recipespark`
   - WEBCMS_API_BASE: `https://webspark.markhazleton.com/api/WebCMS/WebCMSApi`
   - WEBCMS_AUTH_TOKEN: (secret token if available)
4. **Push to `main` branch** - deployment is automatic via GitHub Actions
5. **Site will be available** at your custom domain (if CNAME + DNS configured) or fallback `https://[your-username].github.io/MechanicsOfMotherhood/`

#### Custom Domain Setup Summary

1. Add `CNAME` file (already present) containing apex and optional www.
2. Configure DNS (Cloudflare or registrar):
   - A records (apex) → GitHub Pages IPs: 185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153
   - CNAME `www` → `<username>.github.io`
3. Enable custom domain in GitHub Pages settings and enforce HTTPS after certificate issuance.
4. (Optional) Add `VITE_CUSTOM_DOMAIN` repository variable to make sitemap builds explicit (the build already infers from CNAME if not set).

#### What Happens During Deployment

- ✅ Node.js 20 environment setup
- ✅ Dependencies installation with npm ci
- ✅ TypeScript type checking
- ✅ API data fetching (with graceful fallback)
- ✅ Data quality validation
- ✅ Sitemap generation for SEO
- ✅ Production build with optimizations
- ✅ Automatic deployment to GitHub Pages

#### GitHub Actions Workflow Features

- **Separation of concerns**: Build and deploy are separate jobs
- **Pull request previews**: Builds are tested on PRs without deployment
- **Security**: Uses GitHub's official actions and proper permissions
- **Performance**: Includes caching for faster builds
- **Quality gates**: TypeScript checking and data validation

### Manual Static Deployment (Any Host)

Perfect for other static hosting providers (Netlify, Vercel, etc.):

```bash
# Build with all optimizations
npm run build:github

# Upload dist/public folder to your hosting provider
# Make sure to configure SPA routing redirects
```

### Full-Stack Deployment (Future / Optional)

For servers or platforms supporting Node.js backends:

1. **Deploy backend** to services like Railway, Render, or Vercel
2. **Configure database** connection (if using database features)
3. **Set environment variables** for API endpoints
4. **Deploy frontend** with API URL configuration

## 🧪 Testing

```bash
# Type checking
npm run check

# Build test
npm run build:static

# Preview production build
npm run preview
```

## 🗄️ Data Management System

### Real API Integration

The application now fetches real recipe data from the RecipeSpark API at `webspark.markhazleton.com`:

- **107+ Real Recipes**: Automatically fetched from live API during build
- **14 Recipe Categories**: Complete categorization system
- **Smart Fallback**: Uses mock data if API is unavailable
- **Build-Time Optimization**: Data is pre-fetched and cached for fast loading

### Data Fetching Commands

```bash
# Test API connectivity
npm run test-api

# Fetch fresh data from APIs
npm run fetch-data

# Build with fresh data
npm run build:with-data
```

### Data Sources

1. **RecipeSpark API**: `https://webspark.markhazleton.com/api/recipespark`
   - Recipes with ingredients, instructions, ratings
   - Categories with descriptions and organization

2. **WebCMS API**: `https://webspark.markhazleton.com/api/WebCMS/WebCMSApi`
   - Website content and structure
   - Menu navigation data (requires auth token)

3. **Mock Data Fallback**: High-quality sample data when APIs unavailable

For detailed setup instructions, see [DATA_SETUP.md](DATA_SETUP.md).

## 🔄 API Compatibility

The application supports multiple API formats for maximum flexibility:

- **Legacy MoM Format**: Backward compatible with existing frontend
- **RecipeSpark Standard**: Industry-standard recipe API format
- **WebCMS Integration**: Content management system compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful component library
- **Radix UI** for accessible component primitives
- **TanStack Query** for excellent state management
- **Tailwind CSS** for the utility-first styling approach
- **Vite** for the blazing-fast build tool

## 📞 Support

For questions, issues, or contributions, please:

- Open an issue on GitHub
- Check the documentation at `/api/docs` when running the full-stack version
- Review the static demo at the GitHub Pages URL

---

**Built with ❤️ for working mothers everywhere** 👩‍💻👶
