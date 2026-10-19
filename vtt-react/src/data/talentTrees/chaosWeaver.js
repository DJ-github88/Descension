/*
 * CLASS-C1 — Chaos Weaver talent trees (proposed class-local content).
 *
 * Three trees × 18 nodes = 54 nodes, one-rank signature (05) and capstone (18)
 * per tree, sixteen 3-rank passives per tree (48 passive authored spell records
 * derived below from the same node data — there is no second copy of the rank
 * values). Allocation rules, gates and prerequisites follow
 * CLASS-C1-CHAOS-WEAVER.md §6. Pure authored data: no tree editor callbacks,
 * no library writes, no live grants.
 */

import {
  CHAOS_WEAVER_CLASS_ID,
  CHAOS_WEAVER_RULESET_VERSION,
  CHAOS_WEAVER_ICON,
  CHAOS_WEAVER_MANUAL_ONLY_NOTICE
} from '../classes/chaosWeaverData';

export const CHAOS_WEAVER_TREE_META = [
  {
    id: 'probability-sculptor',
    name: 'Probability Sculptor',
    tagline: 'Spend more known possibilities, not hidden luck.'
  },
  {
    id: 'anomaly-binder',
    name: 'Anomaly Binder',
    tagline: 'Place one avoidable, finite apparatus.'
  },
  {
    id: 'cascade-weaver',
    name: 'Cascade Weaver',
    tagline: 'Retain an option for one continuation.'
  }
];

/* Lowest acquisition level derives from the point gate: every level funds 5
 * points and a node needs one point inside its own gate. Gate 10 (signature)
 * therefore opens at level 3 and gate 45 (capstone) at level 10. */
export const CHAOS_WEAVER_MIN_LEVEL_FOR_GATE = (requiresPoints) =>
  Math.max(1, Math.ceil((requiresPoints + 1) / 5));

const passiveRanks = (...rows) =>
  rows.map(([text, values], index) => ({ rank: index + 1, text, values }));

const defineTree = (treeId, nodeList) => ({
  id: treeId,
  meta: CHAOS_WEAVER_TREE_META.find((tree) => tree.id === treeId),
  nodes: nodeList.map((entry) => ({
    ...entry,
    id: entry.id,
    treeId,
    requiresAll: true,
    minLevel: CHAOS_WEAVER_MIN_LEVEL_FOR_GATE(entry.requiresPoints)
  }))
});

/* ------------------------------------------------------------------ */
/* Probability Sculptor                                                */
/* ------------------------------------------------------------------ */

const PROBABILITY_SCULPTOR = defineTree('probability-sculptor', [
  {
    id: 'cw1_ps_n01',
    number: 1,
    name: 'Measured Reach',
    column: 0,
    row: 0,
    maxRanks: 3,
    requiresPoints: 0,
    requires: [],
    grantId: null,
    parameterKeys: ['split.enemyRangeFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Split enemy range 35ft.', { 'split.enemyRangeFeet': 35 }],
      ['Split enemy range 40ft.', { 'split.enemyRangeFeet': 40 }],
      ['Split enemy range 45ft.', { 'split.enemyRangeFeet': 45 }]
    ),
    effectText: 'Split enemy range 35 / 40 / 45ft.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n02',
    number: 2,
    name: 'Clean Surge',
    column: 2,
    row: 0,
    maxRanks: 3,
    requiresPoints: 0,
    requires: [],
    grantId: null,
    parameterKeys: ['split.surgeDamageFlatBonus'],
    unit: 'damage',
    rankValues: passiveRanks(
      ['Split Surge damage flat bonus +1.', { 'split.surgeDamageFlatBonus': 1 }],
      ['Split Surge damage flat bonus +2.', { 'split.surgeDamageFlatBonus': 2 }],
      ['Split Surge damage flat bonus +3.', { 'split.surgeDamageFlatBonus': 3 }]
    ),
    effectText: 'Split Surge damage flat bonus +1 / +2 / +3.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n03',
    number: 3,
    name: 'Read the Fracture',
    column: 0,
    row: 1,
    maxRanks: 3,
    requiresPoints: 5,
    requires: ['cw1_ps_n01'],
    grantId: null,
    parameterKeys: ['split.fractureDamageFlatBonus'],
    unit: 'damage',
    rankValues: passiveRanks(
      ['Split Fracture damage flat bonus +1.', { 'split.fractureDamageFlatBonus': 1 }],
      ['Split Fracture damage flat bonus +2.', { 'split.fractureDamageFlatBonus': 2 }],
      ['Split Fracture damage flat bonus +3.', { 'split.fractureDamageFlatBonus': 3 }]
    ),
    effectText: 'Split Fracture damage flat bonus +1 / +2 / +3; movement cost unchanged.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n04',
    number: 4,
    name: 'Shared Notebook',
    column: 2,
    row: 1,
    maxRanks: 3,
    requiresPoints: 5,
    requires: ['cw1_ps_n02'],
    grantId: null,
    parameterKeys: ['read-instability.questions'],
    unit: 'questions',
    rankValues: passiveRanks(
      ['Read Instability may answer 2 distinct questions instead of 1.', { 'read-instability.questions': 2 }],
      ['Read Instability may answer 3 distinct questions instead of 1.', { 'read-instability.questions': 3 }],
      ['Read Instability may answer 4 distinct questions instead of 1.', { 'read-instability.questions': 4 }]
    ),
    effectText: 'Read Instability may answer 2 / 3 / 4 distinct questions instead of 1, still actual observable facts.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n05',
    number: 5,
    name: 'Bias the Draw',
    column: 1,
    row: 2,
    maxRanks: 1,
    requiresPoints: 10,
    requires: ['cw1_ps_n03'],
    grantId: 'cr1_chaos_weaver_bias_draw',
    parameterKeys: [],
    unit: null,
    rankValues: passiveRanks(['Grant cr1_chaos_weaver_bias_draw.', {}]),
    effectText: 'Grant `cr1_chaos_weaver_bias_draw`.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n06',
    number: 6,
    name: 'Extended Bias',
    column: 0,
    row: 2,
    maxRanks: 3,
    requiresPoints: 10,
    requires: ['cw1_ps_n03'],
    grantId: null,
    parameterKeys: ['bias.rangeFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Bias range 40ft.', { 'bias.rangeFeet': 40 }],
      ['Bias range 50ft.', { 'bias.rangeFeet': 50 }],
      ['Bias range 60ft.', { 'bias.rangeFeet': 60 }]
    ),
    effectText: 'Bias range 40 / 50 / 60ft.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n07',
    number: 7,
    name: 'Narrow Lance',
    column: 2,
    row: 2,
    maxRanks: 3,
    requiresPoints: 10,
    requires: ['cw1_ps_n04'],
    grantId: null,
    parameterKeys: ['lancing-variance.damageFlatBonus'],
    unit: 'damage',
    rankValues: passiveRanks(
      ['Lancing Variance flat damage bonus +1.', { 'lancing-variance.damageFlatBonus': 1 }],
      ['Lancing Variance flat damage bonus +2.', { 'lancing-variance.damageFlatBonus': 2 }],
      ['Lancing Variance flat damage bonus +3.', { 'lancing-variance.damageFlatBonus': 3 }]
    ),
    effectText: 'Lancing Variance flat damage bonus +1 / +2 / +3.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n08',
    number: 8,
    name: 'Calculated Arc',
    column: 0,
    row: 3,
    maxRanks: 3,
    requiresPoints: 15,
    requires: ['cw1_ps_n06'],
    grantId: null,
    parameterKeys: ['discordant-arc.surgeDamageFlatBonus'],
    unit: 'damage',
    rankValues: passiveRanks(
      ['Discordant Arc Surge flat damage bonus +1.', { 'discordant-arc.surgeDamageFlatBonus': 1 }],
      ['Discordant Arc Surge flat damage bonus +2.', { 'discordant-arc.surgeDamageFlatBonus': 2 }],
      ['Discordant Arc Surge flat damage bonus +3.', { 'discordant-arc.surgeDamageFlatBonus': 3 }]
    ),
    effectText: 'Discordant Arc Surge flat damage bonus +1 / +2 / +3.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n09',
    number: 9,
    name: 'Shelter Arithmetic',
    column: 2,
    row: 3,
    maxRanks: 3,
    requiresPoints: 15,
    requires: ['cw1_ps_n07'],
    grantId: null,
    parameterKeys: ['measured-shelter.ward'],
    unit: 'ward',
    rankValues: passiveRanks(
      ['Measured Shelter ward 5 instead of 4.', { 'measured-shelter.ward': 5 }],
      ['Measured Shelter ward 6 instead of 4.', { 'measured-shelter.ward': 6 }],
      ['Measured Shelter ward 7 instead of 4.', { 'measured-shelter.ward': 7 }]
    ),
    effectText: 'Measured Shelter ward 5 / 6 / 7 instead of 4.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n10',
    number: 10,
    name: 'Surveying Rod',
    column: 0,
    row: 4,
    maxRanks: 3,
    requiresPoints: 20,
    requires: ['cw1_ps_n08'],
    grantId: null,
    parameterKeys: ['read-instability.rangeFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Read Instability range 40ft.', { 'read-instability.rangeFeet': 40 }],
      ['Read Instability range 50ft.', { 'read-instability.rangeFeet': 50 }],
      ['Read Instability range 60ft.', { 'read-instability.rangeFeet': 60 }]
    ),
    effectText: 'Read Instability range 40 / 50 / 60ft.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n11',
    number: 11,
    name: 'Fraying Focus',
    column: 2,
    row: 4,
    maxRanks: 3,
    requiresPoints: 20,
    requires: ['cw1_ps_n09'],
    grantId: null,
    parameterKeys: ['fraying-bolt.damageFlatBonus'],
    unit: 'damage',
    rankValues: passiveRanks(
      ['Fraying Bolt flat damage bonus +1.', { 'fraying-bolt.damageFlatBonus': 1 }],
      ['Fraying Bolt flat damage bonus +2.', { 'fraying-bolt.damageFlatBonus': 2 }],
      ['Fraying Bolt flat damage bonus +3.', { 'fraying-bolt.damageFlatBonus': 3 }]
    ),
    effectText: 'Fraying Bolt flat damage bonus +1 / +2 / +3; downside unchanged.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n12',
    number: 12,
    name: 'Published Proof',
    column: 0,
    row: 5,
    maxRanks: 3,
    requiresPoints: 25,
    requires: ['cw1_ps_n10'],
    grantId: null,
    parameterKeys: ['published-proof.checkBonus'],
    unit: 'check',
    rankValues: passiveRanks(
      ['+1 to one GM-called noncombat check explaining a fully published finite distribution per completed-rest interval.', { 'published-proof.checkBonus': 1 }],
      ['+2 to one GM-called noncombat check explaining a fully published finite distribution per completed-rest interval.', { 'published-proof.checkBonus': 2 }],
      ['+3 to one GM-called noncombat check explaining a fully published finite distribution per completed-rest interval.', { 'published-proof.checkBonus': 3 }]
    ),
    effectText: '+1 / +2 / +3 to one GM-called noncombat check explaining a fully published finite distribution per completed-rest interval. No roll alteration.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n13',
    number: 13,
    name: 'Guard Equation',
    column: 2,
    row: 5,
    maxRanks: 3,
    requiresPoints: 25,
    requires: ['cw1_ps_n11'],
    grantId: null,
    parameterKeys: ['skewed-guard.surgeWard'],
    unit: 'ward',
    rankValues: passiveRanks(
      ['Skewed Guard Surge ward 7.', { 'skewed-guard.surgeWard': 7 }],
      ['Skewed Guard Surge ward 8.', { 'skewed-guard.surgeWard': 8 }],
      ['Skewed Guard Surge ward 9.', { 'skewed-guard.surgeWard': 9 }]
    ),
    effectText: 'Skewed Guard Surge ward 7 / 8 / 9; other branches unchanged.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n14',
    number: 14,
    name: 'Stable Bench',
    column: 0,
    row: 6,
    maxRanks: 3,
    requiresPoints: 30,
    requires: ['cw1_ps_n12'],
    grantId: null,
    parameterKeys: ['stabilizers-kit.calibrationBonus'],
    unit: 'check',
    rankValues: passiveRanks(
      ['Stabilizer’s Kit calibration bonus +3 instead of +2.', { 'stabilizers-kit.calibrationBonus': 3 }],
      ['Stabilizer’s Kit calibration bonus +4 instead of +2.', { 'stabilizers-kit.calibrationBonus': 4 }],
      ['Stabilizer’s Kit calibration bonus +5 instead of +2.', { 'stabilizers-kit.calibrationBonus': 5 }]
    ),
    effectText: 'Stabilizer’s Kit calibration bonus +3 / +4 / +5 instead of +2.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n15',
    number: 15,
    name: 'Deep Calculation',
    column: 2,
    row: 6,
    maxRanks: 3,
    requiresPoints: 30,
    requires: ['cw1_ps_n13'],
    grantId: null,
    parameterKeys: ['deep-shear.surgeDamageFlatBonus'],
    unit: 'damage',
    rankValues: passiveRanks(
      ['Deep Shear Surge flat damage bonus +1.', { 'deep-shear.surgeDamageFlatBonus': 1 }],
      ['Deep Shear Surge flat damage bonus +2.', { 'deep-shear.surgeDamageFlatBonus': 2 }],
      ['Deep Shear Surge flat damage bonus +3.', { 'deep-shear.surgeDamageFlatBonus': 3 }]
    ),
    effectText: 'Deep Shear Surge flat damage bonus +1 / +2 / +3, not its Fracture branch/cost.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ps_n16',
    number: 16,
    name: 'Audited Weights',
    column: 0,
    row: 7,
    maxRanks: 3,
    requiresPoints: 35,
    requires: ['cw1_ps_n14'],
    grantId: null,
    parameterKeys: ['bias-draw.surgeDamageFlatBonus', 'closed-distribution.surgeDamageFlatBonus'],
    unit: 'damage',
    rankValues: passiveRanks(
      ['Bias the Draw Surge flat damage bonus +1.', { 'bias-draw.surgeDamageFlatBonus': 1, 'closed-distribution.surgeDamageFlatBonus': 1 }],
      ['Bias the Draw Surge flat damage bonus +2.', { 'bias-draw.surgeDamageFlatBonus': 2, 'closed-distribution.surgeDamageFlatBonus': 2 }],
      ['Bias the Draw Surge flat damage bonus +3.', { 'bias-draw.surgeDamageFlatBonus': 3, 'closed-distribution.surgeDamageFlatBonus': 3 }]
    ),
    effectText: 'Bias the Draw Surge flat damage bonus +1 / +2 / +3; also Closed Distribution’s Surge when that capstone is learned.',
    capstoneExtension: {
      capstoneId: 'cw1_ps_n18',
      text: 'Also applies to Closed Distribution’s Surge once the capstone is learned; inactive until then.'
    }
  },
  {
    id: 'cw1_ps_n17',
    number: 17,
    name: 'Declared Margin',
    column: 2,
    row: 7,
    maxRanks: 3,
    requiresPoints: 35,
    requires: ['cw1_ps_n15'],
    grantId: null,
    parameterKeys: ['split.shiftStepFeet', 'closed-distribution.shiftStepFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Split Shift legal step 10ft instead of 5.', { 'split.shiftStepFeet': 10, 'closed-distribution.shiftStepFeet': 10 }],
      ['Split Shift legal step 15ft instead of 5.', { 'split.shiftStepFeet': 15, 'closed-distribution.shiftStepFeet': 15 }],
      ['Split Shift legal step 20ft instead of 5.', { 'split.shiftStepFeet': 20, 'closed-distribution.shiftStepFeet': 20 }]
    ),
    effectText: 'Split Shift legal step 10 / 15 / 20ft instead of 5; also Closed Distribution’s Shift when learned; remaining movement bounds both.',
    capstoneExtension: {
      capstoneId: 'cw1_ps_n18',
      text: 'Also applies to Closed Distribution’s Shift once the capstone is learned; inactive until then.'
    }
  },
  {
    id: 'cw1_ps_n18',
    number: 18,
    name: 'Closed Distribution',
    column: 1,
    row: 8,
    maxRanks: 1,
    requiresPoints: 45,
    requires: ['cw1_ps_n05', 'cw1_ps_n16', 'cw1_ps_n17'],
    grantId: 'cw1_closed_distribution',
    parameterKeys: [],
    unit: null,
    rankValues: passiveRanks(['Grant cw1_closed_distribution.', {}]),
    effectText: 'Grant `cw1_closed_distribution`; does not refresh any once/rest use.',
    capstoneExtension: null
  }
]);

/* ------------------------------------------------------------------ */
/* Anomaly Binder                                                      */
/* ------------------------------------------------------------------ */

const ANOMALY_BINDER = defineTree('anomaly-binder', [
  {
    id: 'cw1_ab_n01',
    number: 1,
    name: 'Ground Survey',
    column: 0,
    row: 0,
    maxRanks: 3,
    requiresPoints: 0,
    requires: [],
    grantId: null,
    parameterKeys: ['survey-the-seam.rangeFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Survey the Seam range 15ft.', { 'survey-the-seam.rangeFeet': 15 }],
      ['Survey the Seam range 20ft.', { 'survey-the-seam.rangeFeet': 20 }],
      ['Survey the Seam range 25ft.', { 'survey-the-seam.rangeFeet': 25 }]
    ),
    effectText: 'Survey the Seam range 15 / 20 / 25ft.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n02',
    number: 2,
    name: 'Braced Interface',
    column: 2,
    row: 0,
    maxRanks: 3,
    requiresPoints: 0,
    requires: [],
    grantId: null,
    parameterKeys: ['fracture-brace.ward'],
    unit: 'ward',
    rankValues: passiveRanks(
      ['Fracture Brace ward 3.', { 'fracture-brace.ward': 3 }],
      ['Fracture Brace ward 4.', { 'fracture-brace.ward': 4 }],
      ['Fracture Brace ward 5.', { 'fracture-brace.ward': 5 }]
    ),
    effectText: 'Fracture Brace ward 3 / 4 / 5; penalty unchanged.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n03',
    number: 3,
    name: 'Material Memory',
    column: 0,
    row: 1,
    maxRanks: 3,
    requiresPoints: 5,
    requires: ['cw1_ab_n01'],
    grantId: null,
    parameterKeys: ['signal-coin.audibleRangeFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Signal Coin jostle signal audible within 20ft to normal listeners.', { 'signal-coin.audibleRangeFeet': 20 }],
      ['Signal Coin jostle signal audible within 30ft to normal listeners.', { 'signal-coin.audibleRangeFeet': 30 }],
      ['Signal Coin jostle signal audible within 40ft to normal listeners.', { 'signal-coin.audibleRangeFeet': 40 }]
    ),
    effectText: 'Signal Coin jostle signal audible within 20 / 30 / 40ft to normal listeners; no supernatural detection.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n04',
    number: 4,
    name: 'Close Observation',
    column: 2,
    row: 1,
    maxRanks: 3,
    requiresPoints: 5,
    requires: ['cw1_ab_n02'],
    grantId: null,
    parameterKeys: ['shared-survey.questions'],
    unit: 'questions',
    rankValues: passiveRanks(
      ['Shared Survey answers 3 distinct existing questions instead of 2.', { 'shared-survey.questions': 3 }],
      ['Shared Survey answers 4 distinct existing questions instead of 2.', { 'shared-survey.questions': 4 }],
      ['Shared Survey answers 5 distinct existing questions instead of 2.', { 'shared-survey.questions': 5 }]
    ),
    effectText: 'Shared Survey answers 3 / 4 / 5 distinct existing questions instead of 2.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n05',
    number: 5,
    name: 'Unsteady Ground',
    column: 1,
    row: 2,
    maxRanks: 1,
    requiresPoints: 10,
    requires: ['cw1_ab_n03'],
    grantId: 'cr1_chaos_weaver_unsteady_ground',
    parameterKeys: [],
    unit: null,
    rankValues: passiveRanks(['Grant cr1_chaos_weaver_unsteady_ground.', {}]),
    effectText: 'Grant `cr1_chaos_weaver_unsteady_ground`.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n06',
    number: 6,
    name: 'Placement Line',
    column: 0,
    row: 2,
    maxRanks: 3,
    requiresPoints: 10,
    requires: ['cw1_ab_n03'],
    grantId: null,
    parameterKeys: ['unsteady-ground.placementRangeFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Unsteady Ground placement range 40ft.', { 'unsteady-ground.placementRangeFeet': 40 }],
      ['Unsteady Ground placement range 50ft.', { 'unsteady-ground.placementRangeFeet': 50 }],
      ['Unsteady Ground placement range 60ft.', { 'unsteady-ground.placementRangeFeet': 60 }]
    ),
    effectText: 'Unsteady Ground placement range 40 / 50 / 60ft.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n07',
    number: 7,
    name: 'Broad Etching',
    column: 2,
    row: 2,
    maxRanks: 3,
    requiresPoints: 10,
    requires: ['cw1_ab_n04'],
    grantId: null,
    parameterKeys: ['unsteady-ground.radiusFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Unsteady Ground radius 6ft; still one first enemy trigger.', { 'unsteady-ground.radiusFeet': 6 }],
      ['Unsteady Ground radius 8ft; still one first enemy trigger.', { 'unsteady-ground.radiusFeet': 8 }],
      ['Unsteady Ground radius 10ft; still one first enemy trigger.', { 'unsteady-ground.radiusFeet': 10 }]
    ),
    effectText: 'Unsteady Ground radius 6 / 8 / 10ft; still one first enemy trigger.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n08',
    number: 8,
    name: 'Written Boundary',
    column: 0,
    row: 3,
    maxRanks: 3,
    requiresPoints: 15,
    requires: ['cw1_ab_n06'],
    grantId: null,
    parameterKeys: ['unsteady-ground.triggerOptions'],
    unit: null,
    rankValues: passiveRanks(
      ['Before placement, choose entry OR exit as the one published trigger.', { 'unsteady-ground.triggerOptions': 'entry-or-exit' }],
      ['Before placement, choose entry OR exit OR voluntary crossing of the centerline as the one published trigger.', { 'unsteady-ground.triggerOptions': 'entry-or-exit-or-centerline-crossing' }],
      ['Before placement, choose any of the previous options plus a named boundary segment as the one published trigger.', { 'unsteady-ground.triggerOptions': 'entry-or-exit-or-centerline-crossing-or-named-segment' }]
    ),
    effectText: 'Before placement, Unsteady Ground may select entry OR exit / entry OR exit OR voluntary crossing of its centerline / any of those plus a named boundary segment; exactly one published trigger selected, never several. Newly legal geometry remains manual/unimplemented.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n09',
    number: 9,
    name: 'Warning Call',
    column: 2,
    row: 3,
    maxRanks: 3,
    requiresPoints: 15,
    requires: ['cw1_ab_n07'],
    grantId: null,
    parameterKeys: ['warning-boundary.casterStepFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Warning Boundary caster step 10ft instead of 5.', { 'warning-boundary.casterStepFeet': 10 }],
      ['Warning Boundary caster step 15ft instead of 5.', { 'warning-boundary.casterStepFeet': 15 }],
      ['Warning Boundary caster step 20ft instead of 5.', { 'warning-boundary.casterStepFeet': 20 }]
    ),
    effectText: 'Warning Boundary’s caster step 10 / 15 / 20ft instead of 5, only its M branch and remaining movement.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n10',
    number: 10,
    name: 'Patient Anchor',
    column: 0,
    row: 4,
    maxRanks: 3,
    requiresPoints: 20,
    requires: ['cw1_ab_n08'],
    grantId: null,
    parameterKeys: ['unsteady-ground.expiryTurns'],
    unit: 'turns',
    rankValues: passiveRanks(
      ['Unsteady Ground expiry endT+3 instead of T+2; no extra trigger.', { 'unsteady-ground.expiryTurns': 3 }],
      ['Unsteady Ground expiry endT+4 instead of T+2; no extra trigger.', { 'unsteady-ground.expiryTurns': 4 }],
      ['Unsteady Ground expiry endT+5 instead of T+2; no extra trigger.', { 'unsteady-ground.expiryTurns': 5 }]
    ),
    effectText: 'Unsteady Ground expiry endT+3 / T+4 / T+5 instead of T+2; no extra trigger.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n11',
    number: 11,
    name: 'Companion Shelter',
    column: 2,
    row: 4,
    maxRanks: 3,
    requiresPoints: 20,
    requires: ['cw1_ab_n09'],
    grantId: null,
    parameterKeys: ['measured-shelter.ward'],
    unit: 'ward',
    rankValues: passiveRanks(
      ['Measured Shelter ward 5.', { 'measured-shelter.ward': 5 }],
      ['Measured Shelter ward 6.', { 'measured-shelter.ward': 6 }],
      ['Measured Shelter ward 7.', { 'measured-shelter.ward': 7 }]
    ),
    effectText: 'Measured Shelter ward 5 / 6 / 7; same field as P09 uses maximum, not sum.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n12',
    number: 12,
    name: 'Careful Seal',
    column: 0,
    row: 5,
    maxRanks: 3,
    requiresPoints: 25,
    requires: ['cw1_ab_n10'],
    grantId: null,
    parameterKeys: ['counterseal.surgeWard'],
    unit: 'ward',
    rankValues: passiveRanks(
      ['Counterseal Surge ward 7.', { 'counterseal.surgeWard': 7 }],
      ['Counterseal Surge ward 8.', { 'counterseal.surgeWard': 8 }],
      ['Counterseal Surge ward 9.', { 'counterseal.surgeWard': 9 }]
    ),
    effectText: 'Counterseal Surge ward 7 / 8 / 9; cannot refund anomaly tiles.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n13',
    number: 13,
    name: 'Inert Archive',
    column: 2,
    row: 5,
    maxRanks: 3,
    requiresPoints: 25,
    requires: ['cw1_ab_n11'],
    grantId: null,
    parameterKeys: ['hold-the-sample.expiryTurns'],
    unit: 'turns',
    rankValues: passiveRanks(
      ['Hold the Sample expiry endT+3; still inert-only and one anomaly slot.', { 'hold-the-sample.expiryTurns': 3 }],
      ['Hold the Sample expiry endT+4; still inert-only and one anomaly slot.', { 'hold-the-sample.expiryTurns': 4 }],
      ['Hold the Sample expiry endT+5; still inert-only and one anomaly slot.', { 'hold-the-sample.expiryTurns': 5 }]
    ),
    effectText: 'Hold the Sample expiry endT+3 / T+4 / T+5; still inert-only and one anomaly slot.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n14',
    number: 14,
    name: 'Edge Witness',
    column: 0,
    row: 6,
    maxRanks: 3,
    requiresPoints: 30,
    requires: ['cw1_ab_n12'],
    grantId: null,
    parameterKeys: ['edge-witness.checkBonus'],
    unit: 'check',
    rankValues: passiveRanks(
      ['+1 to one GM-called noncombat check to document an actually visible anomaly boundary per completed-rest interval.', { 'edge-witness.checkBonus': 1 }],
      ['+2 to one GM-called noncombat check to document an actually visible anomaly boundary per completed-rest interval.', { 'edge-witness.checkBonus': 2 }],
      ['+3 to one GM-called noncombat check to document an actually visible anomaly boundary per completed-rest interval.', { 'edge-witness.checkBonus': 3 }]
    ),
    effectText: '+1 / +2 / +3 to one GM-called noncombat check to document an actually visible anomaly boundary per completed-rest interval.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n15',
    number: 15,
    name: 'Calibrated Reagent',
    column: 2,
    row: 6,
    maxRanks: 3,
    requiresPoints: 30,
    requires: ['cw1_ab_n13'],
    grantId: null,
    parameterKeys: ['retune-apparatus.ward'],
    unit: 'ward',
    rankValues: passiveRanks(
      ['Retune Apparatus ward 5; still recovers only one spent F.', { 'retune-apparatus.ward': 5 }],
      ['Retune Apparatus ward 6; still recovers only one spent F.', { 'retune-apparatus.ward': 6 }],
      ['Retune Apparatus ward 7; still recovers only one spent F.', { 'retune-apparatus.ward': 7 }]
    ),
    effectText: 'Retune Apparatus ward 5 / 6 / 7; still recovers only one spent F.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ab_n16',
    number: 16,
    name: 'Last Survey',
    column: 0,
    row: 7,
    maxRanks: 3,
    requiresPoints: 35,
    requires: ['cw1_ab_n14'],
    grantId: null,
    parameterKeys: ['warning-boundary.placementRangeFeet', 'last-boundary.placementRangeFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Warning Boundary placement range 40ft.', { 'warning-boundary.placementRangeFeet': 40, 'last-boundary.placementRangeFeet': 40 }],
      ['Warning Boundary placement range 50ft.', { 'warning-boundary.placementRangeFeet': 50, 'last-boundary.placementRangeFeet': 50 }],
      ['Warning Boundary placement range 60ft.', { 'warning-boundary.placementRangeFeet': 60, 'last-boundary.placementRangeFeet': 60 }]
    ),
    effectText: 'Warning Boundary placement range 40 / 50 / 60ft; also Last Boundary’s placement range when learned; no price reduction.',
    capstoneExtension: {
      capstoneId: 'cw1_ab_n18',
      text: 'Also applies to Last Boundary’s placement range once the capstone is learned; inactive until then.'
    }
  },
  {
    id: 'cw1_ab_n17',
    number: 17,
    name: 'Deep Etching',
    column: 2,
    row: 7,
    maxRanks: 3,
    requiresPoints: 35,
    requires: ['cw1_ab_n15'],
    grantId: null,
    parameterKeys: ['warning-boundary.radiusFeet', 'last-boundary.radiusFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Warning Boundary radius 6ft.', { 'warning-boundary.radiusFeet': 6, 'last-boundary.radiusFeet': 12 }],
      ['Warning Boundary radius 8ft.', { 'warning-boundary.radiusFeet': 8, 'last-boundary.radiusFeet': 14 }],
      ['Warning Boundary radius 10ft.', { 'warning-boundary.radiusFeet': 10, 'last-boundary.radiusFeet': 16 }]
    ),
    effectText: 'Warning Boundary radius 6 / 8 / 10ft; also Last Boundary radius 12 / 14 / 16ft when learned; still one enemy trigger.',
    capstoneExtension: {
      capstoneId: 'cw1_ab_n18',
      text: 'Also applies to Last Boundary’s radius once the capstone is learned; inactive until then.'
    }
  },
  {
    id: 'cw1_ab_n18',
    number: 18,
    name: 'Last Boundary',
    column: 1,
    row: 8,
    maxRanks: 1,
    requiresPoints: 45,
    requires: ['cw1_ab_n05', 'cw1_ab_n16', 'cw1_ab_n17'],
    grantId: 'cw1_last_boundary',
    parameterKeys: [],
    unit: null,
    rankValues: passiveRanks(['Grant cw1_last_boundary.', {}]),
    effectText: 'Grant `cw1_last_boundary`.',
    capstoneExtension: null
  }
]);

/* ------------------------------------------------------------------ */
/* Cascade Weaver                                                      */
/* ------------------------------------------------------------------ */

const CASCADE_WEAVER = defineTree('cascade-weaver', [
  {
    id: 'cw1_ca_n01',
    number: 1,
    name: 'Sideways Reach',
    column: 0,
    row: 0,
    maxRanks: 3,
    requiresPoints: 0,
    requires: [],
    grantId: null,
    parameterKeys: ['sideways-spark.enemyRangeFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Sideways Spark enemy range 35ft.', { 'sideways-spark.enemyRangeFeet': 35 }],
      ['Sideways Spark enemy range 40ft.', { 'sideways-spark.enemyRangeFeet': 40 }],
      ['Sideways Spark enemy range 45ft.', { 'sideways-spark.enemyRangeFeet': 45 }]
    ),
    effectText: 'Sideways Spark enemy range 35 / 40 / 45ft.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n02',
    number: 2,
    name: 'Sure Footing',
    column: 2,
    row: 0,
    maxRanks: 3,
    requiresPoints: 0,
    requires: [],
    grantId: null,
    parameterKeys: ['sideways-spark.stepFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Sideways Spark legal caster step 10ft; damage unchanged.', { 'sideways-spark.stepFeet': 10 }],
      ['Sideways Spark legal caster step 15ft; damage unchanged.', { 'sideways-spark.stepFeet': 15 }],
      ['Sideways Spark legal caster step 20ft; damage unchanged.', { 'sideways-spark.stepFeet': 20 }]
    ),
    effectText: 'Sideways Spark legal caster step 10 / 15 / 20ft; damage unchanged.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n03',
    number: 3,
    name: 'Crosscurrent Hand',
    column: 0,
    row: 1,
    maxRanks: 3,
    requiresPoints: 5,
    requires: ['cw1_ca_n01'],
    grantId: null,
    parameterKeys: ['chosen-crosscurrent.shiftDamageFlatBonus'],
    unit: 'damage',
    rankValues: passiveRanks(
      ['Chosen Crosscurrent M flat damage bonus +1.', { 'chosen-crosscurrent.shiftDamageFlatBonus': 1 }],
      ['Chosen Crosscurrent M flat damage bonus +2.', { 'chosen-crosscurrent.shiftDamageFlatBonus': 2 }],
      ['Chosen Crosscurrent M flat damage bonus +3.', { 'chosen-crosscurrent.shiftDamageFlatBonus': 3 }]
    ),
    effectText: 'Chosen Crosscurrent M flat damage bonus +1 / +2 / +3.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n04',
    number: 4,
    name: 'Counterbalanced Load',
    column: 2,
    row: 1,
    maxRanks: 3,
    requiresPoints: 5,
    requires: ['cw1_ca_n02'],
    grantId: null,
    parameterKeys: ['counterweight.checkBonus'],
    unit: 'check',
    rankValues: passiveRanks(
      ['Counterweight’s noncombat check bonus +2 instead of +1.', { 'counterweight.checkBonus': 2 }],
      ['Counterweight’s noncombat check bonus +3 instead of +1.', { 'counterweight.checkBonus': 3 }],
      ['Counterweight’s noncombat check bonus +4 instead of +1.', { 'counterweight.checkBonus': 4 }]
    ),
    effectText: 'Counterweight’s noncombat check bonus +2 / +3 / +4 instead of +1.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n05',
    number: 5,
    name: 'Second Possibility',
    column: 1,
    row: 2,
    maxRanks: 1,
    requiresPoints: 10,
    requires: ['cw1_ca_n03'],
    grantId: 'cr1_chaos_weaver_second_possibility',
    parameterKeys: [],
    unit: null,
    rankValues: passiveRanks(['Grant cr1_chaos_weaver_second_possibility.', {}]),
    effectText: 'Grant `cr1_chaos_weaver_second_possibility`.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n06',
    number: 6,
    name: 'Passing Distance',
    column: 0,
    row: 2,
    maxRanks: 3,
    requiresPoints: 10,
    requires: ['cw1_ca_n03'],
    grantId: null,
    parameterKeys: ['second-possibility.allyStepFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Second Possibility ally step 10ft; still one extra M, no extra allowance.', { 'second-possibility.allyStepFeet': 10 }],
      ['Second Possibility ally step 15ft; still one extra M, no extra allowance.', { 'second-possibility.allyStepFeet': 15 }],
      ['Second Possibility ally step 20ft; still one extra M, no extra allowance.', { 'second-possibility.allyStepFeet': 20 }]
    ),
    effectText: 'Second Possibility ally step 10 / 15 / 20ft; still one extra M, no extra allowance.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n07',
    number: 7,
    name: 'Shared Reach',
    column: 2,
    row: 2,
    maxRanks: 3,
    requiresPoints: 10,
    requires: ['cw1_ca_n04'],
    grantId: null,
    parameterKeys: ['second-possibility.allyRangeFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Second Possibility predeclared ally range 40ft; enemy range unchanged.', { 'second-possibility.allyRangeFeet': 40 }],
      ['Second Possibility predeclared ally range 50ft; enemy range unchanged.', { 'second-possibility.allyRangeFeet': 50 }],
      ['Second Possibility predeclared ally range 60ft; enemy range unchanged.', { 'second-possibility.allyRangeFeet': 60 }]
    ),
    effectText: 'Second Possibility predeclared ally range 40 / 50 / 60ft; enemy range unchanged.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n08',
    number: 8,
    name: 'Slip the Knot',
    column: 0,
    row: 3,
    maxRanks: 3,
    requiresPoints: 15,
    requires: ['cw1_ca_n06'],
    grantId: null,
    parameterKeys: ['slip-tether.shiftStepFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Slip Tether M step 15ft; no effect on Fracture.', { 'slip-tether.shiftStepFeet': 15 }],
      ['Slip Tether M step 20ft; no effect on Fracture.', { 'slip-tether.shiftStepFeet': 20 }],
      ['Slip Tether M step 25ft; no effect on Fracture.', { 'slip-tether.shiftStepFeet': 25 }]
    ),
    effectText: 'Slip Tether M step 15 / 20 / 25ft; no effect on Fracture.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n09',
    number: 9,
    name: 'Return Practice',
    column: 2,
    row: 3,
    maxRanks: 3,
    requiresPoints: 15,
    requires: ['cw1_ca_n07'],
    grantId: null,
    parameterKeys: ['return-line.displacementFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Return Line legal displacement 20ft.', { 'return-line.displacementFeet': 20 }],
      ['Return Line legal displacement 25ft.', { 'return-line.displacementFeet': 25 }],
      ['Return Line legal displacement 30ft.', { 'return-line.displacementFeet': 30 }]
    ),
    effectText: 'Return Line legal displacement 20 / 25 / 30ft.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n10',
    number: 10,
    name: 'Optional Shelter',
    column: 0,
    row: 4,
    maxRanks: 3,
    requiresPoints: 20,
    requires: ['cw1_ca_n08'],
    grantId: null,
    parameterKeys: ['second-possibility.allyWard'],
    unit: 'ward',
    rankValues: passiveRanks(
      ['Second Possibility may predeclare spend S for ally ward 3 until next caster start.', { 'second-possibility.allyWard': 3 }],
      ['Second Possibility may predeclare spend S for ally ward 4 until next caster start.', { 'second-possibility.allyWard': 4 }],
      ['Second Possibility may predeclare spend S for ally ward 5 until next caster start.', { 'second-possibility.allyWard': 5 }]
    ),
    effectText: 'Second Possibility may predeclare an alternative follow-up: spend S for ward 3 / 4 / 5 to its ally until next caster start. Choose S-ward OR M-move before primary commit; exactly one optional result.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n11',
    number: 11,
    name: 'Passed Momentum',
    column: 2,
    row: 4,
    maxRanks: 3,
    requiresPoints: 20,
    requires: ['cw1_ca_n09'],
    grantId: null,
    parameterKeys: ['passed-opening.displacementFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Passed Opening ally displacement 15ft.', { 'passed-opening.displacementFeet': 15 }],
      ['Passed Opening ally displacement 20ft.', { 'passed-opening.displacementFeet': 20 }],
      ['Passed Opening ally displacement 25ft.', { 'passed-opening.displacementFeet': 25 }]
    ),
    effectText: 'Passed Opening ally displacement 15 / 20 / 25ft.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n12',
    number: 12,
    name: 'Joint Reading',
    column: 0,
    row: 5,
    maxRanks: 3,
    requiresPoints: 25,
    requires: ['cw1_ca_n10'],
    grantId: null,
    parameterKeys: ['joint-containment.surgeWard'],
    unit: 'ward',
    rankValues: passiveRanks(
      ['Joint Containment Surge ward 9.', { 'joint-containment.surgeWard': 9 }],
      ['Joint Containment Surge ward 10.', { 'joint-containment.surgeWard': 10 }],
      ['Joint Containment Surge ward 11.', { 'joint-containment.surgeWard': 11 }]
    ),
    effectText: 'Joint Containment Surge ward 9 / 10 / 11; downside unchanged.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n13',
    number: 13,
    name: 'Crossgrain Method',
    column: 2,
    row: 5,
    maxRanks: 3,
    requiresPoints: 25,
    requires: ['cw1_ca_n11'],
    grantId: null,
    parameterKeys: ['crossgrain-ray.shiftDamageFlatBonus'],
    unit: 'damage',
    rankValues: passiveRanks(
      ['Crossgrain Ray Shift flat damage bonus +1.', { 'crossgrain-ray.shiftDamageFlatBonus': 1 }],
      ['Crossgrain Ray Shift flat damage bonus +2.', { 'crossgrain-ray.shiftDamageFlatBonus': 2 }],
      ['Crossgrain Ray Shift flat damage bonus +3.', { 'crossgrain-ray.shiftDamageFlatBonus': 3 }]
    ),
    effectText: 'Crossgrain Ray Shift flat damage bonus +1 / +2 / +3; legal movement unchanged.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n14',
    number: 14,
    name: 'Refuge Route',
    column: 0,
    row: 6,
    maxRanks: 3,
    requiresPoints: 30,
    requires: ['cw1_ca_n12'],
    grantId: null,
    parameterKeys: ['lateral-refuge.shiftDisplacementFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Lateral Refuge M displacement 25ft.', { 'lateral-refuge.shiftDisplacementFeet': 25 }],
      ['Lateral Refuge M displacement 30ft.', { 'lateral-refuge.shiftDisplacementFeet': 30 }],
      ['Lateral Refuge M displacement 35ft.', { 'lateral-refuge.shiftDisplacementFeet': 35 }]
    ),
    effectText: 'Lateral Refuge M displacement 25 / 30 / 35ft.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n15',
    number: 15,
    name: 'One Clear Signal',
    column: 2,
    row: 6,
    maxRanks: 3,
    requiresPoints: 30,
    requires: ['cw1_ca_n13'],
    grantId: null,
    parameterKeys: ['one-clear-signal.checkBonus'],
    unit: 'check',
    rankValues: passiveRanks(
      ['+1 to one GM-called noncombat check coordinating a predeclared safe route per completed-rest interval.', { 'one-clear-signal.checkBonus': 1 }],
      ['+2 to one GM-called noncombat check coordinating a predeclared safe route per completed-rest interval.', { 'one-clear-signal.checkBonus': 2 }],
      ['+3 to one GM-called noncombat check coordinating a predeclared safe route per completed-rest interval.', { 'one-clear-signal.checkBonus': 3 }]
    ),
    effectText: '+1 / +2 / +3 to one GM-called noncombat check coordinating a predeclared safe route per completed-rest interval; no automatic ally action.',
    capstoneExtension: null
  },
  {
    id: 'cw1_ca_n16',
    number: 16,
    name: 'Aftershock Reach',
    column: 0,
    row: 7,
    maxRanks: 3,
    requiresPoints: 35,
    requires: ['cw1_ca_n14'],
    grantId: null,
    parameterKeys: ['second-possibility.enemyRangeFeet', 'single-aftershock.allyRangeFeet'],
    unit: 'ft',
    rankValues: passiveRanks(
      ['Second Possibility primary enemy range 40ft.', { 'second-possibility.enemyRangeFeet': 40, 'single-aftershock.allyRangeFeet': 40 }],
      ['Second Possibility primary enemy range 50ft.', { 'second-possibility.enemyRangeFeet': 50, 'single-aftershock.allyRangeFeet': 50 }],
      ['Second Possibility primary enemy range 60ft.', { 'second-possibility.enemyRangeFeet': 60, 'single-aftershock.allyRangeFeet': 60 }]
    ),
    effectText: 'Second Possibility’s primary enemy range 40 / 50 / 60ft; also Single Aftershock predeclared ally range 40 / 50 / 60ft when learned.',
    capstoneExtension: {
      capstoneId: 'cw1_ca_n18',
      text: 'Also applies to Single Aftershock’s predeclared ally range once the capstone is learned; inactive until then.'
    }
  },
  {
    id: 'cw1_ca_n17',
    number: 17,
    name: 'Last Continuation',
    column: 2,
    row: 7,
    maxRanks: 3,
    requiresPoints: 35,
    requires: ['cw1_ca_n15'],
    grantId: null,
    parameterKeys: [
      'second-possibility.continuationFeet',
      'second-possibility.continuationWard',
      'single-aftershock.continuationFeet',
      'single-aftershock.continuationWard'
    ],
    unit: null,
    rankValues: passiveRanks(
      ['Second Possibility optional M 25ft or learned optional S ward 6; Single Aftershock optional M 15ft or S ward 7.', { 'second-possibility.continuationFeet': 25, 'second-possibility.continuationWard': 6, 'single-aftershock.continuationFeet': 15, 'single-aftershock.continuationWard': 7 }],
      ['Second Possibility optional M 30ft or learned optional S ward 7; Single Aftershock optional M 20ft or S ward 8.', { 'second-possibility.continuationFeet': 30, 'second-possibility.continuationWard': 7, 'single-aftershock.continuationFeet': 20, 'single-aftershock.continuationWard': 8 }],
      ['Second Possibility optional M 35ft or learned optional S ward 8; Single Aftershock optional M 25ft or S ward 9.', { 'second-possibility.continuationFeet': 35, 'second-possibility.continuationWard': 8, 'single-aftershock.continuationFeet': 25, 'single-aftershock.continuationWard': 9 }]
    ),
    effectText: 'Second Possibility optional M displacement 25 / 30 / 35ft or learned optional S ward 6 / 7 / 8; Single Aftershock optional M 15 / 20 / 25ft or S ward 7 / 8 / 9 when learned. Still exactly one follow-up, with remaining movement bounding displacement.',
    capstoneExtension: {
      capstoneId: 'cw1_ca_n18',
      text: 'Also applies to Single Aftershock’s continuations once the capstone is learned; inactive until then.'
    }
  },
  {
    id: 'cw1_ca_n18',
    number: 18,
    name: 'Single Aftershock',
    column: 1,
    row: 8,
    maxRanks: 1,
    requiresPoints: 45,
    requires: ['cw1_ca_n05', 'cw1_ca_n16', 'cw1_ca_n17'],
    grantId: 'cw1_single_aftershock',
    parameterKeys: [],
    unit: null,
    rankValues: passiveRanks(['Grant cw1_single_aftershock.', {}]),
    effectText: 'Grant `cw1_single_aftershock`.',
    capstoneExtension: null
  }
]);

export const CHAOS_WEAVER_TREES = [PROBABILITY_SCULPTOR, ANOMALY_BINDER, CASCADE_WEAVER];

export const CHAOS_WEAVER_TALENT_NODES = CHAOS_WEAVER_TREES.flatMap((tree) => tree.nodes);

export const CHAOS_WEAVER_TALENT_NODES_BY_ID = Object.fromEntries(
  CHAOS_WEAVER_TALENT_NODES.map((node) => [node.id, node])
);

/* 48 rank-passive authored spell records, derived from the nodes above so the
 * rank tuples exist once. Signature/capstone grant nodes produce no passive
 * record; their granted actives live in chaosWeaverData.js. */
const buildPassiveSpell = (node) => ({
  id: `talent_spell_${node.id}`,
  classId: CHAOS_WEAVER_CLASS_ID,
  rulesetVersion: CHAOS_WEAVER_RULESET_VERSION,
  name: node.name,
  level: node.minLevel,
  source: 'talent',
  treeId: node.treeId,
  spellType: 'PASSIVE',
  icon: CHAOS_WEAVER_ICON,
  resourceCost: { actionPoints: 0, mana: 0 },
  tileRule: { inputSymbols: [], zoneFrom: null, zoneTo: null, count: 0, spendAllPrimary: false },
  target: { roles: [], rangeFeet: 0, maxSubjects: 0 },
  branchRule: null,
  outcome: null,
  timing: { use: 'passive', expiry: null, oncePerRest: false },
  damage: null,
  reaction: null,
  savingThrow: null,
  conditions: [],
  area: null,
  continuation: null,
  rankValues: node.rankValues.map((rank) => ({ rank: rank.rank, text: rank.text, values: { ...rank.values } })),
  requires: {
    nodeId: node.id,
    requiresPoints: node.requiresPoints,
    requiresAll: true,
    predecessorNodeIds: [...node.requires],
    minLevel: node.minLevel
  },
  effectText: node.effectText,
  sourceRefs: [`CLASS-C1-CHAOS-WEAVER.md §6 ${node.treeId} node ${String(node.number).padStart(2, '0')}`],
  authoredOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualRequirements: [
    CHAOS_WEAVER_MANUAL_ONLY_NOTICE,
    'Manual rule description and preview modifier only; never a live buff, and the same parameter across hybrids uses the largest value.',
    ...(node.capstoneExtension ? [node.capstoneExtension.text] : [])
  ]
});

export const CHAOS_WEAVER_PASSIVE_SPELLS = CHAOS_WEAVER_TALENT_NODES
  .filter((node) => node.maxRanks === 3)
  .map(buildPassiveSpell);

export const CHAOS_WEAVER_PASSIVE_SPELLS_BY_ID = Object.fromEntries(
  CHAOS_WEAVER_PASSIVE_SPELLS.map((record) => [record.id, record])
);

export const CHAOS_WEAVER_TALENT_CAPACITY = {
  trees: CHAOS_WEAVER_TREES.length,
  nodes: CHAOS_WEAVER_TALENT_NODES.length,
  perTreeRanks: CHAOS_WEAVER_TREES.map((tree) => ({
    treeId: tree.id,
    maxRanks: tree.nodes.reduce((sum, node) => sum + node.maxRanks, 0)
  })),
  totalRankCapacity: CHAOS_WEAVER_TALENT_NODES.reduce((sum, node) => sum + node.maxRanks, 0),
  characterPointCap: 50
};
