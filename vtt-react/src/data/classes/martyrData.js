/**
 * Martyr Class Data
 * 
 * Complete class information for the Martyr - a selfless protector
 * who gains power through sacrifice and devotion to their allies.
 */

export const MARTYR_DATA = {
  id: 'martyr',
  name: 'Martyr',
  icon: 'fas fa-cross',
  role: 'Support/Tank',

  // Overview section
  overview: {
    title: 'The Martyr',
    subtitle: 'Selfless Protector and Sacred Sacrifice',
    
    description: `The Martyr is a devoted protector who draws strength from unwavering faith and willingness to endure suffering for their allies. Through the Devotion Gauge mechanic, Martyrs transform pain into power, unlocking increasingly potent abilities as they take damage and perform sacrificial acts. Each wound they bear becomes a blessing for their companions.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Martyrs are driven by unshakeable conviction—whether religious faith, loyalty to a cause, or devotion to their companions. They have sworn oaths to protect others, even at the cost of their own lives. This dedication manifests as divine power that grows stronger the more they sacrifice.

Their devotion often shows physically: scars that glow with holy light, stigmata that bleed radiant energy, or an aura of serenity even in the midst of agony. At high Devotion Levels, they may appear transfigured—wreathed in golden light, bearing phantom wings, or surrounded by spectral guardians.

Common Martyr archetypes include:
- **The Penitent Knight**: Atoning for past sins through selfless service
- **The Faithful Shepherd**: Protecting their flock from all harm
- **The Oath-Bound Guardian**: Sworn to defend a person, place, or ideal
- **The Suffering Saint**: Believes pain brings them closer to the divine
- **The Living Shield**: Finds purpose in being the wall between danger and innocents

Martyrs understand that true strength comes not from avoiding pain, but from enduring it for others. They see each wound as a badge of honor, each sacrifice as a prayer made manifest.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Martyr is a hybrid support/tank class that excels at:

**Damage Mitigation**: Intercepting attacks meant for allies and redirecting harm to themselves
**Sustained Healing**: Converting their own suffering into healing power for the party
**Protective Buffs**: Granting resistance, temporary HP, and defensive bonuses
**Radiant Damage**: Channeling devotion into holy attacks against enemies

**Strengths**:
- Excellent at protecting vulnerable allies
- Scales in power as combat becomes more dangerous
- Strong sustained healing capabilities
- Can turn near-death situations into victory through high Devotion abilities
- Provides both defensive and offensive support

**Weaknesses**:
- Requires taking damage to reach full potential
- Can become overwhelmed if focused by too many enemies
- Less effective when allies are spread out
- Devotion spending requires careful resource management
- Vulnerable to burst damage before building Devotion

The Martyr shines in prolonged encounters where they can build Devotion Levels and unleash devastating amplified abilities at critical moments.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Martyr is about strategic sacrifice and resource management. Key considerations:

**Building Devotion**:
- Take damage naturally through combat (10/20/40/60/80/100 damage thresholds)
- Use Martyr's Intervene to protect allies and advance Devotion faster
- Some spells inflict self-damage to build Devotion while providing benefits
- Balance building Devotion with staying alive

**Devotion Level Strategy**:
- **Level 1-2 (Building Phase)**: Basic defensive benefits, focus on accumulating damage
- **Level 3-4 (Power Phase)**: Strong passive effects, moderate amplification power
- **Level 5-6 (Peak Phase)**: Powerful auras and devastating amplified abilities

**Spending Devotion**:
- Amplified spells cost 1-5 Devotion Levels for enhanced effects
- Save high Devotion for critical moments (boss fights, emergencies)
- Consider whether passive benefits outweigh active spending
- Some situations require immediate amplified healing over passive bonuses

**Specialization Synergies**:
- **Redemption**: Maximum healing and protection, defensive playstyle
- **Zealot**: Aggressive damage-dealing through suffering, offensive support
- **Ascetic**: Balanced endurance, maintains high Devotion efficiently

**Team Dynamics**:
- Position near vulnerable allies to use Intervene effectively
- Coordinate with tanks to share damage absorption duties
- Communicate Devotion Levels so team knows when big abilities are ready
- Synergizes with classes that benefit from resistance and temp HP buffs`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Sacred Sacrifice',
      content: `**The Setup**: You're a Martyr (Redemption specialization) and your party is fighting a demon lord and its minions (1 demon lord + 3 lesser demons). Your party's mage is low on HP and about to be attacked. Starting HP: 100/100. Devotion Level: 0 (no damage taken yet). Starting Mana: 50/60. Your goal: Build Devotion by taking damage, protect your allies, and unleash amplified healing at critical moments.

**Starting State**: HP: 100/100 | Devotion Level: 0 (0 damage taken) | Mana: 50/60

**DEVOTION LEVEL 0 (0 damage taken)**

**Turn 1 - First Sacrifice (HP: 100 → 85, Devotion: 0 → 1)**

*The demon lord roars, and a lesser demon charges your mage. She's at 20 HP—one hit will kill her. You step between them.*

**Your Action**: Martyr's Intervene (reaction, no mana cost)
**Effect**: Redirect attack from ally to yourself

*You raise your shield. "Strike me instead!" The demon's claws rake across your armor.*

**Demon's Attack**: Redirected to you → [18] → Hit! → 2d8+5 → [7, 8] + 5 = **20 damage**
**Your HP**: 100 - 20 = 80/100
**Total Damage Taken**: 20 damage

**Devotion Check**: 20 damage taken ≥ 10 damage threshold → **Devotion Level 1 achieved!**

*Golden light flares around you. Your first wound glows with radiant energy. You feel the divine power awakening.*

**Devotion Level**: 0 → **1**
**Passive Benefit (Level 1)**: +1 AC to all allies within 10 ft

**Your Party's Mage**: "You... you took that hit for me."
**You**: "That's what I'm here for. My pain is your protection."

**Current State**: HP: 80/100 | Devotion Level: 1 (20 damage) | Mana: 50/60

**Turn 2 - Building Devotion (HP: 80 → 60, Devotion: 1 → 2)**

*Two lesser demons attack you. Good. Let them come.*

**Lesser Demon #1's Turn**: Attacks you → [16] → Hit! → 1d10+3 → [7] + 3 = **10 damage**
**Your HP**: 80 - 10 = 70/100
**Total Damage Taken**: 20 + 10 = 30 damage

**Lesser Demon #2's Turn**: Attacks you → [17] → Hit! → 1d10+3 → [8] + 3 = **11 damage**
**Your HP**: 70 - 11 = 59/100
**Total Damage Taken**: 30 + 11 = 41 damage

**Devotion Check**: 41 damage ≥ 40 damage threshold → **Devotion Level 2 achieved!**

*More wounds. More light. Your scars glow brighter. The divine power SURGES.*

**Devotion Level**: 1 → **2**
**Passive Benefit (Level 2)**: +1 AC to allies + Allies within 10 ft gain resistance to first damage type taken

**Your Action**: Cast "Sacred Shield" on your mage (6 mana)
**Effect**: Grant 15 temporary HP

*You extend your hand. Golden light flows from your wounds to your mage, forming a protective barrier.*

**Mana**: 50 - 6 = 44/60

**Your Party's Mage**: "I can feel your protection. Thank you."

**Current State**: HP: 59/100 | Devotion Level: 2 (41 damage) | Mana: 44/60

**Turn 3 - Reaching Peak Devotion (HP: 59 → 39, Devotion: 2 → 3)**

*The demon lord strikes you with a massive flaming sword.*

**Demon Lord's Turn**: Attacks you → [19] → Hit! → 3d10+6 fire → [8, 9, 7] + 6 = **30 fire damage**
**Your HP**: 59 - 30 = 29/100
**Total Damage Taken**: 41 + 30 = 71 damage

**Devotion Check**: 71 damage ≥ 60 damage threshold → **Devotion Level 3 achieved!**

*You fall to one knee, bleeding. But the light around you is BLINDING. Your wounds are RADIANT. You've never felt more powerful.*

**Devotion Level**: 2 → **3**
**Passive Benefit (Level 3)**: +2 AC to allies + Resistance to first damage type + Allies heal 1d6 HP per turn within 10 ft

**Your Party's Tank**: "You're glowing like the sun! Are you okay?"
**You**: "I'm at 29 HP. But I'm at Devotion Level 3. I can save us all now."

**Your Action**: Cast "Radiant Burst" at Demon Lord (8 mana)
**Attack Roll**: d20+5 → [16] = Hit!
**Damage**: 3d8 radiant → [7, 6, 8] = **21 radiant damage**

*Holy light erupts from your wounds, striking the demon lord.*

**Mana**: 44 - 8 = 36/60

**Current State**: HP: 29/100 | Devotion Level: 3 (71 damage) | Mana: 36/60

**Turn 4 - Amplified Healing (HP: 29 → 24, Devotion: 3 → 1)**

*You're at 29 HP. Your party's mage is at 20 HP. Your tank is at 40 HP. Time to HEAL.*

**Your Action**: Cast "Mass Healing Prayer" AMPLIFIED (12 mana + 2 Devotion Levels)

*You raise your arms. Your wounds BLAZE with golden light. The radiance flows outward, healing everyone.*

**Amplification Cost**: 2 Devotion Levels
**Devotion Level**: 3 - 2 = **1**

**Base Healing**: 3d8 to all allies → [6, 7, 8] = 21 HP to each ally
**Amplification Bonus**: +2d8 per Devotion Level spent (2 levels) = +4d8 → [7, 6, 8, 5] = +26 HP
**Total Healing**: 21 + 26 = **47 HP to each ally!**

*Your party is BATHED in golden light. Wounds close. Strength returns.*

**Your HP**: 29 + 47 = 76/100
**Your Party's Mage**: 20 + 47 = 67/70
**Your Party's Tank**: 40 + 47 = 87/90

**Mana**: 36 - 12 = 24/60

**Self-Damage (Amplified Spell Cost)**: Amplified spells inflict 1d6 self-damage per Devotion Level spent
**Self-Damage Roll**: 2d6 (2 Devotion Levels) → [3, 2] = **5 damage**
**Your HP**: 76 - 5 = 71/100
**Total Damage Taken**: 71 + 5 = 76 damage

*You stagger from the self-inflicted pain. But your party is healed. Worth it.*

**Devotion Check**: 76 damage ≥ 60 threshold → Still at Devotion Level 1 (lost 2 levels from spending, but still above 60 damage total)

**Current State**: HP: 71/100 | Devotion Level: 1 (76 damage) | Mana: 24/60

**Turn 5 - Finishing the Fight**

*Your party is healed. The demon lord is wounded. Time to finish this.*

**Your Party's Mage**: Casts Fireball at Demon Lord → 45 damage → Demon Lord DEAD
**Your Party's Tank**: Attacks Lesser Demon #1 → DEAD
**Your Party's Rogue**: Sneak attacks Lesser Demon #2 → DEAD

**Lesser Demon #3's Turn**: Attacks you → [15] → Hit! → 1d10+3 → [6] + 3 = **9 damage**
**Your HP**: 71 - 9 = 62/100
**Total Damage Taken**: 76 + 9 = 85 damage

**Devotion Check**: 85 damage ≥ 80 threshold → **Devotion Level 4 achieved!**

*Even more light. Your wounds are like stars.*

**Devotion Level**: 1 → **4**

**Your Action**: Cast "Smite" at Lesser Demon #3 (6 mana)
**Attack Roll**: d20+5 → [18] = Hit!
**Damage**: 2d10 radiant → [9, 8] = **17 radiant damage**
**Result**: Lesser Demon #3 DEAD

**Combat Over**

*You stand among the demon corpses, bleeding but victorious. Your wounds glow with fading golden light.*

**Your Party's Mage**: "You healed me for FORTY-SEVEN HP. How?"
**You**: "I spent 2 Devotion Levels to amplify Mass Healing Prayer. Base healing was 21 HP, amplification added +26 HP. Total 47 HP to everyone."
**Your Party's Tank**: "But you took damage from it?"
**You**: "Amplified spells cost self-damage. 1d6 per Devotion Level spent. I took 5 damage. Small price for saving the party."
**Your Party's Rogue**: "You took 85 damage total. You're at Devotion Level 4 now."
**You**: "Every wound is a blessing. Every sacrifice brings me closer to the divine. That's the Martyr's way."

**Final State**: HP: 62/100 | Devotion Level: 4 (85 damage) | Mana: 18/60

**The Lesson**: Martyr gameplay is about:
1. **Building Devotion**: Took 85 damage total, reached Devotion Level 4 (thresholds: 10/20/40/60/80/100)
2. **Martyr's Intervene**: Redirected attack from mage to yourself Turn 1, gained 20 damage toward Devotion
3. **Passive Benefits**: Devotion Level 3 gave +2 AC to allies, resistance to first damage type, 1d6 HP regen per turn
4. **Amplified Healing**: Spent 2 Devotion Levels to amplify Mass Healing Prayer: 21 HP → 47 HP (+26 from amplification)
5. **Self-Damage Cost**: Amplified spell cost 2d6 self-damage (5 damage), but healed party for 47 HP each
6. **Resource Management**: Spent 2 Devotion Levels (3 → 1) for critical healing, then rebuilt to Level 4
7. **Damage Thresholds**: 10 (Level 1) → 20 (Level 2) → 40 (Level 3) → 60 (Level 4) → 80 (Level 5) → 100 (Level 6)

You're not a traditional healer. You're a LIVING SACRIFICE. You WANT to take damage because it builds Devotion. You intercept attacks meant for allies. You endure suffering. And when your Devotion is high, you unleash AMPLIFIED abilities that can turn the tide of battle. The key is balancing building Devotion (taking damage) with spending it (amplified spells). Save high Devotion for critical moments—when your party needs massive healing or devastating attacks. Your wounds are your power. Your pain is their salvation.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Devotion Gauge',
    subtitle: 'Power Through Sacrifice',

    description: `The Devotion Gauge represents the Martyr's accumulated suffering and unwavering faith. As they endure pain and protect their allies, their devotion deepens, unlocking powerful passive effects and enabling them to amplify their spells with divine energy.`,

    resourceBarExplanation: {
      title: 'Understanding Your Devotion Gauge',
      content: `**What You See**: The Devotion Gauge displays as a vertical bar with 6 glowing levels, each representing a tier of divine power unlocked through suffering. As you take damage, the levels fill with radiant golden light, and your character model glows brighter with each level achieved.

**DEVOTION GAUGE DISPLAY** (Vertical Bar):

**Gauge Layout**:
- **6 Levels Stacked Vertically**: Each level is a segment of the bar
- **Current Level Highlighted**: Active level glows brightly
- **Inactive Levels**: Grayed out, waiting to be unlocked
- **Damage Counter**: Shows total damage taken (e.g., "85/100 damage")
- **Next Threshold**: Shows damage needed for next level (e.g., "15 damage to Level 5")

**Devotion Level Visualization**:

**Level 0 (Starting State - 0 damage)**:
- **Bar**: Empty, dark gray
- **Character**: Normal appearance, no glow
- **Status**: "Devotion Level 0 - Mortal Resolve"
- **Passive**: None
- **Border**: Gray

**Level 1 (10 damage taken)**:
- **Bar**: First segment fills with faint golden glow
- **Character**: Faint shimmer around body
- **Status**: "Devotion Level 1 - Flickering Faith"
- **Passive**: "Gain 5 temp HP when ally within 5 ft takes damage"
- **Border**: White
- **Visual Effect**: Small golden particles around character

**Level 2 (20 damage taken)**:
- **Bar**: Second segment fills, brighter glow
- **Character**: Wounds begin to glow faintly
- **Status**: "Devotion Level 2 - Steadfast Conviction"
- **Passive**: "All healing +5 HP"
- **Border**: Light blue
- **Visual Effect**: Wounds have faint golden outline

**Level 3 (40 damage taken)**:
- **Bar**: Third segment fills, moderate radiance
- **Character**: Noticeable golden aura, wounds glow brightly
- **Status**: "Devotion Level 3 - Radiant Sacrifice"
- **Passive**: "Allies within 10 ft gain +1 AC"
- **Border**: Blue
- **Visual Effect**: Golden aura extends 10 ft, allies have faint protective shimmer
- **Audio**: Soft angelic choir hum

**Level 4 (60 damage taken)**:
- **Bar**: Fourth segment fills, bright radiance
- **Character**: Strong golden glow, stigmata appear (glowing wounds on hands/feet)
- **Status**: "Devotion Level 4 - Divine Ascendance"
- **Passive**: "Advantage on all saving throws"
- **Border**: Green
- **Visual Effect**: Stigmata glow intensely, character surrounded by swirling golden light
- **Audio**: Louder angelic choir

**Level 5 (80 damage taken)**:
- **Bar**: Fifth segment fills, intense radiance
- **Character**: BLAZING with golden light, phantom wings appear
- **Status**: "Devotion Level 5 - Holy Martyrdom"
- **Passive**: "+10 radiant damage on all attacks"
- **Border**: Gold
- **Visual Effect**: Translucent golden wings, radiant aura pulses, wounds are like stars
- **Audio**: Powerful angelic choir, bell chimes

**Level 6 (100 damage taken - MAXIMUM)**:
- **Bar**: ALL segments filled, MAXIMUM radiance, pulsing
- **Character**: TRANSFIGURED - wreathed in blinding golden light, full angelic wings, halo appears
- **Status**: "Devotion Level 6 - CELESTIAL PROTECTOR"
- **Passive**: "Allies within 15 ft gain resistance to ALL damage types"
- **Border**: Brilliant gold, pulsing
- **Visual Effect**: Character appears almost divine, massive golden aura, allies within 15 ft have golden shields
- **Audio**: Triumphant angelic chorus, continuous bell ringing
- **Screen Effect**: Slight golden tint to screen, radiant particles everywhere

**Damage Accumulation Animation**:
When you take damage:
- **Damage Number**: "-20 HP" appears above you in red
- **Gauge Fill**: Devotion bar fills proportionally to damage taken
- **Progress Indicator**: "20/40 damage to Level 3" updates
- **Audio**: Soft chime as damage accumulates

**Level Up Animation**:
When you reach a new Devotion Level:
- **Screen Flash**: Brief golden flash
- **Gauge Segment**: New level segment LIGHTS UP with radiant glow
- **Character Transformation**: New visual effects appear (glow intensifies, wings appear, etc.)
- **Text Notification**: "DEVOTION LEVEL 3 ACHIEVED - Radiant Sacrifice"
- **Passive Activation**: "NEW PASSIVE: Allies within 10 ft gain +1 AC"
- **Audio**: Dramatic bell chime, angelic choir surge
- **Particle Burst**: Golden light explodes from character

**Martyr's Intervene Animation**:
When you use Martyr's Intervene:
- **Movement**: You DASH to ally's position (up to 10 ft)
- **Shield Raise**: You raise shield/arms to intercept attack
- **Damage Redirect**: Attack hits you instead of ally, damage number appears on you
- **Devotion Gain**: "+1 Devotion Level (Intervene)" notification
- **Gauge Update**: Devotion bar jumps up one full level
- **Audio**: Shield impact sound, protective chime
- **Visual**: Golden barrier briefly appears between you and ally

**Amplified Spell Interface**:
When you have Devotion Levels to spend:
- **Spell Buttons**: Show amplification option "Mass Healing Prayer (12 mana + 2 Devotion)"
- **Cost Display**: "Spend 2 Devotion Levels for +4d8 healing"
- **Warning**: "⚠️ Will reduce Devotion Level 3 → 1"
- **Passive Loss Warning**: "You will lose: +1 AC aura"

**Amplified Spell Cast Animation**:
When you cast an amplified spell:
- **Devotion Drain**: Devotion bar segments DRAIN (e.g., Level 3 → Level 1, two segments dim)
- **Energy Release**: Massive burst of golden light from character
- **Spell Amplification**: Spell effect is LARGER and BRIGHTER
- **Healing Numbers**: "47 HP healed!" appears on all allies in gold
- **Self-Damage**: "-5 HP (Amplification Cost)" appears on you in red
- **Audio**: Powerful spell sound + angelic chorus surge
- **Text Notification**: "AMPLIFIED: Mass Healing Prayer (spent 2 Devotion Levels)"

**Passive Effect Indicators**:
Active passive effects are shown as buff icons:

**Level 1**: Shield icon "5 temp HP when ally hit"
**Level 2**: Cross icon "Healing +5 HP"
**Level 3**: Aura icon "+1 AC to allies (10 ft)"
**Level 4**: Star icon "Advantage on saves"
**Level 5**: Sword icon "+10 radiant damage"
**Level 6**: Wings icon "Allies resist ALL damage (15 ft)"

**Ally Benefit Visualization**:
When allies are affected by your Devotion passives:
- **Level 3 (+1 AC)**: Allies within 10 ft have faint golden shimmer, "+1 AC (Martyr)" buff icon
- **Level 6 (Resistance)**: Allies within 15 ft have golden shields, "Resist ALL (Martyr)" buff icon
- **Range Indicator**: 10 ft or 15 ft radius circle shown on ground around you

**Damage Threshold Progress Bar**:
Below the Devotion Gauge:
- **Current Damage**: "85 damage taken"
- **Next Threshold**: "15 damage to Level 5 (80 threshold)"
- **Progress Bar**: Visual bar showing 85/100 progress
- **Color Coding**: Green (safe), yellow (moderate), red (critical HP but high Devotion)

**Spending Decision Interface**:
When considering amplified spell:
- **Current State**: "Devotion Level 4 - Divine Ascendance"
- **Spell Cost**: "Spend 2 Devotion Levels"
- **Result**: "Will be Devotion Level 2 - Steadfast Conviction"
- **Passive Loss**: "Will lose: +1 AC aura, Advantage on saves"
- **Passive Kept**: "Will keep: Healing +5 HP"
- **Confirm Button**: "AMPLIFY SPELL (2 Devotion)"

**Why This Matters**: The Devotion Gauge makes you FEEL like a living sacrifice. When you take 20 damage and the first segment LIGHTS UP with golden glow, you see "Devotion Level 1 - Flickering Faith" and your character starts to shimmer. When you reach Level 3 and your wounds begin to GLOW, you see the "+1 AC to allies" buff appear on your party members—your suffering is PROTECTING them. When you hit Level 6 at 100 damage and your character TRANSFORMS with angelic wings and a halo, the "Allies resist ALL damage" notification appears, and you see golden shields on your entire party—you've become a CELESTIAL PROTECTOR. The amplified spell interface makes the decision clear: spend 2 Devotion Levels for massive healing, but lose your passive benefits. When you cast that amplified Mass Healing Prayer and see "47 HP healed!" on all allies, you KNOW the sacrifice was worth it. Every wound is power. Every sacrifice is salvation.`
    },

    mechanics: {
      title: 'How It Works',
      content: `**Starting State**: All Martyrs begin combat at Devotion Level 0

**Building Devotion**:
- **Taking Damage**: Accumulate damage to reach thresholds (10/20/40/60/80/100)
- **Martyr's Intervene**: Rush in front of an ally to take damage meant for them (advances 1 level per use)
- **Self-Sacrifice Spells**: Some spells inflict self-damage to build Devotion while providing benefits
- **Damage Tracking**: Total damage taken persists through combat to track Devotion Level

**Devotion Levels**: Six levels (1-6), each with unique passive effects
**Level Persistence**: Devotion Levels persist between combats until you rest or are fully healed
**Maximum Level**: Devotion Level 6 is the maximum

**Passive Effects**: Each Devotion Level grants a permanent passive benefit while at that level
**Amplified Spells**: Spend Devotion Levels to cast enhanced versions of spells
**Spending Devotion**: Using amplified abilities reduces your Devotion Level by the cost (1-5 levels)

**Martyr's Intervene**: 
As a reaction, rush in front of an ally within 10 feet who is about to take damage, taking the damage instead. This action increases the Devotion Gauge by 1 level each time it is used, regardless of damage amount.`
    },
    
    devotionLevelsTable: {
      title: 'Devotion Gauge: Level Effects',
      headers: ['Level', 'Accumulation Requirement', 'Passive Effect', 'Thematic Identity'],
      rows: [
        ['0', 'Starting state', 'None', 'Mortal Resolve'],
        ['1', '10 damage taken OR 1 Intervene', 'Gain 5 temporary HP when an ally within 5 feet takes damage', 'Flickering Faith'],
        ['2', '20 damage taken OR 2 Intervenes', 'All healing effects you perform are increased by 5 HP', 'Steadfast Conviction'],
        ['3', '40 damage taken OR 3 Intervenes', 'All allies within 10 feet gain +1 to their AC', 'Radiant Sacrifice'],
        ['4', '60 damage taken OR 4 Intervenes', 'You gain advantage on all saving throws', 'Divine Ascendance'],
        ['5', '80 damage taken OR 5 Intervenes', 'Deal 10 additional radiant damage on all attacks', 'Holy Martyrdom'],
        ['6', '100 damage taken OR 6 Intervenes', 'All allies within 15 feet gain resistance to all damage types', 'Celestial Protector']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**Devotion 0-2 (Building Phase)**: Focus on taking damage and using Intervene to build Devotion quickly. Passive benefits are minimal, prioritize accumulation.
**Devotion 3-4 (Power Phase)**: Strong passive benefits active (damage reduction, radiant damage). Good time for amplified healing and moderate power spells.
**Devotion 5-6 (Peak Phase)**: Maximum power with aura effects. Decide whether to maintain passives or spend on ultimate amplified abilities.

**Intervene Strategy**: 
- Use proactively to protect squishy allies (mages, healers)
- Fastest way to build Devotion (1 level per use regardless of damage)
- Requires positioning within 10 feet of allies
- Can advance from Level 1 to Level 2 even if you've only taken 11 damage total

**Amplified Spell Timing**:
- Save 3-5 Devotion spending for boss fights and emergencies
- Use 1-2 Devotion spends more liberally for tactical advantages
- Consider passive loss when spending (losing Level 6 resistance aura is significant)
- Some amplified effects are worth more than passive benefits in critical moments

**Self-Damage Spells**:
- Penance of Pain, Purifying Pain, and similar spells build Devotion while helping allies
- Calculate whether self-damage is worth the Devotion gain and healing output
- Synergizes with Redemption spec's healing bonuses
- Risk vs reward: don't kill yourself building Devotion`
    },

    playingInPerson: {
      title: 'Playing Martyr In Person',
      content: `**Required Materials**:
- **6 Devotion Level Tokens** (gold/white tokens, coins, or beads)
- **Damage Counter** (d100 or paper tracker)
- **Devotion Level Card** (reference card showing passive effects)
- **Amplified Spell Cards** (optional, for tracking available amplifications)
- **Intervene Tracker** (optional, for counting Intervene uses)

**Primary Tracking Method: Devotion Level Tokens**

The Martyr's Devotion Gauge is tracked using 6 physical tokens arranged vertically to represent the 6 Devotion Levels. As you take damage and use Intervene, you activate tokens from bottom to top, each unlocking powerful passive effects.

**Setup**:
\`\`\`
DEVOTION GAUGE (Vertical Stack):

[6] ○ - Level 6: Celestial Protector (100 dmg / 6 Intervenes)
[5] ○ - Level 5: Holy Martyrdom (80 dmg / 5 Intervenes)
[4] ○ - Level 4: Divine Ascendance (60 dmg / 4 Intervenes)
[3] ○ - Level 3: Radiant Sacrifice (40 dmg / 3 Intervenes)
[2] ○ - Level 2: Steadfast Conviction (20 dmg / 2 Intervenes)
[1] ○ - Level 1: Flickering Faith (10 dmg / 1 Intervene)

DAMAGE TAKEN: [___] / 100
INTERVENE COUNT: [___]
\`\`\`

**How It Works**:

**Building Devotion Through Damage**:
1. Track total damage taken on a d100 or paper
2. When you reach a threshold (10/20/40/60/80/100), flip the corresponding token to "active"
3. Active tokens glow (face up), inactive tokens are dark (face down)
4. Each active token grants its passive effect immediately

**Building Devotion Through Intervene**:
1. When you use Martyr's Intervene (take damage for an ally), mark it
2. Each Intervene use advances Devotion by 1 level regardless of damage
3. Flip the next token to "active"
4. This is the fastest way to build Devotion

**Example Devotion Building**:

*Starting: 0 damage, Level 0, all tokens face down*

**Turn 1**: Take 12 damage from orc attack
- Damage: 12/100
- Flip token [1] face up → **Level 1: Flickering Faith**
- **Passive Active**: Gain 5 temp HP when ally within 5 ft takes damage

**Turn 2**: Use Intervene to protect mage from goblin attack (take 8 damage)
- Damage: 20/100
- Intervene Count: 1
- Flip token [2] face up → **Level 2: Steadfast Conviction**
- **Passive Active**: All healing +5 HP

**Turn 3**: Take 25 damage from troll smash
- Damage: 45/100
- Flip token [3] face up → **Level 3: Radiant Sacrifice**
- **Passive Active**: Allies within 10 ft gain +1 AC

**Turn 4**: Use Intervene to protect rogue (take 10 damage)
- Damage: 55/100
- Intervene Count: 2
- Flip token [4] face up → **Level 4: Divine Ascendance**
- **Passive Active**: Advantage on all saving throws

**Current State**: Level 4, 55 damage taken, 4 passive effects active

**Spending Devotion for Amplified Spells**:

When you cast an amplified spell, you spend Devotion Levels by flipping tokens back to "inactive" (face down):

**Example Amplified Spell**:
- You're at Level 4 (4 tokens active)
- Cast "Amplified Divine Healing" (costs 3 Devotion Levels)
- Flip tokens [4], [3], [2] face down → Now at Level 1
- Lose passives from Levels 2-4, keep Level 1 passive
- Spell heals for 6d8 + 15 HP (instead of normal 3d8)

**Alternative Tracking Methods**:

**Method 1: Vertical Token Stack**
- Stack 6 tokens vertically
- Add tokens to the stack as you gain Devotion Levels
- Remove from top when spending Devotion
- Visual height shows current power level

**Method 2: Devotion Dial**
- Use a d6 or spinner to show current Devotion Level
- Rotate up as you gain levels, down as you spend
- Quick and simple, but doesn't show damage taken

**Method 3: Damage Tracker + Level Card**
- Track damage on d100 or paper
- Reference card shows which level you're at
- Check off Intervene uses separately
- Minimalist approach

**Devotion Level Reference Card**:
\`\`\`
MARTYR DEVOTION LEVELS

LEVEL 1 (10 dmg / 1 Intervene):
Passive: +5 temp HP when ally within 5 ft takes damage

LEVEL 2 (20 dmg / 2 Intervenes):
Passive: All healing +5 HP

LEVEL 3 (40 dmg / 3 Intervenes):
Passive: Allies within 10 ft gain +1 AC

LEVEL 4 (60 dmg / 4 Intervenes):
Passive: Advantage on all saving throws

LEVEL 5 (80 dmg / 5 Intervenes):
Passive: +10 radiant damage on all attacks

LEVEL 6 (100 dmg / 6 Intervenes):
Passive: Allies within 15 ft gain resistance to all damage

AMPLIFIED SPELL COSTS:
• Minor Amplification: 1-2 Devotion Levels
• Moderate Amplification: 3-4 Devotion Levels
• Major Amplification: 5-6 Devotion Levels
\`\`\`

**Example In-Person Turn**:

*You're at Devotion Level 2 (25 damage taken), fighting alongside your party*

**Turn 1 - Intervene**:
1. "The dragon breathes fire at our mage! I use Martyr's Intervene!"
2. Take 30 damage for the mage → Total damage: 55
3. Intervene Count: 1
4. Flip token [3] face up → **Level 3**
5. Announce: "I'm now at Devotion Level 3! All allies within 10 feet gain +1 AC!"

**Turn 2 - Build More Devotion**:
1. Troll attacks you directly → Take 18 damage
2. Total damage: 73
3. Flip token [4] face up → **Level 4**
4. Announce: "Devotion Level 4! I have advantage on all saving throws!"

**Turn 3 - Amplified Healing**:
1. "Our tank is at 15 HP! I cast Amplified Divine Healing for 3 Devotion Levels!"
2. Flip tokens [4], [3], [2] face down → Back to Level 1
3. Roll healing: 6d8 + 15 → [6, 7, 5, 8, 4, 6] + 15 = 51 HP healed!
4. Announce: "I'm back to Level 1, but our tank is fully healed!"

**Quick Reference Card Template**:
\`\`\`
MARTYR QUICK REFERENCE

DEVOTION BUILDING:
• Take Damage: Track total, gain levels at thresholds
• Use Intervene: +1 level per use (fastest method)
• Self-Damage Spells: Some spells hurt you to build Devotion

DEVOTION THRESHOLDS:
Level 1: 10 damage OR 1 Intervene
Level 2: 20 damage OR 2 Intervenes
Level 3: 40 damage OR 3 Intervenes
Level 4: 60 damage OR 4 Intervenes
Level 5: 80 damage OR 5 Intervenes
Level 6: 100 damage OR 6 Intervenes

AMPLIFIED SPELL STRATEGY:
• Save 3+ levels for emergencies
• Spend 1-2 levels for tactical advantages
• Consider passive loss when spending
• High Devotion = game-changing amplifications

INTERVENE ABILITY:
• Reaction: Rush to ally within 10 ft
• Take damage meant for them
• Instantly gain +1 Devotion Level
• Fastest way to build power
\`\`\`

**Thematic Enhancements**:

Many players enhance the Martyr experience with:
- **Golden Tokens**: Use gold coins or beads for Devotion Levels
- **Glowing Dice**: LED dice that light up when at high Devotion
- **Stigmata Markers**: Small red markers to show wounds taken
- **Holy Symbol**: Keep a cross or holy symbol on the table
- **Radiant Aura**: LED tea light that brightens at high Devotion
- **Sacrifice Counter**: Tally marks for each Intervene use

**Devotion Management Tips**:

**Building Strategy**:
- **Intervene Aggressively**: Fastest way to build Devotion (1 level per use)
- **Position Near Allies**: Stay within 10 ft to use Intervene
- **Accept Damage**: Don't dodge attacks, let them hit to build Devotion
- **Self-Damage Spells**: Use Penance of Pain to build while healing allies

**Spending Strategy**:
- **Save for Emergencies**: Keep 4+ levels for critical moments
- **Tactical Spending**: Use 1-2 levels for moderate advantages
- **Passive Awareness**: Know what you lose when spending
- **Boss Fights**: Build to Level 6, then unleash massive amplifications

**Passive Effect Tracking**:

**Level 1 Active**:
- When ally within 5 ft takes damage, you gain 5 temp HP
- Track temp HP separately from regular HP

**Level 2 Active**:
- All healing +5 HP (add to every heal you cast)
- Announce bonus when healing

**Level 3 Active**:
- Allies within 10 ft gain +1 AC
- Remind allies of bonus when they're attacked

**Level 4 Active**:
- You have advantage on all saves
- Roll 2d20 for every saving throw

**Level 5 Active**:
- +10 radiant damage on all attacks
- Add to every weapon attack or spell attack

**Level 6 Active**:
- Allies within 15 ft gain resistance to all damage
- Halve all damage allies take (huge defensive aura)

**Example Full Combat Sequence**:

*Starting: 0 damage, Level 0*

**Turn 1**: Take 15 damage → Level 1 (temp HP when ally hit)
**Turn 2**: Intervene for mage → Level 2 (all healing +5)
**Turn 3**: Take 25 damage → Level 3 (allies +1 AC)
**Turn 4**: Intervene for rogue → Level 4 (advantage on saves)
**Turn 5**: Take 22 damage → Level 5 (+10 radiant damage)
**Turn 6**: Intervene for tank → Level 6 (allies resist all damage)
**Turn 7**: Cast Amplified Divine Smite (5 Devotion) → 10d8 radiant damage!
**Result**: Back to Level 1, but boss takes massive damage!

**Visual Organization**:

**Devotion Display Layout**:
\`\`\`
DEVOTION GAUGE: [●][●][●][○][○][○] (Level 3)

ACTIVE PASSIVES:
✓ Level 1: +5 temp HP when ally hit
✓ Level 2: All healing +5 HP
✓ Level 3: Allies within 10 ft +1 AC

DAMAGE TAKEN: 45/100
INTERVENE COUNT: 1
\`\`\`

**Battlefield Tracking**:
- **Devotion Tokens**: Vertical stack showing current level
- **Damage Counter**: d100 or paper showing total damage
- **Intervene Tally**: Mark each Intervene use
- **Passive Reminder**: Card showing active passive effects

**Why This System Works**: The physical act of flipping tokens as you take damage creates a visceral connection to the Martyr's theme of gaining power through suffering. Each token represents a wound endured, a sacrifice made, a step closer to divine transcendence. The vertical stack visually shows your growing power, and the decision to spend Devotion (flipping tokens back down) feels meaningful—you're literally giving up accumulated power for a critical moment. The system is simple enough to track mid-combat but deep enough to create strategic decisions about when to build and when to spend.

**Pro Tips**:
- **Intervene Early**: Use Intervene in first 3 turns to build Devotion fast
- **Communicate Levels**: Tell party when you reach Level 3+ (defensive auras)
- **Save Level 6**: Resistance aura is incredibly powerful, don't spend lightly
- **Track Passives**: Keep reference card visible so you don't forget bonuses
- **Amplification Timing**: Use big amplifications when they'll turn the tide
- **Specialization Synergy**: Redemption = healing focus, Zealot = damage focus, Ascetic = Devotion efficiency

**Budget-Friendly Alternatives**:
- **No tokens?** Use coins, buttons, or dice to mark levels
- **No damage counter?** Just write damage total on paper
- **No reference card?** Write passive effects on index card
- **Minimalist**: Track damage and level number only, reference passives as needed

**Specialization-Specific Tracking**:

**Redemption**:
- When you Intervene, heal protected ally for 2d6 HP
- Roll 2d6 and announce healing when using Intervene
- All healing spells have +10 ft range

**Zealot**:
- Deal +1d6 radiant damage per Devotion Level
- At Level 4, add 4d6 radiant to attacks
- Track radiant damage dice separately

**Ascetic**:
- Devotion thresholds reduced by 10 damage each
- Level 1 at 0 damage, Level 2 at 10, Level 3 at 30, etc.
- Reach high Devotion faster, adjust token flipping accordingly

**Why Martyr Is Perfect for In-Person Play**: The class is built around a simple, tangible resource (Devotion Levels) that directly correlates to damage taken—something already tracked in every TTRPG. The vertical token stack creates a visual representation of your growing power, and the dramatic moment of spending high Devotion for a massive amplified spell (removing multiple tokens at once) is incredibly satisfying. The passive effects are easy to remember and apply, and the Intervene mechanic creates heroic moments where you literally throw yourself in front of danger to protect allies. Every wound you bear is visible in your Devotion stack, making the Martyr's theme of "power through sacrifice" tangible and memorable.`
    }
  },

  // Specializations
  specializations: {
    title: 'Martyr Specializations',
    subtitle: 'Three Paths of Sacred Sacrifice',
    
    description: `Every Martyr chooses one of three specializations that define their approach to devotion and sacrifice. Each specialization offers unique passive abilities and influences your spell selection and playstyle.`,
    
    specs: [
      {
        id: 'redemption',
        name: 'Redemption',
        icon: 'spell_holy_holybolt',
        color: '#FFD700',
        theme: 'Healing Through Sacrifice',
        
        description: `Redemption Martyrs are the ultimate healers and protectors, converting their own suffering into powerful restorative magic. They excel at keeping allies alive through sustained healing and protective buffs, willingly bearing wounds so others may live.`,
        
        playstyle: 'Defensive support, maximum healing output, protective buffs',
        
        strengths: [
          'Highest healing output of all Martyr specs',
          'Enhanced protective abilities',
          'Excellent at keeping allies alive in prolonged fights',
          'Amplified healing spells are extremely potent'
        ],
        
        weaknesses: [
          'Lowest damage output',
          'Requires allies to protect to be effective',
          'Less useful when fighting alone',
          'Heavily reliant on positioning near allies'
        ],
        
        passiveAbilities: [
          {
            name: 'Sacred Devotion',
            tier: 'Path Passive',
            description: 'When you reach Devotion Level 3 or higher, your next healing spell heals for an additional 1d6 HP.',
            sharedBy: 'All Martyrs'
          },
          {
            name: 'Redemptive Grace',
            tier: 'Specialization Passive',
            description: 'Whenever you use Martyr\'s Intervene, you heal the protected ally for 2d6 HP. Additionally, all healing spells you cast have their range increased by 10 feet.',
            uniqueTo: 'Redemption'
          }
        ],
        
        recommendedFor: 'Players who enjoy pure support roles, keeping allies alive, and selfless protection'
      },
      
      {
        id: 'zealot',
        name: 'Zealot',
        icon: 'spell_holy_crusaderstrike',
        color: '#DC143C',
        theme: 'Righteous Fury',
        
        description: `Zealot Martyrs channel their suffering into devastating radiant attacks. They believe that pain purifies and empowers, using their wounds as fuel for holy vengeance. The more they suffer, the more destructive their righteous fury becomes.`,
        
        playstyle: 'Aggressive support, radiant damage, offensive buffs',
        
        strengths: [
          'Highest damage output of all Martyr specs',
          'Converts self-damage into offensive power',
          'Strong radiant damage scaling with Devotion',
          'Excellent at eliminating priority targets'
        ],
        
        weaknesses: [
          'Lower healing output than Redemption',
          'More vulnerable due to aggressive playstyle',
          'Requires balancing offense with survival',
          'Less effective at pure protection'
        ],
        
        passiveAbilities: [
          {
            name: 'Sacred Devotion',
            tier: 'Path Passive',
            description: 'When you reach Devotion Level 3 or higher, your next healing spell heals for an additional 1d6 HP.',
            sharedBy: 'All Martyrs'
          },
          {
            name: 'Zealous Wrath',
            tier: 'Specialization Passive',
            description: 'Your radiant damage spells deal additional damage equal to your current Devotion Level × 2. When you damage an enemy with a radiant spell, you heal for 15% of the damage dealt.',
            uniqueTo: 'Zealot'
          }
        ],
        
        recommendedFor: 'Players who want aggressive support, dealing damage while healing, and offensive playstyles'
      },
      
      {
        id: 'ascetic',
        name: 'Ascetic',
        icon: 'spell_holy_prayerofhealing',
        color: '#4169E1',
        theme: 'Enduring Faith',
        
        description: `Ascetic Martyrs are masters of endurance, maintaining high Devotion Levels through careful resource management and resilience. They embrace suffering as a path to enlightenment, gaining powerful defensive abilities that allow them to weather any storm.`,
        
        playstyle: 'Balanced support, sustained Devotion, defensive resilience',
        
        strengths: [
          'Best at maintaining high Devotion Levels',
          'Excellent survivability and damage resistance',
          'Reduced Devotion costs for amplified abilities',
          'Strong sustained performance in long fights'
        ],
        
        weaknesses: [
          'Moderate healing and damage (jack of all trades)',
          'Requires careful resource management',
          'Less impactful burst abilities',
          'Slower to reach peak power'
        ],
        
        passiveAbilities: [
          {
            name: 'Sacred Devotion',
            tier: 'Path Passive',
            description: 'When you reach Devotion Level 3 or higher, your next healing spell heals for an additional 1d6 HP.',
            sharedBy: 'All Martyrs'
          },
          {
            name: 'Ascetic Endurance',
            tier: 'Specialization Passive',
            description: 'All amplified spell costs are reduced by 1 Devotion Level (minimum 1). While at Devotion Level 4 or higher, you gain resistance to physical damage.',
            uniqueTo: 'Ascetic'
          }
        ],
        
        recommendedFor: 'Players who enjoy resource management, balanced gameplay, and sustained power'
      }
    ]
  },

  // Example Spells - showcasing the spell wizard system
  exampleSpells: [
    // Basic Healing Spells
    {
      id: 'martyr_restorative_prayer',
      name: 'Restorative Prayer',
      description: 'A gentle prayer that mends wounds and restores vitality to an ally.',
      spellType: 'ACTION',
      icon: 'spell_holy_heal',
      school: 'Restoration',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Sanatio Divina',
        somaticText: 'Hands clasped in prayer'
      },

      resolution: 'DICE',

      healingConfig: {
        formula: '1d4',
        modifier: 'SPIRIT',
        healingType: 'single_target'
      },

      effects: {
        healing: {
          instant: {
            formula: '1d4',
            modifier: 'SPIRIT',
            target: 'single'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 1,
          amplifiedEffect: 'Heal for 4d4 + Spirit modifier HP instead'
        }
      },

      tags: ['healing', 'basic', 'devotion-amplifiable']
    },

    {
      id: 'martyr_divine_shield',
      name: 'Divine Shield',
      description: 'Grants protective divine energy to allies, manifesting as temporary hit points.',
      spellType: 'ACTION',
      icon: 'spell_holy_powerwordshield',
      school: 'Abjuration',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 10
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Aegis Sanctus',
        somaticText: 'Raise hands skyward'
      },

      resolution: 'DICE',

      effects: {
        buff: {
          temporaryHP: {
            formula: '1d6',
            targets: 'all_allies_in_area'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 1,
          amplifiedEffect: 'Grants 2d6 temporary HP instead'
        }
      },

      tags: ['buff', 'temporary-hp', 'aoe', 'devotion-amplifiable']
    },

    // Self-Sacrifice Spells
    {
      id: 'martyr_penance_of_pain',
      name: 'Penance of Pain',
      description: 'Inflict grievous wounds upon yourself, channeling that suffering into healing energy for all allies.',
      spellType: 'ACTION',
      icon: 'spell_holy_penance',
      school: 'Restoration',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 30
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Dolor Pro Salus',
        somaticText: 'Strike yourself with divine energy'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'radiant',
        target: 'self',
        description: 'Inflict damage to yourself'
      },

      healingConfig: {
        formula: 'DAMAGE_DEALT_TO_SELF',
        healingType: 'area',
        description: 'Heal all allies for the damage you inflicted on yourself'
      },

      effects: {
        damage: {
          instant: {
            formula: '3d6',
            type: 'radiant',
            target: 'self'
          }
        },
        healing: {
          instant: {
            formula: 'DAMAGE_DEALT_TO_SELF',
            targets: 'all_allies_in_area'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 2,
          amplifiedEffect: 'Inflict 4d8 damage to yourself and heal allies for that amount'
        },
        selfDamage: {
          buildsDevotion: true,
          description: 'Self-damage counts toward Devotion Level accumulation'
        }
      },

      tags: ['healing', 'self-damage', 'aoe', 'sacrifice', 'devotion-amplifiable']
    },

    {
      id: 'martyr_purifying_pain',
      name: 'Purifying Pain',
      description: 'Purify yourself through suffering, converting your pain into potent healing for an ally.',
      spellType: 'ACTION',
      icon: 'spell_holy_restoration',
      school: 'Restoration',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Purificatio Doloris',
        somaticText: 'Touch your heart then extend hand to ally'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'radiant',
        target: 'self'
      },

      healingConfig: {
        formula: '4d4',
        modifier: 'SPIRIT',
        healingType: 'single_target'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d6',
            type: 'radiant',
            target: 'self'
          }
        },
        healing: {
          instant: {
            formula: '4d4',
            modifier: 'SPIRIT',
            target: 'single'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 2,
          amplifiedEffect: 'Heal for 6d4 + Spirit modifier HP instead'
        },
        selfDamage: {
          buildsDevotion: true
        }
      },

      tags: ['healing', 'self-damage', 'sacrifice', 'devotion-amplifiable']
    },

    // Radiant Damage Spells
    {
      id: 'martyr_radiant_burst',
      name: 'Radiant Burst',
      description: 'Unleash a burst of holy light that sears your enemy and blinds them with divine radiance.',
      spellType: 'ACTION',
      icon: 'spell_holy_holysmite',
      school: 'Evocation',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Lux Divina!',
        somaticText: 'Thrust palm forward'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d6',
        damageType: 'radiant',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '3d6',
            type: 'radiant'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 2,
          amplifiedEffect: 'Deal 4d6 radiant damage and blind the enemy for 1 minute'
        }
      },

      tags: ['damage', 'radiant', 'blind', 'devotion-amplifiable']
    },

    {
      id: 'martyr_devoted_strike',
      name: 'Devoted Strike',
      description: 'Channel your devotion into a powerful melee attack, dealing radiant damage and healing yourself.',
      spellType: 'ACTION',
      icon: 'spell_holy_crusaderstrike',
      school: 'Evocation',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Devotio Ferrum!',
        somaticText: 'Strike with weapon wreathed in holy light'
      },

      resolution: 'FIXED',

      damageConfig: {
        formula: '25',
        damageType: 'radiant',
        scalingType: 'none'
      },

      healingConfig: {
        formula: '10',
        healingType: 'self'
      },

      effects: {
        damage: {
          instant: {
            formula: '25',
            type: 'radiant'
          }
        },
        healing: {
          instant: {
            formula: '10',
            target: 'self'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 3,
          amplifiedEffect: 'Deal 35 radiant damage and heal for 20 HP instead'
        }
      },

      tags: ['damage', 'radiant', 'healing', 'melee', 'devotion-amplifiable']
    },

    // Buff and Protection Spells
    {
      id: 'martyr_sanctuary_aura',
      name: 'Sanctuary Aura',
      description: 'Surround an ally with a protective aura that reduces incoming damage.',
      spellType: 'ACTION',
      icon: 'spell_holy_divineshield',
      school: 'Abjuration',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Sanctuarium',
        somaticText: 'Draw protective circle in the air'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          resistance: {
            type: 'all_damage',
            duration: 1,
            durationUnit: 'minutes',
            target: 'single'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 1,
          amplifiedEffect: 'Grants resistance to all allies within 10 feet for 1 minute'
        }
      },

      tags: ['buff', 'resistance', 'protection', 'devotion-amplifiable']
    },

    {
      id: 'martyr_blessed_resilience',
      name: 'Blessed Resilience',
      description: 'Divine power fortifies your body, granting resistance to physical harm.',
      spellType: 'ACTION',
      icon: 'spell_holy_blessedresilience',
      school: 'Abjuration',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'turns'
      },

      resourceCost: {
        mana: 15,
        components: ['verbal'],
        verbalText: 'Fortitudo Divina'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          resistance: {
            type: 'physical_damage',
            duration: 1,
            durationUnit: 'turns',
            target: 'self'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 5,
          amplifiedEffect: 'Grants resistance to both magical and physical damage for 1 minute'
        }
      },

      tags: ['buff', 'resistance', 'self', 'devotion-amplifiable']
    },

    // Combo Spells (Healing + Damage)
    {
      id: 'martyr_redeemers_flame',
      name: "Redeemer's Flame",
      description: 'Holy fire that heals an ally while burning a nearby enemy with righteous fury.',
      spellType: 'ACTION',
      icon: 'spell_holy_searinglightpriest',
      school: 'Evocation',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'dual',
        rangeType: 'ranged',
        rangeDistance: 40,
        description: 'Target one ally and one enemy within range'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Flamma Redemptoris!',
        somaticText: 'Gesture toward ally and enemy'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d6',
        damageType: 'radiant'
      },

      healingConfig: {
        formula: '5d6',
        healingType: 'single_target'
      },

      effects: {
        healing: {
          instant: {
            formula: '5d6',
            target: 'ally'
          }
        },
        damage: {
          instant: {
            formula: '4d6',
            type: 'radiant',
            target: 'enemy'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 3,
          amplifiedEffect: 'Heal for 6d6 HP and deal 5d6 radiant damage'
        }
      },

      tags: ['healing', 'damage', 'radiant', 'combo', 'devotion-amplifiable']
    },

    {
      id: 'martyr_martyrs_fire',
      name: "Martyr's Fire",
      description: 'The ultimate expression of sacrifice—inflict grievous wounds upon yourself to heal an ally and smite an enemy.',
      spellType: 'ACTION',
      icon: 'spell_holy_summonlightwell',
      school: 'Evocation',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'dual',
        rangeType: 'ranged',
        rangeDistance: 40,
        description: 'Target one ally and one enemy within range'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Martyris!',
        somaticText: 'Strike yourself then gesture outward'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '5d6',
        damageType: 'radiant',
        targets: ['self', 'enemy']
      },

      healingConfig: {
        formula: '7d6',
        healingType: 'single_target'
      },

      effects: {
        damage: {
          instant: {
            formula: '5d6',
            type: 'radiant',
            targets: ['self', 'enemy']
          }
        },
        healing: {
          instant: {
            formula: '7d6',
            target: 'ally'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 3,
          amplifiedEffect: 'Heal for 8d6 HP and deal 6d6 radiant damage to enemy'
        },
        selfDamage: {
          buildsDevotion: true
        }
      },

      tags: ['healing', 'damage', 'radiant', 'self-damage', 'combo', 'devotion-amplifiable']
    },

    // Ultimate Abilities
    {
      id: 'martyr_ultimate_sacrifice',
      name: 'Ultimate Sacrifice',
      description: 'Become an invulnerable beacon of protection, redirecting all damage from nearby allies to yourself.',
      spellType: 'ACTION',
      icon: 'spell_holy_guardianspirit',
      school: 'Abjuration',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 20
        }
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Sacrificium Ultimum!',
        somaticText: 'Arms spread wide, accepting all harm'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          immunity: {
            type: 'all_damage',
            duration: 1,
            durationUnit: 'minutes',
            target: 'self'
          },
          damageRedirection: {
            from: 'all_allies_in_area',
            to: 'self',
            duration: 1,
            durationUnit: 'minutes'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 4,
          amplifiedEffect: 'Become immune to all damage for 2 minutes'
        }
      },

      tags: ['buff', 'immunity', 'protection', 'ultimate', 'devotion-amplifiable']
    },

    {
      id: 'martyr_searing_devotion',
      name: 'Searing Devotion',
      description: 'The pinnacle of martyrdom—burn yourself with holy fire to unleash devastating radiant damage and massive healing.',
      spellType: 'ACTION',
      icon: 'spell_holy_divineprovidence',
      school: 'Evocation',
      level: 7,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'dual_area',
        rangeType: 'ranged',
        rangeDistance: 60,
        description: 'Target one enemy; all allies within 20 feet of you are healed'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Devotio Ardens!',
        somaticText: 'Immolate yourself with holy fire'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '6d6',
        damageType: 'radiant',
        targets: ['self', 'enemy']
      },

      healingConfig: {
        formula: '8d6',
        healingType: 'area'
      },

      effects: {
        damage: {
          instant: {
            formula: '6d6',
            type: 'radiant',
            targets: ['self', 'enemy']
          }
        },
        healing: {
          instant: {
            formula: '8d6',
            targets: 'all_allies_within_20ft'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 5,
          amplifiedEffect: 'Deal 10d6 radiant damage to enemy and heal allies for 10d6 HP'
        },
        selfDamage: {
          buildsDevotion: true
        }
      },

      tags: ['healing', 'damage', 'radiant', 'self-damage', 'aoe', 'ultimate', 'devotion-amplifiable']
    },

    {
      id: 'martyr_martyrs_embrace',
      name: "Martyr's Embrace",
      description: 'Revive a fallen ally with the power of your devotion, restoring them to full health.',
      spellType: 'ACTION',
      icon: 'spell_holy_resurrection',
      school: 'Restoration',
      level: 6,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        description: 'Target a dead ally'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Vita Redde!',
        somaticText: 'Embrace the fallen'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: 'FULL_HEALTH',
        healingType: 'resurrection'
      },

      effects: {
        resurrection: {
          instant: {
            healthRestored: 'FULL',
            temporaryHP: 'SPIRIT_MODIFIER'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 4,
          amplifiedEffect: 'Grant the revived ally an additional 2d6 temporary HP'
        }
      },

      tags: ['resurrection', 'healing', 'ultimate', 'devotion-amplifiable']
    },

    // Utility and Reaction Spells
    {
      id: 'martyr_rapturous_devotion',
      name: 'Rapturous Devotion',
      description: 'Channel your devotion into supernatural speed and energy, gaining additional action points.',
      spellType: 'ACTION',
      icon: 'spell_holy_surgeoflight',
      school: 'Enhancement',
      level: 5,

      typeConfig: {
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 30,
        components: ['verbal'],
        verbalText: 'Celeritas Divina!'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          actionPoints: {
            bonus: 1,
            duration: 1,
            durationUnit: 'minutes',
            target: 'self'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 3,
          amplifiedEffect: 'Gain 2 additional AP for 1 minute instead'
        }
      },

      tags: ['buff', 'utility', 'action-points', 'devotion-amplifiable']
    },

    {
      id: 'martyr_intervene',
      name: "Martyr's Intervene",
      description: 'Rush in front of an ally to take damage meant for them, increasing your Devotion Gauge.',
      spellType: 'REACTION',
      icon: 'spell_holy_layonhands',
      school: 'Abjuration',
      level: 1,

      typeConfig: {
        castTime: 0,
        castTimeType: 'REACTION',
        trigger: 'Ally within 10 feet is about to take damage'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 10,
        description: 'Target an ally about to take damage'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 0,
        components: ['somatic'],
        somaticText: 'Rush in front of ally'
      },

      resolution: 'AUTOMATIC',

      effects: {
        utility: {
          damageRedirection: {
            from: 'target_ally',
            to: 'self',
            description: 'Take all damage meant for the ally'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          advanceBy: 1,
          description: 'Increases Devotion Gauge by 1 level each time used'
        },
        canAmplify: true,
        amplifiedCost: 1,
        amplifiedEffect: 'Gain advantage on all attacks for 1 minute after intervening'
      },

      tags: ['reaction', 'protection', 'devotion-builder', 'core-mechanic']
    },

    {
      id: 'martyr_mass_restoration',
      name: 'Mass Restoration',
      description: 'A wave of healing energy washes over all nearby allies, mending their wounds.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing02',
      school: 'Restoration',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: {
          radius: 10
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Sanatio Omnibus',
        somaticText: 'Raise hands and release healing wave'
      },

      resolution: 'DICE',

      healingConfig: {
        formula: '1d4',
        modifier: 'SPIRIT',
        healingType: 'area'
      },

      effects: {
        healing: {
          instant: {
            formula: '1d4',
            modifier: 'SPIRIT',
            targets: 'all_allies_in_area'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 2,
          amplifiedEffect: 'Heal for 4d4 + Spirit modifier HP instead'
        }
      },

      tags: ['healing', 'aoe', 'devotion-amplifiable']
    },

    {
      id: 'martyr_sacrificial_strike',
      name: 'Sacrificial Strike',
      description: 'Inflict pain upon yourself to empower your attacks with holy fury.',
      spellType: 'ACTION',
      icon: 'spell_holy_retributionaura',
      school: 'Enhancement',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        durationType: 'timed',
        duration: 1,
        durationUnit: 'minutes'
      },

      resourceCost: {
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Dolor Potentia!',
        somaticText: 'Strike yourself to empower weapon'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'radiant',
        target: 'self'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d6',
            type: 'radiant',
            target: 'self'
          }
        },
        buff: {
          attackBonus: {
            formula: '2d6',
            duration: 1,
            durationUnit: 'minutes',
            description: 'Add 2d6 to all melee attacks'
          }
        }
      },

      specialMechanics: {
        devotionLevel: {
          required: 0,
          canAmplify: true,
          amplifiedCost: 2,
          amplifiedEffect: 'Empower your next attack with 4d6 radiant damage and heal for half the damage dealt'
        },
        selfDamage: {
          buildsDevotion: true
        }
      },

      tags: ['buff', 'self-damage', 'melee', 'devotion-amplifiable']
    }
  ]
};


