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
          currentMapId: room.gameState.defaultMapId || 'default'
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
            currentMapId: player.currentMapId
          },
          playerCount: room.players.size + 1
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
        playerName: player.name
      });

      // Update room list
      io.emit('room_list', getPublicRooms());

      logger.info('[leave_room] Player left room', { playerId: player.id, roomId: player.roomId });
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

      const player = players.get(socket.id);
      if (!player) {
        logger.debug('[disconnect] Unknown room player disconnected', {
          socketId: socket.id,
          hadSocialPresence: !!socialPresence
        });
        return;
      }

      const room = rooms.get(player.roomId);
      if (room) {
        if (player.isGM) {
          // GM disconnected - mark room as inactive but don't delete
          room.isActive = false;
          room.gmDisconnectedAt = new Date();
          logger.info('[disconnect] GM disconnected, room marked inactive', { roomId: room.id });
        } else {
          // Regular player disconnected
          room.players.delete(player.id);
          if (room.gameState.playerMapAssignments) {
            delete room.gameState.playerMapAssignments[player.id];
          }
          socket.to(player.roomId).emit('player_left', {
            playerId: player.id,
            playerName: player.name
          });
        }
      }

      players.delete(socket.id);
      logger.info('[disconnect] Player disconnected', { socketId: socket.id, playerId: player.id });

      // Update room list
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

        // Broadcast to all players in room
        io.to(data.roomId).emit('token_created', {
          token,
          mapId,
          createdBy: socket.id,
          sequence: getNextEventSequence()
        });

        // Queue Firebase update
        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

        logger.debug('[token_created] Token created', { tokenId, mapId, roomId: data.roomId });

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
        movementDebouncer.queueMove(data.roomId, data.tokenId, {
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

        if (map.tokens[data.tokenId]) {
          map.tokens[data.tokenId] = {
            ...map.tokens[data.tokenId],
            ...data.updates,
            updatedAt: Date.now()
          };

          io.to(data.roomId).emit('token_updated', {
            tokenId: data.tokenId,
            updates: data.updates,
            mapId,
            updatedBy: socket.id,
            sequence: getNextEventSequence()
          });

          firebaseBatchWriter.queueWrite(data.roomId, room.gameState);
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
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        const tokenId = data.token.id || uuidv4();
        const token = {
          ...data.token,
          id: tokenId,
          createdBy: socket.id,
          createdAt: Date.now()
        };

        map.characterTokens[tokenId] = token;
        room.gameState.characterTokens[tokenId] = token; // Legacy support

        io.to(data.roomId).emit('character_token_created', {
          token,
          mapId,
          createdBy: socket.id,
          sequence: getNextEventSequence()
        });

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

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

        io.to(data.roomId).emit('token_removed', {
          tokenId: data.tokenId,
          mapId,
          removedBy: socket.id,
          sequence: getNextEventSequence()
        });

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

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

        io.to(data.roomId).emit('character_token_removed', {
          tokenId: data.tokenId,
          mapId,
          removedBy: socket.id,
          sequence: getNextEventSequence()
        });

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

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

        // Broadcast movement to room
        socket.to(data.roomId).emit('character_moved', {
          playerId: player.id,
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
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room, player } = validation;

        // Update player character data
        if (data.character) {
          player.character = {
            ...player.character,
            ...data.character,
            lastUpdated: Date.now()
          };

          // Update in room's players map
          room.players.set(player.id, player);
        }

        // Broadcast to room
        socket.to(data.roomId).emit('character_updated', {
          playerId: player.id,
          character: player.character,
          updatedBy: socket.id,
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
        if (data.environmentalObjects) map.environmentalObjects = data.environmentalObjects;
        if (data.drawingPaths) map.drawingPaths = data.drawingPaths;
        if (data.drawingLayers) map.drawingLayers = data.drawingLayers;
        if (data.fogOfWarData) map.fogOfWarData = data.fogOfWarData;
        if (data.fogOfWarPaths) map.fogOfWarPaths = data.fogOfWarPaths;
        if (data.lightSources) map.lightSources = data.lightSources;
        if (data.dndElements) map.dndElements = data.dndElements;

        // Broadcast to room
        socket.to(data.roomId).emit('level_editor_state_synced', {
          mapId,
          state: {
            terrainData: map.terrainData,
            wallData: map.wallData,
            environmentalObjects: map.environmentalObjects,
            drawingPaths: map.drawingPaths,
            fogOfWarData: map.fogOfWarData,
            lightSources: map.lightSources,
            dndElements: map.dndElements
          },
          sequence: getNextEventSequence()
        });

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

      } catch (error) {
        logger.error('[sync_level_editor_state] Error:', { error: error.message });
      }
    });

    socket.on('map_update', async (data) => {
      try {
        const validation = validateRoomMembership(socket, data.roomId);
        if (!validation.valid) return;

        const { room } = validation;

        // Handle map creation/updates
        if (data.action === 'create' && data.map) {
          const mapId = data.map.id || uuidv4();
          validateMapExists(room, mapId, data.map.name);

          io.to(data.roomId).emit('map_update', {
            action: 'create',
            map: { id: mapId, ...data.map },
            createdBy: socket.id
          });
        } else if (data.action === 'delete' && data.mapId) {
          if (room.gameState.maps && room.gameState.maps[data.mapId]) {
            delete room.gameState.maps[data.mapId];
          }

          io.to(data.roomId).emit('map_update', {
            action: 'delete',
            mapId: data.mapId,
            deletedBy: socket.id
          });
        }

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

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
        const mapId = data.mapId || room.gameState.defaultMapId || 'default';
        const map = validateMapExists(room, mapId);

        if (data.action === 'add' && data.item) {
          const itemId = data.item.id || uuidv4();
          map.gridItems[itemId] = { ...data.item, id: itemId };

          io.to(data.roomId).emit('grid_item_update', {
            action: 'add',
            item: map.gridItems[itemId],
            mapId,
            addedBy: socket.id
          });
        } else if (data.action === 'update' && data.itemId && data.updates) {
          if (map.gridItems[data.itemId]) {
            map.gridItems[data.itemId] = {
              ...map.gridItems[data.itemId],
              ...data.updates
            };

            io.to(data.roomId).emit('grid_item_update', {
              action: 'update',
              itemId: data.itemId,
              updates: data.updates,
              mapId,
              updatedBy: socket.id
            });
          }
        } else if (data.action === 'remove' && data.itemId) {
          delete map.gridItems[data.itemId];

          io.to(data.roomId).emit('grid_item_update', {
            action: 'remove',
            itemId: data.itemId,
            mapId,
            removedBy: socket.id
          });
        }

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

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

        const { player } = validation;

        // Toggle GM view mode
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
        const validation = validateRoomMembership(socket, data.roomId, true);
        if (!validation.valid) return;

        const { room } = validation;

        const targetPlayer = room.players.get(data.playerId);
        if (!targetPlayer) return;

        // Transfer player to different map
        if (data.targetMapId) {
          targetPlayer.currentMapId = data.targetMapId;
          if (room.gameState.playerMapAssignments) {
            room.gameState.playerMapAssignments[data.playerId] = data.targetMapId;
          }

          // Notify player
          io.to(targetPlayer.socketId).emit('forced_map_transfer', {
            mapId: data.targetMapId,
            reason: data.reason || 'GM transferred you'
          });
        }

      } catch (error) {
        logger.error('[gm_transfer_player] Error:', { error: error.message });
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

        // Broadcast loot to room
        io.to(data.roomId).emit('item_looted', {
          itemId: data.itemId,
          playerId: data.playerId,
          quantity: data.quantity,
          lootedBy: socket.id
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

        if (map.creatures && map.creatures[data.creatureId]) {
          map.creatures[data.creatureId] = {
            ...map.creatures[data.creatureId],
            ...data.updates
          };

          io.to(data.roomId).emit('creature_updated', {
            creatureId: data.creatureId,
            updates: data.updates,
            mapId,
            updatedBy: socket.id
          });

          firebaseBatchWriter.queueWrite(data.roomId, room.gameState);
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
            playerCount: room.players.size
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

        if (!userId) return;

        const partyId = userToParty.get(userId);
        if (!partyId) return;

        const party = parties.get(partyId);
        if (!party) return;

        // Remove member
        delete party.members[userId];
        userToParty.delete(userId);

        // If party is empty or leader left, disband
        const remainingMemberIds = Object.keys(party.members);
        if (remainingMemberIds.length === 0 || party.leaderId === userId) {
          remainingMemberIds.forEach(memberId => {
            userToParty.delete(memberId);
            const memberSockets = getSocketsByUserId(memberId);
            memberSockets.forEach(s => s.emit('party_disbanded', { partyId }));
          });
          parties.delete(partyId);
        } else {
          // Notify remaining members
          remainingMemberIds.forEach(memberId => {
            const memberSockets = getSocketsByUserId(memberId);
            memberSockets.forEach(s => s.emit('party_member_left', {
              memberId: userId,
              memberName: userName
            }));
          });
        }

        socket.emit('party_left', { partyId });

        logger.info('[leave_party] Player left party', { playerId: userId, partyId });

      } catch (error) {
        logger.error('[leave_party] Error:', { error: error.message });
      }
    });

    socket.on('register_presence', (data) => {
      try {
        let userId = socket.data.userId;
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
            // Try to use direct data from client if authenticated context is missing
            // This is risky but allows minimal functionality
            // console.warn('Registering presence without userId on socket');
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

    socket.on('invite_to_party', async ({ partyId, fromUserId, toUserId }) => {
      try {
        let targetPartyId = partyId;

        // Resolve partyId from user if not provided (client sends null)
        if (!targetPartyId && fromUserId) {
          targetPartyId = userToParty.get(fromUserId);
          logger.info('[invite_to_party] Resolved partyId from user', { fromUserId, targetPartyId });
        }

        const party = parties.get(targetPartyId);
        if (!party) {
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
          expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
        };

        partyInvitations.set(invitationId, invitation);

        // Find target user's socket
        const targetSocketId = Array.from(onlineSocialUsers.entries())
          .find(([_, user]) => user.userId === toUserId)?.[0];

        if (targetSocketId) {
          const inviterData = onlineSocialUsers.get(socket.id) || {};
          io.to(targetSocketId).emit('party_invitation_received', {
            ...invitation,
            partyName: party.name,
            fromUserName: inviterData.name || 'Unknown',
            senderName: inviterData.name || 'Unknown', // FIX: Match client expectation
            senderLevel: inviterData.characterLevel || 1, // FIX: Match client expectation
            senderClass: inviterData.characterClass || 'Unknown', // FIX: Match client expectation
            fromUserId
          });
        }

        socket.emit('invitation_sent', { invitationId, toUserId });

        logger.info('[invite_to_party] Invitation sent', { invitationId, toUserId });

      } catch (error) {
        logger.error('[invite_to_party] Error:', { error: error.message });
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

        partyInvitations.delete(invitationId);

        // Notify inviter
        const inviterSockets = getSocketsByUserId(invitation.fromUserId);
        inviterSockets.forEach(s => s.emit('invitation_declined', { invitationId }));

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

  });
}

module.exports = {
  registerSocketHandlers,
  validateMapExists,
  getNextEventSequence,
  ECHO_PREVENTION_WINDOW_MS
};
