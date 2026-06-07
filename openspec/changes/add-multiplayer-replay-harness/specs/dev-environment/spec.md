## ADDED Requirements

### Requirement: Replay validation command
The repository SHALL provide a documented dev task for replaying deterministic multiplayer failure artifacts.

#### Scenario: Developer runs replay artifact
- **GIVEN** a replay artifact exists at `path/to/replay.json`
- **WHEN** a developer runs the repo-approved replay command with that path
- **THEN** the command SHALL replay the recorded scenario
- **AND** report whether the failure reproduces, resolves, or becomes nondeterministic

### Requirement: CI preserves replay artifacts
The CI validation workflow SHALL preserve replay artifacts produced by failed deterministic multiplayer tests.

#### Scenario: Failed CI test emits replay
- **WHEN** deterministic multiplayer tests fail in CI
- **THEN** the CI run SHALL expose the generated replay files as artifacts or test output
- **AND** the test logs SHALL include the replay path and failure signature
