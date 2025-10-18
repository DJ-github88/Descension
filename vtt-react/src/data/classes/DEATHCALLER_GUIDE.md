# Deathcaller Class Implementation Guide

## Overview
The Deathcaller is a blood magic necromancer who sacrifices health for forbidden power through the Necrotic Ascension system. This guide explains the implementation and how it integrates with the existing codebase.

## File Structure

### Main Data File
- **Location**: `vtt-react/src/data/classes/deathcallerData.js`
- **Export**: `DEATHCALLER_DATA`
- **Structure**: Follows the same pattern as Pyrofiend, Chronarch, and other classes

### Integration Points
1. **RulesPage.jsx**: Added Deathcaller to CLASS_DATA_MAP (line 18)
2. **rulesData.js**: Updated class table entry (line 551)
   - Role: Damage/Support
   - Resource: Necrotic Ascension
   - Description: Blood mage sacrificing health for forbidden power
3. **classResources.js**: Added Necrotic Ascension resource system (lines 222-305)

## Resource System: Necrotic Ascension

### Core Mechanic
Deathcallers unlock seven sequential **Ascension Paths**, each granting powerful boons but inflicting permanent curses.

**Key Features**:
- **Sequential Unlocking**: Paths unlock at specific levels (1, 3, 5, 7, 9, 11, 13)
- **Permanent Activation**: Once activated, paths cannot be deactivated
- **Stacking Effects**: Multiple paths can be active simultaneously
- **Risk/Reward**: Each path provides significant power but severe drawbacks

### The Seven Paths

1. **Shrouded Veil** (Level 1)
   - Boon: Resistance to necrotic damage + advantage on Stealth
   - Curse: -10% max HP (perpetual shadow drain)

2. **Crimson Pact** (Level 3)
   - Boon: Generate Blood Tokens from health sacrifice (1 HP = 1 Token)
   - Curse: Unused tokens burst after 10 min (1d10 per token)

3. **Spectral Command** (Level 5)
   - Boon: Spectral allies deal +1d6 necrotic damage
   - Curse: -25 ft speed per spectral ally summoned

4. **Frostwalker** (Level 7)
   - Boon: Aura: 15ft radius, -10ft enemy speed, 1d4 cold/turn
   - Curse: +50% fire damage taken (vulnerability)

5. **Silent Shroud** (Level 9)
   - Boon: Advantage on Stealth and silent movement
   - Curse: -2 Perception (muffled senses)

6. **Life Leech** (Level 11)
   - Boon: Melee attacks restore 1d6 HP
   - Curse: -5% max HP (unquenchable thirst)

7. **Deep Void** (Level 13)
   - Boon: 1/long rest: Negate any spell targeting you
   - Curse: 2d6 psychic damage when used (void consumption)

### Blood Token System

**Generation** (requires Crimson Pact path):
- Sacrifice 1 HP = Generate 1 Blood Token
- No hard limit on tokens

**Usage**:
- Spend tokens to enhance necrotic damage spells
- Each token adds +1d6 necrotic damage
- Can spend multiple tokens on one spell

**Expiration**:
- Tokens expire after 10 minutes
- Timer resets when new tokens are generated
- Expired tokens burst for 1d10 necrotic damage each

## Specializations

### 1. Blood Reaver
**Theme**: Aggressive Life Drain
**Color**: #8B0000 (Dark Red)

**Passive**: Sanguine Hunger
- Life drain effects 25% more effective
- When below 25% HP, next life drain is instant and free

**Key Abilities**:
- Blood Leech: Drain health, restore 25% per HP sacrificed
- Crimson Shield: Absorb 10x damage sacrificed, convert to healing
- Eternal Agony: Escalating psychic damage over 5 turns

**Playstyle**: Melee-range vampire warrior, high sustain through draining

### 2. Spectral Master
**Theme**: Summoning and Control
**Color**: #4B0082 (Indigo)

**Passive**: Spectral Dominion
- Spectral allies have +25% health and deal +1d4 necrotic damage
- Speed penalty from Spectral Command reduced by 10 feet per summon

**Key Abilities**:
- Soul Chain: Summon spectral ally with HP equal to health sacrificed
- Dance of the Damned: Summon two skeletal archers
- Spectral Vanguard: Summon powerful spectral knight

**Playstyle**: Summoner with area control, sustained damage through minions

### 3. Void Caller
**Theme**: Psychic Devastation
**Color**: #1C1C1C (Near Black)

**Passive**: Void Touched
- Psychic damage ignores resistance
- Deep Void activation grants Void Power stacks (+2d6 per stack)

**Key Abilities**:
- Mind Shatter: Psychic damage equal to health sacrificed (rounded up)
- Despair's Grasp: Mass debuff causing disadvantage and halved movement
- Void Rift: Ultimate ability with permanent HP cost

**Playstyle**: Ranged psychic damage, high-risk ultimate abilities

## Example Spells

### Basic Spells (Levels 1-2)
1. **Shadow Step** - Teleport through shadows (1d6 HP cost)
2. **Blood Leech** - Life drain with scaling based on HP sacrificed (1d4 HP cost)
3. **Crimson Shield** - Absorption shield that converts damage to healing (1d10 HP cost)

### Summoning Spells (Levels 3-4)
4. **Soul Chain** - Summon spectral ally (2d8 HP cost, requires corpse)
5. **Dance of the Damned** - Summon two skeletal archers (3d6 HP cost, requires 2 corpses)

### Psychic/Void Spells (Levels 4-5)
6. **Mind Shatter** - Psychic damage equal to HP sacrificed (2d6 HP cost)
7. **Despair's Grasp** - Mass debuff in 30ft radius (DC 15 Wisdom)
8. **Eternal Agony** - Escalating psychic DoT over 5 turns (1d10 HP cost)

### Ultimate Abilities (Levels 5-7)
9. **Aura of Decay** - 20ft aura dealing 2d6 necrotic/turn (2d8 HP cost)
10. **Binding Pain** - Paralyze enemies in 30ft radius (3d10 damage, DC 16 Con)
11. **Void Rift** - Pull enemies and deal 12d10 necrotic (4d10 HP + 1d6 permanent HP)
12. **Life Link** - Split damage with ally for 1 minute

## Health Cost Mechanics

### Implementation
All health costs use the `resourceCost` field with formulas:

```javascript
resourceCost: {
  mana: 10,
  health: 0,
  components: ['verbal', 'somatic'],
  useFormulas: {
    health: true
  },
  resourceFormulas: {
    health: '1d6'  // Dice formula for health cost
  }
}
```

### Blood Token Integration
When Crimson Pact path is active:
- Health sacrificed generates Blood Tokens (1:1 ratio)
- Tokens can enhance spell damage (+1d6 per token)
- Unused tokens burst after 10 minutes (1d10 per token)

### Permanent HP Costs
Ultimate abilities like Void Rift use permanent HP costs:

```javascript
resourceFormulas: {
  health: '4d10',           // Per-turn cost
  permanentHealth: '1d6'    // One-time permanent cost
}
```

## Design Philosophy

### High-Risk, High-Reward
- Every powerful spell requires blood sacrifice
- Health is a resource, not just a survival metric
- Players must balance aggression with self-preservation

### Desperate Measures
- Ascension Paths represent irreversible choices
- Permanent curses create meaningful consequences
- Class embodies "last resort" necromantic power

### Mechanical Cohesion
- Blood Tokens integrate with health sacrifice
- Ascension Paths provide meaningful build choices
- Specializations offer distinct playstyles within the blood magic theme

## Testing Recommendations

1. **Resource Management**: Test Blood Token generation, usage, and expiration
2. **Health Costs**: Verify health sacrifice formulas work correctly
3. **Ascension Paths**: Test path activation and curse application
4. **Summoning**: Verify corpse requirements and spectral ally mechanics
5. **Ultimate Abilities**: Test permanent HP costs and concentration mechanics

## Future Enhancements

Potential additions:
- Blood Ritual system for group health sacrifice
- Corpse quality affecting summon strength
- Ascension Path synergies (combos between paths)
- Blood Token trading/transfer mechanics
- Necrotic corruption visual effects

## Notes

- Deathcaller is intentionally fragile but powerful
- Requires team coordination (healers essential)
- Best suited for experienced players who enjoy risk management
- Thematically dark - may not fit all campaigns

