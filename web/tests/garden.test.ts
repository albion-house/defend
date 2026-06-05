import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const docsRoot = resolve(import.meta.dirname, "../../defend-docs");

describe("knowledge garden", () => {
  it("reads canonical markdown from the defend-docs tree", () => {
    const paths = markdownPaths(docsRoot);

    expect(paths).toContain("index.md");
    expect(paths).toContain("dev/getting-started.md");
    expect(paths).toContain("speculation/world-and-art.md");
  });

  it("keeps every document named and summarized", () => {
    for (const path of markdownPaths(docsRoot)) {
      const source = readFileSync(resolve(docsRoot, path), "utf8");
      expect(source).toMatch(/^---\ntitle: .+\nsummary: .+\n/);
    }
  });
});

function markdownPaths(directory: string, prefix = ""): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    return entry.isDirectory()
      ? markdownPaths(resolve(directory, entry.name), relativePath)
      : entry.name.endsWith(".md")
        ? [relativePath]
        : [];
  });
}
