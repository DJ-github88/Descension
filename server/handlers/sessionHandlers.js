/**
 * Session Handlers
 *
 * Game session lifecycle and player/room membership transitions:
 * - launch_game_session: GM triggers session start (broadcasts to room)
 * - respond_to_game_session: player accepts/declines session start
 * - respond_to_room_invitation: player accepts/declines GM room invitation
 *   (creates player record on-the-fly if needed, joins socket to room channel)
 * - update_player_color: player color change broadcast to room
 */

function registerSessionHandlers(ctx) {
  const {
    io,
    socket,
    rooms,
    players,
    onlineSocialUsers,
    partyInvitations,
    logger,
    uuidv4
  } = ctx;

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
            deltaSyncCapabilities: require('../services/deltaSyncCapabilities').getDeltaSyncCapabilities(),
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
}

module.exports = { registerSessionHandlers };
