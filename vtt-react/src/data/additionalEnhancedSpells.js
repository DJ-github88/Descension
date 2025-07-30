/**
 * Additional Enhanced Spells
 * 
 * This file contains more high-quality spells to reach our target of 50+ spells
 * that showcase advanced mechanics and original concepts.
 */

// Coin-based Fortune Spells
export const FORTUNE_SPELLS = [
  {
    id: 'serendipity-cascade',
    name: 'Serendipity Cascade',
    description: 'You flip mystical coins to weave fortune itself into reality. Each coin that lands favorably increases the spell\'s beneficial effects, creating cascading waves of good luck.',
    level: 3,
    spellType: 'ACTION',
    effectTypes: ['buff', 'utility'],
    damageTypes: [],
    tags: ['fortune', 'buff', 'utility', 'coins', 'luck'],
    visualTheme: 'arcane',
    icon: 'inv_misc_coin_02',
    
    buffConfig: {
      buffs: [
        {
          name: 'Fortune\'s Favor',
          description: 'Luck enhances all endeavors',
          duration: 600,
          effects: {
            statModifiers: {
              charisma: 3
            },
            luckBonus: 2,
            criticalChance: 10
          }
        }
      ]
    },
    
    utilityConfig: {
      utilityType: 'luck_manipulation',
      luckBonus: 2,
      duration: 600,
      affectsRolls: ['all']
    },
    
    mechanicsConfig: {
      coins: {
        enabled: true,
        system: 'fortune',
        type: 'builder',
        thresholdValue: 3,
        resolutionMethod: 'coins',
        coinCount: 5,
        coinSuccessRule: 'majority_heads',
        effectScaling: {
          enabled: true,
          scalingType: 'heads_count',
          baseEffect: 'minor_luck',
          enhancedEffect: 'major_luck'
        }
      }
    },
    
    rollableTable: {
      enabled: true,
      tableType: 'coins',
      entries: [
        {
          id: 'all-heads',
          coinPattern: 'ALL_HEADS',
          customName: 'Perfect Serendipity',
          effect: {
            type: 'buff',
            description: '+5 to all rolls and advantage on next 3 rolls',
            duration: 600,
            mechanics: { allRollsBonus: 5, advantage: 3 }
          }
        },
        {
          id: 'majority-heads',
          coinPattern: 'MAJORITY_HEADS',
          customName: 'Good Fortune',
          effect: {
            type: 'buff',
            description: '+3 to all rolls for 10 minutes',
            duration: 600,
            mechanics: { allRollsBonus: 3 }
          }
        },
        {
          id: 'equal-split',
          coinPattern: 'EQUAL_SPLIT',
          customName: 'Balanced Luck',
          effect: {
            type: 'buff',
            description: '+1 to all rolls for 10 minutes',
            duration: 600,
            mechanics: { allRollsBonus: 1 }
          }
        }
      ]
    },
    
    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['ally', 'self']
    },
    
    resourceCost: {
      mana: { baseAmount: 35 }
    },
    
    durationConfig: {
      durationType: 'rounds',
      durationValue: 10
    },
    
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  }
];

// Card-based Divination Spells
export const DIVINATION_SPELLS = [
  {
    id: 'prophetic-revelation-matrix',
    name: 'Prophetic Revelation Matrix',
    description: 'You draw from the deck of fate to reveal hidden truths and future possibilities. The cards drawn determine the nature and power of the divination.',
    level: 4,
    spellType: 'ACTION',
    effectTypes: ['utility', 'buff'],
    damageTypes: [],
    tags: ['divination', 'utility', 'buff', 'cards', 'prophecy'],
    visualTheme: 'arcane',
    icon: 'inv_misc_book_11',
    
    utilityConfig: {
      utilityType: 'divination',
      divinationType: 'future_sight',
      duration: 3600,
      revealHidden: true,
      predictFuture: true
    },
    
    buffConfig: {
      buffs: [
        {
          name: 'Prophetic Insight',
          description: 'Enhanced awareness of future events',
          duration: 3600,
          effects: {
            statModifiers: {
              spirit: 4,
              intelligence: 2
            },
            initiativeBonus: 3,
            surpriseImmunity: true
          }
        }
      ]
    },
    
    mechanicsConfig: {
      cards: {
        enabled: true,
        system: 'divination',
        type: 'trigger',
        thresholdValue: 1,
        resolutionMethod: 'cards',
        cardSuccessRule: 'face_cards'
      }
    },
    
    rollableTable: {
      enabled: true,
      tableType: 'cards',
      entries: [
        {
          id: 'royal-flush',
          cardPattern: 'ROYAL_FLUSH',
          customName: 'Perfect Prophecy',
          effect: {
            type: 'utility_buff',
            description: 'See 1 hour into the future + immunity to surprise',
            mechanics: { futureVision: 3600, surpriseImmunity: true, initiativeBonus: 5 }
          }
        },
        {
          id: 'straight-flush',
          cardPattern: 'STRAIGHT_FLUSH',
          customName: 'Clear Vision',
          effect: {
            type: 'utility_buff',
            description: 'See 30 minutes into the future + advantage on initiative',
            mechanics: { futureVision: 1800, initiativeAdvantage: true }
          }
        },
        {
          id: 'four-kind',
          cardPattern: 'FOUR_KIND',
          customName: 'Focused Sight',
          effect: {
            type: 'utility',
            description: 'See 10 minutes into the future',
            mechanics: { futureVision: 600 }
          }
        },
        {
          id: 'full-house',
          cardPattern: 'FULL_HOUSE',
          customName: 'Partial Vision',
          effect: {
            type: 'utility',
            description: 'See 5 minutes into the future',
            mechanics: { futureVision: 300 }
          }
        }
      ]
    },
    
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    
    resourceCost: {
      mana: { baseAmount: 45 }
    },
    
    durationConfig: {
      durationType: 'rounds',
      durationValue: 60
    },
    
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  }
];

// Progressive Effect Spells
export const PROGRESSIVE_SPELLS = [
  {
    id: 'crescendo-of-power',
    name: 'Crescendo of Power',
    description: 'A spell that grows stronger with each passing moment, building to a devastating climax. The magical energy accumulates and intensifies over time.',
    level: 5,
    spellType: 'CHANNELED',
    effectTypes: ['damage'],
    damageTypes: ['force'],
    tags: ['progressive', 'damage', 'force', 'crescendo'],
    visualTheme: 'arcane',
    icon: 'spell_arcane_arcane04',
    
    damageConfig: {
      damageType: 'direct',
      elementType: 'force',
      formula: '2d6 + 10',
      hasDotEffect: false,
      isProgressiveDamage: true,
      progressiveStages: [
        { round: 1, formula: '2d6 + 10', description: 'Initial power' },
        { round: 2, formula: '3d6 + 15', description: 'Building energy' },
        { round: 3, formula: '4d6 + 20', description: 'Intensifying force' },
        { round: 4, formula: '6d6 + 30', description: 'Overwhelming power' },
        { round: 5, formula: '8d6 + 40', description: 'Devastating crescendo' }
      ],
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false
      }
    },
    
    channelingConfig: {
      maxChannelDuration: 5,
      tickFrequency: 'END_OF_TURN',
      concentrationDC: 14,
      effectPerTick: {
        damage: 'progressive',
        targeting: 'maintain_target'
      },
      canMoveWhileChanneling: false,
      interruptConsequences: 'spell_ends'
    },
    
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['enemy']
    },
    
    resourceCost: {
      mana: { baseAmount: 50 }
    },
    
    durationConfig: {
      durationType: 'concentration',
      durationValue: 5
    },
    
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  }
];

// Purification and Restoration Spells
export const PURIFICATION_SPELLS = [
  {
    id: 'luminous-purification-wave',
    name: 'Luminous Purification Wave',
    description: 'You channel divine light to cleanse corruption and restore purity. The radiant energy spreads outward, removing harmful effects and healing the righteous.',
    level: 6,
    spellType: 'ACTION',
    effectTypes: ['purification', 'healing'],
    damageTypes: ['radiant'],
    tags: ['divine', 'purification', 'healing', 'radiant', 'cleansing'],
    visualTheme: 'holy',
    icon: 'spell_holy_purify',
    
    purificationConfig: {
      purificationType: 'comprehensive',
      removesEffects: ['poison', 'disease', 'curse', 'charm', 'fear'],
      healingBonus: true,
      areaEffect: true,
      purificationRadius: 20,
      resistanceBypass: true
    },
    
    healingConfig: {
      healingType: 'direct',
      formula: '4d8 + 20',
      hasHotEffect: true,
      hasShieldEffect: false,
      hotFormula: '2d4 + 5',
      hotDuration: 5,
      hotTickType: 'round',
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2
      }
    },
    
    targetingConfig: {
      targetingType: 'area',
      aoeShape: 'circle',
      aoeParameters: { radius: 20 },
      range: 60,
      validTargets: ['ally', 'self']
    },
    
    resourceCost: {
      mana: { baseAmount: 65 }
    },
    
    durationConfig: {
      durationType: 'instant',
      durationValue: 0
    },
    
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  }
];

// Export all additional spell collections
export const ADDITIONAL_ENHANCED_SPELLS = [
  ...FORTUNE_SPELLS,
  ...DIVINATION_SPELLS,
  ...PROGRESSIVE_SPELLS,
  ...PURIFICATION_SPELLS
];
