/**
 * Game Session Invitation Component
 *
 * Popup notification for game session invitations from GMs.
 * Appears when a GM launches a game session.
 */

import React, { useState, useEffect } from 'react';
import './styles/GameSessionInvitation.css';

const GameSessionInvitation = ({ invitation, onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpiring, setIsExpiring] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds for game session invites

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, timeLeft - 1);
      setTimeLeft(remaining);

      if (remaining <= 10) {
        setIsExpiring(true);
      }

      if (remaining <= 0) {
        handleDecline();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Handle accept
  const handleAccept = () => {
    // Show immediate feedback
    setIsVisible(false);

    // Call the accept handler
    onAccept && onAccept(invitation);
  };

  // Handle decline
  const handleDecline = () => {
    onDecline && onDecline(invitation);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`game-session-invitation-overlay ${isExpiring ? 'expiring' : ''}`}>
      {/* Add pulsing background for attention */}
      <div className="invitation-pulse-background"></div>
      <div className="game-session-invitation-modal">
        <div className="invitation-header">
          <i className="fas fa-play-circle"></i>
          <span>Game Session Started!</span>
          <button
            className="close-invitation"
            onClick={handleDecline}
            title="Decline"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="invitation-content">
          <p className="invitation-from">
            <strong>{invitation.gmName}</strong> has launched a game session!
          </p>
          <p className="invitation-room">
            <i className="fas fa-dungeon"></i>
            {invitation.roomName}
          </p>
          <p className="invitation-message">
            The game is about to begin. Would you like to join?
          </p>
        </div>

        <div className="invitation-timer">
          <i className="fas fa-clock"></i>
          <span>Auto-decline in {timeLeft}s</span>
        </div>

        <div className="invitation-actions">
          <button
            className="accept-session-button"
            onClick={handleAccept}
          >
            <i className="fas fa-play"></i>
            Join Game Session
          </button>
          <button
            className="decline-session-button"
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

export default GameSessionInvitation;
