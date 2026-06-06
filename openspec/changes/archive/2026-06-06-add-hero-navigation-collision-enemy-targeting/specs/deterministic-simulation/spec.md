## ADDED Requirements

### Requirement: Deterministic hero simulation
The fixed-tick simulation SHALL process hero input, velocity integration, collision resolution, projectile movement, projectile hits, and hero-caused enemy damage in deterministic stable order.

#### Scenario: Same hero inputs produce same outcome
- **WHEN** two initial mission states receive the same ordered `hero_input` messages and same number of fixed simulation ticks
- **THEN** their serialized hero, projectile, enemy health, and event-log snapshots SHALL match

#### Scenario: Render frame does not mutate hero rules
- **WHEN** the Phaser scene renders hero, projectile, and enemy snapshots without dispatching input or simulation commands
- **THEN** authoritative hero position, collision, projectile, enemy damage, and enemy death state SHALL NOT change
