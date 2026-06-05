---
title: browser automation
summary: the semantic game contract used by tests and agents.
order: 14
---

# browser automation

the embedded client exposes:

```ts
window.__DEFEND_DEBUG__
```

the API describes the mission, players, gate, gold, waves, towers, enemies, pads, and supported commands.

tests and coding agents should use that semantic state before reaching for pixel comparisons.

the astro host mirrors a small readable summary into hidden page markup for public deployment checks.
