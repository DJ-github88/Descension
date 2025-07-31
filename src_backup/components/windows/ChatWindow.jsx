import React, { useState, useEffect } from 'react';
import useChatStore from '../../store/chatStore';
import LootNotification from '../chat/LootNotification';
import CombatNotification from '../chat/CombatNotification';
import SocialNotification from '../chat/SocialNotification';
import '../../styles/chat-window.css';

const ChatWindow = () => {
  const {
    activeTab,
    setActiveTab,
    notifications,
    clearNotifications,
    unreadCounts
  } = useChatStore();

  const [isLoaded, setIsLoaded] = useState(false);

  // Set isLoaded to true after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300); // Small delay for smoother transition

    return () => clearTimeout(timer);
  }, []);

  // Render the appropriate tab content
  const renderContent = () => {
    if (!isLoaded) {
      return (
        <div className="loading-wrapper">
          <div className="loading-text">Loading chat history...</div>
        </div>
      );
    }

    const tabNotifications = notifications[activeTab] || [];

    if (tabNotifications.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="fas fa-scroll"></i>
          </div>
          <div className="empty-state-text">No notifications yet</div>
          <div className="empty-state-subtext">
            {activeTab === 'loot' && 'Loot items to see notifications here'}
            {activeTab === 'combat' && 'Combat events will appear here'}
            {activeTab === 'social' && 'Social interactions will appear here'}
          </div>
        </div>
      );
    }

    return (
      <div className="chat-notifications">
        {tabNotifications.map(notification => {
          switch (activeTab) {
            case 'loot':
              return <LootNotification key={notification.id} notification={notification} />;
            case 'combat':
              return <CombatNotification key={notification.id} notification={notification} />;
            case 'social':
              return <SocialNotification key={notification.id} notification={notification} />;
            default:
              return null;
          }
        })}
      </div>
    );
  };

  // Handle clearing notifications
  const handleClearNotifications = () => {
    clearNotifications(activeTab);
  };

  return (
    <div className="chat-window">
      {/* Tab Navigation */}
      <div className="chat-tabs">
        <button
          className={`chat-tab ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
          data-unread={unreadCounts.social}
        >
          Social
        </button>
        <button
          className={`chat-tab ${activeTab === 'combat' ? 'active' : ''}`}
          onClick={() => setActiveTab('combat')}
          data-unread={unreadCounts.combat}
        >
          Combat
        </button>
        <button
          className={`chat-tab ${activeTab === 'loot' ? 'active' : ''}`}
          onClick={() => setActiveTab('loot')}
          data-unread={unreadCounts.loot}
        >
          Loot
        </button>
      </div>

      {/* Tab Content */}
      <div className="chat-content">
        {renderContent()}
      </div>

      {/* Footer with actions */}
      {notifications[activeTab]?.length > 0 && (
        <div className="chat-footer">
          <button
            className="chat-clear-button"
            onClick={handleClearNotifications}
          >
            Clear History
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
