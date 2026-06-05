# astro-game-platform Specification

## Purpose
Define the Astro static site shell, canonical platform routes, Phaser embed behavior, and deployment-version continuity for the public Defend browser experience.

## Requirements
### Requirement: Astro static site shell
The system SHALL use the Astro project under `web/` as the static site shell for the public Defend knowledge garden and playable browser experience.

#### Scenario: Developer builds the site
- **WHEN** a developer runs the production build command
- **THEN** the Astro project SHALL generate static GitHub Pages assets

#### Scenario: Visitor opens the home route
- **WHEN** a visitor opens the built site home route
- **THEN** the page SHALL introduce Defend, provide access to the knowledge garden, and link to or embed the playable build

### Requirement: Embedded Phaser play surface
The Astro site SHALL embed the independent game-client package as a client-side interactive surface without making the game client depend on Astro.

#### Scenario: Visitor opens playable route
- **WHEN** a visitor opens the playable game route in a browser
- **THEN** the game client SHALL mount into a dedicated surface and expose its supported debug API for automation

#### Scenario: Developer inspects site boundaries
- **WHEN** a developer inspects source modules
- **THEN** Astro pages, content integration, and site presentation SHALL be separate from the reusable game-client package

### Requirement: Canonical platform routes
The Astro site SHALL provide stable access to the knowledge-garden home and playable build without requiring a dedicated route for every design note, experiment, asset entry, or speculative topic.

#### Scenario: Public site is built
- **WHEN** the production site build completes
- **THEN** visitors SHALL be able to reach the knowledge garden and playable build
- **AND** optional knowledge-garden topics MAY be organized according to their content rather than a fixed product-route inventory

### Requirement: Renamed garden content source
The Astro site SHALL render the public knowledge garden from the renamed `defend-docs/` content root while preserving existing public garden and play routes.

#### Scenario: Developer builds renamed garden source
- **WHEN** a developer runs the production build command after the garden folder is renamed
- **THEN** the Astro site SHALL include Markdown content from `defend-docs/`
- **AND** the public routes for the home page, `/garden/.../` entries, and `/play/` SHALL remain stable

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
