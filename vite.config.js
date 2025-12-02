import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React and React DOM
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Form libraries
          'form-vendor': ['formik'],
          // Firebase
          'firebase-vendor': ['firebase'],
          // PDF generation
          'pdf-vendor': ['html2pdf.js'],
          // UI libraries
          'ui-vendor': ['react-icons', 'react-toastify', 'react-signature-canvas'],
          // Email
          'email-vendor': ['@emailjs/browser', 'emailjs-com'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB to reduce warnings
  },
});
