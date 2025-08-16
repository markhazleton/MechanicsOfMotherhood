# 📸 MoM Image Management Guide

## 🗂️ Folder Structure

Based on your Vite configuration, here's where to put different types of images:

### **Static Images (Recommended): `client/public/images/`**

```
client/public/images/
├── logos/           # MoM logo variations, favicon
├── recipes/         # Recipe photos, food images
├── hero/           # Hero section backgrounds, banners
├── icons/          # App icons, favicons (different sizes)
├── tools/          # Kitchen tools, equipment images
├── categories/     # Category thumbnails
└── general/        # Other static images
```

**How to use:** Reference with absolute paths from public root

```tsx
<img src="/images/logos/mom-logo.png" alt="MoM Logo" />
<img src="/images/recipes/pasta-recipe.jpg" alt="Pasta Recipe" />
```

### **Imported Images (Alternative): `client/src/assets/`**

For images that need bundling/optimization:

```
client/src/assets/
├── images/
│   ├── logos/
│   ├── recipes/
│   └── icons/
```

**How to use:** Import in components

```tsx
import momLogo from '@/assets/images/logos/mom-logo.png';
<img src={momLogo} alt="MoM Logo" />
```

## 🎯 Current Project Setup

Your Vite config shows:

- **Root**: `client/` folder
- **Public assets**: Served from `client/public/`
- **Base URL**: `/MechanicsOfMotherhood/` in production
- **Build output**: `dist/public/`

## 📋 Image Usage Examples

### **1. Logo in Navigation (Replace Lucide Icons)**

```tsx
// Instead of using Lucide icons, use your brand logo
<Link href="/" className="flex items-center space-x-3">
  <img 
    src="/images/logos/mom-icon.svg" 
    alt="MoM Logo" 
    className="h-8 w-8"
  />
  <div className="flex flex-col">
    <h1 className="font-mechanical text-xl font-bold text-tool-gray">MoM</h1>
    <p className="text-xs text-gray-500 font-industrial">MECHANICS OF MOTHERHOOD</p>
  </div>
</Link>
```

### **2. Hero Section Background**

```tsx
// Add background image to hero section
<section className="bg-gradient-to-br from-industrial-blue via-tool-gray to-workshop-teal py-20 relative">
  <div 
    className="absolute inset-0 opacity-10 bg-cover bg-center"
    style={{ backgroundImage: 'url(/images/hero/kitchen-tools-bg.jpg)' }}
  />
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    {/* Rest of hero content */}
  </div>
</section>
```

### **3. Recipe Cards with Images**

```tsx
// Add recipe images to cards
<Card className="gear-border bg-white rounded-xl overflow-hidden mechanical-shadow">
  <div className="relative h-48 overflow-hidden">
    <img 
      src={`/images/recipes/${recipe.image}`}
      alt={recipe.title}
      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
    />
  </div>
  <div className="p-6">
    <h3 className="font-mechanical text-lg font-semibold">{recipe.title}</h3>
    {/* Rest of card content */}
  </div>
</Card>
```

### **4. Favicon Setup**

Add to `client/index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/images/icons/favicon.svg" />
<link rel="icon" type="image/png" href="/images/icons/favicon-32x32.png" />
<link rel="apple-touch-icon" href="/images/icons/apple-touch-icon.png" />
```

## 🚀 Optimization Tips

### **Image Formats & Sizes**

- **Logos**: SVG (scalable) or PNG (high-res)
- **Photos**: WebP (modern browsers) with JPG fallback
- **Icons**: SVG preferred, PNG for complex icons
- **Backgrounds**: WebP/JPG, compressed for web

### **Responsive Images**

```tsx
<picture>
  <source media="(min-width: 768px)" srcSet="/images/hero/hero-desktop.webp" />
  <source media="(min-width: 480px)" srcSet="/images/hero/hero-tablet.webp" />
  <img src="/images/hero/hero-mobile.webp" alt="MoM Hero" className="w-full" />
</picture>
```

### **Lazy Loading**

```tsx
<img 
  src="/images/recipes/recipe.jpg" 
  alt="Recipe"
  loading="lazy"
  className="w-full h-48 object-cover"
/>
```

## 🎨 Brand Image Recommendations

Based on your MoM brand, consider these image types:

### **Logo Variations Needed:**

- `mom-logo-full.svg` - Full logo with text
- `mom-icon.svg` - Icon only for small spaces
- `mom-logo-white.svg` - White version for dark backgrounds
- `favicon.ico` - Browser favicon

### **Brand Colors for Images:**

Use your CSS variables in image editing:

- Tool Gray: `hsl(210 14% 40%)`
- Industrial Blue: `hsl(217 19% 27%)`
- Energetic Orange: `hsl(0 71% 67%)`
- Workshop Teal: `hsl(177 59% 47%)`

### **Hero/Background Images:**

- Kitchen tools arranged artistically
- Modern kitchen workspace
- Ingredients laid out systematically
- Abstract geometric patterns in brand colors

## 🔧 Implementation Example

Want to replace the current Lucide icons with your brand logo? Here's how:

```tsx
// Current navigation logo (using Lucide icons)
<div className="relative">
  <Settings className="text-tool-gray text-3xl animate-spin-slow" />
  <Utensils className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-energetic-orange text-sm" />
</div>

// Updated with brand logo
<div className="relative">
  <img 
    src="/images/logos/mom-gear-logo.svg"
    alt="MoM Logo"
    className="h-12 w-12 animate-spin-slow"
  />
</div>
```

## 📁 Next Steps

1. **Create your image assets** and place them in the appropriate folders
2. **Add favicon** to `client/public/images/icons/`
3. **Update components** to use images instead of icons where appropriate
4. **Test image loading** in both development and production builds

Your current Vite setup is perfect for handling both static and imported images efficiently!
