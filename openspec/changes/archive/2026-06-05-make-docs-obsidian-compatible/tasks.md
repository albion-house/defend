## 1. Rename Garden Root

- [x] 1.1 Rename `docs/` to `defend-docs/` while preserving all existing Markdown content and the existing `.obsidian/` configuration directory.
- [x] 1.2 Update repository references in `README.md`, human-facing docs, and OpenSpec-facing implementation notes from `docs/` to `defend-docs/` where they describe the canonical garden root.
- [x] 1.3 Preserve existing public route slugs and Markdown filenames after the filesystem rename.

## 2. Obsidian Configuration

- [x] 2.1 Configure `defend-docs/.obsidian/app.json` so Obsidian generates Markdown-format internal links with relative paths and updates links on file rename.
- [x] 2.2 Keep shared core-plugin configuration in `defend-docs/.obsidian/core-plugins.json`.
- [x] 2.3 Add or preserve `defend-docs/.obsidian/hotkeys.json` as a tracked shared editing contract file.
- [x] 2.4 Update `.gitignore` so shared Obsidian settings remain trackable while workspace, appearance, graph, cache, trash, theme, snippet, and plugin-payload state are ignored by default.
- [x] 2.5 Add human-facing Obsidian setup instructions under `defend-docs/` and link them from the garden home.

## 3. Astro Garden Integration

- [x] 3.1 Update `web/src/garden.ts` to import Markdown from `defend-docs/**/*.md` and strip the renamed root when deriving garden slugs.
- [x] 3.2 Update web tests and page error messages that reference the old `docs/` content root.
- [x] 3.3 Confirm the home page, `/garden/.../` pages, and `/play/` route behavior remain unchanged after the rename.
- [x] 3.4 Inspect `.github/workflows/deploy-pages.yml` for direct or transitive assumptions about the garden content root, static-site build command, `web/dist` upload path, Pages base-path environment, and public verification path.

## 4. Validation

- [x] 4.1 Run the focused web garden tests that prove the renamed content root is read correctly.
- [x] 4.2 Run the repository check task or the closest available validation path for lint, unit tests, static build, browser smoke coverage, GitHub Pages build compatibility, and OpenSpec validation.
- [x] 4.3 Run `openspec validate --changes make-docs-obsidian-compatible --strict --no-interactive`.
- [x] 4.4 Review `git status --short` to ensure the rename, committed Obsidian settings, and ignore behavior match the proposal scope.
