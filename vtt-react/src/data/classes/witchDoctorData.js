import {
  WITCH_DOCTOR_TREE_META,
  WITCH_DOCTOR_TREES,
  WITCH_DOCTOR_TALENT_NODES,
  WITCH_DOCTOR_PASSIVE_RECORDS,
  WITCH_DOCTOR_TALENT_CAPACITY
} from '../talentTrees/witchdoctor';

export { WITCH_DOCTOR_PASSIVE_RECORDS, WITCH_DOCTOR_TALENT_CAPACITY };

export const WITCH_DOCTOR_CLASS_ID = 'witch-doctor';
export const WITCH_DOCTOR_RULESET_VERSION = 'cr-review-r1';
export const WITCH_DOCTOR_ICON = 'fas fa-skull';
export const WITCH_DOCTOR_MANUAL_NOTICE = 'Manual tabletop only. No automatic tallow spending, poppet binding, miasma dispersion, or damage.';

const flags = {
  classId: WITCH_DOCTOR_CLASS_ID,
  rulesetVersion: WITCH_DOCTOR_RULESET_VERSION,
  authoredOnly: true,
  manualOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualNotice: WITCH_DOCTOR_MANUAL_NOTICE
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

const apCost = (actionPoints, tallow = 0) => ({
  actionPoints,
  mana: 0,
  bogTallow: tallow,
  resourceTypes: actionPoints > 0 ? ['actionPoints'] : [],
  resourceValues: { actionPoints, mana: 0, bogTallow: tallow },
  useFormulas: {},
  components: ['somatic', 'material'],
  somaticText: 'Sculpt bog tallow wax, brew herbal reagents, or prick sympathetic effigy.'
});

const damage = (formula, damageTypes = ['blight']) => ({ formula, damageTypes, resolution: 'DICE' });
const cooldownNone = { cooldownType: 'turn_based', cooldownValue: 0 };
const cooldownEncounter = { cooldownType: 'encounter', cooldownValue: 1 };
const effect = (kind, args, description) => ({ kind, args, description, executable: false });

export const WITCH_DOCTOR_COMMON_MECHANICS = {
  price: 'AP and Bog Tallow are explicit. Tallow scales from 0 to 100% (starting value: 50%).',
  tallow: 'Bog Tallow is harvested from suffering foes and rendered herbs. Spent to sculpt wax poppets and brew clouds.',
  motifs: 'Bog tallow, clay crucibles, sympathetic wax poppets, bone needles, and noxious miasma cauldrons.',
  sympathy: 'Sympathetic damage transfer, withering curses, and herbal salves without automated scripting.',
  inclusivity: 'Open to herbalists, marsh-dwellers, and practitioners of the deep mire.'
};

export const WITCH_DOCTOR_CORE_RECORDS = [
  {
    ...flags,
    id: 'cr1_witch_doctor_bog_hex',
    name: 'Bog Hex',
    level: 1,
    specialization: null,
    treeId: null,
    source: 'core',
    spellType: 'ACTION',
    icon: WITCH_DOCTOR_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 30),
    effectTypes: ['debuff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'spirit', dcFormula: '10 + spirit' },
    conditions: ['cursed'],
    area: null,
    description: 'Cast a withering bog hex on an enemy within 30 ft. Target suffers disadvantage on their next physical check and is marked for sympathetic effigy binding for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: {
      price: { actionPoints: 1, mana: 0, tallow: 0 },
      effects: [effect('curse.hex', {}, 'Disadvantage on next check and effigy mark.')],
      executable: false
    },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'cr1_witch_doctor_render_tallow',
    name: 'Render Tallow',
    level: 1,
    specialization: null,
    treeId: null,
    source: 'core',
    spellType: 'ACTION',
    icon: WITCH_DOCTOR_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['utility', 'resource_generation'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Boil marsh herbs and peat in your alchemical crucible, rendering fresh Bog Tallow. Recover +20% Bog Tallow (capped at 100%).',
    classResourceProgram: null,
    manualMechanics: {
      price: { actionPoints: 1, mana: 0, tallow: 0 },
      effects: [effect('resource.tallow_render', { amount: 20 }, 'Recover +20% Bog Tallow.')],
      executable: false
    },
    sourceRefs: ['Witch Doctor Content Lock']
  }
];

export const WITCH_DOCTOR_OPTIONAL_POOL = [
  // LEVEL 1 (2 non-damage, 2 damage)
  {
    ...flags,
    id: 'wd_effigy_of_clay',
    name: 'Effigy of Clay',
    level: 1,
    specialization: 'fetish_crafter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(1, 0),
    targetingConfig: ally(1, 20),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Fashion a clay talisman for an ally. Grants 5 temporary HP and +1 to all Constitution saving throws for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, tallow: 0 }, effects: [effect('buff.clay_talisman', { tempHp: 5 }, '5 temp HP and +1 Con saves.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_miasma_puff',
    name: 'Miasma Puff',
    level: 1,
    specialization: 'miasmist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Nature/Poison Spray',
    resourceCost: apCost(1, 0),
    targetingConfig: area(10),
    effectTypes: ['damage'],
    damageConfig: damage('1d6 + spirit', ['blight', 'poison']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 10 },
    description: 'Exhale a puff of pungent bog spores in a 10 ft cone, dealing 1d6 + Spirit blight and poison damage to all creatures caught within.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, tallow: 0 }, effects: [effect('damage.spore_puff', {}, '10 ft spore cone.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_tallow_stitch',
    name: 'Tallow Stitch',
    level: 1,
    specialization: 'fetish_crafter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Cleanse',
    resourceCost: apCost(1, 0),
    targetingConfig: ally(1, 15),
    effectTypes: ['healing'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Use a bone needle and tallow thread to bind an ally wound, restoring 2d4 + Spirit HP.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, tallow: 0 }, effects: [effect('healing.stitch', { amount: '2d4 + spirit' }, 'Restore 2d4 + Spirit HP.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_stagnant_grasp',
    name: 'Stagnant Grasp',
    level: 1,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 20),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('1d8 + spirit', ['necrotic']),
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: ['slowed'],
    area: null,
    description: 'Reach with cold bog water, dealing 1d8 + Spirit necrotic damage and reducing target movement speed by 10 ft for 1 round.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, tallow: 0 }, effects: [effect('damage.stagnant_grasp', {}, 'Necrotic damage and slow.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },

  // LEVEL 2
  {
    ...flags,
    id: 'wd_needle_prick',
    name: 'Needle Prick',
    level: 2,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Piercing/Deep Pierce',
    resourceCost: apCost(1, 10),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage', 'debuff'],
    damageConfig: damage('1d8 + spirit', ['piercing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 10% Tallow to pierce a sympathetic wax poppet. The hexed target takes 1d8 piercing damage and suffers disadvantage on their next attack.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, tallow: 10 }, effects: [effect('damage.needle_prick', {}, '1d8 piercing + disadvantage.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_soothing_salve',
    name: 'Soothing Salve',
    level: 2,
    specialization: 'fetish_crafter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Cleanse',
    resourceCost: apCost(1, 10),
    targetingConfig: ally(1, 15),
    effectTypes: ['utility'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 10% Tallow to apply bog moss salve to an ally, immediately cleansing 1 poison or disease condition.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, tallow: 10 }, effects: [effect('cleanse.poison', {}, 'Cleanse poison/disease.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_choking_vapors',
    name: 'Choking Vapors',
    level: 2,
    specialization: 'miasmist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Nature/Poison Spray',
    resourceCost: apCost(2, 10),
    targetingConfig: area(10),
    effectTypes: ['crowd_control'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 10 },
    description: 'Spend 10% Tallow to brew a 10 ft cloud of suffocating bog gas. Enemies inside suffer -2 to attack rolls and disadvantage on Perception checks.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 10 }, effects: [effect('zone.choking_vapors', { radius: 10 }, 'Attack penalty cloud.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_parasitic_leech',
    name: 'Parasitic Leech',
    level: 2,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(1, 10),
    targetingConfig: enemy(1, 20),
    effectTypes: ['damage', 'healing'],
    damageConfig: damage('1d6 + spirit', ['necrotic']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 10% Tallow to leech vital fluid from a hexed enemy. Deal 1d6 necrotic damage and heal yourself for the damage dealt.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, tallow: 10 }, effects: [effect('damage.leech', {}, 'Lifesteal damage.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },

  // LEVEL 3
  {
    ...flags,
    id: 'wd_curse_of_trembling',
    name: 'Curse of Trembling',
    level: 3,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Curse',
    resourceCost: apCost(2, 20),
    targetingConfig: enemy(1, 30),
    effectTypes: ['debuff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'constitution', dcFormula: '10 + spirit' },
    conditions: ['cursed'],
    area: null,
    description: 'Spend 20% Tallow to curse a foe with violent muscle spasms. Target suffers -2 to all attack rolls and physical saving throws for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 20 }, effects: [effect('debuff.tremble', {}, '-2 attack and saves.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_spore_bomb',
    name: 'Spore Bomb',
    level: 3,
    specialization: 'miasmist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Nature/Poison Spray',
    resourceCost: apCost(2, 20),
    targetingConfig: area(10),
    effectTypes: ['damage'],
    damageConfig: damage('2d8 + spirit', ['poison', 'blight']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 10 },
    description: 'Spend 20% Tallow to throw a brittle gourd filled with rotting marsh spores, dealing 2d8 poison damage to all creatures in a 10 ft radius.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 20 }, effects: [effect('damage.spore_bomb', {}, '2d8 poison burst.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_effigy_ward',
    name: 'Effigy Ward',
    level: 3,
    specialization: 'fetish_crafter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(1, 20),
    targetingConfig: ally(1, 20),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 20% Tallow to anchor a protective effigy to an ally. The effigy absorbs up to 15 damage for the ally before disintegrating.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, tallow: 20 }, effects: [effect('buff.ward', { absorb: 15 }, 'Absorb 15 damage.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_blood_boil',
    name: 'Blood Boil',
    level: 3,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Fire/Burning Ember',
    resourceCost: apCost(2, 20),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage', 'dot'],
    damageConfig: damage('2d6 + spirit', ['necrotic']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 20% Tallow to boil the blood of a hexed enemy, dealing 2d6 necrotic damage immediately and 1d6 damage at start of their next turn.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 20 }, effects: [effect('damage.blood_boil', {}, '2d6 + 1d6 DoT.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },

  // LEVEL 4
  {
    ...flags,
    id: 'wd_sympathetic_severance',
    name: 'Sympathetic Severance',
    level: 4,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Bloody Slash',
    resourceCost: apCost(2, 20),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage', 'utility'],
    damageConfig: damage('3d8 + spirit', ['piercing', 'necrotic']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 20% Tallow to sever a sympathetic poppet cord, dealing 3d8 damage to the hexed target and instantly dispelling one minor buff on them.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 20 }, effects: [effect('damage.severance', {}, '3d8 damage + dispel buff.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_veil_of_the_mire',
    name: 'Veil of the Mire',
    level: 4,
    specialization: 'miasmist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Blur',
    resourceCost: apCost(1, 20),
    targetingConfig: area(15),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 20% Tallow to summon a veil of swamp mist in a 15 ft radius. Allies inside gain 20% concealment miss chance against attacks for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, tallow: 20 }, effects: [effect('buff.veil', { missChance: 20 }, '20% concealment cloud.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_fetish_of_binding',
    name: 'Fetish of Binding',
    level: 4,
    specialization: 'fetish_crafter',
    source: 'optional',
    spellType: 'REACTION',
    icon: 'General/Combat Counter',
    resourceCost: apCost(0, 20),
    targetingConfig: enemy(1, 30),
    effectTypes: ['control', 'debuff'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: 'WHEN_HIT',
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Reaction when struck by an attack: spend 20% Tallow to channel the blow through a sympathetic talisman, binding the attacker in place for 1 round (movement 0 ft).',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 0, tallow: 20 }, effects: [effect('reaction.bind_attacker', { duration: 1 }, 'Bind attacker in place.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_noxious_eruption',
    name: 'Noxious Eruption',
    level: 4,
    specialization: 'miasmist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Nature/Poison Spray',
    resourceCost: apCost(2, 20),
    targetingConfig: area(15),
    effectTypes: ['damage'],
    damageConfig: damage('3d6 + spirit', ['blight']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 20% Tallow to detonate a pocket of swamp methane, dealing 3d6 blight damage to all creatures in a 15 ft radius.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 20 }, effects: [effect('damage.methane_burst', {}, '3d6 blight explosion.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },

  // LEVEL 5
  {
    ...flags,
    id: 'wd_sympathetic_agony',
    name: 'Sympathetic Agony',
    level: 5,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Piercing/Deep Pierce',
    resourceCost: apCost(2, 30),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage'],
    damageConfig: damage('3d10 + spirit', ['necrotic']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 30% Tallow to thrust a bone spike through a poppet, inflicting 3d10 + Spirit necrotic damage directly into the linked target heart.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 30 }, effects: [effect('damage.sympathetic_agony', {}, '3d10 necrotic heart-strike.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_cleansing_pyre',
    name: 'Cleansing Pyre',
    level: 5,
    specialization: 'fetish_crafter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Cleanse',
    resourceCost: apCost(2, 30),
    targetingConfig: area(15),
    effectTypes: ['utility'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 30% Tallow to burn sacred peat, cleansing all hexes, curses, poisons, and bleeds from all allies within 15 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 30 }, effects: [effect('cleanse.party', {}, 'Cleanse all conditions from party.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_spore_cloud_hazard',
    name: 'Spore Cloud Hazard',
    level: 5,
    specialization: 'miasmist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Nature/Poison Spray',
    resourceCost: apCost(2, 30),
    targetingConfig: area(20),
    effectTypes: ['damage'],
    damageConfig: damage('2d6 + spirit', ['poison']),
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 30% Tallow to deploy a persistent 20 ft cloud of toxic marsh spores for 3 rounds. Creatures starting their turn inside take 2d6 poison damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 30 }, effects: [effect('zone.persistent_spores', {}, '2d6 poison/round zone.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_tallow_carapace',
    name: 'Tallow Carapace',
    level: 5,
    specialization: 'fetish_crafter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(1, 30),
    targetingConfig: ally(1, 20),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 30% Tallow to coat an ally in hardened alchemical wax for 2 rounds. Grants +3 AC and complete immunity to critical hits.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, tallow: 30 }, effects: [effect('buff.wax_carapace', {}, '+3 AC and crit immunity.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },

  // LEVEL 6
  {
    ...flags,
    id: 'wd_withering_scourge',
    name: 'Withering Scourge',
    level: 6,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Bloody Slash',
    resourceCost: apCost(2, 40),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage', 'dot'],
    damageConfig: damage('4d8 + spirit', ['necrotic']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: ['bleeding'],
    area: null,
    description: 'Spend 40% Tallow to lash a target with concentrated rot, dealing 4d8 necrotic damage and causing them to rot for 2d6 damage next turn.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 40 }, effects: [effect('damage.rot_scourge', {}, '4d8 + 2d6 rot DoT.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_effigy_transposition',
    name: 'Effigy Transposition',
    level: 6,
    specialization: 'fetish_crafter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Teleport',
    resourceCost: apCost(1, 30),
    targetingConfig: target(['effigy'], 1, 30),
    effectTypes: ['mobility'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 30% Tallow to collapse into smoke and instantly swap positions with an active effigy or talisman up to 30 ft away.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, tallow: 30 }, effects: [effect('mobility.effigy_swap', {}, 'Swap places with effigy.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_cauldron_breath',
    name: 'Cauldron Breath',
    level: 6,
    specialization: 'miasmist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Fire/Fireball Impact',
    resourceCost: apCost(2, 40),
    targetingConfig: area(15),
    effectTypes: ['damage'],
    damageConfig: damage('3d10 + spirit', ['blight']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 40% Tallow to vent a spray of boiling cauldron steam in a 15 ft cone, dealing 3d10 + Spirit blight damage and corroding 2 AC from affected foes.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 40 }, effects: [effect('damage.cauldron_steam', {}, '3d10 steam + -2 AC.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_stagnant_stasis',
    name: 'Stagnant Stasis',
    level: 6,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Time Warp',
    resourceCost: apCost(2, 30),
    targetingConfig: enemy(1, 30),
    effectTypes: ['crowd_control'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'constitution', dcFormula: '10 + spirit' },
    conditions: ['rooted'],
    area: null,
    description: 'Spend 30% Tallow to encase an enemy in rapidly hardening bog peat. On failed Constitution save, target is immobilized and cannot act for 1 round.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 30 }, effects: [effect('cc.peat_stasis', {}, 'Immobilize in peat.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },

  // LEVEL 7
  {
    ...flags,
    id: 'wd_curse_of_the_grave_hush',
    name: 'Curse of the Grave Hush',
    level: 7,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Silence',
    resourceCost: apCost(3, 50),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('4d8 + spirit', ['necrotic']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'spirit', dcFormula: '10 + spirit' },
    conditions: [],
    area: null,
    description: 'Spend 50% Tallow to curse a foe with grave silence. Deals 4d8 necrotic damage and renders the target incapable of speaking or verbal spellcasting for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 50 }, effects: [effect('curse.silence', {}, '4d8 necrotic + silence.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_sanctuary_of_the_bog',
    name: 'Sanctuary of the Bog',
    level: 7,
    specialization: 'fetish_crafter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(2, 40),
    targetingConfig: area(20),
    effectTypes: ['healing'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 40% Tallow to sanctify a 20 ft marsh sanctuary for 3 rounds. Allies inside regenerate 10 HP at the start of each of their turns.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 40 }, effects: [effect('healing.marsh_regen', { amount: 10 }, '10 HP regen/round.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_pestilential_burst',
    name: 'Pestilential Burst',
    level: 7,
    specialization: 'miasmist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Nature/Poison Spray',
    resourceCost: apCost(3, 50),
    targetingConfig: area(20),
    effectTypes: ['damage'],
    damageConfig: damage('5d8 + spirit', ['blight']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 50% Tallow to detonate an active effigy or slain foe, triggering a catastrophic spray of rot dealing 5d8 blight damage in a 20 ft radius.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 50 }, effects: [effect('damage.pestilence_burst', {}, '5d8 corpse/effigy detonation.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_sympathetic_shackle',
    name: 'Sympathetic Shackle',
    level: 7,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Chains',
    resourceCost: apCost(2, 40),
    targetingConfig: enemy(1, 30),
    effectTypes: ['crowd_control'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'spirit', dcFormula: '10 + spirit' },
    conditions: [],
    area: null,
    description: 'Spend 40% Tallow to bind an enemy movement directly to your effigy. Target cannot move more than 20 ft away from you for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 40 }, effects: [effect('cc.tether_movement', {}, 'Tether target to witch doctor.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },

  // LEVEL 8
  {
    ...flags,
    id: 'wd_cataclysmic_miasma',
    name: 'Cataclysmic Miasma',
    level: 8,
    specialization: 'miasmist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Nature/Poison Spray',
    resourceCost: apCost(3, 60),
    targetingConfig: area(30),
    effectTypes: ['damage'],
    damageConfig: damage('6d8 + spirit', ['blight', 'poison']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Spend 60% Tallow to engulf a 30 ft radius in dense suffocating vapours for 2 rounds, dealing 6d8 blight damage each round to all foes.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 60 }, effects: [effect('damage.cataclysmic_fog', {}, '6d8 damage/round over 30 ft.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_soul_transfusion',
    name: 'Soul Transfusion',
    level: 8,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(3, 50),
    targetingConfig: enemy(1, 30),
    effectTypes: ['healing'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 50% Tallow to siphon 30 HP from a hexed enemy and distribute that 30 HP equally among wounded allies within 30 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 50 }, effects: [effect('healing.soul_transfuse', { amount: 30 }, 'Drain 30 HP and heal party.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_heart_pierce_poppet',
    name: 'Heart Pierce Poppet',
    level: 8,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Piercing/Deep Pierce',
    resourceCost: apCost(2, 60),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage'],
    damageConfig: damage('6d10 + spirit', ['necrotic']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 60% Tallow to drive an obsidian spike through a poppet, dealing 6d10 + Spirit necrotic damage to the linked foe.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 60 }, effects: [effect('damage.heart_pierce', {}, '6d10 necrotic heart strike.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_sacrificial_effigy_ward',
    name: 'Sacrificial Effigy Ward',
    level: 8,
    specialization: 'fetish_crafter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(2, 50),
    targetingConfig: ally(1, 20),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 50% Tallow to bind a sacrificial wax poppet to an ally. If they take fatal damage within 3 rounds, the poppet shatters to restore them to 30 HP.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 50 }, effects: [effect('buff.death_prevention', { restoreHp: 30 }, 'Prevent death and heal to 30 HP.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },

  // LEVEL 9
  {
    ...flags,
    id: 'wd_curse_of_the_rotting_world',
    name: 'Curse of the Rotting World',
    level: 9,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Curse',
    resourceCost: apCost(3, 70),
    targetingConfig: area(30),
    effectTypes: ['damage', 'debuff'],
    damageConfig: damage('7d8 + spirit', ['blight']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Spend 70% Tallow to afflict all enemies across 30 ft with the rotting curse, dealing 7d8 blight damage and giving them disadvantage on all saves for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 70 }, effects: [effect('curse.rotting_world', {}, '7d8 blight + disadvantage on saves.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_breath_of_immortality',
    name: 'Breath of Immortality',
    level: 9,
    specialization: 'fetish_crafter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(3, 60),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 60% Tallow to inhale pure distilled peat life-essence. For 1 round, you cannot take damage or be affected by any condition.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 60 }, effects: [effect('buff.invulnerable_self', {}, 'Complete damage immunity for 1 round.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_primordial_cauldron_eruption',
    name: 'Primordial Cauldron Eruption',
    level: 9,
    specialization: 'miasmist',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Fire/Fireball Impact',
    resourceCost: apCost(3, 70),
    targetingConfig: area(20),
    effectTypes: ['damage'],
    damageConfig: damage('7d10 + spirit', ['blight']),
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 70% Tallow to detonate your boiling rendering cauldron, releasing an acid-blight eruption dealing 7d10 damage in a 20 ft radius.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 70 }, effects: [effect('damage.cauldron_detonation', {}, '7d10 blight explosion.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_effigy_mastery',
    name: 'Effigy Mastery',
    level: 9,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Aura',
    resourceCost: apCost(2, 50),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 50% Tallow to enter effigy communion for 3 rounds: you may maintain up to 3 active sympathetic poppets simultaneously.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 50 }, effects: [effect('buff.multi_poppet', {}, 'Maintain 3 poppets.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },

  // LEVEL 10
  {
    ...flags,
    id: 'wd_grand_mire_hex',
    name: 'Grand Mire Hex',
    level: 10,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Curse',
    resourceCost: apCost(3, 100),
    targetingConfig: area(30),
    effectTypes: ['damage'],
    damageConfig: damage('10d10 + spirit', ['blight', 'necrotic']),
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Discharge all 100% Bog Tallow to summon the prime rot of the Bryngloom mire, dealing 10d10 total damage to all enemies within 30 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 100 }, effects: [effect('damage.grand_mire_hex', {}, '10d10 max tallow burst.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_eternal_effigy_bond',
    name: 'Eternal Effigy Bond',
    level: 10,
    specialization: 'fetish_crafter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(3, 80),
    targetingConfig: area(30),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Spend 80% Tallow to bind all allies into a sympathetic vitality loop for 3 rounds: whenever any ally is healed, all other allies heal for that same amount.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 80 }, effects: [effect('buff.shared_healing', {}, 'Shared party healing loop.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_death_poppet_execution',
    name: 'Death Poppet Execution',
    level: 10,
    specialization: 'hexbinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Bloody Slash',
    resourceCost: apCost(3, 90),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage'],
    damageConfig: damage('8d12 + spirit', ['necrotic']),
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'constitution', dcFormula: '10 + spirit' },
    conditions: [],
    area: null,
    description: 'Spend 90% Tallow to crush an enemy poppet into dust. Deal 8d12 necrotic damage; if the target has 50 HP or less after damage, they must succeed on a Con save or die instantly.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 90 }, effects: [effect('damage.death_poppet', {}, '8d12 necrotic and execute check.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_primordial_bog_rebirth',
    name: 'Primordial Bog Rebirth',
    level: 10,
    specialization: 'fetish_crafter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(3, 80),
    targetingConfig: area(30),
    effectTypes: ['healing'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Spend 80% Tallow to sacrifice your cauldron to the primordial mire. Fully restore all allies (living and fallen) to full HP and remove all negative conditions.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 80 }, effects: [effect('healing.full_party_revive', {}, 'Full party revival and restore.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  }
];

export const WITCH_DOCTOR_SIGNATURE_RECORDS = [
  {
    ...flags,
    id: 'wd_sig_sympathetic_poppet',
    name: 'Sympathetic Poppet',
    level: 3,
    specialization: 'hexbinder',
    treeId: 'hexbinder',
    source: 'signature',
    spellType: 'ACTION',
    icon: 'Piercing/Deep Pierce',
    resourceCost: apCost(1, 20),
    targetingConfig: enemy(1, 30),
    effectTypes: ['debuff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 20% Tallow to sculpt a sympathetic wax poppet linked to a hexed target for 3 rounds. Attacks made against the poppet deal damage directly to the target regardless of range.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, tallow: 20 }, effects: [effect('signature.sympathetic_poppet', {}, 'Sculpt sympathetic poppet.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_sig_cauldron_of_vapors',
    name: 'Cauldron of Vapors',
    level: 3,
    specialization: 'miasmist',
    treeId: 'miasmist',
    source: 'signature',
    spellType: 'ACTION',
    icon: 'Nature/Poison Spray',
    resourceCost: apCost(2, 20),
    targetingConfig: area(15),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('2d6 + spirit', ['blight']),
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 20% Tallow to deploy a boiling crucible emitting a 15 ft cloud of choking vapors for 3 rounds. Deals 2d6 blight damage and blinds enemies inside.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, tallow: 20 }, effects: [effect('signature.cauldron_vapors', {}, 'Boiling vapor cloud.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_sig_warding_effigy',
    name: 'Warding Effigy',
    level: 3,
    specialization: 'fetish_crafter',
    treeId: 'fetish_crafter',
    source: 'signature',
    spellType: 'ACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(1, 20),
    targetingConfig: area(10),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 10 },
    description: 'Spend 20% Tallow to plant a protective bone-and-peat effigy for 3 rounds. Allies within 10 ft gain +2 AC and DR 3/- against physical damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, tallow: 20 }, effects: [effect('signature.warding_effigy', {}, '+2 AC and DR 3/-.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  }
];

export const WITCH_DOCTOR_CAPSTONE_RECORDS = [
  {
    ...flags,
    id: 'wd_cap_curse_of_the_black_mire',
    name: 'Curse of the Black Mire',
    level: 10,
    specialization: 'hexbinder',
    treeId: 'hexbinder',
    source: 'capstone',
    spellType: 'ACTION',
    icon: 'Utility/Curse',
    resourceCost: apCost(3, 60),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('5d10 + spirit', ['necrotic']),
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'constitution', dcFormula: '10 + spirit' },
    conditions: [],
    area: null,
    description: 'Spend 60% Tallow to strike a foe with Black Mire rot. Deals 5d10 necrotic damage and paralyzes them for 1 round on a failed Constitution save.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 60 }, effects: [effect('capstone.black_mire_rot', {}, '5d10 + paralyze.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_cap_primordial_marsh_gale',
    name: 'Primordial Marsh Gale',
    level: 10,
    specialization: 'miasmist',
    treeId: 'miasmist',
    source: 'capstone',
    spellType: 'ACTION',
    icon: 'Nature/Poison Spray',
    resourceCost: apCost(3, 60),
    targetingConfig: area(30),
    effectTypes: ['damage'],
    damageConfig: damage('4d8 + spirit', ['blight']),
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Spend 60% Tallow to summon a 30 ft gale of toxic marsh gases for 3 rounds. Deals 4d8 blight damage to all enemies each turn and obscures vision.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 60 }, effects: [effect('capstone.marsh_gale', {}, '4d8 damage/round gale.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  },
  {
    ...flags,
    id: 'wd_cap_great_bog_totem',
    name: 'Great Bog Totem',
    level: 10,
    specialization: 'fetish_crafter',
    treeId: 'fetish_crafter',
    source: 'capstone',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(3, 60),
    targetingConfig: area(20),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 60% Tallow to plant the Great Bog Totem for 3 rounds. Grants 30 temporary HP to all allies within 20 ft and absorbs all negative conditions.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, tallow: 60 }, effects: [effect('capstone.great_bog_totem', {}, '30 temp HP and condition absorb.')], executable: false },
    sourceRefs: ['Witch Doctor Content Lock']
  }
];

export const WITCH_DOCTOR_TALENT_ACTIVE_RECORDS = [
  ...WITCH_DOCTOR_SIGNATURE_RECORDS,
  ...WITCH_DOCTOR_CAPSTONE_RECORDS
];

export const WITCH_DOCTOR_ALL_RECORDS = [
  ...WITCH_DOCTOR_CORE_RECORDS,
  ...WITCH_DOCTOR_OPTIONAL_POOL,
  ...WITCH_DOCTOR_TALENT_ACTIVE_RECORDS,
  ...WITCH_DOCTOR_PASSIVE_RECORDS
];

export const WITCH_DOCTOR_PROJECTED_SPELLS = WITCH_DOCTOR_ALL_RECORDS;

export const WITCH_DOCTOR_PROJECTED_SPELLS_BY_ID = Object.fromEntries(
  WITCH_DOCTOR_PROJECTED_SPELLS.map(spell => [spell.id, spell])
);

export const WITCH_DOCTOR_OPTIONAL_RECORDS = WITCH_DOCTOR_OPTIONAL_POOL;

export const WITCH_DOCTOR_SPELL_POOLS = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    return [level, WITCH_DOCTOR_OPTIONAL_RECORDS.filter(spell => spell.level === level).map(spell => spell.id)];
  })
);

export const WITCH_DOCTOR_PROGRESSION_POLICY = {
  classId: WITCH_DOCTOR_CLASS_ID,
  maxLevel: 10,
  startingSpellPicks: 1,
  optionalPicksPerLevel: 1,
  allowEarlierUnchosen: true,
  grantedCoreSpellIds: WITCH_DOCTOR_CORE_RECORDS.map(spell => spell.id),
  randomizeStartingSpells: false,
  autoTopUpOnLoad: false,
  talentActivesAreGrants: true,
  manualOnly: true
};

const witchDoctorNodeById = Object.fromEntries(WITCH_DOCTOR_TALENT_NODES.map(node => [node.id, node]));
const witchDoctorTreePoints = (ranks, treeId) => WITCH_DOCTOR_TALENT_NODES
  .filter(node => node.treeId === treeId)
  .reduce((total, node) => total + (ranks[node.id] || 0), 0);

export const pruneWitchDoctorTalents = (talents, characterLevel) => {
  const ranks = talents && typeof talents === 'object' ? { ...talents } : {};
  const level = Number.isInteger(characterLevel) ? Math.max(1, characterLevel) : 10;
  Object.keys(ranks).forEach(nodeId => {
    const node = witchDoctorNodeById[nodeId];
    if (!node || !Number.isInteger(ranks[nodeId]) || ranks[nodeId] < 1 || ranks[nodeId] > node.maxRanks) {
      delete ranks[nodeId];
    }
  });

  const pruneStructure = () => {
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of WITCH_DOCTOR_TALENT_NODES) {
        const rank = ranks[node.id];
        if (!rank) continue;
        const gatePoints = witchDoctorTreePoints(ranks, node.treeId) - rank;
        const predecessorMissing = node.requires.some(predecessorId => {
          const predecessor = witchDoctorNodeById[predecessorId];
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
    WITCH_DOCTOR_TALENT_NODES.forEach(node => {
      if (!ranks[node.id]) return;
      if (target === null || node.minLevel >= witchDoctorNodeById[target].minLevel) target = node.id;
    });
    if (target === null) break;
    ranks[target] -= 1;
    if (ranks[target] === 0) delete ranks[target];
    pruneStructure();
  }
  return ranks;
};

export function validateWitchDoctorState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return { valid: false, errors: ['state must be an object'] };
  const tallow = Number(state.tallow ?? state.current ?? 50);
  if (!Number.isInteger(tallow) || tallow < 0 || tallow > 100) {
    errors.push('tallow must be an integer from 0 to 100');
  }
  return { valid: errors.length === 0, errors };
}

export const WITCH_DOCTOR_DATA = {
  id: WITCH_DOCTOR_CLASS_ID,
  name: 'Witch Doctor',
  icon: WITCH_DOCTOR_ICON,
  role: 'Support / Control',
  roleColor: '#15803d',
  damageTypes: ['blight', 'necrotic', 'poison'],
  resource: 'Bog Tallow',
  complexityRating: 4,
  cognitiveTags: ['Bog Witchcraft', 'Sympathetic Effigies', 'Manual Tabletop'],
  playstyle: 'Brew noxious bog cauldrons, harvest tallow from suffering foes, sculpt sympathetic wax poppets to bind targets from afar, and spread suffocating miasmas. No automatic tallow spending, poppet binding, or damage scripting. Development — manual tabletop.',
  developmentStatus: 'development',
  manualOnly: true,
  overview: {
    title: 'The Witch Doctor',
    subtitle: 'Sovereign of the Bryngloom Mire & Effigy Binder',
    illustration: '/assets/images/classes/witchdoctor_illustration.png',
    illustrationCaption: 'A bog alchemist sculpting wax effigies over a boiling peat crucible.',
    originStory: 'Nesta the Bryngloom herbalist bargained with the ancient spirits of the deep marsh to cure the spore-hush that ravaged her settlement. Using rendered tallow, peat crucibles, and bone needles, she bound the suffering of her people into effigies, establishing the first traditions of sympathetic bog craft.',
    quickOverview: {
      title: 'Quick Overview',
      content: 'The Witch Doctor tracks Bog Tallow (0-100%). Tallow is spent to sculpt sympathetic poppets that reflect damage to linked targets, brew toxic clouds from cauldrons, and apply withering curses to hostile creatures. Manual tabletop tracking.'
    }
  },
    resourceSystem: {
    id: 'bog_tallow',
    name: 'Bog Tallow',
    title: 'Bog Tallow',
    mechanic: 'Bog Tallow (0-100%) rendered for effigies and miasmas'
  },
  specializations: {
    title: 'Three Bog Occult Disciplines',
    description: 'First investment chooses a primary mire tree. Five talent points per level, global cap fifty. Signatures require ten same-tree points at level three; capstones forty-five at level ten.',
    specs: [
      {
        id: 'hexbinder',
        name: 'Hexbinder',
        icon: 'fas fa-skull',
        theme: 'Sympathetic poppets, wax needles, distant torment, and soul-tethered retribution.',
        description: 'Sympathetic poppets, wax needles, distant torment, and soul-tethered retribution.',
        playstyle: 'Sympathetic poppet manipulation, curse redirection, and needle torment.'
      },
      {
        id: 'miasmist',
        name: 'Miasmist',
        icon: 'fas fa-biohazard',
        theme: 'Caustic bog vapors, peat crucibles, lingering suffocating plumes, and epidemic clouds.',
        description: 'Caustic bog vapors, peat crucibles, lingering suffocating plumes, and epidemic clouds.',
        playstyle: 'Mire plume zones, area denial, and suffocating vapors.'
      },
      {
        id: 'fetish_crafter',
        name: 'Fetish Crafter',
        icon: 'fas fa-bone',
        theme: 'Carved bone talismans, protective rendered waxes, sympathetic shields, and sacrificial effigies.',
        description: 'Carved bone talismans, protective rendered waxes, sympathetic shields, and sacrificial effigies.',
        playstyle: 'Tallow effigies, sympathetic damage deflection, and herbal salves.'
      }
    ]
  },
  classFeatures: [
    {
      level: 1,
      name: 'Bog Tallow & Sympathetic Effigies',
      description: 'Track Bog Tallow from 0 to 100%. Spend tallow on sympathetic poppets, herbal salves, and miasmas.'
    },
    {
      level: 1,
      name: 'Core Witchcraft Grants',
      description: 'Gain Bog Hex and Render Tallow as permanent baseline abilities that do not consume optional spell picks.'
    }
  ],
  spells: WITCH_DOCTOR_PROJECTED_SPELLS,
  exampleSpells: WITCH_DOCTOR_PROJECTED_SPELLS,
  optionalSpellsByLevel: WITCH_DOCTOR_SPELL_POOLS,
  spellPools: WITCH_DOCTOR_SPELL_POOLS,
  talentTrees: WITCH_DOCTOR_TREES,
  progression: {
    policy: WITCH_DOCTOR_PROGRESSION_POLICY,
    spellPools: WITCH_DOCTOR_SPELL_POOLS,
    ...WITCH_DOCTOR_PROGRESSION_POLICY
  }
};
