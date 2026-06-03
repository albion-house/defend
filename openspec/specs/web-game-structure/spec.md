# web-game-structure Specification

## Purpose
Define the TypeScript, Vite, and Phaser browser project structure used by the active Defend prototype.

## Requirements
### Requirement: Browser-playable static prototype
The system SHALL run as a static web application deployable to GitHub Pages without requiring native engine software.

#### Scenario: Public prototype access
- **GIVEN** a successful production build from the main branch
- **WHEN** the static files are deployed to GitHub Pages
- **THEN** a player SHALL be able to open the prototype in a browser without installing native software

### Requirement: Phaser game entry point
The repository SHALL contain a TypeScript Phaser client with explicit source folders for scenes, systems, network abstractions, and shared game state.

#### Scenario: Developer inspects the web project
- **GIVEN** a developer has cloned the repository
- **WHEN** they inspect `src/`
- **THEN** they SHALL find the Phaser boot path, prototype scene code, game state model, and network abstraction entry points

### Requirement: GitHub Pages-compatible build
The web client SHALL build into static assets suitable for GitHub Pages hosting.

#### Scenario: Static production build
- **GIVEN** dependencies are installed
- **WHEN** the developer runs the build task
- **THEN** the build output SHALL be generated as static browser assets under `dist/`

### Requirement: Automatic main branch Pages publication
The system SHALL publish every successful production build from `main` to GitHub Pages without manual deployment steps.

#### Scenario: Main branch deployment
- **GIVEN** a change has been pushed to `origin/main`
- **WHEN** the GitHub Actions deployment workflow completes successfully
- **THEN** the public GitHub Pages URL SHALL serve the built Defend client for that change

### Requirement: Visible deployed version identifier
The browser client SHALL display a deployment version identifier that automation can read from the public page.

#### Scenario: Published version is visible
- **GIVEN** a production build includes a deployment version identifier
- **WHEN** a browser opens the published GitHub Pages URL
- **THEN** the page SHALL visibly show that version identifier and expose the same value through stable DOM state

### Requirement: Public post-deploy playability verification
The system SHALL verify after GitHub Pages publication that the beginning of the game is playable from the public URL.

#### Scenario: Public playable smoke check
- **GIVEN** GitHub Pages has deployed a new build
- **WHEN** the post-deploy browser verification runs against the public URL
- **THEN** the Phaser scene SHALL load, the debug API SHALL report the initial game state, and a build-pad command SHALL update game state successfully

### Requirement: Simulation-render-data separation
The web game structure SHALL keep deterministic simulation, content data, debug state, and Phaser rendering in identifiable modules.

#### Scenario: Developer inspects source structure
- **WHEN** a developer inspects `src/`
- **THEN** they SHALL be able to identify content definitions, simulation rules, debug API, transport boundary, and Phaser scene rendering

### Requirement: GitHub Pages build remains verified
The project SHALL retain a build path that produces static assets compatible with repository GitHub Pages hosting.

#### Scenario: Pages-compatible build check
- **WHEN** the production build is run for GitHub Pages configuration
- **THEN** static assets SHALL build successfully with the repository base path

### Requirement: Astro-hosted game structure
The browser game structure SHALL host the public site through Astro while keeping Phaser runtime modules identifiable and client-only.

#### Scenario: Developer inspects Astro game structure
- **WHEN** a developer inspects `src/`
- **THEN** they SHALL be able to distinguish Astro pages/components/content from Phaser runtime mounting, game state, scenes, systems, and network abstractions

### Requirement: Pages-compatible Astro build
The GitHub Pages build path SHALL publish the Astro static output without requiring a runtime server.

#### Scenario: Static Astro production build
- **GIVEN** dependencies are installed
- **WHEN** the developer runs the production build task
- **THEN** the build output SHALL be generated as static browser assets under `dist/` with repository Pages base-path compatibility
