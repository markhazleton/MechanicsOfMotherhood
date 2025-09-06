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
            manualChunks: {
              "vendor-react": ["react", "react-dom"],
              "vendor-router": ["wouter"],
              "vendor-query": ["@tanstack/react-query"],
              "ui-radix-core": [
                "@radix-ui/react-slot",
                "@radix-ui/react-tooltip",
              ],
              "ui-radix-overlay": [
                "@radix-ui/react-dialog",
                "@radix-ui/react-toast",
              ],
              "ui-radix-layout": ["@radix-ui/react-separator"],
              "vendor-markdown": ["react-markdown"],
              "vendor-helmet": ["react-helmet-async"],
              "vendor-icons": ["lucide-react"],
              "utils-style": [
                "clsx",
                "tailwind-merge",
                "class-variance-authority",
              ],
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
