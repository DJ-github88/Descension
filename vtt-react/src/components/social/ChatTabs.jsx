/**
 * Chat Tabs Component
 * 
 * Tabbed interface for Global, Whisper, and Party chat
 */

import React from 'react';
import usePresenceStore from '../../store/presenceStore';
import usePartyStore from '../../store/partyStore';

const ChatTabs = () => {
  const activeTab = usePresenceStore((state) => state.activeTab);
  const setActiveTab = usePresenceStore((state) => state.setActiveTab);
  const whisperTabs = usePresenceStore((state) => state.whisperTabs);
  const closeWhisperTab = usePresenceStore((state) => state.closeWhisperTab);
  const isInParty = usePartyStore((state) => state.isInParty);

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
        className={`chat-tab ${activeTab === 'global' ? 'active' : ''}`}
        onClick={() => handleTabClick('global')}
      >
        <i className="fas fa-globe"></i>
        <span>Global</span>
      </div>

      {/* Whisper Tabs */}
      {Array.from(whisperTabs.entries()).map(([userId, tabData]) => (
        <div
          key={userId}
          className={`chat-tab whisper-tab ${activeTab === `whisper_${userId}` ? 'active' : ''}`}
          onClick={() => handleTabClick(`whisper_${userId}`)}
        >
          <i className="fas fa-comment"></i>
          <span>{tabData.user.characterName}</span>
          {tabData.unreadCount > 0 && (
            <span className="unread-badge">{tabData.unreadCount}</span>
          )}
          <button
            className="close-tab-btn"
            onClick={(e) => handleCloseWhisperTab(e, userId)}
            title="Close whisper"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}

      {/* Party Tab (only if in party) */}
      {isInParty && (
        <div
          className={`chat-tab party-tab ${activeTab === 'party' ? 'active' : ''}`}
          onClick={() => handleTabClick('party')}
        >
          <i className="fas fa-users"></i>
          <span>Party</span>
        </div>
      )}
    </div>
  );
};

export default ChatTabs;

