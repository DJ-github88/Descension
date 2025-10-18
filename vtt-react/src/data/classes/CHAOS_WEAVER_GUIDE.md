# Chaos Weaver Class Implementation Guide

## Overview
The Chaos Weaver is the highest damage class in the game, specializing in unpredictable magic with random effects controlled through Mayhem Modifiers. This guide explains the implementation and how it integrates with the existing codebase.

## File Structure

### Main Data File
- **Location**: `vtt-react/src/data/classes/chaosWeaverData.js`
- **Export**: `CHAOS_WEAVER_DATA`
- **Structure**: Follows the same pattern as Pyrofiend and Chronarch

### Integration Points
1. **RulesPage.jsx**: Added Chaos Weaver to CLASS_DATA_MAP
2. **rulesData.js**: Updated class table entry (Role: Damage, Resource: Mayhem Modifiers)
3. **ClassDetailDisplay.jsx**: Already supports the required features (rollable tables, multiple resource tables)

## Resource System: Mayhem Modifiers

### Core Mechanic
Chaos Weavers generate **Mayhem Modifiers** through specific abilities and spend them to adjust random table results.

**Generation**:
- Chaotic Infusion: 1d4 Mayhem Modifiers (4 mana)
- Wild Conduit: 2d4 Mayhem Modifiers (6 mana)
- Unpredictable Surge: 1d6 Mayhem Modifiers (5 mana)

**Usage**:
- Spend 1 modifier to adjust a table result by ±1
- Can spend multiple modifiers on a single roll
- Maximum capacity: 20 modifiers
- Modifiers persist between combats until spent or long rest

### Resource Tables
The implementation includes three resource tables:
1. **Mayhem Modifier Strategic Values**: Shows control levels at different modifier counts
2. **Chaos Intensity Levels**: Shows risk levels for different types of chaos spells
3. **Strategic Considerations**: Guidance on when to generate/spend/save modifiers

## Three Specializations

### Reality Bending (Tactical Chaos)
- **Theme**: Spatial manipulation, terrain transformation, teleportation
- **Color**: Purple (#9B59B6)
- **Icon**: spell_arcane_polymorphchicken
- **Playstyle**: Tactical battlefield control with moderate risk
- **Passive Abilities**:
  - **Chaos Attunement** (All specs): +1 Mayhem Modifier on natural 1 or 20
  - **Reality Anchor**: +2 Mayhem Modifiers when transforming terrain/teleporting; spend 3 to choose teleport location
- **Key Abilities**: Fractured Realms, Reality Swap, Whimsical Alteration
- **Strengths**: Superior battlefield control, teleportation, tactical applications
- **Weaknesses**: Lower raw damage, requires spatial awareness, less effective in confined spaces

### Wild Magic (Pure Chaos)
- **Theme**: Wild magic surges, unpredictable effects, maximum randomness
- **Color**: Red (#E74C3C)
- **Icon**: spell_nature_wispsplode
- **Playstyle**: Maximum chaos, highest risk/reward, pure randomness
- **Passive Abilities**:
  - **Chaos Attunement** (All specs): +1 Mayhem Modifier on natural 1 or 20
  - **Wild Surge**: d20 on every spell cast (1=Wild Magic Surge, 20=double effect); +1 modifier when surge occurs
- **Key Abilities**: Mist of Mayhem, Arcane Roulette, Pandemonic Pulse
- **Strengths**: Highest damage potential, most powerful random effects, unpredictable
- **Weaknesses**: Highest friendly fire risk, least control, can harm party

### Entropy (Controlled Destruction)
- **Theme**: Decay, destruction, armor shredding, sustained damage
- **Color**: Dark Gray (#2C3E50)
- **Icon**: spell_shadow_shadetruesight
- **Playstyle**: Sustained damage, debuffs, controlled destruction
- **Passive Abilities**:
  - **Chaos Attunement** (All specs): +1 Mayhem Modifier on natural 1 or 20
  - **Entropic Decay**: Chaos damage ignores 25% armor; enemies lose 1 AC per hit (max 5 stacks); +3 modifiers at 5 stacks
- **Key Abilities**: Entropic Blast, Chaos Burst, Discordant Strike
- **Strengths**: Consistent high damage, powerful debuffs, effective vs armor
- **Weaknesses**: Less burst than Wild Magic, fewer utility options, limited crowd control

## Example Spells - Rollable Table Showcase

The Chaos Weaver's example spells are specifically designed to showcase the spell wizard's rollable table system:

### Basic Spells
1. **Chaos Burst** - Simple d6 random damage type table
2. **Chaotic Infusion** - Mayhem Modifier generation (1d4)
3. **Wild Conduit** - Mayhem Modifier generation (2d4)

### Intermediate Spells
4. **Arcane Roulette** - d10 table with varied spell effects
5. **Pandemonic Pulse** - d20 table with escalating damage and effects
6. **Reality Swap** - Random target selection with conditional effects

### Advanced Spells
7. **Mist of Mayhem** - d33 Wild Magic Surge table (abbreviated from full 33+ entry table)
8. **Fractured Realms** - d10 Terrain Transformation table with save mechanics
9. **Entropic Blast** - High damage with armor reduction debuff

### Ultimate Spell
10. **Chaotic Vortex** - d6 table that changes each round, affecting all creatures in AOE

## Rollable Table Implementation

All chaos spells use the `rollableTable` configuration:

```javascript
rollableTable: {
  enabled: true,
  diceType: 'd20',        // Type of die to roll
  diceCount: 1,           // Number of dice
  tableName: 'Effect Name',
  description: 'Optional description',
  outcomes: [
    { 
      range: [1, 3],      // Inclusive range
      effect: 'effect_id',
      description: 'What happens on this result'
    },
    // ... more outcomes
  ]
}
```

### Special Mechanics
All chaos spells include:
```javascript
specialMechanics: {
  mayhemModifiers: {
    canSpend: true,
    adjustsTable: true,
    description: 'Spend Mayhem Modifiers to adjust result by ±1 per modifier'
  }
}
```

## Integration with Existing Systems

### ClassDetailDisplay Component
Already supports all required features:
- Multiple resource tables (mayhemModifierTable, chaosIntensityTable)
- Rollable tables in spell cards
- Passive ability format (passiveAbility + specPassive)
- Standard spell wizard format

### Spell Wizard Compatibility
All spells use the standard format:
- typeConfig, targetingConfig, durationConfig
- resourceCost (mana, components)
- resolution (DICE, SAVE, AUTOMATIC)
- damageConfig, effects, specialMechanics
- rollableTable for chaos effects

## Roleplay Identity

### Philosophy
Chaos Weavers embrace unpredictability and reject rigid magical structures. They believe true power comes from accepting randomness.

### Common Archetypes
- **The Mad Experimenter**: Scientific approach to chaos
- **The Entropy Cultist**: Worships disorder and decay
- **The Reality Gambler**: Addicted to the thrill of randomness
- **The Accidental Savant**: Natural affinity for chaos magic
- **The Chaos Prophet**: Sees truth in random patterns

### Personality Traits
Unpredictable, spontaneous, comfortable with uncertainty, dark humor about consequences, may seem reckless or insane.

## Balance Considerations

### Highest Damage Class
- Chaos Weaver is intentionally the highest damage class
- Pyrofiend is second-highest
- Balance comes from unpredictability and risk of friendly fire
- Mayhem Modifiers provide strategic control to offset randomness

### Risk/Reward
- Wild Magic spec has highest damage but highest risk
- Reality Bending has lowest damage but best control
- Entropy has consistent damage with moderate risk
- All specs can harm allies if not careful

### Team Coordination
- Requires adaptable teammates
- Benefits from tanks and support to mitigate chaos
- Positioning is critical to avoid friendly fire
- Communication about chaos effects is essential

## Testing Checklist

- [ ] Chaos Weaver appears in rules page class table
- [ ] Clicking Chaos Weaver name opens detail page
- [ ] All four tabs display correctly (Overview, Resource System, Specializations, Example Spells)
- [ ] Three resource tables render properly
- [ ] All three specializations display with correct colors
- [ ] Passive abilities show correctly for all specs
- [ ] Key abilities section displays
- [ ] Example spells render in spell cards
- [ ] Rollable tables display in spell cards
- [ ] Spell icons load from WoW icon database
- [ ] Mayhem Modifier mechanics are clear
- [ ] Wild Magic Surge table displays properly (33 entries)
- [ ] Terrain Transformation table displays properly (10 entries)
- [ ] All spell tags are appropriate

## Notes

### Design Philosophy
The Chaos Weaver is designed for players who:
- Enjoy randomness and unpredictability
- Don't mind occasional spectacular failures
- Like adapting to unexpected situations
- Want the highest damage potential in the game
- Appreciate creative problem-solving

### Future Enhancements
Potential additions:
- Full Wild Magic Surge table (100+ entries)
- Additional chaos-themed spells
- Chaos Weaver-specific items and equipment
- Chaos-themed talent trees (if talent system is implemented)
- Integration with character creation wizard

### Known Limitations
- Some table entries are abbreviated for brevity
- Full Wild Magic Surge table (33+ entries) is condensed
- Mysterious Box table referenced but not fully implemented
- Prismatic Scatter table referenced but not fully implemented
- Chaos Nova table referenced but not fully implemented

These can be expanded in future updates as needed.

## Implementation Complete

The Chaos Weaver class is now fully implemented and integrated into the codebase, following the same pattern as Pyrofiend and Chronarch. The class showcases the spell wizard's rollable table system extensively and provides the highest damage potential in the game with appropriate risk/reward mechanics.

