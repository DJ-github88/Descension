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

/**
 * Hash a room password
 * @param {string} password - Plain text password
 * @returns {Promise<string|null>} Hashed password or null if no password
 */
async function hashPassword(password) {
  if (!password || password.trim() === '') {
    return null;
  }
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
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
 * Get list of public/active rooms
 * @param {Map} rooms - Rooms map
 * @returns {Array} Array of room objects
 */
function getPublicRooms(rooms) {
  return Array.from(rooms.values())
    .filter(room => {
      // Only show rooms where GM is actively connected
      return room.isActive === true;
    })
    .map(room => ({
      id: room.id,
      name: room.name,
      playerCount: (room.players?.size || 0) + (room.gm && room.players && room.players.has(room.gm.id) ? 0 : 1),
      maxPlayers: room.settings?.maxPlayers || 6,
      gm: room.gm?.name || 'Unknown',
      createdAt: room.createdAt,
      hasPassword: !!room.passwordHash,
      gmOnline: !!room.isActive
    }));
}

/**
 * Validate player membership in a room
 * @param {Object} socket - Socket instance
 * @param {string} roomId - Room ID to validate (optional - falls back to player's roomId)
 * @param {boolean} requireGM - Whether GM privileges are required
 * @param {Map} players - Players map
 * @param {Map} rooms - Rooms map
 * @returns {Object} Validation result { valid, player?, room?, error? }
 */
function validateRoomMembership(socket, roomId, requireGM, players, rooms) {
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

  return { valid: true, player, room };
}

/**
 * Merge game state when resuming a permanent room
 * @param {Object} baseState - Base game state
 * @param {Object} resumeState - State from Firestore to merge
 * @returns {Object} Merged game state
 */
function mergeRoomGameStateForResume(baseState, resumeState) {
  if (!resumeState || typeof resumeState !== 'object') return baseState;

  const merged = { ...baseState };

  // Deep merge maps to preserve all nested data from both sources
  if (resumeState.maps) {
    const baseMaps = merged.maps || {};
    merged.maps = {};
    for (const mapId of new Set([...Object.keys(baseMaps), ...Object.keys(resumeState.maps)])) {
      const baseMap = baseMaps[mapId];
      const resumeMap = resumeState.maps?.[mapId];
      if (baseMap && resumeMap) {
        merged.maps[mapId] = {
          ...baseMap,
          ...resumeMap,
          tokens: { ...(baseMap.tokens || {}), ...(resumeMap.tokens || {}) },
          characterTokens: { ...(baseMap.characterTokens || {}), ...(resumeMap.characterTokens || {}) },
          gridItems: { ...(baseMap.gridItems || {}), ...(resumeMap.gridItems || {}) },
          terrainData: { ...(baseMap.terrainData || {}), ...(resumeMap.terrainData || {}) },
          wallData: { ...(baseMap.wallData || {}), ...(resumeMap.wallData || {}) },
          environmentalObjects: [...(baseMap.environmentalObjects || []), ...(resumeMap.environmentalObjects || [])],
          drawingPaths: [...(baseMap.drawingPaths || []), ...(resumeMap.drawingPaths || [])],
          drawingLayers: [...(baseMap.drawingLayers || []), ...(resumeMap.drawingLayers || [])],
          fogOfWarData: { ...(baseMap.fogOfWarData || {}), ...(resumeMap.fogOfWarData || {}) },
          fogOfWarPaths: [...(baseMap.fogOfWarPaths || []), ...(resumeMap.fogOfWarPaths || [])],
          fogErasePaths: [...(baseMap.fogErasePaths || []), ...(resumeMap.fogErasePaths || [])],
          exploredAreas: { ...(baseMap.exploredAreas || {}), ...(resumeMap.exploredAreas || {}) },
          lightSources: { ...(baseMap.lightSources || {}), ...(resumeMap.lightSources || {}) },
          dndElements: [...(baseMap.dndElements || []), ...(resumeMap.dndElements || [])]
        };
      } else if (resumeMap) {
        merged.maps[mapId] = { ...baseMap, ...resumeMap };
      } else if (baseMap) {
        merged.maps[mapId] = { ...baseMap };
      }
    }
  }

  // Deep merge combat state
  if (resumeState.combat) {
    merged.combat = {
      ...merged.combat,
      ...resumeState.combat,
      turnOrder: [...(merged.combat.turnOrder || []), ...(resumeState.combat.turnOrder || [])]
    };
  }

  // Merge other key properties
  if (resumeState.playerMapAssignments) {
    merged.playerMapAssignments = { ...merged.playerMapAssignments, ...resumeState.playerMapAssignments };
  }

  if (resumeState.gridSettings) {
    merged.gridSettings = { ...merged.gridSettings, ...resumeState.gridSettings };
  }

  return merged;
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

  const roomId = persistentRoomId || uuidv4();
  const gmPlayerId = uuidv4();

  logger.info('[SyncRoom] Room ID resolved:', {
    finalRoomId: roomId,
    source: persistentRoomId ? 'persistentRoomId parameter' : 'UUID generated'
  });

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
      color: playerColor || '#d4af37'
    },
    players: new Map(),
    settings: {
      maxPlayers: 6,
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
        gridBackgroundColor: '#d4c5b9'
      }
    },
    chatHistory: [],
    createdAt: new Date().toISOString(),
    isActive: true,
    lastActivity: new Date()
  };

  rooms.set(roomId, room);

  // Add GM to players tracking
  players.set(gmSocketId, {
    id: gmPlayerId,
    name: gmName,
    roomId: roomId,
    isGM: true,
    color: playerColor,
    currentMapId: 'default'
  });

  // Track GM's map assignment
  if (!room.gameState.playerMapAssignments) {
    room.gameState.playerMapAssignments = {};
  }
  room.gameState.playerMapAssignments[gmPlayerId] = 'default';

  // Save room to Firebase
  if (persistToFirebase) {
    try {
      await firebaseService.saveRoomData(roomId, room);
      logger.info('Room persisted to Firebase', { roomId, roomName });
    } catch (error) {
      logger.error('Failed to persist room to Firebase', {
        roomId,
        roomName,
        error: error.message
      });
      // Don't fail room creation if Firebase save fails
    }
  }

  return room;
}

/**
 * Initialize persistent rooms from Firestore on startup
 * @param {Map} rooms - Rooms map to load into
 * @returns {Promise<void>}
 */
async function initializePersistentRooms(rooms) {
  try {
    logger.info('Initializing persistent rooms from Firestore...');
    const persistentRooms = await firebaseService.loadPersistentRooms();

    if (persistentRooms && persistentRooms.length > 0) {
      persistentRooms.forEach((room, index) => {
        logger.info(`[initializePersistentRooms] Loading room ${index + 1}:`, {
          roomId: room.id,
          roomName: room.roomName,
          gameStateMapCount: Object.keys(room.gameState?.maps || {}).length,
          defaultMapHasGridItems: !!room.gameState?.maps?.default?.gridItems,
          defaultMapGridItemsCount: Object.keys(room.gameState?.maps?.default?.gridItems || {}).length,
          defaultMapTerrainCount: Object.keys(room.gameState?.maps?.default?.terrainData || {}).length
        });

        // Convert plain object players to Map if needed
        if (room.players && !(room.players instanceof Map)) {
          room.players = new Map(Object.entries(room.players));
        }
        rooms.set(room.id, room);
      });
      logger.info(`✅ Successfully loaded ${rooms.size} persistent rooms`);
    } else {
      logger.info('ℹ️ No active persistent rooms found in Firestore');
    }
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

    if (room.isPermanent) return;

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
  getPublicRooms,
  validateRoomMembership,
  hashPassword,
  verifyPassword,
  mergeRoomGameStateForResume,
  initializePersistentRooms,
  cleanupInactiveRooms
};
