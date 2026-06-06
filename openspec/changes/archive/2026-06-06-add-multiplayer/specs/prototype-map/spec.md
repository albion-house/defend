## ADDED Requirements

### Requirement: Authoritative wall and blocker collision
The prototype map SHALL expose authoritative collision data for walls, map blockers, and playable bounds used by hero movement.

Wall collision SHALL be available to the simulation independently of Phaser-only display objects.

#### Scenario: Wall colliders are available to simulation
- **GIVEN** the mission map is loaded
- **WHEN** the authoritative simulation builds hero blockers
- **THEN** wall and map blocker colliders SHALL be available in serializable map or mission state

#### Scenario: Hero is blocked by map wall
- **GIVEN** `hero:p1` is next to a map wall
- **WHEN** `p1` sends movement input into that wall
- **THEN** the authoritative simulation SHALL keep `hero:p1` outside the wall collider
