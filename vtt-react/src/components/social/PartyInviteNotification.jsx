/**
 * Party Invitation Notification Component
 * 
<<<<<<< HEAD
 * Premium beige Pathfinder-themed notification for party invitations.
 * Features class-specific accent colors and ornamental flourishes.
=======
 * Premium fantasy-themed notification for party invitations.
 * Features animated entrance, glowing seal, timer ring, and polished actions.
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f
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
<<<<<<< HEAD
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const timerProgress = (timeLeft / 60) * 100;
    const strokeDashoffset = circumference - (timerProgress / 100) * circumference;

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
<<<<<<< HEAD
    }, [timeLeft, isVisible]);
=======
    }, [timeLeft]);
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f

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

<<<<<<< HEAD
    return (
        <div className={`party-invite-premium ${isEntering ? 'entering' : ''} ${isLeaving ? 'leaving' : ''} ${isExpiring ? 'expiring' : ''}`}>
            {/* Corner flourishes handled by CSS background/outline usually, but keeping symbols for extra flavor */}
=======
    // SVG timer ring values
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (timerProgress / 100) * circumference;

    return (
        <div className={`party-invite-premium ${isEntering ? 'entering' : ''} ${isLeaving ? 'leaving' : ''} ${isExpiring ? 'expiring' : ''}`}>
            {/* Decorative corner flourishes */}
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f
            <div className="invite-corner invite-corner-tl">✦</div>
            <div className="invite-corner invite-corner-tr">✦</div>
            <div className="invite-corner invite-corner-bl">✦</div>
            <div className="invite-corner invite-corner-br">✦</div>

<<<<<<< HEAD
            {/* Header */}
            <div className="invite-premium-header">
                <div className="invite-seal">
                    <div className="seal-glow"></div>
                    <i className="fas fa-users"></i>
                </div>
                <div className="invite-title-block">
                    <div className="invite-title">Party Invitation</div>
                    <div className="invite-subtitle">A fellowship awaits</div>
                </div>
                <button onClick={handleDecline} className="invite-close-btn">
=======
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
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {/* Divider */}
            <div className="invite-divider">
                <span className="divider-ornament">⚔</span>
            </div>

<<<<<<< HEAD
            {/* Sender Info */}
            <div className="invite-sender-card">
                <div className="sender-avatar-premium" style={{ borderColor: classColor }}>
                    <i className="fas fa-user-shield"></i>
                    <div className="avatar-class-ring" style={{ borderColor: classColor }}></div>
                </div>
                <div className="sender-details-premium">
                    <div className="sender-name-premium" style={{ color: classColor }}>{invitation.senderName}</div>
                    <div className="sender-class-premium">
                        Level {invitation.senderLevel} {invitation.senderClass}
                    </div>
                </div>
                
                {/* Circular Timer */}
                <div className="invite-timer-ring">
                    <svg viewBox="0 0 50 50" className="timer-svg">
                        <circle cx="25" cy="25" r={radius} fill="none" className="timer-track" strokeWidth="3" />
                        <circle cx="25" cy="25" r={radius} fill="none" className="timer-progress" strokeWidth="3"
                            stroke={ACCENT_COLOR}
                            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
=======
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
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f
                    </svg>
                    <span className={`timer-text ${isExpiring ? 'expiring' : ''}`}>{timeLeft}</span>
                </div>
            </div>

            {/* Message */}
            <p className="invite-message">
<<<<<<< HEAD
                <strong>{invitation.senderName}</strong> seeks your companion for a grand adventure.
            </p>

            {/* Actions */}
            <div className="invite-actions-premium">
                <button onClick={handleAccept} className="invite-btn invite-accept-btn">
                    <i className="fas fa-handshake"></i> Accept Summons
                </button>
                <button onClick={handleDecline} className="invite-btn invite-decline-btn">
                    Decline
                </button>
            </div>

            {/* Bottom accent line */}
            <div className="invite-accent-line" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_COLOR}, transparent)` }} />
=======
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
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f
        </div>
    );
};

export default PartyInviteNotification;
