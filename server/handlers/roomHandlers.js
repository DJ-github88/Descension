/**
 * Room Handlers Module
 * 
 * Contains room CRUD operations and helper functions:
 * - createRoom: Create a new room (temporary or permanent)
 * - getPublicRooms: Get list of available rooms
 * - validateRoomMembership: Validate player membership in room
 * - hashPassword / verifyPassword: Password handling
 * - mergeRoomGameStateForResume: Merge game state for room resume
 */

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const logger = require('../services/logger');
const firebaseService = require('../services/firebaseService');
const roomAccess = require('../services/roomAccessService');
const { BCRYPT_SALT_ROUNDS, DEFAULT_MAX_PLAYERS, DEFAULT_GM_COLOR } = require('../utils/constants');

/**
 * Hash a room password
 * @param {string} password - Plain text password
 * @returns {Promise<string|null>} Hashed password or null if no password
 */
async function hashPassword(password) {
  if (!password || password.trim() === '') {
    return null;
  }
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Verify a room password
 * @param {string} plainPassword - Plain text password to verify
 * @param {string} hashedPassword - Hashed password from room
 * @returns {Promise<boolean>} Whether password is valid
 */
async function verifyPassword(plainPassword, hashedPassword) {
  const normalizedPlainPassword = (plainPassword === null || plainPassword === undefined || plainPassword === '') ? null : plainPassword.trim();
  const hasRoomPassword = hashedPassword !== null && hashedPassword !== undefined;

  logger.debug('Password verification details', {
    hasRoomPassword,
    providedPasswordType: typeof plainPassword,
    providedPasswordEmpty: !normalizedPlainPassword,
    normalizedToNull: normalizedPlainPassword === null
  });

  // Case 1: Room has no password
  if (!hasRoomPassword) {
    if (!normalizedPlainPassword) {
      logger.debug('Room has no password, user provided none - ALLOWED');
      return true;
    }
    logger.debug('Room has no password, user provided one anyway - ALLOWED');
    return true;
  }

  // Case 2: Room has a password but user didn't provide one
  if (!normalizedPlainPassword) {
    logger.debug('Room requires password but none provided - DENIED');
    return false;
  }

  // Case 3: Both have passwords - verify with bcrypt
  const matches = await bcrypt.compare(normalizedPlainPassword, hashedPassword);
  logger.debug('Password comparison result', { matches });
  return matches;
}

/**
 * Get list of publicly discoverable rooms (H1 explicit opt-in).
 *
 * Project 4: discovery is server-mediated and uses the exact shallow
 * eight-field projection. Only active rooms whose owner explicitly set
 * settings.isPrivate === false are listed; missing/legacy privacy state is
 * unlisted. The /api/rooms endpoint and room_list event share this projector.
 *
 * @param {Map} rooms - Rooms map
 * @returns {Array} Array of discovery projections
 */
function getPublicRooms(rooms) {
  return Array.from(rooms.values())
    .filter(room => roomAccess.isPubliclyDiscoverable(room))
    .map(room => roomAccess.buildDiscoveryProjection(room));
}

/**
 * Validate player membership in a room
 * @param {Object} socket - Socket instance
 * @param {string} roomId - Room ID to validate (optional - falls back to player's roomId)
 * @param {boolean} requireGM - Whether GM privileges are required
 * @param {Map} players - Players map
 * @param {Map} rooms - Rooms map
 * @param {Object} [authorityService] - C5 room authority service (optional)
 * @returns {Object} Validation result { valid, player?, room?, error?, code? }
 */
function validateRoomMembership(socket, roomId, requireGM, players, rooms, authorityService = null) {
  const player = players.get(socket.id);
  if (!player) {
    return { valid: false, error: 'Player not found' };
  }

  // CRITICAL FIX: Use player's roomId as fallback when not provided in data
  // This allows socket events that don't include roomId to still validate correctly
  const effectiveRoomId = roomId || player.roomId;

  if (player.roomId !== effectiveRoomId) {
    return { valid: false, error: 'Not a member of this room' };
  }

  if (requireGM && !player.isGM) {
    return { valid: false, error: 'GM privileges required' };
  }

  const room = rooms.get(effectiveRoomId);
  if (!room) {
    return { valid: false, error: 'Room not found' };
  }

  // Additional check: verify player is actually in room's players map or is GM
  if (!player.isGM && !room.players.has(player.id)) {
    return { valid: false, error: 'Not a member of this room' };
  }

  // C5: authoritative room operations require the current room authority.
  const denial = roomAccess.roomAuthorityDenial
    ? roomAccess.roomAuthorityDenial(room, authorityService)
    : null;
  if (denial) {
    return { valid: false, error: 'Room is not currently available on this server', code: denial };
  }

  return { valid: true, player, room };
}

/**
 * Merge game state when resuming a permanent room.
 *
 * RETIRED by Project 3: live server memory wins every ordinary rejoin and
 * reconstruction replaces collections from one selected complete checkpoint.
 * Kept only as a throwing guard so stale callers fail loudly instead of
 * silently resurrecting deleted content.
 */
function mergeRoomGameStateForResume() {
  throw new Error('mergeRoomGameStateForResume is retired (Project 3): reconstruct from one selected complete checkpoint instead');
}

/**
 * C2: construct a room runtime candidate WITHOUT installing it into the global
 * rooms/players registries. Reconstruction builds and validates the candidate
 * first; installation happens only after the final exact-claim acceptance.
 * @returns {Promise<{room: Object, gmPlayer: Object}>}
 */
async function buildRoomCandidate(roomName, gmName, gmSocketId, password, playerColor, persistentRoomId, initialGameState, gmId, members) {
  const roomId = persistentRoomId || uuidv4();
  const gmPlayerId = uuidv4();

  // Hash password before storing
  const passwordHash = await hashPassword(password);

  const room = {
    id: roomId,
    name: roomName,
    passwordHash: passwordHash,
    gm: {
      id: gmPlayerId,
      name: gmName,
      socketId: gmSocketId,
      isGM: true,
      color: playerColor || DEFAULT_GM_COLOR
    },
    players: new Map(),
    settings: {
      maxPlayers: DEFAULT_MAX_PLAYERS,
      isPrivate: true,
      allowSpectators: true
    },
    persistentRoomId: persistentRoomId,
    isPermanent: !!persistentRoomId,
    gmId: gmId,
    members: members,
    gameState: initialGameState || {
      characters: {},
      combat: {
        isActive: false,
        currentTurn: null,
        turnOrder: [],
        round: 0
      },
      defaultMapId: 'default',
      playerMapAssignments: {},
      maps: {
        'default': {
          id: 'default',
          name: 'Default Map',
          thumbnailUrl: null,
          terrainData: {},
          wallData: {},
          environmentalObjects: [],
          drawingPaths: [],
          drawingLayers: [],
          fogOfWarData: {},
          fogOfWarPaths: [],
          fogErasePaths: [],
          exploredAreas: {},
          lightSources: {},
          dndElements: [],
          viewMode: '2d',
          elevationData: {},
          rampData: {},
          sunSettings: {
            azimuth: 135,
            elevation: 45,
            color: '#fff4e0',
            intensity: 1.0,
            ambient: 0.2
          },
          tokens: {},
          characterTokens: {},
          gridItems: {}
        }
      },
      mapData: {
        backgrounds: [],
        activeBackgroundId: null,
        cameraPosition: { x: 0, y: 0 },
        zoomLevel: 1.0
      },
      tokens: {},
      characterTokens: {},
      gridItems: {},
      fogOfWar: {},
      levelEditor: {
        terrainData: {},
        wallData: {},
        environmentalObjects: [],
        drawingPaths: [],
        drawingLayers: [],
        fogOfWarData: {},
        fogOfWarPaths: [],
        fogErasePaths: [],
        exploredAreas: {},
        lightSources: {},
        dynamicFogEnabled: true,
        respectLineOfSight: true,
        dndElements: []
      },
      gridSettings: {
        gridType: 'square',
        gridSize: 50,
        gridOffsetX: 0,
        gridOffsetY: 0,
        gridLineColor: '#000000',
        gridLineThickness: 1,
        gridLineOpacity: 0.5,
        gridBackgroundColor: '#d4c5b9',
        viewMode: '2d'
      }
    },
    chatHistory: [],
    createdAt: new Date().toISOString(),
    isActive: true,
    lastActivity: new Date(),
    checkpoint: null,
    checkpointRevision: 0,
    migrationRequired: false,
    pendingProvenance: null
  };

  const gmPlayer = {
    id: gmPlayerId,
    name: gmName,
    roomId: roomId,
    isGM: true,
    color: playerColor,
    currentMapId: 'default'
  };

  return { room, gmPlayer };
}

/**
 * C2: install a previously constructed candidate into the global registries.
 * This is the ONLY operation-owned installation effect; it runs after the
 * operation's final authority acceptance.
 */
function installRoomCandidate({ rooms, players, room, gmPlayer, gmSocketId }) {
  rooms.set(room.id, room);
  players.set(gmSocketId, gmPlayer);
  if (!room.gameState.playerMapAssignments) {
    room.gameState.playerMapAssignments = {};
  }
  room.gameState.playerMapAssignments[gmPlayer.id] = gmPlayer.currentMapId;
}

/**
 * Create a new room
 * @param {string} roomName - Name of the room
 * @param {string} gmName - GM's display name
 * @param {string} gmSocketId - GM's socket ID
 * @param {string} password - Room password (optional)
 * @param {string} playerColor - GM's color
 * @param {boolean} persistToFirebase - Whether to persist to Firebase
 * @param {string} persistentRoomId - Persistent room ID for permanent rooms
 * @param {Object} initialGameState - Initial game state
 * @param {string} gmId - Authenticated user UID
 * @param {Array} members - Array of member UIDs
 * @param {Map} rooms - Rooms map to store the room
 * @param {Map} players - Players map to track GM
 * @returns {Promise<Object|null>} Created room or null on failure
 */
async function createRoom(roomName, gmName, gmSocketId, password, playerColor, persistToFirebase, persistentRoomId, initialGameState, gmId, members, rooms, players) {
  logger.info('[SyncRoom] createRoom called:', {
    roomName,
    persistentRoomId,
    hasInitialGameState: !!initialGameState
  });

  const { room, gmPlayer } = await buildRoomCandidate(
    roomName, gmName, gmSocketId, password, playerColor,
    persistentRoomId, initialGameState, gmId, members
  );

  logger.info('[SyncRoom] Room ID resolved:', {
    finalRoomId: room.id,
    source: persistentRoomId ? 'persistentRoomId parameter' : 'UUID generated'
  });

  installRoomCandidate({ rooms, players, room, gmPlayer, gmSocketId });

  // Save room metadata to Firebase (metadata only - gameplay state publishes
  // through the selected P2 checkpoint writer).
  if (persistToFirebase) {
    try {
      await firebaseService.saveRoomData(room.id, room);
      logger.info('Room metadata persisted to Firebase', { roomId: room.id, roomName });
    } catch (error) {
      logger.error('Failed to persist room metadata to Firebase', {
        roomId: room.id,
        roomName,
        error: error.message
      });
    }
  }

  return room;
}

/**
 * Initialize persistent rooms from Firestore on startup
 *
 * C5: a persisted room is installed into the local authoritative rooms Map only
 * after this process claims its room authority. A room held by another live
 * process is skipped without constructing a competing runtime. Server readiness
 * does not wait for rooms owned by another deployment.
 * @param {Map} rooms - Rooms map to load into
 * @param {{authorityService?: Object}} [options]
 * @returns {Promise<void>}
 */
async function initializePersistentRooms(rooms, options = {}) {
  const authorityService = options.authorityService || null;

  const normalizeRoom = (room) => {
    // Convert plain object players to Map if needed
    if (room.players && !(room.players instanceof Map)) {
      room.players = new Map(Object.entries(room.players));
    }
    // Rooms loaded from the cloud `rooms` collection are cloud-backed by
    // construction; temporary rooms are never persisted there.
    if (!room.isPermanent) {room.isPermanent = true;}
    if (!room.persistentRoomId) {room.persistentRoomId = room.id;}
    if (room.gameState === null) {delete room.gameState;}
    if (!Number.isSafeInteger(room.checkpointRevision) || room.checkpointRevision < 0) {
      room.checkpointRevision = room.checkpoint && Number.isSafeInteger(Number(room.checkpoint.revision))
        ? Number(room.checkpoint.revision)
        : 0;
    }
  };

  try {
    logger.info('Initializing persistent rooms from Firestore...');

    if (!authorityService) {
      // Non-authority mode (degraded startup/tests): classified read only.
      const persistentRooms = await firebaseService.loadPersistentRooms();
      for (const room of persistentRooms) {
        normalizeRoom(room);
        rooms.set(room.id, room);
      }
      logger.info(`✅ Successfully loaded ${rooms.size} persistent rooms`);
      return;
    }

    // R4: bounded discovery ONLY before authority. For each candidate room:
    // acquire authority, perform a NEW classified checkpoint read, validate
    // the claim again, and install exclusively the post-claim state. No state
    // read before the claim is ever installed.
    const roomIds = await firebaseService.discoverPersistentRoomIds();
    for (const roomId of roomIds) {
      const claim = await authorityService.acquire(roomId);
      if (!claim.ok) {
        logger.info('[initializePersistentRooms] Room authority held elsewhere; not installed locally', {
          roomId,
          code: claim.code
        });
        continue;
      }

      const room = await firebaseService.loadRoomAfterAuthorityClaim(roomId);
      if (!room) {
        // Unusable/unreadable room: never install; do not keep a lease.
        try {await authorityService.release(claim.token);} catch (_error) { /* renewal will fence */ }
        continue;
      }

      const stillCurrent = await authorityService.assertCurrent(claim.token, { backendCheck: true });
      if (!stillCurrent.ok) {
        logger.info('[initializePersistentRooms] Room authority changed during post-claim read; not installed', {
          roomId,
          code: stillCurrent.code
        });
        continue;
      }

      normalizeRoom(room);
      rooms.set(room.id, room);
      authorityService.attachRoom(room);
    }
    logger.info(`✅ Successfully loaded ${rooms.size} persistent rooms`);
  } catch (error) {
    logger.error('❌ Failed to load persistent rooms:', error);
  }
}

/**
 * Clean up inactive rooms
 * @param {Map} rooms - Rooms map
 * @param {Map} players - Players map
 * @param {number} inactiveThresholdMs - Threshold in milliseconds for inactive rooms
 */
function cleanupInactiveRooms(rooms, players, inactiveThresholdMs = 30 * 60 * 1000) {
  const now = Date.now();
  const roomsToDelete = [];

  rooms.forEach((room, roomId) => {
    if (room.disconnectedPlayers) {
      Object.keys(room.disconnectedPlayers).forEach(uid => {
        if (now - room.disconnectedPlayers[uid].disconnectedAt > inactiveThresholdMs) {
          delete room.disconnectedPlayers[uid];
        }
      });
    }

    if (room.isPermanent) {return;}

    if (!room.isActive || (room.gmDisconnectedAt && now - new Date(room.gmDisconnectedAt).getTime() > inactiveThresholdMs)) {
      if (room.players.size === 0) {
        roomsToDelete.push(roomId);
      }
    }
  });

  roomsToDelete.forEach(roomId => {
    rooms.delete(roomId);
    logger.info('[cleanup] Deleted inactive room', { roomId });
  });
}

module.exports = {
  createRoom,
  buildRoomCandidate,
  installRoomCandidate,
  getPublicRooms,
  validateRoomMembership,
  hashPassword,
  verifyPassword,
  mergeRoomGameStateForResume,
  initializePersistentRooms,
  cleanupInactiveRooms
};
