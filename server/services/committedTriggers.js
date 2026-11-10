/** Shared trigger foundation v1 (handoff/shared-trigger-foundation/CONTRACT.md): committed occurrences of
 * binder-approved single-target immediate damage/healing, GM-registered DIAGNOSTIC listeners and durable pending
 * obligations, all staged in the same P7 snapshot as the originating receipt. Executes nothing: no HP, resource,
 * condition, payment or approval is ever produced here. */
const crypto = require('crypto');
const actors = require('./actorConsequences');
const { fail, hash, clone, own, keys } = actors;
const CAPABILITY = 'committed-trigger-diagnostic:v1';
const MAX_LISTENERS = 32, MAX_OPEN = 64, MAX_CLOSED = 256, MAX_REQUESTS = 256; // engineering limits, never game rules
const EVIDENCE = { 'immediate-damage': ['committed', 'adjudicatedAmount', 'baseHpLost', 'tempHpAbsorbed'], 'immediate-healing': ['committed', 'adjudicatedAmount', 'hpRestored'] };
const DISMISS_REASON = 'Diagnostic trigger obligation dismissed by the GM. Nothing was applied, paid or executed.';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const amount = value => Number.isSafeInteger(value) && value >= 0;

function ledger(gameState) {
  const stored = gameState.triggerLedger;
  if (stored === undefined) {return null;}
  if (!stored || stored.version !== 1 || !amount(stored.revision) || !Array.isArray(stored.listeners) || stored.listeners.length > MAX_LISTENERS ||
      !stored.obligations || typeof stored.obligations !== 'object' || Array.isArray(stored.obligations) || Object.keys(stored.obligations).length > MAX_OPEN ||
      !Array.isArray(stored.closed) || stored.closed.length > MAX_CLOSED || !Array.isArray(stored.requests) || stored.requests.length > MAX_REQUESTS) {
    fail('unsupported_trigger_ledger', 'The stored trigger ledger is not a supported version or shape. Nothing changed.');
  }
  return stored;
}
function validateOn(on) {
  keys(on, ['occurrence', 'role', 'evidence']);
  if (!own(EVIDENCE, on.occurrence) || !['source', 'target'].includes(on.role) || !EVIDENCE[on.occurrence].includes(on.evidence)) {
    fail('unsupported_trigger_predicate', 'Only an immediate-damage or immediate-healing occurrence, the listener as its source or target, and one named evidence field are supported.');
  }
}
function validateDefinitionRef(room, ref) {
  keys(ref, ['roomId', 'definitionId', 'definitionVersion', 'definitionHash']);
  if (ref.roomId !== room.id || typeof ref.definitionId !== 'string' || !ref.definitionId || ref.definitionId.length > 200 ||
      !Number.isSafeInteger(ref.definitionVersion) || ref.definitionVersion < 1 || !/^[0-9a-f]{64}$/.test(ref.definitionHash || '')) {fail('invalid_trigger_listener');}
}
/** One rule for registration and for every commit. `room` may be a staged view ({ ...room, gameState: next }). */
function eligibility(room, listener) {
  try {
    if (listener.gmUid !== room.gmId) {fail('trigger_registrar_retired');}
    const located = actors.locate(room, listener.source);
    const installed = require('./installedAuthoredAbilities'), pure = require('../shared/services/authoredAbility');
    const id = pure.actionId(listener.definitionRef);
    const entry = installed.list(room).entries.find(e => pure.actionId(e.definitionRef) === id);
    if (!entry) {fail('definition_not_admitted');}
    if (entry.revoked) {fail('definition_revoked');}
    if (listener.source.kind === 'creature') {
      const grant = located.contract.authoredAdmission;
      if (!grant || grant.gmUid !== room.gmId || pure.actionId(grant.definitionRef) !== id || hash(grant.source) !== hash(listener.source) ||
          hash(located.token.authoredAbility) !== grant.associationHash) {fail('creature_admission_changed');}
    } else {
      if (entry.creatureOnly) {fail('unsupported_source_route');}
      if (String(located.token.character?.class || '').toLowerCase().replace(/ /g, '_') !== entry.canonicalDefinition.binding.classId) {fail('unsupported_binding');}
    }
    return { ok: true };
  } catch (error) { return { ok: false, code: error.code || 'trigger_listener_ineligible' }; }
}
/** Typed occurrence of one binder-approved single-target immediate damage/healing consequence, or null. */
function occurrenceOf(room, receipt, command, approved, binder, entries) {
  if (!approved || binder !== require('./spellPayments')) {return null;}
  const approval = approved.approval, authored = require('../shared/services/authoredAbility');
  if (require('../shared/services/authoredCondition').isCondition(approval) || require('../shared/services/authoredEffect').isEffect(approval) ||
      require('../shared/services/classEffect').isClassEffect(approval) || authored.isArea(approval) || !['damage', 'healing'].includes(approval.spell?.kind) || !approval.target) {return null;}
  const entry = entries.find(item => hash(item.ref) === hash(approval.target));
  if (!entry) {return null;}
  const before = actors.resources(actors.locate(room, approval.target).token, approval.target.kind).hp, after = entry.finalResources.hp;
  const adjudicatedAmount = command.adjudication?.finalAmount, damage = approval.spell.kind === 'damage';
  const evidence = damage ? { proposedTotal: approval.roll.total, adjudicatedAmount, baseHpLost: before.current - after.current, tempHpAbsorbed: before.temp - after.temp }
    : { proposedTotal: approval.roll.total, adjudicatedAmount, hpRestored: after.current - before.current };
  // The binder pins this arithmetic; anything else is not a fact this ledger may record.
  if (!Object.values(evidence).every(amount) || (!damage && before.temp !== after.temp)) {fail('trigger_evidence_inconsistent', 'The committed pools do not match the approved immediate damage or healing. Nothing changed.');}
  const kind = damage ? 'immediate-damage' : 'immediate-healing';
  return { occurrenceId: hash(['committed-occurrence:v1', room.id, receipt.submitterUid, receipt.commandId, receipt.commitSequence, kind, approval.target]), kind,
    source: clone(approval.source), target: clone(approval.target), evidence, cause: { definitionId: approval.spell.definitionId } };
}
/** finishStage hook. Mutates only `next.triggerLedger`, and only when a listener is registered. */
function record(room, next, receipt, command, approved, binder, entries) {
  const stored = ledger(next);
  if (!stored || !stored.listeners.length) {return;}
  const occurrence = occurrenceOf(room, receipt, command, approved, binder, entries);
  if (!occurrence) {return;}
  const view = { ...room, gameState: next }, pure = require('../shared/services/authoredAbility'), added = {};
  for (const listener of [...stored.listeners].sort((a, b) => a.listenerId.localeCompare(b.listenerId))) {
    if (listener.on.occurrence !== occurrence.kind || hash(listener.source) !== hash(occurrence[listener.on.role])) {continue;}
    if (pure.actionId(listener.definitionRef) === occurrence.cause.definitionId) {continue;} // self-generated exclusion
    const value = listener.on.evidence === 'committed' ? null : occurrence.evidence[listener.on.evidence];
    if (value !== null && value < 1) {continue;}
    if (!eligibility(view, listener).ok) {continue;}
    const obligationId = hash(['trigger-obligation:v1', occurrence.occurrenceId, listener.listenerId]);
    if (own(stored.obligations, obligationId) || stored.closed.some(item => item.obligationId === obligationId)) {fail('trigger_obligation_conflict');}
    added[obligationId] = { obligationId, state: 'pending-diagnostic', mode: 'diagnostic', occurrence: clone(occurrence),
      listener: { listenerId: listener.listenerId, source: clone(listener.source), definitionRef: clone(listener.definitionRef), on: clone(listener.on) },
      matched: { role: listener.on.role, evidence: listener.on.evidence, value },
      origin: { submitterUid: receipt.submitterUid, commandId: receipt.commandId, commitSequence: receipt.commitSequence } };
  }
  const count = Object.keys(added).length, open = Object.keys(stored.obligations).length;
  if (!count) {return;}
  if (open + count > MAX_OPEN) {
    fail('trigger_obligation_capacity', `This consequence would record ${count} diagnostic trigger obligation(s) but ${open} are already waiting (limit ${MAX_OPEN}). Dismiss waiting obligations or revoke listeners, then confirm again. Nothing changed.`);
  }
  next.triggerLedger = { ...stored, revision: stored.revision + 1, obligations: { ...stored.obligations, ...added } };
}
function requestOf(stored, requestId, requestHash) {
  const prior = stored?.requests.find(item => item.requestId === requestId);
  if (prior && prior.requestHash !== requestHash) {fail('REQUEST_ID_CONFLICT');}
  return prior || null;
}
function validateRegister(room, data) {
  keys(data, ['roomId', 'requestId', 'expectedRevision', 'source', 'definitionRef', 'on']);
  if (data.roomId !== room.id || !UUID.test(data.requestId || '') || !amount(data.expectedRevision) || actors.bytes(data) > 8192) {fail('invalid_trigger_listener');}
  actors.validateRef(data.source); validateDefinitionRef(room, data.definitionRef); validateOn(data.on);
}
/** Returns { listener, next? }: `next` is absent for an exact replay. */
function planRegister(room, uid, data) {
  validateRegister(room, data);
  if (uid !== room.gmId) {fail('forbidden');}
  const stored = ledger(room.gameState) || { version: 1, revision: 0, listeners: [], obligations: {}, closed: [], requests: [] };
  const requestHash = hash(data), prior = requestOf(stored, data.requestId, requestHash);
  if (prior) {
    const listener = stored.listeners.find(item => item.listenerId === prior.listenerId);
    if (prior.op !== 'register' || !listener) {fail('trigger_listener_changed', 'That registration was already processed and the listener has since been revoked.');}
    return { listener: clone(listener) };
  }
  if (data.expectedRevision !== stored.revision) {fail('REVISION_CONFLICT');}
  if (stored.listeners.length >= MAX_LISTENERS) {fail('trigger_listener_capacity', `At most ${MAX_LISTENERS} diagnostic listeners per room. Revoke one first. Nothing changed.`);}
  const listener = { listenerId: crypto.randomUUID(), mode: 'diagnostic', gmUid: uid, source: clone(data.source), definitionRef: clone(data.definitionRef), on: clone(data.on),
    registeredAtCommit: actors.ledger(room).commitSequence };
  const check = eligibility(room, listener);
  if (!check.ok) {fail(check.code, 'The listener must bind an admitted, unrevoked definition to its exact current source actor. Nothing changed.');}
  if (stored.listeners.some(item => hash([item.source, item.definitionRef, item.on]) === hash([listener.source, listener.definitionRef, listener.on]))) {fail('trigger_listener_exists');}
  const next = clone(room.gameState);
  next.triggerLedger = { ...clone(stored), revision: stored.revision + 1, listeners: [...clone(stored.listeners), listener],
    requests: [...clone(stored.requests), { requestId: data.requestId, requestHash, op: 'register', listenerId: listener.listenerId }].slice(-MAX_REQUESTS) };
  return { listener: clone(listener), next };
}
function planRevoke(room, uid, data) {
  keys(data, ['roomId', 'requestId', 'expectedRevision', 'listenerId']);
  if (data.roomId !== room.id || !UUID.test(data.requestId || '') || !UUID.test(data.listenerId || '') || !amount(data.expectedRevision)) {fail('invalid_trigger_listener');}
  if (uid !== room.gmId) {fail('forbidden');}
  const stored = ledger(room.gameState);
  if (!stored) {fail('trigger_listener_not_found');}
  const requestHash = hash(data), prior = requestOf(stored, data.requestId, requestHash);
  if (prior) {return { listenerId: prior.listenerId };}
  if (data.expectedRevision !== stored.revision) {fail('REVISION_CONFLICT');}
  if (!stored.listeners.some(item => item.listenerId === data.listenerId)) {fail('trigger_listener_not_found');}
  const next = clone(room.gameState);
  // Pending obligations are evidence of committed occurrences: revocation never erases them.
  next.triggerLedger = { ...clone(stored), revision: stored.revision + 1, listeners: clone(stored.listeners.filter(item => item.listenerId !== data.listenerId)),
    requests: [...clone(stored.requests), { requestId: data.requestId, requestHash, op: 'revoke', listenerId: data.listenerId }].slice(-MAX_REQUESTS) };
  return { listenerId: data.listenerId, next };
}
function validateDismiss(request) {
  keys(request, ['version', 'roomId', 'commandId', 'actionEpoch', 'baseCommitSequence', 'obligationId', 'reason']);
  if (request.version !== 1 || !UUID.test(request.commandId || '') || typeof request.roomId !== 'string' || typeof request.actionEpoch !== 'string' || !amount(request.baseCommitSequence) ||
      !/^[0-9a-f]{64}$/.test(request.obligationId || '') || typeof request.reason !== 'string' || !request.reason.trim() || request.reason.length > 500 || actors.bytes(request) > 4096) {fail('invalid_trigger_dismissal');}
}
/** GM closes one pending obligation by hand. One P7 receipt; the obligation leaves and its closed record arrives in the same stage. */
function stageDismiss(room, player, uid, request, confirmedRevision) {
  validateDismiss(request);
  if (!player.isGM || uid !== room.gmId || request.roomId !== room.id) {fail('forbidden');}
  const prior = actors.ledger(room);
  if (request.actionEpoch !== actors.epoch(room)) {fail('outcome_unknown');}
  if (request.baseCommitSequence < prior.replayFloor) {fail('retry_window_expired');}
  if (request.baseCommitSequence > prior.commitSequence) {fail('invalid_trigger_dismissal');}
  const stored = ledger(room.gameState), obligation = stored?.obligations[request.obligationId];
  if (!obligation || !own(stored.obligations, request.obligationId)) {fail('trigger_obligation_not_open', 'This obligation is not waiting (already dismissed, or never recorded). Nothing changed.');}
  const staged = actors.finishStage(room, uid, request, { kind: 'gm', authorizerUid: uid }, confirmedRevision, clone(room.gameState), []);
  staged.receipt.adjudication = { definitionId: CAPABILITY, definitionVersionOrHash: CAPABILITY, finalAmount: 0, adjustmentReason: DISMISS_REASON,
    chosenResult: JSON.stringify({ capability: CAPABILITY, mode: 'dismiss', obligationId: obligation.obligationId }) };
  const open = clone(stored.obligations); delete open[obligation.obligationId];
  staged.next.triggerLedger = { ...clone(stored), revision: stored.revision + 1, obligations: open,
    closed: [...clone(stored.closed), { obligationId: obligation.obligationId, state: 'dismissed', listenerId: obligation.listener.listenerId, origin: clone(obligation.origin),
      commandId: request.commandId, commitSequence: staged.receipt.commitSequence, reason: request.reason }].slice(-MAX_CLOSED) };
  return staged;
}
const isReceipt = receipt => receipt?.adjudication?.definitionVersionOrHash === CAPABILITY;
/** Explicit viewer projection (CONTRACT §7). `confirmedRevision` only labels durability of a still-retained origin receipt. */
function project(room, viewer, confirmedRevision, liveOnly) {
  const stored = ledger(room.gameState), empty = { revision: stored?.revision || 0, listeners: [], obligations: [], closed: [] };
  if (!stored) {return empty;}
  const receipts = actors.ledger(room).receipts;
  const durability = origin => {
    if (liveOnly) {return 'live-only';}
    const found = receipts.find(r => r.submitterUid === origin.submitterUid && r.commandId === origin.commandId);
    return !found || (Number.isSafeInteger(found.checkpointRevision) && found.checkpointRevision > 0 && found.checkpointRevision <= confirmedRevision) ? 'checkpoint-confirmed' : 'accepted-live';
  };
  const sorted = Object.values(stored.obligations).sort((a, b) => a.origin.commitSequence - b.origin.commitSequence || a.obligationId.localeCompare(b.obligationId));
  if (viewer.gm && viewer.uid === room.gmId) {
    return { revision: stored.revision, listeners: stored.listeners.map(item => ({ ...clone(item), eligibility: eligibility(room, item) })),
      obligations: sorted.map(item => ({ ...clone(item), originDurability: durability(item.origin), listenerRegistered: stored.listeners.some(l => l.listenerId === item.listener.listenerId) })),
      closed: clone(stored.closed) };
  }
  // Owner view: only their own bound PC, and only what the matched predicate itself read.
  const mine = ref => {
    if (ref.kind !== 'character' || ref.ownerUid !== viewer.uid) {return false;}
    try { return actors.locate(room, ref).token.ownerUserId === viewer.uid; } catch (_) { return false; }
  };
  return { revision: stored.revision,
    listeners: stored.listeners.filter(item => mine(item.source)).map(item => ({ listenerId: item.listenerId, mode: item.mode, source: clone(item.source), on: clone(item.on) })),
    obligations: sorted.filter(item => mine(item.listener.source)).map(item => ({ obligationId: item.obligationId, state: item.state, mode: item.mode, listenerId: item.listener.listenerId,
      occurrence: item.occurrence.kind, matched: clone(item.matched), originDurability: durability(item.origin) })),
    closed: [] };
}
/** PC owners entitled to a content-free change ping. */
function audience(room) {
  const stored = ledger(room.gameState);
  if (!stored) {return [];}
  return [...new Set([...stored.listeners.map(item => item.source), ...Object.values(stored.obligations).map(item => item.listener.source)].filter(ref => ref.kind === 'character').map(ref => ref.ownerUid))];
}
module.exports = { CAPABILITY, DISMISS_REASON, MAX_LISTENERS, MAX_OPEN, MAX_CLOSED, EVIDENCE, ledger, eligibility, occurrenceOf, record, planRegister, planRevoke, validateDismiss, stageDismiss, isReceipt, project, audience };
