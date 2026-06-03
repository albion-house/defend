# product-thesis Specification

## Purpose
Define the product identity and prototype-first constraints for Defend.
## Requirements
### Requirement: Cooperative action tower-defense identity
Defend SHALL combine active hero combat, fixed-pad tower defense, shared team economy, scripted enemy waves, and browser-accessible cooperative play.

#### Scenario: Two players defend one objective
- **GIVEN** two players are in the prototype map through local simulation or a remote session
- **WHEN** enemies spawn from multiple lanes
- **THEN** both players SHALL be able to personally attack enemies and build defenses using shared gold

### Requirement: Prototype-first development
The project SHALL prioritize an ugly one-map, browser-playable, AI-verifiable prototype before campaign systems, final art, monetization, production networking, or progression.

#### Scenario: Early implementation scope
- **GIVEN** a requested feature is not necessary to test the one-map co-op loop in a browser
- **WHEN** implementation is planned
- **THEN** the feature SHALL be deferred unless explicitly approved
