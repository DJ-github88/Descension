const identity = {
  classId: 'doomsayer', rulesetVersion: 'cr-review-r1', authoredOnly: true,
  executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [],
  manualOnly: true,
  manualNotice: 'Manual tabletop only; no automatic calamity, clock, Havoc, damage, ward, movement or expiry.'
};

export const DOOMSAYER_TREE_META = [
  {
    id: 'requiem', name: 'Requiem', stem: 'requiem', short: 'rq',
    signature: 'quiet_requiem', capstone: 'absolute_requiem',
    signatureNode: 'cr1_doomsayer_requiem_signature',
    capstoneNode: 'cr1_doomsayer_requiem_capstone',
    tagline: 'Finish one declared ending before it can be answered.'
  },
  {
    id: 'endbringer', name: 'Endbringer', stem: 'endbringer', short: 'eb',
    signature: 'lengthen_the_hour', capstone: 'the_last_hour',
    signatureNode: 'cr1_doomsayer_endbringer_signature',
    capstoneNode: 'cr1_doomsayer_endbringer_capstone',
    tagline: 'Make a public calamity heavier, wider and later.'
  },
  {
    id: 'forewarner', name: 'Forewarner', stem: 'forewarner', short: 'fw',
    signature: 'sound_the_warning', capstone: 'the_published_doom',
    signatureNode: 'cr1_doomsayer_forewarner_signature',
    capstoneNode: 'cr1_doomsayer_forewarner_capstone',
    tagline: 'Publish the ending early enough that allies can survive it.'
  }
];

const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];

const rows = {
  requiem: [
    ['first_knife', 'First Knife', [1, 2, 3], 'requiem.damageBonus', 'Add {v} wyrd to the first damage event against a subject carrying your active calamity each round.'],
    ['narrow_hour', 'Narrow Hour', [1, 2, 3], 'requiem.oneTurnAttackBonus', 'Add {v} to one attack against a subject whose calamity expires after one own turn.'],
    ['sorrow_harvest', 'Sorrow Harvest', [1, 2, 3], 'requiem.havocOnTrigger', 'Gain {v} additional Havoc when a calamity you declared resolves by its trigger; once per round.'],
    ['death_mark', 'Death Mark', [1, 2, 3], 'requiem.identifyBonus', 'Add {v} to one check to identify or read a doomed subject and its public calamity.'],
    ['last_word', 'Last Word', [1, 2, 3], 'requiem.woundedDamageBonus', 'Add {v} wyrd against a subject below half health that carries your calamity; once per target per round.'],
    ['requiem_range', 'Requiem Range', [5, 10, 15], 'requiem.rangeBonusFeet', 'Add {v} ft to the range of Requiem actions.'],
    ['binding_omen', 'Binding Omen', [1, 2, 3], 'requiem.savePenalty', 'Impose -{v} on one save against a resolved single-target calamity; declared before the table resolves it.'],
    ['silent_count', 'Silent Count', [1, 2, 3], 'requiem.stealthBonus', 'Add {v} to one Stealth check to conceal a calamity declaration; no invisibility or evidence removal.'],
    ['steadfast_doom', 'Steadfast Doom', [1, 2, 3], 'requiem.composureBonus', 'Add {v} to one composure or concentration check to maintain a declared calamity.'],
    ['executioner', 'Executioner', [1, 2, 3], 'requiem.executionBonus', 'Add {v} wyrd when resolving a calamity against a subject below one-quarter health.'],
    ['second_verse', 'Second Verse', [1, 2, 3], 'requiem.followUpBonus', 'Add {v} to one attack or check after a calamity you declared resolves; once per round.'],
    ['grave_patience', 'Grave Patience', [1, 2, 3], 'requiem.expiryBonus', 'Add {v} wyrd when a calamity resolves at its declared expiry rather than by trigger.'],
    ['pallbearer', 'Pallbearer', [5, 10, 15], 'requiem.approachFeet', 'Add {v} ft to one move toward a subject carrying your active calamity; ordinary movement and consequences apply.'],
    ['final_measure', 'Final Measure', [1, 2, 3], 'requiem.initiativeBonus', 'Add {v} to one initiative check while you have an active calamity; declared before rolling.'],
    ['unbroken_verse', 'Unbroken Verse', [1, 2, 3], 'requiem.fearSaveBonus', 'Add {v} to one save against fear or panic caused by your own public doom declaration.'],
    ['requiem_mastery', 'Requiem Mastery', [1, 2, 3], 'requiem.allDamageBonus', 'Add {v} wyrd to one rendition, requiem or single-target calamity effect each round.']
  ],
  endbringer: [
    ['widened_hour', 'Widened Hour', [5, 10, 15], 'endbringer.areaBonusFeet', 'Increase the radius of one area calamity by {v} ft; the area remains visible and avoidable.'],
    ['slow_bell', 'Slow Bell', [1, 2, 3], 'endbringer.damageBonus', 'Add {v} wyrd to one area calamity when its clock advances by a paid action.'],
    ['escalation', 'Escalation', [1, 2, 3], 'endbringer.escalationBonus', 'Add {v} wyrd to a calamity each time its clock advances; once per calamity.'],
    ['havoc_overflow', 'Havoc Overflow', [1, 2, 3], 'endbringer.havocOnExpiry', 'Gain {v} additional Havoc when an area calamity resolves at expiry; once per round.'],
    ['doom_aura', 'Doom Aura', [5, 10, 15], 'endbringer.auraRadiusFeet', 'Extend the published warning aura around an active area calamity by {v} ft; no hidden effect.'],
    ['second_clock', 'Second Clock', [1, 2, 3], 'endbringer.savePenalty', 'Impose -{v} on one save against an area calamity; declared before the table resolves it.'],
    ['ruin_range', 'Ruin Range', [5, 10, 15], 'endbringer.rangeBonusFeet', 'Add {v} ft to the range of Endbringer and area calamity actions.'],
    ['crushing_weight', 'Crushing Weight', [1, 2, 3], 'endbringer.objectDamageBonus', 'Add {v} damage to one calamity effect against an unattended object or structure.'],
    ['enduring_doom', 'Enduring Doom', [1, 2, 3], 'endbringer.composureBonus', 'Add {v} to one check to keep an area calamity active under pressure.'],
    ['field_of_ash', 'Field of Ash', [5, 10, 15], 'endbringer.difficultTerrainFeet', 'Extend a calamity difficult-terrain patch by {v} ft; no damage is added by the patch itself.'],
    ['delayed_payoff', 'Delayed Payoff', [1, 2, 3], 'endbringer.expiryHavocBonus', 'Gain {v} additional Havoc when a calamity that remained active for its full clock resolves.'],
    ['cataclysm_mark', 'Cataclysm Mark', [1, 2, 3], 'endbringer.markedDamageBonus', 'Add {v} wyrd to one effect against a subject marked by two of your calamities; slots remain two.'],
    ['tolling_bell', 'Tolling Bell', [1, 2, 3], 'endbringer.intimidationBonus', 'Add {v} to one Intimidation check against a creature inside a public calamity area.'],
    ['wide_warning', 'Wide Warning', [5, 10, 15], 'endbringer.warningRangeFeet', 'Add {v} ft to the range at which allies can see and hear a public calamity warning.'],
    ['last_quake', 'Last Quake', [1, 2, 3], 'endbringer.finalDamageBonus', 'Add {v} wyrd to the final resolution of an area calamity; once per calamity.'],
    ['endbringer_mastery', 'Endbringer Mastery', [1, 2, 3], 'endbringer.allAreaDamageBonus', 'Add {v} wyrd to one area calamity effect each round.']
  ],
  forewarner: [
    ['clear_signal', 'Clear Signal', [5, 10, 15], 'forewarner.warningRangeFeet', 'Add {v} ft to the range of your public warnings; the warning remains visible and audible.'],
    ['sheltered_ally', 'Sheltered Ally', [1, 2, 3], 'forewarner.wardBonus', 'Add {v} capacity to one ward against a named active calamity; one use.'],
    ['public_omen', 'Public Omen', [1, 2, 3], 'forewarner.allySaveBonus', 'Add {v} to one ally save against a calamity you named; declared before rolling.'],
    ['read_the_sky', 'Read the Sky', [1, 2, 3], 'forewarner.insightBonus', 'Add {v} to one Perception or Insight check about observable omens or weather.'],
    ['guided_step', 'Guided Step', [5, 10, 15], 'forewarner.escapeFeet', 'Add {v} ft to one ally move away from a named calamity; ordinary movement and reactions apply.'],
    ['steady_voice', 'Steady Voice', [1, 2, 3], 'forewarner.warningCheckBonus', 'Add {v} to one check to warn an ally in time; no extra action is granted.'],
    ['shared_portent', 'Shared Portent', [1, 2, 3], 'forewarner.allyAttackBonus', 'Add {v} to one ally attack against a subject carrying a calamity you named public.'],
    ['shelter_line', 'Shelter Line', [1, 2, 3], 'forewarner.coverBonus', 'Grant one ally {v} cover against one effect from a named calamity; the cover is positional and can be lost.'],
    ['forewarned', 'Forewarned', [1, 2, 3], 'forewarner.initiativeBonus', 'Add {v} to one initiative check when you begin with a public calamity already declared.'],
    ['mercy_of_the_bell', 'Mercy of the Bell', [1, 2, 3], 'forewarner.mitigationBonus', 'Reduce one damage event from a named calamity against an ally by {v}; once per calamity.'],
    ['loud_and_clear', 'Loud and Clear', [5, 10, 15], 'forewarner.warningRadiusFeet', 'Increase the number of allies who can receive one warning by {v} ft of spacing; no extra targets beyond the authored maximum.'],
    ['no_panic', 'No Panic', [1, 2, 3], 'forewarner.fearSaveBonus', 'Add {v} to one save against fear caused by a public calamity warning.'],
    ['herald_memory', 'Herald Memory', [1, 2, 3], 'forewarner.recallMax', 'Recall the public terms of up to {v} active calamities; no hidden information.'],
    ['sheltering_word', 'Sheltering Word', [1, 2, 3], 'forewarner.nextSaveBonus', 'Add {v} to one ally next save before your next turn; one use.'],
    ['last_warning', 'Last Warning', [1, 2, 3], 'forewarner.woundedWardBonus', 'Add {v} capacity to one ward for an ally below half health against a named calamity.'],
    ['forewarner_mastery', 'Forewarner Mastery', [1, 2, 3], 'forewarner.allWardBonus', 'Add {v} capacity to one calamity ward each round; no additional ward is created.']
  ]
};

const SIGNATURE_NAMES = {
  quiet_requiem: 'Quiet Requiem',
  absolute_requiem: 'Absolute Requiem',
  lengthen_the_hour: 'Lengthen the Hour',
  the_last_hour: 'The Last Hour',
  sound_the_warning: 'Sound the Warning',
  the_published_doom: 'The Published Doom'
};

export const DOOMSAYER_TREES = DOOMSAYER_TREE_META.map(meta => {
  const nodeId = slot => slot === 'signature' ? meta.signatureNode
    : slot === 'capstone' ? meta.capstoneNode
      : `cr1_doomsayer_${meta.stem}_${slot}`;
  const nodes = rows[meta.id].map(([suffix, name, values, mechanic, text], index) => {
    const [minLevel, requiresPoints, predecessors] = gates[index];
    const slot = `p${String(index + 1).padStart(2, '0')}`;
    return {
      ...identity, id: nodeId(slot), treeId: meta.id, name,
      passiveSpellId: `cr1_doomsayer_${meta.short}_${suffix}`, grantId: null,
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
    grantId: `cr1_doomsayer_${spell}`, passiveSpellId: null, maxRanks: 1,
    minLevel, requiresPoints, requires: predecessors.map(nodeId), requiresAll: true, column: 1, row,
    effectText: `Grant cr1_doomsayer_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant cr1_doomsayer_${spell}.`, values: {} }]
  })));
  return { ...identity, id: meta.id, meta, nodes };
});

export const DOOMSAYER_TALENT_NODES = DOOMSAYER_TREES.flatMap(tree => tree.nodes);

export const DOOMSAYER_PASSIVE_RECORDS = DOOMSAYER_TALENT_NODES
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
    sourceRefs: ['RI-5 Doomsayer content lock']
  }));

export const DOOMSAYER_TALENT_CAPACITY = {
  trees: 3, nodes: 54,
  perTreeRanks: DOOMSAYER_TREES.map(tree => ({
    treeId: tree.id, maxRanks: tree.nodes.reduce((total, node) => total + node.maxRanks, 0)
  })),
  totalRankCapacity: 150, characterPointCap: 50
};
