/**
 * Loot Tab Component
 * 
 * Displays loot notifications (items and currency looted)
 * Migrated from ChatWindow loot functionality
 */

import React, { useState, useRef, lazy, Suspense } from 'react';
import useChatStore from '../../store/chatStore';

// Lazy load the ItemTooltip component
const ItemTooltip = lazy(() => import('../item-generation/ItemTooltip'));

// Helper function to format timestamps
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Get quality color for styling
const getQualityColor = (quality) => {
  const qualityColors = {
    poor: '#9d9d9d',
    common: '#2d1f0f',  // Dark brown for visibility on white background
    uncommon: '#1eff00',
    rare: '#0070dd',
    epic: '#a335ee',
    legendary: '#ff8000',
    artifact: '#e6cc80'
  };
  return qualityColors[quality?.toLowerCase()] || qualityColors.common;
};

const LootTab = () => {
  const notifications = useChatStore((state) => state.notifications?.loot || []);
  const clearNotifications = useChatStore((state) => state.clearNotifications);
  const messagesEndRef = useRef(null);

  // State for item tooltip
  const [tooltipItem, setTooltipItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Handle mouse enter to show tooltip
  const handleItemMouseEnter = (e, item) => {
    if (!item) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const windowWidth = window.innerWidth;

    // Position tooltip above the item
    let x = rect.left + (rect.width / 2) - 150;
    let y = rect.top - 420;

    // Ensure tooltip doesn't go off screen
    const tooltipWidth = 300;
    if (x < 10) x = 10;
    if (x + tooltipWidth > windowWidth - 10) x = windowWidth - tooltipWidth - 10;

    if (y < 10) {
      y = rect.bottom + 10;
    }

    setTooltipPosition({ x, y });
    setTooltipItem(item);
  };

  // Handle mouse leave to hide tooltip
  const handleItemMouseLeave = () => {
    setTooltipItem(null);
  };

  // Render loot notification
  const renderLootNotification = (notification) => {
    const { type, timestamp } = notification;

    if (type === 'item_looted') {
      const quality = notification.item.quality || 'common';
      const qualityColor = getQualityColor(quality);

      return (
        <div
          key={notification.id}
          className="chat-message loot-message"
          data-item-quality={quality.toLowerCase()}
          onMouseEnter={(e) => handleItemMouseEnter(e, notification.item)}
          onMouseLeave={handleItemMouseLeave}
        >
          <div className="message-header">
            <span className="sender-name">{notification.looter || 'Player'}</span>
            <span className="timestamp">{formatTimestamp(timestamp)}</span>
          </div>
          <div className="message-content">
            <span style={{
              color: qualityColor,
              fontWeight: '700',
              textShadow: quality === 'common' ? '0 0 1px rgba(0,0,0,0.5)' : 'none'
            }}>
              {notification.item.name}
            </span>
            {notification.quantity > 1 && (
              <span style={{ color: '#666', fontWeight: '600' }}> x{notification.quantity}</span>
            )}
            {notification.source && (
              <span style={{ color: '#777', fontStyle: 'italic' }}> from {notification.source}</span>
            )}
          </div>
        </div>
      );
    }

    if (type === 'currency_looted') {
      const formatCurrencyText = () => {
        const parts = [];

        if (notification.platinum > 0) {
          parts.push(`${notification.platinum}p`);
        }
        if (notification.gold > 0) {
          parts.push(`${notification.gold}g`);
        }
        if (notification.silver > 0) {
          parts.push(`${notification.silver}s`);
        }
        if (notification.copper > 0) {
          parts.push(`${notification.copper}c`);
        }

        return parts.join(' ');
      };

      return (
        <div
          key={notification.id}
          className="chat-message loot-message currency-loot"
          data-item-quality="currency"
        >
          <div className="message-header">
            <span className="sender-name">{notification.looter || 'Player'}</span>
            <span className="timestamp">{formatTimestamp(timestamp)}</span>
          </div>
          <div className="message-content">
            <span style={{ color: '#d4af37', fontWeight: '700', textShadow: '0 0 1px rgba(0,0,0,0.3)' }}>
              {formatCurrencyText()}
            </span>
            {notification.source && (
              <span style={{ color: '#777', fontStyle: 'italic' }}> from {notification.source}</span>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="loot-tab-content">
      {/* Loot Messages Area */}
      <div className="chat-messages">
        {notifications.length === 0 ? (
          <div className="no-messages">
            <p>No loot yet - items will appear here when looted</p>
          </div>
        ) : (
          <>
            {notifications.map(renderLootNotification)}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>



      {/* Item Tooltip */}
      {tooltipItem && (
        <Suspense fallback={null}>
          <div
            style={{
              position: 'fixed',
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              zIndex: 99999,
              pointerEvents: 'none'
            }}
          >
            <ItemTooltip
              item={{
                ...tooltipItem,
                quality: tooltipItem.quality || tooltipItem.rarity || 'common',
                baseStats: tooltipItem.baseStats || {}
              }}
            />
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default LootTab;

