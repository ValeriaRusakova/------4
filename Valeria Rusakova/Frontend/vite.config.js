// Vite settings: the tool that runs and builds our React site.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // must match FRONTEND_URL in Backend/.env (CORS)
  },
});
