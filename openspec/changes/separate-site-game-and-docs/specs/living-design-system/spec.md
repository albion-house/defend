## REMOVED Requirements

### Requirement: Design tokens
**Reason**: Publishing design tokens is not a required public product surface for the current prototype.

**Migration**: Preserve useful visual decisions as knowledge-garden material under `docs/design/`; formalize runtime tokens only when implementation requires them.

### Requirement: Rendering experiment previews
**Reason**: Rendering experiments belong in the knowledge garden until they become implemented and testable product behavior.

**Migration**: Move current experiment summaries into appropriately labeled `docs/` content without requiring a dedicated route.

### Requirement: Gameplay readability validation
**Reason**: Publicly presenting readability validation is not required to validate the playable prototype.

**Migration**: Keep actionable readability guidance in human-facing design documentation and create precise requirements when a playable behavior depends on it.

### Requirement: Component documentation
**Reason**: A dedicated public component-documentation surface is not required by the current prototype.

**Migration**: Document reusable components under `docs/` when that information helps contributors.
