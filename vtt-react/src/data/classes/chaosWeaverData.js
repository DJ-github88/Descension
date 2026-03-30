// Chaos Weaver Class Data
// Provides example spells and level-based spell pools

export const CHAOS_WEAVER_DOCS = {
  className: 'Chaos Weaver',
  icon: 'spell_shadow_possession',
  specializations: ['reality_bending', 'entropy_control', 'chaos_dice'],

  // Example spells showcasing the class's capabilities
  exampleSpells: [
    {
      id: 'chaos_weaver-chaos_dice-chaos_bolt',
      name: 'Chaos Bolt',
      description: 'Launch a bolt of pure chaotic energy that deals force damage to a target.',
      level: 1,
      icon: 'spell_arcane_arcanepower',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_arcanepower',
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
      tags: ['chaos', 'damage', 'chaos_dice'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-chaos_dice-prismatic_chaos',
      name: 'Prismatic Chaos',
      description: 'Unleash a storm of prismatic energy with wildly unpredictable effects.',
      level: 3,
      icon: 'spell_arcane_arcanepower',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_arcanepower',
        tags: ['chaos', 'damage', 'area', 'rollable_table']
      },
      rollableTable: {
        enabled: true,
        name: 'Prismatic Chaos Effects',
        description: 'Roll on this table to determine the prismatic effect',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd33', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 3 }, customName: 'Red Prism', effect: 'Fire damage - 4d6 fire damage in 20ft radius', effectConfig: { damageFormula: '4d6', damageType: 'fire', areaShape: 'circle', areaRadius: 20 } },
          { range: { min: 4, max: 6 }, customName: 'Orange Prism', effect: 'Acid damage - 4d6 acid damage, reduces armor by 3 for 2 rounds', effectConfig: { damageFormula: '4d6', damageType: 'acid', armorReduction: 3, debuffDuration: 2 } },
          { range: { min: 7, max: 9 }, customName: 'Yellow Prism', effect: 'Lightning damage - 4d6 lightning damage, chains to 2 additional targets', effectConfig: { damageFormula: '4d6', damageType: 'lightning', chainTargets: 2 } },
          { range: { min: 10, max: 12 }, customName: 'Green Prism', effect: 'Poison damage - 4d6 poison damage, targets poisoned for 1 round', effectConfig: { damageFormula: '4d6', damageType: 'poison', poisonDuration: 1 } },
          { range: { min: 13, max: 15 }, customName: 'Blue Prism', effect: 'Frost damage - 4d6 frost damage, slows targets by 50% for 2 rounds', effectConfig: { damageFormula: '4d6', damageType: 'frost', slowAmount: 0.5, slowDuration: 2 } },
          { range: { min: 16, max: 18 }, customName: 'Indigo Prism', effect: 'Force damage - 4d6 force damage, knocks targets back 15 feet', effectConfig: { damageFormula: '4d6', damageType: 'force', knockbackDistance: 15 } },
          { range: { min: 19, max: 21 }, customName: 'Violet Prism', effect: 'Necrotic damage - 4d6 necrotic damage, heals caster for half damage dealt', effectConfig: { damageFormula: '4d6', damageType: 'necrotic', lifestealPercent: 0.5 } },
          { range: { min: 22, max: 24 }, customName: 'White Prism', effect: 'Radiant damage - 4d6 radiant damage, blinds targets for 1 round', effectConfig: { damageFormula: '4d6', damageType: 'radiant', blindDuration: 1 } },
          { range: { min: 25, max: 27 }, customName: 'Black Prism', effect: 'Necrotic damage - 4d6 necrotic damage, creates 20ft radius darkness for 2 rounds', effectConfig: { damageFormula: '4d6', damageType: 'shadow', darknessRadius: 20, darknessDuration: 2 } },
          { range: { min: 28, max: 30 }, customName: 'Silver Prism', effect: 'Psychic damage - 4d6 psychic damage, confuses targets for 1 round', effectConfig: { damageFormula: '4d6', damageType: 'psychic', confuseDuration: 1 } },
          { range: { min: 31, max: 33 }, customName: 'Golden Prism', effect: 'Ultimate Chaos - Roll twice more and combine effects', effectConfig: { rollTwice: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'ground',
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
      tags: ['chaos', 'damage', 'area', 'rollable_table', 'chaos_dice'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-chaos_dice-chaos_storm',
      name: 'Chaos Storm',
      description: 'Unleash a storm of chaotic energy that rolls on a d20 table for unpredictable effects.',
      level: 6,
      icon: 'spell_arcane_arcanepower',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_arcanepower',
        tags: ['chaos', 'damage', 'control', 'chaos_dice', 'rollable_table']
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
        targetingType: 'ground',
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
      tags: ['chaos', 'damage', 'control', 'chaos_dice', 'rollable_table'],
      specialization: 'chaos_dice'
    }
  ],

  // Spell pools organized by character level
  spellPools: {
    1: [
      'chaos_weaver-chaos_dice-chaos_bolt',
      'chaos_weaver-reality_bending-reality_flicker',
      'chaos_weaver-entropy_control-entropic_touch',
      'chaos_weaver-chaos_dice-chaotic_infusion',
      'chaos_weaver-reality_bending-reality_step'
    ],
    2: [
      'chaos_weaver-chaos_dice-chaos_bolt',
      'chaos_weaver-reality_bending-reality_flicker',
      'chaos_weaver-entropy_control-entropic_touch',
      'chaos_weaver-chaos_dice-chaotic_infusion',
      'chaos_weaver-reality_bending-reality_step',
      'chaos_weaver-chaos_dice-chaotic_bolt',
      'chaos_weaver-reality_bending-dimensional_rift',
      'chaos_weaver-entropy_control-chaotic_decay',
      'chaos_weaver-chaos_dice-chaotic_conduit',
      'chaos_weaver-wild_magic-wild_surge'
    ],
    3: [
      'chaos_weaver-chaos_dice-prismatic_chaos',
      'chaos_weaver-reality_bending-fractured_realms',
      'chaos_weaver-entropy_control-chaos_burst',
      'chaos_weaver-wild_magic-arcane_roulette',
      'chaos_weaver-chaos_dice-mayhem_matrix'
    ],
    4: [
      'chaos_weaver-reality_bending-reality_swap',
      'chaos_weaver-entropy_control-chaos_wave',
      'chaos_weaver-chaos_dice-chaos_storm',
      'chaos_weaver-wild_magic-mist_of_mayhem',
      'chaos_weaver-reality_bending-whimsical_alteration'
    ],
    5: [
      'chaos_weaver-entropy_control-discordant_strike',
      'chaos_weaver-chaos_dice-pandemonic_pulse',
      'chaos_weaver-reality_bending-chaotic_reflection',
      'chaos_weaver-wild_magic-chaos_engine',
      'chaos_weaver-entropy_control-corruption_blast'
    ],
    6: [
      'chaos_weaver-chaos_dice-reality_storm',
      'chaos_weaver-wild_magic-chaotic_eruption',
      'chaos_weaver-reality_bending-pocket_dimension',
      'chaos_weaver-entropy_control-decay_cascade',
      'chaos_weaver-chaos_dice-chaos_storm'
    ],
    7: [
      'chaos_weaver-wild_magic-chaos_nova',
      'chaos_weaver-reality_bending-chaos_gate',
      'chaos_weaver-entropy_control-obliteration_wave',
      'chaos_weaver-chaos_dice-ultimate_chaos',
      'chaos_weaver-reality_bending-dimensional_anchor'
    ],
    8: [
      'chaos_weaver-entropy_control-entropy_plague',
      'chaos_weaver-wild_magic-chaos_cascade',
      'chaos_weaver-chaos_dice-greater_chaos',
      'chaos_weaver-reality_bending-chaos_realm',
      'chaos_weaver-wild_magic-chaos_surge'
    ],
    9: [
      'chaos_weaver-chaos_dice-chaos_cataclysm',
      'chaos_weaver-reality_bending-chaos_conduit',
      'chaos_weaver-entropy_control-entropy_wave',
      'chaos_weaver-wild_magic-chaos_omega',
      'chaos_weaver-chaos_dice-greater_surge'
    ],
    10: [
      'chaos_weaver-chaos_dice-ultimate_chaos',
      'chaos_weaver-reality_bending-chaos_avatar',
      'chaos_weaver-entropy_control-entropy_master',
      'chaos_weaver-wild_magic-chaos_storm_ultimate'
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

  // Spell Pools - organized by character level
  spellPools: {
    1: [
      'chaos_weaver-chaos_dice-chaos_bolt',
      'chaos_weaver-reality_bending-reality_flicker',
      'chaos_weaver-entropy_control-entropic_touch',
      'chaos_weaver-chaos_dice-chaotic_infusion',
      'chaos_weaver-reality_bending-reality_step'
    ],
    2: [
      'chaos_weaver-chaos_dice-chaos_bolt',
      'chaos_weaver-reality_bending-reality_flicker',
      'chaos_weaver-entropy_control-entropic_touch',
      'chaos_weaver-chaos_dice-chaotic_infusion',
      'chaos_weaver-reality_bending-reality_step'
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
      description: 'Launch a bolt of pure chaotic energy that deals force damage to a target.',
      level: 1,
      icon: 'spell_arcane_arcanepower',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_arcanepower',
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
      tags: ['chaos', 'damage', 'chaos_dice'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-reality_bending-reality_flicker',
      name: 'Reality Flicker',
      description: 'Briefly phase out of reality for 1 round, making yourself incorporeal. You can move through objects and are immune to non-magical attacks.',
      level: 1,
      icon: 'spell_arcane_blink',
      spellType: 'ACTION',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_blink',
        tags: ['chaos', 'defense']
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{ id: 'incorporeal', name: 'Incorporeal', description: 'You become incorporeal for 1 round. You can move through objects and are immune to non-magical attacks.' }],
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
      tags: ['chaos', 'defense', 'reality_bending'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-entropy_control-entropic_touch',
      name: 'Entropic Touch',
      description: 'Infuse a target with entropic decay. The chaotic energy eats away at their defenses, causing their armor to weaken and crumble as the entropy spreads through their form.',
      level: 1,
      icon: 'spell_shadow_antishadow',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_shadow_antishadow',
        tags: ['entropy', 'debuff', 'necrotic']
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
      tags: ['chaos', 'entropy', 'debuff', 'damage', 'entropy_control'],
      specialization: 'entropy_control'
    },

    // ========================================
    // LEVEL 2 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-chaos_dice-chaotic_bolt',
      name: 'Chaotic Bolt',
      description: 'Unleash a bolt of chaotic energy that rolls on a d20 table for unpredictable effects.',
      level: 2,
      icon: 'spell_arcane_arcanepower',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_arcanepower',
        tags: ['chaos', 'damage', 'rollable_table']
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
      tags: ['chaos', 'damage', 'rollable_table', 'chaos_dice'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-reality_bending-dimensional_rift',
      name: 'Dimensional Rift',
      description: 'Tear open a rift to another dimension, allowing you to manipulate reality.',
      level: 2,
      icon: 'spell_arcane_portalorgrimmar',
      spellType: 'ACTION',
      effectTypes: ['control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_portalorgrimmar',
        tags: ['chaos', 'control', 'reality_bending']
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
            distance: 20
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
      tags: ['chaos', 'control', 'forced_movement', 'reality_bending'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-entropy_control-chaotic_decay',
      name: 'Chaotic Decay',
      description: 'Accelerate the decay of matter around your target.',
      level: 2,
      icon: 'spell_shadow_antishadow',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_shadow_antishadow',
        tags: ['chaos', 'damage', 'debuff', 'entropy']
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
            description: 'Reduces target strength',
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
      tags: ['chaos', 'damage', 'debuff', 'entropy_control'],
      specialization: 'entropy_control'
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-chaos_dice-prismatic_chaos',
      name: 'Prismatic Chaos',
      description: 'Unleash a storm of prismatic energy with wildly unpredictable effects.',
      level: 3,
      icon: 'spell_arcane_arcanepower',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_arcanepower',
        tags: ['chaos', 'damage', 'area', 'rollable_table']
      },
      rollableTable: {
        enabled: true,
        name: 'Prismatic Chaos Effects',
        description: 'Roll on this table to determine the prismatic effect',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd33', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 3 }, customName: 'Red Prism', effect: 'Fire damage - 4d6 fire damage in 20ft radius', effectConfig: { damageFormula: '4d6', damageType: 'fire', areaShape: 'circle', areaRadius: 20 } },
          { range: { min: 4, max: 6 }, customName: 'Orange Prism', effect: 'Acid damage - 4d6 acid damage, reduces armor by 3 for 2 rounds', effectConfig: { damageFormula: '4d6', damageType: 'acid', armorReduction: 3, debuffDuration: 2 } },
          { range: { min: 7, max: 9 }, customName: 'Yellow Prism', effect: 'Lightning damage - 4d6 lightning damage, chains to 2 additional targets', effectConfig: { damageFormula: '4d6', damageType: 'lightning', chainTargets: 2 } },
          { range: { min: 10, max: 12 }, customName: 'Green Prism', effect: 'Poison damage - 4d6 poison damage, targets poisoned for 1 round', effectConfig: { damageFormula: '4d6', damageType: 'poison', poisonDuration: 1 } },
          { range: { min: 13, max: 15 }, customName: 'Blue Prism', effect: 'Frost damage - 4d6 frost damage, slows targets by 50% for 2 rounds', effectConfig: { damageFormula: '4d6', damageType: 'frost', slowAmount: 0.5, slowDuration: 2 } },
          { range: { min: 16, max: 18 }, customName: 'Indigo Prism', effect: 'Force damage - 4d6 force damage, knocks targets back 15 feet', effectConfig: { damageFormula: '4d6', damageType: 'force', knockbackDistance: 15 } },
          { range: { min: 19, max: 21 }, customName: 'Violet Prism', effect: 'Necrotic damage - 4d6 necrotic damage, heals caster for half damage dealt', effectConfig: { damageFormula: '4d6', damageType: 'necrotic', lifestealPercent: 0.5 } },
          { range: { min: 22, max: 24 }, customName: 'White Prism', effect: 'Radiant damage - 4d6 radiant damage, blinds targets for 1 round', effectConfig: { damageFormula: '4d6', damageType: 'radiant', blindDuration: 1 } },
          { range: { min: 25, max: 27 }, customName: 'Black Prism', effect: 'Necrotic damage - 4d6 necrotic damage, creates 20ft radius darkness for 2 rounds', effectConfig: { damageFormula: '4d6', damageType: 'shadow', darknessRadius: 20, darknessDuration: 2 } },
          { range: { min: 28, max: 30 }, customName: 'Silver Prism', effect: 'Psychic damage - 4d6 psychic damage, confuses targets for 1 round', effectConfig: { damageFormula: '4d6', damageType: 'psychic', confuseDuration: 1 } },
          { range: { min: 31, max: 33 }, customName: 'Golden Prism', effect: 'Ultimate Chaos - Roll twice more and combine effects', effectConfig: { rollTwice: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'ground',
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
      tags: ['chaos', 'damage', 'area', 'rollable_table', 'chaos_dice'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-reality_bending-fractured_realms',
      name: 'Fractured Realms',
      description: 'Shatter the boundaries between realities, creating rifts with random planar effects.',
      level: 3,
      icon: 'spell_arcane_portalorgrimmar',
      spellType: 'ACTION',
      effectTypes: ['control', 'damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_portalorgrimmar',
        tags: ['chaos', 'control', 'reality_bending', 'rollable_table']
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
        targetingType: 'ground',
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
      tags: ['chaos', 'control', 'terrain', 'reality_bending', 'rollable_table'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-entropy_control-chaos_burst',
      name: 'Chaos Burst',
      description: 'Release a burst of entropic energy that randomly damages and debuffs targets.',
      level: 3,
      icon: 'spell_shadow_antishadow',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_shadow_antishadow',
        tags: ['chaos', 'damage', 'debuff', 'entropy_control', 'rollable_table']
      },
      rollableTable: {
        enabled: true,
        name: 'Chaos Burst Effects',
        description: 'Roll on this table to determine the burst effect',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd12', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 2 }, customName: 'Necrotic Burst', effect: '5d6 necrotic damage, reduces strength by 3 for 2 rounds', effectConfig: { damageFormula: '5d6', damageType: 'necrotic', statReduction: 'strength', reductionAmount: 3, debuffDuration: 2 } },
          { range: { min: 3, max: 4 }, customName: 'Acid Burst', effect: '5d6 acid damage, reduces armor by 4 for 3 rounds', effectConfig: { damageFormula: '5d6', damageType: 'acid', statReduction: 'armor', reductionAmount: 4, debuffDuration: 3 } },
          { range: { min: 5, max: 6 }, customName: 'Poison Burst', effect: '4d6 poison damage, poisons targets (2d6 poison damage per turn for 3 rounds)', effectConfig: { damageFormula: '4d6', damageType: 'poison', dotFormula: '2d6', dotDuration: 3 } },
          { range: { min: 7, max: 8 }, customName: 'Shadow Burst', effect: '5d6 necrotic damage, blinds targets for 2 rounds', effectConfig: { damageFormula: '5d6', damageType: 'shadow', blindDuration: 2 } },
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
      tags: ['chaos', 'damage', 'debuff', 'entropy_control', 'rollable_table'],
      specialization: 'entropy_control'
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-reality_bending-reality_swap',
      name: 'Reality Swap',
      description: 'Swap positions with random creatures in the area, creating utter confusion.',
      level: 4,
      icon: 'spell_arcane_blink',
      spellType: 'ACTION',
      effectTypes: ['control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_blink',
        tags: ['chaos', 'control', 'reality_bending']
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
            randomSwap: true
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
      tags: ['chaos', 'control', 'forced_movement', 'reality_bending'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-entropy_control-entropy_wave',
      name: 'Entropy Wave',
      description: 'Send a wave of entropic decay that damages and weakens all in its path.',
      level: 4,
      icon: 'spell_shadow_antishadow',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_shadow_antishadow',
        tags: ['chaos', 'damage', 'debuff', 'entropy_control']
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
            description: 'Reduces target strength',
            statModifier: {
              stat: 'strength',
              magnitude: 3,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'constitution_reduction',
            name: 'Constitution Reduction',
            description: 'Reduces target constitution',
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
      tags: ['chaos', 'damage', 'debuff', 'entropy_control'],
      specialization: 'entropy_control'
    },
    {
      id: 'chaos_weaver-chaos_dice-chaos_storm',
      name: 'Chaos Storm',
      description: 'Summon a raging storm of chaotic energy that rolls on a massive d100 table.',
      level: 4,
      icon: 'spell_arcane_arcanepower',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_arcanepower',
        tags: ['chaos', 'damage', 'storm', 'rollable_table']
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
        targetingType: 'ground',
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
      tags: ['chaos', 'damage', 'storm', 'chaos_dice', 'rollable_table'],
      specialization: 'chaos_dice'
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-entropy_control-discordant_strike',
      name: 'Discordant Strike',
      description: 'Infuse your weapon with chaotic energy for random damage effects.',
      level: 5,
      icon: 'spell_shadow_antishadow',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_shadow_antishadow',
        tags: ['chaos', 'damage', 'weapon', 'entropy_control', 'rollable_table']
      },
      rollableTable: {
        enabled: true,
        name: 'Discordant Strike Effects',
        description: 'Your weapon strike produces one of these effects',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd10', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 2 }, customName: 'Necrotic Strike', effect: 'Weapon deals +4d6 necrotic damage, target poisoned', effectConfig: { damageFormula: '4d6', damageType: 'necrotic', poisonEffect: true } },
          { range: { min: 3, max: 4 }, customName: 'Acid Strike', effect: 'Weapon deals +4d6 acid damage, reduces armor by 3', effectConfig: { damageFormula: '4d6', damageType: 'acid', armorReduction: 3 } },
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
      tags: ['chaos', 'damage', 'weapon', 'entropy_control', 'rollable_table'],
      specialization: 'entropy_control'
    },
    {
      id: 'chaos_weaver-chaos_dice-pandemonic_pulse',
      name: 'Pandemonic Pulse',
      description: 'Send out a pulse of demonic chaos that rolls on a d20 table for varying properties.',
      level: 5,
      icon: 'spell_fire_felrainoffire',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_fire_felrainoffire',
        tags: ['chaos', 'damage', 'pulse', 'chaos_dice', 'rollable_table']
      },
      rollableTable: {
        enabled: true,
        name: 'Demonic Pulse Effects',
        description: 'The pulse manifests with these chaotic properties',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd20', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 3 }, customName: 'Fire Pulse', effect: '8d6 fire damage in 30ft radius, leaves burning ground', effectConfig: { damageFormula: '8d6', damageType: 'fire', areaShape: 'circle', areaRadius: 30, burningGround: true } },
          { range: { min: 4, max: 6 }, customName: 'Shadow Pulse', effect: '7d6 necrotic damage, creates darkness in 40ft radius', effectConfig: { damageFormula: '7d6', damageType: 'shadow', darknessRadius: 40 } },
          { range: { min: 7, max: 9 }, customName: 'Chaos Pulse', effect: '6d6 random damage type, random debuff applied', effectConfig: { damageFormula: '6d6', damageType: 'random', randomDebuff: true } },
          { range: { min: 10, max: 12 }, customName: 'Void Pulse', effect: '9d6 necrotic damage, heals caster for 50% of damage dealt', effectConfig: { damageFormula: '9d6', damageType: 'necrotic', lifestealPercent: 0.5 } },
          { range: { min: 13, max: 15 }, customName: 'Reality Pulse', effect: '7d6 force damage, teleports all affected creatures 20 feet', effectConfig: { damageFormula: '7d6', damageType: 'force', teleportDistance: 20 } },
          { range: { min: 16, max: 18 }, customName: 'Entropy Pulse', effect: '8d6 necrotic damage, reduces all stats by 2 for 3 rounds', effectConfig: { damageFormula: '8d6', damageType: 'necrotic', statReduction: 2, debuffDuration: 3 } },
          { range: { min: 19, max: 19 }, customName: 'Demonic Pulse', effect: '10d6 fire damage in 25ft radius, summons 2d4 imps', effectConfig: { damageFormula: '10d6', damageType: 'fire', areaShape: 'circle', areaRadius: 25, summonImps: '2d4' } },
          { range: { min: 20, max: 20 }, customName: 'Apocalyptic Pulse', effect: '12d6 random damage in 35ft radius + terrain becomes hellish', effectConfig: { damageFormula: '12d6', damageType: 'random', areaShape: 'circle', areaRadius: 35, hellTerrain: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'ground',
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
      tags: ['chaos', 'damage', 'pulse', 'chaos_dice', 'rollable_table'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-reality_bending-chaotic_reflection',
      name: 'Chaotic Reflection',
      description: 'Create a mirror of chaotic energy that reflects spells back at their casters.',
      level: 5,
      icon: 'spell_arcane_portalorgrimmar',
      spellType: 'REACTION',
      effectTypes: ['utility'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_portalorgrimmar',
        tags: ['chaos', 'utility', 'defense', 'reality_bending']
      },
      utilityConfig: {
        utilityType: 'defense',
        subtype: 'spell_reflection',
        description: 'Reflect spells back at their casters with chaotic modifications',
        power: 'major'
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
      tags: ['chaos', 'utility', 'defense', 'reality_bending'],
      specialization: 'reality_bending'
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-chaos_dice-reality_storm',
      name: 'Reality Storm',
      description: 'Unleash a storm that warps reality itself, affecting all creatures in the area with random effects.',
      level: 6,
      icon: 'spell_arcane_arcanepower',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_arcanepower',
        tags: ['chaos', 'damage', 'control', 'reality', 'chaos_dice', 'rollable_table']
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
        targetingType: 'ground',
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
      tags: ['chaos', 'damage', 'control', 'reality', 'chaos_dice', 'rollable_table'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-wild_magic-chaotic_eruption',
      name: 'Chaotic Eruption',
      description: 'Cause a massive eruption of wild magic that can reshape the battlefield.',
      level: 6,
      icon: 'spell_nature_wispsplode',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_nature_wispsplode',
        tags: ['chaos', 'damage', 'control', 'wild_magic', 'eruption']
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
        targetingType: 'ground',
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
      tags: ['chaos', 'damage', 'control', 'wild_magic', 'eruption', 'rollable_table'],
      specialization: 'wild_magic'
    },
    {
      id: 'chaos_weaver-entropy_control-decay_cascade',
      name: 'Decay Cascade',
      description: 'Trigger a cascade of entropic decay that spreads through multiple targets. The chaotic energy flows from one victim to the next, weakening their bodies and defenses as the entropy consumes them. The decay spreads like a plague, leaving destruction in its wake.',
      level: 6,
      icon: 'spell_shadow_antishadow',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_shadow_antishadow',
        tags: ['chaos', 'damage', 'debuff', 'entropy_control', 'cascade']
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
      tags: ['chaos', 'damage', 'debuff', 'entropy_control', 'cascade'],
      specialization: 'entropy_control'
    },
    {
      id: 'chaos_weaver-chaos_dice-chaos_armageddon',
      name: 'Chaos Armageddon',
      description: 'Unleash the ultimate chaos spell that rolls on a massive d100 table for apocalyptic effects.',
      level: 6,
      icon: 'spell_arcane_arcanepower',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_arcanepower',
        tags: ['chaos', 'damage', 'control', 'armageddon', 'chaos_dice', 'rollable_table']
      },
      rollableTable: {
        enabled: true,
        name: 'Armageddon Effects',
        description: 'The ultimate chaos manifests as one of these apocalyptic effects',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd100', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 10 }, customName: 'Meteor Apocalypse', effect: '20 meteors rain down, 15d6 fire damage in 50ft radius', effectConfig: { damageFormula: '15d6', damageType: 'fire', areaShape: 'circle', areaRadius: 50, meteorCount: 20 } },
          { range: { min: 11, max: 20 }, customName: 'Void Cataclysm', effect: 'Reality tears open, 18d6 necrotic damage + creatures sucked into void', effectConfig: { damageFormula: '18d6', damageType: 'necrotic', voidSuction: true } },
          { range: { min: 21, max: 30 }, customName: 'Elemental Storm', effect: 'All elements rage, 20d6 random elemental damage in 45ft radius', effectConfig: { damageFormula: '20d6', damageType: 'elemental_random', areaShape: 'circle', areaRadius: 45 } },
          { range: { min: 31, max: 40 }, customName: 'Reality Shred', effect: 'Space-time tears, 16d6 force damage + all creatures teleported randomly', effectConfig: { damageFormula: '16d6', damageType: 'force', randomTeleport: true } },
          { range: { min: 41, max: 50 }, customName: 'Chaos Incarnate', effect: 'Pure chaos energy, 22d6 random damage + reality permanently altered', effectConfig: { damageFormula: '22d6', damageType: 'random', permanentRealityChange: true } },
          { range: { min: 51, max: 60 }, customName: 'Entropy Apocalypse', effect: 'Everything decays, 19d6 necrotic damage + all stats reduced by 6', effectConfig: { damageFormula: '19d6', damageType: 'necrotic', statReduction: 6 } },
          { range: { min: 61, max: 70 }, customName: 'Wild Magic Ragnarok', effect: 'Ultimate wild magic, roll 5 times on Wild Magic Surge table', effectConfig: { wildMagicSurgeRolls: 5 } },
          { range: { min: 71, max: 80 }, customName: 'Dimensional Rift', effect: 'Opens gates to other planes, creatures from random planes appear', effectConfig: { planarInvasion: true } },
          { range: { min: 81, max: 90 }, customName: 'Time Apocalypse', effect: 'Time warps, creatures age/decay rapidly or become immortal', effectConfig: { timeApocalypse: true } },
          { range: { min: 91, max: 100 }, customName: 'True Chaos', effect: 'Roll 3 times on this table and combine all effects', effectConfig: { rollThrice: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 50 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 30, actionPoints: 2 },
        mayhemRequired: 10,
        components: ['verbal', 'somatic'],
        verbalText: 'Armageddon!',
        somaticText: 'Unleash ultimate chaos'
      },
      cooldownConfig: { type: 'turn_based', value: 6 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'control', 'armageddon', 'chaos_dice', 'rollable_table'],
      specialization: 'chaos_dice'
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-wild_magic-chaos_nova',
      name: 'Chaos Nova',
      description: 'Detonate a nova of pure wild magic that affects everything in the area.',
      level: 7,
      icon: 'spell_nature_wispsplode',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_nature_wispsplode',
        tags: ['chaos', 'damage', 'control', 'nova', 'wild_magic']
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
        targetingType: 'ground',
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
      tags: ['chaos', 'damage', 'control', 'nova', 'wild_magic', 'rollable_table'],
      specialization: 'wild_magic'
    },
    {
      id: 'chaos_weaver-reality_bending-chaos_gate',
      name: 'Chaos Gate',
      description: 'Open a massive gate to the chaos realm, flooding the area with chaotic entities.',
      level: 7,
      icon: 'spell_arcane_portalorgrimmar',
      spellType: 'ACTION',
      effectTypes: ['control', 'summoning'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_portalorgrimmar',
        tags: ['chaos', 'control', 'summoning', 'reality_bending']
      },
      summoningConfig: {
        creatureType: 'chaos_entity',
        creatureStrength: 'strong',
        duration: 10,
        minions: 5,
        controlType: 'mental'
      },
      targetingConfig: {
        targetingType: 'ground',
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
      tags: ['chaos', 'control', 'summoning', 'reality_bending'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-chaos_dice-ultimate_chaos',
      name: 'Ultimate Chaos',
      description: 'Channel the ultimate expression of chaos magic with unimaginable power.',
      level: 7,
      icon: 'spell_arcane_arcanepower',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_arcanepower',
        tags: ['chaos', 'damage', 'control', 'ultimate', 'chaos_dice']
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
        targetingType: 'ground',
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
      tags: ['chaos', 'damage', 'control', 'ultimate', 'chaos_dice', 'rollable_table'],
      specialization: 'chaos_dice'
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-entropy_control-entropy_plague',
      name: 'Entropy Plague',
      description: 'Inflict a spreading plague of entropy that corrupts and weakens enemies.',
      level: 8,
      icon: 'spell_shadow_antishadow',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_shadow_antishadow',
        tags: ['chaos', 'damage', 'debuff', 'entropy_control', 'plague']
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
          level: 'severe'
        }],
        durationType: 'rounds',
        durationValue: 3,
        saveDC: 16,
        saveType: 'constitution'
      },
      targetingConfig: {
        targetingType: 'ground',
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
      tags: ['chaos', 'damage', 'debuff', 'entropy_control', 'plague'],
      specialization: 'entropy_control'
    },
    {
      id: 'chaos_weaver-wild_magic-chaos_cascade',
      name: 'Chaos Cascade',
      description: 'Create a cascade of wild magic that triggers two chaotic effects in sequence.',
      level: 8,
      icon: 'spell_nature_wispsplode',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_nature_wispsplode',
        tags: ['chaos', 'damage', 'control', 'cascade', 'wild_magic']
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
        targetingType: 'ground',
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
      tags: ['chaos', 'damage', 'control', 'cascade', 'wild_magic', 'rollable_table'],
      specialization: 'wild_magic'
    },
    {
      id: 'chaos_weaver-chaos_dice-greater_chaos',
      name: 'Greater Chaos',
      description: 'Channel greater chaotic energies for powerful but unpredictable effects.',
      level: 8,
      icon: 'spell_arcane_arcanepower',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_arcanepower',
        tags: ['chaos', 'damage', 'control', 'chaos_dice']
      },
      rollableTable: {
        enabled: true,
        name: 'Greater Chaos Effects',
        description: 'Greater chaos magic manifests as one of these effects',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd10', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 1 }, customName: 'Chaos Backfire', effect: 'Spell explodes - you take 5d8 random damage and are stunned for 1 round', effectConfig: { damageFormula: '5d8', damageType: 'random', selfDamage: true, stunDuration: 1 } },
          { range: { min: 2, max: 2 }, customName: 'Reality Hiccup', effect: '4d10 force damage + all creatures swap positions randomly', effectConfig: { damageFormula: '4d10', damageType: 'force', positionSwap: true } },
          { range: { min: 3, max: 3 }, customName: 'Elemental Maelstrom', effect: '6d8 random elemental damage in area', effectConfig: { damageFormula: '6d8', damageType: 'elemental_random' } },
          { range: { min: 4, max: 4 }, customName: 'Entropy Burst', effect: '5d10 necrotic damage + targets weakened (-2 to attacks) for 2 rounds', effectConfig: { damageFormula: '5d10', damageType: 'necrotic', weakenDuration: 2 } },
          { range: { min: 5, max: 5 }, customName: 'Chaos Rift', effect: '6d8 force damage + creates difficult terrain for 3 rounds', effectConfig: { damageFormula: '6d8', damageType: 'force', difficultTerrainDuration: 3 } },
          { range: { min: 6, max: 6 }, customName: 'Wild Surge', effect: '5d10 random damage + roll on wild magic surge table', effectConfig: { damageFormula: '5d10', damageType: 'random', wildMagicSurge: true } },
          { range: { min: 7, max: 7 }, customName: 'Chaos Storm', effect: '6d10 random damage to all enemies in area', effectConfig: { damageFormula: '6d10', damageType: 'random' } },
          { range: { min: 8, max: 8 }, customName: 'Reality Fracture', effect: '7d8 force damage + targets blinded for 1 round', effectConfig: { damageFormula: '7d8', damageType: 'force', blindDuration: 1 } },
          { range: { min: 9, max: 9 }, customName: 'Chaos Overdrive', effect: '7d10 random damage + generate 2d4 Mayhem', effectConfig: { damageFormula: '7d10', damageType: 'random', mayhemGenerate: '2d4' } },
          { range: { min: 10, max: 10 }, customName: 'Perfect Chaos', effect: '8d10 random damage + you choose the damage type', effectConfig: { damageFormula: '8d10', damageType: 'choice' } }
        ]
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 30, actionPoints: 2 },
        mayhemRequired: 10,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { type: 'turn_based', value: 4 },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'control', 'chaos_dice', 'rollable_table'],
      specialization: 'chaos_dice'
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-chaos_dice-chaos_cataclysm',
      name: 'Chaos Cataclysm',
      description: 'Unleash a devastating surge of chaotic energy with powerful but unpredictable effects.',
      level: 9,
      icon: 'spell_arcane_arcanepower',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_arcanepower',
        tags: ['chaos', 'damage', 'control', 'chaos_dice']
      },
      rollableTable: {
        enabled: true,
        name: 'Chaos Cataclysm Effects',
        description: 'The cataclysm manifests as one of these powerful effects',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd8', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 1 }, customName: 'Chaos Backlash', effect: 'Spell backfires - you take 6d10 random damage and are stunned for 1 round', effectConfig: { damageFormula: '6d10', damageType: 'random', selfDamage: true, stunDuration: 1 } },
          { range: { min: 2, max: 2 }, customName: 'Elemental Cataclysm', effect: '6d10 random elemental damage + terrain becomes hazardous for 3 rounds', effectConfig: { damageFormula: '6d10', damageType: 'elemental_random', hazardousTerrain: 3 } },
          { range: { min: 3, max: 3 }, customName: 'Reality Tear', effect: '7d8 force damage + targets teleported 20ft in random directions', effectConfig: { damageFormula: '7d8', damageType: 'force', randomTeleport: 20 } },
          { range: { min: 4, max: 4 }, customName: 'Entropy Surge', effect: '6d10 necrotic damage + targets suffer -3 to all saves for 2 rounds', effectConfig: { damageFormula: '6d10', damageType: 'necrotic', saveReduction: 3, duration: 2 } },
          { range: { min: 5, max: 5 }, customName: 'Chaos Storm', effect: '7d10 random damage + summon 2 chaos wisps (CR 3) for 3 rounds', effectConfig: { damageFormula: '7d10', damageType: 'random', summonWisps: 2, summonDuration: 3 } },
          { range: { min: 6, max: 6 }, customName: 'Wild Eruption', effect: '8d8 random damage + all creatures (including allies) gain random buff/debuff', effectConfig: { damageFormula: '8d8', damageType: 'random', randomEffects: true } },
          { range: { min: 7, max: 7 }, customName: 'Chaos Vortex', effect: '7d10 force damage + pulls all targets 15ft toward center and slows them', effectConfig: { damageFormula: '7d10', damageType: 'force', pullDistance: 15, slowDuration: 2 } },
          { range: { min: 8, max: 8 }, customName: 'Perfect Storm', effect: '8d10 random damage + you choose the damage type + generate 2d6 Mayhem', effectConfig: { damageFormula: '8d10', damageType: 'choice', mayhemGenerate: '2d6' } }
        ]
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 35, actionPoints: 2 },
        mayhemRequired: 12,
        components: ['verbal', 'somatic'],
        verbalText: 'Greater chaos!',
        somaticText: 'Channel greater chaotic energies'
      },
      cooldownConfig: { type: 'once_per_combat' },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'control', 'chaos_dice', 'rollable_table'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-reality_bending-chaos_conduit',
      name: 'Chaos Conduit',
      description: 'Become a living conduit for chaotic energy, gaining immense but unstable power. The raw chaos flows through you, amplifying your spells to devastating levels, but the uncontrolled energy tears at your body with each passing moment. The power is intoxicating but dangerous.',
      level: 9,
      icon: 'spell_arcane_portalorgrimmar',
      spellType: 'ACTION',
      effectTypes: ['buff', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_portalorgrimmar',
        tags: ['chaos', 'buff', 'control', 'reality_bending']
      },
      buffConfig: {
        buffType: 'statusEffect',
        effects: [{
          id: 'chaos_conduit',
          name: 'Chaos Conduit',
          description: '+4 to spell damage, all chaos spells gain +1 die for 3 rounds, but you take 2d6 damage at start of each turn',
          statusType: 'empowerment',
          level: 'major'
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
      tags: ['chaos', 'buff', 'control', 'reality_bending'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-entropy_control-entropy_wave',
      name: 'Entropy Wave',
      description: 'Unleash a devastating wave of entropy that decays and weakens everything it touches. The chaotic energy spreads outward in a destructive tide, consuming strength, vitality, and defenses. Those caught in the wave feel their very essence being eroded away.',
      level: 9,
      icon: 'spell_shadow_antishadow',
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_shadow_antishadow',
        tags: ['chaos', 'damage', 'debuff', 'entropy_control']
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
        targetingType: 'ground',
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
      tags: ['chaos', 'damage', 'debuff', 'entropy_control'],
      specialization: 'entropy_control'
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: 'chaos_weaver-chaos_dice-ultimate_chaos',
      name: 'Ultimate Chaos',
      description: 'Channel the most powerful expression of chaos magic, unleashing devastating and unpredictable effects.',
      level: 10,
      icon: 'spell_arcane_arcanepower',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_arcanepower',
        tags: ['chaos', 'damage', 'control', 'ultimate', 'chaos_dice']
      },
      rollableTable: {
        enabled: true,
        name: 'Ultimate Chaos Effects',
        description: 'Ultimate chaos manifests with tremendous power',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd10', diceCount: 1 },
        entries: [
          { range: { min: 1, max: 1 }, customName: 'Catastrophic Backfire', effect: 'Spell explodes violently - you take 8d10 random damage, stunned 2 rounds, lose all Mayhem', effectConfig: { damageFormula: '8d10', damageType: 'random', selfDamage: true, stunDuration: 2, loseMayhem: true } },
          { range: { min: 2, max: 2 }, customName: 'Elemental Convergence', effect: '8d10 damage of ALL elements simultaneously', effectConfig: { damageFormula: '8d10', damageType: 'all_elements' } },
          { range: { min: 3, max: 3 }, customName: 'Reality Fracture', effect: '7d12 force damage + all creatures teleported 30ft randomly + difficult terrain', effectConfig: { damageFormula: '7d12', damageType: 'force', randomTeleport: 30, difficultTerrain: true } },
          { range: { min: 4, max: 4 }, customName: 'Entropy Collapse', effect: '8d10 necrotic damage + targets suffer -4 to all stats for 3 rounds', effectConfig: { damageFormula: '8d10', damageType: 'necrotic', statReduction: 4, duration: 3 } },
          { range: { min: 5, max: 5 }, customName: 'Chaos Maelstrom', effect: '9d10 random damage + summon 3 chaos wisps (CR 4) for combat duration', effectConfig: { damageFormula: '9d10', damageType: 'random', summonWisps: 3 } },
          { range: { min: 6, max: 6 }, customName: 'Wild Apocalypse', effect: '8d12 random damage + roll twice on wild magic surge table', effectConfig: { damageFormula: '8d12', damageType: 'random', wildMagicSurges: 2 } },
          { range: { min: 7, max: 7 }, customName: 'Dimensional Tear', effect: '9d10 force damage + creatures must save or be banished for 1 round', effectConfig: { damageFormula: '9d10', damageType: 'force', banishDuration: 1, saveDC: 18 } },
          { range: { min: 8, max: 8 }, customName: 'Chaos Nova', effect: '10d10 random damage in 35ft radius', effectConfig: { damageFormula: '10d10', damageType: 'random', areaRadius: 35 } },
          { range: { min: 9, max: 9 }, customName: 'Perfect Chaos', effect: '9d10 damage, you choose the type + regain 15 Mayhem + next chaos spell has advantage', effectConfig: { damageFormula: '9d10', damageType: 'choice', mayhemRestore: 15, advantage: true } },
          { range: { min: 10, max: 10 }, customName: 'Chaos Mastery', effect: '10d12 random damage + you can spend Mayhem to choose the result on next chaos roll', effectConfig: { damageFormula: '10d12', damageType: 'random', chooseNextResult: true } }
        ]
      },
      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 35 }
      },
      resourceCost: {
        resourceTypes: ['mayhemSpend', 'mana', 'actionPoints'],
        resourceValues: { mana: 40, actionPoints: 3 },
        mayhemRequired: 15,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { type: 'once_per_combat' },
      resolution: 'DICE',
      tags: ['chaos', 'damage', 'control', 'ultimate', 'chaos_dice', 'rollable_table'],
      specialization: 'chaos_dice'
    },
    {
      id: 'chaos_weaver-reality_bending-chaos_avatar',
      name: 'Chaos Avatar',
      description: 'Transform into a living avatar of chaos, gaining tremendous but volatile power.',
      level: 10,
      icon: 'spell_arcane_portalorgrimmar',
      spellType: 'ACTION',
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_arcane_portalorgrimmar',
        tags: ['chaos', 'transformation', 'reality_bending']
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
      tags: ['chaos', 'transformation', 'reality_bending'],
      specialization: 'reality_bending'
    },
    {
      id: 'chaos_weaver-wild_magic-chaos_storm_ultimate',
      name: 'Storm of Chaos',
      description: 'Unleash a devastating storm of wild magic that tears through the battlefield.',
      level: 10,
      icon: 'spell_nature_wispsplode',
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_nature_wispsplode',
        tags: ['chaos', 'damage', 'control', 'wild_magic']
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
        targetingType: 'ground',
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
      tags: ['chaos', 'damage', 'control', 'wild_magic', 'rollable_table'],
      specialization: 'wild_magic'
    },
    {
      id: 'chaos_weaver-entropy_control-entropy_master',
      name: 'Entropy Master',
      description: 'Become a master of entropy, causing decay and corruption with every action.',
      level: 10,
      icon: 'spell_shadow_antishadow',
      spellType: 'PASSIVE',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'chaos',
        icon: 'spell_shadow_antishadow',
        tags: ['chaos', 'buff', 'entropy_control', 'passive']
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
      tags: ['chaos', 'buff', 'entropy_control', 'passive'],
      specialization: 'entropy_control'
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
    title: 'Mayhem Modifiers',
    subtitle: 'Influencing the Chaos',

    description: `Generate modifiers through specific abilities, then spend them to adjust chaos spell table results by ±1 per modifier.`,

    resourceBarExplanation: {
      title: 'Understanding Your Mayhem Modifier Bar',
      content: `**What You See**: Your Chaos Weaver resource bar displays Mayhem Modifiers as swirling, chaotic orbs that pulse with multicolored energy. Unlike orderly resources like mana, these orbs shift and change color unpredictably (purple, green, orange, pink, blue), reflecting the chaotic nature of the power they represent.

**Visual Representation**:
- **0-5 Modifiers**: Few orbs, dim glow, chaotic energy is weak
- **6-10 Modifiers**: Moderate number of orbs, brighter glow, energy intensifies
- **11-15 Modifiers**: Many orbs, bright pulsing, chaotic power building
- **16-20 Modifiers**: Maximum orbs, violent pulsing with lightning arcs between them, reality-warping power

**How It Changes**:
- **When You Generate**: New orbs materialize with a burst of chaotic energy (casting Chaotic Infusion, Wild Conduit, or Unpredictable Surge)
- **When You Spend**: Orbs dissolve into the spell you're casting, their energy channeled to adjust the result
- **Visual Feedback**: When you have 10+ modifiers, the orbs orbit your character model, crackling with power

**The Chaos Meter**: Below your Mayhem Modifier orbs is a "Chaos Intensity" indicator that shows how much control you have:
- **Red Zone (0-5)**: "UNSTABLE - Low Control"
- **Yellow Zone (6-10)**: "VOLATILE - Moderate Control"
- **Green Zone (11-20)**: "CONTROLLED CHAOS - High Control"

**Why This Matters**: Your Mayhem Modifier count determines how much you can "steer" chaos. With 0 modifiers, you're at the complete mercy of the dice—a d100 roll could land anywhere. With 20 modifiers, you can shift a result by ±20, effectively choosing from a 40-result range on the table. This is the difference between "hoping for the best" and "making chaos work for you."

**Strategic Depth**: Unlike other classes where you spend resources to cast abilities, Chaos Weavers spend resources to CONTROL abilities they've already cast. Your spells are "free" (just cost mana), but controlling their outcomes costs Mayhem Modifiers. This creates a unique decision point: Do you cast chaos spells when you have low modifiers (high risk, high reward) or do you build up modifiers first (safer, but slower)?

**The Chaos Weaver's Dilemma**:
- High modifiers = Safe, controlled chaos (but you spent turns generating instead of damaging)
- Low modifiers = Dangerous, unpredictable chaos (but you're dealing damage every turn)

Master Chaos Weavers know when to build and when to unleash.`
    },

    mechanics: {
      title: 'Detailed Mechanics',
      content: `**Generating Mayhem Modifiers (Building Your Chaos Bank)**:

Chaos Weavers generate Mayhem Modifiers through specific abilities. These are your "setup" spells—they don't deal damage, but they give you control over future chaos.

- **Chaotic Infusion** (4 mana): Generate 1d4 Mayhem Modifiers
  - Example: Roll [3] → Gain 3 modifiers
  - Use when: You need a quick boost of control

- **Wild Conduit** (6 mana): Generate 2d4 Mayhem Modifiers
  - Example: Roll [2, 4] = 6 → Gain 6 modifiers
  - Use when: You want to build a large modifier bank

- **Unpredictable Surge** (5 mana): Generate 1d6 Mayhem Modifiers
  - Example: Roll [5] → Gain 5 modifiers
  - Use when: You want moderate generation with moderate mana cost

**Maximum Capacity**: 20 Mayhem Modifiers (any excess is lost)

**Persistence**: Modifiers persist between combats until spent or until you complete a long rest
- Example: End combat with 12 modifiers → Start next combat with 12 modifiers

**Using Mayhem Modifiers (Controlling the Chaos)**:

When you cast a chaos spell that rolls on a random table, you can spend Mayhem Modifiers AFTER seeing the roll to adjust the result.

**The Adjustment Mechanic**:
- **Spend 1 Modifier**: Adjust result by ±1 on the table
- **Spend Multiple**: Each additional modifier adjusts by another ±1
- **No Limit Per Roll**: Spend as many as you want on a single roll (up to your total)
- **Declare After Roll**: You see the result FIRST, then decide how many modifiers to spend

**Example 1 - Small Adjustment**:
- Cast "Wild Magic Surge" (rolls on d33 table)
- Roll: d33 → [14] = "Prismatic Explosion - 4d8 damage"
- You have 8 modifiers
- Decision: Spend 3 modifiers to adjust 14 → 17
- New Result: [17] = "Reality Fracture - 6d10 damage + teleport"
- Modifiers: 8 - 3 = 5 remaining

**Example 2 - Large Adjustment**:
- Cast "Prismatic Chaos" (rolls on d100 table)
- Roll: d100 → [23] = "Minor effect - 2d6 damage"
- You have 15 modifiers
- Decision: Spend 12 modifiers to adjust 23 → 35
- New Result: [35] = "Major effect - 6d8 damage + stun"
- Modifiers: 15 - 12 = 3 remaining

**Example 3 - Avoiding Disaster**:
- Cast "Chaotic Bolt" (rolls on d20 table)
- Roll: d20 → [2] = "Backfire - Spell hits you instead"
- You have 6 modifiers
- Decision: Spend 5 modifiers to adjust 2 → 7
- New Result: [7] = "Normal hit - 3d6 damage to target"
- Modifiers: 6 - 5 = 1 remaining
- You just saved yourself from self-damage!

**Strategic Control**: This system gives you control AFTER seeing the result, which is crucial. You're not gambling blind—you're making informed decisions about whether to accept chaos or spend resources to control it.`
    },
    
    mayhemModifierTable: {
      title: 'Mayhem Modifier Strategic Values',
      headers: ['Modifier Count', 'Strategic Value', 'Recommended Usage'],
      rows: [
        ['0-2', 'Low Control', 'Generate more modifiers, avoid high-stakes chaos spells'],
        ['3-5', 'Moderate Control', 'Can adjust results by a few positions, use on medium-impact spells'],
        ['6-10', 'Good Control', 'Significant influence over outcomes, safe to use major chaos spells'],
        ['11-15', 'High Control', 'Can reach most desired results, ideal for critical moments'],
        ['16-20', 'Maximum Control', 'Near-complete control over chaos, use ultimate abilities freely']
      ]
    },
    
    chaosIntensityTable: {
      title: 'Chaos Intensity Levels',
      headers: ['Intensity', 'Description', 'Risk Level'],
      rows: [
        ['Minor Chaos', 'Small random effects, minimal impact (d4-d6 tables)', 'Low - Safe to use without modifiers'],
        ['Moderate Chaos', 'Noticeable random effects, can swing encounters (d10-d12 tables)', 'Medium - Consider spending 2-4 modifiers'],
        ['Major Chaos', 'Powerful random effects, game-changing results (d20 tables)', 'High - Spend 5-10 modifiers for safety'],
        ['Wild Magic', 'Extreme random effects, reality-altering consequences (d100 tables)', 'Extreme - Spend 10+ modifiers or embrace chaos'],
        ['Chaos Storm', 'Multiple simultaneous random effects, unpredictable cascades', 'Critical - Maximum modifiers recommended']
      ]
    },
    
    strategicConsiderations: {
      title: 'Strategic Considerations',
      content: `**When to Generate Modifiers**:
- At the start of combat before chaos spells are needed
- During lulls in combat when you have spare actions
- Before boss encounters or critical moments
- When your modifier count is below 5

**When to Spend Modifiers**:
- To avoid catastrophic negative results (like harming allies)
- To guarantee powerful positive results in critical moments
- To fine-tune results for specific tactical needs
- When you're near the 20 modifier cap and would waste generation

**When to Let Chaos Reign**:
- When you have few modifiers and the risk is acceptable
- When any result on the table would be beneficial
- When you want maximum unpredictability for roleplay
- When the potential reward outweighs the risk

**Resource Management**: Balance modifier generation with damage output. Spending too many turns generating modifiers reduces your damage, but having no modifiers makes chaos spells dangerous to use.`
    },

    practicalExample: {
      title: 'Practical Decision-Making Example',
      content: `**Scenario**: Boss fight. You have 4 Mayhem Modifiers. The boss has 60% HP. Your party's tank is at 30% HP. You're deciding whether to cast "Prismatic Chaos" (rolls on d100 table).

**Current State**:
- Mayhem Modifiers: 4
- Boss HP: ~60%
- Tank HP: ~30% (in danger)
- Your Mana: 35/50

**The d100 Table (Simplified)**:
- 1-10: Backfire effects (damage yourself or allies)
- 11-30: Minor effects (2d6-4d6 damage)
- 31-60: Moderate effects (4d8-6d8 damage)
- 61-85: Major effects (6d10-8d10 damage + secondary effects)
- 86-100: Catastrophic effects (10d10+ damage + terrain changes + status effects)

**Option A - Cast Now with Low Modifiers**:
Roll d100 with only 4 modifiers to adjust
- Pros: Immediate damage, might get lucky
- Cons: 10% chance of backfire, 30% chance of weak result, only 4 modifiers to fix bad rolls
- Risk: Could roll [5] (backfire), spend all 4 modifiers to reach [9] (still backfire)

**Option B - Generate Modifiers First**:
Cast "Wild Conduit" (6 mana, generates 2d4 modifiers), then cast Prismatic Chaos next turn
- Pros: Could have 8-12 modifiers next turn, much safer
- Cons: Boss gets another turn to attack tank (tank might die), you deal 0 damage this turn
- Risk: Tank dies while you're setting up

**Option C - Use Smaller Chaos Spell**:
Cast "Chaotic Bolt" (5 mana, rolls on d20 table - smaller, safer)
- Pros: Smaller table = less variance, 4 modifiers is enough to control d20 results
- Cons: Lower damage ceiling than Prismatic Chaos
- Risk: Minimal, d20 table is manageable with 4 modifiers

**Option D - Generate Modifiers + Heal Tank**:
Cast "Wild Conduit" this turn, have healer focus on tank
- Pros: Build modifiers safely, tank survives
- Cons: Requires coordination, you deal 0 damage
- Risk: Boss might target someone else

**Best Choice**: Option C (Chaotic Bolt on d20 table)

**Why**:
1. **Risk Assessment**: With only 4 modifiers, d100 is too dangerous (you can only adjust by ±4, which isn't enough to escape the 1-10 backfire zone if you roll low)
2. **Immediate Impact**: Tank needs the boss damaged NOW, not next turn
3. **Controlled Chaos**: d20 table has 20 results, and 4 modifiers let you adjust by ±4, giving you control over 8 possible results (40% of the table)
4. **Mana Efficiency**: Costs 5 mana vs 12 for Prismatic Chaos, leaves you with resources

**Execution**:
- Cast "Chaotic Bolt" (5 mana)
- Roll d20 → [8] = "Moderate damage - 3d6 fire damage"
- Decision: Spend 3 modifiers to adjust 8 → 11
- New Result: [11] = "Strong damage - 4d8 force damage + knockback"
- Modifiers: 4 - 3 = 1 remaining
- Damage: 4d8 → [6, 7, 5, 8] = 26 damage + boss is knocked back (away from tank!)

**Result**: Boss takes solid damage, gets knocked away from tank, tank survives. You still have 1 modifier and 30 mana for next turn.

**Alternative if You Had 12+ Modifiers**: Option A (Prismatic Chaos immediately)
- Why: With 12 modifiers, you can adjust by ±12, which means even if you roll [5] (backfire), you can spend 8 modifiers to reach [13] (minor effect) or spend 12 to reach [17] (moderate effect). You have enough control to make d100 safe.

**The Lesson**: Chaos Weaver decision-making is about matching your modifier count to the chaos intensity:
- **0-3 Modifiers**: Use small tables (d4, d6, d10) or generate more modifiers
- **4-7 Modifiers**: Use medium tables (d20, d33) safely
- **8-12 Modifiers**: Use large tables (d100) with caution
- **13-20 Modifiers**: Use any table freely, you have full control

Know your limits. Respect the chaos. Control what you can, embrace what you can't.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'Physical Tracking for Tabletop Play',
      content: `The Chaos Weaver's Mayhem Modifier system combines resource tracking with dynamic table rolling, creating an exciting in-person experience. Here's how to manage chaos at the physical table:

**Required Materials**:
- **20 tokens or beads** (for Mayhem Modifiers - purple/multicolored recommended)
- **Polyhedral dice set** (d4, d6, d8, d10, d12, d20, d100)
- **Printed rollable tables** (for your chaos spells)
- **Tracking mat or play area** with Modifier zone

**Mayhem Modifier Tracking**:

**The Token Method** (Recommended):

Use physical tokens to represent Mayhem Modifiers:
- **Starting State**: Begin with 0 tokens in your Modifier pool
- **Generating Modifiers**: When you cast a generation spell (Chaotic Infusion, Wild Conduit), roll the dice and add that many tokens to your pool
  - Example: Cast Chaotic Infusion → Roll 1d4 → [3] → Add 3 tokens to pool
  - Example: Cast Wild Conduit → Roll 2d4 → [2, 4] = 6 → Add 6 tokens to pool
- **Spending Modifiers**: When adjusting a table result, remove tokens equal to the adjustment
  - Example: Roll [8] on d20, want [12] → Remove 4 tokens (adjust by +4)
- **Maximum**: 20 tokens maximum in your pool

**Setup**:
Create two zones on your play mat:
- **Modifier Pool** (your active tokens - the chaos you've accumulated)
- **Bank** (unused tokens, up to 20 total)

**Why Tokens Work**: The physical act of accumulating chaotic energy (tokens) and then spending it to control chaos (removing tokens) creates a satisfying tactile loop. You can SEE your control over chaos grow as your token pile increases.

**Alternative Tracking Methods**:
- **d20 Die**: Set it to your current Modifier count (0-20)
- **Tally Marks**: Write on paper (functional but less immersive)
- **Colored Beads**: Use purple/rainbow beads in a small bowl for thematic flair

**Rolling on Chaos Tables**:

**The Physical Table Method**:

Chaos Weaver spells use rollable tables (d6, d10, d20, d33, d100). Here's how to handle them in person:

1. **Print Your Tables**: Have printed reference cards for each chaos spell showing the table outcomes
2. **Roll the Die**: Physically roll the appropriate die for the spell
3. **Check the Result**: Look up the result on the printed table
4. **Decide on Adjustment**: Decide if you want to spend Mayhem Modifiers to adjust the result
5. **Spend Tokens**: Remove tokens from your pool equal to the adjustment
6. **Apply Final Result**: Use the adjusted result from the table

**Example: Chaotic Bolt (d20 Table)**:

*You have 6 Mayhem Modifier tokens in your pool*

**Step 1 - Cast the Spell**:
- "I cast Chaotic Bolt!" (costs 5 mana)
- Pull out your d20

**Step 2 - Roll**:
- Roll d20 → [8]
- Check your printed Chaotic Bolt table → [8] = "Moderate damage - 3d6 fire damage"

**Step 3 - Decide**:
- "I want a better result. I'll spend 4 modifiers to adjust 8 → 12"
- Remove 4 tokens from your pool → Now at 2 tokens

**Step 4 - Apply**:
- Check table for [12] → "Strong damage - 4d8 force damage + knockback"
- Roll 4d8 for damage → [6, 7, 5, 8] = 26 damage
- Boss is knocked back!

**Quick Reference Card Template**:
\`\`\`
CHAOS WEAVER MAYHEM MODIFIERS

Current Modifiers: [Count your tokens]
Maximum: 20 modifiers

GENERATING MODIFIERS:
• Chaotic Infusion (4 mana): Roll 1d4, add tokens
• Wild Conduit (6 mana): Roll 2d4, add tokens

SPENDING MODIFIERS:
• Adjust table result by ±1: Remove 1 token
• Adjust by ±5: Remove 5 tokens
• Adjust by ±10: Remove 10 tokens

TABLE SAFETY GUIDELINES:
• d6-d10 tables: Safe with 2-3 modifiers
• d20 tables: Need 4-6 modifiers
• d100 tables: Need 10+ modifiers
\`\`\`

**Why Chaos Weaver Is Perfect for In-Person Play**: The class is built around physical randomization (rolling on tables) and resource management (spending tokens to control results). Every chaos spell becomes a mini-event at the table: roll the die, check the table, decide if you want to spend modifiers, adjust the result, and resolve the outcome. The physical components (tokens, dice, tables) make the abstract concept of "controlling chaos" tangible and exciting.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Chaos Weaver Specializations',
    subtitle: 'Three Paths of Chaotic Power',
    
    description: `Every Chaos Weaver chooses one of three specializations that define their approach to chaos magic. Each specialization offers unique passive abilities and influences your spell selection and playstyle.`,
    
    specs: [
      {
        id: 'reality-bending',
        name: 'Reality Bending',
        icon: 'spell_arcane_polymorphchicken',
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
          icon: 'spell_shadow_charm'
        },
        
        specPassive: {
          name: 'Reality Anchor',
          description: 'When you use a spell that transforms terrain or teleports creatures, gain +2 Mayhem Modifiers. Additionally, you can spend 3 Mayhem Modifiers to choose the exact location of teleportation effects instead of them being random.',
          icon: 'spell_arcane_portalorgrimmar'
        },
        
        keyAbilities: [
          'Fractured Realms - Create rifts with random planar effects',
          'Reality Swap - Swap positions with random creatures',
          'Whimsical Alteration - Alter object properties unpredictably'
        ]
      },

      {
        id: 'wild-magic',
        name: 'Wild Magic',
        icon: 'spell_nature_wispsplode',
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
          icon: 'spell_shadow_charm'
        },

        specPassive: {
          name: 'Wild Surge',
          description: 'Whenever you cast a spell, roll a d20. On a 1, trigger a Wild Magic Surge (roll on the Wild Magic Surge table). On a 20, your spell deals double damage or has double duration. Additionally, you generate +1 Mayhem Modifier whenever a Wild Magic Surge occurs.',
          icon: 'spell_fire_felrainoffire'
        },

        keyAbilities: [
          'Mist of Mayhem - AOE that triggers Wild Magic Surge for all creatures',
          'Arcane Roulette - d10 random spell effect',
          'Pandemonic Pulse - d20 chaos bolt with varying properties'
        ]
      },

      {
        id: 'entropy',
        name: 'Entropy',
        icon: 'spell_shadow_shadetruesight',
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
          icon: 'spell_shadow_charm'
        },

        specPassive: {
          name: 'Entropic Decay',
          description: 'Your chaos damage ignores 25% of enemy armor. Additionally, enemies damaged by your chaos spells have their armor reduced by 1 (stacking up to 5) for the rest of combat. When an enemy reaches 5 stacks, gain +3 Mayhem Modifiers.',
          icon: 'spell_shadow_antishadow'
        },

        keyAbilities: [
          'Entropic Blast - High damage with armor reduction',
          'Chaos Burst - Random damage type burst',
          'Discordant Strike - Weapon infusion with random damage'
        ]
      }
    ]
  }

  // NOTE: Example spells are defined at the top of CHAOS_WEAVER_DATA (line 251)
  // The duplicate exampleSpells array below has been removed to prevent conflicts
  // All starting spells are now properly defined in the first exampleSpells array
};


