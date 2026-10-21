const identity = {
  classId: 'fate-weaver', rulesetVersion: 'cr-review-r1', authoredOnly: true,
  executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [],
  manualOnly: true, manualNotice: 'Manual tabletop only; no automatic costs, links, transfers, wards or settlement.'
};

export const FATE_WEAVER_TREE_META = [
  { id: 'covenant', name: 'Covenant Weaver', stem: 'covenant', short: 'cv', signature: 'witnessed_covenant', capstone: 'threefold_compact', signatureNode: 'cr1_fate_weaver_covenant_weaver_signature', capstoneNode: 'cr1_fate_weaver_covenant_weaver_capstone', tagline: 'Bind two willing actors to a declared, reciprocal obligation.' },
  { id: 'severance', name: 'Thread Cutter', stem: 'severance', short: 'sv', signature: 'sever_borrowed_crown', capstone: 'sever_throughline', signatureNode: 'cr1_fate_weaver_severer_signature', capstoneNode: 'cr1_fate_weaver_severer_capstone', tagline: 'End a link cleanly before its cost comes due.' },
  { id: 'tapestry', name: 'Tapestry Keeper', stem: 'tapestry', short: 'tp', signature: 'reanchor_tapestry', capstone: 'grand_relay', signatureNode: 'cr1_fate_weaver_tapestry_keeper_signature', capstoneNode: 'cr1_fate_weaver_tapestry_keeper_capstone', tagline: 'Move the anchor without renewing the promise.' }
];

// slot: [minimum level, prior same-tree points, fully ranked predecessor slots].
const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];

const rows = {
  covenant: [
    ['patient_thread', 'Patient Thread', [5, 10, 15], 'link.rangeBonusFeet', 'Add {v} ft to the formation range of links you create.'],
    ['steady_knot', 'Steady Knot', [1, 2, 3], 'link.severResistance', 'Add {v} to the DC or check to sever your links; does not prevent voluntary release.'],
    ['gentle_pull', 'Gentle Pull', [5, 10, 15], 'guiding_pull.distanceBonusFeet', 'Add {v} ft to the movement granted by Guiding Pull.'],
    ['covenant_ward', 'Covenant Ward', [1, 2, 3], 'link.wardCapacityBonus', 'Add {v} capacity to one-use link wards you create; never exceeds the authored ward maximum by more than 3.'],
    ['echoed_oath', 'Echoed Oath', [1, 2, 3], 'covenant.formationCheckBonus', 'Add {v} to one check to form or maintain a covenant link; the hard maximum remains two uses and no extra slot is granted.'],
    ['clear_signal', 'Clear Signal', [1, 2, 3], 'link.readCheckBonus', 'Add {v} to one check to identify or read a visible link; no hidden information.'],
    ['shared_courage', 'Shared Courage', [1, 2, 3], 'linked-ally.fearSaveBonus', 'Add {v} to one save against fear for a linked ally; declared before rolling.'],
    ['woven_resilience', 'Woven Resilience', [1, 2, 3], 'linked-ally.damageReduction', 'Reduce one original damage event against a linked ally by {v}; once per link per round.'],
    ['deepening_bond', 'Deepening Bond', [1, 2, 3], 'link.maintenanceRangeBonusFeet', 'Add {v} ft to the range at which you can maintain an existing link.'],
    ['quiet_resolve', 'Quiet Resolve', [1, 2, 3], 'link.composureBonus', 'Add {v} to one Concentration or composure check while maintaining a link.'],
    ['twin_anchors', 'Twin Anchors', [1, 2, 3], 'link.rangeReprieveFeet', 'The first time each round a link would end from range, extend it by {v} ft instead; one reprieve.'],
    ['sheltering_weave', 'Sheltering Weave', [1, 2, 3], 'covenant-ward.capacityBonus', 'Add {v} capacity to a single covenant ward; does not stack with Covenant Ward beyond the larger value.'],
    ['covenant_memory', 'Covenant Memory', [1, 2, 3], 'link.recallMax', 'Recall the public terms of up to {v} links you created; no hidden clauses.'],
    ['broad_shoulders', 'Broad Shoulders', [1, 2, 3], 'redirected-damage.composureCheckBonus', 'Add {v} to one save or check to remain steady when you accept assigned damage; the transferred amount is never reduced or re-mitigated.'],
    ['witnessed_mercy', 'Witnessed Mercy', [1, 2, 3], 'linked-ally.firstAidBonus', 'Add {v} to one stabilization or first-aid check on a linked ally.'],
    ['unbroken_chain', 'Unbroken Chain', [1, 2, 3], 'covenant.maxDurationRoundsBonus', 'Add {v} to the maximum number of rounds a covenant may remain before renewal; does not change token or link caps.']
  ],
  severance: [
    ['sharp_scissors', 'Sharp Scissors', [1, 2, 3], 'severance-damage.rawBonus', 'Add +{v} raw wyrd to Cut the Current or Cut the Last Thread.'],
    ['quick_cut', 'Quick Cut', [5, 10, 15], 'cut_and_run.distanceBonusFeet', 'Add {v} ft to movement granted by Cut and Run.'],
    ['clean_edge', 'Clean Edge', [1, 2, 3], 'sever-check.bonus', 'Add {v} to one check made to sever a link against an unwilling actor.'],
    ['parting_word', 'Parting Word', [1, 2, 3], 'severing_word.savePenaltyBonus', 'Add {v} to the save penalty from Severing Word.'],
    ['cut_the_grip', 'Cut the Grip', [1, 2, 3], 'linked-actor.escapeBonus', 'Add {v} to one escape or grapple check involving a linked actor.'],
    ['severing_reach', 'Severing Reach', [5, 10, 15], 'severance.rangeBonusFeet', 'Add {v} ft to the range of severance effects.'],
    ['cold_cut', 'Cold Cut', [1, 2, 3], 'post-sever-damage.rawBonus', 'Add +{v} raw wyrd to the first damage event after severing a link; once per turn.'],
    ['follow_through', 'Follow Through', [1, 2, 3], 'post-sever-check.bonus', 'Add {v} to one attack or check immediately after severing a link; declared before rolling.'],
    ['cut_the_chain', 'Cut the Chain', [1, 2, 3], 'sever_all.extraLinks', 'Sever one additional link when you use Sever All, up to {v} extra links.'],
    ['silent_sever', 'Silent Sever', [1, 2, 3], 'silent-sever.stealthBonus', 'Add {v} to Stealth when severing a link quietly; no invisibility or evidence removal.'],
    ['fraying_pressure', 'Fraying Pressure', [1, 2, 3], 'linked-actor.socialBonus', 'Add {v} to one Intimidation or Persuasion check against a linked actor.'],
    ['executioner_thread', 'Executioner Thread', [1, 2, 3], 'severed-target.woundedDamageBonus', 'Add +{v} raw wyrd against a target below half health after severing its link; once per target per round.'],
    ['snip_counter', 'Snip Counter', [1, 2, 3], 'link-formation.interruptBonus', 'Add {v} to one reaction check to interrupt a link formation; no free attack.'],
    ['broken_crown', 'Broken Crown', [1, 2, 3], 'sever_borrowed_crown.identificationCheckBonus', 'Add {v} to one check to identify or sever a registered fate-link with Sever the Borrowed Crown; no damage, suppression or extra token is granted.'],
    ['throughline_precision', 'Throughline Precision', [1, 2, 3], 'sever_throughline.suppressionCheckBonus', 'Add {v} to one check to identify or suppress the source benefit of Sever the Throughline; the capstone deals no damage and suppression never exceeds two rounds.'],
    ['last_cut', 'Last Cut', [1, 2, 3], 'severed-capstone.rawBonus', 'Add +{v} raw wyrd to the final damage event of a severed capstone link.']
  ],
  tapestry: [
    ['wide_weave', 'Wide Weave', [5, 10, 15], 'reanchor.rangeBonusFeet', 'Add {v} ft to the range of Reanchor the Tapestry.'],
    ['read_the_pattern', 'Read the Pattern', [1, 2, 3], 'link-investigation.bonus', 'Add {v} to one Investigation check about visible links or their public terms.'],
    ['reanchor_step', 'Reanchor Step', [5, 10, 15], 'tapestry_step.distanceBonusFeet', 'Add {v} ft to movement granted by Tapestry Step.'],
    ['woven_insight', 'Woven Insight', [1, 2, 3], 'linked-actor.insightBonus', 'Add {v} to one Insight or Perception check involving a linked actor.'],
    ['tapestry_guard', 'Tapestry Guard', [1, 2, 3], 'link.damageReduction', 'Reduce one original damage event by {v} while maintaining a link; once per round.'],
    ['thread_memory', 'Thread Memory', [1, 2, 3], 'link.publicRecallMax', 'Recall the public endpoint and purpose of up to {v} links; no hidden information.'],
    ['long_line', 'Long Line', [10, 20, 30], 'link.no-enemy-rangeBonusFeet', 'Add {v} ft to link formation range while no enemy link is active.'],
    ['pattern_break', 'Pattern Break', [1, 2, 3], 'link-resistance.bonus', 'Add {v} to one check to resist a link or covenant formed against you.'],
    ['swift_weave', 'Swift Weave', [1, 2, 3], 'link.apReduction', 'Reduce the AP cost of one link by {v}, minimum 1; once per turn.'],
    ['sure_anchor', 'Sure Anchor', [1, 2, 3], 'link.maintenanceCheckBonus', 'Add {v} to one check to maintain a link when its endpoint moves.'],
    ['tapestry_sight', 'Tapestry Sight', [10, 20, 30], 'link-audit.rangeBonusFeet', 'Add {v} ft to the range of Fate Audit and Read the Whole.'],
    ['grand_pattern', 'Grand Pattern', [1, 2, 3], 'link-purpose-check.bonus', 'Add {v} to one check to identify a link\'s public purpose; no private clause.'],
    ['relay_ready', 'Relay Ready', [1, 2, 3], 'grand_relay.extraLinks', 'Reanchor one additional link with The Grand Relay, up to {v} extra links; no extra tokens.'],
    ['threefold_edge', 'Threefold Edge', [1, 2, 3], 'threefold_compact.checkBonus', 'Add {v} to one check or save made by a link affected by Threefold Compact.'],
    ['woven_fate', 'Woven Fate', [1, 2, 3], 'link-consequence-check.bonus', 'Add {v} to one check to predict a visible link\'s immediate physical consequence; no future certainty.'],
    ['eternal_thread', 'Eternal Thread', [1, 2, 3], 'link-audit.recoveringCheckBonus', 'Add {v} to one check to identify or audit a reserved or recovering thread record; no extra token recovery.']
  ]
};

const SIGNATURE_NAMES = {
  witnessed_covenant: 'Witnessed Covenant',
  sever_borrowed_crown: 'Sever the Borrowed Crown',
  reanchor_tapestry: 'Reanchor the Tapestry',
  threefold_compact: 'Threefold Compact',
  sever_throughline: 'Sever the Throughline',
  grand_relay: 'The Grand Relay'
};

export const FATE_WEAVER_TREES = FATE_WEAVER_TREE_META.map(meta => {
  const nodeId = slot => slot === 'signature' ? meta.signatureNode
    : slot === 'capstone' ? meta.capstoneNode
      : `cr1_fate_weaver_${meta.stem}_${slot}`;
  const nodes = rows[meta.id].map(([suffix, name, values, mechanic, text], index) => {
    const [minLevel, requiresPoints, predecessors] = gates[index];
    const slot = `p${String(index + 1).padStart(2, '0')}`;
    return {
      ...identity, id: nodeId(slot), treeId: meta.id, name,
      passiveSpellId: `cr1_fate_weaver_${meta.short}_${suffix}`, grantId: null,
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
    grantId: `cr1_fate_weaver_${spell}`, passiveSpellId: null, maxRanks: 1,
    minLevel, requiresPoints, requires: predecessors.map(nodeId), requiresAll: true, column: 1, row,
    effectText: `Grant cr1_fate_weaver_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant cr1_fate_weaver_${spell}.`, values: {} }]
  })));
  return { ...identity, id: meta.id, meta, nodes };
});

export const FATE_WEAVER_TALENT_NODES = FATE_WEAVER_TREES.flatMap(tree => tree.nodes);
export const FATE_WEAVER_PASSIVE_RECORDS = FATE_WEAVER_TALENT_NODES.filter(node => node.passiveSpellId).map(node => ({
  ...identity, id: node.passiveSpellId, name: node.name, level: node.minLevel,
  treeId: node.treeId, source: 'talent-passive', spellType: 'PASSIVE',
  description: `${node.effectText} Highest learned rank only; an unlearned optional spell stays unlearned. ${identity.manualNotice}`,
  resourceCost: { actionPoints: 0, mana: 0 },
  targetingConfig: { targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 },
  damageConfig: null, effectTypes: ['buff'], durationConfig: null, cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
  reactionTiming: null, savingThrow: null, area: null, conditions: [],
  rankValues: node.rankValues,
  requires: { nodeId: node.id, requiresPoints: node.requiresPoints, predecessorNodeIds: node.requires, requiresAll: true, minLevel: node.minLevel },
  manualMechanics: { kind: 'ranked-modifier', rankValues: node.rankValues, executable: false },
  sourceRefs: ['Phase 2B content lock']
}));

export const FATE_WEAVER_TALENT_CAPACITY = {
  trees: 3, nodes: 54,
  perTreeRanks: FATE_WEAVER_TREES.map(tree => ({
    treeId: tree.id, maxRanks: tree.nodes.reduce((total, node) => total + node.maxRanks, 0)
  })),
  totalRankCapacity: 150, characterPointCap: 50
};
