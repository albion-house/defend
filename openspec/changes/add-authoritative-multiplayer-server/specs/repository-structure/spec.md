## MODIFIED Requirements

### Requirement: Explicit top-level ownership boundaries
The repository SHALL separate site implementation, human-facing content, game-client code, and multiplayer server code into `web/`, `defend-docs/`, `defend-game-client/`, and `defend-game-server/`.

#### Scenario: Contributor inspects the repository
- **WHEN** a contributor inspects the top-level directories
- **THEN** they SHALL be able to identify where site code, knowledge-garden content, game-client code, and multiplayer server code belong

### Requirement: One-way project dependencies
The Astro site SHALL be allowed to consume `defend-docs/` content and the game-client package, while the game-client package SHALL NOT depend on Astro or files owned by `web/`.

Server-runnable gameplay rules SHALL be browser-free. If shared gameplay logic is consumed by both `defend-game-client/` and `defend-game-server/`, it SHALL NOT depend on Phaser, Astro, DOM APIs, or browser-only runtime state.

#### Scenario: Game client is inspected independently
- **WHEN** a contributor inspects the game-client dependency graph
- **THEN** it SHALL NOT require Astro or the Astro embed component

#### Scenario: Server rules are inspected independently
- **WHEN** a contributor inspects the multiplayer server dependency graph
- **THEN** authoritative gameplay rules SHALL be runnable without Phaser, Astro, or browser globals

### Requirement: Multiplayer server package
The repository SHALL use `defend-game-server/` for relay-backed two-player multiplayer server work.

`defend-game-server/` SHALL own the server process, server protocol adapters, room lifecycle, server-side validation, and server package validation tasks. The package MAY depend on browser-free shared gameplay rules, but it SHALL NOT depend on the Astro site or Phaser scene rendering.

#### Scenario: Contributor inspects the server directory after approval
- **WHEN** the authoritative multiplayer server architecture has been approved
- **THEN** `defend-game-server/` SHALL contain a runnable server package rather than only a reserved stub
- **AND** server code SHALL stay inside `defend-game-server/` or explicitly shared browser-free modules
