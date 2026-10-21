// Accepted G1, RI-2 Phase 2A. Authored manual mechanics, never executable opcodes.
const identity = {
  classId: 'gambler', rulesetVersion: 'cr-review-r1', authoredOnly: true,
  executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [],
  manualOnly: true, manualNotice: 'Manual tabletop only; no automatic costs, modifiers, draws or settlement.'
};
export const GAMBLER_TREE_META = [
  { id: 'high-roller', name: 'High Roller', stem: 'high_roller', short: 'hr', signature: 'double_or_nothing', capstone: 'the_last_stake', tagline: 'Commit a real bank before the result; accept the loss.' },
  { id: 'card-sharp', name: 'Card Sharp', stem: 'card_sharp', short: 'cs', signature: 'marked_pair', capstone: 'royal_arrangement', tagline: 'Keep actual ranks and suits, or spend the pattern now.' },
  { id: 'odds-broker', name: 'Odds Broker', stem: 'odds_broker', short: 'ob', signature: 'underwrite', capstone: 'house_compact', tagline: 'Choose an ally and an original event before its face.' }
];

// slot: [minimum level, prior same-tree points, fully ranked predecessor slots].
const gates = [
  [1, 0, []], [1, 0, []], [1, 0, []], [2, 5, ['p01']],
  [3, 10, ['p03']], [3, 10, ['p04']], [4, 15, ['p05', 'signature']], [4, 15, ['p06']],
  [5, 20, ['p07']], [5, 20, ['p08']], [6, 25, ['p09']], [6, 25, ['p10']],
  [7, 30, ['p11']], [8, 35, ['p12']], [9, 40, ['p13']], [10, 45, ['p14']]
];
// Each row owns its exact three absolute rank values once. Values describe a
// manual modifier; no interpreter consumes the mechanic keys as JSON paths.
const rows = {
  'high-roller': [
    ['coin_weight', 'Coin Weight', [1, 2, 3], 'optional-damaging-wager.win.rawBonus', 'Add +{v} raw wyrd on a winning optional damaging wager, once per action; Grand Wager chooses one recipient before rolling. Excludes core, signatures and capstones.'],
    ['long_table', 'The Long Table', [5, 10, 15], 'optional-damaging-wager.rangeBonusFeet', 'Add {v}ft to optional damaging wager range only. No R1 core/signature or capstone change.'],
    ['read_exposure', 'Read the Exposure', [2, 3, 4], 'stakeholder_read.exchangeMax', 'Read the Stakeholders inspects {v} identified visible exchanges in one paid action, one observable omission/inconsistency each; never hidden terms.'],
    ['measured_nerve', 'Measured Nerve', [3, 4, 5], 'beginners_cover.self.wardCapacity', 'Beginner’s Cover on self has ward capacity {v} instead of 2; one use and original expiry.'],
    ['called_distance', 'Called Distance', [1, 2, 3], 'optional-damaging-wager.distantWin.rawBonus', 'Add +{v} raw damage on a winning optional damaging wager against a target at least 20ft away at commitment. Once per action, one preselected recipient; adds to Coin Weight, never changes dice or payout.'],
    ['count_the_cost', 'Count the Cost', [1, 2, 3], 'low-bank.wager-appraisal.checkBonus', '+{v} to one noncombat risk-appraisal check about an actual wager while available Fortune is at most 2, checked before rolling; no gain or expenditure.'],
    ['streak_reserve', 'Streak Reserve', [1, 2, 3], 'hot_streak.rawFlatBonus', 'Hot Streak’s one consumed bonus die adds another +{v} raw damage; no additional charge, generation or duration.'],
    ['loss_discipline', 'Loss Discipline', [1, 2, 3], 'optional-wager.loss.selfWard', 'After losing an optional wager, gain a capacity {v} one-use self ward until next own-turn start, at most once per own turn. No Fortune recovery.'],
    ['unblinking_show', 'Unblinking Show', [3, 4, 5], 'poker_face.checkBonus', 'Poker Face grants +{v} instead of +2 to its one check; original scope and expiry.'],
    ['cruel_arithmetic', 'Cruel Arithmetic', [1, 2, 3], 'optional-wager.nonzeroLoss.rawBonus', 'Add +{v} raw damage to the losing branch of Dice Dart, Death Roll or Final Pot, once per action. Zero-damage loss branches stay zero; no refund.'],
    ['salvage_ledger', 'Salvage Ledger', [1, 2, 3], 'salvage-stake.appraisal.checkBonus', '+{v} to one Intelligence-based noncombat appraisal of actual salvage offered as a stake. No repair, created buyer or changed real value.'],
    ['guarded_fortune', 'Guarded Fortune', [1, 2, 3], 'bank-at-least-3.fearSaveBonus', '+{v} to Spirit saves against fear while available Fortune is at least 3, checked before each save. Never a wager-roll modifier.'],
    ['grand_split', 'Grand Split', [1, 2, 3], 'grand_wager.win.oneRecipient.rawBonus', 'Grand Wager’s win adds +{v} raw damage to one recipient chosen before rolling, not every target; no extra payout.'],
    ['last_stake_precision', 'Last Stake Precision', [1, 2, 3], 'the_last_stake.win.rawBonus', 'The Last Stake’s win adds +{v} raw damage only; threshold and payout unchanged. Dormant until learned.'],
    ['last_stake_floor', 'Last Stake Floor', [1, 2, 3], 'the_last_stake.loss.rawBonus', 'The Last Stake’s loss adds +{v} raw damage to its enemy only; never refund or recovery. Dormant until learned.'],
    ['winnings_cover', 'Winnings Cover', [2, 4, 6], 'the_last_stake.settled.selfWard', 'After The Last Stake settles, win or loss, gain capacity {v} one-use self ward until next own-turn start. Once for that capstone use; no recursive trigger.']
  ],
  'card-sharp': [
    ['shared_cover', 'Shared Cover', [1, 2, 3], 'optional-one-use-ward.otherAlly.capacityBonus', 'Add +{v} capacity to optional one-use wards on another ally; excludes self, Marked Pair, Layered Collateral and capstones. Same capacity modifier as Triplet Cover uses larger, not sum.'],
    ['nimble_fingers', 'Nimble Fingers', [3, 4, 5], 'cheats_sleight.checkBonus', 'Cheat’s Sleight grants +{v} instead of +2; one otherwise legal declared check.'],
    ['top_card_memory', 'Top-Card Memory', [1, 2, 3], 'cut_deck.afterDraw.peekMax', 'After Cut the Deck’s paid discard/draw, privately inspect the next {v} actual deck cards; return unchanged, no extra draw. No free preview.'],
    ['lasting_gilt', 'Lasting Gilt', [15, 20, 30], 'fools_gold.durationMinutes', 'Fool’s Gold lasts {v} minutes instead of 10; no stronger illusion or copied property.'],
    ['practiced_footwork', 'Practiced Footwork', [5, 10, 15], 'optional-movement.self.distanceBonusFeet', 'Self may move up to {v}ft farther through a learned optional Gambler movement spell, still limited by remaining legal movement.'],
    ['still_face', 'Still Face', [15, 20, 30], 'poker_face.unusedExpiryMinutes', 'Poker Face’s unused one-check bonus expires after {v} minutes instead of 10; not additional checks.'],
    ['patient_guard', 'Patient Guard', [1, 2, 3], 'solitaires_guard.subsequentOwnTurnEnd', 'Solitaire’s Guard expires at end of subsequent own turn {v} instead of next start; still one use and no capacity change.'],
    ['low_side_cover', 'Low-Side Cover', [3, 4, 5], 'mirage_flip.loss.wardCapacity', 'Mirage Flip’s losing ward capacity is {v} instead of 2; winning branch, odds and payout unchanged.'],
    ['passing_lane', 'Passing Lane', [3, 4, 5], 'three_card_passage.targetMax', 'Three-Card Passage selects up to {v} individually legal recipients instead of 2; original range and movement.'],
    ['discard_memory', 'Discard Memory', [1, 2, 3], 'twin_cut.reclaimRankMax', 'Twin Cut may replace one deck draw with one card of rank at most {v} already in discard before this action, selected before commitment. Still discard 2 and receive exactly 2; draw one actual top card. Never reclaim this action’s discard or pending cards; requires nonempty deck.'],
    ['sweep_order', 'Sweep Order', [4, 5, 6], 'table_sweep.inspectReorderMax', 'Table Sweep inspects/reorders up to {v} actual top cards instead of 3; all return to top, no draw or shuffle.'],
    ['suit_lane', 'Suit Lane', [5, 10, 15], 'dealers_route.otherAlly.distanceBonusFeet', 'Dealer’s Route grants other allies up to {v}ft farther using remaining movement. Self uses Practiced Footwork instead; never adds both on self.'],
    ['triplet_cover', 'Triplet Cover', [1, 2, 3], 'jackpot_guard.capacityBonus', 'Jackpot Guard adds +{v} ward capacity. Shared Cover affects the same capacity: larger modifier only, not sum.'],
    ['arrangement_shelter', 'Arrangement Shelter', [9, 10, 11], 'royal_arrangement.fullHouse.wardCapacity', 'Royal Arrangement full-house ward is {v} instead of 8; original three-target/one-use limits. Dormant until learned.'],
    ['arrangement_lane', 'Arrangement Lane', [20, 25, 30], 'royal_arrangement.straight.distanceFeet', 'Royal Arrangement straight movement is up to {v}ft instead of 15, using remaining legal movement. Dormant until learned.'],
    ['arrangement_edge', 'Arrangement Edge', [5, 6, 7], 'royal_arrangement.flush.rawBonus', 'Royal Arrangement flush adds +{v} raw wyrd instead of +4, once on one original damaging action per recipient. Dormant until learned.']
  ],
  'odds-broker': [
    ['clear_declarations', 'Clear Declarations', [1, 2, 3], 'witnessed-wager.insightBonus', '+{v} to one Insight check about a wager declaration actually witnessed; no hidden clauses or thoughts.'],
    ['dead_pot_manners', 'Dead Pot Manners', [3, 4, 5], 'dead_pot_etiquette.checkBonus', 'Dead Pot Etiquette grants +{v} instead of +2; no compulsory parley or ceasefire.'],
    ['public_cover', 'Public Cover', [10, 20, 30], 'optional-ward.otherAlly.rangeBonusFeet', 'Add {v}ft to optional Gambler ward casting range on another ally; excludes Marked Pair and capstones.'],
    ['visible_collateral', 'Visible Collateral', [1, 2, 3], 'physical-stake.investigationBonus', '+{v} to one Investigation check examining accessible physical evidence of stake ownership/authenticity; no automatic title or counterfeit revelation.'],
    ['exit_roster', 'Exit Roster', [2, 3, 4], 'insured_exit.targetMax', 'Insured Exit may select up to {v} legal recipients instead of 1; pay once, each within original range.'],
    ['ledger_literacy', 'Ledger Literacy', [3, 4, 5], 'open_ledger.checkBonus', 'Open Ledger grants +{v} instead of +2; one check, no created evidence.'],
    ['shared_brief', 'Shared Brief', [3, 4, 5], 'house_advantage.targetMax', 'House Advantage selects up to {v} recipients instead of 2; still one named activity and one declared check each.'],
    ['patient_reserve', 'Patient Reserve', [3, 4, 5], 'sealed_reserve.subsequentOwnTurnEnd', 'Sealed Reserve expires at end of subsequent own turn {v} instead of 2; still one use.'],
    ['route_questions', 'Route Questions', [1, 2, 3], 'price_the_route.additionalVisibleHazards', 'On successful Price the Route, GM identifies up to {v} additional evidence-supported visible hazards. No higher bonus or hidden hazard knowledge.'],
    ['bluff_trail', 'Bluff Trail', [15, 20, 30], 'call_the_bluff.unusedExpiryMinutes', 'Call the Bluff’s unused bonus expires after {v} minutes instead of 10; one claim and one check.'],
    ['settled_history', 'Settled History', [2, 3, 4], 'ledger_of_losses.wagerMax', 'Ledger of Losses reconstructs up to {v} named settled wagers from the same accessible records with one check; no extra bonus or invented history.'],
    ['durable_collateral', 'Durable Collateral', [5, 6, 7], 'layered_collateral.capacityPerUse', 'Layered Collateral capacity is {v} per use instead of 4; exactly two uses and original expiry.'],
    ['creditor_council', 'Creditor Council', [4, 5, 6], 'merrowport_precedent.representativeMax', 'Merrowport Precedent includes up to {v} willing representatives instead of 3; one obligation/check and actual consent from all affected parties.'],
    ['compact_reach', 'Compact Reach', [40, 50, 60], 'house_compact.formationRangeFeet', 'House Compact formation range is {v}ft instead of 30; event-time eligibility ceiling remains 60ft. Dormant until learned.'],
    ['compact_margin', 'Compact Margin', [5, 6, 7], 'house_compact.win.rawBonus', 'Each winning House Compact leg adds +{v} raw damage instead of +4. No Underwrite or payout change. Dormant until learned.'],
    ['house_composure', 'House Composure', [4, 5, 6], 'house_nerve.fearSaveBonus', 'House Nerve grants +{v} instead of +3 to the next Spirit save against fear only, within original expiry.']
  ]
};

export const GAMBLER_TREES = GAMBLER_TREE_META.map(meta => {
  const nodeId = slot => `cr1_gambler_${meta.stem}_${slot}`;
  const nodes = rows[meta.id].map(([suffix, name, values, mechanic, text], index) => {
    const [minLevel, requiresPoints, predecessors] = gates[index];
    const slot = `p${String(index + 1).padStart(2, '0')}`;
    return {
      ...identity, id: nodeId(slot), treeId: meta.id, name,
      passiveSpellId: `cr1_gambler_${meta.short}_${suffix}`, grantId: null,
      maxRanks: 3, minLevel, requiresPoints, requires: predecessors.map(nodeId), requiresAll: true,
      column: index < 3 ? index : index === 3 ? 0 : index % 2 === 0 ? 0 : 2,
      row: minLevel - 1,
      effectText: text.replaceAll('{v}', values.join(' / ')),
      parameterKeys: [mechanic],
      rankValues: values.map((value, i) => ({ rank: i + 1, text: text.replaceAll('{v}', String(value)), values: { [mechanic]: value } }))
    };
  });
  nodes.push(...[
    ['signature', meta.signature, 3, 10, ['p01', 'p02'], 2],
    ['capstone', meta.capstone, 10, 45, ['p15', 'signature'], 10]
  ].map(([slot, spell, minLevel, requiresPoints, predecessors, row]) => ({
    ...identity, id: nodeId(slot), treeId: meta.id,
    name: ({ double_or_nothing: 'Double or Nothing', marked_pair: 'Marked Pair', underwrite: 'Underwrite', the_last_stake: 'The Last Stake', royal_arrangement: 'Royal Arrangement', house_compact: 'House Compact' })[spell],
    grantId: `cr1_gambler_${spell}`, passiveSpellId: null, maxRanks: 1,
    minLevel, requiresPoints, requires: predecessors.map(nodeId), requiresAll: true, column: 1, row,
    effectText: `Grant cr1_gambler_${spell}; manual ACTION, no optional pick consumed.`,
    rankValues: [{ rank: 1, text: `Grant cr1_gambler_${spell}.`, values: {} }]
  })));
  return { ...identity, id: meta.id, meta, nodes };
});

export const GAMBLER_TALENT_NODES = GAMBLER_TREES.flatMap(tree => tree.nodes);
export const GAMBLER_PASSIVE_RECORDS = GAMBLER_TALENT_NODES.filter(node => node.passiveSpellId).map(node => ({
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
  sourceRefs: ['Accepted Gambler G1 §1.4']
}));

export const GAMBLER_TALENT_CAPACITY = {
  trees: 3, nodes: 54, perTreeRanks: GAMBLER_TREES.map(tree => ({ treeId: tree.id, maxRanks: tree.nodes.reduce((n, node) => n + node.maxRanks, 0) })),
  totalRankCapacity: 150, characterPointCap: 50
};
