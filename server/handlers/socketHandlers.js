/**
 * Socket Handlers Module
 * 
 * Contains all socket.on event handlers organized by category:
 * - Room Management (create_room, join_room, leave_room, disconnect)
 * - Token Management (token_created, token_moved, token_updated, etc.)
 * - Character Management (character_updated, character_resource_updated, etc.)
 * - Map/Grid Management (map_update, grid_item_update, sync_map_state, etc.)
 * - GM Actions (gm_switch_view, gm_transfer_player, etc.)
 * - Combat (combat_started, combat_ended, combat_turn_changed)
 * - Chat (chat_message, global_chat_message, whisper_message)
 * - Party System (create_party, join_party, invite_to_party, etc.)
 * - Environment (fog_update, wall_update, light_source_update, etc.)
 * - Utility (ping, health_check, cursor_move, etc.)
 */

const { v4: uuidv4 } = require('uuid');
const logger = require('../services/logger');
const firebaseService = require('../services/firebaseService');
const { sanitizeChatMessage, sanitizePlayerName } = require('../services/sanitizationService');
const { canCreateRoom, canJoinRoom } = require('../services/tierService');
const { registerUtilityHandlers } = require('./utilityHandlers');
const { registerTravelHandlers } = require('./travelHandlers');
const { registerChatHandlers } = require('./chatHandlers');
const { registerCombatHandlers } = require('./combatHandlers');
const { registerSyncHandlers } = require('./syncHandlers');
const { registerSessionHandlers } = require('./sessionHandlers');
const { registerTokenHandlers } = require('./tokenHandlers');
const { registerCharacterHandlers } = require('./characterHandlers');
const { registerEnvironmentHandlers } = require('./environmentHandlers');
const { registerMapHandlers } = require('./mapHandlers');
const { registerGmActionHandlers } = require('./gmActionHandlers');
const { registerAudioHandlers } = require('./audioHandlers');
const { registerRoomHandlers } = require('./roomLifecycleHandlers');
const { registerPartyHandlers } = require('./partyHandlers');
const { registerSessionInvitationHandlers } = require('./sessionInvitationHandlers');

// Echo Prevention Window - standardized timeout across all stores
const ECHO_PREVENTION_WINDOW_MS = 200;

// Event Sequence Counter - ensures event ordering across socket broadcasts
let eventSequenceNumber = 0;

function getNextEventSequence() {
  return ++eventSequenceNumber;
}

// Map Validation Helper - ensures maps exist before assigning data
function validateMapExists(room, mapId, preferredName = null) {
  if (!room.gameState.maps) {
    room.gameState.maps = {};
  }

  if (!room.gameState.maps[mapId]) {
    let initialName = preferredName;
    if (!initialName) {
      initialName = mapId === 'default' ? 'Default Map' : `Map ${mapId}`;
    }

    room.gameState.maps[mapId] = {
      id: mapId,
      name: initialName,
      tokens: {},
      characterTokens: {},
      gridItems: {},
      terrainData: {},
      wallData: {},
      drawingPaths: [],
      fogOfWarData: [],
      dndElements: [],
      lightSources: {},
      environmentalObjects: [],
      createdAt: new Date()
    };
    logger.debug(`Created new map structure: ${mapId} (${initialName})`);
  } else if (preferredName && (!room.gameState.maps[mapId].name || room.gameState.maps[mapId].name.startsWith('Map '))) {
    room.gameState.maps[mapId].name = preferredName;
  }

  return room.gameState.maps[mapId];
}

/**
 * Register all socket event handlers
 * @param {Object} io - Socket.io server instance
 * @param {Map} rooms - Rooms map (roomId -> room object)
 * @param {Map} players - Players map (socketId -> player object)
 * @param {Map} parties - Parties map (partyId -> party object)
 * @param {Map} userToParty - User to party mapping
 * @param {Map} partyInvitations - Party invitations map
 * @param {Map} onlineSocialUsers - Online social users map
 * @param {Map} pendingPartyCreations - Pending party creations map
 * @param {Object} helpers - Helper functions
 * @param {Function} helpers.createRoom - Create room function
 * @param {Function} helpers.hashPassword - Hash password function
 * @param {Function} helpers.verifyPassword - Verify password function
 * @param {Function} helpers.getPublicRooms - Get public rooms function
 * @param {Function} helpers.validateRoomMembership - Validate room membership
 * @param {Function} helpers.mergeRoomGameStateForResume - Merge game state for resume
 * @param {Object} services - Service instances
 * @param {Object} services.firebaseBatchWriter - Firebase batch writer
 * @param {Object} services.movementDebouncer - Movement debouncer
 * @param {Object} services.eventBatcher - Event batcher
 * @param {Object} services.realtimeSync - Realtime sync engine
 */
function registerSocketHandlers(io, rooms, players, parties, userToParty, partyInvitations, onlineSocialUsers, pendingPartyCreations, helpers, services) {
  const { createRoom, hashPassword, verifyPassword, getPublicRooms, validateRoomMembership, mergeRoomGameStateForResume } = helpers;
  const { firebaseBatchWriter, movementDebouncer, eventBatcher, realtimeSync } = services;

  const roomJoinRequests = new Map();

  // Evict expired join requests + party invitations (they carry expiresAt but can
  // linger if never acted upon). Prevents unbounded Map growth.
  setInterval(() => {
    const now = Date.now();
    for (const [id, req] of roomJoinRequests) {
      if (now > (req.expiresAt || 0)) roomJoinRequests.delete(id);
    }
    for (const [id, inv] of partyInvitations) {
      if (now > (inv.expiresAt || 0)) partyInvitations.delete(id);
    }
  }, 5 * 60 * 1000);

  io.on('connection', (socket) => {
    logger.info('Player connected', { socketId: socket.id, authenticated: socket.data.authenticated, isGuest: socket.data.isGuest });

    const requireAuth = (callback) => {
      return (...args) => {
        if (!socket.data.authenticated) {
          logger.warn('Unauthenticated socket attempted restricted action', { socketId: socket.id, isGuest: socket.data.isGuest });
          socket.emit('auth_error', { error: 'Authentication required. Please log in to perform this action.' });
          return;
        }
        return callback(...args);
      };
    };

    const chatDebugEnabled = process.env.CHAT_DEBUG === 'true' || process.env.NODE_ENV === 'development';
    const chatDebug = (...args) => {
      if (chatDebugEnabled) {
        logger.debug('[chat]', ...args);
      }
    };

    // ==================== SOCIAL/PARTY HELPERS ====================

    const getSocialUserIdFromSocket = (targetSocket = socket) => {
      const directUserId = targetSocket?.data?.userId;
      if (directUserId) return directUserId;

      const socialUser = onlineSocialUsers.get(targetSocket.id);
      if (socialUser?.originalUserId) return socialUser.originalUserId;
      if (socialUser?.userId) return socialUser.userId;

      const roomPlayer = players.get(targetSocket.id);
      if (roomPlayer?.id) return roomPlayer.id;

      return null;
    };

    const getOnlineUserById = (userId) => {
      if (!userId) return null;

      for (const socialUser of onlineSocialUsers.values()) {
        if (socialUser?.userId === userId || socialUser?.originalUserId === userId) {
          return socialUser;
        }
      }

      return null;
    };

        const getSocketsByUserId = (userId) => {
      if (!userId) return [];

      return Array.from(io.sockets.sockets.values()).filter((s) => {
        const socialUser = onlineSocialUsers.get(s.id);
        if (socialUser && (socialUser.userId === userId || socialUser.originalUserId === userId)) return true;

        const player = players.get(s.id);
        if (player && (player.id === userId || player.userId === userId)) return true;

        if (s.data && s.data.userId === userId) return true;

        return false;
      });
    };

    const emitToUserId = (userId, eventName, payload) => {
      const userSockets = getSocketsByUserId(userId);
      userSockets.forEach((s) => s.emit(eventName, payload));
      return userSockets.length;
    };

    const getUserDisplayName = (userId, fallback = 'Unknown') => {
      const socialUser = getOnlineUserById(userId);
      if (!socialUser) return fallback;

      return (
        socialUser.name ||
        socialUser.characterName ||
        socialUser.accountName ||
        fallback
      );
    };

    const buildPartyMemberData = (userId, overrides = {}) => {
      const socialUser = getOnlineUserById(userId) || {};
      const userSockets = getSocketsByUserId(userId);

      const characterClass =
        overrides.characterClass ||
        socialUser.characterClass ||
        socialUser.class ||
        socialUser.character?.class ||
        'Unknown';

      const characterLevel =
        overrides.characterLevel ||
        socialUser.characterLevel ||
        socialUser.level ||
        socialUser.character?.level ||
        1;

      const defaultCharacter = {
        class: characterClass,
        level: characterLevel,
        health: { current: 45, max: 50 },
        mana: { current: 45, max: 50 },
        actionPoints: { current: 1, max: 3 }
      };

      const mergedCharacter = {
        ...defaultCharacter,
        ...(socialUser.character || {}),
        ...(overrides.character || {}),
        health: {
          ...defaultCharacter.health,
          ...(socialUser.character?.health || {}),
          ...(overrides.character?.health || {})
        },
        mana: {
          ...defaultCharacter.mana,
          ...(socialUser.character?.mana || {}),
          ...(overrides.character?.mana || {})
        },
        actionPoints: {
          ...defaultCharacter.actionPoints,
          ...(socialUser.character?.actionPoints || {}),
          ...(overrides.character?.actionPoints || {})
        }
      };

      const displayName =
        overrides.name ||
        overrides.characterName ||
        socialUser.name ||
        socialUser.characterName ||
        socialUser.accountName ||
        getUserDisplayName(userId, 'Unknown');

      return {
        id: userId,
        userId,
        socketId: userSockets[0]?.id || socialUser.socketId || null,
        name: displayName,
        characterName: overrides.characterName || socialUser.characterName || displayName,
        characterClass,
        characterLevel,
        character: mergedCharacter,
        health: mergedCharacter.health,
        mana: mergedCharacter.mana,
        actionPoints: mergedCharacter.actionPoints,
        status: socialUser.status || 'online',
        isConnected: userSockets.length > 0,
        isGM: !!overrides.isGM,
        joinedAt: overrides.joinedAt || Date.now()
      };
    };

    const getPartyByUserId = (userId) => {
      const partyId = userToParty.get(userId);
      if (!partyId) return null;

      const party = parties.get(partyId);
      if (!party) {
        userToParty.delete(userId);
        return null;
      }

      return party;
    };

    const emitToPartyMembers = (party, eventName, payload) => {
      if (!party?.members) return;

      Object.keys(party.members).forEach((memberUserId) => {
        emitToUserId(memberUserId, eventName, payload);
      });
    };

    /**
     * Handle party member departure (called by leave_party and disconnect)
     * Handles edge case of multiple tabs/windows: only removes from party if no other connections exist
     * @param {string} userId - User ID leaving the party
     * @param {string} userName - User's display name
     * @param {string} socketId - Socket ID (for multi-tab detection)
     */
    const handlePartyLeave = (userId, userName, socketId) => {
      if (!userId) {
        logger.debug('[handlePartyLeave] No userId provided, skipping');
        return;
      }

      const partyId = userToParty.get(userId);
      if (!partyId) {
        logger.debug('[handlePartyLeave] User not in any party', { userId });
        return;
      }

      const party = parties.get(partyId);
      if (!party) {
        logger.warn('[handlePartyLeave] Party not found', { partyId, userId });
        userToParty.delete(userId);
        return;
      }

      // EDGE CASE: Check if user has other active connections (multiple tabs/windows)
      const userSockets = getSocketsByUserId(userId);
      const hasOtherConnections = userSockets.some(s => s.id !== socketId && s.connected);

      if (hasOtherConnections) {
        logger.info('[handlePartyLeave] User has other active connections, keeping in party', {
          userId,
          socketId,
          otherSocketCount: userSockets.filter(s => s.id !== socketId && s.connected).length
        });
        return;
      }

      // Remove member from party
      delete party.members[userId];
      userToParty.delete(userId);

      // Check if party should be disbanded
      const remainingMemberIds = Object.keys(party.members);
      if (remainingMemberIds.length === 0 || party.leaderId === userId) {
        // Disband party
        logger.info('[handlePartyLeave] Disbanding party', {
          partyId,
          partyName: party.name,
          reason: remainingMemberIds.length === 0 ? 'empty' : 'leader_left',
          leaderId: party.leaderId,
          leavingUserId: userId
        });

        remainingMemberIds.forEach(memberId => {
          userToParty.delete(memberId);
          const memberSockets = getSocketsByUserId(memberId);
          memberSockets.forEach(s => s.emit('party_disbanded', { partyId, partyName: party.name, reason: 'leader_left' }));
        });
        parties.delete(partyId);
      } else {
        // Notify remaining members
        logger.info('[handlePartyLeave] Member left party, notifying others', {
          userId,
          userName,
          partyId,
          remainingMembers: remainingMemberIds.length
        });

        remainingMemberIds.forEach(memberId => {
          const memberSockets = getSocketsByUserId(memberId);
          memberSockets.forEach(s => s.emit('party_member_left', {
            partyId,
            memberId: userId,
            memberName: userName
          }));
        });
      }
    };

    const notifyPartyMembersOfGMJoin = (userId, roomId, gmData) => {
      logger.info('GM joined room - checking for party', { userId, roomId, gmName: gmData.name });

      const partyId = userToParty.get(userId);
      logger.info('Party lookup result', { userId, partyId, userToPartySize: userToParty.size });

      if (partyId && parties.has(partyId)) {
        const party = parties.get(partyId);
        logger.info('Party found', {
          partyId,
          partyName: party.name,
          isActive: party.isActive,
          leaderId: party.leaderId,
          memberCount: Object.keys(party.members).length,
          memberIds: Object.keys(party.members)
        });

        if (party.isActive !== false) {  // Treat undefined as active (default)
          logger.info('GM has active party, notifying members', { partyId, partyName: party.name });

          const room = rooms.get(roomId);
          if (!room) {
            logger.warn('Room not found for GM session notification');
            return;
          }

          const roomMemberUserIds = new Set();
          for (const [socketId, player] of players.entries()) {
            if (player.roomId === roomId) {
              const s = io.sockets.sockets.get(socketId);
              if (s?.data?.userId) {
                roomMemberUserIds.add(s.data.userId);
              }
              const socialUser = onlineSocialUsers.get(socketId);
              if (socialUser?.userId) {
                roomMemberUserIds.add(socialUser.userId);
              }
            }
          }

          logger.info('Room member UIDs', { roomId, roomMemberUserIds: Array.from(roomMemberUserIds) });

          const partyMembersNotInRoom = Object.keys(party.members).filter(memberId => {
            const isGM = memberId === party.leaderId;
            const isAlreadyInRoom = roomMemberUserIds.has(memberId);
            logger.info('Checking party member', { memberId, isGM, isAlreadyInRoom });
            return !isGM && !isAlreadyInRoom;
          });

          logger.info('Party members to invite', { partyMembersNotInRoom, count: partyMembersNotInRoom.length });

          partyMembersNotInRoom.forEach(memberId => {
            const memberData = party.members[memberId];

            if (memberData) {
              const memberSockets = getSocketsByUserId(memberId);
              logger.info('Found sockets for member', { memberId, socketCount: memberSockets.length });

              if (memberSockets.length > 0) {
                const invitation = {
                  id: uuidv4(),
                  partyId,
                  roomId,
                  partyName: room.name || party.name,
                  roomName: room.name,
                  gmName: gmData.name,
                  gmCharacterName: gmData.characterName,
                  gmClass: gmData.characterClass,
                  gmLevel: gmData.characterLevel,
                  isPermanent: room.isPermanent || false,
                  roomDescription: room.settings?.description || gmData.description || room.description || '',
                  description: room.settings?.description || gmData.description || room.description || '',
                  currentPlayers: Array.from(room.players.values()).map(p => ({
                    id: p.id,
                    name: p.name,
                    class: p.character?.class || 'Unknown'
                  })),
                  status: 'pending',
                  createdAt: Date.now(),
                  expiresAt: Date.now() + (5 * 60 * 1000)
                };

                partyInvitations.set(invitation.id, invitation);

                memberSockets.forEach(s => {
                  s.emit('gm_session_invitation', invitation);
                });

                logger.info('GM session invitation sent', {
                  to: memberId,
                  party: party.name,
                  room: roomId,
                  gm: gmData.name,
                  socketIds: memberSockets.map(s => s.id)
                });
              } else {
                logger.warn('Party member not connected for GM session notification', { memberId });
              }
            }
          });
        } else {
          logger.info('Party is not active or no members', { partyId, isActive: party.isActive, memberCount: Object.keys(party.members).length });
        }
      } else {
        logger.info('GM joined room but has no active party', { userId, partyId, partiesCount: parties.size });
      }
    };

    // Hook up movement debouncer flush callback
    if (!movementDebouncer.flushCallback) {
      movementDebouncer.flushCallback = () => {
        movementDebouncer.flush(io, rooms, players);
      };
    }

    // Utility to strip undefined values from objects before Firestore write
    // Firestore crashes with "invalid data" error if fields are explicitly undefined
    const stripUndefined = (obj) => {
      if (obj === null || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(stripUndefined);

      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          newObj[key] = stripUndefined(value);
        }
      }
      return newObj;
    };

    // Shared handler context - threads all closures needed by extracted domain modules
    const handlerCtx = {
      io,
      socket,
      rooms,
      players,
      parties,
      userToParty,
      partyInvitations,
      onlineSocialUsers,
      pendingPartyCreations,
      roomJoinRequests,
      logger,
      uuidv4,
      sanitizeChatMessage,
      sanitizePlayerName,
      firebaseService,
      canCreateRoom,
      canJoinRoom,
      requireAuth,
      chatDebug,
      createRoom,
      hashPassword,
      verifyPassword,
      getPublicRooms,
      validateRoomMembership,
      mergeRoomGameStateForResume,
      firebaseBatchWriter,
      movementDebouncer,
      eventBatcher,
      realtimeSync,
      getNextEventSequence,
      ECHO_PREVENTION_WINDOW_MS,
      validateMapExists,
      getSocialUserIdFromSocket,
      getOnlineUserById,
      getSocketsByUserId,
      emitToUserId,
      getUserDisplayName,
      buildPartyMemberData,
      getPartyByUserId,
      emitToPartyMembers,
      handlePartyLeave,
      notifyPartyMembersOfGMJoin,
      stripUndefined
    };

    // ==================== UTILITY HANDLERS ====================
    registerUtilityHandlers(handlerCtx);

    // ==================== ROOM MANAGEMENT HANDLERS ====================
    registerRoomHandlers(handlerCtx);

    // ==================== TOKEN MANAGEMENT HANDLERS ====================
    registerTokenHandlers(handlerCtx);

    // ==================== CHARACTER MANAGEMENT HANDLERS ====================
    registerCharacterHandlers(handlerCtx);


    // ==================== MAP/GRID MANAGEMENT HANDLERS ====================
    registerMapHandlers(handlerCtx);

    // ==================== GM ACTION HANDLERS ====================
    registerGmActionHandlers(handlerCtx);

    // ==================== TRAVEL HANDLERS ====================
    registerTravelHandlers(handlerCtx);

    // ==================== COMBAT HANDLERS ====================
    registerCombatHandlers(handlerCtx);

    // ==================== CHAT HANDLERS ====================
    registerChatHandlers(handlerCtx);

    // ==================== ENVIRONMENT HANDLERS ====================
    registerEnvironmentHandlers(handlerCtx);

    // ==================== SYNC HANDLERS ====================
    registerSyncHandlers(handlerCtx);

    // ==================== SESSION HANDLERS ====================
    registerSessionHandlers(handlerCtx);

    // ==================== PARTY HANDLERS ====================
    registerPartyHandlers(handlerCtx);

    // ==================== SESSION INVITATION HANDLERS ====================
    registerSessionInvitationHandlers(handlerCtx);

    // ===== AUDIO / JUKEBOX EVENTS =====
    registerAudioHandlers(handlerCtx);

  });
}

module.exports = {
  registerSocketHandlers,
  validateMapExists,
  getNextEventSequence,
  ECHO_PREVENTION_WINDOW_MS
};
