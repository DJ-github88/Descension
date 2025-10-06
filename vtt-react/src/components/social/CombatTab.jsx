/**
 * Combat Tab Component
 * 
 * Displays combat notifications (hits, heals, misses, crits, etc.)
 * Migrated from ChatWindow combat functionality
 */

import React, { useRef } from 'react';
import useChatStore from '../../store/chatStore';

// Helper function to format timestamps
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const CombatTab = () => {
  const notifications = useChatStore((state) => state.notifications?.combat || []);
  const clearNotifications = useChatStore((state) => state.clearNotifications);
  const messagesEndRef = useRef(null);

  // Render combat notification
  const renderCombatNotification = (notification) => {
    const { type, timestamp } = notification;

    switch (type) {
      case 'combat_hit':
        return (
          <div key={notification.id} className="chat-message combat-message hit">
            <div className="message-header">
              <span className="sender-name">{notification.attacker}</span>
              <span className="timestamp">{formatTimestamp(timestamp)}</span>
            </div>
            <div className="message-content">
              Hit <span style={{ fontWeight: '700' }}>{notification.target}</span> for <span style={{ color: '#c9323b', fontWeight: '700' }}>{notification.damage} damage</span>
            </div>
          </div>
        );

      case 'combat_heal':
        return (
          <div key={notification.id} className="chat-message combat-message heal">
            <div className="message-header">
              <span className="sender-name">{notification.healer}</span>
              <span className="timestamp">{formatTimestamp(timestamp)}</span>
            </div>
            <div className="message-content">
              Healed <span style={{ fontWeight: '700' }}>{notification.target}</span> for <span style={{ color: '#2dc937', fontWeight: '700' }}>{notification.healing} health</span>
            </div>
          </div>
        );

      case 'combat_miss':
        return (
          <div key={notification.id} className="chat-message combat-message miss">
            <div className="message-header">
              <span className="sender-name">{notification.attacker}</span>
              <span className="timestamp">{formatTimestamp(timestamp)}</span>
            </div>
            <div className="message-content">
              Missed <span style={{ fontWeight: '700' }}>{notification.target}</span>
            </div>
          </div>
        );

      case 'combat_crit':
        return (
          <div key={notification.id} className="chat-message combat-message crit">
            <div className="message-header">
              <span className="sender-name">{notification.attacker}</span>
              <span className="timestamp">{formatTimestamp(timestamp)}</span>
            </div>
            <div className="message-content">
              <span style={{ color: '#ff6b00', fontWeight: '800' }}>CRITICAL HIT</span> on <span style={{ fontWeight: '700' }}>{notification.target}</span> for <span style={{ color: '#ff6b00', fontWeight: '800' }}>{notification.damage} damage!</span>
            </div>
          </div>
        );

      case 'combat_death':
        return (
          <div key={notification.id} className="chat-message combat-message death">
            <div className="message-header">
              <span className="sender-name">{notification.target}</span>
              <span className="timestamp">{formatTimestamp(timestamp)}</span>
            </div>
            <div className="message-content">
              <span style={{ fontWeight: '700', color: '#000' }}>Has been slain</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="combat-tab-content">
      {/* Combat Messages Area */}
      <div className="chat-messages">
        {notifications.length === 0 ? (
          <div className="no-messages">
            <p>No combat events yet - events will appear here during combat</p>
          </div>
        ) : (
          <>
            {notifications.map(renderCombatNotification)}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>


    </div>
  );
};

export default CombatTab;

