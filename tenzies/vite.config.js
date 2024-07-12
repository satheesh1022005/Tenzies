import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    cssCodeSplit: true,
    outDir: "build",
    mimeTypes: {
      ".js": "application/javascript",
    },
  },
});
