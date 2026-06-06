## Context

Defend currently has a serializable TypeScript gameplay state, fixed-tick command application, Phaser rendering, a mock session transport, and `window.__DEFEND_DEBUG__` for browser automation. Player state exists as connected slots with static marker positions, while towers, enemies, waves, objective health, and combat feedback already live in deterministic game state.

This change turns active player slots into controllable heroes. The implementation must keep the rules in the authoritative simulation layer so local play, mock two-tab sessions, future relay-hosted sessions, semantic debug state, and browser rendering all observe the same positions, collisions, projectiles, enemy damage, and enemy deaths. Static GitHub Pages must still load without a backend relay.

## Goals / Non-Goals

**Goals:**

- Represent one hero for each active `p1` or `p2` slot using serializable `HeroState`.
- Accept normalized high-frequency `hero_input` intent and validate ownership, sequence, movement, aim, and fire state before simulation.
- Integrate hero velocity on fixed ticks and resolve collision against towers, walls, map blockers, and playable bounds deterministically.
- Derive tower collision from accepted tower state and reject tower placement that overlaps active heroes.
- Resolve hero shooting server-side or authority-side, including cooldowns, projectile state, enemy hits, enemy damage, and enemy death.
- Render synchronized heroes, aim direction, movement correction, projectiles, and firing feedback in Phaser.
- Expose structured event logs and a Defend-branded test driver for headless, protocol, and browser tests.

**Non-Goals:**

- Advanced pathfinding.
- Client-side prediction.
- Hero abilities, leveling, inventory, or melee combat.
- More than two active hero slots.
- A production multiplayer relay. The implementation must remain compatible with future relay hosting, but this change can run against the current authoritative local/mock session surfaces.

## Decisions

### Keep hero data in serializable gameplay state

Add `HeroState` and `HeroProjectileState` to the shared gameplay state owned by `defend-game-client/src/game/state.ts` or a nearby shared module. The current `PlayerState.position` can be preserved for compatibility during migration, but authoritative movement and combat should read from heroes rather than static player marker positions.

Rationale: existing tests and browser automation already depend on serialized snapshots. Putting heroes and projectiles in that snapshot keeps rendering, debug state, multiplayer synchronization, and test assertions aligned.

Alternative considered: keep Phaser-only hero sprites and send movement to rendering code. That would make collision and enemy damage non-authoritative and would not support deterministic protocol tests.

### Treat `hero_input` as player intent, not direct mutation

Add a high-frequency command/message with this exact payload shape:

```ts
hero_input {
  inputSeq: number
  moveX: number
  moveY: number
  aimX: number
  aimY: number
  fireHeld: boolean
}
```

The session owner shall clamp movement and aim to `[-1, 1]`, normalize diagonal movement before assigning velocity, track `lastInputSeq` and `lastInputTick`, and ignore invalid or out-of-order input. Input is applied only to the hero assigned to the sender's player slot.

Rationale: this matches the existing command-shaped multiplayer boundary while giving movement a compact protocol surface. The client can send intent often without becoming authoritative over position, collision, damage, or death.

Alternative considered: use separate commands for key down, key up, aim, and fire. That would increase ordering complexity and make browser tests more fragile without improving V1 behavior.

### Resolve movement with deterministic axis-separated collision

Hero movement should compute intended velocity from input, then resolve horizontal movement and vertical movement separately against blockers before clamping to playable bounds. Hero collision is a circle. V1 blockers support:

- `CircleCollider { type: "circle"; x: number; y: number; radius: number }`
- `RectCollider { type: "rect"; x: number; y: number; width: number; height: number }`

Rationale: axis-separated movement is simple enough for deterministic tests and preserves natural sliding along walls or tower edges when one movement axis is blocked.

Alternative considered: full physics-engine collision. That adds dependency and determinism risk before the prototype needs complex physics.

### Build blockers from authoritative map and tower state

Map walls and blockers should be defined in mission content or derived map state, not from Phaser display objects. Built towers become blockers immediately after accepted build commands; removed towers stop blocking immediately after accepted sell/remove commands. Tower placement must test the requested footprint against active hero circles before accepting the build.

Rationale: tactical space is part of game rules, not rendering. This keeps browser visuals, headless tests, and future server execution consistent.

Alternative considered: infer collision from rendered pads or sprites. That would make headless simulation and protocol tests depend on Phaser geometry.

### Use projectile V1 combat with enemy-only damage

Hero firing should enforce cooldowns in the authoritative tick loop. A valid shot spawns `HeroProjectileState` from the authoritative hero position in normalized aim direction. Projectiles move on fixed ticks, hit enemies, apply damage, and expire on hit or after their configured range/lifetime. They must not damage towers or walls; optional wall expiration may remove a projectile without applying damage.

Rationale: projectiles provide an inspectable state surface for clients and tests. They are easier to visualize and assert than purely transient hitscan effects.

Alternative considered: hitscan V1. Hitscan is simpler, but it gives browser and protocol tests less synchronized state to verify.

### Extend the Defend debug surface instead of adding legacy globals

Expose the requested driver operations through the Defend test/debug API, for example as `window.__DEFEND_DEBUG__.testDriver` or another Defend-branded test-only global agreed during implementation. Preserve the requested method surface:

- `getPlayerSlot()`
- `getLatestRoomState()`
- `getRenderedEntities()`
- `pressKey(key)`
- `releaseKey(key)`
- `aimAtWorld(x, y)`
- `fireDown()`
- `fireUp()`
- `waitForTick(tick)`
- `getEventLog()`

Rationale: this repo has already standardized on `window.__DEFEND_DEBUG__`. Reintroducing a `__killboxTestDriver` global would conflict with the renamed product/API surface.

Alternative considered: implement the exact legacy `window.__killboxTestDriver` name from the request. That would be inconsistent with the current repository naming contract.

## Risks / Trade-offs

- Deterministic collision can drift between test fixtures and map rendering -> keep collision helpers pure, server-runnable, and covered by headless tests using the same content data as Phaser.
- High-frequency input can make mock-session tests flaky -> track `inputSeq`, expose `waitForTick`, and assert eventual synchronized state rather than render-frame timing.
- Static hosting has no production relay -> keep the authoritative simulation usable in local/mock sessions and avoid making the Play route require a backend endpoint.
- Projectile and tower combat can disagree about enemy damage ordering -> process hero projectiles, tower attacks, enemy movement, and defeat cleanup in a documented stable order with tests for tie cases that matter.
- Browser driver methods can leak into player-facing production behavior -> gate mutating test driver methods behind test/development configuration while keeping non-visual semantic state inspectable.

## Migration Plan

1. Add shared hero, projectile, collider, and event types without removing existing player marker fields.
2. Initialize hero state for connected player slots and render heroes in place of static markers.
3. Add `hero_input` handling and movement while preserving existing build, wave, restart, and simulation commands.
4. Add blockers and collision resolution, then enforce hero/tower overlap checks on build commands.
5. Add hero projectiles and enemy damage resolution.
6. Extend debug/test driver APIs and browser rendering.
7. Remove or de-emphasize obsolete static player marker behavior only after tests verify the hero path.

Rollback strategy: keep changes isolated behind hero state and input handling so the previous static player marker rendering can be restored by ignoring `hero_input`, omitting hero projectile ticks, and rendering player positions from the pre-existing player state.

## Open Questions

- Should active `p2` be opt-in through the current ready/session path, or should tests be able to connect `p2` directly through the protocol driver?
- Should projectile expiration be specified by ticks only, distance traveled from `weaponRange`, or both?
- Should wall blockers be authored as mission content first, or generated from a future map editor format later?
