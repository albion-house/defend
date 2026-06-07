## ADDED Requirements

### Requirement: Replayable deterministic scenarios
Deterministic multiplayer tests SHALL be able to initialize room or game state from explicit scenario configuration.

Scenario configuration SHALL include:

```ts
ReplayScenarioConfig {
  seed: string
  mapId: string
  waveId?: string
  fixedTickRate: number
  initialEnemyLayout?: unknown
  initialHeroPositions?: Record<"p1" | "p2", { x: number, y: number }>
}
```

#### Scenario: Scenario initializes same state
- **WHEN** two test rooms are created from the same replay scenario config
- **THEN** their serialized initial state SHALL match

#### Scenario: Scenario controls hero starting positions
- **GIVEN** a scenario config defines `initialHeroPositions`
- **WHEN** the deterministic multiplayer test starts
- **THEN** the authoritative hero state SHALL use those starting positions

### Requirement: Replay runner
The repo SHALL provide a replay runner command that can reproduce deterministic multiplayer scenarios from a replay artifact.

#### Scenario: Replay reproduces commands
- **GIVEN** a replay artifact containing a seed, scenario config, client list, and command stream
- **WHEN** the replay runner executes the artifact
- **THEN** it SHALL apply the recorded commands in deterministic order
- **AND** produce the same final authoritative state or the same classified failure

#### Scenario: Nondeterministic replay is reported
- **GIVEN** the same replay artifact is executed more than once
- **WHEN** the serialized final states differ
- **THEN** the replay runner SHALL report `nondeterministic_replay`
