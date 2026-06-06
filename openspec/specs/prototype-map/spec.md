# prototype-map Specification

## Purpose
Define the readable one-map arena foundation used by the browser prototype.
## Requirements
### Requirement: One arena with two lanes
The prototype map SHALL include two enemy entrances, two waypoint paths, one merge point, and one defended objective rendered in a Phaser scene.

#### Scenario: Enemy path A
- **GIVEN** an enemy spawns on path A
- **WHEN** it follows its waypoints
- **THEN** it SHALL move from the upper-left entrance toward the shared objective

#### Scenario: Enemy path B
- **GIVEN** an enemy spawns on path B
- **WHEN** it follows its waypoints
- **THEN** it SHALL move from the lower-left entrance toward the shared objective

#### Scenario: Paths merge before objective
- **GIVEN** the browser prototype is open
- **WHEN** the player or automated test inspects the waypoint placeholders
- **THEN** both paths SHALL visibly merge before reaching the defended objective

### Requirement: Fixed build pads
The prototype map SHALL use fixed build pads rather than free placement.

#### Scenario: Build pads visible
- **GIVEN** the browser prototype is open
- **WHEN** the player or automated test inspects the arena
- **THEN** exactly eight fixed build pads SHALL be visible around the lanes

### Requirement: Readable tactical lane topology
The playable mission map SHALL use original lane geometry with bends, a merge pressure point, chokepoint opportunities, and curated tower pads.

#### Scenario: Map communicates choke pressure
- **WHEN** the mission renders in the browser
- **THEN** the player SHALL be able to identify entrances, lane bends, the merge point, curated pads, and the defended objective

#### Scenario: Pad positions support tactical variety
- **WHEN** the player inspects available build pads
- **THEN** some pads SHALL visibly favor early lane coverage, some SHALL favor merge coverage, and some SHALL favor objective cleanup

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
