import React, { useEffect, useState } from 'react';
import './Notification.css';

const Notification = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  action,
  persistent = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);

    // Auto-hide if not persistent
    if (!persistent && duration > 0) {
      const hideTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [duration, persistent]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match CSS transition duration
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
      default:
        return 'fas fa-info-circle';
    }
  };

  const notificationClasses = [
    'notification',
    `notification-${type}`,
    isVisible && 'notification-visible',
    isExiting && 'notification-exiting'
  ].filter(Boolean).join(' ');

  return (
    <div className={notificationClasses}>
      <div className="notification-icon">
        <i className={getIcon()}></i>
      </div>

      <div className="notification-content">
        {title && <div className="notification-title">{title}</div>}
        {message && <div className="notification-message">{message}</div>}

        {action && (
          <div className="notification-action">
            <button
              className="notification-action-btn"
              onClick={() => {
                action.onClick();
                if (!persistent) handleClose();
              }}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>

      <button
        className="notification-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Notification;
