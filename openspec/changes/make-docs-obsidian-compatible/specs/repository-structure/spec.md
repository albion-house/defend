## MODIFIED Requirements

### Requirement: Explicit top-level ownership boundaries
The repository SHALL separate site implementation, human-facing content, game-client code, and future server work into `web/`, `defend-docs/`, `defend-game-client/`, and `defend-game-server/`.

#### Scenario: Contributor inspects the repository
- **WHEN** a contributor inspects the top-level directories
- **THEN** they SHALL be able to identify where site code, knowledge-garden content, game-client code, and future server work belong

### Requirement: One-way project dependencies
The Astro site SHALL be allowed to consume `defend-docs/` content and the game-client package, while the game-client package SHALL NOT depend on Astro or files owned by `web/`.

#### Scenario: Game client is inspected independently
- **WHEN** a contributor inspects the game-client dependency graph
- **THEN** it SHALL NOT require Astro or the Astro embed component
