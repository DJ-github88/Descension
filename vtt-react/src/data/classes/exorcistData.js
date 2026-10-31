import {
  EXORCIST_TREE_META,
  EXORCIST_TREES,
  EXORCIST_TALENT_NODES,
  EXORCIST_PASSIVE_RECORDS,
  EXORCIST_TALENT_CAPACITY
} from '../talentTrees/exorcist';

export { EXORCIST_TALENT_CAPACITY };

export const EXORCIST_CLASS_ID = 'exorcist';
export const EXORCIST_RULESET_VERSION = 'cr-review-r1';
export const EXORCIST_ICON = 'fas fa-cross';
export const EXORCIST_MANUAL_NOTICE = 'Manual tabletop only. No automatic sanctity generation, debuff transfer, condition clearing, damage, or expiry.';

const flags = {
  classId: EXORCIST_CLASS_ID,
  rulesetVersion: EXORCIST_RULESET_VERSION,
  authoredOnly: true,
  manualOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualNotice: EXORCIST_MANUAL_NOTICE
};

const instant = { durationType: 'instant', durationValue: 0, durationUnit: 'instant' };
const roundDuration = (rounds = 1) => ({ durationType: 'rounds', durationValue: rounds, durationUnit: 'rounds' });
const minuteDuration = (minutes = 1) => ({ durationType: 'minutes', durationValue: minutes, durationUnit: 'minutes' });
const hourDuration = (hours = 1) => ({ durationType: 'hours', durationValue: hours, durationUnit: 'hours' });
const dayDuration = (days = 1) => ({ durationType: 'days', durationValue: days, durationUnit: 'days' });

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
const area = (feet = 15, range = 30) => ({
  targetingType: 'area',
  rangeType: 'ranged',
  rangeDistance: range,
  targetRestrictions: ['area'],
  maxTargets: 1,
  areaRadius: feet
});

const apCost = (actionPoints, sanctity = 0) => ({
  actionPoints,
  mana: 0,
  purificationSanctity: sanctity,
  resourceTypes: actionPoints > 0 ? ['actionPoints'] : [],
  resourceValues: { actionPoints, mana: 0, purificationSanctity: sanctity },
  useFormulas: {},
  components: ['somatic', 'verbal'],
  somaticText: 'Scatter coarse rock salt, ring consecrated brass bell, or brandish lead-weighted scourge.'
});

const damage = (formula, damageTypes = ['radiant']) => ({ formula, damageTypes, resolution: 'DICE' });
const cooldownNone = { cooldownType: 'turn_based', cooldownValue: 0 };
const cooldownLongRest = { cooldownType: 'long_rest', cooldownValue: 1 };
const effect = (kind, args, description) => ({ kind, args, description, executable: false });

export const EXORCIST_COMMON_MECHANICS = {
  sanctity: 'Purification Sanctity scales from 0 to 10 (Cap 10). Starts at 3; restores to 3 on short rest, 5 on long rest.',
  generation: 'Built by maintaining consecrated thresholds (+1/round), ally mental/fear saves (+2), or entity extractions (+3).',
  depletionPenalty: 'At 0 Sanctity, spiritual shielding collapses: -2 to all Will saves against supernatural terror and possession.',
  motifs: 'Consecrated rock salt, lead seals, brass bells, ritual censers, and sin-eating bread. No demon binding or fiend summoning.',
  hostProtection: 'Preserves the mortal vessel; focuses on extracting corruption and absorbing spiritual harm without slaying hosts.',
  inclusivity: 'Open to all lineages and cultural origins without heritage locks or universal spell immunity.'
};

export const EXORCIST_CORE_RECORDS = [
  {
    ...flags,
    id: 'cr1_exorcist_consecrate_threshold',
    name: 'Consecrate Threshold',
    level: 1,
    specialization: null,
    treeId: null,
    source: 'core',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: area(15, 0),
    effectTypes: ['buff', 'area_sanctuary', 'resource_generation'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15, shape: 'circle' },
    description: 'Draw a rapid salt line or pour consecrated ash along an entryway or perimeter (15 ft radius). Allies within gain +2 to saving throws against possession, fear, and psychic effects; hostile spirits and fiends suffer -10 ft movement upon entering. Generates +1 Sanctity per round maintained inside.',
    classResourceProgram: null,
    manualMechanics: {
      price: { actionPoints: 1, mana: 0, sanctity: 0 },
      effects: [
        effect('sanctuary.threshold', { radius: 15, durationRounds: 3, saveBonus: 2 }, '+2 to saves vs possession/fear/psychic for allies; -10 ft move for fiends/spirits; +1 Sanctity/round.')
      ],
      executable: false
    },
    sourceRefs: ['Exorcist Content Lock']
  },
  {
    ...flags,
    id: 'cr1_exorcist_litany_of_purging',
    name: 'Litany of Purging',
    level: 1,
    specialization: null,
    treeId: null,
    source: 'core',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 1),
    targetingConfig: ally(1, 30),
    effectTypes: ['cleanse', 'utility'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Recite a focused rite of release toward an afflicted ally within 30 ft. Cleanses one active fear, charm, or psychic debuff, transferring the residual spiritual friction into ambient salt.',
    classResourceProgram: null,
    manualMechanics: {
      price: { actionPoints: 1, mana: 0, sanctity: 1 },
      effects: [
        effect('cleanse.purging_litany', { targetRange: 30 }, 'Cleanse 1 active fear, charm, or psychic debuff from an ally.')
      ],
      executable: false
    },
    sourceRefs: ['Exorcist Content Lock']
  }
];

export const EXORCIST_OPTIONAL_RECORDS = [
  // --- LEVEL 1 (4 Options | 2 Non-Damage) ---
  {
    ...flags,
    id: 'exo_salt_brand',
    name: 'Salt Brand',
    level: 1,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 1),
    targetingConfig: enemy(1, 25),
    effectTypes: ['damage', 'debuff'],
    damageConfig: damage('1d8', ['radiant']),
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Sear an unholy foe with sanctified salt crystals. Deals 1d8 radiant damage; target takes +2 bonus damage from all physical and holy attacks for 1 round.',
    manualMechanics: { price: { actionPoints: 1, sanctity: 1 }, effects: [effect('debuff.salt_brand', { bonusVulnerability: 2 }, '+2 physical/holy damage taken for 1 round.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_scourge_of_submission',
    name: 'Scourge of Submission',
    level: 1,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage'],
    damageConfig: damage('1d8 + strength + 1d4', ['slashing', 'radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Strike with a lead-weighted consecrated scourge. Deals 1d8 slashing + 1d4 radiant damage.',
    manualMechanics: { price: { actionPoints: 1, sanctity: 0 }, effects: [effect('damage.scourge', {}, 'Deals 1d8 slashing + 1d4 radiant damage.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_discern_impurity',
    name: 'Discern Impurity',
    level: 1,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 30),
    effectTypes: ['utility', 'detection'],
    damageConfig: null,
    durationConfig: minuteDuration(10),
    cooldownConfig: cooldownNone,
    description: 'Cast ritual salt into the air to discern hidden spiritual intrusions. Detect the presence, tier, and nature of possessing spirits, unseen specters, or psychic grafts within 30 ft.',
    manualMechanics: { price: { actionPoints: 1, sanctity: 0 }, effects: [effect('detect.impurity', { range: 30 }, 'Detect possessing spirits, specters, or psychic grafts.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_sanctified_barrier',
    name: 'Sanctified Barrier',
    level: 1,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 1),
    targetingConfig: ally(1, 30),
    effectTypes: ['buff', 'ward'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    description: 'Grant an ally a 5-point radiant ward that absorbs incoming necrotic or psychic damage for 2 rounds.',
    manualMechanics: { price: { actionPoints: 1, sanctity: 1 }, effects: [effect('ward.sanctified', { points: 5, absorbs: ['necrotic', 'psychic'] }, '5-point ward absorbing necrotic/psychic damage for 2 rounds.')], executable: false }
  },

  // --- LEVEL 2 (4 Options | 3 Non-Damage) ---
  {
    ...flags,
    id: 'exo_cinder_leash',
    name: 'Cinder Leash',
    level: 2,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 1),
    targetingConfig: enemy(1, 20),
    effectTypes: ['damage', 'control'],
    damageConfig: damage('2d6', ['radiant']),
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Latch a glowing consecrated chain onto a foe. Deals 2d6 radiant damage and prevents the target from moving further than 20 ft from you for 1 round.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 1 }, effects: [effect('control.leash', { tetherDistance: 20 }, '2d6 radiant; cannot move >20 ft from caster for 1 round.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_iron_barrier',
    name: 'Iron Barrier',
    level: 2,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 1),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    description: 'Fortify your vestments with ritual lead weights. Gain +3 AC and +2 DR against attacks from fiends, undead, and void entities for 2 rounds.',
    manualMechanics: { price: { actionPoints: 1, sanctity: 1 }, effects: [effect('buff.iron_barrier', { acBonus: 3, drBonus: 2 }, '+3 AC and +2 DR against fiends/undead/void for 2 rounds.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_anointing_oil',
    name: 'Anointing Oil',
    level: 2,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 1),
    targetingConfig: ally(1, 5),
    effectTypes: ['heal', 'utility'],
    damageConfig: null,
    durationConfig: hourDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Anoint a wounded or cursed creature with blessed oils. Restores 2d6 Health and suppresses one active curse for 1 hour.',
    manualMechanics: { price: { actionPoints: 1, sanctity: 1 }, effects: [effect('heal.anointing', { formula: '2d6', curseSuppressionHours: 1 }, 'Heal 2d6 HP and suppress 1 curse for 1 hour.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_litany_of_courage',
    name: 'Litany of Courage',
    level: 2,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: area(20, 0),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: minuteDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Intone an uplifting hymn of fortitude. Allies within 20 ft gain advantage and +2 on saving throws against fear and horror effects for 1 minute.',
    manualMechanics: { price: { actionPoints: 1, sanctity: 0 }, effects: [effect('buff.courage', { radius: 20, saveBonus: 2 }, 'Advantage and +2 on saves vs fear/horror for allies within 20 ft.')], executable: false }
  },

  // --- LEVEL 3 (4 Options | 2 Non-Damage) ---
  {
    ...flags,
    id: 'exo_purge_the_defiled',
    name: 'Purge the Defiled',
    level: 3,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 2),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage'],
    damageConfig: damage('3d8', ['radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Hurl concentrated sacred light at a corrupt target dealing 3d8 radiant damage. Deals +2d8 bonus radiant damage if the target is possessing or controlling another creature.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 2 }, effects: [effect('damage.purge', { base: '3d8', bonusIfPossessing: '2d8' }, '3d8 radiant; +2d8 if target is possessing/controlling another.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_sever_possession',
    name: 'Sever Possession',
    level: 3,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 2),
    targetingConfig: ally(1, 5),
    effectTypes: ['utility', 'cleanse'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Press consecrated lead into an afflicted host, forcing a possessing entity or mental parasite to detach immediately without damaging the host vessel.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 2 }, effects: [effect('cleanse.sever_possession', {}, 'Force possessing entity/parasite to detach safely from host.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_salt_perimeter',
    name: 'Salt Perimeter',
    level: 3,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 2),
    targetingConfig: area(20, 20),
    effectTypes: ['control', 'area_sanctuary'],
    damageConfig: null,
    durationConfig: minuteDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Lay a solid line of rock salt across the battlefield (up to 20 ft line). Fiends and undead cannot cross without succeeding on a DC 16 Spirit save.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 2 }, effects: [effect('control.perimeter', { length: 20, saveDc: 16 }, '20 ft salt line; fiends/undead must make DC 16 Spirit save to cross.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_sin_eater_burden',
    name: 'Sin-Eater Burden',
    level: 3,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 1),
    targetingConfig: ally(1, 30),
    effectTypes: ['cleanse', 'buff', 'resource_generation'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Transfer one negative condition or affliction from an ally within 30 ft onto yourself. Gain +2 Sanctity from the spiritual absorption.',
    manualMechanics: { price: { actionPoints: 1, sanctity: 1 }, effects: [effect('transfer.sin_eating', { sanctityGain: 2 }, 'Transfer 1 debuff from ally to self; gain +2 Sanctity.')], executable: false }
  },

  // --- LEVEL 4 (4 Options | 2 Non-Damage) ---
  {
    ...flags,
    id: 'exo_radiant_censer',
    name: 'Radiant Censer',
    level: 4,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 2),
    targetingConfig: area(15, 0),
    effectTypes: ['damage', 'area_sanctuary'],
    damageConfig: damage('2d6', ['radiant']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    description: 'Swing a smoking bronze censer, filling a 15 ft radius with fragrant, stinging holy smoke. Deals 2d6 radiant damage per round to foes inside and obscures vision for outsiders.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 2 }, effects: [effect('area.censer', { radius: 15, durationRounds: 2 }, '2d6 radiant/turn to foes; obscure vision.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_lead_reliquary_trap',
    name: 'Lead Reliquary Trap',
    level: 4,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 2),
    targetingConfig: target(['enemy', 'spirit'], 1, 5),
    effectTypes: ['utility', 'containment'],
    damageConfig: null,
    durationConfig: dayDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Trap an expelled spirit, demon fragment, or spiritual taint inside a sealed lead reliquary box, preventing it from reforming or returning to the battlefield for 24 hours.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 2 }, effects: [effect('containment.reliquary', { durationHours: 24 }, 'Trap expelled spirit/taint inside sealed reliquary for 24h.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_sacred_fasting',
    name: 'Sacred Fasting',
    level: 4,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: dayDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Commit to ritual purification fasting. Gain complete immunity to ingested poisons, mundane diseases, and nausea for 24 hours.',
    manualMechanics: { price: { actionPoints: 1, sanctity: 0 }, effects: [effect('buff.fasting', { immunity: ['poison', 'disease', 'nausea'] }, 'Immunity to poison, disease, nausea for 24 hours.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_rebuke_intruder',
    name: 'Rebuke Intruder',
    level: 4,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 2),
    targetingConfig: enemy(1, 20),
    effectTypes: ['damage', 'reaction'],
    damageConfig: damage('2d10', ['radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: 'On an ally within 20 ft targeted by a mental domination, fear, or charm spell.',
    description: 'Retaliate when an enemy attempts to invade an ally\'s mind. Deal 2d10 radiant damage to the caster and grant the targeted ally an immediate reroll on their saving throw.',
    manualMechanics: { price: { actionPoints: 1, sanctity: 2 }, effects: [effect('reaction.rebuke', { damage: '2d10 radiant', grantReroll: true }, '2d10 radiant to intruder; ally rerolls mental save.')], executable: false }
  },

  // --- LEVEL 5 (4 Options | 2 Non-Damage) ---
  {
    ...flags,
    id: 'exo_wrath_of_aethil',
    name: 'Wrath of Aethil',
    level: 5,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 3),
    targetingConfig: area(10, 30),
    effectTypes: ['damage', 'debuff'],
    damageConfig: damage('4d10', ['radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Call down a searing column of sacred light (10 ft radius, 30 ft height). Foes take 4d10 radiant damage and must make a Spirit save or be blinded for 1 round.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 3 }, effects: [effect('damage.wrath', { damage: '4d10 radiant', blindCondition: true }, '4d10 radiant column; Spirit save or blinded for 1 round.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_mass_anointing',
    name: 'Mass Anointing',
    level: 5,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: area(20, 0),
    effectTypes: ['heal', 'cleanse'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Cast fragrant sacred oil across the party. Heal all allies within 20 ft for 3d6 Health and cleanse one negative condition from each.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 3 }, effects: [effect('heal.mass_anointing', { formula: '3d6', cleanseConditions: 1 }, 'Heal all allies in 20 ft for 3d6 HP and cleanse 1 condition.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_ward_of_the_immovable',
    name: 'Ward of the Immovable',
    level: 5,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 2),
    targetingConfig: area(15, 0),
    effectTypes: ['buff', 'area_sanctuary'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    description: 'Anchor the physical reality of the area. Allies within a 15 ft radius cannot be teleported, banished, knocked prone, or forcibly moved by spells for 3 rounds.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 2 }, effects: [effect('ward.immovable', { radius: 15, durationRounds: 3 }, 'Allies immune to forced movement, banish, teleport, and prone.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_penitents_mantle',
    name: 'Penitent\'s Mantle',
    level: 5,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 2),
    targetingConfig: selfTarget,
    effectTypes: ['buff', 'resource_generation'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Don the penitent\'s shroud. For 1 round, convert 50% of all incoming damage you receive into bonus Sanctity (up to maximum cap of 10).',
    manualMechanics: { price: { actionPoints: 1, sanctity: 2 }, effects: [effect('buff.penitents_mantle', { convertRate: 0.5 }, 'Convert 50% of damage taken into Sanctity (cap 10).')], executable: false }
  },

  // --- LEVEL 6 (4 Options | 2 Non-Damage) ---
  {
    ...flags,
    id: 'exo_chains_of_chastisement',
    name: 'Chains of Chastisement',
    level: 6,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: target(['enemy'], 2, 30),
    effectTypes: ['damage', 'control'],
    damageConfig: damage('3d10', ['radiant']),
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Manifest glowing lead chains between two foes. Deals 3d10 radiant damage to each and pulls them 15 ft toward each other, binding them together for 1 round.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 3 }, effects: [effect('control.chains', { pullDistance: 15 }, '3d10 radiant; pull 2 foes 15 ft toward each other and bind.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_hallowed_sanctuary',
    name: 'Hallowed Sanctuary',
    level: 6,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: area(20, 30),
    effectTypes: ['area_sanctuary', 'damage'],
    damageConfig: damage('3d8', ['radiant']),
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    description: 'Consecrate a 20 ft zone of pure sanctuary. Undead and fiends cannot enter without taking 3d8 radiant damage each round they remain inside.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 3 }, effects: [effect('sanctuary.hallowed', { radius: 20, damageRounds: '3d8 radiant' }, '20 ft zone; undead/fiends take 3d8 radiant/round inside.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_extract_corruption',
    name: 'Extract Corruption',
    level: 6,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: ally(1, 5),
    effectTypes: ['cleanse', 'heal'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Draw biological and supernatural blights out of an ally\'s flesh. Completely removes all necrotic rot, biological poisons, and supernatural infections, healing for 4d6 Health.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 3 }, effects: [effect('cleanse.extract_corruption', { healFormula: '4d6' }, 'Remove all rot, poison, infections; heal 4d6 HP.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_sacrificial_aegis',
    name: 'Sacrificial Aegis',
    level: 6,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 3),
    targetingConfig: ally(1, 30),
    effectTypes: ['buff', 'reaction'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: 'On an ally within 30 ft suffering damage that would reduce them below 0 HP.',
    description: 'Voluntarily intercept a lethal strike aimed at an ally. You take the damage instead, reduced by 50% through spiritual fortitude.',
    manualMechanics: { price: { actionPoints: 1, sanctity: 3 }, effects: [effect('reaction.sacrificial_aegis', { reductionRate: 0.5 }, 'Intercept lethal blow aimed at ally; take damage reduced by 50%.')], executable: false }
  },

  // --- LEVEL 7 (4 Options | 2 Non-Damage) ---
  {
    ...flags,
    id: 'exo_shattering_anathema',
    name: 'Shattering Anathema',
    level: 7,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 4),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage', 'debuff'],
    damageConfig: damage('5d10', ['radiant']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    description: 'Condemn an unholy adversary with a proclamation of doom. Deals 5d10 radiant damage and shatters supernatural defenses, reducing target DR by 4 for 2 rounds.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 4 }, effects: [effect('damage.anathema', { damage: '5d10 radiant', drReduction: 4 }, '5d10 radiant; reduce target DR by 4 for 2 rounds.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_circle_of_absolute_salt',
    name: 'Circle of Absolute Salt',
    level: 7,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 4),
    targetingConfig: area(20, 0),
    effectTypes: ['control', 'area_sanctuary'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    description: 'Pour an impenetrable consecrated salt circle (20 ft radius). No hostile spells, summoned entities, or extraplanar creatures may cross or affect targets within for 3 rounds.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 4 }, effects: [effect('control.absolute_salt', { radius: 20, durationRounds: 3 }, 'Impassable 20 ft barrier; no spells or summoned entities cross.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_purify_ground',
    name: 'Purify Ground',
    level: 7,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: area(50, 50),
    effectTypes: ['utility', 'cleanse'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Cleanse all corrupted, cursed, or despoiled soil across a 50 ft area, restoring it permanently to blessed earth and dispelling unholy lingering hazards.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 3 }, effects: [effect('cleanse.purify_ground', { radius: 50 }, 'Permanently cleanse corrupted soil and dispel lingering hazards in 50 ft.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_transfigured_vessel',
    name: 'Transfigured Vessel',
    level: 7,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 4),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: minuteDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Radiate pure celestial fervor through your physical frame. Gain +10 ft movement speed, +3 AC, and your melee attacks deal +2d8 bonus radiant damage for 1 minute.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 4 }, effects: [effect('buff.transfigured_vessel', { moveSpeed: 10, acBonus: 3, bonusMeleeDamage: '2d8 radiant' }, '+10 ft move, +3 AC, +2d8 radiant melee damage for 1 minute.')], executable: false }
  },

  // --- LEVEL 8 (4 Options | 2 Non-Damage) ---
  {
    ...flags,
    id: 'exo_pillars_of_consecration',
    name: 'Pillars of Consecration',
    level: 8,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 5),
    targetingConfig: area(10, 40),
    effectTypes: ['damage', 'area_sanctuary'],
    damageConfig: damage('4d10', ['radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Summon 3 distinct pillars of divine light within 40 ft. Each pillar deals 4d10 radiant damage in a 10 ft burst and marks the ground with sacred ash.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 5 }, effects: [effect('damage.pillars', { pillarsCount: 3, burstRadius: 10, damage: '4d10 radiant' }, '3 pillars dealing 4d10 radiant each in 10 ft bursts.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_cleanse_the_bloodline',
    name: 'Cleanse the Bloodline',
    level: 8,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 4),
    targetingConfig: ally(1, 5),
    effectTypes: ['utility', 'cleanse'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Perform a deep ancestral purification rite. Purges deep-seated genetic curses, blood-borne unholy pacts, or ancestral maledictions from an afflicted creature.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 4 }, effects: [effect('cleanse.bloodline', {}, 'Purge ancestral/genetic curses and blood pacts from target.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_immaculate_presence',
    name: 'Immaculate Presence',
    level: 8,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 4),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    description: 'Envelop yourself in unassailable holy grace. Gain total immunity to all necrotic, void, and psychic damage for 2 rounds.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 4 }, effects: [effect('buff.immaculate_presence', { immunities: ['necrotic', 'void', 'psychic'], durationRounds: 2 }, 'Immunity to necrotic, void, psychic damage for 2 rounds.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_smite_the_unclean',
    name: 'Smite the Unclean',
    level: 8,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 5),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'banish'],
    damageConfig: damage('6d10', ['radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Deliver a devastating sanctified strike. Deals 6d10 radiant damage; if the target is an extraplanar entity with 40 or fewer Health remaining, it is immediately banished.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 5 }, effects: [effect('damage.smite_unclean', { damage: '6d10 radiant', banishHpThreshold: 40 }, '6d10 radiant; banishes extraplanar target if HP <= 40.')], executable: false }
  },

  // --- LEVEL 9 (4 Options | 2 Non-Damage) ---
  {
    ...flags,
    id: 'exo_cataclysmic_exorcism',
    name: 'Cataclysmic Exorcism',
    level: 9,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 6),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage', 'cleanse'],
    damageConfig: damage('7d10', ['radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Unleash absolute sacred condemnation against a possessed entity. Deals 7d10 pure radiant damage to the invading spirit and safely binds it into a lead seal without harming the host.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 6 }, effects: [effect('damage.cataclysmic_exorcism', { damage: '7d10 radiant', safeExtraction: true }, '7d10 radiant; extract and bind spirit safely.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_resurrection_of_the_cleansed',
    name: 'Resurrection of the Cleansed',
    level: 9,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 6),
    targetingConfig: ally(1, 5),
    effectTypes: ['utility', 'resurrection'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownLongRest,
    description: 'Call back the spirit of a creature that died from possession or spiritual taint within the last round. Restores the creature to life with 50% maximum Health.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 6 }, effects: [effect('resurrection.cleansed', { restoreHpPercent: 50 }, 'Revive target killed by possession within 1 round at 50% HP.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_celestial_shield',
    name: 'Celestial Shield',
    level: 9,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 5),
    targetingConfig: area(30, 0),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    description: 'Radiate an expansive celestial dome. All allies within 30 ft gain 30 temporary Health and complete immunity to all negative conditions for 2 rounds.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 5 }, effects: [effect('buff.celestial_shield', { tempHp: 30, conditionImmunity: true, durationRounds: 2 }, '30 temp HP and condition immunity to allies within 30 ft.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_scourge_of_judgment',
    name: 'Scourge of Judgment',
    level: 9,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 5),
    targetingConfig: area(20, 20),
    effectTypes: ['damage', 'control'],
    damageConfig: damage('6d8', ['radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Lash the air with a massive arc of holy fury (20 ft cone). Deals 6d8 radiant damage to all enemies caught within and knocks them prone.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 5 }, effects: [effect('damage.scourge_judgment', { damage: '6d8 radiant', knockProne: true }, '6d8 radiant in 20 ft cone; knocks all foes prone.')], executable: false }
  },

  // --- LEVEL 10 (4 Options | 2 Non-Damage) ---
  {
    ...flags,
    id: 'exo_absolute_exile',
    name: 'Absolute Exile',
    level: 10,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 8),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage', 'banish'],
    damageConfig: damage('8d10', ['radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownLongRest,
    description: 'Speak the final decree of expulsion. Deals 8d10 radiant damage; any extraplanar or possessing entity is banished back to its native plane without a saving throw.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 8 }, effects: [effect('banish.absolute_exile', { damage: '8d10 radiant', noSave: true }, '8d10 radiant; banish extraplanar entity with no save.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_the_great_cleansing',
    name: 'The Great Cleansing',
    level: 10,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 8),
    targetingConfig: area(50, 0),
    effectTypes: ['heal', 'cleanse'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownLongRest,
    description: 'Release a blinding shockwave of sacred renewal. Restores all allies within 50 ft to their maximum Health and cleanses every negative condition, curse, and affliction.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 8 }, effects: [effect('heal.great_cleansing', { radius: 50, fullHeal: true, cleanseAll: true }, 'Heal all allies in 50 ft to max HP; cleanse all conditions.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_monument_of_salt',
    name: 'Monument of Salt',
    level: 10,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 8),
    targetingConfig: enemy(1, 30),
    effectTypes: ['control', 'petrify'],
    damageConfig: null,
    durationConfig: minuteDuration(60),
    cooldownConfig: cooldownLongRest,
    description: 'Crystallize an unholy creature\'s corrupt essence. The target must make a DC 20 Fortitude save or be turned permanently into a solid monument of salt.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 8 }, effects: [effect('control.monument_of_salt', { dc: 20 }, 'Turn target into permanent solid salt statue (DC 20 negates).')], executable: false }
  },
  {
    ...flags,
    id: 'exo_sins_of_the_world',
    name: 'Sins of the World',
    level: 10,
    source: 'optional',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 10),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownLongRest,
    description: 'Take the collective suffering of the world upon yourself and transfigure into an avatar of pure light for 3 rounds. All your radiant actions deal maximum possible damage.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 10 }, effects: [effect('buff.sins_avatar', { durationRounds: 3, maxDamage: true }, 'Transfigure for 3 rounds; all radiant actions deal maximum damage.')], executable: false }
  }
];

export const EXORCIST_TALENT_ACTIVE_RECORDS = [
  // --- LITURGIST SIGNATURE & CAPSTONE ---
  {
    ...flags,
    id: 'exo_sig_salt_sanctuary',
    name: 'Salt Sanctuary',
    level: 3,
    specialization: 'liturgist',
    treeId: 'liturgist',
    source: 'talent-signature',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 2),
    targetingConfig: area(15, 0),
    effectTypes: ['buff', 'area_sanctuary'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    description: 'Erect an empowered circle of consecrated salt (15 ft radius). Allies within gain +4 Damage Reduction and regenerate 5 Health per round for 3 rounds.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 2 }, effects: [effect('sanctuary.salt_sanctuary', { radius: 15, drBonus: 4, regen: 5, durationRounds: 3 }, '15 ft salt circle; allies gain +4 DR and regenerate 5 HP/round.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_cap_immovable_bastion',
    name: 'Immovable Bastion',
    level: 10,
    specialization: 'liturgist',
    treeId: 'liturgist',
    source: 'talent-capstone',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 5),
    targetingConfig: area(20, 0),
    effectTypes: ['area_sanctuary', 'buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownLongRest,
    description: 'Conjure an impenetrable dome of solid radiant light (20 ft dome). No hostile attacks, line-of-sight spells, or entities can pierce the dome for 2 rounds.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 5 }, effects: [effect('sanctuary.immovable_bastion', { radius: 20, durationRounds: 2 }, 'Impenetrable radiant dome for 2 rounds; 1 long rest cooldown.')], executable: false }
  },

  // --- SIN-EATER SIGNATURE & CAPSTONE ---
  {
    ...flags,
    id: 'exo_sig_sympathetic_transference',
    name: 'Sympathetic Transference',
    level: 3,
    specialization: 'sineater',
    treeId: 'sineater',
    source: 'talent-signature',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(1, 2),
    targetingConfig: target(['ally'], 2, 30),
    effectTypes: ['cleanse', 'heal'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Absorb all active debuffs from up to 2 allies within 30 ft onto yourself. Heals each cleansed ally for 3d8 Health.',
    manualMechanics: { price: { actionPoints: 1, sanctity: 2 }, effects: [effect('transfer.sympathetic', { maxTargets: 2, healFormula: '3d8' }, 'Absorb debuffs from up to 2 allies; heal each for 3d8 HP.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_cap_vessel_of_pure_cleansing',
    name: 'Vessel of Pure Cleansing',
    level: 10,
    specialization: 'sineater',
    treeId: 'sineater',
    source: 'talent-capstone',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 4),
    targetingConfig: area(30, 0),
    effectTypes: ['damage', 'cleanse'],
    damageConfig: damage('6d10', ['radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownLongRest,
    description: 'Release all absorbed spiritual corruption in a devastating 30 ft radiant nova. Deals 6d10 radiant damage to all foes and purges all active conditions from yourself.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 4 }, effects: [effect('damage.vessel_nova', { radius: 30, damage: '6d10 radiant', selfCleanse: true }, '30 ft nova dealing 6d10 radiant and purging all self conditions.')], executable: false }
  },

  // --- PURGER SIGNATURE & CAPSTONE ---
  {
    ...flags,
    id: 'exo_sig_lead_seal_rite',
    name: 'Lead Seal Rite',
    level: 3,
    specialization: 'purger',
    treeId: 'purger',
    source: 'talent-signature',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: enemy(1, 20),
    effectTypes: ['debuff', 'control'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    description: 'Brand an unholy enemy with a heavy lead seal. Target cannot cast spells, use supernatural actions, or regenerate Health for 2 rounds.',
    manualMechanics: { price: { actionPoints: 2, sanctity: 3 }, effects: [effect('debuff.lead_seal', { durationRounds: 2, silence: true, preventRegen: true }, 'Target silenced and cannot regenerate for 2 rounds.')], executable: false }
  },
  {
    ...flags,
    id: 'exo_cap_total_anathema',
    name: 'Total Anathema',
    level: 10,
    specialization: 'purger',
    treeId: 'purger',
    source: 'talent-capstone',
    spellType: 'ACTION',
    icon: EXORCIST_ICON,
    resourceCost: apCost(3, 6),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'banish'],
    damageConfig: damage('7d10', ['radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownLongRest,
    description: 'Execute an absolute ritual strike with the lead-weighted scourge. Deals 7d10 radiant damage and severs all supernatural bonds, wards, and buffs on the target.',
    manualMechanics: { price: { actionPoints: 3, sanctity: 6 }, effects: [effect('damage.total_anathema', { damage: '7d10 radiant', severBonds: true }, '7d10 radiant strike; severs all supernatural bonds and buffs.')], executable: false }
  }
];

export { EXORCIST_PASSIVE_RECORDS };

export const EXORCIST_ALL_RECORDS = [
  ...EXORCIST_CORE_RECORDS,
  ...EXORCIST_OPTIONAL_RECORDS,
  ...EXORCIST_TALENT_ACTIVE_RECORDS,
  ...EXORCIST_PASSIVE_RECORDS
];

export const EXORCIST_PROJECTED_SPELLS = EXORCIST_ALL_RECORDS.map(recordEntry => ({
  ...recordEntry,
  class: 'Exorcist',
  specialization: recordEntry.treeId || 'core',
  tags: ['exorcist', 'manual-only', recordEntry.source],
  categoryIds: [],
  specialMechanics: {
    exorcist: {
      ...flags,
      sourceRecordId: recordEntry.id,
      authoredSpell: recordEntry,
      commonRules: EXORCIST_COMMON_MECHANICS,
      rankValues: recordEntry.rankValues || null,
      requires: recordEntry.requires || null
    }
  }
}));

export const EXORCIST_PROJECTED_SPELLS_BY_ID = Object.fromEntries(
  EXORCIST_PROJECTED_SPELLS.map(spell => [spell.id, spell])
);

export const EXORCIST_SPELL_POOLS = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    return [level, EXORCIST_OPTIONAL_RECORDS.filter(spell => spell.level === level).map(spell => spell.id)];
  })
);

export const EXORCIST_PROGRESSION_POLICY = {
  classId: EXORCIST_CLASS_ID,
  rulesetVersion: EXORCIST_RULESET_VERSION,
  levelCap: 10,
  startingSpellPicks: 1,
  optionalPicksPerLevel: 1,
  allowEarlierUnchosen: true,
  grantedCoreSpellIds: EXORCIST_CORE_RECORDS.map(spell => spell.id),
  randomizeStartingSpells: false,
  autoTopUpOnLoad: false,
  talentActivesAreGrants: true,
  manualOnly: true
};

const exorcistNodeById = Object.fromEntries(EXORCIST_TALENT_NODES.map(node => [node.id, node]));
const exorcistTreePoints = (ranks, treeId) => EXORCIST_TALENT_NODES
  .filter(node => node.treeId === treeId)
  .reduce((total, node) => total + (ranks[node.id] || 0), 0);

export const pruneExorcistTalents = (talents, characterLevel) => {
  const ranks = talents && typeof talents === 'object' ? { ...talents } : {};
  const level = Number.isInteger(characterLevel) ? Math.max(1, characterLevel) : 10;
  Object.keys(ranks).forEach(nodeId => {
    const node = exorcistNodeById[nodeId];
    if (!node || !Number.isInteger(ranks[nodeId]) || ranks[nodeId] < 1 || ranks[nodeId] > node.maxRanks) {
      delete ranks[nodeId];
    }
  });

  const pruneStructure = () => {
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of EXORCIST_TALENT_NODES) {
        const rank = ranks[node.id];
        if (!rank) continue;
        const gatePoints = exorcistTreePoints(ranks, node.treeId) - rank;
        const predecessorMissing = node.requires.some(predecessorId => {
          const predecessor = exorcistNodeById[predecessorId];
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
    let targetId = null;
    EXORCIST_TALENT_NODES.forEach(node => {
      if (!ranks[node.id]) return;
      if (targetId === null || node.minLevel >= exorcistNodeById[targetId].minLevel) targetId = node.id;
    });
    if (targetId === null) break;
    ranks[targetId] -= 1;
    if (ranks[targetId] === 0) delete ranks[targetId];
    pruneStructure();
  }
  return ranks;
};

export function validateExorcistState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return { valid: false, errors: ['state must be an object'] };
  const sanctity = Number(state.sanctity ?? state.current ?? 3);
  if (!Number.isInteger(sanctity) || sanctity < 0 || sanctity > 10) {
    errors.push('sanctity must be an integer from 0 to 10');
  }
  return { valid: errors.length === 0, errors };
}

export const EXORCIST_DATA = {
  id: 'exorcist',
  name: 'Exorcist',
  icon: 'fas fa-cross',
  color: '#4f46e5',
  role: 'Sacred Expeller / Host Protector',
  damageTypes: ['radiant', 'slashing', 'bludgeoning', 'force'],
  primaryStats: ['spirit', 'constitution', 'will'],
  developmentStatus: 'development',
  statusLabel: 'Development - manual tabletop',
  manualOnly: true,
  executionEnabled: false,
  restrictions: {
    allowedSubraces: [],
    hardBlocks: [],
    narrativeUnlock: true,
    acquisition: {
      status: 'proposed',
      records: [
        { id: 'salt_apprenticeship', label: 'Salt Apprenticeship', text: 'Apprenticeship in preparing consecrated salt perimeters and thresholds.' },
        { id: 'rite_of_release', label: 'Rite of Release', text: 'Formal initiation into the rites of sacred entity expulsion and host stabilization.' },
        { id: 'lead_seal_discipline', label: 'Lead-Seal Discipline', text: 'Supervised craft in casting lead seals and forging reliquary traps.' }
      ]
    },
    justification: 'The Exorcist order welcomes practitioners of any ancestry willing to take up the sacred salt, weighted scourge, and ministry of purification.'
  },
  classResource: {
    type: 'purification_sanctity',
    base: 3,
    max: 10,
    generationNote: 'Generated from maintaining consecrated thresholds (+1/round), ally mental/fear saves (+2), or entity extractions (+3).',
    mechanicsNote: 'Spent on litanies of purging, sin-eating absorptions, and sacred expulsions. Depleted to 0 gives -2 to Will saves.'
  },
  overview: {
    title: 'The Exorcist',
    subtitle: 'Sacred Expeller, Host Protector, & Sin-Eater',
    originStory: `When otherworldly entities breach the veil, they prey upon the vulnerable, taking root in living vessels and poisoning the spirit. The Exorcist is the sacred tradesman summoned to sever these unholy bonds without destroying the host.

Armed with coarse rock salt, weighted lead scourges, and resonant brass bells, the Exorcist carves sanctified ground out of hostile territory. Rather than wielding destructive arcane force, they practice the arduous discipline of sin-eating—voluntarily taking upon themselves the curses, fears, and blights that afflict their companions.

Through ritual purification and spiritual fortitude, they endure what would shatter lesser vessels, converting mortal suffering into radiant grace. From frontier hamlets haunted by possessing specters to grand vaults threatened by void intrusions, the Exorcist stands as the inviolable barrier between the living and the defiled.`,
    quickOverview: {
      title: 'Class Overview',
      content: `**Who they are**: Sacred tradesmen of purification, host protectors, and sin-eaters who cast out possessing spirits and cleanse spiritual corruption.

**The hook**: Consecrate ground with salt thresholds and absorb afflictions through sin-eating. Maintain Purification Sanctity (0-10) to fuel litanies of purging and radiant expulsion strikes.

**The resource bar & costs**: **Purification Sanctity** (0-10, starts at 3). Build sanctity inside salt rings and when allies resist mental intrusions; spend it to cleanse conditions, absorb burdens, and banish extraplanar threats.

**Bring one for**: Unrivaled condition cleansing, area denial against fiends and undead, defensive sanctuary domes, and high radiant burst.`
    },
    description: 'The Exorcist is a sacred support and host defender specializing in consecrated salt thresholds, sacrificial sin-eating condition transference, and the definitive banishment of invading entities.',
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `**HISTORY: THE CONSECRATED THRESHOLD**
The Exorcist traditions began during the Ashen Weep, when creeping spectral horrors invaded mortal dwellings. Village elders and ascetic healers discovered that coarse salt lines combined with focused rites of release could deny entry to malevolent spirits. Over centuries, these practices crystallized into the Order of the Pure Salt.

**CIVIL RECEPTION**
Exorcists are revered by common folk who live in fear of possession and unseen curses. Templars and church inquisitions regard them with cautious respect, acknowledging their specialized expertise in host preservation where blunter weapons would slaughter the innocent.

**NOTABLE PRACTITIONERS**
* **Father Aaron the Unburdened**: A venerated ascetic who survived absorbing dozens of demonic curses through sin-eating endurance.
* **Sister Valeri of the Salt Gate**: A frontline protector known for defending walled towns against spectral incursions using unbroken salt perimeters.`
    },
    signatureQuote: {
      text: '"The monster seeks the flesh because it fears the void. Drive the terror out, hold the salt line, and the soul will heal."',
      speaker: 'Father Aaron the Unburdened',
      context: 'Before casting out an encroaching fiend at the Ashen Gate'
    }
  },
  specializations: {
    title: 'Three Sacred Disciplines',
    description: 'First investment chooses a primary tree. Five talent points per level, global cap fifty. Signatures require ten same-tree points at level three; capstones forty-five at level ten.',
    specs: EXORCIST_TREE_META.map(meta => ({
      id: meta.id,
      name: meta.name,
      icon: 'fas fa-cross',
      theme: meta.tagline,
      description: meta.tagline,
      playstyle: meta.tagline
    }))
  },
  resourceSystem: {
    id: 'purification_sanctity',
    name: 'Purification Sanctity',
    manualOnly: true,
    executionEnabled: false,
    resourceDefinition: {
      name: 'Purification Sanctity',
      manualOnly: true,
      executionEnabled: false
    }
  },
  spells: EXORCIST_PROJECTED_SPELLS,
  exampleSpells: EXORCIST_PROJECTED_SPELLS,
  progression: {
    policy: EXORCIST_PROGRESSION_POLICY,
    spellPools: EXORCIST_SPELL_POOLS
  },
  spellPools: EXORCIST_SPELL_POOLS,
  talentTrees: EXORCIST_TREES
};

export default EXORCIST_DATA;
