---
title: commands and testing
summary: the normal ways to check the repo.
order: 12
---

# commands and testing

run commands from the repo root.

```sh
mise run dev
mise run test
mise run build
mise run test:e2e
mise run spec-check
mise run check
```

`mise run check` validates both workspace packages, the local browser integration, and OpenSpec.

the game client also has a standalone browser fixture. it proves that the game can mount, run, and tear down without astro.

playwright chooses an available loopback port for each local run. parallel checkouts do not need to fight over one fixed port.
