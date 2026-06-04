# content-data Specification

## Purpose
Define how first playable mission content is separated from core simulation rules.

## Requirements
### Requirement: Data-driven mission content
The game-client package SHALL define map, tower, enemy, and wave content outside the core combat systems and outside the Astro site.

#### Scenario: Content inspection
- **WHEN** a developer inspects the game-client content modules
- **THEN** the mission map, tower definitions, enemy definitions, and wave script SHALL be identifiable without reading combat system or Astro site code

### Requirement: Original legally distinct content
Mission content SHALL use original names, copy, visuals, wave data, and layout values.

#### Scenario: Content terminology
- **WHEN** a developer inspects user-facing mission strings and content identifiers
- **THEN** they SHALL NOT use Kingdom Rush names, dialogue, asset references, or exact level/wave identifiers
