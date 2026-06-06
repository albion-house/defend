## Why

Multiplayer heroes need to behave like active combat participants instead of passive player markers. This change adds the minimum server-authoritative navigation, collision, aiming, and enemy-targeting behavior needed for each active player to steer one hero around the tactical battlefield.

This is the next step toward the playable co-op loop because the prototype already treats remote co-op, command-shaped input, fixed-tick simulation, towers, enemies, and inspectable state as core surfaces. Hero movement and combat must use the same authoritative simulation rules so both clients can observe the same battlefield outcome.

## What Changes

- Add one authoritative hero entity for each active player slot, limited to `p1` and `p2`.
- Add normalized `hero_input` commands for WASD-style movement, aim direction, fire state, and input sequencing.
- Add server-authoritative velocity integration with diagonal speed normalization and zero velocity when movement input stops.
- Add deterministic hero collision against towers, walls, map blockers, and playable-area bounds.
- Add tower-placement rejection when a requested tower footprint overlaps an active hero.
- Add wall and map blocker collision data to authoritative map state instead of depending on Phaser-only objects.
- Add hero shooting against enemies using server-resolved cooldowns, aim normalization, projectile state, projectile collision, enemy damage, and enemy death.
- Add client rendering and input collection for synchronized hero movement, aiming, projectiles, firing effects, and authoritative correction.
- Add structured events for hero input, movement, collision, firing, projectile hits, enemy damage, and enemy kills.
- Add deterministic headless tests, real multiplayer protocol tests, and browser integration tests that can drive two heroes without relying only on screenshots.
- Defer advanced pathfinding, client-side prediction, hero abilities, leveling, inventory, melee combat, and more than two active hero slots.

## Capabilities

### New Capabilities

- `multiplayer-hero-navigation`: Authoritative hero state, ownership, movement input, velocity integration, bounds enforcement, and deterministic collision against towers, walls, and map blockers.
- `multiplayer-hero-combat`: Hero aim, firing, cooldowns, projectile state, enemy-only damage, and synchronized enemy health/death resolution.
- `multiplayer-hero-validation`: Structured observability, protocol-level multiplayer checks, and browser driver coverage for hero movement, collision, shooting, and synchronization.

### Modified Capabilities

- `remote-coop`: Active remote player slots now have one controllable synchronized hero each.
- `deterministic-simulation`: Fixed-tick command simulation now includes continuous hero input, collision resolution, and projectile combat.
- `prototype-map`: Map data now exposes server-authoritative wall and blocker collision shapes.
- `tower-defense-combat`: Built towers now participate in hero collision, and tower placement must reject overlaps with active heroes.
- `combat-damage-health`: Enemy health and death can now be changed by server-resolved hero weapon hits.
- `ai-observability`: Semantic event/debug surfaces now include hero input, movement, collision, firing, projectile hit, and enemy damage events.

## Impact

- Affected code: `defend-game-client/src/game/state.ts`, game command application, map/tower/enemy state types, deterministic simulation helpers, `defend-game-client/src/net/transport.ts`, `defend-game-client/src/scenes/PrototypeScene.ts`, and `defend-game-client/src/game/debug.ts`.
- Affected web tests: `web/` browser integration tests and any test-only debug driver used by automated multiplayer scenarios.
- Affected protocol surface: add high-frequency `hero_input` alongside existing command-shaped player intent, with per-player ownership validation and sequence tracking.
- Affected test surface: headless simulation tests, two-client protocol tests, browser driver tests, OpenSpec validation, typecheck, and build.
- Static hosting remains supported: the Pages build must still load without a backend relay, using local or mock transport behavior where real multiplayer services are unavailable.
