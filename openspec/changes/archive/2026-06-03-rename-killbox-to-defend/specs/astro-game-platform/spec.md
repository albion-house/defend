## MODIFIED Requirements

### Requirement: Astro static site shell
The system SHALL use Astro as the static site shell for the public Defend browser experience.

#### Scenario: Developer builds the site
- **WHEN** a developer runs the production build command
- **THEN** Astro SHALL generate static site assets under `dist/`

#### Scenario: Visitor opens the home route
- **WHEN** a visitor opens the built site home route
- **THEN** the page SHALL present Defend as a playable game platform with navigation to the playable build, theme galleries, design system, rendering sandbox, asset catalog, and gameplay documentation

### Requirement: Deployment version continuity
The Astro site SHALL preserve visible deployment version information used by deployment verification.

#### Scenario: Published version is visible on Astro site
- **GIVEN** a production build includes a deployment version identifier
- **WHEN** a browser opens the built Astro site
- **THEN** the page SHALL visibly show the version identifier and expose it through stable DOM state

#### Scenario: Public verifier checks canonical play route
- **GIVEN** a public GitHub Pages deployment includes a deployment version identifier
- **WHEN** the public deployment verifier checks the playable game
- **THEN** it SHALL open the canonical `/play/` route before comparing visible DOM state and debug API version state
