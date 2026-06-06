# tower-defense-combat Specification

## Purpose
Define deterministic tower construction, targeting, blocker behavior, enemy damage, and reward flow for the first playable mission.
## Requirements
### Requirement: Buildable tower archetypes
The system SHALL let the player build four original tower archetypes on fixed pads: a ranged tower, an artillery tower, a magic tower, and a blocker tower.

#### Scenario: Player builds each tower type
- **WHEN** the player builds each available tower archetype on an empty fixed pad with sufficient gold
- **THEN** the game state SHALL contain a distinct tower entity for each selected archetype and shared gold SHALL decrease by the tower costs

#### Scenario: Insufficient gold blocks construction
- **WHEN** the player attempts to build a tower without enough shared gold
- **THEN** the pad SHALL remain empty and the game SHALL expose a readable feedback message

### Requirement: Deterministic tower targeting and damage
Tower attacks SHALL resolve through deterministic targeting, cooldown, damage, splash, slow, or blocking rules defined by tower archetype data.

#### Scenario: Direct tower damages enemy
- **WHEN** an enemy enters range of a ready ranged tower during fixed simulation ticks
- **THEN** the tower SHALL damage a deterministic target and expose attack feedback in game state

#### Scenario: Artillery applies area damage
- **WHEN** an artillery attack lands near multiple enemies
- **THEN** all eligible enemies within the configured blast radius SHALL take deterministic splash damage

#### Scenario: Magic tower affects resilient enemies
- **WHEN** a magic tower attacks an enemy with physical resistance
- **THEN** the attack SHALL use the magic tower's configured damage behavior rather than the physical resistance behavior

### Requirement: Blocker tower interceptors
Blocker towers SHALL create deterministic blockers that can hold or delay enemies near their assigned pad without requiring free-form unit micro.

#### Scenario: Blocker delays enemy
- **WHEN** an active enemy reaches a blocker interception area with blocker capacity available
- **THEN** the enemy SHALL be delayed or held according to blocker data and the blocker state SHALL be serializable

### Requirement: Enemy defeat and rewards
Enemies reduced to zero HP SHALL leave active simulation and grant deterministic gold rewards.

#### Scenario: Enemy defeated by tower damage
- **WHEN** tower attacks reduce an enemy's current HP to zero
- **THEN** the enemy SHALL no longer count as active and shared gold SHALL increase by that enemy's reward

### Requirement: Towers block hero movement
Built towers SHALL expose authoritative collision footprints that block hero movement immediately after construction and stop blocking after removal.

#### Scenario: Built tower becomes hero blocker
- **WHEN** a tower build command is accepted
- **THEN** the resulting tower SHALL expose a hero collision footprint
- **AND** heroes SHALL NOT pass through the tower footprint

### Requirement: Tower placement avoids active heroes
The tower build command SHALL reject placement when the requested tower footprint overlaps an active hero.

#### Scenario: Build command rejects hero overlap
- **GIVEN** `hero:p1` overlaps a build pad or requested tower footprint
- **WHEN** a tower build command targets that location
- **THEN** the command SHALL be rejected
- **AND** no tower SHALL be added at that location
- **AND** the rejection SHALL be observable through state, feedback, or event log
