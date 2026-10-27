const identity = {
  classId: 'hunter', rulesetVersion: 'cr-review-r1', authoredOnly: true,
  executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [],
  manualOnly: true,
  manualNotice: 'Manual tabletop only; no automatic quarry, evidence, tag generation, companion, path, damage, movement or expiry.'
};

export const HUNTER_TREE_META = [
  {
    id: 'stalker', name: 'Stalker', stem: 'stalker', short: 'st',
    signature: 'patient_ambush', capstone: 'death_from_the_blind',
    signatureNode: 'cr1_hunter_stalker_signature',
    capstoneNode: 'cr1_hunter_stalker_capstone',
    tagline: 'Study and approach alone, then choose when to reveal the strike.'
  },
  {
    id: 'beastmaster', name: 'Beastmaster', stem: 'beastmaster', short: 'bm',
    signature: 'cross_the_scent', capstone: 'the_perfect_pack',
    signatureNode: 'cr1_hunter_beastmaster_signature',
    capstoneNode: 'cr1_hunter_beastmaster_capstone',
    tagline: 'Coordinate a real bonded companion without stealing its turn.'
  },
  {
    id: 'trailblade', name: 'Trailblade', stem: 'trailblade', short: 'tb',
    signature: 'returning_path', capstone: 'the_long_way_home',
    signatureNode: 'cr1_hunter_trailblade_signature',
    capstoneNode: 'cr1_hunter_trailblade_capstone',
    tagline: 'Commit a weapon to a route the quarry can see, avoid or cross.'
  }
];

const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];

const rows = {
  stalker: [
    ['patient_eye', 'Patient Eye', [1, 2, 3], 'stalker.readBonus', 'Add {v} to one Read check.'],
    ['quiet_approach', 'Quiet Approach', [5, 10, 15], 'stalker.approachFeet', 'Add {v} ft to one approach while unseen.'],
    ['first_blood', 'First Blood', [1, 2, 3], 'stalker.ambushDamageBonus', 'Add {v} to one ambush damage event.'],
    ['trail_craft', 'Trail Craft', [1, 2, 3], 'stalker.trackBonus', 'Add {v} to one tracking check.'],
    ['steady_breath', 'Steady Breath', [1, 2, 3], 'stalker.attackBonus', 'Add {v} to one ranged attack after a full round of aim.'],
    ['kill_zone', 'Kill Zone', [5, 10, 15], 'stalker.rangeBonusFeet', 'Add {v} ft to one ambush range.'],
    ['no_witness', 'No Witness', [1, 2, 3], 'stalker.stealthBonus', 'Add {v} to one Stealth check after an ambush.'],
    ['cold_patience', 'Cold Patience', [1, 2, 3], 'stalker.initiativeBonus', 'Add {v} to one initiative check while unseen.'],
    ['hamstring', 'Hamstring', [1, 2, 3], 'stalker.speedPenalty', 'Reduce one target movement by {v} ft after a hit.'],
    ['marked_prey', 'Marked Prey', [1, 2, 3], 'stalker.markBonus', 'Add {v} to one check against your quarry.'],
    ['vantage', 'Vantage', [5, 10, 15], 'stalker.highGroundFeet', 'Extend one high-ground benefit by {v} ft.'],
    ['finishing_shot', 'Finishing Shot', [1, 2, 3], 'stalker.woundedBonus', 'Add {v} damage against a wounded quarry.'],
    ['silent_retreat', 'Silent Retreat', [1, 2, 3], 'stalker.retreatFeet', 'Add {v} ft to one retreat after an ambush.'],
    ['unbroken_focus', 'Unbroken Focus', [1, 2, 3], 'stalker.concentrationBonus', 'Add {v} to one concentration check while tracking.'],
    ['true_aim', 'True Aim', [1, 2, 3], 'stalker.critRangeBonus', 'Expand one critical threat range by {v}; declared before the roll.'],
    ['stalker_mastery', 'Stalker Mastery', [1, 2, 3], 'stalker.allAmbushBonus', 'Add {v} to one ambush or quarry damage event each round.']
  ],
  beastmaster: [
    ['bonded_command', 'Bonded Command', [1, 2, 3], 'beastmaster.commandBonus', 'Add {v} to one companion command check.'],
    ['pack_sense', 'Pack Sense', [1, 2, 3], 'beastmaster.readBonus', 'Add {v} to one Read check made by you or your companion.'],
    ['flanking_pair', 'Flanking Pair', [1, 2, 3], 'beastmaster.flankBonus', 'Add {v} to one attack when your companion is adjacent to the quarry.'],
    ['beast_guard', 'Beast Guard', [1, 2, 3], 'beastmaster.allyDefenseBonus', 'Add {v} to one companion save.'],
    ['coordinated_step', 'Coordinated Step', [5, 10, 15], 'beastmaster.companionMoveFeet', 'Add {v} ft to one companion move.'],
    ['shared_quarry', 'Shared Quarry', [1, 2, 3], 'beastmaster.pressureBonus', 'Add {v} to one Pressure-generating companion hit.'],
    ['howl', 'Howl', [1, 2, 3], 'beastmaster.intimidationBonus', 'Add {v} to one Intimidation check while your companion is present.'],
    ['beast_recovery', 'Beast Recovery', [1, 2, 3], 'beastmaster.companionHealBonus', 'Restore {v} additional HP to your companion once per rest.'],
    ['loyal_charge', 'Loyal Charge', [5, 10, 15], 'beastmaster.chargeFeet', 'Add {v} ft to one companion charge.'],
    ['pack_tactics', 'Pack Tactics', [1, 2, 3], 'beastmaster.allyAttackBonus', 'Add {v} to one ally attack against your quarry.'],
    ['scent_share', 'Scent Share', [1, 2, 3], 'beastmaster.trackBonus', 'Add {v} to one tracking check using your companion senses.'],
    ['beast_ward', 'Beast Ward', [1, 2, 3], 'beastmaster.companionDR', 'Reduce one companion damage event by {v}.'],
    ['call_back', 'Call Back', [1, 2, 3], 'beastmaster.recallBonus', 'Add {v} to one check to call your companion back.'],
    ['feral_bond', 'Feral Bond', [1, 2, 3], 'beastmaster.bondBonus', 'Add {v} to one bond or command check.'],
    ['alpha_presence', 'Alpha Presence', [1, 2, 3], 'beastmaster.auraBonus', 'Add {v} to one ally save near your companion.'],
    ['beastmaster_mastery', 'Beastmaster Mastery', [1, 2, 3], 'beastmaster.allPackBonus', 'Add {v} to one pack action each round.']
  ],
  trailblade: [
    ['line_of_sight', 'Line of Sight', [5, 10, 15], 'trailblade.pathFeet', 'Add {v} ft to one committed path.'],
    ['glaive_recall', 'Glaive Recall', [1, 2, 3], 'trailblade.recallBonus', 'Add {v} to one check to recover a committed glaive.'],
    ['route_reading', 'Route Reading', [1, 2, 3], 'trailblade.trackBonus', 'Add {v} to one check to read a route.'],
    ['crossing_shot', 'Crossing Shot', [1, 2, 3], 'trailblade.crossingDamageBonus', 'Add {v} to one path strike.'],
    ['narrow_passage', 'Narrow Passage', [1, 2, 3], 'trailblade.chokeBonus', 'Add {v} to one check to hold a choke point.'],
    ['delayed_blade', 'Delayed Blade', [1, 2, 3], 'trailblade.delayBonus', 'Extend one path expiry by {v} own turn; maximum one.'],
    ['feint_route', 'Feint Route', [1, 2, 3], 'trailblade.deceptionBonus', 'Add {v} to one Deception check about a route.'],
    ['terrain_memory', 'Terrain Memory', [1, 2, 3], 'trailblade.recallMax', 'Retain up to {v} prepared routes.'],
    ['safe_return', 'Safe Return', [1, 2, 3], 'trailblade.retreatFeet', 'Add {v} ft to one retreat along a prepared route.'],
    ['glaive_wall', 'Glaive Wall', [1, 2, 3], 'trailblade.defenseBonus', 'Add {v} to one defense while the glaive is committed.'],
    ['path_denial', 'Path Denial', [5, 10, 15], 'trailblade.denialFeet', 'Extend one difficult route by {v} ft.'],
    ['first_crossing', 'First Crossing', [1, 2, 3], 'trailblade.firstCrossingBonus', 'Add {v} to the first path strike.'],
    ['weapon_return', 'Weapon Return', [1, 2, 3], 'trailblade.returnBonus', 'Add {v} to one check to dismiss and return the glaive.'],
    ['hunter_of_paths', 'Hunter of Paths', [1, 2, 3], 'trailblade.quarryBonus', 'Add {v} to one check against a quarry on your prepared route.'],
    ['final_segment', 'Final Segment', [1, 2, 3], 'trailblade.finalDamageBonus', 'Add {v} to one path strike on its final segment.'],
    ['trailblade_mastery', 'Trailblade Mastery', [1, 2, 3], 'trailblade.allPathBonus', 'Add {v} to one path or glaive event each round.']
  ]
};

const SIGNATURE_NAMES = {
  patient_ambush: 'Patient Ambush',
  death_from_the_blind: 'Death from the Blind',
  cross_the_scent: 'Cross the Scent',
  the_perfect_pack: 'The Perfect Pack',
  returning_path: 'Returning Path',
  the_long_way_home: 'The Long Way Home'
};

export const HUNTER_TREES = HUNTER_TREE_META.map(meta => {
  const nodeId = slot => slot === 'signature' ? meta.signatureNode
    : slot === 'capstone' ? meta.capstoneNode
      : `cr1_hunter_${meta.stem}_${slot}`;
  const nodes = rows[meta.id].map(([suffix, name, values, mechanic, text], index) => {
    const [minLevel, requiresPoints, predecessors] = gates[index];
    const slot = `p${String(index + 1).padStart(2, '0')}`;
    return {
      ...identity, id: nodeId(slot), treeId: meta.id, name,
      passiveSpellId: `cr1_hunter_${meta.short}_${suffix}`, grantId: null,
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
    grantId: `cr1_hunter_${spell}`, passiveSpellId: null, maxRanks: 1,
    minLevel, requiresPoints, requires: predecessors.map(nodeId), requiresAll: true, column: 1, row,
    effectText: `Grant cr1_hunter_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant cr1_hunter_${spell}.`, values: {} }]
  })));
  return { ...identity, id: meta.id, meta, nodes };
});

export const HUNTER_TALENT_NODES = HUNTER_TREES.flatMap(tree => tree.nodes);

export const HUNTER_PASSIVE_RECORDS = HUNTER_TALENT_NODES
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
    sourceRefs: ['RI-4 Hunter content lock']
  }));

export const HUNTER_TALENT_CAPACITY = {
  trees: 3, nodes: 54,
  perTreeRanks: HUNTER_TREES.map(tree => ({
    treeId: tree.id, maxRanks: tree.nodes.reduce((total, node) => total + node.maxRanks, 0)
  })),
  totalRankCapacity: 150, characterPointCap: 50
};
