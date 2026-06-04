## MODIFIED Requirements

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
