import { defineConfig } from "vite";

export default defineConfig({
  root: "fixture",
  build: {
    outDir: "../fixture-dist",
    emptyOutDir: true,
    target: "es2022"
  }
});
