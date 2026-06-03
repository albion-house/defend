## Context

The current repository path is `albion-house/defend`, but the implementation still uses Killbox as the product and project name. Existing references include user-facing text, package names, `/killbox/` Pages base paths, `KILLBOX_*` and `VITE_KILLBOX_*` environment variables, `window.__KILLBOX_DEBUG__`, `data-killbox-*` DOM attributes, `killbox:state-change` browser events, `mountKillboxGame`, `KillboxRuntime`, and OpenSpec context/spec language.

Archived OpenSpec changes also contain historical Killbox references. Those should remain archival unless the archive mechanism requires synced wording; the active rename goal is current source, documentation, config, active specs, and new tests.

## Goals / Non-Goals

**Goals:**

- Establish Defend as the canonical repository, product, package, documentation, and OpenSpec name.
- Rename public GitHub Pages base paths from `/killbox/` to `/defend/`.
- Rename machine-facing contracts consistently so future automation uses `DEFEND_*`, `VITE_DEFEND_*`, `window.__DEFEND_DEBUG__`, `data-defend-*`, and `defend:*` event names.
- Update tests and validation scripts so the renamed contracts are exercised directly.
- Keep archived change history readable as historical record unless validation requires otherwise.

**Non-Goals:**

- Do not redesign the game, visual identity, UI layout, mission mechanics, or route inventory.
- Do not change the prototype from tower-defense/co-op-shaped gameplay to a different genre.
- Do not introduce compatibility aliases unless tests, deployment, or external consumers prove they are needed.
- Do not rename unrelated third-party dependencies, generic gameplay terms, or archived historical references solely for cosmetic completeness.

## Decisions

- Use `Defend` for player-facing title case, `defend` for package/repository/path identifiers, and `DEFEND` for environment variables and browser globals.
- Treat browser automation names as first-class public contracts. Rename the debug global, data attributes, event names, query parameters, TypeScript interfaces, helper functions, and tests together so there is one current API.
- Update both Astro and Vite GitHub Pages base configuration to the repository base path `/defend/`.
- Keep the route structure unchanged. The playable route remains `/play/`, and platform routes such as `/themes/`, `/factions/`, `/design-system/`, `/rendering/`, `/assets/`, and `/gameplay/` remain canonical.
- Leave archived OpenSpec changes as historical records, but ensure active specs and config no longer describe the current project as Killbox.

## Risks / Trade-offs

- External automation or old deployment jobs may still provide `KILLBOX_*` variables. Mitigation: update repository workflow/docs/tests in the same change and only add aliases if an active integration is identified.
- Renaming DOM attributes and debug globals can break browser tests in many places at once. Mitigation: rename implementation and tests in one pass, then run unit tests and Playwright checks.
- GitHub Pages base-path changes can fail if repository Pages settings or workflow environment still target the old path. Mitigation: validate local build base output and public verification config; confirm deployment target during apply.
- A broad text rename may touch archived specs unintentionally. Mitigation: scope active searches to source, docs, config, active specs, package metadata, and tests; review any archive edits before committing.

## Migration Plan

1. Inventory all active case variants of `killbox`, `Killbox`, and `KILLBOX` outside archived OpenSpec history.
2. Rename player-facing copy, docs, manifest, package metadata, OpenSpec config, and active specs to Defend.
3. Rename code-level identifiers, debug globals, DOM data attributes, custom events, env vars, query parameters, and tests to Defend equivalents.
4. Update GitHub Pages base paths and public verification defaults from `/killbox/` to `/defend/`.
5. Run lint, unit tests, build, browser verification where practical, and OpenSpec validation.
6. Run a final active-reference search to prove no current `killbox` references remain except intentionally documented compatibility aliases or archived historical files.

## Open Questions

- Should the implementation keep temporary aliases for `window.__KILLBOX_DEBUG__` or `KILLBOX_*` environment variables for one release, or should the rename be clean with no active compatibility layer?
- Is the public Pages URL expected to move to an `albion-house.github.io/defend/` deployment, or should only the repository base path change while the owner/domain remains configured elsewhere?
