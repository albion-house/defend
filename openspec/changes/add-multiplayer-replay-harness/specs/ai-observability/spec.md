## ADDED Requirements

### Requirement: Replay observability events
The test/debug surface SHALL expose structured events required to understand multiplayer replay failures without relying on screenshots.

Replay-relevant events SHALL include player join, player slot assignment, hero spawn or activation, hero input receipt or rejection, hero movement, hero firing, projectile hit, enemy damage, enemy death, state invariant failure, and client/server desync detection when available.

#### Scenario: Replay artifact contains relevant events
- **GIVEN** a deterministic multiplayer scenario records a replay artifact
- **WHEN** an agent inspects the artifact
- **THEN** the artifact SHALL include enough structured events to identify player slots, input ownership, hero movement, projectile hits, enemy damage, and desync or invariant failures

### Requirement: Replay snapshots
The test/debug surface SHALL expose latest authoritative state, latest client-observed state, latest rendered entity map when browser-driven, latest processed input sequence per player, and latest simulation tick.

#### Scenario: Agent inspects replay state
- **WHEN** an agent reviews a failed replay artifact
- **THEN** it SHALL be able to compare authoritative state, client-observed state, processed input sequence, rendered entities when applicable, and simulation tick
