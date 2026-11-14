/** Shared trigger foundation v1.1 — guarded rollback scrub for the diagnostic trigger ledger.
 * This is an offline rollback tool, not a runtime trigger engine. It removes the server-owned
 * triggerLedger (listeners, pending obligations, closed reasons, request history), redacts the
 * private contentHash derived from a trigger dismissal request, and removes the private
 * receipt.triggerOfferId link from consumed follow-up receipts. The receipts themselves and every
 * unrelated receipt field are retained. It updates the retained checkpoint manifest content hash
 * and room-root manifest so restored old code can still decode the scrubbed checkpoint. Nothing
 * here executes a trigger. */
const checkpoint = require('./roomCheckpoint');
const CAPABILITY = 'committed-trigger-diagnostic:v1';
const FOLLOWUP_CAPABILITY = 'committed-trigger-followup:v1';
const CAPABILITIES = Object.freeze([CAPABILITY, FOLLOWUP_CAPABILITY]);
const LEDGER_KEY = 'triggerLedger';
const LEDGER_VERSION = 1;
const SCRUB_VERSION = 1;

const isPlain = value => !!value && typeof value === 'object' && !Array.isArray(value) &&
  [Object.prototype, null].includes(Object.getPrototypeOf(value));
const clone = value => JSON.parse(JSON.stringify(value));
const blocked = (code, reason) => ({ ok: false, code, reason: reason || code });
const emptySummary = () => ({
  triggerLedger: { removed: false, listeners: 0, obligations: 0, closed: 0, requests: 0 },
  receipts: { triggerDismissalsRedacted: 0, triggerOfferLinksRemoved: 0, unrelatedReceiptsPreserved: 0 }
});
const isTriggerReceipt = receipt => isPlain(receipt) && CAPABILITIES.includes(receipt.adjudication?.definitionVersionOrHash);
// Both approved follow-up markers (damage T1-T6, healing H1-H3) make a registry undecodable by a previous server.
const MARKED_TRIGGERS = Object.freeze(['authored-followup-trigger:v1', 'authored-followup-healing-trigger:v1']);
const hasMarkedRegistry = gameState => {
  const registry = gameState?.authoredSpellRegistry;
  if (!isPlain(registry) || !Array.isArray(registry.definitions)) {return false;}
  return registry.definitions.some(entry => isPlain(entry) &&
    (MARKED_TRIGGERS.includes(entry.canonicalDefinition?.followUp) || MARKED_TRIGGERS.includes(entry.descriptor?.followUp) ||
      // A watched-part definition (D1 = a) is equally undecodable by a previous server.
      entry.canonicalDefinition?.componentWatch !== undefined || entry.descriptor?.componentWatch !== undefined));
};
const markedRegistryBlocked = () => blocked('MARKED_REGISTRY_ROLLBACK_UNSAFE',
  'A marked follow-up definition is retained in authoredSpellRegistry. A previous server cannot decode this room; revocation does not remove the entry. Do not roll back without an approved recovery procedure; do not strip the marker or restore an old checkpoint over newer gameplay.');

/** Scrub one live/staged game-state object. The original object is never mutated. */
function scrubGameState(gameState) {
  if (!isPlain(gameState)) {return blocked('GAME_STATE_INVALID', 'The supplied game state is not a plain record.');}
  if (hasMarkedRegistry(gameState)) {return markedRegistryBlocked();}
  const out = clone(gameState);
  const summary = emptySummary();
  if (Object.prototype.hasOwnProperty.call(out, LEDGER_KEY)) {
    const ledger = out[LEDGER_KEY];
    if (!isPlain(ledger) || ledger.version !== LEDGER_VERSION || !Array.isArray(ledger.listeners) ||
      !isPlain(ledger.obligations) || !Array.isArray(ledger.closed) || !Array.isArray(ledger.requests)) {
      return blocked('TRIGGER_LEDGER_UNSUPPORTED', 'The trigger ledger is not a supported v1 shape; refusing to scrub it silently.');
    }
    summary.triggerLedger = {
      removed: true,
      listeners: ledger.listeners.length,
      obligations: Object.keys(ledger.obligations).length,
      closed: ledger.closed.length,
      requests: ledger.requests.length
    };
    delete out[LEDGER_KEY];
  }
  if (out.actorConsequences !== undefined) {
    const ledger = out.actorConsequences;
    if (!isPlain(ledger) || !Array.isArray(ledger.receipts)) {
      return blocked('ACTOR_LEDGER_INVALID', 'The actor consequence receipt list is malformed; refusing a partial scrub.');
    }
    for (const receipt of ledger.receipts) {
      if (!isPlain(receipt)) {return blocked('ACTOR_RECEIPT_INVALID', 'An actor consequence receipt is malformed; refusing a partial scrub.');}
      const dismissal = isTriggerReceipt(receipt);
      let linkRemoved = false;
      if (Object.prototype.hasOwnProperty.call(receipt, 'triggerOfferId')) {
        // The private retained-receipt link must not survive rollback.
        delete receipt.triggerOfferId;
        summary.receipts.triggerOfferLinksRemoved += 1;
        linkRemoved = true;
      }
      if (dismissal && receipt.contentHash !== undefined && receipt.contentHash !== null) {
        // The hash commits to the dismissal request, which contains the GM's private reason.
        receipt.contentHash = null;
        summary.receipts.triggerDismissalsRedacted += 1;
      }
      if (!dismissal && !linkRemoved) {summary.receipts.unrelatedReceiptsPreserved += 1;}
    }
  }
  return { ok: true, changed: summary.triggerLedger.removed || summary.receipts.triggerDismissalsRedacted > 0 || summary.receipts.triggerOfferLinksRemoved > 0,
    gameState: out, summary };
}

function scanMapFragment(mapRecord, mapId) {
  if (!isPlain(mapRecord)) {return blocked('MAP_FRAGMENT_INVALID', `Map fragment ${mapId} is not a plain record.`);}
  if (Object.prototype.hasOwnProperty.call(mapRecord, LEDGER_KEY)) {
    return blocked('TRIGGER_DATA_IN_MAP_FRAGMENT', `Map fragment ${mapId} unexpectedly carries ${LEDGER_KEY}.`);
  }
  const receipts = mapRecord.actorConsequences?.receipts;
  if (Array.isArray(receipts) && receipts.some(receipt => isTriggerReceipt(receipt) ||
      (isPlain(receipt) && Object.prototype.hasOwnProperty.call(receipt, 'triggerOfferId')))) {
    return blocked('TRIGGER_DATA_IN_MAP_FRAGMENT', `Map fragment ${mapId} unexpectedly carries trigger receipt provenance.`);
  }
  return { ok: true };
}

function recomputeContentHash(manifest, globalJson, mapDocsById) {
  return checkpoint.sha256Hex(checkpoint.stableStringify([
    checkpoint.CHECKPOINT_SCHEMA_VERSION,
    globalJson,
    manifest.mapIds.map(mapId => [mapId, mapDocsById[mapId].snapshotJson])
  ]));
}

/** Scrub one retained canonical checkpoint bundle: {manifest, globalDoc, mapDocsById, rootDoc?}.
 * The manifest contentHash is recomputed exactly as roomCheckpoint builds it; map fragments are
 * byte-identical. The room-root checkpoint manifest is updated only when it matches the supplied
 * manifest, otherwise the whole rollback is refused. */
function scrubCheckpointBundle(bundle, options = {}) {
  const requireRoot = options.requireRoot !== false;
  if (!isPlain(bundle) || !isPlain(bundle.manifest) || !isPlain(bundle.globalDoc) || !isPlain(bundle.mapDocsById)) {
    return blocked('CHECKPOINT_BUNDLE_INVALID', 'A retained checkpoint bundle must carry manifest, globalDoc and mapDocsById.');
  }
  const manifest = bundle.manifest;
  if (!Array.isArray(manifest.mapIds)) {return blocked('CHECKPOINT_MANIFEST_INVALID', 'The retained checkpoint manifest has no mapIds list.');}
  const mapIds = manifest.mapIds;
  const suppliedIds = Object.keys(bundle.mapDocsById);
  if (suppliedIds.length !== mapIds.length || suppliedIds.some(mapId => !mapIds.includes(mapId))) {
    return blocked('MAP_FRAGMENT_SET_MISMATCH', 'The supplied map fragments do not match the retained checkpoint manifest.');
  }
  for (const mapId of mapIds) {
    const doc = bundle.mapDocsById[mapId];
    if (!isPlain(doc) || typeof doc.snapshotJson !== 'string') {return blocked('MAP_FRAGMENT_INVALID', `Map fragment ${mapId} is malformed.`);}
    let mapRecord;
    try {mapRecord = JSON.parse(doc.snapshotJson);} catch (_) {return blocked('MAP_FRAGMENT_MALFORMED', `Map fragment ${mapId} is not JSON.`);}
    const scan = scanMapFragment(mapRecord, mapId);
    if (!scan.ok) {return scan;}
  }
  const decoded = checkpoint.decodeCanonicalCheckpoint({ checkpoint: manifest, globalDoc: bundle.globalDoc, mapDocsById: bundle.mapDocsById });
  if (!decoded.ok) {return blocked(`CHECKPOINT_${decoded.code}`, decoded.reason || 'The retained checkpoint does not decode.');}

  let rootDoc = bundle.rootDoc;
  if (rootDoc !== undefined && (!isPlain(rootDoc) || !isPlain(rootDoc.checkpoint))) {
    return blocked('ROOM_ROOT_INVALID', 'The supplied room-root document has no checkpoint manifest.');
  }
  if (rootDoc && (rootDoc.checkpoint.contentHash !== manifest.contentHash ||
      rootDoc.checkpoint.revision !== manifest.revision || rootDoc.checkpoint.schemaVersion !== manifest.schemaVersion)) {
    return blocked('ROOM_ROOT_MISMATCH', 'The room-root checkpoint manifest does not match the retained checkpoint.');
  }
  if (requireRoot && !rootDoc) {
    return blocked('ROOM_ROOT_REQUIRED', 'Supply the matching room-root document; an un-updated root manifest must not be left behind.');
  }

  const scrub = scrubGameState(decoded.global);
  if (!scrub.ok) {return scrub;}
  const out = clone(bundle);
  if (!scrub.changed) {
    return { ok: true, changed: false, bundle: out, summary: scrub.summary };
  }
  const globalJson = checkpoint.stableStringify(scrub.gameState);
  const contentHash = recomputeContentHash(manifest, globalJson, bundle.mapDocsById);
  const scrubbedManifest = { ...clone(manifest), contentHash };
  out.manifest = scrubbedManifest;
  out.globalDoc = { ...clone(bundle.globalDoc), snapshotJson: globalJson };
  if (out.rootDoc) {out.rootDoc = { ...clone(out.rootDoc), checkpoint: clone(scrubbedManifest) };}

  const verified = checkpoint.decodeCanonicalCheckpoint({ checkpoint: scrubbedManifest, globalDoc: out.globalDoc, mapDocsById: out.mapDocsById });
  if (!verified.ok) {return blocked(`CHECKPOINT_SCRUB_${verified.code}`, verified.reason || 'The scrubbed checkpoint does not decode.');}
  const retainedReceipts = verified.global.actorConsequences?.receipts || [];
  const unredactedDismissal = retainedReceipts.some(receipt => isTriggerReceipt(receipt) &&
    receipt.contentHash !== null && receipt.contentHash !== undefined);
  const retainedOfferLink = retainedReceipts.some(receipt => isPlain(receipt) &&
    Object.prototype.hasOwnProperty.call(receipt, 'triggerOfferId'));
  if (Object.prototype.hasOwnProperty.call(verified.global, LEDGER_KEY) || unredactedDismissal || retainedOfferLink) {
    return blocked('SCRUB_INCOMPLETE', 'The scrubbed checkpoint still contains trigger ledger data, an unredacted dismissal hash or a private offer link.');
  }
  scrub.summary.contentHash = { before: manifest.contentHash, after: contentHash };
  scrub.summary.rootUpdated = !!out.rootDoc;
  return { ok: true, changed: true, bundle: out, summary: scrub.summary };
}

/** Whole-room guard. No live state read/write: the caller supplies serialized state/checkpoints.
 * Refuses a ledger-bearing live state without every retained checkpoint, and refuses any scrub
 * unless the operator attests that all retained copies were supplied. */
function planRollback({ live, liveProvided = false, serverStopped = false, bundles = [], attestedAllCopies = false } = {}) {
  if (!liveProvided && !serverStopped) {
    return blocked('LIVE_STATE_REQUIRED_OR_SERVER_STOPPED', 'Supply the live game state or attest that the server is stopped.');
  }
  if (!Array.isArray(bundles)) {return blocked('CHECKPOINT_BUNDLE_INVALID', 'bundles must be an array.');}
  const liveScrub = liveProvided ? scrubGameState(live) : { ok: true, changed: false, gameState: null, summary: emptySummary() };
  if (!liveScrub.ok) {return liveScrub;}

  if (bundles.length === 0) {
    if (serverStopped) {return blocked('CHECKPOINTS_REQUIRED', 'A stopped server has no live state to verify; supply every retained checkpoint.');}
    if (liveScrub.changed) {return blocked('CHECKPOINTS_REQUIRED', 'The live state has a trigger ledger; supply every retained checkpoint before rollback.');}
    return { ok: true, status: 'CLEAN', version: SCRUB_VERSION, live: liveScrub, bundles: [], summaries: [] };
  }

  const scrubbedBundles = [];
  const summaries = [];
  let changed = liveScrub.changed;
  for (let index = 0; index < bundles.length; index += 1) {
    const result = scrubCheckpointBundle(bundles[index], { requireRoot: true });
    if (!result.ok) {return { ...result, bundleIndex: index };}
    scrubbedBundles.push(result.bundle);
    summaries.push({ bundleIndex: index, ...result.summary });
    changed = changed || result.changed;
  }
  if (changed && !attestedAllCopies) {
    return blocked('COPIES_NOT_ATTESTED', 'Trigger data was found; the operator must attest that every retained copy of this room was supplied.');
  }
  return { ok: true, status: changed ? 'SCRUBBED' : 'CLEAN', version: SCRUB_VERSION,
    live: liveScrub, bundles: scrubbedBundles, summaries };
}

module.exports = { CAPABILITY, CAPABILITIES, LEDGER_KEY, SCRUB_VERSION, isTriggerReceipt, scrubGameState, scrubCheckpointBundle, planRollback };
