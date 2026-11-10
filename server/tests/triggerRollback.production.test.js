/** F1 repair regression: guarded rollback scrub unit/property tests (no live server, no Firebase).
 * The restored-old-code projection regression is rollback/verify-old-projection.cjs. */
const assert = require('assert/strict');
const codec = require('../services/roomCheckpoint');
const scrub = require('../services/triggerRollbackScrub');

const CAPABILITY = 'committed-trigger-diagnostic:v1';
const PRIVATE_REASON = 'PRIVATE-GM-REASON resolved at the table';
const TRIGGER_COMMAND_ID = '11111111-1111-4111-8111-111111111111';
const UNRELATED_COMMAND_ID = '22222222-2222-4222-8222-222222222222';

function triggerReceipt() {
  return { version: 1, roomId: 'r1', commandId: TRIGGER_COMMAND_ID, submitterUid: 'GM-UID',
    contentHash: codec.canonicalHash({ commandId: TRIGGER_COMMAND_ID, reason: PRIVATE_REASON }),
    admissionEpoch: 'epoch', commitSequence: 2, checkpointRevision: 1, acceptedAt: 1, actors: [],
    authorization: { kind: 'gm', authorizerUid: 'GM-UID' },
    adjudication: { definitionId: CAPABILITY, definitionVersionOrHash: CAPABILITY, finalAmount: 0,
      adjustmentReason: 'Diagnostic trigger obligation dismissed by the GM. Nothing was applied, paid or executed.',
      chosenResult: JSON.stringify({ capability: CAPABILITY, mode: 'dismiss', obligationId: 'b'.repeat(64) }) } };
}
function unrelatedReceipt() {
  return { version: 1, roomId: 'r1', commandId: UNRELATED_COMMAND_ID, submitterUid: 'OWNER-UID',
    contentHash: 'f'.repeat(64), admissionEpoch: 'epoch', commitSequence: 1, checkpointRevision: 1, acceptedAt: 1, actors: [],
    authorization: { kind: 'gm', authorizerUid: 'OTHER-GM-UID' } };
}
function ledger() {
  return { version: 1, revision: 4,
    listeners: [{ listenerId: '33333333-3333-4333-8333-333333333333', mode: 'diagnostic', gmUid: 'GM-UID',
      source: { kind: 'character', roomId: 'r1', mapId: 'm', tokenId: 'pc', instanceId: 'INSTANCE-SECRET', ownerUid: 'OWNER-UID', characterId: 'c1' },
      definitionRef: { roomId: 'r1', definitionId: 'DEF-SECRET', definitionVersion: 1, definitionHash: 'a'.repeat(64) },
      on: { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' }, registeredAtCommit: 1 }],
    obligations: { ['c'.repeat(64)]: { obligationId: 'c'.repeat(64), state: 'pending-diagnostic', mode: 'diagnostic' } },
    closed: [{ obligationId: 'd'.repeat(64), state: 'dismissed', listenerId: '33333333-3333-4333-8333-333333333333',
      origin: { submitterUid: 'GM-UID', commandId: 'COMMAND-SECRET', commitSequence: 1 }, commandId: TRIGGER_COMMAND_ID,
      commitSequence: 2, reason: PRIVATE_REASON }],
    requests: [{ requestId: '44444444-4444-4444-8444-444444444444', requestHash: 'e'.repeat(64), op: 'register',
      listenerId: '33333333-3333-4333-8333-333333333333' }] };
}
function gameState() {
  return { defaultMapId: 'm',
    maps: { m: { id: 'm', name: 'Map', tokens: {}, characterTokens: {}, creatures: {}, gridItems: {} } },
    actorConsequences: { version: 1, admissionEpoch: 'epoch', commitSequence: 2, replayFloor: 0, receipts: [unrelatedReceipt(), triggerReceipt()] },
    triggerLedger: ledger() };
}
function bundle() {
  const built = codec.buildCheckpointDocuments({ roomId: 'r1', gameState: gameState(), revision: 1 });
  assert.equal(built.ok, true, JSON.stringify(built));
  return { manifest: built.manifest, globalDoc: built.global.data,
    mapDocsById: Object.fromEntries(built.maps.map(entry => [entry.mapId, entry.data])),
    rootDoc: { id: 'r1', checkpoint: built.manifest } };
}
const privateMarkers = text => ['triggerLedger', PRIVATE_REASON, 'INSTANCE-SECRET', 'DEF-SECRET', 'COMMAND-SECRET']
  .filter(marker => String(text).includes(marker));

describe('Shared trigger foundation v1.1 — guarded rollback scrub (F1)', function() {
  it('removes the entire trigger ledger and redacts only trigger dismissal receipt hashes; unrelated receipts are unchanged', () => {
    const before = gameState();
    const unrelatedHash = codec.canonicalHash(before.actorConsequences.receipts.find(r => r.commandId === UNRELATED_COMMAND_ID));
    const result = scrub.scrubGameState(before);
    assert.equal(result.ok, true, JSON.stringify(result));
    assert.equal(result.changed, true);
    assert.deepEqual(result.summary.triggerLedger, { removed: true, listeners: 1, obligations: 1, closed: 1, requests: 1 });
    assert.equal(result.summary.receipts.triggerDismissalsRedacted, 1);
    assert.equal(result.summary.receipts.unrelatedReceiptsPreserved, 1);
    assert.equal(result.gameState.triggerLedger, undefined);
    assert.equal(result.gameState.actorConsequences.receipts.find(r => r.commandId === TRIGGER_COMMAND_ID).contentHash, null);
    assert.equal(codec.canonicalHash(result.gameState.actorConsequences.receipts.find(r => r.commandId === UNRELATED_COMMAND_ID)), unrelatedHash);
    assert.deepEqual(privateMarkers(JSON.stringify(result.gameState)), []);
    assert.equal(before.triggerLedger.version, 1, 'the input is never mutated');
    const again = scrub.scrubGameState(result.gameState);
    assert.equal(again.ok, true); assert.equal(again.changed, false);
  });

  it('refuses unsupported or malformed state without partial scrubbing', () => {
    const unsupported = gameState(); unsupported.triggerLedger.version = 2;
    const blocked = scrub.scrubGameState(unsupported);
    assert.equal(blocked.ok, false); assert.equal(blocked.code, 'TRIGGER_LEDGER_UNSUPPORTED');
    assert.equal(unsupported.triggerLedger.version, 2);
    const malformed = gameState(); malformed.actorConsequences.receipts = { not: 'an array' };
    const actorBlocked = scrub.scrubGameState(malformed);
    assert.equal(actorBlocked.ok, false); assert.equal(actorBlocked.code, 'ACTOR_LEDGER_INVALID');
    assert.ok(malformed.triggerLedger, 'no key removed before validation completes');
  });

  it('scrubs a retained checkpoint bundle, updates manifest/root content hashes and preserves map fragments', () => {
    const original = bundle();
    const oldHash = original.manifest.contentHash;
    const result = scrub.scrubCheckpointBundle(original, { requireRoot: true });
    assert.equal(result.ok, true, JSON.stringify(result));
    assert.equal(result.changed, true);
    assert.notEqual(result.bundle.manifest.contentHash, oldHash);
    assert.equal(result.bundle.rootDoc.checkpoint.contentHash, result.bundle.manifest.contentHash);
    for (const entry of Object.values(original.mapDocsById)) {
      assert.equal(result.bundle.mapDocsById[Object.keys(original.mapDocsById).find(id => original.mapDocsById[id] === entry)].snapshotJson, entry.snapshotJson);
    }
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: result.bundle.manifest, globalDoc: result.bundle.globalDoc, mapDocsById: result.bundle.mapDocsById });
    assert.equal(decoded.ok, true, JSON.stringify(decoded));
    assert.equal(decoded.global.triggerLedger, undefined);
    assert.deepEqual(privateMarkers(JSON.stringify(decoded.global)), []);
    const missingRoot = { ...original }; delete missingRoot.rootDoc;
    assert.equal(scrub.scrubCheckpointBundle(missingRoot).code, 'ROOM_ROOT_REQUIRED');
    const wrongRoot = { ...original, rootDoc: { checkpoint: { ...original.manifest, contentHash: '0'.repeat(64) } } };
    assert.equal(scrub.scrubCheckpointBundle(wrongRoot).code, 'ROOM_ROOT_MISMATCH');
    const mapCarrier = { ...original, mapDocsById: { ...original.mapDocsById } };
    const mapId = Object.keys(mapCarrier.mapDocsById)[0];
    const mapRecord = JSON.parse(mapCarrier.mapDocsById[mapId].snapshotJson);
    mapRecord.triggerLedger = ledger();
    mapCarrier.mapDocsById[mapId] = { ...mapCarrier.mapDocsById[mapId], snapshotJson: JSON.stringify(mapRecord) };
    assert.equal(scrub.scrubCheckpointBundle(mapCarrier).code, 'TRIGGER_DATA_IN_MAP_FRAGMENT');
  });

  it('planRollback refuses ledger-bearing live state without every checkpoint and any un-attested scrub', () => {
    const state = gameState(), checkpoint = bundle();
    assert.equal(scrub.planRollback({ liveProvided: true, live: state, bundles: [], attestedAllCopies: true }).code, 'CHECKPOINTS_REQUIRED');
    assert.equal(scrub.planRollback({ liveProvided: false, serverStopped: false, bundles: [checkpoint], attestedAllCopies: true }).code, 'LIVE_STATE_REQUIRED_OR_SERVER_STOPPED');
    assert.equal(scrub.planRollback({ liveProvided: false, serverStopped: true, bundles: [], attestedAllCopies: true }).code, 'CHECKPOINTS_REQUIRED');
    assert.equal(scrub.planRollback({ liveProvided: true, live: state, bundles: [checkpoint], attestedAllCopies: false }).code, 'COPIES_NOT_ATTESTED');
    const plan = scrub.planRollback({ liveProvided: true, live: state, bundles: [checkpoint], attestedAllCopies: true });
    assert.equal(plan.ok, true, JSON.stringify(plan)); assert.equal(plan.status, 'SCRUBBED');
    assert.equal(plan.live.gameState.triggerLedger, undefined);
    assert.equal(plan.bundles[0].manifest.contentHash === checkpoint.manifest.contentHash, false);
    assert.deepEqual(privateMarkers(JSON.stringify({ live: plan.live.gameState, bundles: plan.bundles })), []);
    const clean = { maps: { m: { id: 'm' } }, actorConsequences: { version: 1, admissionEpoch: 'e', commitSequence: 0, replayFloor: 0, receipts: [] } };
    assert.equal(scrub.planRollback({ liveProvided: true, live: clean, bundles: [] }).status, 'CLEAN');
  });
});
