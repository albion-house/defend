## ADDED Requirements

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
