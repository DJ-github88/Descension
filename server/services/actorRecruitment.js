const actors = require('./actorConsequences');

const CODES = Object.freeze({
  forbidden: 'forbidden',
  invalid_recruit: 'invalid_recruit',
  invalid_recipient: 'invalid_recipient',
  source_not_creature: 'source_not_creature',
  stale_actor_revision: 'stale_actor_revision',
  actor_binding_conflict: 'actor_binding_conflict',
  recipient_not_in_room: 'recipient_not_in_room',
  recipient_not_in_party: 'recipient_not_in_party',
  party_source_unresolved: 'party_source_unresolved',
  party_actor_missing: 'party_actor_missing',
  party_revision_unavailable: 'party_revision_unavailable',
  relationship_contract_unavailable: 'relationship_contract_unavailable',
  relationship_revision_conflict: 'relationship_revision_conflict',
  source_not_hostile: 'source_not_hostile',
  roster_contract_unavailable: 'roster_contract_unavailable',
  roster_revision_conflict: 'roster_revision_conflict',
  already_recruited: 'already_recruited',
  placement_identity_conflict: 'placement_identity_conflict',
  active_actor_elsewhere: 'active_actor_elsewhere',
  roster_snapshot_capacity: 'roster_snapshot_capacity',
  roster_capacity: 'roster_capacity',
  roster_entry_missing: 'roster_entry_missing',
  companion_inactive: 'companion_inactive',
  companion_placement_engine_unavailable: 'companion_placement_engine_unavailable',
  active_actor_missing: 'active_actor_missing'
});

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const RECRUIT_KEYS = ['version', 'roomId', 'commandId', 'actionEpoch', 'baseCommitSequence', 'source',
  'expectedSourceRevision', 'recipientUid', 'expectedPartyRevision', 'expectedRelationshipRevision', 'expectedRosterRevision'];
const LIST_KEYS = ['roomId', 'rosterRevision'];
const PLACE_KEYS = ['version', 'roomId', 'commandId', 'baseCommitSequence', 'rosterId', 'expectedRosterRevision',
  'mapId', 'position', 'expectedActiveRef', 'actionEpoch'];

const refuse = code => ({ ok: false, code });
const integer = value => Number.isSafeInteger(value) && value >= 0;
const string = value => typeof value === 'string' && value.length > 0 && value.length <= 300;
const refKey = ref => ref ? [ref.kind, ref.roomId, ref.mapId, ref.tokenId, ref.instanceId].join('|') : '';
const fail = (code, message = code) => { const error = new Error(message); error.code = code; throw error; };

function planRecruitment(input) {
  if (!input || typeof input !== 'object') {return refuse(CODES.invalid_recruit);}
  const { gm, source, expected, recipient, party, relationship, roster, placement } = input;
  if (!gm || !source || !expected || !recipient || !party || !relationship || !placement) {return refuse(CODES.invalid_recruit);}

  if (gm.isGM !== true || !string(gm.uid) || !string(gm.roomId) || gm.roomId !== source.roomId) {
    return refuse(CODES.forbidden);
  }
  if (source.kind !== 'creature' || !source.ref || source.ref.kind !== 'creature' ||
      !string(source.ref.roomId) || !string(source.ref.mapId) || !string(source.ref.tokenId) ||
      !string(source.ref.instanceId) || source.ref.roomId !== source.roomId ||
      source.ref.tokenId !== source.tokenId || source.ref.instanceId !== source.instanceId ||
      !integer(source.revision)) {
    return refuse(CODES.source_not_creature);
  }
  if (expected.instanceId !== source.instanceId || expected.revision !== source.revision) {
    return refuse(CODES.stale_actor_revision);
  }
  if (!string(recipient.uid) || recipient.inRoom !== true) {return refuse(CODES.recipient_not_in_room);}
  if (recipient.partyMember !== true || !string(recipient.partyId) || recipient.partyId !== party.id ||
      !Array.isArray(party.actorRefs) || party.actorRefs.length === 0 || !recipient.actorRef) {
    return refuse(CODES.recipient_not_in_party);
  }
  if (relationship.available !== true) {return refuse(CODES.relationship_contract_unavailable);}
  if (!integer(relationship.revision) || expected.relationshipRevision !== relationship.revision) {
    return refuse(CODES.relationship_revision_conflict);
  }
  let sourceRelation;
  try {
    sourceRelation = relationship.get(source.ref, recipient.actorRef);
  } catch (_) {
    return refuse(CODES.relationship_contract_unavailable);
  }
  if (sourceRelation !== 'enemy') {return refuse(CODES.source_not_hostile);}
  if (roster && integer(roster.revision) && integer(roster.expectedRevision) && roster.expectedRevision !== roster.revision) {
    return refuse(CODES.roster_revision_conflict);
  }

  const existing = roster && roster.entryForSource ? roster.entryForSource : null;
  if (existing && existing.recipientUid === recipient.uid) {return refuse(CODES.already_recruited);}
  if (placement.stableTokenId !== source.tokenId) {return refuse(CODES.actor_binding_conflict);}
  if (placement.conflictingEntry) {return refuse(CODES.placement_identity_conflict);}
  if (placement.elsewhere) {return refuse(CODES.active_actor_elsewhere);}
  if (placement.placedToken) {
    if (placement.placedToken.tokenId !== placement.stableTokenId ||
        placement.placedToken.instanceId !== source.instanceId) {
      return refuse(CODES.placement_identity_conflict);
    }
  }

  const partyRefs = [];
  const seen = new Set();
  for (const ref of party.actorRefs) {
    const key = refKey(ref);
    if (!key || seen.has(key)) {continue;}
    seen.add(key);
    partyRefs.push(ref);
  }
  if (!partyRefs.some(ref => refKey(ref) === refKey(recipient.actorRef))) {
    return refuse(CODES.recipient_not_in_party);
  }

  return {
    ok: true,
    action: 'recruit',
    source: {
      ref: source.ref,
      tokenId: source.tokenId,
      instanceId: source.instanceId,
      revision: source.revision,
      nextRevision: source.revision + 1
    },
    ownership: {
      ownerUserId: recipient.uid,
      ownerPlayerId: recipient.playerId || null,
      playerId: recipient.playerId || null
    },
    clearDelegation: true,
    priorOwnerCleanup: existing ? {
      recipientUid: existing.recipientUid || null,
      sourceRef: existing.sourceRef || source.ref,
      rosterId: existing.rosterId || null
    } : null,
    roster: {
      rosterId: require('./companionRoster').rosterIdFor(source.ref),
      recipientUid: recipient.uid,
      partyId: party.id,
      sourceRef: source.ref,
      stableTokenId: placement.stableTokenId,
      state: 'placed',
      activeRef: source.ref,
      priorEntry: existing || null
    },
    relationship: {
      revision: relationship.revision,
      nextRevision: relationship.revision + 1,
      updates: partyRefs.map(ref => ({ a: source.ref, b: ref, value: 'ally' }))
    },
    placement: {
      stableTokenId: placement.stableTokenId,
      tokenId: source.tokenId,
      instanceId: source.instanceId,
      mode: 'existing-token'
    },
    pendingApprovals: { revalidate: true }
  };
}

function validate(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request) ||
      Object.keys(request).some(key => !RECRUIT_KEYS.includes(key))) {fail(CODES.invalid_recruit);}
  if (request.version !== 1 || !string(request.roomId) || !UUID.test(request.commandId || '') ||
      !string(request.actionEpoch) || !integer(request.baseCommitSequence) || !string(request.recipientUid) ||
      !integer(request.expectedSourceRevision) || !integer(request.expectedRelationshipRevision) ||
      !integer(request.expectedRosterRevision) || actors.bytes(request) > 8192) {fail(CODES.invalid_recruit);}
  if (request.expectedPartyRevision !== undefined && request.expectedPartyRevision !== null && !integer(request.expectedPartyRevision)) {
    fail(CODES.invalid_recruit);
  }
  try {
    actors.validateRef(request.source);
  } catch (error) {
    fail(CODES.invalid_recruit, error.message);
  }
  if (request.source.kind !== 'creature') {fail(CODES.source_not_creature);}
  if (request.source.roomId !== request.roomId) {fail(CODES.invalid_recruit);}
}

function validateList(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).some(key => !LIST_KEYS.includes(key)) ||
      !string(data.roomId) || (data.rosterRevision !== undefined && !integer(data.rosterRevision))) {
    fail(CODES.invalid_recruit);
  }
}

function validatePlace(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).some(key => !PLACE_KEYS.includes(key))) {
    fail(CODES.invalid_recruit);
  }
  if (data.version !== 1 || !string(data.roomId) || !UUID.test(data.commandId || '') || !integer(data.baseCommitSequence) ||
      !string(data.rosterId) || !integer(data.expectedRosterRevision) || !string(data.mapId) || !string(data.actionEpoch) ||
      !data.position || typeof data.position !== 'object' || Array.isArray(data.position)) {fail(CODES.invalid_recruit);}
  if (data.expectedActiveRef !== undefined && data.expectedActiveRef !== null) {
    try {
      actors.validateRef(data.expectedActiveRef);
    } catch (error) {
      fail(CODES.invalid_recruit, error.message);
    }
  }
}

function stage(room, player, uid, request, confirmedRevision, dependencies = {}) {
  validate(request);
  if (!player || player.isGM !== true) {fail(CODES.forbidden);}
  if (request.roomId !== room.id) {fail(CODES.invalid_recruit);}

  const prior = actors.ledger(room);
  if (request.actionEpoch !== actors.epoch(room)) {fail('outcome_unknown');}
  if (request.baseCommitSequence < prior.replayFloor) {fail('retry_window_expired');}
  if (request.baseCommitSequence > prior.commitSequence) {fail(CODES.invalid_recruit);}

  let located;
  try {
    located = actors.locate(room, request.source);
  } catch (error) {
    if (error.code === 'actor_binding_conflict' || error.code === 'unsupported_actor_contract') {throw error;}
    fail(CODES.actor_binding_conflict, error.message);
  }
  if (request.source.kind !== 'creature') {fail(CODES.source_not_creature);}
  if (located.contract.revision !== request.expectedSourceRevision) {fail(CODES.stale_actor_revision);}

  const recipient = [...(room.players?.values?.() || [])].find(member =>
    member && member.isGM !== true && member.userId === request.recipientUid);
  if (!recipient) {fail(CODES.recipient_not_in_room);}
  if (request.recipientUid === room.gmId) {fail(CODES.invalid_recipient);}

  const partySource = dependencies.partySource || require('./partySource');
  const relationships = dependencies.relationships || require('./actorRelationships');
  const roster = dependencies.roster || require('./companionRoster');

  const party = partySource.resolve(room, request.recipientUid);
  if (!party || party.ok !== true) {fail(party?.code || CODES.party_source_unresolved);}
  if (request.expectedPartyRevision !== undefined && request.expectedPartyRevision !== null) {
    if (party.revision === null || party.revision === undefined || party.revision !== request.expectedPartyRevision) {
      fail(CODES.party_revision_unavailable);
    }
  }

  let relationshipRevision;
  try {
    relationshipRevision = relationships.revision(room);
  } catch (error) {
    fail(error.code || CODES.relationship_contract_unavailable, error.message);
  }
  if (relationshipRevision !== request.expectedRelationshipRevision) {fail(CODES.relationship_revision_conflict);}

  let rosterRevision;
  try {
    rosterRevision = roster.revision(room);
  } catch (error) {
    fail(error.code || CODES.roster_contract_unavailable, error.message);
  }
  if (rosterRevision !== request.expectedRosterRevision) {fail(CODES.roster_revision_conflict);}

  const sourceRef = actors.refFor(located.contract);
  const existing = roster.entryForSource(room, sourceRef);
  const conflicting = roster.entryForStableToken(room, request.source.tokenId);
  const elsewhere = Object.entries(room.gameState.maps || {}).some(([mapId, map]) =>
    mapId !== request.source.mapId && (map?.tokens?.[request.source.tokenId] || map?.creatures?.[request.source.tokenId]));
  const plan = planRecruitment({
    gm: { isGM: true, uid, roomId: room.id },
    source: { kind: 'creature', roomId: room.id, ref: sourceRef, tokenId: request.source.tokenId,
      instanceId: request.source.instanceId, revision: located.contract.revision },
    expected: { instanceId: request.source.instanceId, revision: request.expectedSourceRevision,
      relationshipRevision: request.expectedRelationshipRevision },
    recipient: { uid: request.recipientUid, playerId: recipient.id, inRoom: true, partyMember: true,
      partyId: party.partyId, actorRef: party.recipientActorRef },
    party: { id: party.partyId, actorRefs: party.actorRefs },
    relationship: { available: true, revision: relationshipRevision,
      get: (a, b) => relationships.get(room, a, b) },
    roster: { entryForSource: existing, revision: rosterRevision, expectedRevision: request.expectedRosterRevision },
    placement: { stableTokenId: request.source.tokenId, placedToken: { tokenId: request.source.tokenId, instanceId: request.source.instanceId },
      conflictingEntry: conflicting && actors.hash(conflicting.sourceRef) !== actors.hash(sourceRef) ? conflicting : null,
      elsewhere }
  });
  if (!plan.ok) {fail(plan.code);}

  const now = Date.now();
  const next = actors.clone(room.gameState);
  const token = next.maps[request.source.mapId][located.field][request.source.tokenId];
  const snapshot = actors.clone(token);
  token.ownerUserId = plan.ownership.ownerUserId;
  token.ownerPlayerId = plan.ownership.ownerPlayerId;
  token.playerId = plan.ownership.playerId;
  token.updatedAt = now;
  token.state = token.state || {};
  token.state.actorContract.revision = plan.source.nextRevision;

  const alliance = relationships.planRecruitAlliance({ ...room, gameState: next }, plan.source.ref,
    plan.relationship.updates.map(update => update.b),
    { gmUid: uid, expectedRevision: plan.relationship.revision });
  if (!alliance.ok) {fail(alliance.code);}

  let applied;
  try {
    applied = roster.applyRecruit(alliance.next, {
      sourceRef: plan.source.ref,
      recipientUid: request.recipientUid,
      partyId: party.partyId,
      stableTokenId: plan.roster.stableTokenId,
      creatureId: token.creatureId ?? token.creature?.id ?? null,
      displayName: token.name ?? token.creature?.name ?? null,
      snapshot,
      now
    });
  } catch (error) {
    fail(error.code || CODES.roster_contract_unavailable, error.message);
  }

  const chosen = {
    capability: 'actor-recruit:v1',
    roster: roster.projectEntry(applied.entry, false),
    relationship: { revision: alliance.revision, allies: plan.relationship.updates.map(update => update.b) },
    sourceRevision: { before: located.contract.revision, after: plan.source.nextRevision }
  };
  const command = {
    ...request,
    source: plan.source.ref,
    target: party.recipientActorRef,
    adjudication: {
      definitionId: 'actor-recruit:v1',
      definitionVersionOrHash: 'actor-recruit:v1',
      chosenResult: JSON.stringify(chosen),
      adjustmentReason: 'GM-only recruitment: the same token is transferred in place; ownership, explicit party alliance and the companion roster are committed in one checkpoint snapshot. No HP, cost, duration, resurrection or control semantics were added.'
    }
  };
  const staged = actors.finishStage(room, uid, command, { kind: 'gm-recruit', authorizerUid: uid }, confirmedRevision,
    alliance.next, [{ ref: plan.source.ref, beforeRevision: located.contract.revision, afterRevision: plan.source.nextRevision,
      finalResources: actors.resources(token, 'creature'), conditions: [], preserveCombatResources: true }]);
  staged.receipt.contentHash = actors.hash(request);
  staged.entry = applied.entry;
  staged.priorEntry = applied.prior;
  staged.plan = plan;
  staged.clearControl = { tokenId: request.source.tokenId, mapId: request.source.mapId };
  return staged;
}

function place(room, player, uid, request) {
  validatePlace(request);
  if (request.roomId !== room.id) {fail(CODES.invalid_recruit);}
  const roster = require('./companionRoster');
  const entry = roster.entries(room)[request.rosterId];
  if (!entry) {fail(CODES.roster_entry_missing);}
  if (!player || (player.isGM !== true && entry.recipientUid !== uid)) {fail(CODES.forbidden);}
  if (roster.revision(room) !== request.expectedRosterRevision) {fail(CODES.roster_revision_conflict);}
  if (entry.state === 'inactive') {fail(CODES.companion_inactive);}
  if (entry.state === 'available') {
    fail(CODES.companion_placement_engine_unavailable, 'Placing an available companion requires the existing token-creation/actor-bind path, which is a separate approved dependency. Nothing changed.');
  }
  if (!entry.activeRef) {fail(CODES.active_actor_missing);}
  if (entry.activeRef.mapId !== request.mapId) {fail(CODES.active_actor_elsewhere);}
  if (request.expectedActiveRef && actors.hash(request.expectedActiveRef) !== actors.hash(entry.activeRef)) {
    fail(CODES.placement_identity_conflict);
  }
  try {
    actors.locate(room, entry.activeRef);
  } catch (error) {
    fail(CODES.active_actor_missing, error.message);
  }
  return { placement: 'focus', activeRef: actors.clone(entry.activeRef), rosterEntry: roster.projectEntry(entry, player.isGM === true) };
}

function replayRoster(receipt) {
  try {
    const chosen = JSON.parse(receipt?.adjudication?.chosenResult || '{}');
    return chosen?.roster || null;
  } catch (_) {
    return null;
  }
}

function projectRosterEntry(entry) {
  return require('./companionRoster').projectEntry(entry, false);
}

module.exports = { CODES, RECRUIT_KEYS, LIST_KEYS, PLACE_KEYS, planRecruitment, validate, validateList, validatePlace,
  stage, place, replayRoster, projectRosterEntry };
