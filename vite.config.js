import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/Jammming/",
  plugins: [react()],
  server: {
    // Spotify wouldn't accept localhost URI
    host: "127.0.0.1",
    port: 5173,
  },
});
