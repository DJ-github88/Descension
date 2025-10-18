# Chronarch Class Implementation Guide

## Overview
The Chronarch is a time-manipulating control/support class with a unique dual-resource system. This guide explains the implementation and how it integrates with the existing codebase.

## File Structure

### Main Data File
- **Location**: `vtt-react/src/data/classes/chronarchData.js`
- **Export**: `CHRONARCH_DATA`
- **Structure**: Follows the same pattern as Pyrofiend and Minstrel

### Integration Points
1. **RulesPage.jsx**: Added Chronarch to CLASS_DATA_MAP
2. **ClassDetailDisplay.jsx**: Enhanced to support multiple resource tables
3. **ClassDetailDisplay.css**: Added styles for key abilities section

## Resource System: Temporal Mastery

### Dual Resource Mechanic
The Chronarch uses two interconnected resources:

#### Time Shards
- **Generation**: 1 per spell cast
- **Maximum**: 10 shards
- **Usage**: Spent on Temporal Flux abilities
- **Persistence**: Carries between combats until spent or rest

#### Temporal Strain
- **Starting**: 0 at combat start
- **Accumulation**: +1 to +5 per Temporal Flux ability
- **Natural Decay**: -1 per turn if no Flux abilities used
- **Critical Level**: 10 triggers Temporal Backlash
- **Backlash**: Lose next turn, take damage equal to Strain, reset to 0

### Resource Tables
The implementation includes three resource tables:
1. **Time Shard Strategic Values**: Shows power levels at different shard counts
2. **Temporal Strain Risk Levels**: Shows risk categories and recommended actions
3. **Temporal Flux Abilities**: Lists all Flux abilities with costs and effects

## Three Specializations

### Arc of Stasis (Control/Defensive)
- **Theme**: Freezing time, preventing actions, temporal barriers
- **Color**: Royal Blue (#4169E1)
- **Icon**: spell_frost_frostshock
- **Playstyle**: High-Strain control, battlefield lockdown
- **Passive Abilities**:
  - **Temporal Anchor**: Time Freeze/Eternal Stasis cost -1 shard, gain +1 shard when freeze ends
  - **Frozen Moment**: Control Flux abilities cost -1 Strain (min 1)

### Arc of Displacement (Mobility/Positioning)
- **Theme**: Teleportation, repositioning, temporal clones
- **Color**: Medium Purple (#9370DB)
- **Icon**: spell_arcane_blink
- **Playstyle**: Moderate-Strain mobility, tactical positioning
- **Passive Abilities**:
  - **Spatial Mastery**: Teleport abilities +10 feet range, teleporting generates +1 shard
  - **Temporal Echo**: Temporal Clones last +1 turn

### Arc of Rewinding (Healing/Support)
- **Theme**: Undoing damage, reversing time, temporal restoration
- **Color**: Gold (#FFD700)
- **Icon**: spell_holy_heal
- **Playstyle**: Low-Strain support, sustained healing
- **Passive Abilities**:
  - **Temporal Restoration**: Healing Flux abilities heal +1d8, healing generates +1 shard
  - **Gentle Rewind**: Healing Flux abilities cost -1 Strain (min 1)

## Example Spells

### Spell Categories
The implementation includes 15 example spells across multiple categories:

#### Basic Time Manipulation (Levels 1-2)
- **Chrono Bolt**: Force damage + speed reduction
- **Temporal Surge**: Movement speed + Dex save advantage

#### Moderate Time Manipulation (Levels 3-4)
- **Time Lapse**: Healing + condition removal
- **Time Dilation**: Slow enemy + disadvantage on attacks
- **Temporal Shift**: Teleportation utility
- **Hourglass Shield**: Damage absorption + healing

#### Advanced Time Manipulation (Levels 5-6)
- **Chrono Blast**: AOE force damage
- **Temporal Echoes**: Summon multiple temporal echoes

#### Temporal Flux Abilities (Levels 4-7)
- **Time Freeze**: Lock enemy in stasis (5 shards, +4 Strain)
- **Reverse Time**: Undo last damage (3 shards, +2 Strain)
- **Temporal Clone**: Create action-mimicking clone (4 shards, +3 Strain)
- **Time Warp**: Ally acts twice (2 shards, +1 Strain)

#### Utility Spells
- **Temporal Beacon**: Place teleport marker
- **Time Sense**: Temporal awareness buff
- **Time Sacrifice**: Reduce Strain by taking damage

### Spell Mechanics Showcased
- **Time Shard Generation**: All spells generate 1 shard
- **Time Shard Scaling**: Many spells can spend additional shards for enhanced effects
- **Temporal Flux**: Special abilities that cost shards and add Strain
- **Diverse Effects**: Damage, healing, control, mobility, utility
- **Multiple Resolution Types**: Dice, Save, None
- **Various Targeting**: Single, Self, AOE, Location

## Special Mechanics

### Temporal Flux System
Temporal Flux abilities are marked with:
```javascript
specialMechanics: {
  temporalFlux: {
    shardCost: 5,
    strainGained: 4,
    type: 'control'
  }
}
```

### Time Shard Scaling
Regular spells can scale with additional Time Shards:
```javascript
specialMechanics: {
  timeShards: {
    generated: 1,
    scaling: {
      type: 'damage',
      formula: '+1d6 per additional Time Shard spent'
    }
  }
}
```

## Integration with Existing Systems

### ClassDetailDisplay Component
Enhanced to support:
- Multiple resource tables (not just infernoLevelsTable)
- New passive ability format (passiveAbility + specPassive objects)
- Key abilities section for specializations

### Spell Wizard Compatibility
All spells use the standard spell wizard format with:
- typeConfig, targetingConfig, durationConfig
- resourceCost (including new timeShards field)
- resolution, damageConfig, healingConfig, etc.
- effects object for detailed mechanics
- specialMechanics for class-specific features

## Roleplay Identity

### Character Archetypes
- **The Eternal Student**: Seeks to extend lifespan for knowledge
- **The Time-Lost Wanderer**: Displaced from original timeline
- **The Temporal Guardian**: Protects timeline from abuse
- **The Paradox Seeker**: Obsessed with temporal paradoxes
- **The Regretful Mage**: Haunted by unchangeable past

### Physical Manifestations
- Eyes shimmer with glimpses of possible futures
- Hair ages and de-ages in flowing patterns
- Temporal echoes trail movements like afterimages
- At high Strain, reality fractures showing overlapping moments
- Carry timepieces (hourglasses, pocket watches, sundials) as foci

## Combat Role

### Primary Functions
1. **Battlefield Control**: Freeze enemies, prevent actions
2. **Damage Mitigation**: Rewind damage, create barriers
3. **Tactical Repositioning**: Teleport allies and enemies
4. **Emergency Support**: Undo catastrophic damage

### Team Dynamics
- Protect allies by rewinding damage or freezing threats
- Enable aggressive plays with temporal safety nets
- Coordinate with team to maximize time manipulation value
- Communicate Strain levels to avoid unexpected Backlash

## Strategic Gameplay

### Resource Management Patterns

#### Burst Windows
1. Build to 8-9 Time Shards
2. Use multiple Flux abilities in succession
3. Let Strain decay naturally
4. Repeat cycle

#### Sustained Control
1. Use low-Strain abilities (1-2 Strain) regularly
2. Maintain safe Strain levels (0-4)
3. Consistent battlefield control
4. Lower burst potential

#### Emergency Reserve
1. Keep 3-5 shards available
2. Save for critical Reverse Time or Time Freeze
3. React to dangerous situations
4. Risk management focus

### Strain Management
- **0-2 Strain**: Safe zone, use Flux freely
- **3-4 Strain**: Low risk, continue with caution
- **5-6 Strain**: Moderate risk, plan recovery
- **7-8 Strain**: High risk, avoid Flux unless critical
- **9 Strain**: Critical risk, must let decay
- **10 Strain**: BACKLASH - lose turn, take damage

## Future Expansion

### Potential Additions
- More Temporal Flux abilities per specialization
- Talent tree implementation (see TALENT_TREE_GUIDE.md)
- Additional utility spells
- Chronomancer-specific items/equipment
- Temporal paradox mechanics
- Timeline manipulation features

### Class Resource Integration
The Chronarch should be added to:
- `classResources.js`: Define resource initialization
- `classResourceUtils.js`: Add resource management utilities
- Character creation wizard: Add Chronarch selection
- Character sheet: Display Time Shards and Temporal Strain

## Testing Checklist

- [ ] Chronarch appears in rules page class table
- [ ] Clicking Chronarch name opens detail page
- [ ] All four tabs display correctly (Overview, Resource System, Specializations, Example Spells)
- [ ] Three resource tables render properly
- [ ] All three specializations display with correct colors
- [ ] Passive abilities show correctly
- [ ] Key abilities section displays
- [ ] Example spells render in spell cards
- [ ] Spell icons load from WoW icon database
- [ ] Time Shard and Temporal Strain mechanics are clear
- [ ] Temporal Flux abilities are distinguishable

## Notes

- The Chronarch follows the established pattern of Pyrofiend and Minstrel
- All spells use WoW icon names for consistency
- The dual-resource system is more complex than single-resource classes
- Temporal Flux abilities are the class's signature mechanic
- Balance may need adjustment based on playtesting
- Consider adding visual indicators for Strain levels in the HUD

