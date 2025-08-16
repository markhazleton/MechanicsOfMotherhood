# 🍳 Recipe Images

Place recipe and food photos here.

## Naming Convention

- Use descriptive, URL-friendly names
- Example: `chicken-pasta-recipe.jpg`, `vegetable-stir-fry.webp`

## Recommended Sizes

- **Card thumbnails**: 400x300px  
- **Detail pages**: 800x600px
- **Hero images**: 1200x800px

## Usage in Recipe Cards

```tsx
<img 
  src={`/images/recipes/${recipe.slug}.jpg`}
  alt={recipe.title}
  className="w-full h-48 object-cover"
/>
```
