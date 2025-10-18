# Witch Doctor Class Implementation Guide

## Overview
The Witch Doctor is a voodoo practitioner who invokes powerful loa (voodoo gods) through the Voodoo Essence resource system. This guide explains the implementation and how it integrates with the existing codebase.

**Note**: The specialization "Shadow Priest" was chosen instead of "Death Caller" to avoid confusion with the existing "Deathcaller" class.

## File Structure

### Main Data File
- **Location**: `vtt-react/src/data/classes/witchDoctorData.js`
- **Export**: `WITCH_DOCTOR_DATA`
- **Structure**: Follows the same pattern as Pyrofiend, Chronarch, and other classes

### Integration Points
1. **RulesPage.jsx**: Added Witch Doctor to CLASS_DATA_MAP
2. **ClassDetailDisplay.jsx**: Added support for essenceGenerationTable and loaInvocationTable
3. **rulesData.js**: Updated Witch Doctor entry in class table

## Resource System: Voodoo Essence & Loa Invocation

### Voodoo Essence Generation
The Witch Doctor generates Voodoo Essence through various voodoo practices:

| Action | Essence Gained | Notes |
|--------|----------------|-------|
| Cast Curse | 1 | Any curse spell applied to enemy |
| Apply Poison | 1 | Weapon poison or poison grenade |
| Place Totem | 1 | Any totem type |
| Perform Ritual | 2 | Ritual must complete successfully |
| Defeat Cursed Enemy | 3 | Enemy must have your curse active |

**Maximum Capacity**: 15 Voodoo Essence

### Loa Invocations
Five powerful voodoo gods can be invoked, each requiring specific precursors:

#### 1. Baron Samedi (God of Death and Resurrection)
- **Essence Cost**: 10 (8 for Death Callers)
- **Precursors**: 3+ cursed enemies (2 for Death Callers), Ritual of Death completed
- **Effect**: Resurrect one ally with full HP + curse all enemies (4d6 necrotic over 3 turns)
- **Cooldown**: Once per long rest

#### 2. Erzulie (Goddess of Love and Protection)
- **Essence Cost**: 8 (6 for Spirit Healers)
- **Precursors**: 2+ allies within 10ft, Totem of Healing placed
- **Effect**: +2 AC, fear immunity, heal 3d8 to all allies in 30ft over 1 minute
- **Cooldown**: Once per long rest

#### 3. Papa Legba (Guardian of the Crossroads)
- **Essence Cost**: 7 (5 for War Priests)
- **Precursors**: 2+ essence from rituals, within 30ft of cursed enemy
- **Effect**: Telepathy for 1 hour + teleport 5 allies within 1 mile
- **Cooldown**: Once per long rest

#### 4. Simbi (Spirit of Healing and Rivers)
- **Essence Cost**: 6 (4 for Spirit Healers)
- **Precursors**: 1+ ally below 50% HP, Ritual of Cleansing completed
- **Effect**: Healing rain: 4d6 HP, cure diseases/poisons in 30ft
- **Cooldown**: Once per long rest

#### 5. Ogoun (God of War and Iron)
- **Essence Cost**: 9 (7 for War Priests)
- **Precursors**: Poison applied, 1+ ally in combat within 15ft
- **Effect**: +2 attack, physical resistance, +2d6 fire damage for 1 minute
- **Cooldown**: Once per long rest

## Three Specializations

### Shadow Priest (Necromancy & Resurrection)
**Theme**: Baron Samedi focus, curses, necrotic damage, resurrection

**Passive Ability**: Shadow's Embrace
- Baron Samedi invocations cost 2 less essence (8 instead of 10)
- Requires only 2 cursed enemies (instead of 3)
- Curses generate +1 additional Voodoo Essence

**Strengths**:
- Enhanced curse damage and essence generation
- Easier access to resurrection through Baron Samedi
- Strong necrotic damage output
- Excellent at controlling cursed enemies

**Weaknesses**:
- Limited healing compared to Spirit Healer
- Requires curse management
- Less effective against undead/constructs

**Key Spells**:
- Curse of Agony (2d6 necrotic DoT)
- Ritual of Death (AoE necrotic + fear)
- Hex of Weakness (reduce STR/DEX)
- Baron Samedi Invocation (resurrection + mass curse)

**ID**: `shadow-priest`

### Spirit Healer (Healing & Protection)
**Theme**: Erzulie and Simbi focus, totems, healing, support

**Passive Ability**: Spirit's Grace
- Erzulie and Simbi invocations cost 2 less essence each
- Totems generate +1 additional Voodoo Essence
- All healing spells have +50% effectiveness
- Totems have increased range and duration

**Strengths**:
- Exceptional healing output
- Strong defensive buffs
- Multiple healing sources (totems, invocations, spells)
- Great ally support

**Weaknesses**:
- Lower damage output
- Requires ally positioning awareness
- Totem placement can be disrupted
- Less effective when solo

**Key Spells**:
- Totem of Healing (2d4 HP per turn to allies)
- Ritual of Cleansing (remove curses/diseases/poisons)
- Erzulie Invocation (AC, fear immunity, healing)
- Simbi Invocation (healing rain + cleanse)

### War Priest (Combat Enhancement & Spirits)
**Theme**: Ogoun and Papa Legba focus, poisons, combat buffs

**Passive Ability**: Warrior's Spirit
- Ogoun and Papa Legba invocations cost 2 less essence each
- Poisons generate +1 additional Voodoo Essence
- Enhanced weapon damage (+2d6 on poisoned weapons)
- Can apply poisons as bonus action

**Strengths**:
- Strong combat buffs for allies
- Enhanced poison damage
- Utility through Papa Legba (teleportation, telepathy)
- Good melee/ranged hybrid capabilities

**Weaknesses**:
- Limited direct healing
- Requires melee range for some abilities
- Poison-resistant enemies reduce effectiveness
- Ogoun precursors require ally coordination

**Key Spells**:
- Venomous Weapon (2d4 poison damage for 1 hour)
- Poison Cloud (3d6 poison AoE)
- Totem of Courage (+1 attack, fear immunity)
- Ogoun Invocation (combat prowess + fire damage)
- Papa Legba Invocation (telepathy + teleportation)

## Example Spells

### Spell Categories by Specialization

**Shadow Priest Spells**:
1. Curse of Agony - Necrotic DoT curse
2. Ritual of Death - AoE necrotic + fear (precursor for Baron Samedi)
3. Hex of Weakness - Reduce STR/DEX
4. Baron Samedi Invocation - Ultimate resurrection + mass curse

**Spirit Healer Spells**:
1. Totem of Healing - Healing totem (precursor for Erzulie)
2. Ritual of Cleansing - Remove negative conditions (precursor for Simbi)
3. Erzulie Invocation - Ultimate protection + healing
4. Simbi Invocation - Ultimate healing rain + cleanse

**War Priest Spells**:
1. Venomous Weapon - Poison weapon enhancement
2. Poison Cloud - AoE poison damage
3. Totem of Courage - Attack buff + fear immunity
4. Ogoun Invocation - Ultimate combat enhancement
5. Papa Legba Invocation - Ultimate utility (teleportation + telepathy)

**Universal Spells**:
1. Spirit Communion - Divination ritual (ask spirits 3 questions)

## Strategic Gameplay

### Early Combat (Rounds 1-3)
- Focus on building essence through curses and totems
- Apply poisons to weapons
- Identify which loa will be most valuable
- Place totems strategically

### Mid Combat (Rounds 4-6)
- Should have 6-10 essence
- Consider invoking Simbi for healing or Papa Legba for utility
- Continue building toward major invocations
- Maintain curse coverage on priority targets

### Late Combat (Rounds 7+)
- Prime time for Baron Samedi or Ogoun invocations
- Game-changing abilities can turn the tide
- Use accumulated essence for maximum impact

### Precursor Management
**Baron Samedi Preparation**:
- Curse multiple enemies early
- Have Ritual of Death ready
- Track cursed enemy count

**Erzulie Preparation**:
- Place Totem of Healing when allies are grouped
- Position near allies (2+ within 10ft)

**Papa Legba Preparation**:
- Complete rituals to generate essence
- Stay within 30ft of cursed enemies

**Simbi Preparation**:
- Monitor ally health (need 1 below 50%)
- Complete Ritual of Cleansing

**Ogoun Preparation**:
- Apply poisons early in combat
- Coordinate with allies for positioning

## Integration with Existing Systems

### ClassDetailDisplay Component
Enhanced to support:
- essenceGenerationTable (Voodoo Essence generation methods)
- loaInvocationTable (Loa invocation costs and precursors)
- Standard passive ability format
- Specialization-specific passive abilities

### Spell Wizard Compatibility
All spells use the standard spell wizard format with:
- typeConfig, targetingConfig, durationConfig
- resourceCost (including new voodooEssence field)
- resolution, damageConfig, healingConfig, etc.
- effects object for detailed mechanics
- specialMechanics for class-specific features (essence generation, precursors, invocations)

## Roleplay Identity

### Philosophy
The loa are neither good nor evil—they are forces of nature, ancient spirits with their own agendas. To invoke them is to make a pact, to offer respect and tribute in exchange for their devastating power.

### Common Archetypes
1. **The Tribal Shaman**: Keeper of ancestral traditions, protector of their people
2. **The Desperate Bargainer**: Made a pact with the loa in a moment of need
3. **The Dark Scholar**: Studied forbidden voodoo texts for power
4. **The Cursed Bloodline**: Born with the loa's mark, destined to serve

## Technical Implementation Notes

### Resource Tracking
- Voodoo Essence: 0-15 capacity
- Precursor conditions: Boolean flags tracked per loa
- Ritual completion: Tracked separately for Papa Legba precursor
- Curse count: Tracked for Baron Samedi precursor
- Ally positioning: Real-time checks for Erzulie/Ogoun

### Specialization Discounts
Implemented through specialMechanics in spell data:
```javascript
specialMechanics: {
  voodooEssence: {
    cost: 10,
    specialization_discount: 2,
    description: 'Death Callers pay only 8 essence'
  }
}
```

### Cooldown System
All loa invocations have "once per long rest" cooldown to prevent spam and maintain their ultimate ability status.

## Future Enhancements

Potential additions:
1. Additional totems (protection, damage, mana regeneration)
2. More curse varieties (silence, blindness, decay)
3. Ritual variations for different situations
4. Lesser loa invocations (lower cost, less powerful)
5. Voodoo doll mechanics for targeted curse amplification
6. Spirit animal companions
7. Ancestral spirit summoning

