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
  if (!socket) return undefined;

  // Named handlers: cleanup must remove only the listeners this module added.
  // `socket.off(event)` without a reference removed every listener for that
  // event, including ones registered by other modules.

  const handleChatMessage = (message) => {
    if (!message) return;

    // CRITICAL: Skip self-echo since we append optimistically in TabbedChat
    const senderIdFromMsg = message.sender?.id || message.playerId || message.senderId;
    const isFromUs = senderIdFromMsg === socket.id || (currentPlayerRef.current && senderIdFromMsg === currentPlayerRef.current.id);

    if (isFromUs) {
      chatDebug('💬 Skipping self-echo for party chat message in MultiplayerApp');
      return;
    }

    chatDebug('💬 [socket:chat_message] inbound', {
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
      console.warn('⚠️ Dropping empty party chat payload from socket:', message);
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
    chatDebug('💬 [socket:chat_message] appended', {
      normalizedMessageId,
      normalizedSenderId,
      beforeCount,
      afterCount,
      delta: afterCount - beforeCount
    });
  };

  const handleWhisperReceived = (message) => {
    // Import presence store dynamically to avoid circular dependencies
    import('../../../store/presenceStore').then(({ default: usePresenceStoreModule }) => {
      const { addWhisperMessage, setActiveTab } = usePresenceStoreModule.getState();
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
      const { activeTab } = usePresenceStoreModule.getState();
      if (activeTab !== finalWhisperTabId) {
        setActiveTab(finalWhisperTabId);
      }
    }).catch(error => {
      console.error('Failed to handle whisper message:', error);
    });
  };

  const handleWhisperSent = (message) => {
    // Import presence store dynamically to avoid circular dependencies
    import('../../../store/presenceStore').then(({ default: usePresenceStoreModule }) => {
      const { addWhisperMessage } = usePresenceStoreModule.getState();
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
  };

  const handleGlobalChatMessage = (message) => {
    if (!message) return;

    // Skip self-echo for global chat (already appended optimistically)
    const senderIdFromMsg = message.sender?.id || message.playerId || message.senderId || message.userId;
    const isFromUs = senderIdFromMsg === socket.id || (currentPlayerRef.current && senderIdFromMsg === currentPlayerRef.current.id);

    if (isFromUs) {
      chatDebug('🌐 Skipping self-echo for global chat message in MultiplayerApp');
      return;
    }

    chatDebug('🌐 [socket:global_chat_message] inbound', {
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
        console.warn('⚠️ Dropping empty global chat payload from socket:', message);
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
      chatDebug('🌐 [socket:global_chat_message] appended', {
        normalizedMessageId,
        normalizedSenderId,
        beforeCount,
        afterCount,
        delta: afterCount - beforeCount
      });
    } catch (error) {
      console.error('❌ Failed to add global chat message:', error);
    }
  };

  socket.on('chat_message', handleChatMessage);
  socket.on('whisper_received', handleWhisperReceived);
  socket.on('whisper_sent', handleWhisperSent);
  socket.on('global_chat_message', handleGlobalChatMessage);

  return () => {
    socket.off('chat_message', handleChatMessage);
    socket.off('whisper_received', handleWhisperReceived);
    socket.off('whisper_sent', handleWhisperSent);
    socket.off('global_chat_message', handleGlobalChatMessage);
  };
}
