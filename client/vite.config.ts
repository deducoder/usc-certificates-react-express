import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://172.25.16.1:8000", // Cambiar "localhost" por la IP real de PC1
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
