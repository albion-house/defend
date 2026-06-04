## MODIFIED Requirements

### Requirement: Data-driven mission content
The game-client package SHALL define map, tower, enemy, and wave content outside the core combat systems and outside the Astro site.

#### Scenario: Content inspection
- **WHEN** a developer inspects the game-client content modules
- **THEN** the mission map, tower definitions, enemy definitions, and wave script SHALL be identifiable without reading combat system or Astro site code

## REMOVED Requirements

### Requirement: Theme-aware content data
**Reason**: The existing requirement treats speculative knowledge-garden themes and design material as settled runtime content.

**Migration**: Move current speculative theme, faction, asset, and rendering material into appropriately labeled knowledge-garden content under `docs/`. A later change may introduce runtime theme data when playable behavior requires it.

### Requirement: Shared preview data
**Reason**: Public knowledge-garden content no longer needs to be represented as shared TypeScript runtime metadata.

**Migration**: The Astro site SHALL consume canonical knowledge-garden content from `docs/`; runtime adapters SHALL consume only game-client-owned data required by playable behavior.
