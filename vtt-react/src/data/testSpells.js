/**
 * Comprehensive Test Spells
 * 
 * This file contains 37+ test spells that demonstrate EVERY feature of the spell wizard system.
 * These spells are designed to verify formatting and display across all contexts.
 * 
 * Categories:
 * - Resolution Methods (DICE, CARDS, COINS)
 * - Effect Types (damage, healing, buff, debuff, utility, control, summoning, transformation, purification, restoration)
 * - Spell Types (ACTION, CHANNELED, PASSIVE, REACTION, TRAP, STATE)
 * - Targeting Types (single, multi, area, chain, cone, line, self, smart, nearest)
 * - Advanced Mechanics (rollable tables, triggers, progressive effects, etc.)
 */

// Helper function to generate spell IDs
const generateSpellId = (name) => {
  return 'test-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-');
};

// ============================================================================
// RESOLUTION METHOD TESTS (3 spells)
// ============================================================================

export const RESOLUTION_TEST_SPELLS = [
  // Test 1: DICE Resolution
  {
    id: generateSpellId('TEST: Dice Fireball'),
    name: 'TEST: Dice Fireball',
    description: 'Tests DICE resolution with advantage, critical hits, and exploding dice. This spell demonstrates all dice-based mechanics including advantage rolls, critical hit configuration, and exploding dice.',
    level: 3,
    school: 'evocation',
    icon: 'spell_fire_fireball02',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'dice', 'damage'],
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 150,
      areaShape: 'sphere',
      areaSize: 20,
      targetRestrictions: ['enemies', 'objects'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    damageConfig: {
      formula: '8d6+INT',
      damageTypes: ['fire'],
      resolution: 'DICE',
      diceConfig: {
        advantage: true,
        disadvantage: false,
        explodingDice: true
      },
      useCriticalEffect: true,
      criticalConfig: {
        critThreshold: 18,
        critMultiplier: 2,
        critDiceOnly: true,
        extraDice: '2d6',
        explodingDice: true
      },
      savingThrow: 'agility',
      difficultyClass: 15,
      saveOutcome: 'halves'
    },
    resourceCost: {
      components: ['verbal', 'somatic', 'material'],
      materialComponents: 'A tiny ball of bat guano and sulfur',
      actionPoints: 1,
      mana: 30,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 3
    }
  },

  // Test 2: CARDS Resolution
  {
    id: generateSpellId('TEST: Card Arcane Gambit'),
    name: 'TEST: Card Arcane Gambit',
    description: 'Tests CARDS resolution with poker hand evaluation. Draw cards from a mystical deck, dealing damage based on card values and face cards.',
    level: 4,
    school: 'evocation',
    icon: 'spell_arcane_blast',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'cards', 'damage'],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 60,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    damageConfig: {
      formula: 'CARD_VALUE + (FACE_CARDS * 5) + INT',
      damageTypes: ['force', 'arcane'],
      resolution: 'CARDS',
      cardConfig: {
        drawCount: 5,
        deckType: 'STANDARD'
      },
      useCriticalEffect: true,
      criticalConfig: {
        critThreshold: 0,
        critMultiplier: 2,
        description: 'Critical on face cards'
      }
    },
    resourceCost: {
      components: ['verbal', 'somatic', 'material'],
      materialComponents: 'A tiny ball of bat guano and sulfur',
      actionPoints: 1,
      mana: 35,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 2
    }
  },

  // Test 3: COINS Resolution
  {
    id: generateSpellId('TEST: Coin Fortune Frost'),
    name: 'TEST: Coin Fortune Frost',
    description: 'Tests COINS resolution with streak detection. Flip coins to determine the power of your frost attack, with bonus damage for all heads.',
    level: 3,
    school: 'evocation',
    icon: 'spell_frost_frostbolt02',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'coins', 'damage'],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 60,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    damageConfig: {
      formula: 'HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)',
      damageTypes: ['cold'],
      resolution: 'COINS',
      coinConfig: {
        flipCount: 7,
        coinType: 'STANDARD'
      }
    },
    resourceCost: {
      components: ['verbal', 'material'],
      materialComponents: 'Seven silver coins',
      actionPoints: 1,
      mana: 25,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 2
    }
  }
];

// ============================================================================
// EFFECT TYPE TESTS (10 spells - one per effect type)
// ============================================================================

export const EFFECT_TYPE_TEST_SPELLS = [
  // Test 4: Damage with Chain Effect
  {
    id: generateSpellId('TEST: Chain Lightning'),
    name: 'TEST: Chain Lightning',
    description: 'Tests damage effect with chain targeting. Lightning arcs between multiple targets with diminishing damage.',
    level: 5,
    school: 'evocation',
    icon: 'spell_nature_lightning',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'damage', 'chain'],
    targetingConfig: {
      targetingType: 'chain',
      rangeType: 'ranged',
      rangeDistance: 100,
      targetCount: 5,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true,
      propagation: {
        enabled: true,
        maxJumps: 5,
        jumpRange: 30,
        falloffType: 'percentage',
        falloffRate: 25
      }
    },
    durationConfig: {
      durationType: 'instant'
    },
    damageConfig: {
      formula: '6d8',
      damageTypes: ['lightning'],
      resolution: 'DICE',
      useChainEffect: true,
      chainConfig: {
        targets: 5,
        falloffType: 'percentage',
        falloffRate: 25,
        minimumDamage: 10
      },
      savingThrow: 'agility',
      difficultyClass: 16,
      saveOutcome: 'halves'
    },
    resourceCost: {
      components: ['verbal', 'somatic', 'material'],
      materialComponents: 'A bit of fur and an amber rod',
      somaticText: 'Point fingers at targets in sequence',
      verbalText: 'Chains of lightning!',
      materialComponents: 'A bit of fur and an amber rod',
      actionPoints: 1,
      mana: 40, health: 0, stamina: 0, focus: 0,
      classResource: {
        type: 'arcane_charges',
        cost: 4
      }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 4
    }
  },

  // Test 5: Healing with HoT and Shield
  {
    id: generateSpellId('TEST: Rejuvenation'),
    name: 'TEST: Rejuvenation',
    description: 'Tests healing effect with HoT (Healing over Time), absorption shield, and chain healing. Provides immediate healing, ongoing regeneration, and a protective barrier.',
    level: 5,
    school: 'abjuration',
    icon: 'spell_holy_heal02',
    spellType: 'ACTION',
    effectTypes: ['healing'],
    source: 'test',
    tags: ['test', 'healing', 'shield', 'hot'],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 40,
      targetRestrictions: ['allies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 6,
      durationUnit: 'rounds',
      requiresConcentration: false
    },
    healingConfig: {
      formula: '5d8+SPI',
      healingType: 'direct',
      resolution: 'DICE',
      useAbsorptionShield: true,
      shieldConfig: {
        shieldType: 'reflective',
        shieldAmount: '3d6',
        duration: 5,
        reflectionType: 'magical',
        reflectionPercentage: 50
      },
      hasHotEffect: true,
      hotConfig: {
        tickFormula: '2d4+SPI',
        duration: 6,
        tickFrequency: 'end_of_turn'
      },
      useChainHealing: true,
      chainConfig: {
        targets: 4,
        targetSelection: 'lowest_health',
        falloffType: 'percentage',
        falloffRate: 20
      }
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      somaticText: 'Gentle circular motions over wounds',
      verbalText: 'Vita restauro!',
      actionPoints: 1,
      mana: 25, health: 0, stamina: 0, focus: 0,
      classResource: {
        type: 'holy_power',
        cost: 3
      }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 5
    }
  },

  // Test 6: Buff with Stacking
  {
    id: generateSpellId('TEST: Progressive Might'),
    name: 'TEST: Progressive Might',
    description: 'Tests buff effect with progressive stacking. Each cast increases strength and attack power, stacking up to 5 times.',
    level: 4,
    school: 'transmutation',
    icon: 'spell_holy_powerwordfortitude',
    spellType: 'ACTION',
    effectTypes: ['buff'],
    source: 'test',
    tags: ['test', 'buff', 'stacking'],
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      rangeDistance: 0,
      targetRestrictions: ['self'],
      lineOfSightRequired: false
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 10,
      durationUnit: 'rounds',
      requiresConcentration: true,
      concentrationDC: 14
    },
    buffConfig: {
      statModifiers: [
        {
          name: 'Strength',
          magnitude: 3,
          magnitudeType: 'flat'
        },
        {
          name: 'Attack Power',
          magnitude: 15,
          magnitudeType: 'percentage'
        }
      ],
      statusEffects: [
        {
          id: 'Haste',
          level: 'major'
        }
      ],
      stackingRule: 'progressive',
      maxStacks: 5,
      durationType: 'rounds',
      durationValue: 10,
      concentrationRequired: true
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      somaticText: 'Flex muscles and strike a power pose',
      verbalText: 'Fortitudo crescens!',
      actionPoints: 1,
      mana: 30, health: 0, stamina: 0, focus: 0,
      classResource: {
        type: 'combo_points',
        cost: 5
      }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 0
    }
  },

  // Test 7: Debuff with Complex Charm
  {
    id: generateSpellId('TEST: Dominate Mind'),
    name: 'TEST: Dominate Mind',
    description: 'Tests debuff effect with complex charm mechanics. Dominate a target\'s mind, forcing them to obey commands while reducing their intelligence.',
    level: 6,
    school: 'enchantment',
    icon: 'spell_shadow_charm',
    spellType: 'ACTION',
    effectTypes: ['debuff'],
    source: 'test',
    tags: ['test', 'debuff', 'charm', 'control'],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 60,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'minutes',
      durationValue: 10,
      durationUnit: 'minutes',
      requiresConcentration: true,
      concentrationDC: 18
    },
    debuffConfig: {
      statusEffects: [
        {
          id: 'Charmed',
          level: 'extreme',
          charmType: 'dominated',
          canAttackCharmer: false,
          canSelfHarm: false,
          retainsMemory: false,
          commandComplexity: 'any',
          maxCommands: 10,
          saveDC: 18,
          saveType: 'wisdom',
          saveOutcome: 'negates',
          saveTrigger: 'harmful',
          saveFrequency: 'end_of_turn'
        }
      ],
      statPenalties: [
        {
          name: 'Intelligence',
          magnitude: -4,
          magnitudeType: 'flat'
        }
      ],
      savingThrow: 'wisdom',
      difficultyClass: 18,
      saveOutcome: 'negates',
      stackingRule: 'replace',
      durationType: 'minutes',
      durationValue: 10,
      canBeDispelled: true
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      actionPoints: 1,
      mana: 30, health: 20, stamina: 0, focus: 0
    },
    cooldownConfig: {
      cooldownType: 'long_rest',
      cooldownValue: 1
    }
  },

  // Test 8: Utility - Teleportation
  {
    id: generateSpellId('TEST: Dimension Door'),
    name: 'TEST: Dimension Door',
    description: 'Tests utility effect with teleportation. Instantly teleport to a location you can see within range.',
    level: 4,
    school: 'conjuration',
    icon: 'spell_arcane_teleportundercity',
    spellType: 'ACTION',
    effectTypes: ['utility'],
    source: 'test',
    tags: ['test', 'utility', 'teleport', 'movement'],
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'ranged',
      rangeDistance: 500,
      targetRestrictions: ['self'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    utilityConfig: {
      utilityType: 'movement',
      utilitySubtype: 'teleport',
      selectedEffects: [
        {
          name: 'Teleport',
          customName: 'Dimension Door'
        }
      ],
      duration: 1,
      durationUnit: 'rounds',
      difficultyClass: 15,
      concentration: false
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      somaticText: 'Tear open a rift in space',
      verbalText: 'Porta dimensio!',
      actionPoints: 1,
      mana: 35,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'short_rest',
      cooldownValue: 1
    }
  },

  // Test 9: Control - Gravity Well
  {
    id: generateSpellId('TEST: Gravity Well'),
    name: 'TEST: Gravity Well',
    description: 'Tests control effect. Create a point of intense gravity that pulls enemies toward it.',
    level: 5,
    school: 'transmutation',
    icon: 'spell_arcane_starfire',
    spellType: 'ACTION',
    effectTypes: ['control'],
    source: 'test',
    tags: ['test', 'control', 'gravity', 'pull'],
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 120,
      areaShape: 'sphere',
      areaSize: 30,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 5,
      durationUnit: 'rounds',
      requiresConcentration: true
    },
    controlConfig: {
      controlType: 'pull',
      strength: 'major',
      duration: 5,
      savingThrow: 'strength',
      difficultyClass: 17,
      saveOutcome: 'negates'
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      somaticText: 'Pull fists downward forcefully',
      verbalText: 'Gravitas maxima!',
      actionPoints: 1,
      mana: 20, health: 0, stamina: 15, focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 6
    }
  },

  // Test 10: Summoning - Elemental
  {
    id: generateSpellId('TEST: Summon Fire Elemental'),
    name: 'TEST: Summon Fire Elemental',
    description: 'Tests summoning effect. Summon a fire elemental to fight alongside you.',
    level: 5,
    school: 'conjuration',
    icon: 'spell_fire_elemental_totem',
    spellType: 'ACTION',
    effectTypes: ['summoning'],
    source: 'test',
    tags: ['test', 'summoning', 'elemental', 'fire'],
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 60,
      areaShape: 'circle',
      areaSize: 5,
      targetRestrictions: ['enemies', 'objects'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 10,
      durationUnit: 'rounds',
      requiresConcentration: true
    },
    summoningConfig: {
      summonType: 'creature',
      creatureType: 'elemental',
      creatureName: 'Fire Elemental',
      creatureLevel: 5,
      creatureStats: {
        health: 102,
        armor: 13,
        damage: '2d6+3',
        attackBonus: 6,
        abilities: ['Fire Form', 'Illumination', 'Water Susceptibility']
      },
      duration: 10,
      durationType: 'rounds',
      maxSummons: 1,
      controlType: 'full',
      commandable: true,
      sharesInitiative: false
    },
    resourceCost: {
      components: ['verbal', 'somatic', 'material'],
      verbalText: 'Ignis elementum, veni!',
      somaticText: 'Draw a circle of flame in the air',
      materialComponents: 'A ruby worth 100gp',
      actionPoints: 1,
      mana: 50,
      health: 0,
      stamina: 0,
      focus: 0,
      classResource: {
        type: 'holy_power',
        cost: 3
      }
    },
    cooldownConfig: {
      cooldownType: 'long_rest',
      cooldownValue: 1
    }
  },

  // Test 11: Transformation - Polymorph
  {
    id: generateSpellId('TEST: Polymorph Beast'),
    name: 'TEST: Polymorph Beast',
    description: 'Tests transformation effect. Transform a creature into a harmless beast.',
    level: 4,
    school: 'transmutation',
    icon: 'ability_druid_catform',
    spellType: 'ACTION',
    effectTypes: ['transformation'],
    source: 'test',
    tags: ['test', 'transformation', 'polymorph'],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 60,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'minutes',
      durationValue: 10,
      durationUnit: 'minutes',
      requiresConcentration: true
    },
    transformationConfig: {
      transformationType: 'animal',
      targetForm: 'sheep',
      duration: 10,
      durationUnit: 'minutes',
      retainsAbilities: false,
      savingThrow: 'wisdom',
      difficultyClass: 15
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      materialComponents: 'A caterpillar cocoon',
      somaticText: 'Trace the outline of the target creature',
      verbalText: 'Forma mutatio!',
      actionPoints: 1,
      mana: 35, health: 0, stamina: 0, focus: 0,
      classResource: {
        type: 'chi',
        cost: 3
      }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 5
    }
  },

  // Test 12: Purification - Cleanse
  {
    id: generateSpellId('TEST: Greater Purification'),
    name: 'TEST: Greater Purification',
    description: 'Tests purification effect. Remove all negative effects from the target.',
    level: 5,
    school: 'abjuration',
    icon: 'spell_holy_purify',
    spellType: 'ACTION',
    effectTypes: ['purification'],
    source: 'test',
    tags: ['test', 'purification', 'cleanse'],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'touch',
      rangeDistance: 5,
      targetRestrictions: ['allies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    purificationConfig: {
      purificationType: 'cleanse_all',
      targetEffects: ['poison', 'disease', 'curse', 'magic'],
      strength: 'major'
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      materialComponents: 'Holy water and powdered silver',
      somaticText: 'Wave hands over the afflicted',
      verbalText: 'Puritas maxima!',
      actionPoints: 1,
      mana: 40,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'short_rest',
      cooldownValue: 1
    }
  },

  // Test 13: Restoration - Revive
  {
    id: generateSpellId('TEST: Resurrection'),
    name: 'TEST: Resurrection',
    description: 'Tests restoration effect. Bring a fallen ally back to life.',
    level: 7,
    school: 'necromancy',
    icon: 'spell_holy_resurrection',
    spellType: 'ACTION',
    effectTypes: ['restoration'],
    source: 'test',
    tags: ['test', 'restoration', 'resurrection'],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'touch',
      rangeDistance: 5,
      targetRestrictions: ['allies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    restorationConfig: {
      restorationType: 'resurrection',
      targetState: 'dead',
      restoredHealth: '50%',
      restoredMana: '25%',
      removesConditions: ['Dead', 'Dying', 'Unconscious', 'Exhaustion'],
      castingTime: 60,
      castingTimeUnit: 'seconds',
      requiresBody: true,
      timeLimit: 600,
      timeLimitUnit: 'seconds',
      materialCost: 500,
      penaltyOnRevive: {
        type: 'exhaustion',
        level: 1
      }
    },
    resourceCost: {
      components: ['verbal', 'somatic', 'material'],
      verbalText: 'Vita redux, anima reveni!',
      somaticText: 'Place hands on the deceased\'s heart',
      materialComponents: 'A diamond worth 1000gp (consumed)',
      actionPoints: 1,
      mana: 100,
      health: 0,
      stamina: 0,
      focus: 0,
      reagents: [
        {
          name: 'Diamond',
          quantity: 1,
          consumed: true
        }
      ]
    },
    cooldownConfig: {
      cooldownType: 'long_rest',
      cooldownValue: 1
    }
  }
];

// ============================================================================
// SPELL TYPE TESTS (6 spells)
// ============================================================================

export const SPELL_TYPE_TEST_SPELLS = [
  // Test 14: CHANNELED Spell
  {
    id: generateSpellId('TEST: Channeled Beam'),
    name: 'TEST: Channeled Beam',
    description: 'Tests CHANNELED spell type. Channel a beam of energy that increases in power each turn.',
    level: 4,
    school: 'evocation',
    icon: 'spell_arcane_arcane04',
    spellType: 'CHANNELED',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'channeled', 'damage'],
    targetingConfig: {
      targetingType: 'line',
      rangeType: 'ranged',
      rangeDistance: 60,
      areaShape: 'line',
      areaSize: 60,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 5,
      durationUnit: 'rounds',
      requiresConcentration: true,
      concentrationDC: 15
    },
    channelingConfig: {
      tickFrequency: 'per_turn',
      tickScaling: 'INCREASING',
      breakEffect: 'BACKLASH',
      concentrationDC: 15,
      perRoundFormulas: {
        damage: ['2d6', '3d6', '4d6', '5d6', '6d6']
      }
    },
    damageConfig: {
      formula: '2d6',
      damageTypes: ['force'],
      resolution: 'DICE'
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      somaticText: 'Extend arm and maintain focus',
      verbalText: 'Radius continuus!',
      actionPoints: 1,
      mana: 20, health: 0, stamina: 0, focus: 0,
      classResource: {
        type: 'runes',
        cost: 2
      }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 4
    }
  },

  // Test 15: PASSIVE Spell
  {
    id: generateSpellId('TEST: Passive Aura'),
    name: 'TEST: Passive Aura',
    description: 'Tests PASSIVE spell type. Provides a permanent armor bonus.',
    level: 2,
    school: 'abjuration',
    icon: 'spell_holy_devotionaura',
    spellType: 'PASSIVE',
    effectTypes: ['buff'],
    source: 'test',
    tags: ['test', 'passive', 'aura'],
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      rangeDistance: 0,
      targetRestrictions: ['self'],
      lineOfSightRequired: false
    },
    durationConfig: {
      durationType: 'permanent'
    },
    buffConfig: {
      statModifiers: [
        {
          name: 'Armor',
          magnitude: 5,
          magnitudeType: 'flat'
        }
      ],
      durationType: 'permanent'
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      somaticText: 'Spread arms wide to emanate energy',
      verbalText: 'Aura perpetua!',
      actionPoints: 0,
      mana: 0,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 0
    }
  },

  // Test 16: REACTION Spell
  {
    id: generateSpellId('TEST: Counterspell'),
    name: 'TEST: Counterspell',
    description: 'Tests REACTION spell type. Counter an enemy spell as a reaction.',
    level: 3,
    school: 'abjuration',
    icon: 'spell_frost_iceshock',
    spellType: 'REACTION',
    effectTypes: ['utility'],
    source: 'test',
    tags: ['test', 'reaction', 'counter'],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 60,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    triggerConfig: {
      global: {
        logicType: 'OR',
        compoundTriggers: [
          {
            id: 'spell_cast',
            name: 'When an enemy casts a spell',
            parameters: {
              spell_type: 'any',
              triggerChance: 100,
              range: 60
            }
          }
        ]
      },
      triggerRole: {
        mode: 'REACTIVE',
        activationDelay: 0,
        requiresLOS: true
      }
    },
    utilityConfig: {
      utilityType: 'control',
      utilitySubtype: 'counterspell',
      selectedEffects: [
        {
          name: 'Counter Spell',
          customName: 'Counterspell'
        }
      ],
      duration: 1,
      durationUnit: 'rounds',
      difficultyClass: 15,
      concentration: false
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      verbalText: 'Nullify!',
      somaticText: 'Thrust palm forward to deflect magic',
      actionPoints: 0,
      mana: 25,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 3
    }
  },

  // Test 17: TRAP Spell
  {
    id: generateSpellId('TEST: Explosive Rune'),
    name: 'TEST: Explosive Rune',
    description: 'Tests TRAP spell type. Place an explosive rune that detonates when triggered.',
    level: 3,
    school: 'abjuration',
    icon: 'spell_fire_selfdestruct',
    spellType: 'TRAP',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'trap', 'explosive'],
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'touch',
      rangeDistance: 5,
      areaShape: 'circle',
      areaSize: 10,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'hours',
      durationValue: 8,
      durationUnit: 'hours'
    },
    triggerConfig: {
      global: {
        logicType: 'OR',
        compoundTriggers: [
          {
            id: 'enemy_enters_area',
            name: 'When an enemy enters the area',
            parameters: {
              radius: 5,
              triggerOnce: false,
              triggerChance: 100
            }
          }
        ]
      },
      triggerRole: {
        mode: 'TRAP',
        activationDelay: 0,
        requiresLOS: false
      }
    },
    damageConfig: {
      formula: '10d6',
      damageTypes: ['fire', 'force'],
      resolution: 'DICE',
      savingThrow: 'agility',
      difficultyClass: 15,
      saveOutcome: 'halves'
    },
    resourceCost: {
      components: ['verbal', 'somatic', 'material'],
      verbalText: 'Explosive rune!',
      somaticText: 'Trace a glowing rune in the air',
      materialComponents: 'Powdered diamond worth 50gp',
      actionPoints: 1,
      mana: 30,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'short_rest',
      cooldownValue: 1
    }
  },

  // Test 18: STATE Spell
  {
    id: generateSpellId('TEST: Invisibility'),
    name: 'TEST: Invisibility',
    description: 'Tests STATE spell type. Become invisible for a duration.',
    level: 2,
    school: 'illusion',
    icon: 'ability_stealth',
    spellType: 'STATE',
    effectTypes: ['buff'],
    source: 'test',
    tags: ['test', 'state', 'invisibility'],
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      rangeDistance: 0,
      targetRestrictions: ['self'],
      lineOfSightRequired: false
    },
    durationConfig: {
      durationType: 'minutes',
      durationValue: 10,
      durationUnit: 'minutes',
      requiresConcentration: true
    },
    buffConfig: {
      statusEffects: [
        {
          id: 'Invisible',
          level: 'major'
        }
      ],
      durationType: 'minutes',
      durationValue: 10,
      concentrationRequired: true
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      somaticText: 'Pass hand over body from head to toe',
      verbalText: 'Invisibilis!',
      actionPoints: 1,
      mana: 20,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'short_rest',
      cooldownValue: 1
    }
  },

  // Test 19: REACTION with Compound Triggers
  {
    id: generateSpellId('TEST: Arcane Counterstrike'),
    name: 'TEST: Arcane Counterstrike',
    description: 'Tests REACTION spell with compound triggers (AND logic). When hit by a spell while in combat, absorb the energy and strike back with arcane force.',
    level: 3,
    school: 'abjuration',
    icon: 'spell_arcane_arcane04',
    spellType: 'REACTION',
    effectTypes: ['damage', 'utility'],
    source: 'test',
    tags: ['test', 'reaction', 'trigger', 'compound', 'arcane'],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 60,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    triggerConfig: {
      global: {
        logicType: 'AND',
        compoundTriggers: [
          {
            id: 'spell_cast',
            name: 'When an enemy casts a spell',
            parameters: {
              perspective: 'enemy',
              spell_type: 'any',
              triggerChance: 100,
              range: 60
            }
          },
          {
            id: 'in_combat',
            name: 'When in combat',
            parameters: {
              perspective: 'self'
            }
          }
        ]
      },
      triggerRole: {
        mode: 'REACTIVE',
        activationDelay: 0,
        requiresLOS: true
      }
    },
    damageConfig: {
      formula: '3d10 + 5',
      damageTypes: ['arcane'],
      resolution: 'DICE',
      savingThrow: 'intelligence',
      difficultyClass: 16,
      saveOutcome: 'halves',
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: true
      }
    },
    utilityConfig: {
      utilityType: 'control',
      utilitySubtype: 'interrupt',
      selectedEffects: [
        {
          id: 'interrupt',
          name: 'Interrupt Spell',
          customName: 'Counterstrike',
          description: 'Interrupts the target\'s spell casting',
          potency: 'strong'
        }
      ],
      duration: 1,
      durationUnit: 'instant',
      difficultyClass: 16,
      savingThrow: 'intelligence',
      concentration: false
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      verbalText: 'Nullify and strike!',
      somaticText: 'Absorb energy and redirect it',
      actionPoints: 0,
      mana: 30,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 2
    }
  }
];

// ============================================================================
// TARGETING TYPE TESTS (9 spells)
// ============================================================================

export const TARGETING_TEST_SPELLS = [
  // Test 19: Single Target
  {
    id: generateSpellId('TEST: Single Target Bolt'),
    name: 'TEST: Single Target Bolt',
    description: 'Tests single target targeting. Fire a bolt at a single enemy.',
    level: 1,
    school: 'evocation',
    icon: 'spell_shadow_shadowbolt',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'targeting', 'single'],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 120,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    damageConfig: {
      formula: '1d10',
      damageTypes: ['force'],
      resolution: 'DICE'
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      actionPoints: 1,
      mana: 10,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 0
    }
  },

  // Test 20: Multi Target
  {
    id: generateSpellId('TEST: Multi Target Missiles'),
    name: 'TEST: Multi Target Missiles',
    description: 'Tests multi target targeting. Fire missiles at up to 3 different targets.',
    level: 2,
    school: 'evocation',
    icon: 'spell_arcane_missiles',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'targeting', 'multi'],
    targetingConfig: {
      targetingType: 'multi',
      rangeType: 'ranged',
      rangeDistance: 120,
      targetCount: 3,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    damageConfig: {
      formula: '1d4+1',
      damageTypes: ['force'],
      resolution: 'DICE'
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      actionPoints: 1,
      mana: 15,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 1
    }
  },

  // Test 21: Area (Circle)
  {
    id: generateSpellId('TEST: Area Circle Blast'),
    name: 'TEST: Area Circle Blast',
    description: 'Tests area targeting with circle shape. Explode in a circular area.',
    level: 3,
    school: 'evocation',
    icon: 'spell_fire_flameshock',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'targeting', 'area', 'circle'],
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 150,
      areaShape: 'circle',
      areaSize: 20,
      targetRestrictions: ['enemies', 'objects'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    damageConfig: {
      formula: '8d6',
      damageTypes: ['fire'],
      resolution: 'DICE',
      savingThrow: 'agility',
      difficultyClass: 15,
      saveOutcome: 'halves'
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      actionPoints: 1,
      mana: 30,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 3
    }
  },

  // Test 22: Area (Cone)
  {
    id: generateSpellId('TEST: Area Cone Breath'),
    name: 'TEST: Area Cone Breath',
    description: 'Tests area targeting with cone shape. Breathe fire in a cone.',
    level: 3,
    school: 'evocation',
    icon: 'spell_fire_fireballgreen',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'targeting', 'area', 'cone'],
    targetingConfig: {
      targetingType: 'cone',
      rangeType: 'self',
      rangeDistance: 0,
      areaShape: 'cone',
      areaSize: 30,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    damageConfig: {
      formula: '6d8',
      damageTypes: ['fire'],
      resolution: 'DICE',
      savingThrow: 'agility',
      difficultyClass: 14,
      saveOutcome: 'halves'
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      actionPoints: 1,
      mana: 15, health: 0, stamina: 20, focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 4
    }
  },

  // Test 23: Area (Line)
  {
    id: generateSpellId('TEST: Area Line Lightning'),
    name: 'TEST: Area Line Lightning',
    description: 'Tests area targeting with line shape. Strike in a line.',
    level: 3,
    school: 'evocation',
    icon: 'spell_nature_chainlightning',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'targeting', 'area', 'line'],
    targetingConfig: {
      targetingType: 'line',
      rangeType: 'self',
      rangeDistance: 0,
      areaShape: 'line',
      areaSize: 100,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    damageConfig: {
      formula: '8d6',
      damageTypes: ['lightning'],
      resolution: 'DICE',
      savingThrow: 'agility',
      difficultyClass: 15,
      saveOutcome: 'halves'
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      actionPoints: 1,
      mana: 30,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 3
    }
  },

  // Test 24: Smart Targeting
  {
    id: generateSpellId('TEST: Smart Target Heal'),
    name: 'TEST: Smart Target Heal',
    description: 'Tests smart targeting. Automatically heals the most wounded ally.',
    level: 2,
    school: 'abjuration',
    icon: 'spell_holy_flashheal',
    spellType: 'ACTION',
    effectTypes: ['healing'],
    source: 'test',
    tags: ['test', 'targeting', 'smart'],
    targetingConfig: {
      targetingType: 'smart',
      rangeType: 'ranged',
      rangeDistance: 40,
      targetRestrictions: ['allies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    healingConfig: {
      formula: '2d8+SPI',
      healingType: 'direct',
      resolution: 'DICE'
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      actionPoints: 1,
      mana: 20, health: 0, stamina: 0, focus: 15
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 1
    }
  },

  // Test 25: Nearest Enemy
  {
    id: generateSpellId('TEST: Nearest Enemy Strike'),
    name: 'TEST: Nearest Enemy Strike',
    description: 'Tests nearest targeting. Automatically strikes the nearest enemy.',
    level: 1,
    school: 'evocation',
    icon: 'ability_warrior_charge',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'targeting', 'nearest'],
    targetingConfig: {
      targetingType: 'nearest',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    damageConfig: {
      formula: '2d6+STR',
      damageTypes: ['physical'],
      resolution: 'DICE'
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      actionPoints: 1,
      mana: 10, health: 0, stamina: 0, focus: 20
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 0
    }
  }
];

// ============================================================================
// ADVANCED MECHANICS TESTS (10 spells)
// ============================================================================

export const ADVANCED_MECHANICS_TEST_SPELLS = [
  // Test 26: Rollable Table
  {
    id: generateSpellId('TEST: Wild Magic Surge'),
    name: 'TEST: Wild Magic Surge',
    description: 'Tests rollable table mechanics. Roll on a table for random effects.',
    level: 3,
    school: 'evocation',
    icon: 'spell_arcane_prismaticcloak',
    spellType: 'ACTION',
    effectTypes: ['utility'],
    source: 'test',
    tags: ['test', 'advanced', 'rollable_table'],
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      rangeDistance: 0,
      targetRestrictions: ['self'],
      lineOfSightRequired: false
    },
    durationConfig: {
      durationType: 'instant'
    },
    mechanicsConfig: {
      rollableTable: {
        enabled: true,
        tableName: 'Wild Magic Effects',
        diceFormula: '1d20',
        outcomes: [
          { range: [1, 2], effect: 'Fireball centered on self (6d6 fire damage)' },
          { range: [3, 4], effect: 'Turn invisible for 1 minute' },
          { range: [5, 6], effect: 'Heal all allies within 30 feet for 2d8+4' },
          { range: [7, 8], effect: 'Summon 1d4 hostile imps' },
          { range: [9, 10], effect: 'Teleport 30 feet in a random direction' },
          { range: [11, 12], effect: 'Grow to Large size for 1 minute' },
          { range: [13, 14], effect: 'Cast Confusion on nearest creature' },
          { range: [15, 16], effect: 'Gain +2 to all ability scores for 1 minute' },
          { range: [17, 18], effect: 'Lightning bolt shoots from your hands (8d6 lightning)' },
          { range: [19, 20], effect: 'Regain all expended spell slots' }
        ]
      }
    },
    resourceCost: {
      components: ['verbal', 'somatic', 'material'],
      materialComponents: 'A shard of chaos crystal',
      somaticText: 'Wild gesticulations',
      verbalText: 'Chaos unleashed!',
      materialComponents: 'A shard of chaos crystal',
      actionPoints: 1,
      mana: 25,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 5
    }
  },

  // Test 27: Charge-based Cooldown
  {
    id: generateSpellId('TEST: Charge Fireball'),
    name: 'TEST: Charge Fireball',
    description: 'Tests charge-based cooldown. Has 3 charges that recover over time.',
    level: 3,
    school: 'evocation',
    icon: 'spell_fire_fireball',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'advanced', 'charges'],
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 150,
      areaShape: 'sphere',
      areaSize: 20,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    damageConfig: {
      formula: '8d6',
      damageTypes: ['fire'],
      resolution: 'DICE',
      savingThrow: 'agility',
      difficultyClass: 15,
      saveOutcome: 'halves'
    },
    resourceCost: {
      components: ['verbal', 'somatic', 'material'],
      materialComponents: 'A pinch of sulfur',
      somaticText: 'Cup hands and gather energy',
      verbalText: 'Ignis globus!',
      materialComponents: 'A pinch of sulfur',
      actionPoints: 1,
      mana: 30,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'charge_based',
      cooldownValue: 0,
      charges: 3,
      chargeRecoveryRate: 3
    }
  },

  // Test 28: Dice-based Cooldown
  {
    id: generateSpellId('TEST: Dice Cooldown Blast'),
    name: 'TEST: Dice Cooldown Blast',
    description: 'Tests dice-based cooldown. Cooldown is determined by rolling 1d4.',
    level: 2,
    school: 'evocation',
    icon: 'spell_fire_fireblast',
    spellType: 'ACTION',
    effectTypes: ['damage'],
    source: 'test',
    tags: ['test', 'advanced', 'dice_cooldown'],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 60,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    damageConfig: {
      formula: '4d6',
      damageTypes: ['fire'],
      resolution: 'DICE'
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      actionPoints: 1,
      mana: 20,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'dice_based',
      cooldownValue: 0,
      cooldownDice: '1d4'
    }
  },

  // Test 29: Reagent Requirements
  {
    id: generateSpellId('TEST: Reagent Ritual'),
    name: 'TEST: Reagent Ritual',
    description: 'Tests reagent requirements. Requires specific components to cast.',
    level: 4,
    school: 'conjuration',
    icon: 'spell_shadow_ritualofsacrifice',
    spellType: 'ACTION',
    effectTypes: ['summoning'],
    source: 'test',
    tags: ['test', 'advanced', 'reagents'],
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 30,
      areaShape: 'circle',
      areaSize: 5,
      targetRestrictions: ['enemies', 'objects'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 10,
      durationUnit: 'rounds'
    },
    summoningConfig: {
      summonType: 'creature',
      creatureType: 'demon',
      duration: 10,
      durationUnit: 'rounds',
      controlLevel: 'full',
      maxSummons: 1
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      actionPoints: 1,
      mana: 40,
      health: 10,
      stamina: 0,
      focus: 0,
      reagents: [
        {
          name: 'Demon Blood',
          quantity: 1,
          consumed: true
        },
        {
          name: 'Sulfur',
          quantity: 3,
          consumed: true
        },
        {
          name: 'Ritual Circle',
          quantity: 1,
          consumed: false
        }
      ]
    },
    cooldownConfig: {
      cooldownType: 'long_rest',
      cooldownValue: 1
    }
  },

  // Test 30: Multiple Resource Costs
  {
    id: generateSpellId('TEST: Multi Resource Spell'),
    name: 'TEST: Multi Resource Spell',
    description: 'Tests multiple resource costs. Costs mana, health, stamina, and class resources.',
    level: 5,
    school: 'necromancy',
    icon: 'spell_shadow_deathcoil',
    spellType: 'ACTION',
    effectTypes: ['damage', 'healing'],
    source: 'test',
    tags: ['test', 'advanced', 'multi_resource'],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 40,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'instant'
    },
    damageConfig: {
      formula: '6d8',
      damageTypes: ['necrotic'],
      resolution: 'DICE'
    },
    healingConfig: {
      formula: '3d8',
      healingType: 'vampiric',
      resolution: 'DICE'
    },
    resourceCost: {
      components: ['verbal', 'somatic'],
      actionPoints: 1,
      mana: 25, health: 15, stamina: 10, focus: 5,
      classResource: {
        type: 'soul_shards',
        cost: 3
      },
      classResource: {
        type: 'soul_shards',
        cost: 2
      }
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 4
    }
  },

  // Test 31: Multi-Effect Combo
  {
    id: generateSpellId('TEST: Multi Effect Combo'),
    name: 'TEST: Multi Effect Combo',
    description: 'Tests multi-effect combo. Deals damage, applies debuff, and heals caster.',
    level: 6,
    school: 'evocation',
    icon: 'spell_holy_divinepurpose',
    spellType: 'ACTION',
    effectTypes: ['damage', 'debuff', 'healing'],
    source: 'test',
    tags: ['test', 'advanced', 'combo'],
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 60,
      targetRestrictions: ['enemies'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 5,
      durationUnit: 'rounds'
    },
    damageConfig: {
      formula: '5d8+INT',
      damageTypes: ['radiant'],
      resolution: 'DICE'
    },
    debuffConfig: {
      statusEffects: [
        {
          id: 'blinded',
          level: 'major'
        }
      ],
      savingThrow: 'constitution',
      difficultyClass: 16,
      saveOutcome: 'negates',
      durationType: 'rounds',
      durationValue: 5
    },
    healingConfig: {
      formula: '2d8+SPI',
      healingType: 'vampiric',
      resolution: 'DICE'
    },
    resourceCost: {
      components: ['verbal', 'somatic', 'material'],
      materialComponents: 'A prism and a vial of quicksilver',
      somaticText: 'Complex weaving hand patterns',
      verbalText: 'Omnia simul!',
      materialComponents: 'A prism and a vial of quicksilver',
      actionPoints: 1,
      mana: 50,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      cooldownType: 'turn_based',
      cooldownValue: 6
    }
  },

  // Test 32: All Features Combined
  {
    id: generateSpellId('TEST: Ultimate Spell'),
    name: 'TEST: Ultimate Spell',
    description: 'Tests ALL features combined. The ultimate test spell with every possible configuration.',
    level: 9,
    school: 'evocation',
    icon: 'spell_holy_prayerofhealing02',
    spellType: 'ACTION',
    effectTypes: ['damage', 'healing', 'buff', 'debuff'],
    source: 'test',
    tags: ['test', 'advanced', 'ultimate', 'all_features'],
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 150,
      areaShape: 'sphere',
      areaSize: 40,
      targetRestrictions: ['enemies', 'objects'],
      lineOfSightRequired: true
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 10,
      durationUnit: 'rounds',
      requiresConcentration: true,
      concentrationDC: 20
    },
    damageConfig: {
      formula: '12d6+INT',
      damageTypes: ['force', 'radiant'],
      resolution: 'DICE',
      diceConfig: {
        advantage: true,
        explodingDice: true
      },
      useCriticalEffect: true,
      criticalConfig: {
        critThreshold: 19,
        critMultiplier: 3,
        critDiceOnly: false,
        extraDice: '4d6',
        explodingDice: true
      },
      useChainEffect: true,
      chainConfig: {
        targets: 8,
        falloffType: 'percentage',
        falloffRate: 15,
        minimumDamage: 20
      },
      savingThrow: 'agility',
      difficultyClass: 20,
      saveOutcome: 'halves'
    },
    healingConfig: {
      formula: '8d8+SPI',
      healingType: 'direct',
      resolution: 'DICE',
      useAbsorptionShield: true,
      shieldConfig: {
        shieldType: 'adaptive',
        shieldAmount: '5d6',
        duration: 10,
        reflectionType: 'all',
        reflectionPercentage: 30
      },
      hasHotEffect: true,
      hotConfig: {
        tickFormula: '3d6+SPI',
        duration: 10,
        tickFrequency: 'end_of_turn'
      },
      useChainHealing: true,
      chainConfig: {
        targets: 6,
        targetSelection: 'lowest_health',
        falloffType: 'percentage',
        falloffRate: 10
      }
    },
    buffConfig: {
      statModifiers: [
        {
          name: 'Strength',
          magnitude: 5,
          magnitudeType: 'flat'
        },
        {
          name: 'Intelligence',
          magnitude: 5,
          magnitudeType: 'flat'
        },
        {
          name: 'Spell Power',
          magnitude: 25,
          magnitudeType: 'percentage'
        }
      ],
      statusEffects: [
        {
          id: 'Haste',
          level: 'extreme'
        },
        {
          id: 'empowered',
          level: 'major'
        }
      ],
      stackingRule: 'progressive',
      maxStacks: 3,
      durationType: 'rounds',
      durationValue: 10,
      concentrationRequired: true
    },
    debuffConfig: {
      statusEffects: [
        {
          id: 'Stunned',
          level: 'major'
        },
        {
          id: 'Slowed',
          level: 'severe'
        }
      ],
      statPenalties: [
        {
          name: 'Armor',
          magnitude: -10,
          magnitudeType: 'flat'
        },
        {
          name: 'Speed',
          magnitude: -50,
          magnitudeType: 'percentage'
        }
      ],
      savingThrow: 'wisdom',
      difficultyClass: 20,
      saveOutcome: 'halves_duration',
      durationType: 'rounds',
      durationValue: 10,
      canBeDispelled: true
    },
    resourceCost: {
      components: ['verbal', 'somatic', 'material'],
      materialComponents: 'A star sapphire worth 1000gp, a phoenix feather, and dragon blood (all consumed)',
      somaticText: 'Raise both arms to the heavens',
      verbalText: 'OMNIPOTENTIA ABSOLUTA!',
      materialComponents: 'A star sapphire worth 1000gp, a phoenix feather, and dragon blood (all consumed)',
      actionPoints: 1,
      mana: 50, health: 25, stamina: 20, focus: 15,
      classResource: {
        type: 'soul_shards',
        cost: 5
      },
      classResource: {
        type: 'arcane_charges',
        cost: 4
      },
      reagents: [
        {
          name: 'Arcane Crystal',
          quantity: 1,
          consumed: true
        },
        {
          name: 'Phoenix Feather',
          quantity: 1,
          consumed: true
        }
      ]
    },
    cooldownConfig: {
      cooldownType: 'charge_based',
      cooldownValue: 0,
      charges: 1,
      chargeRecoveryRate: 10
    },
    mechanicsConfig: {
      rollableTable: {
        enabled: true,
        tableName: 'Ultimate Effects',
        diceFormula: '1d6',
        outcomes: [
          { range: [1, 2], effect: 'Double damage' },
          { range: [3, 4], effect: 'Double healing' },
          { range: [5, 6], effect: 'Extended duration by 5 rounds' }
        ]
      }
    }
  }
];

// Export all test spells combined
export const ALL_TEST_SPELLS = [
  ...RESOLUTION_TEST_SPELLS,
  ...EFFECT_TYPE_TEST_SPELLS,
  ...SPELL_TYPE_TEST_SPELLS,
  ...TARGETING_TEST_SPELLS,
  ...ADVANCED_MECHANICS_TEST_SPELLS
];

// Debug: Check if Arcane Counterstrike has triggerConfig
const arcaneCounterstrike = ALL_TEST_SPELLS.find(s => s.name === 'TEST: Arcane Counterstrike');
if (arcaneCounterstrike) {
  console.log('🔍 Arcane Counterstrike in testSpells.js:', {
    name: arcaneCounterstrike.name,
    hasTriggerConfig: !!arcaneCounterstrike.triggerConfig,
    triggerConfig: arcaneCounterstrike.triggerConfig
  });
}

// Export test spell categories
export const TEST_SPELL_CATEGORIES = [
  {
    id: 'resolution_tests',
    name: 'Resolution Method Tests',
    description: 'Tests for DICE, CARDS, and COINS resolution methods',
    icon: 'inv_misc_dice_01',
    color: '#8B4513',
    spells: RESOLUTION_TEST_SPELLS.map(spell => spell.id)
  },
  {
    id: 'effect_type_tests',
    name: 'Effect Type Tests',
    description: 'Tests for all effect types (damage, healing, buff, debuff, utility, control, summoning, transformation, purification, restoration)',
    icon: 'spell_holy_blessingofstrength',
    color: '#2d5016',
    spells: EFFECT_TYPE_TEST_SPELLS.map(spell => spell.id)
  },
  {
    id: 'spell_type_tests',
    name: 'Spell Type Tests',
    description: 'Tests for all spell types (ACTION, CHANNELED, PASSIVE, REACTION, TRAP, STATE)',
    icon: 'spell_arcane_arcane01',
    color: '#5a1e12',
    spells: SPELL_TYPE_TEST_SPELLS.map(spell => spell.id)
  },
  {
    id: 'targeting_tests',
    name: 'Targeting Type Tests',
    description: 'Tests for all targeting types (single, multi, area, chain, cone, line, self, smart, nearest)',
    icon: 'ability_hunter_markedfordeath',
    color: '#6B8E23',
    spells: TARGETING_TEST_SPELLS.map(spell => spell.id)
  },
  {
    id: 'advanced_mechanics_tests',
    name: 'Advanced Mechanics Tests',
    description: 'Tests for advanced mechanics (rollable tables, charges, dice cooldowns, reagents, multi-resource, combos, all features)',
    icon: 'spell_arcane_mindmastery',
    color: '#4B0082',
    spells: ADVANCED_MECHANICS_TEST_SPELLS.map(spell => spell.id)
  }
];

// Summary of test spells
console.log(`
╔════════════════════════════════════════════════════════════════╗
║           COMPREHENSIVE TEST SPELL LIBRARY LOADED              ║
╠════════════════════════════════════════════════════════════════╣
║ Total Test Spells: ${ALL_TEST_SPELLS.length}                                          ║
║                                                                ║
║ Categories:                                                    ║
║   • Resolution Methods: ${RESOLUTION_TEST_SPELLS.length} spells                              ║
║   • Effect Types: ${EFFECT_TYPE_TEST_SPELLS.length} spells                                  ║
║   • Spell Types: ${SPELL_TYPE_TEST_SPELLS.length} spells                                    ║
║   • Targeting Types: ${TARGETING_TEST_SPELLS.length} spells                                 ║
║   • Advanced Mechanics: ${ADVANCED_MECHANICS_TEST_SPELLS.length} spells                             ║
║                                                                ║
║ Purpose: Verify spell wizard formatting and display           ║
╚════════════════════════════════════════════════════════════════╝
`);

