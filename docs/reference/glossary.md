# Defend Glossary

This glossary is the canonical home for recurring Defend vocabulary. Add terms here when they appear across specs, implementation, UI copy, or developer discussion often enough that their meaning could drift. Prefer established industry or genre terms when they accurately describe Defend behavior.

## Terms

### Exit

The end of an enemy path where enemy combatants leave the lane and cause a leak event.

### Fixed Tick

A fixed tick is one deterministic simulation step. Defend currently uses 100 ms ticks for gameplay rules so replay tests and future multiplayer experiments can advance state from ordered commands rather than render-frame timing.

### Gate

The defended objective in Saltmarsh Crossing. Enemies that reach the gate leak and reduce objective HP.

### Leak

A leak is the event when an enemy combatant reaches the exit, leaves active simulation, and applies its configured leak damage to objective HP.

Leak is a gameplay lifecycle term, not just a synonym for damage. After a leak, the enemy combatant is no longer counted as active for wave simulation.

### Saltmarsh Crossing

The first playable Defend mission. It is an original map with two causeway lanes, a merge point, fixed build pads, escalating waves, and restartable victory/defeat flow.

### Simulation Command

A serializable player or automation intent applied to game state, such as building a tower, starting a wave, restarting the mission, or advancing fixed simulation ticks.
