## ADDED Requirements

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

## MODIFIED Requirements

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
