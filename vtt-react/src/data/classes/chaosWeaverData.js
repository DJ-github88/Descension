// Chaos Weaver Class Data
// Provides example spells and level-based spell pools

export const CHAOS_WEAVER_DOCS = {
  className: 'Chaos Weaver',
  icon: 'Psychic/Mind Control',
  specializations: ['reality_bending', 'entropy_control', 'chaos_dice', 'wild_magic'],

  // Example spells showcasing the class's capabilities
  exampleSpells: [
    {
      id: 'chaos_weaver-chaos_dice-chaos_bolt',
      name: 'Chaos Bolt',
      description: 'Launch a bolt of pure chaotic energy that deals force damage to a target.',
      level: 1,
      icon: 'Arcane/Spellcasting Aura',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Spellcasting Aura',
        tags: ['chaos', 'damage']
      },
      damageTypes: ['force'],
      damageConfig: {
        formula: '1d8 + intelligence',
        elementType: 'force',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy']
      },
      resourceCost: {
        resourceTypes: ['mayhemGenerate', 'mana', 'actionPoints'],
        resourceValues: { mana: 3, actionPoints: 1 },
        resourceFormulas: { mayhemGenerate: '1d3' },
        useFormulas: { mayhemGenerate: true },
        components: ['verbal', 'somatic'],
        verbalText: 'Chaos!',
        somaticText: 'Gesture to launch chaotic bolt'
      },
      cooldownConfig: { type: 'turn_based', value: 1 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'chaos dice'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-chaos_dice-prismatic_chaos',
      name: 'Prismatic Chaos',
      description: 'Unleash a storm of prismatic energy with wildly unpredictable effects.',
      level: 3,
      icon: 'Arcane/Spellcasting Aura',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Spellcasting Aura',
        tags: ['chaos', 'damage', 'area', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Prismatic Chaos Effects',
        description: 'Roll on this table to determine the prismatic effect',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd33', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 3 }, customName: 'Red Prism', effect: 'Fire damage - 4d6 fire damage in 20ft radius', effectConfig: { damageFormula: '4d6', damageType: 'fire', areaShape: 'circle', areaRadius: 20 } },
          { range: { min: 4, max: 6 }, customName: 'Orange Prism', effect: 'Acid damage - 4d6 poison damage, reduces armor by 3 for 2 rounds', effectConfig: { damageFormula: '4d6', damageType: 'poison', armorReduction: 3, debuffDuration: 2 } },
          { range: { min: 7, max: 9 }, customName: 'Yellow Prism', effect: 'Lightning damage - 4d6 lightning damage, chains to 2 additional targets', effectConfig: { damageFormula: '4d6', damageType: 'lightning', chainTargets: 2 } },
          { range: { min: 10, max: 12 }, customName: 'Green Prism', effect: 'Poison damage - 4d6 poison damage, targets poisoned for 1 round', effectConfig: { damageFormula: '4d6', damageType: 'poison', poisonDuration: 1 } },
          { range: { min: 13, max: 15 }, customName: 'Blue Prism', effect: 'Frost damage - 4d6 frost damage, slows targets by 50% for 2 rounds', effectConfig: { damageFormula: '4d6', damageType: 'frost', slowAmount: 0.5, slowDuration: 2 } },
          { range: { min: 16, max: 18 }, customName: 'Indigo Prism', effect: 'Force damage - 4d6 force damage, knocks targets back 15 feet', effectConfig: { damageFormula: '4d6', damageType: 'force', knockbackDistance: 15 } },
          { range: { min: 19, max: 21 }, customName: 'Violet Prism', effect: 'Necrotic damage - 4d6 necrotic damage, heals caster for half damage dealt', effectConfig: { damageFormula: '4d6', damageType: 'necrotic', lifestealPercent: 0.5 } },
          { range: { min: 22, max: 24 }, customName: 'White Prism', effect: 'Radiant damage - 4d6 radiant damage, blinds targets for 1 round', effectConfig: { damageFormula: '4d6', damageType: 'radiant', blindDuration: 1 } },
          { range: { min: 25, max: 27 }, customName: 'Black Prism', effect: 'Necrotic damage - 4d6 necrotic damage, creates 20ft radius darkness for 2 rounds', effectConfig: { damageFormula: '4d6', damageType: 'necrotic', darknessRadius: 20, darknessDuration: 2 } },
          { range: { min: 28, max: 30 }, customName: 'Silver Prism', effect: 'Psychic damage - 4d6 psychic damage, confuses targets for 1 round', effectConfig: { damageFormula: '4d6', damageType: 'psychic', confuseDuration: 1 } },
          { range: { min: 31, max: 33 }, customName: 'Golden Prism', effect: 'Ultimate Chaos - Roll twice more and combine effects', effectConfig: { rollTwice: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 12, actionPoints: 2 },
        mayhemRequired: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'Prismatic chaos!',
        somaticText: 'Unleash prismatic energy'
      },
      cooldownConfig: { type: 'turn_based', value: 2 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'area', 'rollable table', 'chaos dice'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-chaos_dice-chaos_storm',
      name: 'Chaos Storm',
      description: 'Unleash a storm of chaotic energy that rolls on a d20 table for unpredictable effects.',
      level: 6,
      icon: 'Arcane/Spellcasting Aura',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Spellcasting Aura',
        tags: ['chaos', 'damage', 'control', 'chaos dice', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Chaos Storm Effects',
        description: 'The chaos storm manifests as one of these effects',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd20', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 3 }, customName: 'Backfire', effect: 'Spell rebounds - you take 3d8 force damage instead', effectConfig: { damageFormula: '3d8', damageType: 'force', selfDamage: true } },
          { range: { min: 4, max: 6 }, customName: 'Elemental Burst', effect: '4d8 random elemental damage in 15ft radius', effectConfig: { damageFormula: '4d8', damageType: 'elemental_random', areaShape: 'circle', areaRadius: 15 } },
          { range: { min: 7, max: 9 }, customName: 'Chaos Bolt Storm', effect: '5d6 force damage to up to 3 targets', effectConfig: { damageFormula: '5d6', damageType: 'force', targetCount: 3 } },
          { range: { min: 10, max: 12 }, customName: 'Reality Ripple', effect: '4d10 force damage + targets pushed 15ft', effectConfig: { damageFormula: '4d10', damageType: 'force', pushDistance: 15 } },
          { range: { min: 13, max: 15 }, customName: 'Entropy Wave', effect: '5d8 necrotic damage + targets slowed for 2 rounds', effectConfig: { damageFormula: '5d8', damageType: 'necrotic', slowDuration: 2 } },
          { range: { min: 16, max: 18 }, customName: 'Wild Surge', effect: '6d8 random damage + random teleport within 30ft', effectConfig: { damageFormula: '6d8', damageType: 'random', teleportRange: 30 } },
          { range: { min: 19, max: 20 }, customName: 'Chaos Overdrive', effect: '7d8 random damage to all enemies in 20ft radius + you gain 1d4 Mayhem', effectConfig: { damageFormula: '7d8', damageType: 'random', areaRadius: 20, mayhemGenerate: '1d4' } }
        ]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 18, actionPoints: 2 },
        mayhemRequired: 6,
        components: ['verbal', 'somatic'],
        verbalText: 'Chaos storm!',
        somaticText: 'Unleash chaotic energy'
      },
      cooldownConfig: { type: 'turn_based', value: 3 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'control', 'chaos dice', 'rollable table'],
      specialization: 'chaos_dice'
    }
  ],

  // Spell pools organized by character level
  spellPools: {
    1: [
      'chaos_weaver-chaos_dice-chaos_bolt',
      'chaos_weaver-reality_bending-reality_flicker',
      'chaos_weaver-entropy_control-entropic_touch',
      'chaos_weaver-shared-chaotic_infusion',
      'chaos_weaver-wild_magic-wild_surge'
    ],
    2: [
      'chaos_weaver-chaos_dice-chaos_bolt',
      'chaos_weaver-reality_bending-reality_flicker',
      'chaos_weaver-entropy_control-entropic_touch',
      'chaos_weaver-shared-chaotic_infusion',
      'chaos_weaver-wild_magic-wild_surge',
      'chaos_weaver-chaos_dice-chaotic_bolt',
      'chaos_weaver-reality_bending-dimensional_rift',
      'chaos_weaver-entropy_control-chaotic_decay'
    ],
    3: [
      'chaos_weaver-chaos_dice-prismatic_chaos',
      'chaos_weaver-reality_bending-fractured_realms',
      'chaos_weaver-entropy_control-chaos_burst'
    ],
    4: [
      'chaos_weaver-reality_bending-reality_swap',
      'chaos_weaver-entropy_control-chaos_wave',
      'chaos_weaver-chaos_dice-chaos_storm'
    ],
    5: [
      'chaos_weaver-entropy_control-discordant_strike',
      'chaos_weaver-wild_magic-pandemonic_pulse',
      'chaos_weaver-reality_bending-chaotic_reflection',
      'chaos_weaver-wild_magic-chaos_engine'
    ],
    6: [
      'chaos_weaver-reality_bending-reality_storm',
      'chaos_weaver-wild_magic-chaotic_eruption',
      'chaos_weaver-entropy_control-decay_cascade',
      'chaos_weaver-reality_bending-chaos_gate'
    ],
    7: [
      'chaos_weaver-wild_magic-chaos_nova',
      'chaos_weaver-chaos_dice-ultimate_chaos'
    ],
    8: [
      'chaos_weaver-entropy_control-entropy_plague',
      'chaos_weaver-wild_magic-chaos_cascade',
      'chaos_weaver-reality_bending-chaos_conduit'
    ],
    9: [
      'chaos_weaver-reality_bending-chaos_avatar',
      'chaos_weaver-entropy_control-entropy_wave'
    ],
    10: [
      'chaos_weaver-chaos_dice-table_mastery',
      'chaos_weaver-wild_magic-chaos_storm_ultimate',
      'chaos_weaver-entropy_control-entropy_master'
    ]
  }
};

/**
 * Chaos Weaver Class Data
 * 
 * Complete class information for the Chaos Weaver - a master of unpredictability
 * who harnesses chaotic magic and random effects for devastating results.
 */

export const CHAOS_WEAVER_DATA = {
  id: 'chaos-weaver',
  name: 'Chaos Weaver',
  icon: 'fas fa-dice',
  role: 'Damage',
  damageTypes: ['force', 'necrotic', 'chaos'],

  // Overview section
  overview: {
    title: 'The Chaos Weaver',
    subtitle: 'Master of Forbidden Entropy and Wild Magic',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Chaos Weaver fuels their magic through **Mayhem** (0-100). Every spell you cast generates a random amount of Mayhem (usually 1d4 or 1d6). As Mayhem builds, your spells become more powerful, but at 100 Mayhem, you trigger a **Wild Surge**—a random effect that could save your party or obliterate them. You can spend Mayhem to stabilize your spells or unleash devastating reality-bending ultimates.

**Core Mechanic**: Cast Spells → Generate Mayhem → Spend Mayhem on Ultimates → Manage the Redline (Avoid or embrace the 100 Mayhem Surge)

**Resource**: Mayhem (0-100, resets on Long Rest)

**Playstyle**: High-risk, high-reward burst damage. You are the ultimate wild card on the battlefield.

**Best For**: Players who love gambling, rollable tables, and seeing the DM's face when a spell goes wildly right (or wrong).`
    },

    description: `The Chaos Weaver is a master of unpredictability, wielding forces that even they cannot fully control. By tapping into the raw energy of entropy, they generate Mayhem with every cast. This volatile power can be shaped into reality-warping strikes or entropic waves, but pushing it to the limit risks a Wild Surge—a sudden eruption of uncontrolled magic.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Chaos Weavers are often individuals who have touched the void between realities or been marked by entropic entities. They carry strange artifacts—ever-shifting dice, jars of chaotic mist, or lenses that show fractured timelines—as their foci.

Their presence causes minor glitches in reality: shadows that move independently, small objects that hover, or the sound of distant whispering. At high Mayhem, their very form begins to flicker, trailing echoes of other possibilities.

Common archetypes:
- **The Accidental Conduit**: Never asked for this power, trying to control the storm.
- **The Entropy Scholar**: Believes order is a lie and chaos is the true state of the universe.
- **The Reality Fixer**: Uses chaos to "patch" holes in reality, often making things worse.
- **The Gambler**: Loves the rush of a Wild Surge and lives for the 1-in-100 payout.`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Surge',
      content: `**The Setup**: You are surrounded by three heavy guards. You have 85 Mayhem. You're deep in the "Redline."

**Turn 1**: You cast *Chaos Bolt*.
- **Mayhem Generation**: Roll 1d6 → [4] = 89 Mayhem.
- **Effect**: You deal 3d8 force damage. You're holding the storm.

**Turn 2**: You cast *Pandemonic Pulse*.
- **Mayhem Generation**: Roll 2d6 → [6, 6] = 12 → Total: 101 Mayhem!
- **WILD SURGE TRIGGERED**: You roll a d100 on the Surge Table.
- **Result**: [77] — *Time Distortion*. All enemies in 30ft are frozen in time for 1 round. You are ejected from the current timeline (Teleport 30ft).

**Victory**: The guards are frozen, you're safely away, and your Mayhem resets to 0. You've survived the redline... for now.`
    }
  },
  resourceSystem: {
    title: 'The Mayhem Engine',
    subtitle: 'Riding the Edge of Entropy',

    description: `Mayhem is a volatility gauge tracking the strain your magic places on reality. Every spell feeds the storm, increasing your potential for reality-warping power while pushing you closer to an uncontrollable Wild Surge. Mastery requires balancing on this entropic edge—knowing when to stabilize and when to let the chaos erupt.`,

    cards: [
      {
        title: 'Mayhem (0–100)',
        stats: 'Volatility Gauge',
        details: 'Generated by every spell cast. Higher Mayhem unlocks devastating Ultimates but brings you closer to the Redline.'
      },
      {
        title: 'Wild Surge',
        stats: 'The Redline Trigger',
        details: 'An uncontrollable magical eruption that occurs automatically at 100 Mayhem. Can be life-saving or catastrophic.'
      }
    ],

    generationTable: {
      headers: ['Trigger', 'Mayhem Change', 'Notes'],
      rows: [
        ['Cast Level 1–2 Spell', '+1d4', 'Minor ripples in the weave'],
        ['Cast Level 3+ Spell', '+2d6', 'Significant entropic disturbance'],
        ['Critical Hit', '+10', 'A moment of pure chaotic alignment'],
        ['Reality Bend / Spending', '-Variable', 'Stabilizing the timeline to avoid Surges'],
        ['Wild Surge Triggered', '→ Reset to 0', 'The pressure is released through a random effect']
      ]
    },

    usage: {
      momentum: 'High Mayhem fuels Ultimates like "Chaos Nova" or "Reality Storm". The closer you are to 100, the more "fuel" you have for reality-warping reality bends.',
      flourish: '⚠️ Stabilization: Use minor reality-bending abilities or specific talents to "bleed off" Mayhem if you are too close to 100 in a situation where a Surge would be dangerous.'
    },

    overheatRules: {
      title: 'Wild Surge Overdrive',
      content: `When Mayhem reaches 100, the dam breaks. The eruption is **immediate and unavoidable**.

**When you Surge:**
- **Roll 1d100** on the Master Wild Surge Table.
- **Immediate Resolution**: The effect manifests instantly, often ignoring your own resistances.
- **Total Reset**: After the effect resolves, Mayhem resets to 0.

**Advanced Play — Surge Baiting:**
Pushing to 100 deliberately when surrounded is a viable tactic. You gamble on an AoE blast or a defensive teleport to clear the area, sacrificing your resource pool for a high-impact random outcome.`
    },

    strategicConsiderations: {
      title: 'Gambling with the Void',
      content: `**Building (0–40 Mayhem)**: Focus on setup. You are safe from Surges here. Use this time to position and chip away at enemies.

**Power Zone (41–80 Mayhem)**: You have enough fuel for most utility bends. Start looking for high-value targets for your mid-tier spells.

**The Redline (81–99 Mayhem)**: Maximum power. Any action—even a reaction—could trigger a Surge. Ask: "If I cast this now and Surge, will it help or hurt my allies?"

**Surge Zone (100 Mayhem)**: The point of no return. The chaos erupts. If you aren't ready for a Surge, use a Stabilization ability before taking any other action.

**Advanced Play — Intentional Surge**: At 90+ Mayhem, deliberately cast a low-cost spell to force the Surge while in the middle of a pack of enemies.

**Worked Example (92 Mayhem, Surrounded by Minions)**:
- **Option A** — Chaos Nova (-40 Mayhem): Drops you to 52. Safe, reliable, high damage.
- **Option B** — Minor Spell (+1d4): Risks 96+ Mayhem. High risk of Surging next turn.
- **Option C** — Stabilization (-15 Mayhem): Drops to 77. Best if your health is low and you can't risk a bad Surge result.

→ **Best default**: Option A. Clear the board and reset your gauge to a manageable level.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `A clear glass jar and a handful of colorful beads capture the rising tension of Mayhem better than any number on a sheet.

**Required Materials**:
- **The Chaos Jar** — A glass jar or bowl to hold tokens (Mayhem)
- **100 Tokens** — Beads, coins, or d6s to track the 0-100 scale
- **The Surge Die** — A distinct, oversized d100

**Tracking Mayhem**:
- **Each +1 Mayhem** → Drop a token into the jar. The sound of the glass filling builds anticipation.
- **Each -1 Mayhem** → Remove tokens from the jar.
- **Reaching the Top** → When the jar is full (or reaches a pre-marked line), roll the Surge Die immediately.

**Quick Reference**:
\`\`\`
MAYHEM SCALE (0-100):
  0–40   | Safe Zone (Setup)
  41–80  | Power Zone (Utility Bends)
  81–99  | Redline (Danger / High Power)
  100    | WILD SURGE (Roll d100, Reset to 0)

GENERATION:
  Lvl 1-2: +1d4 | Lvl 3+: +2d6 | Crit: +10
  Stabilization: -Variable
\`\`\`

**The Physical Hack (Friction Points)**:
- **The Surge Prop**: Place the d100 in the center of the table. Every time you cast a spell, nudge it closer to yourself. It warns the other players that a reality-warp is coming.
- **Reality Coin**: Use a physical coin. Flip it when you spend Mayhem to stabilize a spell; Heads you stabilize, Tails the chaos persists (lose the Mayhem but generation roll is doubled).

**Pro Tips**:
- Use a dedicated "Chaos Die" (different color) for Mayhem rolls so you can roll it with your damage dice.
- Don't count the tokens every turn; mark the jar at 25, 50, 75, and 100 for easy visual reference.`
    }
  },

  // Spell Pools - organized by character level
  spellPools: {
    1: [
      'chaos_weaver-chaos_dice-chaos_bolt',
      'chaos_weaver-reality_bending-reality_flicker',
      'chaos_weaver-entropy_control-entropic_touch',
      'chaos_weaver-shared-chaotic_infusion',
      'chaos_weaver-wild_magic-wild_surge'
    ],
    2: [
      'chaos_weaver-chaos_dice-chaos_bolt',
      'chaos_weaver-reality_bending-reality_flicker',
      'chaos_weaver-entropy_control-entropic_touch',
      'chaos_weaver-shared-chaotic_infusion',
      'chaos_weaver-wild_magic-wild_surge',
      'chaos_weaver-chaos_dice-chaotic_bolt',
      'chaos_weaver-reality_bending-dimensional_rift',
      'chaos_weaver-entropy_control-chaotic_decay'
    ]
  },

  // Spells - organized by level, properly formatted for wizard
  spells: [
    // ========================================
    // LEVEL 1 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-chaos_dice-chaos_bolt',
      name: 'Chaos Bolt',
      description: 'A crackling bolt of condensed chaos — straightforward force damage that feeds your Mayhem pool.',
      level: 1,
      icon: 'Arcane/Spellcasting Aura',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Spellcasting Aura',
        tags: ['chaos', 'damage']
      },
      damageTypes: ['force'],
      damageConfig: {
        formula: '1d8 + intelligence',
        elementType: 'force',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy']
      },
      resourceCost: {
        resourceTypes: ['mayhemGenerate', 'mana', 'actionPoints'],
        resourceValues: { mana: 3, actionPoints: 1 },
        resourceFormulas: { mayhemGenerate: '1d3' },
        useFormulas: { mayhemGenerate: true },
        components: ['verbal', 'somatic'],
        verbalText: 'Chaos!',
        somaticText: 'Launch chaotic bolt'
      },
      cooldownConfig: { type: 'turn_based', value: 1 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'chaos dice'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-reality_bending-reality_flicker',
      name: 'Reality Flicker',
      description: 'Slip between dimensions for a heartbeat — become ghostly, pass through walls, and ignore non-magical attacks for 1 round.',
      level: 1,
      icon: 'Arcane/Quick Step',
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Quick Step',
        tags: ['chaos', 'defense']
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{ id: 'incorporeal', name: 'Incorporeal', description: 'You become incorporeal for 1 round. You can move through objects and are immune to non-magical attacks.', mechanicsText: 'Incorporeal for 1 round. Can move through objects. Immune to non-magical attacks.' }],
        durationType: 'rounds',
        durationValue: 1,
        durationUnit: 'rounds',
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mayhemGenerate', 'mana', 'actionPoints'],
        resourceValues: { mana: 2, actionPoints: 1 },
        resourceFormulas: { mayhemGenerate: '1d2' },
        useFormulas: { mayhemGenerate: true },
        components: ['verbal', 'somatic'],
        verbalText: 'Reality bends!',
        somaticText: 'Flicker between dimensions'
      },
      cooldownConfig: { type: 'turn_based', value: 2 },
      resolution: 'DICE',
      tags: ['chaos', 'defense', 'reality bending'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-entropy_control-entropic_touch',
      name: 'Entropic Touch',
      description: 'Rot your target\'s defenses — necrotic damage that carves away armor for 3 rounds.',
      level: 1,
      icon: 'Radiant/Radiant Divinity',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'Radiant/Radiant Divinity',
        tags: ['chaos', 'entropy', 'debuff', 'damage', 'necrotic', 'entropy control']
      },
      damageTypes: ['necrotic'],
      damageConfig: {
        formula: '1d6 + intelligence',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false
      },
      debuffConfig: {
        debuffType: 'statReduction',
        effects: [{
          id: 'armor_reduction',
          name: 'Armor Reduction',
          description: '-1 Armor for 3 Rounds',
          statModifier: {
            stat: 'armor',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }],
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds',
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy']
      },
      resourceCost: {
        resourceTypes: ['mayhemGenerate', 'mana', 'actionPoints'],
        resourceValues: { mana: 4, actionPoints: 1 },
        resourceFormulas: { mayhemGenerate: '1d3' },
        useFormulas: { mayhemGenerate: true },
        components: ['verbal', 'somatic'],
        verbalText: 'Decay!',
        somaticText: 'Touch target with entropic energy'
      },
      cooldownConfig: { type: 'turn_based', value: 1 },
      resolution: 'DICE',
      tags: ['chaos', 'entropy', 'debuff', 'damage', 'necrotic', 'entropy control'],
      specialization: 'entropy_control'
    },
    {
      id: 'chaos_weaver-shared-chaotic_infusion',
      name: 'Chaotic Infusion',
      description: 'Draw raw chaos into yourself, converting it into usable Mayhem. No damage — pure resource generation.',
      level: 1,
      icon: 'Arcane/Spellcasting Aura',
      spellType: 'ACTION',
      effectTypes: ['utility'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Spellcasting Aura',
        tags: ['chaos', 'utility', 'mayhem', 'resource']
      },
      utilityConfig: {
        utilityType: 'resource',
        subtype: 'mayhem_generation',
        description: 'Generate 1d4 Mayhem Modifiers',
        power: 'minor',
        resourceGain: '1d4',
        resourceType: 'mayhem',
        charges: 1
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mayhemGenerate', 'mana', 'actionPoints'],
        resourceValues: { mana: 4, actionPoints: 1 },
        resourceFormulas: { mayhemGenerate: '1d4' },
        useFormulas: { mayhemGenerate: true },
        components: ['somatic'],
        somaticText: 'Draw chaos into your body'
      },
      cooldownConfig: { type: 'turn_based', value: 1 },
      resolution: 'DICE',
      tags: ['chaos', 'utility', 'mayhem', 'resource'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-wild_magic-wild_surge',
      name: 'Wild Surge',
      description: 'Pierce the veil of order and let raw magic bleed through — the surge generates Mayhem and triggers a random wild effect.',
      level: 1,
      icon: 'Nature/Nature Wild 1',
      spellType: 'ACTION',
      effectTypes: ['damage', 'utility'],
      typeConfig: {
        school: 'chaos',
        icon: 'Nature/Nature Wild 1',
        tags: ['chaos', 'damage', 'utility', 'wild magic', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Wild Surge Effects',
        description: 'Raw magic bleeds through in one of these forms',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd6', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 1 }, customName: 'Arcane Spark', effect: '1d8 force damage to a random enemy within 30ft', effectConfig: { damageFormula: '1d8', damageType: 'force', randomTarget: true, range: 30 } },
          { range: { min: 2, max: 2 }, customName: 'Chaotic Heal', effect: 'Heal yourself for 1d8', effectConfig: { healingFormula: '1d8' } },
          { range: { min: 3, max: 3 }, customName: 'Entropy Flash', effect: '1d6 necrotic damage to target + generate 1 extra Mayhem', effectConfig: { damageFormula: '1d6', damageType: 'necrotic', mayhemBonus: 1 } },
          { range: { min: 4, max: 4 }, customName: 'Planar Echo', effect: 'Teleport yourself 10ft in a random direction', effectConfig: { teleportDistance: 10, randomDirection: true } },
          { range: { min: 5, max: 5 }, customName: 'Magic Surge', effect: 'Generate 2 extra Mayhem Modifiers', effectConfig: { mayhemBonus: 2 } },
          { range: { min: 6, max: 6 }, customName: 'Wild Echo', effect: 'Roll twice on this table and apply both effects', effectConfig: { rollTwice: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mayhemGenerate', 'mana', 'actionPoints'],
        resourceValues: { mana: 3, actionPoints: 1 },
        resourceFormulas: { mayhemGenerate: '1d2' },
        useFormulas: { mayhemGenerate: true },
        components: ['verbal', 'somatic'],
        verbalText: 'Let it surge!',
        somaticText: 'Tear open the magical veil'
      },
      cooldownConfig: { type: 'turn_based', value: 1 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'utility', 'wild magic', 'rollable table'],
      specialization: 'wild_magic'
    },
    {
      id: 'chaos_weaver-chaos_dice-chaotic_bolt',
      name: 'Chaotic Bolt',
      description: 'A bolt that refuses to behave — each cast rolls a d20 to determine if it forks, explodes, pierces armor, or warps reality.',
      level: 2,
      icon: 'Arcane/Spellcasting Aura',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Spellcasting Aura',
        tags: ['chaos', 'damage', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Chaotic Bolt Effects',
        description: 'Roll on this table to determine the bolt\'s effect',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd20', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 3 }, customName: 'Weak Bolt', effect: 'Deal 2d6 force damage to target', effectConfig: { damageFormula: '2d6', damageType: 'force' } },
          { range: { min: 4, max: 6 }, customName: 'Forking Bolt', effect: 'Deal 2d6 force damage and strike an additional random enemy within range', effectConfig: { damageFormula: '2d6', damageType: 'force', chainCount: 1 } },
          { range: { min: 7, max: 9 }, customName: 'Exploding Bolt', effect: 'Deal 3d6 force damage in 10ft radius', effectConfig: { damageFormula: '3d6', damageType: 'force', areaShape: 'circle', areaRadius: 10 } },
          { range: { min: 10, max: 12 }, customName: 'Piercing Bolt', effect: 'Deal 2d6 force damage, ignores 50% of armor', effectConfig: { damageFormula: '2d6', damageType: 'force', armorPenetration: 0.5 } },
          { range: { min: 13, max: 15 }, customName: 'Arcane Surge', effect: 'Deal 3d6 force damage, gain +2 Mayhem Modifiers', effectConfig: { damageFormula: '3d6', damageType: 'force', mayhemBonus: 2 } },
          { range: { min: 16, max: 18 }, customName: 'Reality Rift', effect: 'Deal 2d6 force damage, teleport target 15 feet', effectConfig: { damageFormula: '2d6', damageType: 'force', teleportDistance: 15 } },
          { range: { min: 19, max: 19 }, customName: 'Chaos Nova', effect: 'Deal 4d6 force damage to all enemies within 20ft', effectConfig: { damageFormula: '4d6', damageType: 'force', areaShape: 'circle', areaRadius: 20 } },
          { range: { min: 20, max: 20 }, customName: 'Reality Storm', effect: 'Deal 3d6 force damage, random secondary effect (roll d6: 1=knockback, 2=stun, 3=burn, 4=freeze, 5=disarm, 6=heal caster)', effectConfig: { damageFormula: '3d6', damageType: 'force', secondaryEffect: 'random' } }
        ]
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemy']
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 6, actionPoints: 1 },
        mayhemRequired: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Wild bolt!',
        somaticText: 'Cast unpredictable chaos bolt'
      },
      cooldownConfig: { type: 'turn_based', value: 1 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'rollable table', 'chaos dice'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-reality_bending-dimensional_rift',
      name: 'Dimensional Rift',
      description: 'Tear a hole in space and shove your target through it — they reappear up to 20ft away, disoriented.',
      level: 2,
      icon: 'Arcane/Open Portal',
      spellType: 'ACTION',
      effectTypes: ['control'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Open Portal',
        tags: ['chaos', 'control', 'reality bending', 'forced movement']
      },
      controlConfig: {
        controlType: 'forcedMovement',
        strength: 'moderate',
        duration: 0,
        durationUnit: 'instant',
        saveDC: 13,
        saveType: 'strength',
        saveOutcome: 'negates',
        savingThrow: true,
        effects: [{
          id: 'teleport',
          name: 'Teleport',
          description: 'Teleport the target up to 20 feet in any direction',
          config: {
            movementType: 'teleport',
            distance: 20,
            saveDC: 14,
            saveType: 'dexterity'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy']
      },
      resourceCost: {
        resourceTypes: ['mayhemGenerate', 'mana', 'actionPoints'],
        resourceValues: { mana: 5, actionPoints: 1 },
        resourceFormulas: { mayhemGenerate: '1d3' },
        useFormulas: { mayhemGenerate: true },
        components: ['verbal', 'somatic'],
        verbalText: 'Reality shift!',
        somaticText: 'Gesture to teleport target'
      },
      cooldownConfig: { type: 'turn_based', value: 2 },
      resolution: 'DICE',
      tags: ['chaos', 'control', 'forced movement', 'reality bending'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-entropy_control-chaotic_decay',
      name: 'Chaotic Decay',
      description: 'Accelerate entropy in a target — necrotic damage that shreds both strength and armor. Crits spread decay to nearby foes.',
      level: 2,
      icon: 'Radiant/Radiant Divinity',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'Radiant/Radiant Divinity',
        tags: ['chaos', 'damage', 'debuff', 'entropy', 'entropy control']
      },
      damageTypes: ['necrotic'],
      damageConfig: {
        formula: '2d6 + intelligence',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: '1d6',
          critEffects: ['entropy_spread'],
          entropySpreadConfig: {
            radius: 10,
            damageFormula: '1d4',
            damageType: 'necrotic'
          }
        }
      },
      debuffConfig: {
        debuffType: 'statReduction',
        effects: [
          {
            id: 'strength_reduction',
            name: 'Strength Reduction',
            description: '-2 Strength',
            statModifier: {
              stat: 'strength',
              magnitude: 2,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'armor_reduction',
            name: 'Armor Reduction',
            description: '-2 Armor for 3 Rounds',
            statModifier: {
              stat: 'armor',
              magnitude: 2,
              magnitudeType: 'flat'
            }
          }
        ],
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds',
        saveDC: 14,
        saveType: 'constitution',
        saveOutcome: 'negates'
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['enemy']
      },
      resourceCost: {
        resourceTypes: ['mayhemGenerate', 'mana', 'actionPoints'],
        resourceValues: { mana: 7, actionPoints: 1 },
        resourceFormulas: { mayhemGenerate: '1d4' },
        useFormulas: { mayhemGenerate: true },
        components: ['verbal', 'somatic'],
        verbalText: 'Decay!',
        somaticText: 'Channel entropic decay'
      },
      cooldownConfig: { type: 'turn_based', value: 2 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'debuff', 'entropy control'],
      specialization: 'entropy_control'
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-chaos_dice-prismatic_chaos',
      name: 'Prismatic Chaos',
      description: 'A kaleidoscope of destruction — roll a d33 to unleash fire, frost, lightning, necrotic, radiant, psychic, or pure golden chaos across a 20ft zone.',
      level: 3,
      icon: 'Arcane/Spellcasting Aura',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Spellcasting Aura',
        tags: ['chaos', 'damage', 'area', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Prismatic Chaos Effects',
        description: 'Roll on this table to determine the prismatic effect',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd33', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 3 }, customName: 'Red Prism', effect: 'Fire damage - 4d6 fire damage in 20ft radius', effectConfig: { damageFormula: '4d6', damageType: 'fire', areaShape: 'circle', areaRadius: 20 } },
          { range: { min: 4, max: 6 }, customName: 'Orange Prism', effect: 'Acid damage - 4d6 poison damage, reduces armor by 3 for 2 rounds', effectConfig: { damageFormula: '4d6', damageType: 'poison', armorReduction: 3, debuffDuration: 2 } },
          { range: { min: 7, max: 9 }, customName: 'Yellow Prism', effect: 'Lightning damage - 4d6 lightning damage, chains to 2 additional targets', effectConfig: { damageFormula: '4d6', damageType: 'lightning', chainTargets: 2 } },
          { range: { min: 10, max: 12 }, customName: 'Green Prism', effect: 'Poison damage - 4d6 poison damage, targets poisoned for 1 round', effectConfig: { damageFormula: '4d6', damageType: 'poison', poisonDuration: 1 } },
          { range: { min: 13, max: 15 }, customName: 'Blue Prism', effect: 'Frost damage - 4d6 frost damage, slows targets by 50% for 2 rounds', effectConfig: { damageFormula: '4d6', damageType: 'frost', slowAmount: 0.5, slowDuration: 2 } },
          { range: { min: 16, max: 18 }, customName: 'Indigo Prism', effect: 'Force damage - 4d6 force damage, knocks targets back 15 feet', effectConfig: { damageFormula: '4d6', damageType: 'force', knockbackDistance: 15 } },
          { range: { min: 19, max: 21 }, customName: 'Violet Prism', effect: 'Necrotic damage - 4d6 necrotic damage, heals caster for half damage dealt', effectConfig: { damageFormula: '4d6', damageType: 'necrotic', lifestealPercent: 0.5 } },
          { range: { min: 22, max: 24 }, customName: 'White Prism', effect: 'Radiant damage - 4d6 radiant damage, blinds targets for 1 round', effectConfig: { damageFormula: '4d6', damageType: 'radiant', blindDuration: 1 } },
          { range: { min: 25, max: 27 }, customName: 'Black Prism', effect: 'Necrotic damage - 4d6 necrotic damage, creates 20ft radius darkness for 2 rounds', effectConfig: { damageFormula: '4d6', damageType: 'necrotic', darknessRadius: 20, darknessDuration: 2 } },
          { range: { min: 28, max: 30 }, customName: 'Silver Prism', effect: 'Psychic damage - 4d6 psychic damage, confuses targets for 1 round', effectConfig: { damageFormula: '4d6', damageType: 'psychic', confuseDuration: 1 } },
          { range: { min: 31, max: 33 }, customName: 'Golden Prism', effect: 'Ultimate Chaos - Roll twice more and combine effects', effectConfig: { rollTwice: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 12, actionPoints: 2 },
        mayhemRequired: 4,
        components: ['verbal', 'somatic'],
        verbalText: 'Prismatic chaos!',
        somaticText: 'Unleash prismatic energy'
      },
      cooldownConfig: { type: 'turn_based', value: 2 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'area', 'rollable table', 'chaos dice'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-reality_bending-fractured_realms',
      name: 'Fractured Realms',
      description: 'Shatter the boundary between planes — fire, ice, void, or storm rifts tear open in a 15ft zone, each with different hazards.',
      level: 3,
      icon: 'Arcane/Open Portal',
      spellType: 'ACTION',
      effectTypes: ['control', 'damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Open Portal',
        tags: ['chaos', 'control', 'reality bending', 'rollable table', 'terrain']
      },
      rollableTable: {
        enabled: true,
        name: 'Planar Rift Effects',
        description: 'Roll on this table to determine the planar rift effect',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd20', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 4 }, customName: 'Fire Rift', effect: 'Creates 3d6 fire damage area that persists for 2 rounds', effectConfig: { damageFormula: '3d6', damageType: 'fire', duration: 2, areaShape: 'circle', areaRadius: 10 } },
          { range: { min: 5, max: 8 }, customName: 'Ice Rift', effect: 'Freezes ground, creating difficult terrain and 2d6 frost damage per turn', effectConfig: { damageFormula: '2d6', damageType: 'frost', terrainType: 'ice', duration: 3 } },
          { range: { min: 9, max: 12 }, customName: 'Void Rift', effect: 'Teleports all creatures in area to random locations within 30 feet', effectConfig: { teleportRadius: 30 } },
          { range: { min: 13, max: 16 }, customName: 'Storm Rift', effect: 'Creates lightning storm, 3d6 lightning damage to random targets each round for 2 rounds', effectConfig: { damageFormula: '3d6', damageType: 'lightning', duration: 2, randomTargets: true } },
          { range: { min: 17, max: 19 }, customName: 'Healing Rift', effect: 'Restorative energies heal allies in area for 3d6 each round for 2 rounds', effectConfig: { healingFormula: '3d6', duration: 2, targetAllies: true } },
          { range: { min: 20, max: 20 }, customName: 'Chaos Rift', effect: 'Roll on Wild Magic Surge table for area effect', effectConfig: { wildMagicSurge: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 10, actionPoints: 2 },
        mayhemRequired: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Realms fracture!',
        somaticText: 'Shatter reality boundaries'
      },
      cooldownConfig: { type: 'turn_based', value: 3 },
      resolution: 'DICE',
      tags: ['chaos', 'control', 'terrain', 'reality bending', 'rollable table'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-entropy_control-chaos_burst',
      name: 'Chaos Burst',
      description: 'An explosion of entropic energy — each burst randomly corrupts, poisons, blinds, or collapses matter with double-damage void hits.',
      level: 3,
      icon: 'Radiant/Radiant Divinity',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'Radiant/Radiant Divinity',
        tags: ['chaos', 'damage', 'debuff', 'entropy control', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Chaos Burst Effects',
        description: 'Roll on this table to determine the burst effect',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd12', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 2 }, customName: 'Necrotic Burst', effect: '5d6 necrotic damage, reduces strength by 3 for 2 rounds', effectConfig: { damageFormula: '5d6', damageType: 'necrotic', statReduction: 'strength', reductionAmount: 3, debuffDuration: 2 } },
          { range: { min: 3, max: 4 }, customName: 'Acid Burst', effect: '5d6 poison damage, reduces armor by 4 for 3 rounds', effectConfig: { damageFormula: '5d6', damageType: 'poison', statReduction: 'armor', reductionAmount: 4, debuffDuration: 3 } },
          { range: { min: 5, max: 6 }, customName: 'Poison Burst', effect: '4d6 poison damage, poisons targets (2d6 poison damage per turn for 3 rounds)', effectConfig: { damageFormula: '4d6', damageType: 'poison', dotFormula: '2d6', dotDuration: 3 } },
          { range: { min: 7, max: 8 }, customName: 'Shadow Burst', effect: '5d6 necrotic damage, blinds targets for 2 rounds', effectConfig: { damageFormula: '5d6', damageType: 'necrotic', blindDuration: 2 } },
          { range: { min: 9, max: 10 }, customName: 'Chaos Burst', effect: '4d6 random damage type, random debuff (roll d4: 1=slow, 2=weaken, 3=confuse, 4=stun)', effectConfig: { damageFormula: '4d6', damageType: 'random', randomDebuff: true } },
          { range: { min: 11, max: 12 }, customName: 'Void Burst', effect: '6d6 necrotic damage, targets make Constitution save or take double damage', effectConfig: { damageFormula: '6d6', damageType: 'necrotic', saveType: 'constitution', doubleDamage: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 9, actionPoints: 2 },
        mayhemRequired: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Chaos burst!',
        somaticText: 'Release entropic burst'
      },
      cooldownConfig: { type: 'turn_based', value: 2 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'debuff', 'entropy control', 'rollable table'],
      specialization: 'entropy_control'
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-reality_bending-reality_swap',
      name: 'Reality Swap',
      description: 'Scramble everyone\'s position — all creatures in a 20ft zone are randomly teleported, swapping places in an instant.',
      level: 4,
      icon: 'Arcane/Quick Step',
      spellType: 'ACTION',
      effectTypes: ['control'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Quick Step',
        tags: ['chaos', 'control', 'reality bending', 'forced movement']
      },
      controlConfig: {
        controlType: 'forcedMovement',
        strength: 'strong',
        duration: 0,
        durationUnit: 'instant',
        saveDC: 15,
        saveType: 'charisma',
        saveOutcome: 'negates',
        savingThrow: true,
        effects: [{
          id: 'swap',
          name: 'Position Swap',
          description: 'Swap positions with all creatures in the area randomly',
          config: {
            movementType: 'swap',
            randomSwap: true,
            saveDC: 15,
            saveType: 'dexterity'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 14, actionPoints: 2 },
        mayhemRequired: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Reality swap!',
        somaticText: 'Swap positions with gesture'
      },
      cooldownConfig: { type: 'turn_based', value: 3 },
      resolution: 'DICE',
      tags: ['chaos', 'control', 'forced movement', 'reality bending'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-entropy_control-chaos_wave',
      name: 'Chaos Wave',
      description: 'A cone of entropic decay that strips strength, constitution, and armor from everyone caught in its path.',
      level: 4,
      icon: 'Radiant/Radiant Divinity',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'Radiant/Radiant Divinity',
        tags: ['chaos', 'damage', 'debuff', 'entropy control']
      },
      damageTypes: ['necrotic'],
      damageConfig: {
        formula: '6d6 + intelligence * 1.5',
        elementType: 'necrotic',
        damageType: 'area',
        areaShape: 'cone',
        areaParameters: { length: 40 },
        canCrit: true,
        critMultiplier: 2
      },
      debuffConfig: {
        debuffType: 'statReduction',
        effects: [
          {
            id: 'strength_reduction',
            name: 'Strength Reduction',
            description: '-3 Strength',
            statModifier: {
              stat: 'strength',
              magnitude: 3,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'constitution_reduction',
            name: 'Constitution Reduction',
            description: '-3 Constitution',
            statModifier: {
              stat: 'constitution',
              magnitude: 3,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'armor_reduction',
            name: 'Armor Reduction',
            description: '-4 Armor for 4 Rounds',
            statModifier: {
              stat: 'armor',
              magnitude: 4,
              magnitudeType: 'flat'
            }
          }
        ],
        durationType: 'rounds',
        durationValue: 4,
        durationUnit: 'rounds',
        saveDC: 16,
        saveType: 'constitution',
        saveOutcome: 'negates'
      },
      targetingConfig: {
        targetingType: 'cone',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeShape: 'cone',
        aoeParameters: { length: 40 }
      },
      resourceCost: {
        resourceTypes: ['mayhemGenerate', 'mana', 'actionPoints'],
        resourceValues: { mana: 16, actionPoints: 2 },
        resourceFormulas: { mayhemGenerate: '2d4' },
        useFormulas: { mayhemGenerate: true },
        components: ['verbal', 'somatic'],
        verbalText: 'Chaos wave!',
        somaticText: 'Unleash wave of entropy'
      },
      cooldownConfig: { type: 'turn_based', value: 3 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'debuff', 'entropy control'],
      specialization: 'entropy_control'
    },
    {
      id: 'chaos_weaver-chaos_dice-chaos_storm',
      name: 'Chaos Storm',
      description: 'THE signature spell — a d100 table of catastrophe. Minor storms, void, fire, frost, entropy, or reality apocalypse await.',
      level: 4,
      icon: 'Arcane/Spellcasting Aura',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Spellcasting Aura',
        tags: ['chaos', 'damage', 'storm', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Chaos Storm Effects',
        description: 'The storm unleashes one of these catastrophic effects',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd100', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 10 }, customName: 'Minor Storm', effect: '6d6 random damage in 25ft radius', effectConfig: { damageFormula: '6d6', damageType: 'random', areaShape: 'circle', areaRadius: 25 } },
          { range: { min: 11, max: 20 }, customName: 'Lightning Storm', effect: '8d6 lightning damage, chains between all targets', effectConfig: { damageFormula: '8d6', damageType: 'lightning', chainAll: true } },
          { range: { min: 21, max: 30 }, customName: 'Fire Storm', effect: '7d6 fire damage, leaves burning areas (2d6 fire damage per turn)', effectConfig: { damageFormula: '7d6', damageType: 'fire', burningAreas: true, burnDamage: '2d6' } },
          { range: { min: 31, max: 40 }, customName: 'Frost Storm', effect: '7d6 frost damage, freezes ground for 3 rounds', effectConfig: { damageFormula: '7d6', damageType: 'frost', freezeDuration: 3 } },
          { range: { min: 41, max: 50 }, customName: 'Void Storm', effect: 'Mass teleport - all creatures in area teleported randomly within 60 feet', effectConfig: { teleportRadius: 60 } },
          { range: { min: 51, max: 60 }, customName: 'Chaos Storm', effect: '9d6 random damage type in 30ft radius + random terrain change', effectConfig: { damageFormula: '9d6', damageType: 'random', areaShape: 'circle', areaRadius: 30, terrainChange: true } },
          { range: { min: 61, max: 70 }, customName: 'Reality Storm', effect: '6d6 force damage + random reality effect (time acceleration, gravity change, etc.)', effectConfig: { damageFormula: '6d6', damageType: 'force', realityEffect: 'random' } },
          { range: { min: 71, max: 80 }, customName: 'Entropy Storm', effect: '8d6 necrotic damage, all targets have armor reduced by 6 for 4 rounds', effectConfig: { damageFormula: '8d6', damageType: 'necrotic', armorReduction: 6, debuffDuration: 4 } },
          { range: { min: 81, max: 90 }, customName: 'Primal Storm', effect: '10d6 random elemental damage in 35ft radius', effectConfig: { damageFormula: '10d6', damageType: 'elemental_random', areaShape: 'circle', areaRadius: 35 } },
          { range: { min: 91, max: 95 }, customName: 'Cataclysmic Storm', effect: '12d6 random damage + all creatures make DC 18 save or stunned for 1 round', effectConfig: { damageFormula: '12d6', damageType: 'random', stunSaveDC: 18 } },
          { range: { min: 96, max: 100 }, customName: 'Reality Apocalypse', effect: '15d6 random damage in 40ft radius + random planar rift opens', effectConfig: { damageFormula: '15d6', damageType: 'random', areaShape: 'circle', areaRadius: 40, planarRift: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 18, actionPoints: 2 },
        mayhemRequired: 6,
        components: ['verbal', 'somatic'],
        verbalText: 'Chaos storm!',
        somaticText: 'Unleash catastrophic storm'
      },
      cooldownConfig: { type: 'turn_based', value: 4 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'storm', 'chaos dice', 'rollable table'],
      specialization: 'chaos_dice'
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-entropy_control-discordant_strike',
      name: 'Discordant Strike',
      description: 'Infuse your weapon with a random element — necrotic, acid, lightning, fire, or pure chaos — each with a different附加 effect.',
      level: 5,
      icon: 'Radiant/Radiant Divinity',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'Radiant/Radiant Divinity',
        tags: ['chaos', 'damage', 'weapon', 'entropy control', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Discordant Strike Effects',
        description: 'Your weapon strike produces one of these effects',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd10', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 2 }, customName: 'Necrotic Strike', effect: 'Weapon deals +4d6 necrotic damage, target poisoned', effectConfig: { damageFormula: '4d6', damageType: 'necrotic', poisonEffect: true } },
          { range: { min: 3, max: 4 }, customName: 'Acid Strike', effect: 'Weapon deals +4d6 poison damage, reduces armor by 3', effectConfig: { damageFormula: '4d6', damageType: 'poison', armorReduction: 3 } },
          { range: { min: 5, max: 6 }, customName: 'Lightning Strike', effect: 'Weapon deals +4d6 lightning damage, chains to nearby enemy', effectConfig: { damageFormula: '4d6', damageType: 'lightning', chainTarget: true } },
          { range: { min: 7, max: 8 }, customName: 'Fire Strike', effect: 'Weapon deals +4d6 fire damage, target burns for 2d6 per turn', effectConfig: { damageFormula: '4d6', damageType: 'fire', burnDamage: '2d6' } },
          { range: { min: 9, max: 10 }, customName: 'Chaos Strike', effect: 'Weapon deals +6d6 random damage type, random secondary effect', effectConfig: { damageFormula: '6d6', damageType: 'random', secondaryEffect: 'random' } }
        ]
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 12, actionPoints: 1 },
        mayhemRequired: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Discordant strike!',
        somaticText: 'Infuse weapon with chaos'
      },
      cooldownConfig: { type: 'turn_based', value: 2 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'weapon', 'entropy control', 'rollable table'],
      specialization: 'entropy_control'
    },
    {
      id: 'chaos_weaver-wild_magic-pandemonic_pulse',
      name: 'Pandemonic Pulse',
      description: 'Channel demonic energy through a wild magic lens — each pulse surges with a different hellish property.',
      level: 5,
      icon: 'Fire/Hellfire',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'Fire/Hellfire',
        tags: ['chaos', 'damage', 'pulse', 'wild magic', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Demonic Pulse Effects',
        description: 'The pulse manifests with these chaotic properties',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd20', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 3 }, customName: 'Fire Pulse', effect: '8d6 fire damage in 30ft radius, leaves burning ground', effectConfig: { damageFormula: '8d6', damageType: 'fire', areaShape: 'circle', areaRadius: 30, burningGround: true } },
          { range: { min: 4, max: 6 }, customName: 'Shadow Pulse', effect: '7d6 necrotic damage, creates darkness in 40ft radius', effectConfig: { damageFormula: '7d6', damageType: 'necrotic', darknessRadius: 40 } },
          { range: { min: 7, max: 9 }, customName: 'Chaos Pulse', effect: '6d6 random damage type, random debuff applied', effectConfig: { damageFormula: '6d6', damageType: 'random', randomDebuff: true } },
          { range: { min: 10, max: 12 }, customName: 'Void Pulse', effect: '9d6 necrotic damage, heals caster for 50% of damage dealt', effectConfig: { damageFormula: '9d6', damageType: 'necrotic', lifestealPercent: 0.5 } },
          { range: { min: 13, max: 15 }, customName: 'Reality Pulse', effect: '7d6 force damage, teleports all affected creatures 20 feet', effectConfig: { damageFormula: '7d6', damageType: 'force', teleportDistance: 20 } },
          { range: { min: 16, max: 18 }, customName: 'Entropy Pulse', effect: '8d6 necrotic damage, reduces all stats by 2 for 3 rounds', effectConfig: { damageFormula: '8d6', damageType: 'necrotic', statReduction: 2, debuffDuration: 3 } },
          { range: { min: 19, max: 19 }, customName: 'Demonic Pulse', effect: '10d6 fire damage in 25ft radius, summons 2d4 imps', effectConfig: { damageFormula: '10d6', damageType: 'fire', areaShape: 'circle', areaRadius: 25, summonImps: '2d4' } },
          { range: { min: 20, max: 20 }, customName: 'Apocalyptic Pulse', effect: '12d6 random damage in 35ft radius + terrain becomes hellish', effectConfig: { damageFormula: '12d6', damageType: 'random', areaShape: 'circle', areaRadius: 35, hellTerrain: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 20, actionPoints: 2 },
        mayhemRequired: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Demonic pulse!',
        somaticText: 'Send pulse of demonic chaos'
      },
      cooldownConfig: { type: 'turn_based', value: 3 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'pulse', 'wild magic', 'rollable table'],
      specialization: 'wild_magic'
    },
    {
      id: 'chaos_weaver-reality_bending-chaotic_reflection',
      name: 'Chaotic Reflection',
      description: 'Snap a mirror of chaos into existence — the next spell aimed at you is flung back at its caster, twisted by chaos.',
      level: 5,
      icon: 'Arcane/Open Portal',
      spellType: 'REACTION',
      effectTypes: ['utility'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Open Portal',
        tags: ['chaos', 'utility', 'defense', 'reality bending']
      },
      utilityConfig: {
        utilityType: 'defense',
        subtype: 'spell_reflection',
        description: 'Reflect spells back at their casters with chaotic modifications',
        power: 'major',
        charges: 1,
        duration: 1,
        durationUnit: 'rounds'
      },
      triggerConfig: {
        global: {
          enabled: true,
          logicType: 'OR',
          compoundTriggers: [{
            id: 'spell_targeted',
            category: 'combat',
            name: 'Spell Targeted',
            parameters: { perspective: 'self' }
          }]
        }
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana'],
        resourceValues: { mana: 8 },
        mayhemRequired: 3,
        components: ['verbal']
      },
      cooldownConfig: { type: 'turn_based', value: 2 },
      resolution: 'DICE',
      tags: ['chaos', 'utility', 'defense', 'reality bending'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-wild_magic-chaos_engine',
      name: 'Chaos Engine',
      description: 'Turn your body into a living chaos conduit — sacrifice your own life force to supercharge your Mayhem reserves.',
      level: 5,
      icon: 'Nature/Nature Wild 1',
      spellType: 'ACTION',
      effectTypes: ['utility'],
      typeConfig: {
        school: 'chaos',
        icon: 'Nature/Nature Wild 1',
        tags: ['chaos', 'utility', 'mayhem', 'wild magic', 'resource']
      },
      utilityConfig: {
        utilityType: 'resource',
        subtype: 'mayhem_sacrifice',
        description: 'Take 2d6 damage to generate 2d4 Mayhem Modifiers',
        power: 'moderate',
        resourceGain: '2d4',
        resourceType: 'mayhem',
        charges: 1
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mayhemGenerate', 'mana', 'actionPoints'],
        resourceValues: { mana: 2, actionPoints: 1 },
        resourceFormulas: { mayhemGenerate: '2d4' },
        useFormulas: { mayhemGenerate: true },
        selfDamageFormula: '2d6',
        components: ['verbal', 'somatic'],
        verbalText: 'Burn the engine!',
        somaticText: 'Draw chaos through your veins'
      },
      cooldownConfig: { type: 'turn_based', value: 2 },
      resolution: 'DICE',
      tags: ['chaos', 'utility', 'mayhem', 'wild magic', 'resource'],
      specialization: 'wild_magic'
    },
    {
      id: 'chaos_weaver-reality_bending-reality_storm',
      name: 'Reality Storm',
      description: 'Tear open the fabric of space — creatures caught inside age, shrink, phase between planes, or worse.',
      level: 6,
      icon: 'Arcane/Spellcasting Aura',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Spellcasting Aura',
        tags: ['chaos', 'damage', 'control', 'reality', 'reality bending', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Reality Storm Effects',
        description: 'All creatures in the storm area suffer one of these reality-warping effects',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd33', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 3 }, customName: 'Time Warp', effect: 'Creature ages or de-ages 1d10 years', effectConfig: { effectType: 'time_warp', ageChange: '1d10' } },
          { range: { min: 4, max: 6 }, customName: 'Gravity Shift', effect: 'Creature floats or sinks for 3 rounds', effectConfig: { effectType: 'gravity_shift', duration: 3 } },
          { range: { min: 7, max: 9 }, customName: 'Size Change', effect: 'Creature becomes giant or tiny for 2 rounds', effectConfig: { effectType: 'size_change', duration: 2 } },
          { range: { min: 10, max: 12 }, customName: 'Elemental Shift', effect: 'Creature becomes resistant or vulnerable to random element', effectConfig: { effectType: 'elemental_shift', randomElement: true } },
          { range: { min: 13, max: 15 }, customName: 'Mirror Image', effect: 'Creature creates 1d4 illusory duplicates', effectConfig: { effectType: 'mirror_image', duplicateCount: '1d4' } },
          { range: { min: 16, max: 18 }, customName: 'Phasing', effect: 'Creature phases in and out of reality, gaining advantage on attacks', effectConfig: { effectType: 'phasing', duration: 3 } },
          { range: { min: 19, max: 21 }, customName: 'Chaos Form', effect: 'Creature transforms into chaotic elemental form', effectConfig: { effectType: 'chaos_form', duration: 4 } },
          { range: { min: 22, max: 24 }, customName: 'Reality Anchor', effect: 'Creature becomes immune to teleportation and forced movement', effectConfig: { effectType: 'reality_anchor', duration: 3 } },
          { range: { min: 25, max: 27 }, customName: 'Dimensional Rift', effect: 'Creature pulled into mini-dimension for 1 round', effectConfig: { effectType: 'dimensional_rift', duration: 1 } },
          { range: { min: 28, max: 30 }, customName: 'Chaos Echo', effect: 'Creature repeats last action next turn', effectConfig: { effectType: 'chaos_echo', duration: 1 } },
          { range: { min: 31, max: 33 }, customName: 'Reality Fragment', effect: 'Roll twice and apply both effects', effectConfig: { effectType: 'double_effect' } }
        ]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 35 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 25, actionPoints: 2 },
        mayhemRequired: 8,
        components: ['verbal', 'somatic'],
        verbalText: 'Reality storm!',
        somaticText: 'Warp reality with gesture'
      },
      cooldownConfig: { type: 'turn_based', value: 5 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'control', 'reality', 'reality bending', 'rollable table'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-wild_magic-chaotic_eruption',
      name: 'Chaotic Eruption',
      description: 'Detonate a pocket of wild magic — meteors, void rifts, elemental fury, or reality quakes erupt from a single point.',
      level: 6,
      icon: 'Nature/Nature Wild 1',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'Nature/Nature Wild 1',
        tags: ['chaos', 'damage', 'control', 'wild magic', 'eruption', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Chaotic Eruption Effects',
        description: 'The eruption produces one of these catastrophic effects',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd20', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 4 }, customName: 'Meteor Storm', effect: 'Meteors rain down, 10d6 fire damage in 40ft radius', effectConfig: { damageFormula: '10d6', damageType: 'fire', areaShape: 'circle', areaRadius: 40 } },
          { range: { min: 5, max: 8 }, customName: 'Void Rift', effect: 'Opens rift that sucks creatures in, 8d6 necrotic damage + pull toward center', effectConfig: { damageFormula: '8d6', damageType: 'necrotic', pullEffect: true } },
          { range: { min: 9, max: 12 }, customName: 'Elemental Fury', effect: 'All elements erupt, 12d6 random elemental damage in 35ft radius', effectConfig: { damageFormula: '12d6', damageType: 'elemental_random', areaShape: 'circle', areaRadius: 35 } },
          { range: { min: 13, max: 16 }, customName: 'Reality Quake', effect: 'Ground shakes, 9d6 force damage + all creatures knocked prone', effectConfig: { damageFormula: '9d6', damageType: 'force', knockProne: true } },
          { range: { min: 17, max: 19 }, customName: 'Chaos Vortex', effect: 'Swirling vortex, 11d6 random damage + creatures teleported randomly', effectConfig: { damageFormula: '11d6', damageType: 'random', randomTeleport: true } },
          { range: { min: 20, max: 20 }, customName: 'Wild Magic Apocalypse', effect: 'Ultimate chaos - 15d6 random damage + roll 3 times on Wild Magic Surge table', effectConfig: { damageFormula: '15d6', damageType: 'random', wildMagicSurgeRolls: 3 } }
        ]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 28, actionPoints: 2 },
        mayhemRequired: 7,
        components: ['verbal', 'somatic'],
        verbalText: 'Chaotic eruption!',
        somaticText: 'Cause wild magic eruption'
      },
      cooldownConfig: { type: 'turn_based', value: 5 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'control', 'wild magic', 'eruption', 'rollable table'],
      specialization: 'wild_magic'
    },
    {
      id: 'chaos_weaver-entropy_control-decay_cascade',
      name: 'Decay Cascade',
      description: 'Entropic chains — necrotic damage leaps between up to 5 targets, draining strength, constitution, and armor with each link.',
      level: 6,
      icon: 'Radiant/Radiant Divinity',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'Radiant/Radiant Divinity',
        tags: ['chaos', 'damage', 'debuff', 'entropy control', 'cascade']
      },
      damageTypes: ['necrotic'],
      damageConfig: {
        formula: '10d6 + intelligence * 2.5',
        elementType: 'necrotic',
        damageType: 'area',
        areaShape: 'chain',
        propagation: {
          method: 'chain',
          behavior: 'nearest',
          parameters: { count: 5, range: 15, decay: 0.25 }
        },
        canCrit: true,
        critMultiplier: 2
      },
      debuffConfig: {
        debuffType: 'statReduction',
        effects: [
          {
            id: 'strength_reduction',
            name: 'Strength Reduction',
            description: 'Reduces target strength by 4 for 6 rounds',
            statModifier: {
              stat: 'strength',
              magnitude: 4,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'constitution_reduction',
            name: 'Constitution Reduction',
            description: 'Reduces target constitution by 4 for 6 rounds',
            statModifier: {
              stat: 'constitution',
              magnitude: 4,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'armor_reduction',
            name: 'Armor Reduction',
            description: 'Reduces target armor by 6 for 6 rounds',
            statModifier: {
              stat: 'armor',
              magnitude: 6,
              magnitudeType: 'flat'
            }
          }
        ],
        durationType: 'rounds',
        durationValue: 6,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'constitution',
        saveOutcome: 'negates'
      },
      targetingConfig: {
        targetingType: 'chain',
        rangeType: 'ranged',
        rangeDistance: 40,
        maxTargets: 5,
        targetRestrictions: ['enemy']
      },
      resourceCost: {
        resourceTypes: ['mayhemGenerate', 'mana', 'actionPoints'],
        resourceValues: { mana: 26, actionPoints: 2 },
        resourceFormulas: { mayhemGenerate: '3d6' },
        useFormulas: { mayhemGenerate: true },
        components: ['verbal', 'somatic'],
        verbalText: 'Decay cascade!',
        somaticText: 'Trigger cascade of decay'
      },
      cooldownConfig: { type: 'turn_based', value: 4 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'debuff', 'entropy control', 'cascade'],
      specialization: 'entropy_control'
    },


    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-wild_magic-chaos_nova',
      name: 'Chaos Nova',
      description: 'A spherical detonation of wild magic — lava, frost, lightning, void gravity, or reality-shattering force radiates outward in all directions.',
      level: 7,
      icon: 'Nature/Nature Wild 1',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'Nature/Nature Wild 1',
        tags: ['chaos', 'damage', 'control', 'nova', 'wild magic', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Chaos Nova Effects',
        description: 'The nova produces these effects on all creatures and terrain in the area',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd12', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 2 }, customName: 'Fire Nova', effect: '14d6 fire damage + terrain becomes lava for 5 rounds', effectConfig: { damageFormula: '14d6', damageType: 'fire', terrainChange: 'lava', duration: 5 } },
          { range: { min: 3, max: 4 }, customName: 'Frost Nova', effect: '13d6 frost damage + everything frozen for 3 rounds', effectConfig: { damageFormula: '13d6', damageType: 'frost', freezeDuration: 3 } },
          { range: { min: 5, max: 6 }, customName: 'Storm Nova', effect: '12d6 lightning damage + creates thunderstorm for 4 rounds', effectConfig: { damageFormula: '12d6', damageType: 'lightning', stormDuration: 4 } },
          { range: { min: 7, max: 8 }, customName: 'Void Nova', effect: '16d6 necrotic damage + creates gravity well pulling creatures together', effectConfig: { damageFormula: '16d6', damageType: 'necrotic', gravityWell: true } },
          { range: { min: 9, max: 10 }, customName: 'Chaos Nova', effect: '15d6 random damage type + random terrain transformation', effectConfig: { damageFormula: '15d6', damageType: 'random', randomTerrain: true } },
          { range: { min: 11, max: 12 }, customName: 'Reality Nova', effect: '18d6 force damage + all creatures swap positions randomly', effectConfig: { damageFormula: '18d6', damageType: 'force', randomSwap: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 45 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 32, actionPoints: 2 },
        mayhemRequired: 8,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { type: 'turn_based', value: 5 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'control', 'nova', 'wild magic', 'rollable table'],
      specialization: 'wild_magic'
    },
    {
      id: 'chaos_weaver-reality_bending-chaos_gate',
      name: 'Chaos Gate',
      description: 'Rip open a portal to the chaos realm — 5 chaotic entities pour through and fight under your mental command.',
      level: 7,
      icon: 'Arcane/Open Portal',
      spellType: 'ACTION',
      effectTypes: ['control', 'summoning'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Open Portal',
        tags: ['chaos', 'control', 'summoning', 'reality bending']
      },
      summoningConfig: {
        creatureType: 'chaos_entity',
        creatureStrength: 'strong',
        duration: 10,
        minions: 5,
        controlType: 'mental'
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 50,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 30, actionPoints: 2 },
        mayhemRequired: 7,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { type: 'turn_based', value: 6 },
      resolution: 'DICE',
      tags: ['chaos', 'control', 'summoning', 'reality bending'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-chaos_dice-ultimate_chaos',
      name: 'Ultimate Chaos',
      description: 'The final roll — planar teleportation, time warps, chaos elementals, void zones, or a chaos god avatar. Only the dice know.',
      level: 7,
      icon: 'Arcane/Spellcasting Aura',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Spellcasting Aura',
        tags: ['chaos', 'damage', 'control', 'ultimate', 'chaos dice', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Ultimate Chaos Effects',
        description: 'The ultimate chaos manifests in one of these reality-shattering effects',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd20', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 3 }, customName: 'Reality Shred', effect: '25d6 force damage in 60ft radius + all creatures teleported to random planes', effectConfig: { damageFormula: '25d6', damageType: 'force', areaShape: 'circle', areaRadius: 60, planarTeleport: true } },
          { range: { min: 4, max: 6 }, customName: 'Time Apocalypse', effect: 'All creatures in area age 1d100 years instantly', effectConfig: { ageChange: '1d100' } },
          { range: { min: 7, max: 9 }, customName: 'Chaos Incarnate', effect: 'Summons 10 chaos elementals that fight for you', effectConfig: { summonChaosElementals: 10 } },
          { range: { min: 10, max: 12 }, customName: 'Void Cataclysm', effect: 'Creates 100ft radius void zone that sucks everything in', effectConfig: { voidZoneRadius: 100 } },
          { range: { min: 13, max: 15 }, customName: 'Wild Magic Ragnarok', effect: 'Triggers 10 Wild Magic Surges simultaneously', effectConfig: { wildMagicSurges: 10 } },
          { range: { min: 16, max: 18 }, customName: 'Reality Reset', effect: 'Resets all ongoing effects and cooldowns in the area', effectConfig: { realityReset: true } },
          { range: { min: 19, max: 19 }, customName: 'Chaos God Manifestation', effect: 'Summons avatar of chaos god for 10 rounds', effectConfig: { summonChaosGod: true, duration: 10 } },
          { range: { min: 20, max: 20 }, customName: 'True Apocalypse', effect: 'Roll 5 times on this table and combine all effects', effectConfig: { rollFiveTimes: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 60 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 35, actionPoints: 2 },
        mayhemRequired: 12,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { type: 'turn_based', value: 7 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'control', 'ultimate', 'chaos dice', 'rollable table'],
      specialization: 'chaos_dice'
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-entropy_control-entropy_plague',
      name: 'Entropy Plague',
      description: 'A spreading sickness of decay — infected targets take necrotic damage each turn and spread the plague to adjacent creatures on failed saves.',
      level: 8,
      icon: 'Radiant/Radiant Divinity',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'Radiant/Radiant Divinity',
        tags: ['chaos', 'damage', 'debuff', 'entropy control', 'plague']
      },
      damageTypes: ['necrotic'],
      damageConfig: {
        formula: '5d8 + intelligence',
        elementType: 'necrotic',
        damageType: 'area',
        areaShape: 'circle',
        areaParameters: { radius: 20 },
        canCrit: true,
        critMultiplier: 2
      },
      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'entropy_plague',
          name: 'Entropy Plague',
          description: 'Target takes 2d6 necrotic damage at start of turn, spreads to adjacent creatures on failed CON save',
          statusType: 'disease',
          level: 'severe',
          dotFormula: '2d6',
          dotDamageType: 'necrotic',
          damagePerTurn: '2d6'
        }],
        durationType: 'rounds',
        durationValue: 3,
        saveDC: 16,
        saveType: 'constitution'
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 50,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 }
      },
      resourceCost: {
        resourceTypes: ['mayhemGenerate', 'mana', 'actionPoints'],
        resourceValues: { mana: 25, actionPoints: 2 },
        resourceFormulas: { mayhemGenerate: '2d6' },
        useFormulas: { mayhemGenerate: true },
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { type: 'turn_based', value: 4 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'debuff', 'entropy control', 'plague'],
      specialization: 'entropy_control'
    },
    {
      id: 'chaos_weaver-wild_magic-chaos_cascade',
      name: 'Chaos Cascade',
      description: 'Roll TWICE on a volatile d8 table — two chaotic effects fire in sequence. Could be backfire-to-backfire, or a devastating double-strike.',
      level: 8,
      icon: 'Nature/Nature Wild 1',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'Nature/Nature Wild 1',
        tags: ['chaos', 'damage', 'control', 'cascade', 'wild magic', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Chaos Cascade Effects',
        description: 'Roll twice on this table, applying each effect in sequence',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd8', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 1 }, customName: 'Backfire', effect: 'Cascade rebounds - you take 4d6 random damage', effectConfig: { damageFormula: '4d6', damageType: 'random', selfDamage: true } },
          { range: { min: 2, max: 2 }, customName: 'Fire Cascade', effect: '5d8 fire damage + burning for 2 rounds', effectConfig: { damageFormula: '5d8', damageType: 'fire', burnDuration: 2 } },
          { range: { min: 3, max: 3 }, customName: 'Frost Cascade', effect: '5d8 frost damage + slowed for 1 round', effectConfig: { damageFormula: '5d8', damageType: 'frost', slowDuration: 1 } },
          { range: { min: 4, max: 4 }, customName: 'Lightning Cascade', effect: '4d10 lightning damage that chains to 2 targets', effectConfig: { damageFormula: '4d10', damageType: 'lightning', chainTargets: 2 } },
          { range: { min: 5, max: 5 }, customName: 'Void Cascade', effect: '5d8 necrotic damage + pulled 10ft toward center', effectConfig: { damageFormula: '5d8', damageType: 'necrotic', pullDistance: 10 } },
          { range: { min: 6, max: 6 }, customName: 'Force Cascade', effect: '6d8 force damage + knocked prone', effectConfig: { damageFormula: '6d8', damageType: 'force', knockProne: true } },
          { range: { min: 7, max: 7 }, customName: 'Chaos Surge', effect: '5d10 random damage + random 15ft teleport', effectConfig: { damageFormula: '5d10', damageType: 'random', teleportRange: 15 } },
          { range: { min: 8, max: 8 }, customName: 'Wild Overdrive', effect: '6d10 random damage + generate 1d4 Mayhem', effectConfig: { damageFormula: '6d10', damageType: 'random', mayhemGenerate: '1d4' } }
        ]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 28, actionPoints: 2 },
        mayhemRequired: 8,
        components: ['verbal', 'somatic'],
        verbalText: 'Chaotic cascade!',
        somaticText: 'Unleash cascading wild magic'
      },
      cooldownConfig: { type: 'turn_based', value: 4 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'control', 'cascade', 'wild magic', 'rollable table'],
      specialization: 'wild_magic'
    },


    // ========================================
    // LEVEL 9 SPELLS
    // ========================================

    {
      id: 'chaos_weaver-reality_bending-chaos_conduit',
      name: 'Chaos Conduit',
      description: 'Become a living channel for chaos — +4 spell damage and +1 die on all chaos spells for 3 rounds, but raw energy burns you for 2d6 each turn.',
      level: 9,
      icon: 'Arcane/Open Portal',
      spellType: 'ACTION',
      effectTypes: ['buff', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Open Portal',
        tags: ['chaos', 'buff', 'control', 'reality bending']
      },
      buffConfig: {
        buffType: 'statusEffect',
        effects: [{
          id: 'chaos_conduit',
          name: 'Chaos Conduit',
          description: '+4 to spell damage, all chaos spells gain +1 die for 3 rounds, but you take 2d6 damage at start of each turn',
          statusType: 'empowerment',
          level: 'major',
          mechanicsText: '+4 to spell damage, all chaos spells gain +1 die for 3 rounds. Take 2d6 damage at start of each turn.',
          statModifier: { stat: 'spell_power', magnitude: 4, magnitudeType: 'flat' }
        }],
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds',
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 30, actionPoints: 2 },
        mayhemRequired: 10,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { type: 'once_per_combat' },
      resolution: 'DICE',
      tags: ['chaos', 'buff', 'control', 'reality bending'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-entropy_control-entropy_wave',
      name: 'Entropy Wave',
      description: 'A crushing wave of pure decay — necrotic damage plus a blanket reduction to ALL enemy stats and armor.',
      level: 9,
      icon: 'Radiant/Radiant Divinity',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'Radiant/Radiant Divinity',
        tags: ['chaos', 'damage', 'debuff', 'entropy control']
      },
      damageTypes: ['necrotic'],
      damageConfig: {
        formula: '6d10 + intelligence',
        elementType: 'necrotic',
        damageType: 'area',
        areaShape: 'circle',
        areaParameters: { radius: 25 },
        canCrit: true,
        critMultiplier: 2
      },
      debuffConfig: {
        debuffType: 'statReduction',
        effects: [
          {
            id: 'entropy_weakness',
            name: 'Entropy Weakness',
            description: 'Reduces all stats by 2 for 3 rounds',
            statModifier: {
              stat: 'all',
              magnitude: 2,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'armor_decay',
            name: 'Armor Decay',
            description: 'Reduces target armor by 4 for 3 rounds',
            statModifier: {
              stat: 'armor',
              magnitude: 4,
              magnitudeType: 'flat'
            }
          }
        ],
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'constitution',
        saveOutcome: 'half'
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 }
      },
      resourceCost: {
        resourceTypes: ['mayhemGenerate', 'mana', 'actionPoints'],
        resourceValues: { mana: 35, actionPoints: 2 },
        resourceFormulas: { mayhemGenerate: '2d6' },
        useFormulas: { mayhemGenerate: true },
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { type: 'once_per_combat' },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'debuff', 'entropy control'],
      specialization: 'entropy_control'
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================

    {
      id: 'chaos_weaver-reality_bending-chaos_avatar',
      name: 'Chaos Avatar',
      description: 'Transform into a being of living chaos for 3 rounds — +6 spell damage, chaos spells roll twice and take the better result, but raw chaos burns you each turn.',
      level: 10,
      icon: 'Arcane/Open Portal',
      spellType: 'ACTION',
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Open Portal',
        tags: ['chaos', 'transformation', 'reality bending']
      },
      transformationConfig: {
        transformationType: 'elemental',
        targetType: 'self',
        duration: 3,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Avatar of Chaos',
        description: 'Your body becomes living chaos, reality warping around you.',
        grantedAbilities: [
          {
            id: 'chaos_damage_bonus',
            name: '+6 Spell Damage',
            description: '+6 damage to all spell damage'
          },
          {
            id: 'chaos_advantage',
            name: 'Chaos Advantage',
            description: 'All chaos spells roll twice and take the better result'
          },
          {
            id: 'chaos_instability',
            name: 'Chaotic Instability',
            description: 'Take 3d6 random elemental damage at the end of each turn'
          }
        ]
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 35, actionPoints: 2 },
        mayhemRequired: 12,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { type: 'long_rest' },
      resolution: 'NONE',
      tags: ['chaos', 'transformation', 'reality bending'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-wild_magic-chaos_storm_ultimate',
      name: 'Storm of Chaos',
      description: 'Three chaotic storms strike simultaneously — roll 3d6 and apply ALL results. Fire, frost, lightning, force, void, and pure chaos collide.',
      level: 10,
      icon: 'Nature/Nature Wild 1',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'Nature/Nature Wild 1',
        tags: ['chaos', 'damage', 'control', 'wild magic', 'rollable table']
      },
      rollableTable: {
        enabled: true,
        name: 'Storm of Chaos Effects',
        description: 'The chaos storm rolls 3 times, applying all effects',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd6', diceCount: 3 },
        entries: [
          { range: { min: 1, max: 1 }, customName: 'Fire Storm', effect: '5d10 fire damage + burning for 2 rounds', effectConfig: { damageFormula: '5d10', damageType: 'fire', burnDuration: 2 } },
          { range: { min: 2, max: 2 }, customName: 'Frost Storm', effect: '5d10 frost damage + slowed for 2 rounds', effectConfig: { damageFormula: '5d10', damageType: 'frost', slowDuration: 2 } },
          { range: { min: 3, max: 3 }, customName: 'Lightning Storm', effect: '5d10 lightning damage + stunned for 1 round', effectConfig: { damageFormula: '5d10', damageType: 'lightning', stunDuration: 1 } },
          { range: { min: 4, max: 4 }, customName: 'Force Storm', effect: '5d10 force damage + pushed 20ft', effectConfig: { damageFormula: '5d10', damageType: 'force', pushDistance: 20 } },
          { range: { min: 5, max: 5 }, customName: 'Void Storm', effect: '5d10 necrotic damage + blinded for 1 round', effectConfig: { damageFormula: '5d10', damageType: 'necrotic', blindDuration: 1 } },
          { range: { min: 6, max: 6 }, customName: 'Chaos Storm', effect: '6d10 random damage + teleported 15ft randomly', effectConfig: { damageFormula: '6d10', damageType: 'random', randomTeleport: 15 } }
        ]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 38, actionPoints: 3 },
        mayhemRequired: 14,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { type: 'once_per_combat' },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'control', 'wild magic', 'rollable table'],
      specialization: 'wild_magic'
    },
    {
      id: 'chaos_weaver-entropy_control-entropy_master',
      name: 'Entropy Master',
      description: 'Passive: All your necrotic damage gains +2d6, enemies you damage suffer -2 to saves, and each enemy hit generates 1 Mayhem.',
      level: 10,
      icon: 'Radiant/Radiant Divinity',
      spellType: 'PASSIVE',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'chaos',
        icon: 'Radiant/Radiant Divinity',
        tags: ['chaos', 'buff', 'entropy control', 'passive']
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'entropy_master',
          name: 'Entropy Master',
          description: 'All necrotic damage +2d6, enemies damaged by you have -2 to saves, generate 1 Mayhem per enemy damaged',
          statModifier: {
            stat: 'necroticDamage',
            magnitude: 2,
            magnitudeType: 'dice'
          }
        }],
        durationType: 'permanent',
        durationValue: 0,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: []
      },
      cooldownConfig: { type: 'none' },
      resolution: 'NONE',
      tags: ['chaos', 'buff', 'entropy control', 'passive'],
      specialization: 'entropy_control'
    },
    {
      id: 'chaos_weaver-chaos_dice-table_mastery',
      name: 'Table Mastery',
      description: 'Passive: Every chaos table you roll on is rigged — results automatically shift up by 1 tier. Your Mayhem cap increases to 25.',
      level: 10,
      icon: 'Arcane/Spellcasting Aura',
      spellType: 'PASSIVE',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'chaos',
        icon: 'Arcane/Spellcasting Aura',
        tags: ['chaos', 'buff', 'chaos dice', 'passive']
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'table_mastery',
          name: 'Table Mastery',
          description: 'All chaos table results automatically shift up by 1 tier. Mayhem Modifier cap increased to 25.',
          tableTierShift: 1,
          mayhemCapIncrease: 5
        }],
        durationType: 'permanent',
        durationValue: 0,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: []
      },
      cooldownConfig: { type: 'none' },
      resolution: 'NONE',
      tags: ['chaos', 'buff', 'chaos dice', 'passive'],
      specialization: 'chaos_dice'
    }
  ],

  // Overview section
  overview: {
    title: 'The Chaos Weaver',
    subtitle: 'Master of Unpredictability',

    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Chaos Weaver is the HIGHEST DAMAGE CLASS in the game, casting spells that roll on random effect tables (d20, d33, d100) for wildly unpredictable results. You generate Mayhem Modifiers (through specific abilities) and spend them to adjust table results by ±1 per modifier, turning chaos into controlled devastation.

**Core Mechanic**: Cast chaos spell → Roll on random table → Spend Mayhem Modifiers to adjust result → Unleash unpredictable effects

**Resource**: Mayhem Modifiers (0-20, generated through abilities, spent to control randomness)

**Playstyle**: Highest risk, highest reward, unpredictable burst damage, requires adaptability

**Best For**: Players who embrace randomness, enjoy wild swings, and can adapt to unexpected results`
    },

    description: `The Chaos Weaver is a master of unpredictability, weaving spells that produce a wide range of random effects. Embracing the chaotic nature of magic, Chaos Weavers thrive in the thrill of randomness and the potential for spectacular results. They manipulate the fabric of reality itself, creating bursts of mayhem and disorder on the battlefield. As the most powerful damage class in the game, Chaos Weavers can unleash devastating effects—though the chaos they create affects friend and foe alike.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Chaos Weavers are individuals who have embraced the fundamental unpredictability of magic itself. They reject the rigid structures and predictable formulas of traditional spellcasting, instead channeling raw, unfiltered magical energy that manifests in wildly different ways each time it's cast.

**The Chaotic Philosophy**: Chaos Weavers believe that true power comes from accepting—and exploiting—the inherent randomness of the universe. They see patterns in chaos that others miss, finding opportunity in uncertainty.

**Common Archetypes**:
- **The Mad Experimenter**: Constantly testing the limits of reality, documenting each chaotic result with scientific fascination
- **The Entropy Cultist**: Worships the forces of disorder and decay, seeing chaos as the natural state of the universe
- **The Reality Gambler**: Treats every spell like a roll of the dice, addicted to the thrill of not knowing what will happen
- **The Accidental Savant**: Stumbled into chaos magic by accident and discovered a natural affinity for the unpredictable
- **The Chaos Prophet**: Believes they can see the future in the patterns of random events, using chaos to divine truth

**Personality Traits**: Chaos Weavers tend to be unpredictable, spontaneous, and comfortable with uncertainty. They often have a dark sense of humor about the consequences of their magic and may seem reckless or insane to more cautious spellcasters.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**Primary Role**: Highest Burst Damage in the Game

The Chaos Weaver holds the distinction of being the most powerful damage dealer in the entire game, surpassing even the Pyrofiend in raw destructive potential. However, this power comes with significant risk—chaos magic is indiscriminate and can affect allies, enemies, and the caster themselves.

**Damage Output**: Unmatched burst damage through random effects that can multiply damage, trigger additional effects, or create devastating combinations

**Battlefield Control**: Creates zones of chaos that alter terrain, teleport creatures, and apply random buffs/debuffs

**Utility**: Unpredictable utility that can solve problems in unexpected ways—or create new problems entirely

**Risk Management**: Requires careful positioning and timing to maximize beneficial chaos while minimizing friendly fire

**Team Dynamics**:
- Works best with adaptable teams who can capitalize on random opportunities
- Requires allies who can handle unexpected situations (sudden teleports, terrain changes, etc.)
- Benefits from tanks who can protect the party from chaotic backfire
- Synergizes with support classes who can mitigate negative random effects`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `**Embrace the Chaos**: Chaos Weavers excel when players lean into the unpredictability rather than fighting it

**Core Gameplay Loop**:
1. **Generate Mayhem Modifiers** through specific abilities
2. **Cast chaotic spells** that roll on random effect tables
3. **Spend Mayhem Modifiers** to nudge results toward desired outcomes
4. **Adapt to results** and capitalize on unexpected opportunities

**Strategic Depth**: While chaos magic appears random, skilled Chaos Weavers use Mayhem Modifiers to influence outcomes, turning unpredictability into a strategic advantage. Knowing when to spend modifiers and when to let chaos reign is the mark of a master.

**High Risk, Highest Reward**: Every spell is a gamble, but the potential payoff is unmatched. A lucky roll can end encounters instantly, while an unlucky one might require quick thinking to survive.

**Adaptability Required**: Players must think on their feet, turning negative results into opportunities and capitalizing on positive ones before they fade.

**Perfect For**: Players who enjoy randomness, creativity, adaptability, and don't mind occasional spectacular failures in pursuit of spectacular successes.`
    },

    immersiveCombatExample: {
      title: 'Combat Example: When Chaos Reigns Supreme',
      content: `**The Setup**: Your party faces a dragon and four dragon cultists in a throne room. You're a Chaos Weaver with 8 Mayhem Modifiers banked. Time to show them what true chaos looks like.

**Starting State**: Mayhem Modifiers: 8 | Mana: 45/50

**Turn 1 - The Wild Magic Surge (Mayhem: 8 → 8)**

*You raise your hands, channeling raw chaotic energy. Reality itself seems to shimmer around you.*

**Action**: Cast "Wild Magic Surge" (8 mana, rolls on d33 table)
**Roll**: d33 → [14] = "Prismatic Explosion - 4d8 damage, random type to all enemies"

*Not bad, but you can do better. You spend 3 Mayhem Modifiers to adjust the result.*

**Decision**: Spend 3 Mayhem Modifiers to adjust 14 → 17
**Mayhem**: 8 - 3 = 5 remaining
**New Result**: [17] = "Reality Fracture - 6d10 force damage to all enemies + teleport them 2d20 feet in random directions"

*The air CRACKS like breaking glass. Purple-black energy erupts from your fingertips, shattering the fabric of space itself. The dragon roars as 6d10 force damage slams into it, and suddenly all five enemies are teleported randomly around the room.*

**Damage Roll**: 6d10 → [6, 8, 9, 4, 7, 10] = 44 force damage to ALL enemies!
**Teleport Rolls**: Dragon teleports 35 feet backward (now far from party), cultists scatter

*The dragon is now on the opposite side of the room. The cultists are separated. Chaos has given you tactical advantage.*

**Turn 2 - Building More Chaos (Mayhem: 5 → 10)**

*You need more Mayhem Modifiers for the big finish.*

**Action**: Cast "Wild Conduit" (6 mana, generates 2d4 Mayhem Modifiers)
**Roll**: 2d4 → [3, 4] = 7 Mayhem Modifiers generated!
**Mayhem**: 5 + 7 = 12

*Chaotic energy swirls around you, coalescing into raw potential. You can FEEL the power building.*

**Action**: Cast "Chaotic Bolt" (5 mana, single target, rolls on d20 table)
**Target**: Dragon
**Roll**: d20 → [8] = "Moderate damage - 3d6 fire damage"

*Boring. You spend 5 Mayhem Modifiers to push it higher.*

**Decision**: Spend 5 Mayhem Modifiers to adjust 8 → 13
**Mayhem**: 12 - 5 = 7 remaining
**New Result**: [13] = "Chaotic Overload - 5d8 damage of random type + target makes Wisdom save or goes berserk, attacking nearest creature"

**Damage Roll**: 5d8 → [7, 6, 8, 5, 7] = 33 damage (random type: necrotic!)
**Wisdom Save**: Dragon fails!

*The dragon's eyes go wild. It turns and BITES the nearest cultist, killing him instantly!*

**Result**: Dragon is now attacking its own allies. Chaos at its finest.

**Turn 3 - The Chaos Crescendo (Mayhem: 7 → 0)**

*The dragon is berserk, attacking cultists. Two cultists remain. Time for the ultimate chaos.*

**Action**: Cast "Prismatic Chaos" (12 mana, AoE, rolls on d100 table - the BIG ONE)
**Roll**: d100 → [42] = "Moderate AoE - 4d6 damage to all creatures in 20ft radius"

*No. Not good enough. You have 7 Mayhem Modifiers. You spend ALL OF THEM.*

**Decision**: Spend 7 Mayhem Modifiers to adjust 42 → 49
**Mayhem**: 7 - 7 = 0 remaining
**New Result**: [49] = "REALITY STORM - 8d10 damage to all creatures in 30ft radius + roll on Terrain Transformation table + all creatures make Charisma save or swap positions randomly"

*You scream words that shouldn't exist. The air turns inside out. Colors that have no names explode across the battlefield.*

**Damage Roll**: 8d10 → [9, 10, 8, 7, 9, 10, 6, 8] = 67 damage to EVERYONE in 30ft!

*The dragon takes 67 damage. The two remaining cultists are obliterated. Your party's tank takes 67 damage but survives (barely). Your party's healer was outside the radius (smart positioning).*

**Terrain Transformation Roll**: d20 → [15] = "Floor becomes lava - 2d6 fire damage per turn to anyone touching ground"

*The throne room floor melts into molten lava.*

**Charisma Saves**: Dragon fails! Tank fails! You fail!

*Everyone swaps positions randomly. The dragon is now next to your healer. Your tank is next to you. You're standing where the dragon was.*

**Turn 4 - Dealing with the Consequences (Mayhem: 0)**

*The dragon is badly wounded (44 + 33 + 67 = 144 damage taken), but it's next to your healer and the floor is lava.*

**Your Healer**: "WHAT DID YOU DO?!"
**You**: "I SAVED US! ...Mostly!"

**Action**: Cast "Chaotic Bolt" (5 mana) at dragon
**Roll**: d20 → [3] = "Fizzle - Spell fails, take 1d4 damage"

*You have 0 Mayhem Modifiers. You can't adjust it. The spell fizzles.*

**Damage to You**: 1d4 → [2] = 2 damage
**Lava Damage to You**: 2d6 → [4, 3] = 7 fire damage

*You take 9 damage total. The chaos has turned on you.*

**Dragon's Turn**: Attacks your healer → Hits for 25 damage
**Lava Damage to Dragon**: 2d6 → [5, 6] = 11 fire damage

*The dragon takes lava damage. It's at critical HP now.*

**Your Tank's Turn**: Charges through lava, attacks dragon → CRITICAL HIT!
**Lava Damage to Tank**: 2d6 → [3, 4] = 7 fire damage
**Tank's Damage**: 3d12 → [10, 11, 9] = 30 damage

*The dragon falls, dead. The cultists are dead. The floor is lava. Your party is scattered and wounded.*

**Your Healer**: "Never. Again."
**You**: "But we WON!"
**Your Tank**: "The floor is LAVA!"
**You**: "...I can fix that. Probably. Maybe. Let me roll on the Terrain Restoration table..."

**The Lesson**: Chaos Weaver is the highest damage class for a reason—you just dealt 144 damage to the dragon across three turns, plus killed three cultists. But chaos is INDISCRIMINATE. You damaged your own party, turned the floor into lava, and teleported everyone randomly. Mayhem Modifiers let you control the chaos, but when you run out, you're at the mercy of the dice. This is the Chaos Weaver's bargain: unmatched power in exchange for unpredictability. Embrace it, or play a safer class.`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'The Mayhem Engine',
    subtitle: 'Riding the Edge of Entropy',

    description: `Mayhem is a volatility gauge tracking the strain your magic places on reality. Every spell feeds the storm, increasing your potential for reality-warping power while pushing you closer to an uncontrollable Wild Surge. Mastery requires balancing on this entropic edge—knowing when to stabilize and when to let the chaos erupt.`,

    cards: [
      {
        title: 'Mayhem (0–100)',
        stats: 'Volatility Gauge',
        details: 'Generated by every spell cast. Higher Mayhem unlocks devastating power but brings you closer to the Redline.'
      },
      {
        title: 'Wild Surge',
        stats: 'The Redline Trigger',
        details: 'An uncontrollable magical eruption that occurs automatically at 100 Mayhem. Can be life-saving or catastrophic.'
      }
    ],

    generationTable: {
      headers: ['Trigger', 'Mayhem Change', 'Notes'],
      rows: [
        ['Cast Level 1–2 Spell', '+1d4', 'Minor ripples in the weave'],
        ['Cast Level 3+ Spell', '+2d6', 'Significant entropic disturbance'],
        ['Critical Hit', '+10', 'A moment of pure chaotic alignment'],
        ['Reality Bend / Spending', '-Variable', 'Stabilizing the timeline to avoid Surges'],
        ['Wild Surge Triggered', '→ Reset to 0', 'The pressure is released through a random effect']
      ]
    },

    usage: {
      momentum: 'High Mayhem fuels Ultimates like "Chaos Nova" or "Reality Storm". The closer you are to 100, the more "fuel" you have for reality-warping reality bends.',
      flourish: '⚠️ Stabilization: Use minor reality-bending abilities or specific talents to "bleed off" Mayhem if you are too close to 100 in a situation where a Surge would be dangerous.'
    },

    overheatRules: {
      title: 'Wild Surge Overdrive',
      content: `When Mayhem reaches 100, the dam breaks. The eruption is **immediate and unavoidable**.

**When you Surge:**
- **Roll 1d100** on the Master Wild Surge Table.
- **Immediate Resolution**: The effect manifests instantly, often ignoring your own resistances.
- **Total Reset**: After the effect resolves, Mayhem resets to 0.

**Advanced Play — Surge Baiting:**
Pushing to 100 deliberately when surrounded is a viable tactic. You gamble on an AoE blast or a defensive teleport to clear the area, sacrificing your resource pool for a high-impact random outcome.`
    },

    strategicConsiderations: {
      title: 'Combat Phases & Decision-Making',
      content: `**Building (0–40 Mayhem)**: Focus on setup. You are safe from Surges here. Use this time to position and chip away at enemies.

**Power Zone (41–80 Mayhem)**: You have enough fuel for most utility bends. Start looking for high-value targets for your mid-tier spells.

**The Redline (81–99 Mayhem)**: Maximum power. Any action—even a reaction—could trigger a Surge. Ask: "If I cast this now and Surge, will it help or hurt my allies?"

**Surge Zone (100 Mayhem)**: The point of no return. The chaos erupts. If you aren't ready for a Surge, use a Stabilization ability before taking any other action.

**Advanced Play — Intentional Surge**: At 90+ Mayhem, deliberately cast a low-cost spell to force the Surge while in the middle of a pack of enemies.

**Worked Example (92 Mayhem, Surrounded by Minions)**:
- **Option A** — Chaos Nova (-40 Mayhem): Drops you to 52. Safe, reliable, high damage.
- **Option B** — Minor Spell (+1d4): Risks 96+ Mayhem. High risk of Surging next turn.
- **Option C** — Stabilization (-15 Mayhem): Drops to 77. Best if your health is low and you can't risk a bad Surge result.

→ **Best default**: Option A. Clear the board and reset your gauge to a manageable level.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `A clear glass jar and a handful of colorful beads capture the rising tension of Mayhem better than any number on a sheet.

**Required Materials**:
- **The Chaos Jar** — A glass jar or bowl to hold tokens (Mayhem)
- **100 Tokens** — Beads, coins, or d6s to track the 0-100 scale
- **The Surge Die** — A distinct, oversized d100

**Tracking Mayhem**:
- **Each +1 Mayhem** → Drop a token into the jar. The sound of the glass filling builds anticipation.
- **Each -1 Mayhem** → Remove tokens from the jar.
- **Reaching the Top** → When the jar is full (or reaches a pre-marked line), roll the Surge Die immediately.

**Quick Reference**:
\`\`\`
MAYHEM SCALE (0-100):
  0–40   | Safe Zone (Setup)
  41–80  | Power Zone (Utility Bends)
  81–99  | Redline (Danger / High Power)
  100    | WILD SURGE (Roll d100, Reset to 0)

GENERATION:
  Lvl 1-2: +1d4 | Lvl 3+: +2d6 | Crit: +10
  Stabilization: -Variable
\`\`\`

**The Physical Hack (Friction Points)**:
- **The Surge Prop**: Place the d100 in the center of the table. Every time you cast a spell, nudge it closer to yourself. It warns the other players that a reality-warp is coming.
- **Reality Coin**: Use a physical coin. Flip it when you spend Mayhem to stabilize a spell; Heads you stabilize, Tails the chaos persists (lose the Mayhem but generation roll is doubled).

**Pro Tips**:
- Use a dedicated "Chaos Die" (different color) for Mayhem rolls so you can roll it with your damage dice.
- Don't count the tokens every turn; mark the jar at 25, 50, 75, and 100 for easy visual reference.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Chaos Weaver Specializations',
    subtitle: 'Four Paths of Chaotic Power',
    
    description: `Every Chaos Weaver chooses one of four specializations that define their approach to chaos magic. Each specialization offers unique passive abilities, a full talent tree, and influences your spell selection and playstyle.`,
    
    specs: [
      {
        id: 'reality_bending',
        name: 'Reality Bending',
        icon: 'Arcane/Conjure Elements',
        color: '#9B59B6',
        theme: 'Spatial Manipulation',
        
        description: `Reality Bending Chaos Weavers specialize in manipulating the fabric of reality itself. They excel at terrain transformation, teleportation, and altering the fundamental properties of objects and spaces. Their chaos is more controlled and tactical, focusing on battlefield manipulation.`,
        
        playstyle: 'Tactical chaos, terrain control, spatial manipulation, moderate risk',
        
        strengths: [
          'Superior battlefield control through terrain transformation',
          'Teleportation and repositioning abilities',
          'Can alter object properties for creative solutions',
          'More predictable chaos with tactical applications'
        ],
        
        weaknesses: [
          'Lower raw damage than other specs',
          'Requires good spatial awareness',
          'Effects can be negated by enemy movement',
          'Less effective in confined spaces'
        ],
        
        passiveAbility: {
          name: 'Chaos Attunement',
          description: 'All Chaos Weavers gain +1 Mayhem Modifier whenever they roll a natural 1 or natural 20 on any d20 roll.',
          icon: 'Psychic/Mind Control'
        },
        
        specPassive: {
          name: 'Reality Anchor',
          description: 'When you use a spell that transforms terrain or teleports creatures, gain +2 Mayhem Modifiers. Additionally, you can spend 3 Mayhem Modifiers to choose the exact location of teleportation effects instead of them being random.',
          icon: 'Arcane/Open Portal'
        },
        
        keyAbilities: [
          'Reality Flicker - Phase through reality for 1 round of invulnerability',
          'Reality Swap - Scramble all positions in a 20ft zone',
          'Reality Storm - d33 table of reality-warping effects',
          'Chaos Avatar - Transform into living chaos for 3 rounds'
        ]
      },

      {
        id: 'wild_magic',
        name: 'Wild Magic',
        icon: 'Nature/Nature Wild 1',
        color: '#E74C3C',
        theme: 'Pure Chaos',

        description: `Wild Magic Chaos Weavers embrace pure, unfiltered chaos. They specialize in wild magic surges, unpredictable spell effects, and reality-warping phenomena. Their magic is the most dangerous and unpredictable, but also has the highest potential for spectacular results.`,

        playstyle: 'Maximum chaos, highest risk/reward, unpredictable outcomes, pure randomness',

        strengths: [
          'Access to the most powerful random effects',
          'Highest damage potential in the game',
          'Can trigger multiple simultaneous chaos effects',
          'Unpredictability makes them hard to counter'
        ],

        weaknesses: [
          'Highest risk of friendly fire and self-harm',
          'Least control over outcomes',
          'Can create chaotic situations that harm the party',
          'Requires team coordination to manage chaos'
        ],

        passiveAbility: {
          name: 'Chaos Attunement',
          description: 'All Chaos Weavers gain +1 Mayhem Modifier whenever they roll a natural 1 or natural 20 on any d20 roll.',
          icon: 'Psychic/Mind Control'
        },

        specPassive: {
          name: 'Wild Surge',
          description: 'Whenever you cast a spell, roll a d20. On a 1, trigger a Wild Magic Surge (roll on the Wild Magic Surge table). On a 20, your spell deals double damage or has double duration. Additionally, you generate +1 Mayhem Modifier whenever a Wild Magic Surge occurs.',
          icon: 'Fire/Hellfire'
        },

        keyAbilities: [
          'Wild Surge - Trigger a wild magic effect and generate Mayhem',
          'Chaos Engine - Sacrifice HP to supercharge Mayhem reserves',
          'Pandemonic Pulse - d20 demonic chaos with hellish properties',
          'Chaos Cascade - Roll TWICE on a volatile d8 table'
        ]
      },

      {
        id: 'entropy_control',
        name: 'Entropy Control',
        icon: 'Utility/All Seeing Eye',
        color: '#2C3E50',
        theme: 'Decay and Destruction',

        description: `Entropy Chaos Weavers harness the forces of decay, disorder, and destruction. They specialize in entropic damage, armor reduction, and abilities that break down matter and energy. Their chaos is more focused on pure destructive power with debilitating side effects.`,

        playstyle: 'Sustained damage, debuffs, armor shredding, controlled destruction',

        strengths: [
          'Consistent high damage output',
          'Powerful armor reduction and debuffs',
          'Less reliant on extreme randomness',
          'Effective against heavily armored targets'
        ],

        weaknesses: [
          'Less spectacular burst damage than Wild Magic',
          'Fewer utility options',
          'Entropic effects can harm allies in close quarters',
          'Limited crowd control'
        ],

        passiveAbility: {
          name: 'Chaos Attunement',
          description: 'All Chaos Weavers gain +1 Mayhem Modifier whenever they roll a natural 1 or natural 20 on any d20 roll.',
          icon: 'Psychic/Mind Control'
        },

        specPassive: {
          name: 'Entropic Decay',
          description: 'Your chaos damage ignores 25% of enemy armor. Additionally, enemies damaged by your chaos spells have their armor reduced by 1 (stacking up to 5) for the rest of combat. When an enemy reaches 5 stacks, gain +3 Mayhem Modifiers.',
          icon: 'Radiant/Radiant Divinity'
        },

        keyAbilities: [
          'Entropic Touch - Necrotic damage that shreds armor',
          'Chaos Wave - Cone AoE that strips strength, constitution, and armor',
          'Decay Cascade - Entropic chains that leap between 5 targets',
          'Entropy Plague - Spreading disease of decay'
        ]
      },
      {
        id: 'chaos_dice',
        name: 'Chaos Dice',
        icon: 'fas fa-dice',
        color: '#F39C12',
        theme: 'Random Tables',

        description: `Chaos Dice specialists focus on rolling on random effect tables, using Mayhem Modifiers to steer outcomes toward devastating results. They have the widest variety of random effects and the most table-rolling spells.`,

        playstyle: 'Table rolling, modifier management, controlled randomness, burst damage',

        strengths: [
          'Most rollable table spells of any spec',
          'Best synergy with Mayhem Modifier spending',
          'Highest damage ceiling on lucky rolls',
          'Spells scale dramatically with modifier investment'
        ],

        weaknesses: [
          'Heavily reliant on Mayhem Modifier economy',
          'Without modifiers, outcomes are purely random',
          'Mana-intensive for sustained table rolling',
          'Vulnerable when modifiers are depleted'
        ],

        passiveAbility: {
          name: 'Chaos Attunement',
          description: 'All Chaos Weavers gain +1 Mayhem Modifier whenever they roll a natural 1 or natural 20 on any d20 roll.',
          icon: 'Psychic/Mind Control'
        },

        specPassive: {
          name: 'Loaded Dice',
          description: 'When you roll on a chaos table, the minimum result is increased by 1 per 5 Mayhem Modifiers you currently have (rounded down). Additionally, rolling a natural maximum on any chaos table generates +2 Mayhem Modifiers.',
          icon: 'fas fa-dice'
        },

        keyAbilities: [
          'Chaotic Bolt - Your first d20 table spell, the gateway to chaos',
          'Prismatic Chaos - d33 kaleidoscope of destruction',
          'Chaos Storm - THE signature d100 catastrophe table',
          'Table Mastery - Capstone: auto-raise all table results by 1 tier'
        ]
      }
    ]
  }

  // NOTE: Example spells are defined at the top of CHAOS_WEAVER_DATA (line 251)
  // The duplicate exampleSpells array below has been removed to prevent conflicts
  // All starting spells are now properly defined in the first exampleSpells array
};


