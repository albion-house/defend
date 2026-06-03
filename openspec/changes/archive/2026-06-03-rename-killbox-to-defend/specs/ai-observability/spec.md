## MODIFIED Requirements

### Requirement: Rich debug state for playable mission
The debug API SHALL expose mission, tower, enemy, wave, command, outcome, and content summary state for automated verification through the Defend browser automation contract.

#### Scenario: Debug state describes combat entities
- **WHEN** automation calls `window.__DEFEND_DEBUG__.describe()`
- **THEN** the response SHALL include active towers, active enemies, wave progress, mission outcome, available commands, and content counts

#### Scenario: Debug command drives full match
- **WHEN** automation dispatches supported build, wave, restart, and simulation commands
- **THEN** the debug API SHALL return serializable snapshots that reflect deterministic mission progress

### Requirement: Defend-named semantic browser state
The system SHALL expose Defend-named browser automation identifiers for stable tests, including `window.__DEFEND_DEBUG__`, `data-defend-*` DOM attributes, and `defend:*` browser events.

#### Scenario: Agent inspects Defend browser state
- **GIVEN** the prototype is running in a browser
- **WHEN** an automated test queries Defend debug state, DOM attributes, or browser events
- **THEN** it SHALL be able to determine the same semantic game state previously exposed through Killbox-named automation identifiers
