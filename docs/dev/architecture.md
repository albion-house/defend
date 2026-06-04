---
title: repository architecture
summary: where things belong and which way they depend.
order: 11
---

# repository architecture

the repo has four clear homes.

```text
docs/ --------------------> web/
defend-game-client/ ------> web/

defend-game-server/         reserved only
```

## docs

human-facing knowledge. development notes. design work. journal entries. references. speculation.

astro reads these markdown files directly.

## web

the astro site and its presentation assets.

it renders the knowledge garden and embeds the game through the game client's public API.

## defend-game-client

the reusable typescript and phaser game.

it owns gameplay, rendering, simulation, transport boundaries, and the browser debug API. it does not depend on astro.

## defend-game-server

a reserved space. no architecture has been chosen.

## openspec

precise dev-time requirements for the two core developers and coding agents.

human instructions belong here in `docs/`, not duplicated in OpenSpec.
