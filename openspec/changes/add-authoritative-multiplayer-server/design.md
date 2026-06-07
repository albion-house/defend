## Context

The accepted `multiplayer` spec already defines `HeroState`, `hero_input`, authoritative movement/combat rules, protocol-shaped tests, browser-driver automation, and static-host fallback. The missing piece is an actual server package that owns the room state in remote sessions. `openspec/specs/repository-structure/spec.md` still reserves `defend-game-server/` without choosing a language, framework, protocol, or deployment model.

## Goals / Non-Goals

**Goals:**

- Provide a real server process that can host a two-player room.
- Keep the existing serializable gameplay state and fixed-tick command model as the server rules surface.
- Let browser clients connect to a relay endpoint when configured.
- Keep static GitHub Pages and mock-session flows working with no relay endpoint.
- Add tests that launch the server and connect two non-visual protocol clients.

**Non-Goals:**

- Production deployment topology.
- Persistent accounts or room listings.
- Client prediction.
- New hero combat rules beyond the accepted `multiplayer` spec.

## Decisions

### Use the existing TypeScript game rules as the server simulation core

The server should run the same serializable command and fixed-tick simulation rules currently used by the client/mock authority. If needed, implementation can extract shared state/rules into a dependency that both `defend-game-client/` and `defend-game-server/` consume, but the server must not reimplement divergent hero, tower, enemy, or projectile rules.

Rationale: the current tests already cover deterministic hero state. Reusing those rules avoids client/server drift.

### Make `defend-game-server/` a TypeScript package

Use the repo's existing TypeScript toolchain shape for the server package. The exact network library can be selected during apply, but the public boundary must be a long-lived server process with room creation/join, command receive, tick advancement, snapshot/patch publish, and disconnect handling.

Rationale: this repo already has TypeScript gameplay state and workspace-scoped tooling. Keeping the server in TypeScript minimizes cross-language serialization risk.

### Keep command authority on the server

Relay-backed clients may send only approved game commands. For hero control, the client sends `hero_input` with `inputSeq`, movement, aim, and fire intent. The server maps the authenticated connection/session handle to its assigned player slot and applies commands only to that player's owned hero.

Rationale: clients should render synchronized state and send intent, not own state mutation.

### Preserve no-relay behavior

When no relay endpoint is configured, the Play route must still load and remain playable through local/mock authority. Relay code should be opt-in by configuration rather than a hard dependency of the static site.

Rationale: current product and deployment specs require static hosting to keep working.

## Open Questions

- Should the first server implementation use raw WebSocket messages or a room/session framework?
- Should the server publish full snapshots every tick for V1, patch messages, or a hybrid full-snapshot plus event stream?
- Where should shared gameplay state live long-term if the server package needs to import it without depending on Phaser or browser-only code?
