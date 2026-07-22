import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Use relative base path "./" for compatibility with both Capacitor Android APK (file://) and GitHub Pages
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:5001"
    }
  }
});
