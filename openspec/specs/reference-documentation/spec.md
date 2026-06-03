# reference-documentation Specification

## Purpose
Define markdown reference documentation and glossary behavior for shared Defend terminology and concepts.

## Requirements
### Requirement: Markdown reference documentation
The repository SHALL contain markdown-based reference documentation for shared Defend terminology and concepts.

#### Scenario: Reference docs exist
- **WHEN** a developer looks for project reference documentation in the repository
- **THEN** they SHALL be able to find markdown documentation that can be read without running the game or a documentation site

### Requirement: Canonical glossary
The reference documentation SHALL include a glossary that defines reusable game and development terms in one canonical place, preferring established industry or genre terminology when that terminology accurately describes Defend behavior.

#### Scenario: Glossary defines shared terms
- **WHEN** a term is used across specs, implementation, or player-facing copy as Defend domain vocabulary
- **THEN** the glossary SHALL provide a concise definition for that term

#### Scenario: Glossary uses established terminology when accurate
- **WHEN** a glossary term has an established industry or genre meaning that accurately fits Defend behavior
- **THEN** the glossary SHALL use that established term instead of inventing a one-off synonym

#### Scenario: Glossary defines exit
- **WHEN** a reader looks up the term "exit"
- **THEN** the glossary SHALL define it as the end of an enemy path where enemy combatants leave the lane and cause a leak event

#### Scenario: Glossary defines leak
- **WHEN** a reader looks up the term "leak"
- **THEN** the glossary SHALL define it as the event when an enemy combatant reaches the exit, leaves active simulation, and applies its configured leak damage to objective HP

### Requirement: Future reference-site compatibility
The reference documentation SHALL remain plain markdown that can later be incorporated into a GitHub Pages reference site without requiring site infrastructure in the current increment.

#### Scenario: Documentation stays static for now
- **WHEN** the glossary is added
- **THEN** it SHALL NOT require a static site generator, publishing workflow, or runtime game changes to be useful

### Requirement: First playable documentation
The reference documentation SHALL describe the actual first playable mission loop, architecture boundaries, and original terminology.

#### Scenario: Developer reads docs after change
- **WHEN** a developer reads README or reference docs
- **THEN** they SHALL find accurate setup, run, verification, deployment, architecture, and gameplay terminology for the implemented vertical slice

### Requirement: Tech debt and future multiplayer notes
The documentation SHALL preserve notable limitations and future multiplayer assumptions discovered during implementation.

#### Scenario: Deferred work is documented
- **WHEN** a developer reviews architecture or archive notes
- **THEN** they SHALL find clear notes for unresolved tech debt and future lockstep/rollback work

### Requirement: Astro platform documentation
The reference documentation SHALL explain the Astro platform architecture and the separation between site presentation code and runtime game code.

#### Scenario: Developer reads architecture docs
- **WHEN** a developer reads the reference documentation
- **THEN** they SHALL find the Astro route model, Phaser embed boundary, theme data model, asset pipeline visibility model, and deployment workflow

### Requirement: Workflow discipline documentation
The reference documentation SHALL describe the required OpenSpec workflow and apply-time UI inspection loop.

#### Scenario: Developer reads workflow docs
- **WHEN** a developer reads project workflow documentation
- **THEN** they SHALL find instructions to commit after propose, apply, sync, and archive stages and to visually inspect the running UI after every apply
