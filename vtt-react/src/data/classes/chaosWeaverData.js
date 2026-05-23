/**
 * Chaos Weaver Class Data
 *
 * Surgically overhauled class definition for the Chaos Weaver.
 * Adheres strictly to the Mythrill VTT SPELL_DATA_REFERENCE.md.
 *
 * Establishes a dark, oppressive, blackened thall / symphonic deathcore folklore aesthetic.
 * Magic here is not a clean academic tool; it is a violent, dimension-bending shear of reality.
 *
 * Mechanically:
 * 1. Fully maps the non-spendable passive Mayhem gauge (0-100) across 4 strict tiers.
 * 2. Implements the complete d100 Master Wild Surge Table at 100 Mayhem (30/30/20/20% split).
 * 3. Injects high-pressure operational friction (misfires at 50+ Mayhem, gravity/molecular instability at 80+).
 * 4. Eliminates D&D skill checks and 5e terminology (AC -> Armor, Dexterity -> Agility, Spell Slots -> Mana/AP).
 * 5. Embeds all magic schools inside typeConfig.school.
 * 6. Fixes single-element damageType strings into array representation.
 */

export const CHAOS_WEAVER_DATA = {
  id : "chaos-weaver",
  name: "Chaos Weaver",
  icon: "fas fa-dice",
  role: "Entropic Vector / Timeline Fracturer",
  damageTypes: [
    "force",
    "necrotic",
    "chaos",
    "fire",
    "frost",
    "lightning",
    "poison",
    "psychic",
    "radiant"
  ],

  // 1. Lore & Systems Header
  overview: {
    title: "The Chaos Weaver",
    subtitle: "A Walking Fracture in the Tapestry of Time and Space",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Must Know**: The Chaos Weaver is not an academic of the arcane. They are a living, weeping tear in the fabric of existence. They draw power from the friction of collapsing timelines, channeled through their own physical vessel. Their magic builds a passive, non-spendable pressure gauge called **Mayhem**. Mayhem cannot be spent; it scales exclusively upward with every cast, amplifying the size, damage, and area of their spells, until it forces a catastrophic, unavoidable **d100 Master Wild Surge**.
      
**Core Mechanic**: Cast spells → Build Mayhem passively (0–100) → Scale spell amplification tiers → Suffer operational friction (self-misfires at 50+, molecular density decay at 80+) → Trigger an inevitable d100 Wild Surge at 100 → Suffer **Anomalous Dissociation** (absolute physical vulnerability) as Mayhem resets.

**Resource**: Mayhem (0–100 non-spendable pressure gauge).

**Playstyle**: A high-tension, high-amplitude caster who becomes increasingly volatile, destructive, and physically fragile the longer combat drags on.

**Best For**: Players who want to play a ticking time bomb, balancing catastrophic spell amplification against their own physical annihilation.`
    },

    description: `To look upon a Chaos Weaver is to watch reality struggle to maintain its grip. Shadows around them rip free and tear in the wind; their skin occasionally flickers out of phase, weeping the echoes of dead and deleted timelines. They do not cast spells so much as they invite local molecular collapse. This power is a turbulent stream that strains the caster's dimensional anchor. Every time they channel the entropic wind, their molecular coherence wavers, and their body resonates with the high-pitched shriek of folding dimensions.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Chaos Weavers are tragic outcasts, marked by the atmospheric terror of their magic. Their bodies bear the scars of reality's backlash: hair that drifts as if underwater, eyes that reflect starry voids, and skin that is cold to the touch. 

Common Chaos Weaver archetypes include:
- **The Entropic Vector**: A fatalistic scholar who accepts that the universe must dissolve, acting as a willing conduit for its decay.
- **The Spatial Weaver**: Focuses on the tearing and folding of physical space, stepping through dimensional seams while leaving craters in their wake.
- **The Timeline Fracturer**: Haunted by visions of what could have been, they rip threads from parallel timelines, splicing them violently into the present.
- **The Void Echo**: A survivor of a partial planar deletion, half-dissolved, struggling to keep their molecular weight anchored to the soil.

They carry a deep, copper-smelling atmospheric weight. To allies, they are a terrifying shield; to enemies, they are the harbinger of a localized apocalypse.`
    },

    combatRole: {
      title: "Combat Role",
      content: `In battle, the Chaos Weaver is a volatile, high-impact force:

**The Unstable Catalyst ('Why Bring Me?')**: You offer unmatched, non-linear timeline acceleration and catastrophic area-of-effect amplification that scales automatically the longer combat drags out. As your Mayhem climbs, your spells swell with massive bonus damage dice, expanded radii, and multi-targeting capabilities.

**The Fatal Flaw ('Anomalous Dissociation')**: At 100 Mayhem pressure, your physical form undergoes traumatic displacement. Your molecular density drops to zero, triggering a Wild Surge and leaving you 100% vulnerable to raw kinetic Bludgeoning and martial Slashing force. If a martial enemy catches you in this high-pressure state, your fragile molecular form will fail to resist their momentum.`
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Chaos Weaver demands a cold embrace of inevitable catastrophe. You cannot 'dump' Mayhem to play it safe; your only path is forward.

**The Volatility Curve**: In the Safe Zone (0–40 Mayhem), your spells are standard. In the Escalating Zone (41–60 Mayhem), your spells begin to burn hotter. Once you breach the Volatile and Maximum Zones (61–99 Mayhem), your damage is apocalyptic, but you are thinned: spells have a 25% chance to misfire into your own vitals, and your molecular density decays, making martial strikes against you lethal.

**Surge Juggling**: You must time your casts so that the unavoidable d100 Master Wild Surge triggers when you are positioned safely behind armored allies, or use defensive magic like Reality Flicker to endure the immediate physical backlash of planar displacement.`
    },

    immersiveCombatExample: {
      title: "Combat Example: The Ticking Core",
      content: `**The Setup**: You are locked in a stone crypt against a towering Death Knight and three skeletal archers. Your Mayhem is at 78 (Volatile Zone). You are weeping starlight, your left arm flickering out of phase.

**Turn 1 - High-Pressure Casting (Mayhem: 78 -> 84)**
*You raise your hands, your form flickering with spatial micro-fractures as you draw on the timeline's decay. You cast chaotic force at the archers.*
* **Your Action**: Cast "Chaotic Bolt" (1 AP, 6 mana).
* **The Amplification**: Because you are at 78 Mayhem, the spell gains +2 bonus damage dice and +5ft blast radius.
* **The Misfire Check**: You roll a d100 for operational friction (25% chance to misfire). You roll a 42. You bypass the misfire!
* **The Strike**: You roll a 12 on the bolt table (Reality Nova). It deals 5d6 force damage (3d6 base + 2d6 Mayhem bonus) in a 15ft radius (10ft base + 5ft Mayhem bonus). The archers are vaporized into ash.
* **The Cost**: Your Mayhem builds by 6, pushing you to 84 (Maximum Zone). Your limbs begin to float, and gravity bends around your chest.

**Turn 2 - The Critical Slip (Mayhem: 84 -> 100)**
*The Death Knight charges, claymore raised. You panic and channel raw timeline recursion to warp the earth beneath him.*
* **Your Action**: Cast "Fractured Realms" (1 AP, 8 mana).
* **The Misfire Check**: You roll a 14 (misfire!). The spell backfires.
* **The Body Horror**: Your own spell collapses inward. You take 2d6 force damage (7 damage) as intense dimensional friction strains your frame, but the magic still tears the earth around the Death Knight, dealing 5d8 force damage.
* **The Surge**: The cast pushes your Mayhem to 100. Reality snaps.
* **The d100 Surge**: You roll a 88 on the d100 Master Wild Surge Table: *Molecular Dissociation*.
* **The Backlash**: You take 2d10 necrotic damage (12 damage) and gain **Anomalous Dissociation** for 2 rounds—reducing your molecular weight to zero, rendering you 100% vulnerable to bludgeoning and slashing damage.
* **The Reset**: Your Mayhem resets to 0, leaving you gasping, bleeding, and desperately trying to crawl behind the fighter's shield before the Death Knight's claymore cuts you in half.

**The Lesson**: The power is absolute, but the meat is fragile. You cleared the room, but you are one sword swing away from deletion.`
    }
  },

  // 2. Quantified Passive Mayhem Progression & d100 Surge Infrastructure
  resourceSystem: {
    title: "The Mayhem Gauge",
    subtitle: "Non-Spendable Entropic Pressure",
    description: `Mayhem measures the build-up of spatial and temporal friction inside the Chaos Weaver's physical body. It is a one-way gauge that scales exclusively upward through spellcasting. It cannot be spent or used as currency. Instead, it passively amplifies all spellcasting across four strict thresholds, while exposing the caster's body to severe structural decay and operational friction.`,
    
    cards: [
      {
        title: "Safe Zone (0–40 Mayhem)",
        stats: "Tier I: Base Power",
        details: "Your physical form remains anchored. Spellcasting is stable. No amplification bonuses are active, and no operational friction is imposed."
      },
      {
        title: "Escalating Zone (41–60 Mayhem)",
        stats: "Tier II: Incipient Friction",
        details: "All spells gain **+1 bonus damage/healing die** of the spell's damage type. Magic begins to shear your physical matrix: all casts have a **10% chance to misfire**, dealing 2d6 force damage directly to your HP."
      },
      {
        title: "Volatile Zone (61–80 Mayhem)",
        stats: "Tier III: Planar Thinning",
        details: "All spells gain **+2 bonus damage/healing dice**, and area-of-effect spells have their **radii expanded by +5 feet**. Casts have a **25% chance to misfire** (2d6 force damage), and your unstable molecular density gains **25% physical bludgeoning/slashing vulnerability**."
      },
      {
        title: "Maximum Zone (81–99 Mayhem)",
        stats: "Tier IV: Redline",
        details: "All spells gain **+3 bonus damage/healing dice**, area-of-effect spells gain **+10 feet radius**, and single-target spells **target 1 additional adjacent creature** within 10 feet. Casts have a **25% chance to misfire** (2d6 force damage), and you suffer **50% physical bludgeoning/slashing vulnerability**."
      }
    ],

    generationTable: {
      headers: ["Action/Trigger", "Mayhem Gain", "Mechanical Parameters"],
      rows: [
        ["Cast Level 1 Spell", "+2 Mayhem", "Friction from minor spell structures"],
        ["Cast Level 2-3 Spell", "+4 Mayhem", "Friction from spatial folds"],
        ["Cast Level 4-6 Spell", "+6 Mayhem", "Friction from timeline splicing"],
        ["Cast Level 7-9 Spell", "+8 Mayhem", "Friction from planar tearing"],
        ["Cast Level 10 Spell", "+10 Mayhem", "Friction from absolute entropic collapse"],
        ["Roll a Natural 1 or 20", "+2 Mayhem", "Chaos Attunement: Reality ripples on critical failures and successes"],
        ["Trigger a Wild Surge", "Resets to 0", "The pressure gauge vents violently at 100 Mayhem, triggering the d100 Master Surge and imposing Anomalous Dissociation"]
      ]
    },

    usage: {
      momentum: "Ride the redline. Your spells are at their absolute most devastating when you are between 81 and 99 Mayhem, but a single cast will push you over the edge into a Surge, resetting your power and leaving you fragile. Learn to hover in the high 80s to maximize your area devastation.",
      flourish: "⚠️ Operational Warning: Misfires bypass all Armor and resistances. They represent your own spell structure collapsing inward and shearing your molecular bonds. Heal frequently or pay the price."
    },

    overheatRules: {
      title: "The d100 Master Wild Surge Table",
      content: `When Mayhem reaches 100, the pressure gauge vents violently. The local timeline fractures completely. The Chaos Weaver instantly triggers a **d100 Master Wild Surge** and suffers **Anomalous Dissociation** (molecular density falls to zero, imposing 100% vulnerability to physical bludgeoning and slashing damage for 2 rounds).

The Master Wild Surge table is structured across four absolute thematic categories:
1. **Unstable Miracles (30% Chance, Rolls 1–30)**: Time loops, localized gravity shields, and beneficial reality warping that repairs and protects allies.
2. **Radical Area Ruin (30% Chance, Rolls 31–60)**: Atmospheric rifts, gravitational collapses, and explosive spatial distortions that devastate the environment.
3. **Reality Reversals (20% Chance, Rolls 61–80)**: Probability inversions (hits become misses, misses become crits) and chaotic spatial swaps that scramble combatants' positions.
4. **Devastating Physical Backlashes (20% Chance, Rolls 81–100)**: Direct tissue dissociation, temporal hemorrhages, and permanent mana capacity depletion as the Weaver's physical form dissolves into the void.`
    }
  },

  // 3. Specializations (Scrubbed and renamed 'The Gambler' -> 'Chaos Dice')
  specializations: {
    title: "Chaos Weaver Specializations",
    subtitle: "Four Paths of Spatial Distortion",
    description: "Every Chaos Weaver aligns their collapsing vessel with one of four paths, altering how they weld the entropic wind and steer their inevitable surge.",
    
    specs: [
      { id : "reality_bending",
        name: "Reality Bending",
        icon: "Arcane/Conjure Elements",
        color: "#9B59B6",
        theme: "Spatial Manipulation",
        description: "Reality Benders focus on the physical seams of space. They excel at folding distances, swapping combatants, and creating gravity anomalies. Their chaos is tactical and environmental.",
        playstyle: "Tactical positioning, terrain alteration, spatial manipulation, moderate survivability.",
        strengths: [
          "Can spend 3 Mayhem to choose exact teleport locations instead of random directions",
          "+2 Mayhem when casting space-altering or teleportation spells",
          "Can phase allies through solid objects"
        ],
        weaknesses: [
          "Lower raw damage output",
          "Highly reliant on tactical battlefield positioning",
          "Ineffective in empty, open fields"
        ]
      },
      { id : "wild_magic",
        name: "Wild Magic",
        icon: "Nature/Nature Wild 1",
        color: "#E74C3C",
        theme: "Pure Chaos & Surges",
        description: "Wild Mages abandon all attempts at control, diving headfirst into planar instability. They seek to trigger surges as often as possible, weaponizing the backlashes against their enemies.",
        playstyle: "Maximum volatility, extreme damage potential, high friendly fire risk.",
        strengths: [
          "Mayhem increases by an additional +2 whenever a Surge occurs",
          "Surge effects deal double damage to enemies",
          "Can force a Surge roll at will by sacrificing 15% HP"
        ],
        weaknesses: [
          "Highest self-damage and team-harm risk in the game",
          "Zero predictability or tactical control",
          "Extremely short life expectancy"
        ]
      },
      { id : "entropy_control",
        name: "Entropy Control",
        icon: "Utility/All Seeing Eye",
        color: "#2C3E50",
        theme: "Decay and Dissolution",
        description: "Entropy Controllers weld the force of raw decay. They dissolve armor, shear kinetic structures, and cause their targets' molecular bonds to dissolve. Their chaos is focused and highly destructive.",
        playstyle: "Sustained damage, armor shredding, damage-over-time debuffs.",
        strengths: [
          "Chaos damage ignores 25% of enemy Armor",
          "Inflicting rot on enemies reduces their Armor by 1 (stacking up to 5)",
          "Gain +3 Mayhem when an enemy reaches maximum decay stacks"
        ],
        weaknesses: [
          "Fewer spatial movement options",
          "Limited defensive utility",
          "Requires multiple turns to ramp up damage"
        ]
      },
      { id : "chaos_dice",
        name: "Chaos Dice",
        icon: "fas fa-dice",
        color: "#F39C12",
        theme: "Table Manipulation & Entropic Risk",
        description: "Chaos Dice specialists (formerly known as The Entropic Vectors) treat reality as a rollable table. They manipulate the probabilities of chaotic effects, shifting poor rolls into catastrophic outcomes.",
        playstyle: "Table-rolling amplification, outcome steering, high-risk modifiers.",
        strengths: [
          "Minimum rollable table results are increased by +1 per 5 Mayhem (rounded down)",
          "Rolling a natural maximum on any spell table generates +2 Mayhem",
          "Can roll twice on spell tables and choose the preferred outcome"
        ],
        weaknesses: [
          "Completely reliant on the Mayhem gauge to manipulate tables",
          "High mana costs for table-splicing spells",
          "Highly vulnerable when caught at 0 Mayhem"
        ]
      }
    ]
  },

  spellPools: {
    1: [
      "chaos_weaver-chaos_dice-chaos_bolt",
      "chaos_weaver-reality_bending-reality_flicker",
      "chaos_weaver-entropy_control-entropic_touch",
      "chaos_weaver-shared-chaotic_infusion",
      "chaos_weaver-wild_magic-wild_surge"
    ],
    2: [
      "chaos_weaver-chaos_dice-chaos_bolt",
      "chaos_weaver-reality_bending-reality_flicker",
      "chaos_weaver-entropy_control-entropic_touch",
      "chaos_weaver-shared-chaotic_infusion",
      "chaos_weaver-wild_magic-wild_surge",
      "chaos_weaver-chaos_dice-chaotic_bolt",
      "chaos_weaver-reality_bending-dimensional_rift",
      "chaos_weaver-entropy_control-chaotic_decay"
    ],
    3: [
      "chaos_weaver-chaos_dice-prismatic_chaos",
      "chaos_weaver-reality_bending-fractured_realms",
      "chaos_weaver-entropy_control-chaos_burst"
    ],
    4: [
      "chaos_weaver-reality_bending-reality_swap",
      "chaos_weaver-entropy_control-chaos_wave",
      "chaos_weaver-chaos_dice-chaos_storm"
    ],
    5: [
      "chaos_weaver-entropy_control-discordant_strike",
      "chaos_weaver-wild_magic-pandemonic_pulse",
      "chaos_weaver-reality_bending-chaotic_reflection",
      "chaos_weaver-wild_magic-chaos_engine"
    ],
    6: [
      "chaos_weaver-reality_bending-reality_storm",
      "chaos_weaver-wild_magic-chaotic_eruption",
      "chaos_weaver-entropy_control-decay_cascade",
      "chaos_weaver-reality_bending-chaos_gate"
    ],
    7: [
      "chaos_weaver-wild_magic-chaos_nova",
      "chaos_weaver-chaos_dice-ultimate_chaos"
    ],
    8: [
      "chaos_weaver-entropy_control-entropy_plague",
      "chaos_weaver-wild_magic-chaos_cascade",
      "chaos_weaver-reality_bending-chaos_conduit"
    ],
    9: [
      "chaos_weaver-reality_bending-chaos_avatar",
      "chaos_weaver-entropy_control-entropy_wave"
    ],
    10: [
      "chaos_weaver-chaos_dice-table_mastery",
      "chaos_weaver-wild_magic-chaos_storm_ultimate",
      "chaos_weaver-entropy_control-entropy_master"
    ]
  },

  // 4. The Code: Fully Rewritten, Meticulously Normalized JSON Spell List
  exampleSpells: [
    // ============================================================
    // LEVEL 1 SPELLS
    // ============================================================
    { id : "chaos_weaver-chaos_dice-chaos_bolt",
      name: "Chaos Bolt",
      description: "A bolt of pure chaotic force — each cast is different. Roll on the Chaos Bolt table to see what happens: the bolt might bounce, phase through armor, reverse gravity, or trigger a reality glitch.",
      level: 1,
      icon: "Arcane/Spellcasting Aura",
      spellType: "ACTION",
      effectTypes: ["damage"],
      typeConfig: {
        school: "force",
        icon: "Arcane/Spellcasting Aura",
        tags: ["force", "damage", "rollable table", "chaos dice"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 4,
        classResource: { type: "mayhem", cost: -2 }, // Generates 2 Mayhem (cost is negative)
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "none", cooldownValue: 0 },
      resolution: "DICE",
      damageConfig: {
        formula: "1d8 + intelligence",
        damageTypes: ["force"],
        resolution: "DICE"
      },
      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: "Chaos Bolt Effects",
          description: "Roll on this table each time you cast Chaos Bolt to determine the bolt's chaotic behavior",
          diceFormula: "1d12",
          entries: [
            {
              range: { min: 1, max: 1 },
              customName: "Wild Ricochet",
              effect: "1d8 force damage + bolt bounces to a random creature within 15ft (ally or enemy) dealing 1d4 force.",
              effectConfig: { damageFormula: "1d8", damageType: "force", bounceDamage: "1d4", bounceRange: 15 }
            },
            {
              range: { min: 2, max: 2 },
              customName: "Entropy Siphon",
              effect: "1d8 force damage + generate 2 Mayhem from the entropic feedback.",
              effectConfig: { damageFormula: "1d8", damageType: "force", mayhemBonus: 2 }
            },
            {
              range: { min: 3, max: 3 },
              customName: "Phase Bolt",
              effect: "1d8 force damage that ignores Armor and shield effects entirely.",
              effectConfig: { damageFormula: "1d8", damageType: "force", armorPenetration: 1.0 }
            },
            {
              range: { min: 4, max: 4 },
              customName: "Gravity Warp",
              effect: "1d8 force damage + target floats 10ft upward for 1 round then crashes down for 1d6 falling damage.",
              effectConfig: { damageFormula: "1d8", damageType: "force", launchHeight: 10, fallDamage: "1d6", floatDuration: 1 }
            },
            {
              range: { min: 5, max: 5 },
              customName: "Chromatic Shift",
              effect: "Damage type changes randomly (fire/frost/lightning/poison/necrotic) and deals 1d10 instead of 1d8.",
              effectConfig: { damageFormula: "1d10", damageType: "random_elemental" }
            },
            {
              range: { min: 6, max: 6 },
              customName: "Temporal Flicker",
              effect: "1d8 force damage + target's next action is delayed to end of initiative order next round.",
              effectConfig: { damageFormula: "1d8", damageType: "force", delayEffect: true }
            },
            {
              range: { min: 7, max: 7 },
              customName: "Probability Inversion",
              effect: "1d8 force damage + target's next attack that would hit misses, and next miss becomes a hit.",
              effectConfig: { damageFormula: "1d8", damageType: "force", probabilityInvert: true }
            },
            {
              range: { min: 8, max: 8 },
              customName: "Timeline Deletion",
              effect: "A minor segment of the target's timeline is ripped away. The target is slowed by 10 feet for 2 rounds, weeping echoes of their deleted future.",
              effectConfig: { damageFormula: "1d8", damageType: "force", speedPenalty: -10, duration: 2 }
            },
            {
              range: { min: 9, max: 9 },
              customName: "Midas Glitch",
              effect: "1d8 force damage + target's weapon turns to gold for 1 round: +3 damage this round, then crumbles to dust (target is disarmed for 1 round).",
              effectConfig: { damageFormula: "1d8", damageType: "force", bonusDamage: 3, disarmDuration: 1 }
            },
            {
              range: { min: 10, max: 10 },
              customName: "Quantum Entanglement",
              effect: "1d8 force damage + you and target swap positions and resistances for 1 round.",
              effectConfig: { damageFormula: "1d8", damageType: "force", swapPositions: true, swapResistances: true, duration: 1 }
            },
            {
              range: { min: 11, max: 11 },
              customName: "Spaghettification",
              effect: "1d8 force damage + target's limbs stretch absurdly. Reach +10ft but -2 to all Agility checks for 1 round.",
              effectConfig: { damageFormula: "1d8", damageType: "force", reachBonus: 10, dexPenalty: -2, duration: 1 }
            },
            {
              range: { min: 12, max: 12 },
              customName: "Chaos Butterfly",
              effect: "1d8 force damage + a chaotic butterfly flutters by. Roll again on this table for a secondary effect (ignoring 12s).",
              effectConfig: { damageFormula: "1d8", damageType: "force", rollAgain: true, excludeSelf: true }
            }
          ]
        }
      },
      tags: ["force", "damage", "rollable table", "chaos dice"],
      specialization: "chaos_dice"
    },
    { id : "chaos_weaver-reality_bending-reality_flicker",
      name: "Reality Flicker",
      description: "Slip between dimensions for a heartbeat — become ghostly, pass through walls, and ignore non-magical attacks for 1 round. Roll on the Flicker Table to see what dimensional side effect tags along.",
      level: 1,
      icon: "Arcane/Quick Step",
      spellType: "ACTION",
      effectTypes: ["buff"],
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Quick Step",
        tags: ["utility", "buff", "teleport", "reality bending"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: {
        actionPoints: 1,
        mana: 3,
        classResource: { type: "mayhem", cost: -2 },
        components: ["somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      resolution: "DICE",
      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          { id : "ghostly_state",
            name: "Flickering Form",
            description: "Gain 50% resistance to physical damage and can move through solid objects/creatures for 1 round.",
            statusEffect: {
              resistanceType: "physical",
              resistanceAmount: 50
            }
          }
        ],
        durationValue: 1,
        durationUnit: "rounds"
      },
      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: "Flicker Table",
          description: "Dimensional anomalies triggered by slipping planar seams",
          diceFormula: "1d6",
          entries: [
            {
              range: { min: 1, max: 1 },
              customName: "Static Charge",
              effect: "You leave a trail of static. The next creature to touch you takes 1d6 lightning damage.",
              effectConfig: { staticDamage: "1d6" }
            },
            {
              range: { min: 2, max: 2 },
              customName: "Spatial Lag",
              effect: "Your lower extremities lag behind your center of mass. Your movement is reduced by 10 feet for 1 round, trailing spectral weeping shadows.",
              effectConfig: { speedPenalty: -10, duration: 1 }
            },
            {
              range: { min: 3, max: 3 },
              customName: "Temporal Echo",
              effect: "A duplicate of you appears 5ft away. Attacks against you have a 50% chance to hit the duplicate instead.",
              effectConfig: { mirrorCount: 1, missChance: 50 }
            },
            {
              range: { min: 4, max: 4 },
              customName: "Entropic Rupture",
              effect: "Reality splits with a high-pitched metallic shriek. All creatures within 5 feet take 1d4 psychic damage, and the smell of sulfurous ozone prevents stealth for 1 hour.",
              effectConfig: { damageFormula: "1d4", damageType: "psychic", radius: 5 }
            },
            {
              range: { min: 5, max: 5 },
              customName: "Gravity Well",
              effect: "Gravity increases locally. All creatures within 10ft have their movement speed halved for 1 round.",
              effectConfig: { gravitySlow: true, radius: 10, duration: 1 }
            },
            {
              range: { min: 6, max: 6 },
              customName: "Perfect Phasing",
              effect: "Your phase is exceptionally clean. Increase Flicker duration to 2 rounds.",
              effectConfig: { durationIncrease: 1 }
            }
          ]
        }
      },
      tags: ["utility", "buff", "teleport", "reality bending"],
      specialization: "reality_bending"
    },
    { id : "chaos_weaver-entropy_control-entropic_touch",
      name: "Entropic Touch",
      description: "Touch a target to introduce molecular decay. The target takes necrotic damage, and their physical bonds begin to break down, shredding their Armor over time.",
      level: 1,
      icon: "Necrotic/Necrotic Hand Rising",
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Hand Rising",
        tags: ["necrotic", "damage", "debuff", "entropy control"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        rangeDistance: 5,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 2,
        classResource: { type: "mayhem", cost: -2 },
        components: ["somatic"]
      },
      cooldownConfig: { cooldownType: "none", cooldownValue: 0 },
      resolution: "DICE",
      damageConfig: {
        formula: "1d10 + intelligence",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "entropic_decay_debuff",
            name: "Entropic Rot",
            description: "Target's Armor is reduced by 2 for 3 rounds. This rot stacks up to 5 times.",
            statModifier: {
              stat: "armor",
              magnitude: -2,
              magnitudeType: "flat"
            }
          }
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 13,
          saveOutcome: "negates"
        },
        durationValue: 3,
        durationUnit: "rounds"
      },
      tags: ["necrotic", "damage", "debuff", "entropy control"],
      specialization: "entropy_control"
    },
    { id : "chaos_weaver-shared-chaotic_infusion",
      name: "Chaotic Infusion",
      description: "Force raw timeline friction directly through your own planar anchor. This dangerous acceleration generates massive Mayhem instantly, but triggers a minor entropic side effect.",
      level: 1,
      icon: "Force/Swirling Energy",
      spellType: "ACTION",
      effectTypes: ["utility"],
      typeConfig: {
        school: "chaos",
        icon: "Force/Swirling Energy",
        tags: ["chaos", "utility", "mayhem", "resource", "rollable table"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: {
        actionPoints: 1,
        mana: 2,
        classResource: { type: "mayhem", cost: -15 }, // Generates 15 Mayhem!
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      resolution: "AUTOMATIC",
      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: "Infusion Side Effects",
          description: "Entropic symptoms of forcing timeline friction through your planar anchor",
          diceFormula: "1d6",
          entries: [
            {
              range: { min: 1, max: 1 },
              customName: "Nerve Flare",
              effect: "Your physical matrix is strained by sudden acceleration. Take 1d6 force damage.",
              effectConfig: { selfDamage: "1d6" }
            },
            {
              range: { min: 2, max: 2 },
              customName: "Static Discharge",
              effect: "Uncontrolled static leaps from your fingers, dealing 1d4 lightning damage to a random adjacent ally.",
              effectConfig: { teamDamage: "1d4", radius: 5 }
            },
            {
              range: { min: 3, max: 3 },
              customName: "Spatial Lag",
              effect: "Your lower extremities lag behind. -10ft movement speed for 1 round.",
              effectConfig: { speedPenalty: -10 }
            },
            {
              range: { min: 4, max: 4 },
              customName: "Void Seep",
              effect: "The void shears your physical interface. All creatures within 5 feet take 2d4 psychic damage, and you trail flickering timeline echoes that make stealth impossible for 1 hour.",
              effectConfig: { damageFormula: "2d4", damageType: "psychic", radius: 5 }
            },
            {
              range: { min: 5, max: 5 },
              customName: "Mana Spark",
              effect: "The friction generates a spark. Instantly restore 3 mana.",
              effectConfig: { manaRestore: 3 }
            },
            {
              range: { min: 6, max: 6 },
              customName: "Perfect Channel",
              effect: "You absorb the friction cleanly. Generate +5 extra Mayhem.",
              effectConfig: { extraMayhem: 5 }
            }
          ]
        }
      },
      tags: ["chaos", "utility", "mayhem", "resource", "rollable table"],
      specialization: "chaos_dice"
    },
    { id : "chaos_weaver-wild_magic-wild_surge",
      name: "Wild Surge",
      description: "Pierce the veil of order and let raw magic bleed through. This vents your pressure gauge, forcing an immediate roll on the d100 Master Wild Surge Table and resetting your Mayhem to 0.",
      level: 1,
      icon: "Nature/Nature Wild 1",
      spellType: "ACTION",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "chaos",
        icon: "Nature/Nature Wild 1",
        tags: ["chaos", "damage", "utility", "wild magic", "rollable table"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: {
        actionPoints: 1,
        mana: 0,
        components: ["somatic"]
      },
      cooldownConfig: { cooldownType: "none", cooldownValue: 0 },
      resolution: "DICE",
      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: "d100 Master Wild Surge Table",
          description: "Raw magic vents in one of these four extreme thematic, reality-glitching forms.",
          diceFormula: "1d100",
          entries: [
            {
              range: { min: 1, max: 15 },
              customName: "Unstable Miracle: Chrono-Genesis",
              effect: "D100: 1-15. Reverse the physical decay of your allies. All allies within 30ft heal for 3d10 + Intelligence radiant energy as time winds back one tick.",
              effectConfig: { healingFormula: "3d10 + INT", range: 30 }
            },
            {
              range: { min: 16, max: 30 },
              customName: "Unstable Miracle: Singularity Shield",
              effect: "D100: 16-30. Gravity wraps around you. You and adjacent allies gain a localized barrier absorbing 30 damage and repelling melee attackers.",
              effectConfig: { shieldAmount: 30, radius: 5 }
            },
            {
              range: { min: 31, max: 45 },
              customName: "Radical Area Ruin: Cataclysmic Rifting",
              effect: "D100: 31-45. Unstable spatial rifts tear open. All creatures within 40ft (allies and enemies) must make an Agility save or take 4d8 force damage and be knocked prone.",
              effectConfig: { damageFormula: "4d8", damageType: "force", radius: 40, saveType: "agility", saveDC: 15 }
            },
            {
              range: { min: 46, max: 60 },
              customName: "Radical Area Ruin: Timeline Collapse",
              effect: "D100: 46-60. A 20ft circular zone of reality collapses into grey ash. Enemies in the zone must save (Spirit DC 15) or take 6d8 chaos damage and be stunned for 1 round.",
              effectConfig: { damageFormula: "6d8", damageType: "chaos", radius: 20, saveType: "spirit", saveDC: 15, duration: 1 }
            },
            {
              range: { min: 61, max: 70 },
              customName: "Reality Reversal: Probability Inversion",
              effect: "D100: 61-70. Reality flips its coins. For 1 round, all hit attack rolls become misses, and all missed attacks become critical hits.",
              effectConfig: { invertProbability: true, duration: 1 }
            },
            {
              range: { min: 71, max: 80 },
              customName: "Reality Reversal: Spatial Scramble",
              effect: "D100: 71-80. Interdimensional winds sweep the area. All combatants are randomly teleported to another occupant's position. Everyone is blinded for 1 round (Spirit DC 15 negates).",
              effectConfig: { teleportAll: true, saveType: "spirit", saveDC: 15, duration: 1 }
            },
            {
              range: { min: 81, max: 90 },
              customName: "Physical Backlash: Molecular Dississociation",
              effect: "D100: 81-90. Your body's molecules drop to zero density. You suffer 2d10 necrotic damage and suffer 100% vulnerability to bludgeoning and slashing damage for 2 rounds.",
              effectConfig: { damageFormula: "2d10", damageType: "necrotic", vulnerabilityType: "physical", vulnerabilityPercent: 100, duration: 2 }
            },
            {
              range: { min: 91, max: 100 },
              customName: "Physical Backlash: Entropic Hemorrhage",
              effect: "D100: 91-100. Localized gravity anomalies shear your molecular structure. You take 5d8 force damage, and your maximum mana is reduced by 10 until your next long rest.",
              effectConfig: { damageFormula: "5d8", damageType: "force", manaReduction: 10 }
            }
          ]
        }
      },
      tags: ["chaos", "damage", "utility", "wild magic", "rollable table"],
      specialization: "wild_magic"
    },

    // ============================================================
    // LEVEL 2 SPELLS
    // ============================================================
    { id : "chaos_weaver-chaos_dice-chaotic_bolt",
      name: "Chaotic Bolt",
      description: "A bolt that refuses to behave — each cast rolls a d20 to determine if it forks, explodes, warps reality, or triggers a chaotic anomaly.",
      level: 2,
      icon: "Arcane/Spellcasting Aura",
      spellType: "ACTION",
      effectTypes: ["damage"],
      typeConfig: {
        school: "force",
        icon: "Arcane/Spellcasting Aura",
        tags: ["force", "damage", "rollable table", "chaos dice"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 6,
        classResource: { type: "mayhem", cost: -4 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      resolution: "DICE",
      damageConfig: {
        formula: "3d6 + intelligence",
        damageTypes: ["force"],
        resolution: "DICE"
      },
      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: "Chaotic Bolt Effects",
          description: "Roll on this table to determine the bolt's chaotic behavior",
          diceFormula: "1d20",
          entries: [
            {
              range: { min: 1, max: 3 },
              customName: "Weak Bolt",
              effect: "Deal 2d6 force damage to target.",
              effectConfig: { damageFormula: "2d6", damageType: "force" }
            },
            {
              range: { min: 4, max: 5 },
              customName: "Forking Bolt",
              effect: "Deal 2d6 force damage and strike an additional random enemy within range.",
              effectConfig: { damageFormula: "2d6", damageType: "force", chainCount: 1 }
            },
            {
              range: { min: 6, max: 7 },
              customName: "Exploding Bolt",
              effect: "Deal 3d6 force damage in 10ft radius.",
              effectConfig: { damageFormula: "3d6", damageType: "force", areaShape: "circle", areaRadius: 10 }
            },
            {
              range: { min: 8, max: 9 },
              customName: "Piercing Bolt",
              effect: "Deal 2d6 force damage, ignores 50% of Armor.",
              effectConfig: { damageFormula: "2d6", damageType: "force", armorPenetration: 0.5 }
            },
            {
              range: { min: 10, max: 11 },
              customName: "Gravity Warp Bolt",
              effect: "2d6 force damage + target floats 10ft upward for 1 round, then crashes for 1d6 falling damage.",
              effectConfig: { damageFormula: "2d6", damageType: "force", launchHeight: 10, fallDamage: "1d6", floatDuration: 1 }
            },
            {
              range: { min: 12, max: 13 },
              customName: "Arcane Surge",
              effect: "Deal 3d6 force damage, gain +2 Mayhem.",
              effectConfig: { damageFormula: "3d6", damageType: "force", mayhemBonus: 2 }
            },
            {
              range: { min: 14, max: 15 },
              customName: "Reality Rift",
              effect: "Deal 2d6 force damage, teleport target 15 feet in a random direction.",
              effectConfig: { damageFormula: "2d6", damageType: "force", teleportDistance: 15, randomDirection: true }
            },
            {
              range: { min: 16, max: 16 },
              customName: "Temporal Stutter Bolt",
              effect: "2d6 force damage + target's next action is delayed to end of initiative order.",
              effectConfig: { damageFormula: "2d6", damageType: "force", delayEffect: true }
            },
            {
              range: { min: 17, max: 17 },
              customName: "Probability Inversion Bolt",
              effect: "2d6 force damage + target's next attack that would hit misses, and next miss becomes a hit.",
              effectConfig: { damageFormula: "2d6", damageType: "force", probabilityInvert: true }
            },
            {
              range: { min: 18, max: 18 },
              customName: "Mirror Bolt",
              effect: "2d6 force damage + a mirror duplicate of target appears as your ally for 1 round (1 HP, deals 1d4 on hit).",
              effectConfig: { damageFormula: "2d6", damageType: "force", summonMirror: true, duration: 1 }
            },
            {
              range: { min: 19, max: 19 },
              customName: "Chaos Nova Bolt",
              effect: "Deal 4d6 force damage to all enemies within 20ft.",
              effectConfig: { damageFormula: "4d6", damageType: "force", areaShape: "circle", areaRadius: 20 }
            },
            {
              range: { min: 20, max: 20 },
              customName: "Reality Storm Bolt",
              effect: "3d6 force damage + roll on Wild Surge Effects table for a secondary effect.",
              effectConfig: { damageFormula: "3d6", damageType: "force", secondaryTable: "wild_surge" }
            }
          ]
        }
      },
      tags: ["force", "damage", "rollable table", "chaos dice"],
      specialization: "chaos_dice"
    },
    { id : "chaos_weaver-reality_bending-dimensional_rift",
      name: "Dimensional Rift",
      description: "Force a localized collapse in space, tearing a rift that deals force damage and violently drags the target through the planar fabric, or swaps them with another creature.",
      level: 2,
      icon: "Arcane/Open Portal",
      spellType: "ACTION",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "force",
        icon: "Arcane/Open Portal",
        tags: ["force", "damage", "teleport", "reality bending"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 45,
        targetRestrictions: ["enemy", "ally"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 5,
        classResource: { type: "mayhem", cost: -4 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      resolution: "DICE",
      damageConfig: {
        formula: "2d8 + intelligence",
        damageTypes: ["force"],
        resolution: "DICE"
      },
      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "rift_teleport",
            name: "Rift Relocation",
            description: "Teleport the target 20 feet in a direction of your choice (Spirit save DC 14 negates if hostile)."
          }
        ]
      },
      tags: ["force", "damage", "teleport", "reality bending"],
      specialization: "reality_bending"
    },
    { id : "chaos_weaver-entropy_control-chaotic_decay",
      name: "Chaotic Decay",
      description: "Saturate a 15ft area with an entropic mist that rapidly breaks down matter. All creatures in the zone take necrotic damage, and their Armor is heavily corroded.",
      level: 2,
      icon: "Necrotic/Necrotic Decay 1",
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Decay 1",
        tags: ["necrotic", "damage", "debuff", "area", "entropy control"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaShape: "circle",
        areaSize: 15,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 6,
        classResource: { type: "mayhem", cost: -4 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      resolution: "DICE",
      damageConfig: {
        formula: "2d6 + intelligence",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 14,
          saveOutcome: "half_damage"
        }
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "decay_acid_debuff",
            name: "Rotting Mist",
            description: "Corrodes Armor, reducing it by 3 for 2 rounds.",
            statModifier: {
              stat: "armor",
              magnitude: -3,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 2,
        durationUnit: "rounds"
      },
      tags: ["necrotic", "damage", "debuff", "area", "entropy control"],
      specialization: "entropy_control"
    },

    // ============================================================
    // LEVEL 3 SPELLS
    // ============================================================
    { id : "chaos_weaver-chaos_dice-prismatic_chaos",
      name: "Prismatic Chaos",
      description: "Release a kaleidoscope of unstable elements at your target. Roll a d8 on the Prismatic Table to see which damage type and severe elemental secondary effect is inflicted.",
      level: 3,
      icon: "Arcane/Conjure Elements",
      spellType: "ACTION",
      effectTypes: ["damage"],
      typeConfig: {
        school: "chaos",
        icon: "Arcane/Conjure Elements",
        tags: ["damage", "rollable table", "chaos dice"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 6,
        classResource: { type: "mayhem", cost: -4 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "none", cooldownValue: 0 },
      resolution: "DICE",
      damageConfig: {
        formula: "4d6",
        damageTypes: ["chaos"],
        resolution: "DICE"
      },
      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: "Prismatic Table",
          description: "Unstable elemental manifests",
          diceFormula: "1d8",
          entries: [
            {
              range: { min: 1, max: 1 },
              customName: "Infernal Rot",
              effect: "Deals fire damage. Target is ignited, taking 1d6 fire damage per turn for 3 rounds (Constitution save DC 14 negates).",
              effectConfig: { damageType: "fire", burnFormula: "1d6", duration: 3 }
            },
            {
              range: { min: 2, max: 2 },
              customName: "Glacial Freeze",
              effect: "Deals frost damage. Target's joints freeze, reducing movement by 20ft for 2 rounds.",
              effectConfig: { damageType: "frost", slowValue: -20, duration: 2 }
            },
            {
              range: { min: 3, max: 3 },
              customName: "Searing Spark",
              effect: "Deals lightning damage. Lightning leaps to 2 nearby enemies within 15ft, dealing 2d6 lightning damage.",
              effectConfig: { damageType: "lightning", leapTargets: 2, leapDamage: "2d6" }
            },
            {
              range: { min: 4, max: 4 },
              customName: "Marrow Corrosion",
              effect: "Deals poison damage. Target is poisoned, reducing their physical attack rolls by 3 for 2 rounds.",
              effectConfig: { damageType: "poison", rollPenalty: -3, duration: 2 }
            },
            {
              range: { min: 5, max: 5 },
              customName: "Deathly Void",
              effect: "Deals necrotic damage. Target cannot receive healing or shield effects for 2 rounds.",
              effectConfig: { damageType: "necrotic", healBlock: true, duration: 2 }
            },
            {
              range: { min: 6, max: 6 },
              customName: "Temporal Stutter",
              effect: "Deals force damage. Target's action point cost for all actions is increased by 1 for 1 round.",
              effectConfig: { damageType: "force", apTax: 1, duration: 1 }
            },
            {
              range: { min: 7, max: 7 },
              customName: "Planar Blindness",
              effect: "Deals radiant damage. Target is blinded by interdimensional light for 1 round (Spirit save DC 14 negates).",
              effectConfig: { damageType: "radiant", blindDuration: 1 }
            },
            {
              range: { min: 8, max: 8 },
              customName: "Synaptic Shred",
              effect: "Deals psychic damage. Target suffers agonizing pain, dealing 3d6 psychic damage and imposing disadvantage on their next roll.",
              effectConfig: { damageType: "psychic", extraDamage: "3d6", disadvantage: true }
            }
          ]
        }
      },
      tags: ["damage", "rollable table", "chaos dice"],
      specialization: "chaos_dice"
    },
    { id : "chaos_weaver-reality_bending-fractured_realms",
      name: "Fractured Realms",
      description: "Strike the ground to create a localized spatial rupture in a 20ft area. Space shatters like glass, dealing force damage to all creatures and turning the soil into difficult, reality-glitched terrain.",
      level: 3,
      icon: "Arcane/Conjure Elements",
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "chaos",
        icon: "Arcane/Conjure Elements",
        tags: ["force", "damage", "area", "terrain", "reality bending"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 50,
        areaShape: "circle",
        areaSize: 20,
        targetRestrictions: ["enemy", "ally"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 8,
        classResource: { type: "mayhem", cost: -4 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      resolution: "DICE",
      damageConfig: {
        formula: "3d8 + intelligence",
        damageTypes: ["force"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 14,
          saveOutcome: "half_damage"
        }
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "fractured_space_terrain",
            name: "Fractured Space",
            description: "Movement speed in this zone is quartered. Any creature ending their turn in the zone takes 1d8 force damage.",
            mechanicsText: "Quartered speed, 1d8 force damage per round."
          }
        ],
        durationValue: 3,
        durationUnit: "rounds"
      },
      tags: ["force", "damage", "area", "terrain", "reality bending"],
      specialization: "reality_bending"
    },
    { id : "chaos_weaver-entropy_control-chaos_burst",
      name: "Chaos Burst",
      description: "Condense a sphere of compressed necrotic embers and launch it at a target. On impact, the sphere explodes, dealing necrotic and fire damage to the target and adjacent creatures.",
      level: 3,
      icon: "Fire/Hellfire",
      spellType: "ACTION",
      effectTypes: ["damage"],
      typeConfig: {
        school: "chaos",
        icon: "Fire/Hellfire",
        tags: ["necrotic", "fire", "damage", "burst", "entropy control"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 7,
        classResource: { type: "mayhem", cost: -4 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "none", cooldownValue: 0 },
      resolution: "DICE",
      damageConfig: {
        formula: "4d6 + intelligence",
        damageTypes: ["necrotic", "fire"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 14,
          saveOutcome: "half_damage"
        }
      },
      tags: ["necrotic", "fire", "damage", "burst", "entropy control"],
      specialization: "entropy_control"
    },

    // ============================================================
    // LEVEL 4 SPELLS
    // ============================================================
    { id : "chaos_weaver-reality_bending-reality_swap",
      name: "Reality Swap",
      description: "A spatial distortion that instantly swaps the physical coordinates of up to four creatures in a 30ft zone. Hostile targets must save (Spirit DC 15) to resist the displacement.",
      level: 4,
      icon: "Arcane/Open Portal",
      spellType: "ACTION",
      effectTypes: ["utility"],
      typeConfig: {
        school: "chaos",
        icon: "Arcane/Open Portal",
        tags: ["teleport", "utility", "area", "reality bending"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaShape: "circle",
        areaSize: 30,
        targetRestrictions: ["enemy", "ally"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 8,
        classResource: { type: "mayhem", cost: -6 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      resolution: "AUTOMATIC",
      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "reality_swap_displacement",
            name: "Planar Transposition",
            description: "Up to four creatures in the targeted zone swap positions randomly. Those whose limbs stretch in the phase lag suffer -2 to Agility rolls for 1 round."
          }
        ]
      },
      tags: ["teleport", "utility", "area", "reality bending"],
      specialization: "reality_bending"
    },
    { id : "chaos_weaver-entropy_control-chaos_wave",
      name: "Chaos Wave",
      description: "Unleash a wide, crashing wave of entropic force in a 30ft cone. All creatures caught in the wave suffer necrotic damage, and their physical attributes (Strength and Armor) are drained.",
      level: 4,
      icon: "Necrotic/Necrotic Decay 1",
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Decay 1",
        tags: ["necrotic", "damage", "cone", "debuff", "entropy control"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "cone",
        areaSize: 30,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 9,
        classResource: { type: "mayhem", cost: -6 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      resolution: "DICE",
      damageConfig: {
        formula: "3d10 + intelligence",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        savingThrow: {
          ability: "strength",
          difficultyClass: 15,
          saveOutcome: "half_damage"
        }
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "entropy_wave_debuff",
            name: "Entropic Depletion",
            description: "Reduces physical damage rolls by 3 and Armor by 4 for 2 rounds.",
            statModifier: {
              stat: "armor",
              magnitude: -4,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 2,
        durationUnit: "rounds"
      },
      tags: ["necrotic", "damage", "cone", "debuff", "entropy control"],
      specialization: "entropy_control"
    },
    { id : "chaos_weaver-chaos_dice-chaos_storm",
      name: "Chaos Storm",
      description: "Summon a raging vortex of reality-tearing energy in a 25ft area. Roll a d20 on the Chaos Storm table at the start of each turn to see what chaotic anomaly strikes the occupants.",
      level: 4,
      icon: "Void/Black Hole",
      spellType: "ACTION",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "chaos",
        icon: "Void/Black Hole",
        tags: ["chaos", "damage", "control", "area", "rollable table", "chaos dice"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaShape: "circle",
        areaSize: 25,
        targetRestrictions: ["enemy", "ally"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 10,
        classResource: { type: "mayhem", cost: -6 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      resolution: "DICE",
      damageConfig: {
        formula: "2d10",
        damageTypes: ["chaos"],
        resolution: "DICE"
      },
      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: "Chaos Storm Hazards",
          description: "Environmental catastrophes manifesting in the spatial storm",
          diceFormula: "1d20",
          entries: [
            {
              range: { min: 1, max: 4 },
              customName: "Void Winds",
              effect: "Cold spatial winds deal 2d8 force damage and reduce movement speed by 15ft for 1 round.",
              effectConfig: { damageFormula: "2d8", slow: -15 }
            },
            {
              range: { min: 5, max: 8 },
              customName: "Molecular Friction",
              effect: "Frictional fields deal 3d6 fire damage and shred Armor by 3 for 2 rounds.",
              effectConfig: { damageFormula: "3d6", armorPen: -3 }
            },
            {
              range: { min: 9, max: 12 },
              customName: "Gravitational Collapse",
              effect: "Creatures are crushed downward, taking 3d8 force damage and falling prone (Strength save DC 15 negates).",
              effectConfig: { damageFormula: "3d8", knockProne: true }
            },
            {
              range: { min: 13, max: 16 },
              customName: "Timeline Recursion",
              effect: "Creatures are caught in loops. They cannot cast spells or use abilities next round (Spirit save DC 15 negates).",
              effectConfig: { silence: true }
            },
            {
              range: { min: 17, max: 19 },
              customName: "Temporal Stasis",
              effect: "Space freezes entirely. Creatures are stunned for 1 round (Constitution save DC 15 negates).",
              effectConfig: { stun: true }
            },
            {
              range: { min: 20, max: 20 },
              customName: "Planar Compression",
              effect: "The storm implodes violently. Deals 5d10 force damage to all occupants and teleports them randomly.",
              effectConfig: { damageFormula: "5d10", randomTeleport: true }
            }
          ]
        }
      },
      tags: ["chaos", "damage", "control", "area", "rollable table", "chaos dice"],
      specialization: "chaos_dice"
    },

    // ============================================================
    // LEVEL 5 SPELLS
    // ============================================================
    { id : "chaos_weaver-entropy_control-discordant_strike",
      name: "Discordant Strike",
      description: "Strike an enemy's mind with high-pitched, harmonic timeline feedback. Deals massive psychic damage and severely disorient the target, causing them to attack their own allies next round.",
      level: 5,
      icon: "Psychic/Mental Chaos",
      spellType: "ACTION",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "chaos",
        icon: "Psychic/Mental Chaos",
        tags: ["psychic", "damage", "control", "entropy control"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 8,
        classResource: { type: "mayhem", cost: -6 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      resolution: "DICE",
      damageConfig: {
        formula: "5d6 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE"
      },
      controlConfig: {
        controlType: "charm",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates"
        },
        durationValue: 1,
        durationUnit: "rounds"
      },
      tags: ["psychic", "damage", "control", "entropy control"],
      specialization: "entropy_control"
    },
    { id : "chaos_weaver-wild_magic-pandemonic_pulse",
      name: "Pandemonic Pulse",
      description: "Release a deafening, reality-warping soundwave in a 25ft area. All creatures take fire and chaos damage, and are struck with interdimensional terror, fleeing in panic.",
      level: 5,
      icon: "Fire/Hellfire",
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "chaos",
        icon: "Fire/Hellfire",
        tags: ["fire", "chaos", "damage", "area", "debuff", "wild magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 25,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 9,
        classResource: { type: "mayhem", cost: -6 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      resolution: "DICE",
      damageConfig: {
        formula: "4d8 + intelligence",
        damageTypes: ["fire", "chaos"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "half_damage"
        }
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "pandemonic_fear",
            name: "Planar Dread",
            description: "Target is feared, forced to flee from the caster, and has disadvantage on all rolls for 1 round."
          }
        ],
        durationValue: 1,
        durationUnit: "rounds"
      },
      tags: ["fire", "chaos", "damage", "area", "debuff", "wild magic"],
      specialization: "wild_magic"
    },
    { id : "chaos_weaver-reality_bending-chaotic_reflection",
      name: "Chaotic Reflection",
      description: "As a reaction to taking damage, create a flickering, interdimensional bubble shield. The shield reduces incoming damage by 50% and reflects the absorbed energy back at the attacker as force damage.",
      level: 5,
      icon: "Force/Force Field",
      spellType: "REACTION",
      effectTypes: ["buff", "damage"],
      typeConfig: {
        school: "chaos",
        icon: "Force/Force Field",
        tags: ["force", "defensive", "reaction", "reality bending"],
        castTime: 0,
        castTimeType: "REACTION"
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: {
        actionPoints: 0,
        mana: 6,
        classResource: { type: "mayhem", cost: -6 },
        components: ["somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id : "reflection_bubble",
            name: "Planar Deflector",
            description: "Reduces all incoming damage by 50% for the next 2 attacks, reflecting that absorbed amount back at the source as force damage."
          }
        ]
      },
      tags: ["force", "defensive", "reaction", "reality bending"],
      specialization: "reality_bending"
    },
    { id : "chaos_weaver-wild_magic-chaos_engine",
      name: "Chaos Engine",
      description: "Intentionally overload your own physical anchor. By sacrificing 15% of your maximum health, you supercharge your core, causing all spells cast within the next 3 rounds to generate double Mayhem and deal double critical damage.",
      level: 5,
      icon: "Fire/Hellfire",
      spellType: "ACTION",
      effectTypes: ["buff"],
      typeConfig: {
        school: "chaos",
        icon: "Fire/Hellfire",
        tags: ["buff", "self-harm", "resource", "wild magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: {
        actionPoints: 1,
        mana: 5,
        resourceTypes: ["health"],
        resourceValues: {},
        useFormulas: { health: true },
        resourceFormulas: { health: "15% max HP" },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "engine_overload",
            name: "Overloaded Engine",
            description: "Spells generate double Mayhem and deal double critical damage for 3 rounds.",
            statusEffect: {
              critMultiplier: 3
            }
          }
        ],
        durationValue: 3,
        durationUnit: "rounds"
      },
      tags: ["buff", "self-harm", "resource", "wild magic"],
      specialization: "wild_magic"
    },

    // ============================================================
    // LEVEL 6 SPELLS
    // ============================================================
    { id : "chaos_weaver-reality_bending-reality_storm",
      name: "Reality Storm",
      description: "Summon a massive, 35ft spatial vortex that twists and folds space. All creatures inside take force damage, are pulled randomly, and their armor collapses from the pressure.",
      level: 6,
      icon: "Void/Black Hole",
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "chaos",
        icon: "Void/Black Hole",
        tags: ["force", "damage", "area", "pull", "reality bending"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaShape: "circle",
        areaSize: 35,
        targetRestrictions: ["enemy", "ally"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 10,
        classResource: { type: "mayhem", cost: -6 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      resolution: "DICE",
      damageConfig: {
        formula: "5d8 + intelligence",
        damageTypes: ["force"],
        resolution: "DICE",
        savingThrow: {
          ability: "strength",
          difficultyClass: 16,
          saveOutcome: "half_damage"
        }
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "reality_storm_crush",
            name: "Spatial Crushing",
            description: "Reduces Armor by 5 and halves movement speed while in the storm.",
            statModifier: {
              stat: "armor",
              magnitude: -5,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 3,
        durationUnit: "rounds"
      },
      tags: ["force", "damage", "area", "pull", "reality bending"],
      specialization: "reality_bending"
    },
    { id : "chaos_weaver-wild_magic-chaotic_eruption",
      name: "Chaotic Eruption",
      description: "Force an immediate dimensional blowout directly beneath a point on the ground. A towering plume of burning, entropic plasma erupts in a 25ft area, incinerating all targets.",
      level: 6,
      icon: "Fire/Hellfire",
      spellType: "ACTION",
      effectTypes: ["damage"],
      typeConfig: {
        school: "chaos",
        icon: "Fire/Hellfire",
        tags: ["fire", "force", "damage", "area", "wild magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaShape: "circle",
        areaSize: 25,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 11,
        classResource: { type: "mayhem", cost: -6 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      resolution: "DICE",
      damageConfig: {
        formula: "6d8 + intelligence",
        damageTypes: ["fire", "force"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 16,
          saveOutcome: "half_damage"
        }
      },
      tags: ["fire", "force", "damage", "area", "wild magic"],
      specialization: "wild_magic"
    },
    { id : "chaos_weaver-entropy_control-decay_cascade",
      name: "Decay Cascade",
      description: "Touch a target to inject rapidly multiplying entropic decay. The decay deals necrotic damage, then leaps like dark electrical chains to strike up to five adjacent targets within 15 feet.",
      level: 6,
      icon: "Necrotic/Necrotic Decay 1",
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Decay 1",
        tags: ["necrotic", "damage", "chain", "debuff", "entropy control"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 45,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 10,
        classResource: { type: "mayhem", cost: -6 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      resolution: "DICE",
      damageConfig: {
        formula: "5d6 + intelligence",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "cascade_rot_stack",
            name: "Entropic Cascade",
            description: "Spreads rot to all chain targets, reducing Armor by 2 (stacks up to 5 times) for 3 rounds."
          }
        ],
        durationValue: 3,
        durationUnit: "rounds"
      },
      tags: ["necrotic", "damage", "chain", "debuff", "entropy control"],
      specialization: "entropy_control"
    },
    { id : "chaos_weaver-reality_bending-chaos_gate",
      name: "Chaos Gate",
      description: "Weld a temporal gateway linking two positions up to 100 feet apart. The portal allows instant movement for allies, but spatial instability blocks physical weapons or projectiles from crossing.",
      level: 6,
      icon: "Arcane/Open Portal",
      spellType: "ACTION",
      effectTypes: ["utility"],
      typeConfig: {
        school: "chaos",
        icon: "Arcane/Open Portal",
        tags: ["portal", "utility", "movement", "reality bending"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 100,
        areaShape: "circle",
        areaSize: 5
      },
      resourceCost: {
        actionPoints: 2,
        mana: 12,
        classResource: { type: "mayhem", cost: -6 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      resolution: "AUTOMATIC",
      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "portal_gate_movement",
            name: "Spliced Gateway",
            description: "Create two spatial gates for 3 rounds. Any creature stepping into one instantly emerges from the other, consuming 0 feet of movement."
          }
        ]
      },
      tags: ["portal", "utility", "movement", "reality bending"],
      specialization: "reality_bending"
    },

    // ============================================================
    // LEVEL 7 SPELLS
    // ============================================================
    { id : "chaos_weaver-wild_magic-chaos_nova",
      name: "Chaos Nova",
      description: "Release a blinding stellar core of pure interdimensional decay in a massive 40ft area. All enemies take severe force and radiant damage, and are permanently thinned, losing Armor and sight.",
      level: 7,
      icon: "Radiant/Radiant Divinity",
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "chaos",
        icon: "Radiant/Radiant Divinity",
        tags: ["force", "radiant", "damage", "area", "blind", "wild magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 40,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 12,
        classResource: { type: "mayhem", cost: -8 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      resolution: "DICE",
      damageConfig: {
        formula: "8d8 + intelligence",
        damageTypes: ["force", "radiant"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 17,
          saveOutcome: "half_damage"
        }
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "nova_blindness",
            name: "Stellar Blindness",
            description: "Blinds targets for 2 rounds and shreds their Armor by 6.",
            statModifier: {
              stat: "armor",
              magnitude: -6,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 2,
        durationUnit: "rounds"
      },
      tags: ["force", "radiant", "damage", "area", "blind", "wild magic"],
      specialization: "wild_magic"
    },
    { id : "chaos_weaver-chaos_dice-ultimate_chaos",
      name: "Ultimate Chaos",
      description: "The absolute pinnacle of table mastery. Roll a d100 on the Master Chaos Table. This spell bypasses normal spell limits, unleashing one of eight apocalyptic planar catastrophes.",
      level: 7,
      icon: "Void/Black Hole",
      spellType: "ACTION",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "chaos",
        icon: "Void/Black Hole",
        tags: ["chaos", "damage", "control", "rollable table", "chaos dice"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 90,
        areaShape: "circle",
        areaSize: 30,
        targetRestrictions: ["enemy", "ally"]
      },
      resourceCost: {
        actionPoints: 2,
        mana: 14,
        classResource: { type: "mayhem", cost: -8 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      resolution: "DICE",
      damageConfig: {
        formula: "5d10",
        damageTypes: ["chaos"],
        resolution: "DICE"
      },
      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: "Master Chaos Catastrophes",
          description: "Apocalyptic timeline distortions and dimensional folds",
          diceFormula: "1d100",
          entries: [
            {
              range: { min: 1, max: 20 },
              customName: "Gravitational Collapse",
              effect: "D100: 1-20. Gravity locally intensifies. All targets in a 30ft area take 8d8 force damage and are pinned to the earth, unable to move for 2 rounds.",
              effectConfig: { damageFormula: "8d8", pinDuration: 2 }
            },
            {
              range: { min: 21, max: 40 },
              customName: "Entropic Dissolution",
              effect: "D100: 21-40. Matter melts. Deals 6d12 necrotic damage and permanently shreds Armor by 10 (Constitution save DC 17 halves damage/negates shred).",
              effectConfig: { damageFormula: "6d12", armorShred: -10 }
            },
            {
              range: { min: 41, max: 60 },
              customName: "Chronostutter Cascade",
              effect: "D100: 41-60. Time splinters. Targets in the area lose all active action points, and their initiative order is delayed by 3 initiative ticks.",
              effectConfig: { apDeplete: true, initDelay: 3 }
            },
            {
              range: { min: 61, max: 75 },
              customName: "Prismatic Ruin",
              effect: "D100: 61-75. A kaleidoscope wave explodes. Roll four separate d8s on the Prismatic Table, applying all four effects simultaneously across random targets.",
              effectConfig: { multiRoll: 4 }
            },
            {
              range: { min: 76, max: 85 },
              customName: "Probability Blackout",
              effect: "D100: 76-85. All rolls in the area must roll two d20s and take the absolute lowest outcome for 2 rounds.",
              effectConfig: { disadvantageAll: true, duration: 2 }
            },
            {
              range: { min: 86, max: 95 },
              customName: "Dimensional Transposition",
              effect: "D100: 86-95. All combatants inside and outside the storm are teleported randomly, swapping armor values and health percentages for 1 round.",
              effectConfig: { totalSwap: true, duration: 1 }
            },
            {
              range: { min: 96, max: 100 },
              customName: "Apocalypse Horizon",
              effect: "D100: 96-100. A micro-singularity blooms. Deals 15d10 force damage to all creatures within 30 feet, erasing all terrain features and summoning a Black Rift.",
              effectConfig: { damageFormula: "15d10", summonRift: true }
            }
          ]
        }
      },
      tags: ["chaos", "damage", "control", "rollable table", "chaos dice"],
      specialization: "chaos_dice"
    },

    // ============================================================
    // LEVEL 8 SPELLS
    // ============================================================
    { id : "chaos_weaver-entropy_control-entropy_plague",
      name: "Entropy Plague",
      description: "Inflict an intensely infectious molecular decay on a target. Deals necrotic damage over time, and spreads to adjacent targets whenever the infected target acts or suffers damage.",
      level: 8,
      icon: "Necrotic/Dark Poison Pool",
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Dark Poison Pool",
        tags: ["necrotic", "damage", "dot", "spread", "entropy control"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 12,
        classResource: { type: "mayhem", cost: -8 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      resolution: "DICE",
      damageConfig: {
        formula: "4d6 + intelligence",
        damageTypes: ["necrotic"],
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "plague_decay_dot",
            name: "Entropic Plague",
            description: "Deals 2d8 necrotic damage per turn, and shreds Armor by 2 per tick. Lasts 4 rounds. Spreads to anyone within 10 feet on tick.",
            statusEffect: {
              calculationType: "dice",
              diceCount: 2,
              diceType: "d8",
              damageType: "necrotic"
            }
          }
        ],
        durationValue: 4,
        durationUnit: "rounds"
      },
      tags: ["necrotic", "damage", "dot", "spread", "entropy control"],
      specialization: "entropy_control"
    },
    { id : "chaos_weaver-wild_magic-chaos_cascade",
      name: "Chaos Cascade",
      description: "Force three simultaneous spatial tears. You cast three random Level 1-3 Chaos Weaver spells in rapid succession at random targets within 60 feet. This accelerates your pressure gauge by +18 Mayhem.",
      level: 8,
      icon: "Nature/Nature Wild 1",
      spellType: "ACTION",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "chaos",
        icon: "Nature/Nature Wild 1",
        tags: ["chaos", "damage", "cascade", "multi-cast", "wild magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 60,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 2,
        mana: 15,
        classResource: { type: "mayhem", cost: -18 }, // Generates 18 Mayhem!
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      resolution: "AUTOMATIC",
      tags: ["chaos", "damage", "cascade", "multi-cast", "wild magic"],
      specialization: "wild_magic"
    },
    { id : "chaos_weaver-reality_bending-chaos_conduit",
      name: "Chaos Conduit",
      description: "Channel a massive, reality-bending beam of raw force in a 100ft line. The beam's elemental properties shift randomly at the start of each turn. Requires constant concentration.",
      level: 8,
      icon: "Force/Energy Core",
      spellType: "CHANNELED",
      effectTypes: ["damage"],
      typeConfig: {
        school: "chaos",
        icon: "Force/Energy Core",
        tags: ["beam", "channeled", "damage", "reality bending"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "line",
        areaSize: 100,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 1,
        mana: 8, // Per turn cost
        classResource: { type: "mayhem", cost: -4 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      channelingConfig: {
        type: "persistent",
        maxDuration: 4,
        durationUnit: "turns",
        interruptible: true,
        movementAllowed: false,
        costValue: 8,
        costType: "mana",
        costTrigger: "per_turn",
        baseFormula: "6d8 + intelligence",
        tickFrequency: "round",
        persistentRadius: 5,
        persistentEffectType: "beam"
      },
      resolution: "DICE",
      damageConfig: {
        formula: "6d8 + intelligence",
        damageTypes: ["force"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 17,
          saveOutcome: "half_damage"
        }
      },
      tags: ["beam", "channeled", "damage", "reality bending"],
      specialization: "reality_bending"
    },

    // ============================================================
    // LEVEL 9 SPELLS
    // ============================================================
    { id : "chaos_weaver-reality_bending-chaos_avatar",
      name: "Chaos Avatar",
      description: "Temporarily dissolve your physical anchor to become an Avatar of Living Chaos for 3 rounds. Gain flight, complete immunity to negative status effects, and automatically double all passive Mayhem spell amplification tiers.",
      level: 9,
      icon: "Void/Black Hole",
      spellType: "ACTION",
      effectTypes: ["buff"],
      typeConfig: {
        school: "chaos",
        icon: "Void/Black Hole",
        tags: ["transformation", "buff", "flight", "reality bending"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: {
        actionPoints: 2,
        mana: 16,
        classResource: { type: "mayhem", cost: -10 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "avatar_chaos_form",
            name: "Chaos Avatar",
            description: "Gain flight (speed 50), immune to all CC (stun, fear, silence, freeze), and spell damage is increased by +4d8.",
            statusEffect: {
              haste: { speedMultiplier: 1.5, extraActions: 1 }
            }
          }
        ],
        durationValue: 3,
        durationUnit: "rounds"
      },
      tags: ["transformation", "buff", "flight", "reality bending"],
      specialization: "reality_bending"
    },
    { id : "chaos_weaver-entropy_control-entropy_wave",
      name: "Entropy Wave",
      description: "Release a crushing ripple of molecular dissolution in a massive 50ft area. All structures and targets suffer immense necrotic and force damage, instantly crumbling their Armor to zero.",
      level: 9,
      icon: "Necrotic/Corrosive Beam",
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Corrosive Beam",
        tags: ["necrotic", "force", "damage", "area", "armor-erase", "entropy control"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaShape: "circle",
        areaSize: 50,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 2,
        mana: 18,
        classResource: { type: "mayhem", cost: -10 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      resolution: "DICE",
      damageConfig: {
        formula: "8d10 + intelligence",
        damageTypes: ["necrotic", "force"],
        resolution: "DICE",
        savingThrow: {
          ability: "strength",
          difficultyClass: 18,
          saveOutcome: "half_damage"
        }
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "armor_shatter_erase",
            name: "Molecular Collapse",
            description: "Sets target Armor to 0 and reduces all damage resistances by 50% for 3 rounds.",
            statModifier: {
              stat: "armor",
              magnitude: -50,
              magnitudeType: "flat"
            }
          }
        ],
        durationValue: 3,
        durationUnit: "rounds"
      },
      tags: ["necrotic", "force", "damage", "area", "armor-erase", "entropy control"],
      specialization: "entropy_control"
    },

    // ============================================================
    // LEVEL 10 SPELLS
    // ============================================================
    { id : "chaos_weaver-chaos_dice-table_mastery",
      name: "Table Mastery",
      description: "Passive capstone of Chaos Dice. Your command of probability becomes absolute. Whenever you roll on any rollable table, you can freely alter the final dice outcome up or down by up to 5 points to choose your result.",
      level: 10,
      icon: "Social/Dice Roll",
      spellType: "PASSIVE",
      effectTypes: ["passive"],
      typeConfig: {
        school: "chaos",
        icon: "Social/Dice Roll",
        tags: ["passive", "table-control", "chaos dice"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: {
        actionPoints: 0,
        mana: 0,
        classResource: { type: "mayhem", cost: 0 }
      },
      cooldownConfig: { cooldownType: "none", cooldownValue: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "table-control", "chaos dice"],
      specialization: "chaos_dice"
    },
    { id : "chaos_weaver-wild_magic-chaos_storm_ultimate",
      name: "Apocalypse Storm",
      description: "Forces absolute timeline compression in a 60ft area. Reality permanently shatters in the targeted sector, inflicting maximum apocalyptic chaos damage to all creatures and terrain. This generates a direct, immediate Wild Surge cascade.",
      level: 10,
      icon: "Void/Black Hole",
      spellType: "ACTION",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "chaos",
        icon: "Void/Black Hole",
        tags: ["chaos", "damage", "area", "apocalypse", "wild magic"],
        castTime: 2,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 120,
        areaShape: "circle",
        areaSize: 60,
        targetRestrictions: ["enemy", "ally"]
      },
      resourceCost: {
        actionPoints: 2,
        mana: 25,
        classResource: { type: "mayhem", cost: -30 }, // Generates 30 Mayhem!
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      resolution: "DICE",
      damageConfig: {
        formula: "12d10 + 20",
        damageTypes: ["chaos", "force"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 20,
          saveOutcome: "half_damage"
        }
      },
      tags: ["chaos", "damage", "area", "apocalypse", "wild magic"],
      specialization: "wild_magic"
    },
    { id : "chaos_weaver-entropy_control-entropy_master",
      name: "Decay Singularity",
      description: "The absolute zenith of entropic rot. Any enemy targeted by this spell who has less than 20% health is instantly disintegrated, their molecular bonds decaying to zero. If the target has more than 20% health, they take severe necrotic damage and Armor loss.",
      level: 10,
      icon: "Necrotic/Necrotic Hand Rising",
      spellType: "ACTION",
      effectTypes: ["damage"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Hand Rising",
        tags: ["necrotic", "damage", "execute", "entropy control"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"]
      },
      resourceCost: {
        actionPoints: 2,
        mana: 20,
        classResource: { type: "mayhem", cost: -10 },
        components: ["verbal", "somatic"]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      resolution: "DICE",
      damageConfig: {
        formula: "10d10",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 20,
          saveOutcome: "half_damage"
        }
      },
      tags: ["necrotic", "damage", "execute", "entropy control"],
      specialization: "entropy_control"
    },

    // ===== PASSIVE ABILITIES =====
    { id : "chaos_weaver_entropic_feedback",
      name: "Entropic Feedback",
      description: "When your Mayhem is above 50 (Tier II+), the magic burns you internally. All casts impose an operational friction check: a 10% fixed chance (rising to 25% at 80+ Mayhem) for the spell structure to collapse within your molecular matrix, dealing 2d6 force damage directly to your HP. This damage is a result of sheer temporal backlash and cannot be mitigated.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Force/Explosion Burst",
      effectTypes: ["passive"],
      typeConfig: {
        school: "arcane",
        icon: "Force/Explosion Burst",
        tags: ["passive", "chaos-weaver", "weakness"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { actionPoints: 0, mana: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "chaos-weaver", "weakness"]
    },
    { id : "chaos_weaver_chaos_anchor",
      name: "Chaos Anchor",
      description: "The interdimensional friction of your thinned vessel leaves your physical frame extremely brittle. At 61+ Mayhem, you suffer 25% physical bludgeoning and slashing vulnerability. At 81-99 Mayhem, this physical vulnerability rises to 50% as your molecular density drops.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Arcane/Magical Cross Emblem 2",
      effectTypes: ["passive"],
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Magical Cross Emblem 2",
        tags: ["passive", "chaos-weaver", "weakness"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { actionPoints: 0, mana: 0 },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "molecular_decay_debuff",
            name: "Anomalous Dissociation",
            description: "At high pressure, your molecular density drops, leaving you highly vulnerable to physical strikes.",
            statusEffect: {
              vulnerabilityType: "physical",
              vulnerabilityPercent: 50
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["passive", "chaos-weaver", "weakness"]
    },
    { id : "chaos_weaver_reality_fracture",
      name: "Reality Fracture",
      description: "Each time you trigger a d100 Master Wild Surge (Mayhem reaches 100), the massive spatial displacement shears your physical anchor. You take 2d10 necrotic damage, suffer Anomalous Dissociation (100% bludgeoning/slashing vulnerability) for 2 rounds, and permanently reduce your maximum mana by 2 until your next long rest.",
      level: 3,
      spellType: "PASSIVE",
      icon: "Void/Black Hole",
      effectTypes: ["passive"],
      typeConfig: {
        school: "arcane",
        icon: "Void/Black Hole",
        tags: ["passive", "chaos-weaver", "weakness"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { actionPoints: 0, mana: 0 },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "planar_displacement_vulnerability",
            name: "Anomalous Dissociation",
            description: "Total structural collapse: caster takes 100% increased bludgeoning and slashing damage.",
            statusEffect: {
              vulnerabilityType: "physical",
              vulnerabilityPercent: 100
            }
          }
        ]
      },
      resolution: "AUTOMATIC",
      tags: ["passive", "chaos-weaver", "weakness"]
    }
  ],

  // 5. Creation details
  characterCreation: {
    title: "Creating Your Chaos Weaver",
    content: `**Primary Stat**: Intelligence — your spell damage and Mayhem amplification scale with INT.
**Secondary Stat**: Spirit (for surviving the psychic backlashes of surges) or Constitution (to endure entropic self-damage).

**Starting Equipment**:
- **Flickering Arcane Focus** — An old chronometer whose gears turn backward
- **Threadbare Shroud** — Light clothing covered in weeping dark starlight
- **Entropy Dice** — Two pitch-black 10-sided dice for tracking Mayhem pressure
- **Fractured Grimoire** — Contains your 5 starting spells

**Onboarding Steps**:
1. **Learn the d100 Surge Table**: Memorize what happens when your pressure hits 100. It can turn the tide of battle or dissolve your tissue.
2. **Watch your Mayhem zones**:
   - Safe (0-40): Stable casts.
   - Escalating (41-60): +1 bonus die, 10% self-misfire chance.
   - Volatile (61-80): +2 bonus dice, +5ft radius, 25% self-misfire chance, 25% bludgeoning/slashing vulnerability.
   - Maximum (81-99): +3 bonus dice, +10ft radius, multi-target, 25% self-misfire chance, 50% bludgeoning/slashing vulnerability.
3. **Use Chaotic Infusion wisely**: It is your fastest resource accelerator, but forcing pressure through your marrow always comes with an entropic cost.
4. **Coordinate with your frontline**: High pressure thins your molecular weight, making you highly vulnerable to normal physical weapons. Keep a wall of steel between you and the enemy.`
  }
};
