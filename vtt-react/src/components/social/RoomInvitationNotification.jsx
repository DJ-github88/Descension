/**
 * Room Invitation Notification Component
 * 
<<<<<<< HEAD
 * Premium beige Pathfinder-themed notification for room/session invitations.
=======
 * Premium fantasy-themed notification for room/session invitations.
 * Matches the PartyInviteNotification design language.
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f
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

<<<<<<< HEAD
  const ACCENT_COLOR = isExpiring ? '#a52a2a' : '#8b4513';
  // Removed BG_GRADIENT as it's now handled by CSS class


  // Entrance animation
  useEffect(() => {
    const enterTimer = setTimeout(() => setIsEntering(false), 50);
=======
  const timerProgress = (timeLeft / 60) * 100;

  // Entrance animation
  useEffect(() => {
    const enterTimer = setTimeout(() => setIsEntering(false), 600);
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f
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
<<<<<<< HEAD
  const timerProgress = (timeLeft / 60) * 100;
  const strokeDashoffset = circumference - (timerProgress / 100) * circumference;

    return (
      <div className={`room-invite-premium ${isEntering ? 'entering' : ''} ${isLeaving ? 'leaving' : ''} ${isExpiring ? 'expiring' : ''}`}>
        {/* Decorative corner flourishes */}
        <div className="invite-corner invite-corner-tl">✦</div>
        <div className="invite-corner invite-corner-tr">✦</div>
        <div className="invite-corner invite-corner-bl">✦</div>
        <div className="invite-corner invite-corner-br">✦</div>

        {/* Header */}
        <div className="invite-premium-header">
          <div className="invite-seal">
            <div className="seal-glow"></div>
            <i className="fas fa-scroll"></i>
          </div>
          <div className="invite-title-block">
            <div className="invite-title">Room Invitation</div>
            <div className="invite-subtitle">Join a new world</div>
          </div>
          <button onClick={handleDecline} className="invite-close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Divider */}
        <div className="invite-divider">
          <span className="divider-ornament">⚔</span>
        </div>

        {/* GM Info */}
        <div className="invite-sender-card">
          <div className="sender-avatar-premium">
            <i className="fas fa-hat-wizard"></i>
          </div>
          <div className="sender-details-premium">
            <div className="sender-name-premium">{invitation.gmName}</div>
            <div className="sender-class-premium">
              <i className="fas fa-crown" style={{ color: '#8b4513', fontSize: '10px', marginRight: '4px' }}></i>
              Game Master
            </div>
          </div>
          
          {/* Circular Timer */}
          <div className="invite-timer-ring">
            <svg viewBox="0 0 50 50" className="timer-svg">
              <circle cx="25" cy="25" r={radius} fill="none" className="timer-track" strokeWidth="3" />
              <circle cx="25" cy="25" r={radius} fill="none" className="timer-progress" strokeWidth="3"
                stroke={ACCENT_COLOR}
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
            </svg>
            <span className={`timer-text ${isExpiring ? 'expiring' : ''}`}>{timeLeft}</span>
          </div>
        </div>

        {/* Room information */}
        <div className="room-name-display">
          <i className="fas fa-dungeon"></i>
          <span>{invitation.roomName}</span>
        </div>

        {/* Message */}
        <p className="invite-message">
          <strong>{invitation.gmName}</strong> beckons you to join their campaign.
        </p>

        {/* Actions */}
        <div className="invite-actions-premium">
          <button onClick={handleAccept} className="invite-btn invite-accept-btn">
            <i className="fas fa-door-open"></i> Join Room
          </button>
          <button onClick={handleDecline} className="invite-btn invite-decline-btn">
            Decline
          </button>
        </div>

        {/* Bottom accent line */}
        <div className="invite-accent-line" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_COLOR}, transparent)` }} />
      </div>
    );
=======
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
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f
};

export default RoomInvitationNotification;
