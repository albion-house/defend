## ADDED Requirements

### Requirement: Hero semantic debug state
The debug API SHALL expose hero, projectile, collision, and hero-combat state needed by automated tests.

#### Scenario: Agent inspects hero state
- **GIVEN** the prototype is running in a browser
- **WHEN** automation calls `window.__DEFEND_DEBUG__.describe()` or the supported Defend test driver
- **THEN** the response SHALL include active heroes, hero positions, hero velocities, aim directions, projectile state, and recent hero event log entries

### Requirement: Agent-drivable hero actions
The debug or browser test driver SHALL provide stable controls for hero movement, aiming, firing, tick waiting, and event-log inspection.

#### Scenario: Agent drives hero input
- **GIVEN** the prototype is running in a test or development browser
- **WHEN** an automated test presses movement keys, aims at a world position, and holds fire through the driver
- **THEN** the game state SHALL update through the same `hero_input` path used by interactive play
