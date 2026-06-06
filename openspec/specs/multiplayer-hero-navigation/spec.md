# multiplayer-hero-navigation Specification

## Purpose
TBD - created by archiving change add-hero-navigation-collision-enemy-targeting. Update Purpose after archive.
## Requirements
### Requirement: Authoritative hero state
The authoritative room or session state SHALL include one hero for each active player slot and SHALL expose the hero through serializable synchronized state.

Each hero SHALL include:

```ts
HeroState {
  heroId: string
  playerSlot: "p1" | "p2"
  connected: boolean
  alive: boolean
  x: number
  y: number
  radius: number
  velocityX: number
  velocityY: number
  maxSpeed: number
  aimX: number
  aimY: number
  weaponCooldownTicks: number
  weaponCooldownRemainingTicks: number
  weaponRange: number
  weaponDamage: number
  lastInputSeq: number
  lastInputTick: number
}
```

#### Scenario: Active player receives hero
- **GIVEN** player `p1` is connected to a multiplayer-shaped session
- **WHEN** the authoritative state is created or synchronized
- **THEN** the state SHALL include `hero:p1` assigned to player slot `p1`
- **AND** both clients SHALL observe the same `hero:p1` position and connection state

#### Scenario: Inactive player does not create active actor
- **GIVEN** player slot `p2` is not connected
- **WHEN** the mission renders or synchronizes state
- **THEN** `p2` SHALL NOT appear as an active controllable world hero

### Requirement: Hero input command
The client SHALL send normalized hero input intent to the authoritative simulation using a `hero_input` payload.

The payload SHALL include:

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

The authoritative simulation SHALL clamp `moveX`, `moveY`, `aimX`, and `aimY` to `[-1, 1]`, track `inputSeq` per player, and ignore invalid or out-of-order input.

#### Scenario: Hero input is accepted
- **GIVEN** `p1` controls `hero:p1`
- **WHEN** `p1` sends valid `hero_input` with a new `inputSeq`
- **THEN** the authoritative simulation SHALL record that input for `hero:p1`
- **AND** `hero:p1` SHALL expose the new `lastInputSeq` and `lastInputTick`

#### Scenario: Player cannot move another player hero
- **GIVEN** `p1` and `p2` are connected
- **WHEN** `p1` sends `hero_input`
- **THEN** only `hero:p1` SHALL be affected by `p1` input
- **AND** `hero:p2` SHALL NOT be moved by `p1` input

#### Scenario: Invalid input is rejected
- **GIVEN** `p1` controls `hero:p1`
- **WHEN** `p1` sends invalid or out-of-order `hero_input`
- **THEN** the authoritative simulation MAY ignore the input
- **AND** `hero:p1` SHALL NOT apply untrusted position, collision, damage, or death changes from the client

### Requirement: Velocity-based hero movement
The authoritative simulation SHALL convert movement input into velocity and integrate hero position during fixed simulation ticks.

Velocity SHALL equal normalized `moveX, moveY` multiplied by `hero.maxSpeed`. Diagonal movement SHALL NOT exceed `hero.maxSpeed`. If no movement input is active, hero velocity SHALL resolve to zero.

#### Scenario: Hero moves with velocity
- **GIVEN** `p1` is connected to a multiplayer-shaped session
- **AND** `hero:p1` exists at position `100,100`
- **WHEN** `p1` sends `hero_input` with `moveX` `1` and `moveY` `0`
- **AND** the authoritative simulation advances
- **THEN** `hero:p1` SHALL have positive `velocityX`
- **AND** `hero:p1` SHALL move right
- **AND** both clients SHALL observe the same `hero:p1` position

#### Scenario: Hero stops when input stops
- **GIVEN** `p1` is moving `hero:p1` to the right
- **WHEN** `p1` sends `hero_input` with `moveX` `0` and `moveY` `0`
- **AND** the authoritative simulation advances
- **THEN** `hero:p1` `velocityX` SHALL be `0`
- **AND** `hero:p1` `velocityY` SHALL be `0`

#### Scenario: Diagonal movement is normalized
- **GIVEN** `p1` is connected
- **WHEN** `p1` sends `hero_input` with `moveX` `1` and `moveY` `1`
- **AND** the authoritative simulation advances
- **THEN** `hero:p1` SHALL move diagonally
- **AND** `hero:p1` movement speed SHALL NOT exceed `hero:p1` `maxSpeed`

### Requirement: Blocking collision objects
Heroes SHALL collide with blocking objects from authoritative state.

Blocking objects SHALL include walls, towers, map blockers, and playable-area boundaries. Enemies, projectiles, decorations, range indicators, UI elements, and non-blocking terrain SHALL NOT block hero movement unless explicitly marked as blocking.

Supported V1 collision shapes SHALL include:

```ts
CircleCollider {
  type: "circle"
  x: number
  y: number
  radius: number
}

RectCollider {
  type: "rect"
  x: number
  y: number
  width: number
  height: number
}
```

Hero collision SHALL be represented as a circle.

#### Scenario: Blocking shapes are inspectable
- **WHEN** an automated test inspects authoritative map and tower state
- **THEN** it SHALL be able to determine blocker ids, blocker types, and V1 collision shapes used for hero movement

#### Scenario: Non-blocking entities do not stop hero movement
- **GIVEN** a hero moves near enemies, projectiles, decorations, range indicators, UI elements, or non-blocking terrain
- **WHEN** the authoritative simulation resolves hero movement
- **THEN** those entities SHALL NOT block hero movement unless they are explicitly marked as blocking

### Requirement: Deterministic hero collision resolution
The authoritative simulation SHALL resolve hero movement against blockers deterministically, run resolution server-side or authority-side, and synchronize the resolved position to clients.

The V1 resolution order SHALL:

1. Compute intended next position from velocity.
2. Resolve horizontal movement against blockers.
3. Resolve vertical movement against blockers.
4. Clamp final position to playable bounds.
5. Update authoritative hero position and velocity.

#### Scenario: Hero cannot pass through tower
- **GIVEN** `p1` is connected
- **AND** `hero:p1` is positioned left of `tower:t1`
- **WHEN** `p1` sends `hero_input` moving right into `tower:t1`
- **AND** the authoritative simulation advances
- **THEN** `hero:p1` SHALL NOT overlap `tower:t1`
- **AND** `hero:p1` SHALL NOT pass through `tower:t1`
- **AND** the system SHALL emit `hero.collision_resolved`

#### Scenario: Hero slides along tower collision
- **GIVEN** `p1` is connected
- **AND** `hero:p1` is positioned diagonally from `tower:t1`
- **WHEN** `p1` sends diagonal movement input toward the side of `tower:t1`
- **AND** the authoritative simulation advances
- **THEN** `hero:p1` SHALL NOT overlap `tower:t1`
- **AND** `hero:p1` SHALL preserve the non-blocked movement axis when possible

#### Scenario: Hero cannot pass through wall
- **GIVEN** `p1` is connected
- **AND** `hero:p1` is positioned next to `wall:w1`
- **WHEN** `p1` sends `hero_input` moving into `wall:w1`
- **AND** the authoritative simulation advances
- **THEN** `hero:p1` SHALL NOT overlap `wall:w1`
- **AND** `hero:p1` SHALL NOT pass through `wall:w1`
- **AND** the system SHALL emit `hero.collision_resolved`

#### Scenario: Hero cannot leave playable bounds
- **GIVEN** `p1` is connected
- **AND** `hero:p1` is positioned near the edge of the playable area
- **WHEN** `p1` sends movement input outside the playable area
- **AND** the authoritative simulation advances
- **THEN** `hero:p1` SHALL remain inside playable bounds

### Requirement: Tower collision lifecycle
Built towers SHALL become blocking objects for hero movement immediately after the authoritative simulation accepts the build command, and removed towers SHALL stop blocking immediately after the authoritative simulation accepts the remove or sell command.

Tower collision radius SHALL be derived from tower footprint or configured explicitly. A hero SHALL NOT be allowed to occupy the same space as a tower.

#### Scenario: Newly built tower blocks hero movement
- **GIVEN** a tower build command is accepted for `tower:t1`
- **WHEN** `hero:p1` moves into `tower:t1`
- **THEN** `tower:t1` SHALL block `hero:p1` movement

#### Scenario: Removed tower stops blocking hero movement
- **GIVEN** `tower:t1` blocks `hero:p1`
- **WHEN** the authoritative simulation accepts a command that removes `tower:t1`
- **THEN** `tower:t1` SHALL no longer block `hero:p1` movement

### Requirement: Tower placement rejects hero overlap
The authoritative simulation SHALL reject tower placement when the requested tower footprint overlaps any active hero.

#### Scenario: Tower cannot be built on top of hero
- **GIVEN** `p1` is connected
- **AND** `hero:p1` occupies a build location
- **WHEN** a `tower:build` command attempts to place `tower:t1` overlapping `hero:p1`
- **THEN** the authoritative simulation SHALL reject the build command
- **AND** `tower:t1` SHALL NOT be added to authoritative state

