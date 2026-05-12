import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
      "@app": path.resolve("./src/app"),
      "@pages": path.resolve("./src/pages"),
      "@widgets": path.resolve("./src/widgets"),
      "@features": path.resolve("./src/features"),
      "@entities": path.resolve("./src/entities"),
      "@shared": path.resolve("./src/shared"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080", //URL del backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});