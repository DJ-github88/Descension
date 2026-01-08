/**
 * Combat Tab Component
 * 
 * Displays combat notifications (hits, heals, misses, crits, etc.)
 * Migrated from ChatWindow combat functionality
 */

import React, { useRef } from 'react';
import useChatStore from '../../store/chatStore';
import { DICE_TYPES } from '../../store/diceStore';

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

    // Handle dice rolls
    if (type === 'dice_roll') {
      // Group dice results by type to show format like "1d6 (4) 1d20 (2) 1d10 (5) = 11"
      const formatDiceResults = () => {
        if (!notification.diceResults || notification.diceResults.length === 0) {
          return '';
        }

        // Group results by die type
        const groupedByType = {};
        notification.diceResults.forEach(result => {
          // Ensure we have a valid result with type and value
          if (result && result.type && result.value !== undefined) {
            if (!groupedByType[result.type]) {
              groupedByType[result.type] = [];
            }
            groupedByType[result.type].push(result.value);
          }
        });

        // Format as "1d6 (4) 1d20 (2) 1d10 (5)" - all in one line
        const formattedParts = Object.entries(groupedByType)
          .sort(([typeA], [typeB]) => {
            // Sort by die type (d4, d6, d8, d10, d12, d20, d100)
            const order = { d4: 1, d6: 2, d8: 3, d10: 4, d12: 5, d20: 6, d100: 7 };
            return (order[typeA] || 99) - (order[typeB] || 99);
          })
          .map(([dieType, values]) => {
            const count = values.length;
            const valuesStr = values.map(v => `(${v})`).join(' ');
            return `${count}${dieType} ${valuesStr}`;
          });

        return formattedParts.join(' ');
      };

      return (
        <div key={notification.id} className="chat-message dice-roll-message">
          <div className="message-header">
            <span className="sender-name">{notification.sender || 'Player'}</span>
            <span className="timestamp">{formatTimestamp(timestamp)}</span>
          </div>
          <div className="message-content">
            <span className="dice-roll-display">
              {formatDiceResults()} = {notification.total || 0}
            </span>
          </div>
        </div>
      );
    }

    // Handle card draws
    if (type === 'card_draw') {
      return (
        <div key={notification.id} className="chat-message card-draw-message">
          <div className="message-header">
            <span className="sender-name">{notification.sender || 'Player'}</span>
            <span className="timestamp">{formatTimestamp(timestamp)}</span>
          </div>
          <div className="message-content">
            Drew {notification.drawCount} card{notification.drawCount > 1 ? 's' : ''}: {notification.cards}
          </div>
        </div>
      );
    }

    // Handle coin flips
    if (type === 'coin_flip') {
      return (
        <div key={notification.id} className="chat-message coin-flip-message">
          <div className="message-header">
            <span className="sender-name">{notification.sender || 'Player'}</span>
            <span className="timestamp">{formatTimestamp(timestamp)}</span>
          </div>
          <div className="message-content">
            Flipped {notification.flipCount} coin{notification.flipCount > 1 ? 's' : ''}: {notification.results}
            {' '}
            ({notification.headsCount} Heads, {notification.tailsCount} Tails)
          </div>
        </div>
      );
    }

    switch (type) {
      case 'combat_hit':
        // Check if this is a resource change with custom message
        if (notification.customMessage) {
          return (
            <div key={notification.id} className="chat-message combat-message hit">
              <div className="message-header">
                <span className="sender-name">{notification.attacker}</span>
                <span className="timestamp">{formatTimestamp(timestamp)}</span>
              </div>
              <div className="message-content">
                {notification.customMessage}
              </div>
            </div>
          );
        }
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
        // Check if this is a resource change with custom message
        if (notification.customMessage) {
          return (
            <div key={notification.id} className="chat-message combat-message heal">
              <div className="message-header">
                <span className="sender-name">{notification.healer}</span>
                <span className="timestamp">{formatTimestamp(timestamp)}</span>
              </div>
              <div className="message-content">
                {notification.customMessage}
              </div>
            </div>
          );
        }
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

      case 'combat_resource':
        // Generic resource change notification (XP, level, etc.)
        return (
          <div key={notification.id} className="chat-message combat-message resource">
            <div className="message-header">
              <span className="sender-name">{notification.attacker || 'GM'}</span>
              <span className="timestamp">{formatTimestamp(timestamp)}</span>
            </div>
            <div className="message-content">
              {notification.message || notification.customMessage || `${notification.target} ${notification.isPositive ? 'gained' : 'lost'} ${notification.amount} ${notification.resourceType}`}
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

