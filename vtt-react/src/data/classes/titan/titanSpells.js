/**
 * Titan Spells & Abilities - The Ossified Juggernaut
 * 
 * Organized by bone attunement devotions (L1-3) and level (L4-10).
 * Strictly normalized according to SPELL_DATA_REFERENCE.md.
 * All spells actively utilize and manage the Calcification/Mass resource.
 */

export const TITAN_SPELLS = [
  // ─── SOLARA (MARROW-BURN) BONE ATTUNEMENT ───
  {
    id: 'titan_radiant_strike',
    name: 'Marrow-Burn Strike',
    description: 'Your skeleton heats to a radioactive white-hot calcium burn. Your melee attacks deal searing calcium damage and build skeletal mass.',
    spellType: 'PASSIVE',
    icon: 'Radiant/Radiant Beam',
    level: 1,
    specialization: 'solara',
    typeConfig: {
      school: 'radiant',
      icon: 'Radiant/Radiant Beam',
      tags: ['passive', 'radiant', 'melee', 'solara', 'titan'],
      castTime: 0,
      castTimeType: 'PASSIVE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    durationConfig: {
      durationType: 'permanent'
    },
    resourceCost: {
      actionPoints: 0,
      mana: 0,
      classResource: { type: 'calcification', gain: 10 }
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
        championBonus: 'Calcium friction damage increased to 2d6 radiant.'
      }
    },
    tags: ['passive', 'radiant', 'melee', 'solara', 'titan']
  },
  {
    id: 'titan_solar_flare',
    name: 'Bleached Flare',
    description: 'You detonate your hyper-dense marrow core, releasing a sickening radioactive white flash. Blinds nearby enemies at the cost of severe bone erosion.',
    spellType: 'ACTION',
    icon: 'Fire/Dragon Breath',
    level: 3,
    specialization: 'solara',
    typeConfig: {
      school: 'radiant',
      icon: 'Fire/Dragon Breath',
      tags: ['radiant', 'aoe', 'blind', 'solara', 'titan'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'self_centered',
      aoeShape: 'circle',
      aoeParameters: { radius: 10 },
      targetRestrictions: ['enemy']
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 1,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0,
      classResource: { type: 'calcification', cost: 30 }
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
      effects: [{
        id: 'blinded',
        name: 'Blinded',
        description: 'Target cannot see. Disadvantage on attack rolls and attacks against target have advantage.',
        mechanicsText: 'Disadvantage on attacks, auto-fail sight checks'
      }],
      durationType: 'rounds',
      durationValue: 1,
      durationUnit: 'rounds'
    },
    specialMechanics: {
      devotion: {
        required: 'Solara',
        usesPerLongRest: 1,
        championBonus: 'Double uses per rest; radiation radius increases to 20 feet.'
      }
    },
    tags: ['ultimate', 'radiant', 'aoe', 'blind', 'solara', 'titan']
  },

  // ─── LUNARA (PALE TOMB) BONE ATTUNEMENT ───
  {
    id: 'titan_moonlit_resilience',
    name: 'Pale Tomb Crust',
    description: 'An agonizing, cadaverous crust of fossilized bone calcifies over your joints, deadening your nerves and reinforcing your armor.',
    spellType: 'PASSIVE',
    icon: 'Nature/Ethereal Bird',
    level: 1,
    specialization: 'lunara',
    typeConfig: {
      school: 'frost',
      icon: 'Nature/Ethereal Bird',
      tags: ['passive', 'defense', 'regeneration', 'lunara', 'titan'],
      castTime: 0,
      castTimeType: 'PASSIVE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    durationConfig: {
      durationType: 'permanent'
    },
    resourceCost: {
      actionPoints: 0,
      mana: 0,
      classResource: { type: 'calcification', gain: 10 }
    },
    devotionRequired: 'Lunara',
    resolution: 'PASSIVE',
    effectTypes: ['buff', 'healing'],
    cooldownConfig: {
      cooldownType: 'none',
      cooldownValue: 0
    },
    buffConfig: {
      buffType: 'statEnhancement',
      effects: [
        { id: 'pale_tomb_armor', name: 'Pale Tomb Armor', description: '+2 Armor (+3 for Ossified Scion)', statModifier: { stat: 'armor', magnitude: 2, magnitudeType: 'flat' } }
      ],
      durationType: 'permanent'
    },
    healingConfig: {
      formula: '5',
      healingType: 'regeneration',
      resolution: 'AUTOMATIC'
    },
    specialMechanics: {
      devotion: {
        required: 'Lunara',
        passive: true,
        championBonus: 'Gains +1 extra Armor and regenerates 8 HP per round.'
      }
    },
    tags: ['passive', 'defense', 'regeneration', 'lunara', 'titan']
  },
  {
    id: 'titan_lunar_shield',
    name: 'Ossified Wall',
    description: 'You forcefully fracture your own bone-crust to erupt a barricade of protective bone splinters around your allies.',
    spellType: 'ACTION',
    icon: 'Force/Force Shield',
    level: 3,
    specialization: 'lunara',
    typeConfig: {
      school: 'force',
      icon: 'Force/Force Shield',
      tags: ['ultimate', 'shield', 'aoe', 'support', 'lunara', 'titan'],
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
    durationConfig: {
      durationType: 'rounds',
      durationValue: 3,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0,
      classResource: { type: 'calcification', cost: 40 }
    },
    devotionRequired: 'Lunara',
    resolution: 'AUTOMATIC',
    effectTypes: ['buff'],
    cooldownConfig: {
      cooldownType: 'long_rest',
      cooldownValue: 1
    },
    buffConfig: {
      buffType: 'damageMitigation',
      effects: [{
        id: 'lunar_shield_absorption',
        name: 'Lunar Shield',
        description: 'Absorbs up to 50 damage (75 for Ossified Scion) for all allies within 15 feet.',
        mechanicsText: 'Shield absorbs 50 damage before breaking'
      }],
      durationType: 'rounds',
      durationValue: 3,
      durationUnit: 'rounds'
    },
    specialMechanics: {
      devotion: {
        required: 'Lunara',
        usesPerLongRest: 1,
        championBonus: 'Absorbs 75 damage, and increases barrier radius to 25 feet.'
      }
    },
    tags: ['ultimate', 'shield', 'aoe', 'support', 'lunara', 'titan']
  },

  // ─── ASTRAEUS (CRUSHING CORE) BONE ATTUNEMENT ───
  {
    id: 'titan_celestial_speed',
    name: 'Gravitational Singularity',
    description: 'You weaponize your immense gravitational mass. Melee attacks distort space, dragging enemies close and splintering their joints.',
    spellType: 'PASSIVE',
    icon: 'Arcane/Quick Step',
    level: 1,
    specialization: 'astraeus',
    typeConfig: {
      school: 'force',
      icon: 'Arcane/Quick Step',
      tags: ['passive', 'force', 'control', 'astraeus', 'titan'],
      castTime: 0,
      castTimeType: 'PASSIVE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    durationConfig: {
      durationType: 'permanent'
    },
    resourceCost: {
      actionPoints: 0,
      mana: 0,
      classResource: { type: 'calcification', gain: 15 }
    },
    devotionRequired: 'Astraeus',
    resolution: 'PASSIVE',
    effectTypes: ['damage'],
    cooldownConfig: {
      cooldownType: 'none',
      cooldownValue: 0
    },
    damageConfig: {
      formula: '1d6',
      damageTypes: ['force'],
      resolution: 'DICE'
    },
    specialMechanics: {
      devotion: {
        required: 'Astraeus',
        passive: true,
        championBonus: 'Melee attacks pull enemies 10 ft closer instead of 5 ft.'
      }
    },
    tags: ['passive', 'force', 'control', 'astraeus', 'titan']
  },
  {
    id: 'titan_starfall',
    name: 'Gravitational Collapse',
    description: 'Locally collapse gravity on a single target, violently crushing their skeleton under infinite mass.',
    spellType: 'ACTION',
    icon: 'Arcane/Missile',
    level: 3,
    specialization: 'astraeus',
    typeConfig: {
      school: 'force',
      icon: 'Arcane/Missile',
      tags: ['ultimate', 'force', 'control', 'astraeus', 'titan'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 60,
      targetRestrictions: ['enemy']
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 1,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0,
      classResource: { type: 'calcification', cost: 30 }
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
      effects: [{
        id: 'stunned',
        name: 'Stunned',
        description: 'Target is pinned under gravitational force and cannot move or take actions.',
        mechanicsText: 'Cannot act or move'
      }],
      durationType: 'rounds',
      durationValue: 1,
      durationUnit: 'rounds'
    },
    specialMechanics: {
      devotion: {
        required: 'Astraeus',
        usesPerLongRest: 1,
        championBonus: 'Deals 6d6 force damage and stuns for 2 rounds.'
      }
    },
    tags: ['ultimate', 'force', 'control', 'astraeus', 'titan']
  },

  // ─── TERRANOX (FOSSILIZED TOMB) BONE ATTUNEMENT ───
  {
    id: 'titan_grounded_might',
    name: 'Fossilized Petrification',
    description: 'Your muscle tissue petrifies into literal slate. You become an unyielding stone monument, absorbing impacts.',
    spellType: 'PASSIVE',
    icon: 'Nature/Grasp',
    level: 1,
    specialization: 'terranox',
    typeConfig: {
      school: 'bludgeoning',
      icon: 'Nature/Grasp',
      tags: ['passive', 'defense', 'terranox', 'titan'],
      castTime: 0,
      castTimeType: 'PASSIVE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    durationConfig: {
      durationType: 'permanent'
    },
    resourceCost: {
      actionPoints: 0,
      mana: 0,
      classResource: { type: 'calcification', gain: 15 }
    },
    devotionRequired: 'Terranox',
    resolution: 'PASSIVE',
    effectTypes: ['buff'],
    cooldownConfig: {
      cooldownType: 'none',
      cooldownValue: 0
    },
    buffConfig: {
      buffType: 'statEnhancement',
      effects: [
        { id: 'fossilized_skin', name: 'Petrified Flesh', description: '+20 Max HP and physical damage resistance (2 flat reduction).', statModifier: { stat: 'maxHealth', magnitude: 20, magnitudeType: 'flat' } }
      ],
      durationType: 'permanent'
    },
    specialMechanics: {
      devotion: {
        required: 'Terranox',
        passive: true,
        championBonus: 'Flat physical damage resistance increases to 5.'
      }
    },
    tags: ['passive', 'defense', 'terranox', 'titan']
  },
  {
    id: 'titan_earthquake',
    name: 'Tectonic Slam',
    description: 'Violently slam your hyper-dense mineralized limbs into the ground, shattering stone and fracturing the legs of nearby foes.',
    spellType: 'ACTION',
    icon: 'Nature/Grasp',
    level: 3,
    specialization: 'terranox',
    typeConfig: {
      school: 'bludgeoning',
      icon: 'Nature/Grasp',
      tags: ['ultimate', 'bludgeoning', 'aoe', 'control', 'terranox', 'titan'],
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
      durationType: 'rounds',
      durationValue: 1,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0,
      classResource: { type: 'calcification', cost: 40 }
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
      effects: [{
        id: 'prone',
        name: 'Prone',
        description: 'Target is knocked to the ground. Speed is halved and attacks have disadvantage.',
        mechanicsText: 'Must spend half movement to stand up'
      }],
      durationType: 'rounds',
      durationValue: 1,
      durationUnit: 'rounds'
    },
    specialMechanics: {
      devotion: {
        required: 'Terranox',
        usesPerLongRest: 1,
        championBonus: 'Deals 5d6 damage and inflicts Crippled (speed set to 0) for 1 round.'
      }
    },
    tags: ['ultimate', 'bludgeoning', 'aoe', 'control', 'terranox', 'titan']
  },

  // ─── ZEPHYRA (FLAYED GALE) BONE ATTUNEMENT ───
  {
    id: 'titan_tempest_fury',
    name: 'Sharded Marrow Spikes',
    description: 'Shattered calcium spikes erupt outward through your skin, whipping in the wind to lacerate anyone who draws close.',
    spellType: 'PASSIVE',
    icon: 'Nature/Thorn Spikes',
    level: 1,
    specialization: 'zephyra',
    typeConfig: {
      school: 'lightning',
      icon: 'Nature/Thorn Spikes',
      tags: ['passive', 'lightning', 'melee', 'zephyra', 'titan'],
      castTime: 0,
      castTimeType: 'PASSIVE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    durationConfig: {
      durationType: 'permanent'
    },
    resourceCost: {
      actionPoints: 0,
      mana: 0,
      classResource: { type: 'calcification', gain: 10 }
    },
    devotionRequired: 'Zephyra',
    resolution: 'PASSIVE',
    effectTypes: ['damage'],
    cooldownConfig: {
      cooldownType: 'none',
      cooldownValue: 0
    },
    damageConfig: {
      formula: '1d4',
      damageTypes: ['lightning'],
      resolution: 'DICE'
    },
    specialMechanics: {
      devotion: {
        required: 'Zephyra',
        passive: true,
        championBonus: 'Marrow spikes deal 2d4 lightning and 1d6 bleeding damage on hit.'
      }
    },
    tags: ['passive', 'lightning', 'melee', 'zephyra', 'titan']
  },
  {
    id: 'titan_wind_dash',
    name: 'Splinter-Burst Dash',
    description: 'Forcibly dissolve your calcified skeleton into a tempest of screaming bone shrapnel, reforming at a nearby location in a bloody shockwave.',
    spellType: 'ACTION',
    icon: 'Nature/Ethereal Bird',
    level: 3,
    specialization: 'zephyra',
    typeConfig: {
      school: 'lightning',
      icon: 'Nature/Ethereal Bird',
      tags: ['ultimate', 'lightning', 'teleport', 'aoe', 'zephyra', 'titan'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 30,
      aoeShape: 'circle',
      aoeParameters: { radius: 5 },
      targetRestrictions: ['enemy']
    },
    durationConfig: {
      durationType: 'instant'
    },
    resourceCost: {
      actionPoints: 2,
      mana: 0,
      classResource: { type: 'calcification', cost: 30 }
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
    specialMechanics: {
      devotion: {
        required: 'Zephyra',
        usesPerLongRest: 1,
        championBonus: 'Double uses per rest; shrapnel damage scales to 5d6.'
      }
    },
    tags: ['ultimate', 'lightning', 'teleport', 'aoe', 'zephyra', 'titan']
  },

  // ─── SPECIALIZATION ABILITY (GRAVITATIONAL RUPTURE) ───
  {
    id: 'titan_devotion_switch',
    name: 'Skeletal Shatter-Shift',
    description: 'Instantly snap and rebuild your entire skeletal matrix to shift bone attunements mid-combat, releasing a bone-shattering kinetic pulse.',
    spellType: 'ACTION',
    icon: 'Arcane/Ebon Blaze',
    level: 2,
    specialization: 'astral-warrior',
    typeConfig: {
      school: 'force',
      icon: 'Arcane/Ebon Blaze',
      tags: ['utility', 'devotion', 'switching', 'astral-warrior', 'titan'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    durationConfig: {
      durationType: 'instant'
    },
    resourceCost: {
      actionPoints: 1,
      mana: 0,
      classResource: { type: 'calcification', gain: 20 }
    },
    specializationRequired: 'astral-warrior',
    resolution: 'AUTOMATIC',
    effectTypes: ['buff'],
    cooldownConfig: {
      cooldownType: 'long_rest',
      cooldownValue: 1
    },
    buffConfig: {
      buffType: 'triggeredEffect',
      effects: [{
        id: 'shatter_shift_pulse',
        name: 'Friction Marrow Burst',
        description: 'Shattering bone friction triggers a local kinetic release, granting 20 Mass and releasing a shockwave matching your new attunement.'
      }],
      durationType: 'instant'
    },
    tags: ['utility', 'devotion', 'switching', 'astral-warrior', 'titan']
  },

  // ─── UNIVERSAL LEVEL 4 SPELLS ───
  {
    id: 'titan_celestial_strike',
    name: 'Ossified Cleave',
    description: 'Slam hyper-calcified arm-blades into an enemy, utilizing sheer bone density to crack armor. Generates skeletal mass but subjects you to Terminal Inertia.',
    level: 4,
    spellType: 'ACTION',
    icon: 'Radiant/Divine Downward Sword',
    typeConfig: {
      school: 'bludgeoning',
      icon: 'Radiant/Divine Downward Sword',
      tags: ['damage', 'melee', 'devotion', 'level 4', 'titan'],
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
      actionPoints: 1,
      mana: 15,
      classResource: { type: 'calcification', gain: 15 }
    },
    resolution: 'DICE',
    effectTypes: ['damage'],
    damageConfig: {
      formula: '4d8 + strength',
      damageTypes: ['bludgeoning'],
      resolution: 'DICE'
    },
    specialMechanics: {
      terminalInertia: {
        active: true,
        penalty: 'Reduces your Dodge by 5 points until start of next turn.'
      }
    },
    tags: ['damage', 'melee', 'devotion', 'level 4', 'titan']
  },
  {
    id: 'titan_celestial_armor',
    name: 'Agonizing Calcification',
    description: 'Force rapid, excruciating bone growth to encase your body in a dense mineralized plate. Significantly boosts Armor and attunement resistance.',
    level: 4,
    spellType: 'ACTION',
    icon: 'Force/Force Shield',
    typeConfig: {
      school: 'force',
      icon: 'Force/Force Shield',
      tags: ['buff', 'armor', 'protection', 'level 4', 'titan'],
      castTime: 1,
      castTimeType: 'BONUS'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 5,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 0,
      mana: 16,
      classResource: { type: 'calcification', gain: 25 }
    },
    resolution: 'AUTOMATIC',
    effectTypes: ['buff'],
    buffConfig: {
      buffType: 'statEnhancement',
      effects: [{
        id: 'agonizing_armor',
        name: 'Agonizing Armor',
        description: '+4 Armor. Reduces movement speed by 10 ft due to skeletal mass.',
        statModifier: { stat: 'armor', magnitude: 4, magnitudeType: 'flat' }
      }],
      durationType: 'rounds',
      durationValue: 5,
      durationUnit: 'rounds'
    },
    tags: ['buff', 'armor', 'protection', 'level 4', 'titan']
  },
  {
    id: 'titan_divine_challenge',
    name: 'Gravitational Binding',
    description: 'Drastically increase your localized mass to pull a targets gravity toward yours, forcing them to focus their strikes on your stone core.',
    level: 4,
    spellType: 'ACTION',
    icon: 'Necrotic/Blood Scroll',
    typeConfig: {
      school: 'force',
      icon: 'Necrotic/Blood Scroll',
      tags: ['debuff', 'taunt', 'control', 'level 4', 'titan'],
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
      durationValue: 3,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 0,
      mana: 12,
      classResource: { type: 'calcification', cost: 15 }
    },
    resolution: 'SAVE',
    effectTypes: ['debuff', 'control'],
    debuffConfig: {
      debuffType: 'statusEffect',
      effects: [{
        id: 'gravitational_taunt',
        name: 'Gravitationally Bound',
        description: 'Target must attack you. If they attack someone else, they take 3d6 force damage.',
        mechanicsText: 'Must attack caster or take 3d6 force damage'
      }],
      savingThrow: { ability: 'spirit', difficultyClass: 15, saveOutcome: 'negates' },
      durationType: 'rounds',
      durationValue: 3,
      durationUnit: 'rounds'
    },
    tags: ['debuff', 'taunt', 'control', 'level 4', 'titan']
  },

  // ─── LEVEL 5 SPELLS ───
  {
    id: 'titan_solar_inferno',
    name: 'Supernova Bone-Burn',
    description: 'Requires Marrow-Burn. Consume your bone marrow to release a devastating radial solar blast, melting flesh and stone.',
    level: 5,
    spellType: 'ACTION',
    icon: 'Fire/Fiery Symbol',
    typeConfig: {
      school: 'radiant',
      icon: 'Fire/Fiery Symbol',
      tags: ['damage', 'aoe', 'radiant', 'solara', 'level 5', 'titan'],
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
      actionPoints: 2,
      mana: 18,
      classResource: { type: 'calcification', cost: 25 }
    },
    devotionRequired: 'Solara',
    resolution: 'DICE',
    effectTypes: ['damage'],
    damageConfig: {
      formula: '6d8 + strength',
      damageTypes: ['radiant'],
      resolution: 'DICE',
      savingThrow: {
        ability: 'agility',
        difficultyClass: 15,
        saveOutcome: 'half_damage'
      }
    },
    tags: ['damage', 'aoe', 'radiant', 'solara', 'level 5', 'titan']
  },
  {
    id: 'titan_lunar_sanctuary',
    name: 'Tomb of the Pale Moon',
    description: 'Requires Pale Tomb. Erupt cadaverous bone pillars in a ring, shielding allies within and slowly stitching their wounds.',
    level: 5,
    spellType: 'ACTION',
    icon: 'Radiant/Radiant Bolt',
    typeConfig: {
      school: 'frost',
      icon: 'Radiant/Radiant Bolt',
      tags: ['buff', 'healing', 'protection', 'lunara', 'level 5', 'titan'],
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
    durationConfig: {
      durationType: 'rounds',
      durationValue: 4,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 2,
      mana: 20,
      classResource: { type: 'calcification', cost: 30 }
    },
    devotionRequired: 'Lunara',
    resolution: 'DICE',
    effectTypes: ['buff', 'healing'],
    buffConfig: {
      buffType: 'damageMitigation',
      effects: [{
        id: 'tomb_barrier',
        name: 'Tomb Protection',
        description: 'Allies gain +3 Armor while inside the pale bone ring.',
        statModifier: { stat: 'armor', magnitude: 3, magnitudeType: 'flat' }
      }],
      durationType: 'rounds',
      durationValue: 4,
      durationUnit: 'rounds'
    },
    healingConfig: {
      formula: '2d6',
      healingType: 'regeneration',
      resolution: 'DICE',
      hotConfig: { enabled: true, healingPerTick: '2d6', tickFrequency: 'round', duration: 4 }
    },
    tags: ['buff', 'healing', 'protection', 'lunara', 'level 5', 'titan']
  },
  {
    id: 'titan_meteor_strike',
    name: 'Void Sinkhole',
    description: 'Requires Crushing Core. Distort gravity at a distant point, creating a dense localized singularity that crushes and pulls enemies together.',
    level: 5,
    spellType: 'ACTION',
    icon: 'Arcane/Magical Sword',
    typeConfig: {
      school: 'force',
      icon: 'Arcane/Magical Sword',
      tags: ['damage', 'force', 'control', 'astraeus', 'level 5', 'titan'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 90,
      aoeShape: 'circle',
      aoeParameters: { radius: 15 },
      targetRestrictions: ['enemy']
    },
    durationConfig: {
      durationType: 'instant'
    },
    resourceCost: {
      actionPoints: 2,
      mana: 20,
      classResource: { type: 'calcification', cost: 30 }
    },
    devotionRequired: 'Astraeus',
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
      controlType: 'forcedMovement',
      effects: [{
        id: 'gravitational_drag',
        name: 'Gravitational Sink',
        description: 'Drags all enemies within the area directly to the center point.'
      }]
    },
    tags: ['damage', 'force', 'control', 'astraeus', 'level 5', 'titan']
  },

  // ─── LEVEL 6 SPELLS ───
  {
    id: 'titan_tectonic_upheaval',
    name: 'Fossilized Impalement',
    description: 'Requires Fossilized Tomb. Stamp the earth to erupt massive, jagged calcified stone pillars, pinning enemies in place.',
    level: 6,
    spellType: 'ACTION',
    icon: 'Nature/Grasp',
    typeConfig: {
      school: 'bludgeoning',
      icon: 'Nature/Grasp',
      tags: ['damage', 'control', 'terranox', 'level 6', 'titan'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'self_centered',
      aoeShape: 'circle',
      aoeParameters: { radius: 25 },
      targetRestrictions: ['enemy']
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 2,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 2,
      mana: 22,
      classResource: { type: 'calcification', cost: 30 }
    },
    devotionRequired: 'Terranox',
    resolution: 'DICE',
    effectTypes: ['damage', 'control'],
    damageConfig: {
      formula: '6d8 + strength',
      damageTypes: ['bludgeoning'],
      resolution: 'DICE',
      savingThrow: { ability: 'constitution', difficultyClass: 16, saveOutcome: 'half_damage' }
    },
    controlConfig: {
      controlType: 'incapacitation',
      effects: [{
        id: 'pinned_stone',
        name: 'Pinned in Stone',
        description: 'Roots target in place (movement speed set to 0).'
      }],
      duration: 2,
      durationUnit: 'rounds'
    },
    tags: ['damage', 'control', 'terranox', 'level 6', 'titan']
  },
  {
    id: 'titan_lightning_storm',
    name: 'Shattered Shrapnel Storm',
    description: 'Requires Flayed Gale. Crack your bone plates open to eject a high-velocity cyclone of electrified bone-shrapnel.',
    level: 6,
    spellType: 'ACTION',
    icon: 'Nature/Thorn Spikes',
    typeConfig: {
      school: 'lightning',
      icon: 'Nature/Thorn Spikes',
      tags: ['damage', 'aoe', 'zephyra', 'level 6', 'titan'],
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
    durationConfig: {
      durationType: 'instant'
    },
    resourceCost: {
      actionPoints: 2,
      mana: 22,
      classResource: { type: 'calcification', cost: 30 }
    },
    devotionRequired: 'Zephyra',
    resolution: 'DICE',
    effectTypes: ['damage'],
    damageConfig: {
      formula: '7d6 + strength',
      damageTypes: ['lightning'],
      resolution: 'DICE',
      savingThrow: { ability: 'agility', difficultyClass: 16, saveOutcome: 'half_damage' }
    },
    tags: ['damage', 'aoe', 'zephyra', 'level 6', 'titan']
  },
  {
    id: 'titan_celestial_convergence',
    name: 'Hyper-Calcified Shield',
    description: 'Convert kinetic impact directly into skeletal growth. Gain immense temporary HP and cause bone splinters to pierce melee attackers.',
    level: 6,
    spellType: 'ACTION',
    icon: 'Force/Force Shield',
    typeConfig: {
      school: 'force',
      icon: 'Force/Force Shield',
      tags: ['buff', 'protection', 'level 6', 'titan'],
      castTime: 1,
      castTimeType: 'BONUS'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 3,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 1,
      mana: 24,
      classResource: { type: 'calcification', gain: 30 }
    },
    resolution: 'AUTOMATIC',
    effectTypes: ['buff'],
    buffConfig: {
      buffType: 'damageMitigation',
      effects: [{
        id: 'absorb_calcification',
        name: 'Marrow Barrier',
        description: 'Gain 50 Temporary HP. Any enemy striking you in melee suffers 2d8 piercing damage from calcified shards.',
        mechanicsText: '50 Temp HP, melee attackers take 2d8 piercing'
      }],
      durationType: 'rounds',
      durationValue: 3,
      durationUnit: 'rounds'
    },
    tags: ['buff', 'protection', 'level 6', 'titan']
  },

  // ─── LEVEL 7 SPELLS ───
  {
    id: 'titan_avatar_of_solara',
    name: 'Solaris Calcified Monstrosity',
    description: 'Requires Marrow-Burn. Morph into a hulking, blinding giant of incandescent white bone. Your blows ignite air, but terminal weight prevents evasion.',
    level: 7,
    spellType: 'ACTION',
    icon: 'Radiant/Divine Radiance',
    typeConfig: {
      school: 'radiant',
      icon: 'Radiant/Divine Radiance',
      tags: ['transformation', 'radiant', 'solara', 'level 7', 'titan'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 4,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 3,
      mana: 28,
      classResource: { type: 'calcification', cost: 50 }
    },
    devotionRequired: 'Solara',
    resolution: 'AUTOMATIC',
    effectTypes: ['buff'],
    buffConfig: {
      buffType: 'custom',
      effects: [{
        id: 'solara_monstrosity',
        name: 'Marrow-Burn Colossus',
        description: 'All melee attacks deal an extra 3d6 fire damage. Dodge is locked at 0. Speed set to 5 ft.',
        mechanicsText: '+3d6 fire on hit, Dodge is 0, Speed is 5 ft'
      }],
      durationType: 'rounds',
      durationValue: 4,
      durationUnit: 'rounds'
    },
    tags: ['transformation', 'radiant', 'solara', 'level 7', 'titan']
  },
  {
    id: 'titan_lunara_blessing',
    name: 'Cadaverous Coffin',
    description: 'Requires Pale Tomb. Encase an ally in a massive cocoon of fossilized ribs, placing them in stasis and shielding them from all harm.',
    level: 7,
    spellType: 'ACTION',
    icon: 'Radiant/Divine Shield',
    typeConfig: {
      school: 'frost',
      icon: 'Radiant/Divine Shield',
      tags: ['buff', 'support', 'lunara', 'level 7', 'titan'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['ally']
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 2,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 2,
      mana: 28,
      classResource: { type: 'calcification', cost: 50 }
    },
    devotionRequired: 'Lunara',
    resolution: 'AUTOMATIC',
    effectTypes: ['buff'],
    buffConfig: {
      buffType: 'damageMitigation',
      effects: [{
        id: 'bone_coffin_stasis',
        name: 'Bone Coffin',
        description: 'Target ally gains 150 Temporary HP but is Stunned and cannot act or move for the duration.',
        mechanicsText: '150 Temp HP, target Stunned'
      }],
      durationType: 'rounds',
      durationValue: 2,
      durationUnit: 'rounds'
    },
    tags: ['buff', 'support', 'lunara', 'level 7', 'titan']
  },
  {
    id: 'titan_meteor_swarm',
    name: 'Starless Gravity Cataclysm',
    description: 'Requires Crushing Core. Pull three localized gravitational singularities from the sky, crushing skeletal frames in massive overlapping radii.',
    level: 7,
    spellType: 'ACTION',
    icon: 'Arcane/Missile Swarm',
    typeConfig: {
      school: 'force',
      icon: 'Arcane/Missile Swarm',
      tags: ['damage', 'force', 'aoe', 'astraeus', 'level 7', 'titan'],
      castTime: 2,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 80,
      aoeShape: 'circle',
      aoeParameters: { radius: 25 },
      targetRestrictions: ['enemy']
    },
    durationConfig: {
      durationType: 'instant'
    },
    resourceCost: {
      actionPoints: 3,
      mana: 30,
      classResource: { type: 'calcification', cost: 60 }
    },
    devotionRequired: 'Astraeus',
    resolution: 'DICE',
    effectTypes: ['damage'],
    damageConfig: {
      formula: '12d6',
      damageTypes: ['force'],
      resolution: 'DICE',
      savingThrow: { ability: 'agility', difficultyClass: 17, saveOutcome: 'half_damage' }
    },
    tags: ['damage', 'force', 'aoe', 'astraeus', 'level 7', 'titan']
  },

  // ─── LEVEL 8 SPELLS ───
  {
    id: 'titan_mountain_fortress',
    name: 'Stone-Suture Bulwark',
    description: 'Requires Fossilized Tomb. Petrify your lower limbs, anchoring your skeleton into the floor. You become an impassable stone wall shielding adjacent allies.',
    level: 8,
    spellType: 'ACTION',
    icon: 'Nature/Grasp',
    typeConfig: {
      school: 'bludgeoning',
      icon: 'Nature/Grasp',
      tags: ['buff', 'defense', 'terranox', 'level 8', 'titan'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      targetRestrictions: ['self']
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 3,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 2,
      mana: 30,
      classResource: { type: 'calcification', cost: 60 }
    },
    devotionRequired: 'Terranox',
    resolution: 'AUTOMATIC',
    effectTypes: ['buff'],
    buffConfig: {
      buffType: 'damageMitigation',
      effects: [{
        id: 'stone_bulwark',
        name: 'Bulwark Active',
        description: 'Gain +8 Armor. Adjacent allies gain 50% damage reduction from ranged attacks. Your movement speed is reduced to 0.',
        mechanicsText: '+8 Armor, speed 0, adjacent allies take half ranged damage'
      }],
      durationType: 'rounds',
      durationValue: 3,
      durationUnit: 'rounds'
    },
    tags: ['buff', 'defense', 'terranox', 'level 8', 'titan']
  },
  {
    id: 'titan_storm_lord',
    name: 'Flayed Bone-Shrapnel Cyclone',
    description: 'Requires Flayed Gale. Lacerate your muscles, ejecting your outer bone layers in a high-velocity, electrified cyclone of splinters.',
    level: 8,
    spellType: 'ACTION',
    icon: 'Nature/Thorn Spikes',
    typeConfig: {
      school: 'lightning',
      icon: 'Nature/Thorn Spikes',
      tags: ['damage', 'aoe', 'zephyra', 'level 8', 'titan'],
      castTime: 2,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'self_centered',
      aoeShape: 'circle',
      aoeParameters: { radius: 30 },
      targetRestrictions: ['enemy']
    },
    durationConfig: {
      durationType: 'instant'
    },
    resourceCost: {
      actionPoints: 3,
      mana: 32,
      classResource: { type: 'calcification', cost: 60 }
    },
    devotionRequired: 'Zephyra',
    resolution: 'DICE',
    effectTypes: ['damage'],
    damageConfig: {
      formula: '10d6 + strength',
      damageTypes: ['lightning'],
      resolution: 'DICE',
      savingThrow: { ability: 'agility', difficultyClass: 17, saveOutcome: 'half_damage' }
    },
    tags: ['damage', 'aoe', 'zephyra', 'level 8', 'titan']
  },
  {
    id: 'titan_celestial_judgment',
    name: 'Ossifying Rupture',
    description: 'Inject your hyper-dense marrow directly into an enemys bloodstream, rapidly calcifying their internal organs and blood vessels.',
    level: 8,
    spellType: 'ACTION',
    icon: 'Necrotic/Skull Burst',
    typeConfig: {
      school: 'necrotic',
      icon: 'Necrotic/Skull Burst',
      tags: ['damage', 'control', 'level 8', 'titan'],
      castTime: 1,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 45,
      targetRestrictions: ['enemy']
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 2,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 2,
      mana: 32,
      classResource: { type: 'calcification', cost: 40 }
    },
    resolution: 'DICE',
    effectTypes: ['damage', 'control'],
    damageConfig: {
      formula: '8d8',
      damageTypes: ['necrotic'],
      resolution: 'DICE',
      savingThrow: { ability: 'constitution', difficultyClass: 17, saveOutcome: 'half_damage' }
    },
    controlConfig: {
      controlType: 'incapacitation',
      effects: [{
        id: 'calcified_blood',
        name: 'Calcified Blood',
        description: 'Enemy speed is reduced to 0 due to internal petrification.'
      }],
      duration: 2,
      durationUnit: 'rounds'
    },
    tags: ['damage', 'control', 'level 8', 'titan']
  },

  // ─── LEVEL 9 SPELLS ───
  {
    id: 'titan_celestial_avatar',
    name: 'Crematorium Engine',
    description: 'Requires Marrow-Burn. Ignite your bone reserves entirely, emitting an agonizing, continuous heatwave that cooks nearby foes alive.',
    level: 9,
    spellType: 'ACTION',
    icon: 'Fire/Fiery Symbol',
    typeConfig: {
      school: 'radiant',
      icon: 'Fire/Fiery Symbol',
      tags: ['damage', 'aoe', 'solara', 'level 9', 'titan'],
      castTime: 2,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'self_centered',
      aoeShape: 'circle',
      aoeParameters: { radius: 30 },
      targetRestrictions: ['enemy']
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 3,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 3,
      mana: 35,
      classResource: { type: 'calcification', cost: 70 }
    },
    devotionRequired: 'Solara',
    resolution: 'DICE',
    effectTypes: ['damage'],
    damageConfig: {
      formula: '4d6',
      damageTypes: ['radiant'],
      resolution: 'DICE',
      dotConfig: {
        enabled: true,
        damagePerTick: '4d6',
        damageType: 'radiant',
        tickFrequency: 'round',
        duration: 3,
        canStack: false,
        maxStacks: 1
      }
    },
    tags: ['damage', 'aoe', 'solara', 'level 9', 'titan']
  },
  {
    id: 'titan_celestial_bombardment',
    name: 'Gravitational Singularity Collapse',
    description: 'Requires Crushing Core. Erupt a collapsing spatial void. Drags all creatures in a massive radius inward, snapping bones like twigs.',
    level: 9,
    spellType: 'ACTION',
    icon: 'Arcane/Magical Explosion',
    typeConfig: {
      school: 'force',
      icon: 'Arcane/Magical Explosion',
      tags: ['damage', 'aoe', 'astraeus', 'level 9', 'titan'],
      castTime: 2,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 120,
      aoeShape: 'circle',
      aoeParameters: { radius: 35 },
      targetRestrictions: ['enemy']
    },
    durationConfig: {
      durationType: 'instant'
    },
    resourceCost: {
      actionPoints: 3,
      mana: 38,
      classResource: { type: 'calcification', cost: 80 }
    },
    devotionRequired: 'Astraeus',
    resolution: 'DICE',
    effectTypes: ['damage'],
    damageConfig: {
      formula: '14d6',
      damageTypes: ['force'],
      resolution: 'DICE',
      savingThrow: { ability: 'strength', difficultyClass: 18, saveOutcome: 'half_damage' }
    },
    tags: ['damage', 'aoe', 'astraeus', 'level 9', 'titan']
  },
  {
    id: 'titan_divine_protection',
    name: 'Sutured Ossuary Shield',
    description: 'Requires Pale Tomb. Shatter your own ribcage to form a sympathetic bone-mesh. You absorb 50% of all damage dealt to your allies, converting it into Mass.',
    level: 9,
    spellType: 'ACTION',
    icon: 'Radiant/Divine Shield',
    typeConfig: {
      school: 'force',
      icon: 'Radiant/Divine Shield',
      tags: ['buff', 'support', 'lunara', 'level 9', 'titan'],
      castTime: 2,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'self_centered',
      aoeShape: 'circle',
      aoeParameters: { radius: 40 },
      targetRestrictions: ['ally']
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 3,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 2,
      mana: 35,
      classResource: { type: 'calcification', gain: 50 }
    },
    devotionRequired: 'Lunara',
    resolution: 'AUTOMATIC',
    effectTypes: ['buff'],
    buffConfig: {
      buffType: 'damageMitigation',
      effects: [{
        id: 'ossuary_stitch',
        name: 'Ossuary Stitch',
        description: 'You take 50% of all damage dealt to allies within 40 ft. Converts damage taken into Calcification.',
        mechanicsText: '50% damage transfer to caster'
      }],
      durationType: 'rounds',
      durationValue: 3,
      durationUnit: 'rounds'
    },
    tags: ['buff', 'support', 'lunara', 'level 9', 'titan']
  },
  {
    id: 'titan_celestial_fusion',
    name: 'Terminal Inertia Singularity',
    description: 'Anchor yourself deep into gravity itself. Generate immense physical immunity and force all enemies to drag themselves toward your massive core.',
    level: 9,
    spellType: 'ACTION',
    icon: 'Force/Force Field',
    typeConfig: {
      school: 'force',
      icon: 'Force/Force Field',
      tags: ['buff', 'control', 'level 9', 'titan'],
      castTime: 2,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'self_centered',
      aoeShape: 'circle',
      aoeParameters: { radius: 40 },
      targetRestrictions: ['enemy']
    },
    durationConfig: {
      durationType: 'rounds',
      durationValue: 2,
      durationUnit: 'rounds'
    },
    resourceCost: {
      actionPoints: 3,
      mana: 40,
      classResource: { type: 'calcification', cost: 80 }
    },
    resolution: 'AUTOMATIC',
    effectTypes: ['buff', 'control'],
    buffConfig: {
      buffType: 'damageMitigation',
      effects: [{
        id: 'inertia_singularity',
        name: 'Gravitational Anchor',
        description: 'Gain 100 Temporary HP and immunity to physical bludgeoning/piercing/slashing damage. Speed is locked at 0 ft.',
        mechanicsText: '100 Temp HP, phys immunity, speed 0'
      }],
      durationType: 'rounds',
      durationValue: 2,
      durationUnit: 'rounds'
    },
    controlConfig: {
      controlType: 'forced_action',
      effects: [{
        id: 'singular_drag',
        name: 'Singularity Drag',
        description: 'Forces all nearby enemies to move towards you and attack you.'
      }]
    },
    tags: ['buff', 'control', 'level 9', 'titan']
  },

  // ─── LEVEL 10 SPELLS ───
  {
    id: 'titan_apocalypse',
    name: 'The Great Calcifying Death',
    description: 'The ultimate sacrifice. Force-calcify your entire body instantly, then detonate your entire skeletal mass in a blinding gravity wave. Reduces you to 1 HP.',
    level: 10,
    spellType: 'ACTION',
    icon: 'Arcane/Magical Explosion',
    typeConfig: {
      school: 'force',
      icon: 'Arcane/Magical Explosion',
      tags: ['damage', 'aoe', 'level 10', 'titan'],
      castTime: 3,
      castTimeType: 'IMMEDIATE'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'self_centered',
      aoeShape: 'circle',
      aoeParameters: { radius: 60 },
      targetRestrictions: ['enemy']
    },
    durationConfig: {
      durationType: 'instant'
    },
    resourceCost: {
      actionPoints: 3,
      mana: 50,
      classResource: { type: 'calcification', cost: 100 }
    },
    resolution: 'DICE',
    effectTypes: ['damage'],
    damageConfig: {
      formula: '18d10',
      damageTypes: ['force'],
      resolution: 'DICE',
      savingThrow: { ability: 'constitution', difficultyClass: 19, saveOutcome: 'half_damage' }
    },
    specialMechanics: {
      mutilation: {
        penalty: 'Your bones are entirely shattered. Your movement speed is reduced to 0 ft and you cannot act for 3 rounds.'
      }
    },
    tags: ['damage', 'aoe', 'level 10', 'titan']
  },
  {
    id: 'titan_celestial_rebirth',
    name: 'Marrow-Stitch Rebirth',
    description: 'Upon taking fatal damage, your skeleton violently snaps together, stitching your flesh back and releasing a devastating gravity shockwave.',
    level: 10,
    spellType: 'REACTION',
    icon: 'Radiant/Holy Light',
    typeConfig: {
      school: 'force',
      icon: 'Radiant/Holy Light',
      tags: ['healing', 'damage', 'reaction', 'level 10', 'titan'],
      castTime: 0,
      castTimeType: 'REACTION'
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
      actionPoints: 0,
      mana: 0,
      classResource: { type: 'calcification', gain: 100 }
    },
    resolution: 'DICE',
    effectTypes: ['healing', 'damage'],
    healingConfig: {
      formula: '100',
      healingType: 'direct',
      resolution: 'AUTOMATIC'
    },
    damageConfig: {
      formula: '10d8',
      damageTypes: ['force'],
      resolution: 'DICE'
    },
    tags: ['healing', 'damage', 'reaction', 'level 10', 'titan']
  },

      {
        "id": "titan_stone_grasp",
        "name": "Stone Grasp",
        "description": "Slam both palms into a steep rock cliff or packed earth wall. By forcing a hyper-accelerated calcification growth, you cause solid rock to temporarily form crude, solid handholds and footholds, letting you climb easily.",
        "level": 2,
        "spellType": "ACTION",
        "icon": "Utility/Earth Smash",
        "typeConfig": {
          "school": "earth",
          "icon": "Utility/Earth Smash",
          "tags": [
            "utility",
            "roleplay",
            "titan"
          ],
          "castTime": 1,
          "castTimeType": "IMMEDIATE"
        },
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "touch",
          "targetRestrictions": []
        },
        "resourceCost": {
          "actionPoints": 1,
          "resourceTypes": [
            "mana"
          ],
          "resourceValues": {
            "mana": 4
          },
          "components": [
            "somatic"
          ],
          "somaticText": "Slam both hands directly into the stone or earth, teeth grinding as the bones in your shoulders shift and crack"
        },
        "resolution": "NONE",
        "effectTypes": [
          "utility"
        ],
        "utilityConfig": {
          "utilityType": "environment",
          "selectedEffects": [
            {
              "id": "stone_grasp_holds",
              "name": "Bone-Stitched Handholds",
              "description": "Creates a 15-foot track of crude handholds on any stone or earth surface. Reduces the DC of all climbing checks in this track to 5."
            }
          ],
          "duration": 10,
          "durationUnit": "minutes",
          "concentration": false,
          "power": "minor"
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        },
        "tags": [
          "utility",
          "roleplay",
          "titan"
        ]
      }
];
