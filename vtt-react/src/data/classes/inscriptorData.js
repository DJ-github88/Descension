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

  // Overview section
  overview: {
    title: 'The Inscriptor',
    subtitle: 'Master of Runes and Inscriptions',
    
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
      content: `Playing an Inscriptor is about planning ahead and controlling space. Key strategic considerations:

**Runic Zone Management**:
- Minimum 3 runes required to create a zone (1 action per rune to place)
- Maximum 8 runes for enhanced effects
- Zones last 1 minute or until disrupted
- Can be detonated for powerful lingering effects

**Inscription Timing**:
- Can inscribe 3 items at the start of combat
- Choose inscriptions based on anticipated threats
- Cannot stack inscriptions on the same item
- Different equipment slots provide different tactical options

**Specialization Synergies**:
- **Glyph Magic**: Focus on magical symbols and energy manipulation
- **Symbol Power**: Ancient symbols with mystical force
- **Runic Arts**: Traditional runic magic and inscription techniques

**Team Dynamics**:
- Works best with advance warning of combat
- Synergizes with tanks who can hold enemies in runic zones
- Provides versatile support through equipment inscriptions
- Can adapt to various party compositions through inscription selection`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Prepared Battlefield',
      content: `**The Setup**: You're an Inscriptor (Runic Arts specialization) and your party is about to ambush a group of cultists in a ritual chamber. You have 5 minutes to prepare before combat. Starting Mana: 50/60. Your goal: Place runic zones strategically, inscribe equipment for your party, then control the battlefield during combat.

**Pre-Combat Preparation (5 minutes before combat)**

*You enter the ritual chamber. The cultists haven't noticed you yet. Your party's rogue signals: "Five minutes until they finish their ritual. Make it count."*

**Your Action**: Begin placing Runic Zone (costs 3 mana per rune, 1 action per rune)

*You kneel, pulling out a piece of chalk infused with arcane energy. You begin drawing runes on the floor in a triangular pattern.*

**Rune 1 - "Amplification Rune"** (placed at north point of triangle)
**Cost**: 3 mana | **Effect**: Spells cast within 5 ft deal +1d6 damage
**Mana**: 50 - 3 = 47/60

**Rune 2 - "Amplification Rune"** (placed at south-west point)
**Cost**: 3 mana
**Mana**: 47 - 3 = 44/60

**Rune 3 - "Amplification Rune"** (placed at south-east point)
**Cost**: 3 mana
**Mana**: 44 - 3 = 41/60

*Three runes glow on the floor, forming a triangle 30 feet across. The runes connect with glowing lines, creating a ZONE. Any spell cast within this zone will be amplified.*

**Zone Created**: "Amplification Zone" (30 ft triangle)
**Effect**: All spells cast within zone deal +2d6 damage (3 runes = +2d6)

**Your Action**: Add more runes to strengthen the zone

**Rune 4 - "Amplification Rune"** (placed between runes 1 and 2)
**Cost**: 3 mana | **Mana**: 41 - 3 = 38/60

**Rune 5 - "Amplification Rune"** (placed between runes 2 and 3)
**Cost**: 3 mana | **Mana**: 38 - 3 = 35/60

*Five runes now. The zone PULSES with power. Spells cast here will be devastating.*

**Zone Enhanced**: "Amplification Zone" (5 runes)
**Effect**: All spells cast within zone deal +3d6 damage (5 runes = +3d6)

**Your Action**: Inscribe equipment for your party (costs 4 mana per inscription)

*You turn to your party's mage. "Give me your staff." You trace glowing runes along the shaft.*

**Inscription 1 - Mage's Staff**: "Inscription of Power" (+1d8 spell damage)
**Cost**: 4 mana | **Mana**: 35 - 4 = 31/60

*You turn to your party's tank. "Your armor." You inscribe protective runes on the breastplate.*

**Inscription 2 - Tank's Armor**: "Inscription of Warding" (+2 AC, resistance to first damage type taken)
**Cost**: 4 mana | **Mana**: 31 - 4 = 27/60

*You inscribe your own boots with runes of swiftness.*

**Inscription 3 - Your Boots**: "Inscription of Haste" (+10 ft movement speed, advantage on Agility saves)
**Cost**: 4 mana | **Mana**: 27 - 4 = 23/60

**Preparation Complete**: 5 runes placed (Amplification Zone active), 3 inscriptions applied
**Mana Remaining**: 23/60
**Time Elapsed**: 5 minutes

**Combat Begins**

*The cultists finish their ritual. A demon appears. Your party attacks!*

**Enemies**: 4 cultists + 1 demon (all standing OUTSIDE your runic zone)

**Turn 1 - Luring Enemies into the Zone**

*The cultists and demon are outside your zone. You need to get them inside. Your tank charges forward, taunting them.*

**Your Party's Tank**: Taunts demon and 2 cultists, pulls them toward the runic zone
**Cultists**: Move toward tank, entering the runic zone!

*Perfect. Three enemies are now inside your Amplification Zone.*

**Your Action**: Cast "Arcane Missiles" at Demon (inside zone) (8 mana)
**Base Damage**: 3d4+3 → [3, 4, 2] + 3 = 12 damage
**Zone Bonus**: +3d6 (5 runes in Amplification Zone) → [5, 6, 4] = +15 damage
**Total Damage**: 12 + 15 = **27 damage!**

*Your arcane missiles strike the demon, amplified by the runic zone. The demon roars in pain.*

**Mana**: 23 - 8 = 15/60

**Current State**: 3 enemies in zone, 2 enemies outside zone

**Turn 2 - Zone Control**

*Two cultists are still outside the zone. Your party's mage (with inscribed staff) casts a spell.*

**Your Party's Mage**: Casts "Fireball" at cultists inside zone (inside zone, has inscribed staff)
**Base Damage**: 8d6 → [5, 6, 4, 5, 6, 3, 4, 5] = 38 damage
**Inscription Bonus**: +1d8 (Inscription of Power) → [7] = +7 damage
**Zone Bonus**: +3d6 (Amplification Zone) → [6, 5, 4] = +15 damage
**Total Damage**: 38 + 7 + 15 = **60 damage!**

*The fireball EXPLODES inside the runic zone, amplified to devastating effect. Two cultists are VAPORIZED. The demon is badly wounded.*

**Cultists #1 and #2**: DEAD (60 damage each)
**Demon**: 60 damage taken, severely wounded

**Your Action**: Detonate Rune #3 to create lingering effect (DC 15 save)

*You snap your fingers. Rune #3 EXPLODES in a burst of arcane energy, then its effect LINGERS.*

**Detonation Effect**: Rune #3 erased, but Amplification effect lingers for 1 minute in that area
**Zone Status**: 4 runes remaining (zone still active with +2d6 bonus), plus lingering +1d6 in detonated area

**Demon's Save**: Constitution save DC 15 → [12] → FAIL!
**Detonation Damage**: 2d6 → [5, 4] = 9 damage to demon

*The demon staggers from the detonation.*

**Current State**: Demon wounded, 2 cultists outside zone

**Turn 3 - Finishing the Fight**

*The demon is inside the zone, badly wounded. The two remaining cultists are outside.*

**Your Action**: Cast "Magic Missile" at Demon (inside zone) (6 mana)
**Base Damage**: 3 missiles × (1d4+1) → [3+1, 4+1, 2+1] = 13 damage
**Zone Bonus**: +2d6 (4 runes) → [6, 5] = +11 damage
**Total Damage**: 13 + 11 = **24 damage**

*The magic missiles, amplified by the zone, strike the demon. It falls, dead.*

**Demon**: DEAD

**Your Party's Rogue**: Sneak attacks Cultist #3 → DEAD
**Your Party's Tank** (with inscribed armor): Attacks Cultist #4 → Hit! → Cultist attacks back but tank has +2 AC from inscription → Miss!

**Your Party's Mage**: Casts "Fire Bolt" at Cultist #4 → DEAD

**Combat Over**

*You stand in the center of your runic zone, four glowing runes still pulsing on the floor. Your party stares at the carnage.*

**Your Party's Mage**: "My fireball did SIXTY damage. SIXTY. What did you do to my staff?"
**You**: "Inscription of Power. +1d8 spell damage. And you cast it inside my Amplification Zone, which added another +3d6. Preparation is everything."
**Your Party's Tank**: "And my armor? I didn't take a single hit."
**You**: "Inscription of Warding. +2 AC. The cultist's attack missed because of it."
**Your Party's Rogue**: "You turned this room into a death trap."
**You**: "I turned it into a PREPARED battlefield. Five minutes of setup, and we won in three turns. That's the Inscriptor's way."

**Final State**: Mana: 9/60 | 4 runes still active | 3 inscriptions still active

**The Lesson**: Inscriptor gameplay is about:
1. **Pre-Combat Preparation**: Spent 5 minutes placing 5 runes (15 mana) and inscribing 3 items (12 mana) = 27 mana before combat even started
2. **Runic Zones**: 5-rune Amplification Zone added +3d6 damage to ALL spells cast within it
3. **Inscription Synergy**: Mage's staff (+1d8) + Amplification Zone (+3d6) = +4d14 average damage per spell
4. **Zone Control**: Lured enemies into the zone, then unleashed amplified spells
5. **Rune Detonation**: Detonated Rune #3 for 2d6 damage + lingering effect
6. **Damage Amplification**: Mage's Fireball: 38 base + 7 (inscription) + 15 (zone) = 60 damage (58% increase!)
7. **Equipment Enhancement**: Tank's +2 AC from inscription caused enemy attack to miss

You're not a direct damage dealer. You're a BATTLEFIELD ARCHITECT. You spend time before combat placing runes, inscribing equipment, and preparing the terrain. Then, when combat starts, your party fights on YOUR terms. Spells cast in your zones are amplified. Equipment you've inscribed provides crucial bonuses. Enemies who enter your runic zones are fighting in a prepared kill zone. The key is PREPARATION—given 5 minutes, you can turn any room into a fortress of magical power.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Runic Wrapping & Inscription Placement',
    subtitle: 'Dual Mechanic System',

    description: `The Inscriptor utilizes two complementary mechanics: Runic Wrapping for battlefield control and Inscription Placement for personal and ally enhancement. These systems work together to create a versatile tactical toolkit.`,

    resourceBarExplanation: {
      title: 'Understanding Your Runic & Inscription Interface',
      content: `**What You See**: The Inscriptor has a DUAL interface system—one for Runic Zones and one for Inscriptions. Both are displayed prominently on your HUD.

**RUNIC ZONE INTERFACE** (Top Section):

**Rune Counter Display**:
- **Active Runes**: "Runes Placed: 5/8" with glowing rune symbols
- **Zone Status**: "ZONE ACTIVE" (if 3+ runes placed) or "NO ZONE" (if <3 runes)
- **Zone Type**: Shows which rune type is active (e.g., "Amplification Zone", "Vitality Zone", "Warding Zone")

**Battlefield Map Overlay**:
- **Mini-Map**: Shows top-down view of battlefield with rune positions marked
- **Rune Icons**: Each placed rune appears as a glowing symbol on the map
- **Zone Visualization**: When 3+ runes are placed, connecting lines appear showing the zone boundary
- **Enemy Positions**: Enemy icons show whether they're inside or outside the zone
- **Ally Positions**: Ally icons show who's benefiting from the zone

**Rune Placement Interface** (when placing runes):
- **Placement Mode**: Click to activate, cursor changes to rune symbol
- **Range Indicator**: Shows 5 ft radius around cursor (individual rune effect range)
- **Zone Preview**: If placing 3rd+ rune, shows preview of zone shape and coverage
- **Cost Display**: "Place Rune of Amplification (3 mana)" tooltip
- **Confirm Placement**: Click to place, rune appears with glowing animation

**Rune Status Display** (for each placed rune):
- **Rune 1**: "Amplification Rune (North) - Active" with glow
- **Rune 2**: "Amplification Rune (SW) - Active" with glow
- **Rune 3**: "Amplification Rune (SE) - Active" with glow
- **Rune 4**: "Amplification Rune (Mid-N) - Active" with glow
- **Rune 5**: "Amplification Rune (Mid-S) - Active" with glow
- **Detonate Button**: Red button next to each rune "Detonate (DC 15 save)"

**Zone Effect Display**:
- **3 Runes**: "Amplification Zone: +2d6 spell damage" (green text)
- **4 Runes**: "Amplification Zone: +2d6 spell damage" (green text)
- **5 Runes**: "Amplification Zone: +3d6 spell damage" (bright green text)
- **6 Runes**: "Amplification Zone: +3d6 spell damage" (bright green text)
- **7 Runes**: "Amplification Zone: +4d6 spell damage" (gold text)
- **8 Runes**: "Amplification Zone: +4d6 spell damage" (gold text, pulsing)

**Detonation Animation**:
When you detonate a rune:
- **Rune Icon**: Flashes red, then EXPLODES with particle effect
- **Damage Numbers**: "2d6 damage" appears on enemies in range
- **Lingering Effect**: Ghostly rune image remains, labeled "Lingering Effect (1 min)"
- **Zone Recalculation**: Zone effect updates based on remaining runes
- **Audio**: Explosion sound, then fading hum

**INSCRIPTION INTERFACE** (Bottom Section):

**Inscription Slots Display**:
Shows 6 equipment slots with inscription status:
- **Weapon Slot**: Icon of weapon (sword, staff, etc.) with inscription status
- **Armor Slot**: Icon of armor (breastplate, robes, etc.) with inscription status
- **Boots Slot**: Icon of boots with inscription status
- **Cape Slot**: Icon of cape with inscription status
- **Belt Slot**: Icon of belt with inscription status
- **Pants Slot**: Icon of pants with inscription status

**Inscription Status** (for each slot):
- **Empty**: Gray icon, "No Inscription" text
- **Inscribed**: Glowing icon with rune overlay, inscription name displayed
- **Example (Weapon)**: Glowing sword icon with fire rune, "Inscription of Power (+1d8 spell damage)"
- **Example (Armor)**: Glowing armor icon with shield rune, "Inscription of Warding (+2 AC, resistance)"
- **Example (Boots)**: Glowing boots icon with wind rune, "Inscription of Haste (+10 ft speed, adv on Agility saves)"

**Inscription Placement Interface** (at start of combat):
- **Prompt**: "Inscribe up to 3 items (4 mana each)"
- **Selection Menu**: Click equipment slot to open inscription options
- **Inscription Options**: List of available inscriptions for that slot
  * Weapon: "Flame (+1d6 fire)", "Frost (+1d6 cold)", "Force (+1d6 force)", etc.
  * Armor: "Thorn (reflect damage)", "Warding (+2 AC)", "Restoration (regen)", etc.
  * Boots: "Haste (+10 ft speed)", "Flight (fly 30 ft)", "Water Walking", etc.
- **Cost Display**: "4 mana" shown for each inscription
- **Confirm**: Click to inscribe, rune animation plays on equipment

**Inscription Animation**:
When you inscribe an item:
- **Equipment Glows**: Selected item glows with arcane energy
- **Rune Tracing**: Glowing runes appear on the item, tracing intricate patterns
- **Completion Flash**: Bright flash, inscription is complete
- **Status Update**: Equipment slot shows inscribed status with effect tooltip
- **Audio**: Magical inscription sound (chime + hum)

**Inscription Effect Indicators**:
When inscriptions trigger:
- **Weapon Inscription**: When you attack, weapon glows, bonus damage appears "+1d8 fire"
- **Armor Inscription**: When you're hit, armor glows, effect triggers "+2 AC (attack missed!)"
- **Boots Inscription**: Movement trail shows speed boost, "+10 ft speed" text
- **Cape Inscription**: When effect triggers (e.g., Blink), cape shimmers with teleport animation
- **Belt Inscription**: Stat boost icon appears on character, "+2 Strength" text
- **Pants Inscription**: Resistance icon appears when damage is reduced

**Combined Interface Display**:
- **Top Half**: Runic Zone interface (battlefield map, rune status, zone effects)
- **Bottom Half**: Inscription interface (6 equipment slots, inscription status)
- **Mana Bar**: Shared mana pool shown prominently (runes and inscriptions both cost mana)
- **Preparation Timer**: If in pre-combat phase, shows "Preparation Time: 3:45 remaining"

**Tactical Overlay**:
When you're in combat:
- **Zone Highlight**: Runic zone area highlighted on battlefield (green glow for allies, red for enemies)
- **Spell Amplification Preview**: When casting spell inside zone, preview shows "Base: 3d6 → Amplified: 3d6 + 3d6 (zone)"
- **Inscription Tooltips**: Hover over ally to see their inscriptions "Tank: Inscription of Warding (+2 AC)"

**Why This Matters**: The Inscriptor's dual interface makes you feel like a BATTLEFIELD ARCHITECT. The runic zone map shows exactly where your runes are, which enemies are in the zone, and what bonuses are active. When you place your 5th rune and the zone effect updates from "+2d6" to "+3d6", you SEE the power increase. When your mage casts Fireball inside the zone and the damage preview shows "8d6 + 3d6 (zone bonus)", you KNOW your preparation paid off. The inscription interface shows all 6 equipment slots at a glance—you can see which items are inscribed, what effects they provide, and when they trigger. When your tank gets hit and their armor glows with "Inscription of Warding - Attack Missed (+2 AC)", you see your inscription saving their life. The combined interface makes preparation feel powerful and tactical—you're not just casting spells, you're ENGINEERING the battlefield.`
    },

    mechanics: {
      title: 'How It Works',
      content: `**Runic Wrapping**:
Place runes around an area to create zones of influence. Each rune costs mana and takes 1 action to place. Minimum 3 runes required, maximum 8 runes. When 3+ runes are placed, they form a zone that enhances spells cast within it. Runes can be detonated (DC 15 save) to erase them but cause their effect to linger for 1 minute.

**Inscription Placement**:
At the start of combat, inscribe up to 3 items from your equipment. Each inscription costs mana and provides specific benefits. Inscriptions cannot be stacked on the same item, but different items can have different inscriptions. Available inscription slots: Weapon, Armor, Boots, Cape, Belt, Pants.

**Zone Effects**:
- Individual runes provide minor effects within 5 ft
- 3+ connected runes create a full zone effect across the entire area
- More runes = stronger zone effects
- Detonation trades permanence for lingering power

**Strategic Depth**:
Inscriptors must balance mana between runes, inscriptions, and spells. Pre-combat preparation is crucial, as placing runes during combat consumes valuable actions.`
    },
    
    runicWrappingTable: {
      title: 'Runic Wrapping: Rune Effects',
      headers: ['Rune Name', 'Individual Effect (5 ft)', 'Zone Effect (3+ runes)', 'Detonation (DC 15)', 'Mana Cost'],
      rows: [
        ['Rune of Destruction', '+1d6 fire damage dealt/taken', 'Double fire damage dealt/taken', 'Stunned for 1 min', '6 mana'],
        ['Rune of Vitality', 'Heal 1d6 HP per turn', 'Heal 2d6 HP per turn', 'Exhausted, -1d6 max HP per rune for 1 min', '4 mana'],
        ['Rune of Arcane Warding', 'Magic damage reduced by 1', 'Magic damage reduced by 50%', 'Magic Vulnerability, +50% magic damage for 1 min', '5 mana'],
        ['Rune of Shielding', '+1 AC', '+3 AC', 'Armor Breakdown, -3 AC for 1 min', '5 mana'],
        ['Rune of Speed', '+10 ft movement', '+20 ft movement', 'Restrained for 1 min', '4 mana'],
        ['Rune of Earth', '5 ft pillar (30 HP)', 'Wall up to 10 ft long, 15 ft high', 'Wall splinters, 2d8 piercing in 15 ft', '6 mana']
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
      title: 'Strategic Considerations',
      content: `**Pre-Combat Preparation**: If you know combat is coming, place runes in advance to save actions during battle. A prepared Inscriptor is exponentially more powerful.

**Inscription Selection**: Choose inscriptions based on anticipated threats. Facing spellcasters? Use Elemental Ward. Fighting melee enemies? Thorn Inscription punishes attackers.

**Zone Positioning**: Place runic zones where allies will fight, not where enemies start. Control the battlefield by making enemies come to you.

**Detonation Timing**: Save detonations for critical moments. The lingering effect can turn the tide, but you lose the zone permanently.

**Mana Management**: With runes, inscriptions, and spells all competing for mana, prioritize based on the situation. Long fights favor inscriptions, short fights favor immediate spell power.`
    },

    playingInPerson: {
      title: 'Playing Inscriptor In Person',
      content: `**Required Materials**:
- **Rune Zone Markers** (tokens, coins, or cards to mark rune locations on map)
- **Rune Type Cards** (showing which rune type is at each location)
- **Inscription Tracker** (cards showing active inscriptions on equipment)
- **Rune Counter** (tracking active runes: 0-8 base, up to 12 for Runebinder)
- **Inscription Slots** (tracking inscription slots: 0-3 base, varies by spec)
- **Detonation Markers** (to mark when runes are detonated)

**Primary Tracking Method: Physical Rune Markers + Inscription Cards**

The Inscriptor uses two systems: Runic Wrapping (battlefield zones) and Inscription Placement (equipment enhancement). Track runes with physical markers on the battle map, and inscriptions with cards showing what's enhanced.

**Setup**:
\`\`\`
INSCRIPTOR RESOURCE TRACKING:

RUNIC ZONES: [___] / 8 active runes
• Place rune markers on map at specific locations
• Each rune = 5 ft radius zone with specific effect
• 3+ runes = Zone Synergy (enhanced effects)
• Detonate runes for burst damage + lingering effect

INSCRIPTIONS: [___] / 3 active inscriptions
• Weapon Inscription: +1d6 damage type
• Armor Inscription: +2 AC or resistance
• Accessory Inscription: Utility effect
• Duration: Until long rest or dispelled

SPECIALIZATIONS:
• Runebinder: 12 max runes, 1 inscription
• Glyphweaver: 8 runes, 3 inscriptions
• Wardcrafter: 6 runes, 4 inscriptions
\`\`\`

**How It Works**:

**Runic Wrapping (Battlefield Control)**:
1. **Cast rune spell** → Place physical marker on map
2. **Mark rune type** → Use colored token or card
3. **Track active runes** → Count total runes (max 8)
4. **Zone Synergy** → At 3+ runes, all zones enhanced
5. **Detonate** → Remove marker, apply burst damage + lingering effect

**Inscription Placement (Equipment Enhancement)**:
1. **Perform inscription ritual** (10 minutes)
2. **Choose equipment** → Weapon, armor, or accessory
3. **Choose effect** → Damage, defense, or utility
4. **Place inscription card** → On equipment or character sheet
5. **Duration** → Until long rest or dispelled

**Example Rune Placement**:

*You have 2 runes active, casting Rune of Destruction*

**Your Turn - Place Rune**:
1. "I cast Rune of Destruction at the chokepoint!" (6 mana)
2. Place red token on map at chosen location
3. Mark as "Destruction Rune" (fire damage)
4. Active runes: 2 + 1 = **3 runes**
5. **Zone Synergy Activated!** (3+ runes)

**Rune Effect**:
- Anyone within 5 ft: +1d6 fire damage dealt and taken
- Zone Synergy (3+ runes): Entire zone doubles fire damage

**Example Rune Detonation**:

*You have 4 runes active (Destruction, Protection, Frost, Lightning)*

**Your Turn - Detonate Runes**:
1. "I detonate all my runes!" (1 AP, no mana)
2. Remove all 4 rune markers from map
3. Roll detonation damage for each rune:
   - Destruction: 4d8 fire → [7,6,5,8] = 26 fire damage
   - Protection: Allies gain 20 temp HP
   - Frost: 3d6 cold → [5,4,6] = 15 cold damage, -10 ft speed
   - Lightning: 3d8 lightning → [7,6,8] = 21 lightning damage
4. **Lingering Effect**: All zones leave lingering aura for 2 turns
5. Active runes: 4 - 4 = **0 runes**

**Example Inscription Ritual**:

*You have 1 inscription active, performing weapon inscription*

**During Downtime (10-minute ritual)**:
1. "I inscribe my sword with Flame Inscription!"
2. Ritual complete (10 minutes)
3. Place "Flame Inscription" card on weapon
4. Effect: Weapon deals +1d6 fire damage
5. Active inscriptions: 1 + 1 = **2 inscriptions**
6. Duration: Until long rest

**Rune Type Reference Cards**:
\`\`\`
═══════════════════════════════════
   RUNE OF DESTRUCTION (Fire)
═══════════════════════════════════
ZONE EFFECT (5 ft radius):
• Creatures inside: +1d6 fire damage dealt/taken

ZONE SYNERGY (3+ runes):
• Entire zone: Double fire damage dealt/taken

DETONATION:
• Damage: 4d8 fire (Agility save DC 15, half on save)
• Lingering: Fire damage zone for 2 turns
═══════════════════════════════════

═══════════════════════════════════
   RUNE OF PROTECTION (Defense)
═══════════════════════════════════
ZONE EFFECT (5 ft radius):
• Allies inside: +2 AC, +5 temp HP per turn

ZONE SYNERGY (3+ runes):
• Entire zone: +3 AC, +10 temp HP per turn

DETONATION:
• Effect: All allies gain 20 temp HP
• Lingering: +2 AC zone for 2 turns
═══════════════════════════════════

═══════════════════════════════════
   RUNE OF FROST (Cold)
═══════════════════════════════════
ZONE EFFECT (5 ft radius):
• Enemies inside: -10 ft speed, +1d4 cold damage taken

ZONE SYNERGY (3+ runes):
• Entire zone: -20 ft speed, +1d6 cold damage taken

DETONATION:
• Damage: 3d6 cold (CON save DC 15, half on save)
• Lingering: Slowing zone for 2 turns
═══════════════════════════════════
\`\`\`

**Inscription Reference Cards**:
\`\`\`
═══════════════════════════════════
    WEAPON INSCRIPTIONS
═══════════════════════════════════
FLAME INSCRIPTION:
• Weapon deals +1d6 fire damage
• Duration: Until long rest

FROST INSCRIPTION:
• Weapon deals +1d6 cold damage
• Target: -10 ft speed for 1 turn

LIGHTNING INSCRIPTION:
• Weapon deals +1d6 lightning damage
• Chain to 1 nearby enemy (half damage)

RADIANT INSCRIPTION:
• Weapon deals +1d6 radiant damage
• Undead/fiends: +2d6 radiant damage
═══════════════════════════════════

═══════════════════════════════════
    ARMOR INSCRIPTIONS
═══════════════════════════════════
WARDING INSCRIPTION:
• Armor grants +2 AC
• Duration: Until long rest

RESISTANCE INSCRIPTION:
• Choose damage type: Fire, cold, lightning, or necrotic
• Gain resistance to chosen type

REFLECTION INSCRIPTION:
• When hit by melee attack: Attacker takes 1d6 force damage
• Duration: Until long rest
═══════════════════════════════════
\`\`\`

**Example In-Person Turn**:

*You have 3 runes active (Destruction, Frost, Lightning), 2 inscriptions active*

**Turn 1 - Place Fourth Rune**:
1. "I cast Rune of Protection at our tank's position!" (6 mana)
2. Place blue token on map at tank's location
3. Mark as "Protection Rune"
4. Active runes: 3 + 1 = **4 runes**
5. Zone Synergy still active (3+ runes)

**Turn 2 - Enemies Enter Zones**:
1. Orc enters Destruction zone (red token)
2. Orc takes +1d6 fire damage (zone effect)
3. Zone Synergy: Fire damage doubled
4. Goblin enters Frost zone (white token)
5. Goblin: -10 ft speed (zone effect)

**Turn 3 - Detonate for Burst**:
1. "I detonate all runes!" (1 AP)
2. Remove all 4 markers from map
3. Destruction: 4d8 fire → [7,6,5,8] = 26 damage (Agility save)
4. Frost: 3d6 cold → [5,4,6] = 15 damage (CON save)
5. Lightning: 3d8 lightning → [7,6,8] = 21 damage (Agility save)
6. Protection: All allies gain 20 temp HP
7. Lingering effects remain for 2 turns
8. Active runes: **0 runes**

**Alternative Tracking Methods**:

**Method 1: Colored Tokens**
- Red = Destruction (fire)
- Blue = Protection (defense)
- White = Frost (cold)
- Yellow = Lightning (electric)
- Visual and easy to identify

**Method 2: Rune Cards**
- Place small cards on map showing rune type and effect
- Flip card when detonated to show lingering effect
- Detailed information at a glance

**Method 3: Numbered Markers**
- Use numbered tokens (1-8) for runes
- Keep reference sheet showing which number = which rune type
- Compact tracking

**Method 4: Inscription Clips**
- Use paper clips or clothespins to attach inscription cards to equipment
- Physical attachment shows what's inscribed
- Easy to see at a glance

**Quick Reference Card Template**:
\`\`\`
INSCRIPTOR QUICK REFERENCE

RUNIC WRAPPING:
• Max runes: 8 (12 for Runebinder, 6 for Wardcrafter)
• Zone radius: 5 ft per rune
• Zone Synergy: 3+ runes = enhanced effects
• Detonation: 1 AP, removes all runes

INSCRIPTION PLACEMENT:
• Max inscriptions: 3 (1 for Runebinder, 4 for Wardcrafter)
• Ritual time: 10 minutes
• Duration: Until long rest
• Types: Weapon, armor, accessory

RUNE TYPES:
• Destruction (fire): +1d6 fire damage dealt/taken
• Protection (defense): +2 AC, +5 temp HP/turn
• Frost (cold): -10 ft speed, +1d4 cold damage taken
• Lightning (electric): +1d6 lightning damage on entry

STRATEGY:
• Place runes at chokepoints and key positions
• Reach 3+ runes for Zone Synergy
• Detonate for burst damage when needed
• Inscribe equipment during downtime
• Glyphweaver: Balance runes and inscriptions
\`\`\`

**Thematic Enhancements**:

Many players enhance the Inscriptor experience with:
- **Rune Stones**: Use actual rune stones or carved tokens
- **Glowing Markers**: LED tea lights for active rune zones
- **Inscription Scrolls**: Parchment cards for inscriptions
- **Colored Dice**: Match dice color to rune type
- **Ritual Props**: Quill and ink for inscription rituals
- **Zone Templates**: Circular templates showing 5 ft radius

**Rune Management Tips**:

**Placement Strategy**:
- **Chokepoints**: Place runes where enemies must pass
- **Ally Positions**: Protection runes where allies fight
- **Layered Zones**: Overlap runes for multiple effects
- **Zone Synergy**: Always aim for 3+ runes
- **Detonation Timing**: Save for critical moments or when zones are no longer useful

**Inscription Strategy**:
- **Weapon First**: Inscribe weapon for consistent damage boost
- **Armor Second**: Inscribe armor for survivability
- **Accessory Third**: Inscribe accessory for utility
- **Long Rest Planning**: Inscriptions reset, plan ahead
- **Specialization Focus**: Runebinder = runes, Glyphweaver = balance, Wardcrafter = inscriptions

**Specialization Strategy**:
- **Runebinder**: Maximize runes (12 max), minimal inscriptions
- **Glyphweaver**: Balance runes and inscriptions (8 runes, 3 inscriptions)
- **Wardcrafter**: Maximize inscriptions (4 max), fewer runes (6 max)

**Why This System Works**: The dual resource system (runes + inscriptions) creates two distinct gameplay loops. Runes are tactical and dynamic—place them, move enemies into them, detonate for burst damage. Inscriptions are strategic and persistent—enhance equipment during downtime for long-term benefits. The physical act of placing rune markers on the battle map creates spatial awareness and tactical positioning. The Zone Synergy mechanic (3+ runes) rewards building up runes before detonating. The system is visual, tactile, and creates clear decision points.

**Pro Tips**:
- **Pre-Place Runes**: Place runes before combat starts if possible
- **Zone Synergy First**: Always reach 3+ runes before detonating
- **Inscription Prep**: Inscribe equipment during every long rest
- **Colored Tokens**: Use different colors for easy rune identification
- **Detonation Timing**: Detonate when zones are no longer useful or for burst damage
- **Specialization Awareness**: Know your max runes and inscriptions

**Budget-Friendly Alternatives**:
- **No tokens?** Use coins (pennies, dimes, quarters for different runes)
- **No cards?** Write inscriptions on sticky notes
- **No markers?** Draw rune zones on map with dry-erase marker
- **Minimalist**: Track rune count and locations on paper

**Specialization-Specific Tracking**:

**Runebinder**:
- Track up to 12 runes (instead of 8)
- Only 1 inscription slot
- Focus on rune placement and detonation

**Glyphweaver**:
- Track 8 runes and 3 inscriptions
- Balanced approach
- Trap runes (explosive runes triggered by proximity)

**Wardcrafter**:
- Track 6 runes and 4 inscriptions
- Focus on inscriptions and defensive runes
- Enhanced inscription effects

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
        icon: 'spell_arcane_arcaneorb',
        color: '#4169E1',
        theme: 'Battlefield Zone Control',

        description: `Runebinders are masters of runic zone manipulation, focusing almost exclusively on creating, expanding, and controlling battlefield zones. They sacrifice inscription versatility for unparalleled zone control, able to place up to 12 runes and create massive interconnected zones that dominate entire battlefields.`,

        playstyle: 'Pure zone control, battlefield domination, area denial, tactical positioning',

        strengths: [
          'Can place up to 12 runes (instead of 8)',
          'Zones are 50% larger (7.5 ft radius instead of 5 ft)',
          'Can move runes for 1 AP (30 ft range)',
          'Zones overlap and combine effects',
          'Runes cost 2 less mana (minimum 2)'
        ],

        weaknesses: [
          'Can only inscribe 1 item at combat start (instead of 3)',
          'Inscriptions are 50% less effective',
          'Heavily reliant on positioning',
          'Vulnerable outside zones',
          'Requires significant setup time'
        ],

        passiveAbilities: [
          {
            name: 'Runic Resonance',
            tier: 'Path Passive',
            description: 'When you place your 3rd rune to complete a zone, you gain 1d4 temporary mana that must be spent within 1 minute.',
            sharedBy: 'All Inscriptors'
          },
          {
            name: 'Zone Mastery',
            tier: 'Specialization Passive',
            description: 'You can place up to 12 runes (instead of 8). Your runic zones have a 7.5 ft radius (instead of 5 ft). for 1 AP, you can move one rune up to 30 feet. Runes cost 2 less mana (minimum 2). However, you can only inscribe 1 item at combat start, and your inscriptions are 50% less effective.',
            uniqueTo: 'Runebinder'
          }
        ],

        recommendedFor: 'Players who want to control the battlefield through zone manipulation and tactical positioning'
      },

      {
        id: 'enchanter',
        name: 'Enchanter',
        icon: 'spell_arcane_arcanetorrent',
        color: '#6495ED',
        theme: 'Equipment Enhancement Master',

        description: `Enchanters focus almost exclusively on inscription magic, becoming masters of equipment enhancement and personal empowerment. They sacrifice runic zone capabilities for the ability to inscribe up to 6 items with powerful, stacking inscriptions that transform them and their allies into enhanced warriors.`,

        playstyle: 'Personal enhancement, ally buffing, equipment mastery, sustained power',

        strengths: [
          'Can inscribe 6 items (all equipment slots)',
          'Inscriptions are 100% more effective (double bonuses)',
          'Can inscribe allies\' equipment (1 item per ally)',
          'Inscriptions last entire adventuring day',
          'Can change inscriptions during short rest'
        ],

        weaknesses: [
          'Can only place 3 runes maximum (instead of 8)',
          'Runic zones are 50% smaller (2.5 ft radius)',
          'Cannot detonate runes',
          'No zone-wide effects (only individual rune effects)',
          'Limited battlefield control'
        ],

        passiveAbilities: [
          {
            name: 'Runic Resonance',
            tier: 'Path Passive',
            description: 'When you place your 3rd rune to complete a zone, you gain 1d4 temporary mana that must be spent within 1 minute.',
            sharedBy: 'All Inscriptors'
          },
          {
            name: 'Master Enchanter',
            tier: 'Specialization Passive',
            description: 'You can inscribe all 6 equipment slots (Weapon, Armor, Boots, Cape, Belt, Pants). Your inscriptions are twice as effective (double all bonuses). You can inscribe 1 item per ally. Inscriptions last until your next long rest. However, you can only place 3 runes maximum, your zones are 50% smaller, and you cannot detonate runes or trigger zone-wide effects.',
            uniqueTo: 'Enchanter'
          }
        ],

        recommendedFor: 'Players who want to enhance themselves and allies through powerful equipment inscriptions'
      },

      {
        id: 'glyphweaver',
        name: 'Glyphweaver',
        icon: 'spell_fire_selfdestruct',
        color: '#DC143C',
        theme: 'Explosive Trap Master',

        description: `Glyphweavers are volatile specialists who focus on detonation mechanics, explosive runes, and trap-based combat. They sacrifice sustained zone control for devastating burst damage, creating unstable runes that explode with tremendous force and leave lingering hazardous effects.`,

        playstyle: 'Trap setting, burst damage, detonation combos, explosive control',

        strengths: [
          'Runes automatically detonate when enemies enter (no save to resist)',
          'Detonations deal 3d8 bonus damage',
          'Can detonate all runes simultaneously (chain reaction)',
          'Detonation effects last 3 minutes (instead of 1)',
          'Can place explosive glyphs as traps (last 1 hour)'
        ],

        weaknesses: [
          'Runes only last 30 seconds before auto-detonating',
          'Cannot create sustained zones (runes are unstable)',
          'Can only inscribe 2 items (instead of 3)',
          'Friendly fire from detonations (half damage)',
          'High risk, high reward playstyle'
        ],

        passiveAbilities: [
          {
            name: 'Runic Resonance',
            tier: 'Path Passive',
            description: 'When you place your 3rd rune to complete a zone, you gain 1d4 temporary mana that must be spent within 1 minute.',
            sharedBy: 'All Inscriptors'
          },
          {
            name: 'Volatile Mastery',
            tier: 'Specialization Passive',
            description: 'Your runes automatically detonate when enemies enter their radius (no save). Detonations deal an additional 3d8 force damage. You can detonate all runes simultaneously for 1 AP (chain reaction). Detonation effects last 3 minutes. You can place explosive glyphs as traps (last 1 hour). However, runes only last 30 seconds before auto-detonating, you cannot create sustained zones, you can only inscribe 2 items, and allies take half damage from your detonations.',
            uniqueTo: 'Glyphweaver'
          }
        ],

        recommendedFor: 'Players who enjoy explosive burst damage, trap setting, and high-risk tactical gameplay'
      }
    ]
  },

  // Example Spells - organized by specialization
  exampleSpells: [
    // ========================================
    // RUNEBINDER SPECIALIZATION
    // Zone control and battlefield manipulation
    // ========================================
    {
      id: 'insc_rune_destruction',
      name: 'Rune of Destruction',
      description: 'Place a rune of destruction that radiates with fiery energy. The rune creates a zone of volatile magic where fire damage is amplified for both allies and enemies. When multiple runes are connected, the entire zone becomes a crucible of destruction, dramatically intensifying all fire damage.',
      spellType: 'ACTION',
      icon: 'spell_fire_sealoffire',
      school: 'Evocation',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 5
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1,
        description: 'Lasts 1 minute or until disrupted'
      },

      resourceCost: {
        mana: 6,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Runica!',
        somaticText: 'Trace burning rune in the air'
      },

      resolution: 'AUTOMATIC',

      effects: {
        zone: {
          type: 'rune',
          radius: 5,
          effect: 'Creatures within 5 ft deal and take +1d6 fire damage',
          zoneEffect: 'At 3+ runes, entire zone doubles fire damage dealt and taken',
          duration: '1 minute'
        }
      },

      specialMechanics: {
        runicZone: {
          enabled: true,
          runeType: 'Destruction',
          individualEffect: '+1d6 fire damage dealt/taken within 5 ft',
          zoneEffect: 'Double fire damage dealt/taken in entire zone (3+ runes)',
          detonation: {
            enabled: true,
            saveDC: 15,
            saveType: 'constitution',
            effect: 'Stunned for 1 minute',
            description: 'Detonate to inflict Stunned condition (DC 15 CON save)'
          }
        }
      },

      tags: ['rune', 'zone', 'fire', 'offensive', 'runebinder'],
      flavorText: 'The rune burns with infernal power, amplifying all flames within its reach.'
    },

    {
      id: 'insc_rune_vitality',
      name: 'Rune of Vitality',
      description: 'Place a rune of vitality that pulses with healing energy. The rune creates a zone of restoration where wounds mend over time. When multiple runes are connected, the entire zone becomes a sanctuary of healing, dramatically increasing the restorative power.',
      spellType: 'ACTION',
      icon: 'spell_holy_heal',
      school: 'Abjuration',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 5
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1,
        description: 'Lasts 1 minute or until disrupted'
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'Vita Runica!',
        somaticText: 'Trace glowing rune in the air'
      },

      resolution: 'AUTOMATIC',

      effects: {
        zone: {
          type: 'rune',
          radius: 5,
          effect: 'Creatures within 5 ft heal 1d6 HP per turn',
          zoneEffect: 'At 3+ runes, entire zone heals 2d6 HP per turn',
          duration: '1 minute'
        }
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
            effect: 'Exhausted, -1d6 max HP per rune for 1 minute',
            description: 'Detonate to inflict Exhausted condition and reduce max HP (DC 15 CON save)'
          }
        }
      },

      tags: ['rune', 'zone', 'healing', 'support', 'runebinder'],
      flavorText: 'Life energy radiates from the rune, mending wounds of those nearby.'
    },

    {
      id: 'insc_rune_earth',
      name: 'Rune of Earth',
      description: 'Place a rune of earth that conjures a 5 ft pillar (30 HP). If connected to another rune, forms a wall up to 10 ft long and 15 ft high.',
      spellType: 'ACTION',
      icon: 'spell_nature_stoneclawtotem',
      school: 'Conjuration',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'special',
        aoeSize: 5
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1,
        description: 'Lasts 1 minute or until destroyed'
      },

      resourceCost: {
        mana: 6,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Terra Runica!',
        somaticText: 'Slam fist to ground',
        materialText: 'A piece of stone or earth'
      },

      resolution: 'AUTOMATIC',

      effects: {
        summon: {
          type: 'terrain',
          structure: '5 ft pillar with 30 HP',
          zoneEffect: 'Connected runes form walls (10 ft long, 15 ft high, 30 HP per 5 ft)',
          duration: '1 minute or until destroyed'
        }
      },

      specialMechanics: {
        runicZone: {
          enabled: true,
          runeType: 'Earth',
          individualEffect: 'Conjures 5 ft pillar (30 HP)',
          zoneEffect: 'Forms wall up to 10 ft long, 15 ft high (3+ runes)',
          detonation: {
            enabled: true,
            saveDC: 15,
            saveType: 'agility',
            effect: '2d8 piercing damage to all within 15 ft',
            description: 'Walls splinter, dealing 2d8 piercing damage (DC 15 Agility save)'
          }
        }
      },

      tags: ['rune', 'zone', 'terrain', 'defensive', 'runebinder'],
      flavorText: 'Stone rises from the earth, forming barriers at your command.'
    },

    // ========================================
    // ENCHANTER SPECIALIZATION
    // Equipment enhancement and inscription mastery
    // ========================================

    // Weapon Inscriptions
    {
      id: 'insc_flame_inscription',
      name: 'Flame Inscription',
      description: 'Inscribe your weapon with the power of fire. The runic symbols glow with inner heat, causing the weapon to burn with magical flames. Each strike leaves trails of fire and scorches your enemies.',
      spellType: 'ACTION',
      icon: 'spell_fire_flameblades',
      school: 'Transmutation',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'touch',
        description: 'Touch your weapon to inscribe it'
      },

      durationConfig: {
        durationType: 'combat',
        description: 'Lasts until end of combat'
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'Flamma Inscriptio!',
        somaticText: 'Trace fiery runes along weapon blade'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'weapon-enhancement',
          bonus: '+1d8 fire damage',
          duration: 'combat',
          description: 'The weapon burns with magical flames, dealing additional fire damage with each strike. The runic fire clings to enemies, continuing to burn after impact.'
        }
      },

      specialMechanics: {
        inscription: {
          enabled: true,
          slot: 'weapon',
          effect: '+1d8 fire damage',
          stackable: false,
          description: 'Cannot stack with other weapon inscriptions'
        }
      },

      tags: ['inscription', 'weapon', 'fire', 'enhancement', 'enchanter'],
      flavorText: 'Flames dance along your weapon, eager to burn your foes.'
    },

    {
      id: 'insc_lightning_inscription',
      name: 'Lightning Inscription',
      description: 'Inscribe your weapon with the power of lightning. Deals +1d6 lightning damage and has a 1-in-8 chance to stun (DC 15).',
      spellType: 'ACTION',
      icon: 'spell_nature_lightning',
      school: 'Transmutation',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'touch',
        description: 'Touch your weapon to inscribe it'
      },

      durationConfig: {
        durationType: 'combat',
        description: 'Lasts until end of combat'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Fulgur Inscriptio!',
        somaticText: 'Trace crackling runes along weapon'
      },

      resolution: 'DICE',

      effects: {
        buff: {
          type: 'weapon-enhancement',
          bonus: '+1d6 lightning damage',
          duration: 'combat',
          description: 'Weapon deals additional 1d6 lightning damage'
        }
      },

      rollableTable: {
        enabled: true,
        name: 'Lightning Stun Chance',
        description: 'Roll d8 on each hit - 8 stuns target',
        resolutionType: 'DICE',
        resolutionConfig: {
          diceType: 'd8'
        },
        entries: [
          { roll: 1, name: 'No Effect', effect: 'Lightning crackles but no stun' },
          { roll: 2, name: 'No Effect', effect: 'Lightning crackles but no stun' },
          { roll: 3, name: 'No Effect', effect: 'Lightning crackles but no stun' },
          { roll: 4, name: 'No Effect', effect: 'Lightning crackles but no stun' },
          { roll: 5, name: 'No Effect', effect: 'Lightning crackles but no stun' },
          { roll: 6, name: 'No Effect', effect: 'Lightning crackles but no stun' },
          { roll: 7, name: 'No Effect', effect: 'Lightning crackles but no stun' },
          { roll: 8, name: 'Stun!', effect: 'Target stunned (DC 15 CON save)' }
        ]
      },

      specialMechanics: {
        inscription: {
          enabled: true,
          slot: 'weapon',
          effect: '+1d6 lightning damage, 1-in-8 stun chance',
          stackable: false,
          description: 'Cannot stack with other weapon inscriptions'
        }
      },

      tags: ['inscription', 'weapon', 'lightning', 'enhancement', 'control', 'enchanter'],
      flavorText: 'Lightning arcs along your weapon, ready to shock your enemies.'
    },

    // Armor Inscriptions
    {
      id: 'insc_thorn_inscription',
      name: 'Thorn Inscription',
      description: 'Inscribe your armor with the power of thorns. Attackers take 1d6 piercing damage whenever they hit you.',
      spellType: 'ACTION',
      icon: 'spell_nature_thorns',
      school: 'Transmutation',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'touch',
        description: 'Touch your armor to inscribe it'
      },

      durationConfig: {
        durationType: 'combat',
        description: 'Lasts until end of combat'
      },

      resourceCost: {
        mana: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Spina Inscriptio!',
        somaticText: 'Trace thorny runes on armor'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'armor-enhancement',
          effect: 'Attackers take 1d6 piercing damage on hit',
          duration: 'combat',
          description: 'Reflects damage back to attackers'
        }
      },

      specialMechanics: {
        inscription: {
          enabled: true,
          slot: 'armor',
          effect: 'Attackers take 1d6 piercing damage when they hit you',
          stackable: false,
          description: 'Cannot stack with other armor inscriptions'
        }
      },

      tags: ['inscription', 'armor', 'defensive', 'retaliation', 'enchanter'],
      flavorText: 'Thorns sprout from your armor, punishing those who dare strike you.'
    },

    {
      id: 'insc_stone_skin',
      name: 'Stone Skin Inscription',
      description: 'Inscribe your armor with the toughness of stone. Gain temporary HP equal to your Constitution modifier at the start of each turn.',
      spellType: 'ACTION',
      icon: 'spell_nature_stoneskintotem',
      school: 'Transmutation',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'touch',
        description: 'Touch your armor to inscribe it'
      },

      durationConfig: {
        durationType: 'combat',
        description: 'Lasts until end of combat'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Petra Cutis!',
        somaticText: 'Trace stone-like runes on armor',
        materialText: 'A small piece of granite'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'armor-enhancement',
          effect: 'Gain temp HP equal to CON modifier per turn',
          duration: 'combat',
          description: 'Continuous temporary hit point generation'
        }
      },

      specialMechanics: {
        inscription: {
          enabled: true,
          slot: 'armor',
          effect: 'Gain temporary HP equal to CON modifier at start of each turn',
          stackable: false,
          description: 'Cannot stack with other armor inscriptions'
        }
      },

      tags: ['inscription', 'armor', 'defensive', 'regeneration', 'enchanter'],
      flavorText: 'Your skin hardens like stone, constantly renewing your defenses.'
    },

    // Boot Inscriptions
    {
      id: 'insc_flight_inscription',
      name: 'Flight Inscription',
      description: 'Inscribe your boots with the power of flight. Gain the ability to fly at 20 feet speed for 1 minute.',
      spellType: 'ACTION',
      icon: 'spell_arcane_levitate',
      school: 'Transmutation',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'touch',
        description: 'Touch your boots to inscribe them'
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1,
        description: 'Flight lasts 1 minute'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Volatus Inscriptio!',
        somaticText: 'Trace wing-like runes on boots'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'mobility-enhancement',
          effect: 'Fly speed 20 ft',
          duration: '1 minute',
          description: 'Gain flight capability'
        }
      },

      specialMechanics: {
        inscription: {
          enabled: true,
          slot: 'boots',
          effect: 'Fly at 20 ft speed for 1 minute',
          stackable: false,
          description: 'Cannot stack with other boot inscriptions'
        }
      },

      tags: ['inscription', 'boots', 'mobility', 'flight', 'enchanter'],
      flavorText: 'Your boots lift you into the air, defying gravity itself.'
    },

    // Cape Inscriptions
    {
      id: 'insc_blink_inscription',
      name: 'Blink Inscription',
      description: 'Inscribe your cape with teleportation magic. Gain the ability to teleport up to 30 feet for 1 AP.',
      spellType: 'ACTION',
      icon: 'spell_arcane_blink',
      school: 'Transmutation',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'touch',
        description: 'Touch your cape to inscribe it'
      },

      durationConfig: {
        durationType: 'combat',
        description: 'Lasts until end of combat'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Translatio Inscriptio!',
        somaticText: 'Trace shimmering runes on cape'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'utility-enhancement',
          effect: 'Teleport up to 30 ft for 1 AP',
          duration: 'combat',
          description: 'Gain short-range teleportation'
        }
      },

      specialMechanics: {
        inscription: {
          enabled: true,
          slot: 'cape',
          effect: 'Teleport up to 30 ft for 1 AP',
          stackable: false,
          description: 'Cannot stack with other cape inscriptions'
        }
      },

      tags: ['inscription', 'cape', 'utility', 'teleportation', 'enchanter'],
      flavorText: 'Your cape shimmers with spatial magic, allowing you to blink across the battlefield.'
    },

    {
      id: 'insc_camouflage_inscription',
      name: 'Camouflage Inscription',
      description: 'Inscribe your cape with the power of invisibility. Gain invisibility for 1 minute.',
      spellType: 'ACTION',
      icon: 'ability_stealth',
      school: 'Illusion',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'touch',
        description: 'Touch your cape to inscribe it'
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1,
        description: 'Invisibility lasts 1 minute or until you attack'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Occultatio Inscriptio!',
        somaticText: 'Trace fading runes on cape'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'stealth-enhancement',
          effect: 'Invisibility for 1 minute',
          duration: '1 minute or until attack',
          description: 'Become invisible'
        }
      },

      specialMechanics: {
        inscription: {
          enabled: true,
          slot: 'cape',
          effect: 'Gain invisibility for 1 minute (ends on attack)',
          stackable: false,
          description: 'Cannot stack with other cape inscriptions'
        }
      },

      tags: ['inscription', 'cape', 'utility', 'stealth', 'invisibility', 'enchanter'],
      flavorText: 'Your cape bends light around you, rendering you invisible to the naked eye.'
    },

    // Belt Inscriptions
    {
      id: 'insc_regeneration_inscription',
      name: 'Regeneration Inscription',
      description: 'Inscribe your belt with regenerative energy. Regain 1d4 hit points at the start of each turn.',
      spellType: 'ACTION',
      icon: 'spell_nature_rejuvenation',
      school: 'Transmutation',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'touch',
        description: 'Touch your belt to inscribe it'
      },

      durationConfig: {
        durationType: 'combat',
        description: 'Lasts until end of combat'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Regeneratio Inscriptio!',
        somaticText: 'Trace healing runes on belt'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'regeneration',
          effect: 'Heal 1d4 HP at start of each turn',
          duration: 'combat',
          description: 'Continuous healing over time'
        }
      },

      specialMechanics: {
        inscription: {
          enabled: true,
          slot: 'belt',
          effect: 'Regain 1d4 HP at start of each turn',
          stackable: false,
          description: 'Cannot stack with other belt inscriptions'
        }
      },

      tags: ['inscription', 'belt', 'healing', 'regeneration', 'enchanter'],
      flavorText: 'Life energy flows through your belt, constantly mending your wounds.'
    },

    // ========================================
    // GLYPHWEAVER SPECIALIZATION
    // Explosive traps and detonation mechanics
    // ========================================
    {
      id: 'insc_runic_explosion',
      name: 'Runic Explosion',
      description: 'Inscribe a rune on a surface that explodes when triggered, dealing 4d8 force damage in a 15-foot radius.',
      spellType: 'ACTION',
      icon: 'spell_fire_selfdestruct',
      school: 'Evocation',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeType: 'circle',
        aoeSize: 15
      },

      durationConfig: {
        durationType: 'triggered',
        description: 'Explodes when creature enters the space'
      },

      resourceCost: {
        mana: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'Explosio Runica!',
        somaticText: 'Trace volatile rune on surface'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'agility',
        saveDC: 15,
        onSaveEffect: 'half'
      },

      damageConfig: {
        formula: '4d8',
        damageType: 'force',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '4d8',
            type: 'force'
          }
        }
      },

      specialMechanics: {
        trap: {
          enabled: true,
          triggerType: 'proximity',
          triggerRadius: 5,
          description: 'Explodes when creature enters within 5 ft'
        }
      },

      tags: ['rune', 'trap', 'force', 'aoe', 'damage', 'glyphweaver'],
      flavorText: 'The rune pulses with barely contained energy, waiting to unleash destruction.'
    },

    {
      id: 'insc_inkbound_servant',
      name: 'Inkbound Servant',
      description: 'Summon a servant made of magical ink that can assist you in combat or tasks. The servant has AC 12 and 10 hit points.',
      spellType: 'ACTION',
      icon: 'spell_shadow_charm',
      school: 'Conjuration',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'ACTION'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 10,
        description: 'Servant lasts 10 minutes or until destroyed'
      },

      resourceCost: {
        mana: 3,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Servus Atramenti!',
        somaticText: 'Draw servant shape in the air',
        materialText: 'A vial of magical ink'
      },

      resolution: 'AUTOMATIC',

      effects: {
        summon: {
          creatureType: 'Inkbound Servant',
          ac: 12,
          hp: 10,
          duration: '10 minutes',
          description: 'Summons a servant made of magical ink that follows your commands'
        }
      },

      specialMechanics: {
        summon: {
          enabled: true,
          summonType: 'Inkbound Servant',
          stats: {
            ac: 12,
            hp: 10,
            speed: 30,
            abilities: ['Can perform simple tasks', 'Can make melee attacks (1d4 bludgeoning)', 'Can carry light objects']
          }
        }
      },

      tags: ['summon', 'utility', 'servant', 'ink', 'enchanter'],
      flavorText: 'Ink flows from your fingertips, coalescing into a loyal servant.'
    }
  ],

  // Comprehensive Spell List (Levels 1-10, following template)
  spells: [
    // ===== LEVEL 1 SPELLS (has 2, need 1 more) =====
    {
      id: 'inscriptor_arcane_inscription',
      name: 'Arcane Inscription',
      description: 'Inscribe a rune of power on a target to enhance their abilities for 3 rounds.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'inv_inscription_tarot_repose',
        tags: ['buff', 'support', 'inscription', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'arcane_inscription',
          name: 'Arcane Inscription',
          description: 'Gain +1 to spell damage rolls for 3 rounds',
          statModifier: {
            stat: 'spell_damage',
            magnitude: 1,
            magnitudeType: 'flat'
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
        resourceValues: { mana: 6 },
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

    // ===== LEVEL 2 SPELLS (has 7, complete) =====

    // ===== LEVEL 3 SPELLS (has 4, complete) =====

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
        icon: 'spell_holy_holyguidance',
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
            restraintType: 'magical'
          }
        }]
      },
      damageConfig: {
        formula: '3d6',
        elementType: 'force',
        damageType: 'direct'
      },
      targetingConfig: {
        targetingType: 'ground',
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
        icon: 'spell_holy_powerwordbarrier',
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
      spellType: 'ZONE',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'spell_arcane_prismaticcloak',
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
        targetingType: 'ground',
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
        icon: 'spell_fire_selfdestruct',
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
        targetingType: 'ground',
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
        icon: 'spell_holy_divineillumination',
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
          customDescription: 'All your placed glyphs, runes, and inscriptions are enhanced. Damage increased by 50%, saving throw DCs increased by 2, and durations extended by 1 round.'
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
        icon: 'spell_holy_sealofprotection',
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
        icon: 'spell_arcane_blast',
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
            restraintType: 'magical'
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
      spellType: 'ZONE',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'spell_arcane_arcanepotency',
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
        targetingType: 'ground',
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
        icon: 'spell_holy_powerwordfortitude',
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
          customDescription: 'Creates a magical network linking all your placed glyphs and runes. When any glyph is triggered, all glyphs within 30 feet also trigger simultaneously. Additionally, all glyphs deal +2d6 damage while networked.'
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
        icon: 'spell_arcane_arcanetorrent',
        tags: ['damage', 'rune', 'ancient', 'aoe', 'inscriptor'],
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '12d8 + intelligence * 2',
        elementType: 'force',
        damageType: 'direct',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          critDiceOnly: false,
          extraDice: '6d8',
          critEffects: ['rune_explosion'],
          runeExplosionConfig: {
            radius: 10,
            damageFormula: '3d8',
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
        targetingType: 'ground',
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
      spellType: 'ZONE',
      effectTypes: ['buff', 'healing'],
      typeConfig: {
        school: 'arcane',
        icon: 'spell_holy_innerfire',
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
        healingType: 'hot',
        hasHotEffect: true,
        hotFormula: '3d8',
        hotDuration: 5,
        hotTickType: 'round',
        isProgressiveHot: false
      },
      targetingConfig: {
        targetingType: 'ground',
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
        icon: 'spell_holy_holyprotection',
        tags: ['buff', 'enhancement', 'mastery', 'inscriptor'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'master_inscriber',
          name: 'Master Inscriber',
          description: 'All inscription, glyph, and rune spells cost 50% less mana, have +3 DC, and deal +100% damage for 5 rounds',
          customDescription: 'You achieve mastery over all forms of inscription magic. All your inscription, glyph, rune, and sigil spells cost 50% less mana. All saving throw DCs increased by 3. All damage increased by 100%. You can place inscriptions without spending action points.'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
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
      description: 'Inscribe a glyph from the dawn of magic itself.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'arcane',
        icon: 'spell_holy_holynova',
        tags: ['damage', 'control', 'glyph', 'primordial', 'aoe', 'epic', 'inscriptor'],
        castTime: 4,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '16d10 + intelligence * 2',
        elementType: 'force',
        secondaryElementType: 'radiant',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'spirit',
          difficultyClass: 19,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'extreme',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 19,
        saveType: 'spirit',
        savingThrow: true,
        effects: [{
          id: 'stun',
          name: 'Stunned by Primordial Power',
          description: 'Target is stunned, unable to act or react for 3 rounds',
          config: {
            durationType: 'temporary',
            recoveryMethod: 'automatic'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'sight',
        aoeShape: 'circle',
        aoeParameters: { radius: 50 },
        targetRestrictions: ['enemy'],
        maxTargets: 20,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 35 },
        useFormulas: {},
        actionPoints: 4,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Primordial essence worth 2000 gold'
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
      description: 'Detonate all your runes simultaneously in a cataclysmic explosion.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'arcane',
        icon: 'spell_fire_fireball',
        tags: ['damage', 'rune', 'aoe', 'detonation', 'epic', 'inscriptor'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '20d8 + intelligence * 3',
        elementType: 'force',
        damageType: 'direct',
        description: 'Damage multiplied by number of active runes (minimum 3, maximum 8)',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 19,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'sight',
        aoeShape: 'circle',
        aoeParameters: { radius: 100 },
        targetRestrictions: ['enemy'],
        maxTargets: 50,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        useFormulas: {},
        actionPoints: 4,
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
      description: 'Create inscriptions that last forever and cannot be dispelled.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['buff', 'utility'],
      typeConfig: {
        school: 'arcane',
        icon: 'spell_holy_greaterheal',
        tags: ['buff', 'utility', 'inscription', 'permanent', 'epic', 'inscriptor'],
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'eternal_inscription',
          name: 'Eternal Inscription',
          description: 'Your next 3 inscriptions are permanent and cannot be dispelled',
          customDescription: 'The next 3 inscriptions you place become permanent and immune to dispelling. They persist indefinitely until you dismiss them or replace them with new eternal inscriptions.'
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
        resourceValues: { mana: 38 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Diamond dust worth 5000 gold'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'utility', 'inscription', 'permanent', 'epic', 'inscriptor']
    },

    // ===== LEVEL 9 SPELLS =====
    {
      id: 'inscriptor_worldscript',
      name: 'Worldscript',
      description: 'Inscribe reality itself with runes that reshape the battlefield.',
      level: 9,
      spellType: 'ZONE',
      effectTypes: ['buff', 'control', 'damage'],
      typeConfig: {
        school: 'arcane',
        icon: 'spell_arcane_arcane04',
        tags: ['buff', 'control', 'damage', 'zone', 'reality', 'legendary', 'inscriptor'],
        zoneDuration: 10,
        zoneDurationUnit: 'rounds',
        leaveTrail: false
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'worldscript',
          name: 'Worldscript',
          description: 'Allies gain +5 to all stats, immunity to control effects, and regenerate 5d10 HP per round in the zone for 10 rounds',
          customDescription: 'You have inscribed the laws of reality itself. Within the zone, allies gain godlike power while enemies are severely weakened. Allies gain +5 to all stats, immunity to all control effects, and regenerate 5d10 HP per round. Enemies take 10d10 force damage per round and have all stats reduced by 5.'
        }],
        durationValue: 10,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },
      damageConfig: {
        formula: '10d10',
        elementType: 'force',
        damageType: 'dot',
        hasDotEffect: true,
        dotConfig: {
          duration: 10,
          tickFrequency: 'round',
          dotFormula: '10d10',
          isProgressiveDot: false
        }
      },
      targetingConfig: {
        targetingType: 'ground',
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
        resourceValues: { mana: 50 },
        useFormulas: {},
        actionPoints: 5,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Fragment of reality worth 10,000 gold'
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
      description: 'Become the ultimate master of runic magic.',
      level: 9,
      spellType: 'PASSIVE',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'spell_holy_prayerofhealing',
        tags: ['buff', 'passive', 'mastery', 'legendary', 'inscriptor'],
        toggleable: true
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'master_of_runes',
          name: 'Master of Runes',
          description: 'All rune, glyph, and inscription spells cost 0 mana. You can place unlimited runes. All rune damage tripled.',
          customDescription: 'You have achieved ultimate mastery over runic magic. All rune, glyph, inscription, and sigil spells cost 0 mana. You can place unlimited runes simultaneously. All rune/glyph/inscription damage is tripled. All saving throw DCs increased by 5. You can inscribe items without spending action points.'
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
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 0,
        components: ['ritual'],
        materialComponents: 'The complete Book of Runes, priceless artifact'
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'DICE',
      tags: ['buff', 'passive', 'mastery', 'legendary', 'inscriptor', 'toggleable']
    },

    {
      id: 'inscriptor_inscription_of_eternity',
      name: 'Inscription of Eternity',
      description: 'Inscribe yourself with eternal runes, gaining immortal power.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'spell_holy_spiritualguidence',
        tags: ['buff', 'eternal', 'inscription', 'legendary', 'inscriptor'],
        castTime: 5,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'eternal_inscription',
          name: 'Inscribed with Eternity',
          description: 'Gain +10 to all stats, immunity to all damage, and cannot be killed for 10 rounds',
          statModifier: {
            stat: 'all_stats',
            magnitude: 10,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 10,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 55 },
        useFormulas: {},
        actionPoints: 5,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Your life force, temporarily sacrificing 50% of max HP'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['buff', 'eternal', 'inscription', 'legendary', 'inscriptor']
    },

    // ===== LEVEL 10 SPELLS =====
    {
      id: 'inscriptor_omniscript',
      name: 'Omniscript',
      description: 'Inscribe the entire battlefield with omnipotent runes.',
      level: 10,
      spellType: 'ZONE',
      effectTypes: ['damage', 'control', 'buff'],
      typeConfig: {
        school: 'arcane',
        icon: 'spell_arcane_arcane01',
        tags: ['damage', 'control', 'buff', 'zone', 'omnipotent', 'legendary', 'inscriptor'],
        zoneDuration: 15,
        zoneDurationUnit: 'rounds',
        leaveTrail: false
      },
      damageConfig: {
        formula: '25d12 + intelligence * 5',
        elementType: 'force',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 22,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        }
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'extreme',
        duration: 5,
        durationUnit: 'rounds',
        saveDC: 22,
        saveType: 'spirit',
        savingThrow: true,
        effects: [{
          id: 'paralyze',
          name: 'Paralyzed by Omniscript',
          description: 'Target is paralyzed, unable to move or act for 5 rounds',
          config: {
            durationType: 'temporary',
            recoveryMethod: 'automatic'
          }
        }]
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'omniscript_power',
          name: 'Omniscript',
          description: 'Allies gain +10 to all stats, immunity to everything, and limitless power for 15 rounds',
          customDescription: 'The entire battlefield is inscribed with omnipotent runes. Allies gain +10 to all stats, complete immunity to all damage and effects, regenerate to full HP and mana each round, and all their abilities cost 0 resources. Enemies are paralyzed, take 25d12 + intelligence × 5 force damage, and cannot act.'
        }],
        durationValue: 15,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'sight',
        aoeShape: 'circle',
        aoeParameters: { radius: 200 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 80 },
        useFormulas: {},
        actionPoints: 6,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'The Omniscript Codex, artifact of ultimate power'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['damage', 'control', 'buff', 'zone', 'omnipotent', 'legendary', 'inscriptor']
    },

    {
      id: 'inscriptor_rune_of_creation',
      name: 'Rune of Creation',
      description: 'Create a rune that births new reality itself.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['summoning', 'utility'],
      typeConfig: {
        school: 'arcane',
        icon: 'spell_holy_divineprovidence',
        tags: ['summoning', 'utility', 'creation', 'legendary', 'inscriptor'],
        castTime: 10,
        castTimeType: 'IMMEDIATE'
      },
      summonConfig: {
        creatures: [{
          id: 'inscribed_titan',
          name: 'Inscribed Titan',
          description: 'A colossal being made entirely of living runes',
          size: 'Colossal',
          type: 'construct',
          tokenIcon: 'spell_arcane_arcane02',
          stats: {
            maxHp: 500,
            armor: 25,
            maxMana: 0
          },
          config: {
            quantity: 1,
            duration: 15,
            durationUnit: 'rounds',
            hasDuration: true,
            concentration: false,
            controlType: 'mental',
            controlRange: 0
          }
        }],
        duration: 15,
        durationUnit: 'rounds',
        hasDuration: true,
        concentration: false,
        controlRange: 0,
        controlType: 'mental'
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 100,
        aoeShape: 'circle',
        aoeParameters: { radius: 10 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 75 },
        useFormulas: {},
        actionPoints: 6,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'The essence of creation, worth 100,000 gold'
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      resolution: 'DICE',
      tags: ['summoning', 'utility', 'creation', 'legendary', 'inscriptor']
    },

    {
      id: 'inscriptor_universal_inscription',
      name: 'Universal Inscription',
      description: 'Inscribe the universe itself with your will.',
      level: 10,
      spellType: 'PASSIVE',
      effectTypes: ['buff', 'utility'],
      typeConfig: {
        school: 'arcane',
        icon: 'spell_holy_holybolt',
        tags: ['buff', 'utility', 'passive', 'universal', 'legendary', 'inscriptor'],
        toggleable: true
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'universal_inscription',
          name: 'Universal Inscription',
          description: 'The universe itself is your canvas. All spells cost 0 resources. All your inscriptions are reality-warping.',
          customDescription: 'You have inscribed your will upon the fabric of reality itself. All your spells cost 0 mana and 0 action points. All your inscriptions, glyphs, runes, and sigils are permanent unless you dismiss them. You can place unlimited inscriptions. All inscriptions are reality-warping and cannot be dispelled by any means. You can reshape the battlefield at will.'
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
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 0,
        components: ['ritual'],
        materialComponents: 'The Universal Codex, knowledge of all inscriptions ever created'
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      resolution: 'DICE',
      tags: ['buff', 'utility', 'passive', 'universal', 'legendary', 'inscriptor', 'toggleable']
    }
  ],

  // Spell Pools by Level
  spellPools: {
    1: [
      'inscriptor_arcane_inscription'
    ],
    2: [],
    3: [],
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
      'inscriptor_universal_inscription'
    ]
  }
};


