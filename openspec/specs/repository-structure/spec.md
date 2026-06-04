# repository-structure Specification

## Purpose
Define the top-level ownership and dependency boundaries for the Defend repository.

## Requirements
### Requirement: Explicit top-level ownership boundaries
The repository SHALL separate site implementation, human-facing content, game-client code, and future server work into `web/`, `docs/`, `defend-game-client/`, and `defend-game-server/`.

#### Scenario: Contributor inspects the repository
- **WHEN** a contributor inspects the top-level directories
- **THEN** they SHALL be able to identify where site code, knowledge-garden content, game-client code, and future server work belong

### Requirement: One-way project dependencies
The Astro site SHALL be allowed to consume `docs/` content and the game-client package, while the game-client package SHALL NOT depend on Astro or files owned by `web/`.

#### Scenario: Game client is inspected independently
- **WHEN** a contributor inspects the game-client dependency graph
- **THEN** it SHALL NOT require Astro or the Astro embed component

### Requirement: Minimal root coordination surface
The repository root SHALL contain only cross-project coordination, repository metadata, public orientation, and dev-time specification files rather than application source.

#### Scenario: New application code is added
- **WHEN** a contributor chooses a location for new site, game-client, or future server application code
- **THEN** the code SHALL be placed in its owning project directory rather than a shared root source directory

### Requirement: Architecture-free server stub
The repository SHALL reserve `defend-game-server/` for future two-player server work without selecting a language, framework, protocol, or deployment model.

#### Scenario: Contributor inspects the server directory
- **WHEN** no server architecture has been approved through a later change
- **THEN** `defend-game-server/` SHALL contain only enough material to preserve and explain the reserved boundary
