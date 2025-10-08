# Skills System Guide

## Custom Skills in Character Creation

Your game uses a **custom quest-based skill system** with 14 unique skills across 5 categories. These skills are now fully integrated into the character creation wizard.

## Available Skills

### Combat Mastery (3 skills)

#### 1. Weapon Mastery
- **ID**: `weaponMastery`
- **Primary Stat**: Strength
- **Secondary Stat**: Agility
- **Description**: Master various weapons and combat techniques
- **Quests**: First Blood, Weapon Maintenance, Combat Stance, and more
- **Rollable Tables**: Evolves from Basic Weapon Handling → Cosmic Weapon Techniques

#### 2. Tactical Combat
- **ID**: `tacticalCombat`
- **Primary Stat**: Intelligence
- **Secondary Stat**: Strength
- **Description**: Understand battlefield tactics and strategic positioning
- **Quests**: Tactical training and battlefield awareness
- **Rollable Tables**: Tactical maneuvers and strategic outcomes

#### 3. Defensive Techniques
- **ID**: `defensiveTechniques`
- **Primary Stat**: Constitution
- **Secondary Stat**: Agility
- **Description**: Master the art of protection and damage mitigation
- **Rollable Table**: Defensive maneuvers

### Exploration & Survival (3 skills)

#### 4. Wilderness Survival
- **ID**: `wilderness`
- **Primary Stat**: Constitution
- **Secondary Stat**: Intelligence
- **Description**: Survive in harsh environments and track creatures
- **Rollable Table**: Wilderness events

#### 5. Investigation
- **ID**: `investigation`
- **Primary Stat**: Intelligence
- **Secondary Stat**: Spirit
- **Description**: Uncover clues, solve mysteries, and find hidden secrets
- **Rollable Table**: Investigation finds

#### 6. Athletics
- **ID**: `athletics`
- **Primary Stat**: Strength
- **Secondary Stat**: Constitution
- **Description**: Climb, swim, jump, and perform physical feats
- **Rollable Table**: Athletic feats

### Crafting & Creation (3 skills)

#### 7. Smithing
- **ID**: `smithing`
- **Primary Stat**: Strength
- **Secondary Stat**: Intelligence
- **Description**: Forge weapons, armor, and metal items
- **Rollable Table**: Smithing results

#### 8. Alchemy
- **ID**: `alchemy`
- **Primary Stat**: Intelligence
- **Secondary Stat**: Spirit
- **Description**: Brew potions, create elixirs, and transmute materials
- **Rollable Table**: Alchemy outcomes

#### 9. Enchanting
- **ID**: `enchanting`
- **Primary Stat**: Intelligence
- **Secondary Stat**: Spirit
- **Description**: Imbue items with magical properties
- **Rollable Table**: Enchanting effects

### Social & Influence (3 skills)

#### 10. Persuasion
- **ID**: `persuasion`
- **Primary Stat**: Charisma
- **Secondary Stat**: Intelligence
- **Description**: Convince others through charm and reasoning
- **Rollable Table**: Persuasion outcomes

#### 11. Deception
- **ID**: `deception`
- **Primary Stat**: Charisma
- **Secondary Stat**: Intelligence
- **Description**: Mislead and manipulate through lies and misdirection
- **Rollable Table**: Deception results

#### 12. Leadership
- **ID**: `leadership`
- **Primary Stat**: Charisma
- **Secondary Stat**: Spirit
- **Description**: Inspire and command others in times of need
- **Rollable Table**: Leadership effects

### Arcane Studies (3 skills)

#### 13. Spellcraft
- **ID**: `spellcraft`
- **Primary Stat**: Intelligence
- **Secondary Stat**: Spirit
- **Description**: Understand and manipulate magical energies
- **Rollable Table**: Spellcraft results

#### 14. Arcane Knowledge
- **ID**: `arcaneKnowledge`
- **Primary Stat**: Intelligence
- **Secondary Stat**: Spirit
- **Description**: Study ancient lore and magical theory
- **Rollable Table**: Arcane discoveries

#### 15. Ritual Magic
- **ID**: `ritualMagic`
- **Primary Stat**: Spirit
- **Secondary Stat**: Intelligence
- **Description**: Perform complex magical rituals and ceremonies
- **Rollable Table**: Ritual outcomes

## Background Skill Mapping

Since backgrounds use D&D 5e skill names, they are automatically mapped to your custom skills:

| D&D Skill | Maps To | Custom Skill Name |
|-----------|---------|-------------------|
| Athletics | `athletics` | Athletics |
| Intimidation | `leadership` | Leadership |
| Stealth | `weaponMastery` | Weapon Mastery |
| Sleight of Hand | `deception` | Deception |
| Persuasion | `persuasion` | Persuasion |
| Deception | `deception` | Deception |
| Insight | `leadership` | Leadership |
| Perception | `investigation` | Investigation |
| Investigation | `investigation` | Investigation |
| Survival | `wilderness` | Wilderness Survival |
| Nature | `wilderness` | Wilderness Survival |
| Arcana | `arcaneKnowledge` | Arcane Knowledge |
| Religion | `spellcraft` | Spellcraft |
| History | `arcaneKnowledge` | Arcane Knowledge |
| Medicine | `alchemy` | Alchemy |
| Performance | `persuasion` | Persuasion |
| Animal Handling | `wilderness` | Wilderness Survival |
| Acrobatics | `athletics` | Athletics |

## Skill Progression System

### Ranks
Skills progress through 10 ranks by completing quests:

1. **Untrained** (0 quests) - Gray
2. **Novice** (2 quests) - Brown
3. **Apprentice** (5 quests) - Green
4. **Journeyman** (9 quests) - Teal
5. **Adept** (14 quests) - Blue
6. **Expert** (20 quests) - Dark Red
7. **Master** (27 quests) - Purple
8. **Grandmaster** (35 quests) - Light Purple
9. **Legendary** (44 quests) - Orange
10. **Mythic** (54 quests) - Pink

### Quest System
- Each skill has multiple quests to complete
- Quests unlock new abilities and better rollable tables
- Quests are tied to specific ranks
- Complete quests during gameplay to progress

### Rollable Tables
- Each skill has rollable tables for different outcomes
- Tables evolve as you rank up
- Roll a d20 to determine the outcome
- Outcomes range from failures to critical successes
- Higher ranks = better outcomes

## Character Creation Integration

### Step 7: Skills & Languages

When you reach Step 7 in character creation:

1. **Background Skills**: Automatically granted (shown with gift icon)
2. **Choose 2 Skills**: Select from all 14 custom skills
3. **Skills Preview**: See quests and rollable tables for selected skills

### Preview Features

For each selected skill, you'll see:

- **Skill Icon**: WoW-style icon image
- **Skill Name & Description**: What the skill does
- **Rank Badge**: Shows "Untrained" for new characters
- **Starting Quests**: First 3 quests you can complete
- **Rollable Table**: First 4 outcomes from the UNTRAINED table

### Example: Weapon Mastery Preview

```
┌─────────────────────────────────────────────────────────────┐
│ [ICON] Weapon Mastery                                        │
│        Master various weapons and combat techniques          │
│        [Untrained]                                           │
│                                                              │
│ ✓ Starting Quests                                           │
│ • First Blood - Land your first successful attack           │
│ • Weapon Maintenance - Clean and maintain a weapon          │
│ • Combat Stance - Learn proper fighting stance              │
│                                                              │
│ 🎲 Rollable Table: Basic Weapon Handling                    │
│ [1-8]   Weapon fumble, drop weapon or hit self              │
│ [9-14]  Clumsy swing, normal damage -2                      │
│ [15-18] Lucky hit, normal damage                            │
│ [19-20] Surprising strike, +1 damage                        │
└─────────────────────────────────────────────────────────────┘
```

## In-Game Usage

Once your character is created:

1. **View Skills**: Character Sheet → Skills Tab
2. **Complete Quests**: Toggle quests as you complete them
3. **Roll Tables**: Click "🎲 Roll" to roll on skill tables
4. **Track Progress**: See quest completion and rank progression
5. **Unlock Abilities**: Higher ranks unlock better outcomes

## Skill Selection Strategy

### For Combat Characters
- **Weapon Mastery**: Essential for fighters, barbarians
- **Tactical Combat**: Good for intelligent warriors
- **Defensive Techniques**: Tanks and defenders

### For Exploration Characters
- **Wilderness Survival**: Rangers, druids
- **Investigation**: Detectives, scholars
- **Athletics**: Physical explorers

### For Crafting Characters
- **Smithing**: Weapon and armor crafters
- **Alchemy**: Potion brewers
- **Enchanting**: Magic item creators

### For Social Characters
- **Persuasion**: Diplomats, bards
- **Deception**: Rogues, spies
- **Leadership**: Commanders, nobles

### For Magic Characters
- **Spellcraft**: Wizards, sorcerers
- **Arcane Knowledge**: Scholars, researchers
- **Ritual Magic**: Clerics, warlocks

## Tips

1. **Match Your Class**: Choose skills that complement your class abilities
2. **Consider Stats**: Skills use primary and secondary stats for modifiers
3. **Plan Progression**: Think about which quests you can complete early
4. **Diversify**: Don't pick two skills from the same category
5. **Background Synergy**: Your background already grants skills, so choose different ones

## Technical Details

- Skills are stored in `selectedSkills` array as skill IDs
- Background skills are automatically added (not in selectedSkills)
- Skill progress tracked in `skillProgress` object
- Quest completion toggles in-game
- Rollable tables accessed via ROLLABLE_TABLES constant

