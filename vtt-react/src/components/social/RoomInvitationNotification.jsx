/**
 * Room Invitation Notification Component
 * 
 * Premium fantasy-themed notification for room/session invitations.
 * Matches the PartyInviteNotification design language.
 */

import React, { useState, useEffect, useRef } from 'react';
import usePresenceStore from '../../store/presenceStore';

const RoomInvitationNotification = ({ invitation }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isEntering, setIsEntering] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isExpiring, setIsExpiring] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);

  const respondToInvite = usePresenceStore((state) => state.respondToInvite);

  const timerProgress = (timeLeft / 60) * 100;

  // Entrance animation
  useEffect(() => {
    const enterTimer = setTimeout(() => setIsEntering(false), 600);
    return () => clearTimeout(enterTimer);
  }, []);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.floor((invitation.expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 10) {
        setIsExpiring(true);
      }

      if (remaining <= 0) {
        handleDismiss(false);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [invitation.expiresAt]);

  const handleDismiss = (accepted) => {
    setIsLeaving(true);
    setTimeout(() => {
      if (accepted) {
        respondToInvite(invitation.id, true, invitation.roomId);
      } else {
        respondToInvite(invitation.id, false);
      }
      setIsVisible(false);
    }, 400);
  };

  const handleAccept = () => handleDismiss(true);
  const handleDecline = () => handleDismiss(false);

  if (!isVisible) return null;

  // SVG timer ring values
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timerProgress / 100) * circumference;

  return (
    <div className={`room-invite-premium ${isEntering ? 'entering' : ''} ${isLeaving ? 'leaving' : ''} ${isExpiring ? 'expiring' : ''}`}>
      {/* Decorative corner flourishes */}
      <div className="invite-corner invite-corner-tl">✦</div>
      <div className="invite-corner invite-corner-tr">✦</div>
      <div className="invite-corner invite-corner-bl">✦</div>
      <div className="invite-corner invite-corner-br">✦</div>

      {/* Glowing top accent line */}
      <div className="invite-accent-line" style={{ background: 'linear-gradient(90deg, transparent, #c9a83f, transparent)' }} />

      {/* Header */}
      <div className="invite-premium-header">
        <div className="invite-seal" style={{ '--seal-color': '#c9a83f' }}>
          <i className="fas fa-dungeon"></i>
          <div className="seal-glow" />
        </div>
        <div className="invite-title-block">
          <span className="invite-title">Room Invitation</span>
          <span className="invite-subtitle">A new adventure awaits</span>
        </div>
        <button
          className="invite-close-btn"
          onClick={handleDecline}
          title="Decline"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Divider */}
      <div className="invite-divider">
        <span className="divider-ornament">⚔</span>
      </div>

      {/* GM Info */}
      <div className="invite-sender-card">
        <div className="sender-avatar-premium" style={{ borderColor: '#c9a83f' }}>
          <i className="fas fa-hat-wizard"></i>
          <div className="avatar-class-ring" style={{ borderColor: '#c9a83f' }} />
        </div>
        <div className="sender-details-premium" style={{ flex: 1 }}>
          <span className="sender-name-premium" style={{ color: '#c9a83f' }}>
            {invitation.gmName}
          </span>
          <span className="sender-class-premium">
            <i className="fas fa-crown" style={{ color: '#c9a83f', marginRight: '4px', fontSize: '0.65rem' }}></i>
            Game Master
          </span>
        </div>

        {/* Circular Timer */}
        <div className={`invite-timer-ring ${isExpiring ? 'expiring' : ''}`}>
          <svg viewBox="0 0 50 50" className="timer-svg">
            <circle
              className="timer-track"
              cx="25" cy="25" r={radius}
              fill="none"
              strokeWidth="3"
            />
            <circle
              className="timer-progress"
              cx="25" cy="25" r={radius}
              fill="none"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ stroke: isExpiring ? '#a52a2a' : '#c9a83f' }}
            />
          </svg>
          <span className={`timer-text ${isExpiring ? 'expiring' : ''}`}>{timeLeft}</span>
        </div>
      </div>

      {/* Room Name */}
      <div className="room-name-display">
        <i className="fas fa-scroll"></i>
        <span>{invitation.roomName}</span>
      </div>

      {/* Message */}
      <p className="invite-message">
        <strong>{invitation.gmName}</strong> beckons you to join their campaign.
      </p>

      {/* Action Buttons */}
      <div className="invite-actions-premium">
        <button
          className="invite-btn invite-accept-btn"
          onClick={handleAccept}
          style={{ '--btn-color': '#c9a83f' }}
        >
          <i className="fas fa-door-open"></i>
          <span>Enter</span>
        </button>
        <button
          className="invite-btn invite-decline-btn"
          onClick={handleDecline}
        >
          <i className="fas fa-ban"></i>
          <span>Decline</span>
        </button>
      </div>
    </div>
  );
};

export default RoomInvitationNotification;
