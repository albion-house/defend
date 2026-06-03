# Astro Platform

Defend uses Astro as the canonical static site shell and Phaser as an embedded client-side runtime surface. The site is the public interface for playable builds, theme previews, faction previews, asset metadata, design tokens, rendering experiments, gameplay documentation, and runtime validation.

## Boundaries

- `src/pages/` owns static routes and route-level composition.
- `src/layouts/` and `src/components/` own presentation components.
- `src/content/platform.ts` owns typed platform metadata for routes, themes, factions, design tokens, rendering experiments, assets, validation reports, and gameplay docs.
- `src/runtime/phaserApp.ts` owns Phaser mounting and teardown.
- `src/game/`, `src/scenes/`, `src/net/`, and `src/systems/` remain runtime game modules.

Astro pages may render runtime metadata, but they should not reach directly into Phaser scene internals. The playable surface mounts through the runtime adapter so future routes can embed or replace the game surface without changing simulation code.

## Theme and Asset Pipeline

Theme manifests describe biome, faction, enemy theme, tileset, environment FX, UI theme, audio theme, gameplay modifiers, palette, asset references, lineage, and readability status. Asset catalog entries describe generated or future-generated assets, atlas metadata, source lineage, intended runtime use, and validation state.

This increment keeps the pipeline static and deterministic. Future AI art pipeline output can be committed as metadata and rendered by Astro during the next build without a backend.

## Deployment

`npm run build` type-checks the project and runs `astro build`. GitHub Pages uploads `dist/` and the post-deploy Playwright job verifies that the published page serves the expected deployment version and that the Phaser surface is playable.

## OpenSpec Workflow

Every workflow cycle follows:

```sh
/opsx:propose -> /opsx:apply -> /opsx:sync -> /opsx:archive
```

After every stage transition, commit immediately with a conventional commit and keep the worktree clean before continuing. At the end of every `/opsx:apply`, run the app or site, inspect the actual UI in a browser, fix defects found during inspection, and repeat until the implemented scope is visually coherent.
