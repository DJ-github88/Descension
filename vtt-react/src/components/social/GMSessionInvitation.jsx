/**
 * GM Session Invitation Component
 *
 * Premium fantasy-themed notification shown when GM with party joins a room.
 * Uses the same design language as PartyInviteNotification.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import usePresenceStore from '../../store/presenceStore';

const CLASS_COLOR = '#c9a83f'; // GM gold

const GMSessionInvitation = ({ invitation }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isEntering, setIsEntering] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isExpiring, setIsExpiring] = useState(false);
  const timerRef = useRef(null);

  const acceptGMSessionInvitation = usePresenceStore(state => state.acceptGMSessionInvitation);
  const declineGMSessionInvitation = usePresenceStore(state => state.declineGMSessionInvitation);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setIsEntering(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        if (prev <= 11) setIsExpiring(true);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Auto-decline when timer expires
  useEffect(() => {
    if (timeLeft === 0 && isVisible) handleDismiss(false);
  }, [timeLeft]);

  const handleDismiss = useCallback((accepted) => {
    setIsLeaving(true);
    setTimeout(() => {
      if (accepted) {
        acceptGMSessionInvitation();
      } else {
        declineGMSessionInvitation();
      }
      setIsVisible(false);
    }, 400);
  }, [acceptGMSessionInvitation, declineGMSessionInvitation]);

  const handleAccept = () => handleDismiss(true);
  const handleDecline = () => handleDismiss(false);

  if (!isVisible) return null;

  // Get display info
  const displayName = invitation.gmName || invitation.senderName || 'Game Master';
  const displayClass = invitation.gmClass || invitation.senderClass || 'GM';
  const displayLevel = invitation.gmLevel || invitation.senderLevel || '';
  const displayPartyName = invitation.partyName || invitation.roomName || 'Game Session';

  // SVG timer ring values
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const timerProgress = (timeLeft / 60) * 100;
  const strokeDashoffset = circumference - (timerProgress / 100) * circumference;

  return (
    <div className={`party-invite-premium gm-session-premium ${isEntering ? 'entering' : ''} ${isLeaving ? 'leaving' : ''} ${isExpiring ? 'expiring' : ''}`}>
      {/* Decorative corner flourishes */}
      <div className="invite-corner invite-corner-tl">✦</div>
      <div className="invite-corner invite-corner-tr">✦</div>
      <div className="invite-corner invite-corner-bl">✦</div>
      <div className="invite-corner invite-corner-br">✦</div>

      {/* Glowing top accent line */}
      <div className="invite-accent-line" style={{ background: `linear-gradient(90deg, transparent, ${CLASS_COLOR}, transparent)` }} />

      {/* Header */}
      <div className="invite-premium-header">
        <div className="invite-seal" style={{ '--seal-color': CLASS_COLOR }}>
          <i className="fas fa-dungeon"></i>
          <div className="seal-glow" />
        </div>
        <div className="invite-title-block">
          <span className="invite-title">Session Invitation</span>
          <span className="invite-subtitle">A new adventure awaits</span>
        </div>
        <button className="invite-close-btn" onClick={handleDecline} title="Decline">
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Divider */}
      <div className="invite-divider">
        <span className="divider-ornament">⚔</span>
      </div>

      {/* GM Info */}
      <div className="invite-sender-card">
        <div className="sender-avatar-premium" style={{ borderColor: CLASS_COLOR }}>
          <i className="fas fa-hat-wizard"></i>
          <div className="avatar-class-ring" style={{ borderColor: CLASS_COLOR }} />
        </div>
        <div className="sender-details-premium" style={{ flex: 1 }}>
          <span className="sender-name-premium" style={{ color: CLASS_COLOR }}>{displayName}</span>
          <span className="sender-class-premium">
            <i className="fas fa-crown" style={{ color: CLASS_COLOR, marginRight: '4px', fontSize: '0.65rem' }}></i>
            {displayLevel ? `Level ${displayLevel} ` : ''}{displayClass}
          </span>
        </div>

        {/* Circular Timer */}
        <div className={`invite-timer-ring ${isExpiring ? 'expiring' : ''}`}>
          <svg viewBox="0 0 50 50" className="timer-svg">
            <circle className="timer-track" cx="25" cy="25" r={radius} fill="none" strokeWidth="3" />
            <circle
              className="timer-progress"
              cx="25" cy="25" r={radius}
              fill="none" strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ stroke: isExpiring ? '#a52a2a' : CLASS_COLOR }}
            />
          </svg>
          <span className={`timer-text ${isExpiring ? 'expiring' : ''}`}>{timeLeft}</span>
        </div>
      </div>

      {/* Party/Room Name */}
      <div className="room-name-display">
        <i className="fas fa-scroll"></i>
        <span>{displayPartyName}</span>
      </div>

      {/* Message */}
      <p className="invite-message">
        <strong>{displayName}</strong> beckons you to join their campaign.
      </p>

      {/* Action Buttons */}
      <div className="invite-actions-premium">
        <button className="invite-btn invite-accept-btn" onClick={handleAccept} style={{ '--btn-color': CLASS_COLOR }}>
          <i className="fas fa-door-open"></i>
          <span>Join Session</span>
        </button>
        <button className="invite-btn invite-decline-btn" onClick={handleDecline}>
          <i className="fas fa-ban"></i>
          <span>Decline</span>
        </button>
      </div>
    </div>
  );
};

export default GMSessionInvitation;
