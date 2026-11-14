/** Shared trigger foundation v1 (handoff/shared-trigger-foundation/CONTRACT.md): committed occurrences of
 * binder-approved single-target immediate damage/healing, GM-registered DIAGNOSTIC listeners and durable pending
 * obligations, all staged in the same P7 snapshot as the originating receipt. Executes nothing: no HP, resource,
 * condition, payment or approval is ever produced here. */
const crypto = require('crypto');
const actors = require('./actorConsequences');
const { fail, hash, clone, own, keys } = actors;
const CAPABILITY = 'committed-trigger-diagnostic:v1';
const FOLLOWUP_MODE = 'follow-up';
/** D1 = (a) (creator approval 14 November 2026; first slice): a GM pairing of a watched part of an ORIGINATING definition with one existing
 * follow-up. Its own listener mode, so a previous server never reads it as a whole-spell follow-up pairing (that server ignores
 * the mode for offers and refuses its offers by shape). Offers it creates are ordinary follow-up offers whose listener snapshot also
 * names the watch. Nothing here runs if the creator policy is ever unset. One pairing per source is a temporary first-slice limit. */
const COMPONENT_MODE = 'component-follow-up';
const EXECUTABLE_MODES = Object.freeze([FOLLOWUP_MODE, COMPONENT_MODE]);
const executableMode = mode => EXECUTABLE_MODES.includes(mode);
const componentScope = require('../shared/services/componentScopePolicy');
const FOLLOWUP_CAPABILITY = 'committed-trigger-followup:v1';
const FOLLOWUP_POLICY = Object.freeze({ procedure: 'exact-offer-ordinary-cast', creatorApproval: Object.freeze({ reference: 'handoff/first-playable-trigger/CREATOR_APPROVAL.md#creator-approval-10-november-2026', date: '2026-11-10', scope: 'T1-T6' }),
  request: 'handoff/first-playable-trigger/CREATOR_APPROVAL.md' });
/** Second approved follow-up (creator approval H1-H3, H2 = b, 13 November 2026): after the primary owner PC's
 * immediate healing actually restores HP to a creature or to another primary player character. T2-T6 are unchanged. */
const HEALING_FOLLOWUP_POLICY = Object.freeze({ procedure: 'exact-offer-ordinary-cast', creatorApproval: Object.freeze({ reference: 'handoff/unified-component-trigger-execution-successor/CREATOR_APPROVAL.md#creator-approval-13-november-2026', date: '2026-11-13', scope: 'H1-H3' }),
  request: 'handoff/next-playable-trigger-decision-ready/CREATOR_CARD.md' });
/** The creator approval each plan subscription must cite. A subscription this table does not name is never lowered. */
const FOLLOWUP_APPROVALS = Object.freeze({ 'follow-up-after-damage': FOLLOWUP_POLICY, 'follow-up-after-healing': HEALING_FOLLOWUP_POLICY });
const LAPSE_CAPABILITY = 'authenticated-source-next-turn:v1';
const LAPSE_KEYS = ['capability', 'clockId', 'startSequence', 'dueSequence', 'rosterHash'];
const MAX_LISTENERS = 32, MAX_OPEN = 64, MAX_CLOSED = 256, MAX_REQUESTS = 256; // engineering limits, never game rules
const EVIDENCE = { 'immediate-damage': ['committed', 'adjudicatedAmount', 'baseHpLost', 'tempHpAbsorbed'], 'immediate-healing': ['committed', 'adjudicatedAmount', 'hpRestored'] };
const DISMISS_REASON = 'Diagnostic trigger obligation dismissed by the GM. Nothing was applied, paid or executed.';
const FOLLOWUP_DISMISS_REASON = 'Trigger offer closed by the GM. Nothing was applied, paid or executed.';
const FOLLOWUP_EXPIRED_REASON = 'Trigger offer lapsed at the source\'s authenticated turn start. Nothing was applied, paid or executed.';
const FOLLOWUP_ROSTER_REASON = 'Trigger offer closed because the combat roster changed; the recorded next-turn lapse can no longer be honoured. Nothing was applied, paid or executed.';
const FOLLOWUP_TARGET_REASON = 'Trigger offer closed because its recorded target no longer exists as the same exact incarnation. Nothing was applied, paid or executed.';
const OFFER_KEYS = ['obligationId', 'state', 'mode', 'occurrence', 'listener', 'matched', 'origin', 'lapse'];
const OFFER_LISTENER_KEYS = ['listenerId', 'source', 'definitionRef', 'on', 'gmUid'];
const WATCH_KEYS = ['definitionRef', 'componentId'];
function followUpAvailable() {
  const approval = FOLLOWUP_POLICY.creatorApproval;
  return !!(approval && typeof approval.reference === 'string' && approval.reference.trim());
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const amount = value => Number.isSafeInteger(value) && value >= 0;
/** Common execution representation (handoff/unified-component-trigger-execution/CONTRACT.md). The follow-up route is
 * lowered from the plan of the listener's exact admitted definition: predicate, source/target kinds, chaining, lapse
 * and response procedure are read from that plan, never restated here. A plan is a description; every authority
 * check below (admission, registration, eligibility, offer, approval, payment) still decides on its own. */
const plans = require('../shared/services/executionPlan');
/** { plan, subscription } for one definition ref in this room, or null when it is not admitted or has no valid plan. */
function planFor(room, definitionRef) {
  try {
    const pure = require('../shared/services/authoredAbility'), id = pure.actionId(definitionRef);
    const entry = require('./installedAuthoredAbilities').list(room).entries.find(item => pure.actionId(item.definitionRef) === id);
    if (!entry || entry.revoked) {return null;}
    const plan = plans.planFromDefinition(entry.canonicalDefinition, { pairing: true });
    plans.validatePlan(plan); // never lower a plan this runtime has not validated itself
    const subscription = plans.subscriptionOf(plan);
    const policy = subscription && own(FOLLOWUP_APPROVALS, subscription.subscriptionId) ? FOLLOWUP_APPROVALS[subscription.subscriptionId] : null;
    if (!policy || subscription.response.procedure !== policy.procedure || subscription.lifetime.lapse !== LAPSE_CAPABILITY ||
        subscription.authority.reference !== policy.creatorApproval.reference) {return null;}
    return { plan, subscription };
  } catch (_) { return null; }
}
/** True when a stored follow-up listener is exactly the plan's subscription for its source. */
const subscribed = (subscription, listener) => hash(listener.on) === hash(subscription.on) && subscription.sourceKinds.includes(listener.source?.kind);
/** One binding rule for approval and for the descriptive ladder: the stored listener is still the exact pairing the
 * offer (or any other snapshot of it) recorded - same registrar, same source incarnation, same definition, same event. */
const sameBinding = (listener, snapshot) => !!listener && !!snapshot && listener.gmUid === snapshot.gmUid && hash(listener.source) === hash(snapshot.source) &&
  hash(listener.definitionRef) === hash(snapshot.definitionRef) && hash(listener.on) === hash(snapshot.on) &&
  hash(listener.watch === undefined ? null : listener.watch) === hash(snapshot.watch === undefined ? null : snapshot.watch);
/** The watch of an ORIGINATING definition (its admitted plan's one watch), or null. Same lookup rules as planFor. */
function watchPlanFor(room, definitionRef) {
  try {
    const pure = require('../shared/services/authoredAbility'), id = pure.actionId(definitionRef);
    const entry = require('./installedAuthoredAbilities').list(room).entries.find(item => pure.actionId(item.definitionRef) === id);
    if (!entry || entry.revoked) {return null;}
    const plan = plans.planFromDefinition(entry.canonicalDefinition, { pairing: true });
    plans.validatePlan(plan);
    const watch = plans.watchOf(plan);
    return watch ? { plan, watch, entry } : null;
  } catch (_) { return null; }
}
/** One rule for registration, offer creation, approval and the descriptive ladder: the creator policy is set, the watched
 * definition is admitted and unrevoked for this exact source, its plan still watches exactly this part, and the follow-up is a
 * separate definition. A code, or null when the watch is usable now. */
function watchRefusal(room, listener) {
  if (listener.mode !== COMPONENT_MODE) {return listener.watch === undefined ? null : 'trigger_offer_invalid';}
  if (!componentScope.approved()) {return 'component_scope_unapproved';}
  const w = listener.watch;
  if (!isPlain(w) || Object.keys(w).sort().join('|') !== WATCH_KEYS.slice().sort().join('|') || typeof w.componentId !== 'string') {return 'invalid_trigger_listener';}
  const pure = require('../shared/services/authoredAbility');
  if (pure.actionId(w.definitionRef) === pure.actionId(listener.definitionRef)) {return 'trigger_watch_self';}
  const watched = watchPlanFor(room, w.definitionRef);
  if (!watched) {
    const entry = require('./installedAuthoredAbilities').list(room).entries.find(item => pure.actionId(item.definitionRef) === pure.actionId(w.definitionRef));
    return !entry ? 'definition_not_admitted' : entry.revoked ? 'definition_revoked' : 'trigger_watch_unavailable';
  }
  if (watched.watch.componentId !== w.componentId || hash(watched.watch.on) !== hash(listener.on)) {return 'trigger_watch_mismatch';}
  const state = eligibility(room, Object.assign({}, listener, { definitionRef: w.definitionRef }));
  return state.ok ? null : state.code;
}
/** The plan's recipient rule, with the one room fact it needs: whether a character recipient is a primary PC. */
function targetQualifies(room, subscription, occurrence) {
  let targetPrimary = false;
  if (occurrence.target?.kind === 'character') {
    try { targetPrimary = actors.locate(room, occurrence.target).contract.primary === true; } catch (_) { targetPrimary = false; }
  }
  return plans.targetQualifies(subscription, occurrence, { targetPrimary });
}
/** The source of a primary-only subscription must be the owner's primary token. Null when it is; a refusal otherwise. */
function primaryRefusal(room, subscription, source) {
  if (!subscription.primarySourceOnly) {return null;}
  let contract = null;
  try { contract = actors.locate(room, source, true, true).contract; } catch (_) { return null; } // an unlocatable source is eligibility's refusal, not this rule's
  return contract.primary === true ? null : { code: 'secondary_attachment',
    message: 'A follow-up binds the primary token of an owner PC; this token is a secondary attachment. Nothing changed.' };
}

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
/** D1 = (a): the committed result of ONE part - the direct damage part - of a binder-approved A10 bundle whose
 * admitted definition carries a watch on that part, or null. It is read from the bundle binder's own direct-part arithmetic
 * (spellPayments.directPartResult) and must equal the pool the binder pinned. The condition part and the save are not results
 * here: the save is a resolution gate (recorded as provenance), the condition changes no HP. Whole-spell listeners never see it. */
function componentOccurrenceOf(room, receipt, command, approved, binder, entries) {
  if (!approved || binder !== require('./spellPayments')) {return null;}
  const approval = approved.approval, pure = require('../shared/services/authoredAbility'), effect = require('../shared/services/authoredEffect');
  if (!effect.isEffect(approval) || approval.effectTerms?.direct?.kind !== 'damage' || !approval.target || approval.source?.kind !== 'character') {return null;}
  const admitted = require('./installedAuthoredAbilities').list(room).entries.find(item => pure.actionId(item.definitionRef) === approval.spell.definitionId);
  const watch = admitted?.canonicalDefinition?.componentWatch;
  if (!admitted || watch === undefined || approval.spell.definitionHash !== `${admitted.descriptor.capabilityId}/${admitted.definitionRef.definitionHash}`) {return null;}
  const entry = entries.find(item => hash(item.ref) === hash(approval.target));
  if (!entry || !entry.finalResources || !entry.finalResources.hp) {return null;}
  const before = actors.resources(actors.locate(room, approval.target).token, approval.target.kind).hp, after = entry.finalResources.hp;
  const adjudicatedAmount = command.adjudication?.finalAmount;
  const part = require('./spellPayments').directPartResult(before, 'damage', adjudicatedAmount);
  if (hash(part.final) !== hash({ current: after.current, temp: after.temp })) {fail('trigger_evidence_inconsistent', 'The committed pools do not match the approved direct damage part. Nothing changed.');}
  const evidence = { proposedTotal: approval.roll?.total, adjudicatedAmount, baseHpLost: part.baseHpLost, tempHpAbsorbed: part.tempHpAbsorbed };
  if (!Object.values(evidence).every(amount)) {fail('trigger_evidence_inconsistent', 'The committed pools do not match the approved direct damage part. Nothing changed.');}
  let branch = null;
  if (effect.saveOf(approval.effectTerms)) { try { branch = JSON.parse(command.adjudication.chosenResult).branch || null; } catch (_) { branch = null; } }
  const component = { definitionRef: clone(admitted.definitionRef), componentId: watch.componentId, wizardKey: watch.wizardKey,
    gates: { save: effect.saveOf(approval.effectTerms) ? { recorded: branch, appliesTo: 'effects:condition' } : null } };
  return { occurrenceId: hash(['committed-component-occurrence:v1', room.id, receipt.submitterUid, receipt.commandId, receipt.commitSequence, 'immediate-damage', approval.target, watch.componentId]),
    kind: 'immediate-damage', source: clone(approval.source), target: clone(approval.target), evidence, cause: { definitionId: approval.spell.definitionId }, component };
}
const isPlain = value => !!value && typeof value === 'object' && !Array.isArray(value) &&
  [Object.prototype, null].includes(Object.getPrototypeOf(value));
const timing = require('../shared/services/sharedEffectTiming');
const orderedRosterHash = combat => hash((combat?.turnOrder || []).map(entry => entry.actorRef));
/** T4: the source's strictly next authenticated turn start, snapshotted with clock and ordered roster identity. */
function lapseFor(room, listener) {
  try {
    const combat = require('./sharedEffectLifecycle').roster(room), clock = timing.clock(combat);
    if (!clock) {return null;}
    const index = combat.turnOrder.findIndex(entry => hash(entry.actorRef) === hash(listener.source));
    if (index < 0) {return null;}
    const period = combat.turnOrder.length;
    const distance = (index - combat.currentTurnIndex + period) % period || period;
    const dueSequence = clock.sequence + distance;
    if (!Number.isSafeInteger(dueSequence) || dueSequence <= clock.sequence) {return null;}
    return { capability: LAPSE_CAPABILITY, clockId: clock.id, startSequence: clock.sequence, dueSequence,
      rosterHash: orderedRosterHash(combat) };
  } catch (_) { return null; }
}
function validateLapse(lapse) {
  if (!isPlain(lapse) || Object.keys(lapse).some(key => !LAPSE_KEYS.includes(key)) || lapse.capability !== LAPSE_CAPABILITY ||
      !UUID.test(lapse.clockId || '') || !amount(lapse.startSequence) || !amount(lapse.dueSequence) ||
      lapse.dueSequence <= lapse.startSequence || !/^[0-9a-f]{64}$/.test(lapse.rosterHash || '')) {
    fail('trigger_offer_invalid', 'The named offer is not a supported time-bound executable offer shape. Nothing changed.');
  }
}
/** Read-only effective lapse. The installed clock is authoritative; a missing/changed clock or roster is unusable.
 * There is no approved manual-lapse fallback: an executable offer must carry a valid authenticated lapse. */
function lapseState(room, offer) {
  if (offer.lapse === undefined) {return { ok: false, code: 'trigger_offer_invalid' };}
  try { validateLapse(offer.lapse); } catch (_) { return { ok: false, code: 'trigger_offer_invalid' }; }
  const combat = room.gameState?.combat, clock = timing.clock(combat);
  if (!clock || clock.id !== offer.lapse.clockId || clock.sequence < offer.lapse.startSequence) {
    return { ok: false, code: 'trigger_offer_clock_unavailable' };
  }
  if (orderedRosterHash(combat) !== offer.lapse.rosterHash ||
      !(combat.turnOrder || []).some(entry => hash(entry.actorRef) === hash(offer.listener?.source))) {
    return { ok: false, code: 'trigger_offer_clock_unavailable' };
  }
  if (clock.sequence >= offer.lapse.dueSequence) {return { ok: false, code: 'trigger_offer_expired' };}
  return { ok: true, clock };
}
function validateOffer(room, offer) {
  if (!isPlain(offer) || !isPlain(offer.listener) || !isPlain(offer.origin) || !isPlain(offer.matched) ||
      Object.keys(offer).some(key => !OFFER_KEYS.includes(key)) || Object.keys(offer.listener).some(key => !OFFER_LISTENER_KEYS.concat(['watch']).includes(key)) ||
      !/^[0-9a-f]{64}$/.test(offer.obligationId || '') || offer.state !== 'pending-offer' || offer.mode !== FOLLOWUP_MODE ||
      !UUID.test(offer.listener.listenerId || '') || typeof offer.listener.gmUid !== 'string' || !offer.listener.gmUid ||
      typeof offer.origin.submitterUid !== 'string' || !offer.origin.submitterUid || !UUID.test(offer.origin.commandId || '') || !amount(offer.origin.commitSequence)) {
    fail('trigger_offer_invalid', 'The named offer is not a supported executable offer shape. Nothing changed.');
  }
  if (offer.lapse === undefined) {fail('trigger_offer_invalid', 'The named offer has no authenticated lapse. Nothing changed.');}
  try {
    validateOn(offer.listener.on);
    actors.validateRef(offer.listener.source);
    validateDefinitionRef(room, offer.listener.definitionRef);
    validateLapse(offer.lapse);
    if (offer.listener.watch !== undefined) {
      keys(offer.listener.watch, WATCH_KEYS); validateDefinitionRef(room, offer.listener.watch.definitionRef);
      if (!plain(offer.occurrence) || !plain(offer.occurrence.component) || hash(offer.occurrence.component.definitionRef) !== hash(offer.listener.watch.definitionRef) ||
          offer.occurrence.component.componentId !== offer.listener.watch.componentId) {fail('trigger_offer_invalid');}
    }
  } catch (_) { fail('trigger_offer_invalid', 'The named offer is not a supported executable offer shape. Nothing changed.'); }
}
const plain = value => !!value && typeof value === 'object' && !Array.isArray(value);
/** Exact-source executable pairing lookup. Diagnostic listeners are intentionally independent. */
function followUpListeners(stored, source) {
  return (stored?.listeners || []).filter(item => executableMode(item.mode) && hash(item.source) === hash(source));
}
/** Persisted multiple-pairing states: never choose a winner; report every conflicting source. */
function registrationConflicts(stored) {
  const groups = new Map();
  for (const item of stored?.listeners || []) {
    if (!executableMode(item.mode)) {continue;}
    const key = hash(item.source);
    if (!groups.has(key)) {groups.set(key, { source: clone(item.source), listenerIds: [] });}
    groups.get(key).listenerIds.push(item.listenerId);
  }
  return [...groups.values()].filter(group => group.listenerIds.length > 1);
}
function checkOfferApproval(room, approval) {
  if (approval?.triggerOfferId === undefined) {return null;}
  if (!followUpAvailable()) {fail('trigger_followup_unavailable', 'Follow-up offers are unavailable in this runtime. Nothing was consumed or executed.');}
  if (typeof approval.triggerOfferId !== 'string' || !/^[0-9a-f]{64}$/.test(approval.triggerOfferId)) {fail('invalid_spell_approval');}
  const stored = ledger(room.gameState);
  if (!stored) {fail('trigger_offer_not_open', 'The named offer is not open in this room. Nothing changed.');}
  const offer = own(stored.obligations, approval.triggerOfferId) ? stored.obligations[approval.triggerOfferId] : null;
  if (!offer) {
    const closed = stored.closed.find(item => item.obligationId === approval.triggerOfferId);
    fail(closed?.state === 'consumed' ? 'trigger_offer_consumed' : closed?.state === 'expired' ? 'trigger_offer_expired' : 'trigger_offer_not_open',
      'The named offer is not open in this room. Nothing changed.');
  }
  validateOffer(room, offer);
  if (offer.obligationId !== approval.triggerOfferId) {fail('trigger_offer_not_open', 'The named offer is not open in this room. Nothing changed.');}
  const listener = stored.listeners.find(item => item.listenerId === offer.listener.listenerId);
  if (!listener || !executableMode(listener.mode) || (listener.mode === COMPONENT_MODE) !== (offer.listener.watch !== undefined)) {fail('trigger_offer_listener_unavailable', 'The listener that produced this offer is no longer registered. Nothing changed.');}
  if (!sameBinding(listener, offer.listener)) {
    fail('trigger_offer_binding_changed', 'The listener binding changed after this offer was recorded. Nothing changed.');
  }
  const state = eligibility(room, listener);
  if (!state.ok) {fail(state.code, 'The listener that produced this offer is not eligible now. Nothing changed.');}
  const watchCode = watchRefusal(room, listener);
  if (watchCode) {fail(watchCode === 'component_scope_unapproved' ? watchCode : 'trigger_offer_binding_changed', 'The watched part behind this offer is not usable now. Nothing was consumed or executed.');}
  const planned = planFor(room, listener.definitionRef);
  if (!planned || !subscribed(planned.subscription, listener)) {fail('trigger_offer_binding_changed', 'The listener binding is not the execution plan of its admitted definition. Nothing changed.');}
  const lapse = lapseState(room, offer);
  if (!lapse.ok) {
    fail(lapse.code, lapse.code === 'trigger_offer_expired'
      ? 'The offer lapsed at the source\'s authenticated turn start. Nothing was consumed or executed as an ordinary cast.'
      : lapse.code === 'trigger_offer_invalid'
        ? 'The named offer has no valid authenticated lapse. Nothing changed.'
        : 'The authenticated clock or roster behind this offer is no longer installed. Nothing changed.');
  }
  if (approval.roomId !== room.id || !planned.subscription.sourceKinds.includes(approval.source?.kind) || hash(approval.source) !== hash(listener.source)) {
    fail('trigger_offer_binding_mismatch', 'The approval source is not the offer source. Nothing changed.');
  }
  const pure = require('../shared/services/authoredAbility');
  const entry = require('./installedAuthoredAbilities').list(room).entries.find(item => pure.actionId(item.definitionRef) === pure.actionId(listener.definitionRef));
  if (!entry) {fail('definition_not_admitted');}
  if (approval.spell?.definitionId !== pure.actionId(listener.definitionRef) ||
      approval.spell?.definitionHash !== `${entry.descriptor.capabilityId}/${entry.definitionRef.definitionHash}`) {
    fail('trigger_offer_binding_mismatch', 'The approved ability is not the offer definition. Nothing changed.');
  }
  if (!amount(approval.baseCommitSequence) || approval.baseCommitSequence < offer.origin.commitSequence) {
    fail('trigger_offer_stale', 'The approval predates the offer origin. Nothing changed.');
  }
  return { offer: clone(offer), listener: clone(listener) };
}
function consumeOffer(room, next, receipt, approved) {
  const { offer } = checkOfferApproval({ ...room, gameState: next }, approved.approval);
  const stored = ledger(next), remaining = clone(stored.obligations);
  delete remaining[offer.obligationId];
  next.triggerLedger = { ...clone(stored), revision: stored.revision + 1, obligations: remaining,
    closed: [...clone(stored.closed), { obligationId: offer.obligationId, state: 'consumed', listenerId: offer.listener.listenerId, origin: clone(offer.origin),
      submitterUid: receipt.submitterUid, commandId: receipt.commandId, commitSequence: receipt.commitSequence,
      approvalId: approved.approval.approvalId, approvalHash: approved.contentHash }].slice(-MAX_CLOSED) };
  receipt.triggerOfferId = offer.obligationId;
}
/** T4 cleanup: a read guard already blocks use; this persists the expiry closure at the next successful stage. */
function sweepExpired(room, next) {
  const stored = ledger(next);
  if (!stored) {return;}
  const view = { ...room, gameState: next }, remaining = clone(stored.obligations), closures = [];
  for (const [obligationId, offer] of Object.entries(remaining)) {
    if (!isPlain(offer) || offer.mode !== FOLLOWUP_MODE || !isPlain(offer.listener)) {continue;}
    let state;
    try { state = lapseState(view, offer); } catch (_) { continue; }
    if (state.ok || state.code !== 'trigger_offer_expired') {continue;}
    delete remaining[obligationId];
    closures.push({ obligationId, state: 'expired', listenerId: offer.listener.listenerId, origin: clone(offer.origin),
      clockId: offer.lapse.clockId, dueSequence: offer.lapse.dueSequence });
  }
  if (!closures.length) {return;}
  next.triggerLedger = { ...clone(stored), revision: stored.revision + 1, obligations: remaining,
    closed: [...clone(stored.closed), ...closures].slice(-MAX_CLOSED) };
}
/** Roster change: close every executable offer the new geometry or a removed exact target makes unusable. */
function closeForRoster(room, next, reason = FOLLOWUP_ROSTER_REASON) {
  const stored = ledger(next);
  if (!stored) {return [];}
  const view = { ...room, gameState: next };
  const live = timing.clock(next.combat);
  const remaining = clone(stored.obligations), closures = [];
  for (const [obligationId, offer] of Object.entries(remaining)) {
    if (!isPlain(offer) || offer.mode !== FOLLOWUP_MODE) {continue;}
    let state;
    try { state = lapseState(view, offer); } catch (_) { continue; }
    let targetMissing = false;
    if (offer.occurrence?.target) {
      try { actors.locate(view, offer.occurrence.target); } catch (_) { targetMissing = true; }
    }
    if (!targetMissing && (state.ok || state.code !== 'trigger_offer_clock_unavailable')) {continue;}
    delete remaining[obligationId];
    closures.push({ obligationId, state: targetMissing ? 'target-missing' : 'roster-changed',
      listenerId: offer.listener?.listenerId ?? null, origin: clone(offer.origin),
      clockId: offer.lapse?.clockId ?? null, dueSequence: offer.lapse?.dueSequence ?? null,
      liveClockId: live?.id ?? null, liveSequence: live?.sequence ?? null,
      reason: targetMissing ? FOLLOWUP_TARGET_REASON : reason });
  }
  if (!closures.length) {return [];}
  next.triggerLedger = { ...clone(stored), revision: stored.revision + 1,
    obligations: remaining,
    closed: [...clone(stored.closed), ...closures].slice(-MAX_CLOSED) };
  return closures;
}
/** finishStage hook. Mutates only `next.triggerLedger`, and only when a listener or named offer is involved. */
function record(room, next, receipt, command, approved, binder, entries) {
  sweepExpired(room, next);
  if (approved && binder === require('./spellPayments') && approved.approval.triggerOfferId !== undefined) {consumeOffer(room, next, receipt, approved);}
  const stored = ledger(next);
  if (!stored || !stored.listeners.length) {return;}
  const occurrence = occurrenceOf(room, receipt, command, approved, binder, entries) || componentOccurrenceOf(room, receipt, command, approved, binder, entries);
  if (!occurrence) {return;}
  const view = { ...room, gameState: next }, pure = require('../shared/services/authoredAbility'), added = {};
  // T4/F2: a persisted multiple-pairing state never selects a winner and never produces executable offers.
  const conflicted = new Set(registrationConflicts(stored).map(group => hash(group.source)));
  // T5: an offer-bound response and ordinary casts of a currently bound follow-up pair create no executable child.
  const suppressed = approved?.approval?.triggerOfferId !== undefined ||
    stored.listeners.some(item => executableMode(item.mode) && hash(item.source) === hash(occurrence.source) &&
      pure.actionId(item.definitionRef) === occurrence.cause.definitionId);
  for (const listener of [...stored.listeners].sort((a, b) => a.listenerId.localeCompare(b.listenerId))) {
    if (listener.on.occurrence !== occurrence.kind || hash(listener.source) !== hash(occurrence[listener.on.role])) {continue;}
    if (pure.actionId(listener.definitionRef) === occurrence.cause.definitionId) {continue;} // self-generated exclusion
    // Scope separation: a part occurrence is read only by a watch of exactly that part of exactly that admitted definition;
    // whole-spell and diagnostic listeners never read it, and a watch never reads a whole-cast occurrence.
    if ((listener.mode === COMPONENT_MODE) !== (occurrence.component !== undefined)) {continue;}
    if (occurrence.component && (hash(listener.watch?.definitionRef) !== hash(occurrence.component.definitionRef) || listener.watch?.componentId !== occurrence.component.componentId)) {continue;}
    const value = listener.on.evidence === 'committed' ? null : occurrence.evidence[listener.on.evidence];
    if (value !== null && value < 1) {continue;}
    if (!eligibility(view, listener).ok) {continue;}
    const obligationId = hash(['trigger-obligation:v1', occurrence.occurrenceId, listener.listenerId]);
    if (own(stored.obligations, obligationId) || stored.closed.some(item => item.obligationId === obligationId)) {fail('trigger_obligation_conflict');}
    const executable = executableMode(listener.mode);
    // The executable branch is lowered from the plan: no plan, no subscription match or an unapproved scope means no offer.
    const planned = executable ? planFor(view, listener.definitionRef) : null, subscription = planned?.subscription;
    if (listener.mode === COMPONENT_MODE && (watchRefusal(view, listener) || subscription?.subscriptionId !== 'follow-up-after-damage')) {continue;}
    if (executable && (!followUpAvailable() || !subscription || !subscribed(subscription, listener) || !plans.matches(subscription, occurrence) ||
        !targetQualifies(view, subscription, occurrence) || (subscription.chain === 'none' && suppressed) || conflicted.has(hash(listener.source)))) {continue;}
    const lapse = executable ? lapseFor(view, listener) : null;
    // Approved T4: no authenticated source-next-turn lapse means no executable offer. The parent cast still commits.
    if (executable && !lapse) {continue;}
    added[obligationId] = { obligationId, state: executable ? 'pending-offer' : 'pending-diagnostic', mode: executable ? FOLLOWUP_MODE : 'diagnostic', occurrence: clone(occurrence),
      listener: { listenerId: listener.listenerId, source: clone(listener.source), definitionRef: clone(listener.definitionRef), on: clone(listener.on), ...(executable ? { gmUid: listener.gmUid } : {}),
        ...(listener.watch !== undefined ? { watch: clone(listener.watch) } : {}) },
      matched: { role: listener.on.role, evidence: listener.on.evidence, value },
      origin: { submitterUid: receipt.submitterUid, commandId: receipt.commandId, commitSequence: receipt.commitSequence },
      ...(lapse ? { lapse } : {}) };
  }
  const count = Object.keys(added).length;
  if (!count) {return;}
  const current = ledger(next), open = Object.keys(current.obligations).length;
  if (open + count > MAX_OPEN) {
    fail('trigger_obligation_capacity', `This consequence would record ${count} trigger obligation(s) but ${open} are already waiting (limit ${MAX_OPEN}). Dismiss waiting obligations or revoke listeners, then confirm again. Nothing changed.`);
  }
  next.triggerLedger = { ...clone(current), revision: current.revision + 1, obligations: { ...clone(current.obligations), ...added } };
}
/** Read-only authority ladder for one registered follow-up listener (and optionally one named offer).
 * admitted: exact definition admitted and unrevoked. activated: an explicit GM registration by the current GM for the
 * exact current source incarnation. subscribed: the listener is the plan's subscription, its source is the primary
 * token the plan requires and no second pairing competes for that source. permitted: the named offer is open, is this
 * listener's own obligation, still records this exact binding and is inside its authenticated lapse.
 * It is DESCRIPTIVE ONLY. It uses the same binding (sameBinding), the same obligation identity and the same lapse the
 * binder uses, so it cannot report more than approval would allow, but nothing reads it to decide anything: every
 * binder check (registration, record, checkOfferApproval, payment) still decides on its own. Never mutates. */
function authorityOf(room, listenerId, offerId) {
  const stored = ledger(room.gameState), rungs = plans.AUTHORITY_LADDER;
  const at = (reached, code) => ({ reached, rung: reached ? rungs[reached - 1] : null, code: code || null });
  const listener = stored?.listeners.find(item => item.listenerId === listenerId);
  if (!listener || !executableMode(listener.mode)) {return at(0, 'trigger_listener_not_found');}
  const pure = require('../shared/services/authoredAbility');
  const entry = require('./installedAuthoredAbilities').list(room).entries.find(item => pure.actionId(item.definitionRef) === pure.actionId(listener.definitionRef));
  if (!entry) {return at(0, 'definition_not_admitted');}
  if (entry.revoked) {return at(0, 'definition_revoked');}
  const state = eligibility(room, listener);
  if (!state.ok) {return at(1, state.code);}
  if (!followUpAvailable()) {return at(1, 'trigger_followup_unavailable');}
  const planned = planFor(room, listener.definitionRef);
  if (!planned) {return at(2, 'trigger_plan_unavailable');}
  if (!subscribed(planned.subscription, listener)) {return at(2, 'trigger_subscription_mismatch');}
  const watchCode = watchRefusal(room, listener);
  if (watchCode) {return at(2, watchCode);}
  const secondary = primaryRefusal(room, planned.subscription, listener.source);
  if (secondary) {return at(2, secondary.code);}
  // Only a genuine stored conflict (more than one follow-up pairing for this exact source) is a pairing conflict.
  if (registrationConflicts(stored).some(group => group.listenerIds.includes(listenerId))) {return at(2, 'trigger_followup_pairing_conflict');}
  if (offerId === undefined) {return at(3);}
  if (typeof offerId !== 'string' || !/^[0-9a-f]{64}$/.test(offerId)) {return at(3, 'trigger_offer_invalid');}
  const offer = own(stored.obligations, offerId) ? stored.obligations[offerId] : null;
  if (!offer) {
    const closed = stored.closed.find(item => item.obligationId === offerId);
    return at(3, closed?.state === 'consumed' ? 'trigger_offer_consumed' : closed?.state === 'expired' ? 'trigger_offer_expired' : 'trigger_offer_not_open');
  }
  try { validateOffer(room, offer); } catch (error) { return at(3, error.code || 'trigger_offer_invalid'); }
  if (offer.obligationId !== offerId || offer.listener.listenerId !== listenerId) {return at(3, 'trigger_offer_not_open');}
  if (!sameBinding(listener, offer.listener)) {return at(3, 'trigger_offer_binding_changed');}
  const lapse = lapseState(room, offer);
  return lapse.ok ? at(4) : at(3, lapse.code);
}
function requestOf(stored, requestId, requestHash) {
  const prior = stored?.requests.find(item => item.requestId === requestId);
  if (prior && prior.requestHash !== requestHash) {fail('REQUEST_ID_CONFLICT');}
  return prior || null;
}
function validateRegister(room, data) {
  keys(data, ['roomId', 'requestId', 'expectedRevision', 'source', 'definitionRef', 'on', 'mode', 'watch']);
  if (data.roomId !== room.id || !UUID.test(data.requestId || '') || !amount(data.expectedRevision) || actors.bytes(data) > 8192) {fail('invalid_trigger_listener');}
  actors.validateRef(data.source); validateDefinitionRef(room, data.definitionRef); validateOn(data.on);
  if (data.mode !== undefined && data.mode !== FOLLOWUP_MODE && data.mode !== COMPONENT_MODE) {fail('unsupported_trigger_mode', 'Only an omitted mode (diagnostic) or follow-up is supported. Nothing changed.');}
  if ((data.mode === COMPONENT_MODE) !== (data.watch !== undefined)) {fail('invalid_trigger_listener', 'A watched-part pairing names exactly one watched part; other pairings name none. Nothing changed.');}
  if (data.mode === COMPONENT_MODE) {
    if (!componentScope.approved()) {fail('component_scope_unapproved', componentScope.UNAPPROVED_REASON + ' Nothing was registered, offered or executed.');}
    try { keys(data.watch, WATCH_KEYS); validateDefinitionRef(room, data.watch.definitionRef); } catch (_) { fail('invalid_trigger_listener', 'A watched-part pairing names exactly one admitted definition and one of its parts. Nothing changed.'); }
    if (typeof data.watch.componentId !== 'string' || data.watch.componentId.length > 80) {fail('invalid_trigger_listener');}
    if (!followUpAvailable()) {fail('trigger_followup_unavailable', 'Follow-up offers are unavailable in this runtime. Nothing was registered, offered or executed.');}
    if (hash(data.on) !== hash(plans.COMPONENT_WATCH_CONTRACT.on)) {fail('unsupported_trigger_predicate', 'A watched part listens only for base HP that part itself removed. Nothing changed.');}
    if (!plans.COMPONENT_WATCH_CONTRACT.sourceKinds.includes(data.source.kind)) {fail('unsupported_source_route', 'A watched part binds a primary owner PC source. Nothing changed.');}
  }
  if (data.mode === FOLLOWUP_MODE) {
    if (!followUpAvailable()) {fail('trigger_followup_unavailable', 'Follow-up offers are unavailable in this runtime. Nothing was registered, offered or executed.');}
    // Shape only: the event must be one an approved subscription listens for. Whether THIS definition may use it is
    // decided in planRegister from the plan of the admitted definition (its marker selects the event).
    const subscription = plans.subscriptionForPredicate(data.on);
    if (!subscription) {
      fail('unsupported_trigger_predicate', 'A follow-up listens only for its source\'s immediate damage that removes base HP, or its source\'s immediate healing that restores HP. Nothing changed.');
    }
    if (!subscription.sourceKinds.includes(data.source.kind)) {fail('unsupported_source_route', 'A follow-up binds a primary owner PC source. Nothing changed.');}
  }
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
  if (executableMode(data.mode) && followUpListeners(stored, data.source).length) {
    fail('trigger_followup_pairing_exists', 'A follow-up pairing is already registered for this exact source. Revoke that pairing before registering another. In this first slice a character has at most one pairing of either kind (whole-spell or component watch). Diagnostic listeners are independent and remain registered. Nothing changed.');
  }
  if (stored.listeners.length >= MAX_LISTENERS) {fail('trigger_listener_capacity', `At most ${MAX_LISTENERS} diagnostic listeners per room. Revoke one first. Nothing changed.`);}
  const listener = { listenerId: crypto.randomUUID(), mode: executableMode(data.mode) ? data.mode : 'diagnostic', gmUid: uid, source: clone(data.source), definitionRef: clone(data.definitionRef), on: clone(data.on),
    ...(data.watch !== undefined ? { watch: clone(data.watch) } : {}), registeredAtCommit: actors.ledger(room).commitSequence };
  // Follow-up order: the plan's own primary-source rule speaks first (with its own message), then general eligibility,
  // then the marker/event binding, then the plan itself. Diagnostic listeners use eligibility alone.
  const planned = executableMode(data.mode) ? planFor(room, listener.definitionRef) : null;
  if (planned) {
    const secondary = primaryRefusal(room, planned.subscription, listener.source);
    if (secondary) {fail(secondary.code, secondary.message);}
  }
  const check = eligibility(room, listener);
  if (!check.ok) {fail(check.code, 'The listener must bind an admitted, unrevoked definition to its exact current source actor. Nothing changed.');}
  if (data.mode === COMPONENT_MODE) {
    // The follow-up offered by a watch is an existing approved damage follow-up; the watched definition is a different one.
    if (!planned || planned.subscription.subscriptionId !== 'follow-up-after-damage' || !subscribed(planned.subscription, listener)) {
      fail('trigger_plan_unavailable', 'The paired follow-up must be an admitted ability with the approved damage follow-up plan. Nothing changed.');
    }
    const code = watchRefusal(room, listener);
    if (code) {fail(code, code === 'trigger_watch_self' ? 'A spell is never offered as its own follow-up. Pair the watch with a different follow-up spell. Nothing changed.'
      : 'The watched part must be the admitted watch of an admitted, unrevoked definition this source can cast. Nothing changed.');}
  }
  if (data.mode === FOLLOWUP_MODE) {
    if (planned && hash(planned.subscription.on) !== hash(listener.on)) {
      fail('unsupported_trigger_predicate', 'This admitted ability is a follow-up for a different event than the one requested: its authored trigger chooses the event, and an ability without one is a damage follow-up. Nothing changed.');
    }
    if (!planned || !subscribed(planned.subscription, listener)) {fail('trigger_plan_unavailable', 'The admitted definition has no supported execution plan for a follow-up. Nothing changed.');}
  }
  if (stored.listeners.some(item => hash([item.source, item.definitionRef, item.on, item.mode]) === hash([listener.source, listener.definitionRef, listener.on, listener.mode]))) {fail('trigger_listener_exists');}
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
  if (prior) {return { listenerId: prior.listenerId, mode: prior.mode };}
  if (data.expectedRevision !== stored.revision) {fail('REVISION_CONFLICT');}
  const removed = stored.listeners.find(item => item.listenerId === data.listenerId);
  if (!removed) {fail('trigger_listener_not_found');}
  const next = clone(room.gameState);
  // Pending obligations are evidence of committed occurrences: revocation never erases them.
  next.triggerLedger = { ...clone(stored), revision: stored.revision + 1, listeners: clone(stored.listeners.filter(item => item.listenerId !== data.listenerId)),
    requests: [...clone(stored.requests), { requestId: data.requestId, requestHash, op: 'revoke', listenerId: data.listenerId, mode: removed.mode }].slice(-MAX_REQUESTS) };
  return { listenerId: data.listenerId, mode: removed.mode, next };
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
  const executable = obligation.mode === FOLLOWUP_MODE, capability = executable ? FOLLOWUP_CAPABILITY : CAPABILITY;
  const staged = actors.finishStage(room, uid, request, { kind: 'gm', authorizerUid: uid }, confirmedRevision, clone(room.gameState), []);
  staged.receipt.adjudication = { definitionId: capability, definitionVersionOrHash: capability, finalAmount: 0,
    adjustmentReason: executable ? FOLLOWUP_DISMISS_REASON : DISMISS_REASON,
    chosenResult: JSON.stringify({ capability, mode: 'dismiss', obligationId: obligation.obligationId, ...(executable ? { obligationMode: FOLLOWUP_MODE } : {}) }) };
  const post = ledger(staged.next);
  if (!post) {fail('trigger_obligation_not_open', 'This obligation was closed by the staged hook. Nothing changed.');}
  if (!own(post.obligations, obligation.obligationId)) {
    // T4 sweep closed this exact offer in the same stage. Keep that one honest expiry closure; do not append a dismissal.
    const expired = post.closed.find(item => item.obligationId === obligation.obligationId && item.state === 'expired');
    if (!expired) {fail('trigger_obligation_not_open', 'This obligation was closed by the staged hook. Nothing changed.');}
    staged.receipt.adjudication = { definitionId: capability, definitionVersionOrHash: capability, finalAmount: 0,
      adjustmentReason: FOLLOWUP_EXPIRED_REASON,
      chosenResult: JSON.stringify({ capability, mode: 'expired', obligationId: obligation.obligationId, obligationMode: FOLLOWUP_MODE,
        clockId: expired.clockId, dueSequence: expired.dueSequence }) };
    return staged;
  }
  const open = clone(post.obligations); delete open[obligation.obligationId];
  staged.next.triggerLedger = { ...clone(post), revision: post.revision + 1, obligations: open,
    closed: [...clone(post.closed), { obligationId: obligation.obligationId, state: 'dismissed', listenerId: obligation.listener.listenerId, origin: clone(obligation.origin),
      commandId: request.commandId, commitSequence: staged.receipt.commitSequence, reason: request.reason }].slice(-MAX_CLOSED) };
  return staged;
}
const isReceipt = receipt => [CAPABILITY, FOLLOWUP_CAPABILITY].includes(receipt?.adjudication?.definitionVersionOrHash);
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
      closed: clone(stored.closed),
      registrationConflicts: registrationConflicts(stored).map(group => ({ ...group,
        guidance: 'Revoke all but one follow-up pairing for this source. No new executable offers will be created for this source until exactly one pairing remains. An exact offer created before the conflict remains usable by its exact offer ID.' })) };
  }
  // Owner view: only their own bound PC, and only what the matched predicate itself read.
  const mine = ref => {
    if (ref.kind !== 'character' || ref.ownerUid !== viewer.uid) {return false;}
    try { return actors.locate(room, ref).token.ownerUserId === viewer.uid; } catch (_) { return false; }
  };
  const availability = item => {
    const listener = stored.listeners.find(candidate => candidate.listenerId === item.listener.listenerId);
    if (!listener || !executableMode(listener.mode) || !followUpAvailable()) {return { available: false, lapse: 'unavailable' };}
    if (!eligibility(room, listener).ok || watchRefusal(room, listener)) {return { available: false, lapse: 'unavailable' };}
    if (item.lapse === undefined) {return { available: false, lapse: 'invalid' };}
    const state = lapseState(room, item);
    if (state.ok) {return { available: true, lapse: 'pending' };}
    return { available: false, lapse: state.code === 'trigger_offer_expired' ? 'expired' : state.code === 'trigger_offer_invalid' ? 'invalid' : 'clock-unavailable' };
  };
  return { revision: stored.revision,
    listeners: stored.listeners.filter(item => mine(item.source)).map(item => ({ listenerId: item.listenerId, mode: item.mode, source: clone(item.source), on: clone(item.on) })),
    obligations: sorted.filter(item => mine(item.listener.source)).map(item => {
      const state = item.mode === FOLLOWUP_MODE ? availability(item) : null;
      return { obligationId: item.obligationId, state: item.state, mode: item.mode, listenerId: item.listener.listenerId,
        occurrence: item.occurrence.kind, matched: clone(item.matched), originDurability: durability(item.origin),
        ...(state ? { definitionRef: clone(item.listener.definitionRef), available: state.available, lapse: state.lapse,
          ...(item.lapse ? { expiresAtSequence: item.lapse.dueSequence } : {}) } : {}) };
    }),
    closed: [] };
}
function describe(room) {
  const stored = ledger(room.gameState);
  const modes = new Set([...(stored?.listeners || []).map(item => item.mode), ...Object.values(stored?.obligations || {}).map(item => item.mode)]);
  if (!modes.has(FOLLOWUP_MODE) && !modes.has(COMPONENT_MODE)) {return { capability: CAPABILITY, mode: 'diagnostic' };}
  return { capability: FOLLOWUP_CAPABILITY, mode: modes.has('diagnostic') ? 'mixed' : FOLLOWUP_MODE };
}
function obligationMode(room, obligationId) {
  const stored = ledger(room.gameState);
  return stored?.obligations?.[obligationId]?.mode === FOLLOWUP_MODE ? FOLLOWUP_MODE : 'diagnostic';
}
/** PC owners entitled to a content-free change ping. */
function audience(room) {
  const stored = ledger(room.gameState);
  if (!stored) {return [];}
  return [...new Set([...stored.listeners.map(item => item.source), ...Object.values(stored.obligations).map(item => item.listener.source)].filter(ref => ref.kind === 'character').map(ref => ref.ownerUid))];
}
module.exports = { COMPONENT_MODE, executableMode, watchPlanFor, watchRefusal, componentOccurrenceOf, planFor, authorityOf, sameBinding, HEALING_FOLLOWUP_POLICY, FOLLOWUP_APPROVALS, CAPABILITY, DISMISS_REASON, FOLLOWUP_MODE, FOLLOWUP_CAPABILITY, FOLLOWUP_DISMISS_REASON, FOLLOWUP_EXPIRED_REASON, FOLLOWUP_ROSTER_REASON, FOLLOWUP_TARGET_REASON, FOLLOWUP_POLICY, LAPSE_CAPABILITY, followUpAvailable, MAX_LISTENERS, MAX_OPEN, MAX_CLOSED, EVIDENCE,
  ledger, eligibility, occurrenceOf, validateOffer, lapseFor, lapseState, checkOfferApproval, record, closeForRoster, planRegister, planRevoke, validateDismiss, stageDismiss, isReceipt, project, describe, obligationMode, audience };


