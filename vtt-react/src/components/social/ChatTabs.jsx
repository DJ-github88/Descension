/**
 * Chat Tabs Component
 *
 * Tabbed interface for Global, Whisper, Party, Loot, and Combat chat
 * Loot and Combat tabs only visible when in a game session (local or multiplayer)
 */

import React, { useState, useEffect, useRef } from 'react';
import usePresenceStore from '../../store/presenceStore';
import usePartyStore from '../../store/partyStore';
import useGameStore from '../../store/gameStore';
import useChatStore from '../../store/chatStore';

const ChatTabs = () => {
  const activeTab = usePresenceStore((state) => state.activeTab);
  const setActiveTab = usePresenceStore((state) => state.setActiveTab);
  const whisperTabs = usePresenceStore((state) => state.whisperTabs);
  const closeWhisperTab = usePresenceStore((state) => state.closeWhisperTab);
  const globalChatMessages = usePresenceStore((state) => state.globalChatMessages);
  const partyChatMessages = usePresenceStore((state) => state.partyChatMessages);
  const isInParty = usePartyStore((state) => state.isInParty);

  // Check if in game session (local or multiplayer)
  // Always show combat and loot tabs since dice rolls appear in combat tab
  const isInMultiplayer = useGameStore((state) => state.isInMultiplayer);
  const isInLocalRoom = () => {
    return localStorage.getItem('isLocalRoom') === 'true' &&
           localStorage.getItem('selectedLocalRoomId');
  };
  const isInGame = true; // Always show combat and loot tabs

  // Get unread counts for loot and combat tabs
  const lootUnreadCount = useChatStore((state) => state.unreadCounts?.loot || 0);
  const combatUnreadCount = useChatStore((state) => state.unreadCounts?.combat || 0);

  // Get notifications for clear button visibility
  const lootNotifications = useChatStore((state) => state.notifications?.loot || []);
  const combatNotifications = useChatStore((state) => state.notifications?.combat || []);
  const clearNotifications = useChatStore((state) => state.clearNotifications);

  // Get clear functions for chat messages
  const clearGlobalMessages = usePresenceStore((state) => state.clearGlobalMessages);
  const clearPartyMessages = usePresenceStore((state) => state.clearPartyMessages);
  const clearWhisperMessages = usePresenceStore((state) => state.clearWhisperMessages);

  const [pulseTabs, setPulseTabs] = useState(new Set());
  const prevMessageCounts = useRef({
    global: 0,
    party: 0,
    whispers: new Map()
  });

  // Track message counts and trigger pulse animation
  useEffect(() => {
    const newPulseTabs = new Set(pulseTabs);

    // Check global messages
    if (globalChatMessages.length > prevMessageCounts.current.global && activeTab !== 'global') {
      newPulseTabs.add('global');
      setTimeout(() => {
        setPulseTabs(prev => {
          const updated = new Set(prev);
          updated.delete('global');
          return updated;
        });
      }, 1000);
    }
    prevMessageCounts.current.global = globalChatMessages.length;

    // Check party messages
    if (partyChatMessages.length > prevMessageCounts.current.party && activeTab !== 'party') {
      newPulseTabs.add('party');
      setTimeout(() => {
        setPulseTabs(prev => {
          const updated = new Set(prev);
          updated.delete('party');
          return updated;
        });
      }, 1000);
    }
    prevMessageCounts.current.party = partyChatMessages.length;

    // Check whisper messages
    whisperTabs.forEach((tabData, userId) => {
      const prevCount = prevMessageCounts.current.whispers.get(userId) || 0;
      const currentCount = tabData.messages.length;

      if (currentCount > prevCount && activeTab !== `whisper_${userId}`) {
        newPulseTabs.add(`whisper_${userId}`);
        setTimeout(() => {
          setPulseTabs(prev => {
            const updated = new Set(prev);
            updated.delete(`whisper_${userId}`);
            return updated;
          });
        }, 1000);
      }
      prevMessageCounts.current.whispers.set(userId, currentCount);
    });

    setPulseTabs(newPulseTabs);
  }, [globalChatMessages, partyChatMessages, whisperTabs, activeTab]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);

    // Clear unread count if switching to whisper tab
    if (tabId.startsWith('whisper_')) {
      const userId = tabId.replace('whisper_', '');
      const clearWhisperUnread = usePresenceStore.getState().clearWhisperUnread;
      clearWhisperUnread(userId);
    }
  };

  const handleCloseWhisperTab = (e, userId) => {
    e.stopPropagation();
    closeWhisperTab(userId);
  };

  return (
    <div className="chat-tabs">
      {/* Global Tab */}
      <div
        className={`chat-tab ${activeTab === 'global' ? 'active' : ''} ${pulseTabs.has('global') ? 'pulse' : ''}`}
        onClick={() => handleTabClick('global')}
      >
        <i className="fas fa-globe"></i>
        <span>Global</span>
        {activeTab === 'global' && globalChatMessages.length > 0 && (
          <button
            className="tab-clear-btn"
            onClick={(e) => {
              e.stopPropagation();
              clearGlobalMessages();
            }}
            title="Clear Global Chat"
          >
            <i className="fas fa-trash"></i>
          </button>
        )}
      </div>

      {/* Whisper Tabs */}
      {Array.from(whisperTabs.entries()).map(([userId, tabData]) => {
        const whisperTabId = `whisper_${userId}`;
        const isActiveWhisper = activeTab === whisperTabId;
        const hasMessages = tabData.messages && tabData.messages.length > 0;
        
        // Get character name with fallback
        const characterName = tabData.user?.characterName || 
                             tabData.user?.name || 
                             tabData.user?.displayName || 
                             'Unknown';

        return (
          <div
            key={userId}
            className={`chat-tab whisper-tab ${isActiveWhisper ? 'active' : ''} ${pulseTabs.has(whisperTabId) ? 'pulse' : ''}`}
            onClick={() => handleTabClick(whisperTabId)}
          >
            <i className="fas fa-comment"></i>
            <span>{characterName}</span>
            {tabData.unreadCount > 0 && (
              <span className="unread-badge">{tabData.unreadCount}</span>
            )}
            {isActiveWhisper && hasMessages && (
              <button
                className="tab-clear-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  clearWhisperMessages(userId);
                }}
                title="Clear Whisper Chat"
              >
                <i className="fas fa-trash"></i>
              </button>
            )}
            <button
              className="close-tab-btn"
              onClick={(e) => handleCloseWhisperTab(e, userId)}
              title="Close whisper"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        );
      })}

      {/* Party Tab (only if in party) */}
      {isInParty && (
        <div
          className={`chat-tab party-tab ${activeTab === 'party' ? 'active' : ''} ${pulseTabs.has('party') ? 'pulse' : ''}`}
          onClick={() => handleTabClick('party')}
        >
          <i className="fas fa-users"></i>
          <span>Party</span>
          {activeTab === 'party' && partyChatMessages.length > 0 && (
            <button
              className="tab-clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                clearPartyMessages();
              }}
              title="Clear Party Chat"
            >
              <i className="fas fa-trash"></i>
            </button>
          )}
        </div>
      )}

      {/* Loot Tab (only visible in game) */}
      {isInGame && (
        <div
          className={`chat-tab loot-tab ${activeTab === 'loot' ? 'active' : ''}`}
          onClick={() => handleTabClick('loot')}
        >
          <i className="fas fa-coins"></i>
          <span>Loot</span>
          {lootUnreadCount > 0 && (
            <span className="unread-badge">{lootUnreadCount}</span>
          )}
          {activeTab === 'loot' && lootNotifications.length > 0 && (
            <button
              className="tab-clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                clearNotifications('loot');
              }}
              title="Clear Loot History"
            >
              <i className="fas fa-trash"></i>
            </button>
          )}
        </div>
      )}

      {/* Combat Tab (only visible in game) */}
      {isInGame && (
        <div
          className={`chat-tab combat-tab ${activeTab === 'combat' ? 'active' : ''}`}
          onClick={() => handleTabClick('combat')}
        >
          <i className="fas fa-swords"></i>
          <span>Combat</span>
          {combatUnreadCount > 0 && (
            <span className="unread-badge">{combatUnreadCount}</span>
          )}
          {activeTab === 'combat' && combatNotifications.length > 0 && (
            <button
              className="tab-clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                clearNotifications('combat');
              }}
              title="Clear Combat History"
            >
              <i className="fas fa-trash"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatTabs;

