const identity = {
  classId: 'druid', rulesetVersion: 'cr-review-r1', authoredOnly: true,
  executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [],
  manualOnly: true,
  manualNotice: 'Manual tabletop only; no automatic transformation, slot, transition, recovery, suspension, damage, ward, movement or expiry.'
};

export const DRUID_TREE_META = [
  {
    id: 'predator', name: 'Predator', stem: 'predator', short: 'pd',
    signature: 'pursuit_morph', capstone: 'apex_of_the_hunt',
    signatureNode: 'cr1_druid_predator_signature',
    capstoneNode: 'cr1_druid_predator_capstone',
    tagline: 'Spend locomotion and offense on a body that reaches and strikes.'
  },
  {
    id: 'adaptive-bastion', name: 'Adaptive Bastion', stem: 'adaptive_bastion', short: 'ab',
    signature: 'living_brace', capstone: 'unbroken_bastion',
    signatureNode: 'cr1_druid_adaptive_bastion_signature',
    capstoneNode: 'cr1_druid_adaptive_bastion_capstone',
    tagline: 'Hold adapted anatomy still and choose the impact to resist.'
  },
  {
    id: 'mimic', name: 'Mimic', stem: 'mimic', short: 'mc',
    signature: 'borrowed_outline', capstone: 'perfect_outline',
    signatureNode: 'cr1_druid_mimic_signature',
    capstoneNode: 'cr1_druid_mimic_capstone',
    tagline: 'Wear a studied outline without stealing a life.'
  }
];

const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];

const rows = {
  predator: [
    ['first_blood', 'First Blood', [1, 2, 3], 'predator.damageBonus', 'Add {v} slicing to the first natural-weapon hit each round.'],
    ['climbing_pads', 'Climbing Pads', [5, 10, 15], 'predator.climbFeet', 'Add {v} ft to climbing movement while Predator is active.'],
    ['pouncing_gait', 'Pouncing Gait', [1, 2, 3], 'predator.leapBonusFeet', 'Add {v} ft to one leap while Predator is active.'],
    ['blood_scent', 'Blood Scent', [1, 2, 3], 'predator.trackBonus', 'Add {v} to one tracking check against a wounded quarry.'],
    ['savage_focus', 'Savage Focus', [1, 2, 3], 'predator.focusBonus', 'Add {v} to one concentration check to keep a Predator trait.'],
    ['rending_claws', 'Rending Claws', [1, 2, 3], 'predator.rendDamage', 'Add {v} slicing when both Predator slots are active.'],
    ['pack_instinct', 'Pack Instinct', [1, 2, 3], 'predator.allyAttackBonus', 'Add {v} to one ally attack against a target you struck this round.'],
    ['territorial_roar', 'Territorial Roar', [1, 2, 3], 'predator.intimidationBonus', 'Add {v} to one Intimidation check while visibly transformed.'],
    ['springing_charge', 'Springing Charge', [5, 10, 15], 'predator.chargeFeet', 'Add {v} ft to one charge before a natural strike.'],
    ['predator_patience', 'Predator Patience', [1, 2, 3], 'predator.initiativeBonus', 'Add {v} to one initiative check while Predator is prepared.'],
    ['culling_strike', 'Culling Strike', [1, 2, 3], 'predator.woundedBonus', 'Add {v} slicing against a target below half health.'],
    ['sinew_snap', 'Sinew Snap', [1, 2, 3], 'predator.savePenalty', 'Impose -{v} on one save against a Predator strike; declared before the roll.'],
    ['uncanny_dodge', 'Uncanny Dodge', [1, 2, 3], 'predator.dodgeBonus', 'Add {v} to one Agility save while Predator is active.'],
    ['relentless_chase', 'Relentless Chase', [5, 10, 15], 'predator.pursuitFeet', 'Add {v} ft to one move toward a fleeing target.'],
    ['apex_senses', 'Apex Senses', [1, 2, 3], 'predator.perceptionBonus', 'Add {v} to one Perception check while Predator is active.'],
    ['predator_mastery', 'Predator Mastery', [1, 2, 3], 'predator.allDamageBonus', 'Add {v} slicing to one natural-weapon damage event each round.']
  ],
  'adaptive-bastion': [
    ['layered_plate', 'Layered Plate', [1, 2, 3], 'bastion.plateBonus', 'Increase one layered plating prevention by {v}.'],
    ['braced_stance', 'Braced Stance', [1, 2, 3], 'bastion.braceBonus', 'Increase one Living Brace prevention by {v}.'],
    ['rooted', 'Rooted', [1, 2, 3], 'bastion.stabilityBonus', 'Add {v} to one check to resist forced movement while braced.'],
    ['impact_reading', 'Impact Reading', [1, 2, 3], 'bastion.insightBonus', 'Add {v} to one check to read an incoming impact.'],
    ['shield_scales', 'Shield Scales', [1, 2, 3], 'bastion.saveBonus', 'Add {v} to one save while Bastion is active.'],
    ['guardian_reach', 'Guardian Reach', [5, 10, 15], 'bastion.protectFeet', 'Add {v} ft to the distance at which you can interpose.'],
    ['stone_skin', 'Stone Skin', [1, 2, 3], 'bastion.damageReduction', 'Reduce one nonmagical damage event by {v} while Bastion is active.'],
    ['unyielding', 'Unyielding', [1, 2, 3], 'bastion.woundedBonus', 'Add {v} to one check while below half health and braced.'],
    ['brace_recovery', 'Brace Recovery', [1, 2, 3], 'bastion.recoverBonus', 'Reduce one recovery cost by {v} AP once per long rest; never below 0.'],
    ['bulwark_aura', 'Bulwark Aura', [5, 10, 15], 'bastion.allyCoverFeet', 'Extend one ally cover benefit by {v} ft while you are braced.'],
    ['ground_anchor', 'Ground Anchor', [1, 2, 3], 'bastion.forcedMovePenalty', 'Impose -{v} on one attempt to move you while braced.'],
    ['plated_counter', 'Plated Counter', [1, 2, 3], 'bastion.counterDamage', 'Deal {v} smashing after preventing damage with plating; once per round.'],
    ['endurance', 'Endurance', [1, 2, 3], 'bastion.constitutionSaveBonus', 'Add {v} to one Constitution save.'],
    ['shelter_other', 'Shelter Other', [1, 2, 3], 'bastion.allyDamagePrevention', 'Prevent {v} damage for one adjacent ally; uses your plate window.'],
    ['last_plate', 'Last Plate', [1, 2, 3], 'bastion.finalPrevention', 'Increase one prevention when at or below one-quarter health by {v}.'],
    ['bastion_mastery', 'Bastion Mastery', [1, 2, 3], 'bastion.allPreventionBonus', 'Increase one prevention each round by {v}.']
  ],
  mimic: [
    ['studied_detail', 'Studied Detail', [1, 2, 3], 'mimic.studyBonus', 'Reduce one study time by {v} minutes; minimum 1.'],
    ['borrowed_voice', 'Borrowed Voice', [1, 2, 3], 'mimic.deceptionBonus', 'Add {v} to one Deception check while using Borrowed Outline.'],
    ['soft_gait', 'Soft Gait', [5, 10, 15], 'mimic.stealthFeet', 'Add {v} ft to one stealth approach; no invisibility.'],
    ['surface_read', 'Surface Read', [1, 2, 3], 'mimic.insightBonus', 'Add {v} to one check to read a studied outline.'],
    ['patient_observer', 'Patient Observer', [1, 2, 3], 'mimic.perceptionBonus', 'Add {v} to one Perception check during study.'],
    ['size_tolerance', 'Size Tolerance', [5, 10, 15], 'mimic.sizePercent', 'Increase the allowed height difference by {v}% for one outline.'],
    ['false_scar', 'False Scar', [1, 2, 3], 'mimic.disguiseBonus', 'Add {v} to one check to pass a superficial inspection.'],
    ['quiet_change', 'Quiet Change', [1, 2, 3], 'mimic.stealthChangeBonus', 'Add {v} to one Stealth check made immediately after adopting Mimic.'],
    ['recognized_self', 'Recognized Self', [1, 2, 3], 'mimic.identityBonus', 'Add {v} to one check to be recognized as yourself after mimicry.'],
    ['mimic_escape', 'Mimic Escape', [1, 2, 3], 'mimic.escapeBonus', 'Add {v} to one check to slip away while disguised.'],
    ['borrowed_manner', 'Borrowed Manner', [1, 2, 3], 'mimic.performanceBonus', 'Add {v} to one Performance check while using an outline.'],
    ['close_study', 'Close Study', [1, 2, 3], 'mimic.detailBonus', 'Add {v} to one check to notice a flaw in another disguise.'],
    ['familiar_face', 'Familiar Face', [1, 2, 3], 'mimic.socialBonus', 'Add {v} to one social check with a creature that knows the studied outline.'],
    ['vanishing_act', 'Vanishing Act', [1, 2, 3], 'mimic.hideBonus', 'Add {v} to one Hide check after a public transformation.'],
    ['perfect_recall', 'Perfect Recall', [1, 2, 3], 'mimic.recallMax', 'Retain up to {v} studied outlines; no stolen memories.'],
    ['mimic_mastery', 'Mimic Mastery', [1, 2, 3], 'mimic.allDisguiseBonus', 'Add {v} to one disguise-related check each round.']
  ]
};

const SIGNATURE_NAMES = {
  pursuit_morph: 'Pursuit Morph',
  apex_of_the_hunt: 'Apex of the Hunt',
  living_brace: 'Living Brace',
  unbroken_bastion: 'Unbroken Bastion',
  borrowed_outline: 'Borrowed Outline',
  perfect_outline: 'Perfect Outline'
};

export const DRUID_TREES = DRUID_TREE_META.map(meta => {
  const nodeId = slot => slot === 'signature' ? meta.signatureNode
    : slot === 'capstone' ? meta.capstoneNode
      : `cr1_druid_${meta.stem}_${slot}`;
  const nodes = rows[meta.id].map(([suffix, name, values, mechanic, text], index) => {
    const [minLevel, requiresPoints, predecessors] = gates[index];
    const slot = `p${String(index + 1).padStart(2, '0')}`;
    return {
      ...identity, id: nodeId(slot), treeId: meta.id, name,
      passiveSpellId: `cr1_druid_${meta.short}_${suffix}`, grantId: null,
      maxRanks: 3, minLevel, requiresPoints, requires: predecessors.map(nodeId), requiresAll: true,
      column: index < 3 ? index : index === 3 ? 0 : index % 2 === 0 ? 0 : 2,
      row: minLevel - 1,
      effectText: text.replaceAll('{v}', values.join(' / ')),
      parameterKeys: [mechanic],
      rankValues: values.map((value, i) => ({
        rank: i + 1, text: text.replaceAll('{v}', String(value)), values: { [mechanic]: value }
      }))
    };
  });
  nodes.push(...[
    ['signature', meta.signature, 3, 10, ['p01', 'p02'], 2],
    ['capstone', meta.capstone, 10, 45, ['p15', 'signature'], 10]
  ].map(([slot, spell, minLevel, requiresPoints, predecessors, row]) => ({
    ...identity, id: nodeId(slot), treeId: meta.id, name: SIGNATURE_NAMES[spell],
    grantId: `cr1_druid_${spell}`, passiveSpellId: null, maxRanks: 1,
    minLevel, requiresPoints, requires: predecessors.map(nodeId), requiresAll: true, column: 1, row,
    effectText: `Grant cr1_druid_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant cr1_druid_${spell}.`, values: {} }]
  })));
  return { ...identity, id: meta.id, meta, nodes };
});

export const DRUID_TALENT_NODES = DRUID_TREES.flatMap(tree => tree.nodes);

export const DRUID_PASSIVE_RECORDS = DRUID_TALENT_NODES
  .filter(node => node.passiveSpellId)
  .map(node => ({
    ...identity, id: node.passiveSpellId, name: node.name, level: node.minLevel,
    treeId: node.treeId, source: 'talent-passive', spellType: 'PASSIVE',
    description: `${node.effectText} Highest learned rank only; an unlearned optional spell stays unlearned. ${identity.manualNotice}`,
    resourceCost: { actionPoints: 0, mana: 0 },
    targetingConfig: { targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 },
    damageConfig: null, effectTypes: ['buff'], durationConfig: null,
    cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
    reactionTiming: null, savingThrow: null, area: null, conditions: [],
    rankValues: node.rankValues,
    requires: {
      nodeId: node.id, requiresPoints: node.requiresPoints,
      predecessorNodeIds: node.requires, requiresAll: true, minLevel: node.minLevel
    },
    manualMechanics: { kind: 'ranked-modifier', rankValues: node.rankValues, executable: false },
    sourceRefs: ['RI-4 Druid content lock']
  }));

export const DRUID_TALENT_CAPACITY = {
  trees: 3, nodes: 54,
  perTreeRanks: DRUID_TREES.map(tree => ({
    treeId: tree.id, maxRanks: tree.nodes.reduce((total, node) => total + node.maxRanks, 0)
  })),
  totalRankCapacity: 150, characterPointCap: 50
};
