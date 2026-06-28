/**
 * Room Management Handlers
 *
 * Room lifecycle (creation, joining, leaving, disconnect):
 * - create_room: GM creates or resumes a permanent/temporary room
 *   (handles tier check, Firestore resume, party notification)
 * - join_room: player or GM-reclaim joins a room (password verify, tier check)
 * - leave_room: explicit leave (GM marks room inactive; player removed)
 * - disconnect: socket disconnect cleanup (social presence, party leave, room state)
 */

const { getDeltaSyncCapabilities } = require('../services/deltaSyncCapabilities');

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
    canJoinRoom,
    requireAuth,
    createRoom,
    verifyPassword,
    getPublicRooms,
    mergeRoomGameStateForResume,
    notifyPartyMembersOfGMJoin,
    handlePartyLeave
  } = ctx;

  socket.on('create_room', requireAuth(async (data) => {
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

      if (!isPermanentRoomResume) {
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
          logger.info('[create_room] Attempting to resume permanent room from Firestore', {
            firestoreRoomId,
            gmName: data.gmName,
            gmId: socket.data.userId
          });

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
            logger.error('[create_room] Failed to create room object from Firestore data', { firestoreRoomId });
            throw new Error('Failed to create room from Firestore data');
          }

          logger.info('[create_room] Permanent room created from Firestore data', {
            roomId: room.id,
            roomName: room.name,
            isPermanent: room.isPermanent
          });

          if (data.gameState && typeof data.gameState === 'object') {
            room.gameState = mergeRoomGameStateForResume(room.gameState, data.gameState);
            logger.info('[create_room] Merged game state from resume data', {
              hasGameState: !!room.gameState,
              keys: Object.keys(data.gameState)
            });
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

        if (room && data.description) {
          if (!room.settings) room.settings = {};
          room.settings.description = data.description;
          logger.info('[create_room] Added description to temporary room', { description: data.description });
        }

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
        gm: room.gm,
        players: room.players,
        settings: room.settings,
        persistentRoomId: room.persistentRoomId,
        isPermanent: room.isPermanent,
        gameState: room.gameState,
        deltaSyncCapabilities: getDeltaSyncCapabilities(),
        createdAt: room.createdAt
      };

      socket.emit('room_created', { room: roomForEmission });
      logger.info('[create_room] Room created successfully', { roomId: room.id, roomName: room.name });

      socket.emit('room_joined', {
        room: roomForEmission,
        player: roomForEmission.gm,
        isGM: true,
        isGMReconnect: false
      });
      logger.info('[create_room] Emitted room_joined for GM', { roomId: room.id });

      io.emit('room_list', getPublicRooms());

      let gmUserId = data.userId || socket.data?.userId || data.character?.userId;

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
          characterLevel: data.character?.level,
          description: data.description || room.settings?.description
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
  }));

  socket.on('join_room', requireAuth(async (data) => {
    try {
      const { roomId, playerName, password, playerColor, character } = data;

      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('room_error', { error: 'Room not found' });
        return;
      }

      const passwordValid = await verifyPassword(password, room.passwordHash);
      if (!passwordValid) {
        socket.emit('room_error', { error: 'Invalid password' });
        return;
      }

      const joiningUserId = socket.data?.userId || data.userId || null;
      const isGMReclaim = room.gmId && joiningUserId && room.gmId === joiningUserId;

      const isPlayerReclaim = !isGMReclaim && joiningUserId
        && room.disconnectedPlayers && room.disconnectedPlayers[joiningUserId];

      let playerId;
      if (isPlayerReclaim) {
        playerId = room.disconnectedPlayers[joiningUserId].playerId;
        delete room.disconnectedPlayers[joiningUserId];
      } else {
        playerId = uuidv4();
      }

      if (!isGMReclaim && !isPlayerReclaim && joiningUserId) {
        const currentPlayers = Object.values(room.players || {}).filter(p => !p.isGM).length;
        const tierCheck = await canJoinRoom(joiningUserId, currentPlayers, room.maxPlayers);
        if (!tierCheck.allowed) {
          logger.info('[join_room] Tier check failed', { joiningUserId, reason: tierCheck.reason });
          socket.emit('room_error', { error: tierCheck.reason });
          return;
        }
      }

      const player = {
        id: playerId,
        name: sanitizePlayerName(playerName) || 'Player',
        socketId: socket.id,
        roomId: roomId,
        isGM: isGMReclaim,
        color: playerColor || (isGMReclaim ? '#d4af37' : '#4a90e2'),
        character: character || null,
        currentMapId: room.gameState.defaultMapId || 'default',
        userId: joiningUserId
      };

      if (isGMReclaim) {
        room.gm = {
          id: playerId,
          name: sanitizePlayerName(playerName) || 'GM',
          socketId: socket.id,
          isGM: true,
          color: playerColor || '#d4af37',
          character: character || null,
          userId: joiningUserId
        };
        room.isActive = true;
        room.gmDisconnectedAt = null;

        logger.info('[join_room] GM reclaimed room', { roomId, gmId: playerId, userId: joiningUserId });
      } else {
        room.players.set(playerId, player);
      }

      players.set(socket.id, player);

      if (!room.gameState.playerMapAssignments) {
        room.gameState.playerMapAssignments = {};
      }
      room.gameState.playerMapAssignments[playerId] = player.currentMapId;

      socket.join(roomId);

      const roomForEmission = {
        id: room.id,
        name: room.name,
        gm: room.gm,
        players: Array.from(room.players.values()),
        settings: room.settings,
        gameState: room.gameState,
        deltaSyncCapabilities: getDeltaSyncCapabilities(),
        persistentRoomId: room.persistentRoomId
      };

      socket.emit('room_joined', {
        room: roomForEmission,
        player: player,
        isGM: isGMReclaim,
        isGMReconnect: isGMReclaim
      });

      if (isGMReclaim) {
        socket.to(roomId).emit('gm_reconnected', {
          gmName: player.name,
          gmId: playerId,
          roomId
        });
      } else {
        socket.to(roomId).emit('player_joined', {
          player: {
            id: player.id,
            name: player.name,
            character: player.character,
            currentMapId: player.currentMapId,
            userId: player.userId || null
          },
          playerCount: room.players.size + (room.gm && room.players.has(room.gm.id) ? 0 : 1)
        });
      }

      io.emit('room_list', getPublicRooms());

      logger.info('[join_room] Player joined room', { playerId, playerName, roomId, isGM: isGMReclaim });

    } catch (error) {
      logger.error('[join_room] Error joining room:', { error: error.message });
      socket.emit('room_error', { error: error.message });
    }
  }));

  socket.on('leave_room', (ackCallback) => {
    const player = players.get(socket.id);
    if (!player) {
      if (typeof ackCallback === 'function') ackCallback();
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) return;

    const roomId = player.roomId;

    room.players.delete(player.id);
    players.delete(socket.id);

    if (room.gameState.playerMapAssignments) {
      delete room.gameState.playerMapAssignments[player.id];
    }

    socket.leave(roomId);

    if (player.isGM) {
      room.isActive = false;
      room.gmDisconnectedAt = new Date();

      socket.to(roomId).emit('gm_disconnected', {
        gmName: player.name,
        gmId: player.id,
        roomId
      });

      logger.info('[leave_room] GM left room, room marked inactive', { roomId, gmId: player.id });
    } else {
      socket.to(roomId).emit('player_left', {
        playerId: player.id,
        playerName: player.name,
        playerCount: room.players.size + (room.gm && room.players.has(room.gm.id) ? 0 : 1)
      });
    }

    io.emit('room_list', getPublicRooms());

    logger.info('[leave_room] Player left room', { playerId: player.id, roomId, isGM: player.isGM });

    if (typeof ackCallback === 'function') ackCallback();
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
      if (player.isGM) {
        room.isActive = false;
        room.gmDisconnectedAt = new Date();
        logger.info('[disconnect] GM disconnected, room marked inactive', { roomId: room.id, userId });

        socket.to(player.roomId).emit('gm_disconnected', {
          gmName: player.name,
          gmId: userId,
          roomId: room.id
        });
      } else {
        if (player.userId) {
          if (!room.disconnectedPlayers) room.disconnectedPlayers = {};
          room.disconnectedPlayers[player.userId] = {
            playerId: player.id,
            playerName: player.name,
            disconnectedAt: Date.now()
          };
        }
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

    players.delete(socket.id);
    logger.info('[disconnect] Player disconnected', { socketId: socket.id, playerId: player.id, userId });

    io.emit('room_list', getPublicRooms());
  });
}

module.exports = { registerRoomHandlers };
