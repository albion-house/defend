# ai-observability Specification

## Purpose
Define the semantic browser state and test-facing commands that make the prototype inspectable by automated agents.
## Requirements
### Requirement: Semantic browser state
The system SHALL expose enough semantic game state for automated agents to inspect scenes, player slots, objective HP, wave state, enemy state, entities, build pads, and major controls without requiring the semantic debug output to be visible by default.

#### Scenario: Agent inspects game state
- **GIVEN** the prototype is running in a browser
- **WHEN** an automated test queries the page
- **THEN** it SHALL be able to determine the current scene, active players, objective HP, wave state, active enemy positions, enemy HP/status, enemy path IDs, and major interactable controls

#### Scenario: Semantic output is present but not player-facing
- **WHEN** the Play route loads in a normal browser session
- **THEN** semantic debug text SHALL remain available in stable DOM/debug API state
- **AND** it SHALL NOT be visible as a default overlay

### Requirement: Agent-drivable actions
The system SHALL provide stable browser-visible controls or debug commands for prototype actions and deterministic simulation advancement that automated tests need to exercise.

#### Scenario: Agent simulates a basic action
- **GIVEN** the prototype is running in a test or development browser
- **WHEN** an automated test triggers a supported player action
- **THEN** the game state SHALL update through the same command path used by interactive play

#### Scenario: Agent advances enemy simulation
- **GIVEN** the prototype is running in a test or development browser with wave 1 active
- **WHEN** an automated test triggers the supported simulation advance command with a known duration
- **THEN** enemy movement, objective leak damage, wave counters, and message log state SHALL update deterministically

### Requirement: Deterministic inspectable state snapshots
The system SHALL make core prototype state serializable so tests can compare before-and-after snapshots, including enemy and wave lifecycle state.

#### Scenario: Test compares simulation state
- **GIVEN** a test has captured a state snapshot
- **WHEN** the simulation advances after a known action
- **THEN** the next snapshot SHALL expose predictable changes for objective, wave, enemy, player, and build-pad state

### Requirement: Rich debug state for playable mission
The debug API SHALL expose mission, tower, enemy, wave, command, outcome, and content summary state for automated verification.

#### Scenario: Debug state describes combat entities
- **WHEN** automation calls `window.__DEFEND_DEBUG__.describe()`
- **THEN** the response SHALL include active towers, active enemies, wave progress, mission outcome, available commands, and content counts

#### Scenario: Debug command drives full match
- **WHEN** automation dispatches supported build, wave, restart, and simulation commands
- **THEN** the debug API SHALL return serializable snapshots that reflect deterministic mission progress
