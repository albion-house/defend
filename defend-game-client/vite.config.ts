import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    target: "es2022"
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/embed.spec.ts"]
  }
});
