## MODIFIED Requirements

### Requirement: Automatic main branch Pages publication
The system SHALL publish every successful production build from `main` to GitHub Pages without manual deployment steps.

#### Scenario: Main branch deployment
- **GIVEN** a change has been pushed to `origin/main`
- **WHEN** the GitHub Actions deployment workflow completes successfully
- **THEN** the public GitHub Pages URL SHALL serve the built Defend client for that change

### Requirement: GitHub Pages build remains verified
The project SHALL retain a build path that produces static assets compatible with repository GitHub Pages hosting.

#### Scenario: Pages-compatible build check
- **WHEN** the production build is run for GitHub Pages configuration
- **THEN** static assets SHALL build successfully with the `/defend/` repository base path
