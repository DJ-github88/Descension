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

    const outcomeColor = invite.outcome === 'accepted' ? '#4caf50'
        : invite.outcome === 'declined' || invite.outcome === 'failed' ? '#a52a2a'
            : '#8b4513';

    const BG_GRADIENT = 'linear-gradient(160deg, #fdfaf0 0%, #f0e6cc 100%)';
    const ACCENT_COLOR = isExpiring && !invite.outcome ? '#a52a2a' : outcomeColor;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            background: BG_GRADIENT,
            border: `2px solid ${ACCENT_COLOR}`,
            borderRadius: '10px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.7)',
            minWidth: '280px',
            position: 'relative',
            opacity: isEntering || isLeaving ? 0 : 1,
            transform: isEntering ? 'translateX(20px)' : (isLeaving ? 'scale(0.95) opacity(0)' : 'translateX(0)'),
            transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            fontFamily: "'Cinzel', 'Bookman Old Style', serif",
            pointerEvents: 'auto',
            marginBottom: '8px'
        }}>
            {/* Corner Flourish */}
            <div style={{ position: 'absolute', top: '4px', left: '6px', color: '#c9a070', opacity: 0.5, fontSize: '10px' }}>✦</div>

            <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${ACCENT_COLOR}, #5a1e12)`,
                border: '1px solid #d4af37',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '14px', flexShrink: 0,
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
                {invite.outcome === 'accepted'
                    ? <i className="fas fa-check"></i>
                    : (invite.outcome === 'declined' || invite.outcome === 'failed')
                        ? <i className="fas fa-times"></i>
                        : <i className="fas fa-paper-plane"></i>
                }
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{
                    fontSize: '13px', fontWeight: 'bold', color: '#5a1e12',
                    lineHeight: '1.2'
                }}>
                    {invite.outcome === 'accepted'
                        ? `${invite.targetName} joined!`
                        : invite.outcome === 'declined'
                            ? `${invite.targetName} declined.`
                            : invite.outcome === 'failed'
                                ? `Failed: ${invite.error || 'User busy'}`
                                : `Invite: ${invite.targetName}`
                    }
                </span>
                {!invite.outcome && (
                    <span style={{ fontSize: '10px', color: '#9a6040', fontStyle: 'italic' }}>Awaiting response…</span>
                )}
            </div>

            {/* Mini timer ring (only while pending) */}
            {!invite.outcome && (
                <div style={{ position: 'relative', width: '34px', height: '34px', flexShrink: 0 }}>
                    <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <circle cx="20" cy="20" r={radius} fill="none" stroke="#d4b896" strokeWidth="2.5" opacity="0.3" />
                        <circle cx="20" cy="20" r={radius} fill="none" stroke={ACCENT_COLOR} strokeWidth="2.5"
                            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 1s linear' }} />
                    </svg>
                    <span style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', fontWeight: 'bold', color: isExpiring ? '#a52a2a' : '#5a1e12'
                    }}>{timeLeft}</span>
                </div>
            )}

            <button
                onClick={dismiss}
                style={{
                    background: 'none', border: 'none', color: '#8b4513',
                    fontSize: '14px', cursor: 'pointer', padding: '2px', opacity: 0.6,
                    transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
            >
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
};


export default PartyInviteSentNotification;
