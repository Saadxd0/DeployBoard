import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",  // listen on all interfaces so Docker port-mapping works
    port: 3000,
  },

  // Forward /api requests to the Flask backend during development
  // This avoids CORS issues when running both services locally without Docker
  // (not strictly needed with docker-compose since CORS is configured on Flask)
  proxy: {},
});
