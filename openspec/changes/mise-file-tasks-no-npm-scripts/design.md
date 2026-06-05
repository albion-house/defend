## Context

Task running currently flows through three layers:

```
mise.toml [tasks.*]  ──▶  root package.json "scripts"  ──▶  workspace package.json "scripts"
(TOML tasks)              (aube -r run / aube --filter)      (tsc, astro, vitest, playwright)
```

So `mise run build` is really `aube run build` → `aube -r run build` → (client) `tsc --noEmit` + (web) `tsc --noEmit && astro build`. CI calls the middle layer (`aube run …`); docs call the top layer (`mise run …`). The leaf commands live in npm scripts, where they cannot be shellchecked and where the two surfaces can silently diverge.

`aube` is a pnpm-style package manager installed via mise. Workspaces (`defend-game-client`, `web`) are declared in both `package.json` `workspaces` and `aube-workspace.yaml`, which also pins `minimumReleaseAge`. `defend-game-server` is a README placeholder with no package. `mise.toml` already uses the npm backend for `npm:@fission-ai/openspec` with `npm.package_manager = "auto"` (routes through aube), and sets a 5-day `minimum_release_age` tool gate.

Verified during exploration: `web/astro.config.ts`, `web/vite.config.ts`, `web/playwright.config.ts`, and the test files import `astro` / `vite` / `vitest` / `@playwright/test` **in-process**. Those packages are libraries that happen to ship a CLI, not standalone CLIs.

## Goals / Non-Goals

**Goals:**
- One command surface: file-based mise tasks, no npm scripts anywhere.
- `aube` used only as a package manager (install); never as a task runner.
- Cross-workspace coordination owned by mise, not by the package manager's recursive script runner.
- Preserve every existing task's observable behavior and the dynamic-port Playwright workflow.

**Non-Goals:**
- `sources`/`outputs` caching, incrementality, or `usage` argument specs (follow-on).
- Registering build/test libraries as global mise tools.
- Tasks for `defend-game-server`.

## Decisions

### D1: mise monorepo mode for cross-workspace fan-out
Enable `experimental_monorepo_root = true` (under `[settings] experimental = true`) and declare `[monorepo] config_roots = ["defend-game-client", "web"]`. Each workspace owns file tasks in its default convention dir; tasks are path-addressed (`//web:dev`, `//...:build`). Root aggregators (`build`, `lint`, `test`, `check`) use `depends = ["//...:lint", …]`.

- *Why over centralized root tasks:* keeps leaf logic next to the code it builds, uses convention instead of `task_config.includes` hardcoding, and inherits tool/env layering from the root config.
- *Alternatives considered:* (a) single root `mise-tasks/` that `cd`s into each workspace — works without experimental flags but duplicates workspace internals at the root and was rejected by the maintainer's convention-over-configuration preference; (b) `task_config.includes` — explicitly rejected (hardcoded dirs, name collisions, no clean prefixing).
- *Cost:* the public vocabulary changes from `mise run build` to `mise //...:build`; both gates live in the repo's `mise.toml` so contributors/CI need no exported env var.

### D2: Two tiers of tooling
- **Tier 1 — standalone CLIs** (no in-process import): stay in `[tools]` via the npm backend. `openspec` already is; nothing else qualifies today.
- **Tier 2 — libraries that also ship a CLI** (`astro`, `vite`, `vitest`, `@playwright/test`, `typescript`): stay as workspace dependencies with `package-lock.json` as the sole version source. Exposed on PATH per project via `[env] _.path = ["{{config_root}}/node_modules/.bin"]`, so file tasks call bare `astro build` / `vitest run` — no `aube exec`, no npm script.

- *Why not register Tier 2 as global mise tools:* it creates a second version source (mise.lock vs package-lock.json) free to drift, the library half must resolve from `node_modules` regardless, and Playwright's CLI must match the imported `@playwright/test` version or it errors and re-downloads browsers.
- *"Registered in mise" for Tier 2 means:* mise installs them (the `install` task runs aube with the release-age gate) and mise puts them on PATH — orchestration, not a `[tools]` entry.

### D3: aube narrows to installer
`aube install --prefer-frozen-lockfile` remains the install task. `aube run <script>` and `aube exec <bin>` disappear from the task surface. This is the behavioral narrowing the `dev-environment` spec delta captures.

### D4: Task inventory preserved
`dev` (web `astro dev --host 127.0.0.1`), `build` (client `tsc --noEmit`; web `tsc --noEmit && astro build`), `preview` (web `astro preview --host 127.0.0.1`), `lint` (`tsc --noEmit --pretty false` per pkg), `test` (`vitest run` per pkg), `test:client` (client check: vite fixture build + playwright embed), `test:e2e` / `test:e2e:local` (build then playwright), `test:e2e:public` (playwright against published Pages), `openspec` / `openspec:check` / `openspec:help`, `spec-check` (= `openspec validate --all --strict --no-interactive`), `status` (`git status --short --branch`), `check` (aggregate), `install`. Dependency ordering (`test:e2e` needs `build`) is expressed with `depends`.

## Risks / Trade-offs

- **`_.path` may not resolve aube's per-project `.bin` symlinks** → spike/verify FIRST, before any npm script is removed. Fallback: `aube exec <bin>` inside tasks (still no npm script, just a heavier runner).
- **Monorepo mode is experimental** → behavior may shift between mise releases. Mitigation: `min_version` pin + 5-day release-age gate already in `mise.toml`; the experimental gates live in-repo so the failure surface is contained and reproducible.
- **Command vocabulary changes** (`mise run build` → `mise //...:build`) → breaks muscle memory and any external references. Mitigation: rewrite CI and both docs files in the same change; bare-name dependency syntax still works during migration.
- **Playwright dynamic-port behavior must be preserved** → keep the per-run loopback-port selection in the playwright configs unchanged; only the invocation path moves, not the config.
- **Hidden npm-script callers** → grep for `aube run` / `npm run` / `mise run` across CI, docs, and `openspec/` before declaring done.

## Migration Plan

1. Spike `_.path` → `.bin` resolution in one workspace; decide bare-command vs `aube exec` fallback.
2. Enable monorepo mode + `config_roots` in root `mise.toml`; add per-workspace configs with `_.path` and file tasks; add root aggregators.
3. Verify the full task inventory runs via monorepo syntax (parity with current behavior).
4. Only then remove all `package.json` `scripts` blocks.
5. Rewrite CI workflow and docs to the new vocabulary.
6. Run `check` end to end (lint, test, test:client, build, test:e2e:local, openspec validation).

Rollback: revert the config + workspace task files and restore the `scripts` blocks; nothing in application source changes.
