/**
 * Party Invitation Notification Component
 * 
 * Premium fantasy-themed notification for party invitations.
 * Features animated entrance, glowing seal, timer ring, and polished actions.
 */

import React, { useState, useEffect, useRef } from 'react';
import usePresenceStore from '../../store/presenceStore';

// Class color mapping for accent theming
const CLASS_COLORS = {
    warrior: '#c41e3a',
    paladin: '#f58cba',
    ranger: '#abd473',
    rogue: '#fff569',
    mage: '#69ccf0',
    warlock: '#9482c9',
    cleric: '#f0ebe0',
    druid: '#ff7d0a',
    bard: '#00ff98',
    monk: '#00ff96',
    default: '#d4af37'
};

const getClassColor = (className) => {
    if (!className) return CLASS_COLORS.default;
    return CLASS_COLORS[className.toLowerCase()] || CLASS_COLORS.default;
};

const PartyInviteNotification = ({ invitation }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isEntering, setIsEntering] = useState(true);
    const [isLeaving, setIsLeaving] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isExpiring, setIsExpiring] = useState(false);
    const timerRef = useRef(null);

    const respondToPartyInvite = usePresenceStore((state) => state.respondToPartyInvite);

    const classColor = getClassColor(invitation.senderClass);
    const timerProgress = (timeLeft / 60) * 100;

    // Entrance animation
    useEffect(() => {
        const enterTimer = setTimeout(() => setIsEntering(false), 600);
        return () => clearTimeout(enterTimer);
    }, []);

    // Countdown timer
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                if (prev <= 11) {
                    setIsExpiring(true);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, []);

    // Auto-decline when timer expires
    useEffect(() => {
        if (timeLeft === 0 && isVisible) {
            handleDismiss(false);
        }
    }, [timeLeft]);

    const handleDismiss = (accepted) => {
        setIsLeaving(true);
        setTimeout(() => {
            respondToPartyInvite(invitation.id, accepted);
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
        <div className={`party-invite-premium ${isEntering ? 'entering' : ''} ${isLeaving ? 'leaving' : ''} ${isExpiring ? 'expiring' : ''}`}>
            {/* Decorative corner flourishes */}
            <div className="invite-corner invite-corner-tl">✦</div>
            <div className="invite-corner invite-corner-tr">✦</div>
            <div className="invite-corner invite-corner-bl">✦</div>
            <div className="invite-corner invite-corner-br">✦</div>

            {/* Glowing top accent line */}
            <div className="invite-accent-line" style={{ background: `linear-gradient(90deg, transparent, ${classColor}, transparent)` }} />

            {/* Header */}
            <div className="invite-premium-header">
                <div className="invite-seal" style={{ '--seal-color': classColor }}>
                    <i className="fas fa-scroll"></i>
                    <div className="seal-glow" />
                </div>
                <div className="invite-title-block">
                    <span className="invite-title">Party Invitation</span>
                    <span className="invite-subtitle">A summons awaits your answer</span>
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

            {/* Sender Card */}
            <div className="invite-sender-card">
                <div className="sender-avatar-premium" style={{ borderColor: classColor }}>
                    <i className="fas fa-user-shield"></i>
                    <div className="avatar-class-ring" style={{ borderColor: classColor }} />
                </div>
                <div className="sender-details-premium">
                    <span className="sender-name-premium" style={{ color: classColor }}>
                        {invitation.senderName}
                    </span>
                    <span className="sender-class-premium">
                        <i className="fas fa-shield-alt" style={{ color: classColor, marginRight: '4px', fontSize: '0.65rem' }}></i>
                        Level {invitation.senderLevel} {invitation.senderClass}
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
                            style={{ stroke: isExpiring ? '#a52a2a' : classColor }}
                        />
                    </svg>
                    <span className={`timer-text ${isExpiring ? 'expiring' : ''}`}>{timeLeft}</span>
                </div>
            </div>

            {/* Message */}
            <p className="invite-message">
                <strong>{invitation.senderName}</strong> seeks your blade. Will you join their party?
            </p>

            {/* Action Buttons */}
            <div className="invite-actions-premium">
                <button
                    className="invite-btn invite-accept-btn"
                    onClick={handleAccept}
                    style={{ '--btn-color': classColor }}
                >
                    <i className="fas fa-handshake"></i>
                    <span>Accept</span>
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

export default PartyInviteNotification;
