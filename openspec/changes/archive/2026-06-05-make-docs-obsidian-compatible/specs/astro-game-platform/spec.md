## ADDED Requirements

### Requirement: Renamed garden content source
The Astro site SHALL render the public knowledge garden from the renamed `defend-docs/` content root while preserving existing public garden and play routes.

#### Scenario: Developer builds renamed garden source
- **WHEN** a developer runs the production build command after the garden folder is renamed
- **THEN** the Astro site SHALL include Markdown content from `defend-docs/`
- **AND** the public routes for the home page, `/garden/.../` entries, and `/play/` SHALL remain stable
