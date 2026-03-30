/**
 * Game Session Invitation Component
 *
 * Beige Pathfinder-themed popup for game session invitations from GMs.
 */

import React, { useState, useEffect } from 'react';

const GameSessionInvitation = ({ invitation, onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isEntering, setIsEntering] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isExpiring, setIsExpiring] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsEntering(false), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 10) setIsExpiring(true);
        if (next <= 0) { handleDecline(); return 0; }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = () => {
    setIsVisible(false);
    onAccept && onAccept(invitation);
  };

  const handleDecline = () => {
    setIsVisible(false);
    onDecline && onDecline(invitation);
  };

  if (!isVisible) return null;

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((timeLeft / 30) * circumference);
  const accentColor = isExpiring ? '#a52a2a' : '#8b4513';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.65)',
      zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Cinzel', 'Bookman Old Style', serif",
      opacity: isEntering ? 0 : 1,
      transition: 'opacity 0.3s ease',
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #fdfaf0 0%, #f0e6cc 100%)',
        border: `3px solid ${accentColor}`,
        borderRadius: '14px',
        width: '420px',
        maxWidth: '90vw',
        boxShadow: '0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.7)',
        position: 'relative',
        overflow: 'hidden',
        transform: isEntering ? 'scale(0.9) translateY(-16px)' : 'scale(1) translateY(0)',
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s',
        animation: 'none'
      }}>
        {/* Gradient top accent */}
        <div style={{ height: '4px', background: `linear-gradient(to right, transparent, ${accentColor}, #d4af37, ${accentColor}, transparent)` }} />

        {/* Corner ornaments */}
        <div style={{ position: 'absolute', top: 12, left: 16, color: '#c9a070', opacity: 0.65, fontSize: '15px', pointerEvents: 'none' }}>✦</div>
        <div style={{ position: 'absolute', top: 12, right: 16, color: '#c9a070', opacity: 0.65, fontSize: '15px', pointerEvents: 'none' }}>✦</div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Seal icon */}
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b4513, #654321)',
              border: '2px solid #d4af37',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#d4af37', fontSize: '18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              <i className="fas fa-dungeon"></i>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#5a1e12', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Session Invitation
              </div>
              <div style={{ fontSize: '11px', color: '#9a6040', fontStyle: 'italic' }}>A new adventure awaits</div>
            </div>
          </div>
          <button onClick={handleDecline} style={{
            background: 'none', border: 'none', color: '#8b4513',
            fontSize: '16px', cursor: 'pointer', padding: '4px 8px',
            borderRadius: '4px', transition: 'background 0.2s'
          }} title="Dismiss">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Ornamental divider */}
        <div style={{ textAlign: 'center', color: '#c9a070', fontSize: '13px', letterSpacing: '6px', margin: '0 22px 16px', borderTop: '1px solid #d4b896', paddingTop: '10px' }}>
          ⚔ ✦ ⚔
        </div>

        {/* GM info + timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0 22px 16px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b4513, #5a1e12)',
            border: '2px solid #d4af37',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#d4af37', fontSize: '22px', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
          }}>
            <i className="fas fa-hat-wizard"></i>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#5a1e12' }}>{invitation.gmName}</div>
            <div style={{ fontSize: '12px', color: '#8b4513', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="fas fa-crown" style={{ color: '#d4af37', fontSize: '10px' }}></i>
              Game Master
            </div>
          </div>
          {/* Circular timer */}
          <div style={{ position: 'relative', width: '50px', height: '50px' }}>
            <svg viewBox="0 0 50 50" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="25" cy="25" r={radius} fill="none" stroke="#d4b896" strokeWidth="3" />
              <circle cx="25" cy="25" r={radius} fill="none" stroke={isExpiring ? '#a52a2a' : '#8b4513'} strokeWidth="3"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }} />
            </svg>
            <span style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 'bold', color: isExpiring ? '#a52a2a' : '#5a1e12'
            }}>{timeLeft}</span>
          </div>
        </div>

        {/* Room name */}
        <div style={{
          margin: '0 22px 12px', padding: '10px 14px',
          background: 'rgba(139,69,19,0.06)', border: '1px solid #d4b896', borderRadius: '8px',
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '14px', color: '#5a1e12', fontWeight: 'bold'
        }}>
          <i className="fas fa-scroll" style={{ color: '#8b4513' }}></i>
          {invitation.roomName || 'Game Session'}
        </div>

        {/* Message */}
        <p style={{ margin: '0 22px 20px', fontSize: '13px', fontStyle: 'italic', color: '#9a6040', textAlign: 'center', lineHeight: '1.5' }}>
          <strong style={{ color: '#5a1e12' }}>{invitation.gmName}</strong> beckons you to join their campaign.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', padding: '0 22px 22px' }}>
          <button onClick={handleAccept} style={{
            flex: 1, padding: '13px 16px',
            background: 'linear-gradient(to bottom, #4a8b3a, #2d6b22)',
            border: '2px solid #1e4d18', borderRadius: '8px',
            color: '#fff', fontSize: '14px', fontWeight: 'bold',
            fontFamily: "'Cinzel', serif", cursor: 'pointer',
            boxShadow: '0 3px 8px rgba(0,0,0,0.25)', textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'transform 0.15s ease'
          }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
             onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <i className="fas fa-door-open"></i> Join Session
          </button>
          <button onClick={handleDecline} style={{
            flex: 1, padding: '13px 16px',
            background: 'linear-gradient(to bottom, #fdfaf0, #e8dcc0)',
            border: '2px solid #8b4513', borderRadius: '8px',
            color: '#5a1e12', fontSize: '14px', fontWeight: 'bold',
            fontFamily: "'Cinzel', serif", cursor: 'pointer',
            boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'transform 0.15s ease'
          }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
             onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <i className="fas fa-ban"></i> Decline
          </button>
        </div>

        {/* Bottom gradient border */}
        <div style={{ height: '3px', background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }} />
      </div>
    </div>
  );
};

export default GameSessionInvitation;
