## Context

The current repo already has strong ingredients for agentic multiplayer testing: browser-free state tests, a mock session transport, browser driver methods under `window.__DEFEND_DEBUG__.testDriver`, and structured hero events. What is missing is a durable failure artifact that records a deterministic scenario and command stream so a coding agent can reproduce, patch, and verify a bug from a single file.

## Goals / Non-Goals

**Goals:**

- Make multiplayer test scenarios deterministic and explicitly seeded.
- Emit replay artifacts when deterministic multiplayer tests fail.
- Add a replay runner command for local and CI use.
- Classify failures with stable signature strings.
- Keep pass/fail assertions based on structured state and events.

**Non-Goals:**

- Production match replay.
- Screenshot diffing as a correctness oracle.
- Rewriting all existing tests before adding the first replayable scenarios.

## Decisions

### Store replay artifacts as JSON

Use a JSON artifact shape that includes scenario config, clients, command stream, observed events, optional snapshots, final state, failure signature, and first bad tick when known.

Rationale: JSON is easy for tests, CI, and agents to read without custom binary tooling.

### Replay command streams against the same rules path

The replay runner must feed commands through the same authoritative path used by the tested layer. Headless replays use game-core rules directly. Protocol replays use protocol clients. Browser replay is optional and should be a later layer if needed.

Rationale: reproductions should exercise the same contract that failed.

### Use stable failure signatures

Failures should classify into known signature strings before falling back to an `unknown_multiplayer_failure` signature. The signature is not a replacement for assertions; it is metadata that helps agents and CI group failures.

Rationale: stable signatures make failures searchable and actionable.

### Keep artifacts bounded

Replay artifacts should be large enough to reproduce the failure, but bounded enough for CI. Tests may sample snapshots at important ticks instead of every tick when full capture is unnecessary.

Rationale: replay files need to be committed as examples or uploaded as artifacts without becoming unwieldy.

## Open Questions

- Should replay artifacts live under `artifacts/replays/`, `test-results/replays/`, or a workspace-specific output directory?
- Should the first replay runner support only headless scenarios, or both headless and mock protocol scenarios?
- Should replay artifacts be retained only on failure, or optionally on demand for successful smoke scenarios?
