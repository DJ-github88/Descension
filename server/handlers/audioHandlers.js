/**
 * Audio/Jukebox Handlers
 *
 * GM-controlled in-game audio (tracks persisted on room.gameState.audioState):
 * - audio_broadcast: GM plays tracks (targeted or room-wide)
 * - audio_stop: GM stops specific tracks
 * - audio_stop_all: GM stops all tracks
 * - audio_sync_request: any player requests current audio state (with elapsed time)
 */

function registerAudioHandlers(ctx) {
  const {
    io,
    socket,
    rooms,
    players,
    logger,
    firebaseBatchWriter
  } = ctx;

  socket.on('audio_broadcast', (data) => {
    try {
      if (!socket.data.authenticated) {
        socket.emit('auth_error', { error: 'Authentication required' });
        return;
      }

      const player = players.get(socket.id);
      if (!player || !player.roomId) {
        socket.emit('audio_error', { error: 'Not in a room' });
        return;
      }

      const room = rooms.get(player.roomId);
      if (!room) {
        socket.emit('audio_error', { error: 'Room not found' });
        return;
      }

      if (room.gm && room.gm.socketId !== socket.id) {
        socket.emit('audio_error', { error: 'Only the GM can broadcast audio' });
        return;
      }

      if (!data.tracks || !Array.isArray(data.tracks) || data.tracks.length === 0) {
        socket.emit('audio_error', { error: 'No tracks provided' });
        return;
      }

      const broadcastData = {
        tracks: data.tracks,
        fromSocketId: socket.id,
        timestamp: data.timestamp || Date.now()
      };

      if (data.targetPlayers && Array.isArray(data.targetPlayers) && data.targetPlayers.length > 0) {
        const targetSockets = new Set(data.targetPlayers);

        if (room.gm && room.gm.socketId) {
          targetSockets.add(room.gm.socketId);
        }

        for (const [sid, p] of players.entries()) {
          if (p.roomId === player.roomId && targetSockets.has(sid)) {
            io.to(sid).emit('audio_broadcast_received', broadcastData);
          }
        }
      } else {
        io.to(player.roomId).emit('audio_broadcast_received', broadcastData);
      }

      if (!room.gameState.audioState) {
        room.gameState.audioState = { playingTracks: [] };
      }

      for (const track of data.tracks) {
        const existing = room.gameState.audioState.playingTracks.findIndex(t => t.trackId === track.trackId);
        const entry = {
          trackId: track.trackId,
          name: track.name,
          type: track.type,
          url: track.url,
          youtubeId: track.youtubeId,
          volume: track.volume,
          loop: track.loop,
          startedAt: Date.now()
        };
        if (existing >= 0) {
          room.gameState.audioState.playingTracks[existing] = entry;
        } else {
          room.gameState.audioState.playingTracks.push(entry);
        }
      }

      logger.info('Audio broadcast', { roomId: player.roomId, trackCount: data.tracks.length });

      if (room.isPermanent) {
        firebaseBatchWriter.queueWrite(player.roomId, room.gameState);
      }
    } catch (error) {
      logger.error('Error in audio_broadcast:', { error: error.message });
      socket.emit('audio_error', { error: 'Failed to broadcast audio' });
    }
  });

  socket.on('audio_stop', (data) => {
    try {
      if (!socket.data.authenticated) {
        socket.emit('auth_error', { error: 'Authentication required' });
        return;
      }

      const player = players.get(socket.id);
      if (!player || !player.roomId) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      if (room.gm && room.gm.socketId !== socket.id) return;

      const stopData = {
        trackIds: data.trackIds,
        timestamp: data.timestamp || Date.now()
      };

      if (data.targetPlayers && Array.isArray(data.targetPlayers) && data.targetPlayers.length > 0) {
        const targetSockets = new Set(data.targetPlayers);
        for (const [sid, p] of players.entries()) {
          if (p.roomId === player.roomId && targetSockets.has(sid)) {
            io.to(sid).emit('audio_stop_received', stopData);
          }
        }
      } else {
        io.to(player.roomId).emit('audio_stop_received', stopData);
      }

      if (room.gameState.audioState && data.trackIds) {
        room.gameState.audioState.playingTracks = room.gameState.audioState.playingTracks.filter(
          t => !data.trackIds.includes(t.trackId)
        );
      }

      if (room.isPermanent) {
        firebaseBatchWriter.queueWrite(player.roomId, room.gameState);
      }
    } catch (error) {
      logger.error('Error in audio_stop:', { error: error.message });
    }
  });

  socket.on('audio_stop_all', (data) => {
    try {
      if (!socket.data.authenticated) {
        socket.emit('auth_error', { error: 'Authentication required' });
        return;
      }

      const player = players.get(socket.id);
      if (!player || !player.roomId) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      if (room.gm && room.gm.socketId !== socket.id) return;

      if (data && data.targetPlayers && Array.isArray(data.targetPlayers) && data.targetPlayers.length > 0) {
        const targetSockets = new Set(data.targetPlayers);
        for (const [sid, p] of players.entries()) {
          if (p.roomId === player.roomId && targetSockets.has(sid)) {
            io.to(sid).emit('audio_stop_all_received', {});
          }
        }
      } else {
        io.to(player.roomId).emit('audio_stop_all_received', {});
      }

      if (room.gameState.audioState) {
        room.gameState.audioState.playingTracks = [];
      }

      if (room.isPermanent) {
        firebaseBatchWriter.queueWrite(player.roomId, room.gameState);
      }
    } catch (error) {
      logger.error('Error in audio_stop_all:', { error: error.message });
    }
  });

  socket.on('audio_sync_request', (data) => {
    try {
      const player = players.get(socket.id);
      if (!player || !player.roomId) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      const audioState = room.gameState.audioState || { playingTracks: [] };

      const syncTracks = audioState.playingTracks.map(t => {
        const elapsed = (Date.now() - (t.startedAt || Date.now())) / 1000;
        return {
          trackId: t.trackId,
          name: t.name,
          type: t.type,
          url: t.url,
          youtubeId: t.youtubeId,
          volume: t.volume,
          loop: t.loop,
          elapsed: elapsed,
          thumbnail: t.thumbnail || null
        };
      });

      socket.emit('audio_sync_state', { tracks: syncTracks });
    } catch (error) {
      logger.error('Error in audio_sync_request:', { error: error.message });
    }
  });
}

module.exports = { registerAudioHandlers };
