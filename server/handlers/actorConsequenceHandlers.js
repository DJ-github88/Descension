const actors = require('../services/actorConsequences');
const access = require('../services/roomAccessService');
const payments = require('../services/spellPayments');
const proposals = new WeakMap();

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
    return { room, player, uid: socket.data.userId, token: room.authorityToken, socketId: socket.id, socketRef: socket };
  };
  const current = captured => {
    const now = context(captured.room.id);
    if (rooms.get(captured.room.id) !== captured.room || now.room !== captured.room || now.player !== captured.player || now.uid !== captured.uid ||
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
    try {await action(data, ack);} catch (error) {respond(ack, { success: false, code: error.code || 'invalid_consequence', error: error.message });}
  }));

  run('actor_snapshot', async(data, ack) => {
    actors.keys(data, ['roomId']);
    const { room } = context(data.roomId);
    const state = actors.ledger(room);
    respond(ack, { success: true, ...require('../services/actorProjection').snapshot(room), actionEpoch: actors.epoch(room), commitSequence: state.commitSequence, replayFloor: state.replayFloor,
      bindings: Object.entries(room.gameState.maps || {}).flatMap(([mapId, map]) => ['tokens', 'creatures', 'characterTokens'].flatMap(field =>
        Object.entries(map[field] || {}).map(([tokenId, token]) => ({ mapId, tokenId, kind: field === 'characterTokens' ? 'character' : 'creature', snapshotHash: actors.hash(token) })))) });
  });
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
      // P9: a changed class home invalidates the owner's approved price/typed result.
      if (error.code === 'owner_reapproval_required' && command.approval) {closeApproval(captured.room, command.approval.approvalId, 'owner_reapproval_required');}
      throw error;
    }
    if (staged.existing) {respondInstalled(ack, resultFor(captured.room, staged.existing)); return;}
    admit(captured.room, staged);
    // Approval consumption is synchronous with installation (no await between).
    if (staged.approved) {payments.close(captured.room, staged.approved.approval.approvalId, 'consumed');}
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
    return true;
  };
  // P9 owner approval: the owner authorizes their own price/typed result; the GM
  // later adjudicates the cross-actor outcome through one strict actor_consequence.
  run('actor_spell_approve', async(approval, ack) => {
    payments.validateApproval(approval);
    const captured = context(approval.roomId);
    const { room, player, uid } = captured;
    const contentHash = actors.hash(approval);
    const consumed = payments.consumedReceipt(room, approval.approvalId);
    if (consumed) {
      if (consumed.authorization.approvalHash !== contentHash || consumed.source?.ownerUid !== uid) {actors.fail('command_id_conflict');}
      respondInstalled(ack, resultFor(room, consumed)); return;
    }
    const existing = payments.get(room, approval.approvalId);
    if (existing) {
      if (existing.contentHash !== contentHash) {actors.fail('command_id_conflict');}
      respond(ack, { success: false, code: 'awaiting_gm', approvalId: approval.approvalId, contentHash }); return;
    }
    if (payments.closedCode(room, approval.approvalId)) {
      // A consumed approval whose receipt was pruned cannot be re-registered or re-confirmed.
      actors.fail(payments.closedCode(room, approval.approvalId) === 'consumed' ? 'retry_window_expired' : `approval_${payments.closedCode(room, approval.approvalId)}`);
    }
    if (approval.actionEpoch !== actors.epoch(room)) {actors.fail('outcome_unknown');}
    payments.checkWindow(room, approval);
    if (uid !== approval.source.ownerUid) {actors.fail('forbidden');}
    const source = actors.locate(room, approval.source);
    if (!actors.permitted(room, player, uid, approval.source, source.token) || source.token.ownerUserId !== uid) {actors.fail('forbidden');}
    payments.checkAgainstRoom(room, approval);
    await confirm(captured);
    const latest = actors.locate(room, approval.source);
    if (!actors.permitted(room, captured.player, uid, approval.source, latest.token) || latest.token.ownerUserId !== uid) {actors.fail('forbidden');}
    payments.checkAgainstRoom(room, approval);
    if (payments.get(room, approval.approvalId)) {respond(ack, { success: false, code: 'awaiting_gm', approvalId: approval.approvalId, contentHash }); return;}
    const entry = payments.add(room, { approval: actors.clone(approval), contentHash, ownerUid: uid });
    toGm(room, 'actor_spell_pending', { roomId: room.id, approval: payments.gmProjection(entry), contentHash, submitterUid: uid });
    respond(ack, { success: false, code: 'awaiting_gm', approvalId: approval.approvalId, contentHash });
  });
  run('actor_spell_withdraw', async(data, ack) => {
    actors.keys(data, ['roomId', 'approvalId']);
    const { room, uid } = context(data.roomId);
    const consumed = payments.consumedReceipt(room, data.approvalId);
    if (consumed) {
      if (consumed.source?.ownerUid !== uid) {actors.fail('forbidden');}
      respondInstalled(ack, resultFor(room, consumed)); return;
    }
    const entry = payments.get(room, data.approvalId);
    if (!entry) {actors.fail(payments.closedCode(room, data.approvalId) ? `approval_${payments.closedCode(room, data.approvalId)}` : 'outcome_unknown');}
    if (entry.approval.source.ownerUid !== uid) {actors.fail('forbidden');}
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
      for (const entry of payments.listAll(room)) {pending.push({ approval: payments.gmProjection(entry), contentHash: entry.contentHash, submitterUid: entry.ownerUid });}
    }
    respond(ack, { success: true, roomId: room.id, pending });
  });
  run('actor_propose', async(command, ack) => {
    actors.validateCommand(command);
    // Repair B1: owner spell approvals are consumed only by the GM's direct consequence.
    if (command.approval || command.actors.some(actor => actor.classPayment)) {actors.fail('approval_requires_gm');}
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
    respond(ack, { success: true, recovery: actors.clone({ actorRecovery: token.state?.actorRecovery || null, conditions: token.state?.conditions || [], rawToken: token }) });
  });
}
module.exports = { registerActorConsequenceHandlers };
