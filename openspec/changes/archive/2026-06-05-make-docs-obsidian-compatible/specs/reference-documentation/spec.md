## ADDED Requirements

### Requirement: Obsidian-compatible garden vault
The `defend-docs/` directory SHALL be usable as an Obsidian vault with committed project settings that generate relative Markdown links instead of Wikilinks and preserve shared hotkey behavior.

#### Scenario: Contributor creates an internal link in Obsidian
- **WHEN** a contributor uses Obsidian autocomplete to create an internal note link in `defend-docs/`
- **THEN** Obsidian SHALL generate a Markdown link with a relative path rather than a Wikilink

#### Scenario: Contributor inspects shared Obsidian behavior
- **WHEN** a contributor inspects the committed `.obsidian/` configuration under `defend-docs/`
- **THEN** shared app, core-plugin, and hotkey settings SHALL be visible in version-controlled files

#### Scenario: Contributor opens the vault after cloning
- **WHEN** a contributor clones the repository and wants to edit the garden in Obsidian
- **THEN** `defend-docs/` SHALL include human-facing setup instructions for opening the directory as an existing Obsidian vault

#### Scenario: Contributor creates local Obsidian state
- **WHEN** Obsidian creates workspace, appearance, graph, trash, cache, theme, snippet, or plugin-payload state under `defend-docs/.obsidian/` or `defend-docs/.trash/`
- **THEN** repository ignore rules SHALL prevent that local state from being committed by default

## MODIFIED Requirements

### Requirement: Markdown reference documentation
The repository SHALL keep human-facing project knowledge and instructions as Markdown under `defend-docs/`, where the material can be read directly, opened as an Obsidian vault, and rendered as the public knowledge garden.

#### Scenario: Human looks for project documentation
- **WHEN** a contributor or visitor looks for development instructions, references, design material, journal entries, or speculation
- **THEN** they SHALL be able to find the canonical human-facing material under `defend-docs/`

### Requirement: Future reference-site compatibility
The documentation under `defend-docs/` SHALL remain usable as plain Markdown while also serving as the content source for the Astro knowledge garden.

#### Scenario: Documentation is read without the site
- **WHEN** a reader browses `defend-docs/` directly in the repository
- **THEN** the content SHALL remain understandable without running Astro

### Requirement: First playable documentation
The human-facing development documentation SHALL describe the actual first playable loop, current architecture boundaries, setup, verification, deployment, and gameplay terminology without duplicating those details in the root README.

#### Scenario: Developer starts working on Defend
- **WHEN** a developer follows the development material under `defend-docs/`
- **THEN** they SHALL find the current setup, run, verification, deployment, architecture, and gameplay references needed to contribute

### Requirement: Astro platform documentation
The human-facing architecture documentation SHALL explain the separation between the Astro site, `defend-docs/` content, and the independently embeddable game-client package.

#### Scenario: Developer reads architecture docs
- **WHEN** a developer reads the site and game-client architecture material under `defend-docs/`
- **THEN** they SHALL understand the ownership and dependency boundaries without relying on the root README

### Requirement: Workflow discipline documentation
Human-facing workflow instructions SHALL live under `defend-docs/`, while normative dev-time requirements and acceptance criteria SHALL live in OpenSpec without duplicating the full human instructions.

#### Scenario: Contributor looks for workflow guidance
- **WHEN** a contributor needs to understand how to work in the repository
- **THEN** they SHALL find the human instructions under `defend-docs/` and the current normative change contract under `openspec/`
