import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

// Support custom domain deployment on GitHub Pages.
// Logic priority:
// 1. If VITE_CUSTOM_DOMAIN env var set -> treat as custom domain (root base)
// 2. Else if a CNAME file exists in public/ -> also treat as custom domain
// 3. Else fall back to repository sub-path (for non custom-domain GitHub Pages)
const repoBase = "/MechanicsOfMotherhood/";
const publicDir = path.resolve(import.meta.dirname, "client", "public");
const cnamePath = path.join(publicDir, "CNAME");
const hasCnameFile = fs.existsSync(cnamePath);
const hasCustomDomain = !!process.env.VITE_CUSTOM_DOMAIN || hasCnameFile;

const isSSR = process.argv.includes("--ssr");

export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  base:
    process.env.NODE_ENV === "production"
      ? hasCustomDomain
        ? "/"
        : repoBase
      : "/",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false, // Disable sourcemaps in production for GitHub Pages
    rollupOptions: isSSR
      ? {}
      : {
          output: {
            manualChunks: (id) => {
              if (id.includes("node_modules")) {
                if (id.includes("react-markdown")) return "vendor-markdown";
                if (id.includes("react-helmet-async")) return "vendor-helmet";
                if (id.includes("wouter")) return "vendor-router";
                if (id.includes("lucide-react")) return "vendor-icons";
                if (/(react|react-dom)\\/.test(id)) return "vendor-react";
                // IMPORTANT: Do NOT split Radix UI packages into separate chunks.
                // Splitting (especially react-slot / tooltip) created a circular dependency
                // between the generated vendor chunk and the Radix chunk:
                //   vendor -> ui-radix-core (for Slot export) AND ui-radix-core -> vendor (for React)
                // During module evaluation the circular live binding left the React import undefined
                // at first access (forwardRef), causing the runtime error:
                //   TypeError: Cannot read properties of undefined (reading 'forwardRef')
                // Keeping all @radix-ui modules inside the main vendor graph ensures
                // stable evaluation order and removes the blank screen on production.
                if (id.includes("@radix-ui/")) return "vendor";
                if (id.match(/(clsx|tailwind-merge|class-variance-authority)/))
                  return "utils-style";
                return "vendor";
              }
              // Page-level splits (recipe / blog heavy routes)
              if (id.includes("pages/recipe-detail"))
                return "page-recipe-detail";
              if (id.includes("pages/category-recipes"))
                return "page-category-recipes";
              if (id.includes("pages/blog")) return "page-blog";
              if (id.includes("analytics") || id.includes("useAnalytics"))
                return "analytics";
            },
            chunkFileNames: "assets/[name]-[hash].js",
            entryFileNames: "assets/[name]-[hash].js",
            assetFileNames: "assets/[name]-[hash].[ext]",
          },
        },
    // Optimize build performance
    minify: "esbuild",
    target: "esnext",
    // Enforce stricter chunk size warnings
    chunkSizeWarningLimit: 300,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    port: 5000,
    host: true, // Allow external connections for testing
  },
  preview: {
    port: 4173,
    host: true,
  },
  ssr: {
    noExternal: ["react-helmet-async"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/__tests__/**/*.{test,spec}.{ts,tsx}"],
  },
});
