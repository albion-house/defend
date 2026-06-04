---
title: toolchain
summary: the small set of tools used by this repo.
order: 43
---

# toolchain

[mise](https://mise.jdx.dev/) installs project tools and exposes the usual tasks.

aube is the normal package manager. `package-lock.json` stays committed as the shared dependency lock.

node follows the stable line in `mise.toml`.

python is not part of this repo right now.

github actions uses the same mise and aube path as local development.
