---
title: commands and testing
summary: the normal ways to check the repo.
order: 12
---

# commands and testing

run commands from the repo root. tasks are file-based mise tasks in monorepo mode, addressed as `//<project>:<task>`. root-level tasks are `//:<task>`.

```sh
mise //web:dev            # run the knowledge garden with the embedded game
mise //...:test           # unit tests across every project
mise //:build             # build the game client and static garden
mise //web:test:e2e       # local Playwright browser tests
mise //:spec-check        # validate OpenSpec
mise //:check             # validate everything (see below)
```

`mise //:check` validates both workspace packages, the local browser integration, and OpenSpec.

the older `mise run <task>` form no longer applies — tasks are addressed by their monorepo path. run `mise tasks --all` to list them.

in sandboxed agent environments, run mise-backed commands through `dev/sandbox` so mise writes cache files to a writable temp directory instead of the user's home cache.

```sh
dev/sandbox mise //:check
dev/sandbox rg -n "hero_input" defend-game-client
```

the game client also has a standalone browser fixture. it proves that the game can mount, run, and tear down without astro.

playwright chooses an available loopback port for each local run. parallel checkouts do not need to fight over one fixed port.
