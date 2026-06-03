# Defend Reference

This folder contains markdown reference documentation for shared Defend terminology and concepts. It is intentionally plain markdown so it can be read directly in the repository today and later folded into a richer reference site if that becomes useful.

Start with the [glossary](./glossary.md) for canonical definitions of recurring game and development terms. Use the [Astro platform notes](./astro-platform.md) for site architecture, the Phaser embed boundary, theme and asset metadata, deployment, and OpenSpec workflow discipline. Use the [toolchain policy](./toolchain.md) for mise, Aube, Node, and GitHub Actions expectations.

## Current Playable Slice

The active prototype is **Saltmarsh Crossing**, a single original tower-defense mission. It is inspired only by broad genre lessons from introductory fixed-pad TD maps: clear lanes, early small waves, a visible choke/merge point, constrained tower placement, and readable retry loops. It does not copy copyrighted Kingdom Rush art, names, dialogue, code, level layout, audio, or balance data.

## Architecture Notes

- Phaser owns rendering, pointer input, and transient canvas presentation.
- `src/game/state.ts` owns authoritative rules through serializable state and explicit commands.
- `src/game/content.ts` owns data for the mission map, tower definitions, enemy definitions, and wave scripts.
- The fixed simulation tick is 100 ms for the prototype. Rendering may happen at any frame rate, but combat rules advance through `simulation:step`.
- The debug API is the browser automation contract. Tests should prefer semantic state over pixel-perfect assertions unless validating visibility.

## Future Multiplayer Assumptions

The current prototype does not implement live multiplayer. It intentionally keeps player intent as commands and keeps state serializable so later work can experiment with lockstep, rollback, or relay-backed sessions without rewriting Phaser rendering.
