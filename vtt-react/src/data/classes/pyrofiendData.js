/**
 * Pyrofiend Class Data
 * 
 * Complete class information for the Pyrofiend - a demonic fire wielder
 * with ascending corruption stages and massive damage potential.
 */

export const PYROFIEND_DATA = {
  id: 'pyrofiend',
  name: 'Pyrofiend',
  icon: 'fas fa-fire',
  role: 'Damage',
  damageTypes: ['fire'],

  // Overview section
  overview: {
    title: 'The Pyrofiend',
    subtitle: 'Demonic Fire Wielder',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Pyrofiend ascends through 10 levels of demonic corruption (Inferno Veil 0-9), gaining escalating fire damage bonuses at the cost of increasingly catastrophic drawbacks inspired by the circles of Hell. Climb too high and the corruption will kill you—stay too low and you waste your demonic potential.

**Core Mechanic**: Cast fire spells → Ascend Inferno Levels → Gain fire damage bonus (+1 to +8, then +10 at Level 9 "The Demon's Bargain") → Suffer escalating drawbacks (self-damage, movement loss, suffocation) → Use Cooling Ember to descend and heal

**Resource**: Inferno Veil (0-9 scale, tracked with a single d10 die)

**Playstyle**: Risk-reward demonic escalation with catastrophic consequences

**Best For**: Players who thrive on living dangerously, managing escalating self-harm for devastating firepower, and making split-second tactical decisions about when to push harder or pull back`
    },
    
    description: `The Pyrofiend is a master of demonic fire magic, channeling infernal power through the dangerous Inferno Veil mechanic. As they cast fire spells, they ascend through increasingly powerful—and perilous—stages of demonic corruption. Each stage amplifies their fire damage but inflicts severe drawbacks inspired by the circles of Dante's Inferno and the seven deadly sins.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Pyrofiends walk a razor's edge between mortal and demon. They have made pacts with infernal entities, trading their humanity for devastating power. In roleplay, Pyrofiends often struggle with their demonic nature—some embrace it fully, reveling in destruction, while others fight to maintain control over the corruption that threatens to consume them.
      
Their connection to hellfire manifests physically: eyes that glow with inner flame, skin that radiates heat, and an aura of sulfur and ash. At higher Inferno Levels, their appearance becomes increasingly demonic—horns may sprout, skin may crack to reveal molten veins, and their voice may echo with infernal resonance.

Common Pyrofiend archetypes include:
- **The Damned Scholar**: Sought forbidden knowledge and paid the price
- **The Vengeful Burned**: Survived a terrible fire and emerged changed
- **The Willing Vessel**: Deliberately sought demonic power for a greater purpose
- **The Cursed Bloodline**: Born with infernal heritage they cannot escape`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Pyrofiend is one of the highest damage dealers in the game. They excel at:

**Burst Damage**: Ascending to high Inferno Levels unleashes devastating fire damage
**Sustained Pressure**: Burn effects and damage-over-time keep enemies under constant threat  
**Risk-Reward Gameplay**: Managing Inferno Levels creates exciting tactical decisions
**Area Control**: Fire-based AOE spells can control the battlefield

However, this power comes at a cost. The Pyrofiend's drawbacks at high Inferno Levels can be crippling, requiring careful resource management and strategic timing. A Pyrofiend who ascends too quickly may find themselves unable to survive their own power.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Pyrofiend is about managing risk versus reward. Key strategic considerations:

**Inferno Level Management**: 
- Low levels (0-3): Safe, consistent damage
- Mid levels (4-6): High damage with manageable drawbacks
- High levels (7-9): Devastating power but extreme vulnerability

**Timing Your Ascension**: 
- Ascend rapidly for burst damage when you need to eliminate priority targets
- Maintain mid-levels for sustained combat effectiveness
- Use Cooling Ember strategically to descend when drawbacks become too severe

**Specialization Synergies**:
- **Inferno**: Pure damage, aggressive ascension
- **Wildfire**: Spread and area control
- **Hellfire**: Demonic utility and self-sustain

**Team Dynamics**:
- Requires protection from tanks when at high Inferno Levels
- Benefits from healers who can offset self-damage
- Synergizes with crowd control to safely ascend`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Infernal Ascension',
      content: `**The Setup**: You're a Pyrofiend (Inferno specialization) facing a powerful ice elemental and its minions (1 ice elemental + 4 frost wraiths). Your party is with you. Starting Inferno Level: 0. Starting Mana: 60/60. Your goal: Ascend through Inferno Levels to maximize fire damage, but manage the increasingly severe drawbacks.

**Starting State**: Inferno Level: 0/9 | Fire Damage Bonus: +0 | Mana: 60/60 | HP: 45/45

**Turn 1 - First Flames (Inferno: 0 → 1)**

*The ice elemental looms before you, frost radiating from its crystalline form. You feel the demonic fire stirring within. Time to let it OUT.*

**Your Action**: Cast "Ember Spark" at Ice Elemental (3 mana, ascends +1 Inferno)
**Attack Roll**: d20+7 → [16] = Hit!
**Base Damage**: 1d6 fire → [5] = 5 fire damage
**Inferno Bonus**: +0 (currently at Level 0)
**DoT Applied**: 1d4 fire damage per round for 2 rounds
**Total Damage**: **5 fire damage** (plus ongoing burn)

*The spark burrows into the elemental's icy hide. Ice cracks and steam hisses.*

**Inferno Ascension**: 0 → **1** (Ember Spark ascends +1)
**Fire Damage Bonus**: +0 → **+1**
**Drawback (Level 1 - Limbo)**: Minor visual distortions reduce hit chance by 2

**Mana**: 60 - 3 = 57/60

*You feel the inferno stirring. Your eyes begin to glow faintly with inner fire.*

**Your Party's Tank**: "Your eyes... they're glowing!"
**You**: "The fire is waking up. Inferno Level 1. Just a flicker. +1 fire damage now."

**Current State**: Inferno: 1/9 | Fire Bonus: +1 | Mana: 57/60 | HP: 45/45

**Turn 2 - Rising Heat (Inferno: 1 → 3)**

*The frost wraiths swarm. Your tank intercepts most, but you need AREA control.*

**Your Action**: Cast "Cinder Bolt" at Frost Wraith group (8 mana, ascends +2 Inferno, AoE 5ft radius)
**Damage Roll**: 2d6 + INT fire → [5, 6] + 3 = 14 fire damage
**Inferno Bonus**: +1 (currently at Level 1)
**Total Damage**: 14 + 1 = **15 fire damage to wraiths in blast**

*The cinder bolt EXPLODES on impact. Two wraiths screech as embers tear through them.*

**Frost Wraiths**: 2 wraiths heavily damaged, 2 wraiths moderately damaged

**Inferno Ascension**: 1 → **3** (Cinder Bolt ascends +2)
**Fire Damage Bonus**: +1 → **+3**
**Drawback (Level 3 - Gluttony)**: -10 ft movement, constant fatigue

**Mana**: 57 - 8 = 49/60

*Heat radiates from your skin. The air around you SHIMMERS. You feel heavier, slower — but POWERFUL.*

**Your Party's Healer**: "You're... changing. You're moving slower!"
**You**: "Inferno Level 3. The demon stirs. -10 ft movement but +3 fire damage to EVERYTHING now. Worth it."

*Frost wraith strikes you for 3 damage*

**HP**: 45 - 3 = 42/45

**Current State**: Inferno: 3/9 | Fire Bonus: +3 | Mana: 49/60 | HP: 42/45

**Turn 3 - Demonic Fury (Inferno: 3 → 5)**

*The fatigue is real, but so is the power. You need MORE. The tank is holding the line — time to go big.*

**Your Action**: Cast "Fireball" at Ice Elemental (12 mana, ascends +2 Inferno, AoE 10ft sphere)
**Damage Roll**: 3d6 + INT fire → [6, 5, 4] + 3 = 18 fire damage
**Inferno Bonus**: +3 (currently at Level 3)
**Total Damage**: 18 + 3 = **21 fire damage to elemental and nearby wraiths**

*The fireball DETONATES against the elemental. Ice shatters. The remaining wraiths BURN.*

**Frost Wraiths**: 2 wraiths DEAD, 2 wraiths destroyed by blast
**Ice Elemental**: 21 fire damage — HEAVILY DAMAGED

**Inferno Ascension**: 3 → **5** (Fireball ascends +2)
**Fire Damage Bonus**: +3 → **+5**
**Drawback (Level 5 - Wrath)**: Body cracks, 1d6 bleeding per turn, weakened defenses
**Infernal Surge Triggered**: Next fire spell deals +2d6 fire damage (Path Passive at Level 5+)

**Bleeding Damage**: 1d6 → [4] = 4 damage
**HP**: 42 - 4 = 38/45

*The transformation accelerates. Your skin begins to crack, revealing MOLTEN VEINS beneath. Small horns sprout from your forehead.*

**You (voice echoing)**: "INFERNO LEVEL FIVE. THE DEMON EMERGES. +5 FIRE DAMAGE. AND MY NEXT SPELL GETS +2d6 FROM INFERNAL SURGE."

**Your Party's Mage**: "But you're BLEEDING!"
**You**: "The demon demands blood. Mine will do."

**Current State**: Inferno: 5/9 | Fire Bonus: +5 | Mana: 49 - 12 = 37/60 | HP: 38/45

**Turn 4 - Maximum Inferno (Inferno: 5 → 8)**

*Only the ice elemental remains, wounded and desperate. You need MAXIMUM POWER to finish it.*

**Your Action**: Cast "Hellfire Wave" at Ice Elemental (20 mana, ascends +2 Inferno, 30ft cone)
**Damage Roll**: 8d6 + INT fire → [7, 6, 8, 5, 6, 7, 4, 8] + 3 = 54 fire damage
**Inferno Bonus**: +5 (currently at Level 5)
**Infernal Surge**: +2d6 → [6, 7] = +13 fire damage
**Total Damage**: 54 + 5 + 13 = **72 fire damage!**

*You sweep your arms forward. A WAVE OF HELLFIRE engulfs the elemental. It MELTS, screaming — ice becoming steam in an instant.*

**Ice Elemental**: DEAD — OBLITERATED

**Inferno Ascension**: 5 → **7** (Hellfire Wave ascends +2)

*But you're not done. The elemental is dead, but the demon HUNGERs. You cast one more —*

**Bonus Action**: Cast "Infernal Blast" at surviving Frost Wraith (20 mana, ascends +2)
**Damage Roll**: 5d6 + INT fire → [6, 5, 4, 6, 5] + 3 = 29 fire damage
**Inferno Bonus**: +7 (currently at Level 7)
**Total Damage**: 29 + 7 = **36 fire damage!**

*The wraith doesn't just die — it CEASES TO EXIST. Nothing but ash.*

**Inferno Ascension**: 7 → **9** (MAXIMUM INFERNO — Infernal Blast ascends +2 more)
**Fire Damage Bonus**: +7 → **+10** (The Demon's Bargain — Level 9 grants +10, not +9)
**Drawback (Level 9 - Treachery)**: 4d8 self-damage per turn, death in 3 turns if not extinguished, disadvantage on all saves

**Mana**: 37 - 20 - 20 = -3... wait, you only had 37 mana. The second cast fails!

**CORRECTION**: You cast Hellfire Wave (20 mana) → Mana: 37 - 20 = 17/60
**Inferno Ascension**: 5 → **7** (not 9 — you don't have mana for the second cast)

*The elemental is DEAD. One frost wraith remains.*

**Current State**: Inferno: 7/9 | Fire Bonus: +7 | Mana: 17/60 | HP: 38/45

**Drawback (Level 7 - Violence)**: -15 ft speed, 1d6 suffocation per turn

**Suffocation Damage**: 1d6 → [5] = 5 damage
**HP**: 38 - 5 = 33/45

*Your horns GROW LARGER. Your eyes are PITS OF FLAME. Sulfurous smoke pours from your mouth. The demon is almost fully in control.*

**You (demonic voice)**: "INFERNO LEVEL SEVEN. +7 FIRE DAMAGE. THE ICE IS GONE. ONLY FIRE REMAINS."

**Your Party's Healer**: "You're suffocating! Let me—"
**You**: "No. Not yet. I can hold."

**Turn 5 - The Price of Power**

*You are at Inferno Level 7. +7 fire damage. But you're taking 1d6 suffocation per turn and -15 ft speed. You have 33 HP and 17 mana. The last frost wraith attacks.*

**Frost Wraith's Turn**: Strikes you for 8 frost damage
**HP**: 33 - 8 = 25/45

**Your Action**: Cast "Ember Spark" at Frost Wraith (3 mana, ascends +1)
**Damage Roll**: 1d6 fire → [5] = 5 fire damage + 1d4 DoT → ongoing
**Inferno Bonus**: +7
**Total Damage**: 5 + 7 = **12 fire damage**

*The wraith SHATTERS into frozen shards that melt instantly in your aura of heat.*

**Frost Wraith**: DEAD

**Inferno Ascension**: 7 → **8** (Ember Spark ascends +1)
**Fire Damage Bonus**: +7 → **+8**
**Drawback (Level 8 - Fraud)**: 2d4 self-damage per turn, disadvantage on Dex checks

**Mana**: 17 - 3 = 14/60

**Combat Over**

*You stand among the melted remains. The demon howls within, demanding you stay. But survival demands control. You cast Cooling Ember.*

**Your Action (After Combat)**: Cast "Cooling Ember" (4 mana, descends -2 Inferno)
**Inferno Descent**: 8 → **6**
**Fire Damage Bonus**: +8 → **+6**
**Healing**: 1d6 + spirit/3 → [5] + 2 = 7 HP
**Drawbacks Removed**: Level 8 Fraud (no more 2d4 self-damage, Dex checks restored)

**Mana**: 14 - 4 = 10/60
**HP**: 25 + 7 = 32/45

*The demonic transformation begins to RECEDE. Your horns shrink. The suffocating heat in your lungs eases.*

*But you're still at Level 6 — Heresy's curse. You cannot be healed by others. You cast Cooling Ember again.*

**Second Cooling Ember** (4 mana, descends -2 Inferno):
**Inferno Descent**: 6 → **4**
**Fire Damage Bonus**: +6 → **+4**
**Healing**: 1d6 + spirit/3 → [3] + 2 = 5 HP

**Mana**: 10 - 4 = 6/60
**HP**: 32 + 5 = 37/45

*The corruption recedes further. At Level 4, you can finally accept outside healing again.*

**Your Party's Healer**: Heals you for 8 HP
**HP**: 37 + 8 = 45/45 (back to full with healer help — at Level 4, you CAN accept healing from others again)

**Your Party's Tank**: "That was... terrifying. You did 72 damage with one spell."
**You**: "Hellfire Wave. +5 from Inferno Level 5, plus 2d6 Infernal Surge bonus. The demon gives everything. But at Level 7, I was suffocating. At Level 8, I was burning myself alive. If I'd hit Level 9... the demon takes over. Death in 3 of my turns."
**Your Party's Mage**: "And Cooling Ember?"
**You**: "Descends me -2 Inferno Levels per cast. I used it twice — from 8 to 6, then 6 to 4. Had to get below Level 6 because at that level, the demon's heresy blocks others from healing me. Now I'm at Level 4 — manageable."

**Final State**: Inferno: 4/9 | Fire Bonus: +4 | Mana: 6/60 | HP: 45/45

**The Lesson**: Pyrofiend gameplay is about:
1. **Inferno Ascension**: Started at Level 0, ascended to Level 8 through fire spells
2. **Damage Scaling**: Level 0 (+0) → Level 1 (+1) → Level 3 (+3) → Level 5 (+5) → Level 7 (+7) → Level 8 (+8)
3. **Spell Synergy**: Ember Spark (starter DoT) → Cinder Bolt (AoE clear) → Fireball (big AoE) → Hellfire Wave (massive cone nuke)
4. **Infernal Surge**: The shared Path Passive triggered at Level 5+, adding +2d6 to the Hellfire Wave for 72 total damage
5. **Drawback Escalation**: Level 1 (hit chance) → Level 3 (movement) → Level 5 (bleeding) → Level 7 (suffocation) → Level 8 (self-damage + Dex loss). **Note: Drawbacks do NOT stack** — you only suffer the penalty of your current level.
6. **The Demon's Bargain**: Level 9 gives +10 instead of +9 — disproportionate power for the final, deadliest drawback (death in 3 of your turns)
7. **Cooling Ember**: Descended from 8 → 6 → 4 with two casts, removing the worst drawbacks and getting below Level 6 (which blocks outside healing) so the healer could top us off
8. **Resource Tension**: Nearly ran out of mana (6/60 remaining). Ascension costs spells, and spells cost mana.

You're the SECOND-HIGHEST DAMAGE CLASS in the game. You ascend through Inferno Levels, each one adding +1 fire damage (+10 at the deadly Level 9) but imposing escalating drawbacks based on the circles of Hell. The key is knowing when to ASCEND for burst damage (Hellfire Wave at Level 5 with Infernal Surge = 72 damage) and when to use Cooling Ember to DESCEND and survive. You're not a safe class. You're a DEMONIC GLASS CANNON who trades their own blood for DEVASTATING POWER.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Inferno Veil',
    subtitle: 'The Demonic Ascension',

    description: `Your power is a debt to the circles of Hell. As you cast fire magic, you ascend through nine stages of demonic corruption, trading your mortal safety for escalating firepower. Climb too high and you risk total possession; stay too low and you waste the demon's gifts.`,

    cards: [
      {
        title: 'Inferno Levels (0-9)',
        stats: '10 Stages',
        details: 'Each level adds +1 to all fire damage. Level 9 grants a massive +10 bonus but starts a terminal death clock.'
      },
      {
        title: 'Drawbacks',
        stats: 'Escalating Penalties',
        details: 'Corruption inflicts self-damage, movement loss, and suffocation. High-level play requires balancing maximum heat with survival.'
      }
    ],

    generationTable: {
      headers: ['Action', 'Inferno Change', 'Notes'],
      rows: [
        ['Cast Fire Spell', '+1 to +3', 'Most offensive spells cause ascension'],
        ['Infernal Surge (Lv 5+)', 'Bonus Damage', 'Next fire spell deals +2d6 damage'],
        ['Cooling Ember', '-2 Levels (fixed)', 'The essential release valve; heals 1d6 + spirit/3 HP'],
        ['The Demon\'s Bargain', 'Level 9 (+10)', 'Disproportionate power; death in 3 of your turns if not cleared'],
        ['Rest / Out of Combat', '-1 per minute', 'Short Rest resets to 0; corruption fades with meditation']
      ]
    },

    usage: {
      momentum: 'Ascend by casting offensive fire spells. Each level adds flat fire damage to every hit, making multi-hit or AoE spells exponentially more powerful.',
      flourish: 'Use Cooling Ember to descend and heal. Managing the "Safe Zone" (0-3), "Power Zone" (4-6), and "Danger Zone" (7-9) is the core of the class.'
    },

    overheatRules: {
      title: 'The Demon\'s Bargain (Level 9)',
      content: `Reaching Inferno Level 9 represents total surrender to the infernal forces.

**You have THREE OF YOUR TURNS** to descend below Level 9. At the start of each of your turns while at Inferno Level 9, the death clock ticks down. If you have not descended below Level 9 after 3 of your turns:
- You are **consumed by fire** (Immediate Death)
- Your soul is **claimed** (Standard resurrection may fail)

**Survival Guide**:
- Use **Cooling Ember** immediately to drop 2 levels (fixed).
- Hellfire spec can use **Demonic Vitality** to survive the self-damage.
- Do NOT reach Level 9 unless the boss is at <10% HP.`
    },

    infernoLevelsTable: {
      title: 'Inferno Veil: Level Effects',
      headers: ['Level', 'Bonus', 'Drawback', 'Inspiration'],
      rows: [
        ['0', '+0', 'None', 'Mortal'],
        ['1', '+1', '-2 Hit chance (distortions)', 'Limbo'],
        ['2', '+2', '1d4 Psychic dmg/turn', 'Lust'],
        ['3', '+3', '-10ft Movement, Fatigue', 'Gluttony'],
        ['4', '+4', '+1d6 Damage taken from all sources', 'Greed'],
        ['5', '+5', '1d6 Bleeding dmg/turn', 'Wrath'],
        ['6', '+6', 'Cannot be healed by others, Disadv on Insight/Perception', 'Heresy'],
        ['7', '+7', '-15ft Speed, 1d6 Suffocation', 'Violence'],
        ['8', '+8', '2d4 Self-dmg, Disadv Dex', 'Fraud'],
        ['9', '+10', '4d8 Self-dmg, Death in 3 Turns', 'Treachery']
      ]
    },

    strategicConsiderations: {
      title: 'Managing the Flame',
      content: `**Important — Drawbacks Do Not Stack**: You only suffer the drawback of your current Inferno Level. Lower-level drawbacks are superseded, not cumulative. For example, at Level 5 you suffer 1d6 bleeding per turn — you do NOT also suffer the Level 1 hit penalty, Level 2 psychic damage, Level 3 movement penalty, or Level 4 damage vulnerability.

**Important — Drawback Timing**: Drawbacks take effect immediately upon ascending to a new Inferno Level. If you ascend from Level 4 to Level 6 in a single turn, you suffer only the Level 6 drawback (not Level 5's bleeding or Level 6's penalty separately — just Level 6). The self-damage drawbacks (Levels 2, 5, 7, 8, 9) apply at the start of each of your turns while at that level.

**Important — Inferno Level Cap**: Your Inferno Level cannot exceed 9. If a spell would cause you to ascend past Level 9, the excess ascension is lost and your level remains at 9.

**Important — Inferno Required (Spell Gating)**: Many spells list an "Inferno Required" cost in addition to mana. You must be at or above that Inferno Level to cast the spell. For example, Hellfire Wave (Level 5) requires Inferno Level 2+. If you are at Level 1, you cannot cast it. Plan your ascension so you reach the required level before you need your strongest spells.

**The Safe Zone (Lv 0–3)**: Minimal drawbacks. Use this for clearing minor enemies or during exploration. You are consistent but not devastating.

**The Power Zone (Lv 4–6)**: The optimal state. High damage bonuses with manageable penalties. Most specializations (like Wildfire) thrive here.

**The Danger Zone (Lv 7–9)**: Reserved for finales. The self-damage and speed penalties are brutal. Only enter this zone if you have a clear shot at finishing the encounter or a healer ready to dump resources into you.

**The Release Valve**: Never enter a turn with 0 Mana if you are above Level 5. You MUST save enough for **Cooling Ember** (4 Mana) to descend if the corruption becomes life-threatening.

**Out of Combat Recovery**: When combat ends, your Inferno Level decreases by 1 per minute of rest. After a Short Rest, it resets to 0. The corruption fades with time and meditation — but it does not vanish instantly.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Inferno Veil is perfectly represented by a single ten-sided die.

**Required Materials**:
- **1d10 (Ten-Sided Die)** — To track your Inferno Level (0–9)
- **Status Cards** — To remind you of your current Level's drawback

**The Descent Loop**:
- **Cast Spell**: Rotate the d10 up by the ascension value (e.g., from 3 to 5).
- **Start of Turn**: Check the die. If it's at 5, take your 1d6 bleeding damage.
- **Cooling Ember**: Roll 1d4, rotate the die down, and roll the appropriate healing.

**Physical Hack**: Use a **Red d10** for the normal levels and keep a **Black d10** nearby. If you reach Level 9, swap to the black die to signal to the party (and the GM) that the death clock has started.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Pyrofiend Specializations',
    subtitle: 'Three Paths of Infernal Power',
    
    description: `Every Pyrofiend chooses one of three specializations that define their approach to demonic fire magic. Each specialization offers unique passive abilities and influences your spell selection and playstyle.`,
    
    sharedPassive: {
      name: 'Infernal Surge',
      tier: 'Path Passive',
      description: 'When you ascend to Inferno Level 5 or higher, your next fire spell deals an additional 2d6 fire damage. This effect can only trigger once per ascension event.'
    },
    
    specs: [
      {
        id: 'inferno',
        name: 'Inferno',
        icon: 'Fire/Swirling Fireball',
        color: '#FF4500',
        theme: 'Pure Destruction',
        
        description: `The Inferno specialization embodies raw, uncontrolled demonic fire. Inferno Pyrofiends are the most aggressive, ascending rapidly and dealing maximum burst damage. They embrace the corruption fully, using it as a weapon.`,
        
        playstyle: 'Aggressive burst damage, rapid ascension, high-risk high-reward',
        
        strengths: [
          'Highest single-target burst damage',
          'Fastest Inferno Level ascension',
          'Powerful execute abilities at high levels',
          'Bonus damage when above Inferno Level 5'
        ],
        
        weaknesses: [
          'Most vulnerable to drawbacks',
          'Limited defensive options',
          'Requires careful timing',
          'Struggles in prolonged fights'
        ],
        
        passiveAbilities: [
          {
            name: 'Burning Ambition',
            tier: 'Specialization Passive',
            description: 'While at Inferno Level 3 or higher, your fire spells deal +1 damage per die rolled. Additionally, while at Inferno Level 7 or higher, your fire spells crit on the 2 highest die numbers instead of just the highest, and critical hits deal an additional 1d10 fire damage.',
            uniqueTo: 'Inferno'
          }
        ],
        
        recommendedFor: 'Players who enjoy high-risk gameplay, burst damage, and aggressive tactics'
      },
      
      {
        id: 'wildfire',
        name: 'Wildfire',
        icon: 'Fire/Scorching Rune',
        color: '#FF8C00',
        theme: 'Spreading Chaos',
        
        description: `Wildfire Pyrofiends specialize in spreading flames across multiple targets. Their fire jumps from enemy to enemy, creating cascading infernos that consume entire groups. They balance ascension with area control.`,
        
        playstyle: 'Area damage, damage-over-time effects, battlefield control',
        
        strengths: [
          'Excellent multi-target damage',
          'Strong damage-over-time effects',
          'Fire spreads between enemies',
          'Better sustained damage than Inferno'
        ],
        
        weaknesses: [
          'Lower single-target burst',
          'Requires enemy grouping',
          'DoT effects take time',
          'Less effective against single bosses'
        ],
        
        passiveAbilities: [
          {
            name: 'Wildfire Spread',
            tier: 'Specialization Passive',
            description: 'When an enemy affected by your burn effect dies, the burn spreads to all enemies within 10 feet, dealing 2d6 fire damage and applying a new burn effect (1d6 fire damage per turn for 3 turns). This effect can only trigger once per round and cannot chain from spread burns.',
            uniqueTo: 'Wildfire'
          }
        ],
        
        recommendedFor: 'Players who enjoy area control, damage-over-time builds, and tactical positioning'
      },
      
      {
        id: 'hellfire',
        name: 'Hellfire',
        icon: 'Psychic/Mind Strike',
        color: '#8B0000',
        theme: 'Demonic Resilience',
        
        description: `Hellfire Pyrofiends embrace their demonic nature, gaining dark powers beyond mere fire. They convert damage into healing, summon infernal minions, and use demonic magic to sustain themselves through the Inferno Veil's drawbacks.`,
        
        playstyle: 'Self-sustain, demonic utility, balanced ascension',
        
        strengths: [
          'Best survivability of all specs',
          'Healing from damage dealt',
          'Demonic utility spells',
          'Can maintain high Inferno Levels longer'
        ],
        
        weaknesses: [
          'Lowest raw damage output',
          'More complex resource management',
          'Requires strategic spell selection',
          'Less burst damage than Inferno'
        ],
        
        passiveAbilities: [
          {
            name: 'Demonic Vitality',
            tier: 'Specialization Passive',
            description: 'You heal for 20% of all fire damage you deal (maximum 40% of a single spell\'s total damage). Additionally, when you descend Inferno Levels (through Cooling Ember or other means), you gain temporary hit points equal to 3 times the number of levels descended.',
            uniqueTo: 'Hellfire'
          }
        ],
        
        recommendedFor: 'Players who want survivability, self-sufficiency, and a more forgiving playstyle'
      }
    ]
  },

  // Spell Pools - organized by character level
  // Maps character level to available spell IDs for learning
  spellPools: {
    1: [
      // Level 1 starting spells (pick 3)
      // IMPORTANT: Cooling Ember is strongly recommended — without it, you cannot reduce your Inferno Level
      'pyro_ember_spark',
      'pyro_smoldering_touch',
      'pyro_flicker',
      'pyro_cooling_ember',
      'pyro_heat_shield'
    ],
    2: [
      // Level 2 spells
      'pyro_scorching_grasp',
      'pyro_flame_lash',
      'pyro_cinder_bolt'
    ],
    3: [
      // Level 3 spells
      'pyro_fireball',
      'pyro_burning_hands',
      'pyro_flame_step'
    ],
    4: [
      // Level 4 spells
      'pyro_infernal_blast',
      'pyro_searing_chains',
      'pyro_fiery_aura'
    ],
    5: [
      // Level 5 spells
      'pyro_hellfire_wave',
      'pyro_immolation',
      'pyro_fire_whip'
    ],
    6: [
      // Level 6 spells
      'pyro_lava_burst',
      'pyro_flame_storm',
      'pyro_infernal_brand_advanced'
    ],
    7: [
      // Level 7 spells
      'pyro_volcanic_eruption',
      'pyro_hellfire_breath',
      'pyro_demonic_empowerment'
    ],
    8: [
      // Level 8 spells
      'pyro_meteor_shower',
      'pyro_infernal_nova',
      'pyro_phoenix_flame'
    ],
    9: [
      // Level 9 spells
      'pyro_infernal_avatar',
      'pyro_apocalypse',
      'pyro_hellfire_ritual'
    ],
    10: [
      // Level 10 spells
      'pyro_brimstone_teleport',
      'pyro_demonic_ascension',
      'pyro_inferno_mastery'
    ]
  },

  // Spells - organized by level, properly formatted for wizard
  spells: [
    // ========================================
    // LEVEL 1 STARTING SPELLS (5 options, pick 3)
    // Weak starter spells - intentionally low power
    // ========================================
    {
      id: 'pyro_ember_spark',
      name: 'Ember Spark',
      description: 'Launch a malevolent spark that burrows into the target, dealing initial fire damage and leaving a persistent burn. The demonic flame smolders within, dealing additional damage over the next 2 rounds.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Fire/Flame Burst',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Flame Burst',
        tags: ['fire', 'damage', 'dot', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 3, inferno_ascend: 1, inferno_required: 0 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Daemonis!',
        somaticText: 'Snap fingers together, a malevolent red-orange spark forming and launching forward'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d6',
        damageTypes: ['fire'],
        resolution: 'DICE',
        dotConfig: {
          enabled: true,
          damagePerTick: '1d4',
          damageTypes: ['fire'],
          tickFrequency: 'round',
          duration: 2,
          canStack: false,
          maxStacks: 1
        }
      },

      durationConfig: {
        durationType: 'rounds',
        durationValue: 2,
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'dot', 'starter']
    },

    {
      id: 'pyro_smoldering_touch',
      name: 'Smoldering Touch',
      description: 'Your hand glows with heat as you touch an enemy, dealing 1d8 + INT/3 fire damage and leaving a lingering smolder that burns for 1d4 fire damage per round for 2 rounds.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Fire/Fire Bolt',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Fire Bolt',
        tags: ['fire', 'damage', 'touch', 'dot', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 4, inferno_ascend: 1, inferno_required: 0 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Ardeo!',
        somaticText: 'Touch with glowing hand'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d8 + intelligence/3',
        damageTypes: ['fire'],
        resolution: 'DICE',
        dotConfig: {
          enabled: true,
          damagePerTick: '1d4',
          damageTypes: ['fire'],
          tickFrequency: 'round',
          duration: 2,
          canStack: false,
          maxStacks: 1
        }
      },

      durationConfig: {
        durationType: 'rounds',
        durationValue: 2,
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'touch', 'dot', 'starter']
    },

    {
      id: 'pyro_flicker',
      name: 'Flicker',
      description: 'A quick flash of fire that streaks toward your target. The flame is small but precise, igniting instantly and leaving a trail of heat in its wake. This spell is cast as a bonus action, allowing you to weave it between other attacks.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Fire/Fiery Symbol',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Fiery Symbol',
        tags: ['fire', 'damage', 'starter'],
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 3, inferno_ascend: 1, inferno_required: 0 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Flicker!'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '1d6 + intelligence/4',
        damageTypes: ['fire'],
        resolution: 'DICE'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'starter']
    },

    {
      id: 'pyro_cooling_ember',
      name: 'Cooling Ember',
      description: 'Soothes the infernal fire within, drawing away excess heat to restore your body and maintain control over demonic corruption. Essential for managing your dangerous power.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Fire/Dragon Breath',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Dragon Breath',
        tags: ['fire', 'healing', 'utility', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_descend', 'inferno_required'],
        resourceValues: { mana: 4, inferno_descend: 2, inferno_required: 0 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Pax Ignis',
        somaticText: 'Place hand over heart'
      },

      effectTypes: ['healing'],

      healingConfig: {
        formula: '1d6 + spirit/3',
        healingType: 'direct',
        resolution: 'DICE'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'healing', 'utility', 'starter']
    },

    {
      id: 'pyro_heat_shield',
      name: 'Heat Shield',
      description: 'Surround yourself with a shimmering heat barrier that distorts vision, absorbing and dispersing incoming attacks. The shield glows with protective inner fire.',
      level: 1,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Divinity',
      
      typeConfig: {
        school: 'fire',
        icon: 'Radiant/Radiant Divinity',
        tags: ['fire', 'buff', 'defensive', 'starter'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_descend', 'inferno_required'],
        resourceValues: { mana: 4, inferno_descend: 1, inferno_required: 0 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal', 'somatic'],
        verbalText: 'Scutum Calor!',
        somaticText: 'Raise hands to create barrier'
      },

      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'heat_shield_damage_reduction',
          name: 'Heat Shield',
          description: '+2 Damage Reduction for 2 rounds. The heat shield absorbs and disperses incoming attacks, reducing the damage that reaches you.',
          mechanicsText: '',
          statModifier: {
            stat: 'damage_reduction',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'buff', 'defensive', 'starter']
    },

    // ========================================
    // LEVEL 2 SPELLS
    // ========================================
    {
      id: 'pyro_scorching_grasp',
      name: 'Scorching Grasp',
      description: 'Flames envelop your hand, searing through armor and flesh on contact for 2d8 + INT/2 fire damage. The fire clings to the target, burning for 1d4 fire damage per round for 2 rounds.',
      level: 2,
      spellType: 'ACTION',
      icon: 'Fire/Scorching Rune',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Scorching Rune',
        tags: ['fire', 'damage', 'touch'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 8, inferno_ascend: 1, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Ardeo!',
        somaticText: 'Grasp with burning hand'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d8 + intelligence/2',
        damageTypes: ['fire'],
        resolution: 'DICE',
        dotConfig: {
          enabled: true,
          damagePerTick: '1d4',
          damageTypes: ['fire'],
          tickFrequency: 'round',
          duration: 2,
          canStack: false,
          maxStacks: 1
        }
      },

      durationConfig: {
        durationType: 'rounds',
        durationValue: 2,
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'touch']
    },

    {
      id: 'pyro_flame_lash',
      name: 'Flame Lash',
      description: 'A whip of fire lashes out, pulling your enemy closer while burning them.',
      level: 2,
      spellType: 'ACTION',
      icon: 'Fire/Sun Symbol',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Sun Symbol',
        tags: ['fire', 'damage', 'control'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 8, inferno_ascend: 1, inferno_required: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Flagellum Ignis!',
        somaticText: 'Whip hand forward'
      },

      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '2d6 + intelligence/3',
        damageTypes: ['fire'],
        resolution: 'DICE'
      },

      controlConfig: {
        controlType: 'forcedMovement',
        strength: 'weak',
        duration: 0,
        durationUnit: 'instant',
        savingThrow: {
          ability: 'strength',
          difficultyClass: 14,
          saveOutcome: 'negates'
        },
        effects: [{
          id: 'pull',
          name: 'Pull',
          description: 'Pulls the target 15 feet toward the caster. DC 14 Strength save negates.',
          config: {
            movementType: 'pull',
            distance: 15
          }
        }]
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'control']
    },

    {
      id: 'pyro_cinder_bolt',
      name: 'Cinder Bolt',
      description: 'A bolt of cinders that explodes on impact, dealing fire damage in a small area.',
      level: 2,
      spellType: 'ACTION',
      icon: 'Fire/Swirling Fireball',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Swirling Fireball',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 5 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 8, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Cinis Sagitta!',
        somaticText: 'Hurl cinder bolt'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d6 + intelligence/2',
        damageTypes: ['fire'],
        resolution: 'DICE'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'aoe']
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    {
      id: 'pyro_fireball',
      name: 'Fireball',
      description: 'A classic explosive ball of fire that detonates on impact, damaging all nearby enemies.',
      level: 3,
      spellType: 'ACTION',
      icon: 'Fire/Swirling Fireball',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Swirling Fireball',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 100,
        aoeShape: 'sphere',
        aoeParameters: { radius: 10 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 12, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Ignis Globus!',
        somaticText: 'Hurl ball of flame'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d6 + intelligence',
        damageTypes: ['fire'],
        resolution: 'DICE',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          critEffects: ['burning'],
          burningConfig: {
            damagePerRound: '1d6',
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 15,
            saveType: 'constitution'
          }
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_burning_hands',
      name: 'Burning Hands',
      description: 'A cone of fire erupts from your hands, scorching enemies in front of you.',
      level: 3,
      spellType: 'ACTION',
      icon: 'Fire/Flame Burst',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Flame Burst',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'cone',
        aoeParameters: { length: 20 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 10, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Manus Ardens!',
        somaticText: 'Spread fingers wide'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d6 + intelligence',
        damageTypes: ['fire'],
        resolution: 'DICE',
        chanceOnHitConfig: {
          enabled: true,
          procType: 'dice',
          diceThreshold: 17,
          procChance: 20,
          customEffects: ['burning'],
          burningConfig: {
            damagePerRound: '1d4',
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 14,
            saveType: 'constitution'
          }
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_flame_step',
      name: 'Flame Step',
      description: 'Teleport a short distance in a burst of fire, leaving flames at your departure and arrival points.',
      level: 3,
      spellType: 'ACTION',
      icon: 'Fire/Burning Ember',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Burning Ember',
        tags: ['fire', 'utility', 'teleport'],
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 12, inferno_ascend: 1, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 1,  // Utility spell
        components: ['verbal'],
        verbalText: 'Saltus Ignis!'
      },

      effectTypes: ['utility', 'damage'],

      utilityConfig: {
        utilityType: 'movement',
        selectedEffects: [{
          id: 'teleport',
          name: 'Teleport',
          distance: 30,
          needsLineOfSight: true
        }],
        duration: 0,
        durationUnit: 'instant',
        concentration: false,
        power: 'minor'
      },

      damageConfig: {
        formula: '1d6',
        damageTypes: ['fire'],
        resolution: 'AUTOMATIC'
      },

      propagation: {
        method: 'explosion',
        behavior: 'aoe',
        secondaryRadius: 5
      },

      durationConfig: {
        durationType: 'rounds',
        durationValue: 1,
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 2
      },

      tags: ['fire', 'utility', 'teleport']
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    {
      id: 'pyro_infernal_blast',
      name: 'Infernal Blast',
      description: 'A concentrated blast of demonic fire that erupts from your hands for 5d6 + INT fire damage, searing through defenses and leaving nothing but ash in its wake. At Inferno Level 4+, deals an additional 2d6 fire damage.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Fire/Infernal Fire',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Infernal Fire',
        tags: ['fire', 'damage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 80,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 20, inferno_ascend: 2, inferno_required: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Infernus Ictus!',
        somaticText: 'Thrust palm forward'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '5d6 + intelligence',
        damageTypes: ['fire'],
        resolution: 'DICE'
      },

      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: true,
            baseFormula: '5d6 + intelligence',
            conditionalFormulas: {
              'inferno_4_plus': '7d6 + intelligence',
              'default': '5d6 + intelligence'
            }
          }
        },
        effectTriggers: {
          damage: {
            logicType: 'OR',
            compoundTriggers: [{
              id: 'resource_threshold',
              category: 'health',
              name: 'Inferno Level 4+',
              parameters: {
                resource_type: 'inferno',
                threshold_value: 4,
                threshold_type: 'flat',
                comparison: 'greater_than',
                perspective: 'self'
              }
            }]
          }
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage']
    },

    {
      id: 'pyro_searing_chains',
      name: 'Searing Chains',
      description: 'Conjure burning chains of demonic fire that lash between enemies, dealing 3d6 + INT fire damage and tethering them together. Each chain jump deals 75% damage but ignites all targets struck for 1d6 fire damage per round for 2 rounds. Chains can jump to up to 3 additional targets within 15 feet.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Fire/Scorching Rune',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Scorching Rune',
        tags: ['fire', 'damage', 'chain'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 16, inferno_ascend: 2, inferno_required: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Catena Infernus!',
        somaticText: 'Whip arm forward, chains of fire erupt'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d6 + intelligence',
        damageTypes: ['fire'],
        resolution: 'DICE',
        chainConfig: {
          enabled: true,
          maxChains: 3,
          chainRange: 15,
          damageMultiplier: 0.75,
          damageTypes: ['fire']
        },
        dotConfig: {
          enabled: true,
          damagePerTick: '1d6',
          damageTypes: ['fire'],
          tickFrequency: 'round',
          duration: 2,
          canStack: false,
          maxStacks: 1
        }
      },

      propagation: {
        method: 'chain',
        behavior: 'bounce',
        count: 3,
        range: 15,
        decay: 0.75
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 1
      },

      tags: ['fire', 'damage', 'chain']
    },

    {
      id: 'pyro_fiery_aura',
      name: 'Fiery Aura',
      description: 'Surround yourself with an aura of heat that damages nearby enemies for 2d6 fire damage at the start of each of their turns. The aura persists for up to 3 rounds while you concentrate.',
      level: 4,
      spellType: 'CHANNELED',
      icon: 'Fire/Fire Orb',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Fire Orb',
        tags: ['fire', 'damage', 'channeled'],
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        maxChannelDuration: 3,
        durationUnit: 'ROUNDS',
        interruptible: true,
        movementAllowed: true,
        tickFrequency: 'START_OF_TURN'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 16, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Aura Ignis!',
        somaticText: 'Spread arms wide'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '2d6',
        damageTypes: ['fire'],
        resolution: 'DICE',
        triggerCondition: 'area_entry',
        triggerDescription: 'Enemies within 5 feet take 2d6 fire damage at the start of each of their turns',
        areaShape: 'circle',
        areaParameters: { radius: 5 }
      },

      channelingConfig: {
        type: 'persistent',
        baseFormula: '2d6',
        tickFrequency: 'round',
        maxDuration: 3,
        durationUnit: 'rounds',
        persistentEffectType: 'aura',
        persistentRadius: 5,
        interruptible: true,
        movementAllowed: true
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'channeled']
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: 'pyro_hellfire_wave',
      name: 'Hellfire Wave',
      description: 'A wave of hellish fire sweeps over your enemies in a 30-foot cone, dealing 8d6 + INT fire damage and burning intensely.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Fire/Fiery Symbol',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Fiery Symbol',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'cone',
        aoeParameters: { length: 30 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 20, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Infernus Unda!',
        somaticText: 'Sweep arms forward'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '8d6 + intelligence',
        damageTypes: ['fire'],
        resolution: 'DICE'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_immolation',
      name: 'Immolation',
      description: 'Engulf your target in flames, dealing 6d8 + INT/2 fire damage immediately and burning them for 1d6 + INT/4 fire damage per round for 3 rounds.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Fire/Enveloping Fire',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Enveloping Fire',
        tags: ['fire', 'damage', 'dot'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 20, inferno_ascend: 3, inferno_required: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Immolatio!',
        somaticText: 'Clench fist'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d8 + intelligence/2',
        damageTypes: ['fire'],
        resolution: 'DICE',
        dotConfig: {
          enabled: true,
          damagePerTick: '1d6 + intelligence/4',
          damageTypes: ['fire'],
          tickFrequency: 'round',
          duration: 3,
          canStack: false,
          maxStacks: 1
        }
      },

      durationConfig: {
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'dot']
    },

    {
      id: 'pyro_fire_whip',
      name: 'Fire Whip',
      description: 'A whip of pure fire lashes out, dealing damage and potentially stunning your target.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Fire/Sun Symbol',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Sun Symbol',
        tags: ['fire', 'damage'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 18, inferno_ascend: 2, inferno_required: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Flagellum Infernus!',
        somaticText: 'Crack whip motion'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '7d6 + intelligence',
        damageTypes: ['fire'],
        resolution: 'DICE',
        chanceOnHitConfig: {
          enabled: true,
          procType: 'dice',
          diceThreshold: 18,
          procChance: 15,
          customEffects: ['stun'],
          stunConfig: {
            duration: 1,
            durationUnit: 'round',
            saveDC: 14,
            saveType: 'constitution'
          }
        },
        savingThrow: {
          ability: 'constitution',
          difficultyClass: 14,
          saveOutcome: 'negates'
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 2
      },

      tags: ['fire', 'damage']
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: 'pyro_lava_burst',
      name: 'Lava Burst',
      description: 'A burst of molten lava erupts from the ground, dealing 9d6 + INT fire damage in a 15-foot radius.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Fire/Dripping Lava',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Dripping Lava',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 80,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 24, inferno_ascend: 3, inferno_required: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Terra Ignea!',
        somaticText: 'Slam fist downward',
        materialComponents: 'A piece of volcanic rock'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '9d6 + intelligence',
        damageTypes: ['fire'],
        resolution: 'DICE',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          critEffects: ['burning'],
          burningConfig: {
            damagePerRound: '1d6',
            duration: 2,
            durationUnit: 'rounds',
            saveDC: 15,
            saveType: 'constitution'
          }
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_flame_storm',
      name: 'Flame Storm',
      description: 'Create a swirling storm of fire that damages all enemies in a large area over time.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Fire/Swirling Fireball',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Swirling Fireball',
        tags: ['fire', 'damage', 'aoe', 'dot'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 100,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 24, inferno_ascend: 2, inferno_required: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Tempestas Ignis!',
        somaticText: 'Raise arms and swirl'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '8d6 + intelligence',
        damageTypes: ['fire'],
        resolution: 'DICE',
        dotConfig: {
          enabled: true,
          damagePerTick: '2d6 + intelligence/2',
          damageTypes: ['fire'],
          tickFrequency: 'round',
          duration: 3,
          canStack: false,
          maxStacks: 1
        }
      },

      durationConfig: {
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 3
      },

      tags: ['fire', 'damage', 'aoe', 'dot']
    },

    {
      id: 'pyro_infernal_brand_advanced',
      name: 'Infernal Brand (Advanced)',
      description: 'Mark an enemy with a burning infernal sigil that sears into their flesh, dealing ongoing fire damage and sapping their strength as flames consume them.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Fire/Fiery Symbol',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Fiery Symbol',
        tags: ['fire', 'damage', 'dot', 'debuff'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 70,
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 22, inferno_ascend: 2, inferno_required: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Sigillum Infernus!',
        somaticText: 'Draw burning sigil'
      },

      effectTypes: ['damage', 'debuff'],

      damageConfig: {
        formula: '4d6 + intelligence/3',
        damageTypes: ['fire'],
        resolution: 'DICE',
        dotConfig: {
          enabled: true,
          damagePerTick: '2d6 + intelligence/2',
          damageTypes: ['fire'],
          tickFrequency: 'round',
          duration: 4,
          canStack: false,
          maxStacks: 1
        }
      },

      debuffConfig: {
        debuffType: 'statPenalty',
        effects: [{
          id: 'weakened',
          name: 'Weakened',
          description: 'The target\'s physical power is diminished by the searing heat, making them weaker and less effective in combat. The infernal brand saps their strength as it burns.',
          mechanicsText: '',
          statModifier: {
            stat: 'strength',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        canBeDispelled: true
      },

      durationConfig: {
        durationType: 'rounds',
        durationValue: 4,
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 0
      },

      tags: ['fire', 'damage', 'dot', 'debuff']
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: 'pyro_volcanic_eruption',
      name: 'Volcanic Eruption',
      description: 'Cause the ground to erupt with volcanic fire, dealing 12d6 + INT×2 fire damage in a 25-foot radius. Targets may make a DC 16 Agility save for half damage. At Inferno Level 7+, damage increases to 16d6 + INT×2.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Fire/Flowing Lava',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Flowing Lava',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 90,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 28, inferno_ascend: 3, inferno_required: 6 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Eruptio Volcanica!',
        somaticText: 'Slam both hands down',
        materialComponents: 'Volcanic ash'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '12d6 + intelligence * 2',
        damageTypes: ['fire'],
        resolution: 'DICE',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: '2d6',
          critEffects: ['burning', 'knockback'],
          burningConfig: {
            damagePerRound: '2d6',
            duration: 3,
            durationUnit: 'rounds',
            saveDC: 16,
            saveType: 'constitution'
          },
          knockbackConfig: {
            distance: 10
          }
        },
        savingThrow: {
          ability: 'agility',
          difficultyClass: 16,
          saveOutcome: 'half_damage'
        }
      },

      triggerConfig: {
        effectTriggers: {
          damage: {
            logicType: 'OR',
            compoundTriggers: [{
              id: 'resource_threshold',
              category: 'health',
              name: 'High Inferno Level',
              parameters: {
                resource_type: 'inferno',
                threshold_type: 'percentage',
                percentage: 70,
                comparison: 'greater_than',
                perspective: 'self'
              }
            }]
          }
        },
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: true,
            baseFormula: '12d6 + intelligence * 2',
              conditionalFormulas: {
              'resource_threshold_70': '16d6 + intelligence * 2'
            }
          }
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 2
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_hellfire_breath',
      name: 'Hellfire Breath',
      description: 'Breathe a 40-foot cone of hellfire that incinerates everything in its path for 10d6 + INT×2 fire damage.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Fire/Flame Burst',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Flame Burst',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'cone',
        aoeParameters: { length: 40 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 26, inferno_ascend: 3, inferno_required: 5 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Halitus Infernus!',
        somaticText: 'Inhale deeply and exhale'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '10d6 + intelligence * 2',
        damageTypes: ['fire'],
        resolution: 'DICE',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          critDiceOnly: false,
          extraDice: '3d8',
          critEffects: ['burning'],
          burningConfig: {
            damagePerRound: '2d8',
            duration: 4,
            durationUnit: 'rounds',
            saveDC: 17,
            saveType: 'constitution'
          }
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 3
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_demonic_empowerment',
      name: 'Demonic Empowerment',
      description: 'Channel demonic power to enhance your fire damage. Your connection to infernal flames intensifies, allowing you to deal +5 fire damage on all fire-based attacks for 5 rounds.',
      level: 7,
      spellType: 'CHANNELED',
      icon: 'Utility/Powerful Warrior',
      
      typeConfig: {
        school: 'fire',
        icon: 'Utility/Powerful Warrior',
        tags: ['fire', 'buff'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 24, inferno_ascend: 2, inferno_required: 5 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Potentia Daemonis!',
        somaticText: 'Clench fists and channel'
      },

      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'fireDamageBoost',
          name: 'Fire Damage Boost',
          description: 'Fire damage increased by +5 for 5 rounds. All fire-based attacks deal additional damage as demonic power flows through your spells and abilities.',
          mechanicsText: '',
          statModifier: {
            stat: 'fire_spell_power',
            magnitude: 5,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      channelingConfig: {
        type: 'power_up',
        maxDuration: 5,
        durationUnit: 'rounds',
        interruptible: true,
        movementAllowed: false,
        stages: [
          { threshold: 1, effect: '+5 Fire Damage', description: 'Demonic empowerment active' },
          { threshold: 3, effect: '+5 Fire Damage + Burning Aura', description: 'Demonic power intensifies — enemies within 5 ft take 1d6 fire' },
          { threshold: 5, effect: '+5 Fire Damage + Burning Aura + Inferno Resistance', description: 'Full demonic empowerment — fire damage taken reduced by 50%' }
        ]
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 5
      },

      tags: ['fire', 'buff']
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: 'pyro_meteor_shower',
      name: 'Meteor Shower',
      description: 'Summon a shower of flaming meteors from the sky, dealing 14d6 + INT×2 fire damage in a 30-foot radius. The devastating rain of fire crashes into the ground with explosive force, engulfing the area in flames.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Fire/Fiery Comet',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Fiery Comet',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 150,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 32, inferno_ascend: 3, inferno_required: 7 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Meteorus Infernus!',
        somaticText: 'Raise arms to the sky'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '14d6 + intelligence * 2',
        damageTypes: ['fire'],
        resolution: 'DICE',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: '4d6',
          critEffects: ['burning', 'knockback'],
          burningConfig: {
            damagePerRound: '3d6',
            duration: 3,
            durationUnit: 'rounds',
            saveDC: 18,
            saveType: 'constitution'
          },
          knockbackConfig: {
            distance: 15
          }
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 4
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_infernal_nova',
      name: 'Infernal Nova',
      description: 'Release a massive explosion of infernal fire in all directions, dealing 14d6 + INT×2 fire damage to all enemies within 35 feet.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Fire/Swirling Fireball',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Swirling Fireball',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 35 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 30, inferno_ascend: 3, inferno_required: 8 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Nova Infernus!',
        somaticText: 'Spread arms wide and explode'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '14d6 + intelligence * 2',
        damageTypes: ['fire'],
        resolution: 'DICE'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 5
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_phoenix_flame',
      name: 'Phoenix Flame',
      description: 'Summon the essence of a phoenix, dealing 12d6 + INT×2 fire damage in a 25-foot radius and leaving burning ground that deals 3d6 + INT/2 fire damage per round for 4 rounds.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Fire/Rising Inferno',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Rising Inferno',
        tags: ['fire', 'damage', 'aoe', 'dot'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 32, inferno_ascend: 3, inferno_required: 8 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Flamma Phoenix!',
        somaticText: 'Summon phoenix gesture'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '12d6 + intelligence * 2',
        damageTypes: ['fire'],
        resolution: 'DICE',
        dotConfig: {
          enabled: true,
          damagePerTick: '3d6 + intelligence/2',
          damageTypes: ['fire'],
          tickFrequency: 'round',
          duration: 4,
          canStack: false,
          maxStacks: 1
        }
      },

      durationConfig: {
        durationType: 'rounds',
        durationValue: 4,
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 6
      },

      tags: ['fire', 'damage', 'aoe', 'dot']
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: 'pyro_infernal_avatar',
      name: 'Infernal Avatar',
      description: 'Transform into a being of pure fire for 10 rounds, gaining +5 fire spell power, +3 Armor, immunity to fire damage, and a burning aura that deals 2d6 fire damage to enemies within 10 feet.',
      level: 9,
      spellType: 'CHANNELED',
      icon: 'Fire/Fire Demon',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Fire Demon',
        tags: ['fire', 'transformation'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 36, inferno_ascend: 3, inferno_required: 7 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Ego Sum Ignis!',
        somaticText: 'Spread arms wide'
      },

      effectTypes: ['transformation'],

      transformationConfig: {
        customName: 'Infernal Avatar',
        transformType: 'elemental',
        formName: 'Fire Elemental Avatar',
        formDescription: 'You become a being of pure demonic fire, wreathed in flames and radiating intense heat.',
        durationValue: 10,
        durationType: 'rounds',
        concentrationRequired: true,
        statModifiers: [
          { stat: 'fire_spell_power', magnitude: 5, magnitudeType: 'flat' },
          { stat: 'armor', magnitude: 3, magnitudeType: 'flat' }
        ],
        resistances: [
          { damageType: 'fire', resistanceType: 'immunity' }
        ],
        specialAbilities: [
          {
            name: 'Burning Aura',
            description: 'Enemies within 10 feet take 2d6 fire damage at the start of their turn'
          }
        ]
      },

      channelingConfig: {
        type: 'persistent',
        maxDuration: 10,
        durationUnit: 'rounds',
        interruptible: true,
        movementAllowed: true,
        persistentEffectType: 'aura',
        persistentRadius: 10,
        baseFormula: '2d6'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 10
      },

      tags: ['fire', 'transformation']
    },

    {
      id: 'pyro_apocalypse',
      name: 'Apocalypse',
      description: 'Unleash the full power of demonic fire, creating a cataclysmic explosion that deals 16d10 + INT×2 fire damage in a 40-foot radius. At maximum Inferno Level, damage dice explode on max rolls.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Utility/Explosive Detonation',
      
      typeConfig: {
        school: 'fire',
        icon: 'Utility/Explosive Detonation',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 200,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 36, inferno_ascend: 3, inferno_required: 9 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Apocalypsis!',
        somaticText: 'Raise arms and channel all power'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '16d10 + intelligence * 2',
        damageTypes: ['fire'],
        resolution: 'DICE',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          explodingDice: true,
          explodingDiceType: 'reroll_add'
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 10
      },

      tags: ['fire', 'damage', 'aoe']
    },

    {
      id: 'pyro_hellfire_ritual',
      name: 'Hellfire Ritual',
      description: 'Perform a ritual that channels infernal power, dramatically increasing your fire damage for a short time.',
      level: 9,
      spellType: 'CHANNELED',
      icon: 'Radiant/Radiant Divinity',
      
      typeConfig: {
        school: 'fire',
        icon: 'Radiant/Radiant Divinity',
        tags: ['fire', 'buff'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 34, inferno_ascend: 3, inferno_required: 0 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Ritualis Infernus!',
        somaticText: 'Perform ritual gestures',
        materialComponents: 'Demonic essence'
      },

      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'massiveFireBoost',
          name: 'Massive Fire Boost',
          description: '+10 Fire Spell Power for 3 rounds. A ritual of infernal power dramatically surges through your fire magic.',
          mechanicsText: '',
          statModifier: {
            stat: 'fire_spell_power',
            magnitude: 10,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },

      channelingConfig: {
        type: 'power_up',
        maxDuration: 3,
        durationUnit: 'rounds',
        interruptible: true,
        movementAllowed: false,
        stages: [
          { threshold: 1, effect: '+10 Fire Spell Power', description: 'Infernal ritual begins — fire magic surges' },
          { threshold: 2, effect: '+10 Fire Spell Power + Burning Aura', description: 'Demonic flames radiate outward — enemies within 10 ft take 2d6 fire per round' },
          { threshold: 3, effect: '+10 Fire Spell Power + Burning Aura + Inferno Amplification', description: 'Ritual climax — all inferno level bonuses doubled for the final round' }
        ]
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 12
      },

      tags: ['fire', 'buff']
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: 'pyro_brimstone_teleport',
      name: 'Brimstone Teleport',
      description: 'Teleport through hellfire up to 60 feet, appearing in a burst of flames that deals 6d6 + INT×2 fire damage to all enemies within 10 feet of your arrival point.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Fire/Burning Ember',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Burning Ember',
        tags: ['fire', 'utility', 'teleport', 'damage'],
        castTime: 0,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 30, inferno_ascend: 1, inferno_required: 8 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Teleportatio Infernus!'
      },

      effectTypes: ['utility', 'damage'],

      utilityConfig: {
        utilityType: 'movement',
        selectedEffects: [{
          id: 'brimstone_teleport',
          name: 'Brimstone Teleport',
          description: 'Teleport up to 60 feet through hellfire, appearing in a burst of flames.',
          mechanicsText: '',
          duration: 0,
          durationUnit: 'instant',
          concentration: false,
          power: 'major'
        }]
      },

      damageConfig: {
        formula: '6d6 + intelligence * 2',
        damageTypes: ['fire'],
        resolution: 'DICE'
      },

      propagation: {
        method: 'explosion',
        behavior: 'aoe',
        secondaryRadius: 10
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 3
      },

      tags: ['fire', 'utility', 'teleport', 'damage']
    },

    {
      id: 'pyro_demonic_ascension',
      name: 'Demonic Ascension',
      description: 'Reach the pinnacle of demonic power, transforming into a true demon of fire with overwhelming power. **WARNING:** This spell requires Inferno Level 9. Demonic Ascension does NOT pause the Level 9 death clock — you must still descend below Level 9 within 3 of your turns or die, even while transformed.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Fire/Fire Demon',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Fire Demon',
        tags: ['fire', 'buff', 'transformation'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered'
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 40, inferno_ascend: 3, inferno_required: 9 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Ascensio Daemonis!',
        somaticText: 'Channel ultimate power'
      },

      effectTypes: ['buff', 'damage'],

      buffConfig: {
        buffType: 'custom',
        effects: [
          {
            id: 'demonicAscension_power',
            name: 'Demonic Ascension',
            description: '+15 fire damage to all spells, +5 Armor, fire damage immunity, flight (30 ft), and enemies within 15 feet take 3d6 fire damage at start of their turn. Requires Inferno Level 9. Death clock still ticks.',
            mechanicsText: ''
          },
          {
            id: 'demonicAscension_armor',
            name: 'Demonic Armor',
            description: '+5 Armor from demonic carapace',
            mechanicsText: '',
            statModifier: {
              stat: 'armor',
              magnitude: 5,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'demonicAscension_fire',
            name: 'Fire Mastery',
            description: '+15 fire spell power',
            mechanicsText: '',
            statModifier: {
              stat: 'fire_spell_power',
              magnitude: 15,
              magnitudeType: 'flat'
            }
          }
        ],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: false
      },

      damageConfig: {
        formula: '3d6',
        damageTypes: ['fire'],
        resolution: 'AUTOMATIC'
      },

      propagation: {
        method: 'explosion',
        behavior: 'aoe',
        secondaryRadius: 15
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 15
      },

      tags: ['fire', 'buff', 'transformation']
    },

    {
      id: 'pyro_inferno_mastery',
      name: 'Inferno Mastery',
      description: 'Unleash a cataclysmic inferno that consumes everything in its path, dealing 20d10 + INT×2 fire damage in a 50-foot radius. This ultimate display of pyromantic mastery leaves nothing but ash and cinders.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Fire/Fire Orb',
      
      typeConfig: {
        school: 'fire',
        icon: 'Fire/Fire Orb',
        tags: ['fire', 'damage', 'aoe'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 200,
        aoeShape: 'circle',
        aoeParameters: { radius: 50 },
        targetRestrictions: []
      },

      resourceCost: {
        resourceTypes: ['mana', 'inferno_ascend', 'inferno_required'],
        resourceValues: { mana: 40, inferno_ascend: 3, inferno_required: 9 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Dominatio Infernus!',
        somaticText: 'Command all fire'
      },

      effectTypes: ['damage'],

      damageConfig: {
        formula: '20d10 + intelligence * 2',
        damageTypes: ['fire'],
        resolution: 'DICE',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          critDiceOnly: false,
          extraDice: '6d10',
          explodingDice: true,
          explodingDiceType: 'reroll_add'
        }
      },

      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: true,
            baseFormula: '20d10 + intelligence * 2',
            conditionalFormulas: {
              'inferno_9': '25d10 + intelligence * 3',
              'inferno_7_plus': '22d10 + intelligence * 2',
              'default': '20d10 + intelligence * 2'
            }
          }
        },
        effectTriggers: {
          damage: {
            logicType: 'OR',
            compoundTriggers: [{
              id: 'resource_threshold',
              category: 'health',
              name: 'High Inferno Level',
              parameters: {
                resource_type: 'inferno',
                threshold_value: 7,
                threshold_type: 'flat',
                comparison: 'greater_than',
                perspective: 'self'
              }
            }]
          }
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 12
      },

      tags: ['fire', 'damage', 'aoe']
    }
  ]
};

