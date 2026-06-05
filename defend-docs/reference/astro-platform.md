---
title: the web host
summary: how the knowledge garden hosts the game.
order: 42
---

# the web host

the astro site lives in `web/`.

it renders the markdown in `defend-docs/`. it also hosts one playable route.

the site imports the public API from `defend-game-client/`. it does not reach into game scenes or simulation internals.

the game client does not know about astro.

github pages publishes the static output from `web/dist/`.
