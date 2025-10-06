/**
 * Tabbed Chat Component
 *
 * Displays chat messages based on active tab (Global, Whisper, Party, Loot, Combat)
 */

import React, { useState, useRef, useEffect } from 'react';
import usePresenceStore from '../../store/presenceStore';
import usePartyStore from '../../store/partyStore';
import useCharacterStore from '../../store/characterStore';
import LootTab from './LootTab';
import CombatTab from './CombatTab';

const TabbedChat = () => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeTab = usePresenceStore((state) => state.activeTab);
  const globalChatMessages = usePresenceStore((state) => state.globalChatMessages);
  const partyChatMessages = usePresenceStore((state) => state.partyChatMessages);
  const whisperTabs = usePresenceStore((state) => state.whisperTabs);
  const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
  const sendGlobalMessage = usePresenceStore((state) => state.sendGlobalMessage);
  const sendWhisper = usePresenceStore((state) => state.sendWhisper);
  const addPartyChatMessage = usePresenceStore((state) => state.addPartyChatMessage);
  const isInParty = usePartyStore((state) => state.isInParty);

  // Get character data directly from character store
  const characterName = useCharacterStore((state) => state.name);
  const characterClass = useCharacterStore((state) => state.class);
  const characterLevel = useCharacterStore((state) => state.level);

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

  // Handle send message
  const handleSendMessage = (e) => {
    e.preventDefault();

    const content = messageInput.trim();
    if (!content) return;

    if (activeTab === 'global') {
      // Send global message
      sendGlobalMessage(content);
    } else if (activeTab === 'party') {
      // Use character store data if available, otherwise use presence or fallback
      const senderName = characterName || currentUserPresence?.characterName || 'Yad';
      const senderClass = characterClass || currentUserPresence?.class || 'Adventurer';
      const senderLevel = characterLevel || currentUserPresence?.level || 1;
      const senderId = currentUserPresence?.userId || 'test_user';

      // Send party message
      const message = {
        id: `msg_${Date.now()}`,
        senderId: senderId,
        senderName: senderName,
        senderClass: senderClass,
        senderLevel: senderLevel,
        content,
        timestamp: new Date().toISOString(),
        type: 'party'
      };

      console.log('💬 Sending party message:', message);
      console.log('📊 Party chat messages before:', partyChatMessages.length);
      addPartyChatMessage(message);

      // Verify message was added
      setTimeout(() => {
        const updatedMessages = usePresenceStore.getState().partyChatMessages;
        console.log('📊 Party chat messages after:', updatedMessages.length);
        console.log('✅ Party message added successfully');
      }, 100);

      // TODO: Emit to socket for multiplayer party chat
    } else if (activeTab.startsWith('whisper_')) {
      // Send whisper
      const userId = activeTab.replace('whisper_', '');
      sendWhisper(userId, content);
    }

    setMessageInput('');
  };

  // Get placeholder text based on active tab
  const getPlaceholder = () => {
    const displayName = characterName || currentUserPresence?.characterName || 'Yad';

    if (activeTab === 'global') {
      return displayName;
    } else if (activeTab === 'party') {
      return `Message your party - ${displayName}`;
    } else if (activeTab.startsWith('whisper_')) {
      const userId = activeTab.replace('whisper_', '');
      const tab = whisperTabs.get(userId);
      return tab ? `Whisper to ${tab.user.characterName} - ${displayName}` : displayName;
    }
    return displayName;
  };

  // Render message based on type
  const renderMessage = (message) => {
    // For testing without login, check against 'test_user' as well
    const isOwnMessage = message.senderId === currentUserPresence?.userId ||
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
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={getPlaceholder()}
            maxLength={500}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!messageInput.trim()}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>

        {/* Character Counter */}
        <div className="character-counter">
          {messageInput.length} / 500
        </div>
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

