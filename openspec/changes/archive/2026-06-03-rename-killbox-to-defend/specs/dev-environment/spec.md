## MODIFIED Requirements

### Requirement: Repository-base public route verification
Public deployment verification SHALL preserve the configured GitHub Pages repository base path when checking platform routes.

#### Scenario: Verify repository Pages routes
- **GIVEN** the public base URL ends with `/defend/`
- **WHEN** browser verification checks platform subroutes
- **THEN** it SHALL check routes below `/defend/` rather than the domain root

### Requirement: Public deployment integration test entry point
The repository SHALL provide a command entry point for verifying a published GitHub Pages deployment with browser automation.

#### Scenario: Verify published deployment
- **GIVEN** dependencies are installed and a public Pages URL is available
- **WHEN** a developer or CI job runs the public deployment verification command with the expected version identifier
- **THEN** Playwright SHALL check that the public page serves the expected version and that the beginning of the game is playable
