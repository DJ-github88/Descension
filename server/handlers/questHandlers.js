/**
 * Quest Handlers
 *
 * Real-time multiplayer delivery of the GM quest flow. This was the missing
 * server half of the client's quest protocol (see
 * vtt-react/src/components/multiplayer/socketHandlers/questHandlers.js):
 *
 *   Client → server                       Server → client
 *   share_quest                           quest_shared (others), quest_share_confirmed (GM)
 *   quest_accepted / quest_declined       quest_accepted_notification / quest_declined_notification (GM)
 *   quest_complete_request                quest_completion_pending (GM), quest_completion_request_sent (requester)
 *   quest_rewards_delivered               rewards_received (target player), rewards_delivery_confirmed (GM)
 *   quest_completion_denied               completion_denied (target player)
 *
 * Shared/offered quests are ephemeral relays; the client quest store owns the
 * canonical per-player quest list. Room membership (and GM rights for GM-only
 * events) is validated server-side so players cannot forge offers or rewards.
 */

const MAX_QUEST_BYTES = 256 * 1024;

function sanitizeQuest(rawQuest) {
  if (!rawQuest || typeof rawQuest !== 'object') {
    return null;
  }
  try {
    const serialized = JSON.stringify(rawQuest);
    if (serialized.length > MAX_QUEST_BYTES) {
      return null;
    }
  } catch (_e) {
    return null;
  }
  return rawQuest;
}

function registerQuestHandlers(ctx) {
  const {
    socket,
    logger,
    validateRoomMembership,
    emitToUserId
  } = ctx;

  if (!socket) {
    return;
  }

  const now = () => new Date().toISOString();

  // GM shares a quest offer with everyone else in the room.
  socket.on('share_quest', (data) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId, true);
      if (!validation.valid) {
        return;
      }
      const { player, room } = validation;

      const quest = sanitizeQuest(data?.quest);
      if (!quest) {
        logger?.warn?.('[share_quest] rejected: missing/oversized quest');
        return;
      }

      socket.to(room.id).emit('quest_shared', {
        quest,
        sharedBy: { id: player.id, name: player.name },
        timestamp: now()
      });

      socket.emit('quest_share_confirmed', {
        questId: quest.id,
        questTitle: quest.title,
        timestamp: now()
      });

      logger?.debug?.('[share_quest] broadcast', { roomId: room.id, questId: quest.id });
    } catch (error) {
      logger?.error?.('[share_quest] Error:', { error: error.message });
    }
  });

  // Player accepts or declines an offered quest -> notify the GM.
  const relayResponse = (event, gmEvent) => {
    socket.on(event, (data) => {
      try {
        const validation = validateRoomMembership(socket, data?.roomId, false);
        if (!validation.valid) {
          return;
        }
        const { player, room } = validation;

        socket.to(room.id).emit(gmEvent, {
          questId: data?.questId,
          questTitle: data?.questTitle,
          playerId: player.id,
          playerName: player.name,
          timestamp: now()
        });
      } catch (error) {
        logger?.error?.(`[${event}] Error:`, { error: error.message });
      }
    });
  };

  relayResponse('quest_accepted', 'quest_accepted_notification');
  relayResponse('quest_declined', 'quest_declined_notification');

  // Player asks the GM to approve completion.
  socket.on('quest_complete_request', (data) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId, false);
      if (!validation.valid) {
        return;
      }
      const { player, room } = validation;

      const quest = sanitizeQuest(data?.quest);
      if (!quest) {
        logger?.warn?.('[quest_complete_request] rejected: missing/oversized quest');
        return;
      }

      socket.to(room.id).emit('quest_completion_pending', {
        quest,
        playerId: player.id,
        playerName: player.name,
        timestamp: now()
      });

      socket.emit('quest_completion_request_sent', {
        questId: quest.id,
        questTitle: quest.title,
        timestamp: now()
      });
    } catch (error) {
      logger?.error?.('[quest_complete_request] Error:', { error: error.message });
    }
  });

  // GM delivers rewards to one player (targeted) and gets a confirmation.
  socket.on('quest_rewards_delivered', (data) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId, true);
      if (!validation.valid) {
        return;
      }
      const { player, room } = validation;

      const targetPlayerId = data?.playerId;
      if (!targetPlayerId) {
        return;
      }

      emitToUserId(targetPlayerId, 'rewards_received', {
        questId: data?.questId,
        questTitle: data?.questTitle,
        rewards: data?.rewards || {},
        deliveredBy: player.name,
        timestamp: now()
      });

      socket.emit('rewards_delivery_confirmed', {
        questId: data?.questId,
        playerId: targetPlayerId,
        playerName: data?.playerName,
        timestamp: now()
      });

      logger?.debug?.('[quest_rewards_delivered] delivered', {
        roomId: room.id,
        questId: data?.questId,
        targetPlayerId
      });
    } catch (error) {
      logger?.error?.('[quest_rewards_delivered] Error:', { error: error.message });
    }
  });

  // GM denies a completion request (targeted to the requesting player).
  socket.on('quest_completion_denied', (data) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId, true);
      if (!validation.valid) {
        return;
      }
      const { player } = validation;

      const targetPlayerId = data?.playerId;
      if (!targetPlayerId) {
        return;
      }

      emitToUserId(targetPlayerId, 'completion_denied', {
        questId: data?.questId,
        questTitle: data?.questTitle,
        reason: data?.reason || '',
        deniedBy: player.name,
        timestamp: now()
      });
    } catch (error) {
      logger?.error?.('[quest_completion_denied] Error:', { error: error.message });
    }
  });
}

module.exports = { registerQuestHandlers };
