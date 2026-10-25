const identity = {
  classId: 'oracle', rulesetVersion: 'cr-review-r1', authoredOnly: true,
  executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [],
  manualOnly: true,
  manualNotice: 'Manual tabletop only; no automatic forecast, slot, benefit, expiry, damage, ward or movement.'
};

export const ORACLE_TREE_META = [
  {
    id: 'seer', name: 'Seer', stem: 'seer', short: 'se',
    signature: 'read_the_next_step', capstone: 'the_clear_moment',
    signatureNode: 'cr1_oracle_seer_signature',
    capstoneNode: 'cr1_oracle_seer_capstone',
    tagline: 'Prepare one personal certainty before the next step.'
  },
  {
    id: 'witness', name: 'Witness of Peril', stem: 'witness', short: 'wi',
    signature: 'witness_the_blow', capstone: 'the_watched_thread',
    signatureNode: 'cr1_oracle_witness_signature',
    capstoneNode: 'cr1_oracle_witness_capstone',
    tagline: 'Name one danger to one ally and prepare the answer.'
  },
  {
    id: 'pathfinder', name: 'Pathfinder', stem: 'pathfinder', short: 'pa',
    signature: 'chart_the_safe_line', capstone: 'the_certain_road',
    signatureNode: 'cr1_oracle_pathfinder_signature',
    capstoneNode: 'cr1_oracle_pathfinder_capstone',
    tagline: 'Commit to a route and make the prepared way real.'
  }
];

const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];

const rows = {
  seer: [
    ['quick_reading', 'Quick Reading', [1, 2, 3], 'seer.insightBonus', 'Add {v} to one Insight or Perception check about observable evidence.'],
    ['personal_ward', 'Personal Ward', [1, 2, 3], 'seer.wardBonus', 'Add {v} capacity to one ward granted by a personal forecast; one use.'],
    ['measured_step', 'Measured Step', [5, 10, 15], 'seer.stepFeet', 'Add {v} ft to one move after a personal forecast fulfills; ordinary movement applies.'],
    ['clear_omen', 'Clear Omen', [1, 2, 3], 'seer.nextActionBonus', 'Add {v} to one attack or save after a personal forecast fulfills; once per forecast.'],
    ['forecast_range', 'Forecast Range', [5, 10, 15], 'seer.rangeBonusFeet', 'Add {v} ft to the range of Seer actions.'],
    ['steady_mind', 'Steady Mind', [1, 2, 3], 'seer.composureBonus', 'Add {v} to one save against fear, confusion or sensory overload.'],
    ['read_the_room', 'Read the Room', [1, 2, 3], 'seer.investigationBonus', 'Add {v} to one Investigation check about a visible scene; no hidden information.'],
    ['early_warning', 'Early Warning', [1, 2, 3], 'seer.initiativeBonus', 'Add {v} to one initiative check while a personal forecast is prepared.'],
    ['quiet_certainty', 'Quiet Certainty', [1, 2, 3], 'seer.stealthBonus', 'Add {v} to one Stealth or Deception check to keep a forecast private; no hidden knowledge is gained.'],
    ['second_look', 'Second Look', [1, 2, 3], 'seer.recheckBonus', 'Add {v} to one check to notice a changed detail in the same scene.'],
    ['patient_reader', 'Patient Reader', [1, 2, 3], 'seer.retentionBonus', 'Add {v} to one save or check to keep a forecast prepared under pressure.'],
    ['practical_foresight', 'Practical Foresight', [1, 2, 3], 'seer.skillBonus', 'Add {v} to one skill check declared after observing the immediate evidence.'],
    ['swift_preparation', 'Swift Preparation', [1, 2, 3], 'seer.preparationBonus', 'Add {v} to one check to prepare a forecast quickly; the AP price is unchanged.'],
    ['unshaken', 'Unshaken', [1, 2, 3], 'seer.forcedMovementSaveBonus', 'Add {v} to one save against forced movement or being knocked prone.'],
    ['last_inference', 'Last Inference', [1, 2, 3], 'seer.followUpAttackBonus', 'Add {v} to one attack against a subject whose forecast just fulfilled.'],
    ['seer_mastery', 'Seer Mastery', [1, 2, 3], 'seer.forecastBenefitBonus', 'Add {v} to one personal forecast benefit each round.']
  ],
  witness: [
    ['guardian_reading', 'Guardian Reading', [1, 2, 3], 'witness.wardBonus', 'Add {v} capacity to one ally ward from a Witness forecast.'],
    ['watching_brief', 'Watching Brief', [1, 2, 3], 'witness.noticeBonus', 'Add {v} to one Perception check to notice the named peril.'],
    ['shared_warning', 'Shared Warning', [1, 2, 3], 'witness.allySaveBonus', 'Add {v} to one ally save against the named peril; declared before rolling.'],
    ['sheltering_forecast', 'Sheltering Forecast', [1, 2, 3], 'witness.mitigationBonus', 'Reduce one damage event from the named peril by {v}; once per forecast.'],
    ['close_watch', 'Close Watch', [5, 10, 15], 'witness.rangeBonusFeet', 'Add {v} ft to the range of Witness actions.'],
    ['urgent_warning', 'Urgent Warning', [1, 2, 3], 'witness.warningCheckBonus', 'Add {v} to one check to warn an ally in time; no extra action is granted.'],
    ['defensive_position', 'Defensive Position', [1, 2, 3], 'witness.coverBonus', 'Grant one ally {v} cover against one named peril; positional and breakable.'],
    ['read_the_blow', 'Read the Blow', [1, 2, 3], 'witness.categoryCheckBonus', 'Add {v} to one check to identify the category of an incoming visible attack.'],
    ['steady_ally', 'Steady Ally', [1, 2, 3], 'witness.fearSaveBonus', 'Add {v} to one ally save against fear caused by the named peril.'],
    ['interpose', 'Interpose', [5, 10, 15], 'witness.interposeFeet', 'Add {v} ft to one move toward a threatened ally; normal reactions and consequences apply.'],
    ['second_witness', 'Second Witness', [1, 2, 3], 'witness.relayBonus', 'Add {v} to one check to relay the warning to another ally; no additional forecast slot.'],
    ['hold_the_line', 'Hold the Line', [1, 2, 3], 'witness.forcedMovementSaveBonus', 'Add {v} to one ally save against forced movement from the named peril.'],
    ['watchful_rest', 'Watchful Rest', [1, 2, 3], 'witness.restPerceptionBonus', 'Add {v} to one Perception check made during a rest.'],
    ['shared_courage', 'Shared Courage', [1, 2, 3], 'witness.sharedFearSaveBonus', 'Add {v} to one ally save against fear while you are within 30 ft.'],
    ['last_guard', 'Last Guard', [1, 2, 3], 'witness.woundedWardBonus', 'Add {v} capacity to one ward for an ally below half health.'],
    ['witness_mastery', 'Witness Mastery', [1, 2, 3], 'witness.forecastBenefitBonus', 'Add {v} to one ally forecast benefit each round.']
  ],
  pathfinder: [
    ['route_memory', 'Route Memory', [1, 2, 3], 'pathfinder.navigationBonus', 'Add {v} to one Survival or navigation check about a route.'],
    ['safe_line', 'Safe Line', [5, 10, 15], 'pathfinder.routeFeet', 'Add {v} ft to one prepared route length; no teleport.'],
    ['quick_step', 'Quick Step', [5, 10, 15], 'pathfinder.moveFeet', 'Add {v} ft to one move along a prepared route; ordinary movement applies.'],
    ['read_terrain', 'Read Terrain', [1, 2, 3], 'pathfinder.terrainBonus', 'Add {v} to one Perception or Investigation check about visible terrain.'],
    ['group_route', 'Group Route', [1, 2, 3], 'pathfinder.allyCheckBonus', 'Add {v} to one ally check made while moving along the prepared route.'],
    ['sheltered_path', 'Sheltered Path', [1, 2, 3], 'pathfinder.coverBonus', 'Grant one ally {v} cover along the prepared route; positional and breakable.'],
    ['no_wrong_turn', 'No Wrong Turn', [1, 2, 3], 'pathfinder.orientationBonus', 'Add {v} to one check to avoid becoming lost or turned around.'],
    ['early_arrival', 'Early Arrival', [1, 2, 3], 'pathfinder.initiativeBonus', 'Add {v} to one initiative check when the route was prepared before the encounter.'],
    ['quiet_travel', 'Quiet Travel', [1, 2, 3], 'pathfinder.stealthBonus', 'Add {v} to one Stealth check while moving along the prepared route.'],
    ['steady_pace', 'Steady Pace', [1, 2, 3], 'pathfinder.exhaustionSaveBonus', 'Add {v} to one save against exhaustion from a forced march.'],
    ['shortcut', 'Shortcut', [5, 10, 15], 'pathfinder.shortcutFeet', 'Add {v} ft to one route move; the path must remain legal and visible.'],
    ['waypoint', 'Waypoint', [1, 2, 3], 'pathfinder.waypointBonus', 'Add {v} to one check at a declared waypoint.'],
    ['return_line', 'Return Line', [5, 10, 15], 'pathfinder.retreatFeet', 'Add {v} ft to one retreat move along the prepared route.'],
    ['shared_map', 'Shared Map', [1, 2, 3], 'pathfinder.mapBonus', 'Add {v} to one ally navigation check while sharing the prepared route.'],
    ['last_mile', 'Last Mile', [1, 2, 3], 'pathfinder.objectiveBonus', 'Add {v} to one check when within sight of the declared objective.'],
    ['pathfinder_mastery', 'Pathfinder Mastery', [1, 2, 3], 'pathfinder.routeBenefitBonus', 'Add {v} to one route benefit each round.']
  ]
};

const SIGNATURE_NAMES = {
  read_the_next_step: 'Read the Next Step',
  the_clear_moment: 'The Clear Moment',
  witness_the_blow: 'Witness the Blow',
  the_watched_thread: 'The Watched Thread',
  chart_the_safe_line: 'Chart the Safe Line',
  the_certain_road: 'The Certain Road'
};

export const ORACLE_TREES = ORACLE_TREE_META.map(meta => {
  const nodeId = slot => slot === 'signature' ? meta.signatureNode
    : slot === 'capstone' ? meta.capstoneNode
      : `cr1_oracle_${meta.stem}_${slot}`;
  const nodes = rows[meta.id].map(([suffix, name, values, mechanic, text], index) => {
    const [minLevel, requiresPoints, predecessors] = gates[index];
    const slot = `p${String(index + 1).padStart(2, '0')}`;
    return {
      ...identity, id: nodeId(slot), treeId: meta.id, name,
      passiveSpellId: `cr1_oracle_${meta.short}_${suffix}`, grantId: null,
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
    grantId: `cr1_oracle_${spell}`, passiveSpellId: null, maxRanks: 1,
    minLevel, requiresPoints, requires: predecessors.map(nodeId), requiresAll: true, column: 1, row,
    effectText: `Grant cr1_oracle_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant cr1_oracle_${spell}.`, values: {} }]
  })));
  return { ...identity, id: meta.id, meta, nodes };
});

export const ORACLE_TALENT_NODES = ORACLE_TREES.flatMap(tree => tree.nodes);

export const ORACLE_PASSIVE_RECORDS = ORACLE_TALENT_NODES
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
    sourceRefs: ['RI-5 Oracle content lock']
  }));

export const ORACLE_TALENT_CAPACITY = {
  trees: 3, nodes: 54,
  perTreeRanks: ORACLE_TREES.map(tree => ({
    treeId: tree.id, maxRanks: tree.nodes.reduce((total, node) => total + node.maxRanks, 0)
  })),
  totalRankCapacity: 150, characterPointCap: 50
};
