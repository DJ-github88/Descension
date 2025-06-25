import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ItemTooltip from '../item-generation/ItemTooltip';
import { formatTimestamp } from '../../utils/dateUtils';

const LootNotification = ({ notification }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const notificationRef = useRef(null);
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
  const handleMouseEnter = (e) => {
    if (!notification.item) return;
    
    // Calculate position for tooltip
    const rect = notificationRef.current.getBoundingClientRect();
    const x = rect.right + 10;
    const y = rect.top;
    
    setTooltipPosition({ x, y });
    setShowTooltip(true);
  };

  // Handle mouse leave to hide tooltip
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Adjust tooltip position if it goes off screen
  useEffect(() => {
    if (showTooltip && tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let { x, y } = tooltipPosition;
      
      // Adjust horizontal position if needed
      if (x + tooltipRect.width > viewportWidth) {
        x = Math.max(0, viewportWidth - tooltipRect.width - 20);
      }
      
      // Adjust vertical position if needed
      if (y + tooltipRect.height > viewportHeight) {
        y = Math.max(0, viewportHeight - tooltipRect.height - 20);
      }
      
      if (x !== tooltipPosition.x || y !== tooltipPosition.y) {
        setTooltipPosition({ x, y });
      }
    }
  }, [showTooltip, tooltipPosition]);

  // Format the notification message based on type
  const renderNotificationContent = () => {
    const { type, item, quantity, source } = notification;
    
    switch (type) {
      case 'item_looted':
        return (
          <>
            <img 
              src={`https://wow.zamimg.com/images/wow/icons/large/${item.iconId || 'inv_misc_questionmark'}.jpg`} 
              alt={item.name} 
              className="notification-icon"
            />
            <div className="notification-text">
              <span className="notification-message">
                Looted: <span style={{ color: getQualityColor(item.quality) }}>{item.name}</span>
                {quantity > 1 ? ` x${quantity}` : ''}
              </span>
              <span className="notification-source">{source || 'from world'}</span>
            </div>
          </>
        );
        
      case 'item_dropped':
        return (
          <>
            <img 
              src={`https://wow.zamimg.com/images/wow/icons/large/${item.iconId || 'inv_misc_questionmark'}.jpg`} 
              alt={item.name} 
              className="notification-icon"
            />
            <div className="notification-text">
              <span className="notification-message">
                Dropped: <span style={{ color: getQualityColor(item.quality) }}>{item.name}</span>
                {quantity > 1 ? ` x${quantity}` : ''}
              </span>
            </div>
          </>
        );
        
      case 'currency_looted':
        const { gold, silver, copper } = notification;
        const iconId = gold > 0 ? 'inv_misc_coin_01' : 
                      silver > 0 ? 'inv_misc_coin_03' : 'inv_misc_coin_05';
        
        return (
          <>
            <img 
              src={`https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`} 
              alt="Currency" 
              className="notification-icon"
            />
            <div className="notification-text">
              <span className="notification-message">
                Received: {' '}
                {gold > 0 && <span className="gold">{gold}g </span>}
                {silver > 0 && <span className="silver">{silver}s </span>}
                {copper > 0 && <span className="copper">{copper}c</span>}
              </span>
              <span className="notification-source">{source || 'from world'}</span>
            </div>
          </>
        );
        
      default:
        return (
          <div className="notification-text">
            <span className="notification-message">{notification.message || 'Unknown notification'}</span>
          </div>
        );
    }
  };

  return (
    <>
      <div 
        className="chat-notification loot-notification"
        ref={notificationRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {renderNotificationContent()}
        <div className="notification-time">
          {formatTimestamp(notification.timestamp)}
        </div>
      </div>
      
      {/* Item Tooltip */}
      {showTooltip && notification.item && createPortal(
        <div
          ref={tooltipRef}
          className="item-tooltip-wrapper"
          style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        >
          <ItemTooltip item={notification.item} />
        </div>,
        document.body
      )}
    </>
  );
};

export default LootNotification;
