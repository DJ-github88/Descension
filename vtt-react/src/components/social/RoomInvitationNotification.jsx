/**
 * Room Invitation Notification Component
 * 
 * Toast-style notification for room invitations.
 * Appears in the bottom-right corner with accept/decline buttons.
 */

import React, { useState, useEffect } from 'react';
import usePresenceStore from '../../store/presenceStore';

const RoomInvitationNotification = ({ invitation }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpiring, setIsExpiring] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const respondToInvite = usePresenceStore((state) => state.respondToInvite);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((invitation.expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 10) {
        setIsExpiring(true);
      }

      if (remaining <= 0) {
        handleDecline();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [invitation.expiresAt]);

  // Handle accept
  const handleAccept = () => {
    respondToInvite(invitation.id, true, invitation.roomId);
    setIsVisible(false);
  };

  // Handle decline
  const handleDecline = () => {
    respondToInvite(invitation.id, false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`room-invitation-notification ${isExpiring ? 'expiring' : ''}`}>
      <div className="invitation-header">
        <i className="fas fa-envelope"></i>
        <span>Room Invitation</span>
        <button
          className="close-notification"
          onClick={handleDecline}
          title="Decline"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="invitation-content">
        <p className="invitation-from">
          <strong>{invitation.gmName}</strong> has invited you to join:
        </p>
        <p className="invitation-room">
          <i className="fas fa-dungeon"></i>
          {invitation.roomName}
        </p>
      </div>

      <div className="invitation-timer">
        <i className="fas fa-clock"></i>
        <span>Expires in {timeLeft}s</span>
      </div>

      <div className="invitation-actions">
        <button
          className="accept-button"
          onClick={handleAccept}
        >
          <i className="fas fa-check"></i>
          Accept
        </button>
        <button
          className="decline-button"
          onClick={handleDecline}
        >
          <i className="fas fa-times"></i>
          Decline
        </button>
      </div>
    </div>
  );
};

export default RoomInvitationNotification;

