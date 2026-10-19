import {
  aggregateMovementPenalty,
  allocateRank,
  buildMapping,
  buildPreview,
  canAllocateRank,
  commitSpell,
  completeRest,
  createEmptyAllocation,
  createRehearsalSession,
  endOwnTurn,
  exportPacketText,
  importPacket,
  oddsForCommit,
  pendingSettlementPreview,
  preparedExchange,
  recordFace,
  resolveAnomaly,
  resolveContinuation,
  serializePacket,
  setWorksheetCounters,
  settlePending,
  startOwnTurn,
  validateRehearsalState,
  validateTileState,
  voidPending,
  zoneOfTile
} from '../chaosWeaverRules';
import { CHAOS_WEAVER_TILE_IDS } from '../chaosWeaverData';
import {
  CHAOS_WEAVER_TALENT_CAPACITY,
  CHAOS_WEAVER_TALENT_NODES
} from '../../talentTrees/chaosWeaver';

const withAP = (apAvailable) =>
  setWorksheetCounters(createRehearsalSession({ label: 'rules test' }), { apAvailable }).session;

const pointsOf = (allocation) =>
  Object.values(allocation.ranks).reduce((sum, rank) => sum + rank, 0);

const expectConservation = (session) => {
  expect(validateTileState(session.tiles).ok).toBe(true);
  const all = [
    ...session.tiles.available,
    ...session.tiles.committed,
    ...session.tiles.bound,
    ...session.tiles.spent
  ];
  expect(all).toHaveLength(6);
  expect(new Set(all).size).toBe(6);
  CHAOS_WEAVER_TILE_IDS.forEach((tileId) => expect(all).toContain(tileId));
};

const findNextAllocatableNode = (allocation, treeId, level) =>
  CHAOS_WEAVER_TALENT_NODES.find(
    (candidate) =>
      candidate.treeId === treeId &&
      (allocation.ranks[candidate.id] || 0) < candidate.maxRanks &&
      canAllocateRank(allocation, candidate.id, level).ok
  );

const fillTree = (treeId, level, targetPoints) => {
  let allocation = createEmptyAllocation();
  let guard = 0;
  while (pointsOf(allocation) < targetPoints && guard < 200) {
    guard += 1;
    const node = findNextAllocatableNode(allocation, treeId, level);
    if (!node) break;
    allocation = allocateRank(allocation, node.id, level).allocation;
  }
  return allocation;
};

test('mapping is fixed before the face for two, three and four IDs', () => {
  const pair = buildMapping(['F1', 'S1']);
  expect(pair.order).toEqual(['S1', 'F1']);
  expect(pair.entries).toEqual([
    { tileId: 'S1', faces: [1, 2, 3] },
    { tileId: 'F1', faces: [4, 5, 6] }
  ]);
  const triad = buildMapping(['M2', 'S1', 'F1']);
  expect(triad.entries).toEqual([
    { tileId: 'S1', faces: [1, 2] },
    { tileId: 'M2', faces: [3, 4] },
    { tileId: 'F1', faces: [5, 6] }
  ]);
  const quad = buildMapping(['F1', 'S1', 'M1', 'S2']);
  expect(quad.dice).toBe('d4');
  expect(quad.entries.map((entry) => entry.tileId)).toEqual(['S1', 'S2', 'M1', 'F1']);
});

test('published odds follow uniform ID weights: pair 1/2, bias 2/3-1/3, triad 1/3', () => {
  const pair = oddsForCommit(['S1', 'F1']);
  expect(pair.S).toEqual({ numerator: 1, denominator: 2, raw: '1/2' });
  expect(pair.F).toEqual({ numerator: 1, denominator: 2, raw: '1/2' });
  const bias = oddsForCommit(['S1', 'S2', 'F1']);
  expect(bias.S).toEqual({ numerator: 2, denominator: 3, raw: '2/3' });
  expect(bias.F).toEqual({ numerator: 1, denominator: 3, raw: '1/3' });
  const triad = oddsForCommit(['S1', 'M1', 'F1']);
  expect(triad.S).toEqual({ numerator: 1, denominator: 3, raw: '1/3' });
  expect(triad.M).toEqual({ numerator: 1, denominator: 3, raw: '1/3' });
  expect(triad.F).toEqual({ numerator: 1, denominator: 3, raw: '1/3' });
});

test('Split Possibility publishes the pair, spends both and forbids a double settle', () => {
  let session = withAP(4);
  const committed = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_split_possibility',
    primaryTileIds: ['S1', 'F1'],
    sourceLabel: 'T1 Split',
    targetLabel: 'goblin'
  });
  expect(committed.ok).toBe(true);
  session = committed.session;
  expect(session.turn.apAvailable).toBe(2);
  expect(zoneOfTile(session.tiles, 'S1')).toBe('committed');
  expect(zoneOfTile(session.tiles, 'F1')).toBe('committed');
  expect(session.pending.mapping.order).toEqual(['S1', 'F1']);
  const secondCommit = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_split_possibility',
    primaryTileIds: ['S2', 'F2']
  });
  expect(secondCommit.ok).toBe(false);
  expect(secondCommit.errors.join(' ')).toMatch(/unresolved action/);
  session = recordFace(session, { faceValue: 4 }).session;
  expect(session.pending.selectedTileId).toBe('F1');
  expect(session.pending.phase).toBe('face-recorded');
  session = settlePending(session).session;
  expect(zoneOfTile(session.tiles, 'S1')).toBe('spent');
  expect(zoneOfTile(session.tiles, 'F1')).toBe('spent');
  const resettle = settlePending(session);
  expect(resettle.ok).toBe(false);
  expect(resettle.errors.join(' ')).toMatch(/no unresolved action/);
  expectConservation(session);
});

test('commit validation rejects wrong symbols, duplicates and foreign zones', () => {
  const session = withAP(4);
  const wrongSymbols = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_split_possibility',
    primaryTileIds: ['S1', 'S2']
  });
  expect(wrongSymbols.ok).toBe(false);
  expect(wrongSymbols.errors.join(' ')).toMatch(/symbol requirement/);
  const duplicate = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_split_possibility',
    primaryTileIds: ['S1', 'S1']
  });
  expect(duplicate.ok).toBe(false);
  expect(duplicate.errors.join(' ')).toMatch(/duplicate/);
});

test('Fold the Odds is paid recovery of one or two spent IDs, never committed ones', () => {
  let session = withAP(4);
  session = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_split_possibility',
    primaryTileIds: ['S1', 'F1']
  }).session;
  const duringPending = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_fold_odds',
    primaryTileIds: ['S1']
  });
  expect(duringPending.ok).toBe(false);
  expect(duringPending.errors.join(' ')).toMatch(/unresolved action/);
  session = recordFace(session, { faceValue: 1 }).session;
  session = settlePending(session).session;
  const foldTwo = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_fold_odds',
    primaryTileIds: ['S1', 'F1'],
    sourceLabel: 'T2 Fold'
  });
  expect(foldTwo.ok).toBe(true);
  session = foldTwo.session;
  expect(session.turn.apAvailable).toBe(1);
  expect(zoneOfTile(session.tiles, 'S1')).toBe('available');
  expect(zoneOfTile(session.tiles, 'F1')).toBe('available');
  const foldOne = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_fold_odds',
    primaryTileIds: ['S1']
  });
  expect(foldOne.ok).toBe(false);
  expect(foldOne.errors.join(' ')).toMatch(/not spent/);
  expectConservation(session);
});

test('Second Possibility: reservation excluded, accept spends all three on one 3-AP charge', () => {
  let session = withAP(3);
  const excluded = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_second_possibility',
    primaryTileIds: ['F1', 'M1'],
    continuationTileId: 'M1'
  });
  expect(excluded.ok).toBe(false);
  expect(excluded.errors.join(' ')).toMatch(/excluded from the primary sample/);
  session = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_second_possibility',
    primaryTileIds: ['S1', 'F1'],
    continuationTileId: 'M1',
    sourceLabel: 'T1 Second'
  }).session;
  expect(session.turn.apAvailable).toBe(0);
  expect(session.pending.primaryTileIds).toEqual(['S1', 'F1']);
  expect(zoneOfTile(session.tiles, 'M1')).toBe('committed');
  session = recordFace(session, { faceValue: 2 }).session;
  expect(session.pending.selectedTileId).toBe('S1');
  expect(session.pending.phase).toBe('continuation-pending');
  const accepted = resolveContinuation(session, { choice: 'accept' });
  expect(accepted.ok).toBe(true);
  session = accepted.session;
  expect(session.turn.apAvailable).toBe(0);
  ['S1', 'F1', 'M1'].forEach((tileId) => expect(zoneOfTile(session.tiles, tileId)).toBe('spent'));
  expect(session.settlements[session.settlements.length - 1].merged).toBe(true);
  expectConservation(session);
});

test('declining returns only the unused reservation, never the primary tiles', () => {
  let session = withAP(3);
  session = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_second_possibility',
    primaryTileIds: ['S1', 'F1'],
    continuationTileId: 'M1'
  }).session;
  session = recordFace(session, { faceValue: 5 }).session;
  expect(session.pending.selectedTileId).toBe('F1');
  const unconfirmed = resolveContinuation(session, { choice: 'decline' });
  expect(unconfirmed.ok).toBe(false);
  expect(unconfirmed.errors.join(' ')).toMatch(/confirm the retained authored result first/);
  const declined = resolveContinuation(session, {
    choice: 'decline',
    confirmations: pendingSettlementPreview(session).labels
  });
  expect(declined.ok).toBe(true);
  session = declined.session;
  expect(zoneOfTile(session.tiles, 'M1')).toBe('available');
  expect(zoneOfTile(session.tiles, 'S1')).toBe('spent');
  expect(zoneOfTile(session.tiles, 'F1')).toBe('spent');
  expect(session.turn.apAvailable).toBe(0);
  expectConservation(session);
});

test('a GM void requires a reason, spends every committed ID and invents no face', () => {
  let session = withAP(3);
  session = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_second_possibility',
    primaryTileIds: ['S1', 'F1'],
    continuationTileId: 'M1'
  }).session;
  expect(voidPending(session, { reason: '  ' }).ok).toBe(false);
  const voided = voidPending(session, { reason: 'table dispute' });
  expect(voided.ok).toBe(true);
  session = voided.session;
  ['S1', 'F1', 'M1'].forEach((tileId) => expect(zoneOfTile(session.tiles, tileId)).toBe('spent'));
  expect(session.settlements[session.settlements.length - 1].kind).toBe('void');
  expect(recordFace(session, { faceValue: 2 }).ok).toBe(false);
  expectConservation(session);
});

test('Unsteady Ground trigger locks the unresolved action and settles the retained branch', () => {
  let session = withAP(2);
  const bound = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_unsteady_ground',
    primaryTileIds: ['M1', 'F1'],
    targetLabel: 'doorway'
  });
  expect(bound.ok).toBe(true);
  session = bound.session;
  expect(zoneOfTile(session.tiles, 'M1')).toBe('bound');
  expect(zoneOfTile(session.tiles, 'F1')).toBe('bound');
  expect(session.anomaly.expiresEndOwnTurn).toBe(session.turn.ownTurnNumber + 2);
  expect(session.anomaly.mapping).not.toBeNull();
  const coexistence = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_unsteady_ground',
    primaryTileIds: ['M2', 'F2']
  });
  expect(coexistence.ok).toBe(false);
  expect(coexistence.errors.join(' ')).toMatch(/one anomaly already exists/);

  const triggered = resolveAnomaly(session, { reason: 'trigger' });
  expect(triggered.ok).toBe(true);
  session = triggered.session;
  expect(session.pending.kind).toBe('anomaly-trigger');
  expect(session.pending.phase).toBe('committed');
  expect(session.pending.mapping).toEqual(session.anomaly.mapping);
  ['M1', 'F1'].forEach((tileId) => expect(zoneOfTile(session.tiles, tileId)).toBe('bound'));
  expect(session.anomaly).not.toBeNull();
  expect(settlePending(session, {}).ok).toBe(false);
  expect(settlePending(session, {}).errors.join(' ')).toMatch(/enter the physical face/);

  session = recordFace(session, { faceValue: 2 }).session;
  expect(session.pending.selectedTileId).toBe('M1');
  const preview = pendingSettlementPreview(session);
  expect(preview.kind).toBe('anomaly-trigger');
  expect(preview.outcome).toEqual(session.anomaly.profile.branches.M);
  expect(preview.labels).toEqual(['movement']);
  expect(settlePending(session, { confirmations: [] }).ok).toBe(false);
  expect(settlePending(session, { confirmations: ['damage'] }).ok).toBe(false);

  const settled = settlePending(session, { confirmations: preview.labels });
  expect(settled.ok).toBe(true);
  session = settled.session;
  ['M1', 'F1'].forEach((tileId) => expect(zoneOfTile(session.tiles, tileId)).toBe('spent'));
  expect(session.anomaly).toBeNull();
  expect(session.pending).toBeNull();
  const last = session.settlements[session.settlements.length - 1];
  expect(last.kind).toBe('anomaly-trigger');
  expect(last.outcome).toEqual(preview.outcome);
  expect(last.confirmed).toEqual(['movement']);
  expect(resolveAnomaly(session, { reason: 'trigger' }).ok).toBe(false);
  expectConservation(session);
});

test('committed and bound tiles must have a live owner in the worksheet', () => {
  const session = withAP(20);
  const committed = JSON.parse(JSON.stringify(session));
  committed.tiles.available = committed.tiles.available.filter((tileId) => tileId !== 'S1');
  committed.tiles.committed = ['S1'];
  const committedCheck = validateRehearsalState(committed);
  expect(committedCheck.ok).toBe(false);
  expect(committedCheck.errors.join(' ')).toMatch(/committed tile S1 has no unresolved action owner/);

  const bound = JSON.parse(JSON.stringify(session));
  bound.tiles.available = bound.tiles.available.filter((tileId) => tileId !== 'M1');
  bound.tiles.bound = ['M1'];
  const boundCheck = validateRehearsalState(bound);
  expect(boundCheck.ok).toBe(false);
  expect(boundCheck.errors.join(' ')).toMatch(/bound tile M1 has no visible anomaly owner/);

  const pending = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_split_possibility',
    primaryTileIds: ['S1', 'F1']
  });
  expect(pending.ok).toBe(true);
  expect(validateRehearsalState(pending.session).ok).toBe(true);
});

test('Sixfold Audit accepts any three distinct available tiles and refuses short or duplicate picks', () => {
  const session = withAP(3);
  const legal = commitSpell(session, { spellId: 'cw1_38', primaryTileIds: ['S1', 'M1', 'F1'] });
  expect(legal.ok).toBe(true);
  ['S1', 'M1', 'F1'].forEach((tileId) => expect(zoneOfTile(legal.session.tiles, tileId)).toBe('spent'));
  expect(commitSpell(session, { spellId: 'cw1_38', primaryTileIds: ['S1', 'M1'] }).ok).toBe(false);
  expect(commitSpell(session, { spellId: 'cw1_38', primaryTileIds: ['S1', 'S1', 'M1'] }).ok).toBe(false);
  expectConservation(legal.session);
});

test('paid dismissal spends 1 local AP and closes the caster anomaly', () => {
  let session = withAP(3);
  session = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_unsteady_ground',
    primaryTileIds: ['M1', 'F1']
  }).session;
  const dismissed = commitSpell(session, { spellId: 'cw1_dismiss_anomaly' });
  expect(dismissed.ok).toBe(true);
  session = dismissed.session;
  expect(session.turn.apAvailable).toBe(0);
  session = resolveAnomaly(session, { reason: 'dismissal' }).session;
  expect(session.anomaly).toBeNull();
  ['M1', 'F1'].forEach((tileId) => expect(zoneOfTile(session.tiles, tileId)).toBe('spent'));
  expectConservation(session);
});

test('an anomaly expires at the stated end turn and rest refuses while it stands', () => {
  let session = withAP(2);
  session = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_unsteady_ground',
    primaryTileIds: ['M1', 'F1']
  }).session;
  expect(completeRest(session, { restLabel: 'Long rest 1' }).ok).toBe(false);
  session = endOwnTurn(session).session;
  session = startOwnTurn(session, {}).session;
  session = endOwnTurn(session).session;
  expect(session.anomaly).not.toBeNull();
  session = startOwnTurn(session, {}).session;
  session = endOwnTurn(session).session;
  expect(session.anomaly).toBeNull();
  ['M1', 'F1'].forEach((tileId) => expect(zoneOfTile(session.tiles, tileId)).toBe('spent'));
  expectConservation(session);
});

test('rest needs a brand-new label and refuses while a draw is unresolved', () => {
  let session = withAP(2);
  session = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_split_possibility',
    primaryTileIds: ['S1', 'F1']
  }).session;
  const pendingRest = completeRest(session, { restLabel: 'Long rest 1' });
  expect(pendingRest.ok).toBe(false);
  expect(pendingRest.errors.join(' ')).toMatch(/unresolved action/);
  session = recordFace(session, { faceValue: 1 }).session;
  session = settlePending(session).session;
  expect(completeRest(session, { restLabel: '' }).ok).toBe(false);
  const rest = completeRest(session, { restLabel: 'Long rest 1' });
  expect(rest.ok).toBe(true);
  session = rest.session;
  expect(zoneOfTile(session.tiles, 'S1')).toBe('available');
  expect(zoneOfTile(session.tiles, 'F1')).toBe('available');
  const repeat = completeRest(session, { restLabel: 'Long rest 1' });
  expect(repeat.ok).toBe(false);
  expect(repeat.errors.join(' ')).toMatch(/new manual rest label/);
});

test('Prepared Exchange needs a part, different symbols and runs once per rest', () => {
  let session = withAP(2);
  session = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_split_possibility',
    primaryTileIds: ['S1', 'F1']
  }).session;
  session = recordFace(session, { faceValue: 1 }).session;
  session = settlePending(session).session;
  const sameSymbol = preparedExchange(session, {
    spentTileId: 'S1',
    availableTileId: 'S2',
    partLabel: 'spare valve'
  });
  expect(sameSymbol.ok).toBe(false);
  expect(sameSymbol.errors.join(' ')).toMatch(/different symbols/);
  const noPart = preparedExchange(session, { spentTileId: 'S1', availableTileId: 'M1' });
  expect(noPart.ok).toBe(false);
  const exchange = preparedExchange(session, {
    spentTileId: 'S1',
    availableTileId: 'M1',
    partLabel: 'spare valve'
  });
  expect(exchange.ok).toBe(true);
  session = exchange.session;
  expect(zoneOfTile(session.tiles, 'S1')).toBe('available');
  expect(zoneOfTile(session.tiles, 'M1')).toBe('spent');
  expect(aggregateMovementPenalty(session)).toBe(5);
  const again = preparedExchange(session, {
    spentTileId: 'F1',
    availableTileId: 'M2',
    partLabel: 'another part'
  });
  expect(again.ok).toBe(false);
  expect(again.errors.join(' ')).toMatch(/already used this rest/);
  session = startOwnTurn(session, {}).session;
  expect(aggregateMovementPenalty(session)).toBe(0);
  expectConservation(session);
});

test('signature at 11 points is impossible before level 3', () => {
  const allocation = fillTree('probability-sculptor', 3, 10);
  expect(pointsOf(allocation)).toBe(10);
  expect(canAllocateRank(allocation, 'cw1_ps_n05', 3).ok).toBe(true);
  const atLevel2 = canAllocateRank(allocation, 'cw1_ps_n05', 2);
  expect(atLevel2.ok).toBe(false);
  expect(atLevel2.errors.join(' ')).toMatch(/budget/);
});

test('a hybrid cannot borrow an unpaid signature from another tree', () => {
  const check = canAllocateRank(createEmptyAllocation(), 'cw1_ab_n05', 10);
  expect(check.ok).toBe(false);
  expect(check.errors.join(' ')).toMatch(/needs 10 points/);
});

test('a full tree reaches its 45-point capstone within the 50-point cap', () => {
  const capstoneId = 'cw1_ps_n18';
  let allocation = createEmptyAllocation();
  let guard = 0;
  while (!canAllocateRank(allocation, capstoneId, 10).ok && guard < 200) {
    guard += 1;
    const node = findNextAllocatableNode(allocation, 'probability-sculptor', 10);
    expect(node).toBeTruthy();
    if (!node) break;
    allocation = allocateRank(allocation, node.id, 10).allocation;
  }
  expect(canAllocateRank(allocation, capstoneId, 10).ok).toBe(true);
  const withCapstone = allocateRank(allocation, capstoneId, 10);
  expect(withCapstone.ok).toBe(true);
  const total = pointsOf(withCapstone.allocation);
  expect(total).toBeLessThanOrEqual(CHAOS_WEAVER_TALENT_CAPACITY.characterPointCap);
  expect(total).toBeGreaterThanOrEqual(46);
});

test('export is a certified packet and round-trips exactly, preserving explicit zeros', () => {
  const text = exportPacketText({ rehearsal: null });
  expect(text).toContain('"schemaVersion":1');
  expect(text).toContain('"mana":0');
  const imported = importPacket(text);
  expect(imported.ok).toBe(true);
  expect(serializePacket(imported.packet)).toBe(text);
});

test('a packet carrying an active rehearsal restores the validated worksheet', () => {
  let session = withAP(2);
  session = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_split_possibility',
    primaryTileIds: ['S1', 'F1'],
    sourceLabel: 'T1 Split',
    targetLabel: 'goblin'
  }).session;
  const text = exportPacketText({ rehearsal: session });
  const imported = importPacket(text);
  expect(imported.ok).toBe(true);
  const check = validateRehearsalState(imported.packet.rehearsal);
  expect(check.ok).toBe(true);
  expect(check.state.pending.primaryTileIds).toEqual(['S1', 'F1']);
  expect(check.state.pending.phase).toBe('committed');
  expect(check.state.turn.apAvailable).toBe(0);
});

test('malformed or unknown drafts are retained but never certified', () => {
  const malformed = importPacket('{"schemaVersion":1,');
  expect(malformed.ok).toBe(false);
  expect(malformed.draftText).toBe('{"schemaVersion":1,');
  const valid = JSON.parse(exportPacketText({ rehearsal: null }));
  const unknown = importPacket(JSON.stringify({ ...valid, extraExtension: true }));
  expect(unknown.ok).toBe(false);
  expect(unknown.errors.join(' ')).toMatch(/unknown extensions/);
  expect(unknown.draft.extraExtension).toBe(true);
  expect(unknown.draftText).toBe(JSON.stringify({ ...valid, extraExtension: true }));
});

test('deterministic records settle from the retained authored outcome without a face', () => {
  let session = withAP(2);
  const committed = commitSpell(session, {
    spellId: 'cw1_01',
    primaryTileIds: ['F1'],
    sourceLabel: 'Fraying Bolt',
    targetLabel: 'goblin'
  });
  expect(committed.ok).toBe(true);
  session = committed.session;
  expect(session.turn.apAvailable).toBe(0);
  expect(zoneOfTile(session.tiles, 'F1')).toBe('committed');
  expect(session.pending.phase).toBe('face-recorded');
  expect(session.pending.mapping).toEqual({
    order: ['F1'],
    dice: null,
    rule: 'deterministic-no-sample',
    entries: []
  });
  const unfaceable = recordFace(session, { faceValue: 2 });
  expect(unfaceable.ok).toBe(false);
  expect(unfaceable.errors.join(' ')).toMatch(/no physical face/);
  const pendingText = exportPacketText({ rehearsal: session });
  const importedPending = importPacket(pendingText);
  expect(importedPending.ok).toBe(true);
  const pendingCheck = validateRehearsalState(importedPending.packet.rehearsal);
  expect(pendingCheck.ok).toBe(true);
  expect(pendingCheck.state.pending.primaryTileIds).toEqual(['F1']);

  const preview = pendingSettlementPreview(session);
  expect(preview.selectedTileId).toBeNull();
  expect(preview.outcome.damage).toEqual({ formula: '1d6', damageTypes: ['wyrd'] });
  expect(preview.labels).toEqual(['damage', 'movement']);
  expect(settlePending(session, { confirmations: [] }).ok).toBe(false);
  const settled = settlePending(session, { confirmations: preview.labels });
  expect(settled.ok).toBe(true);
  session = settled.session;
  expect(zoneOfTile(session.tiles, 'F1')).toBe('spent');
  expect(aggregateMovementPenalty(session)).toBe(5);
  const last = session.settlements[session.settlements.length - 1];
  expect(last.outcome).toEqual(preview.outcome);
  expect(last.selectedTileId).toBeNull();
  expect(last.recordedFaces).toBeNull();
  expect(last.confirmed).toEqual(preview.labels);
  expectConservation(session);
  const settledText = exportPacketText({ rehearsal: session });
  const importedSettled = importPacket(settledText);
  expect(importedSettled.ok).toBe(true);
  expect(validateRehearsalState(importedSettled.packet.rehearsal).ok).toBe(true);
  expect(serializePacket(importedSettled.packet)).toBe(settledText);
});

test('a voided anomaly trigger closes its bound IDs without refund or redraw', () => {
  let session = withAP(2);
  session = commitSpell(session, {
    spellId: 'cr1_chaos_weaver_unsteady_ground',
    primaryTileIds: ['M1', 'F1']
  }).session;
  session = resolveAnomaly(session, { reason: 'trigger' }).session;
  expect(session.pending.kind).toBe('anomaly-trigger');
  const voided = voidPending(session, { reason: 'table dispute' });
  expect(voided.ok).toBe(true);
  session = voided.session;
  expect(session.anomaly).toBeNull();
  expect(session.pending).toBeNull();
  ['M1', 'F1'].forEach((tileId) => expect(zoneOfTile(session.tiles, tileId)).toBe('spent'));
  expect(resolveAnomaly(session, { reason: 'trigger' }).ok).toBe(false);
  const last = session.settlements[session.settlements.length - 1];
  expect(last.kind).toBe('void');
  expect(last.selectedTileId).toBeNull();
  expectConservation(session);
});

test('corrupted deterministic pendings and settlements are refused on import', () => {
  const session = withAP(2);
  const committed = commitSpell(session, {
    spellId: 'cw1_01',
    primaryTileIds: ['F1'],
    sourceLabel: 'Fraying Bolt',
    targetLabel: 'goblin'
  }).session;
  const wrongPhase = JSON.parse(JSON.stringify(committed));
  wrongPhase.pending.phase = 'committed';
  expect(validateRehearsalState(wrongPhase).errors.join(' ')).toMatch(
    /deterministic retained result settles without a physical face/
  );
  const forgedFace = JSON.parse(JSON.stringify(committed));
  forgedFace.pending.selectedTileId = 'F1';
  forgedFace.pending.recordedFaces = [4];
  expect(validateRehearsalState(forgedFace).errors.join(' ')).toMatch(
    /deterministic retained result selects no tile/
  );
  const forgedCombo = JSON.parse(JSON.stringify(committed));
  forgedCombo.pending.primaryTileIds = ['S1'];
  expect(validateRehearsalState(forgedCombo).errors.join(' ')).toMatch(
    /pending primary IDs do not satisfy the authored symbol requirement/
  );
  const forgedContinuation = JSON.parse(JSON.stringify(committed));
  forgedContinuation.pending.continuationTileId = 'M1';
  expect(validateRehearsalState(forgedContinuation).errors.join(' ')).toMatch(
    /this action has no authored continuation profile/
  );

  const settled = settlePending(committed, {
    confirmations: pendingSettlementPreview(committed).labels
  }).session;
  const forgedSettlement = JSON.parse(JSON.stringify(settled));
  const last = forgedSettlement.settlements[forgedSettlement.settlements.length - 1];
  last.selectedTileId = 'F1';
  last.recordedFaces = [2];
  expect(validateRehearsalState(forgedSettlement).errors.join(' ')).toMatch(
    /deterministic settlement selects no tile/
  );
});

test('completed builds validate known picks and prune stale allocation on level change', () => {
  const legal = buildPreview({ characterLevel: 1, pickedSpellIds: ['cw1_01'] });
  expect(legal.ok).toBe(true);
  const future = buildPreview({ characterLevel: 1, pickedSpellIds: ['cw1_05'] });
  expect(future.ok).toBe(false);
  expect(future.errors.join(' ')).toMatch(/requires level 2/);
  const duplicates = buildPreview({ characterLevel: 3, pickedSpellIds: ['cw1_01', 'cw1_01'] });
  expect(duplicates.ok).toBe(false);
  expect(duplicates.errors.join(' ')).toMatch(/duplicate pick cw1_01/);
  const crowded = buildPreview({ characterLevel: 1, pickedSpellIds: ['cw1_01', 'cw1_02'] });
  expect(crowded.ok).toBe(false);
  expect(crowded.errors.join(' ')).toMatch(/one optional pick per level/);
  const nonPick = buildPreview({ characterLevel: 1, pickedSpellIds: ['cw1_dismiss_anomaly'] });
  expect(nonPick.ok).toBe(false);
  expect(nonPick.errors.join(' ')).toMatch(/only optional level-pick records/);

  const allocation = fillTree('probability-sculptor', 3, 10);
  const atThree = buildPreview({ characterLevel: 3, pickedSpellIds: [], allocation });
  expect(atThree.ok).toBe(true);
  expect(atThree.talentPoints).toBe(10);
  const atOne = buildPreview({ characterLevel: 1, pickedSpellIds: [], allocation });
  expect(atOne.ok).toBe(true);
  expect(atOne.talentPoints).toBeLessThanOrEqual(atOne.talentBudget);
  expect(typeof atOne.allocation).toBe('object');
});
