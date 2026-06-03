# dev-environment Specification

## Purpose
Define the project command surface for TypeScript, Phaser, OpenSpec, and deployment-oriented development.
## Requirements
### Requirement: mise task entry points
The repository SHALL expose common TypeScript, Phaser, OpenSpec, and deployment-related commands through mise tasks when practical.

#### Scenario: Developer lists tasks
- **GIVEN** mise is installed
- **WHEN** the developer runs `mise tasks`
- **THEN** common web project tasks SHALL be discoverable

### Requirement: Web development workflow
The repository SHALL expose web development, validation, and production build commands through mise tasks.

#### Scenario: Developer runs the web prototype
- **GIVEN** dependencies are installed
- **WHEN** the developer runs the dev task
- **THEN** Vite SHALL serve the Phaser prototype locally for browser testing

### Requirement: Automated project checks
The repository SHALL provide a single check task that runs linting, tests, production build, and OpenSpec validation.

#### Scenario: Developer validates the pivot
- **GIVEN** dependencies are installed
- **WHEN** the developer runs the check task
- **THEN** linting, unit tests, build validation, and OpenSpec validation SHALL run from one command

### Requirement: Public deployment integration test entry point
The repository SHALL provide a command entry point for verifying a published GitHub Pages deployment with browser automation.

#### Scenario: Verify published deployment
- **GIVEN** dependencies are installed and a public Pages URL is available
- **WHEN** a developer or CI job runs the public deployment verification command with the expected version identifier
- **THEN** Playwright SHALL check that the public page serves the expected version and that the beginning of the game is playable

### Requirement: Deployment readiness wait
The public deployment verification SHALL allow a bounded wait for GitHub Pages to begin serving the newly published version.

#### Scenario: Pages propagation delay
- **GIVEN** the Pages deployment action has completed but the public URL may still serve an older build
- **WHEN** the public deployment verification starts
- **THEN** it SHALL retry until the expected version is observed or fail with a clear timeout

### Requirement: Astro development workflow
The repository SHALL expose local development, preview, validation, and CI commands for the Astro-hosted game platform.

#### Scenario: Developer runs the platform locally
- **GIVEN** dependencies are installed
- **WHEN** the developer runs the dev task
- **THEN** Astro SHALL serve the site locally and the playable route SHALL mount the Phaser prototype

### Requirement: Platform check command
The repository SHALL provide a check command that validates TypeScript, tests, static build output, browser smoke coverage, and OpenSpec state for the Astro platform.

#### Scenario: Developer validates the platform
- **GIVEN** dependencies are installed
- **WHEN** the developer runs the check task
- **THEN** linting, unit tests, production build validation, browser smoke checks, and OpenSpec validation SHALL run from one command

### Requirement: Repository-base public route verification
Public deployment verification SHALL preserve the configured GitHub Pages repository base path when checking platform routes.

#### Scenario: Verify repository Pages routes
- **GIVEN** the public base URL is `https://codekiln.github.io/defend/`
- **WHEN** browser verification checks platform subroutes
- **THEN** it SHALL check routes below `/defend/` rather than the domain root

### Requirement: Public deployment wait honors test timeout
Public deployment verification SHALL allow its configured deployment readiness wait to complete before Playwright's per-test timeout fails the test.

#### Scenario: Pages propagation wait is longer than default timeout
- **GIVEN** deployment verification is configured to wait up to 180 seconds for a version
- **WHEN** the public page initially serves an older version
- **THEN** the Playwright test SHALL continue retrying until the configured readiness deadline or successful version match

### Requirement: Stable toolchain policy
The repository SHALL define project language, CLI, package-manager, and GitHub Actions toolchains using latest stable or LTS-compatible selectors where practical.

#### Scenario: Contributor inspects local toolchain policy
- **WHEN** a contributor reads the project toolchain configuration
- **THEN** the required project tools SHALL use stable or LTS-compatible selectors where practical
- **AND** unused languages SHALL NOT be introduced solely because they exist in personal preference examples

#### Scenario: CI inspects deployment toolchain policy
- **WHEN** a GitHub Pages workflow builds and verifies the site
- **THEN** the workflow SHALL use the project Node line
- **AND** GitHub Actions dependencies SHALL use current stable action majors or runtime compatibility settings

### Requirement: Preferred npm-compatible package manager
The repository SHALL prefer Aube for Node package workflows when it preserves deterministic installs, lockfile behavior, local reproducibility, and CI reproducibility.

#### Scenario: Aube is validated for the current package workflow
- **WHEN** Aube successfully installs the existing Node dependency graph using the repository lockfile strategy
- **THEN** local package-manager tasks MAY use Aube as the default npm-compatible package manager
- **AND** npm SHALL remain documented as a fallback path

#### Scenario: Aube is not validated for the current package workflow
- **WHEN** Aube cannot reproduce the existing install, build, test, or CI behavior
- **THEN** npm SHALL remain the default package manager
- **AND** the repository SHALL document the blocker before switching package-manager defaults

### Requirement: Toolchain reproducibility validation
The repository SHALL validate toolchain changes with the same deterministic checks used for the Astro platform and public deployment workflow.

#### Scenario: Toolchain configuration changes
- **WHEN** project tool, package-manager, or CI action versions are changed
- **THEN** dependency installation, TypeScript validation, unit tests, static build, browser smoke coverage, OpenSpec validation, and public deployment verification SHALL remain runnable through documented commands
