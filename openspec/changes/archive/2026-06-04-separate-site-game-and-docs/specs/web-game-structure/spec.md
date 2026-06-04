## ADDED Requirements

### Requirement: Host-independent game-client mount API
The game-client package SHALL expose a public browser API that mounts and destroys the playable game inside a host-provided element without requiring Astro.

#### Scenario: Plain webpage embeds the game
- **WHEN** a webpage provides a compatible host element and calls the game-client mount API
- **THEN** the Phaser game SHALL mount, expose its supported automation state, and support teardown without importing an Astro component

### Requirement: Game-client-owned automation contract
The game-client package SHALL own the semantic debug API and deterministic game-state behavior required by automation without requiring host-specific site markup beyond its documented embed contract.

#### Scenario: Automation inspects an embedded client
- **WHEN** the game client is embedded by a supported non-Astro host
- **THEN** automation SHALL be able to inspect and drive the current playable mission through the supported game-client contract

## MODIFIED Requirements

### Requirement: Phaser game entry point
The repository SHALL contain a TypeScript Phaser client under `defend-game-client/` with explicit source folders for scenes, systems, network abstractions, shared game state, and the public embedding API.

#### Scenario: Developer inspects the game project
- **GIVEN** a developer has cloned the repository
- **WHEN** they inspect `defend-game-client/`
- **THEN** they SHALL find the Phaser boot path, public embedding API, prototype scene code, game state model, and network abstraction entry points

### Requirement: Simulation-render-data separation
The game-client structure SHALL keep deterministic simulation, runtime content data, debug state, Phaser rendering, and host integration in identifiable modules.

#### Scenario: Developer inspects game-client source
- **WHEN** a developer inspects `defend-game-client/`
- **THEN** they SHALL be able to identify content definitions, simulation rules, debug API, transport boundary, Phaser scene rendering, and the public host adapter

### Requirement: Astro-hosted game structure
The browser game structure SHALL allow the Astro site to embed the Phaser game through the game client's public API while keeping Astro implementation outside the game-client package.

#### Scenario: Developer inspects site and game boundaries
- **WHEN** a developer inspects `web/` and `defend-game-client/`
- **THEN** they SHALL find the Astro embed component in `web/` and all reusable Phaser runtime behavior in `defend-game-client/`
