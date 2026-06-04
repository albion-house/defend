import { defineConfig } from "astro/config";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/defend" : "/",
  build: {
    assets: "assets"
  },
  vite: {
    build: {
      target: "es2022"
    }
  }
});
