## Context

The repository currently separates the Astro site in `web/` from human-facing Markdown content in `docs/`. The Astro site imports `docs/**/*.md` directly and exposes the rendered garden through stable public routes such as `/` and `/garden/dev/getting-started/`.

The garden is also becoming an Obsidian vault. Opening the folder directly in Obsidian currently names the vault `docs`, which is ambiguous alongside other repository documentation vaults. A committed `.obsidian/` folder has already been created locally, but the repo does not yet define which Obsidian files are shared project behavior and which are local workspace state.

The GitHub Pages workflow under `.github/workflows/deploy-pages.yml` runs the repository build task, uploads `web/dist`, deploys Pages, and verifies the public deployment. It does not currently call Quartz in this checkout, but it is still an impacted publication path because it exercises the static-site build that consumes the garden content root.

## Goals / Non-Goals

**Goals:**

- Rename the human-facing garden content root to the kebab-case `defend-docs/` so Obsidian presents a project-specific vault name without requiring shell quoting.
- Keep `web/` as the only Astro application and keep existing public site routes stable.
- Keep the GitHub Actions Pages workflow compatible with the renamed garden content root.
- Commit Obsidian settings that make newly generated internal links Astro-compatible Markdown links using relative paths.
- Track shared editing behavior, including hotkeys, so project collaborators can rely on the same shortcuts for core and future community-plugin workflows.
- Ignore personal workspace, layout, visual, cache, trash, and plugin-payload state unless a later change standardizes a specific plugin set.

**Non-Goals:**

- Do not introduce MDX as a garden source format.
- Do not standardize community plugins or commit plugin payloads in this change.
- Do not change public garden route slugs or the playable `/play/` route.
- Do not move Astro application code into the garden vault.

## Decisions

### Rename the folder instead of relying on an Obsidian display-name plugin

The vault name shown by Obsidian follows the opened folder name in the common workflow. Renaming `docs/` to the kebab-case `defend-docs/` solves the vault-switching ambiguity without requiring every collaborator to install a display-name plugin or handle spaces in shell commands.

Alternative considered: keep `docs/` and add a community plugin for vault nicknames. That would make a cosmetic requirement depend on plugin installation, which is premature before the project has chosen a community plugin policy.

### Keep plain Markdown as the garden source

Astro already renders `.md` files as the public garden. Obsidian supports Markdown editing and can generate Markdown-format internal links when Wikilinks are disabled. Keeping `.md` avoids requiring an MDX community plugin or asking authors to distinguish between Markdown notes and component-bearing site pages.

Alternative considered: allow `.mdx` garden files now. Core Obsidian can expose unsupported extensions through file visibility settings, and community plugins can improve MDX handling, but that adds plugin dependency and rendering ambiguity before the garden needs embedded components.

### Treat Obsidian settings as shared behavior or local state

The repo should track `.obsidian/app.json`, `.obsidian/core-plugins.json`, and `.obsidian/hotkeys.json` because they define how collaborators create links, which built-in features are expected, and which shortcuts Joel and other editors can rely on. The repo should ignore workspace/layout files, appearance choices, local trash, cache, and plugin payloads because they reflect personal state or future plugin-management decisions.

Alternative considered: ignore all `.obsidian/` files. That would avoid churn but would also fail to enforce the Markdown-link behavior this change is meant to establish.

### Preserve public routes while changing filesystem paths

The filesystem root should change from `docs/` to `defend-docs/`, but URL generation should continue producing `/`, `/garden/.../`, and `/play/`. The folder rename is an authoring and repository-structure change, not a public URL migration.

Alternative considered: mirror the folder name in URLs. That would leak an editor-facing label into the public site and break existing route expectations without user value.

### Treat GitHub Actions as part of the affected build path

The implementation should inspect `.github/workflows/deploy-pages.yml` even if no workflow edit is ultimately needed. The workflow delegates to `mise //:build`, so the likely code change remains in the Astro garden import path, but the workflow is the production path that proves the renamed vault still publishes correctly.

Alternative considered: rely only on local web tests. That would validate the import path but would miss workflow-level assumptions such as build command, artifact path, Pages base-path environment, and public verification.

## Risks / Trade-offs

- The new folder name is longer than `docs/` -> Mitigate by centralizing the garden root in `web/src/garden.ts` and tests, and by keeping public route slugs independent of the filesystem root.
- Obsidian may rewrite `app.json` keys differently across versions -> Mitigate by configuring once in Obsidian, committing only stable behavior keys, and validating with repository tests rather than assuming every UI preference is durable.
- Tracked hotkeys can conflict with personal shortcuts -> Mitigate by tracking only project-relevant hotkeys and documenting that shared hotkeys are part of the garden editing contract.
- Ignoring plugin payloads while tracking hotkeys can leave plugin-bound shortcuts inert -> Mitigate by deferring plugin-bound hotkeys until the corresponding plugin IDs are committed through a later plugin-standardization change.
- The GitHub Actions workflow may contain transitive assumptions about the garden source path -> Mitigate by inspecting `.github/workflows/deploy-pages.yml`, preserving the `web/dist` artifact contract, and running the build/public-route validation path.
