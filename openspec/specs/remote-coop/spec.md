# remote-coop Specification

## Purpose
Define the remote co-op testing direction and staged multiplayer transport expectations for the web prototype.
## Requirements
### Requirement: Remote co-op first
The prototype SHALL treat remote collaborative play as the primary multiplayer testing mode.

#### Scenario: Two remote players join a session
- **GIVEN** one player creates or hosts a prototype session
- **WHEN** another player joins using a session link or code
- **THEN** both players SHALL participate in the same authoritative game state

### Requirement: Staged multiplayer transport
The system SHALL separate game simulation from transport so networking can progress from local simulation to mock sessions to a real relay.

#### Scenario: Two-tab mock session
- **GIVEN** the prototype is running in two browser contexts
- **WHEN** both contexts use the mock transport
- **THEN** automated tests SHALL be able to drive both players against the same protocol-shaped session flow

### Requirement: Static host does not imply backend
The GitHub Pages client SHALL not assume that the static host provides persistent multiplayer backend services or display inactive remote player slots as active world actors.

#### Scenario: No relay configured
- **GIVEN** the prototype is served from GitHub Pages without a relay endpoint
- **WHEN** a player starts the prototype
- **THEN** the client SHALL still support single-browser play or mock-session testing without failing to load

#### Scenario: Inactive second player is not rendered
- **GIVEN** Player 2 has not opted into the session
- **WHEN** the Play route renders the initial mission
- **THEN** the world view SHALL show only connected player markers

### Requirement: Multiplayer-ready command boundary
The playable mission SHALL keep player intent represented as commands that can later be carried by the transport abstraction.

#### Scenario: Local command is transport-shaped
- **WHEN** the local player builds a tower, starts a wave, restarts, or advances simulation through automation
- **THEN** the action SHALL be represented as an explicit command suitable for future remote synchronization

### Requirement: No backend dependency for playable slice
The playable mission SHALL remain usable from static hosting without a multiplayer relay.

#### Scenario: Static single-player load
- **WHEN** the GitHub Pages build loads without relay configuration
- **THEN** the single-player mission SHALL still be playable

### Requirement: Active remote heroes
Each active remote player slot SHALL control one synchronized hero in the shared authoritative mission state.

#### Scenario: Two remote players control heroes
- **GIVEN** two browser contexts are connected to the same multiplayer-shaped session
- **WHEN** `p1` and `p2` each send hero movement input
- **THEN** `p1` SHALL control `hero:p1`
- **AND** `p2` SHALL control `hero:p2`
- **AND** both browser contexts SHALL observe the same hero positions

#### Scenario: Static host still loads without relay
- **GIVEN** the prototype is served from a static host without a multiplayer relay endpoint
- **WHEN** a player opens the Play route
- **THEN** the mission SHALL still load and remain playable through single-browser or mock-session hero behavior
