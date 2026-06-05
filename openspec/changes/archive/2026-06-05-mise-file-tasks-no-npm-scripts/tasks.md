## 1. Spike: validate risky assumptions before touching npm scripts

- [x] 1.1 In one workspace (e.g. `web`), add a temporary `mise.toml` with `[env] _.path = ["{{config_root}}/node_modules/.bin"]` and confirm a bare `astro --version` / `vitest --version` resolves the aube-installed `.bin` symlink without `aube exec`
- [x] 1.2 Enable monorepo mode in root `mise.toml` (`[settings] experimental = true`, `experimental_monorepo_root = true`) with `[monorepo] config_roots = ["defend-game-client", "web"]`; confirm `mise tasks --all` lists path-namespaced tasks (`//web:…`) and that a sample `//web:<task>` runs
- [x] 1.3 Record the outcome: bare-command path confirmed, OR fall back to `aube exec <bin>` in tasks. Do not proceed past section 2 until this is decided.

## 2. Per-workspace file tasks (parity, npm scripts still present)

- [x] 2.1 Create `defend-game-client` file tasks: `lint` (`tsc --noEmit --pretty false`), `build` (`tsc --noEmit`), `test` (`vitest run`), `test:embed` (vite fixture build + playwright), `check` (lint + test + test:embed + build)
- [x] 2.2 Create `web` file tasks: `dev` (`astro dev --host 127.0.0.1`), `lint` (`tsc --noEmit --pretty false`), `build` (`tsc --noEmit && astro build`), `preview` (`astro preview --host 127.0.0.1`), `test` (`vitest run`), `test:e2e` / `test:e2e:local` (build then playwright), `test:e2e:public` (playwright against published Pages), `check`
- [x] 2.3 Add `[env] _.path` (or `aube exec` fallback per 1.3) to each workspace config so tasks invoke binaries without npm scripts
- [x] 2.4 Preserve the dynamic loopback-port Playwright behavior — change only the invocation path, not the playwright configs

## 3. Root tasks and aggregators

- [x] 3.1 Add root `install` task (`aube install --prefer-frozen-lockfile`)
- [x] 3.2 Add root `status` task (`git status --short --branch`)
- [x] 3.3 Add root OpenSpec tasks: `openspec` (passthrough), `openspec:help`, `openspec:check` / `spec-check` (`openspec validate --all --strict --no-interactive`)
- [x] 3.4 Add root aggregators that fan out via `depends`: `build` (`//...:build`), `lint` (`//...:lint`), `test` (`//...:test`), and `check` (lint + test + `//defend-game-client:test:embed` + build + `//web:test:e2e:local` + `openspec:check`)
- [x] 3.5 Verify full parity: every task in the inventory runs via mise monorepo syntax and matches current behavior

## 4. Remove npm scripts (only after parity is proven)

- [x] 4.1 Remove the `scripts` block from root `package.json` (keep `workspaces` + deps)
- [x] 4.2 Remove the `scripts` block from `defend-game-client/package.json` (keep deps)
- [x] 4.3 Remove the `scripts` block from `web/package.json` (keep deps)
- [x] 4.4 Confirm `[tools]` keeps Tier-1 CLIs only (`npm:@fission-ai/openspec`) and that no Tier-2 library (astro/vite/vitest/playwright/typescript) was added as a global tool

## 5. Rewrite callers and docs

- [x] 5.1 Update `.github/workflows/deploy-pages.yml`: replace `aube run build` and `aube run test:e2e:public` with the monorepo task invocations; confirm Pages build + public verification still pass
- [x] 5.2 Update `docs/reference/toolchain.md`: aube is the installer only; tasks live as file-based mise tasks
- [x] 5.3 Update `docs/dev/commands-and-testing.md`: replace `mise run …` examples with monorepo task syntax (`mise //web:dev`, `mise //...:build`, etc.)
- [x] 5.4 Grep the repo (`aube run`, `npm run`, `mise run`) across CI, docs, and `openspec/` for any remaining npm-script references and update them

## 6. Validation

- [x] 6.1 Run the aggregate `check` end to end (lint, test, test:client/embed, build, test:e2e:local, OpenSpec validation) and confirm it passes
- [x] 6.2 Run `openspec validate --all --strict --no-interactive`
- [x] 6.3 Confirm a clean checkout + `mise run install` (or `//`-addressed install) followed by `dev` and `build` works without any npm script
