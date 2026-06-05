## Why

The repository runs every task through three stacked layers: `mise.toml` TOML tasks delegate to root `package.json` scripts (`aube -r run` / `aube --filter`), which fan out to per-workspace `package.json` scripts that hold the real leaf commands. This triple indirection produces two parallel command surfaces — CI invokes `aube run …`, docs invoke `mise run …`, and they happen to converge by accident rather than by design. We want a single, file-based mise task surface with no npm scripts, so the command vocabulary is unambiguous, the leaf logic is shellcheck-able, and `aube` is used only for what it is — a package manager.

## What Changes

- **BREAKING** Remove every `package.json` `"scripts"` block (root and both workspaces). The `workspaces` field and all `dependencies`/`devDependencies` stay; only the script-running layer is deleted.
- **BREAKING** Replace `mise.toml` TOML tasks with **file-based** mise tasks, and adopt mise **monorepo mode** (experimental): the root config declares `experimental_monorepo_root` and `[monorepo].config_roots`, and each workspace owns its own file tasks in mise's default convention dirs. The public command vocabulary shifts from `mise run build` to monorepo path syntax (`mise //web:dev`, `mise //...:build`, `mise //...:test`).
- Root-level aggregator tasks (`build`, `lint`, `test`, `check`) fan out via `depends` on monorepo path references instead of `aube -r run`.
- Narrow `aube`'s role to package management only (`aube install`). It is no longer invoked as a task runner (`aube run <script>`), and tasks no longer wrap binaries in `aube exec`.
- Keep standalone CLIs (e.g. `openspec`) registered in `[tools]` via the npm backend. Keep project-coupled libraries that also ship a CLI (`astro`, `vite`, `vitest`, `@playwright/test`, `typescript`) as workspace dependencies — `package-lock.json` stays their single version source — and expose their binaries on each project's PATH via `[env] _.path = ["{{config_root}}/node_modules/.bin"]` so file tasks invoke bare commands.
- Rewrite task callers: `.github/workflows/deploy-pages.yml`, `docs/reference/toolchain.md`, and `docs/dev/commands-and-testing.md`.

Non-goals:

- Not introducing per-task caching, `sources`/`outputs` incrementality, or `usage`-based argument specs. Those are follow-on opportunities, not part of this increment.
- Not registering `astro`/`vitest`/`playwright`/`typescript` as global mise tools — that would create a second version source and break Playwright's CLI/library version coupling.
- Not adding tasks for `defend-game-server` (currently a README placeholder with no package).

## Capabilities

### New Capabilities
<!-- none; this changes how existing dev-environment requirements are satisfied -->

### Modified Capabilities
- `dev-environment`: The command surface SHALL be file-based mise tasks with no npm scripts; cross-workspace coordination SHALL use mise monorepo task references rather than the package manager's recursive script runner; and `aube`'s documented role narrows to dependency installation rather than task running.

## Impact

- **Config**: `mise.toml` (monorepo settings, `config_roots`, `[tools]` unchanged for Tier-1 CLIs), new `defend-game-client/mise.toml` + `web/mise.toml` (or `mise-tasks/` dirs) with file tasks and `_.path`, root `mise-tasks/` for aggregators.
- **Removed**: `scripts` blocks in `package.json`, `defend-game-client/package.json`, `web/package.json`.
- **CI**: `.github/workflows/deploy-pages.yml` switches `aube run build` / `aube run test:e2e:public` to monorepo task invocations.
- **Docs**: `docs/reference/toolchain.md` (aube = installer only), `docs/dev/commands-and-testing.md` (command examples → monorepo syntax).
- **Risk / sequencing**: monorepo mode is experimental, and the `_.path` → aube `.bin` resolution is an unverified assumption. Both must be validated before npm scripts are removed; the fallback is `aube exec <bin>` inside tasks.
