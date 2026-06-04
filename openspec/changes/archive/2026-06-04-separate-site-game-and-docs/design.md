## Context

Defend currently has one root Node package. Astro pages, hard-coded platform content, Phaser runtime code, game simulation, tests, and build configuration all share the root `src/` and root package configuration.

That structure came from adding Astro around an existing Phaser prototype. It works, but it makes Astro the apparent owner of the game, mixes speculative knowledge-garden material with runtime data, and gives human-facing documentation no clear source of truth.

This change serves four audiences:

- game enthusiasts browsing the root README or public site
- contributors reading the knowledge garden and development documentation
- core developers and coding agents reading active OpenSpec contracts
- webpages embedding the reusable game client

The current playable behavior, deterministic simulation, semantic debug API, static GitHub Pages deployment, and dynamic Playwright preview-port behavior must survive the move.

## Goals / Non-Goals

**Goals:**
- Make top-level directory ownership obvious.
- Make `docs/` the canonical source for human-facing knowledge and instructions.
- Give the root README one small, visitor-oriented job.
- Make the game client independent of Astro and embeddable by another webpage.
- Keep the Astro site as one host of the game and as the renderer for the knowledge garden.
- Remove speculative site material from active product requirements while preserving useful ideas as clearly labeled documentation.
- Preserve current gameplay, automation, build, deployment, and verification behavior.

**Non-Goals:**
- No live multiplayer or server architecture.
- No registry publication or release automation for the game-client package.
- No new gameplay, art pipeline, theme runtime, or design-system implementation.
- No rewrite of archived OpenSpec changes.
- No requirement that all human-facing prose use the same precision-oriented style as OpenSpec requirements.

## Decisions

### 1. Use a root-coordinated Node workspace

The root package becomes private coordination metadata for the workspace. `web/` and `defend-game-client/` each receive their own package metadata, TypeScript configuration, source, and focused tests. Root mise tasks remain the stable contributor command surface and coordinate workspace commands.

The game-client package will use a publishable package shape with an explicit export surface, but this change will not publish it to a registry. The initial package name should be scoped to the repository owner so external publication can be added later without renaming its public imports.

Alternative considered: keep one root package and only move folders. That would improve appearance without creating a real dependency boundary, so Astro could continue reaching into game internals.

### 2. Make dependency direction one-way

The supported dependency graph is:

```text
docs/ --------------------> web/
defend-game-client/ ------> web/

defend-game-server/         reserved only
```

`web/` may load Markdown from `docs/` and import the game client's public API. `defend-game-client/` may not import Astro, site components, site styles, or knowledge-garden content. `docs/` contains content rather than executable dependencies.

Alternative considered: allow shared imports in both directions. That would recreate the current ambiguous ownership under new directory names.

### 3. Render `docs/` directly instead of copying content

Astro will read the root `docs/` tree at build time and render it as the knowledge garden. The site may add navigation, layouts, and presentation metadata, but the canonical prose remains in `docs/`. The initial content organization will provide clear homes for development material, design work, journal entries, references, and speculation without requiring every folder to contain content immediately.

Existing useful hard-coded platform material will either move into an appropriately labeled Markdown document or be removed when it is placeholder copy with no current audience value. The build must not maintain a second copied version of the same prose inside `web/`.

Alternative considered: keep canonical content in Astro source and mirror selected files into `docs/`. That violates the requested source-of-truth boundary and invites drift.

### 4. Keep the public site small and content-led

The site must retain a knowledge-garden entry point and a playable route. Other routes emerge from useful `docs/` content instead of a fixed product-surface inventory. Existing theme, faction, rendering, asset, gameplay, and design-system routes do not need one-for-one preservation.

The root README will contain a short game introduction and links outward. Setup commands, architecture details, task inventories, deployment notes, and automation contracts move to focused development documents under `docs/`.

Alternative considered: preserve every existing route as a compatibility requirement. The routes currently reflect an AI-generated platform concept rather than a user-approved information architecture.

### 5. Make the game mount API the only supported host boundary

The game-client package will expose a small public API that accepts a host-provided element and returns a runtime with teardown and supported state access. Astro's custom component will call that API rather than importing scenes, simulation internals, or transport implementations.

The game client will continue to own `window.__DEFEND_DEBUG__` for browser automation. It will stop querying site-global presentation elements such as `#app`, `#deployment-version`, or `#semantic-state`. Host-facing state changes will be available through the returned runtime and stable events or callbacks. The Astro component may mirror that state into site-owned semantic markup for public deployment verification.

Deployment version information is supplied by the host when mounting the client. It is not coupled to Astro inside the game package.

Alternative considered: have the game client create the complete site-facing shell. That would make the package embeddable, but it would also make the reusable game own host presentation and accessibility decisions.

### 6. Place tests with the behavior they validate

Game simulation, transport, and debug API unit tests move with `defend-game-client/`. Site content and rendering tests move with `web/`. Browser tests that verify the public Astro host and embedded game live with the site because they validate the integration and deployment surface.

Root validation tasks coordinate both packages and OpenSpec. Playwright continues to choose one available loopback port per run and reuse it across that run.

Alternative considered: leave all tests at the root. That would obscure ownership and make the game-client package less independently verifiable.

### 7. Keep the server boundary deliberately empty

`defend-game-server/` will contain only a short placeholder or equivalent tracked marker explaining that architecture is intentionally undecided. It will not receive package metadata, a language runtime, protocol types, deployment configuration, or server tests in this change.

Alternative considered: scaffold a minimal TypeScript server. Even a minimal scaffold selects architecture and dependencies before the two-player server requirements are understood.

### 8. Apply voice according to audience

The README and human-facing knowledge-garden prose use lowercase headings where practical, short sentences, direct language, and a casual indie-label tone. Technical documents may still use code identifiers and exact commands.

OpenSpec remains concise and precise. Normative requirements continue to use formal requirement language because their audience needs unambiguous behavior contracts. Generated agent skills and archived OpenSpec artifacts are not rewritten for voice consistency.

Alternative considered: force lowercase casual prose into every Markdown file. That would reduce the clarity of normative requirements and churn historical or generated material with no audience benefit.

## Risks / Trade-offs

- [Workspace migration breaks builds or imports] -> Move in dependency order, keep root coordination commands stable, and validate each package before removing old paths.
- [Astro cannot consume root `docs/` cleanly] -> Use a build-time content loader or equivalent direct read with `docs/` as the configured base; do not introduce copied content as a workaround.
- [Game client remains accidentally tied to site DOM] -> Add an independent host fixture or test page and verify mounting, debug state, commands, and teardown without Astro.
- [Removing fixed routes breaks current browser tests] -> Replace route-inventory assertions with knowledge-garden navigation and embedded-play assertions while preserving public playability checks.
- [Speculative content is lost during cleanup] -> Classify useful material into design or speculation documents before deleting hard-coded platform data.
- [The reorganization becomes a gameplay refactor] -> Preserve current simulation and scene behavior; limit code changes to ownership, host boundaries, imports, and validation.
- [Lowercase voice harms technical precision] -> Apply the voice contract by audience and keep exact identifiers, commands, and normative OpenSpec language intact.

## Migration Plan

1. Add the target directories and workspace package metadata while the current root application still builds.
2. Move game-client source and focused unit tests into `defend-game-client/`; establish and test the public mount API independently of Astro.
3. Move Astro implementation, site tests, and browser tests into `web/`; integrate the game through the package export.
4. Create the `docs/` information architecture, move current human-facing documentation, and classify useful hard-coded platform material.
5. Replace fixed platform content/routes with content-led knowledge-garden rendering and rewrite the root README.
6. Add the architecture-free `defend-game-server/` stub.
7. Update root tasks, workspace lock/configuration, GitHub Pages workflow, OpenSpec context, and active path references.
8. Run package checks, site build, independent embed verification, local browser inspection, public-route smoke coverage, and strict OpenSpec validation.

If the migration cannot be completed safely, revert the change as one structural increment. Do not leave duplicate root and package source trees as parallel canonical implementations.

## Open Questions

- The exact scoped registry package name can be finalized during implementation, before any public export imports are committed. No registry publication is part of this change.
