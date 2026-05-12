/**
 * Titan Spells & Abilities
 * 
 * All spells organized by celestial devotion (L1-3) and level (L4-10).
 * Imported by titanData.js into the TITAN_DATA.exampleSpells array.
 */

export const TITAN_SPELLS = [
    // SOLARA - RADIANT SUN
    {
      id: 'titan_radiant_strike',
      name: 'Radiant Strike',
      description: 'Your melee attacks are infused with the radiant power of the sun, dealing additional radiant damage.',
      spellType: 'PASSIVE',
      icon: 'Radiant/Radiant Beam',
      level: 1,
      specialization: 'solara',

      typeConfig: {
        school: 'radiant',
        icon: 'Radiant/Radiant Beam',
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: []
      },

      devotionRequired: 'Solara',

      resolution: 'PASSIVE',
      effectTypes: ['damage'],

      cooldownConfig: {
        cooldownType: 'none',
        cooldownValue: 0
      },

      damageConfig: {
        formula: '1d6',
        damageTypes: ['radiant'],
        resolution: 'DICE'
      },

      specialMechanics: {
        devotion: {
          required: 'Solara',
          passive: true,
          championBonus: 'Damage increased by 50%'
        }
      },

      tags: ['passive', 'radiant', 'melee', 'solara', 'titan']
    },

    {
      id: 'titan_solar_flare',
      name: 'Solar Flare',
      description: 'Unleash a burst of solar energy, dealing radiant damage to all enemies within 10 feet and blinding them.',
      spellType: 'ACTION',
      icon: 'Fire/Dragon Breath',
      level: 3,
      specialization: 'solara',

      typeConfig: {
        school: 'radiant',
        icon: 'Fire/Dragon Breath',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 10,
          unit: 'feet'
        }
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 1
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Solara\'s Radiance!',
        somaticText: 'Raise arms to release solar burst'
      },

      devotionRequired: 'Solara',

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      cooldownConfig: {
        cooldownType: 'long_rest',
        cooldownValue: 1
      },

      damageConfig: {
        formula: '3d8',
        damageTypes: ['radiant'],
        resolution: 'DICE'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        effects: [{
          id: 'blinded',
          name: 'Blinded',
          description: 'Blinded creatures have disadvantage on attack rolls and attacks against them have advantage - cannot see, automatically fails sight-based checks',
          statusType: 'blinded',
          level: 'moderate',
          statPenalty: [{ stat: 'attack', value: -99, magnitudeType: 'disadvantage' }],
          mechanicsText: 'Disadvantage on attack rolls, auto-fail sight checks'
        }]
      },

      specialMechanics: {
        devotion: {
          required: 'Solara',
          usesPerLongRest: 1,
          championBonus: '2 uses per long rest, increased damage'
        }
      },

      tags: ['ultimate', 'radiant', 'aoe', 'blind', 'solara', 'titan']
    },

    // LUNARA - MOON GUARDIAN
    {
      id: 'titan_moonlit_resilience',
      name: 'Moonlit Resilience',
      description: 'The moon\'s protective power grants you enhanced armor and regeneration.',
      spellType: 'PASSIVE',
      icon: 'Nature/Ethereal Bird',
      level: 1,
      specialization: 'lunara',

      typeConfig: {
        school: 'radiant',
        icon: 'Nature/Ethereal Bird',
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: []
      },

      devotionRequired: 'Lunara',

      resolution: 'PASSIVE',
      effectTypes: ['buff', 'healing'],

      cooldownConfig: {
        cooldownType: 'none',
        cooldownValue: 0
      },

      buffConfig: {
        effects: [
          { id: 'moonlit_armor', name: 'Moonlit Armor', description: '+2 Armor (+3 for Celestial Champion)', mechanicsText: '+2 Armor bonus (+3 for Celestial Champion)' },
          { id: 'moonlit_regen', name: 'Moonlit Regeneration', description: 'Regenerate 5 HP at start of each turn', mechanicsText: 'Regenerate 5 HP at start of each turn' }
        ]
      },

      healingConfig: {
        formula: '5',
        healingType: 'self',
        frequency: 'start_of_turn',
        championBonus: '7 HP per turn',
        resolution: 'DICE'
      },

      effects: {
        buff: {
          permanent: {
            stats: {
              ac: 2,
              championBonus: 3
            }
          }
        },
        healing: {
          ongoing: {
            formula: '5',
            target: 'self',
            frequency: 'start_of_turn',
            championBonus: '7'
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Lunara',
          passive: true,
          championBonus: '+1 Armor, +2 HP regen'
        }
      },

      tags: ['passive', 'defense', 'regeneration', 'lunara', 'titan']
    },

    {
      id: 'titan_lunar_shield',
      name: 'Lunar Shield',
      description: 'Create a barrier of moonlight that absorbs damage for all allies within 15 feet.',
      spellType: 'ACTION',
      icon: 'Force/Force Field',
      level: 3,
      specialization: 'lunara',

      typeConfig: {
        school: 'force',
        icon: 'Force/Force Field',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 15,
          unit: 'feet'
        }
      },

      durationConfig: {
        durationType: 'concentration'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Lunara\'s Embrace!',
        somaticText: 'Spread arms to create moonlit barrier'
      },

      devotionRequired: 'Lunara',

      resolution: 'NONE',
      effectTypes: ['buff'],

      cooldownConfig: {
        cooldownType: 'long_rest',
        cooldownValue: 1
      },

      buffConfig: {
        effects: [{
          id: 'lunar_shield_absorption',
          name: 'Lunar Shield',
          description: 'All allies within 15 feet gain a shield that absorbs damage.',
          shieldValue: {
            formula: '50',
            shieldType: 'absorption',
            championBonus: '75'
          },
          mechanicsText: 'Shield absorbs up to 50 damage (75 for Celestial Champion). Lasts until depleted.'
        }]
      },

      effects: {
        shield: {
          instant: {
            formula: '50',
            type: 'absorption',
            aoe: true,
            radius: 15,
            targets: 'allies',
            championBonus: '75'
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Lunara',
          usesPerLongRest: 1,
          championBonus: '2 uses per long rest, 75 damage absorption'
        }
      },

      tags: ['ultimate', 'shield', 'aoe', 'support', 'lunara', 'titan']
    },

    // ASTRAEUS - STAR SAGE
    {
      id: 'titan_celestial_speed',
      name: 'Celestial Speed',
      description: 'The swiftness of the stars enhances your movement and reflexes.',
      spellType: 'PASSIVE',
      icon: 'Arcane/Quick Step',
      level: 1,
      specialization: 'astraeus',

      typeConfig: {
        school: 'arcane',
        icon: 'Arcane/Quick Step',
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: []
      },

      devotionRequired: 'Astraeus',

      resolution: 'PASSIVE',
      effectTypes: ['buff'],

      cooldownConfig: {
        cooldownType: 'none',
        cooldownValue: 0
      },

      buffConfig: {
        effects: [
          { id: 'celestial_speed', name: 'Celestial Speed', description: '+10 feet movement speed (+15 for Celestial Champion)', mechanicsText: '+10 feet movement speed (+15 for Celestial Champion)' },
          { id: 'agility_advantage', name: 'Agility Advantage', description: 'Advantage on Agility saving throws', mechanicsText: 'Advantage on Agility saving throws' }
        ]
      },

      effects: {
        buff: {
          permanent: {
            stats: {
              movementSpeed: 10,
              championBonus: 15
            },
            savingThrows: {
              agility: 'advantage'
            }
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Astraeus',
          passive: true,
          championBonus: '+5 additional movement speed'
        }
      },

      tags: ['passive', 'mobility', 'agility', 'astraeus', 'titan']
    },

    {
      id: 'titan_starfall',
      name: 'Starfall',
      description: 'Call down a star to strike a target, dealing massive force damage and stunning them.',
      spellType: 'ACTION',
      icon: 'Arcane/Missile',
      level: 3,
      specialization: 'astraeus',

      typeConfig: {
        school: 'force',
        icon: 'Arcane/Missile',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 1
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Astraeus, strike from above!',
        somaticText: 'Point to sky then target'
      },

      devotionRequired: 'Astraeus',

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      cooldownConfig: {
        cooldownType: 'long_rest',
        cooldownValue: 1
      },

      damageConfig: {
        formula: '4d6',
        damageTypes: ['force'],
        resolution: 'DICE'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        effects: [{
          id: 'stunned',
          name: 'Stunned',
          description: 'Stunned creatures cannot move or take actions - cannot act or move for the duration',
          statusType: 'stunned',
          level: 'moderate',
          mechanicsText: 'Cannot move or take actions for the duration'
        }]
      },

      effects: {
        damage: {
          instant: {
            formula: '4d6',
            type: 'force',
            championBonus: '6d6'
          }
        },
        debuff: {
          duration: 1,
          effect: 'stunned'
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Astraeus',
          usesPerLongRest: 1,
          championBonus: '2 uses per long rest, increased damage'
        }
      },

      tags: ['ultimate', 'force', 'stun', 'single target', 'astraeus', 'titan']
    },

    // TERRANOX - EARTH TITAN
    {
      id: 'titan_grounded_might',
      name: 'Grounded Might',
      description: 'The strength of the earth flows through you, granting immense durability and resistance.',
      spellType: 'PASSIVE',
      icon: 'Nature/Earth Shield',
      level: 1,
      specialization: 'terranox',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Nature/Earth Shield',
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: []
      },

      devotionRequired: 'Terranox',

      resolution: 'PASSIVE',
      effectTypes: ['buff'],

      cooldownConfig: {
        cooldownType: 'none',
        cooldownValue: 0
      },

      buffConfig: {
        effects: [
          { id: 'grounded_might_hp', name: 'Earth\'s Endurance', description: '+20 maximum hit points (+30 for Celestial Champion)', mechanicsText: '+20 maximum hit points (+30 for Celestial Champion)' },
          { id: 'grounded_might_resist', name: 'Physical Resistance', description: 'Resistance to bludgeoning, piercing, and slashing damage', mechanicsText: 'Resistance to bludgeoning, piercing, and slashing damage (50% reduction)' }
        ]
      },

      effects: {
        buff: {
          permanent: {
            stats: {
              maxHp: 20,
              championBonus: 30
            },
            resistances: ['bludgeoning', 'piercing', 'slashing']
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Terranox',
          passive: true,
          championBonus: '+10 additional HP'
        }
      },

      tags: ['passive', 'tank', 'resistance', 'terranox', 'titan']
    },

    {
      id: 'titan_earthquake',
      name: 'Earthquake',
      description: 'Cause the ground to tremble with earth-shaking force, damaging and knocking down all nearby enemies.',
      spellType: 'ACTION',
      icon: 'Nature/Earth Shatter',
      level: 3,
      specialization: 'terranox',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Nature/Earth Shatter',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self',
        areaOfEffect: {
          type: 'RADIUS',
          size: 20,
          unit: 'feet'
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Slam fist or weapon into ground'
      },

      devotionRequired: 'Terranox',

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff'],

      cooldownConfig: {
        cooldownType: 'long_rest',
        cooldownValue: 1
      },

      damageConfig: {
        formula: '3d6',
        damageTypes: ['bludgeoning'],
        resolution: 'DICE'
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        effects: [{
          id: 'prone',
          name: 'Prone',
          description: 'Knocked to the ground - disadvantage on attacks, advantage against melee, half movement to stand',
          statusType: 'prone',
          level: 'moderate',
          statPenalty: [{ stat: 'attack', value: -99, magnitudeType: 'disadvantage' }, { stat: 'movement_speed', value: -50, magnitudeType: 'percentage' }],
          mechanicsText: 'Disadvantage on attacks, advantage vs melee, half movement to stand'
        }]
      },

      effects: {
        damage: {
          instant: {
            formula: '3d6',
            type: 'bludgeoning',
            aoe: true,
            radius: 20,
            championBonus: '5d6'
          }
        },
        debuff: {
          instant: {
            effect: 'prone',
            aoe: true,
            radius: 20
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Terranox',
          usesPerLongRest: 1,
          championBonus: '2 uses per long rest, increased damage'
        }
      },

      tags: ['ultimate', 'bludgeoning', 'aoe', 'prone', 'terranox', 'titan']
    },

    // ZEPHYRA - WIND SPIRIT
    {
      id: 'titan_tempest_fury',
      name: 'Tempest Fury',
      description: 'The fury of the wind enhances your attack speed and infuses your strikes with lightning.',
      spellType: 'PASSIVE',
      icon: 'Nature/Tornado Vortex',
      level: 1,
      specialization: 'zephyra',

      typeConfig: {
        school: 'lightning',
        icon: 'Nature/Tornado Vortex',
        castTime: 0,
        castTimeType: 'PASSIVE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'permanent'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 0,
        components: []
      },

      devotionRequired: 'Zephyra',

      resolution: 'PASSIVE',
      effectTypes: ['buff', 'damage'],

      cooldownConfig: {
        cooldownType: 'none',
        cooldownValue: 0
      },

      buffConfig: {
        effects: [
          { id: 'tempest_fury_speed', name: 'Tempest Speed', description: '+2 attack speed (+3 for Celestial Champion)', mechanicsText: '+2 attack speed (+3 for Celestial Champion)' },
          { id: 'tempest_fury_lightning', name: 'Lightning Strikes', description: 'Melee attacks deal +1d4 lightning damage', mechanicsText: '+1d4 lightning damage on every melee attack' }
        ]
      },

      damageConfig: {
        formula: '1d4',
        damageTypes: ['lightning'],
        resolution: 'DICE'
      },

      effects: {
        buff: {
          permanent: {
            stats: {
              attackSpeed: 2,
              championBonus: 3
            }
          }
        },
        damage: {
          ongoing: {
            formula: '1d4',
            type: 'lightning',
            trigger: 'melee_attack',
            championBonus: '+2 damage'
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Zephyra',
          passive: true,
          championBonus: '+1 attack speed, +2 lightning damage'
        }
      },

      tags: ['passive', 'lightning', 'attack speed', 'zephyra', 'titan']
    },

    {
      id: 'titan_wind_dash',
      name: 'Wind Dash',
      description: 'Become one with the wind, teleporting across the battlefield and striking with lightning.',
      spellType: 'ACTION',
      icon: 'Nature/Nature Wild 1',
      level: 3,
      specialization: 'zephyra',

      typeConfig: {
        school: 'lightning',
        icon: 'Nature/Nature Wild 1',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'teleport',
        rangeDistance: 30,
        areaOfEffect: {
          type: 'RADIUS',
          size: 5,
          unit: 'feet',
          note: 'At destination'
        }
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Dissolve into wind and reform at destination'
      },

      devotionRequired: 'Zephyra',

      resolution: 'DICE',
      effectTypes: ['damage'],

      cooldownConfig: {
        cooldownType: 'long_rest',
        cooldownValue: 1
      },

      damageConfig: {
        formula: '3d6',
        damageTypes: ['lightning'],
        resolution: 'DICE'
      },

      effects: {
        teleport: {
          instant: {
            distance: 30,
            unit: 'feet'
          }
        },
        damage: {
          instant: {
            formula: '3d6',
            type: 'lightning',
            aoe: true,
            radius: 5,
            location: 'destination',
            championBonus: '5d6'
          }
        }
      },

      specialMechanics: {
        devotion: {
          required: 'Zephyra',
          usesPerLongRest: 1,
          championBonus: '2 uses per long rest, increased damage'
        },
        teleport: {
          distance: 30,
          damageOnArrival: true,
          ignoresOpportunityAttacks: true
        }
      },

      tags: ['ultimate', 'lightning', 'teleport', 'aoe', 'zephyra', 'titan']
    },

    // SPECIALIZATION-SPECIFIC ABILITIES
    {
      id: 'titan_devotion_switch',
      name: 'Combat Attunement',
      description: 'Switch your celestial devotion mid-combat for 1 AP. Only available to Astral Warriors.',
      spellType: 'ACTION',
      icon: 'Arcane/Ebon Blaze',
      level: 2,
      specialization: 'astral-warrior',

      typeConfig: {
        school: 'arcane',
        icon: 'Arcane/Ebon Blaze',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 0 },
        actionPoints: 1,
        components: ['concentration']
      },

      specializationRequired: 'astral-warrior',

      resolution: 'NONE',
      effectTypes: ['buff'],

      cooldownConfig: {
        cooldownType: 'long_rest',
        cooldownValue: 1
      },

      buffConfig: {
        effects: [
          { id: 'devotion_switch', name: 'Combat Attunement', description: 'Switch to a different celestial devotion, gaining new benefits immediately', mechanicsText: 'Switch devotion for 1 AP, gain burst effect from new devotion' }
        ]
      },

      effects: {
        devotionSwitch: {
          instant: {
            action: '1 AP (quick action)',
            usesPerLongRest: 3,
            burstEffects: {
              solara: '2d6 radiant damage to nearest enemy',
              lunara: 'Gain 15 temporary HP',
              astraeus: 'Gain +10 feet movement this turn',
              terranox: 'Gain +2 Armor until end of turn',
              zephyra: 'Gain advantage on next attack'
            }
          }
        }
      },

      specialMechanics: {
        astralWarrior: {
          exclusive: true,
          usesPerLongRest: 3,
          burstEffect: 'Triggers effect based on new devotion'
        }
      },

      tags: ['utility', 'devotion', 'switching', 'astral warrior', 'titan']
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    {
      id: 'titan_celestial_strike',
      name: 'Celestial Strike',
      description: 'Channel celestial energy into a devastating melee strike that deals damage based on your devotion.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Radiant/Divine Downward Sword',

      typeConfig: {
        school: 'radiant',
        icon: 'Radiant/Divine Downward Sword',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemy']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 15 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Weapon strike infused with celestial power'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '4d8 + strength + devotion_bonus',
        damageTypes: ['radiant'],
        resolution: 'DICE'
      },

      conditionalEffects: [{
        condition: 'devotion === "solara"',
        effect: '+2d6 fire damage',
        devotionSpecific: true
      }, {
        condition: 'devotion === "lunara"',
        effect: 'Heal self for 2d6 HP',
        devotionSpecific: true
      }, {
        condition: 'devotion === "astraeus"',
        effect: 'Extra attack if target dies',
        devotionSpecific: true
      }, {
        condition: 'devotion === "terranox"',
        effect: 'Knockback 10 feet',
        devotionSpecific: true
      }, {
        condition: 'devotion === "zephyra"',
        effect: 'Chain to nearby enemy',
        devotionSpecific: true
      }],

      propagation: {
        devotionScaling: true,
        scalesWithStrength: true
      },

      specialMechanics: {
        devotionVariants: {
          solara: { element: 'radiant', bonus: '+2d6 fire' },
          lunara: { element: 'frost', bonus: '+2d6 healing to self' },
          astraeus: { element: 'force', bonus: 'Extra attack if target dies' },
          terranox: { element: 'bludgeoning', bonus: 'Knockback 10 feet' },
          zephyra: { element: 'lightning', bonus: 'Chain to nearby enemy' }
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 2
      },

      tags: ['damage', 'melee', 'devotion', 'level 4', 'titan']
    },

    {
      id: 'titan_celestial_armor',
      name: 'Celestial Armor',
      description: 'Summon celestial armor around yourself, gaining significant damage reduction and resistances.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Force/Force Field',

      typeConfig: {
        school: 'force',
        icon: 'Force/Force Field',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 5
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 16 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'Armor of the stars!'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'armor',
        effects: [{
          id: 'celestial_armor',
          name: 'Celestial Armor',
          description: '+4 Armor and resistance to your devotion\'s damage type',
          statModifier: { stat: 'armor', magnitude: 4, magnitudeType: 'flat' },
          mechanicsText: '+4 Armor and resistance to devotion damage type'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      conditionalEffects: [{
        condition: 'devotion_active',
        effect: 'Resistance to devotion\'s damage type',
        devotionSpecific: true
      }],

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 4
      },

      tags: ['buff', 'armor', 'protection', 'level 4', 'titan']
    },

    {
      id: 'titan_divine_challenge',
      name: 'Divine Challenge',
      description: 'Issue a divine challenge to an enemy. They must attack you or suffer radiant damage.',
      level: 4,
      spellType: 'ACTION',
      icon: 'Necrotic/Blood Scroll',

      typeConfig: {
        school: 'radiant',
        icon: 'Necrotic/Blood Scroll',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy']
      },

      durationConfig: {
        durationType: 'rounds',
        duration: 3
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 12 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'Face me, coward!'
      },

      resolution: 'NONE',
      effectTypes: ['debuff', 'control'],

      debuffConfig: {
        debuffType: 'taunt',
        effects: [{
          id: 'divine_challenge',
          name: 'Divine Challenge',
          description: 'Target must attack you. If they attack someone else, they take radiant damage.',
          damageFormula: '3d6',
          mechanicsText: 'Must attack caster or take 3d6 radiant damage',
          dotFormula: '3d6',
          dotDamageType: 'radiant'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        savingThrow: { ability: 'spirit', difficultyClass: 15, saveOutcome: 'negates' }
      },

      controlConfig: {
        controlType: 'forced_action',
        effects: [{
          id: 'divine_challenge_taunt',
          name: 'Divine Challenge',
          description: 'Target must attack you or take 3d6 radiant damage',
          mechanicsText: 'Must attack caster or take 3d6 radiant damage'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      effectTargeting: {
        target: 'single_enemy',
        range: 30
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 3
      },

      tags: ['debuff', 'taunt', 'control', 'level 4', 'titan']
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: 'titan_solar_inferno',
      name: 'Solar Inferno',
      description: 'Release a devastating burst of solar energy, dealing fire and radiant damage to all nearby enemies.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Fire/Fiery Symbol',

      typeConfig: {
        school: 'fire',
        icon: 'Fire/Fiery Symbol',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy']
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 18 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Solara, ignite!'
      },

      devotionRequired: 'Solara',

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '6d8 + strength',
        damageTypes: ['fire', 'radiant'],
        resolution: 'DICE',
        savingThrow: {
          ability: 'agility',
          difficultyClass: 15,
          saveOutcome: 'half_damage'
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 3
      },

      tags: ['damage', 'aoe', 'radiant', 'solara', 'level 5', 'titan']
    },
    {
      id: 'titan_lunar_sanctuary',
      name: 'Lunar Sanctuary',
      description: 'Create a sanctuary of moonlight that protects allies and heals them over time.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Bolt',

      typeConfig: {
        school: 'radiant',
        icon: 'Radiant/Radiant Bolt',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 15 },
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Lunara, protect us!',
        somaticText: 'Raise hand to moon'
      },

      resolution: 'DICE',
      effectTypes: ['buff', 'healing'],

      buffConfig: {
        buffType: 'shield',
        effects: [{
          id: 'lunar_shield',
          name: 'Lunar Shield',
          description: '+3 Armor and regeneration',
          statModifier: {
            stat: 'armor',
            magnitude: 3,
            magnitudeType: 'flat'
          },
          mechanicsText: '+3 Armor and 2d6 HP regeneration per round'
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true
      },

      healingConfig: {
        formula: '2d6',
        healingType: 'hot',
        resolution: 'DICE',
        hotConfig: { enabled: true, healingPerTick: '2d6', tickFrequency: 'round', duration: 4 }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 4
      },

      tags: ['buff', 'healing', 'protection', 'lunara', 'level 5', 'titan']
    },

    {
      id: 'titan_meteor_strike',
      name: 'Meteor Strike',
      description: 'Call down a meteor of starlight on an area, dealing massive force damage.',
      level: 5,
      spellType: 'ACTION',
      icon: 'Arcane/Magical Sword',

      typeConfig: {
        school: 'force',
        icon: 'Arcane/Magical Sword',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 90,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Stars, fall!',
        somaticText: 'Point at sky then ground'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '8d6 + strength',
        damageTypes: ['force'],
        resolution: 'DICE',
        savingThrow: {
          ability: 'agility',
          difficultyClass: 16,
          saveOutcome: 'half_damage'
        }
      },

      controlConfig: {
        controlType: 'knockdown',
        strength: 'moderate',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 16,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'knocked_prone',
          name: 'Prone',
          description: 'Knocked prone by meteor impact'
        }]
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 4
      },

      tags: ['damage', 'aoe', 'force', 'astraeus', 'level 5', 'titan']
    },

    // ========================================
    // LEVEL 6 SPELLS
    // ========================================
    {
      id: 'titan_tectonic_upheaval',
      name: 'Tectonic Upheaval',
      description: 'Cause the ground to shake violently, knocking enemies prone and creating difficult terrain.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Nature/Earth Shatter',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Nature/Earth Shatter',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 30 }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 22 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Terranox, shake the earth!',
        somaticText: 'Stomp ground'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '8d6 + strength',
        damageTypes: ['bludgeoning'],
        resolution: 'DICE',
        savingThrow: {
          ability: 'agility',
          difficultyClass: 16,
          saveOutcome: 'half_damage'
        }
      },

      controlConfig: {
        controlType: 'knockdown',
        strength: 'strong',
        duration: 0,
        durationUnit: 'instant',
        saveDC: 16,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'prone',
          name: 'Prone',
          description: 'Enemies are knocked prone'
        }]
      },

      zoneConfig: {
        duration: 3,
        durationUnit: 'rounds',
        effects: ['difficult_terrain'],
        movable: false
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 4
      },

      tags: ['damage', 'control', 'zone', 'terranox', 'level 6', 'titan']
    },

    {
      id: 'titan_lightning_storm',
      name: 'Lightning Storm',
      description: 'Summon a storm of lightning that strikes multiple enemies and increases your attack speed.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Lightning/Lightning Bolt',

      typeConfig: {
        school: 'lightning',
        icon: 'Lightning/Lightning Bolt',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 24 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'Zephyra, storm!'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'buff'],

      damageConfig: {
        formula: '8d6 + strength',
        damageTypes: ['lightning'],
        resolution: 'DICE',
        savingThrow: {
          ability: 'agility',
          difficultyClass: 17,
          saveOutcome: 'half_damage'
        }
      },

      buffConfig: {
        buffType: 'haste',
        effects: [{
          id: 'storm_speed',
          name: 'Storm Speed',
          description: 'Gain an extra attack this turn',
          mechanicsText: 'Gain an extra attack this turn'
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 4
      },

      tags: ['damage', 'aoe', 'lightning', 'zephyra', 'level 6', 'titan']
    },

    {
      id: 'titan_celestial_convergence',
      name: 'Celestial Convergence',
      description: 'Combine the power of two devotions temporarily, gaining benefits from both.',
      level: 6,
      spellType: 'ACTION',
      icon: 'Arcane/Ebon Blaze',

      typeConfig: {
        school: 'arcane',
        icon: 'Arcane/Ebon Blaze',
        castTime: 1,
        castTimeType: 'BONUS'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 22 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'Celestials, converge!'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'dual_devotion',
        effects: [{
          id: 'celestial_convergence',
          name: 'Celestial Convergence',
          description: 'Gain benefits from your current devotion AND one other of your choice',
          mechanicsText: 'Gain benefits from current devotion AND one other of your choice'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 5
      },

      tags: ['buff', 'devotion', 'dual', 'level 6', 'titan']
    },

    // ========================================
    // LEVEL 7 SPELLS
    // ========================================
    {
      id: 'titan_avatar_of_solara',
      name: 'Avatar of Solara',
      description: 'Transform into an avatar of the radiant sun, gaining immense fire and radiant powers.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Fire/Enveloping Fire',

      typeConfig: {
        school: 'fire',
        icon: 'Fire/Enveloping Fire',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 28 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'SOLARA, EMBODY ME!'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        transformType: 'celestial',
        formName: 'Avatar of Solara',
        formDescription: 'You become wreathed in solar flames.',
        duration: 5,
        durationUnit: 'rounds',
        statModifiers: [
          { stat: 'damage', magnitude: '2d6 fire', magnitudeType: 'dice' },
          { stat: 'armor', magnitude: 2, magnitudeType: 'flat' }
        ],
        resistances: [
          { type: 'fire', resistanceAmount: 'immunity' }
        ],
        specialAbilities: [{
          name: 'Burning Aura',
          description: 'Enemies within 10 feet take fire damage at start of their turn',
          damageFormula: '2d6'
        }],
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 6
      },

      tags: ['transformation', 'solara', 'fire', 'level 7', 'titan']
    },

    {
      id: 'titan_lunara_blessing',
      name: "Lunara's Blessing",
      description: 'Receive the full blessing of the moon, gaining massive regeneration and protective powers.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Healing/Renewal',

      typeConfig: {
        school: 'radiant',
        icon: 'Healing/Renewal',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 28 },
        actionPoints: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Lunara, bless us!',
        somaticText: 'Arms raised to moon'
      },

      resolution: 'DICE',
      effectTypes: ['healing', 'buff'],

      healingConfig: {
        formula: '4d10 + strength',
        healingType: 'direct',
        resolution: 'DICE',
        hotConfig: { enabled: true, healingPerTick: '3d6', tickFrequency: 'round', duration: 5 }
      },

      buffConfig: {
        buffType: 'regeneration',
        effects: [{
          id: 'lunara_blessing',
          name: "Lunara's Blessing",
          description: 'All allies gain +3 Armor and regenerate HP each turn',
          statModifier: { stat: 'armor', magnitude: 3, magnitudeType: 'flat' },
          mechanicsText: '+3 Armor and HP regen each turn for all allies'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 5
      },

      tags: ['healing', 'buff', 'lunara', 'level 7', 'titan']
    },

    {
      id: 'titan_meteor_swarm',
      name: 'Meteor Swarm',
      description: 'Call down a barrage of meteors from the stars, devastating a massive area.',
      level: 7,
      spellType: 'ACTION',
      icon: 'Fire/Fiery Comet',

      typeConfig: {
        school: 'force',
        icon: 'Fire/Fiery Comet',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'multi',
        rangeType: 'ranged',
        rangeDistance: 120,
        maxTargets: 4,
        aoeShape: 'circle',
        aoeParameters: { radius: 15 }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 28 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'Astraeus, meteors!',
        somaticText: 'Pull stars from sky'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '12d6 + strength',
        damageTypes: ['force'],
        resolution: 'DICE',
        savingThrow: {
          ability: 'agility',
          difficultyClass: 17,
          saveOutcome: 'half_damage',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        specialRules: 'Each point can be targeted separately. Areas can overlap for stacking damage.',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          extraDice: '4d6',
          critEffects: ['stun']
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 5
      },

      tags: ['damage', 'aoe', 'astraeus', 'level 7', 'titan']
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    {
      id: 'titan_mountain_fortress',
      name: 'Mountain Fortress',
      description: 'Transform into an immovable mountain fortress, becoming nearly invulnerable.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Nature/Roots',

      typeConfig: {
        school: 'bludgeoning',
        icon: 'Nature/Roots',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 30 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'TERRANOX, FORTRESS!'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        transformType: 'elemental',
        formName: 'Mountain Fortress',
        formDescription: 'You become a living mountain of stone.',
        duration: 3,
        durationUnit: 'rounds',
        statModifiers: [
          { stat: 'armor', magnitude: 10, magnitudeType: 'flat' },
          { stat: 'damage_reduction', magnitude: 10, magnitudeType: 'flat' }
        ],
        resistances: [
          { type: 'physical', resistanceAmount: 'resistance' },
          { type: 'fire', resistanceAmount: 'resistance' },
          { type: 'frost', resistanceAmount: 'resistance' }
        ],
        specialAbilities: [{
          name: 'Immovable',
          description: 'Cannot be moved, knocked prone, or teleported against your will'
        }],
        restrictions: ['Cannot move', 'Disadvantage on Agility checks'],
        concentrationRequired: false,
        canBeDispelled: false
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 6
      },

      tags: ['transformation', 'terranox', 'defense', 'level 8', 'titan']
    },

    {
      id: 'titan_storm_lord',
      name: 'Storm Lord',
      description: 'Become the lord of storms, commanding lightning and wind to devastate enemies.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Lightning/Thunder',

      typeConfig: {
        school: 'lightning',
        icon: 'Lightning/Thunder',
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 32 },
        actionPoints: 3,
        components: ['verbal'],
        verbalText: 'ZEPHYRA, STORM LORD!'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '10d8 + strength',
        damageTypes: ['lightning'],
        resolution: 'DICE',
        savingThrow: {
          ability: 'constitution',
          difficultyClass: 18,
          saveOutcome: 'half_damage'
        }
      },

      controlConfig:
      {
        controlType: 'stun',
        strength: 'strong',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 18,
        saveType: 'constitution',
        savingThrow: true
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 5
      },

      tags: ['damage', 'control', 'lightning', 'zephyra', 'level 8', 'titan']
    },

    {
      id: 'titan_celestial_judgment',
      name: 'Celestial Judgment',
      description: 'Call upon all celestials to pass judgment on an enemy, dealing massive damage.',
      level: 8,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Warrior',

      typeConfig: {
        school: 'radiant',
        icon: 'Radiant/Radiant Warrior',
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
        resourceTypes: ['mana'],
        resourceValues: { mana: 30 },
        actionPoints: 2,
        components: ['verbal'],
        verbalText: 'CELESTIALS, JUDGE THIS ONE!'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '14d6 + strength',
        damageTypes: ['radiant'],
        resolution: 'DICE',
        savingThrow: {
          ability: 'spirit',
          difficultyClass: 19,
          saveOutcome: 'half_damage',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        bonusEffects: 'Deals double damage to undead and fiends',
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 3.0,
          extraDice: '6d10',
          critEffects: ['divine_smite', 'stun']
        }
      },

      cooldownConfig: {
        cooldownType: 'turn_based',
        cooldownValue: 5
      },

      tags: ['damage', 'radiant', 'single target', 'level 8', 'titan']
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    {
      id: 'titan_celestial_avatar',
      name: 'Celestial Avatar',
      description: 'Transform into a full celestial avatar, gaining the ultimate power of your devotion.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Radiant/Divine Illumination',

      typeConfig: {
        school: 'radiant',
        icon: 'Radiant/Divine Illumination',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 35 },
        actionPoints: 3,
        components: ['verbal'],
        verbalText: 'I BECOME THE CELESTIAL!'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        transformType: 'celestial',
        formName: 'Celestial Avatar',
        formDescription: 'You become one with your chosen celestial, gaining godlike power.',
        duration: 5,
        durationUnit: 'rounds',
        statModifiers: [
          { stat: 'all', magnitude: 5, magnitudeType: 'flat' },
          { stat: 'armor', magnitude: 5, magnitudeType: 'flat' },
          { stat: 'damage', magnitude: 50, magnitudeType: 'percentage' }
        ],
        resistances: [
          { type: 'all', resistanceAmount: 'resistance' }
        ],
        specialAbilities: [{
          name: 'Avatar Power',
          description: 'All devotion abilities are enhanced. Can fly. Immune to fear and charm.'
        }],
        concentrationRequired: false,
        canBeDispelled: false,
        drawback: 'When the avatar form ends, you gain 1 level of exhaustion and cannot use devotion abilities for 1 hour. The divine power is too much for a mortal body to channel without consequence.'
      },

      cooldownConfig: {
        cooldownType: 'long_rest',
        cooldownValue: 1
      },

      tags: ['transformation', 'ultimate', 'devotion', 'level 9', 'titan']
    },

    {
      id: 'titan_celestial_bombardment',
      name: 'Celestial Bombardment',
      description: 'Call down a devastating bombardment from all celestials simultaneously.',
      level: 9,
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Glow',

      typeConfig: {
        school: 'force',
        icon: 'Radiant/Radiant Glow',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 120,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 36 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'ALL CELESTIALS, STRIKE!',
        somaticText: 'Raise weapon to sky'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '3d6 radiant + 3d6 fire + 3d6 lightning + 3d6 cold + 3d6 force + strength',
        damageTypes: ['radiant', 'fire', 'lightning', 'cold', 'force'],
        resolution: 'DICE',
        savingThrow: {
          ability: 'agility',
          difficultyClass: 20,
          saveOutcome: 'half_damage',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 3.5,
          extraDice: '3d10 per element',
          critEffects: ['elemental_overload', 'stun']
        }
      },

      cooldownConfig: {
        cooldownType: 'long_rest',
        cooldownValue: 1
      },

      tags: ['damage', 'aoe', 'ultimate', 'level 9', 'titan']
    },

    {
      id: 'titan_divine_protection',
      name: 'Divine Protection',
      description: 'Grant divine protection to all allies, making them immune to damage for a brief time.',
      level: 9,
      spellType: 'REACTION',
      icon: 'Force/Force Field',

      typeConfig: {
        school: 'force',
        icon: 'Force/Force Field',
        castTime: 1,
        castTimeType: 'REACTION'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['ally']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 35 },
        actionPoints: 0,
        components: ['verbal'],
        verbalText: 'CELESTIALS, PROTECT US!'
      },

      resolution: 'NONE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'invulnerability',
        effects: [{
          id: 'divine_protection',
          name: 'Divine Protection',
          description: 'All allies are immune to damage until start of your next turn',
          mechanicsText: 'All allies immune to damage until start of your next turn',
          damageImmunity: ['all']
        }],
        durationValue: 1,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      cooldownConfig: {
        cooldownType: 'long_rest',
        cooldownValue: 1
      },

      tags: ['buff', 'protection', 'reaction', 'level 9', 'titan']
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    {
      id: 'titan_celestial_fusion',
      name: 'Celestial Fusion',
      description: 'Fuse with all celestials at once, becoming an avatar of cosmic power.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Radiant/Divine Radiance',

      typeConfig: {
        school: 'radiant',
        icon: 'Radiant/Divine Radiance',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ['verbal'],
        verbalText: 'ALL CELESTIALS, FUSE WITH ME!'
      },

      resolution: 'NONE',
      effectTypes: ['transformation'],

      transformationConfig: {
        transformType: 'divine',
        formName: 'Celestial Fusion',
        formDescription: 'You become one with all five celestials - the ultimate form of cosmic power.',
        duration: 3,
        durationUnit: 'rounds',
        statModifiers: [
          { stat: 'all', magnitude: 10, magnitudeType: 'flat' },
          { stat: 'armor', magnitude: 10, magnitudeType: 'flat' },
          { stat: 'maxHp', magnitude: 100, magnitudeType: 'temporary' }
        ],
        resistances: [
          { type: 'all', resistanceAmount: 'immunity' }
        ],
        specialAbilities: [
          { name: 'Solara\'s Wrath', description: 'All attacks deal bonus fire damage', damageFormula: '+4d6' },
          { name: 'Lunara\'s Grace', description: 'Regenerate 20 HP per turn' },
          { name: 'Astraeus\'s Speed', description: 'Gain an extra action each turn' },
          { name: 'Terranox\'s Might', description: 'Cannot be moved or knocked prone' },
          { name: 'Zephyra\'s Fury', description: 'Lightning strikes nearby enemies each turn' }
        ],
        concentrationRequired: false,
        canBeDispelled: false
      },

      specialMechanics: {
        celestialFusion: {
          description: 'When the fusion ends, you suffer Devotion Exhaustion: you lose ALL devotion benefits and restrictions for 1 hour (until your next short or long rest). You cannot re-attune during this time. This is the cost of channeling all five celestials simultaneously.',
          aftermath: 'Creates a 30-ft radius zone of residual celestial energy for 1 round. Allies in the zone heal 2d6 HP. Enemies take 2d6 radiant damage.'
        }
      },

      cooldownConfig: {
        cooldownType: 'long_rest',
        cooldownValue: 1
      },

      tags: ['transformation', 'ultimate', 'all celestials', 'level 10', 'titan']
    },

    {
      id: 'titan_apocalypse',
      name: 'Apocalypse',
      description: 'Unleash the full destructive power of the celestials, devastating everything in a massive area.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Fire/Rising Inferno',

      typeConfig: {
        school: 'force',
        icon: 'Fire/Rising Inferno',
        castTime: 3,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 100 },
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'APOCALYPSE!',
        somaticText: 'Release all power'
      },

      resolution: 'DICE',
      effectTypes: ['damage'],

      damageConfig: {
        formula: '22d6 + strength',
        damageTypes: ['radiant', 'fire', 'lightning', 'cold', 'force'],
        resolution: 'DICE',
        savingThrow: {
          ability: 'constitution',
          difficultyClass: 22,
          saveOutcome: 'half_damage',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 4.0,
          extraDice: '10d10',
          critEffects: ['apocalyptic_devastation', 'stun', 'terrain_destruction']
        }
      },

      specialMechanics: {
        apocalypse: {
          description: 'The battlefield is devastated. All enemies take 22d6 + strength mixed damage. Terrain is transformed into difficult terrain.',
          aftermath: 'Creates difficult terrain in the entire area for 1 hour.',
          drawback: 'You take half the damage rolled (self-inflicted). You cannot use devotion abilities for 2 rounds after casting as the celestial energy recovers. Allies in the area are not targeted but take 3d6 collateral damage from debris (no save).'
        }
      },

      cooldownConfig: {
        cooldownType: 'long_rest',
        cooldownValue: 1
      },

      tags: ['damage', 'aoe', 'ultimate', 'level 10', 'titan']
    },

    {
      id: 'titan_celestial_rebirth',
      name: 'Celestial Rebirth',
      description: 'Call upon the celestials to revive all fallen allies and fully restore the party.',
      level: 10,
      spellType: 'ACTION',
      icon: 'Healing/Ressusitate',

      typeConfig: {
        school: 'radiant',
        icon: 'Healing/Ressusitate',
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 60 },
        targetRestrictions: ['ally', 'dead']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ['verbal', 'somatic'],
        verbalText: 'CELESTIALS, GRANT REBIRTH!',
        somaticText: 'Arms raised in prayer'
      },

      resolution: 'NONE',
      effectTypes: ['healing', 'restoration'],

      healingConfig: {
        formula: 'max_hp',
        healingType: 'resurrection',
        resolution: 'AUTOMATIC'
      },

      restorationConfig: {
        restorationType: 'resurrection',
        description: 'All fallen allies are resurrected at full HP',
        conditionsCleansed: 'all'
      },

      specialMechanics: {
        rebirth: {
          description: 'All fallen allies within range are resurrected at full HP. All living allies are fully healed and cleansed of all negative conditions. All allies gain +5 to all stats for 10 minutes.',
          drawback: 'You drop to 1 HP and lose all remaining mana. You cannot use any devotion abilities (passive or ultimate) for 1 hour. The celestial energy required to restore life drains your own divine connection temporarily.'
        }
      },

      cooldownConfig: {
        cooldownType: 'long_rest',
        cooldownValue: 1
      },

      tags: ['healing', 'resurrection', 'ultimate', 'level 10', 'titan']
    }
];
