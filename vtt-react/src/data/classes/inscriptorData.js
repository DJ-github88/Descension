import {
  INSCRIPTOR_TREE_META,
  INSCRIPTOR_TREES,
  INSCRIPTOR_TALENT_NODES,
  INSCRIPTOR_PASSIVE_RECORDS,
  INSCRIPTOR_TALENT_CAPACITY
} from '../talentTrees/inscriptor';

export { INSCRIPTOR_PASSIVE_RECORDS, INSCRIPTOR_TALENT_CAPACITY };

export const INSCRIPTOR_CLASS_ID = 'inscriptor';
export const INSCRIPTOR_RULESET_VERSION = 'cr-review-r1';
export const INSCRIPTOR_ICON = 'fas fa-scroll';
export const INSCRIPTOR_MANUAL_NOTICE = 'Manual tabletop only. No automatic rune placement, resonance generation, triggering, or damage.';

const flags = {
  classId: INSCRIPTOR_CLASS_ID,
  rulesetVersion: INSCRIPTOR_RULESET_VERSION,
  authoredOnly: true,
  manualOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualNotice: INSCRIPTOR_MANUAL_NOTICE
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
  rangeDistance: 40,
  targetRestrictions: ['area'],
  maxTargets: 1,
  areaRadius: feet
});

const apCost = (actionPoints, resonance = 0) => ({
  actionPoints,
  mana: 0,
  runicResonance: resonance,
  resourceTypes: actionPoints > 0 ? ['actionPoints'] : [],
  resourceValues: { actionPoints, mana: 0, runicResonance: resonance },
  useFormulas: {},
  components: ['somatic', 'material'],
  somaticText: 'Carve precise geometric rune syntax using bone stylus or memory chisel.'
});

const damage = (formula, damageTypes = ['force']) => ({ formula, damageTypes, resolution: 'DICE' });
const cooldownNone = { cooldownType: 'turn_based', cooldownValue: 0 };
const cooldownEncounter = { cooldownType: 'encounter', cooldownValue: 1 };
const effect = (kind, args, description) => ({ kind, args, description, executable: false });

export const INSCRIPTOR_COMMON_MECHANICS = {
  price: 'AP and Runic Resonance are explicit. Resonance builds from placing runes and trigger events; max 10.',
  runes: 'Etched runes persist on grid tiles or gear. Max active runes: 5 (base). Triggered on contact or remote discharge.',
  motifs: 'Lithic stone slabs, bone styluses, memory chisels, floating syntax scripts, and architectural zone control.',
  tactical: 'Pre-placed ground hazards, equipment augments, and geometric lattice bursts without automated scripting.',
  inclusivity: 'Open to all lineages and scholarly traditions across Mythrill.'
};

export const INSCRIPTOR_CORE_RECORDS = [
  {
    ...flags,
    id: 'cr1_inscriptor_etch_glyph',
    name: 'Etch Glyph',
    level: 1,
    specialization: null,
    treeId: null,
    source: 'core',
    spellType: 'ACTION',
    icon: INSCRIPTOR_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: area(5),
    effectTypes: ['utility', 'resource_generation'],
    damageConfig: null,
    durationConfig: hourDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 5 },
    description: 'Use bone stylus to carve an enduring rune into an adjacent floor tile or surface. The rune persists for 1 hour or until discharged, and grants +1 Runic Resonance.',
    classResourceProgram: null,
    manualMechanics: {
      price: { actionPoints: 1, mana: 0, resonance: 0 },
      effects: [effect('rune.etch', {}, 'Carve persistent ground rune; gain +1 Resonance.')],
      executable: false
    },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'cr1_inscriptor_discharge_rune',
    name: 'Discharge Rune',
    level: 1,
    specialization: null,
    treeId: null,
    source: 'core',
    spellType: 'ACTION',
    icon: INSCRIPTOR_ICON,
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 40),
    effectTypes: ['damage'],
    damageConfig: damage('1d8 + intelligence', ['force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Remotely activate an active etched rune within 40 ft, releasing a pulse of force that deals 1d8 + Intelligence force damage to a creature occupying or adjacent to the rune tile.',
    classResourceProgram: null,
    manualMechanics: {
      price: { actionPoints: 1, mana: 0, resonance: 0 },
      effects: [effect('rune.discharge', {}, 'Remote rune detonation for 1d8 + Int force.')],
      executable: false
    },
    sourceRefs: ['Inscriptor Content Lock']
  }
];

export const INSCRIPTOR_OPTIONAL_POOL = [
  // LEVEL 1 (2 non-damage, 2 damage)
  {
    ...flags,
    id: 'insc_warding_script',
    name: 'Warding Script',
    level: 1,
    specialization: 'enchanter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(1, 0),
    targetingConfig: ally(1, 15),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Inscribe a protective ward onto an ally armor or clothing. The ally gains +2 AC for 3 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 0 }, effects: [effect('buff.ac', { amount: 2 }, '+2 AC for 3 rounds.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_shackle_rune',
    name: 'Shackle Rune',
    level: 1,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Chains',
    resourceCost: apCost(1, 0),
    targetingConfig: area(5),
    effectTypes: ['crowd_control'],
    damageConfig: null,
    durationConfig: hourDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'agility', dcFormula: '10 + intelligence' },
    conditions: ['rooted'],
    area: { radius: 5 },
    description: 'Carve a shackling snare into a tile. The first enemy to step onto the tile must succeed on an Agility save or become rooted for 1 round.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 0 }, effects: [effect('trap.root', {}, 'Root snare trap.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_concussive_sigil',
    name: 'Concussive Sigil',
    level: 1,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Blast',
    resourceCost: apCost(1, 0),
    targetingConfig: area(5),
    effectTypes: ['damage'],
    damageConfig: damage('2d6 + intelligence', ['force']),
    durationConfig: hourDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 5 },
    description: 'Etch an explosive concussion rune on a tile. The first enemy stepping on it triggers a blast dealing 2d6 + Intelligence force damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 0 }, effects: [effect('trap.blast', {}, 'Concussive blast trap.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_inscribe_focus',
    name: 'Inscribe Focus',
    level: 1,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Aura',
    resourceCost: apCost(1, 0),
    targetingConfig: selfTarget,
    effectTypes: ['buff', 'resource_generation'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Carve a glowing focus glyph onto your own forearm. Gain +1 Runic Resonance and +1 to all spell attack rolls for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 0 }, effects: [effect('buff.spell_focus', {}, '+1 Resonance and +1 spell attack.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },

  // LEVEL 2
  {
    ...flags,
    id: 'insc_glyph_of_mend',
    name: 'Glyph of Mend',
    level: 2,
    specialization: 'enchanter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
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
    description: 'Trace a soothing restorative glyph over an ally wounds, restoring 2d4 + Intelligence HP.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 0 }, effects: [effect('healing.mend', { amount: '2d4 + int' }, 'Heal 2d4 + Int HP.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_piercing_rune',
    name: 'Piercing Rune',
    level: 2,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Piercing/Deep Pierce',
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage'],
    damageConfig: damage('1d8 + intelligence', ['force', 'piercing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Launch a spinning razor-sharp floating rune at a target within 30 ft, dealing 1d8 + Intelligence piercing and force damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 0 }, effects: [effect('damage.piercing_rune', {}, 'Ranged rune dart.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_gravity_sigil',
    name: 'Gravity Sigil',
    level: 2,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Vortex',
    resourceCost: apCost(1, 0),
    targetingConfig: area(10),
    effectTypes: ['displacement'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'strength', dcFormula: '10 + intelligence' },
    conditions: [],
    area: { radius: 10 },
    description: 'Etch a gravitational pull sigil on the ground. All creatures within 10 ft must make a Strength save or be pulled 5 ft toward the sigil center.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 0 }, effects: [effect('displacement.pull', { feet: 5 }, 'Pull toward center.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_barrier_script',
    name: 'Barrier Script',
    level: 2,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Force Wall',
    resourceCost: apCost(2, 0),
    targetingConfig: area(10),
    effectTypes: ['utility'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 10 },
    description: 'Project a 10 ft floating luminous barrier line that lasts for 2 rounds, blocking line of sight and granting total cover against ranged missiles.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 0 }, effects: [effect('wall.barrier', { length: 10 }, 'Ranged missile barrier.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },

  // LEVEL 3
  {
    ...flags,
    id: 'insc_detonating_matrix',
    name: 'Detonating Matrix',
    level: 3,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Explosion',
    resourceCost: apCost(2, 1),
    targetingConfig: area(15),
    effectTypes: ['damage'],
    damageConfig: damage('2d6 + intelligence', ['force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 1 Resonance to detonate up to 2 active runes simultaneously, dealing 2d6 + Intelligence force damage to creatures around each rune.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 1 }, effects: [effect('damage.matrix_blast', {}, 'Simultaneous dual detonation.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_runic_fortification',
    name: 'Runic Fortification',
    level: 3,
    specialization: 'enchanter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(1, 1),
    targetingConfig: ally(1, 15),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 1 Resonance to reinforce an ally armor with deep lithic runes, granting DR 3/- against non-magical physical damage for 3 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 1 }, effects: [effect('buff.dr', { amount: 3 }, 'DR 3/- for 3 rounds.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_seeking_glyph',
    name: 'Seeking Glyph',
    level: 3,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Missile',
    resourceCost: apCost(1, 0),
    targetingConfig: enemy(1, 40),
    effectTypes: ['damage'],
    damageConfig: damage('2d8 + intelligence', ['arcane']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Release a floating seeking glyph that navigates around cover to strike a target within 40 ft for 2d8 + Intelligence arcane damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 0 }, effects: [effect('damage.seeking', {}, 'Homing arcane glyph.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_silence_rune',
    name: 'Silence Rune',
    level: 3,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Silence',
    resourceCost: apCost(1, 0),
    targetingConfig: area(10),
    effectTypes: ['crowd_control'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 10 },
    description: 'Carve a null-acoustic rune on the ground. A 10 ft radius zone falls into absolute silence for 2 rounds; no verbal spells can be cast within.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 0 }, effects: [effect('zone.silence', { radius: 10 }, 'Silence zone for 2 rounds.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },

  // LEVEL 4
  {
    ...flags,
    id: 'insc_sunder_script',
    name: 'Sunder Script',
    level: 4,
    specialization: 'enchanter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Slashing/Armor Sunder',
    resourceCost: apCost(2, 2),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage', 'debuff'],
    damageConfig: damage('3d6 + intelligence', ['force']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 2 Resonance to brand a target armor with an unmaking script, dealing 3d6 force damage and reducing their AC by 3 for 2 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 2 }, effects: [effect('damage.sunder', {}, '3d6 force and -3 AC.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_aegis_lattice',
    name: 'Aegis Lattice',
    level: 4,
    specialization: 'enchanter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Chain Link',
    resourceCost: apCost(1, 2),
    targetingConfig: ally(2, 30),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 2 Resonance to connect two allies with a glowing runic tether. Both gain +2 to saving throws and divide all incoming damage evenly between them.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 2 }, effects: [effect('buff.lattice', {}, 'Harmonic damage sharing.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_kinetic_rebound',
    name: 'Kinetic Rebound',
    level: 4,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'REACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(0, 1),
    targetingConfig: enemy(1, 5),
    effectTypes: ['displacement'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: 'WHEN_ALLY_HIT',
    savingThrow: { saveAttribute: 'strength', dcFormula: '10 + intelligence' },
    conditions: [],
    area: null,
    description: 'Reaction when an ally within 30 ft wearing your inscription is hit in melee: spend 1 Resonance to discharge the armor, knocking attacker back 10 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 0, resonance: 1 }, effects: [effect('reaction.rebound', { feet: 10 }, 'Knock back attacker.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_lance_of_syntax',
    name: 'Lance of Syntax',
    level: 4,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Piercing/Deep Pierce',
    resourceCost: apCost(2, 0),
    targetingConfig: enemy(1, 40),
    effectTypes: ['damage'],
    damageConfig: damage('3d8 + intelligence', ['force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Channel concentrated linguistic energy into a spear of glowing syntax, piercing a target within 40 ft for 3d8 + Intelligence force damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 0 }, effects: [effect('damage.lance', {}, 'Syntax lance.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },

  // LEVEL 5
  {
    ...flags,
    id: 'insc_monolithic_eruption',
    name: 'Monolithic Eruption',
    level: 5,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(2, 3),
    targetingConfig: area(10),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('3d8 + intelligence', ['bludgeoning', 'force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'agility', dcFormula: '10 + intelligence' },
    conditions: ['prone'],
    area: { radius: 10 },
    description: 'Spend 3 Resonance to erupt a stone monolith from an active rune tile. Creatures in the area take 3d8 damage and are knocked prone on a failed save.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 3 }, effects: [effect('damage.monolith_burst', {}, 'Erupt monolith and knock prone.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_sanctuary_circle',
    name: 'Sanctuary Circle',
    level: 5,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Magic Circle',
    resourceCost: apCost(2, 2),
    targetingConfig: area(15),
    effectTypes: ['crowd_control'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'spirit', dcFormula: '10 + intelligence' },
    conditions: [],
    area: { radius: 15 },
    description: 'Draw a 15 ft circular boundary of glowing protective glyphs. Hostile creatures must make a Spirit save or be unable to cross into the circle for 3 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 2 }, effects: [effect('zone.sanctuary', { radius: 15 }, 'Hostile barrier circle.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_arcane_minefield',
    name: 'Arcane Minefield',
    level: 5,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Explosion',
    resourceCost: apCost(3, 3),
    targetingConfig: area(15),
    effectTypes: ['damage'],
    damageConfig: damage('2d8 + intelligence', ['force']),
    durationConfig: hourDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Rapidly etch 3 minor explosive runes across 3 distinct tiles in a 15 ft area. Each rune deals 2d8 force damage when triggered.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, resonance: 3 }, effects: [effect('trap.minefield', { count: 3 }, '3 explosive runes.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_transmutation_glyph',
    name: 'Transmutation Glyph',
    level: 5,
    specialization: 'enchanter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Earth Alteration',
    resourceCost: apCost(1, 0),
    targetingConfig: area(10),
    effectTypes: ['utility'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 10 },
    description: 'Transmute the floor terrain in a 10 ft area into slick memory glass or thick mud, turning it into difficult terrain and imposing -2 to enemy Agility saves.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 0 }, effects: [effect('terrain.alter', { radius: 10 }, 'Difficult terrain creation.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },

  // LEVEL 6
  {
    ...flags,
    id: 'insc_overload_discharge',
    name: 'Overload Discharge',
    level: 6,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Blast',
    resourceCost: apCost(2, 4),
    targetingConfig: area(15),
    effectTypes: ['damage'],
    damageConfig: damage('4d8 + intelligence', ['force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 4 Resonance to overload all floating glyphs, triggering a violent force pulse that deals 4d8 + Intelligence force damage to all enemies within 15 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 4 }, effects: [effect('damage.overload', {}, '15 ft force blast.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_displacement_glyph',
    name: 'Displacement Glyph',
    level: 6,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Teleport',
    resourceCost: apCost(1, 2),
    targetingConfig: area(20),
    effectTypes: ['mobility'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 2 Resonance to carve twin linked translocation glyphs on two tiles up to 40 ft apart. Any willing creature stepping on one tile instantly teleports to the other.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 2 }, effects: [effect('mobility.portal', {}, 'Twin teleportation tiles.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_nullifying_inscription',
    name: 'Nullifying Inscription',
    level: 6,
    specialization: 'enchanter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Cleanse',
    resourceCost: apCost(2, 0),
    targetingConfig: area(15),
    effectTypes: ['utility'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Etch a powerful counter-syntax over an active magical zone or ongoing spell effect, instantly dispelling it.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 0 }, effects: [effect('dispel.zone', {}, 'Dispel active area spell.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_shattering_word',
    name: 'Shattering Word',
    level: 6,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'General/Combat Charge',
    resourceCost: apCost(2, 3),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('4d6 + intelligence', ['force']),
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'constitution', dcFormula: '10 + intelligence' },
    conditions: [],
    area: null,
    description: 'Speak an ancient prime rune of fracture, dealing 4d6 force damage and deafening/staggering target for 1 round on a failed Constitution save.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 3 }, effects: [effect('damage.shatter_word', {}, 'Shattering force word.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },

  // LEVEL 7
  {
    ...flags,
    id: 'insc_cascading_blast',
    name: 'Cascading Blast',
    level: 7,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Explosion',
    resourceCost: apCost(3, 5),
    targetingConfig: area(25),
    effectTypes: ['damage'],
    damageConfig: damage('5d8 + intelligence', ['force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 25 },
    description: 'Spend 5 Resonance to trigger a cascade across all active runes on the field, dealing 5d8 force damage to all enemies caught within 10 ft of any active rune.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, resonance: 5 }, effects: [effect('damage.cascade', {}, 'All-rune cascading detonation.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_stasis_sigil',
    name: 'Stasis Sigil',
    level: 7,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Time Warp',
    resourceCost: apCost(2, 4),
    targetingConfig: enemy(1, 30),
    effectTypes: ['crowd_control'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: { saveAttribute: 'spirit', dcFormula: '10 + intelligence' },
    conditions: [],
    area: null,
    description: 'Spend 4 Resonance to etch a temporal stasis glyph onto a target. If they fail a Spirit save, they are frozen in stasis for 1 round (cannot act, immune to damage).',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 4 }, effects: [effect('cc.stasis', {}, 'Temporal stasis.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_lexicon_of_warding',
    name: 'Lexicon of Warding',
    level: 7,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Aura',
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
    description: 'Spend 3 Resonance to deploy a cloud of hovering defensive runes around allies within 20 ft. All affected allies gain +3 AC and 10 temporary HP for 3 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 3 }, effects: [effect('buff.lexicon_ward', {}, '+3 AC and 10 temp HP to allies.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_runic_lance',
    name: 'Runic Lance',
    level: 7,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Missile',
    resourceCost: apCost(2, 4),
    targetingConfig: enemy(1, 40),
    effectTypes: ['damage'],
    damageConfig: damage('5d10 + intelligence', ['arcane', 'force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 4 Resonance to project a devastating beam of pure runic syntax across 40 ft, dealing 5d10 + Intelligence damage and penetrating through cover.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 4 }, effects: [effect('damage.runic_lance', {}, '5d10 piercing beam.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },

  // LEVEL 8
  {
    ...flags,
    id: 'insc_bastion_of_the_first_script',
    name: 'Bastion of the First Script',
    level: 8,
    specialization: 'enchanter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(3, 6),
    targetingConfig: area(15),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 6 Resonance to manifest an ancient dome of glowing runic glyphs (15 ft radius) for 2 rounds. Allies inside gain 50% damage reduction against all damage types.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, resonance: 6 }, effects: [effect('buff.bastion_dome', {}, '50% DR dome.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_cataclysmic_detonation',
    name: 'Cataclysmic Detonation',
    level: 8,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Explosion',
    resourceCost: apCost(3, 6),
    targetingConfig: area(20),
    effectTypes: ['damage'],
    damageConfig: damage('6d10 + intelligence', ['force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 6 Resonance to implode 3 active runes simultaneously, triggering a catastrophic shockwave that deals 6d10 + Intelligence force damage in a 20 ft radius.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, resonance: 6 }, effects: [effect('damage.cataclysm', {}, '6d10 force blast.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_rewriting_flesh',
    name: 'Rewriting Flesh',
    level: 8,
    specialization: 'enchanter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(2, 4),
    targetingConfig: ally(1, 15),
    effectTypes: ['healing'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 4 Resonance to inscribe living restorative runes directly onto an ally flesh, restoring 4d10 + Intelligence HP and removing all poisons and bleeds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 4 }, effects: [effect('healing.flesh_rewrite', {}, '4d10 heal and condition cleanse.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_runic_execution',
    name: 'Runic Execution',
    level: 8,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Piercing/Deep Pierce',
    resourceCost: apCost(2, 5),
    targetingConfig: enemy(1, 5),
    effectTypes: ['damage'],
    damageConfig: damage('6d8 + intelligence', ['force', 'piercing']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 5 Resonance to drive your bone stylus directly into an enemy, carving a rune of execution that deals 6d8 damage and ignores all magical shields.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 5 }, effects: [effect('damage.runic_execution', {}, '6d8 shield-piercing strike.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },

  // LEVEL 9
  {
    ...flags,
    id: 'insc_planar_rift_rune',
    name: 'Planar Rift Rune',
    level: 9,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Portal',
    resourceCost: apCost(3, 7),
    targetingConfig: area(20),
    effectTypes: ['damage'],
    damageConfig: damage('7d8 + intelligence', ['arcane', 'force']),
    durationConfig: instant,
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 7 Resonance to tear open a planar rift between two active runes, dealing 7d8 arcane damage to all hostile creatures in the intervening vector.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, resonance: 7 }, effects: [effect('damage.planar_rift', {}, '7d8 rift tear.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_grand_warding_grid',
    name: 'Grand Warding Grid',
    level: 9,
    specialization: 'enchanter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Force Wall',
    resourceCost: apCost(3, 6),
    targetingConfig: area(30),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Spend 6 Resonance to link all tiles in a 30 ft radius into an interlocking runic grid. Allies inside gain +4 AC, +4 to saving throws, and immune to forced movement for 3 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, resonance: 6 }, effects: [effect('buff.warding_grid', {}, 'Battlefield-wide defense grid.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_word_of_unmaking',
    name: 'Word of Unmaking',
    level: 9,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Blast',
    resourceCost: apCost(2, 7),
    targetingConfig: enemy(1, 30),
    effectTypes: ['damage'],
    damageConfig: damage('7d10 + intelligence', ['force']),
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 7 Resonance to utter the primordial rune of unmaking against a single target, dealing 7d10 + Intelligence force damage and destroying one active magical buff.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 7 }, effects: [effect('damage.word_unmaking', {}, '7d10 and buff destruction.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_infinite_syntax',
    name: 'Infinite Syntax',
    level: 9,
    specialization: 'glyphweaver',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Aura',
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
    description: 'Spend 5 Resonance to enter a state of infinite mental calligraphy for 2 rounds. Etching runes and casting 1 AP glyphs costs 0 AP.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 5 }, effects: [effect('buff.infinite_syntax', {}, 'Free rune etching for 2 rounds.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },

  // LEVEL 10
  {
    ...flags,
    id: 'insc_prime_monolith_unbound',
    name: 'Prime Monolith Unbound',
    level: 10,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Explosion',
    resourceCost: apCost(3, 10),
    targetingConfig: area(30),
    effectTypes: ['damage'],
    damageConfig: damage('10d10 + intelligence', ['force']),
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Discharge all 10 Resonance to summon the primordial lithic monolith of creation and fracture, dealing 10d10 force damage to all enemies within 30 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, resonance: 10 }, effects: [effect('damage.prime_monolith_blast', {}, 'Max resonance 10d10 force explosion.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_eternal_archive',
    name: 'Eternal Archive',
    level: 10,
    specialization: 'enchanter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Utility/Time Warp',
    resourceCost: apCost(3, 8),
    targetingConfig: area(20),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(1),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 20 },
    description: 'Spend 8 Resonance to freeze your allies in the runic perfection of the Frozen Archive for 1 round. All allies within 20 ft are completely immune to damage and conditions.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, resonance: 8 }, effects: [effect('buff.invulnerable_party', {}, 'Party invulnerability for 1 round.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_obliterating_lattice',
    name: 'Obliterating Lattice',
    level: 10,
    specialization: 'runebinder',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Blast',
    resourceCost: apCost(3, 8),
    targetingConfig: area(30),
    effectTypes: ['damage'],
    damageConfig: damage('8d10 + intelligence', ['force', 'arcane']),
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Spend 8 Resonance to connect all active runes into an all-encompassing laser lattice, dealing 8d10 damage to all hostile creatures in the encounter.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, resonance: 8 }, effects: [effect('damage.lattice_blast', {}, '8d10 room-wide damage.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_genesis_script',
    name: 'Genesis Script',
    level: 10,
    specialization: 'enchanter',
    source: 'optional',
    spellType: 'ACTION',
    icon: 'Healing/Golden Heart',
    resourceCost: apCost(2, 8),
    targetingConfig: ally(3, 30),
    effectTypes: ['healing'],
    damageConfig: null,
    durationConfig: instant,
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 8 Resonance to inscribe the original script of life onto up to 3 allies, fully restoring their HP to maximum and removing all negative conditions.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 8 }, effects: [effect('healing.full_restore', {}, 'Full HP restore and condition cleanse.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  }
];

export const INSCRIPTOR_SIGNATURE_RECORDS = [
  {
    ...flags,
    id: 'insc_sig_sigil_matrix',
    name: 'Sigil Matrix',
    level: 3,
    specialization: 'runebinder',
    treeId: 'runebinder',
    source: 'signature',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Explosion',
    resourceCost: apCost(1, 2),
    targetingConfig: area(15),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('2d6 + intelligence', ['force']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 15 },
    description: 'Spend 2 Resonance to carve 2 connected sigils. Enemies stepping between the sigils take 2d6 force damage and are slowed by 10 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 2 }, effects: [effect('signature.sigil_matrix', {}, 'Dual linked sigil zone.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_sig_glyph_of_aegis',
    name: 'Glyph of Aegis',
    level: 3,
    specialization: 'enchanter',
    treeId: 'enchanter',
    source: 'signature',
    spellType: 'ACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(1, 1),
    targetingConfig: ally(1, 20),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 1 Resonance to inscribe an aegis shield on an ally. Grants 20 temporary HP and +2 AC for 3 rounds.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 1 }, effects: [effect('signature.glyph_aegis', {}, '20 temp HP and +2 AC.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_sig_tethering_script',
    name: 'Tethering Script',
    level: 3,
    specialization: 'glyphweaver',
    treeId: 'glyphweaver',
    source: 'signature',
    spellType: 'ACTION',
    icon: 'Utility/Chain Link',
    resourceCost: apCost(1, 2),
    targetingConfig: enemy(2, 30),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('2d8 + intelligence', ['force']),
    durationConfig: roundDuration(2),
    cooldownConfig: cooldownNone,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 2 Resonance to tether two enemies with glowing runic text. If they move more than 15 ft apart, both take 2d8 force damage and are pulled toward each other.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 1, resonance: 2 }, effects: [effect('signature.tether_script', {}, 'Runic tether.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  }
];

export const INSCRIPTOR_CAPSTONE_RECORDS = [
  {
    ...flags,
    id: 'insc_cap_prime_monolith',
    name: 'Prime Monolith',
    level: 10,
    specialization: 'runebinder',
    treeId: 'runebinder',
    source: 'capstone',
    spellType: 'ACTION',
    icon: 'General/Combat Downward Strike',
    resourceCost: apCost(3, 6),
    targetingConfig: area(20),
    effectTypes: ['damage', 'crowd_control'],
    damageConfig: damage('4d8 + intelligence', ['bludgeoning', 'force']),
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: ['rooted'],
    area: { radius: 20 },
    description: 'Spend 6 Resonance to raise a great lithic monolith for 3 rounds. The monolith pulses 4d8 force damage each round and roots enemies within 15 ft.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, resonance: 6 }, effects: [effect('capstone.prime_monolith', {}, 'Persistent monolith pulse.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_cap_living_runic_chassis',
    name: 'Living Runic Chassis',
    level: 10,
    specialization: 'enchanter',
    treeId: 'enchanter',
    source: 'capstone',
    spellType: 'ACTION',
    icon: 'Utility/Deflecting Shield',
    resourceCost: apCost(2, 5),
    targetingConfig: ally(1, 15),
    effectTypes: ['buff'],
    damageConfig: null,
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: null,
    description: 'Spend 5 Resonance to turn ally armor into living animated runic plating for 3 rounds. Grants +4 AC, DR 5/-, and reflects 10 force damage to melee attackers.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 2, resonance: 5 }, effects: [effect('capstone.living_chassis', {}, '+4 AC, DR 5/-, and damage reflection.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  },
  {
    ...flags,
    id: 'insc_cap_grand_lexicon_unbound',
    name: 'Grand Lexicon Unbound',
    level: 10,
    specialization: 'glyphweaver',
    treeId: 'glyphweaver',
    source: 'capstone',
    spellType: 'ACTION',
    icon: 'Arcane/Arcane Blast',
    resourceCost: apCost(3, 8),
    targetingConfig: area(30),
    effectTypes: ['damage', 'defense'],
    damageConfig: damage('5d8 + intelligence', ['force']),
    durationConfig: roundDuration(3),
    cooldownConfig: cooldownEncounter,
    reactionTiming: null,
    savingThrow: null,
    conditions: [],
    area: { radius: 30 },
    description: 'Spend 8 Resonance to release a swarm of ancient floating lexicon scripts. For 3 rounds, intercepts all targeted spells and retaliates with 5d8 force damage.',
    classResourceProgram: null,
    manualMechanics: { price: { actionPoints: 3, resonance: 8 }, effects: [effect('capstone.grand_lexicon', {}, 'Spell interception and counter-attacks.')], executable: false },
    sourceRefs: ['Inscriptor Content Lock']
  }
];

export const INSCRIPTOR_TALENT_ACTIVE_RECORDS = [
  ...INSCRIPTOR_SIGNATURE_RECORDS,
  ...INSCRIPTOR_CAPSTONE_RECORDS
];

export const INSCRIPTOR_ALL_RECORDS = [
  ...INSCRIPTOR_CORE_RECORDS,
  ...INSCRIPTOR_OPTIONAL_POOL,
  ...INSCRIPTOR_TALENT_ACTIVE_RECORDS,
  ...INSCRIPTOR_PASSIVE_RECORDS
];

export const INSCRIPTOR_PROJECTED_SPELLS = INSCRIPTOR_ALL_RECORDS;

export const INSCRIPTOR_PROJECTED_SPELLS_BY_ID = Object.fromEntries(
  INSCRIPTOR_PROJECTED_SPELLS.map(spell => [spell.id, spell])
);

export const INSCRIPTOR_OPTIONAL_RECORDS = INSCRIPTOR_OPTIONAL_POOL;

export const INSCRIPTOR_SPELL_POOLS = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    return [level, INSCRIPTOR_OPTIONAL_RECORDS.filter(spell => spell.level === level).map(spell => spell.id)];
  })
);

export const INSCRIPTOR_PROGRESSION_POLICY = {
  classId: INSCRIPTOR_CLASS_ID,
  maxLevel: 10,
  startingSpellPicks: 1,
  optionalPicksPerLevel: 1,
  allowEarlierUnchosen: true,
  grantedCoreSpellIds: INSCRIPTOR_CORE_RECORDS.map(spell => spell.id),
  randomizeStartingSpells: false,
  autoTopUpOnLoad: false,
  talentActivesAreGrants: true,
  manualOnly: true
};

const inscriptorNodeById = Object.fromEntries(INSCRIPTOR_TALENT_NODES.map(node => [node.id, node]));
const inscriptorTreePoints = (ranks, treeId) => INSCRIPTOR_TALENT_NODES
  .filter(node => node.treeId === treeId)
  .reduce((total, node) => total + (ranks[node.id] || 0), 0);

export const pruneInscriptorTalents = (talents, characterLevel) => {
  const ranks = talents && typeof talents === 'object' ? { ...talents } : {};
  const level = Number.isInteger(characterLevel) ? Math.max(1, characterLevel) : 10;
  Object.keys(ranks).forEach(nodeId => {
    const node = inscriptorNodeById[nodeId];
    if (!node || !Number.isInteger(ranks[nodeId]) || ranks[nodeId] < 1 || ranks[nodeId] > node.maxRanks) {
      delete ranks[nodeId];
    }
  });

  const pruneStructure = () => {
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of INSCRIPTOR_TALENT_NODES) {
        const rank = ranks[node.id];
        if (!rank) continue;
        const gatePoints = inscriptorTreePoints(ranks, node.treeId) - rank;
        const predecessorMissing = node.requires.some(predecessorId => {
          const predecessor = inscriptorNodeById[predecessorId];
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
    INSCRIPTOR_TALENT_NODES.forEach(node => {
      if (!ranks[node.id]) return;
      if (target === null || node.minLevel >= inscriptorNodeById[target].minLevel) target = node.id;
    });
    if (target === null) break;
    ranks[target] -= 1;
    if (ranks[target] === 0) delete ranks[target];
    pruneStructure();
  }
  return ranks;
};

export function validateInscriptorState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return { valid: false, errors: ['state must be an object'] };
  const resonance = Number(state.resonance ?? state.current ?? 0);
  if (!Number.isInteger(resonance) || resonance < 0 || resonance > 10) {
    errors.push('resonance must be an integer from 0 to 10');
  }
  return { valid: errors.length === 0, errors };
}

export const INSCRIPTOR_DATA = {
  id: INSCRIPTOR_CLASS_ID,
  name: 'Inscriptor',
  icon: INSCRIPTOR_ICON,
  role: 'Control / Support',
  roleColor: '#1d4ed8',
  damageTypes: ['force', 'arcane', 'piercing'],
  resource: 'Runic Resonance',
  complexityRating: 4,
  cognitiveTags: ['Tactical Runes', 'Zone Architecture', 'Manual Tabletop'],
  playstyle: 'Carve living runes into physical surfaces and equipment, link rune matrices into detonating or warding lattices, and manipulate battlefield space through pure runic syntax. No automatic rune placement or automated damage scripting. Development — manual tabletop.',
  developmentStatus: 'development',
  manualOnly: true,
  overview: {
    title: 'The Inscriptor',
    subtitle: 'Sovereign of the Scarred Earth & Blood-Rune Carver',
    illustration: '/assets/images/classes/inscriptor_illustration.png',
    illustrationCaption: 'A grim runic scholar carving glowing symbols into stone with a bone stylus.',
    originStory: 'The scholar Theron of the Frozen Archive could not bear to watch primordial clockwork songs fade into oblivion as glaciers ground the keepers to dust. Using memory-glass chisels, he carved mathematical formulas directly into his flesh and stone surfaces, trading personal recollection for absolute preservation.',
    quickOverview: {
      title: 'Quick Overview',
      content: 'The Inscriptor builds Runic Resonance (0-10) by etching runes onto grid tiles, walls, and ally equipment. Resonance is spent to detonate rune lattices, trigger gravity snares, project protective barriers, and reshape terrain. Manual tabletop tracking.'
    }
  },
    resourceSystem: {
    id: 'runic_resonance',
    name: 'Runic Resonance',
    title: 'Runic Resonance',
    mechanic: 'Runic Resonance (0-10) built from carving glyphs and spent on detonations'
  },
  specializations: {
    title: 'Three Linguistic Slate Disciplines',
    description: 'First investment chooses a primary runic tree. Five talent points per level, global cap fifty. Signatures require ten same-tree points at level three; capstones forty-five at level ten.',
    specs: [
      {
        id: 'runebinder',
        name: 'Rune Binder',
        icon: 'fas fa-scroll',
        theme: 'Linguistic warding, protective sigils, memory slates, and environmental anchoring.',
        description: 'Linguistic warding, protective sigils, memory slates, and environmental anchoring.',
        playstyle: 'Barrier wards, defensive sigils, and battlefield control.'
      },
      {
        id: 'enchanter',
        name: 'Enchanter',
        icon: 'fas fa-magic',
        theme: 'Infusing weapons and armor with runic energy, empowering allies, and reactive inscriptions.',
        description: 'Infusing weapons and armor with runic energy, empowering allies, and reactive inscriptions.',
        playstyle: 'Weapon and armor enhancements and party support.'
      },
      {
        id: 'glyphweaver',
        name: 'Glyph Weaver',
        icon: 'fas fa-atom',
        theme: 'Offensive matrix detonations, cascading linguistic glyphs, and devastating elemental runes.',
        description: 'Offensive matrix detonations, cascading linguistic glyphs, and devastating elemental runes.',
        playstyle: 'Runic resonance detonations and multi-target damage.'
      }
    ]
  },
  classFeatures: [
    {
      level: 1,
      name: 'Runic Inscription & Resonance',
      description: 'Track Runic Resonance from 0 to 10. Etch up to 5 active runes onto surfaces or equipment. Discharge runes remotely or trigger them when enemies enter.'
    },
    {
      level: 1,
      name: 'Core Scholarly Grants',
      description: 'Gain Etch Glyph and Discharge Rune as permanent baseline abilities that do not consume optional spell picks.'
    }
  ],
  spells: INSCRIPTOR_PROJECTED_SPELLS,
  exampleSpells: INSCRIPTOR_PROJECTED_SPELLS,
  optionalSpellsByLevel: INSCRIPTOR_SPELL_POOLS,
  spellPools: INSCRIPTOR_SPELL_POOLS,
  talentTrees: INSCRIPTOR_TREES,
  progression: {
    policy: INSCRIPTOR_PROGRESSION_POLICY,
    spellPools: INSCRIPTOR_SPELL_POOLS,
    ...INSCRIPTOR_PROGRESSION_POLICY
  }
};
