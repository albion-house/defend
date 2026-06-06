## 1. Shared State And Protocol

- [x] 1.1 Add `HeroState`, `HeroProjectileState`, collider, blocker, and hero event types to the shared gameplay state surface.
- [x] 1.2 Initialize one hero for each connected `p1` or `p2` slot while preserving static single-browser load behavior without a backend relay.
- [x] 1.3 Add the `hero_input` payload with `inputSeq`, movement, aim, and `fireHeld` fields.
- [x] 1.4 Validate hero input ownership, clamp movement and aim values to `[-1, 1]`, and ignore invalid or out-of-order input.
- [x] 1.5 Track `lastInputSeq` and `lastInputTick` on the controlled hero.

## 2. Movement And Collision

- [x] 2.1 Convert movement input into normalized velocity using `hero.maxSpeed`.
- [x] 2.2 Integrate hero velocity during fixed simulation ticks and resolve velocity to zero when movement input stops.
- [x] 2.3 Add authoritative playable bounds and map wall/blocker collider data independent of Phaser-only display objects.
- [x] 2.4 Derive tower collision blockers from accepted tower state and remove blockers when towers are removed.
- [x] 2.5 Implement circle-circle and circle-rect overlap checks for hero movement and tower placement validation.
- [x] 2.6 Implement deterministic axis-separated collision resolution with horizontal resolution, vertical resolution, sliding, and bounds clamping.
- [x] 2.7 Reject tower build commands when the requested tower footprint overlaps any active hero.

## 3. Hero Combat

- [x] 3.1 Normalize and synchronize hero aim direction from `hero_input`.
- [x] 3.2 Implement authoritative fire request handling with alive checks, aim checks, cooldown checks, and cooldown updates.
- [x] 3.3 Spawn `HeroProjectileState` from authoritative hero position when a shot is accepted.
- [x] 3.4 Move hero projectiles during fixed simulation ticks and expire them by configured lifetime, range, or removal condition.
- [x] 3.5 Resolve projectile collisions against enemies and apply enemy-only damage.
- [x] 3.6 Resolve enemy death from hero projectile damage through the authoritative enemy lifecycle.
- [x] 3.7 Ensure hero projectiles do not damage towers or walls, with optional wall expiration if projectile-wall collision is implemented.

## 4. Rendering And Input

- [x] 4.1 Collect local keyboard movement and pointer aim/fire input in the Phaser client and send `hero_input` through the session path.
- [x] 4.2 Render synchronized hero position, player label, facing or aim direction, and authoritative movement correction.
- [x] 4.3 Render hero projectiles or firing effects from synchronized state.
- [x] 4.4 Render enemy damage from synchronized state rather than client-local damage mutation.
- [x] 4.5 Keep inactive player slots from rendering active world heroes.

## 5. Debugging And Observability

- [x] 5.1 Add structured event logging for `hero.input_received`, `hero.input_rejected`, `hero.velocity_updated`, `hero.moved`, and `hero.collision_resolved`.
- [x] 5.2 Add structured event logging for `hero.fire_requested`, `hero.fired`, `hero.fire_rejected`, `hero.projectile_spawned`, `hero.projectile_hit_enemy`, `enemy.damaged`, and `enemy.killed`.
- [x] 5.3 Include required collision event payload fields: tick, hero id, blocker type, blocker id, attempted position, and resolved position.
- [x] 5.4 Extend `window.__DEFEND_DEBUG__` or a Defend-branded test driver with `getPlayerSlot`, `getLatestRoomState`, `getRenderedEntities`, `pressKey`, `releaseKey`, `aimAtWorld`, `fireDown`, `fireUp`, `waitForTick`, and `getEventLog`.
- [x] 5.5 Ensure mutating test-driver methods are test/development gated while semantic state remains inspectable for automation.

## 6. Headless Tests

- [x] 6.1 Add deterministic tests for velocity integration, stopping, and diagonal speed normalization.
- [x] 6.2 Add deterministic tests for tower collision, wall collision, bounds collision, and collision sliding.
- [x] 6.3 Add deterministic tests for hero ownership validation and invalid or out-of-order input rejection.
- [x] 6.4 Add deterministic tests for fire cooldown, projectile spawn, projectile expiration, projectile enemy hit, enemy damage, and enemy death.
- [x] 6.5 Add deterministic tests that tower placement is rejected when the footprint overlaps an active hero.

## 7. Multiplayer And Browser Tests

- [x] 7.1 Add protocol-level two-client tests proving `p1` controls only `hero:p1` and `p2` controls only `hero:p2`.
- [x] 7.2 Add protocol-level tests proving both clients receive synchronized hero positions after tower collision, wall collision, and movement around blockers.
- [x] 7.3 Add protocol-level tests proving hero shooting damages enemies consistently for both clients.
- [x] 7.4 Add browser tests proving WASD input sends `hero_input` and hero dots move on screen.
- [x] 7.5 Add browser tests proving heroes visually stop at towers and walls.
- [x] 7.6 Add browser tests proving aiming and firing creates a visible projectile or firing effect and enemy damage is observable through synchronized state.

## 8. Validation

- [x] 8.1 Run the relevant game-client unit/headless test suite.
- [x] 8.2 Run the relevant web/browser integration test suite.
- [x] 8.3 Run typecheck and build for the affected workspace packages.
- [x] 8.4 Run OpenSpec strict validation for the multiplayer change.
- [x] 8.5 Run `git diff --check`.
