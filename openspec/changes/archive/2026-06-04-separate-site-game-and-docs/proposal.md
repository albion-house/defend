## Why

The repository currently treats the Astro site, its knowledge-garden content, and the Phaser game as one application under `src/`. That accidental boundary makes the game harder to embed elsewhere, makes speculative site content look like settled product requirements, and leaves repository documentation without a clear audience or voice.

Separating these concerns now keeps the playable prototype easy to develop while giving the game, site, documentation, and future server room to grow independently.

## What Changes

- **BREAKING** Reorganize the repository around four explicit ownership boundaries:
  - `web/` contains the Astro site implementation and non-content site assets.
  - `docs/` contains the human-facing knowledge garden, development instructions, design material, journal entries, references, and speculation rendered by the site.
  - `defend-game-client/` contains a publishable TypeScript/Phaser game-client package that can be embedded by Astro or another webpage without depending on Astro.
  - `defend-game-server/` is an intentionally architecture-free stub for future two-player server work.
- Refactor the root README for game enthusiasts browsing GitHub: short, lowercase, casual copy that introduces the game and points readers to the playable build and knowledge garden.
- Establish an audience-aware documentation contract for repository Markdown. Human-facing prose uses the casual indie-label voice; precise OpenSpec requirements retain the formal language needed by core developers and coding agents.
- Make `docs/` the source of truth for public knowledge-garden content and human development instructions instead of hard-coded TypeScript platform copy.
- Keep the Astro site responsible for public presentation and for embedding the game client through a custom component.
- Make the game client's public mount API host-independent. Host-specific DOM presentation, deployment metadata, and Astro integration remain outside the package.
- Preserve the static GitHub Pages deployment, playable route, semantic debug API, deterministic tests, and dynamic local Playwright preview ports across the reorganization.
- Treat theme galleries, design-system notes, rendering experiments, and asset-pipeline ideas as optional knowledge-garden material rather than required product routes or settled runtime capabilities.
- Update active OpenSpec context and requirements to describe the new directory and audience boundaries without rewriting archived change history.

Non-goals:
- Do not design or implement the future two-player game server.
- Do not add live multiplayer, new gameplay, final art, campaign systems, or production networking.
- Do not require every knowledge-garden topic to have a dedicated Astro route.
- Do not rewrite archived OpenSpec artifacts to match the new structure or writing voice.

## Capabilities

### New Capabilities
- `repository-structure`: Defines ownership, dependency direction, and placement rules for `web/`, `docs/`, `defend-game-client/`, `defend-game-server/`, and root coordination files.

### Modified Capabilities
- `web-game-structure`: Moves the browser game into an independently embeddable client package and removes the shared root `src/` structure.
- `astro-game-platform`: Moves Astro into `web/`, makes it consume `docs/`, and narrows mandatory public surfaces to the knowledge garden and embedded playable build.
- `reference-documentation`: Makes `docs/` the canonical home for human-facing project knowledge and instructions, with explicit audiences and repository voice.
- `dev-environment`: Updates root commands, workspace installation, tests, builds, and Pages verification for the separated projects.
- `content-data`: Separates knowledge-garden content from game runtime data and stops requiring speculative site metadata to be shared runtime content.
- `asset-pipeline-visibility`: Recasts asset-pipeline material as optional knowledge-garden content rather than a mandatory product route.
- `living-design-system`: Recasts design-system and rendering notes as optional knowledge-garden content rather than mandatory site surfaces.
- `themeable-game-system`: Recasts speculative theme material as knowledge-garden content until runtime behavior requires a formal theme system.
- `openspec-workflow-discipline`: Clarifies that OpenSpec is the precise dev-time contract for core developers and coding agents, while human instructions live in `docs/`.

## Impact

- Moves the current root Astro configuration and site source into `web/`.
- Moves game runtime, simulation, transport, scene, debug, and related tests into `defend-game-client/`.
- Replaces hard-coded platform content with Markdown-oriented knowledge-garden content under `docs/`.
- Adds workspace-aware package metadata and updates mise, Aube, TypeScript, Vitest, Playwright, and GitHub Pages paths.
- Changes the game's embedding boundary and associated imports while preserving current playable behavior and automation state.
- Updates active specs and `openspec/config.yaml` to stop directing agents toward the obsolete root `src/` layout.
