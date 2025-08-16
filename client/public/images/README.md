# Image Placement Examples

## Created folders for you

### 📁 client/public/images/

- **logos/** - Brand logos, MoM logo variations
- **recipes/** - Recipe photos, food images  
- **hero/** - Hero section backgrounds, banners
- **icons/** - Favicons, app icons (different sizes)
- **tools/** - Kitchen tools, equipment images
- **categories/** - Category thumbnails
- **general/** - Other static images

## 🎯 Quick Start

1. **Add your favicon**: Place favicon files in `client/public/images/icons/`
2. **Add MoM logo**: Place logo variations in `client/public/images/logos/`
3. **Add recipe images**: Place food photos in `client/public/images/recipes/`

## 📝 Usage in Components

```tsx
// Logo example
<img src="/images/logos/mom-logo.svg" alt="MoM Logo" className="h-8 w-8" />

// Recipe image example  
<img src="/images/recipes/pasta-dish.jpg" alt="Pasta Recipe" className="w-full h-48 object-cover" />

// Background image example
<div 
  className="bg-cover bg-center h-96"
  style={{ backgroundImage: 'url(/images/hero/kitchen-background.jpg)' }}
/>
```

All images in `public/images/` are accessible via `/images/` URLs automatically!
