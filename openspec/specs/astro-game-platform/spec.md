# astro-game-platform Specification

## Purpose
Define the Astro static site shell, canonical platform routes, Phaser embed behavior, and deployment-version continuity for the public Defend browser experience.

## Requirements
### Requirement: Astro static site shell
The system SHALL use Astro as the static site shell for the public Defend browser experience.

#### Scenario: Developer builds the site
- **WHEN** a developer runs the production build command
- **THEN** Astro SHALL generate static site assets under `web/dist/`

#### Scenario: Visitor opens the home route
- **WHEN** a visitor opens the built site home route
- **THEN** the page SHALL present Defend as a playable game platform with navigation to the playable build, theme galleries, design system, rendering sandbox, asset catalog, and gameplay documentation

### Requirement: Embedded Phaser play surface
The Astro site SHALL embed the Phaser runtime as one client-side interactive surface without making the whole site a Phaser application.

#### Scenario: Visitor opens playable route
- **WHEN** a visitor opens the playable game route in a browser
- **THEN** the existing Phaser prototype SHALL mount into a dedicated game surface and expose the existing debug API for automation

#### Scenario: Developer inspects site boundaries
- **WHEN** a developer inspects source modules
- **THEN** Astro pages and design-system presentation code SHALL be separate from runtime game, scene, network, and simulation modules

### Requirement: Canonical platform routes
The Astro site SHALL provide stable routes for the major public platform surfaces.

#### Scenario: Route inventory is rendered
- **WHEN** the site is built
- **THEN** routes SHALL exist for playable game, biome/theme galleries, faction previews, design system, rendering sandbox, asset previews, and gameplay mechanic documentation

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

### Requirement: Player-facing play route
The playable route SHALL present itself as "Play" and avoid implementation-facing explanatory copy.

#### Scenario: Visitor opens play route
- **WHEN** a visitor opens `/play/`
- **THEN** the page heading and navigation label SHALL use "Play"
- **AND** the page SHALL NOT show implementation notes about Phaser vertical slices or Astro platform requirements

### Requirement: Mobile landscape play surface
The playable route SHALL prioritize the Phaser game surface in mobile landscape browsers.

#### Scenario: Visitor plays in mobile landscape
- **WHEN** a visitor opens `/play/` in a mobile landscape viewport
- **THEN** the site header and page title SHALL be hidden
- **AND** the Phaser game shell SHALL fill the available viewport without horizontal overflow
