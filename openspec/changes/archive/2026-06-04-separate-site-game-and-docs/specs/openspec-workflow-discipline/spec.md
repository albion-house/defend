## ADDED Requirements

### Requirement: OpenSpec audience
Active OpenSpec artifacts SHALL serve as precise dev-time contracts for the core developers and coding agents.

#### Scenario: Agent or core developer reads an active change
- **WHEN** an agent or core developer reads active OpenSpec artifacts
- **THEN** they SHALL find scoped requirements, decisions, tasks, and validation criteria rather than general visitor orientation or duplicated human development instructions

### Requirement: Documentation and specification separation
OpenSpec SHALL define normative behavior and change acceptance criteria, while `docs/` SHALL contain the canonical human-facing development instructions and background material.

#### Scenario: Workflow information is updated
- **WHEN** a change affects both normative behavior and human workflow guidance
- **THEN** the acceptance contract SHALL be updated in OpenSpec
- **AND** the human instructions SHALL be updated under `docs/`
