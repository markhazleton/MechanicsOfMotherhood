import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
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
          // Separate vendor chunks for better caching
          vendor: ["react", "react-dom"],
          router: ["wouter"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
          ],
          query: ["@tanstack/react-query"],
          markdown: ["react-markdown"],
          icons: ["lucide-react"],
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
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
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
});
