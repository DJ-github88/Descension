import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import useChatStore from '../../store/chatStore';
import '../../styles/social-window.css';

// Lazy load the ItemTooltip component
const ItemTooltip = lazy(() => import('../item-generation/ItemTooltip'));

// Helper function to format timestamps
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper function to get class color
const getClassColor = (className) => {
  const classColors = {
    warrior: '#C79C6E',
    mage: '#69CCF0',
    rogue: '#FFF569',
    priest: '#FFFFFF',
    warlock: '#9482C9',
    paladin: '#F58CBA',
    druid: '#FF7D0A',
    shaman: '#0070DE',
    hunter: '#ABD473',
    deathknight: '#C41F3B',
    monk: '#00FF96',
    demonhunter: '#A330C9',
    cleric: '#FFFFFF'
  };

  return classColors[className.toLowerCase()] || '#FFFFFF';
};

const ChatWindow = () => {
  const {
    activeTab,
    setActiveTab,
    notifications,
    unreadCounts,
    sendMessage,
    clearNotifications
  } = useChatStore(state => ({
    activeTab: state.activeTab,
    setActiveTab: state.setActiveTab,
    notifications: state.notifications,
    unreadCounts: state.unreadCounts,
    sendMessage: state.sendMessage,
    clearNotifications: state.clearNotifications
  }));

  const [messageInput, setMessageInput] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  // Set isLoaded to true after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300); // Small delay for smoother transition

    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom when notifications change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [notifications, activeTab]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (messageInput.trim() === '') return;

    sendMessage(activeTab, messageInput);
    setMessageInput('');
  };

  // State for item tooltip
  const [tooltipItem, setTooltipItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  // Get quality color for styling
  const getQualityColor = (quality) => {
    const qualityColors = {
      poor: '#9d9d9d',
      common: '#ffffff',
      uncommon: '#1eff00',
      rare: '#0070dd',
      epic: '#a335ee',
      legendary: '#ff8000',
      artifact: '#e6cc80'
    };
    return qualityColors[quality?.toLowerCase()] || qualityColors.common;
  };

  // Handle mouse enter to show tooltip
  const handleItemMouseEnter = (e, item) => {
    if (!item) return;

    // Calculate position for tooltip - position above the chat window
    const rect = e.currentTarget.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Get the chat window container to position tooltip above it
    const chatWindow = e.currentTarget.closest('.draggable-window') || e.currentTarget.closest('.chat-window');
    const chatWindowRect = chatWindow ? chatWindow.getBoundingClientRect() : rect;

    // Position tooltip above the entire chat window, centered horizontally
    let x = chatWindowRect.left + (chatWindowRect.width / 2) - 150; // Center tooltip on chat window
    let y = chatWindowRect.top - 420; // Position well above the chat window (tooltip height ~400px)

    // Ensure tooltip doesn't go off screen horizontally
    const tooltipWidth = 300;
    if (x < 10) x = 10;
    if (x + tooltipWidth > windowWidth - 10) x = windowWidth - tooltipWidth - 10;

    // If tooltip would go above screen, position it to the right of the chat window instead
    if (y < 10) {
      x = chatWindowRect.right + 10;
      y = chatWindowRect.top + 50;

      // If that goes off screen too, position it to the left
      if (x + tooltipWidth > windowWidth - 10) {
        x = chatWindowRect.left - tooltipWidth - 10;
      }
    }

    setTooltipPosition({ x, y });
    setTooltipItem(item);
  };

  // Handle mouse leave to hide tooltip
  const handleItemMouseLeave = () => {
    setTooltipItem(null);
  };

  // Render the message content
  const renderMessage = (notification) => {
    const { type, timestamp } = notification;

    switch (type) {
      case 'item_looted':
        return (
          <div
            className="friend-entry"
            data-loot-entry="true"
            data-item-quality={(notification.item.quality || 'common').toLowerCase()}
            onMouseEnter={(e) => handleItemMouseEnter(e, notification.item)}
            onMouseLeave={handleItemMouseLeave}
          >
            <div className="friend-status online"></div>
            <div className="friend-name">
              <span style={{ color: getQualityColor(notification.item.quality) }}>
                {notification.item.name}
              </span>
              {notification.quantity > 1 && <span style={{ color: '#666', fontWeight: 'normal' }}> x{notification.quantity}</span>}
            </div>
            <div className="friend-info">
              <div>
                <span style={{ fontWeight: '700', color: '#1a1a1a', textShadow: '0 1px 2px rgba(0, 0, 0, 0.2), 0 0 1px rgba(255, 255, 255, 0.8)' }}>{notification.looter || 'Player'}</span>
                <span style={{ color: '#2a2a2a', marginLeft: '4px', fontWeight: '600' }}>looted</span>
              </div>
              <div className="friend-location">{notification.source || 'from world'}</div>
              <div className="timestamp">{formatTimestamp(timestamp)}</div>
            </div>
          </div>
        );

      case 'currency_looted':
        const formatCurrencyText = () => {
          const parts = [];

          if (notification.gold > 0) {
            parts.push(
              <span key="gold">
                <span className="currency-amount-white">
                  {notification.gold}
                </span>
                <span className="currency-type-gold">
                  Gold
                </span>
              </span>
            );
          }

          if (notification.silver > 0) {
            if (parts.length > 0) parts.push(<span key="gold-space" style={{ margin: '0 4px' }}> </span>);
            parts.push(
              <span key="silver">
                <span className="currency-amount-white">
                  {notification.silver}
                </span>
                <span className="currency-type-silver">
                  Silver
                </span>
              </span>
            );
          }

          if (notification.copper > 0) {
            if (parts.length > 0) parts.push(<span key="silver-space" style={{ margin: '0 4px' }}> </span>);
            parts.push(
              <span key="copper">
                <span className="currency-amount-white">
                  {notification.copper}
                </span>
                <span className="currency-type-copper">
                  Copper
                </span>
              </span>
            );
          }

          return parts;
        };

        return (
          <div
            className="friend-entry"
            data-loot-entry="true"
            data-item-quality="currency"
          >
            <div className="friend-status online"></div>
            <div className="friend-name">
              <span style={{ fontSize: '17px', fontWeight: '700' }}>
                {formatCurrencyText()}
              </span>
            </div>
            <div className="friend-info">
              <div>
                <span style={{ fontWeight: '700', color: '#1a1a1a', textShadow: '0 1px 2px rgba(0, 0, 0, 0.2), 0 0 1px rgba(255, 255, 255, 0.8)' }}>{notification.looter || 'Player'}</span>
                <span style={{ color: '#2a2a2a', marginLeft: '4px', fontWeight: '600' }}>looted currency</span>
              </div>
              <div className="friend-location">{notification.source || 'from world'}</div>
              <div className="timestamp">{formatTimestamp(timestamp)}</div>
            </div>
          </div>
        );

      case 'combat_hit':
        return (
          <div className="friend-entry">
            <div className="friend-status" style={{ backgroundColor: '#c9323b' }}></div>
            <div className="friend-name">
              <span>{notification.attacker} hit {notification.target}</span>
            </div>
            <div className="friend-info">
              <div style={{ color: '#c9323b' }}>{notification.damage} damage</div>
              <div className="timestamp">{formatTimestamp(timestamp)}</div>
            </div>
          </div>
        );

      case 'combat_heal':
        return (
          <div className="friend-entry">
            <div className="friend-status" style={{ backgroundColor: '#2dc937' }}></div>
            <div className="friend-name">
              <span>{notification.healer} healed {notification.target}</span>
            </div>
            <div className="friend-info">
              <div style={{ color: '#2dc937' }}>{notification.healing} healing</div>
              <div className="timestamp">{formatTimestamp(timestamp)}</div>
            </div>
          </div>
        );

      case 'initiative_roll':
        return (
          <div className="friend-entry">
            <div className="friend-status" style={{ backgroundColor: '#ffd700' }}></div>
            <div className="friend-name">
              <span>{notification.creature} rolled initiative</span>
            </div>
            <div className="friend-info">
              <div style={{ color: '#ffd700' }}>
                d20: {notification.roll} + {notification.modifier} = {notification.total}
              </div>
              <div className="timestamp">{formatTimestamp(timestamp)}</div>
            </div>
          </div>
        );

      case 'message':
      default:
        return (
          <div className="friend-entry">
            <div className="friend-status online"></div>
            <div className="friend-name">
              <span
                style={{
                  color: notification.sender?.class ?
                    getClassColor(notification.sender.class) :
                    '#ffffff'
                }}
              >
                {notification.sender?.name || 'System'}
              </span>
            </div>
            <div className="friend-info">
              <div>{notification.content}</div>
              <div className="timestamp">{formatTimestamp(timestamp)}</div>
            </div>
          </div>
        );
    }
  };

  // Render the appropriate tab content
  const renderContent = () => {
    if (!isLoaded) {
      return (
        <div className="loading-wrapper">
          <div className="loading-text">Loading notifications...</div>
        </div>
      );
    }

    // Get notifications from the store
    const tabNotifications = notifications[activeTab] || [];

    if (tabNotifications.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className={`fas ${
              activeTab === 'social' ? 'fa-comments' :
              activeTab === 'combat' ? 'fa-sword' :
              'fa-coins'
            }`}></i>
          </div>
          <div className="empty-state-text">No notifications yet</div>
          <div className="empty-state-subtext">
            {activeTab === 'social' && 'Social interactions will appear here'}
            {activeTab === 'combat' && 'Combat events will appear here'}
            {activeTab === 'loot' && 'Loot items will appear here'}
          </div>
        </div>
      );
    }

    return (
      <div className="friends-list-container">
        <div className="friends-section-header">
          {activeTab === 'social' ? 'Social Messages' :
           activeTab === 'combat' ? 'Combat Events' :
           'Loot History'}
        </div>
        <div className="friends-list">
          {tabNotifications.map(notification => (
            <div key={notification.id}>
              {renderMessage(notification)}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Clear button */}
        {tabNotifications.length > 0 && (
          <div className="social-actions">
            <button
              className="social-button"
              onClick={() => clearNotifications(activeTab)}
            >
              Clear History
            </button>
          </div>
        )}

        {/* Item Tooltip */}
        {tooltipItem && createPortal(
          <Suspense fallback={<div>Loading...</div>}>
            <div
              ref={tooltipRef}
              style={{
                position: 'fixed',
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                zIndex: 9999,
                pointerEvents: 'none'
              }}
            >
              <ItemTooltip item={tooltipItem} />
            </div>
          </Suspense>,
          document.body
        )}
      </div>
    );
  };

  return (
    <div className="social-window">
      {/* Tab Content - tabs are now in the window header */}
      <div className="social-content">
        {renderContent()}

        {/* Message Input (only for social tab) */}
        {activeTab === 'social' && (
          <div className="social-actions">
            <form className="message-form" onSubmit={handleSendMessage} style={{ display: 'flex', width: '100%', gap: '8px' }}>
              <input
                type="text"
                className="message-input"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '3px',
                  border: '1px solid #a08c70',
                  backgroundColor: '#fff',
                  color: '#3a3a3a',
                  fontFamily: 'inherit'
                }}
              />
              <button
                type="submit"
                className="social-button"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
