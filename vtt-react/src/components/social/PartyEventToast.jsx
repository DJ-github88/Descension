/**
 * Party Event Toast
 * 
 * Small auto-dismissing toast for party events:
 * - Member joined / left
 * - Invite accepted / declined (for the inviter)
 */

import React, { useState, useEffect } from 'react';

const ICONS = {
<<<<<<< HEAD
    joined: { icon: 'fas fa-user-plus', color: '#386641', label: 'joined the party' },
    left: { icon: 'fas fa-sign-out-alt', color: '#a52a2a', label: 'left the party' },
    accepted: { icon: 'fas fa-check-circle', color: '#2d7a2d', label: 'accepted your invite' },
    declined: { icon: 'fas fa-times-circle', color: '#7a3b2e', label: 'declined your invite' },
    disbanded: { icon: 'fas fa-skull', color: '#8b4513', label: 'The party was disbanded' },
    you_joined: { icon: 'fas fa-door-open', color: '#386641', label: '' },
    you_declined: { icon: 'fas fa-times-circle', color: '#a52a2a', label: '' },
    invite_failed: { icon: 'fas fa-exclamation-circle', color: '#a52a2a', label: 'Invite failed' },
    invitation_sent: { icon: 'fas fa-paper-plane', color: '#8b7355', label: 'Invitation sent' },
=======
    joined: { icon: 'fas fa-user-plus', color: '#4caf50', label: 'joined the party' },
    left: { icon: 'fas fa-sign-out-alt', color: '#e57373', label: 'left the party' },
    accepted: { icon: 'fas fa-check-circle', color: '#4caf50', label: 'accepted your invite' },
    declined: { icon: 'fas fa-times-circle', color: '#e57373', label: 'declined your invite' },
    disbanded: { icon: 'fas fa-skull', color: '#c9a83f', label: 'The party was disbanded' },
    you_joined: { icon: 'fas fa-door-open', color: '#4caf50', label: '' },
    you_declined: { icon: 'fas fa-times-circle', color: '#e57373', label: '' },
    invite_failed: { icon: 'fas fa-exclamation-circle', color: '#e57373', label: 'Invite failed' },
    invitation_sent: { icon: 'fas fa-paper-plane', color: '#c9a83f', label: 'Invitation sent' },
>>>>>>> bd5273a9fb2fcf21d8c4c7a173e770f43d9ff19f
};

const PartyEventToast = ({ event, onDismiss }) => {
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            setIsLeaving(true);
            setTimeout(() => onDismiss(event.id), 400);
        }, 5000);
        return () => clearTimeout(t);
    }, [event.id, onDismiss]);

    const meta = ICONS[event.type] || ICONS.joined;

    return (
        <div className={`party-event-toast ${isLeaving ? 'leaving' : 'entering'}`}>
            <i className={meta.icon} style={{ color: meta.color, fontSize: '1rem', flexShrink: 0 }}></i>
            <span className="party-event-text">
                {event.message ? <strong>{event.message}</strong> : (
                    event.type === 'disbanded'
                        ? meta.label
                        : event.type === 'you_joined'
                            ? event.partyName
                                ? <>You joined <strong>{event.partyName}</strong></>
                                : <><strong>You joined the party!</strong></>
                            : event.type === 'you_declined'
                                ? <><strong>You declined</strong> the party invitation</>
                                : <><strong>{event.memberName}</strong> {meta.label}</>
                )}
            </span>
            <button className="party-event-close" onClick={() => { setIsLeaving(true); setTimeout(() => onDismiss(event.id), 400); }}>
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
};

export default PartyEventToast;
