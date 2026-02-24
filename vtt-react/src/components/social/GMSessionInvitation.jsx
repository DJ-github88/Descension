/**
 * GM Session Invitation Component
 *
 * Toast-style notification shown when GM with party joins a room.
 * Appears in SocialNotificationLayer (bottom-right corner).
 * Offers accept/decline buttons with countdown timer.
 */

import React, { useState, useEffect, useCallback } from 'react';
import usePresenceStore from '../../store/presenceStore';

const GMSessionInvitation = ({ invitation }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isExpiring, setIsExpiring] = useState(false);

  const acceptGMSessionInvitation = usePresenceStore(state => state.acceptGMSessionInvitation);
  const declineGMSessionInvitation = usePresenceStore(state => state.declineGMSessionInvitation);

  const handleAccept = useCallback(() => {
    console.log('✅ Accepting GM session invitation:', invitation.partyName || invitation.gmName);
    acceptGMSessionInvitation();
  }, [acceptGMSessionInvitation, invitation]);

  const handleDecline = useCallback(() => {
    console.log('❌ Declining GM session invitation:', invitation.partyName || invitation.gmName);
    declineGMSessionInvitation();
  }, [declineGMSessionInvitation, invitation]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTimeLeft = prev - 1;

        if (newTimeLeft <= 10 && newTimeLeft > 0) {
          setIsExpiring(true);
        }

        if (newTimeLeft <= 0) {
          clearInterval(timer);
          handleDecline();
          return 0;
        }

        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleDecline]);

  // Get display name - support both old and new invitation formats
  const displayName = invitation.gmName || invitation.senderName || 'Game Master';
  const displayClass = invitation.gmClass || invitation.senderClass || 'GM';
  const displayLevel = invitation.gmLevel || invitation.senderLevel || '?';
  const displayPartyName = invitation.partyName || 'Game Session';

  return (
    <div className={`gm-session-invitation-container ${isExpiring ? 'expiring' : ''}`}>
      {/* Close button */}
      <button
        className="close-invitation-btn"
        onClick={handleDecline}
        title="Decline"
      >
        <i className="fas fa-times"></i>
      </button>

      {/* Header */}
      <div className="invitation-header">
        <i className="fas fa-dungeon"></i>
        <span>Session Invitation</span>
      </div>

      {/* Content */}
      <div className="invitation-content">
        <p className="invitation-from">
          <strong>{displayName}</strong> has started a session:
        </p>
        <div className="invitation-room">
          <i className="fas fa-users-cog"></i>
          {displayPartyName}
        </div>

        <div className="sender-preview">
          <div className="sender-avatar">
            <i className="fas fa-crown"></i>
          </div>
          <div className="sender-info">
            <span className="sender-name">{displayName}</span>
            <span className="sender-details">Level {displayLevel} {displayClass}</span>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="invitation-timer">
        <i className="fas fa-clock"></i>
        <span>Expires in {timeLeft}s</span>
      </div>

      {/* Timer Bar */}
      <div className="timer-bar-container">
        <div
          className="timer-bar"
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        />
      </div>

      {/* Actions */}
      <div className="invitation-actions">
        <button
          className="accept-button"
          onClick={handleAccept}
        >
          <i className="fas fa-check"></i>
          Join Session
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

export default GMSessionInvitation;
