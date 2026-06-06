# combat-damage-health Specification

## Purpose
Define inspectable objective health state and leak damage behavior for prototype combat.
## Requirements
### Requirement: Objective health placeholder
The defended objective SHALL expose maximum HP and current HP values through serializable game state, and current HP SHALL decrease when enemies leak into the objective.

#### Scenario: Objective placeholder state
- **GIVEN** the browser prototype is open before enemies leak
- **WHEN** the objective is displayed through the HUD or semantic debug state
- **THEN** objective max HP and current HP SHALL be available as inspectable values

#### Scenario: Objective takes leak damage
- **GIVEN** a wave enemy reaches the defended objective
- **WHEN** the enemy leaks into the objective
- **THEN** objective current HP SHALL decrease by the enemy's leak damage without dropping below zero

### Requirement: Mission outcome state
The mission SHALL expose active, victory, and defeat states based on wave completion and objective health.

#### Scenario: Victory after final wave
- **WHEN** all scripted waves are completed and objective HP remains above zero
- **THEN** the mission SHALL enter a victory state

#### Scenario: Defeat when objective falls
- **WHEN** objective current HP reaches zero
- **THEN** the mission SHALL enter a defeat state and stop active enemy pressure until restarted

### Requirement: Health bars and damage feedback
Combatants and the objective SHALL provide readable health and damage feedback through rendering or semantic debug state.

#### Scenario: Enemy health changes after attack
- **WHEN** a tower damages an active enemy
- **THEN** the enemy's current HP SHALL decrease and the change SHALL be visible or inspectable

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
