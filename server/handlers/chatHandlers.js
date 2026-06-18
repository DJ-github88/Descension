/**
 * Chat Handlers
 *
 * In-game and global chat:
 * - chat_message: per-room chat (sender must be a player in the room)
 * - global_chat_message: server-wide chat (requires auth; players OR social users)
 * - whisper_message: private 1:1 message (requires auth; broadcasts to all of recipient's sockets)
 */

function registerChatHandlers(ctx) {
  const {
    io,
    socket,
    rooms,
    players,
    onlineSocialUsers,
    logger,
    uuidv4,
    sanitizeChatMessage,
    requireAuth,
    chatDebug,
    getSocketsByUserId,
    emitToUserId
  } = ctx;

  socket.on('chat_message', async (data) => {
    try {
      const player = players.get(socket.id);
      if (!player) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      const sanitizedMessage = sanitizeChatMessage(data.message);
      if (!sanitizedMessage) return;

      const chatMessage = {
        id: data.id || data.messageId || uuidv4(),
        messageId: data.messageId || data.id || uuidv4(),
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

  socket.on('global_chat_message', requireAuth((data) => {
    try {
      const player = players.get(socket.id);
      const socialUser = onlineSocialUsers.get(socket.id);

      if (!player && !socialUser) return;

      const rawContent = data.content || data.message || '';
      const sanitizedMessage = sanitizeChatMessage(rawContent);
      if (!sanitizedMessage) return;

      let senderId, senderName;
      if (player) {
        senderId = player.id;
        senderName = player.name;
      } else {
        senderId = socialUser.userId;
        senderName = socialUser.name;
      }

      const chatMessage = {
        id: data.id || uuidv4(),
        messageId: data.messageId || data.id || uuidv4(),
        senderId,
        senderName,
        senderClass: data.senderClass,
        senderLevel: data.senderLevel,
        isGuest: data.isGuest || false,
        content: sanitizedMessage,
        type: 'message',
        timestamp: new Date().toISOString()
      };

      io.emit('global_chat_message', chatMessage);

    } catch (error) {
      logger.error('[global_chat_message] Error:', { error: error.message });
    }
  }));

  socket.on('whisper_message', requireAuth((data) => {
    try {
      // Allow whispers from both game room players AND social users
      const player = players.get(socket.id);
      const socialUser = onlineSocialUsers.get(socket.id);

      // Must be either a player in a room OR a social user
      if (!player && !socialUser) {
        logger.warn('[whisper_message] Sender not found in players or onlineSocialUsers', { socketId: socket.id });
        return;
      }

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
        senderSocketId: socket.id,
        recipientId,
        recipientName: data.recipientName || 'Unknown',
        content: sanitizedContent,
        timestamp: Date.now(),
        type: 'whisper'
      };

      logger.info('[whisper_message] Sending whisper', {
        from: userId,
        to: recipientId
      });

      // Emit to REDIRECT recipient - broadcast to all their active sockets
      emitToUserId(recipientId, 'whisper_received', {
        ...whisperMessage,
        type: 'whisper_received'
      });

      // Emit confirmation to SENDER - broadcast to all their active sockets for sync
      emitToUserId(userId, 'whisper_sent', {
        ...whisperMessage,
        isSent: true,
        type: 'whisper_sent',
        targetName: data.recipientName || 'Unknown'
      });

    } catch (error) {
      logger.error('[whisper_message] Error:', { error: error.message });
    }
  }));
}

module.exports = { registerChatHandlers };
