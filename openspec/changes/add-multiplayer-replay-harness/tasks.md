## 1. Scenario Configuration

- [ ] 1.1 Define a deterministic multiplayer scenario config with `seed`, `mapId`, `waveId`, `fixedTickRate`, `initialEnemyLayout`, and `initialHeroPositions`.
- [ ] 1.2 Make headless multiplayer tests create initial room/game state from scenario config.
- [ ] 1.3 Make protocol-level test helpers accept the same scenario config where applicable.

## 2. Replay Artifact Format

- [ ] 2.1 Define the replay JSON schema or TypeScript type.
- [ ] 2.2 Record clients, ordered commands, observed events, state snapshots, final state, failure signature, and first bad tick.
- [ ] 2.3 Bound replay size while preserving enough data to reproduce failures.

## 3. Replay Runner

- [ ] 3.1 Add a command such as `mise //defend-game-client:test:replay <path>` or an equivalent repo-approved task.
- [ ] 3.2 Implement headless replay execution from a saved artifact.
- [ ] 3.3 Add at least one checked-in minimal replay fixture or generated test fixture.

## 4. Failure Signatures

- [ ] 4.1 Classify slot assignment, hero ownership, input processing, state sync, rendering, projectile, damage, cooldown, desync, disconnect, and nondeterminism failures.
- [ ] 4.2 Include the signature, expected behavior, actual behavior, seed, replay path, and first bad tick when known.
- [ ] 4.3 Ensure unknown failures still produce replay artifacts with `unknown_multiplayer_failure`.

## 5. Observability And CI

- [ ] 5.1 Extend event logging where needed for player join, slot assignment, command rejection, state invariant failure, and desync detection.
- [ ] 5.2 Write replay artifacts for failed deterministic multiplayer integration tests.
- [ ] 5.3 Ensure CI preserves replay artifacts from failed multiplayer test runs.
- [ ] 5.4 Run `dev/sandbox openspec validate add-multiplayer-replay-harness --strict --no-interactive`.
- [ ] 5.5 Run `dev/sandbox mise //:check`.
