/**
 * Inscriptor Class Data
 * 
 * Complete class information for the Inscriptor - a tactical battlefield controller
 * who uses runes and inscriptions to manipulate zones and enhance equipment.
 */

export const INSCRIPTOR_DATA = {
  id: 'inscriptor',
  name: 'Inscriptor',
  icon: 'fas fa-scroll',
  role: 'Control/Support',
  damageTypes: ['force', 'arcane'],

  // Overview section
  overview: {
    title: 'The Inscriptor',
    subtitle: 'Master of Runes and Inscriptions',

    characterCreation: {
      title: 'Creating an Inscriptor',
      subtitle: 'The Battlefield Architect',

      abilityPriorities: {
        primary: 'Intelligence',
        primaryDesc: 'Powers your rune effects, spell save DCs, and inscription potency — your most important stat by far.',
        secondary: 'Spirit',
        secondaryDesc: 'Supports your mana pool and improves the effectiveness of warding and restoration runes.',
        tertiary: 'Constitution',
        tertiaryDesc: 'Survivability. You are a ranged controller with light armor — every HP counts, especially since Destruction Runes also damage you.'
      },

      startingEquipment: {
        weapons: [
          { name: 'Runic Chisel', damage: '1d4 piercing', properties: 'Finesse, light. Can be used as a weapon or an inscription tool. Grants +2 Intelligence.' }
        ],
        armor: [
          { name: 'Runic Robes', ac: '1 + DEX mod', properties: 'Cloth armor. Grants +2 Intelligence, +1 Armor. Covered in faintly glowing runic patterns.' }
        ],
        accessories: [
          { name: 'Glyph Amulet', properties: 'Necklace. Grants +2 Intelligence. Amulet covered in active runes that pulse with arcane energy.' }
        ],
        gear: [
          'Rune Stone Set (tool — 6 inscribed stones used as physical rune markers on the battle map)',
          'Rune Pouch (contains runic chalk, arcane ink, and inscription materials)',
          'Traveler\'s clothes',
          'Pouch with 10 gold pieces',
          'Blank journal for recording runic diagrams and inscription formulas'
        ],
        note: 'You begin combat with 0 active runes and 0 Runic Resonance. Your first priority each fight is placing runes. If you have warning before combat, use pre-combat preparation time to place 2-3 runes and inscribe 1-2 items before the first blow lands.'
      },

      startingStats: {
        hp: '8 + Constitution modifier',
        hitDice: '1d8 per Inscriptor level',
        armorClass: '1 + DEX modifier (Runic Robes)',
        speed: '30 ft',
        savingThrows: ['Intelligence', 'Spirit'],
        skills: ['Choose 3 from: Arcana, History, Investigation, Nature, Perception, Religion']
      },

      startingAbilities: [
        { name: 'Rune Scribe', description: 'Place a rune on the battlefield (3-4 mana, 1 action). Generates +1 Runic Resonance. You can maintain up to 8 runes at once.' },
        { name: 'Equipment Inscription', description: 'Inscribe a piece of equipment (4 mana, 1 action). Grants a combat-duration buff. You have 3 inscription slots (weapon, armor, boots, cape, belt, pants).' },
        { name: 'Runic Resonance', description: 'Secondary resource (0-10). Builds as you place and detonate runes. Spend at thresholds for powerful effects.' }
      ],

      specializationChoice: {
        level: 3,
        description: 'At 3rd level, choose your specialization: Runebinder (zone dominance, 10 runes), Enchanter (ally empowerment, 5 inscriptions), or Glyphweaver (detonation combos, chain reactions). This choice determines your rune/inscription limits and grants a specialization passive.'
      },

      levelProgression: {
        title: 'Inscriptor Level Progression',
        headers: ['Level', 'Runes Max', 'Inscriptions Max', 'Feature Unlocked'],
        rows: [
          ['1', '8', '3', 'Rune Scribe, Equipment Inscription, Runic Resonance'],
          ['2', '8', '3', 'Minor Rune, Rune of Speed, Inkbound Servant'],
          ['3', '8/10/6', '3/5/4', 'Specialization Choice + Spec Passives'],
          ['4', '8/10/6', '3/5/4', 'Glyph of Binding, Runic Shield, Sigil of Power'],
          ['5', '8/10/6', '3/5/4', 'Rune of Devastation, Glyph Mastery, Inscription of Warding'],
          ['6', '8/10/6', '3/5/4', 'Runic Array, Greater Sigil of Power, Glyph Nexus'],
          ['7', '8/10/6', '3/5/4', 'Ancient Rune, Inscribed Fortress, Master Inscriber'],
          ['8', '8/10/6', '3/5/4', 'Primordial Glyph, Runic Apocalypse, Eternal Inscription'],
          ['9', '8/10/6', '3/5/4', 'Worldscript, Master of Runes, Inscription of Eternity'],
          ['10', '8/10/6', '3/5/4', 'Omniscript, Rune of Creation, Runic Ascension']
        ]
      }
    },

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Inscriptor inscribes runes onto the battlefield. The type of rune determines the effect. The number of runes determines the power.

**Core Mechanic**: Place runes → Build Runic Resonance → Form zones (3+ runes) → Detonate for burst effects

**Resource**: Mana (for rune placement and spells) + Runic Resonance (generated by placing/detonating runes, spent on inscriptions and empowered abilities)

**Playstyle**: Pre-combat preparation and zone control specialist

**Best For**: Players who enjoy planning ahead, spatial tactics, and rewarding preparation`,
    },

    description: `The Inscriptor is a tactical master, capable of harnessing runes and inscriptions to control the battlefield and empower their spells. Through Runic Wrapping and Inscription Placement, the Inscriptor creates zones of influence, enhances equipment, and strategically controls the pace of combat. This class rewards careful planning and foresight, turning the battlefield itself into a weapon.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Inscriptors are scholars of ancient magical languages, masters of the written word made manifest. They see magic not as raw energy to be hurled, but as precise formulae to be inscribed, calculated, and activated. Their power comes from preparation, study, and the meticulous placement of arcane symbols.

In roleplay, Inscriptors often carry journals filled with runic diagrams, spend time studying ancient texts, and approach problems with methodical precision. They may trace runes in the air while thinking, unconsciously inscribe symbols on surfaces they touch, or speak in archaic languages when concentrating.

Common Inscriptor archetypes include:
- **The Ancient Scholar**: Discovered lost runic languages in forgotten libraries
- **The Battlefield Tactician**: Military mage who learned to control terrain through inscriptions
- **The Enchanter Artisan**: Craftsperson who imbues items with magical properties
- **The Glyph Archaeologist**: Explorer who uncovered primordial symbols of power`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Inscriptor excels as a tactical controller and support specialist. They excel at:

**Zone Control**: Creating runic zones that amplify spells and control battlefield positioning
**Equipment Enhancement**: Inscribing weapons, armor, and gear to boost combat effectiveness
**Strategic Setup**: Preparing the battlefield before combat begins with pre-placed runes
**Versatile Support**: Adapting inscriptions to provide offense, defense, or utility as needed

The Inscriptor's strength lies in preparation and positioning. A well-prepared Inscriptor can turn any location into a fortress of magical power, but they require time to set up their zones and inscriptions. They work best when they can anticipate combat and prepare accordingly.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing an Inscriptor is about inscribing runes on the battlefield and watching the effects compound. Key strategic considerations:

**Rune Placement**:
- Each rune type creates a different effect (fire, vitality, warding, earth, speed, shielding)
- 3+ connected runes form a Runic Zone — effects scale with rune count
- Each rune placed generates +1 Runic Resonance
- Maximum 8 runes (varies by specialization)

**Runic Resonance**:
- Secondary resource (0-10) that builds as you place and detonate runes
- Spend 3 Resonance: Your next inscription costs no mana
- Spend 5 Resonance: Your next spell cast within a zone deals +2d6 bonus damage
- Spend 7 Resonance: Your next detonation affects all enemies in the zone (not just adjacent)
- At 10 Resonance (passive): All runes refresh duration and trigger. Resonance then resets to 0.
- Decays by 1 per round when no runes are active

**Detonation**:
- Remove a rune to trigger its burst effect + lingering aura
- Generates +1 Resonance per rune detonated
- Lingering effects last 1 minute (3 minutes for Glyphweaver)
- Trade sustained zone power for burst damage

**Equipment Inscriptions**:
- At combat start, inscribe up to 3 items (base; varies by specialization)
- Each inscription costs 4 mana, or spend 3 Resonance to apply one for free
- Cannot stack inscriptions on the same item
- Available slots: Weapon, Armor, Boots, Cape, Belt, Pants

**Specialization Focus**:
- **Runebinder**: 10 runes / 3 inscriptions — zone dominance, move runes mid-combat
- **Enchanter**: 6 runes / 5 inscriptions — ally empowerment, enhanced inscriptions
- **Glyphweaver**: 8 runes / 4 inscriptions — detonation combos, overcharged runes

**Team Dynamics**:
- Works best with advance warning of combat
- Synergizes with tanks who hold enemies in runic zones
- Inscriptions provide versatile support to any party composition
- Resonance thresholds create natural power spikes to coordinate around`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Prepared Battlefield',
      content: `**The Setup**: You're an Inscriptor (Runebinder specialization) and your party is about to ambush a group of cultists in a ritual chamber. You have 5 minutes to prepare before combat. Starting Mana: 50/60. Your goal: Place runic zones strategically, inscribe equipment for your party, then control the battlefield during combat.

**Pre-Combat Preparation (5 minutes before combat)**

*You enter the ritual chamber. The cultists haven't noticed you yet. Your party's rogue signals: "Five minutes until they finish their ritual. Make it count."*

**Your Action**: Begin placing Rune of Destruction (costs 4 mana per rune, 1 action per rune)

*You kneel, pulling out a piece of chalk infused with arcane energy. You begin drawing runes on the floor in a triangular pattern.*

**Rune 1 - "Rune of Destruction"** (placed at north point of triangle)
**Cost**: 4 mana | **Effect**: +1d6 fire damage dealt/taken within 5 ft
**Resonance**: 0 + 1 = 1/10
**Mana**: 50 - 4 = 46/60

**Rune 2 - "Rune of Destruction"** (placed at south-west point)
**Cost**: 4 mana
**Resonance**: 1 + 1 = 2/10
**Mana**: 46 - 4 = 42/60

**Rune 3 - "Rune of Destruction"** (placed at south-east point)
**Cost**: 4 mana
**Resonance**: 2 + 1 = 3/10
**Mana**: 42 - 4 = 38/60

*Three runes glow on the floor, forming a triangle 30 feet across. The runes connect with glowing lines, creating a ZONE. Fire damage is now DOUBLED within the zone for all creatures.*

**Zone Created**: "Destruction Zone" (30 ft triangle)
**Effect**: All fire damage dealt and taken within the zone is doubled (3+ runes)

**Your Action**: Add more runes to strengthen the zone

**Rune 4 - "Rune of Destruction"** (placed between runes 1 and 2)
**Cost**: 4 mana | **Mana**: 38 - 4 = 34/60
**Resonance**: 3 + 1 = 4/10

**Rune 5 - "Rune of Destruction"** (placed between runes 2 and 3)
**Cost**: 4 mana | **Mana**: 34 - 4 = 30/60
**Resonance**: 4 + 1 = 5/10

*Five runes now. The zone PULSES with volatile energy. You have enough Resonance to empower your next spell.*

**Your Action**: Inscribe equipment for your party (costs 4 mana per inscription)

*You turn to your party's mage. "Give me your staff." You trace glowing runes along the shaft.*

**Inscription 1 - Mage's Staff**: "Flame Inscription" (+1d6 fire damage per strike)
**Cost**: 4 mana | **Mana**: 30 - 4 = 26/60

*You turn to your party's tank. "Your armor." You inscribe protective runes on the breastplate.*

**Inscription 2 - Tank's Armor**: "Thorn Inscription" (attackers take 1d6 piercing on hit)
**Cost**: 4 mana | **Mana**: 26 - 4 = 22/60

*You inscribe your own boots with runes of swiftness.*

**Inscription 3 - Your Boots**: "Rune of Speed" (+10 ft movement speed)
**Cost**: 4 mana | **Mana**: 22 - 4 = 18/60

**Preparation Complete**: 5 runes placed (Destruction Zone active), 3 inscriptions applied
**Mana Remaining**: 18/60 | **Resonance**: 5/10

**Combat Begins**

*The cultists finish their ritual. A demon appears. Your party attacks!*

**Enemies**: 4 cultists + 1 demon (all standing OUTSIDE your runic zone)

**Turn 1 - Luring Enemies into the Zone**

*The cultists and demon are outside your zone. You need to get them inside. Your tank charges forward, taunting them.*

**Your Party's Tank**: Taunts demon and 2 cultists, pulls them toward the runic zone
**Cultists**: Move toward tank, entering the runic zone!

*Perfect. Three enemies are now inside your Destruction Zone.*

**Your Action**: Spend 5 Resonance to empower your next spell in the zone, then cast "Arcane Missiles" at Demon (inside zone)
**Resonance**: 5 - 5 = 0/10 (spent on empowerment)
**Arcane Missiles**: 8 mana | **Mana**: 18 - 8 = 10/60
**Base Damage**: 3d4+3 → [3, 4, 2] + 3 = 12 damage
**Zone Bonus**: +2d6 (empowered spell in zone) → [5, 6] = +11 damage
**Total Damage**: 12 + 11 = **23 damage!**

*Your arcane missiles strike the demon, empowered by your runic zone.*

**Current State**: 3 enemies in zone, 2 enemies outside zone

**Turn 2 - Zone Control**

*Two cultists are still outside the zone. Your party's mage (with inscribed staff) casts a spell.*

**Your Party's Mage**: Casts "Fire Bolt" at demon (inside zone, has Flame Inscription on staff)
**Base Damage**: 2d10 → [7, 4] = 11 fire damage
**Inscription Bonus**: +1d6 (Flame Inscription) → [5] = +5 fire damage
**Zone Multiplier**: Fire damage DOUBLED in Destruction Zone → (11 + 5) × 2 = **32 fire damage!**

*The fire bolt EXPLODES inside the runic zone, doubled by the Destruction Zone. The demon howls.*

**Your Action**: Detonate Rune #3 to create burst effect
**Resonance**: 0 + 1 = 1/10 (gain Resonance from detonation)
**Detonation Effect**: Rune #3 erased. Demon must make DC 15 CON save or be Stunned for 1 round.
**Demon's Save**: Constitution save DC 15 → [12] → FAIL! **Demon is Stunned for 1 round.**

*The demon staggers, frozen by the runic detonation.*

**Current State**: Demon stunned, 2 cultists outside zone

**Turn 3 - Finishing the Fight**

*The demon is inside the zone, stunned. The two remaining cultists are outside.*

**Your Party's Rogue**: Sneak attacks Stunned Demon → Critical hit → DEAD
**Your Party's Tank** (with Thorn Inscription): Attacks Cultist #4 → Hit! → Cultist #4 counterattacks but takes 1d6 piercing from Thorn Inscription
**Your Party's Mage**: Casts "Fire Bolt" at Cultist #3 (outside zone) → 11 fire damage → Cultist #3 DEAD

**Your Action**: Place Rune of Speed near Cultist #4 (4 mana)
**Mana**: 10 - 4 = 6/60 | **Resonance**: 1 + 1 = 2/10
*The rune slows Cultist #4 if they try to flee.*

**Your Party's Tank**: Finishes off Cultist #4

**Combat Over**

*You stand in the center of your runic zone, four glowing runes still pulsing on the floor. Your party stares at the carnage.*

**Your Party's Mage**: "My fire bolt did THIRTY-TWO damage. That's insane."
**You**: "Flame Inscription added fire damage, and the Destruction Zone DOUBLED all fire damage inside it. Preparation is everything."
**Your Party's Tank**: "And the thorns on my armor? That cultist hurt itself hitting me."
**You**: "Thorn Inscription. 1d6 piercing damage reflected back on every melee hit. Plus the demon was stunned after I detonated Rune #3."
**Your Party's Rogue**: "You turned this room into a death trap."
**You**: "Five minutes of setup, and we won in three turns. That's the Runebinder's way."

**Final State**: Mana: 6/60 | 4 runes still active | 3 inscriptions still active | Resonance: 2/10

**The Lesson**: Inscriptor gameplay is about:
1. **Pre-Combat Preparation**: Placed 5 runes (20 mana) and inscribed 3 items (12 mana) = 32 mana before combat started
2. **Runic Zones**: 5-rune Destruction Zone doubled all fire damage dealt and taken
3. **Resonance Spending**: Spent 5 Resonance to empower Arcane Missiles with +2d6 bonus damage
4. **Inscription Synergy**: Mage's Flame Inscription (+1d6) + Destruction Zone (×2) = massive fire damage multiplier
5. **Zone Control**: Lured enemies into the zone, then detonated a rune for the stun
6. **Damage Amplification**: Mage's Fire Bolt: 16 base fire → doubled to 32 in Destruction Zone
7. **Equipment Enhancement**: Tank's Thorn Inscription punished melee attackers, Rogue exploited the stun for a critical hit

You're not a direct damage dealer. You're a BATTLEFIELD ARCHITECT. You spend time before combat placing runes, inscribing equipment, and preparing the terrain. Then, when combat starts, your party fights on YOUR terms. Fire spells cast in your Destruction Zone are devastating. Equipment you've inscribed provides crucial bonuses. Enemies who enter your runic zones are fighting in a prepared kill zone. The key is PREPARATION — given 5 minutes, you can turn any room into a fortress of magical power.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Runic Resonance & Rune Inscription',
    subtitle: 'Build Resonance Through Placement',

    description: `Inscriptors are battlefield architects who transform raw mana into precise runic geometry. By anchoring runes to terrain and gear, they create compounding zones of influence and empowered artifacts. The key is preparation: building Resonance to fuel high-tier inscriptions and knowing exactly when to detonate a zone for maximum impact.`,

    cards: [
      {
        title: 'Runic Resonance (0–10)',
        stats: 'Builds via Rune Actions',
        details: 'Built by placing or detonating runes. Unlocks free inscriptions and empowered spell damage at specific thresholds.'
      },
      {
        title: 'Runic Zones (3+ Runes)',
        stats: 'Compounding Area Effects',
        details: 'Three or more connected runes form a zone. Effects scale with the number of runes placed, rewarding dense placement.'
      },
      {
        title: 'Equipment Inscriptions',
        stats: 'Persistent Gear Buffs',
        details: 'Enhance your party’s weapons, armor, and accessories. Limited slots (3 base) but powerful, long-term utility.'
      }
    ],

    generationTable: {
      headers: ['Trigger', 'Resonance Change', 'Notes'],
      rows: [
        ['Place a Rune', '+1 Resonance', 'Generates 5-ft radius individual effect'],
        ['Detonate a Rune', '+1 per Rune (+2 for Glyphweaver)', 'Triggers burst effect + lingering aura'],
        ['Spend 3 Resonance', '-3 Resonance', 'Your next inscription costs no mana'],
        ['Spend 5 Resonance', '-5 Resonance', 'Your next spell in a zone deals +2d6 bonus damage'],
        ['Spend 7 Resonance', '-7 Resonance', 'Your next detonation affects all enemies in the zone'],
        ['Resonance reaches 10', 'Resonance resets to 0', 'All active runes refresh duration and trigger effects. Does not generate additional Resonance from the refresh.'],
        ['No Active Runes', '-1 per Round', 'Momentum bleeds away during passivity'],
      ]
    },

    usage: {
      momentum: 'Spend Resonance at thresholds (3/5/7) to bypass mana costs for Inscriptions, empower spells within zones (+2d6), or widen detonation effects. At 10 Resonance, all runes passively refresh and Resonance resets to 0.',
      flourish: 'Resonance Decay: If you fail to maintain at least one active rune, your Resonance will bleed away each round. Keep the weave alive.'
    },
    
    runicWrappingTable: {
      title: 'Runic Wrapping: Rune Effects',
      headers: ['Rune Name', 'Individual Effect (5 ft)', 'Zone Effect (3+ runes)', 'Detonation (DC 15)', 'Mana Cost'],
      rows: [
        ['Rune of Destruction', '+1d6 fire damage dealt/taken', 'Double fire damage dealt/taken', 'Stunned for 1 round (CON save)', '4 mana'],
        ['Rune of Vitality', 'Heal 1d6 HP per turn', 'Heal 2d6 HP per turn', 'Exhausted, -1d6 max HP for 1 min (CON save)', '3 mana'],
        ['Rune of Arcane Warding', 'Magic damage reduced by 1', 'Magic damage reduced by 50%', 'Magic Vulnerability, +50% magic damage for 1 min', '4 mana'],
        ['Rune of Shielding', '+1 Armor', '+3 Armor', 'Armor Breakdown, -3 Armor for 1 min', '3 mana'],
        ['Rune of Speed', '+10 ft movement', '+20 ft movement', 'Restrained for 1 min (AGI save)', '3 mana'],
        ['Rune of Earth', '5 ft pillar (30 HP)', 'Wall up to 10 ft long, 15 ft high', 'Wall splinters, 2d8 piercing in 15 ft (AGI save)', '4 mana']
      ]
    },
    
    inscriptionPlacementTable: {
      title: 'Inscription Placement: Equipment Slots',
      headers: ['Equipment Slot', 'Example Inscriptions', 'Tactical Use', 'Mana Range'],
      rows: [
        ['Weapon', 'Flame, Frost, Force, Lightning, Wind, Earth', 'Offensive enhancement, elemental damage', '4-5 mana'],
        ['Armor', 'Thorn, Warding, Restoration, Bulwark, Elemental Ward, Stone Skin', 'Defensive buffs, damage mitigation', '3-5 mana'],
        ['Boots', 'Haste, Flight, Water Walking, Feather Fall', 'Mobility enhancement, terrain navigation', '3-5 mana'],
        ['Cape', 'Shadow, Protection, Blink, Camouflage', 'Utility, stealth, teleportation', '3-5 mana'],
        ['Belt', 'Strength, Vitality, Endurance, Regeneration', 'Physical enhancement, survivability', '3-5 mana'],
        ['Pants', 'Agility, Resilience, Sprint, Steadfast', 'Agility, damage resistance, mobility', '3-5 mana']
      ]
    },
    
    strategicConsiderations: {
      title: 'Combat Phases & Decision-Making',
      content: `**Preparation (Pre-Combat)**: Place runes in advance to build Resonance early. Inscribe key ally gear (Weapon for DPS, Armor for Tank) before the first blow lands.

**Zone Control (Early Combat)**: Focus on reaching the 3-rune threshold to activate Zone Synergy. Position zones where enemies *will be*, not where they are.

**Resonance Peak (Mid-Combat)**: At 5 Resonance, spend it to empower your most expensive AoE spell with +2d6 damage bonus.

**Detonation (Closing/Burst)**: When a target is low or a chokepoint is overwhelmed, detonate your runes. You lose the zone, but the burst damage and lingering status effects can end the fight.

**Advanced Play — The Resonance Loop**: Build toward 10 Resonance to trigger the passive refresh — all runes reset their durations simultaneously, extending your control without spending additional actions or mana. Your Resonance resets to 0 when this triggers.

**Worked Example (7 Resonance, Boss at 50% HP)**:
- **Option A** — Spend 5 Res: Empowered Spell (+2d6 damage). Best for immediate threat removal. Resonance drops to 2.
- **Option B** — Detonate All (gain Res per rune): Triggers burst and CC. Best if boss is surrounded by minions.
- **Option C** — Hold for 10 Res: Refresh and Pulse. Best if the fight will last another 3+ rounds. Resonance resets to 0.

→ **Best default**: Option A. Cashing in Resonance for direct damage is usually the most efficient use of the resource.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Tactile Runic Tracking',
      content: `Marking the battlefield with physical rune tokens makes the Inscriptor's zone control feel immediate and threatening.

**Required Materials**:
- **Rune Tokens** — 8-10 distinct markers (poker chips, coins, or glass beads)
- **Runic Cards** — Quick reference for rune types and inscription effects
- **Resonance Tracker** — A 0–10 slider or a d10

**Tracking the Weave**:
- **Placement** → Place a token on the battle map. Add +1 to your Resonance die.
- **Zone Check** → If 3+ tokens are connected, announce "Zone Active" to all players.
- **Detonation** → Remove token(s) from the map. Add +1 Resonance per token removed (+2 for Glyphweaver).
- **Inscription** → Place a small card or sticky note on the affected player's sheet.

**Quick Reference**:
\`\`\`
RESONANCE (0-10):
  Spend 3  | Next inscription costs no mana
  Spend 5  | Next spell in a zone deals +2d6 bonus damage
  Spend 7  | Next detonation affects all enemies in the zone
  At 10    | All runes refresh (Resonance resets to 0)

RUNE LIMITS BY SPECIALIZATION:
  Base:      8 Runes  | 3 Inscriptions
  Runebinder: 10 Runes | 3 Inscriptions
  Enchanter:  6 Runes  | 5 Inscriptions
  Glyphweaver: 8 Runes | 4 Inscriptions
\`\`\`

**The Physical Hack**:
- **String Connectivity**: Use colored yarn to physically connect your rune tokens on the table. It clearly defines the "Zone" for the GM and other players.
- **Dice Stacking**: Place your Resonance d10 on top of your character sheet. When it hits 10, knock it over to signify the "Pulse" — then reset to 0.

**Runebinder Tips**:
- Track up to 10 runes (the most of any spec)
- 3 inscription slots (standard)
- Focus on zone coverage and mid-combat rune repositioning

**Enchanter Tips**:
- Track 6 runes and 5 inscriptions
- Inscriptions last until your next long rest
- Focus on buffing allies before and during combat

**Glyphweaver Tips**:
- Track 8 runes and 4 inscriptions
- Each detonation generates +2 Resonance (instead of +1)
- Focus on trap placement and chain reaction detonations

**Why Inscriptor Is Perfect for In-Person Play**: The class is built around physical placement and spatial awareness. Placing rune markers on the battle map creates a visual representation of your battlefield control. The Zone Synergy mechanic (3+ runes) rewards strategic placement and creates satisfying "aha!" moments when you realize the perfect rune configuration. The inscription system provides long-term character customization that persists across combats. The detonation mechanic creates explosive burst damage moments that feel impactful. The dual resource system (runes + inscriptions) creates multiple decision points and playstyles. Every rune placement is a tactical decision, and every detonation is a dramatic moment.`
    }
  },

  // Specializations
  specializations: {
    title: 'Inscriptor Specializations',
    subtitle: 'Three Paths of Runic Mastery',
    
    description: `Every Inscriptor chooses one of three specializations that define their approach to runic magic. Each specialization focuses on a distinct aspect of the Inscriptor's toolkit, creating dramatically different playstyles.`,

    specs: [
      {
        id: 'runebinder',
        name: 'Runebinder',
        icon: 'Arcane/Orb Manipulation',
        color: '#4169E1',
        theme: 'Zone Dominance & Rune Mastery',

        description: `Runebinders are masters of runic zone manipulation. They push the rune system to its absolute limit—placing more runes, creating larger zones, and reshaping zones mid-combat. Their inscriptions remain functional but are not their focus. A Runebinder turns the entire battlefield into their weapon.`,

        playstyle: 'Zone control, battlefield domination, area denial, mid-combat repositioning',

        strengths: [
          'Can place up to 10 runes (instead of 8)',
          'Zone radius is 50% larger (7.5 ft instead of 5 ft per rune)',
          'Can move one rune 30 ft as a bonus action (no action point)',
          'Can overlap zones for combined effects',
          'Runes cost 1 mana less than normal (minimum 1 mana)'
        ],

        tradeoffs: [
          'Only 3 inscription slots (same as base; fewer than Enchanter\'s 5)',
          'Inscriptions provide standard effects (no enhancement)',
          'Requires more setup time to reach full power',
          'Most effective when enemies are funneled into zones'
        ],

        passiveAbilities: [
          {
            name: 'Runic Resonance',
            tier: 'Path Passive',
            description: 'Each rune you place or detonate generates +1 Runic Resonance (max 10). At thresholds (3/5/7/10), Resonance empowers your abilities. Resonance decays by 1 per round when no runes are active.',
            sharedBy: 'All Inscriptors'
          },
          {
            name: 'Zone Mastery',
            tier: 'Specialization Passive',
            description: 'You can place up to 10 runes. Your runic zones have 50% larger radius. As a bonus action, you can relocate one rune up to 30 ft. Rune placement costs 1 mana less than normal (minimum 1 mana). You have 3 inscription slots with standard effects.',
            uniqueTo: 'Runebinder'
          }
        ],

        recommendedFor: 'Players who want to control the battlefield through zone manipulation, repositioning, and area denial'
      },

      {
        id: 'enchanter',
        name: 'Enchanter',
        icon: 'Arcane/Empowering Growth',
        color: '#6495ED',
        theme: 'Inscription Mastery & Ally Empowerment',

        description: `Enchanters split their focus evenly between runes and inscriptions, becoming the ultimate support Inscriptor. Their runes form functional zones, but their true strength lies in empowering allies through enhanced equipment inscriptions. An Enchanter turns a party of adventurers into a force of enhanced warriors.`,

        playstyle: 'Ally buffing, equipment enhancement, balanced zone/inscription play, party empowerment',

        strengths: [
          '5 inscription slots (can inscribe all equipment)',
          'Inscription die size increased by one step (d4→d6, d6→d8, d8→d10, d10→d12)',
          'Can inscribe 1 item per ally at combat start',
          'Inscriptions last until long rest (not just combat)',
          'Can swap 1 inscription per short rest without cost'
        ],

        tradeoffs: [
          'Maximum 6 runes (instead of 8)',
          'Zones use standard 5 ft radius',
          'No bonus to detonation damage',
          'Runes cost standard 2 mana'
        ],

        passiveAbilities: [
          {
            name: 'Runic Resonance',
            tier: 'Path Passive',
            description: 'Each rune you place or detonate generates +1 Runic Resonance (max 10). At thresholds (3/5/7/10), Resonance empowers your abilities. Resonance decays by 1 per round when no runes are active.',
            sharedBy: 'All Inscriptors'
          },
          {
            name: 'Master Enchanter',
            tier: 'Specialization Passive',
            description: 'You have 5 inscription slots. Inscription die sizes are increased by one step (e.g., +1d6 becomes +1d8, +1d8 becomes +1d10, +1d10 becomes +1d12; d12 cannot be increased further). Flat bonuses are increased by 50% (round up, e.g., +2 Armor becomes +3 Armor). You can inscribe 1 item per ally at combat start. Inscriptions last until your next long rest. You can place up to 6 runes with standard radius and cost.',
            uniqueTo: 'Enchanter'
          }
        ],

        recommendedFor: 'Players who want to enhance their party through powerful equipment inscriptions while maintaining functional zone control'
      },

      {
        id: 'glyphweaver',
        name: 'Glyphweaver',
        icon: 'Utility/Explosive Detonation',
        color: '#DC143C',
        theme: 'Detonation Combos & Volatile Runes',

        description: `Glyphweavers specialize in the explosive side of runic magic. Every rune they place can be detonated for devastating burst effects, and their runes can chain-react off each other. They maintain full zone capability but gain the ability to overcharge runes for detonation. A Glyphweaver sets the stage, then brings it crashing down.`,

        playstyle: 'Detonation combos, burst damage, chain reactions, trap-setting, calculated destruction',

        strengths: [
          'Detonations deal +2d8 bonus force damage',
          'Can detonate all runes simultaneously (chain reaction) for 1 action',
          'Detonation lingering effects last 3 minutes (instead of 1)',
          'Can overcharge a rune: it lasts only 2 rounds but its zone effect is doubled',
          'Each detonation generates +2 Resonance instead of +1'
        ],

        tradeoffs: [
          'Standard 8 rune maximum',
          'Standard 5 ft zone radius',
          '4 inscription slots (slightly reduced)',
          'Overcharged runes cannot be moved or sustained beyond 2 rounds',
          'Chain detonations leave no lingering zones behind'
        ],

        passiveAbilities: [
          {
            name: 'Runic Resonance',
            tier: 'Path Passive',
            description: 'Each rune you place generates +1 Runic Resonance (max 10). Each detonation generates +2 Resonance. At thresholds (3/5/7/10), Resonance empowers your abilities. Resonance decays by 1 per round when no runes are active.',
            sharedBy: 'All Inscriptors'
          },
          {
            name: 'Volatile Mastery',
            tier: 'Specialization Passive',
            description: 'Detonations deal +2d8 bonus force damage. You can detonate all runes simultaneously for 1 action (chain reaction). Detonation lingering effects last 3 minutes. You can overcharge a rune (2-round duration, doubled zone effect). Each detonation generates +2 Resonance. You have 4 inscription slots. Standard rune count (8) and zone radius.',
            uniqueTo: 'Glyphweaver'
          }
        ],

        recommendedFor: 'Players who enjoy explosive burst damage, detonation combos, and calculated destruction through trap-setting'
      }
    ]
  },

  // Comprehensive Spell List (Levels 1-10, following template)
  spells: [
    // ===== LEVEL 1 SPELLS =====
    {
      id: 'inscriptor_arcane_inscription',
      name: 'Arcane Inscription',
      description: 'Inscribe a rune of power on a target to enhance their abilities for 3 rounds.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'Utility/Rest',
        tags: ['buff', 'support', 'inscription', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'arcane_inscription',
          name: 'Arcane Inscription',
          description: 'Gain +1d4 to spell damage rolls for 3 rounds',
          statModifier: {
            stat: 'spell_damage',
            magnitude: 1,
            magnitudeType: 'd4'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: ['ally', 'self'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'DICE',
      tags: ['buff', 'support', 'inscription', 'inscriptor']
    },

    {
      id: 'inscriptor_minor_rune',
      name: 'Minor Rune',
      description: 'Place a basic rune on the battlefield. Enemies entering within 5 ft take 1d4 force damage. Lasts 1 minute.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'arcane',
        icon: 'Arcane/Orb Manipulation',
        tags: ['damage', 'rune', 'zone', 'force', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '1d4',
        elementType: 'force',
        damageType: 'direct'
      },
      specialMechanics: {
        runicZone: {
          enabled: true,
          runeType: 'Minor',
          individualEffect: 'Enemies within 5 ft take 1d4 force damage when entering',
          zoneEffect: 'At 3+ minor runes, zone deals 1d4 force damage at the start of each enemy turn',
          detonation: {
            enabled: true,
            saveDC: 12,
            saveType: 'agility',
            effect: 'Minor push — enemies within 5 ft are pushed 5 ft away',
            damageFormula: '0',
            damageType: 'none'
          }
        }
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'circle',
        aoeParameters: { radius: 5 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'AUTOMATIC',
      tags: ['damage', 'rune', 'zone', 'force', 'inscriptor']
    },

    {
      id: 'inscriptor_rune_of_shielding',
      name: 'Rune of Shielding',
      description: 'Place a protective rune on the battlefield. Allies within 5 ft gain +1 Armor. At 3+ runes, allies gain +3 Armor.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'abjuration',
        icon: 'Force/Force Field',
        tags: ['buff', 'rune', 'zone', 'defensive', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'shielding_rune',
          name: 'Shielding Rune',
          description: 'Gain +1 Armor while within the rune radius for 1 minute',
          statModifier: {
            stat: 'armor',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 10,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      specialMechanics: {
        runicZone: {
          enabled: true,
          runeType: 'Shielding',
          individualEffect: 'Allies within 5 ft gain +1 Armor',
          zoneEffect: 'At 3+ runes, all allies in zone gain +3 Armor',
          detonation: {
            enabled: true,
            saveDC: 13,
            saveType: 'constitution',
            effect: 'Armor Breakdown — affected enemies lose -3 Armor for 1 minute',
            damageFormula: '0',
            damageType: 'none'
          }
        }
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'circle',
        aoeParameters: { radius: 5 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'AUTOMATIC',
      tags: ['buff', 'rune', 'zone', 'defensive', 'inscriptor']
    },

    // ===== LEVEL 2 SPELLS =====
    {
      id: 'inscriptor_rune_of_speed',
      name: 'Rune of Speed',
      description: 'Place a rune that enhances movement. Allies within 5 ft gain +10 ft movement speed. At 3+ runes, allies gain +20 ft movement speed.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'abjuration',
        icon: 'Nature/Rip',
        tags: ['buff', 'rune', 'zone', 'mobility', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'speed_rune',
          name: 'Speed Rune',
          description: 'Gain +10 ft movement speed while within the rune radius for 1 minute',
          statModifier: {
            stat: 'movement_speed',
            magnitude: 10,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 10,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      specialMechanics: {
        runicZone: {
          enabled: true,
          runeType: 'Speed',
          individualEffect: 'Allies within 5 ft gain +10 ft movement speed',
          zoneEffect: 'At 3+ runes, all allies in zone gain +20 ft movement speed',
          detonation: {
            enabled: true,
            saveDC: 14,
            saveType: 'agility',
            effect: 'Restrained for 1 minute (AGI save)',
            damageFormula: '0',
            damageType: 'none'
          }
        }
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'circle',
        aoeParameters: { radius: 5 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'AUTOMATIC',
      tags: ['buff', 'rune', 'zone', 'mobility', 'inscriptor']
    },

    {
      id: 'inscriptor_rune_of_warding',
      name: 'Rune of Warding',
      description: 'Place a protective rune that shields allies within its radius from magical damage.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'abjuration',
        icon: 'Force/Force Field',
        tags: ['buff', 'rune', 'zone', 'defensive', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'warding_rune',
          name: 'Rune Ward',
          description: 'Reduce magic damage taken by 2 while within the rune radius for 1 minute',
          statModifier: {
            stat: 'magic_resistance',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 10,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'circle',
        aoeParameters: { radius: 5 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'AUTOMATIC',
      tags: ['buff', 'rune', 'zone', 'defensive', 'inscriptor']
    },

    {
      id: 'inscriptor_flame_inscription',
      name: 'Flame Inscription',
      description: 'Inscribe a weapon with fire runes. The weapon deals +1d6 fire damage for the duration of combat.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'transmutation',
        icon: 'Fire/Flame Fist',
        tags: ['buff', 'inscription', 'weapon', 'fire', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'flame_inscription',
          name: 'Flame Inscribed',
          description: 'Weapon deals +1d6 fire damage on each strike for combat duration',
          statModifier: {
            stat: 'weapon_damage',
            magnitude: 1,
            magnitudeType: 'd6',
            damageType: 'fire'
          }
        }],
        durationValue: 0,
        durationType: 'combat',
        durationUnit: 'combat',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: ['ally', 'self'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'AUTOMATIC',
      tags: ['buff', 'inscription', 'weapon', 'fire', 'inscriptor']
    },

    {
      id: 'inscriptor_rune_of_slowing',
      name: 'Rune of Slowing',
      description: 'Place a rune that saps the speed of enemies within its radius.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['control'],
      typeConfig: {
        school: 'abjuration',
        icon: 'Nature/Roots',
        tags: ['control', 'rune', 'zone', 'slow', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      controlConfig: {
        controlType: 'slow',
        strength: 'moderate',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 13,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'slowed',
          name: 'Slowed by Rune',
          description: 'Movement speed reduced by 15 ft for 3 rounds',
          config: {
            restraintType: 'magical',
            saveType: 'constitution',
            saveDC: 13,
            duration: 3,
            durationUnit: 'rounds',
            movementPenalty: -15
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'circle',
        aoeParameters: { radius: 5 },
        targetRestrictions: ['enemy'],
        maxTargets: 3,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'SAVE',
      tags: ['control', 'rune', 'zone', 'slow', 'inscriptor']
    },

    // ===== LEVEL 3 SPELLS =====
    {
      id: 'inscriptor_rune_of_destruction',
      name: 'Rune of Destruction',
      description: 'Place a volatile rune of destruction. Creatures within 5 ft take +1d6 fire damage per turn. At 3+ runes, the entire zone doubles fire damage dealt and taken.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['damage', 'zone'],
      typeConfig: {
        school: 'evocation',
        icon: 'Fire/Fiery Symbol',
        tags: ['damage', 'rune', 'zone', 'fire', 'offensive', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '1d6',
        elementType: 'fire',
        damageType: 'dot',
        hasDotEffect: true,
        dotConfig: {
          duration: 10,
          tickFrequency: 'round',
          dotFormula: '1d6',
          isProgressiveDot: false
        }
      },
      specialMechanics: {
        runicZone: {
          enabled: true,
          runeType: 'Destruction',
          individualEffect: '+1d6 fire damage per turn within 5 ft',
          zoneEffect: 'Double fire damage dealt/taken in entire zone (3+ runes)',
          detonation: {
            enabled: true,
            saveDC: 15,
            saveType: 'constitution',
            effect: 'Stunned for 1 round',
            damageFormula: '2d6',
            damageType: 'fire'
          }
        }
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 5 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'AUTOMATIC',
      tags: ['damage', 'rune', 'zone', 'fire', 'offensive', 'inscriptor']
    },

    {
      id: 'inscriptor_rune_of_vitality',
      name: 'Rune of Vitality',
      description: 'Place a restorative rune. Creatures within 5 ft heal 1d6 HP per turn. At 3+ runes, the entire zone heals 2d6 HP per turn.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['healing', 'zone'],
      typeConfig: {
        school: 'abjuration',
        icon: 'Healing/Golden Heart',
        tags: ['healing', 'rune', 'zone', 'support', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      healingConfig: {
        healingType: 'hot',
        hasHotEffect: true,
        hotFormula: '1d6',
        hotDuration: 10,
        hotTickType: 'round',
        isProgressiveHot: false
      },
      specialMechanics: {
        runicZone: {
          enabled: true,
          runeType: 'Vitality',
          individualEffect: 'Heal 1d6 HP per turn within 5 ft',
          zoneEffect: 'Heal 2d6 HP per turn in entire zone (3+ runes)',
          detonation: {
            enabled: true,
            saveDC: 15,
            saveType: 'constitution',
            effect: 'Exhausted for 1 round, -1d6 max HP per remaining rune for 1 minute',
            damageFormula: '0',
            damageType: 'none'
          }
        }
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 5 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'AUTOMATIC',
      tags: ['healing', 'rune', 'zone', 'support', 'inscriptor']
    },

    {
      id: 'inscriptor_thorn_inscription',
      name: 'Thorn Inscription',
      description: 'Inscribe armor with reactive thorns. Attackers take 1d6 piercing damage whenever they hit the wearer.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'transmutation',
        icon: 'Nature/Thorned Flower',
        tags: ['buff', 'inscription', 'armor', 'retaliation', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'thorn_inscription',
          name: 'Thorn Inscribed',
          description: 'Attackers take 1d6 piercing damage on hit. Lasts until end of combat.',
          customDescription: 'Thorns erupt from inscribed armor whenever the wearer is struck in melee, dealing 1d6 piercing damage to the attacker.',
          mechanicsText: 'Reflect 1d6 piercing to melee attackers'
        }],
        durationValue: 0,
        durationType: 'combat',
        durationUnit: 'combat',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: ['ally', 'self'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'AUTOMATIC',
      tags: ['buff', 'inscription', 'armor', 'retaliation', 'inscriptor']
    },

    {
      id: 'inscriptor_rune_of_earth',
      name: 'Rune of Earth',
      description: 'Place a rune that conjures a stone pillar (30 HP). At 3+ runes, connected runes form walls.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['utility', 'zone'],
      typeConfig: {
        school: 'conjuration',
        icon: 'Nature/Roots',
        tags: ['utility', 'rune', 'zone', 'terrain', 'defensive', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      specialMechanics: {
        runicZone: {
          enabled: true,
          runeType: 'Earth',
          individualEffect: 'Conjures 5 ft stone pillar (30 HP)',
          zoneEffect: 'Forms wall up to 10 ft long, 15 ft high (3+ runes)',
          detonation: {
            enabled: true,
            saveDC: 15,
            saveType: 'agility',
            effect: 'Wall splinters: 2d8 piercing damage in 15 ft radius',
            damageFormula: '2d8',
            damageType: 'piercing'
          }
        }
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 5 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'A piece of stone or earth'
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'AUTOMATIC',
      tags: ['utility', 'rune', 'zone', 'terrain', 'defensive', 'inscriptor']
    },

    // ===== LEVEL 4 SPELLS =====
    {
      id: 'inscriptor_glyph_of_binding',
      name: 'Glyph of Binding',
      description: 'Inscribe a glyph that binds enemies within an area, restricting their movement.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['control', 'damage'],
      typeConfig: {
        school: 'arcane',
        icon: 'Radiant/Enlightened Vision',
        tags: ['control', 'damage', 'glyph', 'aoe', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      controlConfig: {
        controlType: 'restraint',
        strength: 'moderate',
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 15,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'bind',
          name: 'Bound',
          description: 'Movement speed reduced to 0 for 2 rounds',
          config: {
            restraintType: 'magical',
            saveType: 'strength',
            saveDC: 14,
            duration: 2,
            durationUnit: 'rounds',
            immobilize: true
          }
        }]
      },
      damageConfig: {
        formula: '3d6',
        elementType: 'force',
        damageType: 'direct'
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: ['enemy'],
        maxTargets: 5,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 15 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },
      resolution: 'DICE',
      tags: ['control', 'damage', 'glyph', 'aoe', 'inscriptor']
    },

    {
      id: 'inscriptor_runic_shield',
      name: 'Runic Shield',
      description: 'Create a shield of protective runes around yourself or an ally.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['healing'],
      typeConfig: {
        school: 'arcane',
        icon: 'Force/Force Field',
        tags: ['protection', 'shield', 'rune', 'support', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      healingConfig: {
        healingType: 'shield',
        hasShieldEffect: true,
        shieldFormula: '3d8 + intelligence',
        shieldDuration: 4,
        shieldDamageTypes: 'all',
        shieldOverflow: 'absorb',
        shieldBreakBehavior: 'fade'
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally', 'self'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 14 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },
      resolution: 'DICE',
      tags: ['protection', 'shield', 'rune', 'support', 'inscriptor']
    },

    {
      id: 'inscriptor_sigil_of_power',
      name: 'Sigil of Power',
      description: 'Place a sigil that empowers allies who stand within it.',
      level: 4,
      spellType: 'STATE',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'Arcane/Ebon Blaze',
        tags: ['buff', 'zone', 'sigil', 'support', 'inscriptor'],
        zoneDuration: 5,
        zoneDurationUnit: 'rounds',
        leaveTrail: false
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'sigil_power',
          name: 'Empowered by Sigil',
          description: 'Gain +2 to all damage rolls while in the sigil for 5 rounds',
          statModifier: {
            stat: 'damage_rolls',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 12 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },
      resolution: 'DICE',
      tags: ['buff', 'zone', 'sigil', 'support', 'inscriptor']
    },

    // ===== LEVEL 5 SPELLS =====
    {
      id: 'inscriptor_rune_of_devastation',
      name: 'Rune of Devastation',
      description: 'Inscribe a devastating rune that explodes with massive force.',
      level: 5,
      spellType: 'TRAP',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'arcane',
        icon: 'Utility/Explosive Detonation',
        tags: ['damage', 'trap', 'rune', 'aoe', 'inscriptor'],
        placementTime: 1,
        visibility: 'magical',
        cooldownAfterTrigger: 0,
        cooldownUnit: 'seconds',
        maxTriggers: 1
      },
      damageConfig: {
        formula: '6d8 + intelligence',
        elementType: 'force',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 16,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      trapConfig: {
        placementRadius: 5,
        detectionMethod: 'arcana',
        disarmMethod: 'dispel_magic',
        detectionDC: 18,
        disarmDC: 18,
        visibility: 'magical',
        trapDuration: 'timed',
        durationValue: 10,
        durationUnit: 'minutes',
        maxTriggers: 1,
        resetTime: 0
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 18 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Arcane chalk worth 50 gold'
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },
      resolution: 'DICE',
      tags: ['damage', 'trap', 'rune', 'aoe', 'inscriptor']
    },

    {
      id: 'inscriptor_glyph_mastery',
      name: 'Glyph Mastery',
      description: 'Enhance all your glyphs and runes for a short duration.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'Radiant/Divine Illumination',
        tags: ['buff', 'enhancement', 'glyph', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'glyph_mastery',
          name: 'Glyph Mastery',
          description: 'All your glyphs and runes deal +50% damage and have +2 DC for 4 rounds',
          customDescription: 'All your placed glyphs, runes, and inscriptions are enhanced. Damage increased by 50%, saving throw DCs increased by 2, and durations extended by 1 round.',
          mechanicsText: '+50% glyph/rune damage, +2 DC for 4 rounds',
          statModifier: [{ stat: 'glyph_damage', magnitude: 50, magnitudeType: 'percentage' }, { stat: 'spell_dc', magnitude: 2, magnitudeType: 'flat' }]
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 16 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'short_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'enhancement', 'glyph', 'inscriptor']
    },

    {
      id: 'inscriptor_inscription_of_warding',
      name: 'Inscription of Warding',
      description: 'Inscribe powerful wards on multiple allies, granting them protection.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'Radiant/Radiant Golden Shield',
        tags: ['buff', 'protection', 'inscription', 'support', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'ward_inscription',
          name: 'Warded',
          description: 'Gain +3 armor and resistance to the first damage type received for 5 rounds',
          statModifier: {
            stat: 'armor',
            magnitude: 3,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally', 'self'],
        maxTargets: 4,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 17 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },
      resolution: 'DICE',
      tags: ['buff', 'protection', 'inscription', 'support', 'inscriptor']
    },

    // ===== LEVEL 6 SPELLS =====
    {
      id: 'inscriptor_runic_array',
      name: 'Runic Array',
      description: 'Create a complex array of interlocking runes that damage and control enemies.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'arcane',
        icon: 'Arcane/Magical Sword',
        tags: ['damage', 'control', 'rune', 'aoe', 'inscriptor'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '8d6 + intelligence',
        elementType: 'force',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'intelligence',
          difficultyClass: 17,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      controlConfig: {
        controlType: 'restraint',
        strength: 'strong',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 17,
        saveType: 'intelligence',
        savingThrow: true,
        effects: [{
          id: 'slow',
          name: 'Slowed by Runes',
          description: 'Movement speed reduced by 20 feet for 3 rounds',
          config: {
            restraintType: 'magical',
            saveType: 'dexterity',
            saveDC: 15,
            duration: 3,
            durationUnit: 'rounds',
            movementPenalty: -20
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 50,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy'],
        maxTargets: 8,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 22 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },
      resolution: 'DICE',
      tags: ['damage', 'control', 'rune', 'aoe', 'inscriptor']
    },

    {
      id: 'inscriptor_sigil_of_power_major',
      name: 'Sigil of Power (Greater)',
      description: 'Place a powerful sigil that greatly enhances allies within.',
      level: 6,
      spellType: 'STATE',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'Arcane/Empowering Growth',
        tags: ['buff', 'zone', 'sigil', 'support', 'inscriptor'],
        zoneDuration: 6,
        zoneDurationUnit: 'rounds',
        leaveTrail: false
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [
          {
            id: 'major_sigil_damage',
            name: 'Greater Empowerment',
            description: 'Gain +3 to all damage rolls while in the sigil for 6 rounds',
            statModifier: {
              stat: 'damage_rolls',
              magnitude: 3,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'major_sigil_armor',
            name: 'Greater Protection',
            description: 'Gain +2 armor while in the sigil for 6 rounds',
            statModifier: {
              stat: 'armor',
              magnitude: 2,
              magnitudeType: 'flat'
            }
          }
        ],
        durationValue: 6,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 50,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 20 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },
      resolution: 'DICE',
      tags: ['buff', 'zone', 'sigil', 'support', 'inscriptor']
    },

    {
      id: 'inscriptor_glyph_nexus',
      name: 'Glyph Nexus',
      description: 'Connect all your glyphs into a networked system that amplifies their power.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['buff', 'utility'],
      typeConfig: {
        school: 'arcane',
        icon: 'Radiant/Radiant Light 1',
        tags: ['buff', 'utility', 'glyph', 'network', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'glyph_nexus',
          name: 'Glyph Nexus',
          description: 'All your glyphs are connected. Triggering one triggers all nearby glyphs (within 30 feet) for 5 rounds',
          customDescription: 'Creates a magical network linking all your placed glyphs and runes. When any glyph is triggered, all glyphs within 30 feet also trigger simultaneously. Additionally, all glyphs deal +2d6 damage while networked.',
          mechanicsText: 'All glyphs connected. Triggering one triggers all within 30ft for 5 rounds'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 21 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'short_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'utility', 'glyph', 'network', 'inscriptor']
    },

    // ===== LEVEL 7 SPELLS =====
    {
      id: 'inscriptor_ancient_rune',
      name: 'Ancient Rune',
      description: 'Inscribe an ancient rune of immense power.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'arcane',
        icon: 'Arcane/Empowering Growth',
        tags: ['damage', 'rune', 'ancient', 'aoe', 'inscriptor'],
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '12d6 + intelligence * 2',
        elementType: 'force',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          critDiceOnly: false,
          extraDice: '6d6',
          critEffects: ['rune_explosion'],
          runeExplosionConfig: {
            radius: 10,
            damageFormula: '3d6',
            elementType: 'force'
          }
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 18,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 35 },
        targetRestrictions: ['enemy'],
        maxTargets: 15,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 28 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Ancient rune stone worth 500 gold'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['damage', 'rune', 'ancient', 'aoe', 'inscriptor']
    },

    {
      id: 'inscriptor_inscribed_fortress',
      name: 'Inscribed Fortress',
      description: 'Transform the battlefield into a fortress of protective inscriptions.',
      level: 7,
      spellType: 'STATE',
      effectTypes: ['buff', 'healing'],
      typeConfig: {
        school: 'arcane',
        icon: 'Radiant/Radiant Aura',
        tags: ['buff', 'healing', 'zone', 'fortress', 'inscriptor'],
        zoneDuration: 5,
        zoneDurationUnit: 'rounds',
        leaveTrail: false
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'fortress_protection',
          name: 'Fortress Protection',
          description: 'Gain +4 armor and 50% damage reduction while in the fortress for 5 rounds',
          statModifier: {
            stat: 'armor',
            magnitude: 4,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      healingConfig: {
        formula: '3d8',
        healingType: 'hot',
        hasHotEffect: true,
        hotFormula: '3d8',
        hotDuration: 5,
        hotTickType: 'round',
        isProgressiveHot: false
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'square',
        aoeParameters: { size: 40 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 26 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'healing', 'zone', 'fortress', 'inscriptor']
    },

    {
      id: 'inscriptor_master_inscriber',
      name: 'Master Inscriber',
      description: 'Become a master inscriber for a short duration, empowering all your abilities.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'Radiant/Radiant Golden Shield',
        tags: ['buff', 'enhancement', 'mastery', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'master_inscriber',
          name: 'Master Inscriber',
          description: 'All inscription, glyph, and rune spells cost 50% less mana, have +2 DC, and deal +50% damage for 3 rounds',
          customDescription: 'You achieve mastery over all forms of inscription magic. All your inscription, glyph, rune, and sigil spells cost 50% less mana. All saving throw DCs increased by 2. All damage increased by 50%. You can place inscriptions without spending action points.',
          mechanicsText: 'Inscription spells cost 50% less mana, +2 DC, +50% damage for 3 rounds',
          statModifier: [{ stat: 'mana_cost', magnitude: -50, magnitudeType: 'percentage' }, { stat: 'spell_dc', magnitude: 2, magnitudeType: 'flat' }]
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 30 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'enhancement', 'mastery', 'inscriptor']
    },

    // ===== LEVEL 8 SPELLS =====
    {
      id: 'inscriptor_primordial_glyph',
      name: 'Primordial Glyph',
      description: 'Inscribe a glyph from the dawn of magic. All enemies in range must save or be stunned as ancient power floods the zone.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'arcane',
        icon: 'Radiant/Bright Explosion',
        tags: ['damage', 'control', 'glyph', 'primordial', 'aoe', 'epic', 'inscriptor'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '8d8 + intelligence',
        elementType: 'force',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 18,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'strong',
        duration: 2,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'constitution',
        savingThrow: true,
        effects: [{
          id: 'stun',
          name: 'Stunned by Primordial Power',
          description: 'Target is stunned for 2 rounds (CON save each round to end)',
          config: {
            durationType: 'rounds',
            recoveryMethod: 'save',
            saveType: 'constitution',
            saveDC: 16,
            duration: 2,
            durationUnit: 'rounds'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['enemy'],
        maxTargets: 10,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 28 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Primordial rune stone worth 500 gold'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['damage', 'control', 'glyph', 'primordial', 'aoe', 'epic', 'inscriptor']
    },

    {
      id: 'inscriptor_runic_apocalypse',
      name: 'Runic Apocalypse',
      description: 'Detonate all your active runes simultaneously in a cataclysmic chain explosion. Each rune detonates for 6d6 force damage in its radius.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'arcane',
        icon: 'Fire/Swirling Fireball',
        tags: ['damage', 'rune', 'aoe', 'detonation', 'epic', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '6d6',
        elementType: 'force',
        damageType: 'direct',
        description: 'Deals 6d6 force damage PER RUNE detonated. Each rune detonates independently in its own radius.',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 18,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      specialMechanics: {
        runicDetonation: {
          enabled: true,
          description: 'Detonates ALL active runes. Each rune deals 6d6 force damage in its 10 ft radius. Lingering effects from each rune remain for 3 rounds. You gain 2 Resonance per rune detonated. After detonation, all runes are consumed.'
        }
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self',
        aoeShape: 'special',
        aoeParameters: { radius: 0 },
        targetRestrictions: ['enemy'],
        maxTargets: 0,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 20 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['damage', 'rune', 'aoe', 'detonation', 'epic', 'inscriptor']
    },

    {
      id: 'inscriptor_eternal_inscription',
      name: 'Eternal Inscription',
      description: 'Your next 3 inscriptions become permanent until you dismiss them, lasting across combats and rests.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['buff', 'utility'],
      typeConfig: {
        school: 'arcane',
        icon: 'Healing/Golden Heart',
        tags: ['buff', 'utility', 'inscription', 'permanent', 'epic', 'inscriptor'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'eternal_inscription',
          name: 'Eternal Inscription',
          description: 'Your next 3 inscriptions are permanent and cannot be dispelled',
          customDescription: 'The next 3 inscriptions you place become permanent and immune to dispelling. They persist across combats, short rests, and long rests until you choose to dismiss them or replace them with new inscriptions.',
          mechanicsText: 'Next 3 inscriptions are permanent and cannot be dispelled',
          charges: 3
        }],
        durationValue: 0,
        durationType: 'permanent',
        durationUnit: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 25 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Diamond dust worth 2000 gold'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'AUTOMATIC',
      tags: ['buff', 'utility', 'inscription', 'permanent', 'epic', 'inscriptor']
    },

    // ===== LEVEL 9 SPELLS =====
    {
      id: 'inscriptor_worldscript',
      name: 'Worldscript',
      description: 'Inscribe reality itself. Create a massive zone where allies gain +3 to all rolls and enemies take 5d10 force damage per round.',
      level: 9,
      spellType: 'STATE',
      effectTypes: ['buff', 'control', 'damage'],
      typeConfig: {
        school: 'arcane',
        icon: 'Arcane/Magical Sword',
        tags: ['buff', 'control', 'damage', 'zone', 'reality', 'legendary', 'inscriptor'],
        zoneDuration: 6,
        zoneDurationUnit: 'rounds',
        leaveTrail: false
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'worldscript',
          name: 'Worldscript',
          description: 'Allies in the zone gain +3 to all attack rolls, damage rolls, and saving throws for 6 rounds',
          customDescription: 'You inscribe the battlefield itself with a powerful runic overlay. Within the zone, allies gain +3 to all attack rolls, damage rolls, and saving throws. Enemies must make a CON save each round or take 5d10 force damage.',
          mechanicsText: '+3 to all rolls for allies, 5d10 force/round to enemies (CON save) for 6 rounds',
          statModifier: { stat: 'all_rolls', magnitude: 3, magnitudeType: 'flat' }
        }],
        durationValue: 6,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },
      damageConfig: {
        formula: '5d10',
        elementType: 'force',
        damageType: 'dot',
        hasDotEffect: true,
        dotConfig: {
          duration: 6,
          tickFrequency: 'round',
          dotFormula: '5d10',
          isProgressiveDot: false
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 18,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 35 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Fragment of a runic obelisk worth 5,000 gold'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'control', 'damage', 'zone', 'reality', 'legendary', 'inscriptor']
    },

    {
      id: 'inscriptor_master_of_runes',
      name: 'Master of Runes',
      description: 'For 5 rounds, your runes reach their ultimate potential: rune placement costs 0 mana, rune effects are doubled, and detonations deal maximum damage.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'Healing/Prayer',
        tags: ['buff', 'enhancement', 'mastery', 'legendary', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'master_of_runes',
          name: 'Master of Runes',
          description: 'For 5 rounds: rune placement costs 0 mana, all rune effects are doubled, detonations deal maximum damage',
          customDescription: 'You achieve temporary mastery over runic magic. For 5 rounds, rune placement costs 0 mana, all rune zone effects are doubled (damage, healing, Armor bonuses, etc.), detonations deal maximum possible damage, and you generate +2 Resonance per rune placed.',
          mechanicsText: '5 rounds: 0 mana runes, doubled effects, max damage detonations'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 30 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'AUTOMATIC',
      tags: ['buff', 'enhancement', 'mastery', 'legendary', 'inscriptor']
    },

    {
      id: 'inscriptor_inscription_of_eternity',
      name: 'Inscription of Eternity',
      description: 'Inscribe yourself with eternal runes. For 5 rounds, you cannot be reduced below 1 HP and all damage you take is halved.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'Radiant/Divine Radiance',
        tags: ['buff', 'defensive', 'inscription', 'legendary', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'eternal_inscription',
          name: 'Inscribed with Eternity',
          description: 'For 5 rounds: cannot be reduced below 1 HP, all damage taken is halved, and you generate +1 Resonance per round',
          customDescription: 'You inscribe yourself with runes of eternity. For 5 rounds, you cannot be reduced below 1 HP, all damage you take is halved (after resistances), and you passively generate +1 Resonance at the start of each turn. When the effect ends, you take 3d6 force damage as the eternal runes burn out.',
          mechanicsText: '5 rounds: death ward + half damage + passive Resonance. 3d6 backlash when it ends.'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 30 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'A drop of your own blood mixed with arcane ink'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'AUTOMATIC',
      tags: ['buff', 'defensive', 'inscription', 'legendary', 'inscriptor']
    },

    // ===== LEVEL 10 SPELLS =====
    {
      id: 'inscriptor_omniscript',
      name: 'Omniscript',
      description: 'Inscribe the entire battlefield. Choose ONE effect that applies to the entire zone for 6 rounds: all allies gain +4 to all damage rolls OR all enemies are slowed and take 4d10 force/round OR all inscriptions on allies are doubled in power.',
      level: 10,
      spellType: 'STATE',
      effectTypes: ['buff', 'control', 'damage'],
      typeConfig: {
        school: 'arcane',
        icon: 'Arcane/Enchanted Sword',
        tags: ['buff', 'control', 'damage', 'zone', 'legendary', 'inscriptor'],
        zoneDuration: 6,
        zoneDurationUnit: 'rounds',
        leaveTrail: false
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'omniscript_power',
          name: 'Omniscript',
          description: 'Choose ONE: Allies +4 damage, Enemies 4d10/round + slowed, or Double all inscriptions. Lasts 6 rounds. Requires concentration.',
          customDescription: 'You inscribe the battlefield with a single overwhelming runic pattern. Choose ONE effect:\n\n**PATH OF RUIN**: All enemies in the zone are slowed (half speed, no reactions) and take 4d10 force damage per round (CON save for half).\n\n**PATH OF GLORY**: All allies in the zone gain +4 to all damage rolls and saving throws.\n\n**PATH OF MASTERY**: All active inscriptions on allies within the zone are doubled in effectiveness (+1d6 becomes +2d6, +2 Armor becomes +4 Armor, etc.).\n\nOnly ONE path can be active. Requires concentration.',
          mechanicsText: 'Choose 1 of 3 effects for 6 rounds. Requires concentration.'
        }],
        durationValue: 6,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'sight',
        aoeShape: 'circle',
        aoeParameters: { radius: 60 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'The Omniscript Codex, artifact of ultimate power'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'control', 'damage', 'zone', 'legendary', 'inscriptor']
    },

    {
      id: 'inscriptor_rune_of_creation',
      name: 'Rune of Creation',
      description: 'Create a living rune construct — an Inscribed Titan made of coalesced runic energy that fights alongside you.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['summoning'],
      typeConfig: {
        school: 'arcane',
        icon: 'Radiant/Divine Radiance',
        tags: ['summoning', 'creation', 'legendary', 'inscriptor'],
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },
      summonConfig: {
        creatures: [{
          id: 'inscribed_titan',
          name: 'Inscribed Titan',
          description: 'A colossal construct of living runes, bound to the Inscriptor\'s will',
          size: 'Large',
          type: 'construct',
          tokenIcon: 'spell_arcane_arcane02',
          stats: {
            maxHp: 200,
            armor: 18,
            maxMana: 0
          },
          abilities: [
            'Runic Slam: 3d8 + STR force damage (melee)',
            'Zone Carrier: The Titan counts as 2 runes for zone threshold purposes. It carries an active rune effect of your choice.',
            'Resonant Construct: When the Titan is destroyed, it detonates dealing 4d8 force damage in 15 ft and grants you +3 Resonance.'
          ],
          config: {
            quantity: 1,
            duration: 10,
            durationUnit: 'rounds',
            hasDuration: true,
            concentration: false,
            controlType: 'mental',
            controlRange: 60
          }
        }],
        duration: 10,
        durationUnit: 'rounds',
        hasDuration: true,
        concentration: false,
        controlRange: 60,
        controlType: 'mental'
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'circle',
        aoeParameters: { radius: 5 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 35 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Ancient rune stone worth 10,000 gold'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'AUTOMATIC',
      tags: ['summoning', 'creation', 'legendary', 'inscriptor']
    },

    {
      id: 'inscriptor_runic_ascension',
      name: 'Runic Ascension',
      description: 'Transform into a being of pure runic energy for 5 rounds. All runes you place are doubled in effect, you generate +3 Resonance per round, and you can place runes as a bonus action. When it ends, all your runes detonate automatically.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['buff', 'transformation'],
      typeConfig: {
        school: 'arcane',
        icon: 'Radiant/Radiant Bolt',
        tags: ['buff', 'transformation', 'legendary', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'runic_ascension',
          name: 'Runic Ascension',
          description: 'For 5 rounds: doubled rune effects, runes placed as bonus action, +3 Resonance/round. On expiry: all runes detonate automatically.',
          customDescription: 'You transform into a being of living runes. For 5 rounds:\n\n- All rune zone effects are doubled\n- You can place runes as a bonus action (no action point cost)\n- You generate +3 Resonance at the start of each turn\n- You gain resistance to force and arcane damage\n- You cannot use inscription spells (only runes)\n\nWhen Runic Ascension ends, ALL your active runes detonate automatically at no action cost. Each detonation deals its standard damage + 3d8 bonus force damage.',
          mechanicsText: '5 rounds of empowered rune play. Ends with auto-detonation of all runes.'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'AUTOMATIC',
      tags: ['buff', 'transformation', 'legendary', 'inscriptor']
    }
  ],

  // Spell Pools by Level
  spellPools: {
    1: [
      'inscriptor_arcane_inscription',
      'inscriptor_minor_rune',
      'inscriptor_rune_of_shielding'
    ],
    2: [
      'inscriptor_rune_of_speed',
      'inscriptor_rune_of_warding',
      'inscriptor_flame_inscription',
      'inscriptor_rune_of_slowing'
    ],
    3: [
      'inscriptor_rune_of_destruction',
      'inscriptor_rune_of_vitality',
      'inscriptor_thorn_inscription',
      'inscriptor_rune_of_earth'
    ],
    4: [
      'inscriptor_glyph_of_binding',
      'inscriptor_runic_shield',
      'inscriptor_sigil_of_power'
    ],
    5: [
      'inscriptor_rune_of_devastation',
      'inscriptor_glyph_mastery',
      'inscriptor_inscription_of_warding'
    ],
    6: [
      'inscriptor_runic_array',
      'inscriptor_sigil_of_power_major',
      'inscriptor_glyph_nexus'
    ],
    7: [
      'inscriptor_ancient_rune',
      'inscriptor_inscribed_fortress',
      'inscriptor_master_inscriber'
    ],
    8: [
      'inscriptor_primordial_glyph',
      'inscriptor_runic_apocalypse',
      'inscriptor_eternal_inscription'
    ],
    9: [
      'inscriptor_worldscript',
      'inscriptor_master_of_runes',
      'inscriptor_inscription_of_eternity'
    ],
    10: [
      'inscriptor_omniscript',
      'inscriptor_rune_of_creation',
      'inscriptor_runic_ascension'
    ]
  }
};


