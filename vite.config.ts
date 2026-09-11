import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true, // 👈 Native Vite path resolution enabled here
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      server: { entry: "src/server.ts" },
    }),
    viteReact(),
  ],
});
