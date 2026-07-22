import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Target base path for GitHub Pages subfolder deployment (adhwith9.github.io/SmartShopAI/)
export default defineConfig({
  base: "/SmartShopAI/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:5001"
    }
  }
});
