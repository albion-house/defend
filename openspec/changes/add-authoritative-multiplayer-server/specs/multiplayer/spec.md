## ADDED Requirements

### Requirement: Server-owned multiplayer authority
In relay-backed sessions, the multiplayer server SHALL own hero state, accepted player commands, fixed-tick simulation advancement, combat resolution, and synchronized room state.

Clients SHALL send normalized player intent commands and render the authoritative state they receive. Clients SHALL NOT directly mutate authoritative hero position, projectile state, enemy health, enemy death, or player slot assignment.

#### Scenario: Server moves hero from input
- **GIVEN** `p1` is connected to a server-owned room
- **AND** `hero:p1` exists at position `100,100`
- **WHEN** `p1` sends `hero_input` with `moveX` `1` and `moveY` `0`
- **AND** the server advances the fixed simulation tick
- **THEN** the server SHALL update `hero:p1` position according to authoritative movement speed
- **AND** both clients SHALL render the updated `hero:p1` position from synchronized state

#### Scenario: Client cannot spoof damage
- **GIVEN** `p1` is connected to a server-owned room
- **WHEN** `p1` sends `hero_input` with `fireHeld` `true`
- **THEN** the server SHALL determine shot creation, hit detection, and damage
- **AND** the client SHALL NOT directly mutate enemy health

### Requirement: Real-server protocol tests
The test suite SHALL include protocol-level tests that launch the actual multiplayer server and connect two non-visual clients through the same server protocol used by browser clients.

#### Scenario: Real protocol clients move and shoot
- **GIVEN** the multiplayer server has been started by the test suite
- **AND** two non-visual protocol clients are connected to the same room
- **WHEN** `p1` sends rightward `hero_input`
- **AND** `p2` sends upward `hero_input`
- **AND** `p1` aims and fires at an enemy
- **THEN** both clients SHALL receive synchronized hero, projectile, and enemy state from the server
- **AND** `p1` input SHALL affect only `hero:p1`
- **AND** `p2` input SHALL affect only `hero:p2`
