## ADDED Requirements

### Requirement: Hero observability events
The authoritative simulation SHALL emit structured events for hero movement, collision, firing, projectile hits, and enemy damage so tests can verify behavior without relying only on screenshots.

Required event types SHALL include:

- `hero.input_received`
- `hero.input_rejected`
- `hero.velocity_updated`
- `hero.moved`
- `hero.collision_resolved`
- `hero.fire_requested`
- `hero.fired`
- `hero.fire_rejected`
- `hero.projectile_spawned`
- `hero.projectile_hit_enemy`
- `enemy.damaged`
- `enemy.killed`

Collision events SHALL include:

```ts
{
  tick: number
  type: "hero.collision_resolved"
  heroId: string
  blockerType: "tower" | "wall" | "bounds"
  blockerId: string
  attemptedPosition: { x: number, y: number }
  resolvedPosition: { x: number, y: number }
}
```

#### Scenario: Collision event is emitted
- **GIVEN** `hero:p1` attempts to move into `tower:t1`
- **WHEN** the authoritative simulation resolves the collision
- **THEN** the event log SHALL include `hero.collision_resolved`
- **AND** the event SHALL include tick, hero id, blocker type, blocker id, attempted position, and resolved position

#### Scenario: Firing events are emitted
- **GIVEN** `hero:p1` requests weapon fire
- **WHEN** the authoritative simulation accepts or rejects the shot
- **THEN** the event log SHALL include either `hero.fired` or `hero.fire_rejected`

### Requirement: Headless hero simulation tests
The test suite SHALL include deterministic headless simulation tests for hero movement, collision, ownership, shooting, and tower placement.

#### Scenario: Headless tests cover hero rules
- **WHEN** the headless simulation test suite runs
- **THEN** it SHALL verify velocity integration, diagonal movement normalization, tower collision, wall collision, bounds collision, collision sliding, hero ownership validation, fire cooldown, projectile spawn, projectile enemy hit, enemy damage, and tower placement rejection when overlapping a hero

### Requirement: Protocol-level multiplayer hero tests
The test suite SHALL include tests where two network or protocol-shaped clients connect to the real multiplayer session surface and verify synchronized hero behavior.

#### Scenario: Two protocol clients control owned heroes
- **GIVEN** two protocol clients are connected to the same session
- **WHEN** `p1` and `p2` send hero input
- **THEN** `p1` SHALL control only `hero:p1`
- **AND** `p2` SHALL control only `hero:p2`

#### Scenario: Protocol clients receive synchronized hero state
- **GIVEN** two protocol clients are connected to the same session
- **WHEN** `p1` moves around a tower, `p2` moves along a wall, and `p1` fires at an enemy
- **THEN** both clients SHALL receive the same hero positions, projectile state, and enemy damage state

### Requirement: Browser hero test driver
The browser test surface SHALL expose a test-only Defend driver that can drive hero movement, aiming, firing, tick waiting, and event inspection without relying only on screenshots.

The driver SHALL expose these operations through the Defend debug/test surface:

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

#### Scenario: Browser driver sends hero input
- **GIVEN** the prototype is running in a browser test
- **WHEN** the test driver presses `W`, `A`, `S`, or `D`
- **THEN** the client SHALL send `hero_input`
- **AND** the authoritative state SHALL update through the same input path used by interactive play

#### Scenario: Browser driver verifies rendered hero movement
- **GIVEN** the prototype is running in a browser test
- **WHEN** the driver moves a hero, aims at an enemy, and fires
- **THEN** rendered entities SHALL show hero movement and a visible projectile or firing effect
- **AND** synchronized state SHALL expose observable enemy damage when a valid hit resolves

#### Scenario: Browser driver verifies blockers
- **GIVEN** the prototype is running in a browser test
- **WHEN** the driver moves a hero into a tower and a wall
- **THEN** rendered hero entities SHALL stop at the blockers
- **AND** the event log SHALL include `hero.collision_resolved`
