## ADDED Requirements

### Requirement: Relay-backed authoritative rooms
When a multiplayer relay endpoint is configured, remote co-op sessions SHALL use a server-owned room as the authority for player slots, command validation, fixed-tick simulation, and synchronized room state.

#### Scenario: Two clients join relay-backed room
- **GIVEN** the multiplayer server is running
- **WHEN** two clients join the same room
- **THEN** the server SHALL assign the first client to `p1`
- **AND** the server SHALL assign the second client to `p2`
- **AND** both clients SHALL receive synchronized authoritative room state

#### Scenario: Client cannot self-assign another slot
- **GIVEN** a client connection has been assigned to `p1`
- **WHEN** that client sends a command claiming to act as `p2`
- **THEN** the server SHALL reject or ignore the command for `p2`
- **AND** the authoritative `p2` state SHALL NOT be mutated by the `p1` connection

#### Scenario: Disconnected player does not crash room
- **GIVEN** `p1` and `p2` are connected to a server-owned room
- **WHEN** `p2` disconnects
- **THEN** the server SHALL mark `p2` disconnected or inactive
- **AND** `hero:p2` SHALL remain in authoritative room state as inactive
- **AND** `p1` SHALL continue receiving synchronized state

### Requirement: Optional relay configuration
The browser client SHALL connect to the multiplayer server only when a relay endpoint is configured. Without a relay endpoint, the static Play route SHALL continue to load and use local or mock authority.

#### Scenario: No relay endpoint
- **GIVEN** the Play route is served from a static host
- **AND** no multiplayer relay endpoint is configured
- **WHEN** a player loads the game
- **THEN** the game SHALL remain playable without attempting a required server connection

#### Scenario: Relay endpoint configured
- **GIVEN** a multiplayer relay endpoint is configured
- **WHEN** a player joins a remote co-op session
- **THEN** the client SHALL connect through the server protocol
- **AND** render state synchronized from the server-owned room
