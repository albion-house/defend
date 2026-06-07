## Why

The accepted multiplayer specs include deterministic headless tests, mock protocol tests, browser-driver tests, and hero event logs. They do not yet define the failure-artifact loop from the ideation: deterministic seeds, replay files, a replay runner, failure signatures, and CI artifacts that let an agent reproduce a multiplayer bug without visually guessing.

This change turns the existing test harness into an agentic debugging loop that records enough structured data to replay and classify multiplayer failures.

## What Changes

- Add deterministic multiplayer scenario configuration for seeds, map id, wave id, tick rate, initial heroes, and initial enemies.
- Define a replay file format containing scenario config, command stream, observed events, snapshots, final state, and failure signature.
- Add a replay runner command that can reproduce a saved scenario artifact.
- Classify known multiplayer failure signatures such as wrong hero ownership, missing state patches, desync, missing projectile hits, cooldown errors, and nondeterministic replay.
- Write replay artifacts for failed deterministic multiplayer tests in a CI-collected artifact directory.
- Extend observability beyond hero events where needed to include player join/slot events, command rejection, desync, invariant failure, and replay metadata.

## Capabilities

### Modified Capabilities

- `deterministic-simulation`: deterministic state becomes replayable from recorded command streams, not merely serializable.
- `multiplayer`: multiplayer tests emit replay artifacts and classify failure signatures.
- `ai-observability`: debug/test surfaces expose event and snapshot data needed by the replay loop.
- `dev-environment`: validation commands include a replay runner.

## Out Of Scope

- Long-term production telemetry, analytics, persistent match history, or a generalized rollback netcode system.
- Visual screenshot comparison as a primary correctness signal. Screenshots remain smoke-test support, while structured state is the source of truth.
