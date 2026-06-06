## ADDED Requirements

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
