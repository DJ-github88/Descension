import React from 'react';
import { formatTimestamp } from '../../utils/dateUtils';

const CombatNotification = ({ notification }) => {
  // Format the notification message based on type
  const renderNotificationContent = () => {
    const { type, source, target, damage, damageType, ability, critical } = notification;
    
    switch (type) {
      case 'damage_dealt':
        return (
          <>
            <div className="notification-icon combat-icon">
              <i className="fas fa-skull"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                <span className="source-name">{source}</span> dealt{' '}
                <span className={`damage-text ${damageType}`}>
                  {damage} {damageType}
                </span>{' '}
                damage to <span className="target-name">{target}</span>
                {critical && <span className="critical-text"> (Critical!)</span>}
                {ability && <span className="ability-text"> with {ability}</span>}
              </span>
            </div>
          </>
        );
        
      case 'damage_taken':
        return (
          <>
            <div className="notification-icon combat-icon damage-taken">
              <i className="fas fa-heart-broken"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                <span className="target-name">{target}</span> took{' '}
                <span className={`damage-text ${damageType}`}>
                  {damage} {damageType}
                </span>{' '}
                damage from <span className="source-name">{source}</span>
                {critical && <span className="critical-text"> (Critical!)</span>}
                {ability && <span className="ability-text"> from {ability}</span>}
              </span>
            </div>
          </>
        );
        
      case 'healing':
        return (
          <>
            <div className="notification-icon combat-icon healing">
              <i className="fas fa-heart"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                <span className="source-name">{source}</span> healed{' '}
                <span className="target-name">{target}</span> for{' '}
                <span className="healing-text">{notification.healing}</span>
                {critical && <span className="critical-text"> (Critical!)</span>}
                {ability && <span className="ability-text"> with {ability}</span>}
              </span>
            </div>
          </>
        );
        
      case 'combat_start':
        return (
          <>
            <div className="notification-icon combat-icon combat-start">
              <i className="fas fa-fist-raised"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                Combat started with <span className="target-name">{target}</span>
              </span>
            </div>
          </>
        );
        
      case 'combat_end':
        return (
          <>
            <div className="notification-icon combat-icon combat-end">
              <i className="fas fa-flag"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                Combat ended
                {notification.victory && <span className="victory-text"> (Victory!)</span>}
              </span>
            </div>
          </>
        );
        
      case 'death':
        return (
          <>
            <div className="notification-icon combat-icon death">
              <i className="fas fa-skull-crossbones"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                <span className="target-name">{target}</span> has died
              </span>
            </div>
          </>
        );
        
      default:
        return (
          <div className="notification-text">
            <span className="notification-message">{notification.message || 'Unknown combat event'}</span>
          </div>
        );
    }
  };

  return (
    <div className="chat-notification combat-notification">
      {renderNotificationContent()}
      <div className="notification-time">
        {formatTimestamp(notification.timestamp)}
      </div>
    </div>
  );
};

export default CombatNotification;
