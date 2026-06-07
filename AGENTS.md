# Agent Instructions

This repo uses mise-managed tools and shims. In sandboxed agent environments, do not invoke mise-backed commands directly if the sandbox cannot write to the user's home cache.

Use `dev/sandbox <command>` from the repo root for commands that may invoke mise or a mise-managed shim, including `mise`, `rg`, `node`, `aube`, and `openspec`.

Examples:

```sh
dev/sandbox mise //:check
dev/sandbox rg -n "hero_input" defend-game-client
```

The wrapper sets `MISE_CACHE_DIR` to a writable temporary directory before the command starts, preventing repeated `~/Library/Caches/mise` write warnings. For network-restricted diagnostic commands that try to check remote mise versions, use `DEFEND_MISE_OFFLINE=1 dev/sandbox <command>`.
