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
    console.log(`🗺️ Created new map structure: ${mapId} (${initialName})`);
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

  io.on('connection', (socket) => {
    logger.info('Player connected', { socketId: socket.id });

    const chatDebugEnabled = process.env.CHAT_DEBUG === 'true' || process.env.NODE_ENV === 'development';
    const chatDebug = (...args) => {
      if (chatDebugEnabled) {
        console.log(...args);
      }
    };

    // ==================== SOCIAL/PARTY HELPERS ====================

    const getSocialUserIdFromSocket = (targetSocket = socket) => {
      const directUserId = targetSocket?.data?.userId;
      if (directUserId) return directUserId;

      const socialUser = onlineSocialUsers.get(targetSocket.id);
      if (socialUser?.userId) return socialUser.userId;

      const roomPlayer = players.get(targetSocket.id);
      if (roomPlayer?.id) return roomPlayer.id;

      return null;
    };

    const getOnlineUserById = (userId) => {
      if (!userId) return null;

      for (const socialUser of onlineSocialUsers.values()) {
        if (socialUser?.userId === userId) {
          return socialUser;
        }
      }

      return null;
    };

    const getSocketsByUserId = (userId) => {
      if (!userId) return [];

      return Array.from(io.sockets.sockets.values()).filter((s) => {
        const socketUserId = getSocialUserIdFromSocket(s);
        return socketUserId === userId;
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
                  partyName: party.name,
                  gmName: gmData.name,
                  gmCharacterName: gmData.characterName,
                  gmClass: gmData.characterClass,
                  gmLevel: gmData.characterLevel,
                  status: 'pending',
                  createdAt: Date.now(),
                  expiresAt: Date.now() + (5 * 60 * 1000)
                };

                partyInvitations.set(invitation.id, invitation);

                memberSockets.forEach(s => {
                  s.emit('gm_session_invitation', invitation);
                  console.log(`📤 [Server] Sent gm_session_invitation to socket ${s.id} for member ${memberId}`);
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

    // ==================== UTILITY HANDLERS ====================

    // Minimal handler for testing
    socket.on('ping', (data, callback) => {
      if (callback) callback('pong');
    });

    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    socket.on('health_check', () => {
      socket.emit('health_check_response', {
        status: 'ok',
        roomsCount: rooms.size,
        playersCount: players.size,
        uptime: process.uptime()
      });
    });

    socket.on('cursor_move', (data) => {
      const player = players.get(socket.id);
      if (!player) return;

      // Broadcast cursor position to other players in the same room
      socket.to(player.roomId).emit('cursor_moved', {
        playerId: player.id,
        playerName: player.name,
        position: data.position,
        color: player.color || '#4a90e2'
      });
    });

    // ==================== ROOM MANAGEMENT HANDLERS ====================

    socket.on('create_room', async (data) => {
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

        if (isPermanentRoomResume) {
          logger.info('[create_room] Checking for existing in-memory room:', { persistentRoomId: data.persistentRoomId });

          const existingRoom = rooms.get(data.persistentRoomId);
          if (existingRoom) {
            logger.info('[create_room] Resuming existing in-memory room:', {
              roomId: existingRoom.id,
              roomName: existingRoom.name,
              isActive: existingRoom.isActive
            });

            existingRoom.isActive = true;
            existingRoom.gmDisconnectedAt = null;

            if (data.character && existingRoom.gm) {
              existingRoom.gm.character = data.character;
              logger.info('[create_room] Updated GM character data for resumed room');
            }

            const persistedRoomData = await firebaseService.getRoomData(data.persistentRoomId);
            if (!persistedRoomData) {
              throw new Error(`Permanent room not found in Firestore: ${data.persistentRoomId}`);
            }

            if (persistedRoomData.gameState) {
              existingRoom.gameState = mergeRoomGameStateForResume(existingRoom.gameState, persistedRoomData.gameState);
              logger.info('[create_room] Merged Firestore gameState into existing room');
            }

            if (persistedRoomData.gmId) existingRoom.gmId = persistedRoomData.gmId;
            if (persistedRoomData.members) existingRoom.members = persistedRoomData.members;

            room = existingRoom;
          } else {
            logger.info('[create_room] Creating new room from Firestore data:', { persistentRoomId: data.persistentRoomId });

            if (!data.persistentRoomId) {
              throw new Error('Persistent room ID is required for room resume');
            }

            const persistedRoomData = await firebaseService.getRoomData(data.persistentRoomId);

            if (!persistedRoomData) {
              throw new Error(`Permanent room not found in Firestore: ${data.persistentRoomId}`);
            }

            const firestoreRoomId = data.persistentRoomId;
            logger.info('[SyncRoom] Resuming from Firestore:', { firestoreRoomId });

            room = await createRoom(
              persistedRoomData.roomName || data.roomName || 'Campaign Room',
              data.gmName,
              socket.id,
              data.password || '',
              data.playerColor || '#d4af37',
              true,
              firestoreRoomId,
              persistedRoomData.gameState,
              persistedRoomData.gmId || socket.data.userId,
              persistedRoomData.members || (socket.data.userId ? [socket.data.userId] : [])
            );

            if (!room) {
              throw new Error('Failed to create room from Firestore data');
            }

            logger.info('[create_room] Permanent room created from Firestore data', {
              roomId: room.id,
              roomName: room.name
            });

            if (data.gameState && typeof data.gameState === 'object') {
              room.gameState = mergeRoomGameStateForResume(room.gameState, data.gameState);
              logger.info('[create_room] Merged game state from resume data');
            }
          }
        } else {
          if (!data.roomName) {
            throw new Error('Room name is required for room creation');
          }

          room = await createRoom(
            data.roomName,
            data.gmName,
            socket.id,
            data.password || '',
            data.playerColor || '#4a90e2',
            false,
            undefined,
            null,
            socket.data.userId,
            socket.data.userId ? [socket.data.userId] : []
          );

          if (!room) {
            throw new Error('Failed to create temporary room');
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

        if (data.character && room.gm) {
          room.gm.character = data.character;
          logger.info('[create_room] Updated GM character data', {
            hasCharacter: !!data.character,
            hasTokenSettings: !!data.character?.tokenSettings
          });
        }

        socket.join(room.id);

        const roomForEmission = {
          id: room.id,
          name: room.name,
          passwordHash: room.passwordHash,
          gm: room.gm,
          players: room.players,
          settings: room.settings,
          persistentRoomId: room.persistentRoomId,
          isPermanent: room.isPermanent,
          gameState: room.gameState,
          createdAt: room.createdAt
        };

        socket.emit('room_created', { room: roomForEmission });
        logger.info('[create_room] Room created successfully', { roomId: room.id, roomName: room.name });

        // Emit room_joined for GM (client expects this to complete loading)
        socket.emit('room_joined', {
          room: roomForEmission,
          player: roomForEmission.gm,
          isGM: true,
          isGMReconnect: false
        });
        logger.info('[create_room] Emitted room_joined for GM', { roomId: room.id });

        // Broadcast updated room list
        io.emit('room_list', getPublicRooms());

        // Notify party members to join the GM's session
        // Try multiple sources to find the GM's userId
        let gmUserId = data.userId || socket.data?.userId || data.character?.userId;

        // Fallback: Check onlineSocialUsers map for this socket
        if (!gmUserId) {
          const socialUser = onlineSocialUsers.get(socket.id);
          if (socialUser?.userId) {
            gmUserId = socialUser.userId;
            logger.info('[create_room] Found GM userId from onlineSocialUsers', { gmUserId, socketId: socket.id });
          }
        }

        if (gmUserId) {
          logger.info('[create_room] Notifying party members for GM', { gmUserId, roomId: room.id });
          notifyPartyMembersOfGMJoin(gmUserId, room.id, {
            name: data.gmName,
            characterName: data.character?.name || data.gmName,
            characterClass: data.character?.class,
            characterLevel: data.character?.level
          });
        } else {
          logger.warn('[create_room] No GM userId found, cannot notify party members', {
            socketId: socket.id,
            dataUserId: data.userId,
            socketDataUserId: socket.data?.userId,
            characterUserId: data.character?.userId,
            onlineSocialUsersSize: onlineSocialUsers.size
          });
        }

      } catch (error) {
        logger.error('[create_room] Error creating room:', { error: error.message, stack: error.stack });
        socket.emit('room_error', { error: error.message });
      }
    });

    socket.on('join_room', async (data) => {
      try {
        const { roomId, playerName, password, playerColor, character } = data;

        const room = rooms.get(roomId);
        if (!room) {
          socket.emit('room_error', { error: 'Room not found' });
          return;
        }

        // Verify password
        const passwordValid = await verifyPassword(password, room.passwordHash);
        if (!passwordValid) {
          socket.emit('room_error', { error: 'Invalid password' });
          return;
        }

        const playerId = uuidv4();
        const player = {
          id: playerId,
          name: sanitizePlayerName(playerName) || 'Player',
          socketId: socket.id,
          roomId: roomId,
          isGM: false,
          color: playerColor || '#4a90e2',
          character: character || null,
          currentMapId: room.gameState.defaultMapId || 'default',
          userId: socket.data?.userId || data.userId || null
        };

        room.players.set(playerId, player);
        players.set(socket.id, player);

        // Track player's map assignment
        if (!room.gameState.playerMapAssignments) {
          room.gameState.playerMapAssignments = {};
        }
        room.gameState.playerMapAssignments[playerId] = player.currentMapId;

        socket.join(roomId);

        // Prepare room data for emission
        const roomForEmission = {
          id: room.id,
          name: room.name,
          gm: room.gm,
          players: Array.from(room.players.values()),
          settings: room.settings,
          gameState: room.gameState,
          persistentRoomId: room.persistentRoomId
        };

        socket.emit('room_joined', { room: roomForEmission, player: player });

        // Notify other players
        socket.to(roomId).emit('player_joined', {
          player: {
            id: player.id,
            name: player.name,
            socketId: socket.id,
            character: player.character,
            currentMapId: player.currentMapId,
            userId: player.userId || null // ADD THIS LINE
          },
          playerCount: room.players.size + (room.gm && room.players.has(room.gm.id) ? 0 : 1)
        });

        // Update room list
        io.emit('room_list', getPublicRooms());

        logger.info('[join_room] Player joined room', { playerId, playerName, roomId });

      } catch (error) {
        logger.error('[join_room] Error joining room:', { error: error.message });
        socket.emit('room_error', { error: error.message });
      }
    });

    socket.on('leave_room', () => {
      const player = players.get(socket.id);
      if (!player) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      // Remove player from room
      room.players.delete(player.id);
      players.delete(socket.id);

      // Remove from map assignments
      if (room.gameState.playerMapAssignments) {
        delete room.gameState.playerMapAssignments[player.id];
      }

      socket.leave(player.roomId);

      // Notify other players
      socket.to(player.roomId).emit('player_left', {
        playerId: player.id,
        playerName: player.name,
        playerCount: room.players.size + (room.gm && room.players.has(room.gm.id) ? 0 : 1)
      });

      // Update room list
      io.emit('room_list', getPublicRooms());

      logger.info('[leave_room] Player left room', { playerId: player.id, roomId: player.roomId });
    });

    socket.on('disconnect', () => {
      // 1. Clean up social presence
      const socialPresence = onlineSocialUsers.get(socket.id);
      if (socialPresence) {
        onlineSocialUsers.delete(socket.id);
        logger.info('[disconnect] Social presence removed', {
          socketId: socket.id,
          userId: socialPresence.userId
        });
      }

      // 2. Resolve user identity for party cleanup
      let userId = socket.data.userId;
      let userName = 'Unknown';

      // Check socialPresence first (for social-only users)
      if (socialPresence && socialPresence.userId) {
        userId = socialPresence.userId;
        userName = socialPresence.name || userName;
      }

      // 3. Get player info
      const player = players.get(socket.id);
      if (player) {
        if (!userId) {
          userId = player.id;
        }
        userName = player.name || userName;
      }

      // 4. Early return for non-room players
      // NOTE: We do NOT call handlePartyLeave for social-only users here because:
      // - Page refreshes would incorrectly remove users from parties
      // - The new socket might not be authenticated yet when we check for other connections
      // - Stale party entries are handled by the safety check in invite_to_party
      if (!player) {
        logger.debug('[disconnect] Non-room player disconnected (party cleanup deferred)', {
          socketId: socket.id,
          hadSocialPresence: !!socialPresence,
          userId
        });
        return;
      }

      // 5. Handle party leave for room players only
      // Room players are leaving an active game session, so immediate cleanup is appropriate
      handlePartyLeave(userId, userName, socket.id);

      // 6. Handle room cleanup
      const room = rooms.get(player.roomId);
      if (room) {
        if (player.isGM) {
          // GM disconnected - mark room as inactive but don't delete
          room.isActive = false;
          room.gmDisconnectedAt = new Date();
          logger.info('[disconnect] GM disconnected, room marked inactive', { roomId: room.id, userId });

          // Notify players in room that GM disconnected
          socket.to(player.roomId).emit('gm_disconnected', {
            gmName: player.name,
            gmId: userId,
            roomId: room.id
          });
        } else {
          // Regular player disconnected
          room.players.delete(player.id);
          if (room.gameState.playerMapAssignments) {
            delete room.gameState.playerMapAssignments[player.id];
          }
          socket.to(player.roomId).emit('player_left', {
            playerId: player.id,
            playerName: player.name,
            playerCount: room.players.size + (room.gm && room.players.has(room.gm.id) ? 0 : 1)
          });
        }
      }

      // 7. Remove from players map
      players.delete(socket.id);
      logger.info('[disconnect] Player disconnected', { socketId: socket.id, playerId: player.id, userId });

      // 8. Update room list
      io.emit('room_list', getPublicRooms());
    });

    // ==================== TOKEN MANAGEMENT HANDLERS ====================

    socket.on('token_created', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) {
          socket.emit('error', { message: validation.error });
          return;
        }

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        const tokenId = data.token.id || uuidv4();
        const token = {
          ...data.token,
          id: tokenId,
          createdBy: socket.id,
          createdAt: Date.now()
        };

        map.tokens[tokenId] = token;
        room.gameState.tokens[tokenId] = token; // Legacy support

        // Broadcast to all players in room using room.id from validation
        io.to(room.id).emit('token_created', {
          ...data, // Relay all metadata (creature, position, player info)
          token,   // Overwrite with processed token
          mapId,
          createdBy: socket.id,
          sequence: getNextEventSequence()
        });

        // Queue Firebase update
        firebaseBatchWriter.queueWrite(room.id, room.gameState);

        logger.debug('[token_created] Token created', { tokenId, mapId, roomId: room.id });

      } catch (error) {
        logger.error('[token_created] Error:', { error: error.message });
      }
    });

    socket.on('token_moved', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';

        // Queue movement for debouncing
        movementDebouncer.queueMove(room.id, data.tokenId, {
          position: data.position,
          velocity: data.velocity,
          playerId: socket.id,
          mapId: mapId
        });

      } catch (error) {
        logger.error('[token_moved] Error:', { error: error.message });
      }
    });

    socket.on('token_updated', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        // CRITICAL FIX: Also check map.creatures for compatibility
        const isToken = !!map.tokens[data.tokenId];
        const isCreature = !!(map.creatures && map.creatures[data.tokenId]);
        const updates = data.updates || data.stateUpdates || {};

        if (isToken || isCreature) {
          const targetStore = isToken ? map.tokens : map.creatures;

          targetStore[data.tokenId] = {
            ...targetStore[data.tokenId],
            ...updates,
            updatedAt: Date.now()
          };

          io.to(room.id).emit('token_updated', {
            tokenId: data.tokenId,
            updates: updates,
            mapId,
            updatedBy: socket.id,
            sequence: getNextEventSequence()
          });

          // Strip undefined values before queuing write to prevent Firestore crash
          const sanitizedState = stripUndefined(room.gameState);
          firebaseBatchWriter.queueWrite(room.id, sanitizedState);
        }

      } catch (error) {
        logger.error('[token_updated] Error:', { error: error.message });
      }
    });

    socket.on('character_token_created', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || data.targetMapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        const tokenId = data.token?.id || data.tokenId || uuidv4();
        const token = {
          ...data.token,
          id: tokenId,
          playerId: data.playerId,
          createdBy: socket.id,
          createdAt: Date.now()
        };

        map.characterTokens[tokenId] = token;
        room.gameState.characterTokens[tokenId] = token; // Legacy support

        io.to(room.id).emit('character_token_created', {
          ...data, // Relay all metadata (playerId, position, etc.)
          token,   // Overwrite with processed token
          mapId,
          createdBy: socket.id,
          sequence: getNextEventSequence()
        });

        firebaseBatchWriter.queueWrite(room.id, room.gameState);

      } catch (error) {
        logger.error('[character_token_created] Error:', { error: error.message });
      }
    });

    socket.on('token_removed', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        delete map.tokens[data.tokenId];
        delete room.gameState.tokens[data.tokenId]; // Legacy support

        io.to(room.id).emit('token_removed', {
          tokenId: data.tokenId,
          mapId,
          removedBy: socket.id,
          sequence: getNextEventSequence()
        });

        firebaseBatchWriter.queueWrite(room.id, room.gameState);

      } catch (error) {
        logger.error('[token_removed] Error:', { error: error.message });
      }
    });

    socket.on('character_token_removed', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        delete map.characterTokens[data.tokenId];
        delete room.gameState.characterTokens[data.tokenId]; // Legacy support

        io.to(room.id).emit('character_token_removed', {
          tokenId: data.tokenId,
          mapId,
          removedBy: socket.id,
          sequence: getNextEventSequence()
        });

        firebaseBatchWriter.queueWrite(room.id, room.gameState);

      } catch (error) {
        logger.error('[character_token_removed] Error:', { error: error.message });
      }
    });

    // ==================== CHARACTER MANAGEMENT HANDLERS ====================

    socket.on('character_moved', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room, player } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';

        // Update player's current map if changed
        if (data.mapId && data.mapId !== player.currentMapId) {
          player.currentMapId = data.mapId;
          if (room.gameState.playerMapAssignments) {
            room.gameState.playerMapAssignments[player.id] = data.mapId;
          }
        }

        // Broadcast movement to room (including initiator for consistency)
        // using room.id from validation to ensure it reaches the correct room
        socket.to(room.id).emit('character_moved', {
          playerId: player.id,
          characterId: data.characterId || player.id,
          tokenId: data.tokenId,
          position: data.position,
          mapId,
          timestamp: Date.now()
        });

      } catch (error) {
        logger.error('[character_moved] Error:', { error: error.message });
      }
    });

    socket.on('character_resource_delta', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room, player } = validation;

        // Apply delta to character resources
        if (data.resource === 'health' && player.character?.health) {
          player.character.health.current = Math.max(0, Math.min(
            player.character.health.max,
            (player.character.health.current || 0) + (data.delta || 0)
          ));
        } else if (data.resource === 'mana' && player.character?.mana) {
          player.character.mana.current = Math.max(0, Math.min(
            player.character.mana.max,
            (player.character.mana.current || 0) + (data.delta || 0)
          ));
        } else if (data.resource === 'actionPoints' && player.character?.actionPoints) {
          player.character.actionPoints.current = Math.max(0, Math.min(
            player.character.actionPoints.max,
            (player.character.actionPoints.current || 0) + (data.delta || 0)
          ));
        }

        // Broadcast to room
        io.to(data.roomId).emit('character_resource_delta', {
          playerId: player.id,
          resource: data.resource,
          delta: data.delta,
          timestamp: Date.now()
        });

      } catch (error) {
        logger.error('[character_resource_delta] Error:', { error: error.message });
      }
    });

    socket.on('character_updated', async (data) => {
      console.log(`📥 [Server] character_updated received from ${socket.id}`, {
        characterId: data.characterId,
        name: data.character?.name,
        race: data.character?.race,
        class: data.character?.class,
        roomId: data.roomId,
        hasCharacter: !!data.character
      });
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) {
          console.log(`❌ [Server] character_updated validation failed:`, validation.error);
          return;
        }

        const { room, player } = validation;
        console.log(`✅ [Server] character_updated validated for player ${player.id} in room ${room.id}`);

        // Update player character data
        if (data.character) {
          player.character = {
            ...player.character,
            ...data.character,
            lastUpdated: Date.now()
          };

          // Update in room's players map
          room.players.set(player.id, player);

          // CRITICAL FIX: Also update room.gm if this is the GM
          // This ensures new players joining receive up-to-date GM character data
          if (player.isGM || room.gm?.socketId === socket.id || room.gm?.id === player.id) {
            room.gm.character = player.character;
            logger.debug('[character_updated] Updated room.gm.character for GM sync');
          }
        }

        // Broadcast to room (including sender so they can verify sync)
        // CRITICAL FIX: Use room.id instead of data.roomId (which may be undefined)
        // validateRoomMembership resolves the room from player.roomId as fallback
        const broadcastRoomId = room.id;
        console.log(`📤 [Server] Broadcasting character_updated to room ${broadcastRoomId}:`, {
          playerId: player.id,
          playerName: player.character?.name,
          playerClass: player.character?.class,
          isGM: player.isGM || room.gm?.socketId === socket.id
        });
        
        io.to(broadcastRoomId).emit('character_updated', {
          playerId: player.id,
          characterId: data.characterId,
          character: player.character,
          updatedBy: socket.id,
          senderSocketId: socket.id,
          senderUserId: socket.data.userId || data.userId,
          isGM: player.isGM || room.gm?.socketId === socket.id,
          timestamp: Date.now()
        });

        logger.debug('[character_updated] Character updated', { playerId: player.id });

      } catch (error) {
        logger.error('[character_updated] Error:', { error: error.message });
      }
    });

    socket.on('character_equipment_updated', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room, player } = validation;

        if (data.equipment && player.character) {
          player.character.equipment = {
            ...player.character.equipment,
            ...data.equipment
          };
          room.players.set(player.id, player);
        }

        socket.to(data.roomId).emit('character_equipment_updated', {
          playerId: player.id,
          equipment: data.equipment,
          updatedBy: socket.id
        });

      } catch (error) {
        logger.error('[character_equipment_updated] Error:', { error: error.message });
      }
    });

    socket.on('character_resource_updated', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room, player: senderPlayer } = validation;

        // Find target player - check players map first, then GM
        let targetPlayer = null;
        let isGMUpdate = false;

        if (data.playerId) {
          targetPlayer = room.players.get(data.playerId);
        }

        // If not found and sender is GM updating themselves
        if (!targetPlayer && room.gm && (socket.id === room.gm.socketId || data.senderSocketId === room.gm.socketId)) {
          targetPlayer = room.gm;
          isGMUpdate = true;
        }

        // Fallback: try to find by socketId in players
        if (!targetPlayer && data.senderSocketId) {
          for (const [pid, p] of room.players) {
            if (p.socketId === data.senderSocketId) {
              targetPlayer = p;
              break;
            }
          }
        }

        if (!targetPlayer) {
          logger.warn('[character_resource_updated] Target player not found', {
            playerId: data.playerId,
            senderSocketId: data.senderSocketId,
            isGM: senderPlayer?.isGM
          });
          return;
        }

        // Ensure character object exists
        if (!targetPlayer.character) {
          targetPlayer.character = {};
        }

        // Update resource (health, mana, actionPoints, or classResource)
        if (data.resource === 'health') {
          targetPlayer.character.health = targetPlayer.character.health || { current: 0, max: 0 };
          targetPlayer.character.health.current = data.current;
          targetPlayer.character.health.max = data.max;
          if (data.temp !== undefined) {
            targetPlayer.character.tempHealth = data.temp;
          }
        } else if (data.resource === 'mana') {
          targetPlayer.character.mana = targetPlayer.character.mana || { current: 0, max: 0 };
          targetPlayer.character.mana.current = data.current;
          targetPlayer.character.mana.max = data.max;
          if (data.temp !== undefined) {
            targetPlayer.character.tempMana = data.temp;
          }
        } else if (data.resource === 'actionPoints') {
          targetPlayer.character.actionPoints = targetPlayer.character.actionPoints || { current: 0, max: 0 };
          targetPlayer.character.actionPoints.current = data.current;
          targetPlayer.character.actionPoints.max = data.max;
          if (data.temp !== undefined) {
            targetPlayer.character.tempActionPoints = data.temp;
          }
        } else if (data.resource === 'classResource') {
          // Class resource sync - store the entire classResource object if provided
          if (data.classResource) {
            targetPlayer.character.classResource = data.classResource;
          } else {
            targetPlayer.character.classResource = targetPlayer.character.classResource || { current: 0, max: 0 };
            targetPlayer.character.classResource.current = data.current;
            targetPlayer.character.classResource.max = data.max;
          }
        }

        // Update in appropriate map
        if (isGMUpdate) {
          room.gm = targetPlayer;
        } else {
          room.players.set(targetPlayer.id, targetPlayer);
        }

        // Broadcast to room
        io.to(data.roomId).emit('character_resource_updated', {
          playerId: targetPlayer.id,
          userId: targetPlayer.userId || targetPlayer.id,
          socketId: targetPlayer.socketId,
          playerName: targetPlayer.name,
          resource: data.resource,
          current: data.current,
          max: data.max,
          temp: data.temp,
          adjustment: data.adjustment,
          classResource: data.classResource,
          updatedBy: socket.id,
          senderSocketId: data.senderSocketId,
          isGM: isGMUpdate
        });

        logger.debug('[character_resource_updated] Resource updated', {
          playerId: targetPlayer.id,
          resource: data.resource,
          isGM: isGMUpdate
        });

      } catch (error) {
        logger.error('[character_resource_updated] Error:', { error: error.message });
      }
    });

    socket.on('buff_update', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId || data.data?.roomId);
        if (!validation.valid) return;

        const roomId = data.roomId || data.data?.roomId;

        // Broadcast to the rest of the room
        socket.to(roomId).emit('buff_update', {
          ...data,
          senderSocketId: socket.id
        });
      } catch (error) {
        logger.error('[buff_update] Error:', { error: error.message });
      }
    });

    socket.on('debuff_update', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId || data.data?.roomId);
        if (!validation.valid) return;

        const roomId = data.roomId || data.data?.roomId;

        // Broadcast to the rest of the room
        socket.to(roomId).emit('debuff_update', {
          ...data,
          senderSocketId: socket.id
        });
      } catch (error) {
        logger.error('[debuff_update] Error:', { error: error.message });
      }
    });


    // ==================== MAP/GRID MANAGEMENT HANDLERS ====================

    socket.on('update_current_map', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room, player } = validation;

        player.currentMapId = data.mapId;
        if (room.gameState.playerMapAssignments) {
          room.gameState.playerMapAssignments[player.id] = data.mapId;
        }

        socket.to(data.roomId).emit('player_map_changed', {
          playerId: player.id,
          mapId: data.mapId
        });

      } catch (error) {
        logger.error('[update_current_map] Error:', { error: error.message });
      }
    });

    socket.on('sync_level_editor_state', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId, true); // GM only
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId, data.mapName);

        // Update level editor state
        if (data.terrainData) map.terrainData = data.terrainData;
        if (data.wallData) map.wallData = data.wallData;
        if (data.windowOverlays !== undefined) map.windowOverlays = data.windowOverlays;
        if (data.environmentalObjects) map.environmentalObjects = data.environmentalObjects;
        if (data.drawingPaths) map.drawingPaths = data.drawingPaths;
        if (data.drawingLayers) map.drawingLayers = data.drawingLayers;
        if (data.fogOfWarData) map.fogOfWarData = data.fogOfWarData;
        if (data.fogOfWarPaths) map.fogOfWarPaths = data.fogOfWarPaths;
        if (data.lightSources) map.lightSources = data.lightSources;
        if (data.dndElements) map.dndElements = data.dndElements;

        // Broadcast to room using room.id from validation
        socket.to(room.id).emit('level_editor_state_synced', {
          mapId,
          state: {
            terrainData: map.terrainData,
            wallData: map.wallData,
            windowOverlays: map.windowOverlays || {},
            environmentalObjects: map.environmentalObjects,
            drawingPaths: map.drawingPaths,
            fogOfWarData: map.fogOfWarData,
            lightSources: map.lightSources,
            dndElements: map.dndElements
          },
          sequence: getNextEventSequence()
        });

        firebaseBatchWriter.queueWrite(room.id, room.gameState);

      } catch (error) {
        logger.error('[sync_level_editor_state] Error:', { error: error.message });
      }
    });

    socket.on('map_update', async (data) => {
      try {
        const sequence = data?.sequence || 'no-seq';
        const hasTargetId = !!data?.targetMapId;
        logger.debug(`[map_update] Received [Seq: ${sequence}, TargetID: ${hasTargetId ? data.targetMapId : 'N/A'}]`);

        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room, player } = validation;

        // Handle map creation/updates (structural changes)
        if (data.action === 'create' && data.map) {
          const mapId = data.map.id || uuidv4();
          validateMapExists(room, mapId, data.map.name);

          io.to(room.id).emit('map_update', {
            action: 'create',
            map: { id: mapId, ...data.map },
            createdBy: socket.id
          });
        } else if (data.action === 'delete' && data.mapId) {
          if (room.gameState.maps && room.gameState.maps[data.mapId]) {
            delete room.gameState.maps[data.mapId];
          }

          io.to(room.id).emit('map_update', {
            action: 'delete',
            mapId: data.mapId,
            deletedBy: socket.id
          });
        } else if (data.mapUpdates && data.targetMapId) {
          // CRITICAL: Handle terrain/item sync (restored from old server.js)
          // This was accidentally removed during refactoring to socketHandlers.js

          // Only GM can update map state for live synchronization
          if (!player.isGM) {
            logger.warn('[map_update] Non-GM attempted terrain sync');
            return;
          }

          const targetMapId = data.targetMapId;
          const mapData = validateMapExists(room, targetMapId);
          const mapUpdates = data.mapUpdates;

          // Handle terrain data updates
          if (mapUpdates.terrainData) {
            mapData.terrainData = {
              ...mapData.terrainData || {},
              ...mapUpdates.terrainData
            };
            // Handle null values (deleted tiles)
            for (const [key, value] of Object.entries(mapUpdates.terrainData)) {
              if (value === null && mapData.terrainData[key] !== undefined) {
                delete mapData.terrainData[key];
              }
            }
          }

          // Handle wall data updates
          if (mapUpdates.wallData !== undefined) {
            mapData.wallData = {
              ...mapData.wallData || {},
              ...mapUpdates.wallData
            };
            // Handle null values (deleted walls)
            for (const [key, value] of Object.entries(mapUpdates.wallData)) {
              if (value === null && mapData.wallData[key] !== undefined) {
                delete mapData.wallData[key];
              }
            }
          }

          // Handle fog of war updates
          if (mapUpdates.fogOfWar !== undefined) {
            mapData.fogOfWarData = mapUpdates.fogOfWar;
          }
          if (mapUpdates.fogOfWarPaths !== undefined) {
            mapData.fogOfWarPaths = mapUpdates.fogOfWarPaths;
          }
          if (mapUpdates.fogErasePaths !== undefined) {
            mapData.fogErasePaths = mapUpdates.fogErasePaths;
          }
          if (mapUpdates.exploredAreas !== undefined) {
            mapData.exploredAreas = mapUpdates.exploredAreas
          }

          // Handle drawing updates
          if (mapUpdates.drawingLayers !== undefined) {
            mapData.drawingLayers = mapUpdates.drawingLayers;
          }
          if (mapUpdates.drawingPaths !== undefined) {
            mapData.drawingPaths = mapUpdates.drawingPaths;
          }

          // Handle dndElements (connections/portals)
          if (mapUpdates.dndElements !== undefined) {
            mapData.dndElements = mapUpdates.dndElements;
          }

          // Handle environmental objects
          if (mapUpdates.environmentalObjects !== undefined) {
            mapData.environmentalObjects = mapUpdates.environmentalObjects;
          }

          // Handle window overlays (windows and doors)
          if (mapUpdates.windowOverlays !== undefined) {
            mapData.windowOverlays = {
              ...mapData.windowOverlays || {},
              ...mapUpdates.windowOverlays
            };
            // Handle null values (removed windows/doors)
            for (const [key, value] of Object.entries(mapUpdates.windowOverlays)) {
              if (value === null && mapData.windowOverlays[key] !== undefined) {
                delete mapData.windowOverlays[key];
              }
            }
          }

          // Handle light sources
          if (mapUpdates.lightSources !== undefined) {
            mapData.lightSources = mapUpdates.lightSources;
          }

          // Handle grid settings
          if (mapUpdates.gridSettings !== undefined) {
            mapData.gridSettings = mapUpdates.gridSettings;
          }

          // Broadcast to players on the same map
          // Structural updates go to all players, terrain updates only to players on that map
          const isStructuralUpdate = !!(mapUpdates.dndElements || mapUpdates.environmentalObjects || mapUpdates.gridSettings);
          let broadcastCount = 0;

          for (const [sid, p] of players.entries()) {
            if (sid === socket.id || p.roomId !== player.roomId) continue;

            const isOnSameMap = p.currentMapId === targetMapId;
            const shouldReceive = isStructuralUpdate || isOnSameMap;

            if (shouldReceive) {
              io.to(sid).emit('map_update', {
                mapId: targetMapId,
                mapData: mapUpdates,
                updatedBy: player.id,
                sequence: sequence
              });
              broadcastCount++;
            }
          }

          logger.debug(`[map_update] Terrain sync on ${targetMapId} by GM ${player.name}: ${Object.keys(mapUpdates).join(', ')} → ${broadcastCount} players`);
        }

        firebaseBatchWriter.queueWrite(room.id, room.gameState);

      } catch (error) {
        logger.error('[map_update] Error:', { error: error.message });
      }
    });

    socket.on('request_full_map_sync', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId, true);
        if (!validation.valid) return;

        const { room } = validation;

        // Use RealtimeSyncEngine to force sync
        if (services.realtimeSync) {
          logger.info(`🔄 [request_full_map_sync] Forcing map sync for room ${data.roomId}`);
          await services.realtimeSync.forceSyncAll(data.roomId);
        } else {
          // Fallback if sync engine is not available
          io.to(data.roomId).emit('gm_action', {
            type: 'force_map_sync',
            timestamp: Date.now()
          });
        }
      } catch (error) {
        logger.error('[request_full_map_sync] Error:', { error: error.message });
      }
    });

    socket.on('grid_item_update', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        // CRITICAL FIX: Support both mapId and targetMapId from client
        const mapId = data.mapId || data.targetMapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        // CRITICAL FIX: Support both action and updateType from client
        const action = data.action || data.updateType;

        if (action === 'add' && (data.item || data.itemData)) {
          // CRITICAL FIX: Support both item and itemData from client
          const item = data.item || data.itemData;
          const itemId = item.id || uuidv4();
          map.gridItems[itemId] = { ...item, id: itemId };

          io.to(room.id).emit('grid_item_update', {
            action: 'add',
            item: map.gridItems[itemId],
            itemId,
            mapId,
            addedBy: socket.id
          });
        } else if (action === 'update' && data.itemId && data.updates) {
          if (map.gridItems[data.itemId]) {
            map.gridItems[data.itemId] = {
              ...map.gridItems[data.itemId],
              ...data.updates
            };

            io.to(room.id).emit('grid_item_update', {
              action: 'update',
              itemId: data.itemId,
              updates: data.updates,
              mapId,
              updatedBy: socket.id
            });
          }
        } else if (action === 'move' && data.itemId && data.position) {
          // CRITICAL FIX: Handle move action from client
          if (map.gridItems[data.itemId]) {
            map.gridItems[data.itemId] = {
              ...map.gridItems[data.itemId],
              position: data.position,
              gridPosition: data.gridPosition || data.position?.gridPosition
            };

            io.to(room.id).emit('grid_item_update', {
              action: 'move',
              itemId: data.itemId,
              position: data.position,
              gridPosition: data.gridPosition,
              mapId,
              movedBy: socket.id
            });
          }
        } else if (action === 'remove' && data.itemId) {
          delete map.gridItems[data.itemId];

          io.to(room.id).emit('grid_item_update', {
            action: 'remove',
            itemId: data.itemId,
            mapId,
            removedBy: socket.id
          });
        }

        firebaseBatchWriter.queueWrite(room.id, room.gameState);

      } catch (error) {
        logger.error('[grid_item_update] Error:', { error: error.message });
      }
    });

    socket.on('sync_map_state', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room, player } = validation;
        const mapId = player.currentMapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        // Send current map state to requesting player
        socket.emit('map_state_synced', {
          mapId,
          state: {
            tokens: map.tokens || {},
            characterTokens: map.characterTokens || {},
            gridItems: map.gridItems || {},
            terrainData: map.terrainData || {},
            wallData: map.wallData || {},
            windowOverlays: map.windowOverlays || {},
            environmentalObjects: map.environmentalObjects || [],
            drawingPaths: map.drawingPaths || [],
            fogOfWarData: map.fogOfWarData || {},
            lightSources: map.lightSources || {},
            dndElements: map.dndElements || []
          }
        });

      } catch (error) {
        logger.error('[sync_map_state] Error:', { error: error.message });
      }
    });

    // ==================== GM ACTION HANDLERS ====================

    socket.on('gm_switch_view', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId, true);
        if (!validation.valid) return;

        const { room, player } = validation;

        // Case 1: Actual map navigation (GM switches to a different map)
        if (data.newMapId) {
          const targetMapId = data.newMapId;

          // Update GM's current map
          player.currentMapId = targetMapId;
          if (room.gameState.playerMapAssignments) {
            room.gameState.playerMapAssignments[player.id] = targetMapId;
          }

          // Get or create the target map's state
          const targetMap = validateMapExists(room, targetMapId, data.mapName);

          // Build full map data to send back to the GM so client can restore all state
          const mapData = {
            terrainData: targetMap.terrainData || {},
            wallData: targetMap.wallData || {},
            windowOverlays: targetMap.windowOverlays || {},
            drawingPaths: targetMap.drawingPaths || [],
            drawingLayers: targetMap.drawingLayers || [],
            fogOfWarData: targetMap.fogOfWarData || {},
            fogOfWarPaths: targetMap.fogOfWarPaths || [],
            fogErasePaths: targetMap.fogErasePaths || [],
            dndElements: targetMap.dndElements || [],
            environmentalObjects: targetMap.environmentalObjects || [],
            lightSources: targetMap.lightSources || {},
            backgrounds: targetMap.backgrounds || [],
            activeBackgroundId: targetMap.activeBackgroundId || null,
            // Live token positions — uses server's authoritative state
            tokens: targetMap.tokens || {},
            characterTokens: targetMap.characterTokens || {},
            gridItems: targetMap.gridItems || {},
            gridSettings: targetMap.gridSettings || {}
          };

          // Send to the GM only (they initiated the switch)
          socket.emit('gm_view_changed', {
            gmId: player.id,
            gmName: player.name,
            newMapId: targetMapId,
            mapName: data.mapName || targetMap.name || targetMapId,
            mapData
          });

          logger.info(`[gm_switch_view] GM ${player.name} switched to map ${targetMapId}`);
          return;
        }

        // Case 2: Legacy viewMode toggle (player/gm perspective)
        player.gmViewMode = data.viewMode || 'player';
        socket.to(data.roomId).emit('gm_view_changed', {
          gmId: player.id,
          viewMode: player.gmViewMode
        });

      } catch (error) {
        logger.error('[gm_switch_view] Error:', { error: error.message });
      }
    });

    socket.on('gm_transfer_player', async (data) => {
      try {
        // DETAILED LOGGING: Log incoming transfer request
        logger.info('[gm_transfer_player] Request received', {
          roomId: data.roomId,
          playerId: data.playerId,
          targetMapId: data.targetMapId,
          destinationMapName: data.destinationMapName,
          senderSocketId: socket.id
        });

        const validation = validateRoomMembership(socket, data.roomId, true);
        if (!validation.valid) {
          logger.warn('[gm_transfer_player] Validation failed', {
            roomId: data.roomId,
            playerId: data.playerId
          });
          return;
        }

        const { room } = validation;

        // DETAILED LOGGING: Log room state for debugging
        logger.info('[gm_transfer_player] Room state', {
          roomId: room.id,
          gmId: room.gm?.id,
          gmSocketId: room.gm?.socketId,
          gmUserId: room.gmId,
          playersCount: room.players.size,
          playerIds: Array.from(room.players.keys())
        });

        let targetPlayer = room.players.get(data.playerId);

        // ENHANCED FIX: If not found in players map, check if it's the GM using multiple ID sources
        // This handles cases where GM's ID might be roomId, socketId, or userId
        if (!targetPlayer && room.gm) {
          const gmIdMatches =
            room.gm.id === data.playerId ||
            room.gm.socketId === data.playerId ||
            room.gm.socketId === socket.id ||
            room.gmId === data.playerId ||
            (room.gm.userId && room.gm.userId === data.playerId);

          if (gmIdMatches) {
            targetPlayer = room.gm;
            logger.info('[gm_transfer_player] Found GM via enhanced ID match', {
              playerId: data.playerId,
              gmId: room.gm.id,
              gmSocketId: room.gm.socketId,
              gmUserId: room.gmId,
              matchedBy: room.gm.id === data.playerId ? 'gm.id' :
                room.gm.socketId === data.playerId ? 'gm.socketId' :
                  room.gm.socketId === socket.id ? 'sender socket' :
                    room.gmId === data.playerId ? 'gmId' : 'userId'
            });
          }
        }

        if (!targetPlayer) {
          logger.warn('[gm_transfer_player] Player not found in room', {
            playerId: data.playerId,
            roomId: room.id,
            availablePlayerIds: Array.from(room.players.keys()),
            gmId: room.gm?.id,
            gmSocketId: room.gm?.socketId
          });
          return;
        }

        // DETAILED LOGGING: Log target player found
        logger.info('[gm_transfer_player] Target player found', {
          playerId: targetPlayer.id,
          playerName: targetPlayer.name || targetPlayer.characterName,
          playerSocketId: targetPlayer.socketId,
          isGM: targetPlayer.isGM || room.gm === targetPlayer
        });

        // Transfer player to different map
        if (data.targetMapId) {
          targetPlayer.currentMapId = data.targetMapId;
          if (room.gameState.playerMapAssignments) {
            room.gameState.playerMapAssignments[data.playerId] = data.targetMapId;
          }

          // Get the target map state to send with the transfer event
          const targetMap = validateMapExists(room, data.targetMapId, data.destinationMapName);
          const mapData = {
            terrainData: targetMap.terrainData || {},
            wallData: targetMap.wallData || {},
            windowOverlays: targetMap.windowOverlays || {},
            drawingPaths: targetMap.drawingPaths || [],
            drawingLayers: targetMap.drawingLayers || [],
            fogOfWarData: targetMap.fogOfWarData || {},
            fogOfWarPaths: targetMap.fogOfWarPaths || [],
            fogErasePaths: targetMap.fogErasePaths || [],
            dndElements: targetMap.dndElements || [],
            environmentalObjects: targetMap.environmentalObjects || [],
            backgrounds: targetMap.backgrounds || [],
            activeBackgroundId: targetMap.activeBackgroundId || null,
            tokens: targetMap.tokens || {},
            characterTokens: targetMap.characterTokens || {},
            gridItems: targetMap.gridItems || {},
            gridSettings: targetMap.gridSettings || {}
          };

          // DETAILED LOGGING: Log map data being sent
          logger.info('[gm_transfer_player] Sending forced_map_transfer', {
            targetSocketId: targetPlayer.socketId,
            mapId: data.targetMapId,
            mapName: data.destinationMapName,
            hasTokens: Object.keys(mapData.tokens || {}).length > 0,
            hasCharacterTokens: Object.keys(mapData.characterTokens || {}).length > 0,
            hasGridItems: Object.keys(mapData.gridItems || {}).length > 0
          });

          // Notify player with full map data so they can hydrate immediately
          io.to(targetPlayer.socketId).emit('forced_map_transfer', {
            mapId: data.targetMapId,
            mapName: data.destinationMapName || data.targetMapId,
            reason: data.reason || 'GM transferred you',
            mapData
          });

          // Notify everyone else that a player moved explicitly
          io.to(data.roomId).emit('player_location_updated', {
            playerId: targetPlayer.id,
            playerName: targetPlayer.name || targetPlayer.characterName || 'Player',
            newMapId: data.targetMapId,
            transferredByGM: true
          });

          logger.info('[gm_transfer_player] Transfer complete', {
            playerId: targetPlayer.id,
            playerName: targetPlayer.name || targetPlayer.characterName,
            newMapId: data.targetMapId
          });
        }

      } catch (error) {
        logger.error('[gm_transfer_player] Error:', {
          error: error.message,
          stack: error.stack,
          data: {
            roomId: data.roomId,
            playerId: data.playerId,
            targetMapId: data.targetMapId
          }
        });
      }
    });

    // GM requests fresh character positions for a map (e.g. after switching back to it)
    socket.on('gm_request_fresh_positions', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId, true);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        // Send back the server's authoritative characterToken positions for this map
        socket.emit('fresh_positions_received', {
          mapId,
          characterTokens: map.characterTokens || {},
          tokens: map.tokens || {}
        });

        logger.info(`[gm_request_fresh_positions] Sent fresh positions for map ${mapId}`);
      } catch (error) {
        logger.error('[gm_request_fresh_positions] Error:', { error: error.message });
      }
    });

    socket.on('player_use_connection', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room, player } = validation;

        // Handle connection usage (portals, doors, etc.)
        if (data.targetMapId) {
          player.currentMapId = data.targetMapId;
          if (room.gameState.playerMapAssignments) {
            room.gameState.playerMapAssignments[player.id] = data.targetMapId;
          }

          socket.emit('map_transfer_complete', {
            mapId: data.targetMapId
          });

          socket.to(data.roomId).emit('player_map_changed', {
            playerId: player.id,
            mapId: data.targetMapId
          });
        }

      } catch (error) {
        logger.error('[player_use_connection] Error:', { error: error.message });
      }
    });

    socket.on('gm_action', (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId, true);
        if (!validation.valid) return;

        const { room } = validation;
        const actionType = data.action || data.type;

        // Handle various GM actions that require server-side state mutation
        switch (actionType) {
          case 'clear_fog':
            if (room.gameState.maps) {
              Object.values(room.gameState.maps).forEach(map => {
                if (map.fogOfWarData) map.fogOfWarData = {};
              });
            }
            break;

          case 'reset_combat':
            room.gameState.combat = {
              isActive: false,
              currentTurn: null,
              turnOrder: [],
              round: 0
            };
            break;

          case 'heal_all':
            room.players.forEach(p => {
              if (p.character?.health) {
                p.character.health.current = p.character.health.max;
              }
            });
            break;
        }

        // Standardized broadcast for client compatibility
        // We emit BOTH 'action' and 'type' to satisfy various client listeners
        io.to(data.roomId).emit('gm_action', {
          ...data,
          type: actionType,
          action: actionType
        });


        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

      } catch (error) {
        logger.error('[gm_action] Error:', { error: error.message });
      }
    });

    socket.on('sync_gameplay_settings', (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId, true);
        if (!validation.valid) return;

        const { room } = validation;

        room.settings = {
          ...room.settings,
          ...data.settings
        };

        io.to(data.roomId).emit('gameplay_settings_updated', {
          settings: room.settings
        });

      } catch (error) {
        logger.error('[sync_gameplay_settings] Error:', { error: error.message });
      }
    });

    socket.on('gm_note_update', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId, true);
        if (!validation.valid) return;

        const { room } = validation;

        if (!room.gmNotes) room.gmNotes = {};
        room.gmNotes[data.noteId || 'default'] = {
          content: data.content,
          updatedAt: Date.now()
        };

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

      } catch (error) {
        logger.error('[gm_note_update] Error:', { error: error.message });
      }
    });

    // ==================== COMBAT HANDLERS ====================

    socket.on('combat_started', (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;

        room.gameState.combat = {
          isActive: true,
          currentTurnIndex: 0,
          turnOrder: data.turnOrder || [],
          round: 1,
          currentTurnStartTime: Date.now()
        };

        io.to(data.roomId).emit('combat_started', {
          combat: room.gameState.combat
        });

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

      } catch (error) {
        logger.error('[combat_started] Error:', { error: error.message });
      }
    });

    socket.on('combat_ended', (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;

        room.gameState.combat = {
          isActive: false,
          currentTurn: null,
          turnOrder: [],
          round: 0
        };

        io.to(data.roomId).emit('combat_ended');

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

      } catch (error) {
        logger.error('[combat_ended] Error:', { error: error.message });
      }
    });

    socket.on('combat_turn_changed', (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;

        if (room.gameState.combat?.isActive) {
          room.gameState.combat.currentTurnIndex = data.turnIndex;
          room.gameState.combat.currentTurnStartTime = Date.now();

          if (data.round) {
            room.gameState.combat.round = data.round;
          }

          io.to(data.roomId).emit('combat_turn_changed', {
            turnIndex: data.turnIndex,
            round: room.gameState.combat.round
          });
        }

      } catch (error) {
        logger.error('[combat_turn_changed] Error:', { error: error.message });
      }
    });

    socket.on('item_looted', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room, player } = validation;

        io.to(room.id).emit('item_looted', {
          gridItemId: data.gridItemId,
          item: data.item,
          quantity: data.quantity,
          source: data.source,
          looter: data.looter,
          playerId: player.id,
          itemRemoved: true,
          mapId: data.mapId || player.currentMapId || 'default',
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        logger.error('[item_looted] Error:', { error: error.message });
      }
    });

    // ==================== CHAT HANDLERS ====================

    socket.on('chat_message', async (data) => {
      try {
        const player = players.get(socket.id);
        if (!player) return;

        const room = rooms.get(player.roomId);
        if (!room) return;

        const sanitizedMessage = sanitizeChatMessage(data.message);
        if (!sanitizedMessage) return;

        const chatMessage = {
          id: uuidv4(),
          sender: {
            id: player.id,
            name: player.name,
            isGM: player.isGM
          },
          content: sanitizedMessage,
          type: data.type || 'chat',
          timestamp: new Date().toISOString()
        };

        room.chatHistory.push(chatMessage);

        // Keep only last 500 messages
        if (room.chatHistory.length > 500) {
          room.chatHistory = room.chatHistory.slice(-500);
        }

        io.to(player.roomId).emit('chat_message', chatMessage);

        chatDebug(`[chat] ${player.name}: ${sanitizedMessage}`);

      } catch (error) {
        logger.error('[chat_message] Error:', { error: error.message });
      }
    });

    socket.on('global_chat_message', (data) => {
      try {
        const player = players.get(socket.id);
        if (!player) return;

        const sanitizedMessage = sanitizeChatMessage(data.message);
        if (!sanitizedMessage) return;

        const chatMessage = {
          id: uuidv4(),
          sender: {
            id: player.id,
            name: player.name
          },
          content: sanitizedMessage,
          type: 'global',
          timestamp: new Date().toISOString()
        };

        io.emit('global_chat_message', chatMessage);

      } catch (error) {
        logger.error('[global_chat_message] Error:', { error: error.message });
      }
    });

    socket.on('whisper_message', (data) => {
      try {
        // Allow whispers from both game room players AND social users
        const player = players.get(socket.id);
        const socialUser = onlineSocialUsers.get(socket.id);

        // Must be either a player in a room OR a social user
        if (!player && !socialUser) {
          logger.warn('[whisper_message] Sender not found in players or onlineSocialUsers', { socketId: socket.id });
          return;
        }

        const sanitizedMessage = sanitizeChatMessage(data.message);
        let userId = socket.data?.userId;
        let userName = 'Unknown';

        if (player) {
          userId = userId || player.id;
          userName = player.name;
        } else if (socialUser) {
          userId = userId || socialUser.userId;
          userName = socialUser.name;
        }

        if (!userId) {
          logger.warn('[whisper_message] No userId found for sender', { socketId: socket.id });
          return;
        }

        const { recipientId, content } = data;
        const sanitizedContent = sanitizeChatMessage(content);
        if (!sanitizedContent) {
          logger.warn('[whisper_message] Empty message content');
          return;
        }

        // Find recipient socket
        const recipientSockets = getSocketsByUserId(recipientId);
        const targetSocket = recipientSockets?.[0];

        if (!targetSocket) {
          logger.info('[whisper_message] Recipient not found', { recipientId });
          socket.emit('whisper_failed', { reason: 'Player not found or offline' });
          return;
        }

        const whisperMessage = {
          id: uuidv4(),
          senderId: userId,
          senderName: userName,
          recipientId,
          recipientName: data.recipientName || 'Unknown',
          content: sanitizedContent,
          timestamp: Date.now(),
          type: 'whisper'
        };

        logger.info('[whisper_message] Sending whisper', {
          from: userId,
          to: recipientId,
          targetSocketId: targetSocket.id
        });

        // Emit to recipient - use socket.id, not the socket object
        io.to(targetSocket.id).emit('whisper_received', whisperMessage);

        // Emit confirmation to sender
        socket.emit('whisper_sent', {
          ...whisperMessage,
          isSent: true,
          targetName: data.recipientName || 'Unknown'
        });

      } catch (error) {
        logger.error('[whisper_message] Error:', { error: error.message });
      }
    });

    // ==================== ENVIRONMENT HANDLERS ====================

    socket.on('container_update', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        if (data.container) {
          if (!map.containers) map.containers = {};
          map.containers[data.container.id] = data.container;
        }

        socket.to(data.roomId).emit('container_update', {
          container: data.container,
          mapId,
          updatedBy: socket.id
        });

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

      } catch (error) {
        logger.error('[container_update] Error:', { error: error.message });
      }
    });

    socket.on('creature_added', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        if (!map.creatures) map.creatures = {};
        const creatureId = data.creature.id || uuidv4();
        map.creatures[creatureId] = {
          ...data.creature,
          id: creatureId,
          addedAt: Date.now()
        };

        io.to(data.roomId).emit('creature_added', {
          creature: map.creatures[creatureId],
          mapId,
          addedBy: socket.id
        });

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

      } catch (error) {
        logger.error('[creature_added] Error:', { error: error.message });
      }
    });

    socket.on('creature_updated', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        const updates = data.updates || data.stateUpdates || {};
        if (map.creatures && map.creatures[data.creatureId]) {
          map.creatures[data.creatureId] = {
            ...map.creatures[data.creatureId],
            ...updates
          };

          io.to(data.roomId).emit('creature_updated', {
            creatureId: data.creatureId,
            updates: updates,
            mapId,
            updatedBy: socket.id
          });

          // Strip undefined values before queuing write to prevent Firestore crash
          const sanitizedState = stripUndefined(room.gameState);
          firebaseBatchWriter.queueWrite(data.roomId, sanitizedState);
        }

      } catch (error) {
        logger.error('[creature_updated] Error:', { error: error.message });
      }
    });

    socket.on('wall_update', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        if (data.action === 'add' && data.wall) {
          const wallId = data.wall.id || uuidv4();
          map.wallData[wallId] = data.wall;

          io.to(data.roomId).emit('wall_update', {
            action: 'add',
            wall: { ...data.wall, id: wallId },
            mapId,
            updatedBy: socket.id
          });
        } else if (data.action === 'remove' && data.wallId) {
          delete map.wallData[data.wallId];

          io.to(data.roomId).emit('wall_update', {
            action: 'remove',
            wallId: data.wallId,
            mapId,
            updatedBy: socket.id
          });
        } else if (data.action === 'batch' && data.walls) {
          data.walls.forEach(wall => {
            const wallId = wall.id || uuidv4();
            map.wallData[wallId] = wall;
          });

          io.to(data.roomId).emit('wall_update', {
            action: 'batch',
            walls: data.walls,
            mapId,
            updatedBy: socket.id
          });
        }

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

      } catch (error) {
        logger.error('[wall_update] Error:', { error: error.message });
      }
    });

    socket.on('door_state_changed', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        if (map.wallData[data.doorId]) {
          map.wallData[data.doorId].isOpen = data.isOpen;

          io.to(data.roomId).emit('door_state_changed', {
            doorId: data.doorId,
            isOpen: data.isOpen,
            mapId,
            changedBy: socket.id
          });

          firebaseBatchWriter.queueWrite(data.roomId, room.gameState);
        }

      } catch (error) {
        logger.error('[door_state_changed] Error:', { error: error.message });
      }
    });

    socket.on('light_source_update', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        if (data.action === 'add' && data.lightSource) {
          const lightId = data.lightSource.id || uuidv4();
          map.lightSources[lightId] = data.lightSource;

          io.to(data.roomId).emit('light_source_update', {
            action: 'add',
            lightSource: { ...data.lightSource, id: lightId },
            mapId,
            updatedBy: socket.id
          });
        } else if (data.action === 'remove' && data.lightId) {
          delete map.lightSources[data.lightId];

          io.to(data.roomId).emit('light_source_update', {
            action: 'remove',
            lightId: data.lightId,
            mapId,
            updatedBy: socket.id
          });
        } else if (data.action === 'update' && data.lightId && data.updates) {
          if (map.lightSources[data.lightId]) {
            map.lightSources[data.lightId] = {
              ...map.lightSources[data.lightId],
              ...data.updates
            };

            io.to(data.roomId).emit('light_source_update', {
              action: 'update',
              lightId: data.lightId,
              updates: data.updates,
              mapId,
              updatedBy: socket.id
            });
          }
        }

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

      } catch (error) {
        logger.error('[light_source_update] Error:', { error: error.message });
      }
    });

    socket.on('fog_update', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        if (data.fogData) {
          map.fogOfWarData = {
            ...map.fogOfWarData,
            ...data.fogData
          };
        }

        if (data.fogPaths) {
          map.fogOfWarPaths = data.fogPaths;
        }

        socket.to(data.roomId).emit('fog_update', {
          fogData: map.fogOfWarData,
          fogPaths: map.fogOfWarPaths,
          mapId,
          updatedBy: socket.id
        });

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

      } catch (error) {
        logger.error('[fog_update] Error:', { error: error.message });
      }
    });

    socket.on('drawing_update', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        if (data.paths) {
          map.drawingPaths = data.paths;
        }

        if (data.layers) {
          map.drawingLayers = data.layers;
        }

        socket.to(data.roomId).emit('drawing_update', {
          paths: map.drawingPaths,
          layers: map.drawingLayers,
          mapId,
          updatedBy: socket.id
        });

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

      } catch (error) {
        logger.error('[drawing_update] Error:', { error: error.message });
      }
    });

    socket.on('environmental_object_update', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        if (data.action === 'add' && data.object) {
          map.environmentalObjects.push(data.object);

          io.to(data.roomId).emit('environmental_object_update', {
            action: 'add',
            object: data.object,
            mapId,
            updatedBy: socket.id
          });
        } else if (data.action === 'remove' && data.objectId) {
          map.environmentalObjects = map.environmentalObjects.filter(
            obj => obj.id !== data.objectId
          );

          io.to(data.roomId).emit('environmental_object_update', {
            action: 'remove',
            objectId: data.objectId,
            mapId,
            updatedBy: socket.id
          });
        } else if (data.action === 'update' && data.objectId && data.updates) {
          const objIndex = map.environmentalObjects.findIndex(
            obj => obj.id === data.objectId
          );
          if (objIndex >= 0) {
            map.environmentalObjects[objIndex] = {
              ...map.environmentalObjects[objIndex],
              ...data.updates
            };

            io.to(data.roomId).emit('environmental_object_update', {
              action: 'update',
              objectId: data.objectId,
              updates: data.updates,
              mapId,
              updatedBy: socket.id
            });
          }
        }

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

      } catch (error) {
        logger.error('[environmental_object_update] Error:', { error: error.message });
      }
    });

    // ==================== SYNC HANDLERS ====================

    socket.on('request_full_sync', () => {
      const player = players.get(socket.id);
      if (!player) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      socket.emit('full_sync', {
        room: {
          id: room.id,
          name: room.name,
          gm: room.gm,
          players: Array.from(room.players.values()),
          settings: room.settings,
          gameState: room.gameState
        },
        player: player
      });
    });

    socket.on('resolve_state_conflict', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;

        // Apply conflict resolution
        if (data.resolvedState) {
          room.gameState = {
            ...room.gameState,
            ...data.resolvedState
          };

          io.to(data.roomId).emit('state_resolved', {
            resolvedState: room.gameState
          });

          firebaseBatchWriter.queueWrite(data.roomId, room.gameState);
        }

      } catch (error) {
        logger.error('[resolve_state_conflict] Error:', { error: error.message });
      }
    });

    // ==================== SESSION HANDLERS ====================

    socket.on('launch_game_session', (_data) => {
      const player = players.get(socket.id);
      if (!player || !player.isGM) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      // Notify all players that game session is starting
      io.to(player.roomId).emit('game_session_started', {
        roomId: room.id,
        roomName: room.name
      });
    });

    socket.on('respond_to_game_session', (data) => {
      const player = players.get(socket.id);
      if (!player) return;

      // Handle player response to game session invitation
      if (data.accepted) {
        socket.emit('game_session_accepted');
      }
    });

    socket.on('respond_to_room_invitation', async (data) => {
      try {
        let player = players.get(socket.id);
        if (!player) {
          logger.info('[respond_to_room_invitation] Player not found in memory, attempting to create from socket data', { socketId: socket.id });

          const userId = socket.data?.userId;
          const socialUser = onlineSocialUsers.get(socket.id);

          if (userId || socialUser) {
            const displayName = socialUser?.name || socket.data?.email || 'Player';
            player = {
              id: userId || uuidv4(),
              name: displayName,
              socketId: socket.id,
              userId: userId,
              accountName: displayName,
              character: data.character || socialUser?.character || null,
              color: socialUser?.color || '#4a90e2',
              isGM: false,
              roomId: null
            };
            players.set(socket.id, player);
            logger.info('[respond_to_room_invitation] Created new player record for invitation join', { playerId: player.id });
          } else {
            logger.warn('[respond_to_room_invitation] Could not resolve player for socket', { socketId: socket.id });
            socket.emit('join_error', { message: 'Authentication required to join session' });
            return;
          }
        }

        // Clean up the invitation record regardless of response
        if (data.invitationId) {
          partyInvitations.delete(data.invitationId);
        }

        if (data.accepted && data.roomId) {
          const room = rooms.get(data.roomId);
          if (!room) {
            logger.warn('[respond_to_room_invitation] Room not found', { roomId: data.roomId });
            socket.emit('join_error', { message: 'Room no longer exists' });
            return;
          }

          // If player is already in this room (e.g. duplicate event), skip
          if (player.roomId === data.roomId) {
            logger.info('[respond_to_room_invitation] Player already in room, skipping', {
              playerId: player.id, roomId: data.roomId
            });
            return;
          }

          // Join the socket to the room channel and update state
          player.roomId = data.roomId;
          player.currentMapId = room.gameState?.defaultMapId || 'default';
          room.players.set(player.id, player);
          socket.join(data.roomId);

          logger.info('[respond_to_room_invitation] Player joined room via GM invitation', {
            playerId: player.id,
            playerName: player.name,
            roomId: data.roomId
          });

          // CRITICAL FIX: Emit room_joined (not room_invitation_accepted) so
          // MultiplayerApp's existing socket listener handles the transition to
          // the room loading screen.
          socket.emit('room_joined', {
            room: {
              id: room.id,
              name: room.name,
              persistentRoomId: room.persistentRoomId || room.id,
              gm: room.gm,
              players: Array.from(room.players.values()),
              settings: room.settings || {},
              gameState: room.gameState,
              playerMapAssignments: room.gameState?.playerMapAssignments || {}
            },
            player: player,
            isGM: false
          });

          // Broadcast to the rest of the room (GM + existing players) so their
          // party HUDs update with the new member.
          socket.to(data.roomId).emit('player_joined', {
            player: {
              id: player.id,
              name: player.name,
              socketId: socket.id,
              userId: player.userId || socket.data?.userId,
              accountName: player.accountName,
              character: player.character,
              currentMapId: player.currentMapId,
              isGM: false
            },
            playerCount: room.players.size + (room.gm && room.players.has(room.gm.id) ? 0 : 1)
          });

        } else {
          logger.info('[respond_to_room_invitation] Player declined GM invitation', {
            playerId: player?.id, roomId: data.roomId
          });
        }

      } catch (error) {
        logger.error('[respond_to_room_invitation] Error:', { error: error.message });
      }
    });

    socket.on('update_player_color', (data) => {
      const player = players.get(socket.id);
      if (!player) return;

      player.color = data.color;

      const room = rooms.get(player.roomId);
      if (room) {
        room.players.set(player.id, player);

        io.to(player.roomId).emit('player_color_updated', {
          playerId: player.id,
          color: data.color
        });
      }
    });

    // ==================== PARTY HANDLERS ====================
    // Note: These are for the social party system, not room party

    const getPartyMemberCount = (party) => Object.keys(party?.members || {}).length;

    const normalizePartyForClient = (party) => {
      if (!party) return null;
      return {
        ...party,
        members: { ...(party.members || {}) }
      };
    };

    const emitPartyUpdated = (party) => {
      if (!party) return;
      emitToPartyMembers(party, 'party_updated', normalizePartyForClient(party));
    };

    const createSocialParty = ({ leaderUserId, partyName, leaderData = {} }) => {
      const fallbackName = `${getUserDisplayName(leaderUserId, 'Party Leader')}'s Party`;
      const normalizedName =
        typeof partyName === 'string' && partyName.trim().length > 0
          ? partyName.trim()
          : fallbackName;

      const partyId = uuidv4();
      const createdAt = Date.now();
      const leaderMember = buildPartyMemberData(leaderUserId, {
        ...leaderData,
        isGM: true,
        joinedAt: createdAt
      });

      const party = {
        id: partyId,
        name: normalizedName,
        leaderId: leaderUserId,
        maxMembers: 6,
        isActive: true,
        members: {
          [leaderUserId]: leaderMember
        },
        createdAt,
        updatedAt: createdAt
      };

      parties.set(partyId, party);
      userToParty.set(leaderUserId, partyId);

      return party;
    };

    const autoDisbandIfTooSmall = (party, context = {}) => {
      if (!party) return false;

      const memberIds = Object.keys(party.members || {});
      if (memberIds.length === 0) {
        parties.delete(party.id);
        return true;
      }

      if (memberIds.length === 1) {
        const lastMemberId = memberIds[0];
        const lastMember = party.members[lastMemberId];
        const disbandPayload = {
          partyId: party.id,
          partyName: party.name,
          disbandedBy: context.triggerUserId || null
        };

        emitToUserId(lastMemberId, 'party_auto_disbanded', {
          ...disbandPayload,
          message: `${party.name} has been disbanded because only one member remained.`
        });

        emitToUserId(lastMemberId, 'party_disbanded', disbandPayload);

        userToParty.delete(lastMemberId);
        parties.delete(party.id);

        logger.info('[party] Auto-disbanded party with a single remaining member', {
          partyId: party.id,
          partyName: party.name,
          lastMemberId,
          lastMemberName: lastMember?.name,
          triggeredBy: context.triggerUserId || null
        });

        return true;
      }

      return false;
    };

    socket.on('create_party', ({ partyName, leaderData }) => {
      try {
        let userId = socket.data.userId;
        let userName = leaderData?.name || 'Unknown';

        // Try to get richer data from players map or social users
        const player = players.get(socket.id);
        const socialUser = onlineSocialUsers.get(socket.id);

        if (player) {
          userId = player.id;
          userName = player.name;
        } else if (socialUser) {
          userId = socialUser.userId;
          userName = socialUser.name;
        }

        if (!userId) {
          // Fallback for local dev/unauthed
          if (socket.data.isGuest) {
            userId = 'guest-' + socket.id;
          } else {
            return;
          }
        }

        const partyId = uuidv4();
        const leaderMember = buildPartyMemberData(userId, {
          ...leaderData,
          isGM: true,
          joinedAt: Date.now()
        });

        const party = {
          id: partyId,
          name: partyName || `${userName}'s Party`,
          leaderId: userId,
          members: {
            [userId]: leaderMember
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        parties.set(partyId, party);
        userToParty.set(userId, partyId);

        socket.emit('party_created', { party });

        logger.info('[create_party] Party created', { partyId, leaderId: userId });

      } catch (error) {
        logger.error('[create_party] Error:', { error: error.message });
      }
    });

    socket.on('join_party', ({ partyId }) => {
      try {
        let userId = socket.data.userId;
        let userName = 'Unknown';

        const player = players.get(socket.id);
        const socialUser = onlineSocialUsers.get(socket.id);

        if (player) {
          userId = player.id;
          userName = player.name;
        } else if (socialUser) {
          userId = socialUser.userId;
          userName = socialUser.name;
        }

        if (!userId) return;

        const party = parties.get(partyId);
        if (!party) {
          socket.emit('party_error', { error: 'Party not found' });
          return;
        }

        // Check if already in party
        if (party.members[userId]) {
          socket.emit('party_joined', { party: normalizePartyForClient(party) });
          return;
        }

        const memberData = buildPartyMemberData(userId, { isGM: false });
        party.members[userId] = memberData;
        userToParty.set(userId, partyId);

        socket.emit('party_joined', { party: normalizePartyForClient(party) });

        // Notify other party members
        Object.keys(party.members).forEach(memberId => {
          if (memberId !== userId) {
            const memberSockets = getSocketsByUserId(memberId);
            memberSockets.forEach(s => s.emit('party_member_joined', {
              partyId,
              memberId: userId,
              memberData: memberData
            }));
          }
        });

        logger.info('[join_party] Player joined party', { playerId: userId, partyId });

      } catch (error) {
        logger.error('[join_party] Error:', { error: error.message });
      }
    });

    socket.on('leave_party', () => {
      try {
        // Resolve User ID
        let userId = socket.data.userId;
        let userName = 'Unknown';

        const player = players.get(socket.id);
        const socialUser = onlineSocialUsers.get(socket.id);

        if (player) {
          userId = player.id;
          userName = player.name;
        } else if (socialUser) {
          userId = socialUser.userId;
          userName = socialUser.name;
        }

        if (!userId) {
          logger.warn('[leave_party] No userId found', { socketId: socket.id });
          return;
        }

        // Use extracted function for party leave logic
        handlePartyLeave(userId, userName, socket.id);

        // Confirm to leaving user
        socket.emit('party_left', { success: true });

        logger.info('[leave_party] Player left party', { playerId: userId, socketId: socket.id });

      } catch (error) {
        logger.error('[leave_party] Error:', { error: error.message, stack: error.stack });
      }
    });

    socket.on('register_presence', (data) => {
      try {
        let userId = socket.data.userId || data.userId;
        let name = data.name || 'Unknown';

        const player = players.get(socket.id);
        if (player) {
          userId = player.id;
          name = player.name;
        }

        if (!userId) {
          if (socket.data.isGuest) {
            userId = 'guest-' + socket.id;
          } else {
            logger.warn('[register_presence] No userId available', { socketId: socket.id, dataUserId: data.userId });
            return;
          }
        }

        onlineSocialUsers.set(socket.id, {
          userId: userId,
          name: name,
          characterClass: data.characterClass,
          characterLevel: data.characterLevel,
          status: 'online',
          lastSeen: Date.now()
        });

        socket.emit('presence_registered', { success: true });

      } catch (error) {
        logger.error('[register_presence] Error:', { error: error.message });
      }
    });

    socket.on('update_status', (data) => {
      try {
        const { userId, status, statusComment } = data;

        if (!userId) {
          logger.warn('[update_status] Missing userId');
          return;
        }

        const validStatuses = ['online', 'away', 'busy', 'offline'];
        if (!validStatuses.includes(status)) {
          logger.warn('[update_status] Invalid status:', { status });
          return;
        }

        // Update the user's status in onlineSocialUsers
        const userEntry = Array.from(onlineSocialUsers.entries())
          .find(([socketId, user]) => user.userId === userId);

        if (userEntry) {
          const [socketId, userData] = userEntry;
          onlineSocialUsers.set(socketId, {
            ...userData,
            status,
            statusComment: statusComment || null,
            lastSeen: Date.now()
          });

          // Broadcast status update to all other users
          socket.broadcast.emit('user_status_changed', {
            userId,
            status,
            statusComment: statusComment || null
          });

          logger.info('[update_status] Status updated', { userId, status });
        }

      } catch (error) {
        logger.error('[update_status] Error:', { error: error.message });
      }
    });

    socket.on('accept_party_invite', ({ invitationId }) => {
      try {
        const invitation = partyInvitations.get(invitationId);
        if (!invitation) {
          socket.emit('party_error', { error: 'Invitation not found or expired' });
          return;
        }

        if (Date.now() > invitation.expiresAt) {
          partyInvitations.delete(invitationId);
          socket.emit('party_error', { error: 'Invitation expired' });
          return;
        }

        const party = parties.get(invitation.partyId);
        if (!party) {
          socket.emit('party_error', { error: 'Party no longer exists' });
          return;
        }

        // Resolve User ID
        let userId = socket.data.userId;
        let userName = 'Unknown';

        const player = players.get(socket.id);
        const socialUser = onlineSocialUsers.get(socket.id);

        if (player) {
          userId = player.id;
          userName = player.name;
        } else if (socialUser) {
          userId = socialUser.userId;
          userName = socialUser.name;
        }

        if (!userId) return;

        const memberData = buildPartyMemberData(userId, { isGM: false });
        party.members[userId] = memberData;

        userToParty.set(userId, invitation.partyId);
        partyInvitations.delete(invitationId);

        // Client expects party_updated (or party_created) to initialize state
        socket.emit('party_updated', { party: normalizePartyForClient(party) });

        // Notify other party members
        Object.keys(party.members).forEach(memberId => {
          if (memberId !== userId) {
            const memberSockets = getSocketsByUserId(memberId);
            memberSockets.forEach(s => s.emit('party_member_joined', {
              partyId: invitation.partyId,
              memberId: userId,
              memberData: memberData
            }));
          }
        });

        // Notify the inviter specifically that their invite was accepted
        if (invitation.fromUserId && invitation.fromUserId !== userId) {
          const inviterSockets = getSocketsByUserId(invitation.fromUserId);
          inviterSockets.forEach(s => {
            s.emit('party_invite_accepted', {
              partyId: invitation.partyId,
              memberId: userId,
              memberName: userName,
              memberData: memberData
            });
            s.emit('party_invitation_accepted', {
              invitationId,
              userId,
              userName
            });
          });
        }

        // Notify the receiver that they successfully joined
        socket.emit('party_join_confirmed', {
          partyId: invitation.partyId,
          partyName: party.name,
          memberCount: Object.keys(party.members).length
        });

        logger.info('[accept_party_invite] Player joined party', {
          playerId: userId,
          partyId: invitation.partyId
        });

      } catch (error) {
        logger.error('[accept_party_invite] Error:', { error: error.message });
      }
    });

    socket.on('decline_party_invite', ({ invitationId }) => {
      try {
        const invitation = partyInvitations.get(invitationId);
        if (!invitation) return;

        // Resolve the decliner's name
        let declinerName = invitation.toUserId;
        const socialUser = onlineSocialUsers.get(socket.id);
        if (socialUser && socialUser.name) {
          declinerName = socialUser.name;
        }

        partyInvitations.delete(invitationId);

        // Notify inviter
        const inviterSockets = getSocketsByUserId(invitation.fromUserId);
        inviterSockets.forEach(s => s.emit('party_invitation_declined', {
          invitationId,
          userId: invitation.toUserId,
          userName: declinerName
        }));

        // Confirm to decliner
        socket.emit('invitation_declined_confirmed', { invitationId });

      } catch (error) {
        logger.error('[decline_party_invite] Error:', { error: error.message });
      }
    });

    socket.on('party_message', ({ partyId, message }) => {
      try {
        // Resolve User ID
        let userId = socket.data.userId;
        let userName = 'Unknown';

        const player = players.get(socket.id);
        const socialUser = onlineSocialUsers.get(socket.id);

        if (player) {
          userId = player.id;
          userName = player.name;
        } else if (socialUser) {
          userId = socialUser.userId;
          userName = socialUser.name;
        }

        if (!userId) return;

        const party = parties.get(partyId);
        if (!party) return;

        // Check membership
        const isMember = party.members.some(m => m.id === userId);
        if (!isMember) return;

        const sanitizedMessage = sanitizeChatMessage(message);
        if (!sanitizedMessage) return;

        // Broadcast to all party members
        Object.keys(party.members).forEach(memberId => {
          const memberSockets = getSocketsByUserId(memberId);
          memberSockets.forEach(s => {
            s.emit('party_chat_message', {
              partyId,
              fromId: userId,
              senderName: userName,
              message: sanitizedMessage,
              timestamp: Date.now()
            });
          });
        });

      } catch (error) {
        logger.error('[party_message] Error:', { error: error.message });
      }
    });

    socket.on('promote_to_leader', ({ partyId, newLeaderId }) => {
      try {
        // Resolve User ID
        let userId = socket.data.userId;

        const player = players.get(socket.id);
        const socialUser = onlineSocialUsers.get(socket.id);

        if (player) {
          userId = player.id;
        } else if (socialUser) {
          userId = socialUser.userId;
        }

        if (!userId) return;

        const party = parties.get(partyId);
        if (!party) return;

        // Only current leader can promote
        if (party.leaderId !== userId) {
          socket.emit('party_error', { error: 'Only the leader can promote members' });
          return;
        }

        const newLeaderMember = party.members[newLeaderId];
        if (!newLeaderMember) {
          socket.emit('party_error', { error: 'Member not found' });
          return;
        }

        // Update leader
        Object.keys(party.members).forEach(mId => {
          party.members[mId].isLeader = (mId === newLeaderId);
          // Also set isGM for legacy compatibility in some UI parts
          party.members[mId].isGM = (mId === newLeaderId);
        });
        party.leaderId = newLeaderId;

        // Notify all members
        Object.keys(party.members).forEach(memberId => {
          const memberSockets = getSocketsByUserId(memberId);
          memberSockets.forEach(s => s.emit('party_leader_changed', {
            newLeaderId,
            newLeaderName: newLeaderMember.name
          }));
        });

        logger.info('[promote_to_leader] New party leader', { partyId, newLeaderId });

      } catch (error) {
        logger.error('[promote_to_leader] Error:', { error: error.message });
      }
    });

    socket.on('remove_party_member', ({ partyId, targetUserId }) => {
      try {
        // Resolve User ID
        let userId = socket.data.userId;

        const player = players.get(socket.id);
        const socialUser = onlineSocialUsers.get(socket.id);

        if (player) {
          userId = player.id;
        } else if (socialUser) {
          userId = socialUser.userId;
        }

        if (!userId) return;

        const party = parties.get(partyId);
        if (!party) return;

        // Only leader can remove
        if (party.leaderId !== userId) {
          socket.emit('party_error', { error: 'Only the leader can remove members' });
          return;
        }

        delete party.members[targetUserId];
        userToParty.delete(targetUserId);

        // Notify removed member
        const removedSockets = getSocketsByUserId(targetUserId);
        removedSockets.forEach(s => s.emit('removed_from_party', { partyId }));

        // Notify remaining members
        Object.keys(party.members).forEach(memberId => {
          const memberSockets = getSocketsByUserId(memberId);
          memberSockets.forEach(s => s.emit('party_member_removed', {
            memberId: targetUserId
          }));
        });

        logger.info('[remove_party_member] Member removed from party', { partyId, targetUserId });

      } catch (error) {
        logger.error('[remove_party_member] Error:', { error: error.message });
      }
    });

    socket.on('disband_party', ({ partyId }) => {
      try {
        // Resolve User ID
        let userId = socket.data.userId;

        const player = players.get(socket.id);
        const socialUser = onlineSocialUsers.get(socket.id);

        if (player) {
          userId = player.id;
        } else if (socialUser) {
          userId = socialUser.userId;
        }

        if (!userId) return;

        const party = parties.get(partyId);
        if (!party) return;

        // Only leader can disband
        if (party.leaderId !== userId) {
          socket.emit('party_error', { error: 'Only the leader can disband the party' });
          return;
        }

        // Notify all members
        Object.keys(party.members).forEach(memberId => {
          userToParty.delete(memberId);
          const memberSockets = getSocketsByUserId(memberId);
          memberSockets.forEach(s => s.emit('party_disbanded', { partyId }));
        });

        parties.delete(partyId);

        socket.emit('party_left', { partyId });

        logger.info('[disband_party] Party disbanded', { partyId, leaderId: userId });

      } catch (error) {
        logger.error('[disband_party] Error:', { error: error.message });
      }
    });

    // ==================== SESSION INVITATION HANDLERS ====================

    socket.on('request_to_join_session', async (data) => {
      try {
        const { leaderId, roomId, requesterId, requesterName } = data;

        logger.info('[request_to_join_session] Join request received', {
          leaderId, roomId, requesterId, requesterName
        });

        const room = rooms.get(roomId);
        if (!room) {
          socket.emit('join_error', { message: 'Room not found' });
          logger.warn('[request_to_join_session] Room not found', { roomId });
          return;
        }

        const leaderInRoom = Array.from(players.values())
          .some(p => (p.userId === leaderId || p.id === leaderId) && p.roomId === roomId);

        if (!leaderInRoom) {
          socket.emit('join_error', { message: 'Leader is not in this session' });
          logger.warn('[request_to_join_session] Leader not in room', { leaderId, roomId });
          return;
        }

        const requestId = uuidv4();
        const request = {
          id: requestId,
          roomId,
          requesterId,
          requesterName,
          leaderId,
          createdAt: Date.now(),
          expiresAt: Date.now() + 60000
        };

        roomJoinRequests.set(requestId, request);

        const leaderSockets = getSocketsByUserId(leaderId);
        if (leaderSockets.length > 0) {
          leaderSockets.forEach(s => {
            s.emit('session_join_request', request);
          });
          logger.info('[request_to_join_session] Join request sent to leader', {
            requestId, requesterId, leaderId
          });
        } else {
          socket.emit('join_error', { message: 'Leader is not online' });
          logger.warn('[request_to_join_session] Leader not online', { leaderId });
          roomJoinRequests.delete(requestId);
        }

      } catch (error) {
        logger.error('[request_to_join_session] Error:', { error: error.message });
      }
    });

    socket.on('respond_to_join_request', async (data) => {
      try {
        const { requestId, accepted } = data;

        logger.info('[respond_to_join_request] Response received', { requestId, accepted });

        const request = roomJoinRequests.get(requestId);
        if (!request) {
          socket.emit('join_error', { message: 'Request not found or expired' });
          logger.warn('[respond_to_join_request] Request not found', { requestId });
          return;
        }

        if (Date.now() > request.expiresAt) {
          roomJoinRequests.delete(requestId);
          socket.emit('join_error', { message: 'Request expired' });
          logger.warn('[respond_to_join_request] Request expired', { requestId });
          return;
        }

        const requesterSockets = getSocketsByUserId(request.requesterId);

        if (accepted) {
          const invitation = {
            id: uuidv4(),
            roomId: request.roomId,
            partyName: 'Session Join',
            gmName: request.leaderId,
            createdAt: Date.now(),
            expiresAt: Date.now() + 300000
          };

          partyInvitations.set(invitation.id, invitation);

          if (requesterSockets.length > 0) {
            requesterSockets.forEach(s => {
              s.emit('join_request_accepted', {
                invitation,
                roomId: request.roomId
              });
            });
          }

          logger.info('[respond_to_join_request] Join request accepted', {
            requestId, requesterId: request.requesterId
          });
        } else {
          if (requesterSockets.length > 0) {
            requesterSockets.forEach(s => {
              s.emit('join_request_declined', {
                requestId,
                leaderId: request.leaderId
              });
            });
          }

          logger.info('[respond_to_join_request] Join request declined', {
            requestId, requesterId: request.requesterId
          });
        }

        roomJoinRequests.delete(requestId);

      } catch (error) {
        logger.error('[respond_to_join_request] Error:', { error: error.message });
      }
    });

    socket.on('invite_member_to_session', async (data) => {
      try {
        const { memberId, roomId } = data;
        const userId = socket.data?.userId;

        logger.info('[invite_member_to_session] Session invite received', {
          memberId, roomId, inviterId: userId
        });

        const player = players.get(socket.id);
        if (!player || player.roomId !== roomId) {
          socket.emit('invite_error', { message: 'You must be in the session to invite' });
          logger.warn('[invite_member_to_session] Inviter not in room', { socketId: socket.id });
          return;
        }

        const room = rooms.get(roomId);
        if (!room) {
          socket.emit('invite_error', { message: 'Room not found' });
          logger.warn('[invite_member_to_session] Room not found', { roomId });
          return;
        }

        const memberSockets = getSocketsByUserId(memberId);
        if (memberSockets.length === 0) {
          socket.emit('invite_error', { message: 'Member not online' });
          logger.warn('[invite_member_to_session] Member not online', { memberId });
          return;
        }

        const invitation = {
          id: uuidv4(),
          roomId,
          partyName: room.name || 'Game Session',
          gmName: player.name,
          gmCharacterName: player.character?.name || player.name,
          gmClass: player.character?.class,
          gmLevel: player.character?.level,
          status: 'pending',
          createdAt: Date.now(),
          expiresAt: Date.now() + 300000
        };

        partyInvitations.set(invitation.id, invitation);

        memberSockets.forEach(s => {
          s.emit('gm_session_invitation', invitation);
        });

        socket.emit('session_invitation_sent', { memberId, invitationId: invitation.id });

        logger.info('[invite_member_to_session] Session invitation sent', {
          memberId, roomId, invitationId: invitation.id
        });

      } catch (error) {
        logger.error('[invite_member_to_session] Error:', { error: error.message });
      }
    });

    socket.on('invite_to_party', async ({ partyId, fromUserId, toUserId }) => {
      try {
        logger.info('📢 [invite_to_party] Received invite request', { partyId, fromUserId, toUserId, socketId: socket.id });

        const targetUserPartyId = userToParty.get(toUserId);
        if (targetUserPartyId) {
          // Validate the party actually still exists — userToParty can hold stale
          // entries if a party was disbanded without cleanly removing all members.
          const targetUserParty = parties.get(targetUserPartyId);
          if (!targetUserParty) {
            // Stale entry — clean it up and allow the invite to proceed
            logger.warn('📢 [invite_to_party] Cleaning stale userToParty entry for target', { toUserId, stalePartyId: targetUserPartyId });
            userToParty.delete(toUserId);
          } else {
            // Defense-in-depth: verify target user is actually online
            // Stale entries can persist if disconnect cleanup was skipped
            const targetOnlineUser = getOnlineUserById(toUserId);
            if (!targetOnlineUser) {
              // Target user is offline but has party entry - clean up stale entry
              logger.warn('📢 [invite_to_party] Target user has party entry but is offline, cleaning up', { toUserId, stalePartyId: targetUserPartyId });
              userToParty.delete(toUserId);
            } else {
              // Target user is online AND in a party - genuinely cannot invite
              logger.info('📢 [invite_to_party] Target user already in party', { toUserId, existingPartyId: targetUserPartyId });
              socket.emit('party_invite_failed', {
                error: 'User is already in a party',
                toUserId: toUserId
              });
              return;
            }
          }
        }

        let targetPartyId = partyId;

        if (!targetPartyId && fromUserId) {
          targetPartyId = userToParty.get(fromUserId);
          logger.info('📢 [invite_to_party] Resolved partyId from user', { fromUserId, targetPartyId });
        }

        const party = parties.get(targetPartyId);
        if (!party) {
          logger.warn('📢 [invite_to_party] Party not found', { targetPartyId });
          socket.emit('party_error', { error: 'Party not found' });
          return;
        }

        const invitationId = uuidv4();
        const invitation = {
          id: invitationId,
          partyId: targetPartyId,
          fromUserId,
          toUserId,
          createdAt: Date.now(),
          expiresAt: Date.now() + (5 * 60 * 1000)
        };

        partyInvitations.set(invitationId, invitation);

        const targetSocketId = Array.from(onlineSocialUsers.entries())
          .find(([_, user]) => user.userId === toUserId)?.[0];

        if (targetSocketId) {
          const inviterData = onlineSocialUsers.get(socket.id) || {};
          io.to(targetSocketId).emit('party_invitation_received', {
            ...invitation,
            partyName: party.name,
            fromUserName: inviterData.name || 'Unknown',
            senderName: inviterData.name || 'Unknown',
            senderLevel: inviterData.characterLevel || 1,
            senderClass: inviterData.characterClass || 'Unknown',
            fromUserId
          });
          logger.info('📢 [invite_to_party] Invitation delivered', { invitationId, toUserId, targetSocketId });
        } else {
          logger.warn('📢 [invite_to_party] Target user not found in onlineSocialUsers', {
            toUserId,
            onlineUsersCount: onlineSocialUsers.size,
            onlineUserIds: Array.from(onlineSocialUsers.values()).map(u => u.userId).slice(0, 10)
          });
        }

        socket.emit('invitation_sent', { invitationId, toUserId });
        logger.info('📢 [invite_to_party] Invitation sent confirmation emitted', { invitationId, toUserId });

      } catch (error) {
        logger.error('📢 [invite_to_party] Error:', { error: error.message });
      }
    });

  });
}

module.exports = {
  registerSocketHandlers,
  validateMapExists,
  getNextEventSequence,
  ECHO_PREVENTION_WINDOW_MS
};
