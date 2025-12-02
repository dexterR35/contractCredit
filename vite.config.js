import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for assets (works in subdirectories)
  build: {
    // Let Vite handle chunking automatically to avoid circular dependency issues
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB to reduce warnings
  },
});
