## ADDED Requirements

### Requirement: Pages workflow preserves renamed garden source
The GitHub Pages publication workflow SHALL remain compatible with the renamed `defend-docs/` garden content root and SHALL continue publishing the Astro static output from `web/dist/`.

#### Scenario: Main branch deployment after garden rename
- **GIVEN** the garden content root has been renamed to `defend-docs/`
- **WHEN** the GitHub Actions Pages workflow runs the production build, uploads the Pages artifact, deploys the site, and runs public verification
- **THEN** the workflow SHALL publish the same public garden and play routes from the built `web/dist/` output
