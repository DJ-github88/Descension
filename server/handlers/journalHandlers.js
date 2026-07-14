/**
 * Journal / "Show to Players" Handlers
 *
 * Real-time multiplayer delivery of journal content shared by a GM.
 * - journal_show_to_players: GM-only broadcast of a knowledge/display payload
 *   to everyone else in the room. Powers shareableStore.showToPlayers().
 *
 * Persistence of journal data itself is per-user via Firebase
 * (users/{uid}/journal/main) and is NOT routed through the socket; only the
 * ephemeral "show to players" delivery and permanent knowledge hand-off happen here.
 *
 * Pattern: GM validates membership -> broadcast to room (excluding sender).
 */

function registerJournalHandlers(ctx) {
  const {
    socket,
    logger,
    validateRoomMembership
  } = ctx;

  // GM shares journal content with the room (display popup + player knowledge entry)
  socket.on('journal_show_to_players', (data) => {
    try {
      if (!data || !data.knowledge || typeof data.knowledge !== 'object') {
        logger?.warn?.('[journal_show_to_players] rejected: missing knowledge payload');
        return;
      }

      // GM-only authorization
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {
        logger?.warn?.('[journal_show_to_players] rejected', { error: validation.error });
        return;
      }

      const knowledge = data.knowledge;

      // Defensive size/structure guard (avoid oversized payloads)
      try {
        const serialized = JSON.stringify(knowledge);
        if (serialized.length > 512 * 1024) {
          logger?.warn?.('[journal_show_to_players] rejected: payload too large', { size: serialized.length });
          return;
        }
      } catch (_e) {
        logger?.warn?.('[journal_show_to_players] rejected: unserializable payload');
        return;
      }

      // Broadcast to everyone in the room EXCEPT the sender (GM already applied it locally).
      // This matches the fog_update / drawing_update "skip sender" pattern.
      socket.to(validation.room.id).emit('journal_show_to_players', {
        knowledge,
        senderSocketId: socket.id,
        roomId: validation.room.id
      });

      logger?.debug?.('[journal_show_to_players] broadcast', {
        roomId: validation.room.id,
        knowledgeId: knowledge.id
      });
    } catch (error) {
      logger?.error?.('[journal_show_to_players] Error:', { error: error.message });
    }
  });
}

module.exports = { registerJournalHandlers };
