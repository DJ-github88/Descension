import usePartyStore from '../../../store/partyStore';
import usePresenceStore from '../../../store/presenceStore';

const CHAT_DEBUG = process.env.NODE_ENV === 'development' || process.env.REACT_APP_CHAT_DEBUG === 'true';
const chatDebug = (...args) => {
  if (CHAT_DEBUG) {
    console.log(...args);
  }
};

export function registerChatHandlers(ctx) {
  const {
    socket,
    currentPlayerRef,
    addNotification
  } = ctx;
    if (!socket) return;

    // Listen for chat messages (Party Chat)
    socket.on('chat_message', (message) => {
      if (!message) return;

      // CRITICAL: Skip self-echo since we append optimistically in TabbedChat
      const senderIdFromMsg = message.sender?.id || message.playerId || message.senderId;
      const isFromUs = senderIdFromMsg === socket.id || (currentPlayerRef.current && senderIdFromMsg === currentPlayerRef.current.id);

      if (isFromUs) {
        chatDebug('ðŸ’¬ Skipping self-echo for party chat message in MultiplayerApp');
        return;
      }

      chatDebug('ðŸ’¬ [socket:chat_message] inbound', {
        id: message?.id,
        messageId: message?.messageId,
        senderId: message?.senderId,
        playerId: message?.playerId,
        type: message?.type,
        hasContent: !!(message?.content || message?.message)
      });

      const resolvedSenderId = message.sender?.id || message.playerId || message.senderId || message.userId || message.socketId || null;
      const resolvedSenderName = message.sender?.name || message.playerName || message.senderName || message.characterName || 'Unknown';
      const resolvedTimestamp = message.timestamp || message.serverTimestamp || new Date().toISOString();
      const resolvedContent = message.content || message.message || '';
      const matchedPartyMember = usePartyStore.getState().partyMembers.find((member) =>
        member?.id === resolvedSenderId ||
        member?.socketId === resolvedSenderId ||
        (resolvedSenderName && member?.name === resolvedSenderName)
      );
      const normalizedSenderId = matchedPartyMember?.id || resolvedSenderId || 'unknown_party_sender';
      const normalizedMessageId =
        message?.id ||
        message?.messageId ||
        message?.clientMessageId ||
        `${normalizedSenderId}:${resolvedTimestamp}:${resolvedContent}`;

      if (!resolvedContent) {
        console.warn('âš ï¸ Dropping empty party chat payload from socket:', message);
        return;
      }

      const presenceStore = usePresenceStore.getState();
      const beforeCount = presenceStore.partyChatMessages.length;
      const normalizedPartyType =
        message?.type === 'party' ||
          message?.type === 'chat' ||
          message?.type === 'message'
          ? 'party'
          : 'party';

      // Add to notifications
      addNotification('social', {
        sender: {
          name: resolvedSenderName,
          class: message?.isGM ? 'GM' : 'Player',
          level: 1,
          playerColor: message?.playerColor || (message?.isGM ? '#d4af37' : '#4a90e2')
        },
        content: resolvedContent,
        type: 'message',
        timestamp: resolvedTimestamp,
        playerId: normalizedSenderId,
        isGM: message?.isGM
      });

      // Add to presence store party chat (always, once non-empty and normalized)
      presenceStore.addPartyChatMessage({
        id: normalizedMessageId,
        messageId: message?.messageId || normalizedMessageId,
        senderId: normalizedSenderId,
        playerId: normalizedSenderId,
        senderName: resolvedSenderName,
        playerName: resolvedSenderName,
        senderClass: message?.isGM ? 'GM' : 'Player',
        senderLevel: 1,
        content: resolvedContent,
        timestamp: resolvedTimestamp,
        type: normalizedPartyType
      });

      const afterCount = usePresenceStore.getState().partyChatMessages.length;
      chatDebug('ðŸ’¬ [socket:chat_message] appended', {
        normalizedMessageId,
        normalizedSenderId,
        beforeCount,
        afterCount,
        delta: afterCount - beforeCount
      });
    });

    // Whisper received in room combat/state
    socket.on('whisper_received', (message) => {
      chatDebug('ðŸ’¬ [socket:whisper_received] in room', message);
      const presenceStore = usePresenceStore.getState();
      presenceStore.addWhisperMessage(message.senderId, {
        ...message,
        type: 'whisper_received'
      });
    });

    // Whisper sent confirmation in room combat/state
    socket.on('whisper_sent', (message) => {
      chatDebug('ðŸ’¬ [socket:whisper_sent] in room', message);
      const presenceStore = usePresenceStore.getState();
      presenceStore.addWhisperMessage(message.recipientId, {
        ...message,
        type: 'whisper_sent'
      });
    });

    // Listen for global chat messages to sync with presence store
    socket.on('global_chat_message', (message) => {
      if (!message) return;

      // Skip self-echo for global chat (already appended optimistically)
      const senderIdFromMsg = message.sender?.id || message.playerId || message.senderId || message.userId;
      const isFromUs = senderIdFromMsg === socket.id || (currentPlayerRef.current && senderIdFromMsg === currentPlayerRef.current.id);

      if (isFromUs) {
        chatDebug('ðŸŒ Skipping self-echo for global chat message in MultiplayerApp');
        return;
      }

      chatDebug('ðŸŒ [socket:global_chat_message] inbound', {
        id: message?.id,
        messageId: message?.messageId,
        senderId: message?.senderId,
        playerId: message?.playerId,
        type: message?.type,
        hasContent: !!(message?.content || message?.message)
      });
      try {
        const resolvedSenderId = message.playerId || message.senderId || message.userId || message.socketId || null;
        const resolvedSenderName = message.playerName || message.senderName || message.characterName || 'Unknown';
        const resolvedTimestamp = message.timestamp || message.serverTimestamp || new Date().toISOString();
        const resolvedContent = message.content || message.message || '';
        const matchedPartyMember = usePartyStore.getState().partyMembers.find((member) =>
          member?.id === resolvedSenderId ||
          member?.socketId === resolvedSenderId ||
          (resolvedSenderName && member?.name === resolvedSenderName)
        );
        const normalizedSenderId = matchedPartyMember?.id || resolvedSenderId || 'unknown_global_sender';
        const normalizedMessageId =
          message?.id ||
          message?.messageId ||
          message?.clientMessageId ||
          `${normalizedSenderId}:${resolvedTimestamp}:${resolvedContent}`;

        if (!resolvedContent) {
          console.warn('âš ï¸ Dropping empty global chat payload from socket:', message);
          return;
        }

        const presenceStore = usePresenceStore.getState();
        const beforeCount = presenceStore.globalChatMessages.length;

        presenceStore.addGlobalMessage({
          ...message,
          id: normalizedMessageId,
          messageId: message.messageId || normalizedMessageId,
          senderId: normalizedSenderId,
          playerId: normalizedSenderId,
          senderName: resolvedSenderName,
          playerName: resolvedSenderName,
          content: resolvedContent,
          message: resolvedContent,
          timestamp: resolvedTimestamp,
          type: message.type || 'message'
        });

        const afterCount = usePresenceStore.getState().globalChatMessages.length;
        chatDebug('ðŸŒ [socket:global_chat_message] appended', {
          normalizedMessageId,
          normalizedSenderId,
          beforeCount,
          afterCount,
          delta: afterCount - beforeCount
        });
      } catch (error) {
        console.error('âŒ Failed to add global chat message:', error);
      }
    });

    // Listen for whisper messages
    socket.on('whisper_received', (message) => {
      // Import presence store dynamically to avoid circular dependencies
      import('../../../store/presenceStore').then(({ default: usePresenceStore }) => {
        const { addWhisperMessage, setActiveTab } = usePresenceStore.getState();
        // Add whisper message to the appropriate tab
        // Use senderId to create/update the whisper tab (tab is for the sender)
        const senderId = message.senderId || message.playerId || message.userId;
        if (!senderId) {
          console.error('Whisper message missing senderId:', message);
          return;
        }

        const currentPlayerId = currentPlayerRef.current?.id;
        const currentPlayerName = currentPlayerRef.current?.name;

        // Create tab if it doesn't exist and switch to it
        const resolvedWhisperUserId = addWhisperMessage(senderId, {
          id: message.id || `whisper_${Date.now()}`,
          senderId,
          senderName: message.senderName || 'Unknown',
          senderClass: message.senderClass || 'Unknown',
          senderLevel: message.senderLevel || 1,
          recipientId: message.recipientId || currentPlayerId,
          recipientName: message.recipientName || currentPlayerName || 'Unknown',
          content: message.content,
          timestamp: message.timestamp || message.serverTimestamp || new Date().toISOString(),
          type: 'whisper_received'
        });

        // Switch to whisper tab if not already on it
        const finalWhisperUserId = resolvedWhisperUserId || senderId;
        const finalWhisperTabId = `whisper_${finalWhisperUserId}`;
        const { activeTab } = usePresenceStore.getState();
        if (activeTab !== finalWhisperTabId) {
          setActiveTab(finalWhisperTabId);
        }
      }).catch(error => {
        console.error('Failed to handle whisper message:', error);
      });
    });

    // CRITICAL FIX: Listen for whisper_sent confirmation from server to update recipient name
    socket.on('whisper_sent', (message) => {
      // Import presence store dynamically to avoid circular dependencies
      import('../../../store/presenceStore').then(({ default: usePresenceStore }) => {
        const { addWhisperMessage } = usePresenceStore.getState();
        // Use recipientId to create/update the whisper tab (tab is for the recipient)
        const recipientId = message.recipientId;
        if (!recipientId) {
          console.error('Whisper sent confirmation missing recipientId:', message);
          return;
        }

        // Add message to whisper tab with correct recipient name
        addWhisperMessage(recipientId, {
          id: message.id || `whisper_${Date.now()}`,
          senderId: message.senderId,
          senderName: message.senderName || 'Unknown',
          senderClass: message.senderClass || 'Unknown',
          senderLevel: message.senderLevel || 1,
          recipientId: message.recipientId,
          recipientName: message.recipientName || 'Unknown',
          recipientClass: message.recipientClass || 'Unknown',
          recipientLevel: message.recipientLevel || 1,
          content: message.content,
          timestamp: message.timestamp || message.serverTimestamp || new Date().toISOString(),
          type: 'whisper_sent'
        });
      }).catch(error => {
        console.error('Failed to handle whisper sent confirmation:', error);
      });
    });

    return () => {
      socket.off('chat_message');
      socket.off('whisper_received');
      socket.off('whisper_sent');
      socket.off('global_chat_message');
    };
}
