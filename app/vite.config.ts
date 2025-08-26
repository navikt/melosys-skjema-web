import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tanstackRouter(), tailwindcss()],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
  server: {
    cors: {
      origin: [new RegExp("dev.nav.no$"), "http://localhost:4000"],
    },
  },
});
