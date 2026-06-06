## ADDED Requirements

### Requirement: Hero weapon enemy damage
Enemy health SHALL be reduced by valid server-resolved hero weapon hits, and hero-caused enemy death SHALL use the same authoritative enemy lifecycle as other combat damage.

#### Scenario: Enemy health changes after hero projectile hit
- **GIVEN** a hero projectile collides with an active enemy
- **WHEN** the authoritative simulation resolves the hit
- **THEN** the enemy current HP SHALL decrease by the projectile damage
- **AND** the HP change SHALL be visible or inspectable through synchronized state

#### Scenario: Hero weapon kill resolves enemy death
- **GIVEN** a hero weapon hit reduces an enemy current HP to zero
- **WHEN** the authoritative simulation completes damage resolution
- **THEN** the enemy SHALL no longer count as active
- **AND** both clients SHALL observe the same enemy death state
