# multiplayer-hero-combat Specification

## Purpose
TBD - created by archiving change add-hero-navigation-collision-enemy-targeting. Update Purpose after archive.
## Requirements
### Requirement: Hero aim state
The authoritative simulation SHALL track each hero aim direction and SHALL normalize or clamp aim input before using it for weapon fire.

#### Scenario: Hero aim is synchronized
- **GIVEN** `p1` controls `hero:p1`
- **WHEN** `p1` aims at a world position or direction
- **AND** the client sends `hero_input` containing `aimX` and `aimY`
- **THEN** the authoritative state SHALL expose `hero:p1` aim direction
- **AND** both clients SHALL observe the same aim direction or facing indicator

### Requirement: Hero firing is authoritative
A hero SHALL be able to request weapon fire with `fireHeld`, but the authoritative simulation SHALL decide whether a shot is fired.

The authoritative simulation SHALL enforce weapon cooldown, normalize aim direction, originate shots from the authoritative hero position, and prevent clients from directly mutating enemy health.

#### Scenario: Hero fires at enemy
- **GIVEN** `p1` is connected
- **AND** `hero:p1` is alive
- **AND** `enemy:e1` is in the arena
- **WHEN** `p1` aims at `enemy:e1`
- **AND** `p1` sends `hero_input` with `fireHeld` `true`
- **AND** the authoritative simulation advances
- **THEN** the system SHALL emit `hero.fired`
- **AND** a hero projectile or attack effect SHALL be created
- **AND** `enemy:e1` SHALL take damage when hit
- **AND** both clients SHALL observe the same enemy health

#### Scenario: Weapon cooldown is authoritative
- **GIVEN** `p1` has just fired `hero:p1` weapon
- **WHEN** `p1` continues sending `hero_input` with `fireHeld` `true`
- **AND** the authoritative simulation advances fewer ticks than the weapon cooldown
- **THEN** the authoritative simulation SHALL NOT create another shot
- **AND** the system SHALL emit `hero.fire_rejected`

### Requirement: Hero projectile state
V1 hero weapon behavior SHALL use synchronized projectile state unless a later accepted design explicitly chooses hitscan.

Projectile state SHALL include:

```ts
HeroProjectileState {
  projectileId: string
  ownerHeroId: string
  x: number
  y: number
  velocityX: number
  velocityY: number
  radius: number
  damage: number
  spawnTick: number
  expiresAtTick: number
}
```

#### Scenario: Projectile is spawned from authoritative hero
- **GIVEN** `hero:p1` fires a valid shot
- **WHEN** the authoritative simulation creates a projectile
- **THEN** the projectile SHALL start at the authoritative `hero:p1` position
- **AND** the projectile SHALL move in the normalized aim direction
- **AND** both clients SHALL observe the same projectile state

#### Scenario: Projectile expires
- **GIVEN** a hero projectile has been spawned
- **WHEN** the projectile reaches its expiration tick, configured range, or valid removal condition
- **THEN** the authoritative simulation SHALL remove the projectile from synchronized state

### Requirement: Hero projectiles damage enemies only
Hero projectiles SHALL collide with enemies and SHALL NOT damage towers or walls.

Enemy damage and death from hero projectiles SHALL be resolved server-side or authority-side. Both clients SHALL observe the same enemy health and death state.

#### Scenario: Projectile damages enemy but not tower
- **GIVEN** `p1` is connected
- **AND** `enemy:e1` and `tower:t1` are in the projectile path
- **WHEN** `p1` fires `hero:p1` weapon
- **AND** the authoritative simulation advances
- **THEN** enemy damage SHALL be resolved only for valid enemy hits
- **AND** `tower:t1` health or state SHALL NOT be damaged by the hero projectile

#### Scenario: Enemy killed by hero projectile
- **GIVEN** `enemy:e1` has current HP less than or equal to `hero:p1` projectile damage
- **WHEN** `hero:p1` projectile hits `enemy:e1`
- **THEN** the authoritative simulation SHALL apply `enemy.damaged`
- **AND** the authoritative simulation SHALL resolve `enemy.killed`
- **AND** both clients SHALL observe that `enemy:e1` is no longer active

#### Scenario: Projectile may expire on wall
- **GIVEN** wall collision is implemented for projectiles
- **WHEN** a hero projectile intersects `wall:w1`
- **THEN** the projectile MAY expire
- **AND** `wall:w1` SHALL NOT take damage from the hero projectile

