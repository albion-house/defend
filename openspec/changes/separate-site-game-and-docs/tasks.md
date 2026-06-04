## 1. Establish Workspace Boundaries

- [ ] 1.1 Add root workspace coordination metadata and focused package metadata for `web/` and `defend-game-client/`, including an explicit game-client export surface without adding registry publication automation.
- [ ] 1.2 Add the `docs/` knowledge-garden directory structure for development, design, journal, reference, and speculation content.
- [ ] 1.3 Add an architecture-free tracked stub under `defend-game-server/` without package metadata, runtime dependencies, protocols, or implementation scaffolding.

## 2. Extract the Game Client

- [ ] 2.1 Move Phaser runtime, simulation, runtime content, transport, scenes, systems, styles required by the game, and focused unit tests into `defend-game-client/` while preserving current gameplay behavior.
- [ ] 2.2 Define the game-client package's public mount and teardown API and update internal imports so consumers do not reach into package internals.
- [ ] 2.3 Remove Astro and site-global DOM assumptions from the game client; expose supported host state through the public runtime, stable events, or callbacks while preserving `window.__DEFEND_DEBUG__`.
- [ ] 2.4 Add an independent non-Astro embed fixture or test that verifies mount, canvas rendering, semantic debug state, supported commands, deployment-version input, and teardown.
- [ ] 2.5 Run the game-client unit and independent embed checks before removing the original root source paths.

## 3. Build the Human Documentation Source

- [ ] 3.1 Move current reference documentation into the new `docs/` information architecture and repair links without duplicating canonical material.
- [ ] 3.2 Create focused human development documentation for getting started, repository architecture, commands, testing, deployment, browser automation, and OpenSpec workflow.
- [ ] 3.3 Classify useful hard-coded theme, faction, rendering, asset, gameplay, and design-system material as current design notes or speculation under `docs/`; remove placeholder material with no immediate audience value.
- [ ] 3.4 Audit maintained human-facing Markdown for audience, canonical ownership, duplication, lowercase headings where practical, short sentences, and the casual Defend voice.
- [ ] 3.5 Rewrite the root README for game enthusiasts so it briefly introduces Defend and links to the playable build, knowledge garden, and `docs/` without development or architecture detail.

## 4. Move and Refocus the Astro Site

- [ ] 4.1 Move Astro configuration, site implementation, public assets, site-focused tests, and browser integration tests under `web/`.
- [ ] 4.2 Configure Astro to read canonical Markdown directly from the root `docs/` tree and render it as the knowledge garden without copying the prose into `web/`.
- [ ] 4.3 Implement the Astro game component against the game-client package's public API and keep deployment and site-owned semantic presentation outside the game package.
- [ ] 4.4 Replace the fixed platform-route inventory and hard-coded platform content with a content-led knowledge-garden home and stable playable route.
- [ ] 4.5 Update browser tests to verify knowledge-garden navigation, the Astro embed, public deployment version state, and current game readiness without requiring removed speculative routes.

## 5. Finish Repository Coordination

- [ ] 5.1 Update root mise and Aube commands, dependency installation, lockfiles, TypeScript configuration, and test coordination for the separated workspace while keeping the documented root command surface.
- [ ] 5.2 Update Playwright configuration for its new location while preserving one dynamically selected and reused loopback preview port per local run.
- [ ] 5.3 Update the GitHub Pages workflow to install, build, upload, and publicly verify the Astro site from the separated workspace.
- [ ] 5.4 Update `openspec/config.yaml` and active OpenSpec path references so agents use `web/`, `docs/`, and `defend-game-client/` instead of the obsolete root `src/` structure.
- [ ] 5.5 Remove obsolete root application source, configuration, tests, and duplicate content after the separated projects pass their focused checks.

## 6. Validate the Reorganization

- [ ] 6.1 Run dependency installation, game-client type checks, unit tests, independent embed verification, and package build validation.
- [ ] 6.2 Run Astro type checks, documentation/content validation, production build, and local Playwright integration coverage.
- [ ] 6.3 Run the site locally, inspect the knowledge garden and playable route in a browser at desktop and mobile sizes, and fix visible content, layout, or embedding defects.
- [ ] 6.4 Run the root full-check task and `openspec validate --all --strict --no-interactive`.
- [ ] 6.5 Verify the final repository contains no duplicate canonical prose or obsolete root application paths and that `git status --short` shows only intended change files.
