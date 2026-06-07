---
title: toolchain
summary: the small set of tools used by this repo.
order: 43
---

# toolchain

[mise](https://mise.jdx.dev/) installs project tools and owns every task. tasks are file-based mise tasks (executable scripts under each project's `mise-tasks/`), run in monorepo mode. there are no npm scripts.

aube is the package manager only. it installs dependencies (`mise //:install`, or `aube ci` in CI); it is not used to run tasks. `package-lock.json` stays committed as the shared dependency lock and is the sole version source for build and test tools (astro, vite, vitest, playwright, typescript), which file tasks invoke directly off each project's `node_modules/.bin`.

standalone CLIs that are not imported in-process (for example OpenSpec) are registered in `mise.toml` `[tools]` via the npm backend.

the repo includes `dev/sandbox` for sandboxed agents. it sets `MISE_CACHE_DIR` to a writable temp directory before invoking a command, which prevents mise-managed shims from trying to write `~/Library/Caches/mise` when the sandbox cannot write user-home cache files.

node follows the stable line in `mise.toml`.

python is not part of this repo right now.

github actions uses the same mise and aube path as local development.
