/**
 * GM Session Invitation Component
 * 
 * Premium beige Pathfinder-themed notification shown when GM with party joins a room.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import usePresenceStore from '../../store/presenceStore';

const GMSessionInvitation = ({ invitation }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isEntering, setIsEntering] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isExpiring, setIsExpiring] = useState(false);
  const timerRef = useRef(null);

  const acceptGMSessionInvitation = usePresenceStore(state => state.acceptGMSessionInvitation);
  const declineGMSessionInvitation = usePresenceStore(state => state.declineGMSessionInvitation);

  const ACCENT_COLOR = isExpiring ? '#a52a2a' : '#8b4513';
  const BG_GRADIENT = 'linear-gradient(160deg, #fdfaf0 0%, #f0e6cc 100%)';

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setIsEntering(false), 50);
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
            <i className="fas fa-dungeon"></i>
          </div>
          <div className="invite-title-block">
            <div className="invite-title">Session Invitation</div>
            <div className="invite-subtitle">
              A new adventure awaits
              <span className="room-type-tag">
                {invitation.isPermanent ? 'Permanent Room' : 'Temporary Room'}
              </span>
            </div>
          </div>
          <button onClick={handleDecline} className="invite-close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Divider */}
        <div className="invite-divider">
          <span className="divider-ornament">⚔</span>
        </div>

        {/* Middle Section: GM Info + Room Info */}
        <div className="invite-sender-card">
          <div className="sender-avatar-premium">
            <i className="fas fa-hat-wizard"></i>
          </div>
          <div className="sender-details-premium">
            <div className="sender-name-premium">{displayName}</div>
            <div className="sender-class-premium">
              <i className="fas fa-crown" style={{ color: '#8b4513', fontSize: '12px', marginRight: '6px' }}></i>
              {displayLevel ? `Level ${displayLevel} ` : ''}{displayClass}
            </div>
          </div>
          
          {/* Circular Timer - Positioned top-right of the card via CSS */}
          <div className="invite-timer-ring">
            <svg viewBox="0 0 60 60" className="timer-svg">
              <circle cx="30" cy="30" r={radius} fill="none" className="timer-track" strokeWidth="4" />
              <circle cx="30" cy="30" r={radius} fill="none" className="timer-progress" strokeWidth="4"
                stroke={ACCENT_COLOR}
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
            </svg>
            <span className={`timer-text ${isExpiring ? 'expiring' : ''}`}>{timeLeft}</span>
          </div>
        </div>

        {/* Room information Display */}
        <div className="room-name-display">
          <span className="room-name-label">Setting Out For</span>
          <span className="room-name-text">{invitation.partyName || invitation.roomName || displayPartyName}</span>
        </div>

        {/* Room Description (Dynamic) */}
        {(invitation.roomDescription || invitation.description) && (
          <div className="invite-room-desc">
            {invitation.roomDescription || invitation.description}
          </div>
        )}

        {/* Message */}
        <p className="invite-message">
          <strong>{displayName}</strong> is ready to begin.
        </p>

        {/* Current Players List (Dynamic) */}
        {invitation.currentPlayers && invitation.currentPlayers.length > 0 && (
          <div className="invite-players-list">
            <span className="invite-players-label">Adventurers within:</span>
            <div className="invite-players-pills">
              {invitation.currentPlayers.map(player => (
                <div key={player.id} className="invite-player-pill">
                  <i className="fas fa-user-shield"></i>
                  <span>{player.name}</span>
                  {player.class && <span className="player-class">[{player.class}]</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="invite-actions-premium">
          <button onClick={handleAccept} className="invite-btn invite-accept-btn">
            <i className="fas fa-door-open"></i> Join Session
          </button>
          <button onClick={handleDecline} className="invite-btn invite-decline-btn">
            Decline
          </button>
        </div>

        {/* Bottom accent line */}
        <div className="invite-accent-line" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_COLOR}, transparent)` }} />
      </div>
    );
};

export default GMSessionInvitation;
