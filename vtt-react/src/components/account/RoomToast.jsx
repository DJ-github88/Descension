import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './styles/RoomToast.css';

const RoomToast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);

    // Auto-hide after duration
    if (duration > 0) {
      const hideTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
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

  const toastClasses = [
    'room-toast',
    `room-toast-${type}`,
    isVisible && 'room-toast-visible',
    isExiting && 'room-toast-exiting'
  ].filter(Boolean).join(' ');

  return createPortal(
    <div className={toastClasses}>
      <div className="room-toast-icon">
        <i className={getIcon()}></i>
      </div>
      <div className="room-toast-message">{message}</div>
      <button className="room-toast-close" onClick={handleClose} aria-label="Close">
        <i className="fas fa-times"></i>
      </button>
    </div>,
    document.body
  );
};

export default RoomToast;

