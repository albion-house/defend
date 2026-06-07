## Why

The current multiplayer slice has authoritative-shaped gameplay state, `hero_input`, mock protocol tests, and a browser driver, but `defend-game-server/` is still an architecture-free stub. The ideation's server-owned room principle is therefore only partially satisfied: clients can exercise server-runnable rules, but there is no real server process that assigns slots, owns simulation ticks, validates commands, handles disconnects, and synchronizes state between remote clients.

This change promotes the existing local/mock authority model into an actual multiplayer server boundary while preserving static single-player and mock-session behavior.

## What Changes

- Turn `defend-game-server/` into the owner of the real two-player room server implementation.
- Define a server room lifecycle that creates rooms, assigns `p1`/`p2`, rejects over-capacity joins, marks disconnected heroes inactive, and keeps the room alive for remaining players.
- Run the authoritative fixed-tick simulation on the server for relay-backed sessions.
- Accept only normalized gameplay commands such as `hero_input`; reject direct client attempts to mutate position, damage, health, or death state.
- Synchronize authoritative snapshots or patches to connected clients.
- Add a configured relay connection path for the browser client while keeping static hosting usable when no relay endpoint is configured.
- Add server-launching protocol tests that connect two non-visual clients to the real server and verify slot assignment, hero ownership, movement, combat synchronization, and disconnect behavior.

## Capabilities

### Modified Capabilities

- `repository-structure`: `defend-game-server/` stops being architecture-free future work and becomes the server package boundary.
- `remote-coop`: Relay-backed sessions gain a real authoritative room server while static no-relay play remains supported.
- `multiplayer`: Hero state, input, movement, and combat become server-owned in relay-backed sessions, not only local/mock authority-shaped state.

## Out Of Scope

- Production hosting, account identity, matchmaking, persistence, cross-region scaling, anti-cheat beyond command validation, or more than two active hero slots.
- Client-side prediction. V1 should use authoritative correction from synchronized server state.
- Replacing the mock session transport. Mock sessions remain useful for fast local and browser tests.
