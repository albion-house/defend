## Why

Opening the knowledge garden directly in Obsidian currently presents the vault as `docs`, which is ambiguous when switching between project vaults. The garden also needs committed Obsidian settings that preserve Astro-compatible Markdown links and shared editing behavior without committing local workspace state.

## What Changes

- **BREAKING** Rename the top-level human-facing garden content directory from `docs/` to `defend-docs/`.
- Keep the Astro static site rendering the renamed garden content as the canonical public knowledge garden.
- Commit a minimal `.obsidian/` configuration inside `defend-docs/` that disables generated Wikilinks, prefers relative Markdown links, and preserves shared core-plugin and hotkey behavior.
- Add ignore rules for Obsidian-local workspace, appearance, cache, trash, and plugin payload state while leaving shared vault behavior eligible for version control.
- Defer standardizing and committing community plugin payloads, while allowing future committed plugin IDs and hotkeys to become part of the shared editing contract.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `repository-structure`: Update the explicit top-level content boundary from `docs/` to `defend-docs/` while preserving the separation from `web/`, `defend-game-client/`, and `defend-game-server/`.
- `reference-documentation`: Define the renamed garden folder as an Obsidian-compatible Markdown vault, including committed link-format and hotkey settings plus ignored local state.
- `astro-game-platform`: Require the Astro site to continue building and routing the public knowledge garden from the renamed garden content root.
- `web-game-structure`: Require the GitHub Pages publication workflow to be checked and kept compatible with the renamed garden content root.
- `openspec-workflow-discipline`: Update the human-instructions path referenced by workflow discipline requirements from `docs/` to `defend-docs/`.

## Impact

- Affected paths include `docs/`, `docs/.obsidian/`, `.gitignore`, `README.md`, `.github/workflows/deploy-pages.yml`, `web/src/garden.ts`, `web/src/pages/index.astro`, `web/tests/garden.test.ts`, site/garden E2E coverage, and human-facing docs that mention the content root.
- Active specs that currently name `docs/` as a contract must be updated through delta specs and later synced on archive.
- Existing public routes should remain stable; the filesystem rename must not change `/`, `/garden/.../`, or `/play/` behavior.
- MDX support is not introduced in this change; garden source remains plain Markdown unless a later change standardizes an MDX editing/rendering workflow.
