const identity = {
  classId: 'covenbane',
  rulesetVersion: 'cr-review-r1',
  authoredOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualOnly: true,
  manualNotice: 'Manual tabletop only; no automatic charge generation, dispel, ward breaking, stealth, damage, or expiry.'
};

export const COVENBANE_TREE_META = [
  {
    id: 'shadowbane',
    name: 'Shadowbane',
    stem: 'shadowbane',
    short: 'sb',
    signature: 'null_shroud',
    capstone: 'aegis_of_bog_iron',
    signatureNode: 'cr1_covenbane_shadowbane_signature',
    capstoneNode: 'cr1_covenbane_shadowbane_capstone',
    tagline: 'Track residual occult spoor, stalk unseen through leylines, and strike from absolute silence.'
  },
  {
    id: 'spellbreaker',
    name: 'Spellbreaker',
    stem: 'spellbreaker',
    short: 'sp',
    signature: 'leyline_cleaver',
    capstone: 'absolute_severance',
    signatureNode: 'cr1_covenbane_spellbreaker_signature',
    capstoneNode: 'cr1_covenbane_spellbreaker_capstone',
    tagline: 'Parrying magical forces, shattering wards into pure shrapnel, and draining leyline reserves.'
  },
  {
    id: 'demonhunter',
    name: 'Demonhunter',
    stem: 'demonhunter',
    short: 'dh',
    signature: 'barbed_execution',
    capstone: 'void_strata_judgment',
    signatureNode: 'cr1_covenbane_demonhunter_signature',
    capstoneNode: 'cr1_covenbane_demonhunter_capstone',
    tagline: 'Relentless execution of abominations, bleeding tainted veins, and purging planar corruption.'
  }
];

const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];

const rows = {
  shadowbane: [
    ['hex_focus', 'Hex Focus', [1, 2, 3], 'shadowbane.chargeBuildRate', 'Gain +{v} additional Hexbreaker Charge upon observing or entering combat with an enemy spellcaster.'],
    ['quiet_tread', 'Quiet Tread', [5, 10, 15], 'shadowbane.stealthSpeed', 'Add {v} ft to Stealth movement while stalking a creature with magical capabilities.'],
    ['residual_trail', 'Residual Trail', [1, 2, 3], 'shadowbane.trackBonus', 'Add +{v} to Survival/Tracking checks against magical trails and residue.'],
    ['shadow_strike', 'Shadow Strike', [1, 2, 3], 'shadowbane.stealthDamage', 'Weapon attacks from stealth deal +{v}d6 physical damage.'],
    ['mist_veil', 'Mist Veil', [1, 2, 3], 'shadowbane.mistStealth', 'Gain +{v} to Stealth checks in fog, rain, or low-light terrain.'],
    ['curse_resistance', 'Curse Resistance', [1, 2, 3], 'shadowbane.curseSave', 'Add +{v} to saving throws against curses, hexes, and necromancy.'],
    ['silent_pursuit', 'Silent Pursuit', [1, 2, 3], 'shadowbane.moveDiscount', 'Moving within 30 ft of a concentrating enemy costs -{v} less movement.'],
    ['cold_patience', 'Cold Patience', [1, 2, 3], 'shadowbane.initiativeBonus', 'Add +{v} to Initiative when an enemy spellcaster is detected.'],
    ['iron_cowl', 'Iron Cowl', [2, 4, 6], 'shadowbane.psychicMitigation', 'Reduce psychic and illusion damage taken by {v}.'],
    ['barbed_snares', 'Barbed Snares', [1, 2, 3], 'shadowbane.trapDc', 'When setting physical traps or wards, increase save DC by +{v}.'],
    ['whispering_salt', 'Whispering Salt', [5, 10, 15], 'shadowbane.saltReveal', 'Salt wards reveal hidden creatures within {v} ft of the boundary.'],
    ['ambush_precision', 'Ambush Precision', [1, 2, 3], 'shadowbane.armorShred', 'Weapon attacks from stealth reduce target armor by {v} for 1 round.'],
    ['unseen_step', 'Unseen Step', [1, 2, 3], 'shadowbane.agilitySave', 'Add +{v} to Agility saves while unseen or in concealment.'],
    ['dampened_stride', 'Dampened Stride', [33, 66, 100], 'shadowbane.noiseReduction', 'Footsteps and armor clinking produce {v}% less noise.'],
    ['shadow_execution', 'Shadow Execution', [1, 2, 3], 'shadowbane.critReduction', 'Attacks against unaware enemies have critical hit threshold reduced by {v}.'],
    ['shadowbane_mastery', 'Shadowbane Mastery', [1, 2, 3], 'shadowbane.allStealth', 'Gain +{v} to all Stealth and tracking checks, and +1 max Hexbreaker charge capacity.']
  ],
  spellbreaker: [
    ['ward_breaker', 'Ward Breaker', [1, 2, 3], 'spellbreaker.wardDamage', 'Deal +{v}d8 bonus damage against magical shields and ward pools.'],
    ['iron_parry', 'Iron Parry', [2, 4, 6], 'spellbreaker.parryMitigation', 'Deflecting a spell attack reduces damage by an additional +{v}.'],
    ['kinetic_feedback', 'Kinetic Feedback', [2, 4, 6], 'spellbreaker.disruptDamage', 'When you disrupt an enemy spell, the caster takes {v} force damage.'],
    ['spell_attrition', 'Spell Attrition', [1, 2, 3], 'spellbreaker.manaBurn', 'Your weapon attacks burn {v} mana from enemies on hit.'],
    ['dense_iron', 'Dense Iron', [10, 20, 30], 'spellbreaker.penetration', 'Weapons crafted with cold iron ignore {v}% of magical damage resistances.'],
    ['counter_poise', 'Counter Poise', [1, 2, 3], 'spellbreaker.willSave', 'Gain +{v} to Will saves against enchantment and mental domination.'],
    ['rupture_ward', 'Rupture Ward', [1, 2, 3], 'spellbreaker.shatterBurst', 'Dispelling an active effect creates a 5 ft burst dealing {v}d6 force damage to enemies.'],
    ['disruption_tempo', 'Disruption Tempo', [1, 2, 3], 'spellbreaker.attackVsCaster', 'Gain +{v} to weapon attack rolls against enemies that cast a spell this round.'],
    ['grounding_frame', 'Grounding Frame', [2, 4, 6], 'spellbreaker.stormMitigation', 'Reduce incoming lightning, storm, and force damage by {v}.'],
    ['shatter_thrust', 'Shatter Thrust', [2, 4, 6], 'spellbreaker.concentrationPenalty', 'Critical hits on spellcasters force an immediate concentration check with -{v} penalty.'],
    ['resonant_parry', 'Resonant Parry', [1, 2, 2], 'spellbreaker.chargeOnParry', 'Successfully parrying a magical strike generates +{v} Hexbreaker Charge (once per round).'],
    ['arcane_fracture', 'Arcane Fracture', [1, 2, 3], 'spellbreaker.spellAttackPenalty', 'Enemies whose spells you parry suffer -{v} to spell attack rolls until end of their turn.'],
    ['firm_footing', 'Firm Footing', [1, 2, 3], 'spellbreaker.knockbackResist', 'Add +{v} to checks against forced movement or knockback caused by spells.'],
    ['severing_momentum', 'Severing Momentum', [1, 2, 3], 'spellbreaker.apRefund', 'Killing an enemy or breaking a ward refunds {v} AP once per encounter.'],
    ['null_barrier', 'Null Barrier', [1, 2, 3], 'spellbreaker.nullAc', 'Standing inside a null-zone grants +{v} AC against ranged attacks.'],
    ['spellbreaker_mastery', 'Spellbreaker Mastery', [1, 2, 3], 'spellbreaker.masteryBoost', 'Ward Breaker bonus increases by +{v}d8 and dispels remove 1 additional minor buff.']
  ],
  demonhunter: [
    ['unholy_scourge', 'Unholy Scourge', [1, 2, 3], 'demonhunter.radiantDamage', 'Weapon attacks deal +{v}d4 radiant damage against aberrations, fiends, and undead.'],
    ['blood_scent', 'Blood Scent', [1, 2, 3], 'demonhunter.attackVsWounded', 'Gain +{v} to attack rolls against wounded magical targets (below 50% HP).'],
    ['barbed_vow', 'Barbed Vow', [1, 2, 3], 'demonhunter.critReduction', 'Critical hit threshold against unholy and corrupted creatures reduced by {v}.'],
    ['fearless_gaze', 'Fearless Gaze', [2, 4, 6], 'demonhunter.fearSave', 'Gain +{v} to saves against fear and horror; immune to supernatural terror at rank 3.'],
    ['rending_strike', 'Rending Strike', [4, 6, 8], 'demonhunter.bleedDamage', 'Weapon hits cause bleeding for 1d{v} physical damage per turn for 2 turns.'],
    ['corpse_burn', 'Corpse Burn', [2, 4, 6], 'demonhunter.tempHpOnKill', 'Slain foes cannot be reanimated; gain {v} temp HP upon slaying an unholy foe.'],
    ['vow_of_silence', 'Vow of Silence', [1, 2, 3], 'demonhunter.verbalSave', 'Gain advantage and +{v} bonus on saving throws against verbal spells and command words.'],
    ['barbed_chains', 'Barbed Chains', [1, 2, 3], 'demonhunter.chainDamage', 'Enemies you slow or root suffer {v}d6 piercing damage when attempting to move.'],
    ['silver_marrow', 'Silver Marrow', [25, 50, 75], 'demonhunter.drPenetration', 'Weapon strikes ignore necrotic and unholy damage reduction by {v}%.'],
    ['ruthless_execution', 'Ruthless Execution', [2, 4, 6], 'demonhunter.execBonusDamage', 'When target is below 25% HP, weapon attacks deal +{v}d6 bonus damage.'],
    ['vital_severance', 'Vital Severance', [1, 2, 3], 'demonhunter.bleedAmp', 'Bleeding enemies take +{v} additional damage from your Hexbreaker abilities.'],
    ['relentless_hunt', 'Relentless Hunt', [5, 10, 15], 'demonhunter.pursuitSpeed', 'If quarry flees, movement speed increases by +{v} ft toward them.'],
    ['iron_constitution', 'Iron Constitution', [1, 2, 3], 'demonhunter.conSave', 'Add +{v} to Constitution saves against poison and supernatural diseases.'],
    ['purifying_burst', 'Purifying Burst', [2, 3, 4], 'demonhunter.purifyAoE', 'Slaying an enemy with Hexbreaker charges active deals {v}d6 radiant damage to adjacent foes.'],
    ['apex_vow', 'Apex Vow', [3, 4, 5], 'demonhunter.damageFloor', 'Against boss/elite casters, weapon damage rolls treat 1s and 2s as {v}.'],
    ['demonhunter_mastery', 'Demonhunter Mastery', [10, 20, 30], 'demonhunter.masteryPercent', 'All radiant and execution damage dealt by Covenbane abilities increases by +{v}%.' ]
  ]
};

const SIGNATURE_NAMES = {
  null_shroud: 'Null Shroud',
  aegis_of_bog_iron: 'Aegis of Bog-Iron',
  leyline_cleaver: 'Leyline Cleaver',
  absolute_severance: 'Absolute Severance',
  barbed_execution: 'Barbed Execution',
  void_strata_judgment: 'Void-Strata Judgment'
};

export const COVENBANE_TREES = COVENBANE_TREE_META.map(meta => {
  const nodeId = slot => slot === 'signature' ? meta.signatureNode
    : slot === 'capstone' ? meta.capstoneNode
      : `cr1_covenbane_${meta.stem}_${slot}`;

  const nodes = rows[meta.id].map(([suffix, name, values, mechanic, text], index) => {
    const [minLevel, requiresPoints, predecessors] = gates[index];
    const slot = `p${String(index + 1).padStart(2, '0')}`;
    return {
      ...identity,
      id: nodeId(slot),
      treeId: meta.id,
      name,
      passiveSpellId: `cr1_covenbane_${meta.short}_${suffix}`,
      grantId: null,
      maxRanks: 3,
      minLevel,
      requiresPoints,
      requires: predecessors.map(nodeId),
      requiresAll: true,
      column: index < 3 ? index : index === 3 ? 0 : index % 2 === 0 ? 0 : 2,
      row: minLevel - 1,
      effectText: text.replaceAll('{v}', values.join(' / ')),
      parameterKeys: [mechanic],
      rankValues: values.map((value, i) => ({
        rank: i + 1,
        text: text.replaceAll('{v}', String(value)),
        values: { [mechanic]: value }
      }))
    };
  });

  nodes.push(...[
    ['signature', meta.signature, 3, 10, ['p01', 'p02'], 2],
    ['capstone', meta.capstone, 10, 45, ['p15', 'signature'], 10]
  ].map(([slot, spell, minLevel, requiresPoints, predecessors, row]) => ({
    ...identity,
    id: nodeId(slot),
    treeId: meta.id,
    name: SIGNATURE_NAMES[spell],
    grantId: `cov_${slot === 'signature' ? 'sig' : 'cap'}_${spell}`,
    passiveSpellId: null,
    maxRanks: 1,
    minLevel,
    requiresPoints,
    requires: predecessors.map(nodeId),
    requiresAll: true,
    column: 1,
    row,
    effectText: `Grant cov_${slot === 'signature' ? 'sig' : 'cap'}_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant cov_${slot === 'signature' ? 'sig' : 'cap'}_${spell}.`, values: {} }]
  })));

  return { ...identity, id: meta.id, meta, nodes };
});

export const COVENBANE_TALENT_NODES = COVENBANE_TREES.flatMap(tree => tree.nodes);

export const COVENBANE_PASSIVE_RECORDS = COVENBANE_TALENT_NODES
  .filter(node => node.passiveSpellId)
  .map(node => ({
    ...identity,
    id: node.passiveSpellId,
    name: node.name,
    level: node.minLevel,
    treeId: node.treeId,
    source: 'talent-passive',
    spellType: 'PASSIVE',
    description: `${node.effectText} Highest learned rank only; an unlearned optional spell stays unlearned. ${identity.manualNotice}`,
    resourceCost: { actionPoints: 0, mana: 0 },
    targetingConfig: { targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 },
    damageConfig: null,
    effectTypes: ['buff'],
    durationConfig: null,
    cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
    reactionTiming: null,
    savingThrow: null,
    area: null,
    conditions: [],
    rankValues: node.rankValues,
    requires: {
      nodeId: node.id,
      requiresPoints: node.requiresPoints,
      predecessorNodeIds: node.requires,
      requiresAll: true,
      minLevel: node.minLevel
    },
    manualMechanics: { kind: 'ranked-modifier', rankValues: node.rankValues, executable: false },
    sourceRefs: ['Covenbane content lock']
  }));

export const COVENBANE_TALENT_CAPACITY = {
  trees: 3,
  nodes: 54,
  perTreeRanks: COVENBANE_TREES.map(tree => ({
    treeId: tree.id,
    maxRanks: tree.nodes.reduce((total, node) => total + node.maxRanks, 0)
  })),
  totalRankCapacity: 150,
  characterPointCap: 50
};

// Backwards-compatible tree-specific exports
export const COVENBANE_SHADOWBANE = COVENBANE_TREES.find(t => t.id === 'shadowbane')?.nodes || [];
export const COVENBANE_SPELLBREAKER = COVENBANE_TREES.find(t => t.id === 'spellbreaker')?.nodes || [];
export const COVENBANE_DEMONHUNTER = COVENBANE_TREES.find(t => t.id === 'demonhunter')?.nodes || [];
