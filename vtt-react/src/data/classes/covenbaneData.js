import {
  COVENBANE_TREE_META,
  COVENBANE_TREES,
  COVENBANE_TALENT_NODES,
  COVENBANE_PASSIVE_RECORDS,
  COVENBANE_TALENT_CAPACITY
} from '../talentTrees/covenbane';

export { COVENBANE_TALENT_CAPACITY };

export const COVENBANE_CLASS_ID = 'covenbane';
export const COVENBANE_RULESET_VERSION = 'cr-review-r1';
export const COVENBANE_ICON = 'fas fa-crosshairs';
export const COVENBANE_MANUAL_NOTICE = 'Manual tabletop only. No automatic charge generation, dispel, ward breaking, stealth, damage, or expiry.';

const flags = {
  classId: COVENBANE_CLASS_ID,
  rulesetVersion: COVENBANE_RULESET_VERSION,
  authoredOnly: true,
  manualOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualNotice: COVENBANE_MANUAL_NOTICE
};

const instant = { durationType: 'instant', durationValue: 0, durationUnit: 'instant' };
const roundDuration = (rounds = 1) => ({ durationType: 'rounds', durationValue: rounds, durationUnit: 'rounds' });
const minuteDuration = (minutes = 1) => ({ durationType: 'minutes', durationValue: minutes, durationUnit: 'minutes' });
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

const apCost = (actionPoints, charges = 0) => ({
  actionPoints,
  mana: 0,
  hexbreakerCharges: charges,
  resourceTypes: actionPoints > 0 ? ['actionPoints'] : [],
  resourceValues: { actionPoints, mana: 0, hexbreakerCharges: charges },
  useFormulas: {},
  components: ['somatic'],
  somaticText: 'Present cold bog-iron weapon or scatter null-salts before resolution.'
});

const damage = (formula, damageTypes = ['slashing']) => ({ formula, damageTypes, resolution: 'DICE' });
const cooldownNone = { cooldownType: 'turn_based', cooldownValue: 0 };
const cooldownLongRest = { cooldownType: 'long_rest', cooldownValue: 1 };
const effect = (kind, args, description) => ({ kind, args, description, executable: false });

export const COVENBANE_COMMON_MECHANICS = {
  price: 'AP and Hexbreaker Charges are explicit. Charges build from spell disruption and parries; decay outside combat.',
  charges: 'Hexbreaker Charges scale from 0 to 6 (Cap 6). Restores to 0 on a completed long rest.',
  motifs: 'Cold bog-iron, alchemical null-salts, and occult investigation. No mandatory weapon or heritage restriction.',
  antiMagic: 'Disrupts spells, parries magical strikes, creates null-zones, and shatters wards without automated combat scripting.',
  inclusivity: 'Open to all lineages and cultural origins without heritage locks or universal spell immunity.'
};

export const COVENBANE_CORE_RECORDS = [
  {
    ...flags,
    id: 'cr1_covenbane_null_strike',
    name: 'Null Strike',
    level: 1,
    specialization: null,
    treeId: null,
    source: 'core',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'anti_magic'],
    damageConfig: damage('1d8 + strength', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Strike with cold bog-iron. Deal weapon damage (slashing/bludgeoning). If target is concentrating on a spell, they make their concentration check with disadvantage.',
    classResourceProgram: null,
    manualMechanics: {
      price: { actionPoints: 1, mana: 0, charges: 0 },
      effects: [effect('anti_magic.null_strike', {}, 'Disadvantage on enemy concentration checks.')],
      executable: false
    },
    sourceRefs: ['Covenbane Content Lock']
  },
  {
    ...flags,
    id: 'cr1_covenbane_draw_null_salt',
    name: 'Draw Null Salt',
    level: 1,
    specialization: null,
    treeId: null,
    source: 'core',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['buff', 'resource_generation'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Scatter a handful of alchemical null-salts across weapon or boots. Gain +1 Hexbreaker Charge and +2 to saving throws against hexes until the end of your next turn.',
    classResourceProgram: { version: 1, domain: 'hexbreaker', op: 'charges.generate', args: { amount: 1 } },
    manualMechanics: {
      price: { actionPoints: 1, mana: 0, charges: 0 },
      effects: [effect('hexbreaker.generate', { amount: 1 }, 'Generate +1 Hexbreaker Charge and +2 save bonus.')],
      executable: false
    },
    sourceRefs: ['Covenbane Content Lock']
  }
];

export const COVENBANE_OPTIONAL_RECORDS = [
  // LEVEL 1 (2 Non-Damage, 2 Damage)
  {
    ...flags,
    id: 'cov_shadow_hunt',
    name: 'Shadow Hunt',
    level: 1,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['utility', 'tracking'],
    damageConfig: null,
    durationConfig: minuteDuration(10),
    cooldownConfig: cooldownNone,
    description: 'Trace residual magical footprints and heat leaks within 60 ft. Reveals invisible magical trails for 10 minutes.',
    manualMechanics: { price: { actionPoints: 1, charges: 0 }, effects: [effect('investigation.tracking', { range: 60 }, 'Reveals magical trails.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_salt_ward',
    name: 'Salt Ward',
    level: 1,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 1),
    targetingConfig: ally(1, 15),
    effectTypes: ['buff', 'defense'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Sprinkle null-salt barrier. Absorbs 4 points of incoming magical/elemental damage. Lasts 1 round.',
    manualMechanics: { price: { actionPoints: 1, charges: 1 }, effects: [effect('ward.absorb', { amount: 4 }, 'Absorbs 4 magical damage.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_hex_strike',
    name: 'Hex Strike',
    level: 1,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 1),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'dispel'],
    damageConfig: damage('2d8 + strength', ['slashing', 'force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: '2d8 slashing + 1d6 force damage. If target has active magical buffs, dispel one minor buff.',
    manualMechanics: { price: { actionPoints: 2, charges: 1 }, effects: [effect('dispel.minor', {}, 'Dispels one minor buff on strike.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_silver_blade',
    name: 'Silver Blade',
    level: 1,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage'],
    damageConfig: damage('1d8 + 1d4', ['slashing', 'radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: '1d8 slashing + 1d4 radiant damage. Deals maximum damage against unholy, necrotic, or shapeshifted targets.',
    manualMechanics: { price: { actionPoints: 1, charges: 0 }, effects: [effect('damage.silver', {}, 'Maximum damage vs unholy/shapeshifted.')], executable: false }
  },

  // LEVEL 2 (3 Non-Damage, 1 Damage)
  {
    ...flags,
    id: 'cov_dark_pursuit',
    name: 'Dark Pursuit',
    level: 2,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['utility', 'movement'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Leap up to 25 ft toward a creature that cast a spell since your last turn.',
    manualMechanics: { price: { actionPoints: 1, charges: 0 }, effects: [effect('movement.leap', { distance: 25 }, 'Leap toward enemy caster.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_bog_iron_parry',
    name: 'Bog-Iron Parry',
    level: 2,
    source: 'optional',
    spellType: 'REACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 1),
    targetingConfig: selfTarget,
    effectTypes: ['defense', 'resource_generation'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Deflect incoming spell attack, reducing damage by 1d10 + Agility and gaining +1 Charge.',
    manualMechanics: { price: { actionPoints: 1, charges: 1 }, effects: [effect('parry.deflect', { amount: '1d10 + agility' }, 'Reduce spell damage and gain +1 charge.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_severing_slash',
    name: 'Severing Slash',
    level: 2,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 1),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'control'],
    damageConfig: damage('2d10 + strength', ['slashing']),
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    description: '2d10 slashing damage; target cannot teleport or use planar movement for 1 round.',
    manualMechanics: { price: { actionPoints: 2, charges: 1 }, effects: [effect('control.dimensional_anchor', { duration: 1 }, 'Blocks teleportation.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_disruptive_shout',
    name: 'Disruptive Shout',
    level: 2,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 1),
    targetingConfig: area(20),
    effectTypes: ['control', 'debuff'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Force all casting enemies in a 20 ft cone to make a Will save or suffer 1 round of Silence.',
    manualMechanics: { price: { actionPoints: 1, charges: 1 }, effects: [effect('control.silence', { radius: 20 }, '1 round of Silence on failed save.')], executable: false }
  },

  // LEVEL 3 (2 Non-Damage, 2 Damage)
  {
    ...flags,
    id: 'cov_null_salts_flask',
    name: 'Null-Salts Flask',
    level: 3,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 2),
    targetingConfig: area(10),
    effectTypes: ['utility', 'zone'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    description: 'Throw a flask creating a 10 ft radius null-zone. Magic cannot be cast inside for 2 rounds.',
    manualMechanics: { price: { actionPoints: 1, charges: 2 }, effects: [effect('zone.null_field', { radius: 10, duration: 2 }, 'Dead magic area for 2 rounds.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_witch_scent',
    name: 'Witch Scent',
    level: 3,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['utility', 'detection'],
    damageConfig: null,
    durationConfig: minuteDuration(5),
    cooldownConfig: cooldownNone,
    description: 'Discern the exact school and tier of any active enchantment within 100 ft.',
    manualMechanics: { price: { actionPoints: 1, charges: 0 }, effects: [effect('detection.enchantment', { range: 100 }, 'Discern school and tier.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_chain_shatter',
    name: 'Chain Shatter',
    level: 3,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 2),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'anti_magic'],
    damageConfig: damage('3d8 + strength', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: '3d8 slashing damage; shatters physical and magical shields (+2d8 bonus damage to ward pools).',
    manualMechanics: { price: { actionPoints: 2, charges: 2 }, effects: [effect('anti_magic.shatter', { bonusWardDamage: '2d8' }, 'Shatters shields and wards.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_cold_iron_gouge',
    name: 'Cold-Iron Gouge',
    level: 3,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 1),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'debuff'],
    damageConfig: damage('2d8 + agility', ['piercing']),
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    description: '2d8 piercing damage; target bleeds for 1d6 physical damage per turn whenever they spend mana.',
    manualMechanics: { price: { actionPoints: 2, charges: 1 }, effects: [effect('debuff.mana_bleed', { bleed: '1d6' }, 'Bleeds upon spending mana.')], executable: false }
  },

  // LEVEL 4 (2 Non-Damage, 2 Damage)
  {
    ...flags,
    id: 'cov_leaden_veil',
    name: 'Leaden Veil',
    level: 4,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 1),
    targetingConfig: selfTarget,
    effectTypes: ['buff', 'defense'],
    damageConfig: null,
    durationConfig: minuteDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Gain advantage on all saves against charm, fear, and psychic influence for 1 minute.',
    manualMechanics: { price: { actionPoints: 1, charges: 1 }, effects: [effect('buff.mental_ward', { duration: 1 }, 'Advantage vs charm, fear, psychic.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_grounding_spike',
    name: 'Grounding Spike',
    level: 4,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 2),
    targetingConfig: enemy(1, 5),
    effectTypes: ['utility', 'redirection'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    description: 'Drive a cold-iron spike into the terrain. Lightning, fire, and storm spells within 20 ft are redirected to the spike.',
    manualMechanics: { price: { actionPoints: 1, charges: 2 }, effects: [effect('redirection.spike', { radius: 20 }, 'Redirects elemental spells.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_punishing_counter',
    name: 'Punishing Counter',
    level: 4,
    source: 'optional',
    spellType: 'REACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 2),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'counter'],
    damageConfig: damage('2d10 + agility', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Triggered when an enemy casts within 5 ft; make an immediate weapon strike dealing 2d10 damage.',
    manualMechanics: { price: { actionPoints: 1, charges: 2 }, effects: [effect('counter.strike', {}, 'Immediate strike on enemy casting.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_abyssal_sever',
    name: 'Abyssal Sever',
    level: 4,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 2),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'banish'],
    damageConfig: damage('3d10', ['force', 'slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: '3d10 force/slashing damage; banishes summoned minions with HP <= 15 instantly.',
    manualMechanics: { price: { actionPoints: 2, charges: 2 }, effects: [effect('banish.minion', { threshold: 15 }, 'Banishes low-HP minions.')], executable: false }
  },

  // LEVEL 5 (2 Non-Damage, 2 Damage)
  {
    ...flags,
    id: 'cov_veil_breaker',
    name: 'Veil Breaker',
    level: 5,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: area(20),
    effectTypes: ['utility', 'dispel'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Cleanse all illusion, invisibility, and shapeshift effects within a 20 ft radius.',
    manualMechanics: { price: { actionPoints: 2, charges: 3 }, effects: [effect('dispel.illusions', { radius: 20 }, 'Cleanses illusions and shapeshifts.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_shackles_of_bog_iron',
    name: 'Shackles of Bog-Iron',
    level: 5,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 2),
    targetingConfig: enemy(1, 25),
    effectTypes: ['control'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    description: 'Cold-iron chains erupt; target speed reduced to 0 and cannot cast spells requiring somatic components for 2 rounds.',
    manualMechanics: { price: { actionPoints: 2, charges: 2 }, effects: [effect('control.chains', { speed: 0, somaticBlock: true }, 'Root and somatic block.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_hexbreaker_execution',
    name: 'Hexbreaker Execution',
    level: 5,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage'],
    damageConfig: damage('4d8 + strength', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: '4d8 slashing damage; deals +2d8 bonus damage if target has cast a spell this encounter.',
    manualMechanics: { price: { actionPoints: 2, charges: 3 }, effects: [effect('damage.execution', { bonus: '2d8' }, 'Bonus damage against active casters.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_radiant_purge',
    name: 'Radiant Purge',
    level: 5,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: area(15),
    effectTypes: ['damage', 'anti_magic'],
    damageConfig: damage('3d8', ['radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: '3d8 radiant damage to all nearby foes; destroys all magical traps/hazards in the radius.',
    manualMechanics: { price: { actionPoints: 2, charges: 3 }, effects: [effect('anti_magic.purge', { radius: 15 }, 'Cleanses magical traps and hazards.')], executable: false }
  },

  // LEVEL 6 (2 Non-Damage, 2 Damage)
  {
    ...flags,
    id: 'cov_ward_inversion',
    name: 'Ward Inversion',
    level: 6,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 3),
    targetingConfig: enemy(1, 30),
    effectTypes: ['utility', 'dispel'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Target enemy magical ward inverts, dealing its remaining shield capacity as pure damage to its bearer.',
    manualMechanics: { price: { actionPoints: 1, charges: 3 }, effects: [effect('dispel.inversion', {}, 'Inverts ward into direct damage.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_occult_dampener',
    name: 'Occult Dampener',
    level: 6,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: area(15),
    effectTypes: ['buff', 'aura'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    description: 'All allies within 15 ft gain +3 to saves against arcane and necrotic spells for 3 rounds.',
    manualMechanics: { price: { actionPoints: 2, charges: 3 }, effects: [effect('aura.dampener', { bonus: 3 }, '+3 saves vs arcane/necrotic.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_bog_iron_whirlwind',
    name: 'Bog-Iron Whirlwind',
    level: 6,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: area(10),
    effectTypes: ['damage', 'aoe'],
    damageConfig: damage('3d10 + strength', ['slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Spin with iron blade; 3d10 slashing to all surrounding enemies and push them back 5 ft.',
    manualMechanics: { price: { actionPoints: 2, charges: 3 }, effects: [effect('damage.whirlwind', { push: 5 }, 'AoE slash with knockback.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_mind_flint_strike',
    name: 'Mind-Flint Strike',
    level: 6,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 2),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'debuff'],
    damageConfig: damage('2d10 + spirit', ['psychic', 'slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: '2d10 psychic/slashing damage; burns 5 points of enemy mana or removes 1 resource charge.',
    manualMechanics: { price: { actionPoints: 2, charges: 2 }, effects: [effect('debuff.mana_burn', { burn: 5 }, 'Burns mana or removes charge.')], executable: false }
  },

  // LEVEL 7 (2 Non-Damage, 2 Damage)
  {
    ...flags,
    id: 'cov_leyline_anchor',
    name: 'Leyline Anchor',
    level: 7,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 4),
    targetingConfig: area(40),
    effectTypes: ['utility', 'zone'],
    damageConfig: null,
    durationConfig: minuteDuration(1),
    cooldownConfig: cooldownNone,
    description: 'Plants a heavy anchor that suppresses all teleportation, planar travel, and summoning within 40 ft for 1 minute.',
    manualMechanics: { price: { actionPoints: 2, charges: 4 }, effects: [effect('zone.anchor', { radius: 40 }, 'Suppresses planar travel and summons.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_null_salts_barrage',
    name: 'Null-Salts Barrage',
    level: 7,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: area(30),
    effectTypes: ['debuff', 'zone'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    description: 'Cone of dense null-salts; all spells passing through the cone suffer a 50% miscast chance for 2 rounds.',
    manualMechanics: { price: { actionPoints: 2, charges: 3 }, effects: [effect('zone.miscast', { chance: 50 }, '50% miscast chance for spells in cone.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_hexbreaker_storm',
    name: 'Hexbreaker Storm',
    level: 7,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(3, 4),
    targetingConfig: area(20),
    effectTypes: ['damage', 'anti_magic'],
    damageConfig: damage('4d10', ['force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: '4d10 force damage to all spellcasters in range; interrupts all active concentration immediately.',
    manualMechanics: { price: { actionPoints: 3, charges: 4 }, effects: [effect('anti_magic.storm', { radius: 20 }, 'Force damage + interrupts concentration.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_apex_predator',
    name: 'Apex Predator',
    level: 7,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: selfTarget,
    effectTypes: ['buff', 'damage'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    description: 'For 3 rounds, your weapon strikes deal +2d8 radiant damage against creatures with innate spellcasting.',
    manualMechanics: { price: { actionPoints: 2, charges: 3 }, effects: [effect('buff.apex', { bonusRadiant: '2d8' }, '+2d8 radiant vs innate casters.')], executable: false }
  },

  // LEVEL 8 (2 Non-Damage, 2 Damage)
  {
    ...flags,
    id: 'cov_silence_shroud',
    name: 'Silence Shroud',
    level: 8,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 4),
    targetingConfig: selfTarget,
    effectTypes: ['utility', 'stealth'],
    damageConfig: null,
    durationConfig: minuteDuration(10),
    cooldownConfig: cooldownNone,
    description: 'Wrap in total sonic and magical silence; immune to detection by magical scrying, tremorsense, or truesight for 10 minutes.',
    manualMechanics: { price: { actionPoints: 2, charges: 4 }, effects: [effect('stealth.absolute', {}, 'Immune to scrying and truesight.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_sanctuary_of_iron',
    name: 'Sanctuary of Iron',
    level: 8,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 4),
    targetingConfig: area(15),
    effectTypes: ['buff', 'defense'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    description: 'Create a dome of cold-iron runes; completely blocks incoming ranged spell projectiles for 2 rounds.',
    manualMechanics: { price: { actionPoints: 2, charges: 4 }, effects: [effect('defense.dome', { radius: 15 }, 'Blocks ranged spell projectiles.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_judgment_day',
    name: 'Judgment Day',
    level: 8,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(3, 5),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'control'],
    damageConfig: damage('5d10 + strength', ['radiant', 'slashing']),
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    description: '5d10 radiant/slashing damage; if target has cast a spell of tier 4+, target is stunned for 1 round.',
    manualMechanics: { price: { actionPoints: 3, charges: 5 }, effects: [effect('damage.stun', { condition: 'stunned' }, 'Stun on high-tier casters.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_anti_magic_storm',
    name: 'Anti-Magic Storm',
    level: 8,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(3, 5),
    targetingConfig: area(30),
    effectTypes: ['damage', 'dispel'],
    damageConfig: damage('5d8', ['force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: '5d8 force damage and cleanses all magical effects (friendly and hostile) from all targets in the area.',
    manualMechanics: { price: { actionPoints: 3, charges: 5 }, effects: [effect('dispel.absolute_cleanse', { radius: 30 }, 'Global dispel in area.')], executable: false }
  },

  // LEVEL 9 (2 Non-Damage, 2 Damage)
  {
    ...flags,
    id: 'cov_sever_ley_threads',
    name: 'Sever Ley Threads',
    level: 9,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 5),
    targetingConfig: enemy(1, 40),
    effectTypes: ['utility', 'anti_magic'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    description: "Completely severs target creature's connection to magical leylines for 2 rounds; target cannot cast spells.",
    manualMechanics: { price: { actionPoints: 2, charges: 5 }, effects: [effect('anti_magic.sever', { duration: 2 }, 'Blocks all spellcasting.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_null_salts_apotheosis',
    name: 'Null-Salts Apotheosis',
    level: 9,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: selfTarget,
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    description: 'Gain temporary HP equal to 5 * your Covenbane level for 3 rounds.',
    manualMechanics: { price: { actionPoints: 2, charges: 3 }, effects: [effect('buff.temp_hp', { formula: '5 * level' }, 'Gain temp HP.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_lethal_anathema',
    name: 'Lethal Anathema',
    level: 9,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(3, 5),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'anti_magic'],
    damageConfig: damage('6d10 + strength', ['radiant', 'slashing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: "6d10 radiant/slashing damage; permanently disables the target's highest-tier spell slot for 24 hours.",
    manualMechanics: { price: { actionPoints: 3, charges: 5 }, effects: [effect('anti_magic.disable_slot', {}, 'Disables highest slot for 24h.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_rupture_leyline',
    name: 'Rupture Leyline',
    level: 9,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(3, 5),
    targetingConfig: area(40),
    effectTypes: ['damage', 'control'],
    damageConfig: damage('5d8', ['force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: 'Rupture the ground in a 40 ft furrow; deals 5d8 force damage and knocks all targets prone.',
    manualMechanics: { price: { actionPoints: 3, charges: 5 }, effects: [effect('control.knockdown', { line: 40 }, 'Knocks prone in 40ft line.')], executable: false }
  },

  // LEVEL 10 (2 Non-Damage, 2 Damage)
  {
    ...flags,
    id: 'cov_orvens_legacy',
    name: "Orven's Legacy",
    level: 10,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(3, 6),
    targetingConfig: area(30),
    effectTypes: ['buff', 'aura'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownLongRest,
    description: 'For 3 rounds, allies within 30 ft gain spell resistance +4 and cannot be charmed or dominated.',
    manualMechanics: { price: { actionPoints: 3, charges: 6 }, effects: [effect('buff.legacy', { resistance: 4 }, 'Spell resistance + immunity to mind control.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_bog_iron_immuration',
    name: 'Bog-Iron Immuration',
    level: 10,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 4),
    targetingConfig: selfTarget,
    effectTypes: ['buff', 'defense'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownLongRest,
    description: 'Encase yourself in impenetrable null-iron for 1 round; immune to all damage, cannot take actions.',
    manualMechanics: { price: { actionPoints: 2, charges: 4 }, effects: [effect('defense.invulnerable', {}, 'Immune to all damage for 1 round.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_barbed_vow_fulfillment',
    name: 'Barbed Vow Fulfillment',
    level: 10,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(3, 6),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'execution'],
    damageConfig: damage('8d10', ['radiant', 'force']),
    durationConfig: instant,
    cooldownConfig: cooldownLongRest,
    description: '8d10 pure damage against a primary spellcaster boss. Cannot be mitigated or reflected.',
    manualMechanics: { price: { actionPoints: 3, charges: 6 }, effects: [effect('damage.unmitigated', {}, '8d10 unmitigated execution damage.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_extinguish_spark',
    name: 'Extinguish Spark',
    level: 10,
    source: 'optional',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(3, 6),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'control'],
    damageConfig: damage('6d12', ['force']),
    durationConfig: instant,
    cooldownConfig: cooldownLongRest,
    description: '6d12 force damage; target is permanently silenced until a completed long rest.',
    manualMechanics: { price: { actionPoints: 3, charges: 6 }, effects: [effect('control.permanent_silence', {}, 'Silenced until long rest.')], executable: false }
  }
];

export const COVENBANE_TALENT_ACTIVE_RECORDS = [
  // Tree 1: Shadowbane Signature & Capstone
  {
    ...flags,
    id: 'cov_sig_null_shroud',
    name: 'Null Shroud',
    level: 3,
    specialization: 'shadowbane',
    treeId: 'shadowbane',
    source: 'talent-signature',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(1, 2),
    targetingConfig: selfTarget,
    effectTypes: ['buff', 'stealth'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    description: 'Cloak in cold mist; gain invisibility against magical detection for 3 rounds.',
    manualMechanics: { price: { actionPoints: 1, charges: 2 }, effects: [effect('stealth.null_shroud', {}, 'Invisible to magical detection.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_cap_aegis_of_bog_iron',
    name: 'Aegis of Bog-Iron',
    level: 10,
    specialization: 'shadowbane',
    treeId: 'shadowbane',
    source: 'talent-capstone',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 4),
    targetingConfig: area(20),
    effectTypes: ['buff', 'defense'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownLongRest,
    description: 'Project an impenetrable dampening field for 2 rounds.',
    manualMechanics: { price: { actionPoints: 2, charges: 4 }, effects: [effect('defense.aegis', { radius: 20 }, 'Impenetrable dampening field.')], executable: false }
  },

  // Tree 2: Spellbreaker Signature & Capstone
  {
    ...flags,
    id: 'cov_sig_leyline_cleaver',
    name: 'Leyline Cleaver',
    level: 3,
    specialization: 'spellbreaker',
    treeId: 'spellbreaker',
    source: 'talent-signature',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 2),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'dispel'],
    damageConfig: damage('3d10 + strength', ['force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: '3d10 force; immediately dispels 2 highest-tier enemy buffs.',
    manualMechanics: { price: { actionPoints: 2, charges: 2 }, effects: [effect('dispel.cleaver', { count: 2 }, 'Dispels 2 highest buffs.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_cap_absolute_severance',
    name: 'Absolute Severance',
    level: 10,
    specialization: 'spellbreaker',
    treeId: 'spellbreaker',
    source: 'talent-capstone',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(3, 5),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'anti_magic'],
    damageConfig: damage('6d10 + strength', ['slashing', 'force']),
    durationConfig: instant,
    cooldownConfig: cooldownLongRest,
    description: '6d10 damage; severs all spell connections and drains 20 enemy mana.',
    manualMechanics: { price: { actionPoints: 3, charges: 5 }, effects: [effect('anti_magic.severance', { manaDrain: 20 }, 'Severs spell connections and drains mana.')], executable: false }
  },

  // Tree 3: Demonhunter Signature & Capstone
  {
    ...flags,
    id: 'cov_sig_barbed_execution',
    name: 'Barbed Execution',
    level: 3,
    specialization: 'demonhunter',
    treeId: 'demonhunter',
    source: 'talent-signature',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(2, 3),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'execution'],
    damageConfig: damage('4d10 + agility', ['slashing', 'radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    description: '4d10 damage; deals double damage to targets below 30% HP.',
    manualMechanics: { price: { actionPoints: 2, charges: 3 }, effects: [effect('damage.execute', { threshold: 30, multiplier: 2 }, 'Double damage below 30% HP.')], executable: false }
  },
  {
    ...flags,
    id: 'cov_cap_void_strata_judgment',
    name: 'Void-Strata Judgment',
    level: 10,
    specialization: 'demonhunter',
    treeId: 'demonhunter',
    source: 'talent-capstone',
    spellType: 'ACTION',
    icon: COVENBANE_ICON,
    resourceCost: apCost(3, 6),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage', 'banish'],
    damageConfig: damage('7d10', ['radiant']),
    durationConfig: instant,
    cooldownConfig: cooldownLongRest,
    description: '7d10 pure damage; target must make a DC 18 save or be banished to the void.',
    manualMechanics: { price: { actionPoints: 3, charges: 6 }, effects: [effect('banish.void_strata', { dc: 18 }, 'DC 18 save or banishment.')], executable: false }
  }
];

export { COVENBANE_PASSIVE_RECORDS };

export const COVENBANE_ALL_RECORDS = [
  ...COVENBANE_CORE_RECORDS,
  ...COVENBANE_OPTIONAL_RECORDS,
  ...COVENBANE_TALENT_ACTIVE_RECORDS,
  ...COVENBANE_PASSIVE_RECORDS
];

export const COVENBANE_PROJECTED_SPELLS = COVENBANE_ALL_RECORDS.map(recordEntry => ({
  ...recordEntry,
  class: 'Covenbane',
  specialization: recordEntry.treeId || 'core',
  tags: ['covenbane', 'manual-only', recordEntry.source],
  categoryIds: [],
  specialMechanics: {
    covenbane: {
      ...flags,
      sourceRecordId: recordEntry.id,
      authoredSpell: recordEntry,
      commonRules: COVENBANE_COMMON_MECHANICS,
      rankValues: recordEntry.rankValues || null,
      requires: recordEntry.requires || null
    }
  }
}));

export const COVENBANE_PROJECTED_SPELLS_BY_ID = Object.fromEntries(
  COVENBANE_PROJECTED_SPELLS.map(spell => [spell.id, spell])
);

export const COVENBANE_SPELL_POOLS = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    return [level, COVENBANE_OPTIONAL_RECORDS.filter(spell => spell.level === level).map(spell => spell.id)];
  })
);

export const COVENBANE_PROGRESSION_POLICY = {
  classId: COVENBANE_CLASS_ID,
  rulesetVersion: COVENBANE_RULESET_VERSION,
  levelCap: 10,
  startingSpellPicks: 1,
  optionalPicksPerLevel: 1,
  allowEarlierUnchosen: true,
  grantedCoreSpellIds: COVENBANE_CORE_RECORDS.map(spell => spell.id),
  randomizeStartingSpells: false,
  autoTopUpOnLoad: false,
  talentActivesAreGrants: true,
  manualOnly: true
};

const covenbaneNodeById = Object.fromEntries(COVENBANE_TALENT_NODES.map(node => [node.id, node]));
const covenbaneTreePoints = (ranks, treeId) => COVENBANE_TALENT_NODES
  .filter(node => node.treeId === treeId)
  .reduce((total, node) => total + (ranks[node.id] || 0), 0);

export const pruneCovenbaneTalents = (talents, characterLevel) => {
  const ranks = talents && typeof talents === 'object' ? { ...talents } : {};
  const level = Number.isInteger(characterLevel) ? Math.max(1, characterLevel) : 10;
  Object.keys(ranks).forEach(nodeId => {
    const node = covenbaneNodeById[nodeId];
    if (!node || !Number.isInteger(ranks[nodeId]) || ranks[nodeId] < 1 || ranks[nodeId] > node.maxRanks) {
      delete ranks[nodeId];
    }
  });

  const pruneStructure = () => {
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of COVENBANE_TALENT_NODES) {
        const rank = ranks[node.id];
        if (!rank) continue;
        const gatePoints = covenbaneTreePoints(ranks, node.treeId) - rank;
        const predecessorMissing = node.requires.some(predecessorId => {
          const predecessor = covenbaneNodeById[predecessorId];
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
    COVENBANE_TALENT_NODES.forEach(node => {
      if (!ranks[node.id]) return;
      if (target === null || node.minLevel >= covenbaneNodeById[target].minLevel) target = node.id;
    });
    if (target === null) break;
    ranks[target] -= 1;
    if (ranks[target] === 0) delete ranks[target];
    pruneStructure();
  }
  return ranks;
};

export function validateCovenbaneState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return { valid: false, errors: ['state must be an object'] };
  const charges = Number(state.charges ?? state.current ?? 0);
  if (!Number.isInteger(charges) || charges < 0 || charges > 6) {
    errors.push('charges must be an integer from 0 to 6');
  }
  return { valid: errors.length === 0, errors };
}

export const COVENBANE_DATA = {
  id: 'covenbane',
  name: 'Covenbane',
  icon: 'fas fa-crosshairs',
  color: '#4b5563',
  role: 'Anti-Magic Hunter',
  damageTypes: ['slashing', 'radiant', 'force', 'piercing'],
  primaryStats: ['agility', 'perception', 'spirit'],
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
        { id: 'barbed_vow', label: 'The Barbed Vow', text: 'Formal initiation into the Barbed Vow.' },
        { id: 'null_salt_training', label: 'Null-Salt Training', text: 'Apprenticeship in preparing and handling alchemical null-salts.' },
        { id: 'tracking_apprenticeship', label: 'Tracking Apprenticeship', text: 'Supervised tracking of residual sorcerous leylines and planar anomalies.' }
      ]
    },
    justification: 'The Covenbane order accepts hunters of any lineage who take up the cold bog-iron and alchemical null-salts.'
  },
  classResource: {
    type: 'hexbreaker_charges',
    base: 0,
    max: 6,
    generationNote: 'Generated from observing and parrying spells, or drawing null-salts; decays out of combat.',
    mechanicsNote: 'Spent on anti-magic counters, silence zones, ward disruption, and execution strikes.'
  },
  overview: {
    title: 'The Covenbane',
    subtitle: 'Martial Occult Hunter & Spellbreaker',
    originStory: `The occult hunters of the Covenbane walk the shadowed margins where reality is frayed by sorcerous ambition. Armed with weapons forged of cold bog-iron and pouches of crystalline null-salts, they study the telltale heat leaks and residual leylines of unnatural workings.

Where others flee reality-warping anomalies, the Covenbane moves forward with measured calm. They do not boast innate magic; instead, they turn hostile sorcery against itself, capturing the friction of broken wards to forge Hexbreaker Charges.

From isolated moors to grand cathedral spires, Covenbanes serve as the final answer to corrupted covens, rogue conjurers, and abyssal breaches. Their craft demands vigilance, patience, and nerves of cold iron.`,
    quickOverview: {
      title: 'Class Overview',
      content: `**Who they are**: Independent martial occult hunters and spellbreakers who track dangerous magic and prepare practical countermeasures.

**The hook**: Turn hostile sorcery against itself. By parrying spells, witnessing cast attempts, and dispersing alchemical null-salts, you build Hexbreaker Charges (0-6) to fuel devastating kinetic dispels and silence strikes.

**The resource bar & costs**: **Hexbreaker Charges** (0-6). Build charges through magical friction, then spend them to pierce wards, ground elemental surges, and execute spellcasting foes.

**Bring one for**: Reliable anti-magic disruption, high single-target burst against casters, and practical martial versatility in any encounter.`
    },
    description: 'The Covenbane is an independent martial occult hunter and spellbreaker specializing in the disruption of hostile magic, the investigation of supernatural traces, and the methodical execution of rogue casters.',
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `**HISTORY: THE COLD IRON VOW**
The Covenbane tradition originated among solitary swamp-trackers and ward-breakers who discovered that ancient bog-iron naturally dampens leyline resonance. Refined over generations with alchemical null-salts, the practice evolved into a disciplined martial discipline.

**CIVIL RECEPTION**
Covenbanes are treated with wary respect. Town garrisons and frontier guilds frequently hire them to resolve supernatural disturbances, while high wizards and cloistered covens regard them with deep unease.

**NOTABLE PRACTITIONERS**
* **Orven the Still-Handed**: Renowned early spellbreaker who established the discipline of cold-iron parrying.
* **Kaelen the Ward-Breaker**: A veteran hunter known for shattering high-circle arcane barriers with kinetic shockwaves.`
    },
    signatureQuote: {
      text: '"Magic leaves a scent like burned tin and rotting moss. Follow the smoke long enough, and you find the fire. Then you put it out."',
      speaker: 'Orven the Still-Handed',
      context: 'On tracking rogue cabals through the outer marshes'
    }
  },
  specializations: {
    title: 'Three Anti-Magic Disciplines',
    description: 'First investment chooses a primary tree. Five talent points per level, global cap fifty. Signatures require ten same-tree points at level three; capstones forty-five at level ten.',
    specs: COVENBANE_TREE_META.map(meta => ({
      id: meta.id,
      name: meta.name,
      icon: 'fas fa-crosshairs',
      theme: meta.tagline,
      description: meta.tagline,
      playstyle: meta.tagline
    }))
  },
  resourceSystem: {
    id: 'hexbreaker_charges',
    name: 'Hexbreaker Charges',
    manualOnly: true,
    executionEnabled: false,
    resourceDefinition: {
      name: 'Hexbreaker Charges',
      manualOnly: true,
      executionEnabled: false
    }
  },
  spells: COVENBANE_PROJECTED_SPELLS,
  exampleSpells: COVENBANE_PROJECTED_SPELLS,
  progression: {
    policy: COVENBANE_PROGRESSION_POLICY,
    spellPools: COVENBANE_SPELL_POOLS
  },
  spellPools: COVENBANE_SPELL_POOLS,
  talentTrees: COVENBANE_TREES
};

export default COVENBANE_DATA;
