/**
 * Loot Tab Component
 * 
 * Displays loot notifications (items and currency looted)
 * Migrated from ChatWindow loot functionality
 */

import React, { useState, useRef, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
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

  // Calculate tooltip position based on mouse coordinates
  const calculateTooltipPosition = (e) => {
    // Get mouse coordinates - React synthetic events have clientX/clientY directly
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const tooltipWidth = 300;
    const tooltipHeight = 400;
    const offset = 12; // Small offset from cursor
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Default: position to bottom-right of cursor
    let x = mouseX + offset;
    let y = mouseY + offset;

    // Only adjust if tooltip would actually be cut off (not just close to edge)
    // Check right edge - only flip if it would go off screen
    if (x + tooltipWidth > windowWidth) {
      // Position to the left of cursor instead
      x = mouseX - tooltipWidth - offset;
      // Only clamp if it's still off screen
      if (x < 0) {
        x = 0;
      }
    }

    // Check bottom edge - only flip if it would go off screen
    if (y + tooltipHeight > windowHeight) {
      // Position above cursor instead
      y = mouseY - tooltipHeight - offset;
      // Only clamp if it's still off screen
      if (y < 0) {
        y = 0;
      }
    }

    return { x, y };
  };

  // Handle mouse enter to show tooltip
  const handleItemMouseEnter = (e, item) => {
    if (!item) return;
    setTooltipPosition(calculateTooltipPosition(e));
    setTooltipItem(item);
  };

  // Handle mouse move to update tooltip position
  const handleItemMouseMove = (e) => {
    if (tooltipItem) {
      setTooltipPosition(calculateTooltipPosition(e));
    }
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
          onMouseMove={handleItemMouseMove}
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
          {createPortal(
            <div
              style={{
                position: 'fixed',
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                zIndex: 99999,
                pointerEvents: 'none',
                transform: 'none' // Ensure no transform is applied
              }}
            >
              <ItemTooltip
                item={{
                  ...tooltipItem,
                  quality: tooltipItem.quality || tooltipItem.rarity || 'common',
                  baseStats: tooltipItem.baseStats || {}
                }}
              />
            </div>,
            document.body
          )}
        </Suspense>
      )}
    </div>
  );
};

export default LootTab;

