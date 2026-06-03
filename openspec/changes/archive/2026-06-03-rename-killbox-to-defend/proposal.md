## Why

The repository has moved to the `defend` checkout/name, but the product, code, docs, OpenSpec context, package metadata, deployment paths, browser automation contracts, and UI copy still refer to `killbox` or `Killbox`. That split makes the project harder to reason about, especially for contributors and automation that rely on package names, public Pages paths, environment variables, and debug API names.

Renaming the repo everywhere to Defend should create one canonical identity across player-facing surfaces and developer-facing contracts without changing gameplay scope, simulation behavior, or the Astro/Phaser architecture.

## What Changes

- Rename player-facing product copy from Killbox to Defend across the Astro site, static fallback page, manifest, README, reference docs, and OpenSpec main specs.
- Rename package and lockfile metadata from `killbox` to `defend`.
- Update GitHub Pages base paths and public verification expectations from `/killbox/` to `/defend/`.
- Rename environment variables, debug API globals, DOM data attributes, custom events, TypeScript types, runtime mounting functions, and tests that use Killbox-specific identifiers.
- Update OpenSpec project context so future changes describe Defend as the active project.
- Keep behavior, routes such as `/play/`, gameplay state, visual design, and validation coverage functionally unchanged except for the renamed identifiers.
- Avoid leaving active `killbox` references outside archived historical OpenSpec changes unless a compatibility alias is deliberately documented.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `product-thesis`: rename the product identity from Killbox to Defend while preserving the cooperative action tower-defense thesis.
- `astro-game-platform`: rename public platform copy and deployment-version surfaces to Defend.
- `web-game-structure`: rename repository/project structure references and Pages deployment expectations to Defend.
- `dev-environment`: rename public verification URLs and project-specific environment variables to Defend names.
- `ai-observability`: rename debug API, DOM data attributes, events, and automation contracts to Defend names.
- `living-design-system`: rename design-system brand copy to Defend.
- `reference-documentation`: rename shared reference documentation and glossary language to Defend.

## Impact

- Affected source: Astro pages/layouts/components, Phaser runtime boot code, debug API code, deployment-version helper, TypeScript env definitions, Playwright config, and tests.
- Affected metadata: `package.json`, `package-lock.json`, `public/manifest.json`, `astro.config.ts`, `vite.config.ts`, and any GitHub Pages path configuration.
- Affected docs/specs: README, reference docs, OpenSpec config, active consolidated specs, and the new change specs.
- Affected validation: TypeScript lint, unit tests, production build, Playwright public/local verification, and OpenSpec validation must pass after the rename.
