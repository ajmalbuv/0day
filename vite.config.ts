import { defineConfig } from "vite";

export default defineConfig({
  build: {
    manifest: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
      },
    },
  },
});
