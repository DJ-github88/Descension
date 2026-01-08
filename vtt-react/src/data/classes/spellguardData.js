/**
 * Spellguard Class Data
 * 
 * Complete class information for the Spellguard - an anti-mage tank
 * who absorbs magical damage and converts it into power.
 */

export const SPELLGUARD_DATA = {
  id: 'spellguard',
  name: 'Spellguard',
  icon: 'fas fa-shield-alt',
  role: 'Tank/Anti-Mage',

  // Overview section
  overview: {
    title: 'The Spellguard',
    subtitle: 'Arcane Absorption Specialist',
    
    description: `The Spellguard is a magical tank who stands as a bulwark against enemy spellcasters. By absorbing and converting incoming magical damage into Arcane Energy Points (AEP), Spellguards transform enemy magic into their own power. They excel at disrupting enemy casters, protecting allies from magical threats, and turning the enemy's greatest strength into their greatest weakness.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Spellguards are individuals who have learned to internalize and weaponize magical energy. Whether through rigorous training, natural affinity, or arcane experimentation, they possess the unique ability to absorb spells that would devastate others. They are the ultimate anti-mage specialists, feared by spellcasters and valued by allies.

**The Spellguard's Philosophy**: Magic is not inherently good or evil—it is energy, and energy can be redirected, absorbed, and repurposed. The greatest defense against magic is not resistance, but absorption and conversion.

**Common Archetypes**:
- **The Spell Eater**: A warrior who hungers for magical energy, actively seeking out enemy casters to drain
- **The Arcane Knight**: A disciplined protector trained in anti-magic combat techniques
- **The Mana Vampire**: One who feeds on magical energy, growing stronger with each spell absorbed
- **The Nullifier**: A zealot dedicated to suppressing and controlling dangerous magic
- **The Arcane Experiment**: A being transformed by magical experimentation, now able to metabolize spells
- **The Warden**: A guardian who shields others from magical threats through personal sacrifice

**Personality Traits**: Spellguards tend to be stoic, disciplined, and protective. They understand the dangers of unchecked magic and take their role as magical guardians seriously. Some are calm and methodical, while others are aggressive hunters of enemy casters. Many develop a sixth sense for detecting magical energy.

**Physical Manifestations**: A Spellguard's absorption abilities often manifest visibly—glowing runes that pulse when absorbing spells, an aura that seems to drink in magical light, or armor that shimmers with absorbed arcane energy. Their weapons and shields often bear anti-magic enchantments.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Magical Tank / Anti-Mage Specialist

The Spellguard excels at absorbing magical damage and disrupting enemy spellcasters. They are the ultimate counter to magic-heavy enemy compositions, growing stronger as they absorb more spells.

**Damage Mitigation**: Exceptional against magical damage through absorption mechanics. Moderate against physical damage through standard tanking.

**Threat Generation**: Generates high threat against enemy casters through spell disruption, reflection, and mana drain abilities.

**Utility**: Provides magical protection for allies, counterspell capabilities, and anti-magic zone control.

**Strengths**:
- Exceptional defense against magical damage
- Grows stronger when facing multiple casters
- Can reflect spells back at enemies
- Disrupts enemy spellcasters effectively
- Provides magical shields for allies
- Drains enemy mana through melee attacks
- Converts enemy power into personal resources

**Weaknesses**:
- Less effective against physical damage dealers
- Requires enemy spellcasters to generate AEP
- Limited AEP generation in non-magical encounters
- Resource-dependent for most powerful abilities
- Can be overwhelmed by rapid spell barrages
- Vulnerable when AEP reserves are depleted

**Team Dynamics**:
- Essential against magic-heavy enemy compositions
- Protects squishy casters from enemy spells
- Synergizes with physical damage dealers who can handle non-casters
- Benefits from healers who can sustain through absorption damage
- Works well with crowd control to manage multiple casters`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Spellguard is about positioning yourself to intercept enemy spells, managing your AEP reserves, and knowing when to absorb versus when to reflect.

**Core Gameplay Loop**:
1. **Position to Intercept** enemy spells targeting allies
2. **Absorb Magical Damage** to generate AEP
3. **Spend AEP** on shields, reflections, or offensive abilities
4. **Drain Mana** through melee attacks to weaken casters
5. **Protect Allies** with barriers and anti-magic zones

**AEP Management**:
- **Low AEP (0-15)**: Focus on absorption, conservative spending, basic shields
- **Medium AEP (16-40)**: Moderate spending on reflections and ally protection
- **High AEP (41-75)**: Aggressive spending, powerful barriers, offensive abilities
- **Maximum AEP (76-100)**: Ultimate abilities, mass protection, devastating counterattacks

**Positioning Strategy**:
- **Frontline Against Casters**: Stand between enemy casters and your allies
- **Spell Interception**: Position to intercept area spells before they reach allies
- **Mana Drain Range**: Stay in melee range of enemy casters to drain mana
- **Reflection Angles**: Position to reflect spells back at casters or into enemy groups

**When to Spend AEP**:
- **Emergency Shields**: Protect allies from devastating spells
- **Spell Reflection**: Turn powerful enemy spells against them
- **Offensive Bursts**: When you need to eliminate a priority caster
- **Mass Protection**: When facing multiple casters or area spells
- **Mana Denial**: Drain enemy casters to prevent future spells

**Specialization Strategies**:
- **Arcane Warden**: Maximum absorption, protect entire party, outlast enemy casters
- **Spell Breaker**: Aggressive reflection, punish enemy casters, disrupt spell rotations
- **Mana Reaver**: Offensive playstyle, drain and convert, eliminate casters quickly

**Advanced Techniques**:
- **Spell Baiting**: Intentionally draw enemy spells to build AEP
- **Reflection Timing**: Wait for high-value spells before using reflection abilities
- **AEP Banking**: Save AEP for critical moments rather than spending immediately
- **Mana Pressure**: Constantly drain enemy casters to limit their options
- **Zone Control**: Use anti-magic zones to deny areas to enemy casters`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Spell Eater',
      content: `**The Setup**: You're a Spellguard (Arcane Warden specialization) facing a group of enemy mages (3 fire mages + 1 archmage). Your party is with you. Starting AEP: 0. Starting Mana: 40/50. Your goal: Absorb enemy spells to generate AEP, then use that AEP to protect allies and reflect spells back at enemies.

**Starting State**: AEP: 0/100 | Mana: 40/50 | HP: 70/70 | Shield: 0

**Turn 1 - First Absorption (AEP: 0 → 18)**

*Three fire mages and an archmage stand before you. They begin casting. Perfect. You HUNGER for their magic.*

**Fire Mage #1's Turn**: Casts Fireball at your party (targeting you and 2 allies)
**Fireball Damage**: 28 fire damage to all targets

**Your Reaction**: "Arcane Absorption" (passive ability, no cost)
**Effect**: You absorb the magical damage, converting it to AEP instead of HP damage

*The fireball SLAMS into you. But instead of burning, the flames are PULLED INTO YOUR BODY. Your armor glows with absorbed energy.*

**Damage Absorbed**: 28 fire damage → 0 HP damage taken
**AEP Generated**: 28 damage absorbed × 0.5 = **14 AEP**
**AEP**: 0 + 14 = **14/100**

**Your Allies**: Still take 28 fire damage each (you only absorbed your portion)

**Your Party's Mage**: "The fireball... you just ATE it!"
**You**: "Arcane Absorption. I convert magical damage to Arcane Energy Points. I have 14 AEP now."

**Fire Mage #2's Turn**: Casts Lightning Bolt at you
**Lightning Damage**: 22 lightning damage

**Your Reaction**: Arcane Absorption (passive)
**Damage Absorbed**: 22 lightning damage → 0 HP damage taken
**AEP Generated**: 22 × 0.5 = **11 AEP**
**AEP**: 14 + 11 = **25/100**

*Lightning CRASHES into you. Your body DRINKS IT IN. Your eyes glow with crackling energy.*

**Your Action**: Melee attack Fire Mage #1 (no mana cost)
**Attack Roll**: d20+5 → [16] = Hit!
**Damage**: 2d8+3 → [7, 6] + 3 = **16 damage**
**Mana Drain**: Fire Mage #1 loses 1d4 → [3] = 3 mana

*Your weapon PULSES with anti-magic energy. When it strikes, it DRAINS the mage's mana.*

**Fire Mage #1**: Takes 16 damage, loses 3 mana

**Current State**: AEP: 25/100 | Mana: 40/50 | HP: 70/70

**Turn 2 - Building Power (AEP: 25 → 53)**

*The archmage begins casting. You can feel the power building. This will be a BIG spell.*

**Archmage's Turn**: Casts "Meteor Swarm" at your party (massive AoE)
**Meteor Damage**: 45 fire damage to all party members

**Your Reaction**: "Spell Interception" (10 AEP, intercept spell targeting ally)
**Effect**: You jump in front of your healer, taking their portion of the damage

*You LEAP in front of your healer. The meteor SLAMS into you instead of them.*

**Damage Absorbed**: 45 (your portion) + 45 (healer's portion) = **90 fire damage total**
**Arcane Absorption**: 90 damage → 0 HP damage taken
**AEP Generated**: 90 × 0.5 = **45 AEP**
**AEP**: 25 - 10 (Spell Interception cost) + 45 (absorption) = **60/100**

**Your Party's Healer**: "You... you saved me! You took the entire meteor!"
**You**: "Spell Interception. Cost me 10 AEP, but I absorbed 90 damage and gained 45 AEP. Net gain: 35 AEP. I'm at 60 AEP now."

**Fire Mage #3's Turn**: Casts Fireball at you
**Fireball Damage**: 26 fire damage

**Arcane Absorption**: 26 damage → 0 HP damage taken
**AEP Generated**: 26 × 0.5 = **13 AEP**
**AEP**: 60 + 13 = **73/100**

*Another fireball. Another meal. Your armor is BLAZING with absorbed magical energy.*

**Your Action**: Cast "Arcane Shield" on your mage (15 AEP)
**Effect**: Target ally gains shield absorbing 30 magical damage

**AEP**: 73 - 15 = **58/100**

*You gesture at your mage. A shimmering barrier of absorbed arcane energy surrounds them.*

**Your Party's Mage**: "I feel... protected. What is this?"
**You**: "Arcane Shield. Spent 15 AEP to give you a 30-damage shield against magic. You're safe now."

**Current State**: AEP: 58/100 | Mana: 40/50 | HP: 70/70

**Turn 3 - Spell Reflection (AEP: 58 → 71)**

*The enemy mages are starting to realize their spells are feeding you. But they have no choice—they're casters. Magic is all they have.*

**Fire Mage #1's Turn**: Casts Fireball at you
**Fireball Damage**: 30 fire damage

**Your Reaction**: "Spell Reflection" (25 AEP, reflect spell back at caster)
**Effect**: The fireball is REFLECTED back at Fire Mage #1

*You raise your hand. The fireball STOPS in mid-air, hovering. Then it REVERSES, flying back at the caster.*

**AEP**: 58 - 25 = **33/100**

**Fire Mage #1**: Takes 30 fire damage from his own Fireball → **DEAD**

**Your Party's Rogue**: "You just... threw his spell back at him!"
**You**: "Spell Reflection. Cost 25 AEP. His own fireball killed him."

**Archmage's Turn**: Casts "Chain Lightning" at your party
**Lightning Damage**: 35 lightning damage, chains to 3 targets

**Your Reaction**: Arcane Absorption (you're one of the targets)
**Damage Absorbed**: 35 lightning damage → 0 HP damage taken
**AEP Generated**: 35 × 0.5 = **17 AEP**
**AEP**: 33 + 17 = **50/100**

**Your Allies**: Take 35 lightning damage each (but your mage's Arcane Shield absorbs it)
**Mage's Shield**: 30/30 → 0/30 (absorbed 30 damage, took 5 HP damage)

**Your Action**: Melee attack Archmage (no mana cost)
**Attack Roll**: d20+5 → [18] = Hit!
**Damage**: 2d8+3 → [8, 7] + 3 = **18 damage**
**Mana Drain**: Archmage loses 1d4 → [4] = 4 mana

*You close the distance and strike. Your weapon DRAINS the archmage's mana.*

**Archmage**: Takes 18 damage, loses 4 mana

**Fire Mage #2's Turn**: Casts Fireball at you
**Fireball Damage**: 28 fire damage

**Arcane Absorption**: 28 damage → 0 HP damage taken
**AEP Generated**: 28 × 0.5 = **14 AEP**
**AEP**: 50 + 14 = **64/100**

**Current State**: AEP: 64/100 | Mana: 40/50 | HP: 70/70

**Turn 4 - Maximum Absorption (AEP: 64 → 85)**

*You're at 64 AEP. The enemy mages are running low on mana from your drains. Time to finish this.*

**Your Action**: Cast "Anti-Magic Zone" (20 mana, creates 15 ft zone)
**Effect**: All spells cast in zone have disadvantage on attack rolls, spell save DCs reduced by 2

**Mana**: 40 - 20 = 20/50

*You slam your weapon into the ground. A ZONE of anti-magic energy spreads outward, suppressing magical power.*

**Fire Mage #2**: Tries to cast Fireball (inside zone)
**Spell Save DC**: 15 → 13 (reduced by 2)
**Your Party**: Easier to save against the spell

**Archmage's Turn**: Casts "Disintegrate" at you (single-target, massive damage)
**Disintegrate Damage**: 75 force damage

**Your Reaction**: Arcane Absorption
**Damage Absorbed**: 75 force damage → 0 HP damage taken
**AEP Generated**: 75 × 0.5 = **37 AEP**
**AEP**: 64 + 37 = **101/100** → Capped at **100/100** (MAXIMUM AEP)

*The disintegration ray SLAMS into you. Your body DEVOURS it. You are at MAXIMUM ARCANE ENERGY.*

**You**: "MAXIMUM AEP. I've absorbed everything they've thrown at me. Now I unleash it."

**Your Action (1 AP)**: "Arcane Detonation" (50 AEP, massive AoE damage)
**Effect**: Release absorbed energy in 20 ft radius explosion
**Damage**: 50 force damage to all enemies in radius

**AEP**: 100 - 50 = **50/100**

*You EXPLODE with absorbed magical energy. A shockwave of pure arcane force ERUPTS from your body.*

**Fire Mage #2**: Takes 50 force damage → **DEAD**
**Fire Mage #3**: Takes 50 force damage → **DEAD**
**Archmage**: Takes 50 force damage → HEAVILY DAMAGED (near death)

**Your Party's Tank**: "You just... exploded with their own magic!"
**You**: "Arcane Detonation. I spent 50 AEP to release all the energy I absorbed. That was THEIR magic, turned against them."

**Current State**: AEP: 50/100 | Mana: 20/50 | HP: 70/70

**Turn 5 - Finishing the Archmage**

*Only the archmage remains, heavily damaged and low on mana from your drains.*

**Archmage's Turn**: Casts "Magic Missile" at you (desperate, low mana)
**Magic Missile Damage**: 3d4+3 → [3, 4, 2] + 3 = **12 force damage**

**Arcane Absorption**: 12 damage → 0 HP damage taken
**AEP Generated**: 12 × 0.5 = **6 AEP**
**AEP**: 50 + 6 = **56/100**

**Your Action**: Melee attack Archmage
**Attack Roll**: d20+5 → [19] = Hit!
**Damage**: 2d8+3 → [8, 6] + 3 = **17 damage**
**Mana Drain**: Archmage loses 1d4 → [3] = 3 mana

**Archmage**: Takes 17 damage → **DEAD**

**Combat Over**

*You stand among the fallen mages, your armor still glowing with absorbed arcane energy. You took ZERO damage.*

**Your Party's Healer**: "You didn't take a single point of damage. They hit you with fireballs, lightning, meteors, disintegration rays... and you absorbed EVERYTHING."
**You**: "Arcane Absorption. Every point of magical damage I take is converted to AEP instead of HP damage. I absorbed 90 damage from the meteor, 75 from disintegrate, and multiple fireballs and lightning bolts. Total: over 300 damage absorbed."
**Your Party's Mage**: "And you used that energy to protect us and kill them?"
**You**: "Exactly. I spent 15 AEP to shield you. I spent 25 AEP to reflect a fireball back at a mage, killing him with his own spell. I spent 50 AEP on Arcane Detonation, killing two mages with their own absorbed energy."
**Your Party's Tank**: "And the mana drains?"
**You**: "Every melee attack drains 1d4 mana from enemy casters. I drained the archmage for 4, 3, and 3 mana across three hits. That's 10 mana stolen, limiting his spell options."

**Final State**: AEP: 56/100 | Mana: 20/50 | HP: 70/70 (full health, zero damage taken)

**The Lesson**: Spellguard gameplay is about:
1. **Arcane Absorption**: Converted 300+ magical damage to 0 HP damage, generated 100+ AEP
2. **Spell Interception**: Jumped in front of healer, absorbed their meteor damage (90 damage)
3. **Spell Reflection**: Reflected fireball back at caster for 30 damage, killing them with their own spell
4. **Arcane Shield**: Spent 15 AEP to protect ally with 30-damage shield
5. **Arcane Detonation**: Spent 50 AEP to deal 50 AoE damage, killing 2 mages
6. **Mana Drain**: Drained 10+ mana from archmage through melee attacks
7. **AEP Management**: Built from 0 → 100 (max) → 50 (after detonation) → 56 (final)

You're the ultimate ANTI-MAGE TANK. Enemy spells don't hurt you—they FEED you. Every fireball, every lightning bolt, every meteor is FUEL for your abilities. You absorbed a 75-damage disintegration ray and took ZERO damage. You intercepted a meteor to save your healer. You reflected a fireball back at its caster. You detonated 50 AEP of absorbed energy, killing two mages with their own magic. Against spellcasters, you're INVINCIBLE. You're not just a tank—you're a SPELL EATER.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Arcane Absorption',
    subtitle: 'Arcane Energy Points (AEP) System',
    
    description: `The Spellguard's power stems from their ability to absorb magical damage and convert it into Arcane Energy Points (AEP). Each point of magical damage absorbed generates AEP, which can then be spent on powerful defensive and offensive abilities. Mastering AEP management is the key to becoming an effective Spellguard.`,
    
    mechanics: {
      title: 'How It Works',
      content: `**Generating AEP**:
- **Absorb Elements (Passive)**: Automatically absorb fire, cold, lightning, or necrotic damage. Gain 2 AEP for every point of magical damage taken.
- **Energy Conversion (Passive)**: Convert physical damage into AEP. Gain 1 AEP for every 2 points of physical damage taken.
- **Mana Drain (Passive)**: When you hit with a melee attack, drain mana from the target equal to the damage dealt. Gain 1 AEP per mana drained.

**Maximum AEP**: You can hold up to 100 AEP at once. Excess AEP is lost.

**AEP Persistence**: AEP persists between combats but decays at a rate of 5 AEP per minute outside of combat.

**Spending AEP**: AEP can be spent on various abilities including shields, reflections, strikes, healing, and utility effects. Most abilities cost both mana and AEP.

**Strategic Considerations**:
- AEP generation is highest when facing multiple casters or in magical-heavy encounters
- Balance absorption (taking damage to generate AEP) with survival (using AEP for shields)
- Save AEP for critical moments rather than spending immediately
- Mana drain provides consistent AEP generation even against non-casters
- Different specializations have different AEP generation and spending patterns`
    },

    // AEP Generation Table
    aepGenerationTable: {
      title: 'AEP Generation Sources',
      headers: ['Source', 'AEP Gained', 'Trigger', 'Notes'],
      rows: [
        ['Absorb Elements', '2 per damage', 'Take magical damage', 'Fire, cold, lightning, necrotic'],
        ['Energy Conversion', '1 per 2 damage', 'Take physical damage', 'Less efficient than magical'],
        ['Mana Drain', '1 per mana', 'Melee hit', 'Drains mana equal to damage dealt'],
        ['Arcane Fortitude', '1.5x multiplier', 'Passive (Arcane Warden)', 'Spec-specific enhancement'],
        ['Reflection Bonus', '+5 AEP', 'Successful reflection', 'Spell Breaker specialization'],
        ['Critical Absorption', '+10 AEP', 'Absorb critical spell', 'Rare occurrence']
      ]
    },

    // AEP Spending Table
    aepSpendingTable: {
      title: 'AEP Abilities & Costs',
      headers: ['Ability', 'AEP Cost', 'Mana Cost', 'Effect'],
      rows: [
        ['Arcane Shield', '10', '4', 'Shield absorbs 10d6 damage for 1 minute'],
        ['Reflective Barrier', '10', '6', 'Reflect next spell back at caster'],
        ['Empowered Strike', '15', '5', 'Melee attack deals +2d6 arcane damage'],
        ['Arcane Rejuvenation', '20', '6', 'Heal 3d6 hit points'],
        ['Elemental Resistance', '10', '4', 'Resist one element for 1 minute'],
        ['Arcane Nova', '25', '8', 'Deal 6d6 arcane damage in 20-foot radius'],
        ['Barrier of Protection', '15', '6', 'Shield allies for 8d6 damage'],
        ['Spell Disruption', '15', '5', 'Counter enemy spell'],
        ['Arcane Strike', '15', '5', 'Melee attack deals +4d6 arcane damage'],
        ['Reflective Aura', '15', '6', 'Reflect 10 damage for 1 minute'],
        ['Spell Reflection', '15', '6', 'Instantly reflect spell'],
        ['Arcane Fortress', '25', '8', 'Immunity to magic for 1 turn'],
        ['Magic Nullification', '20', '6', 'Anti-magic zone for 1 minute'],
        ['Control Magic', '20', '7', 'Take control of summoned unit']
      ]
    },

    // AEP Strategic Thresholds
    aepThresholdsTable: {
      title: 'AEP Strategic Thresholds',
      headers: ['AEP Range', 'Strategy', 'Recommended Actions'],
      rows: [
        ['0-15', 'Critical Low', 'Focus on absorption, avoid spending, basic defense only'],
        ['16-40', 'Building', 'Moderate spending, use efficient abilities, build reserves'],
        ['41-75', 'Optimal', 'Aggressive spending, use powerful abilities, protect allies'],
        ['76-100', 'Maximum', 'Ultimate abilities, mass protection, devastating counterattacks']
      ]
    },

    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**AEP Economy**:
- Prioritize high-efficiency abilities (10-15 AEP cost) for consistent value
- Save expensive abilities (20-25 AEP) for critical moments
- Balance AEP generation (taking damage) with survival (spending on shields)
- Against multiple casters, focus on absorption to rapidly build AEP
- Against single casters, use mana drain to generate steady AEP

**Specialization Synergies**:
- **Arcane Warden**: Maximize AEP generation through enhanced absorption, spend on ally protection
- **Spell Breaker**: Generate bonus AEP through reflections, spend on disruption and counterattacks
- **Mana Reaver**: Generate AEP through aggressive mana drain, spend on offensive abilities

**Combat Pacing**:
- Early Combat: Build AEP through absorption and mana drain
- Mid Combat: Spend AEP on shields and reflections as needed
- Late Combat: Use accumulated AEP for finishing moves or emergency protection

**Team Coordination**:
- Communicate AEP levels to allies so they know when you can shield them
- Position to intercept spells targeting vulnerable allies
- Use anti-magic zones to protect key areas during critical moments`
    },

    playingInPerson: {
      title: 'Playing Spellguard In Person',
      content: `**Required Materials**:
- **AEP Counter** (d100, tokens, or beads representing Arcane Energy Points)
- **Damage Tracker** (for tracking magical damage absorbed)
- **AEP Conversion Chart** (showing damage → AEP conversion rates)
- **Shield Status Cards** (showing active shields and their HP)
- **Ability Cost Reference** (showing AEP costs for abilities)
- **Specialization Card** (showing passive bonuses and AEP multipliers)

**Primary Tracking Method: AEP Counter + Damage Conversion**

The Spellguard's resource system converts absorbed magical damage into Arcane Energy Points (AEP), which can then be spent on shields, reflections, and abilities. The key is tracking damage taken and converting it to AEP using simple math.

**Setup**:
\`\`\`
SPELLGUARD RESOURCE TRACKING:

ARCANE ENERGY POINTS (AEP): [___] / 100

AEP GENERATION:
• Magical damage (fire/cold/lightning/necrotic): 2 AEP per damage
• Physical damage: 1 AEP per 2 damage
• Mana drain (melee hit): 1 AEP per mana drained
• Arcane Warden spec: 3 AEP per magical damage (1.5x)
• Spell Breaker spec: +5 AEP per successful reflection

AEP SPENDING:
• Arcane Shield (10 AEP): +2 armor, absorbs 20 damage
• Spell Reflection (15 AEP): Reflect spell back at caster
• Barrier of Protection (20 AEP): Shield ally for 30 damage
• Anti-Magic Zone (30 AEP): 15 ft zone, spells cost +5 mana
• Mana Drain Strike (5 AEP): Melee attack drains 1d6 mana
\`\`\`

**How It Works**:

**AEP Generation (Absorbing Damage)**:
1. **Take magical damage** → Convert to AEP at 2:1 ratio
2. **Take physical damage** → Convert to AEP at 1:2 ratio (half as efficient)
3. **Drain mana** → Convert to AEP at 1:1 ratio
4. **Add AEP** to your counter

**AEP Spending (Using Abilities)**:
1. **Choose ability** → Check AEP cost
2. **Subtract AEP** from your counter
3. **Activate ability** → Apply effects

**Example Combat Turn**:

*You have 25 AEP, enemy mage casts Fireball at you*

**Enemy Mage's Turn**:
1. "The mage casts Fireball at you!"
2. Fireball damage: 8d6 → [6,5,4,6,3,5,4,6] = 39 fire damage
3. You take 39 fire damage (magical)

**Your AEP Generation**:
1. Magical damage taken: 39 damage
2. Conversion rate: 2 AEP per damage
3. AEP gained: 39 × 2 = **78 AEP**
4. Total AEP: 25 + 78 = **103 AEP**

**Your Turn - Spend AEP**:
1. "I activate Arcane Shield!" (10 AEP)
2. AEP: 103 - 10 = **93 AEP**
3. Shield active: +2 armor, absorbs 20 damage
4. "I cast Spell Reflection!" (15 AEP)
5. AEP: 93 - 15 = **78 AEP**
6. Ready to reflect next spell

**Example AEP Conversion**:

*You're an Arcane Warden (1.5x magical damage AEP)*

**Turn 1 - Lightning Bolt**:
1. Enemy casts Lightning Bolt → 6d6 → [5,6,4,5,3,6] = 29 lightning damage
2. Base AEP: 29 × 2 = 58 AEP
3. Arcane Warden bonus: 58 × 1.5 = **87 AEP** (rounded from 87)
4. Total AEP: 0 + 87 = **87 AEP**

**Turn 2 - Physical Attack**:
1. Enemy warrior attacks → 2d8+5 → [7,6] + 5 = 18 physical damage
2. Physical conversion: 18 ÷ 2 = **9 AEP**
3. Total AEP: 87 + 9 = **96 AEP**

**Turn 3 - Mana Drain**:
1. You hit enemy mage with melee attack → 1d8+3 → [6] + 3 = 9 damage
2. Mana drained: 9 mana
3. AEP gained: 9 × 1 = **9 AEP**
4. Total AEP: 96 + 9 = **105 AEP** (capped at 100)
5. Final AEP: **100 AEP** (max)

**AEP Conversion Chart**:
\`\`\`
═══════════════════════════════════
  AEP CONVERSION REFERENCE
═══════════════════════════════════
DAMAGE TYPE → AEP GAINED

MAGICAL DAMAGE (fire/cold/lightning/necrotic):
• Base: 2 AEP per damage
• Arcane Warden: 3 AEP per damage (1.5x)
• Example: 30 fire damage → 60 AEP (90 for Warden)

PHYSICAL DAMAGE:
• Base: 1 AEP per 2 damage
• Example: 20 physical damage → 10 AEP

MANA DRAIN (melee attacks):
• Base: 1 AEP per mana drained
• Example: Drain 8 mana → 8 AEP

SPELL REFLECTION (Spell Breaker spec):
• Bonus: +5 AEP per successful reflection
• Example: Reflect spell → +5 AEP
═══════════════════════════════════
\`\`\`

**AEP Spending Reference Card**:
\`\`\`
═══════════════════════════════════
    SPELLGUARD ABILITIES
═══════════════════════════════════
ARCANE SHIELD (10 AEP):
• +2 armor for 1 minute
• Absorbs 20 damage before breaking
• Reaction to cast

SPELL REFLECTION (15 AEP):
• Reflect spell back at caster
• Reflected spell uses caster's DC
• Reaction when targeted by spell

BARRIER OF PROTECTION (20 AEP):
• Shield ally within 30 ft
• Absorbs 30 damage
• Lasts 1 minute or until broken

ANTI-MAGIC ZONE (30 AEP):
• 15 ft radius zone
• All spells cost +5 mana
• Lasts 1 minute

MANA DRAIN STRIKE (5 AEP):
• Melee attack drains 1d6 mana
• Gain AEP equal to mana drained
• Costs 1 AP
═══════════════════════════════════
\`\`\`

**Example In-Person Turn**:

*You have 40 AEP, enemy mage targets your ally with Ice Storm*

**Enemy Mage's Turn**:
1. "The mage casts Ice Storm at your ally!"
2. Ice Storm damage: 4d8 → [7,6,5,8] = 26 cold damage

**Your Reaction - Barrier of Protection**:
1. "I cast Barrier of Protection on my ally!" (20 AEP)
2. AEP: 40 - 20 = **20 AEP**
3. Barrier absorbs 30 damage
4. Ally takes: 26 - 30 = **0 damage** (barrier absorbs all)
5. Barrier HP remaining: 30 - 26 = **4 HP**

**Next Turn - Enemy Attacks You**:
1. Enemy casts Fireball at you → 8d6 → [6,5,4,6,3,5,4,6] = 39 fire damage
2. You take 39 fire damage
3. AEP gained: 39 × 2 = **78 AEP**
4. Total AEP: 20 + 78 = **98 AEP**

**Your Turn - Spell Reflection**:
1. "I prepare Spell Reflection!" (15 AEP)
2. AEP: 98 - 15 = **83 AEP**
3. Ready to reflect next spell targeting you

**Alternative Tracking Methods**:

**Method 1: Token System**
- Use poker chips or tokens (1 token = 10 AEP)
- Add tokens when you absorb damage
- Remove tokens when you spend AEP
- Visual and tactile

**Method 2: D100 Die**
- Rotate die to show current AEP
- Quick and easy to adjust
- Single die tracks everything

**Method 3: Bead Counter**
- Use beads on a string or abacus
- Move beads to track AEP
- Satisfying physical feedback

**Method 4: Paper Tracking**
- Write AEP on paper
- Cross out and rewrite as it changes
- Minimalist approach

**Quick Reference Card Template**:
\`\`\`
SPELLGUARD QUICK REFERENCE

AEP GENERATION:
• Magical damage: 2 AEP per damage (3 for Arcane Warden)
• Physical damage: 1 AEP per 2 damage
• Mana drain: 1 AEP per mana
• Spell reflection: +5 AEP (Spell Breaker spec)

AEP SPENDING:
• Arcane Shield: 10 AEP (+2 armor, 20 absorb)
• Spell Reflection: 15 AEP (reflect spell)
• Barrier of Protection: 20 AEP (shield ally, 30 absorb)
• Anti-Magic Zone: 30 AEP (15 ft, +5 mana cost)
• Mana Drain Strike: 5 AEP (drain 1d6 mana)

STRATEGY:
• Tank magical damage to build AEP
• Spend on shields for allies or reflections
• Save 30+ AEP for Anti-Magic Zone
• Arcane Warden: Focus on absorption
• Spell Breaker: Focus on reflections
• Mana Reaver: Focus on mana drain
\`\`\`

**Thematic Enhancements**:

Many players enhance the Spellguard experience with:
- **Blue Dice**: Use blue dice for AEP tracking (arcane theme)
- **Shield Tokens**: Physical tokens representing active shields
- **Damage Crystals**: Blue crystals representing absorbed magical energy
- **AEP Beads**: String of beads for tracking AEP visually
- **Reflection Mirror**: Small mirror prop for spell reflections
- **Glow Effect**: LED tea light that glows when shields are active

**AEP Management Tips**:

**Generation Strategy**:
- **Tank Spells**: Position to intercept spells targeting allies
- **Maximize Absorption**: Take magical damage over physical when possible
- **Mana Drain**: Use melee attacks to generate AEP consistently
- **Arcane Warden**: Seek out magical damage sources
- **Spell Breaker**: Reflect spells for bonus AEP

**Spending Strategy**:
- **Emergency Shields**: Keep 20 AEP for Barrier of Protection
- **Reflection Ready**: Keep 15 AEP for Spell Reflection
- **Zone Control**: Save 30 AEP for Anti-Magic Zone in boss fights
- **Don't Cap**: Spend AEP before hitting 100 cap
- **Prioritize Allies**: Shield allies over yourself when possible

**Specialization Strategy**:
- **Arcane Warden**: Generate maximum AEP, spend on ally shields
- **Spell Breaker**: Reflect aggressively for bonus AEP and damage
- **Mana Reaver**: Drain mana constantly, spend on offensive abilities

**Why This System Works**: The AEP conversion system is simple math (damage × 2 for magical, damage ÷ 2 for physical) that creates a satisfying feedback loop. Taking damage feels GOOD because it generates resources. The physical act of adding tokens or rotating a die when you absorb a Fireball creates positive reinforcement. The spending decisions (shield myself vs shield ally vs reflect spell) create meaningful tactical choices. The system rewards aggressive positioning and tanking spells, making you feel like a true magical tank.

**Pro Tips**:
- **Quick Math**: Round AEP conversions for speed (39 damage → 80 AEP instead of 78)
- **Pre-Calculate**: Know common spell damages and their AEP values
- **Communicate**: Tell allies your AEP so they know when you can shield them
- **Track Shields**: Use separate tokens for active shield HP
- **Mana Drain**: Melee attacks are consistent AEP generation
- **Cap Awareness**: Don't waste absorption when at 100 AEP

**Budget-Friendly Alternatives**:
- **No tokens?** Use coins (pennies = 1 AEP, dimes = 10 AEP)
- **No d100?** Write AEP on paper
- **No shield cards?** Track shield HP on paper
- **Minimalist**: Just track AEP number on paper, reference costs

**Specialization-Specific Tracking**:

**Arcane Warden**:
- Track 3 AEP per magical damage (instead of 2)
- Mark when shields are active (+2 AC, +10% resistances)
- Track shield duration (50% longer)

**Spell Breaker**:
- Track +5 AEP bonus per reflection
- Mark reflected spells (+25% damage)
- Track reflection cooldown reduction

**Mana Reaver**:
- Track mana drained (enhanced on melee)
- Convert AEP to damage (offensive abilities)
- Track burst damage windows

**Why Spellguard Is Perfect for In-Person Play**: The class is built around simple math (damage → AEP conversion) that creates satisfying resource generation. Taking damage feels GOOD because it generates AEP, creating a unique psychological reward. The physical act of adding tokens or rotating a die when you absorb a Fireball is deeply satisfying. The spending decisions are clear and impactful—do I shield myself, shield my ally, or reflect the next spell? The system rewards aggressive positioning and tanking spells, making you feel like a true magical tank. Every spell that hits you makes you stronger, and that power fantasy translates perfectly to tabletop play.`
    }
  },

  // Specializations
  specializations: {
    title: 'Spellguard Specializations',
    description: 'Three distinct approaches to arcane absorption and anti-magic combat.',

    specs: [
      {
        id: 'arcane_warden',
        name: 'Arcane Warden',
        icon: 'spell_holy_powerwordshield',
        color: '#4169E1',
        theme: 'Defensive Tank',

        description: `The Arcane Warden specialization focuses on maximum magical absorption and ally protection. Arcane Wardens are the ultimate magical tanks, capable of shielding entire parties from devastating spell barrages. They excel at absorbing massive amounts of magical damage and converting it into protective barriers.`,

        playstyle: 'Defensive tank, maximum absorption, ally protection, sustained shielding',

        strengths: [
          'Highest AEP generation from absorbed damage',
          'Enhanced shield strength and duration',
          'Can protect multiple allies simultaneously',
          'Exceptional magical damage mitigation',
          'Longer-lasting protective barriers',
          'Bonus armor while shields are active'
        ],

        weaknesses: [
          'Less offensive capability than other specs',
          'Requires allies to protect to be most effective',
          'Lower damage output',
          'Dependent on enemy casters for AEP generation',
          'Less effective in solo situations'
        ],

        passiveAbility: {
          name: 'Arcane Absorption',
          description: 'All Spellguards passively absorb magical damage. Gain 2 AEP for every point of fire, cold, lightning, or necrotic damage taken. Additionally, gain 1 AEP for every 2 points of physical damage taken.',
          icon: 'spell_arcane_prismaticcloak'
        },

        specPassive: {
          name: 'Arcane Fortitude',
          description: 'Your absorption is enhanced. Gain 1.5x AEP for every point of magical damage absorbed (3 AEP per damage instead of 2). Additionally, while you have an active shield, gain +2 armor and +10% to all resistances.',
          icon: 'spell_holy_devotionaura'
        },

        keyAbilities: [
          'Enhanced Barriers - All shield abilities absorb 50% more damage and last 50% longer.',
          'Mass Protection - Barrier of Protection costs -5 AEP and affects all allies within 15 feet (instead of 10).',
          'Absorption Overflow - When your shields absorb damage, gain 1 AEP per 5 damage absorbed.'
        ]
      },

      {
        id: 'spell_breaker',
        name: 'Spell Breaker',
        icon: 'spell_holy_dispelmagic',
        color: '#9370DB',
        theme: 'Disruption Specialist',

        description: `The Spell Breaker specialization focuses on disrupting and reflecting enemy spells. Spell Breakers are aggressive anti-mage specialists who punish enemy casters by turning their own magic against them. They excel at spell reflection, counterspells, and making enemy casters regret every spell they cast.`,

        playstyle: 'Aggressive disruption, spell reflection, caster punishment, high-risk high-reward',

        strengths: [
          'Powerful spell reflection capabilities',
          'Bonus AEP from successful reflections',
          'Can reflect multiple spells in succession',
          'Disrupts enemy spell rotations',
          'Punishes enemy casters heavily',
          'Excellent against single powerful casters'
        ],

        weaknesses: [
          'Requires precise timing for reflections',
          'Less effective against non-casters',
          'Lower shield strength than Arcane Warden',
          'More vulnerable to spell barrages',
          'Requires good reaction speed'
        ],

        passiveAbility: {
          name: 'Arcane Absorption',
          description: 'All Spellguards passively absorb magical damage. Gain 2 AEP for every point of fire, cold, lightning, or necrotic damage taken. Additionally, gain 1 AEP for every 2 points of physical damage taken.',
          icon: 'spell_arcane_prismaticcloak'
        },

        specPassive: {
          name: 'Spell Reflection Mastery',
          description: 'Whenever you successfully reflect a spell, gain +5 AEP. Additionally, reflected spells deal 25% increased damage. Your Reflective Barrier and Spell Reflection abilities have their cooldowns reduced by 1 turn.',
          icon: 'spell_holy_dispelmagic'
        },

        keyAbilities: [
          'Rapid Reflection - Spell Reflection costs -5 AEP and can be used as a reaction.',
          'Reflection Chain - When you reflect a spell, your next reflection within 2 turns costs -10 AEP.',
          'Punishing Counter - Reflected spells have a 50% chance to also silence the caster for 1 turn.'
        ]
      },

      {
        id: 'mana_reaver',
        name: 'Mana Reaver',
        icon: 'spell_shadow_manafeed',
        color: '#8B008B',
        theme: 'Offensive Drain',

        description: `The Mana Reaver specialization focuses on aggressive mana drain and converting absorbed energy into devastating attacks. Mana Reavers are offensive anti-mages who drain enemy casters dry while unleashing powerful arcane strikes. They excel at eliminating enemy casters quickly through sustained mana pressure and burst damage.`,

        playstyle: 'Aggressive offense, mana drain focus, burst damage, caster elimination',

        strengths: [
          'Highest damage output of all Spellguard specs',
          'Enhanced mana drain on melee attacks',
          'Can convert AEP directly into damage',
          'Excellent at eliminating priority casters',
          'Strong sustained damage through mana drain',
          'Generates AEP consistently through melee'
        ],

        weaknesses: [
          'Requires melee range to be most effective',
          'Lower defensive capabilities',
          'More vulnerable to counterattacks',
          'Less effective at protecting allies',
          'Needs to balance offense with survival'
        ],

        passiveAbility: {
          name: 'Arcane Absorption',
          description: 'All Spellguards passively absorb magical damage. Gain 2 AEP for every point of fire, cold, lightning, or necrotic damage taken. Additionally, gain 1 AEP for every 2 points of physical damage taken.',
          icon: 'spell_arcane_prismaticcloak'
        },

        specPassive: {
          name: 'Mana Vampirism',
          description: 'Your melee attacks drain 2x mana (double the damage dealt). Additionally, for every 10 mana drained, your next melee attack deals +1d6 arcane damage (stacks up to 5 times). Empowered Strike and Arcane Strike cost -5 AEP.',
          icon: 'spell_shadow_manafeed'
        },

        keyAbilities: [
          'Devastating Strikes - Empowered Strike and Arcane Strike deal 50% increased damage.',
          'Mana Burn - When you drain mana from a target, they take 1 arcane damage per 2 mana drained.',
          'Energy Conversion - You can spend 20 AEP to instantly restore 20 mana (1 minute cooldown).'
        ]
      }
    ]
  },

  // Example Spells - showcasing AEP mechanics
  exampleSpells: [
    // BASIC DEFENSIVE SPELLS
    {
      id: 'sg_arcane_shield',
      name: 'Arcane Shield',
      description: 'Create a shield of absorbed arcane energy that protects you from incoming damage. The shield absorbs damage and grants bonus armor.',
      spellType: 'ACTION',
      icon: 'spell_holy_powerwordshield',
      school: 'Abjuration',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 4,
        classResource: {
          type: 'arcane_energy_points',
          cost: 10
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Aegis Arcanum!',
        somaticText: 'Raise hand to create shimmering barrier'
      },

      resolution: 'AUTOMATIC',

      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'arcane_shield',
          name: 'Arcane Shield',
          description: 'An arcane shield forms around you, enhancing your armor and creating a barrier that absorbs incoming damage. The shield glows with magical energy, protecting you from harm.',
          statModifier: {
            stat: 'armor',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: true
      },

      healingConfig: {
        useAbsorptionShield: true,
        shieldConfig: {
          shieldType: 'standard',
          shieldAmount: '10d6',
          duration: 1,
          durationUnit: 'minutes'
        }
      },

      tags: ['defense', 'shield', 'aep-cost', 'self-buff']
    },

    {
      id: 'sg_reflective_barrier',
      name: 'Reflective Barrier',
      description: 'Create a barrier that reflects the next spell cast at you back at the caster. The reflected spell deals full damage and uses the original caster\'s spell save DC.',
      spellType: 'REACTION',
      icon: 'spell_holy_dispelmagic',
      school: 'Abjuration',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        reactionTrigger: 'When targeted by a spell'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 6,
        classResource: {
          type: 'arcane_energy_points',
          cost: 10
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Reflecto!',
        somaticText: 'Thrust palm forward to create reflective ward'
      },

      resolution: 'AUTOMATIC',

      effects: {
        reflection: {
          type: 'spell',
          target: 'caster',
          percentage: 100,
          duration: 'next_spell'
        }
      },

      specialMechanics: {
        reflection: {
          reflectType: 'full_spell',
          targetOriginalCaster: true,
          usesOriginalDC: true
        }
      },

      tags: ['defense', 'reflection', 'reaction', 'aep-cost', 'anti-mage']
    },

    {
      id: 'sg_barrier_of_protection',
      name: 'Barrier of Protection',
      description: 'Create a protective barrier around all allies within range. The arcane energy forms shimmering shields that envelop each ally, absorbing incoming damage and protecting them from harm. The barriers pulse with protective magic.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing',
      school: 'Abjuration',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        aoeType: 'circle',
        aoeSize: 10,
        rangeType: 'self_centered',
        validTargets: ['ally']
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 6,
        classResource: {
          type: 'arcane_energy_points',
          cost: 15
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Protego Omnia!',
        somaticText: 'Sweep arms in circle to create protective dome'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        useAbsorptionShield: true,
        shieldConfig: {
          shieldType: 'standard',
          shieldAmount: '8d6',
          duration: 1,
          durationUnit: 'minutes'
        }
      },

      effects: {
        shield: {
          amount: '8d6',
          type: 'arcane',
          duration: 1,
          aoe: true,
          targets: 'all_allies'
        }
      },

      tags: ['defense', 'shield', 'aoe', 'aep-cost', 'ally-protection']
    },

    // OFFENSIVE SPELLS
    {
      id: 'sg_empowered_strike',
      name: 'Empowered Strike',
      description: 'Infuse your next melee attack with absorbed arcane energy, dealing additional arcane damage. The strike also drains additional mana from the target.',
      spellType: 'ACTION',
      icon: 'ability_warrior_innerrage',
      school: 'Evocation',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        validTargets: ['enemy']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 5,
        classResource: {
          type: 'arcane_energy_points',
          cost: 15
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Impetus!',
        somaticText: 'Channel energy into weapon'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '2d6',
        damageType: 'arcane',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '2d6',
            type: 'arcane',
            additionalToMelee: true
          }
        },
        manaDrain: {
          amount: '2d6',
          description: 'Drains additional mana equal to arcane damage dealt'
        }
      },

      tags: ['damage', 'melee', 'arcane', 'aep-cost', 'mana-drain']
    },

    {
      id: 'sg_arcane_nova',
      name: 'Arcane Nova',
      description: 'Release stored arcane energy in a devastating burst around you. The accumulated magical power explodes outward in a wave of pure arcane force, damaging enemies and disrupting their spellcasting. The burst leaves a lingering field that weakens magical attacks.',
      spellType: 'ACTION',
      icon: 'spell_arcane_blast',
      school: 'Evocation',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        aoeType: 'circle',
        aoeSize: 20,
        rangeType: 'self_centered',
        validTargets: ['enemy']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 8,
        classResource: {
          type: 'arcane_energy_points',
          cost: 25
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Arcanum Explodo!',
        somaticText: 'Slam fists together to release energy burst'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'agility',
        saveDC: 15,
        onSaveEffect: 'half_damage'
      },

      damageConfig: {
        formula: '6d6',
        damageType: 'arcane',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '6d6',
            type: 'arcane',
            aoe: true
          }
        },
        debuff: {
          type: 'spell_damage_reduction',
          amount: -2,
          duration: 1,
          durationType: 'turns',
          durationUnit: 'turns'
        }
      },

      tags: ['damage', 'aoe', 'arcane', 'aep-cost', 'debuff']
    },

    {
      id: 'sg_arcane_strike',
      name: 'Arcane Strike',
      description: 'Channel massive arcane energy into your weapon for a devastating melee strike. Deals heavy arcane damage and silences the target for 1 turn.',
      spellType: 'ACTION',
      icon: 'spell_holy_blessingofstrength',
      school: 'Evocation',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        validTargets: ['enemy']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 5,
        classResource: {
          type: 'arcane_energy_points',
          cost: 15
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Arcanum Impactus!',
        somaticText: 'Overhead strike with glowing weapon'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '4d6',
        damageType: 'arcane',
        scalingType: 'none'
      },

      effects: {
        damage: {
          instant: {
            formula: '4d6',
            type: 'arcane',
            additionalToMelee: true
          }
        },
        debuff: {
          type: 'silence',
          duration: 1,
          durationType: 'turns',
          description: 'Target is completely silenced and cannot cast spells for the duration. All spellcasting attempts automatically fail.'
        }
      },

      tags: ['damage', 'melee', 'arcane', 'aep-cost', 'silence', 'anti-mage']
    },

    // UTILITY SPELLS
    {
      id: 'sg_arcane_rejuvenation',
      name: 'Arcane Rejuvenation',
      description: 'Convert absorbed arcane energy into healing power. Heal yourself or an ally, restoring hit points based on your stored AEP.',
      spellType: 'ACTION',
      icon: 'spell_holy_heal',
      school: 'Abjuration',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        validTargets: ['ally', 'self']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 6,
        classResource: {
          type: 'arcane_energy_points',
          cost: 20
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Sanatio Arcana!',
        somaticText: 'Channel healing energy toward target'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        formula: '3d6',
        healingType: 'direct',
        resolution: 'DICE'
      },

      effects: {
        healing: {
          instant: {
            formula: '3d6',
            type: 'arcane'
          }
        }
      },

      tags: ['healing', 'utility', 'aep-cost', 'support']
    },

    {
      id: 'sg_elemental_resistance',
      name: 'Elemental Resistance',
      description: 'Use absorbed energy to grant yourself or an ally resistance to a chosen element (fire, cold, lightning, or necrotic) for 1 minute.',
      spellType: 'ACTION',
      icon: 'spell_nature_resistnature',
      school: 'Abjuration',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        rangeDistance: 5,
        validTargets: ['ally', 'self']
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 4,
        classResource: {
          type: 'arcane_energy_points',
          cost: 10
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Resistentia!',
        somaticText: 'Touch target to grant resistance'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'elemental_resistance',
          elements: ['fire', 'cold', 'lightning', 'necrotic'],
          chooseOne: true,
          duration: 1,
          durationType: 'minutes',
          resistanceAmount: 'half_damage'
        }
      },

      tags: ['buff', 'resistance', 'utility', 'aep-cost', 'protection']
    },

    {
      id: 'sg_spell_disruption',
      name: 'Spell Disruption',
      description: 'Disrupt an enemy spell being cast, causing it to fail. You sense the magical energy gathering and strike at the perfect moment, severing the connection between the caster and their spell. The disrupted magic fizzles harmlessly.',
      spellType: 'REACTION',
      icon: 'spell_shadow_curseofachimonde',
      school: 'Abjuration',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        reactionTrigger: 'When you see an enemy casting a spell within 60 feet'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        validTargets: ['enemy']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 5,
        classResource: {
          type: 'arcane_energy_points',
          cost: 15
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Silentium!',
        somaticText: 'Cutting gesture to sever spell'
      },

      resolution: 'AUTOMATIC',

      effects: {
        counterspell: {
          type: 'interrupt',
          spellLevel: 'any',
          success: 'automatic'
        }
      },

      tags: ['counterspell', 'reaction', 'utility', 'aep-cost', 'anti-mage']
    },

    {
      id: 'sg_reflective_aura',
      name: 'Reflective Aura',
      description: 'Create an aura around yourself that reflects spell damage back at attackers. The reflective field shimmers with arcane energy, catching incoming spells and turning them back against their casters. The aura has a limited capacity before it dissipates.',
      spellType: 'ACTION',
      icon: 'spell_holy_holyprotection',
      school: 'Abjuration',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 6,
        classResource: {
          type: 'arcane_energy_points',
          cost: 15
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Aura Reflectus!',
        somaticText: 'Spin to create reflective field'
      },

      resolution: 'AUTOMATIC',

      effects: {
        aura: {
          type: 'reflection',
          reflectionAmount: 10,
          reflectionType: 'spell_damage',
          duration: 1,
          durationType: 'minutes',
          durationUnit: 'minutes'
        }
      },

      tags: ['buff', 'reflection', 'aura', 'aep-cost', 'anti-mage']
    },

    // ULTIMATE SPELLS
    {
      id: 'sg_arcane_fortress',
      name: 'Arcane Fortress',
      description: 'Create an impenetrable fortress of arcane energy around yourself, granting complete immunity to all magical damage for 1 turn. This is your ultimate defensive ability.',
      spellType: 'ACTION',
      icon: 'spell_holy_divineshield',
      school: 'Abjuration',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'turns',
        duration: 1
      },

      resourceCost: {
        mana: 8,
        classResource: {
          type: 'arcane_energy_points',
          cost: 25
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Fortis Arcanum Absolutum!',
        somaticText: 'Cross arms to create impenetrable barrier'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          type: 'immunity',
          immunityType: 'magical_damage',
          duration: 1,
          durationType: 'turns',
          durationUnit: 'turns'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5,
        charges: 1
      },

      tags: ['defense', 'immunity', 'ultimate', 'aep-cost', 'anti-mage']
    },

    {
      id: 'sg_magic_nullification',
      name: 'Magic Nullification',
      description: 'Create an anti-magic zone centered on yourself. The area becomes a void of magical energy, suppressing all spells and magical effects. Enemies within the zone find their magic completely nullified, unable to cast spells or benefit from magical effects.',
      spellType: 'ACTION',
      icon: 'spell_shadow_antimagicshell',
      school: 'Abjuration',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        aoeType: 'circle',
        aoeSize: 20,
        rangeType: 'self_centered'
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 6,
        classResource: {
          type: 'arcane_energy_points',
          cost: 20
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Nullus Magicae!',
        somaticText: 'Slam staff/weapon into ground to create zone'
      },

      resolution: 'AUTOMATIC',

      effects: {
        zone: {
          type: 'anti_magic',
          radius: 20,
          duration: 1,
          durationType: 'minutes',
          effects: [
            'suppress_magical_effects',
            'prevent_spellcasting',
            'dispel_ongoing_spells'
          ]
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3,
        charges: 1
      },

      tags: ['zone', 'anti-magic', 'ultimate', 'aep-cost', 'control']
    },

    {
      id: 'sg_spell_reflection',
      name: 'Spell Reflection',
      description: 'Instantly reflect the next spell cast at you back to the caster with increased power. The magical energy is caught and amplified, turning the caster\'s own spell against them with devastating force. The reflection cannot be countered.',
      spellType: 'REACTION',
      icon: 'spell_arcane_blink',
      school: 'Abjuration',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        reactionTrigger: 'When targeted by a spell'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 6,
        classResource: {
          type: 'arcane_energy_points',
          cost: 15
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Reverso Maxima!',
        somaticText: 'Deflecting gesture'
      },

      resolution: 'AUTOMATIC',

      effects: {
        reflection: {
          type: 'spell',
          target: 'caster',
          percentage: 150,
          duration: 'next_spell',
          uncounterable: true
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 2,
        charges: 1
      },

      tags: ['reflection', 'reaction', 'ultimate', 'aep-cost', 'anti-mage']
    },

    {
      id: 'sg_control_magic',
      name: 'Control Magic',
      description: 'Take control of a newly summoned creature or magical construct. You seize the magical bonds that hold the creature, twisting them to serve you instead. The creature becomes your servant, following your commands until the control is broken or dismissed.',
      spellType: 'REACTION',
      icon: 'spell_shadow_charm',
      school: 'Enchantment',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'REACTION',
        reactionTrigger: 'When you see a creature being summoned within 60 feet'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        validTargets: ['summoned_creature']
      },

      durationConfig: {
        durationType: 'minutes',
        duration: 1
      },

      resourceCost: {
        mana: 7,
        classResource: {
          type: 'arcane_energy_points',
          cost: 20
        },
        components: ['verbal', 'somatic'],
        verbalText: 'Dominus Magicae!',
        somaticText: 'Grasping gesture to seize control'
      },

      resolution: 'SAVE',

      saveConfig: {
        saveType: 'spirit',
        saveDC: 16,
        onSaveEffect: 'negates'
      },

      effects: {
        control: {
          type: 'charm',
          targetType: 'summoned',
          duration: 1,
          durationType: 'minutes',
          fullControl: true
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3,
        charges: 1
      },

      tags: ['control', 'charm', 'reaction', 'aep-cost', 'anti-mage', 'ultimate']
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: 'spellguard_spell_theft',
      name: 'Spell Theft',
      description: 'Steal a spell from an enemy spellcaster, gaining the ability to cast it yourself.',
      level: 6,
      spellType: 'REACTION',
      icon: 'spell_arcane_blast',

      typeConfig: {
        school: 'abjuration',
        icon: 'spell_arcane_blast',
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy', 'spellcaster']
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 25, aep: 20 },
        actionPoints: 0,
        components: ['somatic'],
        somaticText: 'Grasp the magic'
      },

      resolution: 'DICE',
      effectTypes: ['utility'],

      specialMechanics: {
        spellTheft: {
          description: 'When an enemy casts a spell, steal it. Counter the original and gain the ability to cast it once within 1 minute.',
          saveDC: 17,
          saveType: 'intelligence'
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['utility', 'anti-mage', 'counter', 'level-6', 'spellguard']
    },

    {
      id: 'spellguard_arcane_fortress',
      name: 'Arcane Fortress',
      description: 'Create a fortress of magical energy that protects all allies within from magical attacks.',
      level: 6,
      spellType: 'ACTION',
      icon: 'spell_holy_powerwordbarrier',

      typeConfig: {
        school: 'abjuration',
        icon: 'spell_holy_powerwordbarrier',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 30, aep: 25 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Arx Magica!',
        somaticText: 'Create barrier'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'spell_resistance',
        effects: [{
          id: 'arcane_fortress',
          name: 'Arcane Fortress',
          description: 'Allies gain resistance to spell damage and advantage on saves vs magic'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['buff', 'protection', 'aoe', 'level-6', 'spellguard']
    },

    {
      id: 'spellguard_mana_drain_pulse',
      name: 'Mana Drain Pulse',
      description: 'Release a pulse that drains mana from all enemies in range and restores your own.',
      level: 6,
      spellType: 'ACTION',
      icon: 'spell_arcane_arcane04',

      typeConfig: {
        school: 'enchantment',
        icon: 'spell_arcane_arcane04',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 20 },
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Drain!'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'utility'],

      damageConfig: {
        formula: '4d8',
        elementType: 'force',
        damageType: 'mana_drain',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'intelligence',
          difficultyClass: 16,
          saveOutcome: 'halves'
        }
      },

      specialMechanics: {
        manaDrain: {
          description: 'Drains mana from each enemy hit. You regain half the total mana drained.',
          formula: '3d10',
          restorePercentage: 50
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      tags: ['damage', 'utility', 'mana-drain', 'aoe', 'level-6', 'spellguard']
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: 'spellguard_antimagic_zone',
      name: 'Antimagic Zone',
      description: 'Create a zone where all magic is suppressed. No spells can be cast within.',
      level: 7,
      spellType: 'ACTION',
      icon: 'spell_shadow_antishadow',

      typeConfig: {
        school: 'abjuration',
        icon: 'spell_shadow_antishadow',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 }
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 40, aep: 30 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'NULLUM MAGICUM!',
        somaticText: 'Create null field'
      },

      resolution: 'NONE',
      effectTypes: ['zone', 'control'],

      zoneConfig: {
        duration: 5,
        durationUnit: 'rounds',
        effects: ['antimagic'],
        movable: false,
        size: { radius: 20 }
      },

      specialMechanics: {
        antimagic: {
          description: 'All magic is suppressed in this zone. No spells can be cast, magical items don\'t function, and ongoing spell effects are suspended.',
          affectsAllies: true
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 6
      },

      tags: ['zone', 'control', 'anti-magic', 'level-7', 'spellguard']
    },

    {
      id: 'spellguard_spell_reflection',
      name: 'Spell Reflection',
      description: 'Create a barrier that reflects spells back at their casters.',
      level: 7,
      spellType: 'REACTION',
      icon: 'spell_frost_frost_shock',

      typeConfig: {
        school: 'abjuration',
        icon: 'spell_frost_frost_shock',
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 35, aep: 25 },
        actionPoints: 0,
        components: ['somatic'],
        somaticText: 'Mirror gesture'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'reflection',
        effects: [{
          id: 'spell_reflection',
          name: 'Spell Reflection',
          description: 'The next spell targeting you is reflected back at the caster with full effect'
        }],
        durationValue: 1,
        durationType: 'uses',
        durationUnit: 'uses'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['buff', 'reflection', 'anti-mage', 'level-7', 'spellguard']
    },

    {
      id: 'spellguard_arcane_overload',
      name: 'Arcane Overload',
      description: 'Overload a spellcaster with arcane energy, causing them to take 8d10 + intelligence force damage (plus bonus damage equal to target\'s remaining mana, max 50).',
      level: 7,
      spellType: 'ACTION',
      icon: 'spell_arcane_arcanetorrent',

      typeConfig: {
        school: 'evocation',
        icon: 'spell_arcane_arcanetorrent',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 40, aep: 30 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'OVERLOAD!'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '8d10 + intelligence',
        elementType: 'force',
        damageType: 'direct',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 17,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        bonusEffects: 'Deals bonus damage equal to target\'s remaining mana (max 50)',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          extraDice: '4d10',
          critEffects: ['mana_drain']
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 4
      },

      tags: ['damage', 'anti-mage', 'level-7', 'spellguard']
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: 'spellguard_mage_bane',
      name: 'Mage Bane',
      description: 'Mark an enemy spellcaster. They take 5d10 force damage whenever they cast a spell.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_shadow_mindtwisting',

      typeConfig: {
        school: 'enchantment',
        icon: 'spell_shadow_mindtwisting',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 90,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 50, aep: 35 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'BANE OF MAGES!'
      },

      resolution: 'NONE',
      effectTypes: ['debuff'],

      debuffConfig: {
        debuffType: 'mark',
        effects: [{
          id: 'mage_bane',
          name: 'Mage Bane',
          description: 'Target takes 5d10 force damage whenever they cast a spell',
          damageFormula: '5d10'
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        saveDC: 18,
        saveType: 'spirit',
        saveOutcome: 'negates'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['debuff', 'anti-mage', 'mark', 'level-8', 'spellguard']
    },

    {
      id: 'spellguard_impenetrable_ward',
      name: 'Impenetrable Ward',
      description: 'Create an absolutely impenetrable magical ward that blocks all damage and effects.',
      level: 8,
      spellType: 'REACTION',
      icon: 'spell_holy_divineprovidence',

      typeConfig: {
        school: 'abjuration',
        icon: 'spell_holy_divineprovidence',
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 55, aep: 40 },
        actionPoints: 0,
        components: ['somatic'],
        somaticText: 'Create perfect shield'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'invulnerability',
        effects: [{
          id: 'impenetrable_ward',
          name: 'Impenetrable Ward',
          description: 'Target is immune to all damage and effects until start of their next turn'
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['buff', 'protection', 'reaction', 'level-8', 'spellguard']
    },

    {
      id: 'spellguard_arcane_annihilation',
      name: 'Arcane Annihilation',
      description: 'Unleash devastating arcane power that destroys magical defenses and deals 12d8 + intelligence × 2 force damage.',
      level: 8,
      spellType: 'ACTION',
      icon: 'spell_arcane_blast',

      typeConfig: {
        school: 'evocation',
        icon: 'spell_arcane_blast',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 90,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 60, aep: 50 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'ARCANE ANNIHILATION!',
        somaticText: 'Release all power'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '12d8 + intelligence * 2',
        elementType: 'force',
        damageType: 'area',
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 19,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        specialRules: 'Destroys all magical shields and barriers. Ignores spell resistance.',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 3.0,
          extraDice: '6d8',
          critEffects: ['spell_destruction', 'stun']
        }
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 5
      },

      tags: ['damage', 'aoe', 'anti-magic', 'level-8', 'spellguard']
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: 'spellguard_absolute_counterspell',
      name: 'Absolute Counterspell',
      description: 'Counter any spell, regardless of level, and prevent the caster from casting for 1 round.',
      level: 9,
      spellType: 'REACTION',
      icon: 'spell_frost_iceshock',

      typeConfig: {
        school: 'abjuration',
        icon: 'spell_frost_iceshock',
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 120,
        targetRestrictions: ['enemy', 'casting']
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 70, aep: 60 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'ABSOLUTE NEGATION!'
      },

      resolution: 'NONE',
      effectTypes: ['utility', 'control'],

      specialMechanics: {
        absoluteCounter: {
          description: 'Automatically counters any spell, no roll required. The caster is silenced for 1 round.',
          noSave: true
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['utility', 'counter', 'control', 'ultimate', 'level-9', 'spellguard']
    },

    {
      id: 'spellguard_arcane_prison',
      name: 'Arcane Prison',
      description: 'Trap an enemy in an arcane prison where they cannot act or be harmed.',
      level: 9,
      spellType: 'ACTION',
      icon: 'spell_arcane_blink',

      typeConfig: {
        school: 'conjuration',
        icon: 'spell_arcane_blink',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 75, aep: 60 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'PRISON OF MAGIC!',
        somaticText: 'Create prison barrier'
      },

      resolution: 'NONE',
      effectTypes: ['control'],

      controlConfig: {
        controlType: 'imprisonment',
        strength: 'absolute',
        duration: 1,
        durationUnit: 'minutes',
        saveDC: 20,
        saveType: 'spirit',
        savingThrow: true,
        effects: [{
          id: 'arcane_prison',
          name: 'Arcane Prison',
          description: 'Target is trapped in a prison of arcane energy. They cannot act or be targeted. At end of each turn, can repeat save.'
        }]
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['control', 'imprisonment', 'ultimate', 'level-9', 'spellguard']
    },

    {
      id: 'spellguard_magic_eater',
      name: 'Magic Eater',
      description: 'Consume all magic in a massive area, gaining power from every spell destroyed.',
      level: 9,
      spellType: 'ACTION',
      icon: 'spell_shadow_soulleech',

      typeConfig: {
        school: 'abjuration',
        icon: 'spell_shadow_soulleech',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 60 }
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 80, aep: 70 },
        actionPoints: 3,
        components: ['verbal'],
        verbalText: 'CONSUME ALL MAGIC!'
      },

      resolution: 'NONE',
      effectTypes: ['utility', 'buff'],

      specialMechanics: {
        magicEater: {
          description: 'Dispel ALL magical effects in range. For each effect dispelled, gain +5 temporary HP and +1 to damage for 1 minute.',
          maxStacks: 20
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['utility', 'buff', 'dispel', 'ultimate', 'level-9', 'spellguard']
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: 'spellguard_avatar_of_negation',
      name: 'Avatar of Negation',
      description: 'Transform into an avatar of anti-magic, becoming immune to all magic and negating all spells near you.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_holy_divineillumination',

      typeConfig: {
        school: 'transmutation',
        icon: 'spell_holy_divineillumination',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 100, aep: 'all' },
        actionPoints: 3,
        components: ['verbal'],
        verbalText: 'I AM THE END OF MAGIC!'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        transformationType: 'arcane',
        targetType: 'self',
        duration: 3,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Avatar of Negation',
        description: 'Become a being of pure anti-magic.',
        grantedAbilities: [
          { id: 'negation_armor', name: 'Negation Armor', description: '+8 armor against magical attacks' },
          { id: 'spell_immunity', name: 'Spell Immunity', description: 'Immune to all spell damage' },
          { id: 'antimagic_aura', name: 'Anti-Magic Aura', description: 'Spells cast within 20ft have disadvantage on attack rolls' },
          { id: 'magic_devourer', name: 'Magic Devourer', description: 'When you negate a spell, deal force damage to the caster', damageFormula: '3d10' },
          { id: 'negation_drain', name: 'Negation Drain (On End)', description: 'Lose all remaining AEP when transformation ends' }
        ],
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['transformation', 'anti-magic', 'ultimate', 'level-10', 'spellguard']
    },

    {
      id: 'spellguard_reality_anchor',
      name: 'Reality Anchor',
      description: 'Anchor reality itself, preventing all magical teleportation and dimensional travel in a massive area.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_holy_powerwordbarrier',

      typeConfig: {
        school: 'abjuration',
        icon: 'spell_holy_powerwordbarrier',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 200 }
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 100, aep: 80 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'REALITY IS ANCHORED!',
        somaticText: 'Anchor gesture'
      },

      resolution: 'NONE',
      effectTypes: ['zone'],

      zoneConfig: {
        duration: 10,
        durationUnit: 'minutes',
        effects: ['no_teleportation', 'no_dimensional_travel', 'no_summoning'],
        movable: false,
        size: { radius: 200 }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['zone', 'control', 'ultimate', 'level-10', 'spellguard']
    },

    {
      id: 'spellguard_ultimate_dispel',
      name: 'Ultimate Dispel',
      description: 'Dispel every magical effect on the battlefield, regardless of power level.',
      level: 10,
      spellType: 'ACTION',
      icon: 'spell_arcane_arcane04',

      typeConfig: {
        school: 'abjuration',
        icon: 'spell_arcane_arcane04',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 120 }
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: { mana: 100, aep: 100 },
        actionPoints: 3,
        components: ['verbal'],
        verbalText: 'ALL MAGIC ENDS!'
      },

      resolution: 'NONE',
      effectTypes: ['utility'],

      specialMechanics: {
        ultimateDispel: {
          description: 'Dispel ALL magical effects in range - buffs, debuffs, zones, summons, everything. No exceptions. No saves.',
          affectsAllies: true,
          affectsEnemies: true,
          affectsSelf: false
        }
      },

      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },

      tags: ['utility', 'dispel', 'ultimate', 'level-10', 'spellguard']
    },

    // ADDITIONAL LEVEL 5 SPELL
    {
      id: 'spellguard_arcane_barrier',
      name: 'Arcane Barrier',
      description: 'Create a powerful arcane barrier that absorbs damage and reflects force damage back at attackers.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['buff', 'utility'],

      typeConfig: {
        school: 'abjuration',
        icon: 'spell_holy_powerwordbarrier',
        tags: ['buff', 'shield', 'reflection', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      buffConfig: {
        buffType: 'temporaryHP',
        effects: [{
          id: 'arcane_barrier',
          name: 'Arcane Barrier',
          description: 'Gain temporary HP that reflects force damage to attackers',
          temporaryHP: 50,
          reflectDamage: '2d8',
          reflectType: 'force'
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      resourceCost: {
        resourceTypes: ['mana', 'aep'],
        resourceValues: {
          mana: 25,
          aep: 20
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: {
        type: 'turn_based',
        value: 3
      },

      resolution: 'DICE',
      tags: ['buff', 'shield', 'reflection', 'universal']
    }
  ]
};


