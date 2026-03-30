/**
 * Tabbed Chat Component
 *
 * Displays chat messages based on active tab (Global, Whisper, Party, Loot, Combat)
 */

import React, { useState, useRef, useEffect } from 'react';
import usePresenceStore from '../../store/presenceStore';
import usePartyStore from '../../store/partyStore';
import useCharacterStore from '../../store/characterStore';
import useGameStore from '../../store/gameStore';
import LootTab from './LootTab';
import CombatTab from './CombatTab';
import { getIconUrl } from '../../utils/assetManager';

const CHAT_DEBUG = process.env.NODE_ENV === 'development' || process.env.REACT_APP_CHAT_DEBUG === 'true';
const chatDebug = (...args) => {
  if (CHAT_DEBUG) {
    console.log(...args);
  }
};

const PLACEHOLDER_NAMES = new Set(['character name', 'unknown', 'guest']);

const sanitizeDisplayName = (value) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (PLACEHOLDER_NAMES.has(trimmed.toLowerCase())) return null;
  return trimmed;
};

const TabbedChat = () => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const autoMessageSentRef = useRef(new Set()); // Track which tabs have received auto messages

  const activeTab = usePresenceStore((state) => state.activeTab);
  const globalChatMessages = usePresenceStore((state) => state.globalChatMessages);
  const partyChatMessages = usePresenceStore((state) => state.partyChatMessages);
  const whisperTabs = usePresenceStore((state) => state.whisperTabs);
  const presenceSocket = usePresenceStore((state) => state.socket);
  const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
  const sendGlobalMessage = usePresenceStore((state) => state.sendGlobalMessage);
  const sendWhisper = usePresenceStore((state) => state.sendWhisper);
  const addPartyChatMessage = usePresenceStore((state) => state.addPartyChatMessage);
  const isInParty = usePartyStore((state) => state.isInParty);

  // Get character data directly from character store
  const characterName = useCharacterStore((state) => state.name);
  const characterClass = useCharacterStore((state) => state.class);
  const characterLevel = useCharacterStore((state) => state.level);
  const currentGamePlayer = useGameStore((state) => state.currentPlayer);

  const getBestDisplayName = (...candidates) => {
    for (const candidate of candidates) {
      const clean = sanitizeDisplayName(candidate);
      if (clean) return clean;
    }
<<<<<<< HEAD
    return 'Unknown Adventurer';
=======
    return 'Unknown';
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f
  };

  // Get current messages based on active tab
  const getCurrentMessages = () => {
    if (activeTab === 'global') {
      return globalChatMessages;
    } else if (activeTab === 'party') {
      return partyChatMessages;
    } else if (activeTab.startsWith('whisper_')) {
      const userId = activeTab.replace('whisper_', '');
      const tab = whisperTabs.get(userId);
      return tab ? tab.messages : [];
    }
    return [];
  };

  const messages = getCurrentMessages();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when tab changes to whisper tab
  useEffect(() => {
    if (activeTab.startsWith('whisper_')) {
      // Small delay to ensure input is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [activeTab]);

  // Handle send message
  const handleSendMessage = (e) => {
    e.preventDefault();

    const content = messageInput.trim();
    if (!content) return;

    if (activeTab === 'global') {
      // Global chat: Check authentication
      if (!currentUserPresence || currentUserPresence?.isGuest) {
        console.warn('Authentication required for global chat');
        return;
      }
      sendGlobalMessage(content);
    } else if (activeTab === 'party') {
      // Party chat: Allow if in party, even without full authentication
      const partyMembers = usePartyStore.getState().partyMembers;
      const senderName = getBestDisplayName(
        currentUserPresence?.characterName,
        characterName,
        currentGamePlayer?.name,
        currentUserPresence?.displayName,
        currentUserPresence?.accountName,
        partyMembers.find((m) => sanitizeDisplayName(m?.characterName))?.characterName,
        partyMembers.find((m) => sanitizeDisplayName(m?.name))?.name
      );
      const senderClass = characterClass || currentUserPresence?.class || 'Adventurer';
      const senderLevel = characterLevel || currentUserPresence?.level || 1;
      const { multiplayerSocket } = useGameStore.getState();
      // CRITICAL: For multiplayer HUD anchoring, prefer room player/socket identity over auth userId.
      // userId can be Firebase uid which may not match in-room data-player-id attributes.
      const senderId =
        currentGamePlayer?.id ||
        partyMembers.find(m => m.name === senderName || m.characterName === senderName)?.id ||
        multiplayerSocket?.id ||
        currentUserPresence?.userId ||
        'current-player';

      // Send party message
      const generatedMessageId = `msg_${Date.now()}`;
      const message = {
        id: generatedMessageId,
        messageId: generatedMessageId,
        senderId: senderId,
        senderName: senderName,
        senderClass: senderClass,
        senderLevel: senderLevel,
        content,
        timestamp: new Date().toISOString(),
        type: 'party'
      };

      chatDebug('💬 [TabbedChat:party] compose', {
        id: message.id,
        messageId: message.messageId,
        senderId: message.senderId,
        senderName: message.senderName,
        contentLength: message.content.length
      });

      const partyBefore = usePresenceStore.getState().partyChatMessages.length;

      // Check if in multiplayer mode and send through best available socket
      const gameState = useGameStore.getState();
      const { multiplayerSocket: gameSocket, isInMultiplayer } = gameState;
      const resolvedSocket = (gameSocket && gameSocket.connected)
        ? gameSocket
        : ((presenceSocket && presenceSocket.connected) ? presenceSocket : null);

      const socketSource = resolvedSocket
        ? (resolvedSocket === gameSocket ? 'gameStore.multiplayerSocket' : 'presenceStore.socket')
        : 'none';

      chatDebug('💬 [TabbedChat:party] socket-resolution', {
        isInMultiplayer,
        gameSocketConnected: !!gameSocket?.connected,
        presenceSocketConnected: !!presenceSocket?.connected,
        socketSource
      });

      if (resolvedSocket) {
        console.log(`💬 Sending party message through ${socketSource} (explicit payload)`);
        // Optimistic local append so sender immediately sees their own message
        // even if socket echo is delayed/missed.
        addPartyChatMessage(message);
        const afterOptimistic = usePresenceStore.getState().partyChatMessages.length;
        chatDebug('💬 [TabbedChat:party] optimistic-append', {
          before: partyBefore,
          after: afterOptimistic,
          delta: afterOptimistic - partyBefore,
          messageId: message.messageId
        });

        // Get party ID from partyStore
        const currentParty = usePartyStore.getState().currentParty || usePresenceStore.getState().currentParty;
        const currentPartyId = currentParty?.id;

        if (currentPartyId) {
          // Send via party_message event (matches server handler)
          resolvedSocket.emit('party_message', {
            partyId: currentPartyId,
            message: message.content
          });
        } else {
          console.warn('⚠️ No party ID found, cannot send party message');
        }

        chatDebug('💬 [TabbedChat:party] socket emit', {
          socketId: resolvedSocket.id,
          connected: resolvedSocket.connected,
          socketSource,
          messageId: message.messageId,
          senderId: message.senderId,
          partyId: currentPartyId
        });

        setMessageInput('');
        return;
      }

      if (isInMultiplayer && !resolvedSocket) {
        console.warn('⚠️ Party chat not sent (multiplayer socket unavailable)');
        addPartyChatMessage({
          id: `system_party_send_failed_${Date.now()}`,
          senderId: 'system',
          senderName: 'System',
          content: 'Party message failed to send: disconnected from multiplayer server.',
          timestamp: new Date().toISOString(),
          type: 'system'
        });
        setMessageInput('');
        return;
      }

      // Single-player mode: add locally
      addPartyChatMessage(message);
      const afterLocal = usePresenceStore.getState().partyChatMessages.length;
      chatDebug('💬 [TabbedChat:party] local-only append', {
        before: partyBefore,
        after: afterLocal,
        delta: afterLocal - partyBefore,
        messageId: message.messageId
      });
    } else if (activeTab.startsWith('whisper_')) {
      // Whisper to party member: Allow if in party
      const userId = activeTab.replace('whisper_', '');

      // Check if target is a party member
      const partyMembers = usePartyStore.getState().partyMembers;
      const isPartyMember = partyMembers.some(m => m.id === userId);

      if (isPartyMember && isInParty) {
        sendWhisper(userId, content);
      } else if (!currentUserPresence || currentUserPresence?.isGuest) {
        console.warn('Authentication required for whispers to non-party members');
      } else {
        sendWhisper(userId, content);
      }
    }

    setMessageInput('');
  };

  // Get placeholder text based on active tab
  const getPlaceholder = () => {
    // Party chat: Allow if in party, even without full authentication
    if (activeTab === 'party' && isInParty) {
      // Use fallback character data if currentUserPresence not available
      const displayName = getBestDisplayName(
        currentUserPresence?.accountName,
        currentUserPresence?.characterName,
        characterName,
        currentGamePlayer?.name,
        'Player'
      );
      return `Message your party - ${displayName}`;
    }

    // Whisper: Allow if in party and target is party member
    if (activeTab.startsWith('whisper_') && isInParty) {
      const userId = activeTab.replace('whisper_', '');
      const tab = whisperTabs.get(userId);
      if (tab && tab.user) {
<<<<<<< HEAD
        const targetName = tab.user.characterName || tab.user.name || 'Unknown Adventurer';
=======
        const targetName = tab.user.characterName || tab.user.name || 'Unknown';
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f
        const displayName = getBestDisplayName(
          currentUserPresence?.accountName,
          currentUserPresence?.characterName,
          characterName,
          currentGamePlayer?.name,
          'Player'
        );
        return `Whisper to ${targetName} - ${displayName}`;
      }
    }

    // Global chat: Require authentication (keep existing restriction)
    if (activeTab === 'global' && (!currentUserPresence || currentUserPresence?.isGuest)) {
      return "Please log in to chat...";
    }

    // Normal placeholder for authenticated users
    let displayName = getBestDisplayName(
      currentUserPresence?.accountName,
      currentUserPresence?.characterName,
      characterName,
      currentGamePlayer?.name,
      'Unknown'
    );
    if (currentUserPresence?.characterName &&
      currentUserPresence?.accountName &&
      currentUserPresence.characterName !== 'Guest' &&
      currentUserPresence.characterName !== 'Unknown' &&
      currentUserPresence.characterName !== currentUserPresence.accountName) {
      displayName = `${currentUserPresence.accountName}(${currentUserPresence.characterName})`;
    }

    if (activeTab === 'global') {
      return displayName;
    } else if (activeTab === 'party') {
      return `Message your party - ${displayName}`;
    } else if (activeTab.startsWith('whisper_')) {
      const userId = activeTab.replace('whisper_', '');
      const tab = whisperTabs.get(userId);
      if (tab && tab.user) {
<<<<<<< HEAD
        const targetName = tab.user.characterName || tab.user.name || tab.user.displayName || 'Unknown Adventurer';
=======
        const targetName = tab.user.characterName || tab.user.name || tab.user.displayName || 'Unknown';
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f
        return `Whisper to ${targetName} - ${displayName}`;
      }
      return `Whisper to... - ${displayName}`;
    }
    return displayName;
  };

  // Render message based on type
  const renderMessage = (message) => {
    // For testing without login, check against 'test_user' as well
    const isOwnMessage = message.senderId === currentUserPresence?.userId ||
      message.senderId === currentGamePlayer?.id ||
      (message.senderId === 'test_user' && !currentUserPresence);

    if (message.type === 'system') {
      return (
        <div key={message.id} className="chat-message system-message">
          <div className="message-content">
            <i className="fas fa-info-circle"></i>
            {message.content}
          </div>
        </div>
      );
    }

    if (message.type === 'achievement') {
      return (
        <div key={message.id} className="chat-message achievement-message">
          <div className="achievement-content">
            <div className="achievement-header">
              <img
<<<<<<< HEAD
                src={getIconUrl(
                  message.achievementData?.icon || 'achievement_icon',
                  message.achievementData?.icon ? 'abilities' : 'ui'
                )}
=======
                src={message.achievementData?.icon || getIconUrl('achievement_bg_winwsg', 'ui')}
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f
                alt="Achievement"
                className="achievement-icon"
              />
              <div className="achievement-text">
                <div className="achievement-title">
                  Achievement Earned!
                </div>
                <div className="achievement-details">
                  <strong>{message.achievementData?.questName}</strong>
                  <span className="achievement-skill">({message.achievementData?.skillName})</span>
                </div>
                <div className="achievement-description">
                  {message.achievementData?.questDescription}
                </div>
              </div>
            </div>
            <div className="achievement-reward">
              <i className="fas fa-trophy achievement-trophy"></i>
              <span className="achievement-points">+10 Achievement Points</span>
            </div>
          </div>
          <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
        </div>
      );
    }

    if (message.type === 'whisper_sent') {
      return (
        <div key={message.id} className="chat-message whisper-sent">
          <div className="message-header">
            <span className="sender-name">To {message.recipientName}:</span>
            <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
          <div className="message-content whisper-content">
            {message.content}
          </div>
        </div>
      );
    }

    if (message.type === 'whisper_received') {
      return (
        <div key={message.id} className="chat-message whisper-received">
          <div className="message-header">
            <span className="sender-name">{message.senderName} whispers:</span>
            <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
          <div className="message-content whisper-content">
            {message.content}
          </div>
        </div>
      );
    }

    // Regular message (global, party, or any other type)
    return (
      <div key={message.id} className={`chat-message ${isOwnMessage ? 'own-message' : ''} ${message.type === 'party' ? 'party-message' : ''}`}>
        <div className="message-header">
          <span className="sender-name">{message.senderName}</span>
          {message.type === 'party' && <span className="party-badge">Party</span>}
          <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
        </div>
        <div className="message-content">
          {message.content}
        </div>
      </div>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    // Loot tab
    if (activeTab === 'loot') {
      return <LootTab />;
    }

    // Combat tab
    if (activeTab === 'combat') {
      return <CombatTab />;
    }

    // Chat tabs (Global, Whisper, Party)
    return (
      <>
        {/* Messages Area */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="no-messages">
              {activeTab === 'global' && <p>Welcome to the global chat! Say hello to the community.</p>}
              {activeTab === 'party' && <p>Party chat - coordinate with your party members.</p>}
              {activeTab.startsWith('whisper_') && <p>Start a private conversation...</p>}
            </div>
          ) : (
            messages.map(renderMessage)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <div className="input-field-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={getPlaceholder()}
              maxLength={500}
              autoFocus={activeTab.startsWith('whisper_')}
            />
            <span className="character-counter">
              {messageInput.length} / 500
            </span>
          </div>
          <button
            type="submit"
            className="send-button"
            disabled={!messageInput.trim()}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </>
    );
  };

  return (
    <div className="tabbed-chat">
      {renderContent()}
    </div>
  );
};

export default TabbedChat;

