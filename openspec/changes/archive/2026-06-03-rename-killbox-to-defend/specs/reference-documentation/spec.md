## MODIFIED Requirements

### Requirement: Reference docs home
The repository SHALL contain markdown-based reference documentation for shared Defend terminology and concepts.

#### Scenario: Contributor opens reference docs
- **WHEN** a contributor opens the reference documentation folder
- **THEN** they SHALL find an overview that explains the purpose and scope of shared Defend reference docs

### Requirement: Glossary
The reference documentation SHALL include a glossary that defines reusable game and development terms in one canonical place, preferring established industry or genre terminology when that terminology accurately describes Defend behavior.

#### Scenario: Contributor adds repeated terminology
- **WHEN** a term is used across specs, implementation, or player-facing copy as Defend domain vocabulary
- **THEN** the term SHALL be added or linked in the glossary before its meaning can drift

#### Scenario: Established terms fit
- **WHEN** a glossary term has an established industry or genre meaning that accurately fits Defend behavior
- **THEN** the glossary SHALL use that established term instead of inventing a new project-specific synonym
