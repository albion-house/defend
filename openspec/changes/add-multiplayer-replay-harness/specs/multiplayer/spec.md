## ADDED Requirements

### Requirement: Multiplayer replay artifacts
Failed deterministic multiplayer integration tests SHALL write a replay artifact that is sufficient to reproduce the failure.

The replay artifact SHALL include:

```ts
MultiplayerReplayArtifact {
  seed: string
  scenario: ReplayScenarioConfig
  clients: Array<"p1" | "p2">
  commands: Array<{
    tick: number
    client: "p1" | "p2"
    type: string
    payload: unknown
  }>
  observedEvents: unknown[]
  snapshots?: unknown[]
  finalState: unknown
  failure?: MultiplayerFailureSignature
}
```

#### Scenario: Failed test writes replay
- **GIVEN** a deterministic multiplayer test is running
- **WHEN** the test fails
- **THEN** the test SHALL write a replay artifact containing scenario config, command stream, observed events, final state, and failure signature
- **AND** the replay runner SHALL be able to execute the artifact

### Requirement: Multiplayer failure signatures
Multiplayer test failures SHALL be classified with stable failure signatures when the failure matches a known category.

Known signatures SHALL include:

- `slot_assignment_missing`
- `hero_missing_for_active_player`
- `hero_owned_by_wrong_player`
- `input_not_processed`
- `input_processed_for_wrong_hero`
- `state_patch_not_received_by_client`
- `client_render_missing_entity`
- `server_client_desync`
- `projectile_spawn_missing`
- `projectile_hit_missing`
- `enemy_damage_missing`
- `cooldown_ignored`
- `nondeterministic_replay`
- `disconnect_crash`
- `unknown_multiplayer_failure`

#### Scenario: Wrong hero ownership is classified
- **GIVEN** `p1` input is expected to mutate only `hero:p1`
- **WHEN** the test observes `p1` input mutating `hero:p2`
- **THEN** the failure signature SHALL be `input_processed_for_wrong_hero`
- **AND** the artifact SHALL include expected behavior, actual behavior, seed, replay path, and first bad tick when known

#### Scenario: Missing projectile hit is classified
- **GIVEN** a replay scenario expects a hero projectile to hit an enemy
- **WHEN** no projectile hit event or enemy damage appears by the expected tick
- **THEN** the failure signature SHALL be `projectile_hit_missing` or `enemy_damage_missing`

### Requirement: Replay artifact retention
CI SHALL retain replay artifacts from failed multiplayer test runs as downloadable test artifacts.

#### Scenario: CI multiplayer failure
- **WHEN** a multiplayer test fails in CI
- **THEN** the replay artifact SHALL be preserved in the CI run output
- **AND** the failure log SHALL include the artifact path and failure signature
