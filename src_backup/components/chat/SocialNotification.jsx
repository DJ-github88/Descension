import React from 'react';
import { formatTimestamp } from '../../utils/dateUtils';

const SocialNotification = ({ notification }) => {
  // Format the notification message based on type
  const renderNotificationContent = () => {
    const { type, sender, receiver, message, quest } = notification;
    
    switch (type) {
      case 'whisper':
        return (
          <>
            <div className="notification-icon social-icon whisper">
              <i className="fas fa-comment"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                <span className="sender-name">{sender}</span> whispers: {message}
              </span>
            </div>
          </>
        );
        
      case 'friend_request':
        return (
          <>
            <div className="notification-icon social-icon friend">
              <i className="fas fa-user-plus"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                <span className="sender-name">{sender}</span> has sent you a friend request
              </span>
            </div>
          </>
        );
        
      case 'friend_added':
        return (
          <>
            <div className="notification-icon social-icon friend">
              <i className="fas fa-user-check"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                <span className="sender-name">{sender}</span> is now your friend
              </span>
            </div>
          </>
        );
        
      case 'group_invite':
        return (
          <>
            <div className="notification-icon social-icon group">
              <i className="fas fa-users"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                <span className="sender-name">{sender}</span> has invited you to a group
              </span>
            </div>
          </>
        );
        
      case 'quest_accepted':
        return (
          <>
            <div className="notification-icon social-icon quest">
              <i className="fas fa-scroll"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                Quest accepted: <span className="quest-name">{quest?.title || 'Unknown Quest'}</span>
              </span>
            </div>
          </>
        );
        
      case 'quest_completed':
        return (
          <>
            <div className="notification-icon social-icon quest-complete">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                Quest completed: <span className="quest-name">{quest?.title || 'Unknown Quest'}</span>
              </span>
            </div>
          </>
        );
        
      case 'quest_failed':
        return (
          <>
            <div className="notification-icon social-icon quest-failed">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                Quest failed: <span className="quest-name">{quest?.title || 'Unknown Quest'}</span>
              </span>
            </div>
          </>
        );
        
      case 'quest_abandoned':
        return (
          <>
            <div className="notification-icon social-icon quest-abandoned">
              <i className="fas fa-trash-alt"></i>
            </div>
            <div className="notification-text">
              <span className="notification-message">
                Quest abandoned: <span className="quest-name">{quest?.title || 'Unknown Quest'}</span>
              </span>
            </div>
          </>
        );
        
      default:
        return (
          <div className="notification-text">
            <span className="notification-message">{notification.message || 'Unknown social event'}</span>
          </div>
        );
    }
  };

  return (
    <div className="chat-notification social-notification">
      {renderNotificationContent()}
      <div className="notification-time">
        {formatTimestamp(notification.timestamp)}
      </div>
    </div>
  );
};

export default SocialNotification;
