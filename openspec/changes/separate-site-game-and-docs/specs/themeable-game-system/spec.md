## REMOVED Requirements

### Requirement: Theme manifests
**Reason**: The current theme manifests describe speculative presentation ideas rather than implemented theme behavior.

**Migration**: Move existing theme ideas to clearly labeled knowledge-garden content under `docs/design/` or `docs/speculation/`.

### Requirement: Theme preview pages
**Reason**: Dedicated theme preview pages are not required product routes.

**Migration**: The Astro site may render theme notes from `docs/` according to the knowledge garden's content organization.

### Requirement: Shared rendering rules
**Reason**: Speculative rendering rules should not be formal runtime requirements before they govern implemented behavior.

**Migration**: Preserve useful guidance in `docs/design/` and introduce later requirements when the game client enforces or validates those rules.

### Requirement: Future procedural expansion hooks
**Reason**: Procedural expansion is outside the current prototype scope and should not shape current runtime data.

**Migration**: Keep procedural expansion ideas under `docs/speculation/` until an approved change makes them relevant.
