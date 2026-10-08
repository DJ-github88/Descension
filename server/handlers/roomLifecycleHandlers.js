/**
 * Room Management Handlers
 *
 * Room lifecycle (creation, joining, leaving, disconnect):
 * - create_room: GM creates or resumes a permanent/temporary room
 *   (handles tier check, Firestore resume, party notification)
 * - join_room: player or GM-reclaim joins a room (password verify, tier check)
 * - leave_room: explicit presence leave (GM marks room inactive; player removed)
 * - leave_room_membership: explicit durable membership revocation by the user
 * - request_my_rooms: verified owner/member metadata listing
 * - disconnect: socket disconnect cleanup (social presence, party leave, room state)
 *
 * Project 4 access boundary: verified account UID is the authority identity.
 * Durable entitlement is persisted before any runtime side effect. Unauthorized
 * fails in front of every mutation. Raw room state is delivered as a privacy
 * projection, never as a raw SDK/checkpoint payload.
 */

const { getDeltaSyncCapabilities } = require('../services/deltaSyncCapabilities');
const roomCheckpoint = require('../services/roomCheckpoint');
const roomAccess = require('../services/roomAccessService');
const roomAuthority = require('../services/roomAuthorityService');
const { DEFAULT_GM_COLOR, DEFAULT_PLAYER_COLOR } = require('../utils/constants');

function codedError(code, message) {
  const error = new Error(message || code);
  error.code = code;
  return error;
}

function emitRoomError(socket, error, fallbackCode) {
  const code = (error && error.code) || fallbackCode || null;
  const message = error && error.message ? error.message : String(error);
  socket.emit('room_error', code ? { error: message, code } : { error: message });
}

/**
 * H14: an owner leaving/disconnecting ends that owner's inventory consent.
 * Consent never silently returns on rejoin (it must be granted again).
 */
function clearInventorySharesFor(room, userId) {
  if (!room || !room.inventoryShares || !userId) {return;}
  for (const [characterId, share] of Object.entries(room.inventoryShares)) {
    if (share.ownerUserId === userId) {delete room.inventoryShares[characterId];}
  }
}

/**
 * Project 4 owner/recovery resolution for a permanent room. An unowned legacy
 * room is never assigned to whoever happens to resume first.
 */
function resolvePermanentRoomAccess(persistedRoomData, userId) {
  const ownerId = persistedRoomData ? persistedRoomData.gmId : null;
  if (!roomAccess.isValidOwnerId(ownerId)) {
    return { ok: false, code: roomAccess.DENIAL_CODES.OWNER_RECOVERY_REQUIRED };
  }
  if (!userId || userId !== ownerId) {
    return { ok: false, code: roomAccess.DENIAL_CODES.OWNER_REQUIRED };
  }
  return { ok: true, code: null };
}

function classificationFailureMessage(classification) {
  const diagnostic = classification.diagnostics && classification.diagnostics[0];
  switch (classification.kind) {
  case 'READ_FAILED':
    return 'Room state is temporarily unavailable; resume was refused instead of reconstructing empty state';
  case 'INCOMPLETE_CHECKPOINT':
    return 'Room checkpoint is incomplete; resume was refused to protect stored data';
  case 'UNKNOWN_NEWER_VERSION':
    return 'Room checkpoint schema is newer than this server supports; the room is read-only';
  case 'LEGACY_BOTH_INLINE_SPLIT':
    return 'Room has conflicting inline and split candidates; reconciliation is required before resume';
  case 'INVALID_LEGACY_CANDIDATE':
    return 'Room legacy state could not be read safely; resume was refused';
  default:
    return `Room state is not reconstructable (${classification.kind}${diagnostic ? `: ${diagnostic.code}` : ''})`;
  }
}

function applyClassificationToRoom(room, classification) {
  room.checkpointRevision = Number.isSafeInteger(Number(classification.revision)) && Number(classification.revision) > 0
    ? Number(classification.revision)
    : 0;
  room.checkpoint = classification.checkpoint || null;
  room.migrationRequired = classification.migrationRequired === true;
  room.checkpointClassification = classification.kind;
  room.checkpointSelectedCandidate = classification.selectedCandidateId || null;
}

function initialGameStateFromClassification(classification, requestedImport) {
  if (classification.selectedSnapshot) {
    return {
      gameState: roomCheckpoint.hydrateSnapshotToGameState(classification.selectedSnapshot),
      provenance: classification.migrationRequired
        ? {
          kind: classification.selectedCandidateId === 'split' ? 'legacy-split' : 'legacy-inline',
          sourceRoomId: classification.roomId,
          sourceRevision: classification.revision || null,
          selectedCandidateId: classification.selectedCandidateId || null,
          decisionId: (classification.selection && classification.selection.decisionId) || null
        }
        : null
    };
  }

  if (classification.kind === 'ROOM_PRESENT_NO_SNAPSHOT' && requestedImport && typeof requestedImport === 'object') {
    const adapted = roomCheckpoint.adaptInlineCandidate(requestedImport);
    if (!adapted.ok || !adapted.complete) {
      throw new Error('Local room import failed validation and was not accepted');
    }
    return {
      gameState: roomCheckpoint.hydrateSnapshotToGameState({
        global: adapted.global,
        maps: adapted.maps,
        mapIds: adapted.mapIds
      }),
      provenance: { kind: 'local-import', sourceRoomId: null, sourceRevision: null, selectedCandidateId: null, decisionId: null }
    };
  }

  return { gameState: null, provenance: null };
}

/**
 * Per-room in-process reconstruction gate. Exactly one absent-memory
 * reconstruction may establish room authority at a time; concurrent awaiters
 * reuse the established live room and never replace it with their own cloud
 * reconstruction. Every caller is re-authorized after the gate.
 */
const reconstructionGates = new Map();

async function establishRoomOnce(rooms, roomId, factory) {
  const live = rooms.get(roomId);
  if (live) {return live;}

  let gate = reconstructionGates.get(roomId);
  if (!gate) {
    gate = (async() => {
      const alreadyLive = rooms.get(roomId);
      if (alreadyLive) {return alreadyLive;}
      return factory();
    })().finally(() => {reconstructionGates.delete(roomId);});
    reconstructionGates.set(roomId, gate);
  }

  const established = await gate;
  return rooms.get(roomId) || established;
}

/**
 * Rebind the current GM connection to authoritative room membership on resume.
 */
function bindResumedGm(room, socket, data, players, uuidv4) {
  room.isActive = true;
  room.gmDisconnectedAt = null;
  room.gmSessionId = uuidv4();
  // A new GM session invalidates every prior inventory share (H14).
  room.inventoryShares = {};
  if (!room.gm) {
    room.gm = {
      id: uuidv4(),
      name: data.gmName,
      isGM: true,
      color: data.playerColor || DEFAULT_GM_COLOR
    };
  }
  room.gm.socketId = socket.id;
  if (data.character) {room.gm.character = roomAccess.projectCharacterForClient(data.character);}
  if (socket.data && socket.data.userId) {room.gm.userId = socket.data.userId;}

  players.set(socket.id, {
    id: room.gm.id || uuidv4(),
    name: room.gm.name || data.gmName,
    roomId: room.id,
    isGM: true,
    color: room.gm.color || DEFAULT_GM_COLOR,
    currentMapId: (room.gameState && room.gameState.defaultMapId) || 'default',
    userId: socket.data ? socket.data.userId : null,
    character: room.gm.character || null
  });
}

function registerRoomHandlers(ctx) {
  const {
    io,
    socket,
    rooms,
    players,
    onlineSocialUsers,
    logger,
    uuidv4,
    sanitizePlayerName,
    firebaseService,
    canCreateRoom,
    requireAuth,
    createRoom,
    buildRoomCandidate,
    installRoomCandidate,
    hashPassword,
    verifyPassword,
    getPublicRooms,
    notifyPartyMembersOfGMJoin,
    handlePartyLeave,
    firebaseBatchWriter,
    authorityService
  } = ctx;

  socket.on('create_room', requireAuth(async(data) => {
    let room = null;

    try {
      if (!data || !data.gmName) {
        throw new Error('Invalid create_room data: missing gmName');
      }

      logger.info('[create_room] Received room creation request', {
        gmName: data.gmName,
        roomName: data.roomName,
        hasPersistentRoomId: !!data.persistentRoomId,
        persistentRoomId: data.persistentRoomId
      });

      const isPermanentRoomResume = !!data.persistentRoomId;

      // H2: permanent/durable rooms require a normal non-anonymous account.
      if (isPermanentRoomResume) {
        const identity = roomAccess.checkDurableRoomIdentity(socket);
        if (!identity.allowed) {
          throw codedError(
            identity.code,
            identity.code === roomAccess.DENIAL_CODES.ACCOUNT_REQUIRED
              ? 'A signed-in, non-anonymous account is required to create or resume a permanent room'
              : 'Authentication required'
          );
        }
      } else {
        const gmUserId = socket.data?.userId;
        if (gmUserId) {
          const gmRooms = Array.from(rooms.values()).filter(r => r.gmId === gmUserId);
          const tierCheck = await canCreateRoom(gmUserId, gmRooms.length);
          if (!tierCheck.allowed) {
            logger.info('[create_room] Tier check failed', { gmUserId, reason: tierCheck.reason });
            throw new Error(tierCheck.reason);
          }
        }
      }

      if (isPermanentRoomResume) {
        logger.info('[create_room] Checking for existing in-memory room:', { persistentRoomId: data.persistentRoomId });

        const existingRoom = rooms.get(data.persistentRoomId);
        if (existingRoom) {
          // C5: only the current room authority may bind/resume a live runtime.
          if (authorityService) {
            const denial = roomAccess.roomAuthorityDenial(existingRoom, authorityService);
            if (denial) {
              throw codedError(denial, 'Room authority is held by another server instance');
            }
            // R2/B2: local validity is not enough to resume/rebind a live
            // runtime. Require the exact captured token to still be the
            // fresh backend holder before any participation is restored.
            const resumeToken = existingRoom.authorityToken || authorityService.currentToken(existingRoom.id);
            const fresh = await authorityService.assertCurrent(resumeToken, { backendCheck: true });
            if (!fresh.ok) {
              throw codedError(fresh.code || 'room_authority_lost', 'Room authority is held by another server instance');
            }
            authorityService.attachRoom(existingRoom);
          }
          // Live server memory owns table truth. An ordinary rejoin must never
          // fetch or apply older stored gameplay state.
          const ownerCheck = resolvePermanentRoomAccess(existingRoom, socket.data?.userId);
          if (!ownerCheck.ok) {
            throw codedError(
              ownerCheck.code,
              ownerCheck.code === roomAccess.DENIAL_CODES.OWNER_RECOVERY_REQUIRED
                ? 'Room owner could not be proven; explicit owner recovery is required'
                : 'Not authorized to resume this room'
            );
          }
          bindResumedGm(existingRoom, socket, data, players, uuidv4);
          room = existingRoom;
          logger.info('[create_room] Resumed existing live room without cloud state application', { roomId: room.id });
        } else {
          logger.info('[create_room] Reconstructing room from one classified checkpoint read:', { persistentRoomId: data.persistentRoomId });

          if (!data.persistentRoomId) {
            throw new Error('Persistent room ID is required for room resume');
          }

          const firestoreRoomId = data.persistentRoomId;
          room = await establishRoomOnce(rooms, firestoreRoomId, async() => {
            let classification = await firebaseService.readRoomCheckpoint(firestoreRoomId);

            if (classification.kind === 'ABSENT_ROOM') {
              throw new Error(`Permanent room not found in Firestore: ${firestoreRoomId}`);
            }
            // A transient read failure is a generic availability result, not
            // private room detail.
            if (classification.kind === 'READ_FAILED') {
              throw new Error(classificationFailureMessage(classification));
            }

            // Authorization before detailed classification/recovery disclosure.
            // A foreign caller learns only a bounded denial.
            const access = classification.roomMetadata || {};
            const ownerCheck = resolvePermanentRoomAccess(access, socket.data?.userId);
            if (!ownerCheck.ok) {
              throw codedError(
                ownerCheck.code,
                ownerCheck.code === roomAccess.DENIAL_CODES.OWNER_RECOVERY_REQUIRED
                  ? 'Room owner could not be proven; explicit owner recovery is required'
                  : 'Not authorized to resume this room'
              );
            }

            // C5: acquire room authority BEFORE any runtime side effect. The
            // selected checkpoint is re-read after acquisition and the caller
            // is re-authorized against the fresh metadata.
            let claimToken = null;
            if (authorityService) {
              const claim = await authorityService.acquire(firestoreRoomId);
              if (!claim.ok) {
                throw codedError(claim.code, 'Room authority is held by another server instance');
              }
              claimToken = claim.token;
            }

            try {
              // R4: after acquisition the FRESH classification is the source of
              // truth for runtime/admin access data. Pre-claim metadata is only
              // used for the bounded owner proof above.
              let freshAccess = classification.roomMetadata || {};
              if (authorityService) {
                classification = await firebaseService.readRoomCheckpoint(firestoreRoomId);
                if (classification.kind === 'READ_FAILED') {
                  throw new Error(classificationFailureMessage(classification));
                }
                freshAccess = classification.roomMetadata || {};
                const freshOwner = resolvePermanentRoomAccess(freshAccess, socket.data?.userId);
                if (!freshOwner.ok) {
                  throw codedError(
                    freshOwner.code,
                    freshOwner.code === roomAccess.DENIAL_CODES.OWNER_RECOVERY_REQUIRED
                      ? 'Room owner could not be proven; explicit owner recovery is required'
                      : 'Not authorized to resume this room'
                  );
                }
              }

              if (classification.kind !== 'ROOM_PRESENT_NO_SNAPSHOT' && !classification.selectedSnapshot) {
                throw new Error(classificationFailureMessage(classification));
              }

              const reconstructed = initialGameStateFromClassification(classification, data.gameState);

              // C2: construct the candidate runtime WITHOUT installing it into
              // the global registries. Every awaited step below (access policy,
              // final claim acceptance) therefore has no operation-owned runtime
              // side effect to retire on failure.
              const candidateName = freshAccess.name || data.roomName || 'Campaign Room';
              const candidateMembers = Array.isArray(freshAccess.members) && freshAccess.members.length
                ? freshAccess.members
                : [freshAccess.gmId];
              if (!buildRoomCandidate || !installRoomCandidate) {
                // C2: authority-sensitive reconstruction must never use an
                // installing constructor. Missing two-phase hooks fail closed
                // before any runtime/player/channel effect is created.
                throw codedError(
                  roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE,
                  'Room reconstruction is unavailable on this server'
                );
              }
              const candidate = await buildRoomCandidate(
                candidateName,
                data.gmName,
                socket.id,
                data.password || '',
                data.playerColor || DEFAULT_GM_COLOR,
                firestoreRoomId,
                reconstructed.gameState,
                freshAccess.gmId,
                candidateMembers
              );
              const created = candidate ? candidate.room : null;

              if (!created) {
                logger.error('[create_room] Failed to create room object from classified data', { firestoreRoomId });
                throw new Error('Failed to create room from classified checkpoint data');
              }

              applyClassificationToRoom(created, classification);
              created.gmId = freshAccess.gmId;
              created.members = Array.isArray(freshAccess.members) ? [...freshAccess.members] : [freshAccess.gmId];
              // Stored access policy survives reconstruction, including a stored
              // open/null policy. A request password never replaces persisted
              // policy; it is only persisted when activating a new draft that has
              // no stored policy yet.
              const storedHash = typeof freshAccess.passwordHash === 'string' ? freshAccess.passwordHash : null;
              if (classification.kind === 'ROOM_PRESENT_NO_SNAPSHOT') {
                if (storedHash) {
                  created.passwordHash = storedHash;
                } else if (data.password) {
                  const newHash = await hashPassword(data.password);
                  const persisted = await firebaseService.updateRoomAccessPolicy(
                    firestoreRoomId,
                    { passwordHash: newHash },
                    claimToken ? { authority: claimToken } : {}
                  );
                  if (!persisted || persisted.ok !== true) {
                    throw codedError(roomAccess.DENIAL_CODES.MEMBERSHIP_PERSISTENCE_FAILED,
                      'Room access policy could not be persisted; activation was refused');
                  }
                  created.passwordHash = newHash;
                } else {
                  created.passwordHash = null;
                }
              } else {
                created.passwordHash = storedHash;
              }
              if (Array.isArray(freshAccess.bannedUsers) && freshAccess.bannedUsers.length) {
                created.bannedUsers = [...freshAccess.bannedUsers];
              }
              if (classification.roomMetadata && classification.roomMetadata.settings &&
              typeof classification.roomMetadata.settings === 'object' && !Array.isArray(classification.roomMetadata.settings)) {
                created.settings = { ...classification.roomMetadata.settings };
              }
              if (classification.roomMetadata && typeof classification.roomMetadata.name === 'string' && classification.roomMetadata.name) {
                created.name = classification.roomMetadata.name;
              }
              if (reconstructed.provenance) {created.pendingProvenance = reconstructed.provenance;}

              logger.info('[create_room] Permanent room reconstructed', {
                roomId: created.id,
                roomName: created.name,
                kind: classification.kind,
                revision: created.checkpointRevision,
                migrationRequired: created.migrationRequired
              });

              // B2/C2: after EVERY awaited reconstruction step, the ORIGINAL
              // claim must still be the fresh backend holder before the runtime
              // is attached/installed. A replacement authority installs nothing.
              if (authorityService && claimToken) {
                const finalClaim = await authorityService.assertCurrent(claimToken, { backendCheck: true });
                if (!finalClaim.ok) {
                  throw codedError(
                    finalClaim.code || roomAccess.DENIAL_CODES.ROOM_AUTHORITY_LOST,
                    'Room authority changed during reconstruction; runtime was not installed'
                  );
                }
              }

              // C2: install ONLY after final claim acceptance. The save enqueue
              // also happens after acceptance so a failed reconstruction leaves
              // no checkpoint work behind.
              installRoomCandidate({ rooms, players, room: created, gmPlayer: candidate.gmPlayer, gmSocketId: socket.id });
              if (created.isPermanent && firebaseBatchWriter && !created.migrationRequired &&
              classification.kind === 'ROOM_PRESENT_NO_SNAPSHOT') {
                firebaseBatchWriter.queueWrite(created.id, created.gameState, true);
              }
              if (authorityService) {authorityService.attachRoom(created);}
              return created;
            } catch (error) {
              if (authorityService && claimToken) {
                try {await authorityService.release(claimToken);} catch (_releaseError) { /* unconfirmed release waits for expiry */ }
              }
              throw error;
            }
          });

          // A concurrent waiter may have reused a room another caller
          // established. Every caller must independently re-authorize BEFORE
          // any binding side effect.
          const establishedRoom = rooms.get(firestoreRoomId) || room;
          const recheck = resolvePermanentRoomAccess(establishedRoom, socket.data?.userId);
          if (!recheck.ok) {
            throw codedError(
              recheck.code,
              recheck.code === roomAccess.DENIAL_CODES.OWNER_RECOVERY_REQUIRED
                ? 'Room owner could not be proven; explicit owner recovery is required'
                : 'Not authorized to resume this room'
            );
          }
          room = establishedRoom;

          // A concurrent waiter may have reused the established room; bind this
          // socket as the current GM regardless of which path created it.
          if (authorityService) {authorityService.attachRoom(room);}
          bindResumedGm(room, socket, data, players, uuidv4);
        }
      } else {
        if (!data.roomName) {
          throw new Error('Room name is required for room creation');
        }

        // R4: acquire authority BEFORE installing the temporary runtime. A
        // failed claim leaves zero authoritative runtime side effects.
        const tempRoomId = uuidv4();
        let tempClaimToken = null;
        if (authorityService) {
          const claim = await authorityService.acquire(tempRoomId);
          if (!claim.ok) {
            throw codedError(claim.code, 'Room authority could not be established; room creation was refused');
          }
          tempClaimToken = claim.token;
        }
        try {
          room = await createRoom(
            data.roomName,
            data.gmName,
            socket.id,
            data.password || '',
            data.playerColor || '#4a90e2',
            false,
            tempRoomId,
            null,
            socket.data.userId,
            socket.data.userId ? [socket.data.userId] : []
          );
        } catch (error) {
          if (authorityService && tempClaimToken) {
            try {await authorityService.release(tempClaimToken);} catch (_releaseError) { /* waits for expiry */ }
          }
          throw error;
        }

        if (!room) {
          if (authorityService && tempClaimToken) {
            try {await authorityService.release(tempClaimToken);} catch (_releaseError) { /* waits for expiry */ }
          }
          throw new Error('Failed to create temporary room');
        }

        // createRoom treats a supplied id as a permanent room; this branch is a
        // temporary server runtime.
        room.persistentRoomId = undefined;
        room.isPermanent = false;
        if (authorityService) {authorityService.attachRoom(room);}

        if (data.description) {
          if (!room.settings) {room.settings = {};}
          room.settings.description = data.description;
          logger.info('[create_room] Added description to temporary room', { description: data.description });
        }

        logger.info('[create_room] Temporary room created', {
          roomId: room.id,
          roomName: room.name
        });
      }

      if (!room) {
        throw new Error('Room creation failed: room is null after creation');
      }

      if (!room.id) {
        throw new Error('Room creation failed: room has no ID');
      }

      if (!room.gm) {
        throw new Error('Room creation failed: room has no GM data');
      }

      // C5: temporary server multiplayer rooms also hold room authority before
      // any transport/presence side effect. Reconstructed/resumed rooms were
      // already claimed and attached above.
      if (authorityService && !room.authorityToken) {
        const claim = await authorityService.acquire(room.id);
        if (!claim.ok) {
          rooms.delete(room.id);
          players.delete(socket.id);
          throw codedError(claim.code, 'Room authority could not be established; room creation was refused');
        }
        authorityService.attachRoom(room);
      }

      if (data.character && room.gm) {
        room.gm.character = roomAccess.projectCharacterForClient(data.character);
        logger.info('[create_room] Updated GM character data', {
          hasCharacter: !!data.character,
          hasTokenSettings: !!data.character?.tokenSettings
        });
      }

      socket.join(room.id);

      const roomForEmission = roomAccess.buildRoomProjection(room);
      roomForEmission.deltaSyncCapabilities = getDeltaSyncCapabilities();

      socket.emit('room_created', { room: roomForEmission });
      logger.info('[create_room] Room created successfully', { roomId: room.id, roomName: room.name });

      socket.emit('room_joined', {
        room: roomForEmission,
        player: roomAccess.projectPlayerForClient(room.gm),
        isGM: true,
        isGMReconnect: false
      });
      logger.info('[create_room] Emitted room_joined for GM', { roomId: room.id });

      io.emit('room_list', getPublicRooms());

      const gmUserId = socket.data?.userId || null;

      if (gmUserId) {
        logger.info('[create_room] Notifying party members for GM', { gmUserId, roomId: room.id });
        notifyPartyMembersOfGMJoin(gmUserId, room.id, {
          name: data.gmName,
          characterName: data.character?.name || data.gmName,
          characterClass: data.character?.class,
          characterLevel: data.character?.level,
          description: data.description || room.settings?.description
        }, data.partyMembers || []);
      } else {
        logger.warn('[create_room] No GM userId found, cannot notify party members', {
          socketId: socket.id,
          socketDataUserId: socket.data?.userId
        });
      }

    } catch (error) {
      logger.error('[create_room] Error creating room:', { error: error.message, stack: error.stack, code: error.code });
      emitRoomError(socket, error);
    }
  }));

  socket.on('join_room', requireAuth(async(data) => {
    try {
      const { roomId, playerName, password, playerColor, character, isReconnect } = data;

      const uid = socket.data?.userId || null;
      if (!uid) {
        socket.emit('room_error', { error: 'Authentication required', code: roomAccess.DENIAL_CODES.NOT_AUTHENTICATED });
        return;
      }

      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('room_error', { error: 'Room not found', code: roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE });
        return;
      }

      // C5: only the current room authority may serve room operations. A room
      // owned by another server instance refuses before any side effect.
      if (authorityService) {
        const denial = roomAccess.roomAuthorityDenial(room, authorityService);
        if (denial) {
          socket.emit('room_error', { error: 'Room is not currently available on this server', code: denial });
          return;
        }
        // R2/B2: cached local validity is not enough for join/reclaim. The
        // exact captured token must still be the fresh backend holder before
        // runtime participation is restored.
        const joinToken = room.authorityToken || authorityService.currentToken(room.id);
        const freshJoin = await authorityService.assertCurrent(joinToken, { backendCheck: true });
        if (!freshJoin.ok) {
          socket.emit('room_error', { error: 'Room is not currently available on this server', code: freshJoin.code });
          return;
        }
        authorityService.attachRoom(room);
      }

      // H2: permanent/durable rooms require a normal non-anonymous account.
      if (room.isPermanent) {
        const identity = roomAccess.checkDurableRoomIdentity(socket);
        if (!identity.allowed) {
          socket.emit('room_error', {
            error: identity.code === roomAccess.DENIAL_CODES.ACCOUNT_REQUIRED
              ? 'A signed-in, non-anonymous account is required for this room'
              : 'Authentication required',
            code: identity.code
          });
          return;
        }
      }

      // Owner recovery state: never admit or mutate an unowned legacy room.
      if (room.isPermanent && !roomAccess.hasProvableOwner(room)) {
        socket.emit('room_error', {
          error: 'Room owner could not be proven; explicit owner recovery is required',
          code: roomAccess.DENIAL_CODES.OWNER_RECOVERY_REQUIRED
        });
        return;
      }

      // No ban management is added by P4; an existing ban list is honored.
      if (Array.isArray(room.bannedUsers) && room.bannedUsers.includes(uid)) {
        socket.emit('room_error', { error: 'You are not permitted to join this room', code: roomAccess.DENIAL_CODES.NOT_ROOM_MEMBER });
        return;
      }

      // C3: pending-admission recovery must be resolved BEFORE any membership-
      // based reconnect exemption. A pending_admission UID is not proof of
      // completed legitimate membership and must never supply a password/
      // reconnect shortcut. Discovery failure fails closed, and `ok:true` alone
      // is NOT resolution: this user's obligation must be explicitly resolved
      // or the join is refused.
      if (room.isPermanent && authorityService &&
        firebaseService && typeof firebaseService.removeRoomMember === 'function' &&
        typeof firebaseService.listMembershipCompensations === 'function') {
        let recovery;
        try {
          recovery = await roomAccess.retryMembershipCompensations(
            firebaseService, authorityService, room.id, rooms
          );
        } catch (_error) {
          recovery = { ok: false, code: roomAccess.DENIAL_CODES.MEMBERSHIP_COMPENSATION_UNAVAILABLE, unresolved: [] };
        }
        if (!recovery || recovery.ok !== true) {
          socket.emit('room_error', {
            error: 'Room membership recovery is temporarily unavailable; join was refused',
            code: (recovery && recovery.code) || roomAccess.DENIAL_CODES.MEMBERSHIP_COMPENSATION_UNAVAILABLE
          });
          return;
        }
        const userUnresolved = Array.isArray(recovery.unresolved) &&
          recovery.unresolved.some((entry) => entry.userId === uid);
        if (userUnresolved) {
          // This UID still has an unresolved pending-admission obligation, so
          // raw durable membership cannot authorize a reconnect. Fail closed
          // rather than allow a later recovery pass to regrant without the
          // credentials that were never checked.
          socket.emit('room_error', {
            error: 'Join was refused; the room membership change needs retry',
            code: roomAccess.DENIAL_CODES.MEMBERSHIP_COMPENSATION_REQUIRED
          });
          return;
        }
      }

      // Password is the initial admission credential, not perpetual proof.
      // Verified owner resume and durable member reconnect do not require it.
      let admissionClass = roomAccess.classifyAdmission(room, uid);
      if (room.isPermanent && admissionClass === roomAccess.ADMISSION.MEMBER_RECONNECT &&
        !roomAccess.isDurableMember(room, uid) && !roomAccess.isOwningGm(room, uid)) {
        admissionClass = roomAccess.ADMISSION.NEW_ADMISSION;
      }
      const requiresPassword = admissionClass === roomAccess.ADMISSION.NEW_ADMISSION;

      if (requiresPassword) {
        const passwordValid = await verifyPassword(password, room.passwordHash);
        if (!passwordValid) {
          socket.emit('room_error', { error: 'Invalid password', code: roomAccess.DENIAL_CODES.INVALID_PASSWORD });
          return;
        }
      }

      // Owner reclaim goes through create_room; join_room supports it for
      // compatibility but the same owner proof applies.
      if (roomAccess.isOwningGm(room, uid)) {
        room.isActive = true;
        room.gmDisconnectedAt = null;
        room.gmSessionId = uuidv4();
        room.inventoryShares = {};
        if (!room.gm) {
          room.gm = { id: uuidv4(), name: sanitizePlayerName(playerName) || 'GM', isGM: true, color: playerColor || DEFAULT_GM_COLOR };
        }
        room.gm.socketId = socket.id;
        room.gm.userId = uid;
        if (character) {room.gm.character = roomAccess.projectCharacterForClient(character);}

        const gmPlayer = {
          id: room.gm.id,
          name: room.gm.name || sanitizePlayerName(playerName) || 'GM',
          socketId: socket.id,
          roomId: room.id,
          isGM: true,
          color: room.gm.color || DEFAULT_GM_COLOR,
          character: room.gm.character || null,
          currentMapId: (room.gameState && room.gameState.defaultMapId) || 'default',
          userId: uid
        };
        players.set(socket.id, gmPlayer);
        socket.join(room.id);

        const roomForEmission = roomAccess.buildRoomProjection(room);
        roomForEmission.deltaSyncCapabilities = getDeltaSyncCapabilities();
        socket.emit('room_joined', {
          room: roomForEmission,
          player: roomAccess.projectPlayerForClient(gmPlayer),
          isGM: true,
          isGMReconnect: true,
          isReconnect: isReconnect === true
        });
        socket.to(room.id).emit('gm_reconnected', { gmName: gmPlayer.name, gmId: gmPlayer.id, roomId: room.id });
        io.emit('room_list', getPublicRooms());
        logger.info('[join_room] GM reclaimed room', { roomId, userId: uid });
        return;
      }

      const admission = await roomAccess.admitVerifiedMember({
        socket,
        rooms,
        players,
        firebaseService,
        uuidv4,
        room,
        userId: uid,
        playerName,
        playerColor: playerColor || DEFAULT_PLAYER_COLOR,
        character,
        sanitizePlayerName,
        authorityService
      });

      if (!admission.ok) {
        socket.emit('room_error', {
          error: admission.code === roomAccess.DENIAL_CODES.CAPACITY_REACHED ? 'Room is full'
            : admission.code === roomAccess.DENIAL_CODES.MEMBERSHIP_PERSISTENCE_FAILED ? 'Room membership could not be confirmed; join was refused'
              : admission.code === roomAccess.DENIAL_CODES.MEMBERSHIP_COMPENSATION_REQUIRED ? 'Join was refused; the room membership change needs retry'
                : admission.code === roomAccess.DENIAL_CODES.MEMBERSHIP_COMPENSATION_UNAVAILABLE ? 'Room membership recovery is temporarily unavailable; join was refused'
                  : 'Unable to join this room',
          code: admission.code
        });
        return;
      }

      const liveRoom = admission.room;
      const player = admission.player;

      const roomForEmission = roomAccess.buildRoomProjection(liveRoom);
      roomForEmission.deltaSyncCapabilities = getDeltaSyncCapabilities();

      socket.emit('room_joined', {
        room: roomForEmission,
        player: roomAccess.projectPlayerForClient(player),
        isGM: false,
        isGMReconnect: false,
        // Informational echo of the client's reconnect intent; never identity.
        isReconnect: isReconnect === true
      });

      socket.to(liveRoom.id).emit('player_joined', {
        player: roomAccess.projectPlayerForClient(player),
        playerCount: roomAccess.countActiveMemberSlots(liveRoom)
      });

      io.emit('room_list', getPublicRooms());

      logger.info('[join_room] Player joined room', { playerId: player.id, userId: uid, roomId: liveRoom.id });

    } catch (error) {
      logger.error('[join_room] Error joining room:', { error: error.message, code: error.code });
      emitRoomError(socket, error);
    }
  }));

  /**
   * Verified owner/member metadata listing. Includes inactive entitled rooms.
   * Metadata only: no state, inventory, password hash or raw roster.
   */
  socket.on('request_my_rooms', requireAuth(async(_data, ack) => {
    try {
      const identity = roomAccess.checkDurableRoomIdentity(socket);
      if (!identity.allowed) {
        if (typeof ack === 'function') {
          ack({ success: false, error: 'A signed-in, non-anonymous account is required', code: identity.code });
        }
        return;
      }
      const uid = socket.data?.userId;
      const liveList = roomAccess.buildMyRoomsProjection(rooms, uid);
      let cloudList = [];
      if (firebaseService && typeof firebaseService.listEntitledRoomMetadata === 'function') {
        const metadata = await firebaseService.listEntitledRoomMetadata(uid);
        cloudList = metadata
          .map((entry) => roomAccess.buildEntitledRoomProjection(entry, uid))
          .filter(Boolean);
      }
      const roomsList = roomAccess.mergeMyRooms(liveList, cloudList);
      if (typeof ack === 'function') {
        ack({ success: true, rooms: roomsList });
      } else {
        socket.emit('my_rooms', { rooms: roomsList });
      }
    } catch (error) {
      logger.error('[request_my_rooms] Error:', { error: error.message });
      if (typeof ack === 'function') {
        ack({ success: false, error: 'Unable to list rooms', code: roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE });
      }
    }
  }));

  /**
   * Server-mediated safe draft creation. Refuses any id with pre-existing
   * room state/fragments so a new draft can never claim orphaned legacy state.
   */
  socket.on('create_room_draft', requireAuth(async(data, ack) => {
    const respond = (payload) => { if (typeof ack === 'function') {ack(payload);} };
    try {
      const identity = roomAccess.checkDurableRoomIdentity(socket);
      if (!identity.allowed) {
        respond({ success: false, code: identity.code, error: 'A signed-in, non-anonymous account is required' });
        return;
      }
      const uid = socket.data.userId;
      const name = data && typeof data.name === 'string' ? data.name.trim() : '';
      if (!name || name.length > 100) {
        respond({ success: false, error: 'A valid room name is required', code: 'invalid_name' });
        return;
      }
      const settings = data && data.settings && typeof data.settings === 'object' && !Array.isArray(data.settings)
        ? data.settings : {};
      const ownedCount = Array.from(rooms.values()).filter((r) => r.gmId === uid).length;
      const tierCheck = await canCreateRoom(uid, ownedCount);
      if (!tierCheck.allowed) {
        respond({ success: false, error: tierCheck.reason, code: 'room_limit' });
        return;
      }
      // C5: draft creation is an account-level ROOM operation. It claims target
      // authority, performs the bounded write under the atomic fence, then
      // releases (no persistent live runtime remains).
      const targetRoomId = data && typeof data.roomId === 'string' && data.roomId ? data.roomId : uuidv4();
      let draftClaim = null;
      if (authorityService) {
        draftClaim = await authorityService.acquire(targetRoomId);
        if (!draftClaim.ok) {
          respond({ success: false, code: draftClaim.code, error: 'Room is currently unavailable' });
          return;
        }
      }
      let result;
      let draftAuthority = { ok: true, code: null };
      let releaseResult = { ok: true, released: true, code: null };
      try {
        result = await firebaseService.createRoomDraft({
          roomId: targetRoomId,
          userId: uid,
          name,
          description: data && typeof data.description === 'string' ? data.description : '',
          settings,
          gmName: data && typeof data.gmName === 'string' ? data.gmName : undefined,
          authority: draftClaim ? draftClaim.token : null
        });
        // B9: a committed draft under the ORIGINATING claim is not a current
        // success after a takeover. Revalidate the exact claim before release.
        if (result && result.ok === true && authorityService && draftClaim) {
          draftAuthority = await authorityService.assertCurrent(draftClaim.token, { backendCheck: true });
        }
      } finally {
        if (authorityService && draftClaim) {
          try {
            releaseResult = await authorityService.release(draftClaim.token);
          } catch (_releaseError) {
            releaseResult = { ok: false, code: 'room_authority_unavailable', released: false };
          }
        }
      }
      if (!result || result.ok !== true) {
        respond({
          success: false,
          code: result && result.reason === 'owner_recovery_required'
            ? roomAccess.DENIAL_CODES.OWNER_RECOVERY_REQUIRED
            : roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE,
          error: result && result.reason === 'owner_recovery_required'
            ? 'Existing room state requires explicit owner recovery'
            : 'Room draft could not be created'
        });
        return;
      }
      // C5: a committed draft is HISTORICAL durability when the captured
      // authority is lost before/at release. No live authoritative creation
      // completion is claimed.
      const releaseClean = !draftClaim ||
        (releaseResult && releaseResult.ok === true && releaseResult.released === true);
      if (!draftAuthority.ok || !releaseClean) {
        respond({
          success: false,
          outcome: 'authority_lost',
          durable: true,
          roomId: result.roomId,
          existing: result.existing === true,
          code: draftAuthority.code || (releaseResult && releaseResult.code) || roomAccess.DENIAL_CODES.ROOM_AUTHORITY_LOST,
          error: 'Room draft was saved but the current room authority was lost'
        });
        return;
      }
      respond({ success: true, roomId: result.roomId, existing: result.existing === true });
    } catch (error) {
      logger.error('[create_room_draft] Error:', { error: error.message });
      respond({ success: false, error: 'Room draft creation failed' });
    }
  }));

  /**
   * Bounded entitled shared-state read for an inactive cloud room or draft
   * that is not currently reconstructed. Uses the classified P3 reader and
   * the outbound privacy projection; never exposes raw documents.
   */
  socket.on('request_room_checkpoint', requireAuth(async(data, ack) => {
    const respond = (payload) => { if (typeof ack === 'function') {ack(payload);} };
    try {
      const identity = roomAccess.checkDurableRoomIdentity(socket);
      if (!identity.allowed) {
        respond({ success: false, code: identity.code, error: 'A signed-in, non-anonymous account is required' });
        return;
      }
      const uid = socket.data.userId;
      const roomId = data && typeof data.roomId === 'string' ? data.roomId : null;
      if (!roomId) {
        respond({ success: false, code: roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE, error: 'Room is required' });
        return;
      }
      const live = rooms.get(roomId);
      if (live) {
        if (!roomAccess.isEntitled(live, uid)) {
          respond({ success: false, code: roomAccess.DENIAL_CODES.NOT_ROOM_MEMBER, error: 'Room unavailable' });
          return;
        }
        respond({ success: true, roomId, projection: roomAccess.buildRoomProjection(live) });
        return;
      }
      const classification = await firebaseService.readRoomCheckpoint(roomId);
      if (classification.kind === 'ABSENT_ROOM') {
        respond({ success: false, code: roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE, error: 'Room unavailable' });
        return;
      }
      const access = classification.roomMetadata || {};
      if (!roomAccess.isEntitled({ gmId: access.gmId, members: access.members }, uid)) {
        respond({ success: false, code: roomAccess.DENIAL_CODES.NOT_ROOM_MEMBER, error: 'Room unavailable' });
        return;
      }
      if (!classification.selectedSnapshot) {
        respond({ success: false, code: roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE, error: 'Room state is not available' });
        return;
      }
      const gameState = roomCheckpoint.hydrateSnapshotToGameState(classification.selectedSnapshot);
      respond({
        success: true,
        roomId,
        projection: {
          id: roomId,
          name: access.name,
          gm: null,
          players: [],
          settings: access.settings || {},
          isPermanent: true,
          gameState: roomAccess.projectGameStateForClient(gameState)
        }
      });
    } catch (error) {
      logger.error('[request_room_checkpoint] Error:', { error: error.message });
      respond({ success: false, error: 'Room state is unavailable' });
    }
  }));

  socket.on('leave_room', (ackCallback) => {
    const player = players.get(socket.id);
    if (!player) {
      if (typeof ackCallback === 'function') {ackCallback();}
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {return;}

    const roomId = player.roomId;

    room.players.delete(player.id);
    players.delete(socket.id);

    if (room.gameState && room.gameState.playerMapAssignments) {
      delete room.gameState.playerMapAssignments[player.id];
    }

    // Presence/session leave does NOT revoke durable membership (H1).
    socket.leave(roomId);

    // R2: a stale lifecycle must not keep broadcasting room presence.
    const leaveDenial = authorityService ? roomAccess.roomAuthorityDenial(room, authorityService) : null;

    if (player.isGM) {
      room.isActive = false;
      room.gmDisconnectedAt = new Date();
      room.gmSessionId = null;
      room.inventoryShares = {};

      if (!leaveDenial) {
        socket.to(roomId).emit('gm_disconnected', {
          gmName: player.name,
          gmId: player.id,
          roomId
        });
      }

      logger.info('[leave_room] GM left room, room marked inactive', { roomId, gmId: player.id });
    } else {
      if (player.userId) {clearInventorySharesFor(room, player.userId);}
      if (!leaveDenial) {
        socket.to(roomId).emit('player_left', {
          playerId: player.id,
          playerName: player.name,
          playerCount: roomAccess.countActiveMemberSlots(room)
        });
      }
    }

    io.emit('room_list', getPublicRooms());

    logger.info('[leave_room] Player left room', { playerId: player.id, roomId, isGM: player.isGM });

    if (typeof ackCallback === 'function') {ackCallback();}
  });

  /**
   * Explicit durable membership revocation by the user. Distinct from
   * leave_room (presence only). Detaches every device of that UID.
   */
  socket.on('leave_room_membership', async(_data, ackCallback) => {
    const respond = (payload) => { if (typeof ackCallback === 'function') {ackCallback(payload);} };
    try {
      const player = players.get(socket.id);
      const uid = socket.data?.userId || null;
      if (!player || !uid) {
        respond({ success: false, error: 'Not in a room', code: roomAccess.DENIAL_CODES.NOT_ROOM_MEMBER });
        return;
      }
      const room = rooms.get(player.roomId);
      if (!room) {
        respond({ success: false, error: 'Room not found', code: roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE });
        return;
      }
      if (player.isGM) {
        respond({ success: false, error: 'Room owners cannot leave membership this way', code: roomAccess.DENIAL_CODES.OWNER_REQUIRED });
        return;
      }
      const revoke = await roomAccess.revokeMembership(firebaseService, room, uid, authorityService);
      if (!revoke.ok) {
        respond({ success: false, error: 'Membership removal could not be confirmed', code: revoke.code });
        return;
      }
      // B9: after the durable revoke await, the ORIGINATING epoch must still be
      // current before local detach/broadcast effects.
      if (authorityService) {
        const contextCheck = await roomAuthority.assertOperationContext(
          roomAuthority.getOperationContext(_data), authorityService,
          { binding: { rooms, players, socketId: socket.id } }
        );
        if (!contextCheck.ok) {
          respond({
            success: false,
            code: contextCheck.code || roomAccess.DENIAL_CODES.ROOM_AUTHORITY_LOST,
            error: 'Membership removal was saved but the current room authority was lost'
          });
          return;
        }
      }
      roomAccess.detachMemberDevices({ io, room, players, userId: uid });
      room.inventoryShares = Object.fromEntries(
        Object.entries(room.inventoryShares || {}).filter(([, share]) => share.ownerUserId !== uid)
      );
      room.players.delete(player.id);
      players.delete(socket.id);
      socket.leave(room.id);
      socket.to(room.id).emit('player_left', {
        playerId: player.id,
        playerName: player.name,
        playerCount: roomAccess.countActiveMemberSlots(room)
      });
      io.emit('room_list', getPublicRooms());
      respond({ success: true });
    } catch (error) {
      logger.error('[leave_room_membership] Error:', { error: error.message });
      respond({ success: false, error: 'Membership removal failed' });
    }
  });

  socket.on('disconnect', () => {
    const socialPresence = onlineSocialUsers.get(socket.id);
    if (socialPresence) {
      onlineSocialUsers.delete(socket.id);
      logger.info('[disconnect] Social presence removed', {
        socketId: socket.id,
        userId: socialPresence.userId
      });
    }

    let userId = socket.data.userId;
    let userName = 'Unknown';

    if (socialPresence && socialPresence.userId) {
      userId = socialPresence.userId;
      userName = socialPresence.name || userName;
    }

    const player = players.get(socket.id);
    if (player) {
      if (!userId) {
        userId = player.userId || userId || player.id;
      }
      userName = player.name || userName;
    }

    if (!player) {
      logger.debug('[disconnect] Non-room player disconnected (party cleanup deferred)', {
        socketId: socket.id,
        hadSocialPresence: !!socialPresence,
        userId
      });
      return;
    }

    handlePartyLeave(userId, userName, socket.id);

    const room = rooms.get(player.roomId);
    if (room) {
      // R2: a stale lifecycle must not keep broadcasting room presence.
      const disconnectDenial = authorityService ? roomAccess.roomAuthorityDenial(room, authorityService) : null;
      if (player.isGM) {
        room.isActive = false;
        room.gmDisconnectedAt = new Date();
        room.gmSessionId = null;
        // H14: a GM session end terminates every inventory share.
        room.inventoryShares = {};
        logger.info('[disconnect] GM disconnected, room marked inactive', { roomId: room.id, userId });

        if (!disconnectDenial) {
          socket.to(player.roomId).emit('gm_disconnected', {
            gmName: player.name,
            gmId: userId,
            roomId: room.id
          });
        }
      } else {
        if (player.userId) {
          clearInventorySharesFor(room, player.userId);
          if (!room.disconnectedPlayers) {room.disconnectedPlayers = {};}
          room.disconnectedPlayers[player.userId] = {
            playerId: player.id,
            playerName: player.name,
            disconnectedAt: Date.now()
          };
        }
        room.players.delete(player.id);
        if (room.gameState && room.gameState.playerMapAssignments) {
          delete room.gameState.playerMapAssignments[player.id];
        }
        if (!disconnectDenial) {
          socket.to(player.roomId).emit('player_left', {
            playerId: player.id,
            playerName: player.name,
            playerCount: roomAccess.countActiveMemberSlots(room)
          });
        }
      }
    }

    players.delete(socket.id);
    logger.info('[disconnect] Player disconnected', { socketId: socket.id, playerId: player.id, userId });

    io.emit('room_list', getPublicRooms());
  });
}

module.exports = { registerRoomHandlers };
