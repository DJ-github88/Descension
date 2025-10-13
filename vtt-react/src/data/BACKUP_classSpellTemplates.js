/**
 * Class Spell Templates
 * 
 * Contains 3 spells for each of the 27 character classes (81 total spells)
 * Organized by class specializations with proper spell data structure
 */

// Generate spell ID function
const generateSpellId = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
};

// Helper function to create a base spell template
const createBaseSpell = (name, description, className, specialization, icon, spellType = 'ACTION') => ({
  id: generateSpellId(name),
  name,
  description,
  className,
  specialization,
  source: 'class',
  icon,
  spellType,
  level: 1,
  tags: [className.toLowerCase(), specialization],
  effectTypes: [],
  damageTypes: []
});

// Infernal Path Spells
export const INFERNAL_PATH_SPELLS = {
  // Pyrofiend Spells
  Pyrofiend: [
    {
      ...createBaseSpell(
        'Infernal Blast',
        'Channel demonic fire energy into a devastating blast that burns enemies and leaves lingering flames.',
        'Pyrofiend',
        'fire_mastery',
        'spell_fire_fireball02'
      ),
      effectTypes: ['damage'],
      damageTypes: ['fire'],
      damageConfig: {
        damageType: 'direct',
        elementType: 'fire',
        formula: '2d8 + 4',
        hasDotEffect: true,
        dotConfig: {
          duration: 6,
          tickFormula: '1d4',
          tickFrequency: 'start'
        }
      },
      targetingConfig: {
        targetingType: 'single',
        range: 60,
        validTargets: ['enemy']
      },
      resourceCost: {
        mana: 20,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'Corruption Surge',
        'Embrace demonic corruption to enhance your next three spells with additional dark energy.',
        'Pyrofiend',
        'corruption_stages',
        'spell_shadow_shadowwordpain'
      ),
      effectTypes: ['buff'],
      spellType: 'ACTION',
      buffConfig: {
        buffType: 'enhancement',
        duration: 30,
        durationType: 'seconds',
        effects: ['spell_power_increase', 'corruption_stacks'],
        stackable: true,
        maxStacks: 3
      },
      targetingConfig: {
        targetingType: 'self',
        range: 0,
        validTargets: ['self']
      },
      resourceCost: {
        mana: 15,
        health: 5,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 4,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'Demonic Empowerment',
        'Draw upon raw demonic power to temporarily transform, gaining increased damage and resistance.',
        'Pyrofiend',
        'demonic_power',
        'spell_shadow_demonicfortitude'
      ),
      effectTypes: ['buff', 'transformation'],
      spellType: 'ACTION',
      buffConfig: {
        buffType: 'transformation',
        duration: 45,
        durationType: 'seconds',
        effects: ['damage_increase', 'fire_resistance', 'demonic_form'],
        visualEffect: 'demonic_aura'
      },
      targetingConfig: {
        targetingType: 'self',
        range: 0,
        validTargets: ['self']
      },
      resourceCost: {
        mana: 30,
        health: 10,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 8,
        charges: 1
      }
    }
  ],

  // Minstrel Spells
  Minstrel: [
    {
      ...createBaseSpell(
        'Harmonic Resonance',
        'Weave musical notes together to create a resonating harmony that damages enemies in a cone.',
        'Minstrel',
        'harmonic_weaving',
        'spell_holy_silence'
      ),
      effectTypes: ['damage'],
      damageTypes: ['sonic'],
      damageConfig: {
        damageType: 'direct',
        elementType: 'sonic',
        formula: '1d6 + 2 per note',
        scalingType: 'musical_notes',
        maxNotes: 5
      },
      targetingConfig: {
        targetingType: 'aoe',
        aoeType: 'cone',
        aoeSize: 30,
        range: 40,
        validTargets: ['enemy']
      },
      resourceCost: {
        mana: 18,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'Chord of Power',
        'Combine multiple musical elements into a powerful chord that buffs allies and debuffs enemies.',
        'Minstrel',
        'chord_combinations',
        'spell_arcane_arcanetorrent'
      ),
      effectTypes: ['buff', 'debuff'],
      spellType: 'ACTION',
      buffConfig: {
        buffType: 'enhancement',
        duration: 20,
        durationType: 'seconds',
        effects: ['attack_power', 'spell_power'],
        areaEffect: true
      },
      debuffConfig: {
        debuffType: 'weakness',
        duration: 20,
        durationType: 'seconds',
        effects: ['reduced_accuracy', 'slowed'],
        areaEffect: true
      },
      targetingConfig: {
        targetingType: 'aoe',
        aoeType: 'sphere',
        aoeSize: 25,
        range: 50,
        validTargets: ['ally', 'enemy']
      },
      resourceCost: {
        mana: 25,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 5,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'Song of Restoration',
        'Channel pure musical magic to heal allies and restore their magical energy over time.',
        'Minstrel',
        'musical_magic',
        'spell_holy_divinehymn'
      ),
      effectTypes: ['healing'],
      healingConfig: {
        healingType: 'direct',
        formula: '3d6 + 6',
        hasHotEffect: true,
        hotConfig: {
          duration: 15,
          tickFormula: '1d6 + 2',
          tickFrequency: 'start',
          restoresMana: true
        }
      },
      targetingConfig: {
        targetingType: 'aoe',
        aoeType: 'sphere',
        aoeSize: 20,
        range: 30,
        validTargets: ['ally', 'self']
      },
      resourceCost: {
        mana: 35,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 6,
        charges: 1
      }
    }
  ],

  // Chronarch Spells
  Chronarch: [
    {
      ...createBaseSpell(
        'Temporal Acceleration',
        'Manipulate time around yourself to gain additional actions and movement speed.',
        'Chronarch',
        'temporal_control',
        'spell_arcane_blink'
      ),
      effectTypes: ['buff'],
      spellType: 'ACTION',
      buffConfig: {
        buffType: 'enhancement',
        duration: 12,
        durationType: 'seconds',
        effects: ['extra_actions', 'movement_speed', 'haste'],
        visualEffect: 'temporal_shimmer'
      },
      targetingConfig: {
        targetingType: 'self',
        range: 0,
        validTargets: ['self']
      },
      resourceCost: {
        mana: 28,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 7,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'Chronos Rewind',
        'Reverse time for a target, undoing recent damage and restoring them to a previous state.',
        'Chronarch',
        'time_manipulation',
        'spell_nature_timestop'
      ),
      effectTypes: ['healing', 'utility'],
      healingConfig: {
        healingType: 'restoration',
        formula: 'restore_to_previous_state',
        timeWindow: 6,
        timeUnit: 'seconds'
      },
      targetingConfig: {
        targetingType: 'single',
        range: 40,
        validTargets: ['ally', 'self']
      },
      resourceCost: {
        mana: 40,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 10,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'Temporal Rift',
        'Create a rift in time that slows enemies and deals damage over time as they age rapidly.',
        'Chronarch',
        'chronos_energy',
        'spell_arcane_teleportundercity'
      ),
      effectTypes: ['damage', 'debuff'],
      damageConfig: {
        damageType: 'direct',
        elementType: 'temporal',
        formula: '1d8 + 3',
        hasDotEffect: true,
        dotConfig: {
          duration: 18,
          tickFormula: '2d4',
          tickFrequency: 'start',
          effectType: 'aging'
        }
      },
      debuffConfig: {
        debuffType: 'movement',
        duration: 18,
        durationType: 'seconds',
        effects: ['slowed', 'temporal_distortion']
      },
      targetingConfig: {
        targetingType: 'aoe',
        aoeType: 'sphere',
        aoeSize: 15,
        range: 50,
        validTargets: ['enemy']
      },
      resourceCost: {
        mana: 32,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 6,
        charges: 1
      }
    }
  ],

  // Chaos Weaver Spells
  'Chaos Weaver': [
    {
      ...createBaseSpell(
        'Reality Fracture',
        'Tear a hole in reality itself, causing unpredictable magical effects in the target area.',
        'Chaos Weaver',
        'reality_bending',
        'spell_arcane_polymorphchicken'
      ),
      effectTypes: ['damage', 'utility'],
      damageConfig: {
        damageType: 'chaotic',
        elementType: 'chaos',
        formula: 'random(1d4, 3d8)',
        randomEffects: true,
        chaosDice: true
      },
      targetingConfig: {
        targetingType: 'aoe',
        aoeType: 'sphere',
        aoeSize: 20,
        range: 45,
        validTargets: ['enemy', 'ally', 'object']
      },
      resourceCost: {
        mana: 25,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 4,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'Entropy Wave',
        'Release a wave of pure entropy that weakens enemy defenses and causes random debuffs.',
        'Chaos Weaver',
        'entropy_control',
        'spell_shadow_chilltouch'
      ),
      effectTypes: ['debuff', 'damage'],
      debuffConfig: {
        debuffType: 'random',
        duration: 15,
        durationType: 'seconds',
        effects: ['random_debuff_pool'],
        randomSelection: true,
        maxEffects: 2
      },
      damageConfig: {
        damageType: 'direct',
        elementType: 'entropy',
        formula: '2d6 + 2',
        ignoresResistance: true
      },
      targetingConfig: {
        targetingType: 'aoe',
        aoeType: 'cone',
        aoeSize: 35,
        range: 40,
        validTargets: ['enemy']
      },
      resourceCost: {
        mana: 22,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 5,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'Chaos Dice Gambit',
        'Roll chaos dice to determine a powerful random effect that could help or hinder.',
        'Chaos Weaver',
        'chaos_dice',
        'spell_shadow_possession'
      ),
      effectTypes: ['utility', 'random'],
      spellType: 'ACTION',
      rollableTable: {
        enabled: true,
        diceType: 'd20',
        diceCount: 1,
        outcomes: [
          { range: [1, 3], effect: 'chaos_backfire', description: 'Spell backfires on caster' },
          { range: [4, 7], effect: 'minor_chaos', description: 'Minor random effect' },
          { range: [8, 12], effect: 'moderate_chaos', description: 'Moderate beneficial effect' },
          { range: [13, 17], effect: 'major_chaos', description: 'Major beneficial effect' },
          { range: [18, 20], effect: 'reality_break', description: 'Reality-altering effect' }
        ]
      },
      targetingConfig: {
        targetingType: 'special',
        range: 60,
        validTargets: ['any']
      },
      resourceCost: {
        mana: 20,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3,
        charges: 1
      }
    }
  ],

  // Gambler Spells
  Gambler: [
    {
      ...createBaseSpell(
        'Lucky Strike',
        'Channel fortune into your next attack, with damage scaling based on risk taken.',
        'Gambler',
        'luck_manipulation',
        'spell_holy_blessedrecovery'
      ),
      effectTypes: ['damage', 'buff'],
      damageConfig: {
        damageType: 'variable',
        elementType: 'fortune',
        formula: 'risk_based_scaling',
        riskMultiplier: true,
        criticalChance: 'enhanced'
      },
      buffConfig: {
        buffType: 'enhancement',
        duration: 6,
        durationType: 'seconds',
        effects: ['luck_bonus', 'critical_chance']
      },
      targetingConfig: {
        targetingType: 'single',
        range: 50,
        validTargets: ['enemy']
      },
      resourceCost: {
        mana: 15,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'High Stakes Gambit',
        'Risk your own health for a chance at massive damage or complete failure.',
        'Gambler',
        'risk_management',
        'spell_shadow_ritualofsacrifice'
      ),
      effectTypes: ['damage', 'risk'],
      damageConfig: {
        damageType: 'gambling',
        elementType: 'fate',
        formula: 'health_percentage_based',
        riskReward: true,
        failureChance: 30
      },
      resourceCost: {
        mana: 10,
        health: 'percentage_based',
        stamina: 0,
        focus: 0
      },
      targetingConfig: {
        targetingType: 'single',
        range: 40,
        validTargets: ['enemy']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 6,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'Twist of Fate',
        'Manipulate destiny itself to reverse the outcome of a recent event or action.',
        'Gambler',
        'fate_control',
        'spell_holy_spiritualguidence'
      ),
      effectTypes: ['utility', 'fate'],
      spellType: 'REACTION',
      utilityConfig: {
        utilityType: 'reversal',
        timeWindow: 3,
        timeUnit: 'seconds',
        reversalTypes: ['damage', 'healing', 'buff', 'debuff']
      },
      targetingConfig: {
        targetingType: 'special',
        range: 60,
        validTargets: ['any']
      },
      resourceCost: {
        mana: 35,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 8,
        charges: 1
      }
    }
  ]
};

// Celestial Path Spells
export const CELESTIAL_PATH_SPELLS = {
  // Paladin Spells
  Paladin: [
    {
      ...createBaseSpell(
        'Divine Shield',
        'Surround yourself or an ally with holy light that absorbs damage and reflects evil magic.',
        'Paladin',
        'divine_protection',
        'spell_holy_powerwordshield'
      ),
      effectTypes: ['buff', 'protection'],
      buffConfig: {
        buffType: 'shield',
        duration: 30,
        durationType: 'seconds',
        effects: ['damage_absorption', 'magic_reflection'],
        shieldAmount: '3d8 + 10',
        reflectEvil: true
      },
      targetingConfig: {
        targetingType: 'single',
        range: 30,
        validTargets: ['ally', 'self']
      },
      resourceCost: {
        mana: 25,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 5,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'Righteous Fury',
        'Channel divine wrath into devastating attacks that deal extra damage to evil creatures.',
        'Paladin',
        'holy_wrath',
        'spell_holy_holybolt'
      ),
      effectTypes: ['damage', 'buff'],
      damageConfig: {
        damageType: 'direct',
        elementType: 'holy',
        formula: '2d10 + 6',
        bonusVsEvil: '1d6',
        autoHitEvil: true
      },
      buffConfig: {
        buffType: 'enhancement',
        duration: 15,
        durationType: 'seconds',
        effects: ['holy_damage_bonus', 'righteous_aura']
      },
      targetingConfig: {
        targetingType: 'single',
        range: 40,
        validTargets: ['enemy']
      },
      resourceCost: {
        mana: 30,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 4,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'Sacred Restoration',
        'Call upon divine power to heal wounds and cure diseases with holy light.',
        'Paladin',
        'sacred_healing',
        'spell_holy_heal'
      ),
      effectTypes: ['healing'],
      healingConfig: {
        healingType: 'direct',
        formula: '4d6 + 8',
        curesDisease: true,
        removesDebuffs: ['poison', 'disease', 'curse'],
        hasHotEffect: true,
        hotConfig: {
          duration: 12,
          tickFormula: '1d6 + 2',
          tickFrequency: 'start'
        }
      },
      targetingConfig: {
        targetingType: 'single',
        range: 25,
        validTargets: ['ally', 'self']
      },
      resourceCost: {
        mana: 35,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 3,
        charges: 1
      }
    }
  ],

  // Cleric Spells
  Cleric: [
    {
      ...createBaseSpell(
        'Divine Intervention',
        'Channel pure divine energy to create powerful magical effects based on faith.',
        'Cleric',
        'divine_magic',
        'spell_holy_divinespirit'
      ),
      effectTypes: ['utility', 'divine'],
      spellType: 'ACTION',
      utilityConfig: {
        utilityType: 'divine_miracle',
        faithBased: true,
        variableEffects: ['healing', 'protection', 'smiting', 'blessing']
      },
      targetingConfig: {
        targetingType: 'special',
        range: 50,
        validTargets: ['any']
      },
      resourceCost: {
        mana: 40,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 8,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'Mass Healing',
        'Restore health to multiple allies simultaneously with divine grace.',
        'Cleric',
        'healing_arts',
        'spell_holy_greaterheal'
      ),
      effectTypes: ['healing'],
      healingConfig: {
        healingType: 'area',
        formula: '3d6 + 6',
        maxTargets: 6,
        scalingWithTargets: true,
        divineGrace: true
      },
      targetingConfig: {
        targetingType: 'aoe',
        aoeType: 'sphere',
        aoeSize: 25,
        range: 40,
        validTargets: ['ally', 'self']
      },
      resourceCost: {
        mana: 45,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 6,
        charges: 1
      }
    },
    {
      ...createBaseSpell(
        'Sacred Ritual',
        'Perform a powerful ritual that provides long-lasting benefits to your party.',
        'Cleric',
        'sacred_rituals',
        'spell_holy_prayerofhealing'
      ),
      effectTypes: ['buff', 'ritual'],
      spellType: 'CHANNELED',
      buffConfig: {
        buffType: 'blessing',
        duration: 300,
        durationType: 'seconds',
        effects: ['divine_blessing', 'resistance_bonus', 'regeneration'],
        areaEffect: true,
        ritualPower: true
      },
      channelingConfig: {
        channelTime: 6,
        channelTimeUnit: 'seconds',
        interruptible: true,
        concentrationRequired: true
      },
      targetingConfig: {
        targetingType: 'aoe',
        aoeType: 'sphere',
        aoeSize: 30,
        range: 0,
        validTargets: ['ally', 'self']
      },
      resourceCost: {
        mana: 50,
        health: 0,
        stamina: 0,
        focus: 0
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 12,
        charges: 1
      }
    }
  ]
};
