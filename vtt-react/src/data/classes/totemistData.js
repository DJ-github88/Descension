import {
  TOTEMIST_TREE_META,
  TOTEMIST_TREES,
  TOTEMIST_TALENT_NODES,
  TOTEMIST_PASSIVE_RECORDS,
  TOTEMIST_TALENT_CAPACITY
} from '../talentTrees/totemist';

export { TOTEMIST_PASSIVE_RECORDS, TOTEMIST_TALENT_CAPACITY };

export const TOTEMIST_CLASS_ID = 'totemist';
export const TOTEMIST_RULESET_VERSION = 'cr-review-r1';
export const TOTEMIST_ICON = 'fas fa-monument';
export const TOTEMIST_MANUAL_NOTICE = 'Manual tabletop only. No automatic totem placement, attunement building, aura pulse, or damage.';

const flags = {
  classId: TOTEMIST_CLASS_ID,
  rulesetVersion: TOTEMIST_RULESET_VERSION,
  authoredOnly: true,
  manualOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualNotice: TOTEMIST_MANUAL_NOTICE
};

const instant = { durationType: 'instant', durationValue: 0, durationUnit: 'instant' };
const roundDuration = (rounds = 1) => ({ durationType: 'rounds', durationValue: rounds, durationUnit: 'rounds' });
const hourDuration = (hours = 1) => ({ durationType: 'hours', durationValue: hours, durationUnit: 'hours' });
const selfTarget = { targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 };
const target = (roles, maxTargets = 1, rangeDistance = 5) => ({
  targetingType: maxTargets > 1 ? 'multi' : 'single',
  rangeType: rangeDistance <= 5 ? 'melee' : 'ranged',
  rangeDistance,
  targetRestrictions: roles,
  maxTargets
});
const enemy = (n = 1, feet = 30) => target(['enemy'], n, feet);
const ally = (n = 1, feet = 30) => target(['ally', 'self'], n, feet);
const area = (feet = 15) => ({
  targetingType: 'area',
  rangeType: 'ranged',
  rangeDistance: 30,
  targetRestrictions: ['area'],
  maxTargets: 1,
  areaRadius: feet
});

const apCost = (actionPoints, attunement = 0) => ({
  actionPoints,
  mana: 0,
  totemicAttunement: attunement,
  resourceTypes: actionPoints > 0 ? ['actionPoints'] : [],
  resourceValues: { actionPoints, mana: 0, totemicAttunement: attunement },
  useFormulas: {},
  components: ['somatic', 'material'],
  somaticText: 'Plant or attune carved stone conduit pylon into the ground.'
});

const damage = (formula, damageTypes = ['smashing']) => ({ formula, damageTypes, resolution: 'DICE' });
const cooldownNone = { cooldownType: 'turn_based', cooldownValue: 0 };
const cooldownEncounter = { cooldownType: 'encounter', cooldownValue: 1 };
const effect = (kind, args, description) => ({ kind, args, description, executable: false });

export const TOTEMIST_COMMON_MECHANICS = {
  price: 'AP and Conduit Attunement are explicit. Attunement builds from conduits and pulse interactions; max 10.',
  pylons: 'Standing conduit pylons are physical objects with durability (3x Level + Attunement). Max 3 active conduits.',
  motifs: 'Carved granite, storm-iron, standing lithic pillars, hearth fires, and territorial conductive matrices.',
  territory: 'Pylon auras, faultlines, and triangular Faraday cages without automated scripting.',
  inclusivity: 'Open to highland builders, crag-dwellers, and runecrafters across all lineages.'
};

export const TOTEMIST_CORE_RECORDS = [
  {
    ...flags,
    id: 'cr1_totemist_place_conduit',
    name: 'Place Conduit',
    level: 1,
    specialization: null,
    treeId: null,
    source: 'core',
    spellType: 'ACTION',
    icon: TOTEMIST_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: area(5),
    effectTypes: ['utility', 'summon'],
    damageConfig: null,
    durationConfig: hourDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 5 },
    description: 'Deploy an authored physical conduit pylon onto a grid tile within 20 ft (costs 1 conduit slot, max 3 active). Conduit has Durability = 3 × Level + Attunement.',
    classResourceProgram: null,
    manualMechanics: {
      price: { actionPoints: 1, mana: 0, attunement: 0 },
      effects: [effect('conduit.place', { maxActive: 3 }, 'Deploy physical totem pylon.')],
      executable: false
    },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'cr1_totemist_reclaim_conduit',
    name: 'Reclaim Conduit',
    level: 1,
    specialization: null,
    treeId: null,
    source: 'core',
    spellType: 'ACTION',
    icon: TOTEMIST_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: target(['conduit'], 1, 30),
    effectTypes: ['utility', 'resource_generation'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Deconstruct an active conduit within 30 ft, recovering its materials. Frees the conduit slot and generates +1 Conduit Attunement.',
    classResourceProgram: null,
    manualMechanics: {
      price: { actionPoints: 1, mana: 0, attunement: 0 },
      effects: [effect('conduit.reclaim', { refundAttunement: 1 }, 'Deconstruct totem; gain +1 Attunement.')],
      executable: false
    },
    sourceRefs: ['Totemist Proposed Content Lock']
  }
];

export const TOTEMIST_OPTIONAL_POOL = [
  // LEVEL 1 (2 non-damage, 2 damage)
  {
    ...flags,
    id: 'tot_hearth_ember',
    name: 'Hearth Ember',
    level: 1,
    specialization: 'hearthkeeper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(1, 0),
    targetingConfig: area(15),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'An active conduit pulses gentle hearth warmth, granting 5 temporary HP to all allies within 15 ft for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 0 }, effects: [effect('buff.temp_hp', { amount: 5 }, '5 temp HP to allies in aura.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_stone_spike',
    name: 'Stone Spike',
    level: 1,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 20),
    effectTypes: ['damage'],
    damageConfig: damage('1d8 + constitution', ['smashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Erupt sharp jagged stones from the base of an active conduit, dealing 1d8 + Constitution smashing damage to a target within 20 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 0 }, effects: [effect('damage.stone_spike', {}, 'Stone spike damage.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_storm_attunement',
    name: 'Storm Attunement',
    level: 1,
    specialization: 'skybinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Lightning/Chain Lightning',
    resourceCost: apCost(1, 0),
    targetingConfig: area(10),
    effectTypes: ['damage'],
    damageConfig: damage('1d6 + constitution', ['storm']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 10 },
    description: 'Electrify a deployed conduit for 2 rounds. Enemies entering or ending their turn within 10 ft take 1d6 + Constitution storm damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 0 }, effects: [effect('damage.static_aura', {}, 'Static aura around totem.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_lodestone_pull',
    name: 'Lodestone Pull',
    level: 1,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Vortex',
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 30),
    effectTypes: ['displacement'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'strength', dcFormula: '10 + constitution' },
    conditions: [],
    area: null,
    description: 'Magnetize a conduit, pulling a target within 30 ft 10 ft closer to the conduit on a failed Strength save.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 0 }, effects: [effect('displacement.pull', { feet: 10 }, 'Pull toward conduit.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },

  // LEVEL 2
  {
    ...flags,
    id: 'tot_soothing_pulse',
    name: 'Soothing Pulse',
    level: 2,
    specialization: 'hearthkeeper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Cleanse',
    resourceCost: apCost(1, 0),
    targetingConfig: area(15),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Conduit pulses herbal mist, granting allies within 15 ft advantage on saving throws against poison and disease for 3 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 0 }, effects: [effect('buff.poison_advantage', {}, 'Advantage vs poison/disease.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_seismic_shock',
    name: 'Seismic Shock',
    level: 2,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(1, 0),
    targetingConfig: area(10),
    effectTypes: ['damage'],
    damageConfig: damage('2d6 + constitution', ['smashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 10 },
    description: 'Slam the earth at a conduit base, dealing 2d6 + Constitution smashing damage to all enemies within a 10 ft radius.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 0 }, effects: [effect('damage.seismic_shock', {}, '10 ft ground slam.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_gale_ward',
    name: 'Gale Ward',
    level: 2,
    specialization: 'skybinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Air Shield',
    resourceCost: apCost(1, 0),
    targetingConfig: area(15),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Conduit channels local winds into an updraft; all ranged projectile attacks targeting creatures inside the 15 ft aura suffer disadvantage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 0 }, effects: [effect('buff.ranged_disadvantage', {}, 'Disadvantage on incoming ranged.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_static_jolt',
    name: 'Static Jolt',
    level: 2,
    specialization: 'skybinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Lightning/Lightning Bolt',
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 25),
    effectTypes: ['damage'],
    damageConfig: damage('1d8 + constitution', ['storm']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Discharge an electric arc from an active conduit to an enemy within 25 ft, dealing 1d8 + Constitution storm damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 0 }, effects: [effect('damage.static_jolt', {}, 'Conduit lightning arc.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },

  // LEVEL 3
  {
    ...flags,
    id: 'tot_faultline_strike',
    name: 'Faultline Strike',
    level: 3,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Charge',
    resourceCost: apCost(2, 1),
    targetingConfig: enemy(3, 30),
    effectTypes: ['damage'],
    damageConfig: damage('2d8 + constitution', ['smashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 1 Attunement to crack the ground along a vector connecting two active conduits, dealing 2d8 smashing damage to all enemies along the line.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 1 }, effects: [effect('damage.faultline', {}, 'Inter-totem seismic crack.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_sanctuary_threshold',
    name: 'Sanctuary Threshold',
    level: 3,
    specialization: 'hearthkeeper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Force Wall',
    resourceCost: apCost(1, 1),
    targetingConfig: area(20),
    effectTypes: ['crowd_control'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 1 Attunement to project an energy threshold between two active conduits. Enemies crossing the line must pay 1 additional AP to move.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 1 }, effects: [effect('zone.threshold', {}, '+1 AP entry tax on threshold.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_thunder_clap',
    name: 'Thunder Clap',
    level: 3,
    specialization: 'skybinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Lightning/Thunderstrike',
    resourceCost: apCost(2, 0),
    targetingConfig: area(15),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('2d6 + constitution', ['storm']),
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'constitution', dcFormula: '10 + constitution' },
    conditions: [],
    area: { radius: 15 },
    description: 'Release a concussive thunderclap from a conduit, dealing 2d6 storm damage and deafening enemies for 1 round on a failed Constitution save.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 0 }, effects: [effect('damage.thunderclap', {}, 'Thunder damage and deafen.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_earth_meld',
    name: 'Earth Meld',
    level: 3,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Teleport',
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
    description: 'Sink into the bedrock adjacent to one conduit and emerge instantly on a tile adjacent to any other active conduit on the battlefield.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 0 }, effects: [effect('mobility.totem_meld', {}, 'Subterranean transit between totems.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },

  // LEVEL 4
  {
    ...flags,
    id: 'tot_sympathetic_redirection',
    name: 'Sympathetic Redirection',
    level: 4,
    specialization: 'hearthkeeper',
    source: 'optional',
    spellType: 'REACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(0, 1),
    targetingConfig: ally(1, 20),
    effectTypes: ['defense'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: 'WHEN_ALLY_HIT',
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 1 Attunement when an ally near a conduit is hit: intercept the impact, absorbing up to 15 damage into the conduit durability instead.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 0, attunement: 1 }, effects: [effect('defense.redirect', { amount: 15 }, 'Absorb 15 damage into totem.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_arcing_triangulation',
    name: 'Arcing Triangulation',
    level: 4,
    specialization: 'skybinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Lightning/Chain Lightning',
    resourceCost: apCost(2, 2),
    targetingConfig: area(20),
    effectTypes: ['damage'],
    damageConfig: damage('3d6 + constitution', ['storm']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 2 Attunement to fire electric arcs simultaneously across the triangle between all 3 active conduits, dealing 3d6 storm damage to enemies caught within.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 2 }, effects: [effect('damage.triangulate', {}, 'Triangular lightning cage burst.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_earthen_rampart',
    name: 'Earthen Rampart',
    level: 4,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Earth Wall',
    resourceCost: apCost(1, 1),
    targetingConfig: area(15),
    effectTypes: ['utility'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 1 Attunement to raise a 10 ft stone ridge between two conduits. Provides full cover against ranged attacks and blocks movement.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 1 }, effects: [effect('wall.rampart', {}, 'Stone cover wall.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_battering_spire',
    name: 'Battering Spire',
    level: 4,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Charge',
    resourceCost: apCost(2, 2),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage'],
    damageConfig: damage('3d8 + constitution', ['smashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 2 Attunement to launch a monolithic stone pillar horizontally from a conduit, crushing a target within 30 ft for 3d8 + Constitution smashing damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 2 }, effects: [effect('damage.battering_spire', {}, '3d8 smashing projectile.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },

  // LEVEL 5
  {
    ...flags,
    id: 'tot_spire_shatter',
    name: 'Spire Shatter',
    level: 5,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(2, 3),
    targetingConfig: area(15),
    effectTypes: ['damage'],
    damageConfig: damage('3d10 + constitution', ['smashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 3 Attunement to shatter an active conduit, releasing a spray of jagged stone shrapnel in a 15 ft radius for 3d10 smashing damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 3 }, effects: [effect('damage.totem_detonate', {}, 'Shatter conduit.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_restorative_hearth',
    name: 'Restorative Hearth',
    level: 5,
    specialization: 'hearthkeeper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(2, 2),
    targetingConfig: area(15),
    effectTypes: ['healing'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 2 Attunement to pulse restorative heat from all hearth conduits, healing all allies within 15 ft for 3d6 + Constitution HP.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 2 }, effects: [effect('healing.hearth_pulse', {}, '3d6 heal in aura.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_cyclone_eye',
    name: 'Cyclone Eye',
    level: 5,
    specialization: 'skybinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Vortex',
    resourceCost: apCost(2, 2),
    targetingConfig: area(20),
    effectTypes: ['displacement'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'strength', dcFormula: '10 + constitution' },
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 2 Attunement to turn a conduit into a vortex eye, pulling all enemies within 20 ft 10 ft closer to the conduit on a failed save.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 2 }, effects: [effect('displacement.cyclone', { feet: 10 }, '20 ft vortex pull.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_galvanic_surge',
    name: 'Galvanic Surge',
    level: 5,
    specialization: 'skybinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Lightning/Chain Lightning',
    resourceCost: apCost(2, 3),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage'],
    damageConfig: damage('3d8 + constitution', ['storm']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 3 Attunement to discharge a concentrated static beam through an enemy, dealing 3d8 storm damage and chaining to 1 adjacent foe.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 3 }, effects: [effect('damage.galvanic_surge', {}, '3d8 storm with chain.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },

  // LEVEL 6
  {
    ...flags,
    id: 'tot_pillar_slam',
    name: 'Pillar Slam',
    level: 6,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(2, 3),
    targetingConfig: enemy(1, 10),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('4d8 + constitution', ['smashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'strength', dcFormula: '10 + constitution' },
    conditions: ['prone'],
    area: null,
    description: 'Spend 3 Attunement to slam a target directly against an active conduit, dealing 4d8 smashing damage and knocking them prone.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 3 }, effects: [effect('damage.pillar_slam', {}, 'Pillar smash and knockdown.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_warding_canopy',
    name: 'Warding Canopy',
    level: 6,
    specialization: 'hearthkeeper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(2, 3),
    targetingConfig: area(20),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 3 Attunement to link conduits into a protective canopy dome for 3 rounds. Allies inside gain +3 AC and resistance to area attacks.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 3 }, effects: [effect('buff.canopy', {}, '+3 AC and area resistance.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_lightning_tether',
    name: 'Lightning Tether',
    level: 6,
    specialization: 'skybinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Lightning/Chain Lightning',
    resourceCost: apCost(1, 2),
    targetingConfig: enemy(1, 25),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('3d8 + constitution', ['storm']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 2 Attunement to tether an enemy to a conduit with crackling storm energy. If the target moves more than 15 ft from the conduit, they take 3d8 storm damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 2 }, effects: [effect('damage.tether', {}, 'Lightning tether.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_deep_root_cleats',
    name: 'Deep Root Cleats',
    level: 6,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Anchor',
    resourceCost: apCost(1, 0),
    targetingConfig: area(15),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Subterranean stone cleats anchor allies within 15 ft of active conduits. Affected allies are completely immune to knockback, shove, and knockdown.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 0 }, effects: [effect('buff.anchor', {}, 'Immune to forced movement.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },

  // LEVEL 7
  {
    ...flags,
    id: 'tot_tectonic_cataclysm',
    name: 'Tectonic Cataclysm',
    level: 7,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(3, 5),
    targetingConfig: area(25),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('5d8 + constitution', ['smashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'agility', dcFormula: '10 + constitution' },
    conditions: ['prone'],
    area: { radius: 25 },
    description: 'Spend 5 Attunement to trigger a massive seismic resonance between all conduits, dealing 5d8 smashing damage and knocking all enemies prone.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, attunement: 5 }, effects: [effect('damage.tectonic_burst', {}, '5d8 smashing + knockdown.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_aegis_of_the_crag',
    name: 'Aegis of the Crag',
    level: 7,
    specialization: 'hearthkeeper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(2, 4),
    targetingConfig: area(20),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 4 Attunement to infuse conduits with bedrock resilience. Active conduits pool 50 total durability to absorb incoming damage for allies.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 4 }, effects: [effect('defense.shared_pool', { amount: 50 }, '50 damage shield pool.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_chain_lightning_matrix',
    name: 'Chain Lightning Matrix',
    level: 7,
    specialization: 'skybinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Lightning/Chain Lightning',
    resourceCost: apCost(2, 4),
    targetingConfig: enemy(4, 30),
    effectTypes: ['damage'],
    damageConfig: damage('4d10 + constitution', ['storm']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 4 Attunement to discharge a chain lightning matrix from all conduits, shocking up to 4 enemies for 4d10 + Constitution storm damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 4 }, effects: [effect('damage.matrix_lightning', {}, '4d10 chain lightning.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_transposition_conduit',
    name: 'Transposition Conduit',
    level: 7,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Teleport',
    resourceCost: apCost(1, 2),
    targetingConfig: target(['conduit', 'ally'], 2, 40),
    effectTypes: ['mobility'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 2 Attunement to swap the physical positions of two active conduits, or swap an active conduit with a willing ally within 40 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 2 }, effects: [effect('mobility.swap', {}, 'Swap conduit locations.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },

  // LEVEL 8
  {
    ...flags,
    id: 'tot_monolithic_avalanche',
    name: 'Monolithic Avalanche',
    level: 8,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(3, 6),
    targetingConfig: area(20),
    effectTypes: ['damage'],
    damageConfig: damage('6d10 + constitution', ['smashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 6 Attunement to pull a massive boulder from the deep bedrock down into a 20 ft zone, dealing 6d10 smashing damage to all creatures.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, attunement: 6 }, effects: [effect('damage.avalanche', {}, '6d10 boulder smash.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_hearth_resurrection',
    name: 'Hearth Resurrection',
    level: 8,
    specialization: 'hearthkeeper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(3, 6),
    targetingConfig: ally(1, 15),
    effectTypes: ['healing'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 6 Attunement to sacrifice an active hearth conduit to immediately revive a fallen ally within 15 ft, restoring them to 25 HP.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, attunement: 6 }, effects: [effect('healing.revive', { hp: 25 }, 'Revive fallen ally.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_storm_eye_conduit',
    name: 'Storm Eye Conduit',
    level: 8,
    specialization: 'skybinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Lightning/Thunderstrike',
    resourceCost: apCost(2, 5),
    targetingConfig: area(20),
    effectTypes: ['damage'],
    damageConfig: damage('5d10 + constitution', ['storm']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 5 Attunement to call an orbital lightning strike directly into a conduit, dispersing a 5d10 storm blast across a 20 ft radius.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 5 }, effects: [effect('damage.storm_eye', {}, '5d10 storm blast.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_impenetrable_sanctuary',
    name: 'Impenetrable Sanctuary',
    level: 8,
    specialization: 'hearthkeeper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Force Wall',
    resourceCost: apCost(2, 4),
    targetingConfig: area(20),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 4 Attunement to raise an impenetrable barrier between all conduits for 2 rounds. Completely blocks all enemy projectiles and spells.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 4 }, effects: [effect('defense.impenetrable', {}, 'Total projectile immunity.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },

  // LEVEL 9
  {
    ...flags,
    id: 'tot_prime_seismic_rupture',
    name: 'Prime Seismic Rupture',
    level: 9,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(3, 7),
    targetingConfig: area(30),
    effectTypes: ['damage'],
    damageConfig: damage('7d10 + constitution', ['smashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Spend 7 Attunement to tear open a massive tectonic fissure across 30 ft, dealing 7d10 smashing damage to all enemies caught within.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, attunement: 7 }, effects: [effect('damage.seismic_rupture', {}, '7d10 tectonic fissure.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_storm_cage',
    name: 'Storm Cage',
    level: 9,
    specialization: 'skybinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Lightning/Chain Lightning',
    resourceCost: apCost(3, 6),
    targetingConfig: area(20),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('6d8 + constitution', ['storm']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 6 Attunement to enclose up to 3 enemies inside a triangular cage of crackling lightning. Crossing the perimeter deals 6d8 storm damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, attunement: 6 }, effects: [effect('damage.storm_cage', {}, 'Lightning cage boundary.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_eternal_grounding',
    name: 'Eternal Grounding',
    level: 9,
    specialization: 'hearthkeeper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Aura',
    resourceCost: apCost(2, 5),
    targetingConfig: area(25),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 25 },
    description: 'Spend 5 Attunement to ground all leyline energies. For 3 rounds, all elemental and spell damage dealt to allies within 25 ft of any conduit is halved.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 5 }, effects: [effect('buff.grounding', {}, 'Half damage from spells for 3 rounds.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_conduit_overdrive',
    name: 'Conduit Overdrive',
    level: 9,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Speed',
    resourceCost: apCost(2, 5),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 5 Attunement to enter conduit resonance overdrive for 2 rounds: your maximum active conduit capacity increases from 3 to 4.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, attunement: 5 }, effects: [effect('buff.extra_conduit', {}, '+1 max conduit capacity.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },

  // LEVEL 10
  {
    ...flags,
    id: 'tot_wrath_of_the_standing_stones',
    name: 'Wrath of the Standing Stones',
    level: 10,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(3, 10),
    targetingConfig: area(30),
    effectTypes: ['damage'],
    damageConfig: damage('10d10 + constitution', ['smashing', 'storm']),
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Spend all 10 Attunement to detonate all active conduits in a cataclysmic earth-and-lightning cataclysm, dealing 10d10 total damage across 30 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, attunement: 10 }, effects: [effect('damage.standing_stones_wrath', {}, '10d10 max attunement burst.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_the_great_hearth',
    name: 'The Great Hearth',
    level: 10,
    specialization: 'hearthkeeper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(3, 8),
    targetingConfig: area(30),
    effectTypes: ['buff', 'healing'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Spend 8 Attunement to awaken the primal ancestral hearthstone. Grants 50 temporary HP and cleanses all conditions from all allies in the encounter.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, attunement: 8 }, effects: [effect('buff.great_hearth', {}, '50 temp HP and cleanse party.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_world_root_awakening',
    name: 'World Root Awakening',
    level: 10,
    specialization: 'earthshaper',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(3, 8),
    targetingConfig: area(30),
    effectTypes: ['crowd_control', 'terrain'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: ['rooted', 'petrified_strata'],
    area: { radius: 30 },
    description: 'Spend 8 Attunement to call up the ancient subterranean stone roots of the world, encasing all enemies in petrified strata (movement speed 0 ft, no reactions) for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, attunement: 8 }, effects: [effect('control.world_roots', { durationRounds: 2 }, 'Encase enemies in petrified stone roots.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_tempest_domain',
    name: 'Tempest Domain',
    level: 10,
    specialization: 'skybinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Lightning/Thunderstrike',
    resourceCost: apCost(3, 8),
    targetingConfig: area(30),
    effectTypes: ['damage', 'buff'],
    damageConfig: damage('4d10 + constitution', ['storm']),
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Spend 8 Attunement to transform the encounter into an orbital tempest for 3 rounds. Strikes all enemies for 4d10 storm each turn; allies gain fly speed 30 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, attunement: 8 }, effects: [effect('damage.tempest_domain', {}, 'Continuous storm strike + flight.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  }
];

export const TOTEMIST_SIGNATURE_RECORDS = [
  {
    ...flags,
    id: 'tot_sig_sovereign_hearth',
    name: 'Sovereign Hearth',
    level: 3,
    specialization: 'hearthkeeper',
    treeId: 'hearthkeeper',
    source: 'signature',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(1, 2),
    targetingConfig: area(15),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 2 Attunement to establish a sovereign hearth aura around active conduits for 3 rounds. Allies within 15 ft gain +2 AC and DR 3/-.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 2 }, effects: [effect('signature.sovereign_hearth', {}, '+2 AC and DR 3/- aura.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_sig_faultline_conduit',
    name: 'Faultline Conduit',
    level: 3,
    specialization: 'earthshaper',
    treeId: 'earthshaper',
    source: 'signature',
    spellType: 'ACTION',
    icon: 'General/Combat Charge',
    resourceCost: apCost(1, 2),
    targetingConfig: area(20),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('2d8 + constitution', ['smashing']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: ['slowed'],
    area: { radius: 20 },
    description: 'Spend 2 Attunement to lock a seismic faultline between two conduits. Enemies in the vector take 2d8 smashing damage and are slowed by 10 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 2 }, effects: [effect('signature.faultline', {}, 'Seismic vector damage and slow.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_sig_arcing_needle',
    name: 'Arcing Needle',
    level: 3,
    specialization: 'skybinder',
    treeId: 'skybinder',
    source: 'signature',
    spellType: 'ACTION',
    icon: 'Lightning/Chain Lightning',
    resourceCost: apCost(1, 1),
    targetingConfig: enemy(2, 25),
    effectTypes: ['damage'],
    damageConfig: damage('2d6 + constitution', ['storm']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 1 Attunement to discharge an electric needle from an active conduit, arcing to 2 enemies within 25 ft for 2d6 storm damage each.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, attunement: 1 }, effects: [effect('signature.arcing_needle', {}, 'Conduit chain jolt.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  }
];

export const TOTEMIST_CAPSTONE_RECORDS = [
  {
    ...flags,
    id: 'tot_cap_eternal_hearthstone',
    name: 'The Eternal Hearthstone',
    level: 10,
    specialization: 'hearthkeeper',
    treeId: 'hearthkeeper',
    source: 'capstone',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(3, 6),
    targetingConfig: area(20),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 6 Attunement to anchor the legendary eternal hearthstone. For 1 round, no ally within its 20 ft aura can drop below 1 HP.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, attunement: 6 }, effects: [effect('capstone.eternal_hearthstone', {}, 'Death prevention aura.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_cap_pillar_of_the_world_root',
    name: 'Pillar of the World-Root',
    level: 10,
    specialization: 'earthshaper',
    treeId: 'earthshaper',
    source: 'capstone',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(3, 6),
    targetingConfig: area(20),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('5d10 + constitution', ['smashing']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: ['prone', 'rooted'],
    area: { radius: 20 },
    description: 'Spend 6 Attunement to summon a colossal world-root pillar beneath targets, dealing 5d10 smashing damage, knocking them prone and pinning them to earth.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, attunement: 6 }, effects: [effect('capstone.world_root_pillar', {}, '5d10 smash + pin.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  },
  {
    ...flags,
    id: 'tot_cap_tempest_beacon',
    name: 'Tempest Beacon',
    level: 10,
    specialization: 'skybinder',
    treeId: 'skybinder',
    source: 'capstone',
    spellType: 'ACTION',
    icon: 'Lightning/Thunderstrike',
    resourceCost: apCost(3, 6),
    targetingConfig: area(20),
    effectTypes: ['damage'],
    damageConfig: damage('3d10 + constitution', ['storm']),
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 6 Attunement to turn a conduit into an orbital lightning turret for 3 rounds, striking the nearest enemy each round for 3d10 storm damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, attunement: 6 }, effects: [effect('capstone.tempest_beacon', {}, '3d10 storm turret for 3 rounds.')], executable: false },
    sourceRefs: ['Totemist Proposed Content Lock']
  }
];

export const TOTEMIST_TALENT_ACTIVE_RECORDS = [
  ...TOTEMIST_SIGNATURE_RECORDS,
  ...TOTEMIST_CAPSTONE_RECORDS
];

export const TOTEMIST_ALL_RECORDS = [
  ...TOTEMIST_CORE_RECORDS,
  ...TOTEMIST_OPTIONAL_POOL,
  ...TOTEMIST_TALENT_ACTIVE_RECORDS,
  ...TOTEMIST_PASSIVE_RECORDS
];

export const TOTEMIST_PROJECTED_SPELLS = TOTEMIST_ALL_RECORDS;

export const TOTEMIST_PROJECTED_SPELLS_BY_ID = Object.fromEntries(
  TOTEMIST_PROJECTED_SPELLS.map(spell => [spell.id, spell])
);

export const TOTEMIST_OPTIONAL_RECORDS = TOTEMIST_OPTIONAL_POOL;

export const TOTEMIST_SPELL_POOLS = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    return [level, TOTEMIST_OPTIONAL_RECORDS.filter(spell => spell.level === level).map(spell => spell.id)];
  })
);

export const TOTEMIST_PROGRESSION_POLICY = {
  classId: TOTEMIST_CLASS_ID,
  maxLevel: 10,
  startingSpellPicks: 1,
  optionalPicksPerLevel: 1,
  allowEarlierUnchosen: true,
  grantedCoreSpellIds: TOTEMIST_CORE_RECORDS.map(spell => spell.id),
  randomizeStartingSpells: false,
  autoTopUpOnLoad: false,
  talentActivesAreGrants: true,
  manualOnly: true
};

const totemistNodeById = Object.fromEntries(TOTEMIST_TALENT_NODES.map(node => [node.id, node]));
const totemistTreePoints = (ranks, treeId) => TOTEMIST_TALENT_NODES
  .filter(node => node.treeId === treeId)
  .reduce((total, node) => total + (ranks[node.id] || 0), 0);

export const pruneTotemistTalents = (talents, characterLevel) => {
  const ranks = talents && typeof talents === 'object' ? { ...talents } : {};
  const level = Number.isInteger(characterLevel) ? Math.max(1, characterLevel) : 10;
  Object.keys(ranks).forEach(nodeId => {
    const node = totemistNodeById[nodeId];
    if (!node || !Number.isInteger(ranks[nodeId]) || ranks[nodeId] < 1 || ranks[nodeId] > node.maxRanks) {
      delete ranks[nodeId];
    }
  });

  const pruneStructure = () => {
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of TOTEMIST_TALENT_NODES) {
        const rank = ranks[node.id];
        if (!rank) continue;
        const gatePoints = totemistTreePoints(ranks, node.treeId) - rank;
        const predecessorMissing = node.requires.some(predecessorId => {
          const predecessor = totemistNodeById[predecessorId];
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
    TOTEMIST_TALENT_NODES.forEach(node => {
      if (!ranks[node.id]) return;
      if (target === null || node.minLevel >= totemistNodeById[target].minLevel) target = node.id;
    });
    if (target === null) break;
    ranks[target] -= 1;
    if (ranks[target] === 0) delete ranks[target];
    pruneStructure();
  }
  return ranks;
};

export function validateTotemistState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return { valid: false, errors: ['state must be an object'] };
  const attunement = Number(state.attunement ?? state.current ?? 0);
  if (!Number.isInteger(attunement) || attunement < 0 || attunement > 10) {
    errors.push('attunement must be an integer from 0 to 10');
  }
  const activePylons = Number(state.activePylons ?? 0);
  if (!Number.isInteger(activePylons) || activePylons < 0 || activePylons > 3) {
    errors.push('activePylons must be an integer from 0 to 3');
  }
  return { valid: errors.length === 0, errors };
}

export const TOTEMIST_DATA = {
  id: TOTEMIST_CLASS_ID,
  name: 'Totemist',
  icon: TOTEMIST_ICON,
  role: 'Zone Engineer / Bulwark',
  roleColor: '#d97706',
  damageTypes: ['smashing', 'storm', 'primal'],
  resource: 'Conduit Attunement',
  complexityRating: 4,
  cognitiveTags: ['Standing Conduits', 'Attunement Matrices', 'Manual Tabletop'],
  playstyle: 'Anchor primal elemental currents into physical standing conduit pylons, establish resonant geometric vectors across the grid, and shatter conduits in seismic shockwaves. No automatic totem placement or damage execution. Development — manual tabletop.',
  developmentStatus: 'development',
  manualOnly: true,
  overview: {
    title: 'The Totemist',
    subtitle: 'Architect of Standing Pylons and Lithic Vectors',
    illustration: '/assets/images/classes/totemist_illustration.png',
    illustrationCaption: 'A stone-carver anchoring carved storm pylons to channel primordial currents.',
    originStory: 'The standing-stone architects of the exposed highlands carved monolithic beacons to anchor violent storm currents and disperse earthquakes away from settlement keeps. Distinct from the ancestral spirit-voices of the Animist, the Totemist works in physical lithic density and conductive geometry.',
    quickOverview: {
      title: 'Quick Overview',
      content: 'The Totemist carries physical carved conduits (max 3 deployed simultaneously) and builds Conduit Attunement (0-10). Conduits pulse protective auras, conduct arcing lightning, and form seismic faultlines across the tactical grid. Manual tabletop tracking.'
    }
  },
    resourceSystem: {
    id: 'totemic_attunement',
    name: 'Conduit Attunement',
    title: 'Conduit Attunement',
    mechanic: 'Conduit Attunement (0-10) and Standing Pylons (0-3)'
  },
  specializations: {
    title: 'Three Conduit Disciplines',
    description: 'First investment chooses a primary lithic tree. Five talent points per level, global cap fifty. Signatures require ten same-tree points at level three; capstones forty-five at level ten.',
    specs: [
      {
        id: 'hearthkeeper',
        name: 'Hearthkeeper',
        icon: 'fas fa-fire',
        theme: 'Sustaining clan fire, restorative harmonic hums, communal resilience, and warding conduits.',
        description: 'Sustaining clan fire, restorative harmonic hums, communal resilience, and warding conduits.',
        playstyle: 'Restorative resonance, aura buffs, and ally preservation.'
      },
      {
        id: 'earthshaper',
        name: 'Earthshaper',
        icon: 'fas fa-mountain',
        theme: 'Seismic faultlines, lithic grounding, subterranean root manipulation, and conduit redirection.',
        description: 'Seismic faultlines, lithic grounding, subterranean root manipulation, and conduit redirection.',
        playstyle: 'Battlefield terraforming, lithic barriers, and seismic faultline strikes.'
      },
      {
        id: 'skybinder',
        name: 'Skybinder',
        icon: 'fas fa-bolt',
        theme: 'Triangular storm cages, lightning arc conduction, thunderclap pulses, and atmospheric vortexes.',
        description: 'Triangular storm cages, lightning arc conduction, thunderclap pulses, and atmospheric vortexes.',
        playstyle: 'Conduit triangulation, storm arcs, and aerial vortex control.'
      }
    ]
  },
  classFeatures: [
    {
      level: 1,
      name: 'Physical Conduits & Attunement',
      description: 'Deploy up to 3 standing conduit pylons with discrete durability. Track Conduit Attunement (0-10) to power discharges and area overcharges.'
    },
    {
      level: 1,
      name: 'Core Conduit Grants',
      description: 'Gain Place Conduit and Reclaim Conduit as permanent baseline abilities that do not consume optional spell picks.'
    }
  ],
  spells: TOTEMIST_PROJECTED_SPELLS,
  exampleSpells: TOTEMIST_PROJECTED_SPELLS,
  optionalSpellsByLevel: TOTEMIST_SPELL_POOLS,
  spellPools: TOTEMIST_SPELL_POOLS,
  talentTrees: TOTEMIST_TREES,
  progression: {
    policy: TOTEMIST_PROGRESSION_POLICY,
    spellPools: TOTEMIST_SPELL_POOLS,
    ...TOTEMIST_PROGRESSION_POLICY
  }
};
