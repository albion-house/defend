## ADDED Requirements

### Requirement: Audience-aware repository Markdown
Each maintained repository Markdown document SHALL have a discernible audience and SHALL contain only information relevant to that audience and purpose.

#### Scenario: Contributor adds or revises Markdown
- **WHEN** a contributor adds or substantially revises a maintained Markdown document
- **THEN** the document SHALL avoid duplicating material that has a more appropriate canonical home

### Requirement: Casual human-facing voice
Human-facing Defend prose SHALL use a casual indie-label voice with lowercase headings and names where practical, short sentences, and direct language.

#### Scenario: Visitor reads public project prose
- **WHEN** a visitor reads the root README or knowledge-garden prose
- **THEN** the writing SHALL be concise, casual, and free of unnecessary implementation detail

### Requirement: README audience
The root README SHALL orient game enthusiasts browsing GitHub and SHALL direct interested readers to the playable build, knowledge garden, and deeper repository material.

#### Scenario: Game enthusiast opens the repository
- **WHEN** a game enthusiast reads the root README
- **THEN** they SHALL learn what Defend is and where to play or browse further without encountering development setup, architecture inventories, workflow rules, or automation contracts

## MODIFIED Requirements

### Requirement: Markdown reference documentation
The repository SHALL keep human-facing project knowledge and instructions as Markdown under `docs/`, where the material can be read directly and rendered as the public knowledge garden.

#### Scenario: Human looks for project documentation
- **WHEN** a contributor or visitor looks for development instructions, references, design material, journal entries, or speculation
- **THEN** they SHALL be able to find the canonical human-facing material under `docs/`

### Requirement: Future reference-site compatibility
The documentation under `docs/` SHALL remain usable as plain Markdown while also serving as the content source for the Astro knowledge garden.

#### Scenario: Documentation is read without the site
- **WHEN** a reader browses `docs/` directly in the repository
- **THEN** the content SHALL remain understandable without running Astro

### Requirement: First playable documentation
The human-facing development documentation SHALL describe the actual first playable loop, current architecture boundaries, setup, verification, deployment, and gameplay terminology without duplicating those details in the root README.

#### Scenario: Developer starts working on Defend
- **WHEN** a developer follows the development material under `docs/`
- **THEN** they SHALL find the current setup, run, verification, deployment, architecture, and gameplay references needed to contribute

### Requirement: Astro platform documentation
The human-facing architecture documentation SHALL explain the separation between the Astro site, `docs/` content, and the independently embeddable game-client package.

#### Scenario: Developer reads architecture docs
- **WHEN** a developer reads the site and game-client architecture material under `docs/`
- **THEN** they SHALL understand the ownership and dependency boundaries without relying on the root README

### Requirement: Workflow discipline documentation
Human-facing workflow instructions SHALL live under `docs/`, while normative dev-time requirements and acceptance criteria SHALL live in OpenSpec without duplicating the full human instructions.

#### Scenario: Contributor looks for workflow guidance
- **WHEN** a contributor needs to understand how to work in the repository
- **THEN** they SHALL find the human instructions under `docs/` and the current normative change contract under `openspec/`
