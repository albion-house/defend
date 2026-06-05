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

### Requirement: Separated workspace command surface
The repository SHALL expose root-level commands that coordinate installation, local development, testing, production builds, and validation across the Astro site and game-client package, and SHALL coordinate cross-workspace tasks through mise task references rather than a package manager's recursive script runner.

#### Scenario: Developer uses root tasks
- **GIVEN** project tools are installed
- **WHEN** a developer uses the documented root task entry points
- **THEN** they SHALL be able to develop and validate the separated projects without manually reproducing cross-project command order

#### Scenario: Cross-workspace tasks fan out through mise
- **WHEN** a root coordinating task runs work across both workspaces
- **THEN** it SHALL invoke the per-workspace tasks through mise task references
- **AND** it SHALL NOT depend on a package manager's recursive script runner to fan out

### Requirement: Dynamic local browser-test preview
Local Playwright verification SHALL select and reuse an available loopback port per run rather than requiring a fixed preview port.

#### Scenario: Multiple local checkouts run browser tests
- **WHEN** browser verification runs while another preview server already occupies a common port
- **THEN** the verification run SHALL use another available loopback port without depending on the existing server

### Requirement: Web development workflow
The repository SHALL expose development, validation, and production build commands for both the independent game-client package and the Astro knowledge-garden site.

#### Scenario: Developer runs the browser projects
- **GIVEN** dependencies are installed
- **WHEN** the developer runs the relevant documented development task
- **THEN** they SHALL be able to run the Astro site with its embedded game client and validate the game client independently

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

### Requirement: Repository-base public route verification
Public deployment verification SHALL preserve the configured GitHub Pages repository base path when checking platform routes.

#### Scenario: Verify repository Pages routes
- **GIVEN** the public base URL is `https://albion-house.github.io/defend/`
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
The repository SHALL prefer Aube for Node package management when it preserves deterministic installs, lockfile behavior, local reproducibility, and CI reproducibility. Aube SHALL be used for dependency installation and SHALL NOT be used as the task runner for project tasks.

#### Scenario: Aube is validated for the current package workflow
- **WHEN** Aube successfully installs the existing Node dependency graph using the repository lockfile strategy
- **THEN** local package-installation tasks MAY use Aube as the default npm-compatible package manager
- **AND** npm SHALL remain documented as a fallback path

#### Scenario: Aube is not validated for the current package workflow
- **WHEN** Aube cannot reproduce the existing install, build, test, or CI behavior
- **THEN** npm SHALL remain the default package manager
- **AND** the repository SHALL document the blocker before switching package-manager defaults

#### Scenario: Aube is not a task runner
- **WHEN** a project task runs
- **THEN** it SHALL be a file-based mise task
- **AND** the task SHALL NOT be defined as, or delegated to, an `aube run` npm script

### Requirement: Toolchain reproducibility validation
The repository SHALL validate toolchain changes with the same deterministic checks used for the Astro platform and public deployment workflow.

#### Scenario: Toolchain configuration changes
- **WHEN** project tool, package-manager, or CI action versions are changed
- **THEN** dependency installation, TypeScript validation, unit tests, static build, browser smoke coverage, OpenSpec validation, and public deployment verification SHALL remain runnable through documented commands

### Requirement: File-based mise tasks without npm scripts
The repository SHALL define its task surface as file-based mise tasks and SHALL NOT use npm scripts (the `scripts` block of any `package.json`) to run, delegate, or coordinate tasks.

#### Scenario: No package.json scripts remain
- **WHEN** a contributor inspects any `package.json` in the repository
- **THEN** it SHALL contain no `scripts` block used for task running
- **AND** the `workspaces` field and dependency declarations SHALL remain intact

#### Scenario: Tasks are file-based and discoverable
- **GIVEN** mise is installed
- **WHEN** the developer lists the project tasks
- **THEN** the documented project tasks SHALL be backed by file-based mise task definitions rather than `package.json` scripts

### Requirement: Workspace-local CLI version sourcing
Build and test tools that are imported in-process by project configuration or test files (such as the Astro, Vite, Vitest, Playwright test, and TypeScript packages) SHALL be sourced from the workspace dependency lockfile rather than from globally registered tool versions.

#### Scenario: Single version source for project-coupled tooling
- **WHEN** a project-coupled build or test tool is invoked through a task
- **THEN** the version used SHALL be the one resolved from the workspace dependency lockfile
- **AND** the repository SHALL NOT introduce a second, independently pinned global version of that same tool
