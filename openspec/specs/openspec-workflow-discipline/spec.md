# openspec-workflow-discipline Specification

## Purpose
Define the enforced OpenSpec workflow cycle, stage commits, clean git state expectations, and apply-time UI inspection loop for Defend platform changes.

## Requirements
### Requirement: Required OpenSpec stage order
The repository documentation SHALL define `/opsx:propose -> /opsx:apply -> /opsx:sync -> /opsx:archive` as the required workflow cycle for platform changes.

#### Scenario: Contributor reads workflow docs
- **WHEN** a contributor reads the project workflow documentation
- **THEN** they SHALL find the required OpenSpec stage order and the expectation that each stage transition is committed immediately

### Requirement: Apply-time visual validation
At the end of every `/opsx:apply`, the implementer SHALL run the app or site and visually inspect the actual UI before considering implementation complete.

#### Scenario: Apply stage completes
- **WHEN** an apply implementation reaches the end of its tasks
- **THEN** the implementer SHALL run the site, inspect the UI in a browser, identify rendering or interaction defects, and fix defects through additional OpenSpec iterations when needed

### Requirement: Clean state after stage commits
Every OpenSpec stage transition SHALL leave a clean git state after committing stage changes.

#### Scenario: Stage transition is complete
- **WHEN** a workflow stage has been committed
- **THEN** `git status --short` SHALL show no uncommitted changes before the next stage starts
