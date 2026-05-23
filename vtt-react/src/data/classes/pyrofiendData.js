/**
 * Pyrofiend Class Data
 *
 * The Damned Conduit — flesh surrendered to Scathrach, the Ashen Sovereign.
 * Ascending corruption, exponential devastation, and the literal death clock.
 * Overhauled per the Auditor's Report: Apostate's Path, Demonic Whisper,
 * Corruption Manifestation Table, and named demon patron.
 */

export const PYROFIEND_DATA = {
  id : "pyrofiend",
  name: "Pyrofiend",
  icon: "fas fa-fire",
  role: "Damage",
  damageTypes: ["fire"],

  classIdentity: {
    title: "The Damned Conduit",
    subtitle: "Flesh Surrendered to Scathrach, the Ashen Sovereign",
    demonPatron: {
      name: "Scathrach, the Ashen Sovereign",
      title: "The Ninth Flame of the Burning Throne",
      description:
        "Scathrach is not a benevolent patron. It is a parasitic intelligence from the deepest furnace of the infernal deep — a thing that was never mortal, never alive in any sense that flesh understands. It feeds on desperation, answers prayers with combustion, and considers every mortal body it inhabits to be kindling. The Pyrofiend did not make a deal with Scathrach. They were chosen — selected for their particular brand of despair, their willingness to burn rather than endure. The pact is written in scar tissue. The price is paid in breath, blood, and eventual immolation.",
    },
    utility:
      "Unmatched, escalating, exponential area-of-effect devastation. As the Inferno Veil ascends, damage multiplies to world-ending levels — capable of melting boss-tier encounters in a single turn. No other class can match the Pyrofiend's ceiling when the Veil climbs.",
    fatalFlaw:
      "The Death Clock and the Mana Tax. Power literally kills the Pyrofiend. At Inferno Level 9, exactly 3 of their own turns remain before permanent death. Furthermore, staying cool requires Cooling Ember, which drains mana the Pyrofiend cannot afford to lose. Their body runs at an agonizing internal temperature, suffering catastrophic vulnerability to Cold damage — rapid internal crystallization causes massive physical trauma, and cold sources force the Veil to ascend as the body burns hotter to compensate.",
  },

  // Overview section
  overview: {
    title: "The Pyrofiend",
    subtitle: "Demonic Fire Wielder",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: You did not study magic. You surrendered your flesh to Scathrach, the Ashen Sovereign — a parasitic intelligence from the infernal deep. Your power is a debt paid in blood. The Inferno Veil ascends through 10 levels (0-9), each one rewriting your body into something less human. Climb too high and the corruption kills you. Stay too low and you insult the demon that owns you.

**Core Mechanic**: Cast fire spells → Ascend Inferno Levels → Gain fire damage bonus (+1 to +8, then +10 at Level 9 "Scathrach's Bargain") → Suffer escalating drawbacks (self-damage, movement loss, suffocation, demonic possession) → Use Cooling Ember to descend (imposes Mana Tax) → At Level 5+, make Spirit saves or be forced to attack the nearest living thing (friend or foe)

**Resource**: Inferno Veil (0-9 scale, tracked with a single d10 die)

**Playstyle**: Risk-reward demonic escalation with catastrophic consequences and friendly-fire risk

**Best For**: Players who thrive on living dangerously, managing escalating self-harm for devastating firepower, and making split-second tactical decisions — and who are comfortable being a potential liability to their own party at high corruption`,
    },

    description: `The Pyrofiend did not choose this path — Scathrach chose them. They are a Damned Conduit: a mortal body repurposed as a furnace for an infernal parasite. Every spell cast is a surrender, every Inferno ascent another strip of flesh traded for fire. The Pyrofiend wields the most devastating area-of-effect power in Mythrill, but every point of that power is borrowed against their own life. At Level 9, Scathrach fully manifests — and the Pyrofiend has three turns to descend or die permanently. There is no resurrection from Scathrach's grasp. Only ash.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Pyrofiends did not make a deal — they were selected by Scathrach, the Ashen Sovereign, a parasitic intelligence that feeds on desperation. The pact was not negotiated. It was inflicted. Scathrach tasted their despair, their willingness to burn rather than endure, and it moved in.
      
Their connection to hellfire manifests physically at every threshold (see the Corruption Manifestation Table in the Resource System). Eyes ignite. Veins darken. Horns erupt. At Level 5, Scathrach begins speaking through them — and forcing their body to act against their will. At Level 9, the original personality is a passenger in their own charring flesh.

Common Pyrofiend archetypes include:
- **The Grief-Stricken**: Lost everything and chose to become the fire that consumed their world
- **The Failed Priest**: Prayed to every god and was answered only by Scathrach
- **The Calculating Arsonist**: Believes the demon can be controlled through sheer will and mathematics
- **The Resigned Kindling**: Knows they will die by fire and has made peace with it — fights to take the enemy with them`,
    },

    combatRole: {
      title: "Combat Role",
      content: `The Pyrofiend is the highest area-of-effect damage ceiling in Mythrill — capable of melting boss-tier encounters in a single turn when the Inferno Veil climbs. They excel at:

**Exponential Burst Damage**: Ascending to high Inferno Levels multiplies fire damage beyond any other class's capability
**Area Devastation**: No other class can match a Level 8+ Pyrofiend's AoE destruction
**Risk-Reward Tension**: Managing Inferno Levels creates agonizing tactical decisions every single turn
**The Demonic Whisper Threat**: At Level 5+, the Pyrofiend may be forced to attack allies — the party must position carefully around them

The cost is everything. The Pyrofiend's drawbacks at high Inferno Levels are catastrophic: self-damage, movement loss, suffocation, demonic possession, and eventually the death clock. Their vulnerability to Cold damage is devastating — frost attacks deal +50% damage and force the Veil to ascend. A Pyrofiend who ascends too quickly dies by their own fire. A Pyrofiend who ascends too slowly insults the demon. There is no safe middle ground — only calculated sacrifice.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Pyrofiend is about managing an addiction that is literally killing you. Every turn is a question: push harder or pull back? Neither answer is safe.

**Inferno Level Management**: 
- Low levels (0-3): Safe, consistent damage — but Scathrach whispers that you're wasting its gifts
- Mid levels (4-6): High damage with manageable drawbacks — the Demonic Whisper begins at Level 5
- High levels (7-9): Devastating power but you are dying in real-time. Level 9 starts a 3-turn death clock

**Timing Your Ascension**: 
- Ascend rapidly for burst damage when you need to eliminate priority targets
- Maintain mid-levels for sustained combat effectiveness
- Use Cooling Ember strategically to descend — but it costs precious mana you need for offense

**The Mana Tax**: Cooling Ember (4 mana) is the only reliable way to descend. Every cast is mana you can't spend on damage. At high Inferno Levels, you must save enough for Cooling Ember or die. This creates a permanent tension between offense and survival.

**Specialization Synergies**:
- **Inferno**: Pure destruction, aggressive ascension — maximum risk, maximum reward
- **Wildfire**: Spread and area control — sustained pressure across multiple targets
- **The Apostate's Path**: Controlled corruption — double mana cost, half ascent rate, advantage on Demonic Whisper saves

**Team Dynamics**:
- The party must protect the Pyrofiend at high Inferno Levels — they are extremely vulnerable
- At Level 5+, the party must also protect themselves FROM the Pyrofiend if the Demonic Whisper takes hold
- Healers cannot help at Inferno Level 6+ (Heresy blocks outside healing)
- Synergizes with crowd control to safely ascend — but CC the Pyrofiend too if they fail their Whisper save`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Infernal Ascension",
      content: `**The Setup**: You're a Pyrofiend (Inferno specialization) facing a powerful ice elemental and its minions (1 ice elemental + 4 frost wraiths). Your party is with you. Starting Inferno Level: 0. Starting Mana: 60/60. Your goal: Ascend through Inferno Levels to maximize fire damage, but manage the increasingly severe drawbacks. Remember — cold damage forces your Veil to ascend (+1 Inferno per cold attack received) as Scathrach's furnace burns hotter to compensate.

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

**Second Action**: Cast "Infernal Blast" at surviving Frost Wraith (20 mana, ascends +2)
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

You are the HIGHEST AoE DAMAGE CEILING in the game. You ascend through Inferno Levels, each one adding +1 fire damage (+10 at the deadly Level 9) but imposing escalating drawbacks as Scathrach rewrites your body. The key is knowing when to ASCEND for burst damage (Hellfire Wave at Level 5 with Infernal Surge = 72 damage) and when to use Cooling Ember to DESCEND and survive. At Level 5, the Demonic Whisper begins — fail a Spirit save and you may be forced to burn your own allies. You're not a safe class. You are a LIVING WEAPON that is slowly killing its wielder — a DEMONIC GLASS CANNON who trades their own blood, mana, and eventually their soul for DEVASTATING POWER.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Inferno Veil",
    subtitle: "Scathrach's Corruption Ascendant",

    description: `Your power is a debt to Scathrach, the Ashen Sovereign. As you cast fire magic, you ascend through nine stages of demonic corruption — each one rewriting your body into something less human and more furnace. Every level adds to your fire damage. Every level takes something from your flesh. Climb too high and the death clock begins. Stay too low and Scathrach grows impatient. The Veil is not a resource. It is a disease, and you chose to be infected.`,

    cards: [
      {
        title: "Inferno Levels (0-9)",
        stats: "10 Stages",
        details:
          "Each level adds +1 to all fire damage. Level 9 grants a massive +10 bonus but starts a terminal death clock.",
      },
      {
        title: "Drawbacks",
        stats: "Escalating Penalties",
        details:
          "Corruption inflicts self-damage, movement loss, and suffocation. High-level play requires balancing maximum heat with survival.",
      },
    ],

    generationTable: {
      headers: ["Action", "Inferno Change", "Notes"],
      rows: [
        [
          "Cast Fire Spell",
          "+1 to +3",
          "Most offensive spells cause ascension",
        ],
        [
          "Infernal Surge (Lv 5+)",
          "Bonus Damage",
          "Next fire spell deals +2d6 damage",
        ],
        [
          "Cooling Ember",
          "-2 Levels (fixed)",
          "The essential release valve; heals 1d6 + spirit/3 HP",
        ],
        [
          "Scathrach's Bargain",
          "Level 9 (+10)",
          "Disproportionate power; death in 3 of your turns if not cleared",
        ],
        [
          "Rest / Out of Combat",
          "-1 per minute",
          "Short Rest resets to 0; corruption fades with meditation",
        ],
      ],
    },

    usage: {
      momentum:
        "Ascend by casting offensive fire spells. Each level adds flat fire damage to every hit, making multi-hit or AoE spells exponentially more powerful.",
      flourish:
        'Use Cooling Ember to descend and heal. Managing the "Safe Zone" (0-3), "Power Zone" (4-6), and "Danger Zone" (7-9) is the core of the class.',
    },

    overheatRules: {
      title: "Scathrach's Bargain (Level 9)",
      content: `Reaching Inferno Level 9 represents total surrender to Scathrach, the Ashen Sovereign. You are no longer in control. The demon is.

**You have THREE OF YOUR TURNS** to descend below Level 9. At the start of each of your turns while at Inferno Level 9, the death clock ticks down. If you have not descended below Level 9 after 3 of your turns:
- You are **consumed by fire** (Immediate Death — your body detonates in a 30-foot radius of 10d6 fire damage)
- Your soul is **claimed by Scathrach** (Standard resurrection fails — you belong to the furnace now)

**Survival Guide**:
- Use **Cooling Ember** immediately to drop 2 levels (fixed).
- The Apostate's Path can use **Tempered Pact** to manage ascent rate more carefully.
- Do NOT reach Level 9 unless the boss is at <10% HP and your party is out of range of your detonation.`,
    },

    infernoLevelsTable: {
      title: "Inferno Veil: Level Effects & Corruption",
      headers: ["Level", "Bonus", "Drawback", "Inspiration"],
      rows: [
        ["0", "+0", "None", "Mortal"],
        ["1", "+1", "-2 Hit chance (distortions)", "Limbo"],
        ["2", "+2", "1d4 Psychic dmg/turn", "Lust"],
        ["3", "+3", "-10ft Movement, Fatigue", "Gluttony"],
        ["4", "+4", "+1d6 Damage taken from all sources", "Greed"],
        ["5", "+5", "1d6 Bleeding dmg/turn", "Wrath"],
        [
          "6",
          "+6",
          "Cannot be healed by others, Disadv on Insight/Perception",
          "Heresy",
        ],
        ["7", "+7", "-15ft Speed, 1d6 Suffocation", "Violence"],
        ["8", "+8", "2d4 Self-dmg, Disadv Dex", "Fraud"],
        ["9", "+10", "4d8 Self-dmg, Death in 3 Turns, Scathrach Manifests", "Treachery"],
      ],
    },

    corruptionManifestation: {
      title: "Corruption Manifestation: The Flesh Remembers",
      subtitle: "What the Pyrofiend Looks Like at Each Threshold",
      description:
        "Scathrach's influence is not subtle. As the Inferno Veil ascends, the demon rewrites the Pyrofiend's body — transforming meat and bone into a furnace of ruin. These changes are physical, visible to all, and persist until the Veil descends. The DM should use these descriptions to narrate the horror at the table.",
      stages: [
        {
          level: 0,
          title: "The Mortal Husk",
          appearance:
            "Outwardly normal. A faint scent of sulfur clings to their clothes. Skin runs slightly warm — enough to notice, not enough to alarm. The only sign is in their eyes: a barely perceptible amber ring around the pupil that was not there before the pact.",
        },
        {
          level: 1,
          title: "The Flicker Behind the Eyes",
          appearance:
            "The eyes ignite. Not metaphorically — a literal orange light pulses behind the irises, flickering like a candle in wind. The air within arm's reach shimmers with heat distortion. Allies standing nearby feel sudden warmth. Breath comes as steam.",
        },
        {
          level: 2,
          title: "The Veins Darken",
          appearance:
            "Dark lines crawl beneath the skin — veins turning black as Scathrach's ichor replaces blood. Breath fogs as steam even in warm air. The Pyrofiend's shadow flickers: sometimes larger than it should be, sometimes in the wrong direction. Headaches are constant. The mind feels... crowded.",
        },
        {
          level: 3,
          title: "The Sweat of Furnaces",
          appearance:
            "Skin runs hot enough to blister paper on contact. Sweat is replaced by oily residue that evaporates immediately. Minor burns appear spontaneously on palms and forearms — stigmata of the internal furnace. Movement becomes labored, as though wading through thick air. Fatigue is constant and crushing.",
        },
        {
          level: 4,
          title: "The Cracking",
          appearance:
            "Skin begins to split. Not wounds — eruptions. Thin fissures form along joints and ribs, revealing not tissue but a dim orange-red ember glow beneath, as though the body is a ceramic vessel filled with coals. Fingertips are permanently charred. Touching the Pyrofiend deals 1 fire damage. The smell of burning hair and rendered fat is constant and nauseating.",
        },
        {
          level: 5,
          title: "The Horns and the Whisper",
          appearance:
            "Small blackened horns push through the temples — Scathrach marking its territory in flesh. Veins glow molten orange through the cracks. The voice acquires a metallic, echoing quality, as though speaking through a furnace pipe. The Pyrofiend's shadow now moves independently — twitching, grasping. THIS IS THE THRESHOLD WHERE THE DEMONIC WHISPER BEGINS: Scathrach can now force the Pyrofiend to target the nearest living thing, friend or foe.",
        },
        {
          level: 6,
          title: "The Schism of Flesh",
          appearance:
            "Skin splits at every joint, revealing magma beneath. Eyes are solid orange — no pupil, no iris, just burning light. Teeth have sharpened into points. The Pyrofiend can no longer be healed by others; Scathrach's corruption rejects mortal magic. Smoke curls from every orifice. The Pyrofiend speaks in two voices — their own and something ancient. Body temperature ignites dry wood on contact.",
        },
        {
          level: 7,
          title: "The Smoldering Atrocity",
          appearance:
            "Horns curl backward like a crown of charred bone. Smoke pours continuously from mouth, ears, and wounds. Movement leaves burning footprints that persist for 1 round. The Pyrofiend is barely recognizable as having once been mortal — they are now a shambling furnace, a vessel of hate and fire. Flammable objects within 5 feet ignite spontaneously. Allies give them a wide berth. Children weep.",
        },
        {
          level: 8,
          title: "The Unraveling",
          appearance:
            "The body distorts. Legs char and crack with every step. Arms trail flame like tattered banners. The face is a mask of splitting flesh over white-hot bone — still recognizably humanoid, but only just. Movement is agonizing — every step costs hit points. Scathrach's voice is now dominant; the original personality screams from behind eyes of solid fire. They leave a trail of ash and embers. They smell like a crematorium.",
        },
        {
          level: 9,
          title: "The Death Threshold — Scathrach Made Manifest",
          appearance:
            "BARELY HUMAN. The Pyrofiend is a charring, screaming vessel of living fire held together by will and demonic spite. Flesh sloughs off in burning sheets, revealing bone that glows white-hot. Scathrach's voice IS the only voice now — the original personality is a passenger, a spectator in their own execution. The death clock begins: 3 of your turns before Scathrach claims you entirely. Your soul becomes fuel. You become the fire. There is no coming back from this except through desperate, immediate descent. If you fail — if the clock runs out — your body detonates in a 30-foot radius of 10d6 fire damage and your soul is dragged into Scathrach's furnace forever. Standard resurrection fails. You are ash. You are kindling. You are finished.",
        },
      ],
    },

    demonicWhisper: {
      title: "The Demonic Whisper",
      subtitle: "Scathrach's Will Intrudes",
      description: `At Inferno Level 5 and above, Scathrach's grip on the Pyrofiend's mind tightens. The demon whispers — not words, but impulses. Urges. The desire to burn the nearest thing, regardless of allegiance.

**Mechanic**: At the start of each of your turns while at Inferno Level 5 or higher, you must make a **Spirit saving throw** against DC 12 + your current Inferno Level. On a failure, your next offensive action this turn MUST target the nearest living entity (friend or foe). If there are multiple equidistant targets, the DM determines randomly.

**This is not optional.** The Pyrofiend does not choose who they attack — Scathrach chooses. The DM should describe the horror: the Pyrofiend's arm moving against their will, the demonic voice laughing as a fireball streaks toward their own healer.

**Important**: This check is made AFTER the Inferno Level drawback is resolved but BEFORE you take any actions. If you pass the save, you act normally. If you fail, you must still spend the action points and mana for your intended action — you simply cannot choose the target.

**The Apostate's Path Exception**: Pyrofiends following The Apostate's Path specialization gain advantage on this save. Their tempered pact gives them more resistance to Scathrach's direct control — but does not eliminate it entirely.`,
    },

    strategicConsiderations: {
      title: "Managing the Flame",
      content: `**Important — Drawbacks Do Not Stack**: You only suffer the drawback of your current Inferno Level. Lower-level drawbacks are superseded, not cumulative. For example, at Level 5 you suffer 1d6 bleeding per turn — you do NOT also suffer the Level 1 hit penalty, Level 2 psychic damage, Level 3 movement penalty, or Level 4 damage vulnerability.

**Important — Drawback Timing**: Drawbacks take effect immediately upon ascending to a new Inferno Level. If you ascend from Level 4 to Level 6 in a single turn, you suffer only the Level 6 drawback (not Level 5's bleeding or Level 6's penalty separately — just Level 6). The self-damage drawbacks (Levels 2, 5, 7, 8, 9) apply at the start of each of your turns while at that level.

**Important — Inferno Level Cap**: Your Inferno Level cannot exceed 9. If a spell would cause you to ascend past Level 9, the excess ascension is lost and your level remains at 9.

**Important — Inferno Required (Spell Gating)**: Many spells list an "Inferno Required" cost in addition to mana. You must be at or above that Inferno Level to cast the spell. Plan your ascension so you reach the required level before you need your strongest spells.

**Important — Cold Vulnerability**: The Pyrofiend suffers +50% damage from all Cold/Frost sources (rounded up). Additionally, any Cold damage received forces the Inferno Veil to ascend by +1 as Scathrach's furnace burns hotter to compensate for the internal crystallization. A frost attack does not cool the Pyrofiend down — it makes them burn hotter and die faster.

**Important — The Demonic Whisper (Level 5+)**: At the start of each turn while at Inferno Level 5+, make a Spirit save (DC 12 + Inferno Level) or be forced to target the nearest entity (friend or foe) with your next offensive action. See the Demonic Whisper section for full rules.

**The Safe Zone (Lv 0–3)**: Minimal drawbacks. Use this for clearing minor enemies or during exploration. You are consistent but not devastating. Scathrach is patient here. It can afford to be.

**The Power Zone (Lv 4–6)**: The optimal state. High damage bonuses with manageable penalties. Most specializations thrive here. The Demonic Whisper begins at Level 5 — your party must now account for friendly-fire risk. At Level 6, you cannot be healed by others.

**The Danger Zone (Lv 7–9)**: Reserved for finales. The self-damage and speed penalties are brutal. You are dying in real-time. Only enter this zone if you have a clear shot at finishing the encounter or a plan to descend immediately after.

**The Release Valve**: Never enter a turn with 0 Mana if you are above Level 5. You MUST save enough for **Cooling Ember** (4 Mana) to descend if the corruption becomes life-threatening. This is the Mana Tax — the permanent cost of being a living furnace.

**Out of Combat Recovery**: When combat ends, your Inferno Level decreases by 1 per minute of rest. After a Short Rest, it resets to 0. The corruption fades with time and meditation — but it does not vanish instantly. Scathrach always leaves a mark.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "Physical Tracking for Tabletop Play",
      content: `The Inferno Veil is perfectly represented by a single ten-sided die.

**Required Materials**:
- **1d10 (Ten-Sided Die)** — To track your Inferno Level (0–9)
- **Status Cards** — To remind you of your current Level's drawback

**The Descent Loop**:
- **Cast Spell**: Rotate the d10 up by the ascension value (e.g., from 3 to 5).
- **Start of Turn**: Check the die. If it's at 5, take your 1d6 bleeding damage.
- **Cooling Ember**: Roll 1d4, rotate the die down, and roll the appropriate healing.

**Physical Hack**: Use a **Red d10** for the normal levels and keep a **Black d10** nearby. If you reach Level 9, swap to the black die to signal to the party (and the GM) that the death clock has started.`,
    },
  },

  // Specializations
  specializations: {
    title: "Pyrofiend Specializations",
    subtitle: "Three Responses to Scathrach's Hunger",

    description: `Every Pyrofiend chooses how they respond to the parasite living inside them. Each specialization represents a different philosophy — not of power, but of survival. How long can you endure the furnace before Scathrach claims you? The answer depends on which path you walk.`,

    sharedPassive: {
      name: "Infernal Surge",
      tier: "Path Passive",
      description:
        "When you ascend to Inferno Level 5 or higher, your next fire spell deals an additional 2d6 fire damage. This effect can only trigger once per ascension event.",
    },

    specs: [
      { id : "inferno",
        name: "Inferno",
        icon: "Fire/Swirling Fireball",
        color: "#FF4500",
        theme: "Pure Destruction",

        description: `The Inferno specialization embodies raw, uncontrolled demonic fire. Inferno Pyrofiends are the most aggressive, ascending rapidly and dealing maximum burst damage. They embrace the corruption fully, using it as a weapon.`,

        playstyle:
          "Aggressive burst damage, rapid ascension, high-risk high-reward",

        strengths: [
          "Highest single-target burst damage",
          "Fastest Inferno Level ascension",
          "Powerful execute abilities at high levels",
          "Bonus damage when above Inferno Level 5",
        ],

        weaknesses: [
          "Most vulnerable to drawbacks",
          "Limited defensive options",
          "Requires careful timing",
          "Struggles in prolonged fights",
        ],

        passiveAbilities: [
          {
            name: "Burning Ambition",
            tier: "Specialization Passive",
            description:
              "While at Inferno Level 3 or higher, your fire spells deal +1 damage per die rolled. Additionally, while at Inferno Level 7 or higher, your fire spells crit on the 2 highest die numbers instead of just the highest, and critical hits deal an additional 1d10 fire damage.",
            uniqueTo: "Inferno",
          },
        ],

        recommendedFor:
          "Players who enjoy high-risk gameplay, burst damage, and aggressive tactics",
      },

      { id : "wildfire",
        name: "Wildfire",
        icon: "Fire/Scorching Rune",
        color: "#FF8C00",
        theme: "Spreading Chaos",

        description: `Wildfire Pyrofiends specialize in spreading flames across multiple targets. Their fire jumps from enemy to enemy, creating cascading infernos that consume entire groups. They balance ascension with area control.`,

        playstyle: "Area damage, damage-over-time effects, battlefield control",

        strengths: [
          "Excellent multi-target damage",
          "Strong damage-over-time effects",
          "Fire spreads between enemies",
          "Better sustained damage than Inferno",
        ],

        weaknesses: [
          "Lower single-target burst",
          "Requires enemy grouping",
          "DoT effects take time",
          "Less effective against single bosses",
        ],

        passiveAbilities: [
          {
            name: "Wildfire Spread",
            tier: "Specialization Passive",
            description:
              "When an enemy affected by your burn effect dies, the burn spreads to all enemies within 10 feet, dealing 2d6 fire damage and applying a new burn effect (1d6 fire damage per turn for 3 turns). This effect can only trigger once per round and cannot chain from spread burns.",
            uniqueTo: "Wildfire",
          },
        ],

        recommendedFor:
          "Players who enjoy area control, damage-over-time builds, and tactical positioning",
      },

      { id : "apostate",
        name: "The Apostate's Path",
        icon: "Fire/Burning Ember",
        color: "#6B2020",
        theme: "Controlled Corruption",

        description: `The Apostate walks the razor's edge between mastery and damnation. Where other Pyrofiends surrender to Scathrach's hunger, the Apostate fights for every inch of control — pouring double the mana into each spell to slow the corruption's advance. They do not heal. They do not sustain. They endure. The Apostate's Path is not a road to power; it is a desperate, agonizing bid to delay the inevitable. Every spell costs twice the mana for half the corruption. It is a philosophy of survival through restraint — and it is slowly killing them in a different way.

Apostates burn through their mana reserves at a terrifying rate. They deal less burst damage than Inferno Pyrofiends and lack the area control of Wildfire. What they gain is time — more turns before the death clock, more room to maneuver at high Inferno Levels, and the ability to deliberately push to dangerous thresholds with less risk of losing control. The Apostate's tragedy is that their restraint does not come from discipline. It comes from fear. They have seen what Scathrach truly wants. And they will spend every last drop of mana to deny it.`,

        playstyle:
          "Mana-intensive sustained damage, controlled corruption, endurance over burst",

        strengths: [
          "Ascends Inferno Veil at half the rate — more turns at safe levels",
          "Gains advantage on Demonic Whisper Spirit saves",
          "Descent via Cooling Ember grants bonus damage on next spell",
          "Can sustain higher Inferno Levels longer than other specs",
        ],

        weaknesses: [
          "ALL fire spells cost DOUBLE mana",
          "Lowest raw damage output of all specs",
          "Mana starvation is a constant, lethal threat",
          "No self-healing whatsoever — every wound is permanent until healed by others (and only below Level 6)",
        ],

        passiveAbilities: [
          {
            name: "Tempered Pact",
            tier: "Specialization Passive",
            description:
              "All fire spells cost double mana but ascend the Inferno Veil at half the rate (rounded down, minimum 0). When you descend Inferno Levels via Cooling Ember, you gain a bonus of +1 to your next fire spell's damage per level descended. This bonus stacks with Inferno Level bonuses and expires after 1 use. Additionally, you gain advantage on Demonic Whisper Spirit saves.",
            uniqueTo: "The Apostate's Path",
          },
        ],

        recommendedFor:
          "Players who want a resource-management puzzle, controlled escalation, and the tragic fantasy of fighting a losing war against their own demonic patron",
      },
    ],
  },

  // Spell Pools - organized by character level
  // Maps character level to available spell IDs for learning
  spellPools: {
    1: [
      // Level 1 starting spells (pick 3)
      // IMPORTANT: Cooling Ember is strongly recommended — without it, you cannot reduce your Inferno Level
      "pyro_ember_spark",
      "pyro_smoldering_touch",
      "pyro_flicker",
      "pyro_cooling_ember",
      "pyro_heat_shield",
    ],
    2: [
      // Level 2 spells
      "pyro_scorching_grasp",
      "pyro_flame_lash",
      "pyro_cinder_bolt",
    ],
    3: [
      // Level 3 spells
      "pyro_fireball",
      "pyro_burning_hands",
      "pyro_flame_step",
    ],
    4: [
      // Level 4 spells
      "pyro_infernal_blast",
      "pyro_searing_chains",
      "pyro_fiery_aura",
    ],
    5: [
      // Level 5 spells
      "pyro_hellfire_wave",
      "pyro_immolation",
      "pyro_fire_whip",
    ],
    6: [
      // Level 6 spells
      "pyro_lava_burst",
      "pyro_flame_storm",
      "pyro_infernal_brand_advanced",
    ],
    7: [
      // Level 7 spells
      "pyro_volcanic_eruption",
      "pyro_hellfire_breath",
      "pyro_demonic_empowerment",
    ],
    8: [
      // Level 8 spells
      "pyro_meteor_shower",
      "pyro_infernal_nova",
      "pyro_phoenix_flame",
    ],
    9: [
      // Level 9 spells
      "pyro_infernal_avatar",
      "pyro_apocalypse",
      "pyro_hellfire_ritual",
    ],
    10: [
      // Level 10 spells
      "pyro_brimstone_teleport",
      "pyro_demonic_ascension",
      "pyro_inferno_mastery",
    ],
  },

  // Spells - organized by level, properly formatted for wizard
  spells: [
    // ========================================
    // LEVEL 1 STARTING SPELLS (5 options, pick 3)
    // Weak starter spells - intentionally low power
    // ========================================
    { id: "pyro_ember_spark",
      name: "Ember Spark",
      description:
        "Scathrach gifts you a malevolent spark — a fragment of its own hatred, compressed into a projectile. It burrows into flesh, igniting a smolder that no mortal can extinguish. Deals initial fire damage and leaves a persistent burn that consumes the target over 2 rounds. The ember is the demon's way of saying: burn everything.",
      level: 1,
      spellType: "ACTION",
      icon: "Fire/Flame Burst",

      typeConfig: {
        school: "fire",
        icon: "Fire/Flame Burst",
        tags: ["fire", "damage", "dot", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 3, inferno_ascend: 1, inferno_required: 0 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Scathrach, exuro!",
        somaticText:
          "Snap fingers together, a malevolent red-orange spark forming and launching forward",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d6",
        damageTypes: ["fire"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "1d4",
          damageTypes: ["fire"],
          tickFrequency: "round",
          duration: 2,
          canStack: false,
          maxStacks: 1,
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "dot", "starter"],
    },

    { id: "pyro_smoldering_touch",
      name: "Smoldering Touch",
      description:
        "Your hand glows with the heat of Scathrach's contempt. You press it into an enemy's flesh — not gently — searing through armor and leaving a smolder that burns for 1d4 fire damage per round for 2 rounds. The touch is not a spell. It is an imposition. You are sharing what lives inside you.",
      level: 1,
      spellType: "ACTION",
      icon: "Fire/Fire Bolt",

      typeConfig: {
        school: "fire",
        icon: "Fire/Fire Bolt",
        tags: ["fire", "damage", "touch", "dot", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 4, inferno_ascend: 1, inferno_required: 0 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Ardeo!",
        somaticText: "Touch with glowing hand",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d8 + intelligence/3",
        damageTypes: ["fire"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "1d4",
          damageTypes: ["fire"],
          tickFrequency: "round",
          duration: 2,
          canStack: false,
          maxStacks: 1,
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "touch", "dot", "starter"],
    },

    { id: "pyro_flicker",
      name: "Flicker",
      description:
        "A quick flash of Scathrach's spite streaks toward your target. Small but precise, the flame ignites instantly and leaves a trail of heat in its wake. This is the demon flicking a match — dismissive, casual, and still enough to set the world alight.",
      level: 1,
      spellType: "ACTION",
      icon: "Fire/Fiery Symbol",

      typeConfig: {
        school: "fire",
        icon: "Fire/Fiery Symbol",
        tags: ["fire", "damage", "starter"],
        castTime: 0,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 3, inferno_ascend: 1, inferno_required: 0 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal"],
        verbalText: "Flicker!",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d6 + intelligence/4",
        damageTypes: ["fire"],
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "starter"],
    },

    { id: "pyro_cooling_ember",
      name: "Cooling Ember",
      description:
        "You press your hand to your own chest and will the furnace to dim. Scathrach screams inside your skull — it hates this. Cooling Ember draws the infernal heat back into the demon's prison, soothing your corrupted flesh and restoring a fraction of your health. Essential for survival. Every cast costs mana you cannot afford. This is the Mana Tax — the price of not dying.",
      level: 1,
      spellType: "ACTION",
      icon: "Fire/Dragon Breath",

      typeConfig: {
        school: "fire",
        icon: "Fire/Dragon Breath",
        tags: ["fire", "healing", "utility", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_descend", "inferno_required"],
        resourceValues: { mana: 4, inferno_descend: 2, inferno_required: 0 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Pax Ignis",
        somaticText: "Place hand over heart",
      },

      effectTypes: ["healing"],

      healingConfig: {
        formula: "1d6 + spirit/3",
        healingType: "direct",
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "healing", "utility", "starter"],
    },

    { id: "pyro_heat_shield",
      name: "Heat Shield",
      description:
        "You pull Scathrach's heat outward, wrapping yourself in a shimmering barrier of superheated air. Attacks that pass through it are warped and dissipated by the thermal distortion. The shield is a fragment of the demon's own defenses — borrowed, not earned.",
      level: 1,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",

      typeConfig: {
        school: "fire",
        icon: "Radiant/Radiant Divinity",
        tags: ["fire", "buff", "defensive", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_descend", "inferno_required"],
        resourceValues: { mana: 4, inferno_descend: 1, inferno_required: 0 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Scutum Calor!",
        somaticText: "Raise hands to create barrier",
      },

      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "heat_shield_damage_reduction",
            name: "Heat Shield",
            description:
              "+2 Damage Reduction for 2 rounds. The heat shield absorbs and disperses incoming attacks, reducing the damage that reaches you.",
            mechanicsText: "",
            statModifier: {
              stat: "damage_reduction",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "buff", "defensive", "starter"],
    },

    // ========================================
    // LEVEL 2 SPELLS
    // ========================================
    { id: "pyro_scorching_grasp",
      name: "Scorching Grasp",
      description:
        "Flames engulf your hand — not the warm orange of a hearth, but the sickly black-red of Scathrach's ire. You seize the enemy and the fire clings, searing through armor and flesh for 2d8 + INT/2 fire damage, then burning for 1d4 fire damage per round for 2 rounds. Your touch is a branding iron. The mark says: property of the Ashen Sovereign.",
      level: 2,
      spellType: "ACTION",
      icon: "Fire/Scorching Rune",

      typeConfig: {
        school: "fire",
        icon: "Fire/Scorching Rune",
        tags: ["fire", "damage", "touch"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 8, inferno_ascend: 1, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Ardeo!",
        somaticText: "Grasp with burning hand",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d8 + intelligence/2",
        damageTypes: ["fire"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "1d4",
          damageTypes: ["fire"],
          tickFrequency: "round",
          duration: 2,
          canStack: false,
          maxStacks: 1,
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "touch"],
    },

    { id: "pyro_flame_lash",
      name: "Flame Lash",
      description:
        "A whip of condensed fire lashes out from your palm, coiling around an enemy and dragging them toward you through sheer infernal fury. The flames sear as they grip, and the target feels Scathrach's hunger pulling them closer to the furnace.",
      level: 2,
      spellType: "ACTION",
      icon: "Fire/Sun Symbol",

      typeConfig: {
        school: "fire",
        icon: "Fire/Sun Symbol",
        tags: ["fire", "damage", "control"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 8, inferno_ascend: 1, inferno_required: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Flagellum Ignis!",
        somaticText: "Whip hand forward",
      },

      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "2d6 + intelligence/3",
        damageTypes: ["fire"],
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "forcedMovement",
        strength: "weak",
        duration: 0,
        durationUnit: "instant",
        savingThrow: {
          ability: "strength",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
        effects: [
          { id : "pull",
            name: "Pull",
            description:
              "Pulls the target 15 feet toward the caster. DC 14 Strength save negates.",
            config: {
              movementType: "pull",
              distance: 15,
            },
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "control"],
    },

    { id: "pyro_cinder_bolt",
      name: "Cinder Bolt",
      description:
        "You compress Scathrach's hatred into a bolt of cinders and hurl it. On impact, the bolt detonates — showering the area in sparks and slag. A small explosion by Pyrofiend standards. A catastrophic one by anyone else's.",
      level: 2,
      spellType: "ACTION",
      icon: "Fire/Swirling Fireball",

      typeConfig: {
        school: "fire",
        icon: "Fire/Swirling Fireball",
        tags: ["fire", "damage", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 5 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 8, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Cinis Sagitta!",
        somaticText: "Hurl cinder bolt",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d6 + intelligence/2",
        damageTypes: ["fire"],
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "aoe"],
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    { id: "pyro_fireball",
      name: "Fireball",
      description:
        "The classic instrument of Scathrach's wrath. A sphere of condensed demonic fire streaks to a point you choose and detonates, engulfing everything within range in a roaring inferno. This is the spell that earned the Pyrofiend its reputation — and its body count.",
      level: 3,
      spellType: "ACTION",
      icon: "Fire/Swirling Fireball",

      typeConfig: {
        school: "fire",
        icon: "Fire/Swirling Fireball",
        tags: ["fire", "damage", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 100,
        aoeShape: "sphere",
        aoeParameters: { radius: 10 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 12, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Ignis Globus!",
        somaticText: "Hurl ball of flame",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "3d6 + intelligence",
        damageTypes: ["fire"],
        resolution: "DICE",
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
          critDiceOnly: false,
          critEffects: ["burning"],
          burningConfig: {
            damagePerRound: "1d6",
            duration: 2,
            durationUnit: "rounds",
            saveDC: 15,
            saveType: "constitution",
          },
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "aoe"],
    },

    { id: "pyro_burning_hands",
      name: "Burning Hands",
      description:
        "You spread your fingers wide and Scathrach exhales through your palms. A cone of demonic fire erupts, scorching everything in a 20-foot arc. Close-range devastation for when the enemy is too close — which is exactly when Scathrach is happiest.",
      level: 3,
      spellType: "ACTION",
      icon: "Fire/Flame Burst",

      typeConfig: {
        school: "fire",
        icon: "Fire/Flame Burst",
        tags: ["fire", "damage", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "cone",
        aoeParameters: { length: 20 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 10, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Manus Ardens!",
        somaticText: "Spread fingers wide",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "3d6 + intelligence",
        damageTypes: ["fire"],
        resolution: "DICE",
        chanceOnHitConfig: {
          enabled: true,
          procType: "dice",
          diceThreshold: 17,
          procChance: 20,
          customEffects: ["burning"],
          burningConfig: {
            damagePerRound: "1d4",
            duration: 2,
            durationUnit: "rounds",
            saveDC: 14,
            saveType: "constitution",
          },
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "aoe"],
    },

    { id: "pyro_flame_step",
      name: "Flame Step",
      description:
        "You step through a tear in reality — a wound carved by Scathrach's fire. You vanish in a burst of flame and reappear nearby, leaving fire at both points of departure and arrival. The teleport is not graceful. It is violent, disorienting, and leaves the smell of burnt air.",
      level: 3,
      spellType: "ACTION",
      icon: "Fire/Burning Ember",

      typeConfig: {
        school: "fire",
        icon: "Fire/Burning Ember",
        tags: ["fire", "utility", "teleport"],
        castTime: 0,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 12, inferno_ascend: 1, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 1, // Utility spell
        components: ["verbal"],
        verbalText: "Saltus Ignis!",
      },

      effectTypes: ["utility", "damage"],

      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "teleport",
            name: "Teleport",
            distance: 30,
            needsLineOfSight: true,
          },
        ],
        duration: 0,
        durationUnit: "instant",
        concentration: false,
        power: "minor",
      },

      damageConfig: {
        formula: "1d6",
        damageTypes: ["fire"],
        resolution: "AUTOMATIC",
      },

      propagation: {
        method: "explosion",
        behavior: "aoe",
        secondaryRadius: 5,
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2,
      },

      tags: ["fire", "utility", "teleport"],
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    { id: "pyro_infernal_blast",
      name: "Infernal Blast",
      description:
        "A concentrated blast of Scathrach's purest hatred erupts from your hands, searing through defenses and leaving nothing but ash. 5d6 + INT fire damage. At Inferno Level 4+, the corruption surges — dealing an additional 2d6 fire damage. The blast is not fire. It is annihilation wearing fire as a mask.",
      level: 4,
      spellType: "ACTION",
      icon: "Fire/Infernal Fire",

      typeConfig: {
        school: "fire",
        icon: "Fire/Infernal Fire",
        tags: ["fire", "damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 80,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 20, inferno_ascend: 2, inferno_required: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Infernus Ictus!",
        somaticText: "Thrust palm forward",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "5d6 + intelligence",
        damageTypes: ["fire"],
        resolution: "DICE",
      },

      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: true,
            baseFormula: "5d6 + intelligence",
            conditionalFormulas: {
              inferno_4_plus: "7d6 + intelligence",
              default: "5d6 + intelligence",
            },
          },
        },
        effectTriggers: {
          damage: {
            logicType: "OR",
            compoundTriggers: [
              { id : "resource_threshold",
                category: "health",
                name: "Inferno Level 4+",
                parameters: {
                  resource_type: "inferno",
                  threshold_value: 4,
                  threshold_type: "flat",
                  comparison: "greater_than",
                  perspective: "self",
                },
              },
            ],
          },
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage"],
    },

    { id: "pyro_searing_chains",
      name: "Searing Chains",
      description:
        "Conjure burning chains of Scathrach's binding — links of condensed hatred that lash between enemies, dealing 3d6 + INT fire damage and tethering them together. Each chain jump deals 75% damage but ignites all targets struck for 1d6 fire damage per round for 2 rounds. Chains leap to up to 3 additional targets within 15 feet. The chains do not merely burn — they bind. Scathrach was a warden before it was a flame.",
      level: 4,
      spellType: "ACTION",
      icon: "Fire/Scorching Rune",

      typeConfig: {
        school: "fire",
        icon: "Fire/Scorching Rune",
        tags: ["fire", "damage", "chain"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 16, inferno_ascend: 2, inferno_required: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Catena Infernus!",
        somaticText: "Whip arm forward, chains of fire erupt",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "3d6 + intelligence",
        damageTypes: ["fire"],
        resolution: "DICE",
        chainConfig: {
          enabled: true,
          maxChains: 3,
          chainRange: 15,
          damageMultiplier: 0.75,
          damageTypes: ["fire"],
        },
        dotConfig: {
          enabled: true,
          damagePerTick: "1d6",
          damageTypes: ["fire"],
          tickFrequency: "round",
          duration: 2,
          canStack: false,
          maxStacks: 1,
        },
      },

      propagation: {
        method: "chain",
        behavior: "bounce",
        count: 3,
        range: 15,
        decay: 0.75,
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1,
      },

      tags: ["fire", "damage", "chain"],
    },

    { id: "pyro_fiery_aura",
      name: "Fiery Aura",
      description:
        "You open the furnace door. An aura of Scathrach's contempt radiates outward, dealing 2d6 fire damage to any enemy foolish enough to stand within 5 feet. The aura persists for up to 3 rounds while you concentrate — a constant, pulsing reminder that you are not safe to be near.",
      level: 4,
      spellType: "CHANNELED",
      icon: "Fire/Fire Orb",

      typeConfig: {
        school: "fire",
        icon: "Fire/Fire Orb",
        tags: ["fire", "damage", "channeled"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
        maxChannelDuration: 3,
        durationUnit: "ROUNDS",
        interruptible: true,
        movementAllowed: true,
        tickFrequency: "START_OF_TURN",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 16, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Aura Ignis!",
        somaticText: "Spread arms wide",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d6",
        damageTypes: ["fire"],
        resolution: "DICE",
        triggerCondition: "area_entry",
        triggerDescription:
          "Enemies within 5 feet take 2d6 fire damage at the start of each of their turns",
        areaShape: "circle",
        areaParameters: { radius: 5 },
      },

      channelingConfig: {
        type: "persistent",
        baseFormula: "2d6",
        tickFrequency: "round",
        maxDuration: 3,
        durationUnit: "rounds",
        persistentEffectType: "aura",
        persistentRadius: 5,
        interruptible: true,
        movementAllowed: true,
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "channeled"],
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    { id: "pyro_hellfire_wave",
      name: "Hellfire Wave",
      description:
        "Scathrach opens its mouth through yours. A wave of hellish fire sweeps over everything in a 30-foot cone — 8d6 + INT fire damage. The wave is not a spell. It is the demon vomiting its rage through your body. Anything caught in the cone does not burn. It ceases.",
      level: 5,
      spellType: "ACTION",
      icon: "Fire/Fiery Symbol",

      typeConfig: {
        school: "fire",
        icon: "Fire/Fiery Symbol",
        tags: ["fire", "damage", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "cone",
        aoeParameters: { length: 30 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 20, inferno_ascend: 2, inferno_required: 2 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Infernus Unda!",
        somaticText: "Sweep arms forward",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "8d6 + intelligence",
        damageTypes: ["fire"],
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "aoe"],
    },

    { id: "pyro_immolation",
      name: "Immolation",
      description:
        "You designate a target for Scathrach's obsession. Flames engulf them — 6d8 + INT/2 fire damage immediately — and then the real cruelty begins. The fire does not stop. 1d6 + INT/4 fire damage per round for 3 rounds. The target screams. Scathrach hums contentedly. You try not to think about what that says about you.",
      level: 5,
      spellType: "ACTION",
      icon: "Fire/Enveloping Fire",

      typeConfig: {
        school: "fire",
        icon: "Fire/Enveloping Fire",
        tags: ["fire", "damage", "dot"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 20, inferno_ascend: 3, inferno_required: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Immolatio!",
        somaticText: "Clench fist",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "6d8 + intelligence/2",
        damageTypes: ["fire"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "1d6 + intelligence/4",
          damageTypes: ["fire"],
          tickFrequency: "round",
          duration: 3,
          canStack: false,
          maxStacks: 1,
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "dot"],
    },

    { id: "pyro_fire_whip",
      name: "Fire Whip",
      description:
        "A whip of condensed infernal fury — not fire, but the idea of fire made violent. It lashes out, dealing 7d6 + INT fire damage and potentially stunning the target as Scathrach's malice briefly overwhelms their nervous system. The whip is the demon's tongue. It tastes what it strikes.",
      level: 5,
      spellType: "ACTION",
      icon: "Fire/Sun Symbol",

      typeConfig: {
        school: "fire",
        icon: "Fire/Sun Symbol",
        tags: ["fire", "damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 18, inferno_ascend: 2, inferno_required: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Flagellum Infernus!",
        somaticText: "Crack whip motion",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "7d6 + intelligence",
        damageTypes: ["fire"],
        resolution: "DICE",
        chanceOnHitConfig: {
          enabled: true,
          procType: "dice",
          diceThreshold: 18,
          procChance: 15,
          customEffects: ["stun"],
          stunConfig: {
            duration: 1,
            durationUnit: "round",
            saveDC: 14,
            saveType: "constitution",
          },
        },
        savingThrow: {
          ability: "constitution",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2,
      },

      tags: ["fire", "damage"],
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    { id: "pyro_lava_burst",
      name: "Lava Burst",
      description:
        "You slam your fists down and Scathrach boils the earth itself. A 15-foot radius of molten lava erupts, dealing 9d6 + INT fire damage. The ground does not simply burn — it becomes a grave. At Inferno Level 7+, the corruption deepens the eruption to 16d6 + INT×2.",
      level: 6,
      spellType: "ACTION",
      icon: "Fire/Dripping Lava",

      typeConfig: {
        school: "fire",
        icon: "Fire/Dripping Lava",
        tags: ["fire", "damage", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 80,
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 24, inferno_ascend: 3, inferno_required: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic", "material"],
        verbalText: "Terra Ignea!",
        somaticText: "Slam fist downward",
        materialComponents: "A piece of volcanic rock",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "9d6 + intelligence",
        damageTypes: ["fire"],
        resolution: "DICE",
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
          critDiceOnly: false,
          critEffects: ["burning"],
          burningConfig: {
            damagePerRound: "1d6",
            duration: 2,
            durationUnit: "rounds",
            saveDC: 15,
            saveType: "constitution",
          },
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "aoe"],
    },

    { id: "pyro_flame_storm",
      name: "Flame Storm",
      description:
        "You raise your arms and Scathrach screams into the sky. A swirling storm of fire descends on a 20-foot radius, dealing 8d6 + INT fire damage immediately and 2d6 + INT/2 fire damage per round for 3 rounds. The storm is not natural. It is the demon's rage made manifest — a localized apocalypse that turns earth to ash and air to agony.",
      level: 6,
      spellType: "ACTION",
      icon: "Fire/Swirling Fireball",

      typeConfig: {
        school: "fire",
        icon: "Fire/Swirling Fireball",
        tags: ["fire", "damage", "aoe", "dot"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 100,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 24, inferno_ascend: 2, inferno_required: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Tempestas Ignis!",
        somaticText: "Raise arms and swirl",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "8d6 + intelligence",
        damageTypes: ["fire"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "2d6 + intelligence/2",
          damageTypes: ["fire"],
          tickFrequency: "round",
          duration: 3,
          canStack: false,
          maxStacks: 1,
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3,
      },

      tags: ["fire", "damage", "aoe", "dot"],
    },

    { id: "pyro_infernal_brand_advanced",
      name: "Infernal Brand (Advanced)",
      description:
        "You carve Scathrach's sigil into an enemy's flesh with a gesture. The brand sears into them — 4d6 + INT/3 fire damage immediately, then 2d6 + INT/2 fire per round for 4 rounds. The sigil does more than burn: it weakens, sapping the target's strength as Scathrach feeds on their vitality through the mark. They are branded. They are marked for the furnace.",
      level: 6,
      spellType: "ACTION",
      icon: "Fire/Fiery Symbol",

      typeConfig: {
        school: "fire",
        icon: "Fire/Fiery Symbol",
        tags: ["fire", "damage", "dot", "debuff"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 70,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 22, inferno_ascend: 2, inferno_required: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Sigillum Infernus!",
        somaticText: "Draw burning sigil",
      },

      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "4d6 + intelligence/3",
        damageTypes: ["fire"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "2d6 + intelligence/2",
          damageTypes: ["fire"],
          tickFrequency: "round",
          duration: 4,
          canStack: false,
          maxStacks: 1,
        },
      },

      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          { id : "weakened",
            name: "Weakened",
            description:
              "The target's physical power is diminished by the searing heat, making them weaker and less effective in combat. The infernal brand saps their strength as it burns.",
            mechanicsText: "",
            statModifier: {
              stat: "strength",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        canBeDispelled: true,
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "dot", "debuff"],
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    { id: "pyro_volcanic_eruption",
      name: "Volcanic Eruption",
      description:
        "You command the earth to open and Scathrach obliges with volcanic fury. A 25-foot radius eruption of magma and ash deals 12d6 + INT×2 fire damage (DC 16 Agility save for half). At Inferno Level 7+, the corruption deepens the caldera — 16d6 + INT×2. The ground becomes a crematorium. Bodies are not found. Only shapes in the slag.",
      level: 7,
      spellType: "ACTION",
      icon: "Fire/Flowing Lava",

      typeConfig: {
        school: "fire",
        icon: "Fire/Flowing Lava",
        tags: ["fire", "damage", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 90,
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 28, inferno_ascend: 3, inferno_required: 6 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic", "material"],
        verbalText: "Eruptio Volcanica!",
        somaticText: "Slam both hands down",
        materialComponents: "Volcanic ash",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "12d6 + intelligence * 2",
        damageTypes: ["fire"],
        resolution: "DICE",
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: "2d6",
          critEffects: ["burning", "knockback"],
          burningConfig: {
            damagePerRound: "2d6",
            duration: 3,
            durationUnit: "rounds",
            saveDC: 16,
            saveType: "constitution",
          },
          knockbackConfig: {
            distance: 10,
          },
        },
        savingThrow: {
          ability: "agility",
          difficultyClass: 16,
          saveOutcome: "half_damage",
        },
      },

      triggerConfig: {
        effectTriggers: {
          damage: {
            logicType: "OR",
            compoundTriggers: [
              { id : "resource_threshold",
                category: "health",
                name: "High Inferno Level",
                parameters: {
                  resource_type: "inferno",
                  threshold_type: "percentage",
                  percentage: 70,
                  comparison: "greater_than",
                  perspective: "self",
                },
              },
            ],
          },
        },
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: true,
            baseFormula: "12d6 + intelligence * 2",
            conditionalFormulas: {
              resource_threshold_70: "16d6 + intelligence * 2",
            },
          },
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2,
      },

      tags: ["fire", "damage", "aoe"],
    },

    { id: "pyro_hellfire_breath",
      name: "Hellfire Breath",
      description:
        "You inhale and Scathrach exhales through you. A 40-foot cone of hellfire pours from your throat — 10d6 + INT×2 fire damage. This is not a spell. This is regurgitation. The demon has been living in your chest and now it breathes. Anything caught in the cone does not catch fire. It was always on fire. It simply didn't know it until now.",
      level: 7,
      spellType: "ACTION",
      icon: "Fire/Flame Burst",

      typeConfig: {
        school: "fire",
        icon: "Fire/Flame Burst",
        tags: ["fire", "damage", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "cone",
        aoeParameters: { length: 40 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 26, inferno_ascend: 3, inferno_required: 5 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Halitus Infernus!",
        somaticText: "Inhale deeply and exhale",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "10d6 + intelligence * 2",
        damageTypes: ["fire"],
        resolution: "DICE",
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2.5,
          critDiceOnly: false,
          extraDice: "3d8",
          critEffects: ["burning"],
          burningConfig: {
            damagePerRound: "2d8",
            duration: 4,
            durationUnit: "rounds",
            saveDC: 17,
            saveType: "constitution",
          },
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3,
      },

      tags: ["fire", "damage", "aoe"],
    },

    { id: "pyro_demonic_empowerment",
      name: "Demonic Empowerment",
      description:
        "You open yourself fully to Scathrach's influence, allowing the demon to amplify your fire for 5 rounds. +5 fire damage on all fire-based attacks. As the channel deepens: enemies within 5 feet begin taking 1d6 fire (round 3), and your fire resistance doubles (round 5). This is borrowing power from the thing that is killing you. The interest rate is your soul.",
      level: 7,
      spellType: "CHANNELED",
      icon: "Utility/Powerful Warrior",

      typeConfig: {
        school: "fire",
        icon: "Utility/Powerful Warrior",
        tags: ["fire", "buff"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 24, inferno_ascend: 2, inferno_required: 5 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Potentia Daemonis!",
        somaticText: "Clench fists and channel",
      },

      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "fireDamageBoost",
            name: "Fire Damage Boost",
            description:
              "Fire damage increased by +5 for 5 rounds. All fire-based attacks deal additional damage as demonic power flows through your spells and abilities.",
            mechanicsText: "",
            statModifier: {
              stat: "fire_spell_power",
              magnitude: 5,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      channelingConfig: {
        type: "power_up",
        maxDuration: 5,
        durationUnit: "rounds",
        interruptible: true,
        movementAllowed: false,
        stages: [
          {
            threshold: 1,
            effect: "+5 Fire Damage",
            description: "Demonic empowerment active",
          },
          {
            threshold: 3,
            effect: "+5 Fire Damage + Burning Aura",
            description:
              "Demonic power intensifies — enemies within 5 ft take 1d6 fire",
          },
          {
            threshold: 5,
            effect: "+5 Fire Damage + Burning Aura + Inferno Resistance",
            description:
              "Full demonic empowerment — fire damage taken reduced by 50%",
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 5,
      },

      tags: ["fire", "buff"],
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    { id: "pyro_meteor_shower",
      name: "Meteor Shower",
      description:
        "You reach into Scathrach's furnace and pull down the sky. A shower of flaming meteors descends on a 30-foot radius, dealing 14d6 + INT×2 fire damage with explosive force. The ground craters. The air ignites. This is not a spell — it is a natural disaster with your body as the epicenter.",
      level: 8,
      spellType: "ACTION",
      icon: "Fire/Fiery Comet",

      typeConfig: {
        school: "fire",
        icon: "Fire/Fiery Comet",
        tags: ["fire", "damage", "aoe"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 150,
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 32, inferno_ascend: 3, inferno_required: 7 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Meteorus Infernus!",
        somaticText: "Raise arms to the sky",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "14d6 + intelligence * 2",
        damageTypes: ["fire"],
        resolution: "DICE",
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: "4d6",
          critEffects: ["burning", "knockback"],
          burningConfig: {
            damagePerRound: "3d6",
            duration: 3,
            durationUnit: "rounds",
            saveDC: 18,
            saveType: "constitution",
          },
          knockbackConfig: {
            distance: 15,
          },
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4,
      },

      tags: ["fire", "damage", "aoe"],
    },

    { id: "pyro_infernal_nova",
      name: "Infernal Nova",
      description:
        "You detonate. Not metaphorically — you become the explosion. A massive sphere of infernal fire expands outward in all directions, dealing 14d6 + INT×2 fire damage to everything within 35 feet. Scathrach laughs. You scream. The distinction between the two sounds becomes academic. This is the nuclear option. Everything burns, including you.",
      level: 8,
      spellType: "ACTION",
      icon: "Fire/Swirling Fireball",

      typeConfig: {
        school: "fire",
        icon: "Fire/Swirling Fireball",
        tags: ["fire", "damage", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 35 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 30, inferno_ascend: 3, inferno_required: 8 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Nova Infernus!",
        somaticText: "Spread arms wide and explode",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "14d6 + intelligence * 2",
        damageTypes: ["fire"],
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 5,
      },

      tags: ["fire", "damage", "aoe"],
    },

    { id: "pyro_phoenix_flame",
      name: "Phoenix Flame",
      description:
        "You summon the ghost of a phoenix — or perhaps Scathrach merely allows you to believe that. A 25-foot radius detonation deals 12d6 + INT×2 fire damage, then the ground itself catches fire: 3d6 + INT/2 fire damage per round for 4 rounds. The flames do not die. They persist, feeding on the corruption you've seeded into the earth. This is a funeral pyre. The question is whose.",
      level: 8,
      spellType: "ACTION",
      icon: "Fire/Rising Inferno",

      typeConfig: {
        school: "fire",
        icon: "Fire/Rising Inferno",
        tags: ["fire", "damage", "aoe", "dot"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 120,
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 32, inferno_ascend: 3, inferno_required: 8 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Flamma Phoenix!",
        somaticText: "Summon phoenix gesture",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "12d6 + intelligence * 2",
        damageTypes: ["fire"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "3d6 + intelligence/2",
          damageTypes: ["fire"],
          tickFrequency: "round",
          duration: 4,
          canStack: false,
          maxStacks: 1,
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 6,
      },

      tags: ["fire", "damage", "aoe", "dot"],
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    { id: "pyro_infernal_avatar",
      name: "Infernal Avatar",
      description:
        "You stop being human and start being a furnace. For 10 rounds, you become an Infernal Avatar — a being of pure demonic fire, wreathed in Scathrach's essence. +5 fire spell power, +3 Armor, fire immunity, and a burning aura (2d6 fire to enemies within 10 feet). Your skin is gone. Your voice is gone. Only the fire remains. When it ends, you will feel every second of what you've become.",
      level: 9,
      spellType: "CHANNELED",
      icon: "Fire/Fire Demon",

      typeConfig: {
        school: "fire",
        icon: "Fire/Fire Demon",
        tags: ["fire", "transformation"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 36, inferno_ascend: 3, inferno_required: 7 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Ego Sum Ignis!",
        somaticText: "Spread arms wide",
      },

      effectTypes: ["transformation"],

      transformationConfig: {
        customName: "Infernal Avatar",
        transformType: "elemental",
        formName: "Fire Elemental Avatar",
        formDescription:
          "You become a being of pure demonic fire, wreathed in flames and radiating intense heat.",
        durationValue: 10,
        durationType: "rounds",
        concentrationRequired: true,
        statModifiers: [
          { stat: "fire_spell_power", magnitude: 5, magnitudeType: "flat" },
          { stat: "armor", magnitude: 3, magnitudeType: "flat" },
        ],
        resistances: [{ damageType: "fire", resistanceType: "immunity" }],
        specialAbilities: [
          {
            name: "Burning Aura",
            description:
              "Enemies within 10 feet take 2d6 fire damage at the start of their turn",
          },
        ],
      },

      channelingConfig: {
        type: "persistent",
        maxDuration: 10,
        durationUnit: "rounds",
        interruptible: true,
        movementAllowed: true,
        persistentEffectType: "aura",
        persistentRadius: 10,
        baseFormula: "2d6",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 10,
      },

      tags: ["fire", "transformation"],
    },

    { id: "pyro_apocalypse",
      name: "Apocalypse",
      description:
        "Scathrach's grandest gift and cruelest joke. A cataclysmic explosion deals 16d10 + INT×2 fire damage in a 40-foot radius. At maximum Inferno Level, damage dice explode on max rolls — the demon's fury is infinite, and it chooses to share. This is the end of something. Possibly the enemy. Possibly you. The blast radius is a grave. The silence afterward is Scathrach's applause.",
      level: 9,
      spellType: "ACTION",
      icon: "Utility/Explosive Detonation",

      typeConfig: {
        school: "fire",
        icon: "Utility/Explosive Detonation",
        tags: ["fire", "damage", "aoe"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 200,
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 36, inferno_ascend: 3, inferno_required: 9 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Apocalypsis!",
        somaticText: "Raise arms and channel all power",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "16d10 + intelligence * 2",
        damageTypes: ["fire"],
        resolution: "DICE",
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
          critDiceOnly: false,
          explodingDice: true,
          explodingDiceType: "reroll_add",
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 10,
      },

      tags: ["fire", "damage", "aoe"],
    },

    { id: "pyro_hellfire_ritual",
      name: "Hellfire Ritual",
      description:
        "You perform a ritual of invocation — not to summon Scathrach, but to open the floodgates wider. For 3 rounds, your fire damage surges by +10. The demon does not grant this power freely; it uses the ritual to deepen its hold. By round 3, your Inferno Level bonuses are doubled. This is borrowing against your own annihilation.",
      level: 9,
      spellType: "CHANNELED",
      icon: "Radiant/Radiant Divinity",

      typeConfig: {
        school: "fire",
        icon: "Radiant/Radiant Divinity",
        tags: ["fire", "buff"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 34, inferno_ascend: 3, inferno_required: 0 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic", "material"],
        verbalText: "Ritualis Infernus!",
        somaticText: "Perform ritual gestures",
        materialComponents: "Demonic essence",
      },

      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "massiveFireBoost",
            name: "Massive Fire Boost",
            description:
              "+10 Fire Spell Power for 3 rounds. A ritual of infernal power dramatically surges through your fire magic.",
            mechanicsText: "",
            statModifier: {
              stat: "fire_spell_power",
              magnitude: 10,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: true,
      },

      channelingConfig: {
        type: "power_up",
        maxDuration: 3,
        durationUnit: "rounds",
        interruptible: true,
        movementAllowed: false,
        stages: [
          {
            threshold: 1,
            effect: "+10 Fire Spell Power",
            description: "Infernal ritual begins — fire magic surges",
          },
          {
            threshold: 2,
            effect: "+10 Fire Spell Power + Burning Aura",
            description:
              "Demonic flames radiate outward — enemies within 10 ft take 2d6 fire per round",
          },
          {
            threshold: 3,
            effect:
              "+10 Fire Spell Power + Burning Aura + Inferno Amplification",
            description:
              "Ritual climax — all inferno level bonuses doubled for the final round",
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 12,
      },

      tags: ["fire", "buff"],
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    { id: "pyro_brimstone_teleport",
      name: "Brimstone Teleport",
      description:
        "You tear a wound in reality and step through Scathrach's furnace, reappearing up to 60 feet away in a burst of hellfire that deals 6d6 + INT×2 fire damage to everything within 10 feet of your arrival. The teleport is not travel — it is passing through the demon's maw. You are digested and reborn in fire. The destination does not thank you.",
      level: 10,
      spellType: "ACTION",
      icon: "Fire/Burning Ember",

      typeConfig: {
        school: "fire",
        icon: "Fire/Burning Ember",
        tags: ["fire", "utility", "teleport", "damage"],
        castTime: 0,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 30, inferno_ascend: 1, inferno_required: 8 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal"],
        verbalText: "Teleportatio Infernus!",
      },

      effectTypes: ["utility", "damage"],

      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "brimstone_teleport",
            name: "Brimstone Teleport",
            description:
              "Teleport up to 60 feet through hellfire, appearing in a burst of flames.",
            mechanicsText: "",
            duration: 0,
            durationUnit: "instant",
            concentration: false,
            power: "major",
          },
        ],
      },

      damageConfig: {
        formula: "6d6 + intelligence * 2",
        damageTypes: ["fire"],
        resolution: "DICE",
      },

      propagation: {
        method: "explosion",
        behavior: "aoe",
        secondaryRadius: 10,
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3,
      },

      tags: ["fire", "utility", "teleport", "damage"],
    },

    { id: "pyro_demonic_ascension",
      name: "Demonic Ascension",
      description:
        "You surrender completely. Demonic Ascension is the final act of the Damned Conduit — transforming into a true demon of fire with overwhelming power. +15 fire damage to all spells, +5 Armor, fire immunity, flight (30 ft), and enemies within 15 feet take 3d6 fire at the start of their turn. **WARNING:** This spell requires Inferno Level 9. The death clock does NOT pause while transformed — you must still descend below Level 9 within 3 of your turns or Scathrach claims you. Permanently. This is not a power-up. It is a eulogy you perform while still alive.",
      level: 10,
      spellType: "ACTION",
      icon: "Fire/Fire Demon",

      typeConfig: {
        school: "fire",
        icon: "Fire/Fire Demon",
        tags: ["fire", "buff", "transformation"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 40, inferno_ascend: 3, inferno_required: 9 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Ascensio Daemonis!",
        somaticText: "Channel ultimate power",
      },

      effectTypes: ["buff", "damage"],

      buffConfig: {
        buffType: "custom",
        effects: [
          { id : "demonicAscension_power",
            name: "Demonic Ascension",
            description:
              "+15 fire damage to all spells, +5 Armor, fire damage immunity, flight (30 ft), and enemies within 15 feet take 3d6 fire damage at start of their turn. Requires Inferno Level 9. Death clock still ticks.",
            mechanicsText: "",
          },
          { id : "demonicAscension_armor",
            name: "Demonic Armor",
            description: "+5 Armor from demonic carapace",
            mechanicsText: "",
            statModifier: {
              stat: "armor",
              magnitude: 5,
              magnitudeType: "flat",
            },
          },
          { id : "demonicAscension_fire",
            name: "Fire Mastery",
            description: "+15 fire spell power",
            mechanicsText: "",
            statModifier: {
              stat: "fire_spell_power",
              magnitude: 15,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: false,
      },

      damageConfig: {
        formula: "3d6",
        damageTypes: ["fire"],
        resolution: "AUTOMATIC",
      },

      propagation: {
        method: "explosion",
        behavior: "aoe",
        secondaryRadius: 15,
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 15,
      },

      tags: ["fire", "buff", "transformation"],
    },

    { id: "pyro_inferno_mastery",
      name: "Inferno Mastery",
      description:
        "The ultimate expression of Scathrach's hunger made manifest through your ruined body. A cataclysmic inferno consumes a 50-foot radius, dealing 20d10 + INT×2 fire damage. At Inferno Level 7+, it deepens to 22d10. At Level 9, 25d10 + INT×3. This is not a spell. This is what happens when the demon stops pretending you're in control. The world burns. You burn. The distinction is meaningless.",
      level: 10,
      spellType: "ACTION",
      icon: "Fire/Fire Orb",

      typeConfig: {
        school: "fire",
        icon: "Fire/Fire Orb",
        tags: ["fire", "damage", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 200,
        aoeShape: "circle",
        aoeParameters: { radius: 50 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
        resourceValues: { mana: 40, inferno_ascend: 3, inferno_required: 9 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Dominatio Infernus!",
        somaticText: "Command all fire",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "20d10 + intelligence * 2",
        damageTypes: ["fire"],
        resolution: "DICE",
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2.5,
          critDiceOnly: false,
          extraDice: "6d10",
          explodingDice: true,
          explodingDiceType: "reroll_add",
        },
      },

      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: true,
            baseFormula: "20d10 + intelligence * 2",
            conditionalFormulas: {
              inferno_9: "25d10 + intelligence * 3",
              inferno_7_plus: "22d10 + intelligence * 2",
              default: "20d10 + intelligence * 2",
            },
          },
        },
        effectTriggers: {
          damage: {
            logicType: "OR",
            compoundTriggers: [
              { id : "resource_threshold",
                category: "health",
                name: "High Inferno Level",
                parameters: {
                  resource_type: "inferno",
                  threshold_value: 7,
                  threshold_type: "flat",
                  comparison: "greater_than",
                  perspective: "self",
                },
              },
            ],
          },
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 12,
      },

      tags: ["fire", "damage", "aoe"],
    },
    // ===== PASSIVE ABILITIES =====
    { id: "pyrofiend_burnout",
      name: "Burnout",
      description:
        "When no fire burns — no ignited targets, no active Inferno Level, no fire auras — Scathrach's furnace sputters. You suffer -2 to all spell attack rolls and your fire spells deal -1d6 damage. The demon's contempt for inaction is physical: your power dims, your flames weaken. Cast something. Set something ablaze. The fire must burn or you burn out. This penalty lifts the moment any fire spell deals damage.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Fire/Flame Shield",
      effectTypes: ["passive"],
      typeConfig: {
        school: "fire",
        icon: "Fire/Flame Shield",
        tags: ["passive", "pyrofiend", "weakness"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "pyrofiend", "weakness"],
    },
    { id: "pyrofiend_fire_dependency",
      name: "Fire Dependency",
      description:
        "Your body runs at a temperature that makes cold damage catastrophically lethal. You take +50% damage from all cold and frost attacks (rounded up). Additionally, any cold damage received forces your Inferno Veil to ascend by +1 — Scathrach's furnace burns hotter to compensate for internal crystallization, turning frost into fuel for your corruption. If submerged in water or affected by a cold environment, your Inferno Level decreases by 2 per round instead of the normal descent rate. Water is not uncomfortable. It is antithetical to your existence. Frost does not soothe the furnace — it enrages the demon.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Frost/Icy Shield",
      effectTypes: ["passive"],
      typeConfig: {
        school: "fire",
        icon: "Frost/Icy Shield",
        tags: ["passive", "pyrofiend", "weakness"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "pyrofiend", "weakness"],
    },
    { id: "pyrofiend_heat_signature",
      name: "Heat Signature",
      description:
        "Your body radiates Scathrach's heat at all times. You cannot benefit from Stealth or invisibility — the thermal glow gives you away like a bonfire in a dark room. Enemies have advantage on Perception checks to detect you within 60 feet. Ice-based terrain melts within 10 feet of you. Water terrain deals you 1d6 damage per round of immersion. You are never hidden. You are never cold. You are never safe.",
      level: 3,
      spellType: "PASSIVE",
      icon: "Fire/Eruption",
      effectTypes: ["passive"],
      typeConfig: {
        school: "fire",
        icon: "Fire/Eruption",
        tags: ["passive", "pyrofiend", "weakness"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "pyrofiend", "weakness"],
    },
  ],
};
