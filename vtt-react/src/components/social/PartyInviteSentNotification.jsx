/**
 * Party Invite Sent Notification
 * 
 * Shown to the SENDER after dispatching a party invitation.
 * Displays a countdown and auto-dismisses or shows accept/decline outcome.
 */

import React, { useState, useEffect, useRef } from 'react';

const PartyInviteSentNotification = ({ invite, onDismiss }) => {
    const [isEntering, setIsEntering] = useState(true);
    const [isLeaving, setIsLeaving] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isExpiring, setIsExpiring] = useState(false);
    const timerRef = useRef(null);

    // Entrance animation
    useEffect(() => {
        const t = setTimeout(() => setIsEntering(false), 400);
        return () => clearTimeout(t);
    }, []);

    // Auto-dismiss when outcome is known
    useEffect(() => {
        if (invite.outcome) {
            const t = setTimeout(() => dismiss(), 4000);
            return () => clearTimeout(t);
        }
    }, [invite.outcome]);

    // Countdown (only while pending)
    useEffect(() => {
        if (invite.outcome) return; // Already resolved

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    dismiss();
                    return 0;
                }
                if (prev <= 11) setIsExpiring(true);
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [invite.outcome]);

    const dismiss = () => {
        setIsLeaving(true);
        setTimeout(() => onDismiss(invite.id), 350);
    };

    // SVG timer ring
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - ((timeLeft / 60) * circumference);

    const outcomeClass = invite.outcome === 'accepted' ? 'outcome-accepted'
        : invite.outcome === 'declined' ? 'outcome-declined'
            : '';

    return (
        <div className={`party-invite-sent-toast ${isEntering ? 'entering' : ''} ${isLeaving ? 'leaving' : ''} ${outcomeClass}`}>
            <div className="invite-sent-icon">
                {invite.outcome === 'accepted'
                    ? <i className="fas fa-check-circle" style={{ color: '#4caf50' }}></i>
                    : invite.outcome === 'declined'
                        ? <i className="fas fa-times-circle" style={{ color: '#c04040' }}></i>
                        : <i className="fas fa-paper-plane" style={{ color: '#c9a83f' }}></i>
                }
            </div>
            <div className="invite-sent-body">
                <span className="invite-sent-title">
                    {invite.outcome === 'accepted'
                        ? `${invite.targetName} joined the party!`
                        : invite.outcome === 'declined'
                            ? `${invite.targetName} declined.`
                            : `Invite sent to ${invite.targetName}`
                    }
                </span>
                {!invite.outcome && (
                    <span className="invite-sent-sub">Awaiting response…</span>
                )}
            </div>

            {/* Mini timer ring (only while pending) */}
            {!invite.outcome && (
                <div className={`invite-sent-timer ${isExpiring ? 'expiring' : ''}`}>
                    <svg viewBox="0 0 40 40" width="34" height="34" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="3" />
                        <circle
                            cx="20" cy="20" r={radius}
                            fill="none"
                            stroke={isExpiring ? '#a52a2a' : '#c9a83f'}
                            strokeWidth="3"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 1s linear' }}
                        />
                    </svg>
                    <span className="invite-sent-timer-text">{timeLeft}</span>
                </div>
            )}

            <button className="invite-sent-close" onClick={dismiss} title="Dismiss">
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
};

export default PartyInviteSentNotification;
