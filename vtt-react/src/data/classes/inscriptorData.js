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

**Inscription 3 - Your Boots**: "Inscription of Haste" (+10 ft movement speed, advantage on Dex saves)
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
- **Example (Boots)**: Glowing boots icon with wind rune, "Inscription of Haste (+10 ft speed, adv on Dex saves)"

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
        ['Pants', 'Agility, Resilience, Sprint, Steadfast', 'Dexterity, damage resistance, mobility', '3-5 mana']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Pre-Combat Preparation**: If you know combat is coming, place runes in advance to save actions during battle. A prepared Inscriptor is exponentially more powerful.

**Inscription Selection**: Choose inscriptions based on anticipated threats. Facing spellcasters? Use Elemental Ward. Fighting melee enemies? Thorn Inscription punishes attackers.

**Zone Positioning**: Place runic zones where allies will fight, not where enemies start. Control the battlefield by making enemies come to you.

**Detonation Timing**: Save detonations for critical moments. The lingering effect can turn the tide, but you lose the zone permanently.

**Mana Management**: With runes, inscriptions, and spells all competing for mana, prioritize based on the situation. Long fights favor inscriptions, short fights favor immediate spell power.`
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
      description: 'Place a rune of destruction. Anyone within 5 ft deals and takes +1d6 fire damage. At 3+ runes, the entire zone doubles fire damage dealt and taken.',
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
      description: 'Place a rune of vitality. Anyone within 5 ft heals 1d6 HP per turn. At 3+ runes, the entire zone heals 2d6 HP per turn.',
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
            saveType: 'dexterity',
            effect: '2d8 piercing damage to all within 15 ft',
            description: 'Walls splinter, dealing 2d8 piercing damage (DC 15 DEX save)'
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
      description: 'Inscribe your weapon with the power of fire, causing it to deal an additional 1d8 fire damage.',
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
          description: 'Weapon deals additional 1d8 fire damage'
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
          effect: 'Teleport up to 30 ft as bonus action',
          duration: 'combat',
          description: 'Gain short-range teleportation'
        }
      },

      specialMechanics: {
        inscription: {
          enabled: true,
          slot: 'cape',
          effect: 'Teleport up to 30 ft as bonus action',
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
        saveType: 'dexterity',
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
  ]
};


