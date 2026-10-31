import {
  BLADEDANCER_TREE_META,
  BLADEDANCER_TREES,
  BLADEDANCER_TALENT_NODES,
  BLADEDANCER_PASSIVE_RECORDS,
  BLADEDANCER_TALENT_CAPACITY
} from '../talentTrees/bladedancer';

export { BLADEDANCER_PASSIVE_RECORDS, BLADEDANCER_TALENT_CAPACITY };

export const BLADEDANCER_CLASS_ID = 'bladedancer';
export const BLADEDANCER_RULESET_VERSION = 'cr-review-r1';
export const BLADEDANCER_ICON = 'fas fa-biohazard';
export const BLADEDANCER_MANUAL_NOTICE = 'Manual tabletop only. No automatic momentum building, tempo shifting, parry deflection, or damage.';

const flags = {
  classId: BLADEDANCER_CLASS_ID,
  rulesetVersion: BLADEDANCER_RULESET_VERSION,
  authoredOnly: true,
  manualOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualNotice: BLADEDANCER_MANUAL_NOTICE
};

const instant = { durationType: 'instant', durationValue: 0, durationUnit: 'instant' };
const roundDuration = (rounds = 1) => ({ durationType: 'rounds', durationValue: rounds, durationUnit: 'rounds' });
const selfTarget = { targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 };
const target = (roles, maxTargets = 1, rangeDistance = 5) => ({
  targetingType: maxTargets > 1 ? 'multi' : 'single',
  rangeType: rangeDistance <= 5 ? 'melee' : 'ranged',
  rangeDistance,
  targetRestrictions: roles,
  maxTargets
});
const enemy = (n = 1, feet = 5) => target(['enemy'], n, feet);
const ally = (n = 1, feet = 15) => target(['ally', 'self'], n, feet);
const area = (feet = 15) => ({
  targetingType: 'area',
  rangeType: 'ranged',
  rangeDistance: 30,
  targetRestrictions: ['area'],
  maxTargets: 1,
  areaRadius: feet
});

const apCost = (actionPoints, momentum = 0) => ({
  actionPoints,
  mana: 0,
  momentum,
  resourceTypes: actionPoints > 0 ? ['actionPoints'] : [],
  resourceValues: { actionPoints, mana: 0, momentum },
  useFormulas: {},
  components: ['somatic'],
  somaticText: 'Execute rapid blade flourish and shifting footwork.'
});

const damage = (formula, damageTypes = ['slashing']) => ({ formula, damageTypes, resolution: 'DICE' });
const cooldownNone = { cooldownType: 'turn_based', cooldownValue: 0 };
const cooldownEncounter = { cooldownType: 'encounter', cooldownValue: 1 };
const effect = (kind, args, description) => ({ kind, args, description, executable: false });

export const BLADEDANCER_COMMON_MECHANICS = {
  price: 'AP and Kinetic Momentum are explicit. Momentum builds from strikes and parries; decays out of combat.',
  momentum: 'Kinetic Momentum scales from 0 to 10. Tiers: Adagio (0-2), Andante (3-5), Allegro (6-8), Presto (9-10).',
  motifs: 'Kinetic flow-state, twin finesse blades, agile footwork, and acrobatic parry-ripostes.',
  dueling: 'Relentless combination strikes and tempo manipulation without automated scripting.',
  inclusivity: 'Open to all lineages and martial backgrounds without rigid heritage restrictions.'
};

export const BLADEDANCER_CORE_RECORDS = [
  {
    ...flags,
    id: 'cr1_bladedancer_kinetic_strike',
    name: 'Kinetic Strike',
    level: 1,
    specialization: null,
    treeId: null,
    source: 'core',
    spellType: 'ACTION',
    icon: BLADEDANCER_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'resource_generation'],
    damageConfig: damage('1d8 + agility', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Strike with a light finesse blade. Deal 1d8 + Agility slashing or piercing damage and generate +1 Kinetic Momentum.',
    classResourceProgram: null,
    manualMechanics: {
      price: { actionPoints: 1, mana: 0, momentum: 0 },
      effects: [effect('momentum.generate', { amount: 1 }, 'Gain +1 Kinetic Momentum on hit.')],
      executable: false
    },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'cr1_bladedancer_fluid_pivot',
    name: 'Fluid Pivot',
    level: 1,
    specialization: null,
    treeId: null,
    source: 'core',
    spellType: 'ACTION',
    icon: BLADEDANCER_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['buff', 'mobility'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Shift footwork smoothly, moving up to 10 ft without provoking opportunity attacks. Gain +2 AC against melee strikes until the start of your next turn.',
    classResourceProgram: null,
    manualMechanics: {
      price: { actionPoints: 1, mana: 0, momentum: 0 },
      effects: [effect('defense.ac_bonus', { amount: 2 }, '+2 AC and free 10 ft reposition.')],
      executable: false
    },
    sourceRefs: ['Bladedancer Content Lock']
  }
];

export const BLADEDANCER_OPTIONAL_POOL = [
  // LEVEL 1 (2 non-damage, 2 damage)
  {
    ...flags,
    id: 'bd_whirling_parry',
    name: 'Whirling Parry',
    level: 1,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'REACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(0, 0),
    targetingConfig: selfTarget,
    effectTypes: ['defense', 'buff'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: 'WHEN_ATTACKED_MELEE',
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Reaction to being hit by a melee attack: deflect the blow, reducing damage taken by 1d10 + Agility and gaining +1 Kinetic Momentum.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 0, momentum: 0 }, effects: [effect('parry.deflect', {}, 'Reduce damage and gain +1 Momentum.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_feint_step',
    name: 'Feint Step',
    level: 1,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Footprints',
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 5),
    effectTypes: ['debuff'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Feint an incoming strike to throw target off balance. Target suffers -2 AC against your next attack this turn.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('debuff.ac_penalty', { amount: 2 }, 'Target suffers -2 AC.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_twin_laceration',
    name: 'Twin Laceration',
    level: 1,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Double Slash',
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage'],
    damageConfig: damage('2d6 + agility', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Strike rapidly with both main and offhand blades in a cross-slash, dealing 2d6 + Agility slashing damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('damage.dual_strike', {}, 'Twin blade damage.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_springing_leap',
    name: 'Springing Leap',
    level: 1,
    specialization: 'shadowdancer',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Acrobatic Leap',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['mobility', 'buff'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Leap up to 15 ft over obstacles or enemies, landing with advantage on your next melee attack this turn.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('mobility.leap', { feet: 15 }, 'Leap 15 ft with advantage on next attack.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },

  // LEVEL 2
  {
    ...flags,
    id: 'bd_momentum_dash',
    name: 'Momentum Dash',
    level: 2,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Charge',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['mobility'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Dash up to 30 ft in a straight line, disengaging from all adjacent enemies.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('mobility.dash', { feet: 30 }, 'Dash 30 ft without opportunity attacks.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_arterial_cut',
    name: 'Arterial Cut',
    level: 2,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Bloody Slash',
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'dot'],
    damageConfig: damage('1d8 + agility', ['slashing']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: ['bleeding'],
    area: null,
    description: 'Slice across a major artery. Deal 1d8 + Agility slashing damage and cause target to bleed for 1d4 physical damage at start of their turn for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('dot.bleed', { damage: '1d4', rounds: 2 }, 'Bleed damage.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_defensive_flourish',
    name: 'Defensive Flourish',
    level: 2,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Parry',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['buff', 'defense'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spin your blades in an impenetrable defensive pattern, granting +3 AC against all melee attacks for 1 round.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('defense.ac_boost', { amount: 3 }, '+3 AC against melee.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_sweeping_cleave',
    name: 'Sweeping Cleave',
    level: 2,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Whirlwind Slash',
    resourceCost: apCost(2, 0),
    targetingConfig: enemy(3, 5),
    effectTypes: ['damage'],
    damageConfig: damage('2d6 + agility', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Sweep your weapon in a 180-degree arc, dealing 2d6 + Agility slashing damage to up to 3 adjacent foes.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, momentum: 0 }, effects: [effect('damage.cleave', {}, 'Cleave up to 3 foes.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },

  // LEVEL 3
  {
    ...flags,
    id: 'bd_cross_parry',
    name: 'Cross Parry',
    level: 3,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'REACTION',
    icon: 'Utility/Cross Blades',
    resourceCost: apCost(0, 1),
    targetingConfig: enemy(1, 5),
    effectTypes: ['defense', 'damage'],
    damageConfig: damage('1d8 + agility', ['piercing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: 'WHEN_ATTACKED_MELEE',
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 1 Momentum on being targeted by melee attack. Lock target blades and immediately strike back for 1d8 + Agility piercing damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 0, momentum: 1 }, effects: [effect('parry.riposte', {}, 'Parry and riposte.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_flow_surge',
    name: 'Flow Surge',
    level: 3,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Aura',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['resource_generation', 'buff'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Focus breathing and rhythmic cadence. Immediately generate +3 Kinetic Momentum.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('momentum.surge', { amount: 3 }, 'Generate +3 Momentum.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_blade_flurry',
    name: 'Blade Flurry',
    level: 3,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Triple Strike',
    resourceCost: apCost(2, 0),
    targetingConfig: enemy(3, 5),
    effectTypes: ['damage'],
    damageConfig: damage('3d6 + agility', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Unleash three rapid strikes for 1d6 damage each, distributing them among up to 3 adjacent targets.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, momentum: 0 }, effects: [effect('damage.flurry', {}, 'Three rapid strikes.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_acrobatic_vault',
    name: 'Acrobatic Vault',
    level: 3,
    specialization: 'shadowdancer',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Vault',
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 5),
    effectTypes: ['mobility', 'debuff'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Vault directly over an enemy shoulders to place yourself in their rear flank. The target cannot make opportunity attacks against you for 1 round.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('mobility.vault', {}, 'Vault behind target.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },

  // LEVEL 4
  {
    ...flags,
    id: 'bd_severing_thrust',
    name: 'Severing Thrust',
    level: 4,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Piercing/Deep Pierce',
    resourceCost: apCost(1, 2),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage'],
    damageConfig: damage('2d10 + agility', ['piercing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 2 Momentum to drive your blade through armor gaps, dealing 2d10 + Agility piercing damage and ignoring target physical armor.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 2 }, effects: [effect('damage.armor_pierce', {}, 'Ignore physical armor.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_blurred_visage',
    name: 'Blurred Visage',
    level: 4,
    specialization: 'shadowdancer',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Blur',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['buff', 'defense'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Move with dizzying speed, blurring your outline. Attacks against you suffer a 20% miss chance for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('defense.blur', { missChance: 20 }, '20% concealment.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_counter_riposte',
    name: 'Counter Riposte',
    level: 4,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'REACTION',
    icon: 'General/Combat Counter',
    resourceCost: apCost(0, 0),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage'],
    damageConfig: damage('1d8 + agility', ['piercing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: 'WHEN_ENEMY_MISSES',
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Reaction when an enemy misses you with a melee attack: punish their overextension, striking for 1d8 + Agility piercing damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 0, momentum: 0 }, effects: [effect('damage.riposte', {}, 'Counter-attack on miss.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_tactical_disengage',
    name: 'Tactical Disengage',
    level: 4,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Retreat',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['mobility'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Withdraw up to 20 ft without provoking opportunity attacks. If you are in Allegro or Presto tempo, refund 1 AP.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('mobility.disengage', { feet: 20 }, 'Disengage with possible AP refund.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },

  // LEVEL 5
  {
    ...flags,
    id: 'bd_cyclone_slash',
    name: 'Cyclone Slash',
    level: 5,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Whirlwind Slash',
    resourceCost: apCost(2, 3),
    targetingConfig: area(10),
    effectTypes: ['damage', 'displacement'],
    damageConfig: damage('3d8 + agility', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 10 },
    description: 'Spend 3 Momentum to whirl blades violently, dealing 3d8 + Agility slashing damage to all enemies within 10 ft and pushing them 5 ft back.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, momentum: 3 }, effects: [effect('damage.whirlwind', {}, 'Cyclone damage and push.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_tempo_shift',
    name: 'Tempo Shift',
    level: 5,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Speed',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Immediately elevate your combat tempo to Allegro (minimum 6 Momentum). Gain +10 ft movement speed and +1 to all attack rolls for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('buff.tempo', {}, 'Shift tempo to Allegro.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_posture_crush',
    name: 'Posture Crush',
    level: 5,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(2, 0),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('2d8 + strength', ['bludgeoning']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'strength', dcFormula: '10 + agility' },
    conditions: ['prone'],
    area: null,
    description: 'Smash weapon hilt into the opponent center of mass, dealing 2d8 damage and knocking target prone on failed Strength save.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, momentum: 0 }, effects: [effect('crowd_control.knockdown', {}, 'Knock prone.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_steel_focus',
    name: 'Steel Focus',
    level: 5,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Cleanse',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Cleanse 1 slow, bleed, or physical impairment from yourself and gain +2 to all saving throws for 1 round.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('cleanse.impairment', {}, 'Cleanse condition and gain +2 saves.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },

  // LEVEL 6
  {
    ...flags,
    id: 'bd_phantom_flurry',
    name: 'Phantom Flurry',
    level: 6,
    specialization: 'shadowdancer',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Triple Strike',
    resourceCost: apCost(2, 4),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage'],
    damageConfig: damage('4d8 + agility', ['slashing', 'force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 4 Momentum to strike 4 times in rapid blurred succession against a single foe, dealing 4d8 total slashing and force damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, momentum: 4 }, effects: [effect('damage.phantom_flurry', {}, '4 rapid strikes.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_wind_step',
    name: 'Wind Step',
    level: 6,
    specialization: 'shadowdancer',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Footprints',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['mobility'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Step on air currents up to 30 ft, ignoring ground hazards, elevation penalties, and pit obstacles.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('mobility.wind_step', { feet: 30 }, 'Aerial step.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_disarming_flourish',
    name: 'Disarming Flourish',
    level: 6,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Parry',
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'debuff'],
    damageConfig: damage('1d6 + agility', ['piercing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'strength', dcFormula: '10 + agility' },
    conditions: [],
    area: null,
    description: 'Twist blade around the target guard, dealing 1d6 damage and forcing them to drop their primary weapon on a failed Strength save.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('debuff.disarm', {}, 'Disarm weapon.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_iron_poise',
    name: 'Iron Poise',
    level: 6,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'REACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(0, 0),
    targetingConfig: selfTarget,
    effectTypes: ['defense'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: 'WHEN_DISPLACED_OR_PRONE',
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Reaction to forced movement, shove, or knockdown: anchor your stance instantly, negating the displacement and remaining upright.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 0, momentum: 0 }, effects: [effect('defense.anchor', {}, 'Negate displacement.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },

  // LEVEL 7
  {
    ...flags,
    id: 'bd_arterial_tempest',
    name: 'Arterial Tempest',
    level: 7,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Bloody Slash',
    resourceCost: apCost(2, 5),
    targetingConfig: area(15),
    effectTypes: ['damage', 'dot'],
    damageConfig: damage('4d6 + agility', ['slashing']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: ['bleeding'],
    area: { radius: 15 },
    description: 'Spend 5 Momentum to carve through all foes in a 15 ft cone, dealing 4d6 slashing damage and inflicting 2d4 bleed damage for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, momentum: 5 }, effects: [effect('damage.cone_bleed', {}, 'Cone bleed damage.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_mirror_evasion',
    name: 'Mirror Evasion',
    level: 7,
    specialization: 'shadowdancer',
    source: 'optional',
    spellType: 'REACTION',
    icon: 'Utility/Illusion',
    resourceCost: apCost(0, 2),
    targetingConfig: selfTarget,
    effectTypes: ['defense'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: 'WHEN_HIT',
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 2 Momentum when hit by an attack to completely negate the hit, leaving behind a shattered mirror afterimage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 0, momentum: 2 }, effects: [effect('defense.negate_hit', {}, 'Negate incoming hit.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_severing_gale',
    name: 'Severing Gale',
    level: 7,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Air Blade',
    resourceCost: apCost(2, 0),
    targetingConfig: enemy(3, 30),
    effectTypes: ['damage'],
    damageConfig: damage('3d8 + agility', ['force', 'slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Slash so forcefully that air pressure forms a scything blade, dealing 3d8 damage in a 30 ft straight line.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, momentum: 0 }, effects: [effect('damage.line_projectile', {}, 'Air blade projectile.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_presto_focus',
    name: 'Presto Focus',
    level: 7,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Speed',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Lock directly into Presto tempo (9+ Momentum) for 2 rounds. Gain +15 ft movement speed, +2 to melee attacks, and ignore movement hindrances.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('buff.presto', {}, 'Max tempo state.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },

  // LEVEL 8
  {
    ...flags,
    id: 'bd_blade_vortex',
    name: 'Blade Vortex',
    level: 8,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Whirlwind Slash',
    resourceCost: apCost(3, 6),
    targetingConfig: area(15),
    effectTypes: ['damage'],
    damageConfig: damage('5d8 + agility', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 6 Momentum to become a vortex of flashing steel, dealing 5d8 + Agility slashing damage to every foe within 15 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, momentum: 6 }, effects: [effect('damage.vortex', {}, 'Vortex of steel.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_kinetic_redirection',
    name: 'Kinetic Redirection',
    level: 8,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'REACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(0, 3),
    targetingConfig: selfTarget,
    effectTypes: ['defense', 'mobility'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: 'WHEN_TARGETED_RANGED',
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 3 Momentum to catch or deflect an incoming projectile or spell attack, negating its damage and sliding up to 10 ft into cover.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 0, momentum: 3 }, effects: [effect('reaction.deflect', { slide: 10 }, 'Negate hit and slide 10 ft.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_executing_lunge',
    name: 'Executing Lunge',
    level: 8,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Charge',
    resourceCost: apCost(2, 4),
    targetingConfig: enemy(1, 25),
    effectTypes: ['damage', 'mobility'],
    damageConfig: damage('4d10 + agility', ['piercing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 4 Momentum to lunge 25 ft directly at an enemy and deliver an execution thrust for 4d10 + Agility piercing damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, momentum: 4 }, effects: [effect('damage.execute_lunge', {}, 'Lunge execution.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_unbroken_grace',
    name: 'Unbroken Grace',
    level: 8,
    specialization: 'shadowdancer',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Aura',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Attune completely to your body kinetic momentum. For 2 rounds, you are immune to stun, paralyze, root, and slow effects.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('buff.immunity', {}, 'Immune to crowd control.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },

  // LEVEL 9
  {
    ...flags,
    id: 'bd_dance_of_ruin',
    name: 'Dance of Ruin',
    level: 9,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Triple Strike',
    resourceCost: apCost(3, 7),
    targetingConfig: enemy(5, 10),
    effectTypes: ['damage'],
    damageConfig: damage('2d10 + agility', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 7 Momentum to dash between up to 5 different enemies within 10 ft of each other, dealing 2d10 + Agility slashing damage to each.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, momentum: 7 }, effects: [effect('damage.dance_ruin', {}, 'Strike 5 foes.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_slipstream_stride',
    name: 'Slipstream Stride',
    level: 9,
    specialization: 'shadowdancer',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Speed',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['mobility'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Move up to 60 ft as a blurred slipstream. You can pass through hostile creature spaces and cannot be targeted during movement.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('mobility.slipstream', { feet: 60 }, '60 ft phase dash.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_shattering_riposte',
    name: 'Shattering Riposte',
    level: 9,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'REACTION',
    icon: 'Utility/Parry',
    resourceCost: apCost(0, 4),
    targetingConfig: enemy(1, 5),
    effectTypes: ['defense', 'damage', 'debuff'],
    damageConfig: damage('3d10 + agility', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: 'WHEN_ATTACKED_MELEE',
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 4 Momentum to parry a strike, completely shattering the enemy guard. Deal 3d10 slashing damage and reduce target AC by 4 for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 0, momentum: 4 }, effects: [effect('parry.shatter', {}, 'Shatter guard.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_hyper_kinetic_flow',
    name: 'Hyper-Kinetic Flow',
    level: 9,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Aura',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Push your nervous system into overdrive. For 2 rounds, all weapon strikes generate double Momentum and critical hit multiplier is increased by 1.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 0 }, effects: [effect('buff.hyper_flow', {}, 'Double momentum generation.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },

  // LEVEL 10
  {
    ...flags,
    id: 'bd_grand_crescendo',
    name: 'Grand Crescendo',
    level: 10,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Whirlwind Slash',
    resourceCost: apCost(3, 10),
    targetingConfig: area(20),
    effectTypes: ['damage'],
    damageConfig: damage('8d10 + agility', ['slashing', 'force']),
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Discharge all 10 Momentum points in an earth-shattering kinetic maelstrom, dealing 8d10 slashing and force damage to all enemies within 20 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, momentum: 10 }, effects: [effect('damage.grand_crescendo', {}, 'Max momentum burst.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_eternal_cadence',
    name: 'Eternal Cadence',
    level: 10,
    specialization: 'flowmaster',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Time Warp',
    resourceCost: apCost(2, 8),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 8 Momentum to enter timeless martial transcendence. Take an immediate extra action this turn and gain +4 AC for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, momentum: 8 }, effects: [effect('buff.extra_action', {}, 'Extra action and +4 AC.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_final_severance',
    name: 'Final Severance',
    level: 10,
    specialization: 'duelist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Bloody Slash',
    resourceCost: apCost(2, 8),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage'],
    damageConfig: damage('6d12 + agility', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'constitution', dcFormula: '10 + agility' },
    conditions: [],
    area: null,
    description: 'Spend 8 Momentum to execute a singular mortal strike. Deal 6d12 slashing damage; if the target has 50 HP or less after the strike, they must succeed on a Con save or die instantly.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, momentum: 8 }, effects: [effect('damage.execution', {}, '6d12 and possible execute.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_apex_evasion',
    name: 'Apex Evasion',
    level: 10,
    specialization: 'shadowdancer',
    source: 'optional',
    spellType: 'REACTION',
    icon: 'Utility/Illusion',
    resourceCost: apCost(0, 6),
    targetingConfig: selfTarget,
    effectTypes: ['defense'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownEncounter,
    reactionTiming: 'WHEN_ATTACKED',
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 6 Momentum in response to any attack or area effect: slip completely out of the strike trajectory. You cannot be hit or affected until the start of your next turn.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 0, momentum: 6 }, effects: [effect('defense.invulnerable_round', {}, 'Complete evasion for 1 round.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  }
];

export const BLADEDANCER_SIGNATURE_RECORDS = [
  {
    ...flags,
    id: 'bd_sig_cyclone_pivot',
    name: 'Cyclone Pivot',
    level: 3,
    specialization: 'flowmaster',
    treeId: 'flowmaster',
    source: 'signature',
    spellType: 'ACTION',
    icon: 'Slashing/Whirlwind Slash',
    resourceCost: apCost(1, 2),
    targetingConfig: area(5),
    effectTypes: ['damage', 'mobility'],
    damageConfig: damage('2d8 + agility', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 5 },
    description: 'Spin 360 degrees while repositioning 10 ft. Deal 2d8 + Agility slashing damage to all adjacent enemies without provoking opportunity attacks.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 2 }, effects: [effect('signature.cyclone_pivot', {}, 'Whirlwind slash with reposition.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_sig_riposte_flourish',
    name: 'Riposte Flourish',
    level: 3,
    specialization: 'duelist',
    treeId: 'duelist',
    source: 'signature',
    spellType: 'REACTION',
    icon: 'Utility/Parry',
    resourceCost: apCost(0, 1),
    targetingConfig: enemy(1, 5),
    effectTypes: ['defense', 'damage'],
    damageConfig: damage('2d6 + agility', ['piercing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: 'WHEN_ATTACKED_MELEE',
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Parry an incoming melee strike, reducing incoming damage by 15 and riposting with a lightning-fast counter-thrust for 2d6 + Agility piercing damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 0, momentum: 1 }, effects: [effect('signature.riposte_flourish', {}, 'Parry 15 dmg and counter-strike.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_sig_phantom_step',
    name: 'Phantom Step',
    level: 3,
    specialization: 'shadowdancer',
    treeId: 'shadowdancer',
    source: 'signature',
    spellType: 'ACTION',
    icon: 'Utility/Footprints',
    resourceCost: apCost(1, 2),
    targetingConfig: selfTarget,
    effectTypes: ['mobility', 'buff'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Teleport up to 20 ft through shadows to flank an enemy. Gain advantage on your next melee attack this turn.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, momentum: 2 }, effects: [effect('signature.phantom_step', { feet: 20 }, '20 ft shadow teleport with advantage.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  }
];

export const BLADEDANCER_CAPSTONE_RECORDS = [
  {
    ...flags,
    id: 'bd_cap_infinite_cadence',
    name: 'Infinite Cadence',
    level: 10,
    specialization: 'flowmaster',
    treeId: 'flowmaster',
    source: 'capstone',
    spellType: 'ACTION',
    icon: 'Utility/Aura',
    resourceCost: apCost(2, 5),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Enter an unbroken cadence of kinetic motion for 3 rounds. Once per round, your successful melee attacks refund 1 AP.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, momentum: 5 }, effects: [effect('capstone.infinite_cadence', {}, 'AP refund on hit for 3 rounds.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_cap_severing_tempo',
    name: 'Severing Tempo',
    level: 10,
    specialization: 'duelist',
    treeId: 'duelist',
    source: 'capstone',
    spellType: 'ACTION',
    icon: 'Slashing/Bloody Slash',
    resourceCost: apCost(2, 6),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'dot'],
    damageConfig: damage('4d12 + agility', ['piercing']),
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: ['bleeding'],
    area: null,
    description: 'A lethal surgical strike dealing 4d12 + Agility piercing damage and inflicting a severe arterial bleed of 2d8 damage per round for 3 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, momentum: 6 }, effects: [effect('capstone.severing_tempo', {}, '4d12 + 2d8 bleed per round.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  },
  {
    ...flags,
    id: 'bd_cap_dance_of_a_thousand_edges',
    name: 'Dance of a Thousand Edges',
    level: 10,
    specialization: 'shadowdancer',
    treeId: 'shadowdancer',
    source: 'capstone',
    spellType: 'ACTION',
    icon: 'Slashing/Triple Strike',
    resourceCost: apCost(3, 8),
    targetingConfig: area(30),
    effectTypes: ['damage'],
    damageConfig: damage('6d10 + agility', ['slashing', 'force']),
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Unleash six phantom blade afterimages that slash across the entire battlefield, dealing 6d10 total damage divided among all hostile creatures.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, momentum: 8 }, effects: [effect('capstone.thousand_edges', {}, 'Battlefield-wide phantom strikes.')], executable: false },
    sourceRefs: ['Bladedancer Content Lock']
  }
];

export const BLADEDANCER_TALENT_ACTIVE_RECORDS = [
  ...BLADEDANCER_SIGNATURE_RECORDS,
  ...BLADEDANCER_CAPSTONE_RECORDS
];

export const BLADEDANCER_ALL_RECORDS = [
  ...BLADEDANCER_CORE_RECORDS,
  ...BLADEDANCER_OPTIONAL_POOL,
  ...BLADEDANCER_TALENT_ACTIVE_RECORDS,
  ...BLADEDANCER_PASSIVE_RECORDS
];

export const BLADEDANCER_PROJECTED_SPELLS = BLADEDANCER_ALL_RECORDS;

export const BLADEDANCER_PROJECTED_SPELLS_BY_ID = Object.fromEntries(
  BLADEDANCER_PROJECTED_SPELLS.map(spell => [spell.id, spell])
);

export const BLADEDANCER_OPTIONAL_RECORDS = BLADEDANCER_OPTIONAL_POOL;

export const BLADEDANCER_SPELL_POOLS = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    return [level, BLADEDANCER_OPTIONAL_RECORDS.filter(spell => spell.level === level).map(spell => spell.id)];
  })
);

export const BLADEDANCER_PROGRESSION_POLICY = {
  classId: BLADEDANCER_CLASS_ID,
  maxLevel: 10,
  startingSpellPicks: 1,
  optionalPicksPerLevel: 1,
  allowEarlierUnchosen: true,
  grantedCoreSpellIds: BLADEDANCER_CORE_RECORDS.map(spell => spell.id),
  randomizeStartingSpells: false,
  autoTopUpOnLoad: false,
  talentActivesAreGrants: true,
  manualOnly: true
};

const bladedancerNodeById = Object.fromEntries(BLADEDANCER_TALENT_NODES.map(node => [node.id, node]));
const bladedancerTreePoints = (ranks, treeId) => BLADEDANCER_TALENT_NODES
  .filter(node => node.treeId === treeId)
  .reduce((total, node) => total + (ranks[node.id] || 0), 0);

export const pruneBladedancerTalents = (talents, characterLevel) => {
  const ranks = talents && typeof talents === 'object' ? { ...talents } : {};
  const level = Number.isInteger(characterLevel) ? Math.max(1, characterLevel) : 10;
  Object.keys(ranks).forEach(nodeId => {
    const node = bladedancerNodeById[nodeId];
    if (!node || !Number.isInteger(ranks[nodeId]) || ranks[nodeId] < 1 || ranks[nodeId] > node.maxRanks) {
      delete ranks[nodeId];
    }
  });

  const pruneStructure = () => {
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of BLADEDANCER_TALENT_NODES) {
        const rank = ranks[node.id];
        if (!rank) continue;
        const gatePoints = bladedancerTreePoints(ranks, node.treeId) - rank;
        const predecessorMissing = node.requires.some(predecessorId => {
          const predecessor = bladedancerNodeById[predecessorId];
          return !predecessor || (ranks[predecessorId] || 0) !== predecessor.maxRanks;
        });
        if (node.minLevel > level || gatePoints < node.requiresPoints || predecessorMissing) {
          delete ranks[node.id];
          changed = true;
        }
      }
    }
  };

  pruneStructure();
  const budget = Math.min(50, level * 5);
  let guard = 0;
  while (Object.values(ranks).reduce((total, rank) => total + rank, 0) > budget && guard < 200) {
    guard += 1;
    let target = null;
    BLADEDANCER_TALENT_NODES.forEach(node => {
      if (!ranks[node.id]) return;
      if (target === null || node.minLevel >= bladedancerNodeById[target].minLevel) target = node.id;
    });
    if (target === null) break;
    ranks[target] -= 1;
    if (ranks[target] === 0) delete ranks[target];
    pruneStructure();
  }
  return ranks;
};

export function validateBladedancerState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return { valid: false, errors: ['state must be an object'] };
  const momentum = Number(state.momentum ?? state.current ?? 0);
  if (!Number.isInteger(momentum) || momentum < 0 || momentum > 10) {
    errors.push('momentum must be an integer from 0 to 10');
  }
  return { valid: errors.length === 0, errors };
}

export const BLADEDANCER_DATA = {
  id: BLADEDANCER_CLASS_ID,
  name: 'Bladedancer',
  icon: BLADEDANCER_ICON,
  role: 'Damage',
  roleColor: '#e11d48',
  damageTypes: ['slashing', 'piercing', 'force'],
  resource: 'Kinetic Momentum',
  complexityRating: 3,
  cognitiveTags: ['Momentum Economy', 'Combo Chaining', 'Manual Tabletop'],
  playstyle: 'Flow between kinetic tempos, chain fluid strikes, parry incoming blows, and spend built momentum on devastating finishers. No automatic momentum building or automated combat scripting. Development — manual tabletop.',
  developmentStatus: 'development',
  manualOnly: true,
  overview: {
    title: 'The Bladedancer',
    subtitle: 'Kinetic Dervish of the Flowing Steel',
    illustration: '/assets/images/classes/bladedancer_illustration.png',
    illustrationCaption: 'An agile duelist channeling kinetic momentum through twin flashing blades.',
    originStory: 'The first bladedancers were wood-wardens and skirmishers of the Frostwood Reach who threw down heavy plate and shield to move with the speed of whipping ironwood branches. Synchronizing breath with combat tempo, they learned that speed is the only armor an agile warrior needs.',
    quickOverview: {
      title: 'Quick Overview',
      content: 'The Bladedancer builds Kinetic Momentum (0-10) through successful strikes and parries, moving through four tempos (Adagio, Andante, Allegro, Presto). Momentum is spent on multi-target flourishes, gap-closing lunges, and execution finishers. Manual tabletop tracking.'
    }
  },
  resourceSystem: {
    id: 'bladedancer_momentum',
    name: 'Kinetic Momentum',
    title: 'Kinetic Momentum',
    mechanic: 'Kinetic Momentum (0-10) built from strikes/parries and spent on flourishes'
  },
  specializations: {
    title: 'Three Kinetic Blade Disciplines',
    description: 'First investment chooses a primary martial tree. Five talent points per level, global cap fifty. Signatures require ten same-tree points at level three; capstones forty-five at level ten.',
    specs: [
      {
        id: 'flowmaster',
        name: 'Flow Master',
        icon: 'fas fa-wind',
        theme: 'Continuous momentum chaining, conserving kinetic energy, and flowing seamlessly through combative tempos.',
        description: 'Continuous momentum chaining, conserving kinetic energy, and flowing seamlessly through combative tempos.',
        playstyle: 'Sustained momentum chaining and high-speed tempo mobility.'
      },
      {
        id: 'duelist',
        name: 'Duelist',
        icon: 'fas fa-shield-alt',
        theme: 'Single-target parry-ripostes, posture breaking, blade-locking, and lethal arterial precision.',
        description: 'Single-target parry-ripostes, posture breaking, blade-locking, and lethal arterial precision.',
        playstyle: 'Precise counter-attacks, parry reactions, and critical finishers.'
      },
      {
        id: 'shadowdancer',
        name: 'Shadow Dancer',
        icon: 'fas fa-shoe-prints',
        theme: 'Acrobatic repositioning, blurred footwork, striking from blind spots, and elusive evasive maneuvers.',
        description: 'Acrobatic repositioning, blurred footwork, striking from blind spots, and elusive evasive maneuvers.',
        playstyle: 'Flanking strikes, shadowy evasion, and evasive displacement.'
      }
    ]
  },
  classFeatures: [
    {
      level: 1,
      name: 'Kinetic Flow & Momentum',
      description: 'Track Kinetic Momentum from 0 to 10 across four distinct tempos. Build momentum through melee strikes and defensive parries; spend momentum on powerful flourishes.'
    },
    {
      level: 1,
      name: 'Core Martial Grants',
      description: 'Gain Kinetic Strike and Fluid Pivot as permanent baseline abilities that do not consume optional spell picks.'
    }
  ],
  spells: BLADEDANCER_PROJECTED_SPELLS,
  exampleSpells: BLADEDANCER_PROJECTED_SPELLS,
  optionalSpellsByLevel: BLADEDANCER_SPELL_POOLS,
  spellPools: BLADEDANCER_SPELL_POOLS,
  talentTrees: BLADEDANCER_TREES,
  progression: {
    policy: BLADEDANCER_PROGRESSION_POLICY,
    spellPools: BLADEDANCER_SPELL_POOLS,
    ...BLADEDANCER_PROGRESSION_POLICY
  }
};
