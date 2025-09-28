# Tailwind CSS v4 Error Fix - September 28, 2025

## 🐛 Issue Resolved

**Error Message:**

```
[plugin:@tailwindcss/vite:generate:serve] Cannot apply unknown utility class `mom-button-primary`
```

## 🔍 Root Cause Analysis

The error occurred because of an incorrect use of the `@apply` directive in the legacy compatibility section:

```css
.btn-brand-primary { 
  @apply mom-button-primary;  // ❌ INCORRECT
}
```

### **Problem Explanation:**

- The `@apply` directive can only be used with **Tailwind utility classes**
- `.mom-button-primary` is defined as a **CSS component class** in our `@layer components` section
- Tailwind CSS v4 cannot apply component classes using `@apply` - only utility classes

## ✅ Solution Applied

**Fixed Code:**

```css
.btn-brand-primary { 
  background-color: hsl(var(--color-primary));
  color: hsl(var(--color-primary-foreground));
  border-radius: var(--radius);
  font-weight: 600;
  padding: var(--spacing-3) var(--spacing-6);
}
```

### **Fix Details:**

- Replaced `@apply mom-button-primary` with actual CSS properties
- Used the same design tokens as the `.mom-button-primary` component
- Maintained identical styling and functionality
- Preserved backward compatibility for legacy components

## 🧪 Validation Results

### **Build Status:**

- ✅ **Development Server**: Running successfully on <http://localhost:5001>
- ✅ **Production Build**: Completes without errors (`npm run build:static`)
- ✅ **CSS Compilation**: No Tailwind compilation errors
- ✅ **File Size**: Optimized output (45.15 kB CSS, 8.26 kB gzipped)

### **Build Output:**

```
vite v7.1.7 building for production...
✓ 1964 modules transformed.
../dist/public/assets/index-[hash].css   45.15 kB │ gzip: 8.26 kB
✓ built in 2.24s
```

## 📋 Technical Notes

### **Tailwind CSS v4 `@apply` Rules:**

1. **✅ Valid:** `@apply px-4 py-2 bg-blue-500 text-white` (utility classes)
2. **❌ Invalid:** `@apply my-custom-component` (component classes)
3. **❌ Invalid:** `@apply mom-button-primary` (our component classes)

### **Best Practices for Component Classes:**

- Define component classes in `@layer components`
- Use CSS properties directly for styling
- Reference design tokens with `var(--token-name)`
- Avoid `@apply` with custom component classes

### **Legacy Compatibility Strategy:**

- Keep existing class names (`.btn-brand-primary`)
- Apply styles directly using CSS properties
- Use design tokens for consistency
- Maintain visual parity with modern components

## 🎯 Current Status

**✅ RESOLVED AND VALIDATED**

The Tailwind CSS compilation error has been completely resolved. The application now:

- Builds successfully without CSS errors
- Maintains all existing functionality
- Preserves legacy component compatibility
- Uses proper Tailwind CSS v4 patterns

**Development server is running successfully at <http://localhost:5001>**

---

*Fix Applied: September 28, 2025*  
*Error Type: Tailwind CSS v4 `@apply` directive misuse*  
*Resolution: Direct CSS property implementation*  
*Status: Validated and Production Ready*
