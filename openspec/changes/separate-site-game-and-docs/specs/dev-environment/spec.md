## ADDED Requirements

### Requirement: Separated workspace command surface
The repository SHALL expose root-level commands that coordinate installation, local development, testing, production builds, and validation across the Astro site and game-client package.

#### Scenario: Developer uses root tasks
- **GIVEN** project tools are installed
- **WHEN** a developer uses the documented root task entry points
- **THEN** they SHALL be able to develop and validate the separated projects without manually reproducing cross-project command order

### Requirement: Dynamic local browser-test preview
Local Playwright verification SHALL select and reuse an available loopback port per run rather than requiring a fixed preview port.

#### Scenario: Multiple local checkouts run browser tests
- **WHEN** browser verification runs while another preview server already occupies a common port
- **THEN** the verification run SHALL use another available loopback port without depending on the existing server

## MODIFIED Requirements

### Requirement: Web development workflow
The repository SHALL expose development, validation, and production build commands for both the independent game-client package and the Astro knowledge-garden site.

#### Scenario: Developer runs the browser projects
- **GIVEN** dependencies are installed
- **WHEN** the developer runs the relevant documented development task
- **THEN** they SHALL be able to run the Astro site with its embedded game client and validate the game client independently

### Requirement: Astro development workflow
The repository SHALL expose local development, preview, validation, and CI commands for the Astro site under `web/`.

#### Scenario: Developer runs the platform locally
- **GIVEN** dependencies are installed
- **WHEN** the developer runs the root site-development task
- **THEN** Astro SHALL serve the knowledge garden locally and the playable route SHALL mount the game-client package

### Requirement: Platform check command
The repository SHALL provide a check command that validates the game-client package, documentation integration, Astro static build output, browser smoke coverage, and OpenSpec state.

#### Scenario: Developer validates the repository
- **GIVEN** dependencies are installed
- **WHEN** the developer runs the check task
- **THEN** package validation, unit tests, production build validation, browser smoke checks, documentation integration, and OpenSpec validation SHALL run from one command
