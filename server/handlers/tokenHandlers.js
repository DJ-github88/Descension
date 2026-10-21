/**
 * Token Management Handlers
 *
 * Map token lifecycle (server-authoritative state stored per map):
 * - token_created / token_removed / token_dismissed: lifecycle with ack
 * - token_moved: queues through movementDebouncer for batched broadcast
 * - token_updated: applies partial updates to tokens OR creatures (compat)
 * - token_control_granted / token_control_response: GM-to-player control handoff
 * - character_token_created / character_token_removed: player token lifecycle
 *
 * Project 4 token authority:
 * - Verified account UID is the authority identity; session player ids and
 *   socket ids are never independent identity.
 * - Generic updates cannot mutate ownership/control fields.
 * - Legacy ownerless tokens fail closed (GM / explicit delegate only).
 * - Denied actions perform zero mutations: no map creation, no checkpoint.
 */

const { isDeltaSyncEnabled } = require('../services/deltaSyncCapabilities');
const { ackFailure } = require('../utils/socketAck');
const roomAccess = require('../services/roomAccessService');
const actorProjection = require('../services/actorProjection');
const actorConsequences = require('../services/actorConsequences');

function projectTokenForClient(token) {
  return roomAccess.projectTokenForClient(token);
}

function isTokensDeltaEnabled() {
  return isDeltaSyncEnabled('tokens');
}

const deltaDebounces = new Map();

/**
 * R6: the token-delta broadcast is delayed work. The originating authority
 * token is captured when scheduled and revalidated at flush with a FRESH
 * backend holder/generation/state/expiry check plus the post-await local
 * settle recheck; a stale or missing token is dropped without broadcast and
 * never inherits a successor lifecycle for the same room ID.
 */
function debouncedEmitTokenDelta(io, roomId, gameState, authorityService = null, authorityToken = null) {
  const actorSnapshot = JSON.parse(JSON.stringify({ roomId, actorProjection: gameState.actorProjection,
    maps: Object.fromEntries(Object.entries(gameState.maps || {}).map(([id, map]) => {
      const projected = roomAccess.projectMapDataForClient(map);
      return [id, { id, tokens: projected.tokens || {}, creatures: projected.creatures || {},
        characterTokens: projected.characterTokens || {}, actorProjection: gameState.actorProjection }];
    })) }));
  const existing = deltaDebounces.get(roomId);
  if (existing) {
    clearTimeout(existing.timer);
  }
  const timer = setTimeout(async() => {
    const entry = deltaDebounces.get(roomId);
    deltaDebounces.delete(roomId);
    if (authorityService) {
      if (!entry || !entry.authorityToken) {return;}
      let stillHeld = false;
      try {
        stillHeld = (await authorityService.assertSettle(entry.authorityToken, { backendCheck: true })).ok === true;
      } catch (_error) {
        stillHeld = false;
      }
      if (!stillHeld) {return;}
    }
    const tokens = Object.values(gameState.tokens || {}).map(projectTokenForClient);
    const characterTokens = Object.values(gameState.characterTokens || {}).map(projectTokenForClient);
    io.to(roomId).emit('tokens_delta', {
      roomId, actorSnapshot,
      tokens,
      characterTokens,
      timestamp: Date.now()
    });
  }, 50);
  deltaDebounces.set(roomId, { timer, authorityToken });
}

// Ownership/control/identity fields are never client-mutable through generic
// token updates. Applies to the update root and one nested state object.
const PROTECTED_TOKEN_KEYS = new Set([
  'ownerUserId',
  'ownerId',
  'ownerPlayerId',
  'owner',
  'playerId',
  'userId',
  'createdBy',
  'controlledBy',
  'controller',
  'controllerId',
  'controllerUserId',
  'controllerPlayerId',
  'delegatedTo',
  'delegation',
  'id',
  'tokenId',
  'mapId',
  'summonMeta',
  '_summonMeta'
]);

/**
 * Recursively locate any protected authority/identity field in a token update
 * payload (bounded depth). If the request touches ANY protected field the
 * whole request must be rejected, never partially applied.
 */
const IDENTITY_KEYS = new Set(['id', 'tokenId', 'mapId']);

function findProtectedKey(updates, depth = 0, pathPrefix = '', options = {}) {
  if (!updates || typeof updates !== 'object' || depth > 4) {return null;}
  if (Array.isArray(updates)) {
    for (let i = 0; i < updates.length; i += 1) {
      const found = findProtectedKey(updates[i], depth + 1, `${pathPrefix}[${i}].`, options);
      if (found) {return found;}
    }
    return null;
  }
  for (const key of Object.keys(updates)) {
    if (PROTECTED_TOKEN_KEYS.has(key) && !(options.excludeIdentity && IDENTITY_KEYS.has(key))) {
      return `${pathPrefix}${key}`;
    }
  }
  for (const key of Object.keys(updates)) {
    const value = updates[key];
    if (value && typeof value === 'object') {
      const found = findProtectedKey(value, depth + 1, `${pathPrefix}${key}.`, options);
      if (found) {return found;}
    }
  }
  return null;
}

function getVerifiedUid(socket) {
  const uid = socket && socket.data ? socket.data.userId : null;
  return typeof uid === 'string' && uid.length > 0 ? uid : null;
}

/**
 * Resolve an existing map without creating one. Denied/unknown actions must
 * never mutate room state.
 */
function resolveExistingMap(room, mapId) {
  const maps = room && room.gameState ? room.gameState.maps : null;
  if (!maps || typeof maps !== 'object') {return null;}
  return maps[mapId] || null;
}

function findTokenRecord(map, tokenId) {
  if (!map) {return { store: null, token: null, kind: null };}
  if (map.tokens && map.tokens[tokenId]) {
    return { store: map.tokens, token: map.tokens[tokenId], kind: 'token' };
  }
  if (map.creatures && map.creatures[tokenId]) {
    return { store: map.creatures, token: map.creatures[tokenId], kind: 'creature' };
  }
  if (map.characterTokens && map.characterTokens[tokenId]) {
    return { store: map.characterTokens, token: map.characterTokens[tokenId], kind: 'character_token' };
  }
  return { store: null, token: null, kind: null };
}

/**
 * Resolve move/update authority for a token.
 * Returns 'gm' | 'owner' | 'delegate' | 'none'.
 * - ownerUserId (stable verified UID) is authoritative for the owner.
 * - ownerPlayerId/playerId remain legacy session aliases, accepted only while
 *   the caller's live session player matches.
 * - ownerless legacy tokens authorize GM / explicit delegation only.
 */
function resolveTokenAuthority(room, player, tokenId, token, mapId, uid) {
  const isGM = !!(player && player.isGM);
  const ownerUserId = token ? token.ownerUserId : null;
  const legacyOwnerId = token ? (token.ownerPlayerId || token.playerId) : null;

  if (ownerUserId) {
    if (isGM || (uid && ownerUserId === uid)) {return isGM ? 'gm' : 'owner';}
  } else if (legacyOwnerId) {
    if (isGM) {return 'gm';}
    if (player && legacyOwnerId === player.id) {return 'owner';}
  } else if (isGM) {
    // Ownerless legacy token: GM only (delegation may still apply below).
    if (!hasDelegation(room, tokenId, mapId, player, uid)) {return 'gm';}
  }

  if (hasDelegation(room, tokenId, mapId, player, uid)) {return 'delegate';}
  return 'none';
}

function delegationKey(room, tokenId, mapId) {
  return `${room.id}:${mapId}:${tokenId}`;
}

function hasDelegation(room, tokenId, mapId, player, uid) {
  if (!room || !room.tokenControllers) {return false;}

  // R8.2/R9: authorization requires the exact scoped composite record
  // room:map:token with a verified controller UID. Bare string values,
  // playerId-only values, unscoped legacy records and any record missing the
  // frozen scope fail closed; they are never silently authorized.
  const composite = room.tokenControllers[delegationKey(room, tokenId, mapId)];
  if (!composite || typeof composite !== 'object' || Array.isArray(composite)) {return false;}
  if (composite.roomId !== room.id) {return false;}
  if (composite.mapId !== mapId) {return false;}
  if (composite.tokenId !== tokenId) {return false;}
  if (typeof composite.controllerUserId !== 'string' || composite.controllerUserId.length === 0) {return false;}
  if (typeof uid !== 'string' || uid.length === 0) {return false;}
  return composite.controllerUserId === uid;
}

function canDestructivelyRemove(authority) {
  return authority === 'gm' || authority === 'owner';
}

function registerTokenHandlers(ctx) {
  const {
    io,
    socket,
    logger,
    uuidv4,
    validateRoomMembership,
    validateMapExists,
    firebaseBatchWriter,
    movementDebouncer,
    getNextEventSequence,
    stripUndefined,
    authorityService = null
  } = ctx;

  socket.on('token_created', async(data, ackCallback) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {
        socket.emit('token_error', { message: validation.error, code: 'not_room_member' });
        if (typeof ackCallback === 'function') {ackCallback({ success: false, error: validation.error, code: 'not_room_member' });}
        return;
      }

      const { room, player } = validation;
      const uid = getVerifiedUid(socket);
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      const tokenId = data.token.id || uuidv4();

      // Prevent create-ID collision overwrite of an existing token.
      const existing = findTokenRecord(map, tokenId);
      if (existing.token) {
        if (typeof ackCallback === 'function') {ackCallback({ success: false, error: 'Token id already exists', code: 'protected_field' });}
        return;
      }

      // Strip client ownership assertions; stamp server-derived authority.
      const supplied = (data.token && typeof data.token === 'object') ? { ...data.token } : {};
      for (const key of PROTECTED_TOKEN_KEYS) {delete supplied[key];}
      if (supplied.state) {supplied.state = { ...supplied.state }; delete supplied.state.actorContract; delete supplied.state.actorRecovery;}
      const token = {
        ...supplied,
        // Owning creature snapshot supplies bounds; P7 never invents maxima.
        ...(data.creature?.stats ? { stats: stripUndefined(data.creature.stats) } : {}),
        id: tokenId,
        createdBy: socket.id,
        ownerUserId: uid || undefined,
        ownerPlayerId: player ? player.id : undefined,
        createdAt: Date.now()
      };

      actorProjection.advance(room, room.gameState, [token]);
      map.tokens[tokenId] = token;
      room.gameState.tokens[tokenId] = token;

      if (!isTokensDeltaEnabled()) {
        io.to(room.id).emit('token_created', {
          roomId: room.id, actorSnapshot: actorProjection.snapshot(room),
          tokenId,
          token: projectTokenForClient(token),
          mapId,
          createdBy: socket.id,
          sequence: getNextEventSequence()
        });
      }

      firebaseBatchWriter.queueWrite(room.id, room.gameState, true);
      if (isTokensDeltaEnabled()) {debouncedEmitTokenDelta(io, room.id, room.gameState, authorityService, room.authorityToken || null);}

      if (typeof ackCallback === 'function') {
        ackCallback({ success: true, tokenId });
      }

      logger.debug('[token_created] Token created', { tokenId, mapId, roomId: room.id });

    } catch (error) {
      logger.error('[token_created] Error:', { error: error.message });
      if (typeof ackCallback === 'function') {ackCallback({ success: false, error: error.message });}
    }
  });

  socket.on('token_moved', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {return;}

      const { room, player } = validation;
      const uid = getVerifiedUid(socket);
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = resolveExistingMap(room, mapId);
      if (!map) {
        logger.warn('[token_moved] Unknown map; no mutation', { mapId, tokenId: data.tokenId, roomId: room.id });
        return;
      }

      const record = findTokenRecord(map, data.tokenId);
      if (!record.token) {return;}

      const authority = resolveTokenAuthority(room, player, data.tokenId, record.token, mapId, uid);
      if (authority === 'none') {
        logger.warn('[token_moved] Unauthorized token movement blocked', { tokenId: data.tokenId, playerId: player?.id });
        return;
      }

      actorConsequences.assertCanMove(record.token, player);
      movementDebouncer.queueMove(room.id, data.tokenId, {
        position: data.position,
        velocity: data.velocity,
        playerId: socket.id,
        mapId: mapId,
        actionId: data.actionId
      }, room.authorityToken || null, {
        playerRef: player,
        userId: uid,
        roomRef: room
      });

    } catch (error) {
      logger.error('[token_moved] Error:', { error: error.message });
      socket.emit('room_error', { code: error.code || 'movement_refused', event: 'token_moved', message: error.message });
    }
  });

  socket.on('token_updated', async(data, ackCallback) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {return;}

      const { room, player } = validation;
      const uid = getVerifiedUid(socket);
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = resolveExistingMap(room, mapId);
      if (!map) {
        logger.warn('[token_updated] Unknown map; no mutation', { mapId, tokenId: data.tokenId, roomId: room.id });
        return;
      }

      const updates = data.updates || data.stateUpdates || {};

      // Ownership/control fields are never client-mutable.
      const protectedKey = findProtectedKey(updates);
      if (protectedKey) {
        logger.warn('[token_updated] Protected token field update blocked', { tokenId: data.tokenId, key: protectedKey });
        ackFailure(ackCallback, { success: false, code: 'protected_field', error: 'Protected token field' });
        return;
      }

      const record = findTokenRecord(map, data.tokenId);
      if (!record.token) {return;}

      const authority = resolveTokenAuthority(room, player, data.tokenId, record.token, mapId, uid);
      if (authority === 'none') {
        logger.warn('[token_updated] Unauthorized token update blocked', { tokenId: data.tokenId, playerId: player?.id });
        ackFailure(ackCallback, { success: false, code: 'forbidden', error: 'Not permitted to edit this token' });
        return;
      }

      actorConsequences.assertCanMove(record.token, player, updates);
      const prepared = actorConsequences.prepareBuildUpdate(record.token, updates, record.kind === 'character_token' ? 'character' : 'creature');
      prepared.token.updatedAt = Date.now();
      const field = record.kind === 'character_token' ? 'characterTokens' : record.kind === 'creature' ? 'creatures' : 'tokens';
      actorConsequences.installBuildUpdate(room, map, field, data.tokenId, prepared);

      if (!isTokensDeltaEnabled()) {
        io.to(room.id).emit('token_updated', {
          roomId: room.id, actorSnapshot: actorProjection.snapshot(room),
          tokenId: data.tokenId,
          updates: roomAccess.projectTokenUpdateForClient(updates),
          mapId,
          updatedBy: socket.id,
          sequence: getNextEventSequence()
        });
      }

      const sanitizedState = stripUndefined(room.gameState);
      firebaseBatchWriter.queueWrite(room.id, sanitizedState);
      if (isTokensDeltaEnabled()) {debouncedEmitTokenDelta(io, room.id, room.gameState, authorityService, room.authorityToken || null);}

      if (typeof ackCallback === 'function') {ackCallback({ success: true });}

    } catch (error) {
      logger.error('[token_updated] Error:', { error: error.message });
      ackFailure(ackCallback, { success: false, code: error.code || 'invalid_bounds', error: error.message });
    }
  });

  socket.on('token_control_granted', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {
        logger.warn('[token_control_granted] Validation failed', {
          roomId: data.roomId,
          socketId: socket.id,
          error: validation.error
        });
        return;
      }

      const { room } = validation;
      const { targetPlayerUserId } = data;

      // P4: recipient identity is the verified account UID. A supplied socket
      // id is never identity.
      if (!targetPlayerUserId) {
        logger.warn('[token_control_granted] Missing verified recipient UID');
        return;
      }

      let targetPlayer = null;
      for (const p of room.players.values()) {
        if (p && !p.isGM && p.userId === targetPlayerUserId) { targetPlayer = p; break; }
      }
      if (!targetPlayer || !targetPlayer.socketId) {
        logger.warn('[token_control_granted] Target player not found in room', { targetPlayerUserId });
        return;
      }

      const mapId = data.mapId || room.gameState?.defaultMapId || 'default';
      if (!room.pendingTokenControls) { room.pendingTokenControls = {}; }
      room.pendingTokenControls[delegationKey(room, data.tokenId, mapId)] = {
        tokenId: data.tokenId,
        controllerUserId: targetPlayerUserId,
        controllerPlayerId: targetPlayer.id,
        mapId,
        roomId: room.id,
        grantedBy: getVerifiedUid(socket)
      };

      io.to(targetPlayer.socketId).emit('token_control_granted', {
        ...data,
        targetPlayerId: targetPlayer.id,
        grantedBySocketId: socket.id,
        mapId,
        sequence: getNextEventSequence()
      });
      logger.info('[token_control_granted] Forwarded to verified player', {
        tokenId: data.tokenId,
        controllerUserId: targetPlayerUserId,
        from: socket.id
      });
    } catch (error) {
      logger.error('[token_control_granted] Error:', { error: error.message });
    }
  });

  socket.on('token_control_response', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {return;}

      const { room, player } = validation;
      const uid = getVerifiedUid(socket);

      if (data.accepted) {
        // R12: only the EXACT scoped pending grant record may be accepted.
        // Legacy bare-key/unscoped pending shapes are never upgraded into a
        // valid delegation; the offer itself must be fully scoped.
        const mapId = data.mapId || (player && player.currentMapId)
          || (room.gameState && room.gameState.defaultMapId) || 'default';
        const key = delegationKey(room, data.tokenId, mapId);
        const pending = room.pendingTokenControls && room.pendingTokenControls[key];
        const pendingMatches = !!pending && typeof pending === 'object' && !Array.isArray(pending)
          && pending.roomId === room.id
          && pending.mapId === mapId
          && pending.tokenId === data.tokenId
          && typeof pending.controllerUserId === 'string' && pending.controllerUserId.length > 0
          && typeof uid === 'string' && uid.length > 0
          && pending.controllerUserId === uid;
        if (!pendingMatches) {
          logger.warn('[token_control_response] Unauthorized control acceptance blocked', {
            tokenId: data.tokenId, uid, mapId
          });
          return;
        }
        if (!room.tokenControllers) {
          room.tokenControllers = {};
        }
        room.tokenControllers[key] = {
          tokenId: data.tokenId,
          controllerUserId: uid,
          controllerPlayerId: player ? player.id : null,
          mapId,
          roomId: room.id,
          grantedAt: Date.now()
        };
        if (room.pendingTokenControls) {
          delete room.pendingTokenControls[key];
          delete room.pendingTokenControls[data.tokenId];
        }
      }

      if (room.gm && room.gm.socketId) {
        io.to(room.gm.socketId).emit('token_control_response', {
          ...data,
          respondedBySocketId: socket.id,
          sequence: getNextEventSequence()
        });
        logger.info('[token_control_response] Forwarded to GM', {
          tokenId: data.tokenId,
          accepted: data.accepted,
          from: socket.id,
          to: room.gm.socketId
        });
      }
    } catch (error) {
      logger.error('[token_control_response] Error:', { error: error.message });
    }
  });

  socket.on('character_token_created', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {return;}

      const { room, player } = validation;
      const uid = getVerifiedUid(socket);
      const mapId = data.mapId || data.targetMapId || room.gameState.defaultMapId || 'default';
      // Character tokens never create maps: the target map must already exist.
      const map = resolveExistingMap(room, mapId);
      if (!map) {
        logger.warn('[character_token_created] Unknown map; no mutation', { mapId, roomId: room.id });
        return;
      }

      // Resolve the owned session player from verified identity, never from a
      // client-supplied ownership field.
      let ownerPlayer = player;
      if (data.playerId && (!player || data.playerId !== player.id)) {
        const candidate = Array.from(room.players.values()).find((p) => p.id === data.playerId);
        if (!candidate) {
          logger.warn('[character_token_created] Unknown target player', { playerId: data.playerId });
          return;
        }
        if (!player?.isGM) {
          logger.warn('[character_token_created] Non-GM attempted to create a token for another player', { playerId: data.playerId });
          return;
        }
        ownerPlayer = candidate;
      }

      const tokenId = data.token?.id || data.tokenId || uuidv4();
      // Collision: never overwrite an existing token or entity.
      if (findTokenRecord(map, tokenId).token || (map.creatures && map.creatures[tokenId])) {
        logger.warn('[character_token_created] Token id already exists; refused', { tokenId, mapId });
        return;
      }

      const supplied = (data.token && typeof data.token === 'object') ? { ...data.token } : {};
      for (const key of PROTECTED_TOKEN_KEYS) {delete supplied[key];}
      if (supplied.state) {supplied.state = { ...supplied.state }; delete supplied.state.actorContract; delete supplied.state.actorRecovery;}

      const token = {
        ...supplied,
        id: tokenId,
        ownerUserId: ownerPlayer?.userId || uid || undefined,
        playerId: ownerPlayer?.id || (player ? player.id : undefined),
        character: data.token && data.token.character
          ? roomAccess.projectCharacterForClient(data.token.character)
          : undefined,
        createdBy: socket.id,
        createdAt: Date.now()
      };

      actorProjection.advance(room, room.gameState, [token]);
      map.characterTokens[tokenId] = token;
      room.gameState.characterTokens[tokenId] = token; // Legacy support

      if (!isTokensDeltaEnabled()) {
        io.to(room.id).emit('character_token_created', {
          roomId: room.id, actorSnapshot: actorProjection.snapshot(room),
          tokenId,
          token: projectTokenForClient(token),
          mapId,
          createdBy: socket.id,
          sequence: getNextEventSequence()
        });
      }

      firebaseBatchWriter.queueWrite(room.id, room.gameState);
      if (isTokensDeltaEnabled()) {debouncedEmitTokenDelta(io, room.id, room.gameState, authorityService, room.authorityToken || null);}

    } catch (error) {
      logger.error('[character_token_created] Error:', { error: error.message });
    }
  });

  // Player updated their character token (portrait snapshot refresh or
  // conditions state). Merged into the stored token and relayed so other
  // clients (e.g. the GM's screen) render the current portrait.
  socket.on('character_token_updated', async(data, ackCallback) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {return;}

      const { room, player } = validation;
      const uid = getVerifiedUid(socket);
      const mapId = data.mapId || player?.currentMapId || room.gameState.defaultMapId || 'default';
      const map = resolveExistingMap(room, mapId);

      const tokenId = data.tokenId;
      if (!tokenId) {return;}

      const record = findTokenRecord(map, tokenId);
      // Missing target: error, no relay, no checkpoint.
      if (!record.token) {
        logger.warn('[character_token_updated] Unknown character token; no mutation', { tokenId, mapId });
        return;
      }
      if (record.token.state?.actorContract && data.character?.id !== undefined && data.character.id !== record.token.state.actorContract.characterId) {
        socket.emit('room_error', { code: 'actor_binding_conflict', event: 'character_token_updated', message: 'A bound canonical character cannot be replaced by a snapshot refresh' });
        ackFailure(ackCallback, { success: false, code: 'actor_binding_conflict', error: 'Bound canonical identity cannot change' });
        return;
      }

      // Any protected authority/identity field anywhere in the payload rejects
      // the WHOLE request (never strip-then-apply). Identity keys that are
      // legitimate inside a character snapshot are excluded from the nested
      // scan.
      const protectedKey = findProtectedKey(data.stateUpdates, 0, '', { excludeIdentity: true })
        || findProtectedKey(data.character, 0, '', { excludeIdentity: true });
      if (protectedKey) {
        logger.warn('[character_token_updated] Protected field update blocked', { tokenId, key: protectedKey });
        ackFailure(ackCallback, { success: false, code: 'protected_field', error: 'Protected token field' });
        return;
      }

      const authority = resolveTokenAuthority(room, player, tokenId, record.token, mapId, uid);
      if (authority === 'none') {
        logger.warn('[character_token_updated] Non-owner attempted to update character token', { tokenId, playerId: player?.id });
        ackFailure(ackCallback, { success: false, code: 'forbidden', error: 'Not permitted to edit this token' });
        return;
      }

      const projectedCharacter = data.character && typeof data.character === 'object'
        ? roomAccess.projectCharacterForClient(data.character)
        : null;
      // R8.4: positive projection of state updates; private/unknown nested
      // blobs are never stored or relayed raw.
      const projectedStateUpdates = data.stateUpdates && typeof data.stateUpdates === 'object'
        ? roomAccess.projectStateUpdates(data.stateUpdates)
        : null;
      actorConsequences.assertCanMove(record.token, player, data.stateUpdates || {});
      actorConsequences.validateBuildEnvelope('character_token_updated', data);
      actorConsequences.prepareBuildUpdate(record.token, {
        ...(data.character ? { character: data.character } : {}),
        ...(data.stateUpdates ? { state: data.stateUpdates } : {})
      }, 'character');
      const prepared = actorConsequences.prepareBuildUpdate(record.token, {
        ...(data.name ? { name: data.name } : {}),
        ...(projectedCharacter ? { character: projectedCharacter } : {}),
        ...(projectedStateUpdates && Object.keys(projectedStateUpdates).length > 0
          ? { state: projectedStateUpdates }
          : {})
      }, 'character');
      // Validate before privacy projection can discard malformed/protected input.
      actorConsequences.installBuildUpdate(room, map, 'characterTokens', tokenId, prepared);

      // Relay to everyone EXCEPT the sender (their local state is already fresh)
      if (!isTokensDeltaEnabled()) {
        io.to(room.id).emit('character_token_updated', {
          roomId: room.id, actorSnapshot: actorProjection.snapshot(room),
          tokenId,
          mapId,
          ...(data.name ? { name: data.name } : {}),
          character: projectedCharacter || undefined,
          stateUpdates: projectedStateUpdates || undefined,
          updatedBy: socket.id,
          sequence: getNextEventSequence()
        });
      }

      firebaseBatchWriter.queueWrite(room.id, room.gameState);
      if (isTokensDeltaEnabled()) {debouncedEmitTokenDelta(io, room.id, room.gameState, authorityService, room.authorityToken || null);}
      if (typeof ackCallback === 'function') {ackCallback({ success: true });}

    } catch (error) {
      logger.error('[character_token_updated] Error:', { error: error.message });
      ackFailure(ackCallback, { success: false, code: error.code || 'invalid_bounds', error: error.message });
    }
  });

  socket.on('token_removed', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {return;}

      const { room, player } = validation;
      const uid = getVerifiedUid(socket);
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = resolveExistingMap(room, mapId);
      if (!map) {return;}

      const record = findTokenRecord(map, data.tokenId);
      if (!record.token) {return;}

      const authority = resolveTokenAuthority(room, player, data.tokenId, record.token, mapId, uid);
      if (!canDestructivelyRemove(authority)) {
        logger.warn('[token_removed] Unauthorized token removal blocked', { tokenId: data.tokenId, playerId: player?.id });
        return;
      }
      if (record.kind === 'character_token') {socket.emit('room_error', { code: 'actor_binding_conflict', event: 'token_removed', message: 'Use character_token_removed for this exact kind' }); return;}

      actorProjection.advance(room);
      delete record.store[data.tokenId];
      delete room.gameState.tokens[data.tokenId]; // Legacy support
      if (room.tokenControllers) {delete room.tokenControllers[delegationKey(room, data.tokenId, mapId)];}
      if (room.pendingTokenControls) {delete room.pendingTokenControls[delegationKey(room, data.tokenId, mapId)];}

      if (!isTokensDeltaEnabled()) {
        io.to(room.id).emit('token_removed', {
          roomId: room.id, actorSnapshot: actorProjection.snapshot(room),
          tokenId: data.tokenId,
          mapId,
          removedBy: socket.id,
          sequence: getNextEventSequence()
        });
      }

      firebaseBatchWriter.queueWrite(room.id, room.gameState);
      if (isTokensDeltaEnabled()) {debouncedEmitTokenDelta(io, room.id, room.gameState, authorityService, room.authorityToken || null);}

    } catch (error) {
      logger.error('[token_removed] Error:', { error: error.message });
    }
  });

  socket.on('token_dismissed', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {return;}

      const { room, player } = validation;
      const uid = getVerifiedUid(socket);
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = resolveExistingMap(room, mapId);
      if (!map) {return;}

      const record = findTokenRecord(map, data.tokenId);
      if (!record.token) {return;}

      const authority = resolveTokenAuthority(room, player, data.tokenId, record.token, mapId, uid);
      if (!canDestructivelyRemove(authority)) {
        logger.warn('[token_dismissed] Unauthorized token dismissal blocked', { tokenId: data.tokenId, playerId: player?.id });
        return;
      }
      if (record.kind === 'character_token') {socket.emit('room_error', { code: 'actor_binding_conflict', event: 'token_dismissed', message: 'Use character_token_removed for this exact kind' }); return;}

      actorProjection.advance(room);
      delete record.store[data.tokenId];
      delete room.gameState.tokens[data.tokenId];
      if (room.tokenControllers) {delete room.tokenControllers[delegationKey(room, data.tokenId, mapId)];}
      if (room.pendingTokenControls) {delete room.pendingTokenControls[delegationKey(room, data.tokenId, mapId)];}

      if (!isTokensDeltaEnabled()) {
        io.to(room.id).emit('token_dismissed', {
          roomId: room.id, actorSnapshot: actorProjection.snapshot(room),
          tokenId: data.tokenId,
          mapId,
          dismissedBy: socket.id,
          sequence: getNextEventSequence()
        });
      }

      firebaseBatchWriter.queueWrite(room.id, room.gameState);
      if (isTokensDeltaEnabled()) {debouncedEmitTokenDelta(io, room.id, room.gameState, authorityService, room.authorityToken || null);}

    } catch (error) {
      logger.error('[token_dismissed] Error:', { error: error.message });
    }
  });

  socket.on('character_token_removed', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {return;}

      const { room, player } = validation;
      const uid = getVerifiedUid(socket);
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = resolveExistingMap(room, mapId);
      if (!map) {return;}

      const record = findTokenRecord(map, data.tokenId);
      if (!record.token) {return;}

      const authority = resolveTokenAuthority(room, player, data.tokenId, record.token, mapId, uid);
      if (!canDestructivelyRemove(authority)) {
        logger.warn('[character_token_removed] Non-owner attempted to remove character token', { tokenId: data.tokenId, playerId: player?.id });
        return;
      }
      if (record.kind !== 'character_token') {socket.emit('room_error', { code: 'actor_binding_conflict', event: 'character_token_removed', message: 'The addressed instance is not a character token' }); return;}

      actorProjection.advance(room);
      delete record.store[data.tokenId];
      delete room.gameState.characterTokens[data.tokenId]; // Legacy support
      if (room.tokenControllers) {delete room.tokenControllers[delegationKey(room, data.tokenId, mapId)];}
      if (room.pendingTokenControls) {delete room.pendingTokenControls[delegationKey(room, data.tokenId, mapId)];}

      if (!isTokensDeltaEnabled()) {
        io.to(room.id).emit('character_token_removed', {
          roomId: room.id, actorSnapshot: actorProjection.snapshot(room),
          tokenId: data.tokenId,
          mapId,
          removedBy: socket.id,
          sequence: getNextEventSequence()
        });
      }

      firebaseBatchWriter.queueWrite(room.id, room.gameState);
      if (isTokensDeltaEnabled()) {debouncedEmitTokenDelta(io, room.id, room.gameState, authorityService, room.authorityToken || null);}

    } catch (error) {
      logger.error('[character_token_removed] Error:', { error: error.message });
    }
  });

  // ackFailure is kept available for future ack-bearing token events.
  void ackFailure;
}

module.exports = { registerTokenHandlers, resolveTokenAuthority, findProtectedKey, PROTECTED_TOKEN_KEYS };
