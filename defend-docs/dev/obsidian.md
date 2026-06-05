---
title: obsidian setup
summary: open the garden as a vault.
order: 13
---

# obsidian setup

open the repo folder in Obsidian as an existing vault, then choose `defend-docs`.

the vault settings are part of the repo. they keep new internal links as relative markdown links, not wikilinks, so Astro can render the same files.

tracked settings live in `.obsidian/`:

- `app.json`
- `core-plugins.json`
- `hotkeys.json`

local workspace and appearance files are ignored. Obsidian can rewrite them without changing the shared project setup.

community plugins are not standardized yet. when we choose them, plugin ids and shared hotkeys should be committed together.
