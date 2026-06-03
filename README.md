# Defend

Defend is a browser-playable tower-defense prototype and Astro-based game platform. The current build is a legally distinct, single-player first playable made with TypeScript, Astro, and Phaser, with a deterministic simulation core shaped for future remote co-op experiments.

A pre-pivot checkpoint is preserved by git tag:

```sh
git checkout pre-phaser-pivot
```

## Setup

Project tooling is managed with [mise](https://mise.jdx.dev/). The repository follows a stable/LTS-first toolchain policy: Node stays on the current supported major line in `mise.toml`, Aube is the preferred npm-compatible package manager, and `mise.lock` records exact resolved tool versions.

```sh
mise install
mise run install
```

The normal task path uses Aube through mise. npm remains a fallback for local environment diagnosis, and Python is not part of this project toolchain.

## Run

```sh
mise run dev
```

Astro serves the platform locally. The home route embeds the playable Phaser prototype and links to canonical routes for themes, factions, design-system docs, rendering experiments, asset previews, and gameplay documentation.

The playable surface is **Saltmarsh Crossing**, an original one-map mission with two bending lanes, a merge chokepoint, one defended gate, eight curated build pads, shared gold, escalating scripted waves, victory/defeat, and instant restart.

## Gameplay Loop

Build towers on fixed pads, start waves, earn gold from defeated enemies, and keep enemies from leaking into the gate. The first playable has four original tower archetypes:

- Ranger Post: fast single-target physical damage
- Blast Foundry: slower splash damage
- Veil Spire: arcane damage and slow pressure
- Stoneward Lodge: deterministic blockers near chokepoints

The scripted mission includes five original enemy archetypes: Skitter, Brute, Shieldbearer, Glider, and Mender. These are simple geometric shapes for now; the focus is readable combat pacing and deterministic rules, not final art.

## Useful Tasks

```sh
mise tasks
mise run dev
mise run test
mise run build
mise run spec-check
mise run check
```

For GitHub Pages compatibility, the Astro base path is selected with `GITHUB_PAGES=true`:

```sh
GITHUB_PAGES=true mise run build
```

GitHub Actions installs the mise-managed toolchain, uses Aube for deterministic dependency installation and script execution, builds the Astro static output into `dist/`, deploys it to GitHub Pages, and then runs Playwright against the published URL using the expected deployment version.

## Reference Docs

Shared Defend terminology lives in the markdown reference docs at [docs/reference](docs/reference/README.md). Use the [glossary](docs/reference/glossary.md) for canonical definitions of recurring game and development terms, and the [toolchain policy](docs/reference/toolchain.md) for mise, Aube, Node, and GitHub Actions expectations.

The current architecture keeps Astro presentation, deterministic simulation, and Phaser rendering separated:

- `src/pages/` defines Astro routes for the platform surfaces.
- `src/layouts/` and `src/components/` own site presentation and the game embed shell.
- `src/content/platform.ts` defines typed route, theme, faction, token, rendering, asset, validation, and gameplay documentation data.
- `src/runtime/phaserApp.ts` mounts and tears down the Phaser game as a client-only interactive surface.
- `src/game/content.ts` defines mission, map, tower, enemy, and wave data.
- `src/game/state.ts` owns serializable mission state, commands, fixed ticks, combat, rewards, leaks, victory, defeat, and restart.
- `src/scenes/PrototypeScene.ts` renders snapshots and dispatches player commands.
- `src/game/debug.ts` exposes semantic browser state for tests and agents.
- `src/net/transport.ts` remains a protocol-shaped mock transport for future remote co-op work.

## OpenSpec

OpenSpec is installed by mise from the npm package `@fission-ai/openspec`.

```sh
mise run openspec -- <args>
mise run spec-check
```

Platform work follows this required cycle:

```sh
/opsx:propose -> /opsx:apply -> /opsx:sync -> /opsx:archive
```

Commit immediately after each stage transition with a clear conventional commit and keep `git status --short` clean before moving to the next stage. At the end of every `/opsx:apply`, run the site, inspect the actual UI in a browser, fix rendering or interaction defects, and repeat through a new OpenSpec iteration when the defect changes requirements or design.

## Browser Automation Contract

The playable route exposes semantic state for tests and coding agents through:

```ts
window.__DEFEND_DEBUG__
```

The debug API can describe the current mission, active players, objective HP, shared gold, wave state, tower and enemy entities, content counts, build-pad occupancy, outcome state, and supported commands. The app also mirrors coarse state onto `#app` data attributes and `#semantic-state` text for browser-level inspection.
