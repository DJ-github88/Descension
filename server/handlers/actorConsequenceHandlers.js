const actors = require('../services/actorConsequences');
const access = require('../services/roomAccessService');
const payments = require('../services/spellPayments');
const blocks = require('../services/blockApprovals');
const proposals = new WeakMap();
// P12B-r1 (§3.9): stale creature or piece state no longer closes an approval (recorded rolls are kept for
// carry-forward, GM revalidation or void). Only bindings that can never apply are closed, with the offer.
const UNCONSUMABLE = ['critical_bypasses_armor', 'actor_binding_conflict', 'secondary_attachment', 'actor_not_found'];

function registerActorConsequenceHandlers(ctx) {
  const { socket, rooms, players, io, validateRoomMembership, authorityService, firebaseBatchWriter: writer, firebaseService } = ctx;
  const sessionUid = (room, player, socketId) => player.userId ||
    (player.isGM && room.gm?.id === player.id && room.gm?.socketId === socketId ? room.gmId : null);
  const respond = (ack, result) => { if (typeof ack === 'function') {ack(result);} else {socket.emit('actor_consequence_result', result);} };
  const context = roomId => {
    const membership = validateRoomMembership(socket, roomId);
    if (!socket.data?.authenticated || !membership.valid || !socket.data.userId) {actors.fail('forbidden');}
    const { room, player } = membership;
    if (room.id !== roomId || players.get(socket.id) !== player || sessionUid(room, player, socket.id) !== socket.data.userId) {actors.fail('actor_binding_conflict');}
    if (!entitledSession(room, socket.id, player)) {actors.fail('forbidden');}
    return { room, player, uid: socket.data.userId, isGM: player.isGM === true, token: room.authorityToken, socketId: socket.id, socketRef: socket };
  };
  const current = captured => {
    const now = context(captured.room.id);
    if (rooms.get(captured.room.id) !== captured.room || now.room !== captured.room || now.player !== captured.player || now.uid !== captured.uid || now.isGM !== captured.isGM ||
      (authorityService && !authorityService.validateCurrent(captured.token))) {actors.fail('room_binding_changed');}
    return now;
  };
  const confirm = async captured => {
    if (!authorityService || !captured.token) {actors.fail('room_authority_unavailable');}
    const check = await authorityService.assertCurrent(captured.token, { backendCheck: true });
    if (!check.ok) {actors.fail(check.code || 'room_authority_lost');}
    current(captured);
  };
  const confirmed = room => Math.max(room.checkpointRevision || 0, writer?.getStatus?.(room.id)?.confirmedRevision || 0);
  const liveOnly = room => room.isPermanent !== true && !room.persistentRoomId;
  const resultFor = (room, receipt) => ({ success: true, receipt: actors.publicReceipt(receipt), actorSnapshot: require('../services/actorProjection').snapshot(room),
    combat: actors.clone(room.gameState.combat || null), combatHash: actors.hash(room.gameState.combat || null),
    status: Number.isSafeInteger(receipt.checkpointRevision) && receipt.checkpointRevision > 0 && receipt.checkpointRevision <= confirmed(room) ? 'checkpoint-confirmed' : 'accepted-live',
    durability: receipt.checkpointRevision === null ? 'live-only' : 'checkpoint-eligible' });
  const entitledSession = (room, sid, player) => {
    const peer = io.sockets.sockets.get(sid);
    if (rooms.get(room.id) !== room || player.roomId !== room.id || !peer?.data?.authenticated || sessionUid(room, player, sid) !== peer.data.userId) {return false;}
    // Production construction uses separate GM display/session objects.
    if (player.isGM) {return room.gm?.id === player.id && room.gm?.socketId === sid && peer.data.userId === room.gmId;}
    return room.players?.get(player.id) === player;
  };
  const deliver = (room, event, payload) => {
    let delivered = true;
    for (const [sid, player] of players) {
      if (!entitledSession(room, sid, player)) {continue;}
      try {io.to(sid).emit(event, payload);} catch (_) {delivered = false;}
    }
    return delivered;
  };
  const respondInstalled = (ack, result) => {
    try {respond(ack, result);} catch (_) { /* accepted/unknown delivery retains retry custody */ }
  };
  const publishInstalled = (room, event, result, ack) => {
    const delivered = deliver(room, event, result);
    // Delivery cannot undo installed actors/receipt or become rejection.
    respondInstalled(ack, { ...result, delivery: delivered ? 'sent' : 'partial' });
  };
  const install = (room, next) => {
    room.gameState = next;
    // Mirrors are derived only for an exact owner/canonical character match.
    for (const map of Object.values(next.maps || {})) {
      for (const token of Object.values(map.characterTokens || {})) {
        const binding = token.state?.actorContract;
        if (!binding?.primary) {continue;}
        for (const player of new Set([...room.players.values(), room.gm].filter(Boolean))) {
          if (player.userId === binding.ownerUid && player.character?.id === binding.characterId) {
            player.character = { ...player.character, ...Object.fromEntries(['health', 'mana', 'actionPoints', 'tempHealth', 'tempMana', 'tempActionPoints'].map(key => [key, token.character[key]])) };
          }
        }
      }
    }
  };
  const admit = (room, staged) => {
    if (liveOnly(room)) {
      // Temporary cooperation is explicitly process-memory-only: no writer
      // admission, checkpoint revision/confirmation or crash-durability claim.
      if (room.deleting || room.lifecycleState === 'quiescing' || room.lifecycleState === 'fenced' || !authorityService?.validateCurrent(room.authorityToken)) {actors.fail('room_authority_lost');}
      if (staged.receipt) {staged.receipt.checkpointRevision = null;}
      const validated = require('../services/roomCheckpoint').canonicalize(staged.next, 'gameState');
      if (validated.error) {actors.fail('CHECKPOINT_INVALID', validated.error);}
      if (actors.bytes(staged.next.actorConsequences?.receipts || []) > 512 * 1024) {actors.fail('receipt_capacity');}
      install(room, staged.next);
      return;
    }
    if (!writer || typeof writer.admitConsequence !== 'function') {actors.fail('checkpoint_writer_unavailable');}
    const admission = writer.admitConsequence(room.id, revision => {
      if (staged.receipt) {staged.receipt.checkpointRevision = revision;}
      if (actors.bytes(staged.next.actorConsequences?.receipts || []) > 512 * 1024) {actors.fail('receipt_capacity');}
      return staged.next;
    }, next => install(room, next), { authorityToken: room.authorityToken });
    if (!admission.queued) {actors.fail(admission.code || admission.reason || 'writer_admission_refused');}
  };
  const run = (event, action) => socket.on(event, ctx.requireAuth(async(data, ack) => {
    try {await action(data, ack);} catch (error) {
      respond(ack, { success: false, code: error.code || 'invalid_consequence', error: error.message, ...(error.details && typeof error.details === 'object' ? { details: error.details } : {}) });
    }
  }));

  run('actor_snapshot', async(data, ack) => {
    actors.keys(data, ['roomId']);
    const { room } = context(data.roomId);
    const state = actors.ledger(room);
    respond(ack, { success: true, ...require('../services/actorProjection').snapshot(room), actionEpoch: actors.epoch(room), commitSequence: state.commitSequence, replayFloor: state.replayFloor,
      combat: actors.clone(room.gameState.combat || null), combatHash: actors.hash(room.gameState.combat || null),
      bindings: Object.entries(room.gameState.maps || {}).flatMap(([mapId, map]) => ['tokens', 'creatures', 'characterTokens'].flatMap(field =>
        Object.entries(map[field] || {}).map(([tokenId, token]) => ({ mapId, tokenId, kind: field === 'characterTokens' ? 'character' : 'creature', snapshotHash: actors.hash(token) })))) });
  });
  run('actor_turn_boundary', async(data, ack) => {
    const lifecycle = require('../services/sharedEffectLifecycle');
    lifecycle.validate(data);
    const captured = context(data.roomId);
    if (!captured.isGM) {actors.fail('turn_gm_required');}
    const old = actors.knownReceipt(captured.room, captured.uid, data);
    if (old) {respondInstalled(ack, resultFor(captured.room, old)); return;}
    await confirm(captured);
    const staged = lifecycle.stage(captured.room, captured.player, captured.uid, data, confirmed(captured.room));
    current(captured);
    admit(captured.room, staged);
    const result = resultFor(captured.room, staged.receipt);
    publishInstalled(captured.room, 'actor_consequence_accepted', result, ack);
    deliver(captured.room, 'combat_state_sync', { combat: result.combat });
  });
  // P14-A1: A1a plans, P7 authority/admission/install. No parallel persistence owner.
  run('actor_authored_list', async(data, ack) => {
    actors.keys(data, ['roomId']);
    const captured = context(data.roomId);
    await confirm(captured);
    respond(ack, { success: true, roomId: captured.room.id, ...require('../services/installedAuthoredAbilities').list(captured.room),
      ...(captured.isGM ? { creatureSources: require('../services/installedAuthoredAbilities').creatureSources(captured.room) } : {}),
      durability: liveOnly(captured.room) ? 'live-only' : 'checkpoint-eligible' });
  });
  for (const operation of ['admit', 'revoke']) {
    run(`actor_authored_${operation}`, async(input, ack) => {
      actors.keys(input, operation === 'admit' ? ['roomId', 'requestId', 'expectedRegistryRevision', 'record', 'definitionVersion', 'classId', 'source', 'expectedSourceRevision'] : ['roomId', 'requestId', 'expectedRegistryRevision', 'definitionRef']);
      if (actors.bytes(input) > 128 * 1024) {actors.fail('authored_record_capacity');}
      const data = actors.clone(input), captured = context(data.roomId);
      if (!captured.isGM) {actors.fail('forbidden');}
      const installed = require('../services/installedAuthoredAbilities'), definitions = require('../services/installedDefinitionRegistry');
      if (operation === 'admit' && data.source) {
        if (data.record !== undefined || data.classId !== undefined) actors.fail('invalid_consequence');
        const staged = await installed.planCreatureAdmission(captured.room, captured.uid, data, async() => {
          await confirm(captured);
          if (!current(captured).isGM) actors.fail('forbidden');
          return { ok: true, roomId: captured.room.id, uid: captured.uid, gmUid: captured.room.gmId, principalBound: true, authorityCurrent: true, rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1' };
        });
        current(captured);
        if (staged.next) {
          admit(captured.room, staged);
          // A6: admission advances this actor's revision. Observers need its public before-state
          // for exact-revision self-healing feedback; use the existing lifecycle projection channel.
          deliver(captured.room, 'actor_bound', { success: true, roomId: captured.room.id, actorSnapshot: require('../services/actorProjection').snapshot(captured.room) });
        }
        respondInstalled(ack, { success: true, roomId: captured.room.id, definitionRef: staged.definitionRef, ...installed.list(captured.room),
          creatureSources: installed.creatureSources(captured.room), actorSnapshot: require('../services/actorProjection').snapshot(captured.room), status: liveOnly(captured.room) ? 'admitted live-only' : 'admitted-live / checkpoint pending' });
        return;
      }
      const before = installed.registry(captured.room);
      if ((actors.ledger(captured.room).authoredSourceAdmissions || []).some(e => e.requestId === data.requestId)) actors.fail('REQUEST_ID_CONFLICT');
      const request = { roomId: data.roomId, requestId: data.requestId, expectedRegistryRevision: data.expectedRegistryRevision };
      if (operation === 'admit') {
        const mapped = require('../../vtt-react/src/services/authoredAbility').definitionFromWizard(data.record, { roomId: data.roomId, definitionVersion: data.definitionVersion, classId: data.classId });
        if (!mapped.ok) {actors.fail(mapped.code, mapped.reason);}
        const compiled = definitions.compileDefinition(mapped.definition);
        if (!compiled.ok) {actors.fail(compiled.code, compiled.path);}
        request.definition = compiled.canonicalDefinition; request.expectedDefinitionHash = compiled.definitionHash;
      } else {request.definitionRef = data.definitionRef;}
      const planner = definitions.createDefinitionRegistry({ authorize: async() => {
        await confirm(captured);
        if (!current(captured).isGM) {actors.fail('forbidden');}
        return { ok: true, roomId: captured.room.id, uid: captured.uid, gmUid: captured.room.gmId, principalBound: true, authorityCurrent: true, rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1' };
      } });
      const plan = await (operation === 'admit' ? planner.planAdmit(before, request) : planner.planRevoke(before, request));
      if (!plan.ok) {actors.fail(plan.code, plan.path);}
      current(captured);
      if ((actors.ledger(captured.room).authoredSourceAdmissions || []).some(e => e.requestId === data.requestId)) actors.fail('REQUEST_ID_CONFLICT');
      if (actors.hash(installed.registry(captured.room)) !== actors.hash(before)) {actors.fail('REVISION_CONFLICT');}
      if (plan.kind === 'transition') {
        const next = actors.clone(captured.room.gameState); next.authoredSpellRegistry = actors.clone(plan.nextRegistry);
        admit(captured.room, { next });
      }
      respondInstalled(ack, { success: true, roomId: captured.room.id, definitionRef: plan.definitionRef,
        ...installed.list(captured.room), status: `${operation === 'revoke' ? 'revoked' : 'admitted'}${liveOnly(captured.room) ? ' live-only' : '-live / checkpoint pending'}` });
    });
  }
  run('actor_bind', async(data, ack) => {
    actors.keys(data, ['roomId', 'ref', 'snapshotHash', 'selection', 'replacePrimaryRef']);
    if (!/^[0-9a-f]{64}$/.test(data.snapshotHash || '') || (data.selection !== undefined && !['root', 'nested'].includes(data.selection))) {actors.fail('invalid_consequence');}
    if (data.replacePrimaryRef) {actors.validateRef(data.replacePrimaryRef);}
    const captured = context(data.roomId);
    const { room, player, uid } = captured;
    const original = actors.locate(room, data.ref, false);
    if (actors.hash(original.token) !== data.snapshotHash) {actors.fail('stale_actor_revision');}
    if (!actors.permitted(room, player, uid, data.ref, original.token)) {actors.fail('forbidden');}
    if (data.ref.kind === 'character') {
      if (original.token.ownerUserId !== data.ref.ownerUid || original.token.character?.id !== data.ref.characterId) {actors.fail('actor_binding_conflict');}
      const owner = await firebaseService.getCharacterOwner(data.ref.characterId);
      current(captured);
      if (!owner?.ok || owner.userId !== data.ref.ownerUid) {actors.fail('actor_binding_conflict');}
    }
    await confirm(captured);
    const latest = actors.locate(room, data.ref, false);
    if (latest.token !== original.token || latest.field !== original.field || actors.hash(latest.token) !== data.snapshotHash ||
      !actors.permitted(room, captured.player, uid, data.ref, latest.token)) {actors.fail('stale_actor_revision');}
    if (latest.token.state?.actorContract) {actors.fail(latest.token.state.actorContract.version === 1 ? 'already_bound' : 'unsupported_actor_contract');}
    if (latest.token.id !== data.ref.tokenId) {actors.fail('legacy_reconciliation_required');}
    const validated = require('../services/roomCheckpoint').canonicalize(room.gameState, 'gameState');
    if (validated.error) {actors.fail('CHECKPOINT_INVALID', validated.error);}
    const next = actors.clone(room.gameState);
    const invalidated = [];
    const token = next.maps[data.ref.mapId][latest.field][data.ref.tokenId];
    if (latest.field === 'creatures') {
      next.maps[data.ref.mapId].tokens = next.maps[data.ref.mapId].tokens || {};
      next.maps[data.ref.mapId].tokens[data.ref.tokenId] = token;
      delete next.maps[data.ref.mapId].creatures[data.ref.tokenId];
      token.state = { ...token.state, actorRecovery: { original: actors.clone(latest.token), selection: 'map-creatures-explicit' } };
    }
    if (data.ref.kind === 'character') {
      for (const map of Object.values(next.maps)) {
        for (const sibling of Object.values(map.characterTokens || {})) {
          const old = sibling.state?.actorContract;
          if (old?.primary && old.ownerUid === data.ref.ownerUid && old.characterId === data.ref.characterId) {
            if (actors.hash(actors.refFor(old)) !== actors.hash(data.replacePrimaryRef)) {actors.fail('primary_attachment_exists');}
            old.primary = false; old.instanceId = require('crypto').randomUUID(); old.revision += 1;
            invalidated.push({ roomId: room.id, mapId: old.mapId, ref: actors.refFor(old), token: access.projectTokenForClient(sibling) });
          }
        }
      }
    }
    token.state = token.state || {};
    if (actors.own(token.state, 'classPayment')) {
      // A new incarnation never inherits an unverified class home; retain it as recovery data.
      token.state.actorRecovery = { ...token.state.actorRecovery, priorClassPayment: actors.clone(token.state.classPayment) };
      delete token.state.classPayment;
    }
    if (actors.own(token.state, 'equipmentBlocking')) {
      // P12B: a new incarnation never inherits a blocking declaration; the owner reconciles it from recovery.
      token.state.actorRecovery = { ...token.state.actorRecovery, priorBlocking: actors.clone(token.state.equipmentBlocking) };
      delete token.state.equipmentBlocking;
    }
    if (actors.own(token, 'conditions')) {
      token.state.actorRecovery = { ...token.state.actorRecovery, rootConditions: actors.clone(token.conditions) };
      if (actors.own(token.state, 'conditions') && actors.hash(token.conditions) !== actors.hash(token.state.conditions) && !data.selection) {actors.fail('legacy_reconciliation_required');}
      if (data.selection === 'root' || !actors.own(token.state, 'conditions')) {token.state.conditions = actors.clone(token.conditions);}
      delete token.conditions;
    }
    if (data.ref.kind === 'creature') {
      const differing = ['currentHp', 'currentMana', 'currentActionPoints', 'tempHealth', 'tempMana', 'tempActionPoints'].some(key => actors.own(token, key) && actors.own(token.state, key) && token[key] !== token.state[key]);
      if (differing && !['root', 'nested'].includes(data.selection)) {actors.fail('legacy_reconciliation_required');}
      if (differing) {token.state.actorRecovery = { original: actors.clone(latest.token), selection: data.selection };}
      for (const key of ['currentHp', 'currentMana', 'currentActionPoints', 'tempHealth', 'tempMana', 'tempActionPoints']) {
        if (actors.own(token, key) && (data.selection === 'root' || !actors.own(token.state, key))) {token.state[key] = token[key];}
      }
    }
    const binding = { version: 1, ...data.ref, instanceId: require('crypto').randomUUID(), revision: 0,
      ...(data.ref.kind === 'character' ? { primary: true } : {}), bindingProvenance: { boundBy: uid, snapshotHash: data.snapshotHash, selection: data.selection || 'unambiguous' } };
    token.state.actorContract = binding;
    if (token.state.conditions && !Array.isArray(token.state.conditions)) {
      token.state.actorRecovery = { ...token.state.actorRecovery, legacyConditionShape: actors.clone(token.state.conditions) };
      token.state.conditions = [{ name: 'Legacy conditions require reconciliation', legacyRaw: actors.clone(token.state.conditions) }];
    }
    const legacy = (token.state.conditions || []).filter(record => record.version !== 1 || !record.recordId || actors.hash(record.target) !== actors.hash(actors.refFor(binding)));
    if (legacy.length) {
      token.state.actorRecovery = { ...token.state.actorRecovery, legacyConditions: actors.clone(legacy) };
      token.state.conditions = (token.state.conditions || []).map((record, index) => record.version === 1 && record.recordId && actors.hash(record.target) === actors.hash(actors.refFor(binding)) ? record : {
        ...actors.publicCondition(record), version: 1, id: `legacy-${binding.instanceId}-${index}`, recordId: `legacy-${binding.instanceId}-${index}`,
        name: record.name || 'Legacy manual condition', originalName: record.name || 'Legacy manual condition', type: ['buff', 'debuff'].includes(record.type) ? record.type : 'marker',
        kind: 'legacy-manual', target: actors.refFor(binding), targetId: binding.tokenId, targetType: binding.kind, sharedTiming: 'manual',
        durationType: record.durationType || 'manual', source: typeof record.source === 'string' && record.source ? record.source : 'explicit-legacy-binding', legacyRaw: actors.clone(record)
      });
    }
    const values = actors.resources(token, data.ref.kind);
    for (const pool of Object.values(values)) {
      if (![pool.current, pool.temp, pool.max].every(value => typeof value === 'number' && Number.isFinite(value) && value >= 0) || pool.current > pool.max) {actors.fail('legacy_reconciliation_required');}
    }
    // Bound common-pool snapshots use the same explicit zero temps as receipts.
    // Otherwise first delivery materializes zero while an equal-revision
    // snapshot omits it and spuriously conflicts with the accepted projection.
    for (const [pool, [, , tempKey]] of Object.entries(actors.POOLS)) {
      (data.ref.kind === 'character' ? token.character : token.state)[tempKey] = values[pool].temp;
    }
    if (data.ref.kind === 'creature') {
      token.state.maxHp = values.hp.max; token.state.maxMana = values.mana.max; token.state.maxAP = values.ap.max;
      token.state.maxActionPoints = values.ap.max; // Existing HUD display alias, not a second owner.
    }
    const state = actors.ledger(room);
    next.actorConsequences = { ...actors.clone(state), admissionEpoch: actors.epoch(room) };
    const mirrors = require('../services/roomCheckpoint').deriveRootMirrors(next.maps);
    next.tokens = mirrors.tokens; next.characterTokens = mirrors.characterTokens;
    require('../services/actorProjection').advance(room, next);
    admit(room, { next });
    const payload = { success: true, roomId: room.id, actorSnapshot: require('../services/actorProjection').snapshot(room), ref: actors.refFor(binding), revision: 0, mapId: data.ref.mapId, token: access.projectTokenForClient(token), invalidated,
      durability: liveOnly(room) ? 'live-only' : 'checkpoint-eligible' };
    publishInstalled(room, 'actor_bound', payload, ack);
  });
  run('actor_consequence', async(command, ack) => {
    const captured = context(command.roomId);
    actors.validateCommand(command);
    const old = actors.knownReceipt(captured.room, captured.uid, command);
    if (old) {
      if (old.contentHash !== actors.hash(command)) {actors.fail('command_id_conflict');}
      respondInstalled(ack, resultFor(captured.room, old)); return;
    }
    await confirm(captured);
    let staged;
    try {
      staged = actors.stage(captured.room, captured.player, captured.uid, command,
        { kind: captured.player.isGM ? 'gm' : 'controller', authorizerUid: captured.uid }, confirmed(captured.room));
    } catch (error) {
      if (captured.player.isGM && require('../services/riposteExecution').isCommand(command)) {require('../services/riposteExecution').refused(captured.room, command);}
      // P9: a changed class home invalidates the owner's approved price/typed result.
      if (error.code === 'owner_reapproval_required' && command.approval) {closeApproval(captured.room, command.approval.approvalId, 'owner_reapproval_required');}
      // P12B: a changed declaration invalidates the owner's approved piece/roll.
      // Review note 8: an approval that can never be consumed is closed instead of blocking re-declaration.
      if (command.approval && blocks.get(captured.room, command.approval.approvalId) && UNCONSUMABLE.includes(error.code)) {
        const entry = blocks.get(captured.room, command.approval.approvalId);
        closeBlock(captured.room, command.approval.approvalId, 'invalidated');
        closeOfferFor(captured.room, entry.approval.attack.commandId, 'invalidated', entry.approval);
      }
      throw error;
    }
    if (staged.existing) {respondInstalled(ack, resultFor(captured.room, staged.existing)); return;}
    try {admit(captured.room, staged);} catch (error) {
      if (require('../services/riposteExecution').isCommand(command) && !actors.knownReceipt(captured.room, captured.uid, command)) {require('../services/riposteExecution').refused(captured.room, command);}
      throw error;
    }
    // Approval consumption is synchronous with installation (no await between).
    if (staged.approved) {(staged.binder || payments).close(captured.room, staged.approved.approval.approvalId, 'consumed');}
    if (staged.binder === blocks) {blocks.closeOffer(captured.room, command.commandId, 'consumed', staged.approved.approval);}
    pushBlocking(captured.room, staged.receipt);
    // Repair N2: the legacy room mirror takes the class home only when this command changed it.
    for (const actor of staged.receipt.actors) {
      if (!actor.classPayment) {continue;}
      const home = actors.locate(captured.room, actor.ref).token.state.classPayment;
      for (const member of new Set([...captured.room.players.values(), captured.room.gm].filter(Boolean))) {
        if (member.userId === actor.ref.ownerUid && member.character?.id === actor.ref.characterId) {
          member.character = { ...member.character, classResource: { ...(member.character.classResource || {}), ...actors.clone(home.value) } };
        }
      }
    }
    const result = resultFor(captured.room, staged.receipt);
    publishInstalled(captured.room, 'actor_consequence_accepted', result, ack);
  });
  const toUid = (room, uid, event, payload) => {
    for (const [sid, member] of players) {
      if ((member.userId === uid || (member.isGM && room.gmId === uid)) && entitledSession(room, sid, member)) {io.to(sid).emit(event, payload);}
    }
  };
  const toGm = (room, event, payload) => {
    for (const [sid, member] of players) {if (member.isGM && entitledSession(room, sid, member)) {io.to(sid).emit(event, payload);}}
  };
  const closeApproval = (room, approvalId, code) => {
    const entry = payments.get(room, approvalId);
    if (!entry) {return false;}
    payments.close(room, approvalId, code);
    const payload = { roomId: room.id, approvalId, contentHash: entry.contentHash, code };
    toUid(room, entry.approval.source.ownerUid, 'actor_spell_closed', payload); toGm(room, 'actor_spell_closed', payload);
    if (entry.targetPolicy) toUid(room, entry.approval.target.ownerUid, 'actor_spell_closed', payload);
    return true;
  };
  // P9 owner approval: the owner authorizes their own price/typed result; the GM
  // later adjudicates the cross-actor outcome through one strict actor_consequence.
  for (const event of ['actor_spell_approve', 'actor_spell_prepare_creature']) run(event, async(approval, ack) => {
    const creature = event === 'actor_spell_prepare_creature';
    (creature ? payments.validateCreatureApproval : payments.validateApproval)(approval);
    approval = actors.clone(approval);
    const captured = context(approval.roomId);
    const { room, player, uid } = captured;
    if (creature ? !captured.isGM || uid !== approval.sourceAuthority.gmUid : uid !== approval.source.ownerUid) {actors.fail('forbidden');}
    const contentHash = actors.hash(approval);
    const consumed = payments.consumedReceipt(room, approval.approvalId);
    if (consumed) {
      if (consumed.authorization.approvalHash !== contentHash || (creature ? consumed.submitterUid !== uid : consumed.source?.ownerUid !== uid)) {actors.fail('command_id_conflict');}
      respondInstalled(ack, resultFor(room, consumed)); return;
    }
    const existing = payments.get(room, approval.approvalId);
    if (existing) {
      if (existing.contentHash !== contentHash) {actors.fail('command_id_conflict');}
      if (!creature) {respond(ack, { success: false, code: 'awaiting_gm', approvalId: approval.approvalId, contentHash }); return;}
    }
    if (payments.closedCode(room, approval.approvalId)) {
      // A consumed approval whose receipt was pruned cannot be re-registered or re-confirmed.
      actors.fail(payments.closedCode(room, approval.approvalId) === 'consumed' ? 'retry_window_expired' : `approval_${payments.closedCode(room, approval.approvalId)}`);
    }
    if (approval.actionEpoch !== actors.epoch(room)) {actors.fail('outcome_unknown');}
    payments.checkWindow(room, approval);
    if (!creature && uid !== approval.source.ownerUid) {actors.fail('forbidden');}
    const source = actors.locate(room, approval.source);
    if (!creature && (!actors.permitted(room, player, uid, approval.source, source.token) || source.token.ownerUserId !== uid)) {actors.fail('forbidden');}
    payments.checkAgainstRoom(room, approval);
    const selfState = payments.selfState(room, approval);
    await confirm(captured);
    const afterReceipt = payments.consumedReceipt(room, approval.approvalId);
    if (afterReceipt) {
      if (afterReceipt.authorization.approvalHash !== contentHash || (creature ? afterReceipt.submitterUid !== uid : afterReceipt.source?.ownerUid !== uid)) {actors.fail('command_id_conflict');}
      respondInstalled(ack, resultFor(room, afterReceipt)); return;
    }
    const latest = actors.locate(room, approval.source);
    if (!creature && (!actors.permitted(room, captured.player, uid, approval.source, latest.token) || latest.token.ownerUserId !== uid)) {actors.fail('forbidden');}
    payments.checkAgainstRoom(room, approval);
    if (selfState !== payments.selfState(room, approval)) actors.fail('creature_revalidation_required');
    const afterPending = payments.get(room, approval.approvalId);
    if (afterPending) {
      if (afterPending.contentHash !== contentHash) {actors.fail('command_id_conflict');}
      if (selfState) afterPending.selfState = selfState; // Explicit same-face revalidation only.
      respond(ack, { success: false, code: 'awaiting_gm', approvalId: approval.approvalId, contentHash }); return;
    }
    const closed = payments.closedCode(room, approval.approvalId);
    if (closed) {actors.fail(closed === 'consumed' ? 'retry_window_expired' : `approval_${closed}`);}
    if (approval.actionEpoch !== actors.epoch(room)) {actors.fail('outcome_unknown');}
    payments.checkWindow(room, approval);
    const entry = payments.add(room, { approval: actors.clone(approval), contentHash, ownerUid: uid, ...(selfState ? { selfState } : {}) });
    toGm(room, 'actor_spell_pending', { roomId: room.id, approval: payments.gmProjection(entry), contentHash, submitterUid: uid });
    respond(ack, { success: false, code: 'awaiting_gm', approvalId: approval.approvalId, contentHash });
  });
  run('actor_spell_withdraw', async(data, ack) => {
    actors.keys(data, ['roomId', 'approvalId', 'approval']);
    const { room, uid, isGM } = context(data.roomId);
    const consumed = payments.consumedReceipt(room, data.approvalId);
    if (consumed) {
      if (consumed.source?.kind === 'creature' ? !isGM || consumed.submitterUid !== uid : consumed.source?.ownerUid !== uid) {actors.fail('forbidden');}
      respondInstalled(ack, resultFor(room, consumed)); return;
    }
    const entry = payments.get(room, data.approvalId);
    if (!entry) {
      const closed = payments.closedEntry(room, data.approvalId);
      if (data.approval?.source?.kind === 'character' && closed?.code === 'withdrawn') {
        payments.validateApproval(data.approval);
        if (closed.ownerUid !== uid || data.approval.source.ownerUid !== uid || data.approval.approvalId !== data.approvalId || data.approval.roomId !== room.id) actors.fail('forbidden');
        if (closed.contentHash !== actors.hash(data.approval)) actors.fail('command_id_conflict');
        respond(ack, { success: true, code: 'withdrawn', approvalId: data.approvalId, contentHash: closed.contentHash }); return;
      }
      if (data.approval && closed?.code === 'withdrawn') {
        payments.validateCreatureApproval(data.approval);
        if (!isGM || closed.ownerUid !== uid || data.approval.sourceAuthority.gmUid !== uid || data.approval.approvalId !== data.approvalId || data.approval.roomId !== room.id) actors.fail('forbidden');
        if (closed.contentHash !== actors.hash(data.approval)) actors.fail('command_id_conflict');
        respond(ack, { success: true, code: 'withdrawn', approvalId: data.approvalId, contentHash: closed.contentHash }); return;
      }
      if (data.approval && !payments.closedCode(room, data.approvalId)) {
        payments.validateCreatureApproval(data.approval);
        if (!isGM || data.approval.sourceAuthority.gmUid !== uid || data.approval.approvalId !== data.approvalId || data.approval.roomId !== room.id) actors.fail('forbidden');
        if (data.approval.actionEpoch !== actors.epoch(room)) actors.fail('outcome_unknown');
        payments.checkWindow(room, data.approval);
        payments.close(room, data.approvalId, 'withdrawn', { contentHash: actors.hash(data.approval), ownerUid: uid });
        respond(ack, { success: true, code: 'withdrawn', approvalId: data.approvalId, contentHash: actors.hash(data.approval) }); return;
      }
      actors.fail(payments.closedCode(room, data.approvalId) ? `approval_${payments.closedCode(room, data.approvalId)}` : 'outcome_unknown');
    }
    if (entry.approval.source.kind === 'creature' ? !isGM || entry.ownerUid !== uid : entry.approval.source.ownerUid !== uid) {actors.fail('forbidden');}
    closeApproval(room, data.approvalId, 'withdrawn');
    respond(ack, { success: true, code: 'withdrawn', approvalId: data.approvalId, contentHash: entry.contentHash });
  });
  run('actor_spell_decline', async(data, ack) => {
    actors.keys(data, ['roomId', 'approvalId']);
    const captured = context(data.roomId);
    if (!captured.player.isGM) {actors.fail('forbidden');}
    const consumed = payments.consumedReceipt(captured.room, data.approvalId);
    if (consumed) {respondInstalled(ack, resultFor(captured.room, consumed)); return;}
    if (!payments.get(captured.room, data.approvalId)) {actors.fail('outcome_unknown');}
    closeApproval(captured.room, data.approvalId, 'declined');
    respond(ack, { success: true, code: 'declined', approvalId: data.approvalId });
  });
  run('actor_spell_list', async(data, ack) => {
    actors.keys(data, ['roomId']);
    const { room, player, uid } = context(data.roomId);
    const pending = [];
    for (const entry of [...(payments.pendingFor(room, uid) ? [payments.pendingFor(room, uid)] : [])]) {pending.push({ approval: actors.clone(entry.approval), contentHash: entry.contentHash, own: true });}
    if (player.isGM) {
      for (const entry of payments.listAll(room)) {pending.push({ approval: payments.gmProjection(entry), contentHash: entry.contentHash, submitterUid: entry.ownerUid, targetProposal: payments.targetProposal(entry) });}
    }
    const targetProposals = payments.listAll(room).filter(e => e.approval.target.ownerUid === uid && e.approval.target.characterId === player.character?.id && e.targetPolicy?.mode === 'voluntary').map(payments.targetProposal);
    respond(ack, { success: true, roomId: room.id, pending, targetProposals });
  });
  run('actor_spell_target_designate', async(data, ack) => {
    actors.keys(data, ['roomId', 'approvalId', 'contentHash']);
    const captured = context(data.roomId), { room } = captured;
    if (!captured.isGM) actors.fail('forbidden');
    const entry = payments.get(room, data.approvalId);
    if (!entry || entry.contentHash !== data.contentHash || entry.approval.target.kind !== 'character' || !require('../../vtt-react/src/services/authoredCondition').isCondition(entry.approval)) actors.fail('target_proposal_changed');
    await confirm(captured);
    if (payments.get(room, data.approvalId) !== entry) actors.fail('outcome_unknown');
    payments.checkAgainstRoom(room, entry.approval);
    if (entry.targetPolicy && entry.targetPolicy.gmUid !== room.gmId) actors.fail('target_proposal_changed');
    if (!entry.targetPolicy) entry.targetPolicy = { mode: 'voluntary', gmUid: captured.uid, proposalId: require('crypto').randomUUID(),
      sourceHandle: require('crypto').randomUUID(), termsHash: require('crypto').randomBytes(32).toString('hex'), bindingHash: actors.hash(payments.targetTerms(entry)) };
    const proposal = payments.targetProposal(entry);
    toUid(room, entry.approval.target.ownerUid, 'actor_spell_target_pending', { roomId: room.id, proposal });
    respond(ack, { success: true, proposal });
  });
  run('actor_spell_target_respond', async(data, ack) => {
    actors.keys(data, ['roomId', 'approvalId', 'proposalId', 'termsHash', 'target', 'accept']);
    if (typeof data.accept !== 'boolean') actors.fail('invalid_target_response');
    const captured = context(data.roomId), { room, uid, player } = captured;
    const consumed = payments.consumedReceipt(room, data.approvalId);
    if (consumed) {
      const p = consumed.targetAcceptance;
      if (consumed.target?.ownerUid !== uid || consumed.target?.characterId !== player.character?.id || actors.hash(consumed.target) !== actors.hash(data.target)) actors.fail('forbidden');
      if (!p || p.proposalId !== data.proposalId || p.termsHash !== data.termsHash) actors.fail('target_proposal_changed');
      respondInstalled(ack, resultFor(room, consumed)); return;
    }
    const entry = payments.get(room, data.approvalId), p = entry?.targetPolicy;
    if (!entry && payments.closedCode(room, data.approvalId) === 'consumed') actors.fail('retry_window_expired');
    if (!p || p.mode !== 'voluntary' || p.gmUid !== room.gmId || p.proposalId !== data.proposalId || p.termsHash !== data.termsHash) actors.fail('target_proposal_changed');
    const exactOwner = () => {
      const t = entry.approval.target;
      if (t.ownerUid !== uid || player.character?.id !== t.characterId || actors.hash(t) !== actors.hash(data.target) || actors.locate(room, t).token.ownerUserId !== uid) actors.fail('forbidden');
    };
    exactOwner(); await confirm(captured); exactOwner();
    if (payments.get(room, data.approvalId) !== entry || entry.targetPolicy !== p || p.gmUid !== room.gmId || p.bindingHash !== actors.hash(payments.targetTerms(entry))) actors.fail('target_proposal_changed');
    if (entry.approval.actionEpoch !== actors.epoch(room)) actors.fail('outcome_unknown');
    if (data.accept && p.withdrawn) actors.fail('target_acceptance_withdrawn');
    if (data.accept) p.acceptedUid = uid;
    else { delete p.acceptedUid; p.withdrawn = true; }
    toGm(room, 'actor_spell_pending', { roomId: room.id, approval: payments.gmProjection(entry), contentHash: entry.contentHash, targetProposal: payments.targetProposal(entry) });
    respond(ack, { success: true, proposal: payments.targetProposal(entry) });
  });
  run('actor_propose', async(command, ack) => {
    actors.validateCommand(command);
    // Repair B1: owner spell approvals are consumed only by the GM's direct consequence.
    if (command.approval || command.actors.some(actor => actor.classPayment)) {actors.fail('approval_requires_gm');}
    // P12B: declarations are the owner's direct command; wear is only the GM's approval-bound command.
    if (command.actors.some(actor => actor.blockingDeclaration || actor.equipmentWear)) {actors.fail('blocking_owner_required');}
    const captured = context(command.roomId);
    const { room, player, uid } = captured;
    const old = actors.knownReceipt(room, uid, command);
    if (old) {respondInstalled(ack, resultFor(room, old)); return;}
    const sourceRef = command.source || command.actors[0].ref;
    const source = actors.locate(room, sourceRef);
    const sourceAuthorized = actors.permitted(room, player, uid, sourceRef, source.token);
    if (command.actors.length > 1 && !sourceAuthorized) {actors.fail('forbidden');}
    if (command.actionEpoch !== actors.epoch(room)) {actors.fail('outcome_unknown');}
    await confirm(captured);
    if (sourceAuthorized && !actors.permitted(room, player, uid, sourceRef, actors.locate(room, sourceRef).token)) {actors.fail('forbidden');}
    let pending = proposals.get(room);
    if (!pending) {pending = new Map(); proposals.set(room, pending);}
    const matching = Array.from(pending.values()).find(entry => entry.captured.uid === uid && entry.command.commandId === command.commandId);
    if (matching && matching.contentHash !== actors.hash(command)) {actors.fail('command_id_conflict');}
    if (!matching && (pending.size >= 32 || actors.bytes(Array.from(pending.values()).map(entry => entry.command).concat(command)) > 512 * 1024)) {actors.fail('proposal_capacity');}
    const proposal = matching || { proposalId: require('crypto').randomUUID(), contentHash: actors.hash(command), command: actors.clone(command), captured, sourceRef, sourceAuthorized };
    pending.set(proposal.proposalId, proposal);
    const payload = { success: false, code: 'awaiting_authorization', proposalId: proposal.proposalId, contentHash: proposal.contentHash, command: proposal.command, submitterUid: uid };
    for (const [sid, member] of players) {
      if (member.isGM && entitledSession(room, sid, member)) {io.to(sid).emit('actor_proposal_pending', payload);}
    }
    respond(ack, { success: false, code: payload.code, proposalId: proposal.proposalId, contentHash: proposal.contentHash });
  });
  run('actor_adjudicate', async(data, ack) => {
    actors.keys(data, ['roomId', 'proposalId', 'contentHash']);
    const captured = context(data.roomId);
    if (!captured.player.isGM) {actors.fail('forbidden');}
    const { room } = captured;
    const old = actors.ledger(room).receipts.find(receipt => receipt.authorization.proposalId === data.proposalId);
    if (old) {
      if (old.contentHash !== data.contentHash) {actors.fail('command_id_conflict');}
      respondInstalled(ack, resultFor(room, old)); return;
    }
    const proposal = proposals.get(room)?.get(data.proposalId);
    if (!proposal) {actors.fail('outcome_unknown');}
    if (proposal.contentHash !== data.contentHash) {actors.fail('command_id_conflict');}
    await confirm(captured);
    if (!captured.player.isGM) {actors.fail('forbidden');}
    const owner = proposal.captured;
    if (owner.room !== room || players.get(owner.socketId) !== owner.player || sessionUid(room, owner.player, owner.socketId) !== owner.uid ||
      owner.socketRef.data?.userId !== owner.uid || !owner.socketRef.data?.authenticated ||
      !entitledSession(room, owner.socketId, owner.player) ||
      (proposal.sourceAuthorized && !actors.permitted(room, owner.player, owner.uid, proposal.sourceRef, actors.locate(room, proposal.sourceRef).token))) {actors.fail('forbidden');}
    const staged = actors.stage(room, captured.player, owner.uid, proposal.command,
      { kind: proposal.sourceAuthorized ? 'controller-proposal-gm' : 'member-proposal-gm', authorizerUid: captured.uid, proposalId: proposal.proposalId }, confirmed(room));
    if (staged.existing) {respondInstalled(ack, resultFor(room, staged.existing)); return;}
    admit(room, staged);
    proposals.get(room).delete(data.proposalId);
    const result = resultFor(room, staged.receipt);
    publishInstalled(room, 'actor_consequence_accepted', result, ack);
  });
  run('actor_recovery', async(data, ack) => {
    actors.keys(data, ['roomId', 'ref', 'locator']);
    if (!!data.ref === !!data.locator) {actors.fail('invalid_consequence');}
    const { room, player, uid } = context(data.roomId);
    let token;
    if (data.locator) {
      actors.keys(data.locator, ['kind', 'mapId', 'tokenId']);
      if (!['creature', 'character'].includes(data.locator.kind) || typeof data.locator.mapId !== 'string' || typeof data.locator.tokenId !== 'string' ||
        !actors.own(room.gameState.maps, data.locator.mapId)) {actors.fail('actor_not_found');}
      const map = room.gameState.maps[data.locator.mapId];
      const field = data.locator.kind === 'character' ? 'characterTokens' : 'tokens';
      if (!actors.own(map[field], data.locator.tokenId)) {actors.fail('actor_not_found');}
      token = map[field][data.locator.tokenId];
    } else {token = actors.locate(room, data.ref, true, true).token;}
    // P4 owner-private recovery: GM privilege alone is not private-data consent.
    if (token.ownerUserId ? token.ownerUserId !== uid : !player.isGM) {actors.fail('forbidden');}
    const validated = require('../services/roomCheckpoint').canonicalize(token, 'recovery');
    if (validated.error) {actors.fail('unsupported_actor_contract', validated.error);}
    const recovery = actors.clone({ actorRecovery: token.state?.actorRecovery || null, conditions: token.state?.conditions || [], rawToken: token });
    // Owner-private recovery is not permission to disclose a concealed attacker.
    const redact = value => {
      if (!value || typeof value !== 'object') return value;
      if (value.target?.kind === 'character' && require('../../vtt-react/src/services/authoredCondition').namedRecord(value)) return actors.publicCondition(value);
      return Array.isArray(value) ? value.map(redact) : Object.fromEntries(Object.entries(value).map(([k, v]) => [k, redact(v)]));
    };
    respond(ack, { success: true, recovery: redact(recovery) });
  });
  // P12A owner strike approvals (contract revision 3a §2.6): the same owner-approval flow as P9
  // over the strike registry. Only the GM's direct actor_consequence consumes an entry.
  const strikes = require('../services/strikeApprovals');
  const riposte = require('../services/riposteExecution');
  const closeStrike = (room, approvalId, code) => {
    const entry = strikes.get(room, approvalId);
    if (!entry) {return false;}
    strikes.close(room, approvalId, code);
    const payload = { roomId: room.id, approvalId, contentHash: entry.contentHash, code };
    const event = riposte.isApproval(entry.approval) ? 'actor_riposte_closed' : 'actor_strike_closed';
    toUid(room, entry.approval.source.ownerUid, event, payload); toGm(room, event, payload);
    return true;
  };
  const ownsSource = (room, player, uid, approval) => {
    const source = actors.locate(room, approval.source);
    if (!actors.permitted(room, player, uid, approval.source, source.token) || source.token.ownerUserId !== uid) {actors.fail('forbidden');}
  };
  run('actor_strike_approve', async(approval, ack) => {
    strikes.validateApproval(approval);
    const captured = context(approval.roomId);
    const { room, player, uid } = captured;
    const contentHash = actors.hash(approval);
    const consumed = strikes.consumedReceipt(room, approval.approvalId);
    if (consumed) {
      if (consumed.authorization.approvalHash !== contentHash || consumed.source?.ownerUid !== uid) {actors.fail('command_id_conflict');}
      respondInstalled(ack, resultFor(room, consumed)); return;
    }
    const existing = strikes.get(room, approval.approvalId);
    if (existing) {
      if (existing.contentHash !== contentHash) {actors.fail('command_id_conflict');}
      respond(ack, { success: false, code: 'awaiting_gm', approvalId: approval.approvalId, contentHash }); return;
    }
    if (strikes.closedCode(room, approval.approvalId)) {
      actors.fail(strikes.closedCode(room, approval.approvalId) === 'consumed' ? 'retry_window_expired' : `approval_${strikes.closedCode(room, approval.approvalId)}`);
    }
    if (strikes.foreignId(room, approval.approvalId)) {actors.fail('command_id_conflict');}
    if (approval.actionEpoch !== actors.epoch(room)) {actors.fail('outcome_unknown');}
    strikes.checkWindow(room, approval);
    if (uid !== approval.source.ownerUid) {actors.fail('forbidden');}
    ownsSource(room, player, uid, approval);
    strikes.checkAgainstRoom(room, approval);
    await confirm(captured);
    ownsSource(room, captured.player, uid, approval);
    // Authority checks yield: another request may have registered, closed or consumed this ID.
    const afterAwait = strikes.consumedReceipt(room, approval.approvalId);
    if (afterAwait) {
      if (afterAwait.authorization.approvalHash !== contentHash || afterAwait.source?.ownerUid !== uid) {actors.fail('command_id_conflict');}
      respondInstalled(ack, resultFor(room, afterAwait)); return;
    }
    const pending = strikes.get(room, approval.approvalId);
    if (pending) {
      if (pending.contentHash !== contentHash) {actors.fail('command_id_conflict');}
      respond(ack, { success: false, code: 'awaiting_gm', approvalId: approval.approvalId, contentHash }); return;
    }
    const closed = strikes.closedCode(room, approval.approvalId);
    if (closed) {actors.fail(closed === 'consumed' ? 'retry_window_expired' : `approval_${closed}`);}
    if (strikes.foreignId(room, approval.approvalId)) {actors.fail('command_id_conflict');}
    if (approval.actionEpoch !== actors.epoch(room)) {actors.fail('outcome_unknown');}
    strikes.checkWindow(room, approval);
    strikes.checkAgainstRoom(room, approval);
    const entry = strikes.add(room, { approval: actors.clone(approval), contentHash, ownerUid: uid });
    toGm(room, riposte.isApproval(approval) ? 'actor_riposte_pending' : 'actor_strike_pending', { roomId: room.id, approval: actors.clone(entry.approval), contentHash, submitterUid: uid });
    respond(ack, { success: false, code: 'awaiting_gm', approvalId: approval.approvalId, contentHash });
  });
  run('actor_strike_withdraw', async(data, ack) => {
    actors.keys(data, ['roomId', 'approvalId']);
    const { room, uid } = context(data.roomId);
    const consumed = strikes.consumedReceipt(room, data.approvalId);
    if (consumed) {
      if (consumed.source?.ownerUid !== uid) {actors.fail('forbidden');}
      respondInstalled(ack, resultFor(room, consumed)); return;
    }
    const entry = strikes.get(room, data.approvalId);
    if (!entry) {actors.fail(strikes.closedCode(room, data.approvalId) ? `approval_${strikes.closedCode(room, data.approvalId)}` : 'outcome_unknown');}
    if (entry.approval.source.ownerUid !== uid) {actors.fail('forbidden');}
    closeStrike(room, data.approvalId, 'withdrawn');
    respond(ack, { success: true, code: 'withdrawn', approvalId: data.approvalId, contentHash: entry.contentHash });
  });
  run('actor_strike_decline', async(data, ack) => {
    actors.keys(data, ['roomId', 'approvalId']);
    const captured = context(data.roomId);
    if (!captured.player.isGM) {actors.fail('forbidden');}
    const consumed = strikes.consumedReceipt(captured.room, data.approvalId);
    if (consumed) {respondInstalled(ack, resultFor(captured.room, consumed)); return;}
    if (!strikes.get(captured.room, data.approvalId)) {actors.fail('outcome_unknown');}
    closeStrike(captured.room, data.approvalId, 'declined');
    respond(ack, { success: true, code: 'declined', approvalId: data.approvalId });
  });
  run('actor_strike_list', async(data, ack) => {
    actors.keys(data, ['roomId', 'capability']);
    if (data.capability !== undefined && data.capability !== riposte.CAPABILITY) {actors.fail('invalid_strike_approval');}
    const { room, player, uid } = context(data.roomId);
    const pending = [];
    const selected = strikes.listAll(room).filter(e => riposte.isApproval(e.approval) === (data.capability === riposte.CAPABILITY));
    for (const own of selected.filter(e => e.approval.source.ownerUid === uid)) {pending.push({ approval: actors.clone(own.approval), contentHash: own.contentHash, own: true });}
    if (player.isGM) {
      for (const entry of selected) {pending.push({ approval: actors.clone(entry.approval), contentHash: entry.contentHash, submitterUid: entry.ownerUid });}
    }
    respond(ack, { success: true, roomId: room.id, pending });
  });

  const notifyRiposte = (room, opportunity) => {
    toGm(room, 'actor_riposte_changed', { roomId: room.id });
    toUid(room, opportunity.source.ownerUid, 'actor_riposte_changed', { roomId: room.id });
  };
  run('actor_riposte_parent', async(data, ack) => {
    const c = context(data.roomId); if (!c.player.isGM) {actors.fail('forbidden');} await confirm(c);
    respond(ack, { success: true, roomId: c.room.id, parent: riposte.registerParent(c.room, c.uid, data) });
  });
  run('actor_riposte_offer', async(data, ack) => {
    const c = context(data.roomId); if (!c.player.isGM) {actors.fail('forbidden');}
    await confirm(c);
    const result = riposte.offer(c.room, c.uid, data);
    if (result.receipt) {respondInstalled(ack, resultFor(c.room, result.receipt)); return;}
    respond(ack, { success: true, roomId: c.room.id, opportunity: riposte.project(c.room, result.opportunity, true), fresh: result.fresh });
    notifyRiposte(c.room, result.opportunity);
    if (result.fresh) {
      toUid(c.room, result.opportunity.source.ownerUid, 'reaction_window_changed', { roomId: c.room.id });
      toGm(c.room, 'reaction_window_changed', { roomId: c.room.id });
    }
  });
  run('actor_riposte_list', async(data, ack) => {
    actors.keys(data, ['roomId']); const c = context(data.roomId); await confirm(c);
    respond(ack, { success: true, roomId: c.room.id, viewerRole: c.player.isGM ? 'gm' : 'owner', actionEpoch: actors.epoch(c.room), opportunities: riposte.list(c.room, { uid: c.uid, gm: c.player.isGM }) });
  });
  for (const event of ['actor_riposte_cancel', 'actor_riposte_revalidate']) {
    run(event, async(data, ack) => {
      actors.keys(data, ['roomId', 'opportunityId']); const c = context(data.roomId);
      if (!c.player.isGM) {actors.fail('forbidden');} await confirm(c);
      const p = riposte.get(c.room, data.opportunityId); if (!p) {actors.fail('riposte_opportunity_unavailable');}
      const receipt = riposte.receipt(c.room, p.id);
      if (receipt) {respondInstalled(ack, resultFor(c.room, receipt)); return;}
      if (event === 'actor_riposte_revalidate' && p.attempt && p.attempt.status !== 'refused') {actors.fail('riposte_attempt_unknown');}
      if (p.approvalId && strikes.get(c.room, p.approvalId)) {closeStrike(c.room, p.approvalId, event === 'actor_riposte_cancel' ? 'declined' : 'revalidated');}
      const next = event === 'actor_riposte_cancel' ? riposte.cancel(c.room, p.id) : riposte.revalidate(c.room, p.id);
      respond(ack, { success: true, roomId: c.room.id, opportunity: riposte.project(c.room, next, true) }); notifyRiposte(c.room, next);
    });
  }

  // ── P12B blocking (frozen contract revision 4 §3) ─────────────────────────
  // Declarations are owner/GM-scoped: never in the general token projection or other members' events.
  function pushBlocking(room, receipt) {
    for (const actor of receipt?.actors || []) {
      if (!actor.blocking && !actor.equipmentWear) {continue;}
      let declaration = null;
      try {declaration = blocks.scopedView(actors.locate(room, actor.ref).token);} catch (_) {continue;}
      const payload = { roomId: room.id, ref: actors.clone(actor.ref), declaration, commitSequence: receipt.commitSequence };
      toUid(room, actor.ref.ownerUid, 'actor_blocking_changed', payload);
      if (room.gmId !== actor.ref.ownerUid) {toGm(room, 'actor_blocking_changed', payload);}
    }
  }
  /** §3.9 R4: the offer closes with its recorded outcome; owner and GM are told, nobody may roll it again. */
  function closeOfferFor(room, commandId, code, approval = null) {
    const tombstone = blocks.closeOffer(room, commandId, code, approval);
    if (!tombstone) {return null;}
    const payload = { roomId: room.id, commandId, code, closed: actors.clone(tombstone) };
    toUid(room, tombstone.target.ownerUid, 'actor_block_offer_closed', payload);
    if (room.gmId !== tombstone.target.ownerUid) {toGm(room, 'actor_block_offer_closed', payload);}
    return tombstone;
  }
  function closeBlock(room, approvalId, code) {
    const entry = blocks.get(room, approvalId);
    if (!entry) {return false;}
    blocks.close(room, approvalId, code);
    const payload = { roomId: room.id, approvalId, contentHash: entry.contentHash, code };
    toUid(room, entry.approval.target.ownerUid, 'actor_block_closed', payload); toGm(room, 'actor_block_closed', payload);
    return true;
  }
  const ownsTarget = (room, player, uid, ref) => {
    const target = actors.locate(room, ref);
    if (!actors.permitted(room, player, uid, ref, target.token) || target.token.ownerUserId !== uid) {actors.fail('forbidden');}
    return target;
  };
  run('actor_blocking_view', async(data, ack) => {
    actors.keys(data, ['roomId', 'ref']);
    const { room, player, uid } = context(data.roomId);
    actors.validateRef(data.ref);
    if (data.ref.kind !== 'character') {actors.fail('invalid_consequence');}
    if (!player.isGM && uid !== data.ref.ownerUid) {actors.fail('forbidden');}
    const located = actors.locate(room, data.ref);
    if (!player.isGM) {ownsTarget(room, player, uid, data.ref);}
    respond(ack, { success: true, roomId: room.id, ref: actors.refFor(located.contract), contractRevision: located.contract.revision, declaration: blocks.scopedView(located.token),
      commitSequence: actors.ledger(room).commitSequence });
  });
  run('actor_block_offer', async(data, ack) => {
    actors.keys(data, ['roomId', 'commandId', 'attack']);
    data = actors.clone(data);
    const captured = context(data.roomId);
    if (!captured.player.isGM) {actors.fail('forbidden');}
    blocks.validateAttack(data.attack);
    const { room } = captured;
    if (data.attack.source.roomId !== room.id) {actors.fail('invalid_block_offer');}
    const check = () => {
      actors.assertCanAct(room, data.attack.source);
      const source = actors.locate(room, data.attack.source);
      if (source.contract.revision !== data.attack.sourceRevision) {actors.fail('stale_actor_revision');}
      if (data.attack.authored && actors.locate(room, data.attack.target).contract.revision !== data.attack.authored.targetRevision) actors.fail('stale_actor_revision');
      blocks.checkOfferTarget(room, data.attack);
    };
    check();
    await confirm(captured);
    if (!captured.player.isGM) {actors.fail('forbidden');}
    check();
    const offer = blocks.addOffer(room, data.commandId, data.attack, blocks.sourceBaseline(room, data.attack.source));
    const payload = { roomId: room.id, commandId: offer.commandId, attack: actors.clone(offer.attack), attackHash: offer.attackHash };
    toUid(room, data.attack.target.ownerUid, 'actor_block_offered', payload);
    respond(ack, { success: true, ...payload });
  });
  run('actor_block_approve', async(approval, ack) => {
    blocks.validateApproval(approval);
    approval = actors.clone(approval);
    const captured = context(approval.roomId);
    const { room, player, uid } = captured;
    if (uid !== approval.target.ownerUid) {actors.fail('forbidden');}
    const contentHash = actors.hash(approval);
    const settled = () => {
      const consumed = blocks.consumedReceipt(room, approval.approvalId);
      if (consumed) {
        if (consumed.authorization.approvalHash !== contentHash || consumed.target?.ownerUid !== uid) {actors.fail('command_id_conflict');}
        respondInstalled(ack, resultFor(room, consumed)); return true;
      }
      const existing = blocks.get(room, approval.approvalId);
      if (existing) {
        if (existing.contentHash !== contentHash) {actors.fail('command_id_conflict');}
        respond(ack, { success: false, code: 'awaiting_gm', approvalId: approval.approvalId, contentHash }); return true;
      }
      const closed = blocks.closedCode(room, approval.approvalId);
      if (closed) {actors.fail(closed === 'consumed' ? 'retry_window_expired' : `approval_${closed}`);}
      if (blocks.foreignId(room, approval.approvalId)) {actors.fail('command_id_conflict');}
      if (approval.actionEpoch !== actors.epoch(room)) {actors.fail('outcome_unknown');}
      blocks.checkWindow(room, approval);
      return false;
    };
    if (settled()) {return;}
    if (uid !== approval.target.ownerUid) {actors.fail('forbidden');}
    ownsTarget(room, player, uid, approval.target);
    blocks.checkAgainstRoom(room, approval);
    await confirm(captured);
    // Authority checks yield: another request may have registered, closed or consumed this ID.
    ownsTarget(room, captured.player, uid, approval.target);
    if (settled()) {return;}
    blocks.checkAgainstRoom(room, approval);
    const entry = blocks.add(room, { approval: actors.clone(approval), contentHash, ownerUid: uid });
    toGm(room, 'actor_block_pending', { roomId: room.id, approval: actors.clone(entry.approval), contentHash, submitterUid: uid });
    respond(ack, { success: false, code: 'awaiting_gm', approvalId: approval.approvalId, contentHash });
  });
  run('actor_block_withdraw', async(data, ack) => {
    actors.keys(data, ['roomId', 'approvalId', 'commandId']);
    const { room, uid } = context(data.roomId);
    if (data.commandId && !data.approvalId) {
      const offer = blocks.getOffer(room, data.commandId) || blocks.closedOffer(room, data.commandId);
      if (!offer) actors.fail('outcome_unknown');
      const target = offer.attack?.target || offer.target;
      if (target.ownerUid !== uid) actors.fail('forbidden');
      if (blocks.listAll(room).some(e => e.approval.attack.commandId === data.commandId)) actors.fail('approval_pending');
      closeOfferFor(room, data.commandId, 'withdrawn');
      respond(ack, { success: true, code: 'withdrawn', commandId: data.commandId }); return;
    }
    const consumed = blocks.consumedReceipt(room, data.approvalId);
    if (consumed) {
      if (consumed.target?.ownerUid !== uid) {actors.fail('forbidden');}
      respondInstalled(ack, resultFor(room, consumed)); return;
    }
    const entry = blocks.get(room, data.approvalId);
    if (!entry) {actors.fail(blocks.closedCode(room, data.approvalId) ? `approval_${blocks.closedCode(room, data.approvalId)}` : 'outcome_unknown');}
    if (entry.approval.target.ownerUid !== uid) {actors.fail('forbidden');}
    closeBlock(room, data.approvalId, 'withdrawn');
    closeOfferFor(room, entry.approval.attack.commandId, 'withdrawn', entry.approval);
    respond(ack, { success: true, code: 'withdrawn', approvalId: data.approvalId, contentHash: entry.contentHash });
  });
  run('actor_block_decline', async(data, ack) => {
    actors.keys(data, ['roomId', 'approvalId', 'commandId', 'attack']);
    const captured = context(data.roomId);
    if (!captured.player.isGM) {actors.fail('forbidden');}
    const { room } = captured;
    if (data.approvalId !== undefined) {
      const consumed = blocks.consumedReceipt(room, data.approvalId);
      if (consumed) {respondInstalled(ack, resultFor(room, consumed)); return;}
      const entry = blocks.get(room, data.approvalId);
      if (!entry) {actors.fail('outcome_unknown');}
      closeBlock(room, data.approvalId, 'declined');
      closeOfferFor(room, entry.approval.attack.commandId, 'voided', entry.approval);
      respond(ack, { success: true, code: 'declined', approvalId: data.approvalId }); return;
    }
    // Withdraw an unapproved offer; an approval naming it can no longer register.
    if (typeof data.commandId !== 'string') {actors.fail('invalid_consequence');}
    if (blocks.listAll(room).some(entry => entry.approval.attack.commandId === data.commandId)) {actors.fail('approval_pending');}
    if (!blocks.getOffer(room, data.commandId) && !blocks.closedOffer(room, data.commandId)) {
      const receipt = actors.ledger(room).receipts.find(r => r.commandId === data.commandId);
      if (receipt) {
        if (receipt.submitterUid !== captured.uid) actors.fail('forbidden');
        respondInstalled(ack, resultFor(room, receipt)); return;
      }
      // A5 positive closure of retained never-registered bytes. This creates only the existing
      // offer tombstone, never action authority. Old epochs/unknown-pruned windows cannot renew it.
      if (!data.attack?.authored) actors.fail('outcome_unknown');
      blocks.validateAttack(data.attack);
      const a = data.attack.authored.attempt;
      if (a.sourceAuthority.gmUid !== captured.uid || a.roomId !== room.id) actors.fail('forbidden');
      if (a.actionEpoch !== actors.epoch(room)) actors.fail('outcome_unknown');
      payments.checkWindow(room, a);
      blocks.addOffer(room, data.commandId, data.attack);
    }
    closeOfferFor(room, data.commandId, 'withdrawn_by_gm');
    respond(ack, { success: true, code: 'offer_closed', commandId: data.commandId });
  });
  run('actor_block_list', async(data, ack) => {
    actors.keys(data, ['roomId']);
    const { room, player, uid } = context(data.roomId);
    const pending = [], offered = [];
    const own = blocks.pendingFor(room, uid);
    if (own) {pending.push({ approval: actors.clone(own.approval), contentHash: own.contentHash, own: true });}
    for (const offer of blocks.listOffers(room)) {
      if (player.isGM || offer.attack.target.ownerUid === uid) {offered.push({ commandId: offer.commandId, attack: actors.clone(offer.attack), attackHash: offer.attackHash });}
    }
    if (player.isGM) {
      for (const entry of blocks.listAll(room)) {pending.push({ approval: actors.clone(entry.approval), contentHash: entry.contentHash, submitterUid: entry.ownerUid });}
    }
    // §3.9 R4: recorded outcomes of closed offers, for the GM and the target's owner only.
    const closedOffers = blocks.listClosedOffers(room, value => player.isGM || value.target.ownerUid === uid);
    respond(ack, { success: true, roomId: room.id, pending, offered, closedOffers });
  });
}
module.exports = { registerActorConsequenceHandlers };
