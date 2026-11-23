/** One GM-only authoritative combat roster transaction: join or leave one exact actor incarnation. */
const actors = require('./actorConsequences');
const timing = require('../shared/services/sharedEffectTiming');
const lifecycle = require('./sharedEffectLifecycle');
const authoredCooldowns = require('./authoredCooldowns');
const committedTriggers = require('./committedTriggers');

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HEX = /^[a-f0-9]{64}$/;
const DEFINITION = 'combat-roster:v1';
const MAX_BYTES = 8192;
const MAX_REASON = 2000;
const MAX_ROSTER = 64;
const AUDIT_CAP = 16;
const REQUEST_KEYS = ['version', 'roomId', 'commandId', 'actionEpoch', 'baseCommitSequence', 'op', 'combatHash', 'expectedClock', 'target', 'expectedTargetRevision', 'targetState', 'placement', 'entry', 'reason'];
const CLOCK_KEYS = ['id', 'sequence'];
const PLACEMENT_KEYS = { index: ['kind', 'index'], before: ['kind', 'ref'], after: ['kind', 'ref'], end: ['kind'] };
const ENTRY_KEYS = ['initiative', 'd20Roll', 'customInitiative'];

const plain = value => !!value && typeof value === 'object' && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
function assertKeys(value, allowed, code = 'invalid_roster_change') {
  if (!plain(value) || Object.keys(value).some(key => !allowed.includes(key))) {actors.fail(code);}
}
function failWithDetails(code, message, details) {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  throw error;
}
function validateRef(ref, code = 'invalid_roster_change') {
  try { actors.validateRef(ref); } catch (error) { actors.fail(code, error.message); }
}
function validTargetState(value) { return value === undefined || value === 'bound' || value === 'missing'; }

function validate(request) {
  assertKeys(request, REQUEST_KEYS);
  if (request.version !== 1 || typeof request.roomId !== 'string' || !request.roomId ||
      !UUID.test(request.commandId || '') || typeof request.actionEpoch !== 'string' || !request.actionEpoch ||
      !Number.isSafeInteger(request.baseCommitSequence) || request.baseCommitSequence < 0 ||
      !['join', 'leave'].includes(request.op) || !HEX.test(request.combatHash || '') ||
      !validTargetState(request.targetState) || actors.bytes(request) > MAX_BYTES) {actors.fail('invalid_roster_change');}
  validateRef(request.target);
  const targetState = request.targetState ?? 'bound';
  if (targetState === 'bound') {
    if (!Number.isSafeInteger(request.expectedTargetRevision) || request.expectedTargetRevision < 0) {actors.fail('invalid_roster_change');}
  } else if (request.op === 'join' || request.expectedTargetRevision !== null) {actors.fail('invalid_roster_change');}
  if (request.expectedClock !== null) {
    assertKeys(request.expectedClock, CLOCK_KEYS);
    if (!UUID.test(request.expectedClock.id || '') || !Number.isSafeInteger(request.expectedClock.sequence) || request.expectedClock.sequence < 0) {actors.fail('invalid_roster_change');}
  }
  if (request.op === 'join') {
    if (!request.placement) {actors.fail('invalid_roster_change');}
    assertKeys(request.placement, PLACEMENT_KEYS[request.placement.kind] || []);
    if (!Object.prototype.hasOwnProperty.call(PLACEMENT_KEYS, request.placement.kind)) {actors.fail('invalid_roster_change');}
    if (request.placement.kind === 'index') {
      if (!Number.isSafeInteger(request.placement.index) || request.placement.index < 0 || request.placement.index > MAX_ROSTER) {actors.fail('invalid_roster_change');}
    } else if (request.placement.kind === 'before' || request.placement.kind === 'after') {
      validateRef(request.placement.ref);
    }
    if (request.entry !== undefined) {
      assertKeys(request.entry, ENTRY_KEYS);
      if (request.entry.initiative !== undefined && !Number.isFinite(request.entry.initiative)) {actors.fail('invalid_roster_change');}
      if (request.entry.d20Roll !== undefined && (!Number.isSafeInteger(request.entry.d20Roll) || request.entry.d20Roll < 1 || request.entry.d20Roll > 20)) {actors.fail('invalid_roster_change');}
      if (request.entry.customInitiative !== undefined && typeof request.entry.customInitiative !== 'boolean') {actors.fail('invalid_roster_change');}
    }
  } else {
    if (request.placement !== undefined || request.entry !== undefined) {actors.fail('invalid_roster_change');}
    if (targetState === 'missing' && (typeof request.reason !== 'string' || !request.reason.trim())) {actors.fail('invalid_roster_change');}
  }
  if (request.reason !== undefined && (typeof request.reason !== 'string' || request.reason.length > MAX_REASON)) {actors.fail('invalid_roster_change');}
  return { ...request, targetState };
}

function placementIndex(order, placement) {
  if (placement.kind === 'end') { return order.length; }
  if (placement.kind === 'index') {
    if (placement.index > order.length) {actors.fail('placement_invalid');}
    return placement.index;
  }
  const anchor = order.findIndex(entry => actors.hash(entry.actorRef) === actors.hash(placement.ref));
  if (anchor < 0) {actors.fail('placement_invalid');}
  return placement.kind === 'before' ? anchor : anchor + 1;
}

function entryFor(token, target, supplied, room = null) {
  const values = actors.resources(token, target.kind);
  const character = target.kind === 'character' ? token.character || {} : null;
  const stats = character?.stats || token.creature?.stats || token.stats || {};
  const agility = Number.isFinite(stats.agility) ? stats.agility : 10;
  const baseInitiativeMod = Number.isFinite(stats.initiativeMod) ? stats.initiativeMod : Math.floor((agility - 10) / 2);
  const passiveBonus = room && target.kind === 'character' ? require('./passiveActivation').activeInitiativeBonus(room, target) : 0;
  const hasD20 = Number.isSafeInteger(supplied?.d20Roll) && supplied.d20Roll >= 1 && supplied.d20Roll <= 20 && supplied?.customInitiative !== true;
  const hasCustomTotal = supplied?.customInitiative === true || (Number.isFinite(supplied?.initiative) && !hasD20);
  const initiativeMod = hasCustomTotal ? baseInitiativeMod : baseInitiativeMod + passiveBonus;
  const suppliedInit = Number.isFinite(supplied?.initiative) ? supplied.initiative : 0;
  const initiative = hasD20 && passiveBonus !== 0 ? supplied.d20Roll + initiativeMod : suppliedInit;
  const passiveMeta = passiveBonus > 0 ? { passiveApplied: hasD20 } : {};
  const name = (target.kind === 'character' ? character?.name : token.name || token.creature?.name) || token.name || 'Combatant';
  const icon = character?.tokenSettings?.customIcon || character?.lore?.characterImage || token.tokenIcon || token.state?.tokenIcon;
  const border = character?.tokenSettings?.borderColor || token.tokenBorder;
  const creatureId = target.kind === 'character'
    ? (character?.id ? `character_${character.id}` : `character_${target.tokenId}`)
    : (token.creatureId || token.creature?.id || target.tokenId);
  return {
    actorRef: actors.clone(target), tokenId: target.tokenId, creatureId, name,
    initiative,
    d20Roll: Number.isSafeInteger(supplied?.d20Roll) ? supplied.d20Roll : 0,
    agilityMod: initiativeMod, initiativeMod,
    ...passiveMeta,
    ...(icon ? { tokenIcon: icon } : {}), ...(border ? { tokenBorder: border } : {}),
    currentHp: values.hp.current, currentMana: values.mana.current,
    currentActionPoints: values.ap.current, maxActionPoints: values.ap.max,
    isCharacterToken: target.kind === 'character',
    resourceConsequenceStatus: 'applied'
  };
}

function stage(room, player, uid, request, confirmedRevision) {
  const data = validate(request);
  if (data.roomId !== room.id) {actors.fail('invalid_roster_change');}
  if (!player.isGM) {actors.fail('turn_gm_required');}
  const prior = actors.ledger(room);
  if (data.actionEpoch !== actors.epoch(room)) {actors.fail('outcome_unknown');}
  if (data.baseCommitSequence < prior.replayFloor) {actors.fail('retry_window_expired');}
  if (data.baseCommitSequence > prior.commitSequence) {actors.fail('invalid_roster_change');}
  const combat = room.gameState.combat;
  if (!combat?.isActive) {actors.fail('combat_active_required');}
  if (!Array.isArray(combat.turnOrder) || !Number.isInteger(combat.currentTurnIndex)) {actors.fail('turn_state_unavailable');}
  if (actors.hash(combat) !== data.combatHash) {actors.fail('stale_combat_state');}
  const rawClock = combat.effectLifecycle, clock = timing.clock(combat);
  if (rawClock && !clock) {actors.fail('stale_turn_clock');}
  if (clock && (!data.expectedClock || data.expectedClock.id !== clock.id || data.expectedClock.sequence !== clock.sequence)) {actors.fail('stale_turn_clock');}
  if (!rawClock && data.expectedClock !== null) {actors.fail('stale_turn_clock');}

  const next = actors.clone(room.gameState);
  const order = next.combat.turnOrder, targetHash = actors.hash(data.target);
  const targetIndex = order.findIndex(entry => actors.hash(entry.actorRef) === targetHash);
  let beforeIndex = null, afterIndex = null;

  if (data.op === 'join') {
    if (order.length >= MAX_ROSTER) {actors.fail('turn_roster_unbound');}
    if (targetIndex >= 0 || order.some(entry => entry.tokenId === data.target.tokenId)) {actors.fail('actor_already_in_combat');}
    if (data.targetState !== 'bound') {actors.fail('invalid_roster_change');}
    let located;
    try { located = actors.locate(room, data.target); } catch (error) { actors.fail('target_incarnation_missing', error.message); }
    if (located.contract.revision !== data.expectedTargetRevision) {actors.fail('stale_actor_revision');}
    const index = placementIndex(order, data.placement);
    const entry = entryFor(located.token, data.target, data.entry, room);
    order.splice(index, 0, entry);
    next.combat.currentTurnIndex = combat.currentTurnIndex >= index ? combat.currentTurnIndex + 1 : combat.currentTurnIndex;
    afterIndex = index;
  } else {
    if (targetIndex < 0) {actors.fail('actor_not_in_combat');}
    if (order.length <= 1) {actors.fail('replacement_roster_empty');}
    if (targetIndex === combat.currentTurnIndex) {actors.fail('combatant_has_turn');}
    if (data.targetState === 'bound') {
      let located;
      try { located = actors.locate(room, data.target); } catch (error) { actors.fail('target_incarnation_missing', error.message); }
      if (located.contract.revision !== data.expectedTargetRevision) {actors.fail('stale_actor_revision');}
      if (clock) {
        const scheduled = Object.values(clock.schedules || {})
          .filter(item => item?.combatId === clock.id && (
            (item.ref && actors.hash(item.ref) === targetHash) ||
            (item.anchorRef && actors.hash(item.anchorRef) === targetHash)
          ))
          .map(item => item.recordId);
        if (scheduled.length) {
          failWithDetails('combatant_has_scheduled_effects',
            'This combatant still has live scheduled effects. Remove the exact condition instances first; nothing changed.',
            { recordIds: scheduled });
        }
        const cooldowns = authoredCooldowns.liveFor(room, data.target, clock.id);
        if (cooldowns.length) {
          let cooldownKeys = [];
          try {
            const token = actors.locate(room, data.target).token;
            cooldownKeys = Object.entries(token.state?.authoredCooldowns || {})
              .filter(([, item]) => item?.combatId === clock.id).map(([key]) => key);
          } catch (_) { cooldownKeys = []; }
          failWithDetails('combatant_has_cooldowns',
            'This combatant still has a live turn-count cooldown. Wait for it to release or end combat first; nothing changed.',
            { cooldownKeys });
        }
      }
    } else {
      try { actors.locate(room, data.target); actors.fail('target_incarnation_present'); } catch (error) {
        if (error.code === 'target_incarnation_present') {throw error;}
      }
    }
    beforeIndex = targetIndex;
    order.splice(targetIndex, 1);
    next.combat.currentTurnIndex = targetIndex < combat.currentTurnIndex ? combat.currentTurnIndex - 1 : combat.currentTurnIndex;
  }

  let scheduleChanges = { changes: [], detached: [] }, cooldownChanges = { changes: [], detached: [] };
  if (clock) {
    next.combat.effectLifecycle = actors.clone(clock);
    next.combat.effectLifecycle.positionKey = timing.positionKey(next.combat);
    if (!timing.clock(next.combat)) {actors.fail('stale_turn_clock');}
    scheduleChanges = lifecycle.reanchorForRoster(room, next.combat);
    cooldownChanges = authoredCooldowns.reanchorForRoster(next);
  }
  lifecycle.roster({ ...room, gameState: next });
  const closedOffers = committedTriggers.closeForRoster(room, next);
  const approvalsToClose = data.op === 'leave' && data.targetState === 'missing'
    ? planApprovalClosures(room, data.target) : [];
  const beforeRosterHash = actors.hash(combat.turnOrder.map(entry => entry.actorRef));
  const afterRosterHash = actors.hash(next.combat.turnOrder.map(entry => entry.actorRef));
  const chosen = {
    capability: DEFINITION, op: data.op, target: data.target, targetState: data.targetState,
    targetRevision: data.expectedTargetRevision, reason: data.reason ?? null,
    beforeRosterHash, afterRosterHash, beforeIndex, afterIndex,
    currentIndexBefore: combat.currentTurnIndex, currentIndexAfter: next.combat.currentTurnIndex,
    clockBefore: clock ? { id: clock.id, sequence: clock.sequence } : null,
    clockAfter: next.combat.effectLifecycle ? { id: next.combat.effectLifecycle.id, sequence: next.combat.effectLifecycle.sequence } : null,
    positionKeyAfter: next.combat.effectLifecycle?.positionKey ?? null,
    schedules: scheduleChanges.changes.slice(0, AUDIT_CAP),
    detachedSchedules: scheduleChanges.detached.slice(0, AUDIT_CAP),
    cooldowns: cooldownChanges.changes.slice(0, AUDIT_CAP),
    detachedCooldowns: cooldownChanges.detached.slice(0, AUDIT_CAP),
    closedOffers: closedOffers.slice(0, AUDIT_CAP).map(item => ({ obligationId: item.obligationId, state: item.state })),
    approvalsToClose: approvalsToClose.slice(0, AUDIT_CAP),
    counts: {
      schedules: scheduleChanges.changes.length, detached: scheduleChanges.detached.length,
      cooldowns: cooldownChanges.changes.length, detachedCooldowns: cooldownChanges.detached.length,
      closedOffers: closedOffers.length, approvals: approvalsToClose.length
    }
  };
  const command = { ...data, target: actors.clone(data.target), adjudication: {
    definitionId: DEFINITION, definitionVersionOrHash: DEFINITION,
    chosenResult: JSON.stringify(chosen),
    adjustmentReason: 'Authoritative combat roster change only; no turn boundary, resource change, payment or automatic expiry.'
  } };
  const staged = actors.finishStage(room, uid, command, { kind: 'gm', authorizerUid: uid }, confirmedRevision, next, []);
  staged.receipt.contentHash = actors.hash(request);
  staged.rosterChange = chosen;
  return staged;
}

function publicRosterChange(chosen) {
  return {
    capability: chosen.capability, op: chosen.op, targetState: chosen.targetState,
    beforeRosterHash: chosen.beforeRosterHash, afterRosterHash: chosen.afterRosterHash,
    beforeIndex: chosen.beforeIndex, afterIndex: chosen.afterIndex,
    currentIndexBefore: chosen.currentIndexBefore, currentIndexAfter: chosen.currentIndexAfter,
    clockBefore: chosen.clockBefore, clockAfter: chosen.clockAfter
  };
}

function rosterEntryFor(room, token) {
  const contract = token?.state?.actorContract;
  const order = room.gameState?.combat?.turnOrder;
  if (!Array.isArray(order) || !order.length) { return null; }
  const byToken = order.find(entry => entry.tokenId === token?.id);
  if (!contract) { return byToken ? { exact: false, entry: byToken } : null; }
  const ref = actors.refFor(contract);
  const byRef = order.find(entry => entry.actorRef && actors.hash(entry.actorRef) === actors.hash(ref));
  if (byRef) { return { exact: true, entry: byRef }; }
  return byToken ? { exact: false, entry: byToken } : null;
}

function hasLiveCombatEffects(room, token) {
  const contract = token?.state?.actorContract;
  const ref = contract?.instanceId ? actors.refFor(contract) : null;
  const h = ref ? actors.hash(ref) : null;
  const clock = room.gameState?.combat?.effectLifecycle;
  if (!clock) { return null; }
  const matchesActor = (candidate) => candidate && (h ? actors.hash(candidate) === h : candidate.tokenId === token.id);
  const scheduled = Object.values(clock.schedules || {})
    .filter(item => item?.combatId === clock.id && (matchesActor(item.ref) || matchesActor(item.anchorRef)))
    .map(item => item.recordId);
  const cooldowns = Object.entries(token.state?.authoredCooldowns || {})
    .filter(([, item]) => item?.combatId === clock.id).map(([key]) => key);
  return scheduled.length || cooldowns.length ? { scheduled, cooldowns } : null;
}

function approvalMatches(entry, refHash) {
  const approval = entry?.approval;
  if (!approval) { return false; }
  return [approval.source, approval.target, ...(Array.isArray(approval.targets) ? approval.targets : [])]
    .some(ref => { try { return ref && actors.hash(ref) === refHash; } catch (_) { return false; } });
}
function planApprovalClosures(room, ref) {
  const refHash = actors.hash(ref), out = [];
  for (const [capability, module] of [['spellPayments', require('./spellPayments')], ['strikeApprovals', require('./strikeApprovals')], ['blockApprovals', require('./blockApprovals')]]) {
    for (const entry of module.listAll(room)) {
      if (!approvalMatches(entry, refHash)) { continue; }
      out.push({ capability, approvalId: entry.approval.approvalId,
        ownerUid: entry.ownerUid || entry.approval.source?.ownerUid || null,
        targetOwnerUid: entry.approval.target?.ownerUid || null,
        contentHash: entry.contentHash || null });
    }
  }
  return out;
}
function closeApprovalsForRef(room, ref, code) {
  const planned = planApprovalClosures(room, ref);
  for (const item of planned) {
    const module = item.capability === 'spellPayments' ? require('./spellPayments') : item.capability === 'strikeApprovals' ? require('./strikeApprovals') : require('./blockApprovals');
    try { module.close(room, item.approvalId, code); item.closed = true; } catch (_) { item.closed = false; }
  }
  return planned;
}

module.exports = { validate, stage, publicRosterChange, rosterEntryFor, hasLiveCombatEffects, planApprovalClosures, closeApprovalsForRef };
