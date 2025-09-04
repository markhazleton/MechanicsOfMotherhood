import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  base: process.env.NODE_ENV === "production" ? "/MechanicsOfMotherhood/" : "/",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false, // Disable sourcemaps in production for GitHub Pages
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React functionality
          "vendor-react": ["react", "react-dom"],

          // Routing
          "vendor-router": ["wouter"],

          // State management
          "vendor-query": ["@tanstack/react-query"],

          // UI libraries - split into smaller chunks
          "ui-radix-core": ["@radix-ui/react-slot", "@radix-ui/react-tooltip"],
          "ui-radix-overlay": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-toast",
          ],
          "ui-radix-layout": ["@radix-ui/react-separator"],

          // Heavy dependencies split separately
          "vendor-markdown": ["react-markdown"],
          "vendor-helmet": ["react-helmet-async"],
          "vendor-icons": ["lucide-react"],

          // Styling utilities
          "utils-style": ["clsx", "tailwind-merge", "class-variance-authority"],
        },
        // Optimize chunk file naming
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
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["client/src/**/*.(test|spec).{ts,tsx}"],
  },
});
