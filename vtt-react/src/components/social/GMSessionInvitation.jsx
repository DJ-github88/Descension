/**
 * GM Session Invitation Component
 *
 * Toast-style notification shown when GM with party joins a room.
 * Appears in SocialNotificationLayer (bottom-right corner).
 * Offers accept/decline buttons with countdown timer.
 */

import React, { useState, useEffect } from 'react';
import usePresenceStore from '../../store/presenceStore';

const GMSessionInvitation = ({ invitation }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [isExpiring, setIsExpiring] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = timeLeft - 1;

      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        // Timer expired
        setIsExpiring(true);
        clearInterval(timer);
        handleDecline();
      } else if (newTimeLeft <= 11 && !isExpiring) {
        setIsExpiring(true);
      } else {
        setIsExpiring(false);
      }

      if (newTimeLeft <= 0) {
        clearInterval(timer);
        handleDecline();
        return;
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [invitation, isVisible, timeLeft, isExpiring, setIsVisible, setTimeLeft, setIsExpiring]);

  const handleAccept = () => {
    console.log('✅ Accepting GM session invitation:', invitation.partyName);
    socket.emit('respond_to_room_invitation', {
      invitationId: invitation.id,
      roomId: invitation.roomId,
      accepted: true
    });

    // Remove from pending
    set(state => ({
      gmSessionInvitation: null
    }));

    // Clear state
    setIsVisible(false);
    setTimeLeft(60);
    setIsExpiring(false);
  };

  const handleDecline = () => {
    console.log('❌ Declining GM session invitation:', invitation.partyName);
    socket.emit('respond_to_room_invitation', {
      invitationId: invitation.id,
      roomId: invitation.roomId,
      accepted: false
    });

    // Remove from pending
    set(state => ({
      gmSessionInvitation: null
    }));

    // Clear state
    setIsVisible(false);
  };

  // Close handler
  const handleClose = () => {
    setIsVisible(false);
  };

  // Countdown timer effect
  useEffect(() => {
    // Clean up timer on unmount
    return () => clearInterval(timer);
  }, []);

  // UI
  return (
    <div className={`gm-session-invitation gm-session-invitation-${isExpiring ? 'expiring' : ''}`}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        transform: `translate(${windowScale})`,
        zIndex: 1200
      }}>
      {/* Close button */}
      <button
        className="close-invitation-btn"
        onClick={handleClose}
      >
        <i className="fas fa-times"></i>
      </button>

      {/* Countdown display */}
      <div className={`gm-session-invitation countdown-wrapper ${isExpiring ? 'expiring' : 'normal'}`}>
        {isExpiring && (
          <p className="expiring-warning">
            <i className="fas fa-exclamation-triangle"></i>
            Warning: Your GM session invitation will expire in {timeLeft} seconds!
          </p>
        )}

        <div className={`invitation-timer ${isExpiring ? 'expiring' : 'normal'}`}>
          {isExpiring && (
            <>
              <i className="fas fa-clock"></i>
              <span>{timeLeft}s</span>
            </>
          )}
        </div>
      </div>

      {/* Icon */}
      <div className={`invitation-icon ${isExpiring ? 'expiring' : 'normal'}`}>
        <i className="fas fa-user-shield"></i>
      </div>

      {/* Content */}
      <div className="invitation-content">
        <div className="invitation-header">
          <div className="invitation-title">
            Session Invitation
          </div>
        </div>

        <p className="invitation-from">
          <strong>{invitation.senderName}</strong>
        </p>

        <div className="invitation-details">
          <div className="sender-preview">
            <div className="sender-avatar">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="sender-info">
              <span className="sender-name">{invitation.senderName}</span>
              <span className="sender-details">Level {invitation.senderLevel} {invitation.senderClass}</span>
            </div>
          </div>
        </div>

        <div className="invitation-message">
          {invitation.partyName && <p>They want to start a session with you in <strong>"{invitation.partyName}"</strong> session.</p>}
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
    </div>
  );
};

export default GMSessionInvitation;
